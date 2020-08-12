import React, { useCallback } from 'react'
import { Tool } from 'model'

type Props = {
    isSelected: boolean
    tool: Tool
    onToggle: (tool: Tool) => void
    group: string
}

export const ToolbarButton = ({ group, isSelected, tool, onToggle }: Props) => {
    const handleChange = useCallback(() => {
        onToggle(tool)
    }, [tool, onToggle])
    return (
        <label>
            <input
                type="radio"
                checked={isSelected}
                radioGroup={group}
                onChange={handleChange}
            />
        </label>
    )
}
