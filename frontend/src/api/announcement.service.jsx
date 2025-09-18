import axios from "axios";

const API_URL = "http://localhost:5000/api/announcements";

const getLatestAnnouncement = async (token) => {
  const response = await axios.get(`${API_URL}/latest`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const publishAnnouncement = async (content, token) => {
  const response = await axios.post(
    API_URL,
    { content },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};

const deleteAnnouncement = async (token) => {
  const response = await axios.delete(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export {getLatestAnnouncement, publishAnnouncement,deleteAnnouncement}