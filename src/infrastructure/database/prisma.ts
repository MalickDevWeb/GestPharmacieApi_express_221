import { prismaClient } from "./client";

export const db = prismaClient;

export const connectDatabase = async () => {
  await db.$connect();
};

export const disconnectDatabase = async () => {
  await db.$disconnect();
};
