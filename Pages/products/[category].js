import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'Missing category' });
  }

  const products = await db.collection('products').find({ category }).toArray();

  res.status(200).json(products);
}