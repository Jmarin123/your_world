const express = require('express')
const MapController = require('../controllers/map-controller')
const router = express.Router()
const auth = require('../auth')

router.post('/map', MapController.createMap) // auth.verify
router.delete('/map/:id', MapController.deleteMap) //auth.verify
router.get('/map/:id', MapController.getMapById)
router.get('/maps', MapController.getAllMaps)
router.put('/map/:id', MapController.updateMap)
router.put('/map/:id/name', MapController.updateMapNameById)

module.exports = router