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
router.delete('/map/:id', auth.verify, MapController.deleteMap)
router.get('/map/:id', MapController.getMapById)
router.get('/mappairs', auth.verify, MapController.getMapPairs)
// // router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
// router.get('/playlists', PlaylistController.getPlaylists)
router.put('/map/:id', MapController.updateMap)

module.exports = router