import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const followUnfollowUser = async (req, res) => {
  const { id } = req.params;
  try {
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }

    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      // TODO: return the id of the user as a response
      res.status(200).json({ message: "unfollowed" });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotif = new Notification({
        type: "follow",
        from: req.user._id,
        to: userToModify.id,
      });

      await newNotif.save();

      // TODO: return the id of the user as a response
      res.status(200).json({ message: "followed" });
      // send notif to user
    }
  } catch (error) {
    console.log("Error in followUnfollowUser controller", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const getSuggested = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollowedByMe = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId }, //match id not equal to userId
        },
      },
      { $sample: { size: 10 } },
    ]);

    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggested", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const { fullName, email, username, currentPassword, newPassword, bio, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      (!newPassword && currentPassword) ||
      (newPassword && !currentPassword)
    ) {
      return res.status(400).json({ error: "Please provide both password" });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid password" });
      if (newPassword.length < 4)
        return res
          .status(400)
          .json({ error: "Password must be at least 4 characters long" });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    if (profileImg) {
    }
    if (coverImg) {
    }
  } catch (error) {
    console.log("Error in updateUserProfile", error.message);
    res.status(500).json({ error: error.message });
  }
};
