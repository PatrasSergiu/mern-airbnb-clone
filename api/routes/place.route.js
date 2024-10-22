const express = require('express');
const { savePlace, uploadPhotoByLink, uploadPhoto, updatePlace, getPlacesByOwner, getPlaceById, getAllPlaces, deletePlace } = require('../controllers/place.controller');
const multer = require('multer');

const router = express.Router();

router.get('/owner-places', getPlacesByOwner);
router.get('/:id', getPlaceById);
router.get('/', getAllPlaces);
router.post('/upload-by-link', uploadPhotoByLink);
const photosMiddleware = multer({dest:'/tmp'});
router.post('/upload', photosMiddleware.array('photos', 100), uploadPhoto)
router.post('/', savePlace);
router.put('/', updatePlace);
router.delete('/:id', deletePlace);

module.exports = router;