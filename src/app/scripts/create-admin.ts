/**
 * Script membuat 1 ADMIN
 * Jalankan:
 * npx ts-node scripts/create-admin.ts
 */

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const nip = process.argv[2] || "admin";
    const password = process.argv[3] || "admin123";

    console.log("🚀 Membuat ADMIN...");
    console.log("NIP:", nip);

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.upsert({
      where: { nip },
      update: {
        password: hashedPassword,
        role: "ADMIN",
      },
      create: {
        nip,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("\n✅ Admin berhasil dibuat");
    console.log("ID:", admin.id);
    console.log("NIP:", admin.nip);
    console.log("Role:", admin.role);
    console.log("\n🔐 Login:");
    console.log("NIP:", nip);
    console.log("Password:", password);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
