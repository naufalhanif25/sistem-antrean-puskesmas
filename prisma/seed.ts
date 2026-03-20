import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: { nip: "admin001" },
        update: {},
        create: {
            nip: "admin001",
            nama: "Admin",
            password: await bcrypt.hash(process.env.ADMIN_PW, 10),
            role: "ADMIN",
            cluster: null,
        },
    });
    await prisma.user.upsert({
        where: { nip: "layar001" },
        update: {},
        create: {
            nip: "layar001",
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