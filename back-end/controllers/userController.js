import User from "../model/User.js";

//  Get current user profile
export const getUserById = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-otp");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name || "",
      phone: user.phone || "",
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

export const getUserByIdByParam = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "Error getting user", error: error.message });
  }
};


//  Update user profile
export const addData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
