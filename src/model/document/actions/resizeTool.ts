import { Instance } from 'mobx-state-tree'
import { DocumentBase } from '../document'
import {
    Point,
    Transform,
    resizeMultipliers,
    ResizeDirection,
} from 'model/core'
import {
    rectFromPoints,
    rotate,
    translate,
    distance,
    getTransformPoints,
    vector,
    scale,
} from 'model/calc'

export function* resizeTool(
    self: Instance<typeof DocumentBase>,
    direction: ResizeDirection,
    take: () => Promise<Point | null>
) {
    const transforms = self.selection.map((element) => element.currentTransform)
    const originalTransform = self.selectionTransform
    if (!originalTransform) {
        return
    }
    const start = yield take()
    // Relative position of point towards selection origin in the selection coordinate system
    const positionInSelection = (p: Point) =>
        rotate(vector(originalTransform, p), -originalTransform.rotation)

    const applyNewTransform = (transform: Transform) => {
        let scaleX = transform.width / originalTransform.width
        let scaleY = transform.height / originalTransform.height
        // Restrict to uniform scaling when multiple objects selected
        if (self.selection.length > 1) {
            const dx = transform.width - originalTransform.width
            const dy = transform.height - originalTransform.height
            if (Math.abs(dx) > Math.abs(dy)) {
                scaleY = scaleX
            } else {
                scaleX = scaleY
            }
        }

        self.selection.forEach((element, index) => {
            // Fix relative position of the top left point within selection
            // Fix relative distance from topLeft point to topRight and bottomLeft corners
            const points = getTransformPoints(transforms[index]).map((p) => {
                const newOrigin = scale(positionInSelection(p), scaleX, scaleY)
                return translate(
                    rotate(newOrigin, originalTransform.rotation),
                    transform
                )
            })
            const topLeft = points[0]
            const topRight = points[1]
            const bottomLeft = points[3]

            const newTransform = {
                x: topLeft.x,
                y: topLeft.y,
                width: distance(topLeft, topRight),
                height: distance(topLeft, bottomLeft),
                rotation: transforms[index].rotation,
            }
            element.applyTransform(newTransform)
        })
    }

    // Relative position of point towards selection origin in the selection coordinate system
    const startOrigin = positionInSelection(start)

    let point = yield take()
    while (point) {
        const multiplier = resizeMultipliers[direction]
        // Relative position of point towards selection origin in the selection coordinate system
        const pointOrigin = positionInSelection(point)
        const deltaX = pointOrigin.x - startOrigin.x
        const deltaY = pointOrigin.y - startOrigin.y

        // Calc deltas corresponding to unrotated state taking into accout marker roles
        const dx = deltaX * (multiplier.x < 0 ? 1 : 0)
        const dy = deltaY * (multiplier.y < 0 ? 1 : 0)
        const dwidth = deltaX * (multiplier.x > 0 ? 1 : 0)
        const dheight = deltaY * (multiplier.y > 0 ? 1 : 0)

        const rectOrigin = rectFromPoints(
            { x: dx, y: dy },
            {
                x: originalTransform.width + dwidth,
                y: originalTransform.height + dheight,
            }
        )

        // Rotate back translation delta
        const rotatedDelta = rotate(rectOrigin, originalTransform.rotation)

        // New selection transform
        const newTransform = {
            ...translate(originalTransform, rotatedDelta),
            width: rectOrigin.width,
            height: rectOrigin.height,
            rotation: originalTransform.rotation,
        }

        applyNewTransform(newTransform)
        point = yield take()
    }
}
