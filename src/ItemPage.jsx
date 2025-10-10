import { useParams, Link } from 'react-router-dom';


import { useContext, useEffect } from 'react';
import { ItemContext } from './contexts/ItemContext';
import { useCollection } from './contexts/CollectionContext';
import { enrichVamArtwork } from './utils/artworkEnrichment';

const ItemPage = () => {
    const { itemId } = useParams();

    const { items, setItems } = useContext(ItemContext)

    const { collection, updateCollectionItem } = useCollection();

    // Find the artwork by ID, handling string/number conversion
    let artwork = items.find((currentItem) => currentItem.id.toString() === itemId)
        || collection.find((currentItem) => currentItem.id.toString() === itemId);

    // Fetch V&A details if this is a V&A artwork
    useEffect(() => {
        if (artwork && artwork.systemNumber && !artwork.description) {
            enrichVamArtwork(artwork, items, setItems, collection, updateCollectionItem);
        }
    }, [artwork?.id]);

    // If no artwork data is found, show error
    if (!artwork) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Link
                    to="/"
                    className="inline-block mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Back to Search
                </Link>
                <div className="text-center py-8">
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
            {/* Back Button */}
            <Link
                to="/"
                className="inline-block mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            >
                Back to Search
            </Link>

            {/* Main Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                    {/* Title - Centered at top */}
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight text-center mb-6">
                        {artwork.title || 'Untitled'}
                    </h2>

                    {/* Image Section - Centered */}
                    <div className="flex justify-center mb-6">
                        <div className="max-w-md w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                            {artwork.images?.web?.url ? (
                                <img
                                    src={artwork.images.web.url}
                                    alt={artwork.title || 'Artwork'}
                                    className="w-full h-full object-contain rounded-lg"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div
                                className={`text-gray-400 text-lg ${artwork.images?.web?.url ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
                            >
                                No Image Available
                            </div>
                        </div>
                    </div>

                    {/* Details Section - Centered below image */}
                    <div className="max-w-2xl mx-auto">
                        <div className="space-y-4">

                            {/* Creator */}
                            {artwork.creator && (
                                <div className="border-b border-gray-200 pb-3">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Artist/Creator</h2>
                                    <p className="text-gray-600">
                                        {typeof artwork.creator === 'string' ? artwork.creator : JSON.stringify(artwork.creator)}
                                    </p>
                                </div>
                            )}

                            {/* Date */}
                            {artwork.date && (
                                <div className="border-b border-gray-200 pb-3">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Date</h2>
                                    <p className="text-gray-600">
                                        {typeof artwork.date === 'string' ? artwork.date : JSON.stringify(artwork.date)}
                                    </p>
                                </div>
                            )}

                            {/* Source Museum */}
                            <div className="border-b border-gray-200 pb-3">
                                <h2 className="text-lg font-semibold text-gray-700 mb-1">Collection</h2>
                                <p className="text-gray-600">
                                    {typeof artwork.source === 'string' ? artwork.source : JSON.stringify(artwork.source)}
                                </p>
                            </div>

                            {/* Medium/Technique */}
                            {artwork.materials && (
                                <div className="border-b border-gray-200 pb-3">
                                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Medium/Materials</h2>
                                    <p className="text-gray-600">
                                        {artwork.materials}
                                    </p>
                                </div>
                            )}

                            {/* Description */}
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

                            {/* Museum Link */}
                            {artwork.url && (
                                <div className="pt-4 text-center">
                                    <a
                                        href={artwork.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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