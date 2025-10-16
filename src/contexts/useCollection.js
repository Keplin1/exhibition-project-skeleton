import { useContext } from "react";
import CollectionContext from "./CollectionContext";

// Custom hook to use the collection context, so that we can access the properties
export const useCollection = () => {
    const context = useContext(CollectionContext);
    return context;
};
