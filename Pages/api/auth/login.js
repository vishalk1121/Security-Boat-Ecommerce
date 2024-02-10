import nextConnect from 'next-connect';
import User from '../Models/User';
import { comparePassword } from '../lib/auth';
import { signToken } from '../lib/auth';

const login = nextConnect();

login.post(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user._id, user.role);

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default login;