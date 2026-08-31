const jwt = require('jsonwebtoken');
const { getUsers } = require('../services/imagekitDb');

module.exports = async (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const users = await getUsers();
    
    const user = users.find(u => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User no longer exists' });
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};