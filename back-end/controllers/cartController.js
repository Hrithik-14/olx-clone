import Cart from "../model/Cart.js";

export const addToCart = async (req, res) => {
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
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // Create new wishlist with the product
      cart = new Cart({
        userId,
        products: [{ productId }]
      });
    } else {
      // Check if product already exists in wishlist
      const alreadyExists = cart.products.some(
        item => item.productId.toString() === productId
      );

      if (alreadyExists) {
        return res.status(400).json({
          success: false,
          message: "Product already in cart"
        });
      }

      // Add new product to wishlist
      cart.products.push({ productId });
    }

    // Save updated wishlist
    const savedCart = await cart.save();

    // Populate product details
    const populatedCart = await Cart.populate(savedCart, {
      path: 'products.productId'
    });

    res.status(200).json({
      success: true,
      message: "Product added to Cart",
      cart : populatedCart
    });

  } catch (error) {
    console.error("Error adding to Cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId })
            .populate("products.productId")
            .lean();

        if (!cart) {
            return res.status(200).json({ 
                success: true,
                message: "Cart is empty",
                cart: { products: [] } 
            });
        }

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        console.error("Error retrieving cart:", error);
        res.status(500).json({ 
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
};


export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const index = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    cart.products.splice(index, 1);
    const updatedCart = await cart.save();

    const populatedCart = await Cart.populate(updatedCart, {
      path: "products.productId"
    });

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: populatedCart
    });

  } catch (error) {
    console.error("Error removing product from cart:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};