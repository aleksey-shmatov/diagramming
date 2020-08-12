import { Document, Page, undoManager } from './document/document'
import { observable, action } from 'mobx'
import { Instance } from 'mobx-state-tree'
import { UndoManager } from 'mst-middlewares'
import { LibraryItemRef } from './library'
import { generateId } from './util'

export class Store {
    document = Document.create({
        pages: [
            Page.create({
                id: generateId(),
                name: 'Page 1',
                elements: [],
            }),
        ],
    })

    undoRedo: Instance<typeof UndoManager>

    constructor() {
        this.undoRedo = undoManager
    }

    @observable
    zoom: number = 1

    @observable
    libraryItem: LibraryItemRef | null = {
        libraryId: 'shapes',
        id: 'square',
    }

    @action
    changeLibraryItem = (libraryItem: LibraryItemRef | null) => {
        this.libraryItem = libraryItem
    }
}
