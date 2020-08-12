import { Point } from 'model/core'
import { toRad, toDegree } from './util'

export const orthogonalVector = (p: Point) => ({
    x: p.y,
    y: -p.x,
})

export const dotProduct = (p1: Point, p2: Point) => p1.x * p2.x + p1.y * p2.y

export const rotate = (p: Point, degrees: number): Point => {
    const rotation = toRad(degrees)
    const cos = Math.cos(rotation)
    const sin = Math.sin(rotation)
    return {
        x: cos * p.x - sin * p.y,
        y: sin * p.x + cos * p.y,
    }
}

export const distance = (p1: Point, p2: Point) => {
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    return Math.sqrt(dx * dx + dy * dy)
}

export const ZeroPoint = { x: 0, y: 0 }

export const length = (p: Point) => distance(p, ZeroPoint)

export const translate = (p: Point, v: Point): Point => ({
    x: p.x + v.x,
    y: p.y + v.y,
})

export const vector = (from: Point, to: Point): Point => ({
    x: to.x - from.x,
    y: to.y - from.y,
})

export const opposite = (p: Point) => ({
    x: -p.x,
    y: -p.y,
})

export const scale = (p: Point, sx: number, sy: number) => ({
    x: p.x * sx,
    y: p.y * sy,
})

// Returns angle between vector and x axis
export const vectorRotation = (p: Point): number => {
    return toDegree(Math.atan2(p.y, p.x))
}
