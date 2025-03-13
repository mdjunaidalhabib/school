import multer from "multer";
import path from "path";

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads"); // ফাইল যেখানে সেভ হবে
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // ফাইলের নাম চেঞ্জ করা
  },
});

// Multer instance
const upload = multer({ storage: storage });

// Next.js API handler to handle file upload
export const config = {
  api: {
    bodyParser: false, // multer body parser নিষ্ক্রিয় করা হয়েছে, multer নিজেই হ্যান্ডেল করবে
  },
};

const handler = (req, res) => {
  upload.single("image")(req, res, (err) => {
    // 'image' নামক ফিল্ড থেকে ফাইল নেওয়া হবে
    if (err) {
      console.error("Error uploading file:", err);
      return res.status(500).json({ error: "Error uploading file" });
    }

    // ফাইল আপলোড হলে এর URL রিটার্ন করব
    const imageUrl = `/uploads/${req.file.filename}`;
    return res.status(200).json({ success: true, imageUrl });
  });
};

export default handler;
