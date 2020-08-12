import { types, Instance, destroy, flow } from 'mobx-state-tree'
import {
    RoughStyle,
    StrokeStyle,
    FillStyle,
    defaultFillStyle,
    defaultStrokeStyle,
    defaultRoughStyle,
    AllStyles,
} from '../style'
import { Transform, Point, Rect } from '../core'
import { LibraryItemRef, LibraryItem } from '../library'
import { UndoManager } from 'mst-middlewares'
import { generateId, generateSeed } from '../util'
import { selectTool } from './actions/selectTool'
import { elementsTool } from './actions/elementsTool'
import { Tool } from 'model/tools'
import { computeBoundingBox } from 'model/calc'
import { TargetData } from 'model/target'

export const ElementBase = types
    .model('ElementBase', {
        id: types.identifier,
    })
    .views(() => ({
        get currentTransform(): Transform {
            return { x: 0, y: 0, width: 0, height: 0, rotation: 0 }
        },
    }))
    .actions(() => ({
        applyTransform: (_: Transform) => {
            throw new Error('Not implemented')
        },
    }))

export const Shape = ElementBase.named('Shape')
    .props({
        type: types.literal('shape'),
        transform: types.frozen<Transform>(),
        rough: types.frozen<RoughStyle>(),
        stroke: types.frozen<StrokeStyle>(),
        fill: types.frozen<FillStyle>(),
        libraryItem: types.frozen<LibraryItemRef>(),
    })
    .views((self) => ({
        get currentTransform(): Transform {
            return self.transform
        },
    }))
    .actions((self) => ({
        applyTransform(transform: Transform) {
            self.transform = transform
        },
    }))

export type ShapeModel = Instance<typeof Shape>

export const Line = ElementBase.named('Line').props({
    type: types.literal('line'),
    stroke: types.frozen<StrokeStyle>(),
})

export const Element = types.union(Shape, Line)

export type ElementModel = Instance<typeof Element>

export const Page = types.model('Page', {
    id: types.identifier,
    name: 'Page',
    elements: types.array(Element),
})

export let undoManager: Instance<typeof UndoManager> = ({} as unknown) as Instance<
    typeof UndoManager
>

const setUndoManagerSameTree = (targetStore: any) => {
    undoManager = UndoManager.create({}, { targetStore })
}

const ReferenceList = types.array(types.reference(Element))

export const DocumentBase = types
    .model('DocumentBase', {
        pages: types.array(Page),
        // This type casting is a hack to prevent unnecesarry filtering every time when traversing selection
        // Safe reference automatically removes itself from the parent array so should never be undefined
        selection: types.array(
            types.safeReference(Element)
        ) as typeof ReferenceList,
        pageIndex: 0,
    })
    .volatile((self) => ({
        style: {
            fill: defaultFillStyle,
            stroke: defaultStrokeStyle,
            rough: defaultRoughStyle,
        },
        selectionRect: null as Rect | null,
        currentSelectionTransform: null as Transform | null,
        tool: 'elements' as Tool,
    }))
    .views((self) => ({
        get currentPage() {
            return self.pages[self.pageIndex]
        },
        get selectionTransform(): Transform | null {
            if (self.currentSelectionTransform) {
                return self.currentSelectionTransform
            }
            if (self.selection.length) {
                if (self.selection.length === 1) {
                    return self.selection[0].currentTransform
                }
                const bbox = computeBoundingBox(
                    self.selection.map((element) => element.currentTransform)
                )
                return { ...bbox, rotation: 0 }
            }
            return null
        },
        get hasSelection(): boolean {
            return self.selection.length > 0
        },
    }))
    .actions((self) => {
        setUndoManagerSameTree(self)
        return {
            addShape: (libraryItem: LibraryItem, point: Point) => {
                const element = Shape.create({
                    id: generateId(),
                    type: 'shape',
                    libraryItem: {
                        id: libraryItem.id,
                        libraryId: libraryItem.libraryId,
                    },
                    fill: self.style.fill,
                    stroke: self.style.stroke,
                    rough: { ...self.style.rough, seed: generateSeed() },
                    transform: {
                        x: point.x,
                        y: point.y,
                        width: libraryItem.width,
                        height: libraryItem.height,
                        rotation: 0,
                    },
                })
                self.pages[self.pageIndex].elements.push(element)
            },
            changeTool: (tool: Tool) => {
                self.tool = tool
            },
            select: (selection: string[]) => {
                undoManager.withoutUndo(() => {
                    self.selection.splice(0, self.selection.length)
                    selection.forEach((elementId) => {
                        // Would be great to use resolveIdentifier but how to do it with base type?
                        const elementRef = self.currentPage.elements.find(
                            (element) => element.id === elementId
                        )
                        if (elementRef) {
                            self.selection.push(elementRef)
                        }
                    })
                })
            },
            delete: () => {
                self.selection.forEach((element) => {
                    if (element) {
                        destroy(element)
                    }
                })
                undoManager.withoutUndo(() => {
                    self.selection.splice(0, self.selection.length)
                })
            },
            applyStyles: (styles: Partial<AllStyles>) => {
                const newStyle = { ...self.style }
                for (const [key, value] of Object.entries(styles)) {
                    if (key in newStyle) {
                        ; (newStyle as any)[key] = value
                    }
                    self.selection.forEach((element) => {
                        if (key in element) {
                            ; (element as any)[key] = value
                        }
                    })
                }
                self.style = newStyle
            },
            randomizeSeed: () => {
                self.selection.forEach((element) => {
                    if (
                        element.type === 'shape' &&
                        element.rough.roughness > 0
                    ) {
                        element.rough = {
                            ...element.rough,
                            seed: generateSeed(),
                        }
                    }
                })
            },
        }
    })

export const Document = DocumentBase.named('Document').actions((self) => ({
    selectTool: flow(function* (
        targetData: TargetData | null,
        take: () => Promise<Point | null>
    ) {
        yield* selectTool(self, targetData, take)
    }),
    elementsTool: flow(function* (libraryItem: LibraryItemRef, take: () => Promise<Point | null>) {
        yield* elementsTool(self, libraryItem, take);
    }),
}))
