export type LibraryItemType = 'shape'

export type LibraryItem = {
    libraryId: string
    id: string
    name: string
    tags: string
    type: LibraryItemType
    width: number
    height: number
}

export type LibraryItemRef = {
    libraryId: string
    id: string
}

export type Library = {
    id: string
    name: string
    shapes: LibraryItem[]
}

export type LibraryRef = {
    id: string
    name: string
}
