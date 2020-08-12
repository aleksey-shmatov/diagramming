import React from 'react'
import { ElementModel } from 'model/document/document'
import { observer } from 'mobx-react-lite'
import { SVGRenderer } from 'parts/svg'

type Props = {
    element: ElementModel
}

export const CanvasElement = observer(({ element }: Props) => {
    if (element.type === 'shape') {
        const source = `${process.env.PUBLIC_URL}/libraries/${element.libraryItem.libraryId}/${element.libraryItem.id}.svg`
        return (
            <SVGRenderer
                key={element.id}
                elementId={element.id}
                source={source}
                stroke={element.stroke}
                fill={element.fill}
                rough={element.rough}
                transform={element.transform}
            />
        )
    }
    throw new Error(`Unsupported element type ${element.type}`)
})
