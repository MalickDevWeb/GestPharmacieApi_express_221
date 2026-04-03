import "dotenv/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const buildFournisseurs = () =>
  Array.from({ length: 10 }, (_, index) => ({
    code: `FOU-${String(index + 1).padStart(3, "0")}`,
    nom: `Fournisseur ${index + 1}`,
    adresse: `Adresse fournisseur ${index + 1}, Dakar`,
    telephone: `7810000${String(index + 1).padStart(2, "0")}`,
    email: `fournisseur${index + 1}@pharma221.sn`,
  }));

const buildClients = () =>
  Array.from({ length: 10 }, (_, index) => ({
    prenom: `ClientPrenom${index + 1}`,
    nom: `ClientNom${index + 1}`,
    telephone: `7711000${String(index + 1).padStart(2, "0")}`,
    email: `client${index + 1}@pharma221.sn`,
    adresse: `Adresse client ${index + 1}, Dakar`,
  }));

const buildMedicaments = (fournisseurs: { id: string }[]) =>
  Array.from({ length: 10 }, (_, index) => ({
    code: `MED-${String(index + 1).padStart(3, "0")}`,
    libelle: `Medicament ${index + 1}`,
    prix: 1000 + index * 250,
    qteStock: 30 + index * 5,
    dateExpiration: new Date(Date.UTC(2099, index % 12, index + 1, 0, 0, 0)),
    fournisseurId: fournisseurs[index % fournisseurs.length]!.id,
  }));

const buildVentes = (clients: { id: string }[], medicaments: { id: string }[]) =>
  Array.from({ length: 10 }, (_, index) => ({
    clientId: clients[index % clients.length]!.id,
    medicamentId: medicaments[index % medicaments.length]!.id,
    quantite: (index % 3) + 1,
    dateVente: new Date(Date.UTC(2026, 3, index + 1, 10, 0, 0)),
  }));

async function main() {
  await prisma.vente.deleteMany();
  await prisma.medicament.deleteMany();
  await prisma.client.deleteMany();
  await prisma.fournisseur.deleteMany();

  const fournisseursData = buildFournisseurs();
  await prisma.fournisseur.createMany({
    data: fournisseursData,
  });

  const fournisseurs = await prisma.fournisseur.findMany({
    orderBy: {
      code: "asc",
    },
    select: {
      id: true,
      code: true,
    },
  });

  const clientsData = buildClients();
  await prisma.client.createMany({
    data: clientsData,
  });

  const clients = await prisma.client.findMany({
    orderBy: {
      email: "asc",
    },
    select: {
      id: true,
      email: true,
    },
  });

  const medicamentsData = buildMedicaments(fournisseurs);
  await prisma.medicament.createMany({
    data: medicamentsData,
  });

  const medicaments = await prisma.medicament.findMany({
    orderBy: {
      code: "asc",
    },
    select: {
      id: true,
      prix: true,
      qteStock: true,
    },
  });

  const ventesData = buildVentes(clients, medicaments);

  for (const vente of ventesData) {
    const medicament = medicaments.find((item) => item.id === vente.medicamentId);

    if (!medicament) {
      throw new Error(`Medicament introuvable pour la vente ${vente.medicamentId}`);
    }

    const montantTotal = medicament.prix.mul(vente.quantite);

    await prisma.$transaction([
      prisma.medicament.update({
        where: {
          id: vente.medicamentId,
        },
        data: {
          qteStock: {
            decrement: vente.quantite,
          },
        },
      }),
      prisma.vente.create({
        data: {
          clientId: vente.clientId,
          medicamentId: vente.medicamentId,
          quantite: vente.quantite,
          dateVente: vente.dateVente,
          montantTotal,
        },
      }),
    ]);
  }

  console.log("Seed Prisma termine: 10 fournisseurs, 10 clients, 10 medicaments, 10 ventes.");
}

main()
  .catch((error) => {
    console.error("Echec du seed Prisma.", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
