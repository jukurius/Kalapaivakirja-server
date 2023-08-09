const jwt = require("jsonwebtoken")
require("dotenv").config()

function generateRefreshToken(user) {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    return jwt.sign(user, secret)
}
module.exports = generateRefreshToken;