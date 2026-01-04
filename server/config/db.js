import mongoose from 'mongoose';

const namedConnections = new Map();

export async function connectDatabase(mongoUri, options = {}) {
  if (!mongoUri) throw new Error('MONGO_URI not provided');
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, options);
  console.log(`[db] Default connection established (${mongoose.connection.name})`);
}

export async function createNamedConnection(name, mongoUri, options = {}) {
  if (!name || !mongoUri) throw new Error('Name and URI required for named connection');
  if (namedConnections.has(name)) return namedConnections.get(name);
  const conn = mongoose.createConnection(mongoUri, options);
  await new Promise((resolve, reject) => {
    conn.once('open', resolve);
    conn.on('error', reject);
  });
  namedConnections.set(name, conn);
  console.log(`[db] Named connection '${name}' established (${conn.name})`);
  return conn;
}

export function getNamedConnection(name) {
  return namedConnections.get(name) || null;
}

export async function disconnectAll() {
  await mongoose.disconnect();
  for (const [, conn] of namedConnections) {
    await conn.close();
  }
  namedConnections.clear();
}


