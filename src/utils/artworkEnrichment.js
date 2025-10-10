import { fetchVamArtworkDetails } from '../API';

/**
 * Enriches a V&A artwork with full details (description, materials, etc.)
 * and updates it in both items and collection arrays
 * @param {Object} artwork - The artwork to enrich
 * @param {Array} items - The items array
 * @param {Function} setItems - Function to update items array
 * @param {Array} collection - The collection array
 * @param {Function} updateCollectionItem - Function to update collection
 */
export const enrichVamArtwork = async (artwork, items, setItems, collection, updateCollectionItem) => {
    if (!artwork.systemNumber || artwork.description) {
        // Not a V&A artwork or already enriched
        return;
    }

    try {
        const details = await fetchVamArtworkDetails(artwork.systemNumber);

        // Update the artwork with fetched details
        const enrichedArtwork = {
            ...artwork,
            description: details.summaryDescription || null,
            materials: details.materialsAndTechniques || null
        };

        // Update (replace) the item in items array
        const itemIndex = items.findIndex(item => item.id === artwork.id);
        if (itemIndex !== -1) {
            const newItems = [...items];
            newItems[itemIndex] = enrichedArtwork;
            setItems(newItems);
        }

        // Update in collection array if present
        const collectionIndex = collection.findIndex(item => item.id === artwork.id);
        if (collectionIndex !== -1) {
            updateCollectionItem(artwork.id, enrichedArtwork);
        }
    } catch (error) {
        console.error('Error enriching V&A artwork:', error);
    }
};
