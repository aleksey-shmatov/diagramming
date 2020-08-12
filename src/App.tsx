import React from 'react'
import { Header } from 'parts/header'
import { Toolbar } from 'parts/toolbar'
import { MainContainer } from 'parts/main'
import styled from 'styled-components/macro'
import { createGlobalStyle } from 'styled-components'
import { Provider, defaultStore } from './modelContext'
import { ToolPanel } from 'parts/toolPanel'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

const GlobalStyle = createGlobalStyle`
  body {
    background: ${(props) => 'lightgray'};
    margin: 0;
  }
`

const AppContainer = styled.div`
    height: 100vh;
`

const Content = styled.div`
    display: flex;
    height: 100vh;
`

function App() {
    return (
        <Provider value={defaultStore}>
            <DndProvider backend={HTML5Backend}>
                <AppContainer>
                    <GlobalStyle />
                    <Header />
                    <Content>
                        <Toolbar />
                        <ToolPanel />
                        <MainContainer />
                    </Content>
                </AppContainer>
            </DndProvider>
        </Provider>
    )
}

export default App
