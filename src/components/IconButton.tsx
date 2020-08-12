import React from 'react'
import styled from 'styled-components/macro'

type Props = {
    icon: React.ComponentType
    label: string
    onClick: () => void
    disabled?: boolean
}

const IconButtonContainer = styled.button<{ disabled: boolean }>`
    display: flex;
    align-items: center;
    all: unset;
    width: 2rem;
    height: 2rem;
    color: ${(props) => (props.disabled ? 'gray' : 'currentColor')};
    opacity: ${(props) => (props.disabled ? 0.5 : 1)};

    svg {
        width: 1.5rem;
    }

    :hover {
        color: ${(props) => (props.disabled ? 'gray' : 'blue')};
    }
`

export const IconButton = ({ icon, disabled, onClick }: Props) => {
    const Icon = icon
    return (
        <IconButtonContainer
            type="button"
            onClick={onClick}
            disabled={Boolean(disabled)}
        >
            <Icon />
        </IconButtonContainer>
    )
}
