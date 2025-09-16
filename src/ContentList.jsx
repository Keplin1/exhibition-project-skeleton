import { useState, useEffect } from 'react';
import searchArtwork from './API'


const ContentList = ({ searchTerm, setSearchTerm }) => {

    const [searchedArtworks, setSearchedArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        department: '',
        hasImages: false
    });


    const departments = [
        'European Paintings',
        'Asian Art',
        'Greek and Roman Art',
        'Modern Art',
        'Photography'
    ];



    // Simulate API call
    useEffect(() => {
        setLoading(true);
        setError(false);

        fetch(searchArtwork(searchTerm)).then((response) => {
            return (response.json())
        }).then((data) => {
            if (!data || data.length === 0) {
                return Promise.reject({ message: 'Something went wrong' })
            }

            setSearchedArtworks(data);
            console.log(data)

        }).catch((err) => {
            setError(true)
        }).finally(() => {
            setLoading(false)
        })
    }, [searchTerm]);

    if (loading) {
        return (
            <div className="content-list">
                <p>Loading... please wait </p>
            </div>
        )

    }

    if (error) {
        return (
            <div>
                <p>Something went wrong</p>

            </div>
        )
    }


    // Apply filters
    const filteredArtworks = searchedArtworks.filter(artwork => {
        if (filters.department && artwork.department !== filters.department) return false;
        if (filters.hasImages && !artwork.hasImage) return false;
        return true;
    });

    return (
        <div className="max-w-4xl mx-auto p-4">

            {/* Filters */}
            {searchedArtworks.length > 0 && (
                <div className="mb-6 p-4 bg-gray-100 rounded">
                    <h3 className="font-medium mb-3">Filters</h3>
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm mb-1">Department:</label>
                            <select
                                value={filters.department}
                                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                                className="p-2 border border-gray-300 rounded"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hasImages"
                                checked={filters.hasImages}
                                onChange={(e) => setFilters({ ...filters, hasImages: e.target.checked })}
                                className="mr-2"
                            />
                            <label htmlFor="hasImages" className="text-sm">Only with images</label>
                        </div>
                    </div>

                    <button
                        onClick={() => setFilters({ department: '', hasImages: false })}
                        className="mt-2 text-blue-600 text-sm hover:underline"
                    >
                        Reset filters
                    </button>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Results */}
            <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'p-4'}>
                <h3 className="font-medium text-gray-900 truncate">{searchArtwork.title}</h3>

                <p className="text-sm text-gray-600 mt-1">{searchArtwork.artist}</p>
            </div>


        </div >

    )

}


export default ContentList;