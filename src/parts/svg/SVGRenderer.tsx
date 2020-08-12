import React, { useRef } from 'react'
import { useEffect, useState } from 'react'
import roughjs from 'roughjs/bundled/rough.esm'
import { RoughSVG } from 'roughjs/bin/svg'
import { Point } from 'roughjs/bin/geometry'
import { Options } from 'roughjs/bin/core'
import { StrokeStyle, FillStyle, RoughStyle } from 'model'
import { Rect, Transform } from 'model/core'
import { parsePath, normalize, absolutize } from 'path-data-parser'
import { TARGET_DATA_ATTRIBUTE } from 'parts/constants'
import { TargetData } from 'model/target'

type Props = {
    elementId: string
    source: string
    stroke: StrokeStyle
    fill: FillStyle
    rough: RoughStyle
    transform?: Transform
}

const styledElementsArray = [
    'circle',
    'ellipse',
    'line',
    'path',
    'polygon',
    'polyline',
    'rect',
]

const scalePath = (path: string, scaleX: number, scaleY: number) => {
    const segments = normalize(absolutize(parsePath(path)))
    for (const segment of segments) {
        const data = segment.data
        if (segment.key === 'A') {
            throw new Error('Scaling arcs within svgs is not implemented')
        }
        for (let i = 0; i < segment.data.length; i += 2) {
            data[i] *= scaleX
        }
        for (let i = 1; i < segment.data.length; i += 2) {
            data[i] *= scaleY
        }
    }
    const dataToString = (data: number[]) => {
        let parts: string[] = []
        for (let i = 0; i < data.length - 1; i += 2) {
            const part = `${data[i]}, ${data[i + 1]}`
            parts.push(part)
        }
        return parts.join(' ')
    }
    return segments
        .map((segment) => `${segment.key} ${dataToString(segment.data)}`)
        .join(' ')
}

const styledElements = new Set(styledElementsArray)

type Styles = {
    stroke: StrokeStyle
    fill: FillStyle
    rough: RoughStyle
}

const styleToRoughOptions = ({ stroke, fill, rough }: Styles): Options => ({
    stroke: stroke.color,
    fill: fill.color,
    strokeWidth: stroke.width,
    roughness: rough.roughness,
    seed: rough.seed,
    fillStyle: rough.fillKind,
})

const roughRenderers: any = {
    circle: (
        element: SVGCircleElement,
        roughContext: RoughSVG,
        options: Options,
        scaleX: number,
        scaleY: number
    ) => {
        const cx = scaleX * element.cx.baseVal.value
        const cy = scaleY * element.cy.baseVal.value
        const dx = scaleX * element.r.baseVal.value * 2
        const dy = scaleY * element.r.baseVal.value * 2
        return roughContext.ellipse(cx, cy, dx, dy, options)
    },
    ellipse: (
        element: SVGEllipseElement,
        roughContext: RoughSVG,
        options: Options,
        scaleX: number,
        scaleY: number
    ) => {
        const cx = scaleX * element.cx.baseVal.value
        const cy = scaleY * element.cy.baseVal.value
        const dx = scaleX * element.rx.baseVal.value * 2
        const dy = scaleY * element.ry.baseVal.value * 2
        return roughContext.ellipse(cx, cy, dx, dy, options)
    },
    rect: (
        element: SVGRectElement,
        roughContext: RoughSVG,
        options: Options,
        scaleX: number,
        scaleY: number
    ) => {
        const x = scaleX * element.x.baseVal.value
        const y = scaleY * element.y.baseVal.value
        const width = scaleX * element.width.baseVal.value
        const height = scaleY * element.height.baseVal.value
        return roughContext.rectangle(x, y, width, height, options)
    },
    path: (
        element: SVGPathElement,
        roughContext: RoughSVG,
        options: Options,
        scaleX: number,
        scaleY: number
    ) => {
        const path = element.getAttribute('d') ?? ''
        const scaledPath = scalePath(path, scaleX, scaleY)
        return roughContext.path(scaledPath, options)
    },
    line: (
        element: SVGLineElement,
        roughContext: RoughSVG,
        options: Options,
        scaleX: number,
        scaleY: number
    ) => {
        const x1 = scaleX * element.x1.baseVal.value
        const y1 = scaleY * element.y1.baseVal.value
        const x2 = scaleX * element.x2.baseVal.value
        const y2 = scaleY * element.y2.baseVal.value
        return roughContext.line(x1, y1, x2, y2, options)
    },
    polygon: (
        element: SVGPolygonElement,
        roughContext: RoughSVG,
        options: Options,
        scaleX: number,
        scaleY: number
    ) => {
        const points: Point[] = []
        for (let i = 0; i < element.points.length; i++) {
            const point = element.points.getItem(i)
            points.push([point.x * scaleX, point.y * scaleY])
        }
        return roughContext.polygon(points, options)
    },
    polyline: (
        element: SVGPolylineElement,
        roughContext: RoughSVG,
        options: Options,
        scaleX: number,
        scaleY: number
    ) => {
        const points: Point[] = []
        for (let i = 0; i < element.points.length; i++) {
            const point = element.points.getItem(i)
            points.push([point.x * scaleX, point.y * scaleY])
        }
        return roughContext.linearPath(points, options)
    },
}

const applyVectorEffect = (
    element: SVGElement,
    style: Styles,
    targetData: string
) => {
    if (styledElements.has(element.tagName)) {
        element.setAttribute('vector-effect', 'non-scaling-stroke')
        element.dataset[TARGET_DATA_ATTRIBUTE] = targetData
    }
    if (element.children && element.children.length) {
        for (let i = 0; i < element.children.length; i++) {
            const child = element.children.item(i)
            if (child) {
                applyVectorEffect(child as SVGElement, style, targetData)
            }
        }
    }
}

