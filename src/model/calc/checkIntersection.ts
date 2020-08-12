import { getRectPoints } from './rect'
import { getTransformPoints } from './transform'
import { dotProduct, orthogonalVector, vector } from './point'
import { Rect, Point, Transform } from 'model/core'

export const checkIntersection = (rect: Rect, transform: Transform) => {
    // separating axis test
    const polygonA = getRectPoints(rect)
    const polygonB = getTransformPoints(transform)

    // Returns min/max value of points projected on vector
    const getPolygonProjection = (
        polygon: Point[],
        vector: Point
    ): [number, number] => {
        const projections = polygon.map((p) => dotProduct(p, vector))
        return [Math.min(...projections), Math.max(...projections)]
    }

    const checkForSeparatingAxis = (points: Point[]): boolean => {
        for (let i = 0; i < points.length; i++) {
            // Find normal vector to each edge
            const edgeStart = points[i]
            const edgeEnd = points[(i + 1) % points.length]
            const edgeVector = vector(edgeStart, edgeEnd)
            const edgeNormal = orthogonalVector(edgeVector)

            // Find both rects projections onto edgeNormal
            const [minA, maxA] = getPolygonProjection(polygonA, edgeNormal)
            const [minB, maxB] = getPolygonProjection(polygonB, edgeNormal)

            if (maxA < minB || maxB < minA) {
                // Projections do not overlap - found separating line
                return false
            }
        }
        return true
    }
    return checkForSeparatingAxis(polygonA) && checkForSeparatingAxis(polygonB)
}
