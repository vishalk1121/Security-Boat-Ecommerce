import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const secret = process.env.JWT_SECRET;

export const signToken = (id, role) => {
  return jwt.sign({ id, role }, secret, { expiresIn: '1h' });
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};