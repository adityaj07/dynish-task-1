import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create a test order
  const order = await prisma.order.create({
    data: {
      id: 456, // Use same ID as frontend mock
      orderStatus: "NEW",
      subtotal: 580,
      tax: 46.4,
      total: 626.4,
      items: {
        create: [
          {
            name: "Pav bhaji",
            price: 180,
            quantity: 1,
            imgUrl: "/pav-bhaji.webp",
          },
          {
            name: "Hakka Noodles",
            price: 150,
            quantity: 1,
            imgUrl: "/hakka-noodles.jpeg",
          },
          {
            name: "Paneer Tikka",
            price: 250,
            quantity: 1,
            imgUrl: "/paneer-tikka.jpg",
          },
        ],
      },
    },
  });

  console.log(`Created test order with ID: ${order.id}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
