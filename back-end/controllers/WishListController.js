


import Wishlist from '../model/WishList.js';

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    // Validate productId
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // Check if wishlist exists
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      // Create new wishlist with the product
      wishlist = new Wishlist({
        userId,
        products: [{ productId }]
      });
    } else {
      // Check if product already exists in wishlist
      const alreadyExists = wishlist.products.some(
        item => item.productId.toString() === productId
      );

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "Product already in wishlist"
        });
      }

      // Add new product to wishlist
      wishlist.products.push({ productId });
    }

    // Save updated wishlist
    const savedWishlist = await wishlist.save();

    // Populate product details
    const populatedWishlist = await Wishlist.populate(savedWishlist, {
      path: 'products.productId'
    });

    res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist: populatedWishlist
    });

  } catch (error) {
    console.error("Error adding to wishlist:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getWishlist = async (req, res) => {
    try {
        const userId = req.user._id;
        const wishlist = await Wishlist.findOne({ userId })
            .populate("products.productId")
            .lean();

        if (!wishlist) {
            return res.status(200).json({ 
                success: true,
                message: "Wishlist is empty",
                wishlist: { products: [] } 
            });
        }

        res.status(200).json({
            success: true,
            wishlist
        });

    } catch (error) {
        console.error("Error retrieving wishlist:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
};



export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    // Validate input
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found"
      });
    }

    // Check if product exists in wishlist
    const index = wishlist.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist"
      });
    }

    // Remove the product
    wishlist.products.splice(index, 1);

    // Save the updated wishlist
    const updatedWishlist = await wishlist.save();

    // Populate product details before sending response
    const populatedWishlist = await Wishlist.populate(updatedWishlist, {
      path: "products.productId"
    });

    res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist: populatedWishlist
    });

  } catch (error) {
    console.error("Error removing product from wishlist:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};
