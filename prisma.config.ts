import path from "path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://placeholder:5432/placeholder",
    directUrl: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "postgresql://placeholder:5432/placeholder",
  },
});
