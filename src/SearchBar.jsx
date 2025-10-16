
import { useState, useEffect } from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {

    const presetSearches = ['sculpture', 'modern art', 'photography', 'landscapes', 'van Gogh', 'portraits', 'victorian art', 'ancient art'];

    const [searchInput, setSearchInput] = useState(searchTerm || "");

    // Sync searchInput with searchTerm when it changes externally
    useEffect(() => {
        setSearchInput(searchTerm || "");
    }, [searchTerm]);

    const handlePresetClick = (preset) => {
        setSearchTerm(preset);
    };

    const handleChange = (event) => {
        setSearchInput(event.target.value);
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleSubmit()
        }
    }
    const handleSubmit = () => {
        setSearchTerm(searchInput);
    }


    return (
        <div className="mb-6">
            <div className="flex gap-2 mb-4" role="search">
                <input
                    type="text"
                    placeholder="Search artworks or artists..."
                    value={searchInput}
                    onChange={handleChange}
                    onKeyDown={handleKeyPress}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    aria-label="Search for artworks or artists"
                    id="artwork-search"
                />
                <button
                    onClick={handleSubmit}
                    className="px-6 py-4 bg-blue-200 text-black rounded disabled:opacity-50"
                    aria-label="Submit search"
                    title="Search for artworks"
                >
                    search
                </button>


            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Quick search suggestions">
                <span className="text-sm text-gray-700 mr-2 mt-4" aria-hidden="true">Quick searches:</span>
                {presetSearches.map((preset) => (
                    <button
                        key={preset}
                        onClick={() => handlePresetClick(preset)}
                        className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                        aria-label={`Quick search for ${preset}`}
                        title={`Search for ${preset}`}
                    >
                        {preset}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default SearchBar