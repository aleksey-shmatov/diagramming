import { Instance } from 'mobx-state-tree'
import { DocumentBase } from '../document'
import { Point } from 'model/core'
import { checkIntersection, rectFromPoints } from 'model/calc'

export function* selectionRectTool(
    self: Instance<typeof DocumentBase>,
    take: () => Promise<Point | null>
) {
    const start = yield take()
    self.select([])
    let point = start
    while (point) {
        self.selectionRect = rectFromPoints(start, point)
        point = yield take()
    }
    const selectionRect = self.selectionRect
    if (selectionRect) {
        const newSelection = self.currentPage.elements
            .filter((element) =>
                checkIntersection(selectionRect, element.currentTransform)
            )
            .map((element) => element.id)
        self.select(newSelection)
        self.selectionRect = null
    }
}
