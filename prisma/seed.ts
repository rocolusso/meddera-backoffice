import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { MOCK_PATIENTS } from "../src/lib/mock-patients";

const prisma = new PrismaClient();

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env variable: ${name}`);
  return val;
}

async function seedUsers() {
  console.log("Seeding users…");

  // Superadmin
  const adminEmail = requireEnv("SUPERADMIN_EMAIL");
  const adminName = requireEnv("SUPERADMIN_NAME");
  const adminTempPass = requireEnv("SUPERADMIN_TEMP_PASSWORD");
  const passwordHash = await bcrypt.hash(adminTempPass, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: adminName, passwordHash, role: "SUPERADMIN" },
    create: {
      email: adminEmail,
      name: adminName,
      role: "SUPERADMIN",
      passwordHash,
      isActive: true,
      mustChangePassword: true,
    },
  });
  console.log(`  ✓ Superadmin: ${adminEmail}`);

  // Doctors
  for (let i = 1; i <= 5; i++) {
    const email = process.env[`DOCTOR_${i}_EMAIL`];
    const name = process.env[`DOCTOR_${i}_NAME`];
    const telegramId = process.env[`DOCTOR_${i}_TELEGRAM_ID`] || null;

    if (!email || !name) {
      console.log(`  ⚠ DOCTOR_${i}: missing env vars, skipping`);
      continue;
    }

    await prisma.user.upsert({
      where: { email },
      update: { name, telegramId: telegramId ?? undefined },
      create: {
        email,
        name,
        role: "DOCTOR",
        telegramId,
        isActive: true,
        mustChangePassword: false,
      },
    });
    console.log(`  ✓ Doctor ${i}: ${email}${telegramId ? ` (tg: ${telegramId})` : ""}`);
  }
}

async function seedPatients() {
  console.log("Seeding patients…");
  const alina = MOCK_PATIENTS[0];

  await prisma.patient.upsert({
    where: { id: alina.id },
    update: {},
    create: {
      id: alina.id,
      fullName: alina.fullName,
      phone: alina.phone,
      birthDate: alina.birthDate,
      address: alina.address,
      idnp: alina.idnp,
      lastVisitDate: alina.lastVisitDate,
      complaints: alina.complaints,
      anamnesis: alina.anamnesis,
      objectiveExam: alina.objectiveExam,
      diagnosis: alina.diagnosis,
      investigations: alina.investigations,
      recommendations: alina.recommendations,
      treatment: alina.treatment,
      procedure: alina.procedure,
      product: alina.product,
      patientConsent: alina.patientConsent,
    },
  });
  console.log(`  ✓ Patient: ${alina.fullName}`);
}

async function main() {
  await seedUsers();
  await seedPatients();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
