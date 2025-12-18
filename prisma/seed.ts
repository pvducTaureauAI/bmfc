import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Created admin user:", admin.username);

  // Create guest user
  const guestPassword = await hashPassword("guest123");
  const guest = await prisma.user.upsert({
    where: { username: "guest" },
    update: {},
    create: {
      username: "guest",
      password: guestPassword,
      role: "GUEST",
    },
  });
  console.log("✅ Created guest user:", guest.username);

  // Create sample members
  const memberNames = [
    "Nguyễn Văn A",
    "Trần Văn B",
    "Lê Văn C",
    "Phạm Văn D",
    "Hoàng Văn E",
  ];

  for (const name of memberNames) {
    await prisma.member.upsert({
      where: { id: memberNames.indexOf(name) + 1 },
      update: {},
      create: {
        name,
        phone: `09${Math.floor(Math.random() * 100000000)}`,
        email: `${name.toLowerCase().replace(/\s/g, "")}@example.com`,
        status: "ACTIVE",
      },
    });
  }
  console.log(`✅ Created ${memberNames.length} members`);

  console.log("🎉 Seeding completed!");
  console.log("");
  console.log("📝 Login credentials:");
  console.log("   Admin: username=admin, password=admin123");
  console.log("   Guest: username=guest, password=guest123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
