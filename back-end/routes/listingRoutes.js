

import express from 'express';
import multer from 'multer';
import path from 'path';
import { createListing, softDeleteListingById, getListingById, getListings, getListingsByUserId, updateListing } from '../controllers/ListingController.js';
import { protect } from '../middleware/auth.js';


const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { files: 20 } });

// Route that uses the controller
router.post('/create',protect, upload.array('images', 20), createListing);
router.get('/getlistings',getListings)
router.get('/getlistings/:id',getListingById)
router.get('/users/:userId',protect,getListingsByUserId)
// router.put("/:id",protect, deleteListingsByUserId)
router.put("/delete/:id",protect, softDeleteListingById);
// router.put("/update/:id", protect, updateListing);

router.put("/update/:id",protect, upload.array("images"), updateListing);



export default router;

