import React, { useCallback, useMemo } from 'react'
import { StrokeStyle, RoughStyle, LibraryItemRef, LibraryItem } from 'model'
import styled from 'styled-components/macro'
import { SVGRenderer } from 'parts/svg'
import { Transform } from 'model/core'
import { useDrag } from 'react-dnd'

const LibraryItemContainer = styled.div`
    display: flex;
    padding: 5px;
`

const stroke: StrokeStyle = {
    color: '#666666',
    opacity: 1,
    width: 1,
}

const selectedStroke: StrokeStyle = {
    color: '#1592E6',
    opacity: 1,
    width: 1,
}

const fill = {
    color: 'none',
    opacity: 1,
}

const rough: RoughStyle = {
    roughness: 0,
    seed: 0,
    fillKind: 'none',
}

const transform: Transform = {
    x: 0,
    y: 0,
    width: 40,
    height: 40,
    rotation: 0,
}

const LibraryImage = styled.svg`
    overflow: visible;
`

type Props = {
    libraryItem: LibraryItem
    isSelected: boolean
    onSelect: (item: LibraryItemRef) => void
}

export const LibraryItemRenderer = ({
    libraryItem,
    isSelected,
    onSelect,
}: Props) => {
    const [, drag] = useDrag({
        item: { name: libraryItem.id, type: 'library-item', libraryItem },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    })
    const handleSelect = useCallback(() => {
        onSelect(libraryItem)
    }, [onSelect, libraryItem])

    const newTransform = useMemo(() => {
        let scaleX = transform.width / libraryItem.width
        let scaleY = transform.height / libraryItem.height
        if (scaleX > scaleY) {
            scaleX = scaleY
        } else {
            scaleY = scaleX
        }
        const width = scaleX * libraryItem.width
        const height = scaleY * libraryItem.height
        return {
            x: (transform.width - width) * 0.5,
            y: (transform.height - height) * 0.5,
            width,
            height,
            rotation: 0,
        }
    }, [libraryItem])

    return (
        <LibraryItemContainer ref={drag} onMouseDown={handleSelect}>
            <LibraryImage width="40" height="40">
                <SVGRenderer
                    source={`${process.env.PUBLIC_URL}/libraries/${libraryItem.libraryId}/${libraryItem.id}.svg`}
                    elementId={libraryItem.id}
                    stroke={isSelected ? selectedStroke : stroke}
                    fill={fill}
                    rough={rough}
                    transform={newTransform}
                />
            </LibraryImage>
        </LibraryItemContainer>
    )
}
