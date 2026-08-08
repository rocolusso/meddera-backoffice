import { prisma } from "./prisma";
import { todayIsoDate } from "./utils/dates";

export type Patient = {
  id: string;
  fullName: string;
  phone: string;
  birthDate: string;
  address: string;
  idnp: string;
  lastVisitDate: string;
  complaints: string;
  anamnesis: string;
  objectiveExam: string;
  diagnosis: string;
  investigations: string;
  recommendations: string;
  treatment: string;
  procedure: string;
  product: string;
  patientConsent: boolean;
};

export type GetPatientsParams = {
  query?: string;
  page?: number;
  pageSize?: number;
};

export type GetPatientsResult = {
  items: Patient[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const DEFAULT_PAGE_SIZE = 10;

function buildSearchFilter(query: string) {
  const q = query.trim();
  if (!q) return undefined;
  return {
    OR: [
      { fullName: { contains: q, mode: "insensitive" as const } },
      { phone: { contains: q, mode: "insensitive" as const } },
      { idnp: { contains: q, mode: "insensitive" as const } },
    ],
  };
}

export async function getPatients(
  params: GetPatientsParams = {},
): Promise<GetPatientsResult> {
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const page = Math.max(1, params.page ?? 1);
  const query = params.query ?? "";

  const where = buildSearchFilter(query);

  const [rows, total] = await prisma.$transaction([
    prisma.patient.findMany({
      where,
      orderBy: [{ lastVisitDate: "desc" }, { fullName: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.patient.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  return {
    items: rows as Patient[],
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const row = await prisma.patient.findUnique({ where: { id } });
  return row as Patient | null;
}

export async function createPatient(
  data: Omit<Patient, "id" | "lastVisitDate"> & { lastVisitDate?: string },
): Promise<Patient> {
  const row = await prisma.patient.create({
    data: {
      id: crypto.randomUUID(),
      fullName: data.fullName,
      phone: data.phone,
      birthDate: data.birthDate,
      address: data.address,
      idnp: data.idnp,
      lastVisitDate: data.lastVisitDate ?? todayIsoDate(),
      complaints: data.complaints,
      anamnesis: data.anamnesis,
      objectiveExam: data.objectiveExam,
      diagnosis: data.diagnosis,
      investigations: data.investigations,
      recommendations: data.recommendations,
      treatment: data.treatment,
      procedure: data.procedure,
      product: data.product,
      patientConsent: data.patientConsent,
    },
  });
  return row as Patient;
}

export async function updatePatient(
  id: string,
  data: Partial<Omit<Patient, "id">>,
): Promise<Patient> {
  const row = await prisma.patient.update({
    where: { id },
    data: {
      ...data,
    },
  });
  return row as Patient;
}
