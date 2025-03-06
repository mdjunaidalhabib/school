import { db } from "../../lib/db"; // তোমার ডাটাবেজ কনফিগারেশন

export default async function handler(req, res) {
  const { nid } = req.query;

  if (!nid) {
    return res.status(400).json({ error: "NID is required" });
  }

  try {
    const student = await db.student.findUnique({
      where: { nid },
    });

    if (student) {
      return res.status(200).json({ exists: true, student });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(500).json({ error: "Database error", details: error.message });
  }
}
