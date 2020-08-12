import React, { PropsWithChildren } from 'react'
import { useDrop } from 'react-dnd'
import { Point } from 'model/core'
import { LibraryItem } from 'model'

type Props = PropsWithChildren<{
    onDrop: (item: LibraryItem, position: Point) => void
}>

export const DropPane = ({ children, onDrop }: Props) => {
    const [, drop] = useDrop({
        accept: 'library-item',
        drop: (item, monitor) => {
            const offset = monitor.getClientOffset()
            if (offset) {
                onDrop((item as any).libraryItem, offset)
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    })

    return <div ref={drop}>{children}</div>
}
