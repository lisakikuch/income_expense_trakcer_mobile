const User = require("../models/userModel");

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// Delete a user by ID (Admin only)
exports.deleteUser = async (req, res) => {
    try {

        console.log("DELETE USER CALLED");
        console.log("Authenticated admin ID:", req.user._id);
        console.log("Target user ID to delete:", req.params.id);

        if (req.user._id.toString() === req.params.id) {
            return res.status(403).json({ message: "You cannot delete your own account." });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.deleteOne();
        console.log("User deleted successfully");
        res.json({ message: "User deleted" });

    } catch (err) {
        onsole.error("Error in deleteUser:", err);
    res.status(500).json({ message: "Failed to delete user", error: err.message });
    }
};