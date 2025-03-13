import prisma from "../../lib/prisma";

// সব ক্লাসের লিস্ট দেখানো (GET)
export async function getClasses(divisionsId) {
  const filter = divisionsId ? { divisionsId: Number(divisionsId) } : {}; // বিভাগ অনুযায়ী ফিল্টার করা

  return await prisma.classes.findMany({
    where: filter,
    include: { divisions: true }, // প্রত্যেক ক্লাসের সাথে বিভাগের ডাটা দেখাবে
  });
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { divisionsId } = req.query; // `divisionsId` query থেকে নেওয়া

    try {
      const classes = await getClasses(divisionsId); // ফিল্টার করা ক্লাসগুলো ফেরত দেওয়া
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ error: "ডাটা লোড করা যায়নি" });
    }
  } else if (req.method === "POST") {
    // নতুন ক্লাস যোগ করা
    const { name, divisionsId } = req.body;
    if (!name || !divisionsId)
      return res
        .status(400)
        .json({ error: "ক্লাসের নাম এবং বিভাগের ID প্রয়োজন" });

    try {
      const newClass = await prisma.classes.create({
        data: { name, divisionsId: Number(divisionsId) },
      });
      res.status(201).json(newClass);
    } catch (error) {
      res.status(500).json({ error: "ক্লাস তৈরি করা যায়নি" });
    }
  } else if (req.method === "PUT") {
    // ক্লাস আপডেট করা
    const { id, name } = req.body;
    if (!id || !name)
      return res.status(400).json({ error: "ID এবং নতুন নাম প্রয়োজন" });

    try {
      const updatedClass = await prisma.classes.update({
        where: { id: Number(id) },
        data: { name },
      });
      res.status(200).json(updatedClass);
    } catch (error) {
      res.status(500).json({ error: "ক্লাস আপডেট করা যায়নি" });
    }
  } else if (req.method === "DELETE") {
    // ক্লাস মুছে ফেলা
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: "ID প্রয়োজন" });

    try {
      await prisma.classes.delete({
        where: { id: Number(id) },
      });
      res.status(200).json({ message: "ক্লাস মুছে ফেলা হয়েছে" });
    } catch (error) {
      res.status(500).json({ error: "ক্লাস মুছে ফেলা যায়নি" });
    }
  } else {
    res.status(405).json({ error: "এই HTTP মেথড অনুমোদিত নয়" });
  }
}
