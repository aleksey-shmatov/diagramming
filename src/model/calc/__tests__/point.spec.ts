import { rotate, translate, distance, length } from '../point'

describe('Point tests', () => {
    it('Rotate point', () => {
        const p = rotate({ x: 1, y: 0 }, 90)
        expect(p.x).toBeCloseTo(0)
        expect(p.y).toBeCloseTo(1)
        const r = rotate({ x: 1, y: 0 }, -90)
        expect(r.x).toBeCloseTo(0)
        expect(r.y).toBeCloseTo(-1)
    })

    it('Rotate point', () => {
        const p = translate({ x: 0, y: 0 }, { x: 1, y: 1 })
        expect(p.x).toBeCloseTo(1)
        expect(p.y).toBeCloseTo(1)
    })

    it('Distance', () => {
        expect(distance({ x: -1, y: 0 }, { x: 1, y: 0 })).toBeCloseTo(2)
    })

    it('Length', () => {
        expect(length({ x: -1, y: 0 })).toBeCloseTo(1)
    })
})
