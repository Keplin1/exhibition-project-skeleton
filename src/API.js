import axios from "axios";

const newApi = axios.create({
    baseURL: 'https://api.artic.edu/api/v1/artworks'
});
const searchArtwork = async (searchTerm) => {

    const response = await newApi.get(`search?q=${searchTerm}`)
    return response;
}

export default searchArtwork

// export const getCastById = (show_id) => {

//     return newApi.get(`/shows/${show_id}/cast`).then(({ data }) => {
//         return data
//     })
// }

