import React from 'react'
import { Canvas } from 'parts/canvas'
import { ActionsBar } from './ActionsBar'
import styled from 'styled-components/macro'

const MainContent = styled.div`
    width: 100%;
    overflow: auto;
`

const Container = styled.div`
    display: flex;
    flex-direction: column;
`

export const MainContainer = () => {
    return (
        <Container>
            <ActionsBar />
            <MainContent>
                <Canvas />
            </MainContent>
            <div id="page-select">
                <span>Page 1</span>
            </div>
        </Container>
    )
}
