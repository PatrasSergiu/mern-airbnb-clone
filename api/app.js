require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'    )

const userRoutes = require('./routes/user.route');
const placeRoutes = require('./routes/place.route');
const bookingRoutes = require('./routes/booking.route');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
}))


app.use('/api/users', userRoutes);
app.use('/api/places', placeRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;