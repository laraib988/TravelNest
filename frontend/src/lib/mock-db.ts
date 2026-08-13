import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'products.json');

// Ensure data dir exists
if (!fs.existsSync(path.dirname(DB_PATH))) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
}

// Initialize file if not exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

export const getProducts = () => {
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

export const saveProducts = (products: any[]) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2));
};
