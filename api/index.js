const { default: mongoose } = require('mongoose');
const app = require('./app');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("Connected to MongoDB.");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(error => {
        console.error("Unable to connect to database: ", error)
    })