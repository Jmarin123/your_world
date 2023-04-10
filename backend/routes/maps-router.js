/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const MapController = require('../controllers/map-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/map', auth.verify, MapController.createMap)
// router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist)
// router.get('/playlist/:id', PlaylistController.getPlaylistById)
// router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs)
// // router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
// router.get('/playlists', PlaylistController.getPlaylists)
// router.put('/playlist/:id', PlaylistController.updatePlaylist)

module.exports = router