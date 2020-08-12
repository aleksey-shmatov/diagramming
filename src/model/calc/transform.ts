import { translate, rotate } from './point'
import { Point, Transform, Rect } from 'model/core'
import { mergeBoundingBoxes } from './rect'

export const getTransformPoints = (transform: Transform) => {
    const originPoints = [
        { x: 0, y: 0 },
        { x: transform.width, y: 0 },
        { x: transform.width, y: transform.height },
        { x: 0, y: transform.height },
    ]
    return originPoints.map((point) =>
        translate(rotate(point, transform.rotation), transform)
    )
}

export const getBoundingBox = (transform: Transform): Rect => {
    if (transform.rotation === 0) {
        return transform
    }
    const originPoints = [
        {
            x: 0,
            y: 0,
        },
        {
            x: transform.width,
            y: 0,
        },
        {
            x: transform.width,
            y: transform.height,
        },
        {
            x: 0,
            y: transform.height,
        },
    ]
    const points = originPoints.map((point) =>
        translate(rotate(point, transform.rotation), transform)
    )
    const left = Math.min(...points.map((p) => p.x))
    const right = Math.max(...points.map((p) => p.x))
    const top = Math.min(...points.map((p) => p.y))
    const bottom = Math.max(...points.map((p) => p.y))
    return {
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
    }
}

export const computeBoundingBox = (transforms: Transform[]): Rect => {
    const rects = transforms.map(getBoundingBox)
    return mergeBoundingBoxes(rects)
}

export const getCenter = (transform: Transform): Point => {
    const center = translate(
        rotate(
            {
                x: transform.width * 0.5,
                y: transform.height * 0.5,
            },
            transform.rotation
        ),
        transform
    )
    return center
}

export const rotateAround = (
    transform: Transform,
    center: Point,
    delta: number
) => {
    const cx = center.x - transform.x
    const cy = center.y - transform.y

    const rotation = transform.rotation + delta
    const t = rotate({ x: -cx, y: -cy }, delta)

    return {
        x: center.x + t.x,
        y: center.y + t.y,
        width: transform.width,
        height: transform.height,
        rotation,
    }
}
