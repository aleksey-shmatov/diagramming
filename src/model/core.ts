export type Point = {
    x: number
    y: number
}

export type Rect = {
    x: number
    y: number
    width: number
    height: number
}

export type Transform = {
    x: number
    y: number
    width: number
    height: number
    rotation: number
}

export const resizeDirections = [
    'top-left',
    'top',
    'top-right',
    'right',
    'bottom-right',
    'bottom',
    'bottom-left',
    'left',
]

export type ResizeDirection = typeof resizeDirections[number]

export const resizeMultipliers: Record<ResizeDirection, Point> = {
    'top-left': { x: -1, y: -1 },
    top: { x: 0, y: -1 },
    'top-right': { x: 1, y: -1 },
    right: { x: 1, y: 0 },
    'bottom-right': { x: 1, y: 1 },
    bottom: { x: 0, y: 1 },
    'bottom-left': { x: -1, y: 1 },
    left: { x: -1, y: 0 },
}

export const getResizeMarker = (box: Transform, direction: ResizeDirection) => {
    const p = resizeMultipliers[direction]
    const x = box.x + box.width * (1 + p.x) * 0.5
    const y = box.y + box.height * (1 + p.y) * 0.5
    return {
        direction,
        x,
        y,
    }
}

export const getResizeMarkers = (box: Transform) => {
    return resizeDirections.map((direction) => getResizeMarker(box, direction))
}
