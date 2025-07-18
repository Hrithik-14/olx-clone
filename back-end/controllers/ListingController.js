import Listing from "../model/Listing.js";

export const createListing = async (req, res) => {
  try {
    console.log("🔐 User from token:", req.user);
    console.log("📥 req.body:", req.body);
    console.log("📷 req.files:", req.files);

    const {
      category = "",
      title = "",
      brand,
      model,
      condition,
      authenticity,
      description = "",
      features,
      price = "",
      city = "",
      area = "",
      fullName,
      showPhoneNumber
    } = req.body;

    //  Validation with .trim()
    if (
      !category.trim() ||
      !title.trim() ||
      !price.trim() ||
      !description.trim() ||
      !city.trim() ||
      !area.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    //  Check if user exists from token
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token is missing or invalid"
      });
    }

    //  Handle image files
    const images = Array.isArray(req.files)
      ? req.files.map(file => ({
          url: `/uploads/${file.filename}`,
          filename: file.filename
        }))
      : [];

    //  Create new listing
    const listing = new Listing({
      userId: req.user._id,
      category: category.trim(),
      title: title.trim(),
      brand,
      model,
      condition,
      authenticity,
      description: description.trim(),
      features,
      price: price.trim(),
      city: city.trim(),
      area: area.trim(),
      fullName,
      showPhoneNumber: showPhoneNumber === "true",
      images
    });

    await listing.save();

    return res.status(201).json({
      success: true,
      message: "Ad posted successfully!",
      id: listing._id
    });

  } catch (error) {
    console.error("❌ Error creating listing:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// export const getListings = async (req, res) => {
//   try {
//     const { category } = req.query;

//     let filter = {};
//     if (category) {
//       filter.category = category;
//     }

//     const listings = await Listing.find(filter,{isDeleted:false}).select('-__v');

//     res.status(200).json({ success: true, data: listings });
//   } catch (error) {
//     console.error("Error fetching listings:", error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };


export const getListings = async (req, res) => {
  try {
    const { category } = req.query;

    // Build filter object
    let filter = { isDeleted: false };
    if (category) {
      filter.category = category;
    }

    // Fetch listings based on filter
    const listings = await Listing.find(filter).select('-__v');

    res.status(200).json({ success: true, data: listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id).select('-__v');

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.status(200).json({ success: true, data: listing });
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getListingsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const listings = await Listing.find({ userId ,isDeleted: false});

    if (!listings || listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No listings found for this user",
      });
    }

    return res.status(200).json({
      success: true,
      listings,
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching listings",
    });
  }
};

// export const deleteListingsByUserId = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         message: "User ID is required",
//       });
//     }

//     const deletedResult = await Listing.deleteMany({ id });

//     if (deletedResult.deletedCount === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No listings found to delete for this user",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: `${deletedResult.deletedCount} listing(s) deleted successfully`,
//     });
//   } catch (error) {
//     console.error("Error deleting listings:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while deleting listings",
//     });
//   }
// };


// export const deleteListingsByUserId = async (req, res) => {
//   const listings = await Listing.findById(req.params.id);

//   if (!listings) {
//     res.status(404);
//     throw new Error('Listing not found');
//   }

//   if (listings.users !== req.user._id) {
//     res.status(401);
//     throw new Error('Not authorized to delete this listings');
//   }

//   listings.isDeleted = true;
//   await listings.save();

//   res.status(200).json({
//     success: true,
//     message: "listings soft-deleted successfully"
//   });
// };
export const softDeleteListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await Listing.findById(id).select('-__v');

    if (!listing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    if (listing.isDeleted) {
      return res.status(400).json({ success: false, message: "Listing is already deleted" });
    }

    listing.isDeleted = true;
    await listing.save();

    res.status(200).json({
      success: true,
      message: "Listing soft deleted successfully",
      data: listing,
    });
  } catch (error) {
    console.error("Error soft deleting listing:", error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// export const updateListing = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;

//     // Optional: Prevent updating some fields manually
//     delete updateData._id;
//     delete updateData.createdAt;
//     delete updateData.updatedAt;

//     // Validate if listing exists
//     const existingListing = await Listing.findById(id);
//     if (!existingListing || existingListing.isDeleted) {
//       return res.status(404).json({ success: false, message: 'Listing not found or already deleted' });
//     }

//     // Perform the update
//     const updatedListing = await Listing.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: 'Listing updated successfully',
//       data: updatedListing
//     });
//   } catch (error) {
//     console.error('Error updating listing:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };




export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔐 User from token:", req.user);
    console.log("📥 Update Body:", req.body);
    console.log("📷 Update Files:", req.files);

    // Ensure listing exists
    const existingListing = await Listing.findById(id);
    if (!existingListing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found"
      });
    }

    // Ensure user owns the listing
    if (existingListing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this listing"
      });
    }

    const {
      category,
      title,
      brand,
      model,
      condition,
      authenticity,
      description,
      features,
      price,
      city,
      area,
      fullName,
      showPhoneNumber
    } = req.body;

    // Optional validation (can make it stricter if needed)
    const requiredFields = [category, title, price, description, city, area];
    if (requiredFields.some(field => typeof field === "string" && field.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // Handle image updates if provided
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename
      }));
    }

    // Apply updates
    if (category) existingListing.category = category.trim();
    if (title) existingListing.title = title.trim();
    if (brand) existingListing.brand = brand;
    if (model) existingListing.model = model;
    if (condition) existingListing.condition = condition;
    if (authenticity) existingListing.authenticity = authenticity;
    if (description) existingListing.description = description.trim();
    if (features) existingListing.features = features;
    if (price) existingListing.price = price.trim();
    if (city) existingListing.city = city.trim();
    if (area) existingListing.area = area.trim();
    if (fullName) existingListing.fullName = fullName;
    if (typeof showPhoneNumber !== "undefined") {
      existingListing.showPhoneNumber = showPhoneNumber === "true" || showPhoneNumber === true;
    }
    if (newImages.length > 0) {
      existingListing.images = newImages; // replace old images
    }

    await existingListing.save();

    return res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      updatedId: existingListing._id
    });
  } catch (error) {
    console.error("❌ Error updating listing:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
