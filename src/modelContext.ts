import React, { useContext } from 'react'
import { Store } from 'model/store'

export const defaultStore = new Store()

export const modelContext = React.createContext<Store>(defaultStore)

export const Provider = modelContext.Provider

export const useStore = () => {
    const data = useContext(modelContext)
    return data
}
