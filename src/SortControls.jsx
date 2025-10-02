const SortControls = ({ sortOption, setSortOption }) => {
    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    return (
        <div className="mb-4 p-3 bg-gray-100 rounded">
            <div className="flex items-center gap-3">
                <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">
                    Sort by:
                </label>

                <select
                    id="sort-select"
                    value={sortOption}
                    onChange={handleSortChange}
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option value="">None</option>
                    <option value="artist-asc">Artist Name (A → Z)</option>
                    <option value="artist-desc">Artist Name (Z → A)</option>
                    <option value="title-asc">Artwork Name (A → Z)</option>
                    <option value="title-desc">Artwork Name (Z → A)</option>
                    <option value="date-asc">Creation Date (Oldest First)</option>
                    <option value="date-desc">Creation Date (Newest First)</option>
                </select>
            </div>
        </div>
    );
};

export default SortControls;