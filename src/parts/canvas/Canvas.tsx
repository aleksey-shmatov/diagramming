import React, { useCallback, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from 'modelContext'
import { CanvasElement } from './CanvasElement'
import { DropPane } from './DropPane'
import { LibraryItem } from 'model'
import { ToolsPane } from 'parts/tool'
import { TARGET_DATA_ATTRIBUTE } from 'parts/constants'
import { TargetData } from 'model/target'

type Point = {
    x: number
    y: number
}

const makeStream = <T extends {}>() => {
    let resolve: (point: T | null) => void = () => {}
    const promiseCallback = (r: (point: T | null) => void) => {
        resolve = r
    }
    const takeMousePoint = () => {
        return new Promise(promiseCallback)
    }
    return {
        take: takeMousePoint,
        put: (point: T | null) => resolve(point),
    }
}

export const Canvas = observer(() => {
    const store = useStore()
    const doc = store.document
    const elements = doc.currentPage.elements

    const canvasRef = useRef<SVGSVGElement>(null)
    const handleMouseDown = useCallback(
        (event: React.MouseEvent) => {
            const offset = canvasRef.current!.getBoundingClientRect()
            const start = {
                x: event.clientX - offset.x,
                y: event.clientY - offset.y,
            }

            const { take, put } = makeStream<Point>()

            const handleMouseMove = (event: MouseEvent) => {
                put({
                    x: event.clientX - offset.x,
                    y: event.clientY - offset.y,
                })
            }
            const handleMouseUp = (_: MouseEvent) => {
                put(null)
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)

            const targetDataString =
                (event.target as HTMLElement)?.dataset[TARGET_DATA_ATTRIBUTE] ??
                null
            const targetData: TargetData | null = targetDataString
                ? JSON.parse(targetDataString)
                : null

            if (doc.tool === 'select') {
                doc.selectTool(targetData, take)
            } else {
                if (targetData) {
                    doc.changeTool('select')
                    doc.selectTool(targetData, take)
                } else {
                    if (store.libraryItem) {
                        doc.elementsTool(store.libraryItem, take)
                    }
                }
            }

            put(start)
        },
        [doc, store]
    )

    const handleDrop = useCallback(
        (item: LibraryItem, point: Point) => {
            const rect = canvasRef.current?.getBoundingClientRect()
            if (rect) {
                doc.addShape(item, { x: point.x - rect.x, y: point.y - rect.y })
            }
        },
        [doc]
    )
    return (
        <DropPane onDrop={handleDrop}>
            <svg
                ref={canvasRef}
                width="1024"
                height="768"
                onMouseDown={handleMouseDown}
            >
                <rect fill="white" width="100%" height="100%" />
                {elements.map((element) => (
                    <CanvasElement key={element.id} element={element} />
                ))}
                <ToolsPane />
            </svg>
        </DropPane>
    )
})
