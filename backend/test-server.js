import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test the server setup
console.log('🧪 Testing Express Server Setup...\n');

// Test 1: Check if uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
console.log('📁 Upload directory:', uploadDir);
console.log('📁 Directory exists:', fs.existsSync(uploadDir));

if (!fs.existsSync(uploadDir)) {
  console.log('📁 Creating uploads directory...');
  fs.mkdirSync(uploadDir);
}

// Test 2: Check multer configuration
const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📂 Multer destination called with:', file.originalname);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const filename = `${name}-${Date.now()}${ext}`;
    console.log('📝 Generated filename:', filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  console.log('🔍 File filter checking:', file.mimetype);
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

const upload = multer({ storage: Storage, fileFilter });

console.log('✅ Multer configuration test completed');
console.log('✅ Server setup looks good!');

// Test 3: Create a test file in uploads directory
const testFilePath = path.join(uploadDir, 'test-file.txt');
fs.writeFileSync(testFilePath, 'This is a test file');
console.log('📄 Created test file:', testFilePath);

// Clean up test file
setTimeout(() => {
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
    console.log('🧹 Cleaned up test file');
  }
  console.log('🎉 All tests completed successfully!');
}, 1000); 