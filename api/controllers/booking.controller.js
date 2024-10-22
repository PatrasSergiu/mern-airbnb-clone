const Booking = require("../models/Booking");
const { getUserDataFromReq } = require("./user.controller");

const saveBooking = async (req, res) => {
    const userData = await getUserDataFromReq(req);
    const {
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
    } = req.body;
    Booking.create({
        place, checkIn, checkOut, numberOfGuests, name, phone, price,
        user: userData.id,
    }).then((doc) => {
        res.json(doc);
    }).catch((err) => {
        throw err;
    });
}

const getBookingsByUser = async (req, res) => {
    const userData = await getUserDataFromReq(req);
    res.json( await Booking.find({user:userData.id}).populate('place') );
}

const deleteBooking = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        const currentTime = new Date();
        const checkInTime = new Date(booking.checkIn);
        // Check if the current time is more than 24 hours before the check-in time
        const hoursBeforeCheckIn = (checkInTime - currentTime) / (1000 * 60 * 60);

        if (hoursBeforeCheckIn < 24) {
            return res.status(400).json({ error: "Cannot cancel booking less than 24 hours before check-in" });
        }
        await Booking.findByIdAndDelete(id);
        res.json({ message: "Booking successfully canceled" });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};


module.exports = {
    saveBooking,
    getBookingsByUser,
    deleteBooking
};