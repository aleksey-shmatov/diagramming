import React, { useCallback } from 'react'
import { IconButton } from 'components/IconButton'
import { ReactComponent as UploadIcon } from 'assets/icons/actions/upload.svg'
import { ReactComponent as DownloadIcon } from 'assets/icons/actions/download.svg'
import styled from 'styled-components/macro'
import { useStore } from 'modelContext'
import FileSaver from 'file-saver'
import { getSnapshot, applySnapshot } from 'mobx-state-tree'

const HeaderContainer = styled.div`
    display: flex;
    align-items: center;
    color: white;
    background: #1592E6;
    align-items-center;
    padding: 0.3rem 1rem;

    > * {
        margin-right: 1rem;
    }
`

const FileInput = styled.label`
button {
    pointer-events: none;
}
input[type="file"] {
    display: none;
}
`;

export const Header = () => {
    const store = useStore()
    const handleUpload = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files
            if (files?.length) {
                const fileReader = new FileReader()
                fileReader.addEventListener('load', () => {
                    if (
                        fileReader.result &&
                        typeof fileReader.result === 'string'
                    ) {
                        const data = JSON.parse(fileReader.result)
                        store.undoRedo.clear()
                        applySnapshot(store.document, data)
                    }
                })
                fileReader.readAsText(files[0])
            }
        },
        [store]
    )
    const handleDownload = useCallback(() => {
        const blob = new Blob([JSON.stringify(getSnapshot(store.document))], {
            type: 'text/plain;charset=utf-8',
        })
        FileSaver.saveAs(blob, 'test.json')
    }, [store])
    return (
        <HeaderContainer>
            <span>Untitled</span>
            <IconButton
                icon={DownloadIcon}
                label="Download"
                onClick={handleDownload}
            />
            <FileInput htmlFor="file-upload">
                <input id="file-upload" type="file" onChange={handleUpload} />
                <IconButton icon={UploadIcon} label="Upload" onClick={() => { }} />
            </FileInput>
        </HeaderContainer>
    )
}
