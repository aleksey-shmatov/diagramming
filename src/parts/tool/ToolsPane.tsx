import React from 'react'
import { SelectionTransform } from './SelectionTransform'
import { SelectionRect } from './SelectionRect'
import { useStore } from 'modelContext'
import { observer } from 'mobx-react-lite'

export const ToolsPane = observer(() => {
    const store = useStore()
    const doc = store.document
    const selectionTransform = doc.selectionTransform
    const selectionRect = doc.selectionRect
    return (
        <g>
            {selectionTransform && (
                <SelectionTransform box={selectionTransform} />
            )}
            {selectionRect && <SelectionRect rect={selectionRect} />}
        </g>
    )
})
