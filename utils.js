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

module.exports = { generateJWT };