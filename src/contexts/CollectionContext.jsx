import { createContext, useState, useContext } from "react";

const CollectionContext = createContext();

// Custom hook to use the collection context
export const useCollection = () => {
    const context = useContext(CollectionContext);
    if (!context) {
        throw new Error('useCollection must be used within a CollectionProvider');
    }
    return context;
};

export const CollectionProvider = ({ children }) => {
    const [collection, setCollection] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    // Add artwork to collection
    const addToCollection = () => {
        // Add only items that aren't already in collection
        const newItems = selectedItems.filter(
            item => !collection.some(collectionItem => collectionItem.id === item.id)
        );
        setCollection([...collection, ...newItems]);
        setSelectedItems([]); // Clear selection after saving
    };

    // Remove artwork from collection
    const removeFromCollection = (artworkId) => {
        setCollection(collection.filter(item => item.id !== artworkId));
    };

    // Update artwork in collection
    const updateCollectionItem = (artworkId, updatedArtwork) => {
        setCollection(collection.map(item =>
            item.id === artworkId ? updatedArtwork : item
        ));
    };

    // Check if artwork is in collection
    const isInCollection = (artworkId) => {
        return collection.some(item => item.id === artworkId);
    };

    // Toggle selection for an artwork
    const toggleSelection = (artwork) => {
        const isSelected = selectedItems.some(item => item.id === artwork.id);
        if (isSelected) {
            setSelectedItems(selectedItems.filter(item => item.id !== artwork.id));
        } else {
            setSelectedItems([...selectedItems, artwork]);
        }
    };

    // Check if artwork is selected
    const isSelected = (artworkId) => {
        return selectedItems.some(item => item.id === artworkId);
    };

    const value = {
        collection,
        selectedItems,
        addToCollection,
        removeFromCollection,
        updateCollectionItem,
        isInCollection,
        toggleSelection,
        isSelected
    };

    return (
        <CollectionContext.Provider value={value}>
            {children}
        </CollectionContext.Provider>
    );
};

export default CollectionContext;