import React from 'react'
import styled from 'styled-components/macro'
import { IconButton } from 'components/IconButton'
import { ReactComponent as UndoIcon } from 'assets/icons/actions/undo.svg'
import { ReactComponent as RedoIcon } from 'assets/icons/actions/redo.svg'
import { ReactComponent as DeleteIcon } from 'assets/icons/actions/delete.svg'
import { observer } from 'mobx-react-lite'
import { useStore } from 'modelContext'

const Container = styled.div`
    display: flex;
`

export const ActionsBar = observer(() => {
    const store = useStore()
    const undoRedo = store.undoRedo
    const doc = store.document
    return (
        <Container>
            <IconButton
                icon={UndoIcon}
                label="Undo"
                disabled={!undoRedo.canUndo}
                onClick={() => {
                    console.log(undoRedo.history.toJSON())
                    undoRedo.undo()
                }}
            />
            <IconButton
                icon={RedoIcon}
                label="Redo"
                disabled={!undoRedo.canRedo}
                onClick={() => undoRedo.redo()}
            />
            <IconButton
                icon={DeleteIcon}
                label="Delete"
                disabled={!doc.hasSelection}
                onClick={() => doc.delete()}
            />
        </Container>
    )
})
