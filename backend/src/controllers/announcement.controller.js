import { Announcement } from "../models/index.js";

const getLatestAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.findOne({
          order: [['createdAt', 'DESC']], // Find the newest one
        });
        res.status(200).json(announcement);
      } catch (error) {
        res.status(500).json({ message: "Error fetching announcement." });
      }
}

const publishAnnouncement = async (req, res) => {
    try {
      const { content } = req.body;
      if (!content) {
        return res.status(400).json({ message: "Content is required." });
      }
  
      let announcement = await Announcement.findOne();
  
      if (announcement) {
        announcement.content = content;
        await announcement.save();
      } else {
        announcement = await Announcement.create({ content });
      }
      res.status(200).json({ message: "Announcement published successfully.", announcement });
    } catch (error) {
      res.status(500).json({ message: "Error publishing announcement." });
    }
  };
  
  const deleteAnnouncement = async (req, res) => {
    try {
      await Announcement.destroy({
        where: {},
        truncate: true 
      });
      res.status(200).json({ message: "Announcement deleted successfully." });
    } catch (error) {
      res.status(500).json({ message: "Error deleting announcement." });
    }
  };
  
  export { getLatestAnnouncement, publishAnnouncement, deleteAnnouncement };