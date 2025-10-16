import { Link, useNavigate } from 'react-router-dom';
import { useCollection } from './contexts/CollectionContext';

const CollectionPage = () => {
    const { collection, removeFromCollection } = useCollection();
    const navigate = useNavigate();

    const handleItemClick = (artwork) => {
        navigate(`/item/${artwork.id}`);
    };

    if (collection.length === 0) {
        return (
            <div>
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 px-6 py-4 bg-blue-200 text-black rounded"
                    aria-label="Go back to search page"
                    title="Return to search page"
                >
                    Back to Search
                </button>

                <div className="py-12 min-h-[600px]" role="status">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Collection is Empty</h2>
                        <p className="text-gray-600 mb-6">
                            Start adding artworks to your collection from the search page!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-4 bg-blue-200 text-black rounded"
                            aria-label="Browse artworks to add to your collection"
                            title="Browse artworks to add to your collection"
                        >
                            Browse Artworks
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => navigate('/')}
                className="mb-6 px-6 py-4 bg-blue-200 text-black rounded"
                aria-label="Go back to search page"
                title="Return to search page"
            >
                Back to Search
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-12">
                My Collection ({collection.length} {collection.length === 1 ? 'artwork' : 'artworks'})
            </h2>

            {/* Collection Grid - Centered with max width */}
            <div className="max-w-6xl mx-auto">
                <div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24"
                    role="list"
                    aria-label={`Your saved collection: ${collection.length} ${collection.length === 1 ? 'artwork' : 'artworks'}`}
                >
                    {collection.map((artwork) => (
                        <div
                            key={artwork.id}
                            className="border border-gray-300 rounded overflow-hidden hover:shadow-lg transition-shadow"
                            role="listitem"
                        >
                            {/* Thumbnail - clickable to view details */}
                            <div
                                onClick={() => handleItemClick(artwork)}
                                className="aspect-square bg-gray-200 flex items-center justify-center cursor-pointer"
                                role="button"
                                tabIndex={0}
                                aria-label={`View details for ${artwork.title || 'Untitled'}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleItemClick(artwork);
                                    }
                                }}
                            >
                                {artwork.image ? (
                                    <img
                                        src={artwork.image}
                                        alt={`${artwork.title || 'Untitled'} by ${artwork.creator || 'Unknown artist'}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-500 text-sm" aria-label="No image available">No Image</div>
                                )}
                            </div>

                            {/* Info and Remove Button */}
                            <div className="p-3">
                                <h3
                                    onClick={() => handleItemClick(artwork)}
                                    className="font-medium text-sm leading-tight overflow-hidden mb-1 cursor-pointer hover:text-blue-600"
                                    style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}
                                    role="button"
                                    tabIndex={0}
                                    aria-label={`View details for ${artwork.title || 'Untitled'}`}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleItemClick(artwork);
                                        }
                                    }}
                                >
                                    {artwork.title || 'Untitled'}
                                </h3>
                                <p className="text-xs text-gray-500 truncate mb-2">
                                    {artwork.creator || 'Unknown'}
                                </p>

                                <button
                                    onClick={() => removeFromCollection(artwork.id)}
                                    className="w-full text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                    aria-label={`Remove ${artwork.title || 'Untitled'} from collection`}
                                    title={`Remove ${artwork.title || 'Untitled'} from your collection`}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollectionPage;