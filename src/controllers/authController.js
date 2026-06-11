const { registerUser, loginUser } = require('../services/authService');

/**
 * POST /api/auth/register
 * Registra un nuevo usuario y devuelve el JWT.
 */
const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Autentica al usuario y devuelve el JWT.
 */
const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
