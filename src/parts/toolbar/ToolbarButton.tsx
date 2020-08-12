import React, { useCallback } from 'react'
import { Tool } from 'model'
import { getToolInfo } from './toolbarItems'
import styled from 'styled-components/macro'

type Props = {
    isSelected: boolean
    tool: Tool
    onToggle: (tool: Tool) => void
    group: string
}

const ToolbarButtonContainer = styled.label<{ isSelected: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0.5rem 0;
    color: ${(props) => (props.isSelected ? 'blue' : 'black')};

    input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }
`

export const ToolbarButton = ({ group, isSelected, tool, onToggle }: Props) => {
    const handleChange = useCallback(() => {
        onToggle(tool)
    }, [tool, onToggle])
    const toolInfo = getToolInfo(tool)
    const Icon = toolInfo.icon
    return (
        <ToolbarButtonContainer isSelected={isSelected}>
            <input
                type="radio"
                checked={isSelected}
                radioGroup={group}
                onChange={handleChange}
            />
            <Icon />
            {toolInfo.label}
        </ToolbarButtonContainer>
    )
}
