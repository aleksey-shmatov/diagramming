import React from 'react'
import { observer } from 'mobx-react-lite'
import { Properties } from 'parts/properties'
import { useStore } from 'modelContext'
import { Libraries } from 'parts/library/Libraries'

export const ToolPanel = observer(() => {
    const store = useStore()
    const tool = store.document.tool
    return (
        <div>
            {tool !== 'elements' && <Properties />}
            {tool === 'elements' && <Libraries />}
        </div>
    )
})
