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
// // router.get('/playlists', auth.verify, PlaylistController.getPlaylists)
router.get('/maps', MapController.getAllMaps)
router.put('/map/:id', MapController.updateMap)
router.put('/map/:id/name', MapController.updateMapNameById)

module.exports = router