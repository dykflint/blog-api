import prisma from '../src/prisma/client.js';
import { v4 as uuidv4 } from 'uuid';

async function main() {
  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      username: 'konstantin',
      password: 'secret',
      role: 'ADMIN',
    },
  });

  console.log('User created:', user);
}

main()
  .then(() => {
    console.log('Done');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
