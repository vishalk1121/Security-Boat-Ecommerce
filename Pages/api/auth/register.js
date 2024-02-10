import nextConnect from 'next-connect';
import User from '../Models/User';
import { hashPassword } from '../lib/auth';
import { signToken } from '../lib/auth';

const register = nextConnect();

register.post(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'Missing email, password, or role' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({ email, password: hashedPassword, role });

    await newUser.save();

    const token = signToken(newUser._id, newUser.role);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default register;