import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

const uri = 'mongodb://localhost:27017/etf_garage';
const client = new MongoClient(uri);

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('cars');

    // Optional: Clear existing data
    await collection.deleteMany({});
    console.log('Cleared existing data from the "cars" collection.');

    const dataPath = path.join(__dirname, '../src/data/sampleCars.json');
    const carData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const result = await collection.insertMany(carData);
    console.log(`${result.insertedCount} documents were inserted.`);

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

seedDatabase(); 