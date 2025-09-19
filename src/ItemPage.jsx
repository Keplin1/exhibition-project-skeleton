import { useParams, Link } from 'react-router-dom';


import { useContext } from 'react';
import { ItemContext } from './contexts/ItemContext';

const ItemPage = () => {
    const { itemId } = useParams();

    const { items } = useContext(ItemContext)

    // Find the artwork by ID, handling string/number conversion
    const artwork = items.find((currentItem) => currentItem.id.toString() === itemId);

    // If no artwork data is found, show error
    if (!artwork) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <Link
                    to="/"
                    className="inline-block mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    ← Back to Search
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
                ← Back to Search
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

                            {/* Additional Details from Raw Data */}
                            {artwork.rawData && (
                                <div className="space-y-3">
                                    {/* Medium/Technique */}
                                    {(artwork.rawData.technique || artwork.rawData.medium || artwork.rawData.materials) && (
                                        <div className="border-b border-gray-200 pb-3">
                                            <h2 className="text-lg font-semibold text-gray-700 mb-1">Medium/Materials</h2>
                                            <p className="text-gray-600">
                                                {(() => {
                                                    const technique = artwork.rawData.technique;
                                                    const medium = artwork.rawData.medium;
                                                    const materials = artwork.rawData.materials;

                                                    if (technique && typeof technique === 'string') return technique;
                                                    if (medium && typeof medium === 'string') return medium;
                                                    if (materials && Array.isArray(materials)) return materials.join(', ');
                                                    if (materials && typeof materials === 'string') return materials;

                                                    // Fallback for objects
                                                    return JSON.stringify(technique || medium || materials);
                                                })()}
                                            </p>
                                        </div>
                                    )}

                                    {/* Description */}
                                    {(artwork.rawData.wall_description || artwork.rawData.description || artwork.rawData.briefDescription) && (
                                        <div className="border-b border-gray-200 pb-3">
                                            <h2 className="text-lg font-semibold text-gray-700 mb-1">Description</h2>
                                            <p className="text-gray-600 leading-relaxed">
                                                {(() => {
                                                    const description = artwork.rawData.wall_description ||
                                                        artwork.rawData.description ||
                                                        artwork.rawData.briefDescription;
                                                    return typeof description === 'string' ? description : JSON.stringify(description);
                                                })()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Museum Link */}
                            {artwork.rawData?.url && (
                                <div className="pt-4 text-center">
                                    <a
                                        href={artwork.rawData.url}
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