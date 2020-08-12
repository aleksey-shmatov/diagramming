import React, { useEffect, useState } from 'react'
import { Library } from 'model'
import styled from 'styled-components/macro'
import { LibraryItemRenderer } from './LibraryItemRenderer'
import { observer } from 'mobx-react-lite'
import { useStore } from 'modelContext'

type Props = {
    id: string
}

const LibraryContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    background: white;
    margin: 5px;
`

export const LibraryRenderer = observer(({ id }: Props) => {
    const store = useStore()
    const libraryItem = store.libraryItem
    const [library, setLibrary] = useState<Library | null>(null)
    useEffect(() => {
        const getLibrary = async () => {
            try {
                const response = await fetch(
                    `${process.env.PUBLIC_URL}/libraries/${id}/library.json`
                )
                const library = (await response.json()) as Library
                library.shapes.forEach((shape) => {
                    shape.libraryId = id
                })
                setLibrary(library)
            } catch (e) {
                // TODO
                console.log(e)
                console.log('add error handling')
            }
        }
        getLibrary()
    }, [id])

    if (!library) {
        return null
    }

    return (
        <LibraryContainer>
            {library.shapes.map((shape) => (
                <LibraryItemRenderer
                    key={shape.id}
                    libraryItem={shape}
                    onSelect={store.changeLibraryItem}
                    isSelected={
                        libraryItem !== null &&
                        libraryItem.libraryId === library.id &&
                        libraryItem.id === shape.id
                    }
                />
            ))}
        </LibraryContainer>
    )
})
