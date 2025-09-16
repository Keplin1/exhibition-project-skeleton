
import { useState } from "react";
const SearchBar = ({ searchTerm, setSearchTerm }) => {
    const presetSearches = ['paintings', 'sculpture', 'modern art', 'photography'];

    const [searchInput, setSearchInput] = useState("");
    const handlePresetClick = (preset) => {
        setSearchTerm(preset);
        // onSearch(preset);
    };

    const handleChange = (event) => {
        setSearchInput(event.target.value);
    }

    const handleSubmit = () => {
        setSearchTerm(searchInput);
        setSearchInput("");
    }


    return (
        <div className="mb-6">
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Search artworks or artists..."
                    value={searchInput}
                    onChange={handleChange}

                    className="flex-1 p-2 border border-gray-300 rounded"
                />
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-black rounded disabled:opacity-50"

                >
                    search
                </button>
            </div>

            <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 mr-2">Quick searches:</span>
                {presetSearches.map((preset) => (
                    <button
                        key={preset}
                        onClick={() => handlePresetClick(preset)}
                        className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300"
                    >
                        {preset}
                    </button>
                ))}
            </div>
        </div>
    );
};
export default SearchBar