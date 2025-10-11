import axios from "axios";

const clevelandApi = axios.create({
    baseURL: 'https://openaccess-api.clevelandart.org/api/artworks/'
});

const vamApi = axios.create({
    baseURL: 'https://api.vam.ac.uk/v2/objects/'
});

// Function to search Cleveland Museum API
const searchClevelandArtworks = async (searchTerm) => {
    const response = await clevelandApi.get(`?q=${searchTerm}&has_image=1&limit=15`);
    return response.data.data;
};

// Function to search V&A Museum API
const searchVamArtworks = async (searchTerm) => {
    const response = await vamApi.get(`search?q=${searchTerm}&images_exist=1&page_size=15`);
    return response.data.records;
};

// Function to fetch full V&A artwork details (including description)
export const fetchVamArtworkDetails = async (systemNumber) => {
    const response = await axios.get(`https://api.vam.ac.uk/v2/object/${systemNumber}`);
    return response.data.record;
};

// Function to normalise Cleveland API data
// because the data structures are different, we need to map them to a common format
const normaliseClevelandData = (artworks) => {
    return artworks.map(artwork => ({
        id: `cleveland-${artwork.id}`,
        title: artwork.title,
        source: 'Cleveland Museum of Art',
        image: artwork.images?.web?.url || null,
        creator: artwork.creators?.[0]?.description || 'Unknown',
        date: artwork.creation_date || '',
        url: artwork.url || null,
        description: artwork.wall_description || artwork.description || null,
        materials: artwork.technique || null,
        rawData: artwork
    }));
};

// Function to normalise V&A API data
// because the data structures are different, we need to map them to a common format
const normaliseVamData = (artworks) => {
    return artworks
        .map(artwork => {
            // Convert thumbnail URL to full size URL
            const thumbnailUrl = artwork._images._primary_thumbnail;
            const fullImageUrl = thumbnailUrl ? thumbnailUrl.replace('/!100,100/', '/full/') : null;

            return {
                id: `vam-${artwork.systemNumber}`,
                systemNumber: artwork.systemNumber,
                title: artwork._primaryTitle || 'Untitled',
                source: 'Victoria & Albert Museum',
                image: fullImageUrl,
                creator: artwork._primaryMaker?.name || 'Unknown',
                date: artwork._primaryDate || '',
                url: `https://collections.vam.ac.uk/item/${artwork.systemNumber}/`,
                description: null, // Will be fetched later when viewing item details
                materials: null, // Will be fetched later when viewing item details
                rawData: artwork
            };
        });
};

// Main search function that combines both APIs
const searchArtwork = async (searchTerm) => {
    try {
        // Call both APIs simultaneously
        const [clevelandResults, vamResults] = await Promise.allSettled([
            searchClevelandArtworks(searchTerm),
            searchVamArtworks(searchTerm)
        ]);

        let combinedResults = [];

        // Process Cleveland results
        if (clevelandResults.status === 'fulfilled') {
            const normalisedCleveland = normaliseClevelandData(clevelandResults.value);
            combinedResults = [...combinedResults, ...normalisedCleveland];
        } else {
            console.warn('Cleveland API failed:', clevelandResults.reason);
        }

        // Process V&A results
        if (vamResults.status === 'fulfilled') {
            const normalisedVam = normaliseVamData(vamResults.value);
            combinedResults = [...combinedResults, ...normalisedVam];
        } else {
            console.warn('V&A API failed:', vamResults.reason);
        }

        // return combined and normalised results
        return combinedResults;
    } catch (error) {
        console.error('Error searching artworks:', error);
        throw error;
    }
};

export default searchArtwork;