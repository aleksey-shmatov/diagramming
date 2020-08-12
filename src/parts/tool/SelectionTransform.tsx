import React, { useMemo } from 'react'
import { Transform, getResizeMarkers, resizeDirections } from 'model/core'
import styled from 'styled-components/macro'

type Props = {
    box: Transform
}

const Marker = styled.rect`
    stroke: #666666;
    stroke-width: 1.5;
    fill: white;

    &:hover {
        stroke: #1592e6;
    }
`

const RotateMarker = styled.circle`
    stroke: #666666;
    stroke-width: 1.5;
    fill: white;

    &:hover {
        stroke: #1592e6;
    }
`

const markerSize = 10
const rotationOffset = 25

const rotateTargetData = JSON.stringify({ type: 'marker', role: 'rotate' })

export const SelectionTransform = ({ box }: Props) => {
    const points = useMemo(
        () =>
            getResizeMarkers({
                x: 0,
                y: 0,
                width: box.width,
                height: box.height,
                rotation: 0,
            }),
        [box]
    )
    const targetData = useMemo(
        () =>
            resizeDirections.map((direction) =>
                JSON.stringify({
                    type: 'marker',
                    role: direction,
                })
            ),
        []
    )
    const transform = `translate(${box.x}, ${box.y}) rotate(${box.rotation})`
    return (
        <g transform={transform}>
            <RotateMarker
                data-target_data={rotateTargetData}
                cx={box.width * 0.5}
                cy={-rotationOffset}
                r={markerSize * 0.5}
            />
            {points.map(({ direction, x, y }, index) => (
                <Marker
                    key={direction}
                    data-target_data={targetData[index]}
                    x={x - markerSize * 0.5}
                    y={y - markerSize * 0.5}
                    width={markerSize}
                    height={markerSize}
                />
            ))}
        </g>
    )
}
