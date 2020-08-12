import { checkIntersection } from '../checkIntersection'

describe('Check intersection', () => {
    it('Overlap', () => {
        expect(checkIntersection({
            x: 0,
            y: 0,
            width: 100,
            height: 100
        }, {
            x: 10,
            y: 10,
            width: 200,
            height: 100,
            rotation: 0
        })).toBeTruthy();

        expect(checkIntersection({
            x: 0,
            y: 0,
            width: 100,
            height: 100
        }, {
            x: 90,
            y: 90,
            width: 200,
            height: 100,
            rotation: 45
        })).toBeTruthy();

        expect(checkIntersection({
            x: 0,
            y: 0,
            width: 100,
            height: 100
        }, {
            x: -50,
            y: -50,
            width: 80,
            height: 80,
            rotation: 0
        })).toBeTruthy();
    })

    it('No overlap', () => {
        expect(checkIntersection({
            x: 0,
            y: 0,
            width: 100,
            height: 100
        }, {
            x: 200,
            y: 200,
            width: 200,
            height: 100,
            rotation: 0
        })).toBeFalsy();

        expect(checkIntersection({
            x: 0,
            y: 0,
            width: 100,
            height: 100
        }, {
            x: 80,
            y: 120,
            width: 100,
            height: 100,
            rotation: -30
        })).toBeFalsy();
    })

})
