/**
 * Script membuat 4 DOKTER
 * Jalankan:
 * npx ts-node scripts/create-dokter.ts
 */

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface DokterData {
  nip: string;
  name: string;
  cluster: number;
  password?: string;
}

async function createDokter() {
  try {
    const dokterList: DokterData[] = [
      {
        nip: "dokter001",
        name: "dr. Budi Santoso",
        cluster: 1,
        password: "dokter001",
      },
      {
        nip: "dokter002",
        name: "dr. Badi Sambas",
        cluster: 2,
        password: "dokter002",
      },
      {
        nip: "dokter003",
        name: "dr. Putri",
        cluster: 3,
        password: "dokter003",
      },
      {
        nip: "dokter004",
        name: "Dr. Teuku",
        cluster: 4,
        password: "dokter004",
      },
    ];

    console.log("🚀 Membuat 4 DOKTER...\n");

    for (const dokter of dokterList) {
      const hashedPassword = await bcrypt.hash(
        dokter.password || "dokter123",
        10
      );

      const createdDokter = await prisma.user.upsert({
        where: { nip: dokter.nip },
        update: {
          password: hashedPassword,
          role: "DOKTER",
        },
        create: {
          nip: dokter.nip,
          password: hashedPassword,
          role: "DOKTER",
        },
      });

      console.log(
        `✅ ${dokter.name} (Cluster ${dokter.cluster}) berhasil dibuat`
      );
      console.log("   ID:", createdDokter.id);
      console.log("   NIP:", createdDokter.nip);
      console.log("   Role:", createdDokter.role);
      console.log(
        "   🔐 Login dengan NIP:",
        dokter.nip,
        "Password:",
        dokter.password
      );
      console.log("");
    }

    console.log("\n✨ Semua dokter berhasil dibuat!");
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

createDokter();
