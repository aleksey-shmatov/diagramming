import { Instance } from 'mobx-state-tree'
import { DocumentBase } from '../document'
import { Point } from 'model/core'
import { vector } from 'model/calc'

export function* moveTool(
    self: Instance<typeof DocumentBase>,
    take: () => Promise<Point | null>
) {
    const transforms = self.selection.map((element) => element.currentTransform)
    const start = yield take()
    const applyDelta = (delta: Point) => {
        self.selection.forEach((element, index) => {
            const transform = transforms[index]
            const newTransform = {
                ...transform,
                x: transform.x + delta.x,
                y: transform.y + delta.y,
            }
            element.applyTransform(newTransform)
        })
    }
    let point = yield take()
    while (point) {
        applyDelta(vector(start, point))
        point = yield take()
    }
}
