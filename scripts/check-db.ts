import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🗄️  Checking database connection...");

  // Test connection
  await prisma.$connect();
  console.log("✅ Database connected successfully!");

  // Check tables
  const usersCount = await prisma.user.count();
  const membersCount = await prisma.member.count();

  console.log(`Users: ${usersCount}`);
  console.log(`Members: ${membersCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Database error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