const applyStyles = (
    element: SVGElement,
    targetData: string,
    style: Styles,
    roughContext: RoughSVG | null,
    options: Options | null,
    scaleX: number,
    scaleY: number
) => {
    let copy: SVGElement
    if (styledElements.has(element.tagName)) {
        if (roughContext) {
            const renderer = roughRenderers[element.tagName] as any
            copy = renderer(element, roughContext, options, scaleX, scaleY)
            applyVectorEffect(copy, style, targetData)
            /*
                    Assume always contains two paths, first fill and second stroke
                  */
            copy.children
                .item(0)
                ?.setAttribute('stroke-opacity', style.fill.opacity.toString())
            copy.children
                .item(1)
                ?.setAttribute(
                    'stroke-opacity',
                    style.stroke.opacity.toString()
                )

            const hitArea = element.cloneNode() as SVGElement
            hitArea.dataset[TARGET_DATA_ATTRIBUTE] = targetData
            hitArea.setAttribute('fill', 'transparent')
            hitArea.setAttribute('stroke', 'transparent')
            hitArea.setAttribute('stroke-width', style.stroke.width.toString())
            hitArea.setAttribute('transform', `scale(${scaleX} ${scaleY})`)
            copy.append(hitArea)
        } else {
            copy = element.cloneNode() as SVGElement
            copy.setAttribute('fill', style.fill.color)
            copy.setAttribute('stroke', style.stroke.color)
            copy.setAttribute('stroke-width', style.stroke.width.toString())
            copy.setAttribute('vector-effect', 'non-scaling-stroke')
            copy.setAttribute('stroke-opacity', style.stroke.opacity.toString())
            copy.setAttribute('fill-opacity', style.fill.opacity.toString())
            copy.dataset[TARGET_DATA_ATTRIBUTE] = targetData
        }
    } else {
        copy = element.cloneNode() as SVGElement
    }
    if (element.children && element.children.length) {
        for (let i = 0; i < element.children.length; i++) {
            const childCopy = applyStyles(
                element.children.item(i) as SVGElement,
                targetData,
                style,
                roughContext,
                options,
                scaleX,
                scaleY
            )
            copy.appendChild(childCopy)
        }
    }
    return copy
}

const applyStylesRoot = (
    element: SVGSVGElement,
    elementId: string,
    style: Styles,
    rect?: Rect
): SVGElement => {
    const copy: SVGGElement = element.cloneNode() as SVGSVGElement
    let roughContext: RoughSVG | null = null
    let options: Options | null = null
    let scaleX = 1
    let scaleY = 1
    if (style.rough.roughness > 0) {
        roughContext = roughjs.svg(copy)
        options = styleToRoughOptions(style)
        const width = element.width.baseVal.value
        const height = element.height.baseVal.value
        if (rect) {
            scaleX = rect.width / width
            scaleY = rect.height / height
        }
    }
    if (element.children && element.children.length) {
        for (let i = 0; i < element.children.length; i++) {
            const childCopy = applyStyles(
                element.children.item(i) as SVGElement,
                elementId,
                style,
                roughContext,
                options,
                scaleX,
                scaleY
            )
            copy.appendChild(childCopy)
        }
    }
    return copy
}

const copyAttributes = (from: Element, to: Element) => {
    for (let i = 0; i < to.children.length; i++) {
        to.children.item(i)?.remove()
    }
    to.append(...from.children)
}

export const SVGRenderer: React.FunctionComponent<Props> = ({
    elementId,
    source,
    stroke,
    fill,
    rough,
    transform,
}: Props) => {
    const [sourceContent, setSourceContent] = useState<SVGSVGElement | null>(
        null
    )
    const contentRef = useRef<SVGGElement>(null)
    useEffect(() => {
        const loadSvg = async () => {
            try {
                const response = await fetch(source)
                const svgStr = await response.text()
                const parser = new DOMParser()
                const element = parser.parseFromString(svgStr, 'image/svg+xml')
                setSourceContent(element.children[0] as SVGSVGElement)
            } catch (e) {
                // TODO
                console.log('e')
                console.log('Add error handling')
                setSourceContent(null)
            }
        }
        loadSvg()
    }, [source])
    useEffect(() => {
        if (!contentRef.current) {
            return
        }
        if (sourceContent) {
            const targetData: TargetData = { type: 'shape', id: elementId }
            const content = applyStylesRoot(
                sourceContent,
                JSON.stringify(targetData),
                {
                    stroke,
                    fill,
                    rough,
                },
                transform
            )
            copyAttributes(content, contentRef.current)
        } else {
            contentRef.current?.childNodes.forEach((node) => node.remove())
        }
    }, [sourceContent, elementId, stroke, fill, rough, transform])

    useEffect(() => {
        if (transform && contentRef.current && sourceContent) {
            if (rough.roughness === 0) {
                const width = sourceContent.width.baseVal.value
                const height = sourceContent.height.baseVal.value
                const scaleX = transform.width / width
                const scaleY = transform.height / height
                const transformAttribute = `translate(${transform.x}, ${transform.y}) scale(${scaleX} ${scaleY}) rotate(${transform.rotation})`
                contentRef.current.setAttribute('transform', transformAttribute)
            } else {
                const transformAttribute = `translate(${transform.x}, ${transform.y}) rotate(${transform.rotation})`
                contentRef.current.setAttribute('transform', transformAttribute)
            }
        }
    }, [transform, rough, sourceContent])

    return <g ref={contentRef}></g>
}
