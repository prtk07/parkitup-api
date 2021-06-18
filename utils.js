const jwt = require("jsonwebtoken");
const moment = require("moment");

require("dotenv").config();

function generateJWT(userData) {
    const payload = {
        sub: userData.username,
        iat: moment().unix(),
        exp: moment().add(14, "days").unix(),
    };
    return jwt.sign(payload, process.env.SECRET_KEY);
}

function getUser(token) {
    let auth = token;
    auth = auth.replace("Bearer ", "");
    let { sub } = jwt.verify(auth, process.env.SECRET_KEY);
    return sub;
}

module.exports = { generateJWT, getUser };