const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const imageDownloader = require('image-downloader');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const mime = require('mime-types');
const fs = require('fs');
const Place = require("../models/Place");
const Booking = require("../models/Booking");

async function uploadToS3(path, originalFilename, mimetype) {
    const client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        },
    });
    const bucket = process.env.S3_BUCKET_NAME;
    const parts = originalFilename.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;
    await client.send(new PutObjectCommand({
        Bucket: bucket,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
    }));
    return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

const uploadPhoto = async (req, res) => {
    const uploadedFiles = [];
    console.log('here');
    if (req.files)
        for (let i = 0; i < req.files.length; i++) {
            const { path, originalname, mimetype } = req.files[i];
            const url = await uploadToS3(path, originalname, mimetype);
            uploadedFiles.push(url);
        }
    res.json(uploadedFiles);
}

const uploadPhotoByLink = async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: '/tmp/' + newName,
    });
    const url = await uploadToS3('/tmp/' + newName, newName, mime.lookup('/tmp/' + newName));
    res.json(url);
};

const savePlace = async (req, res) => {
    const { token } = req.cookies;
    const {
        title, address, addedPhotos, description, price,
        perks, extraInfo, checkIn, checkOut, maxGuests,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.create({
            owner: userData.id, price,
            title, address, photos: addedPhotos, description,
            perks, extraInfo, checkIn, checkOut, maxGuests,
        });
        res.json(placeDoc);
    });
}

const updatePlace = async (req, res) => {
    const { token } = req.cookies;
    const {
        id, title, address, addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests, price,
    } = req.body;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const placeDoc = await Place.findById(id);
        if (userData.id === placeDoc.owner.toString()) {
            placeDoc.set({
                title, address, photos: addedPhotos, description,
                perks, extraInfo, checkIn, checkOut, maxGuests, price,
            });
            await placeDoc.save();
            res.json('ok');
        }
    });
}

const getPlacesByOwner = async (req, res) => {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        const { id } = userData;
        res.json(await Place.find({ owner: id }));
    });
}

const getPlaceById = async (req, res) => {
    const { id } = req.params;
    res.json(await Place.findById(id));
}

const getAllPlaces = async (req, res) => {
    res.json(await Place.find());
}

const deletePlace = async (req, res) => {
    const { id } = req.params;
    try {
      const existingBookings = await Booking.find({ place: id });
  
      if (existingBookings.length > 0) {
        return res.status(400).json({
          message: "This place cannot be deleted as there are existing bookings.",
        });
      }
      const deletedPlace = await Place.findByIdAndDelete(id);
      if (!deletedPlace) {
        return res.status(404).json({ message: "Place not found" });
      }
      res.json({
        message: "Place deleted successfully",
        place: deletedPlace,
      });
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error });
    }
  };

module.exports = {
    uploadPhotoByLink,
    uploadPhoto,
    savePlace,
    updatePlace,
    getPlacesByOwner,
    getPlaceById,
    getAllPlaces,
    deletePlace
};