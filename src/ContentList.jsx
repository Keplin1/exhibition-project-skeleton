
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

    // Helper to update artworks state
    const updateArtworks = (newArtworks, append = false) => {
        const updatedList = append ? [...searchedArtworks, ...newArtworks] : newArtworks;
        setSearchedArtworks(updatedList);
        setItems(updatedList);
    };

    // Initial fetch - replaces existing artworks
    const fetchInitialArtworks = async () => {

        // Reset our states
        setLoading(true);
        setErrorMessage("");
        setCurrentPage(1);
        setHasMore(true);

        try {
            // Try to find artworks based on the search term
            const artworks = await searchArtwork(searchTerm, 1);

            console.log(artworks);

            // Update our artworks state/ array
            updateArtworks(artworks);
            // Determine whether we have more results to load or not
            setHasMore(artworks.length >= 30);
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Load more - appends to existing artworks
    const loadMoreArtworks = async () => {
        // If there is nothing more to load or already loading, do nothing
        if (loadingMore || !hasMore) {
            return;
        }

        // Say that we are loading more artworks to the user
        setLoadingMore(true);

        // Determine the next page to load
        const nextPage = currentPage + 1;

        try {
            // Find more artworks to display, based on search term and our determined next page
            const artworks = await searchArtwork(searchTerm, nextPage);

            // If we have artworks from the result of the call, append them to our array
            if (artworks.length > 0) {
                // Filter out any duplicates before appending
                const existingIds = new Set(searchedArtworks.map(a => a.id));
                const newArtworks = artworks.filter(artwork => !existingIds.has(artwork.id));

                if (newArtworks.length > 0) {
                    updateArtworks(newArtworks, true);
                }
                setCurrentPage(nextPage);
            }

            // If we have less than 30 results, say that we don't have more
            setHasMore(artworks.length >= 30);
        } catch (error) {
            console.error('Error loading more artworks:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    // API call - Initial fetch of the artworks based on search term
    useEffect(() => {

        // Don't search if searchTerm is empty
        if (!searchTerm) {
            return;
        }

        // Fire off the request(s) to fetch the artworks
        fetchInitialArtworks();
    }, [searchTerm]);

    // Infinite scroll handler
    useEffect(() => {
        const handleScroll = () => {
            // Check if user is near bottom (within 500px - so that we can fetch more before they actually reach the bottom)
            const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500;

            if (scrolledToBottom && !loadingMore && hasMore && searchedArtworks.length > 0) {
                loadMoreArtworks();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingMore, hasMore, searchedArtworks, currentPage]);


    // The sorting function
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

    if (loading) {
        return (
            <div className="text-center py-8" role="status" aria-live="polite">
                <p>Loading artworks...</p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded" role="alert" aria-live="assertive">
                {errorMessage}
            </div>
        );
    }

    if (searchedArtworks.length === 0 && searchTerm) {
        return (
            <div className="text-center py-8" role="status">
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
                <div
                    className="fixed bottom-6 left-0 right-0 z-2 px-4 animate-slide-up"
                    role="status"
                    aria-live="polite"
                >
                    <div className="max-w-4xl mx-auto p-3 bg-green-50 border border-green-200 rounded flex justify-between items-center shadow-lg">
                        <span className="text-green-800 font-medium" aria-label={`${selectedItems.length} artworks selected`}>
                            {selectedItems.length} artwork(s) selected
                        </span>
                        <button
                            onClick={addToCollection}
                            className="px-4 py-2 bg-green-200 text-gray-800 rounded hover:bg-green-300"
                            aria-label={`Save ${selectedItems.length} selected artworks to collection`}
                        >
                            Save to My Collection
                        </button>
                    </div>
                </div>
            )}

            {/* Results Grid */}
            <div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-24"
                role="list"
                aria-label={`Search results for ${searchTerm}: ${sortedArtworks.length} artworks found`}
            >
                {sortedArtworks.map((artwork) => (
                    <div
                        key={artwork.id}
                        className="border border-gray-300 rounded overflow-hidden hover:shadow-lg transition-shadow relative"
                        role="listitem"
                    >
                        {/* Checkbox - Top Right */}
                        <div className="absolute top-2 right-2 z-1">
                            <input
                                type="checkbox"
                                checked={isSelected(artwork.id)}
                                onChange={(e) => {
                                    e.stopPropagation();
                                    toggleSelection(artwork);
                                }}
                                className="w-5 h-5 cursor-pointer"
                                disabled={isInCollection(artwork.id)}
                                aria-label={`Select ${artwork.title || 'Untitled'} by ${artwork.creator || 'Unknown artist'}${isInCollection(artwork.id) ? ' (already in collection)' : ''}`}
                                aria-checked={isSelected(artwork.id)}
                            />
                        </div>

                        {/* Already in Collection Badge */}
                        {isInCollection(artwork.id) && (
                            <div
                                className="absolute top-2 left-2 z-1 bg-green-600 text-white text-xs px-2 py-1 rounded"
                                role="status"
                                aria-label="This artwork is already saved in your collection"
                            >
                                Saved
                            </div>
                        )}

                        {/* Thumbnail - clickable */}
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
                                    alt={`${artwork.title || 'Untitled'} by ${artwork.creator || 'Unknown artist'}${artwork.date ? `, ${artwork.date}` : ''}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            ) : null}
                            <div
                                className={`text-gray-500 text-sm ${artwork.image ? 'hidden' : 'block'}`}
                                aria-label="No image available for this artwork"
                            >
                                No Image
                            </div>
                        </div>

                        {/* Title and Creator - clickable */}
                        <div
                            onClick={() => handleItemClick(artwork)}
                            className="p-3 cursor-pointer"
                            role="button"
                            tabIndex={0}
                            aria-label={`View details for ${artwork.title || 'Untitled'} by ${artwork.creator || 'Unknown'}`}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleItemClick(artwork);
                                }
                            }}
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
                <div className="text-center py-8" role="status" aria-live="polite" aria-busy="true">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" aria-hidden="true"></div>
                    <p className="mt-2 text-gray-600">Loading more artworks...</p>
                </div>
            )}

            {/* No More Results Message */}
            {!hasMore && searchedArtworks.length > 0 && (
                <div className="text-center py-8" role="status">
                    <p className="text-gray-500">No more artworks to load</p>
                </div>
            )}
        </div>
    );
};

export default ContentList;