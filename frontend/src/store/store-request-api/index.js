/*
    This is our http api, which we use to send requests to
    our back-end API. Note we`re using the Axios library
    for doing this, which is an easy to use AJAX-based
    library. We could (and maybe should) use Fetch, which
    is a native (to browsers) standard, but Axios is easier
    to use when sending JSON back and forth and it`s a Promise-
    based API which helps a lot with asynchronous communication.
    
    @author McKilla Gorilla
*/

import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

// THESE ARE ALL THE REQUESTS WE`LL BE MAKING, ALL REQUESTS HAVE A
// REQUEST METHOD (like get) AND PATH (like /top5list). SOME ALSO
// REQUIRE AN id SO THAT THE SERVER KNOWS ON WHICH LIST TO DO ITS
// WORK, AND SOME REQUIRE DATA, WHICH WE WE WILL FORMAT HERE, FOR WHEN
// WE NEED TO PUT THINGS INTO THE DATABASE OR IF WE HAVE SOME
// CUSTOM FILTERS FOR QUERIES
export const createMap = (payload) => api.post('/api/map/', payload)
export const deleteMapById = (id) => api.delete(`/api/map/${id}`)
export const getMapById = (id) => api.get(`/api/map/${id}`)
export const updateMapNameById = (id, name) => api.put(`/api/map/${id}/name`, { name: name })
export const updateMapById = (id, map) => {
    return api.put(`/api/map/${id}`, {
        // SPECIFY THE PAYLOAD
        map: map
    })
}

export const getAllMaps = () => api.get('/api/maps/')

const apis = {
    createMap,
    deleteMapById,
    getMapById,
    getAllMaps,
    updateMapById,
    updateMapNameById
}

export default apis
