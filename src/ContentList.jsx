
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import searchArtwork from './API'
import { ItemContext } from './contexts/ItemContext';


const ContentList = ({ searchTerm, setSearchTerm }) => {

    const [searchedArtworks, setSearchedArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        department: '',
        hasImages: false
    });
    const { setItems } = useContext(ItemContext)
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

    // if (searchedArtworks.length === 0 && searchTerm) {
    //     return (
    //         <div className="text-center py-8">
    //             <p className="text-gray-500">No results found for "{searchTerm}"</p>
    //         </div>
    //     );
    // }

    // Apply filters
    // const filteredArtworks = searchedArtworks.filter(artwork => {
    //     if (filters.department && artwork.department !== filters.department) return false;
    //     if (filters.hasImages && !artwork.hasImage) return false;
    //     return true;
    // });

    const handleItemClick = (artwork) => {
        navigate(`/item/${artwork.id}`);
    };

    return (
        <div>
            {/* Results Count */}
            {/* <div className="mb-4">
                <p className="text-gray-600">
                    Found {searchedArtworks.length} artwork(s)
                </p>
            </div> */}

            {/* Results Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {searchedArtworks.map((artwork) => (
                    <div
                        key={artwork.id}
                        className="border border-gray-300 rounded overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleItemClick(artwork)}
                    >
                        {/* Thumbnail */}
                        <div className="aspect-square bg-gray-200 flex items-center justify-center">
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

                        {/* Title */}
                        <div className="p-3">
                            <h3 className="font-medium text-sm leading-tight overflow-hidden" style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}>
                                {artwork.title || 'Untitled'}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default ContentList;