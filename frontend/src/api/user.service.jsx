import axios from "axios";

const GET_USERS_API = "http://localhost:5000/api/auth/users";
const UPDATE_USER_API = "http://localhost:5000/api/auth";
const CREATE_USER = "http://localhost:5000/api/auth/create-user";
const DELETE_USER_API = "http://localhost:5000/api/auth/users"; 

const getUsers = async (token) => {
  try {
    const response = await axios.get(GET_USERS_API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch users.";
    throw new Error(errorMessage);
  }
};

const getUserById = async (userId, token) => {
  try {
    const response = await axios.get(`${GET_USERS_API}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to fetch user by ID.";
    throw new Error(errorMessage);
  }
};

const updateUserDetail = async (FormData, token, id) => {
  try {
    const response = await axios.patch(
      `${UPDATE_USER_API}/${id}/role`,
      FormData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to update user details.";
    throw new Error(errorMessage);
  }
};

const createUser = async (FormData, token) => {
  try {
    const response = await axios.post(CREATE_USER, FormData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to create user.";
    throw new Error(errorMessage);
  }
};

const deleteUser = async (id, token) => {
  try {
    const response = await axios.delete(`${DELETE_USER_API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to delete user.";
    throw new Error(errorMessage);
  }
};

export { getUsers, getUserById, updateUserDetail, createUser, deleteUser };
