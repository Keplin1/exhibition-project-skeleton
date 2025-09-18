import axios from "axios";

const clevelandApi = axios.create({
    baseURL: 'https://openaccess-api.clevelandart.org/api/artworks/'
});

const vamApi = axios.create({
    baseURL: 'https://api.vam.ac.uk/v2/objects/'
});

// Function to search Cleveland Museum API
const searchClevelandArtwork = async (searchTerm) => {
    const response = await clevelandApi.get(`?q=${searchTerm}&has_image=1&limit=15`);
    return response.data.data;
};

// Function to search V&A Museum API
const searchVamArtwork = async (searchTerm) => {
    const response = await vamApi.get(`search?q=${searchTerm}&images_exist=1&page_size=15`);
    return response.data.records;
};

// Function to normalise Cleveland API data
// because the data structures are different, we need to map them to a common format
const normaliseClevelandData = (artworks) => {
    return artworks.map(artwork => ({
        id: `cleveland-${artwork.id}`,
        title: artwork.title,
        source: 'Cleveland Museum of Art',
        images: {
            web: {
                url: artwork.images?.web?.url || null
            }
        },
        creator: artwork.creators?.[0]?.description || 'Unknown',
        date: artwork.creation_date || '',
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
                title: artwork._primaryTitle || 'Untitled',
                source: 'Victoria & Albert Museum',
                images: {
                    web: {
                        url: fullImageUrl
                    }
                },
                creator: artwork._primaryMaker?.name || 'Unknown',
                date: artwork._primaryDate || '',
                rawData: artwork
            };
        });
};

// Main search function that combines both APIs
const searchArtwork = async (searchTerm) => {
    try {
        // Call both APIs simultaneously
        const [clevelandResults, vamResults] = await Promise.allSettled([
            searchClevelandArtwork(searchTerm),
            searchVamArtwork(searchTerm)
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



// export const getCastById = (show_id) => {

//     return newApi.get(`/shows/${show_id}/cast`).then(({ data }) => {
//         return data
//     })
// }

