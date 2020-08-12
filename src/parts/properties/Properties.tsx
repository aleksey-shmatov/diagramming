import React from 'react'
import { ColorPicker } from 'components/ColorPicker'
import { FillStyleInput } from 'components/FillStyleInput'
import { observer } from 'mobx-react-lite'
import { useStore } from 'modelContext'
import styled from 'styled-components/macro'

const Contaiener = styled.div`
    display: flex;
    flex-direction: column;
    width: 230px;
    height: 100%;
    box-sizing: border-box;
    padding: 0.3rem;
    border-right: #666666 solid 1px;
`

const PropertyContainer = styled.div`
    padding: 1rem;
`;

export const Properties = observer(() => {
    const store = useStore()
    const doc = store.document
    const style = store.document.style
    let fill = style.fill
    let stroke = style.stroke
    let rough = style.rough
    if (doc.hasSelection) {
        const firstElement = doc.selection[0]
        if (firstElement.type === 'shape') {
            fill = firstElement.fill
            stroke = firstElement.stroke
            rough = firstElement.rough
        }
    }
    return (
        <Contaiener>
            <h3>Properties</h3>
            <PropertyContainer>
                <label>Fill</label>
                <ColorPicker
                    color={fill.color}
                    onChange={(color) => {
                        doc.applyStyles({ fill: { ...fill, color } })
                    }}
                />
            </PropertyContainer>
            <PropertyContainer>
                <label>Fill Opacity</label>
                <input
                    type="range"
                    min={0}
                    max={1}
                    value={fill.opacity}
                    step={0.05}
                    onChange={(event) => {
                        const opacity = event.currentTarget.valueAsNumber
                        doc.applyStyles({ fill: { ...fill, opacity } })
                    }}
                />
            </PropertyContainer>
            <PropertyContainer>
                <label>Stroke</label>
                <ColorPicker
                    color={stroke.color}
                    onChange={(color) => {
                        doc.applyStyles({ stroke: { ...stroke, color } })
                    }}
                />
            </PropertyContainer>
            <PropertyContainer>
                <label>Stroke Opacity</label>
                <input
                    type="range"
                    min={0}
                    max={1}
                    value={stroke.opacity}
                    step={0.05}
                    onChange={(event) => {
                        const opacity = event.currentTarget.valueAsNumber
                        doc.applyStyles({ stroke: { ...stroke, opacity } })
                    }}
                />
            </PropertyContainer>
            <PropertyContainer>
                <label>Stroke weight</label>
                <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={stroke.width}
                    onChange={(event) => {
                        const width = event.currentTarget.valueAsNumber
                        doc.applyStyles({ stroke: { ...stroke, width } })
                    }}
                />
            </PropertyContainer>
            <PropertyContainer>
                <label>Roughness</label>
                <input
                    type="range"
                    min={0}
                    max={3}
                    value={rough.roughness}
                    step={0.05}
                    onChange={(event) => {
                        const roughness = event.currentTarget.valueAsNumber
                        doc.applyStyles({ rough: { ...rough, roughness } })
                    }}
                />
            </PropertyContainer>
            {rough.roughness > 0 && (
                <PropertyContainer>
                    <label>Fill Style</label>
                    <br />
                    <FillStyleInput
                        value={rough.fillKind}
                        onChange={(fillKind) => {
                            doc.applyStyles({ rough: { ...rough, fillKind } })
                        }}
                    />
                </PropertyContainer>
            )}
            {rough.roughness > 0 && (
                <PropertyContainer>
                    <button
                        disabled={!doc.hasSelection}
                        onClick={() => {
                            doc.randomizeSeed()
                        }}
                    >
                        Randomize
                    </button>
                </PropertyContainer>
            )}
        </Contaiener>
    )
})
