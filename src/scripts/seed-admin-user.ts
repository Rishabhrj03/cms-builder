import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017';

async function main() {
  console.log('🔑 Ensuring admin users for PAGEFORGE CMS...');
  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db('pageforge');
  const usersCol = db.collection('users');

  const password = 'admin123';
  const passwordHash = await bcrypt.hash(password, 12);

  const users = [
    { name: 'Admin User', email: 'admin@pageforge.in' },
    { name: 'Rishabh Joshi', email: 'rishabhjoshi@gmail.com' },
  ];

  for (const u of users) {
    await usersCol.updateOne(
      { email: u.email.toLowerCase() },
      {
        $set: {
          name: u.name,
          email: u.email.toLowerCase(),
          passwordHash,
          role: 'admin',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  console.log('✅ Admin accounts ready!');
  await client.close();
}

main().catch((err) => {
  console.error('Failed to seed admin users:', err);
  process.exit(1);
});
