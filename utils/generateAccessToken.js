const jwt = require("jsonwebtoken")
require("dotenv").config()
function generateAccessToken(user) {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    return jwt.sign(user, secret, { expiresIn: "15min" })
}
module.exports = generateAccessToken;