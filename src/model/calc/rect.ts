import { Point, Rect } from 'model/core'

export const rectFromPoints = (start: Point, end: Point): Rect => ({
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.abs(end.x - start.x),
    height: Math.abs(end.y - start.y),
})

export const getRectPoints = (rect: Rect) => [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x + 0, y: rect.y + rect.height },
]

export const mergeBoundingBoxes = (rects: Rect[]) => {
    const bounds = rects.reduce(
        (acc, rect) => {
            acc.left = Math.min(acc.left, rect.x)
            acc.right = Math.max(acc.right, rect.x + rect.width)
            acc.top = Math.min(acc.top, rect.y)
            acc.bottom = Math.max(acc.bottom, rect.y + rect.height)
            return acc
        },
        {
            left: Number.MAX_VALUE,
            right: Number.MIN_VALUE,
            top: Number.MAX_VALUE,
            bottom: Number.MIN_VALUE,
        }
    )
    return {
        x: bounds.left,
        y: bounds.top,
        width: bounds.right - bounds.left,
        height: bounds.bottom - bounds.top,
    }
}
