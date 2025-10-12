import { useParams, Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { ItemContext } from './contexts/ItemContext';
import { useCollection } from './contexts/CollectionContext';
import { enrichVamArtwork } from './utils/artworkEnrichment';

const ItemPage = () => {
    const { itemId } = useParams();
    const { items, setItems } = useContext(ItemContext);
    const { collection, updateCollectionItem } = useCollection();

    const [artwork, setArtwork] = useState(null);
    const [enrichmentAttempted, setEnrichmentAttempted] = useState(false);

    // Look up artwork and reset enrichment flag when itemId changes
    useEffect(() => {
        const foundArtwork = items.find((currentItem) => currentItem.id.toString() === itemId)
            || collection.find((currentItem) => currentItem.id.toString() === itemId);

        if (foundArtwork) {
            setArtwork(foundArtwork);
        }

        setEnrichmentAttempted(false);
    }, [itemId]);

    // Fetch V&A details if needed
    useEffect(() => {
        if (enrichmentAttempted || !artwork) return;
        if (!artwork.systemNumber || artwork.description) return;

        setEnrichmentAttempted(true);
        enrichVamArtwork(artwork, items, setItems, collection, updateCollectionItem, setArtwork);
    }, [artwork, enrichmentAttempted]);

    if (!artwork) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Link
                    to="/"
                    className="inline-block mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    aria-label="Go back to search page"
                >
                    Back to Search
                </Link>
                <div className="text-center py-8" role="alert">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Artwork Not Found</h2>
                    <p className="text-gray-600 mb-4">
                        Sorry, we couldn't find this artwork. It may have been from a previous search session.
                    </p>
                    <p className="text-sm text-gray-500">
                        Try searching again to find artworks to explore.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <Link
                to="/"
                className="inline-block mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                aria-label="Go back to search page"
            >
                Back to Search
            </Link>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight text-center mb-6">
                        {artwork.title || 'Untitled'}
                    </h2>

                    <div className="flex justify-center mb-6">
                        <div className="max-w-md w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                            {artwork.image ? (
                                <img
                                    src={artwork.image}
                                    alt={`${artwork.title || 'Untitled'} by ${artwork.creator || 'Unknown artist'}${artwork.date ? `, created ${artwork.date}` : ''}`}
                                    className="w-full h-full object-contain rounded-lg"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div
                                className={`text-gray-400 text-lg ${artwork.image ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
                                aria-label="No image available for this artwork"
                            >
                                No Image Available
                            </div>
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <div className="space-y-4">
                            {artwork.creator && (
                                <div className="border-b border-gray-200 pb-3">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Artist/Creator</h2>
                                    <p className="text-gray-600">
                                        {typeof artwork.creator === 'string' ? artwork.creator : JSON.stringify(artwork.creator)}
                                    </p>
                                </div>
                            )}

                            {artwork.date && (
                                <div className="border-b border-gray-200 pb-3">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Date</h2>
                                    <p className="text-gray-600">
                                        {typeof artwork.date === 'string' ? artwork.date : JSON.stringify(artwork.date)}
                                    </p>
                                </div>
                            )}

                            <div className="border-b border-gray-200 pb-3">
                                <h2 className="text-lg font-semibold text-gray-700 mb-1">Collection</h2>
                                <p className="text-gray-600">
                                    {typeof artwork.source === 'string' ? artwork.source : JSON.stringify(artwork.source)}
                                </p>
                            </div>

                            {artwork.materials && (
                                <div className="border-b border-gray-200 pb-3">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Medium/Materials</h2>
                                    <p className="text-gray-600">
                                        {artwork.materials}
                                    </p>
                                </div>
                            )}

                            {artwork.description && (
                                <div className="border-b border-gray-200 pb-3">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Description</h2>
                                    <p
                                        className="text-gray-600 leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: artwork.description
                                        }}
                                    />
                                </div>
                            )}

                            {artwork.url && (
                                <div className="pt-4 text-center">
                                    <a
                                        href={artwork.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                        aria-label={`View ${artwork.title || 'this artwork'} on the museum website (opens in new tab)`}
                                    >
                                        View on Museum Website
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemPage;