const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Genera un JWT para el usuario dado.
 * @param {string} id - ID del usuario en MongoDB
 * @returns {string} JWT firmado
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Registra un nuevo usuario.
 * Lanza error si el email ya existe.
 */
const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('El email ya está registrado');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

/**
 * Autentica un usuario con email y password.
 * Lanza error si las credenciales son incorrectas.
 */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Credenciales incorrectas');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  return {
    token,
    user: { id: user._id, name: user.name, email: user.email },
  };
};

module.exports = { registerUser, loginUser };
