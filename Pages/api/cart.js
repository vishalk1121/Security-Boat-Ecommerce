import { connectToDatabase } from '../../lib/mongodb';
import { signToken } from '../../lib/auth';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const { method } = req;

  if (method === 'POST') {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ error: 'Missing userId, productId, or quantity' });
    }

    const user = await db.collection('users').findOne({ _id: new mongodb.ObjectID(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const product = await db.collection('products').findOne({ _id: new mongodb.ObjectID(productId) });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    user.cart.push({ productId, quantity });

    await db.collection('users').updateOne({ _id: new mongodb.ObjectID(userId) }, { $set: user });

    const token = signToken(user._id, user.role);

    res.status(200).json({ user, token });
  } else if (method === 'DELETE') {
    const { userId, productId } = req.query;

    if (!userId || !productId) {
      return res.status(400).json({ error: 'Missing userId or productId' });
    }

    const user = await db.collection('users').findOne({ _id: new mongodb.ObjectID(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.cart = user.cart.filter((item) => item.productId.toString() !== productId.toString());

    await db.collection('users').updateOne({ _id: new mongodb.ObjectID(userId) }, { $set: user });

    const token = signToken(user._id, user.role);

    res.status(200).json({ user, token });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}