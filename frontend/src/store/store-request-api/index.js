import axios from 'axios'
axios.defaults.withCredentials = true;
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

export const createMap = (payload) => api.post('/api/map/', payload)
export const deleteMapById = (id) => api.delete(`/api/map/${id}`)
export const getMapById = (id) => api.get(`/api/map/${id}`)
export const updateMapNameById = (id, name) => api.put(`/api/map/${id}/name`, { name: name })
export const getSHP = (id) => api.get(`/api/map/downloadSHP/${id}`);
export const updateMapById = (id, map) => {
    return api.put(`/api/map/${id}`, {
        map: map
    })
}

export const getAllMaps = () => api.get('/api/maps/')

const apis = {
    createMap,
    deleteMapById,
    getMapById,
    getAllMaps,
    getSHP,
    updateMapById,
    updateMapNameById
}

export default apis
