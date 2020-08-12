import React from 'react'
import { tools } from 'model/tools'
import { ToolbarButton } from './ToolbarButton'
import styled from 'styled-components/macro'
import { useStore } from 'modelContext'
import { observer } from 'mobx-react-lite'

const ToolbarContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-right: #666666 solid 1px;
    padding: 0.3rem;
`

export const Toolbar = observer(() => {
    const doc = useStore().document
    const tool = doc.tool
    const onChange = doc.changeTool
    return (
        <ToolbarContainer>
            {tools.map((currentTool) => (
                <ToolbarButton
                    group="tools"
                    key={currentTool}
                    tool={currentTool}
                    isSelected={currentTool === tool}
                    onToggle={onChange}
                />
            ))}
        </ToolbarContainer>
    )
})
