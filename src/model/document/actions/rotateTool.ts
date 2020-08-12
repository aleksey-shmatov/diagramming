import { Instance } from 'mobx-state-tree'
import { DocumentBase } from '../document'
import { Point } from 'model/core'
import { getCenter, rotateAround, vectorRotation, vector } from 'model/calc'

export function* rotateTool(
    self: Instance<typeof DocumentBase>,
    take: () => Promise<Point | null>
) {
    const transforms = self.selection.map((element) => element.currentTransform)
    const originalTransform = self.selectionTransform
    if (!originalTransform) {
        return
    }
    const start = yield take()

    const center = getCenter(originalTransform)
    const startPointRotation = vectorRotation(vector(center, start))
    self.currentSelectionTransform = originalTransform

    const applyNewTransform = (delta: number) => {
        self.selection.forEach((element, index) => {
            const newTransform = rotateAround(transforms[index], center, delta)
            element.applyTransform(newTransform)
        })
    }

    let point = yield take()
    while (point) {
        const pointRotation = vectorRotation(vector(center, point))
        const delta = pointRotation - startPointRotation
        applyNewTransform(delta)
        self.currentSelectionTransform = rotateAround(
            originalTransform,
            center,
            delta
        )
        point = yield take()
    }
    self.currentSelectionTransform = null
}
