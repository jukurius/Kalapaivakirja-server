const jwt = require('jsonwebtoken');

// Middleware function to check authorization
const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Extract the token from the Authorization header

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' }); // No token provided
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden' }); // Invalid token
    }

    // Perform any additional authorization checks based on the user data
    // For example, check if the user has the necessary role or permissions
    console.log(user)
    req.user = user; // Set the user data in the request object
    next(); // Continue to the next middleware or route handler
  });
};

module.exports = checkAuth;
