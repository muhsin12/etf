import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

async function downloadImages() {
  const dataPath = path.join(__dirname, '../src/data/sampleCars.json');
  const carData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const uploadsDir = path.join(__dirname, '../public/uploads');

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created directory:', uploadsDir);
  }

  console.log('Starting image downloads...');

  for (const [index, car] of carData.entries()) {
    if (car.images && car.images.length > 0) {
      const image = car.images[0];
      const filename = image.key.replace('.jpeg', '.svg');
      const imageUrl = `https://placehold.co/600x400/${car.color.toLowerCase()}/white?text=${encodeURIComponent(car.model)}`;
      const imagePath = path.join(uploadsDir, filename);

      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${imageUrl}: ${response.statusText}`);
        }
        await pipeline(response.body, fs.createWriteStream(imagePath));
        console.log(`Downloaded (${index + 1}/${carData.length}): ${filename}`);
      } catch (error) {
        console.error(`Error downloading ${filename}:`, error);
      }
    }
  }

  console.log('Image download process complete.');
}

downloadImages(); 