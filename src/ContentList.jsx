
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import searchArtwork from './API'
import { ItemContext } from './contexts/ItemContext';
import SortControls from './SortControls';
import { useCollection } from './contexts/CollectionContext';
import { parseHistoricalDate } from './utils/sorting'

const ContentList = ({ searchTerm }) => {

    const [searchedArtworks, setSearchedArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [sortOption, setSortOption] = useState(''); // Sorting option
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { setItems } = useContext(ItemContext);
    const {
        selectedItems,
        addToCollection,
        isInCollection,
        toggleSelection,
        isSelected
    } = useCollection();

    const navigate = useNavigate();


    // API call - Initial fetch
    useEffect(() => {
        if (!searchTerm) return;

        const fetchArtworks = async () => {
            setLoading(true);
            setError(false);
            setErrorMessage("");
            setCurrentPage(1);
            setHasMore(true);

            let artworks;

            try {
                artworks = await searchArtwork(searchTerm, 1);
                console.log(artworks);
                setSearchedArtworks(artworks);
                setItems(artworks);

                // If we got fewer results than expected, there might not be more
                if (artworks.length < 30) {
                    setHasMore(false);
                }
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

    // Load more artworks
    const loadMoreArtworks = async () => {
        if (loadingMore || !hasMore) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;

        try {
            const moreArtworks = await searchArtwork(searchTerm, nextPage);

            if (moreArtworks.length === 0) {
                setHasMore(false);
            } else {
                const updatedArtworks = [...searchedArtworks, ...moreArtworks];
                setSearchedArtworks(updatedArtworks);
                setItems(updatedArtworks);
                setCurrentPage(nextPage);

                // If we got fewer results than expected, no more pages
                if (moreArtworks.length < 30) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error('Error loading more artworks:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            // Check if user is near bottom (within 500px)
            const scrolledToBottom =
                window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500;

            if (scrolledToBottom && !loadingMore && hasMore && searchedArtworks.length > 0) {
                loadMoreArtworks();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore, hasMore, searchedArtworks, currentPage]);


    const sortArtworks = (artworksToSort, sortOption) => {
        if (!sortOption) return artworksToSort;

        const sorted = [...artworksToSort];

        const compareByDate = (a, b, ascending = true) => {
            const yearA = parseHistoricalDate(a.date);
            const yearB = parseHistoricalDate(b.date);
            return ascending ? yearA - yearB : yearB - yearA;
        };

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
                return sorted.sort((a, b) => compareByDate(a, b, true));

            case 'date-desc':
                return sorted.sort((a, b) => compareByDate(a, b, false));

            default:
                return sorted;
        }
    };

    // Apply sorting to artworks
    const sortedArtworks = sortArtworks(searchedArtworks, sortOption);

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
                <div className="fixed bottom-6 left-0 right-0 z-2 px-4 animate-slide-up">
                    <div className="max-w-4xl mx-auto p-3 bg-green-50 border border-green-200 rounded flex justify-between items-center shadow-lg">
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
                </div>
            )}

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24">
                {sortedArtworks.map((artwork) => (
                    <div
                        key={artwork.id}
                        className="border border-gray-300 rounded overflow-hidden hover:shadow-lg transition-shadow relative"
                    >
                        {/* Checkbox - Top Right */}
                        <div className="absolute top-2 right-2 z-1">
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
                            <div className="absolute top-2 left-2 z-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                Saved
                            </div>
                        )}

                        {/* Thumbnail - clickable */}
                        <div
                            onClick={() => handleItemClick(artwork)}
                            className="aspect-square bg-gray-200 flex items-center justify-center cursor-pointer"
                        >
                            {artwork.image ? (
                                <img
                                    src={artwork.image}
                                    alt={artwork.title || 'Artwork'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <div
                                className={`text-gray-500 text-sm ${artwork.image ? 'hidden' : 'block'}`}
                            >
                                No Image
                            </div>
                        </div>

                        {/* Title and Creator - clickable */}
                        <div
                            onClick={() => handleItemClick(artwork)}
                            className="p-3 cursor-pointer"
                        >
                            <h3 className="font-medium text-sm leading-tight overflow-hidden mb-1 line-clamp-2">
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

            {/* Loading More Spinner */}
            {loadingMore && (
                <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-2 text-gray-600">Loading more artworks...</p>
                </div>
            )}

            {/* No More Results Message */}
            {!hasMore && searchedArtworks.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No more artworks to load</p>
                </div>
            )}
        </div>
    );
};

export default ContentList;