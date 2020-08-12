import { Instance } from 'mobx-state-tree'
import { DocumentBase, Shape } from '../document'
import { Point } from 'model/core'
import { generateId, generateSeed } from 'model/util'
import { LibraryItemRef } from 'model/library'
import { rectFromPoints } from 'model/calc'

export function* elementsTool(
    self: Instance<typeof DocumentBase>,
    libraryItem: LibraryItemRef,
    take: () => Promise<Point | null>
) {
    const start = yield take()

    const element = Shape.create({
        id: generateId(),
        type: 'shape',
        libraryItem: {
            libraryId: libraryItem.libraryId,
            id: libraryItem.id,
        },
        fill: self.style.fill,
        stroke: self.style.stroke,
        rough: { ...self.style.rough, seed: generateSeed() },
        transform: {
            ...rectFromPoints(start, start),
            rotation: 0,
        },
    })

    self.pages[self.pageIndex].elements.push(element)
    let point = start
    while (point) {
        const transform = {
            ...rectFromPoints(start, point),
            rotation: 0,
        }
        element.applyTransform(transform)
        point = yield take()
    }
}
