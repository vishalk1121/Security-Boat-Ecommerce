import { connectToDatabase } from '../../lib/mongodb';
import { signToken } from '../../lib/auth';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const { method } = req;

  if (method === 'POST') {
    const { userId, products } = req.body;

    if (!userId || !products) {
      return res.status(400).json({ error: 'Missing userId or products' });
    }

    const user = await db.collection('users').findOne({ _id: new mongodb.ObjectID(userId) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = {
      userId,
      products,
      status: 'pending',
      date: new Date(),
    };

    await db.collection('orders').insertOne(order);

    user.orders.push(order._id);

    await db.collection('users').updateOne({ _id: new mongodb.ObjectID(userId) }, { $set: user });

    const token = signToken(user._id, user.role);

    res.status(201).json({ order, user, token });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}