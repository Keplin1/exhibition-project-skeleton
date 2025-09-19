import { createContext, useState } from "react";

const ItemContext = createContext();

const ItemProvider = ({ children }) => {
    const [items, setItems] = useState([])

    return <ItemContext.Provider value={{ items, setItems }}>{children}</ItemContext.Provider>

}

export { ItemContext, ItemProvider }