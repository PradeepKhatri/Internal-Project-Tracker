import axios from 'axios';

const LOGIN_API = 'http://localhost:5000/api/auth/login';
const GET_USER_API = 'http://localhost:5000/api/auth/me';

const getMyProfile = async (token) => {
    const response = await axios.get(GET_USER_API, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data;
}

const loginUser = async (email, password) => {
    try {
        const response = await axios.post(LOGIN_API, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to login. Please try again.';
        throw new Error(errorMessage);
    }
};

export { loginUser, getMyProfile };