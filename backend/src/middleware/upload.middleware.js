const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Helper to ensure directory exists
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const profilesDir = path.join(__dirname, "../../uploads/profiles");
const productsDir = path.join(__dirname, "../../uploads/products");
const certificatesDir = path.join(__dirname, "../../uploads/certificates");

ensureDirExists(profilesDir);
ensureDirExists(productsDir);
ensureDirExists(certificatesDir);

// Flexible & Resilient File Filter (Images Only)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp|gif|bmp|jfif|svg/i;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const isImageMime = file.mimetype ? file.mimetype.startsWith("image/") : false;

  if (extname || isImageMime) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp, etc.) are allowed!"));
  }
};

// Storage for Profile Images
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profilesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `profile-${uniqueSuffix}${ext}`);
  },
});

// Storage for Product Images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

// Storage for Certificate Images
const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, certificatesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    cb(null, `cert-${uniqueSuffix}${ext}`);
  },
});

const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: fileFilter,
});

const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: fileFilter,
});

const uploadCertificate = multer({
  storage: certificateStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: fileFilter,
});

module.exports = {
  uploadProfile,
  uploadProduct,
  uploadCertificate,
};
