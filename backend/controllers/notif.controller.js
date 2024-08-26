import Notification from "../models/notification.model.js";

export const getNotification = async (req, res) => {
  try {
    const userId = req.user._id;
    const notif = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json(notif);
  } catch (error) {
    console.log("Error in get notification", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in delete notification", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteOne = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;
    const notif = await Notification.findById(id);

    if (!notif) {
      return res.status(404).json({ error: "Notification not found" });
    }

    if (Notification.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete notification" });
    }

    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.log("Error in delete notification", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
