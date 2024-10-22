const User = require("../models/User");
const bcrypt = require("bcryptjs");
const bcryptSalt = bcrypt.genSaltSync(10);

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;


const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userDoc = await User.create({ name, email, password: bcrypt.hashSync(password, bcryptSalt) });
        res.status(201).send(userDoc);
    }
    catch (error) {
        res.status(422).send(error.message);
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email })
        if (foundUser) {
            const passOk = bcrypt.compareSync(password, foundUser.password);
            if (passOk) {
                console.log("Signing");
                jwt.sign({ email: foundUser.email, id: foundUser._id, name: foundUser.name }, jwtSecret, {}, (err, token) => {
                    if (err) {
                        console.error("Error signing token:", err);
                        return res.status(500).json("Failed to create token.");
                    }
                    res.cookie('token', token, { httpOnly: true, secure: true }).json(foundUser);
                });
            }
            else {
                res.status(422).json("Password does not match.");
            }
        }
        else {
            res.json("Not found");
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const getUserProfile = async (req, res) => {
    const { token } = req.cookies;
    if(token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if(err) throw err;
            const {name, email, _id} = await User.findById(user.id);
            res.json({name, email, _id});
        })
    } else {
        res.json(null);
    }
}

const logoutUser = async (req, res) => {
    res.cookie('token', '').json(true);
}

function getUserDataFromReq(req) {
    return new Promise((resolve, reject) => {
      jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      });
    });
  }

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    getUserDataFromReq
};