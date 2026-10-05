import prisma from './lib/prisma'

async function main() {
  await prisma.user.updateMany({
    where: {
      email: {
        in: ['juliansa837@gmail.com', 'i.will.brightt@gmail.com', 'yanto123@gmail.com']
      }
    },
    data: { role: 'ADMIN' }
  })
  console.log('Users updated to ADMIN')
}
main()
