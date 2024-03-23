-- Tabelas principais
CREATE TABLE IF NOT EXISTS "Users" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(50) UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  "updatedAt" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE IF NOT EXISTS "Medicines" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "nickname" VARCHAR(50),
  "type" VARCHAR(25) NOT NULL,
  "amount" SMALLINT NOT NULL,
  "time" TIME,
  "frequency" VARCHAR(255),
  "condition" VARCHAR(255),
  "suspended" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP),
  "updatedAt" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

-- Tabelas de associação/junção
CREATE TABLE IF NOT EXISTS "Patients" (
  "patientId" SERIAL PRIMARY KEY,
  "userId" INT
);

CREATE TABLE IF NOT EXISTS "Caregivers" (
  "caregiverId" SERIAL PRIMARY KEY,
  "userId" INT
);

CREATE TABLE IF NOT EXISTS "PatientsCaregivers" (
  "patientId" INT,
  "caregiverId" INT
);

CREATE TABLE IF NOT EXISTS "PatientMedicines" (
  "id" SERIAL PRIMARY KEY,
  "patientId" INT,
  "medicineId" INT
);

CREATE TABLE IF NOT EXISTS "AppliedPatientMedicines" (
  "id" SERIAL PRIMARY KEY,
  "patientId" INT,
  "medicineId" INT,
  "appliedBy" INT,
  "appliedAt" TIMESTAMP DEFAULT (CURRENT_TIMESTAMP)
);

-- Criando associações/junções
ALTER TABLE "Patients" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("id");
ALTER TABLE "Caregivers" ADD FOREIGN KEY ("userId") REFERENCES "Users" ("id");

ALTER TABLE "PatientsCaregivers" ADD FOREIGN KEY ("patientId") REFERENCES "Patients" ("patientId");
ALTER TABLE "PatientsCaregivers" ADD FOREIGN KEY ("caregiverId") REFERENCES "Caregivers" ("caregiverId");

ALTER TABLE "PatientMedicines" ADD FOREIGN KEY ("patientId") REFERENCES "Patients" ("patientId");
ALTER TABLE "PatientMedicines" ADD FOREIGN KEY ("medicineId") REFERENCES "Medicines" ("id");

ALTER TABLE "AppliedPatientMedicines" ADD FOREIGN KEY ("patientId") REFERENCES "Patients" ("patientId");
ALTER TABLE "AppliedPatientMedicines" ADD FOREIGN KEY ("medicineId") REFERENCES "Medicines" ("id");
ALTER TABLE "AppliedPatientMedicines" ADD FOREIGN KEY ("appliedBy") REFERENCES "Users" ("id");
