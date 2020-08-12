import React from 'react'
import { Rect } from 'model/core'
import styled from 'styled-components/macro'

type Props = {
    rect: Rect
}

const StyledRect = styled.rect`
    stroke: #1592e6;
    fill: none;
    stroke-dasharray: 4;
`

export const SelectionRect = ({ rect }: Props) => {
    return (
        <StyledRect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
        />
    )
}
