
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import searchArtwork from './API'
import { ItemContext } from './contexts/ItemContext';
import SortControls from './SortControls';
import { useCollection } from './contexts/CollectionContext';

const ContentList = ({ searchTerm }) => {

    const [searchedArtworks, setSearchedArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [viewMode, setViewMode] = useState('grid');
    const [sortOption, setSortOption] = useState(''); // Sorting option

    const { setItems } = useContext(ItemContext);
    const {
        selectedItems,
        addToCollection,
        isInCollection,
        toggleSelection,
        isSelected
    } = useCollection();

    const navigate = useNavigate();


    // API call 
    useEffect(() => {
        if (!searchTerm) return;

        const fetchArtworks = async () => {
            setLoading(true);
            setError(false);
            setErrorMessage("");

            let artworks;

            try {
                artworks = await searchArtwork(searchTerm);
                console.log(artworks);
                setSearchedArtworks(artworks);
                setItems(artworks)
            } catch (error) {
                console.log(error.message);
                setError(true);
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchArtworks();

    }, [searchTerm]);


    const sortArtworks = (artworksToSort) => {
        if (!sortOption) return artworksToSort; // No sorting

        // Create a copy to avoid mutating the original array
        const sorted = [...artworksToSort];

        switch (sortOption) {
            case 'artist-asc':
                return sorted.sort((a, b) =>
                    a.creator.toLowerCase().localeCompare(b.creator.toLowerCase())
                );

            case 'artist-desc':
                return sorted.sort((a, b) =>
                    b.creator.toLowerCase().localeCompare(a.creator.toLowerCase())
                );

            case 'title-asc':
                return sorted.sort((a, b) =>
                    a.title.toLowerCase().localeCompare(b.title.toLowerCase())
                );

            case 'title-desc':
                return sorted.sort((a, b) =>
                    b.title.toLowerCase().localeCompare(a.title.toLowerCase())
                );

            case 'date-asc':
                return sorted.sort((a, b) => {
                    // Extract first year from date string for sorting
                    const yearA = parseInt(a.date.match(/\d+/)?.[0]) || 0;
                    const yearB = parseInt(b.date.match(/\d+/)?.[0]) || 0;
                    return yearA - yearB;
                });

            case 'date-desc':
                return sorted.sort((a, b) => {
                    const yearA = parseInt(a.date.match(/\d+/)?.[0]) || 0;
                    const yearB = parseInt(b.date.match(/\d+/)?.[0]) || 0;
                    return yearB - yearA;
                });

            default:
                return sorted;
        }
    };

    // Apply sorting to artworks
    const sortedArtworks = sortArtworks(searchedArtworks);

    const handleCheckboxClick = (e, artwork) => {
        e.stopPropagation(); // Prevent navigating when clicking checkbox
        toggleSelection(artwork);
    };

    const handleSaveToCollection = () => {
        addToCollection();
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <p>Loading artworks...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {errorMessage}
            </div>
        );
    }

    if (searchedArtworks.length === 0 && searchTerm) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No results found for "{searchTerm}"</p>
            </div>
        );
    }


    const handleItemClick = (artwork) => {
        navigate(`/item/${artwork.id}`);
    };

    return (
        <div>
            {/* Sort Controls */}
            {sortedArtworks.length > 0 && (
                <SortControls sortOption={sortOption} setSortOption={setSortOption} />
            )}

            {/* Save to Collection Button */}
            {selectedItems.length > 0 && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded flex justify-between items-center">
                    <span className="text-green-800 font-medium">
                        {selectedItems.length} artwork(s) selected
                    </span>
                    <button
                        onClick={handleSaveToCollection}
                        className="px-4 py-2 bg-green-200 text-gray-800 rounded hover:bg-green-300"
                    >
                        Save to My Collection
                    </button>
                </div>
            )}

            {/* Results Count */}
            <div className="mb-4">
                <p className="text-gray-600">
                    Found {sortedArtworks.length} artwork(s)
                </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sortedArtworks.map((artwork) => (
                    <div
                        key={artwork.id}
                        className="border border-gray-300 rounded overflow-hidden hover:shadow-lg transition-shadow relative"
                    >
                        {/* Checkbox - Top Right */}
                        <div className="absolute top-2 right-2 z-10">
                            <input
                                type="checkbox"
                                checked={isSelected(artwork.id)}
                                onChange={(e) => handleCheckboxClick(e, artwork)}
                                className="w-5 h-5 cursor-pointer"
                                disabled={isInCollection(artwork.id)}
                            />
                        </div>

                        {/* Already in Collection Badge */}
                        {isInCollection(artwork.id) && (
                            <div className="absolute top-2 left-2 z-10 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                Saved
                            </div>
                        )}

                        {/* Thumbnail - clickable */}
                        <div
                            onClick={() => handleItemClick(artwork)}
                            className="aspect-square bg-gray-200 flex items-center justify-center cursor-pointer"
                        >
                            {artwork.images.web.url ? (
                                <img
                                    src={artwork.images.web.url}
                                    alt={artwork.title || 'Artwork'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <div
                                className={`text-gray-500 text-sm ${artwork.images.web.url ? 'hidden' : 'block'}`}
                            >
                                No Image
                            </div>
                        </div>

                        {/* Title and Creator - clickable */}
                        <div
                            onClick={() => handleItemClick(artwork)}
                            className="p-3 cursor-pointer"
                        >
                            <h3 className="font-medium text-sm leading-tight overflow-hidden mb-1" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {artwork.title || 'Untitled'}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                                {artwork.creator || 'Unknown'}
                            </p>
                            {artwork.date && (
                                <p className="text-xs text-gray-400 truncate mt-1">
                                    {artwork.date}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ContentList;