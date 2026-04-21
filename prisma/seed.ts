import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: { nip: process.env.ADMIN_NIP },
        update: {},
        create: {
            nip: process.env.ADMIN_NIP,
            nama: "Admin",
            password: await bcrypt.hash(process.env.ADMIN_PW, 10),
            role: "ADMIN",
            cluster: null,
        },
    });
    await prisma.user.upsert({
        where: { nip: process.env.LAYAR_NIP },
        update: {},
        create: {
            nip: process.env.LAYAR_NIP,
            nama: "Layar",
            password: await bcrypt.hash(process.env.LAYAR_PW, 10),
            role: "LAYAR",
            cluster: null,
        },
    });
    console.log("Akun berhasil dibuat");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });