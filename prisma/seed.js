import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dhaka = await prisma.areaDivision.create({
    data: {
      name: "ঢাকা",
      districts: {
        create: [
          {
            name: "ঢাকা",
            thanas: { create: [{ name: "ধানমন্ডি" }, { name: "গুলশান" }] },
          },
          {
            name: "গাজীপুর",
            thanas: { create: [{ name: "টঙ্গী" }, { name: "কালিয়াকৈর" }] },
          },
          {
            name: "নারায়ণগঞ্জ",
            thanas: { create: [{ name: "ফতুল্লা" }, { name: "আড়াইহাজার" }] },
          },
        ],
      },
    },
  });

  console.log("Data Inserted:", dhaka);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
