import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash('password123', 10);

  const peers = [
    {
      name: 'Budi Santoso',
      email: 'budi.santoso@student.ac.id',
      xp: 240,
      streak: 6,
      completedLessons: 10,
    },
    {
      name: 'Siti Rahma',
      email: 'siti.rahma@student.ac.id',
      xp: 190,
      streak: 5,
      completedLessons: 8,
    },
    {
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@student.ac.id',
      xp: 140,
      streak: 4,
      completedLessons: 6,
    },
    {
      name: 'Dewi Lestari',
      email: 'dewi.lestari@student.ac.id',
      xp: 80,
      streak: 3,
      completedLessons: 4,
    },
    {
      name: 'Rian Pratama',
      email: 'rian.pratama@student.ac.id',
      xp: 50,
      streak: 2,
      completedLessons: 2,
    },
    {
      name: 'Nadia Putri',
      email: 'nadia.putri@student.ac.id',
      xp: 30,
      streak: 1,
      completedLessons: 1,
    },
  ];

  for (const peer of peers) {
    const existing = await prisma.user.findUnique({
      where: { email: peer.email },
    });

    if (!existing) {
      await prisma.user.create({
        data: {
          name: peer.name,
          email: peer.email,
          password: defaultPassword,
          role: 'STUDENT',
          stats: {
            create: {
              xp: peer.xp,
              streak: peer.streak,
              completedLessonsCount: peer.completedLessons,
              completedExercisesCount: peer.completedLessons,
            },
          },
        },
      });
      console.log(`✓ Created student peer: ${peer.name}`);
    }
  }

  console.log('✓ Leaderboard peers seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
