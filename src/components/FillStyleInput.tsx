import React from 'react'
import { fillKinds, FillKind } from 'model'

type Props = {
    value: FillKind
    onChange: (value: FillKind) => void
}

export const FillStyleInput = ({ value, onChange }: Props) => {
    return (
        <select
            value={value}
            onChange={(event) => {
                onChange(event.target.value)
            }}
        >
            {fillKinds.map((kind) => (
                <option key={kind} value={kind}>
                    {kind}
                </option>
            ))}
        </select>
    )
}
