import React, { useEffect, useState } from 'react'
import { LibraryRef } from 'model'
import styled from 'styled-components/macro'
import { LibraryRenderer } from './LibraryRenderer'

const LibrariesContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0.3rem;
    width: 230px;
    height: 100%;
    border-right: #666666 solid 1px;
    box-sizing: border-box;
`

const LibraryItem = styled.div`
    display: flex;
    flex-direction: column;
`

export const Libraries = () => {
    const [libraries, setLibraries] = useState<LibraryRef[]>([])
    useEffect(() => {
        const getLibraries = async () => {
            try {
                const response = await fetch(
                    `${process.env.PUBLIC_URL}/libraries/libraries.json`
                )
                const data = await response.json()
                setLibraries(data.libraries)
            } catch (e) {
                // TODO
                console.log(e)
                console.log('add error handling')
            }
        }
        getLibraries()
    }, [])
    return (
        <LibrariesContainer>
            {libraries.map((library) => (
                <LibraryItem key={library.id}>
                    <h3>{library.name}</h3>
                    <LibraryRenderer id={library.id} />
                </LibraryItem>
            ))}
        </LibrariesContainer>
    )
}
