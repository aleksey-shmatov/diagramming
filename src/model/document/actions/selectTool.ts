import { Instance } from 'mobx-state-tree'
import { DocumentBase } from '../document'
import { Point } from 'model/core'
import { TargetData } from 'model/target'
import { selectionRectTool } from './selectionRectTool'
import { rotateTool } from './rotateTool'
import { moveTool } from './moveTool'
import { resizeTool } from './resizeTool'

export function* selectTool(
    self: Instance<typeof DocumentBase>,
    targetData: TargetData | null,
    take: () => Promise<Point | null>
) {
    if (!targetData) {
        yield* selectionRectTool(self, take)
    } else {
        if (targetData.type === 'shape') {
            const isSelected = self.selection.find(
                (element) => element.id === targetData.id
            )
            if (!isSelected) {
                self.select([targetData.id])
            }
        }
        switch (targetData.type) {
            case 'shape':
                yield* moveTool(self, take)
                break
            case 'marker':
                if (targetData.role === 'rotate') {
                    yield* rotateTool(self, take)
                } else {
                    yield* resizeTool(self, targetData.role, take)
                }
                break
        }
    }
}
