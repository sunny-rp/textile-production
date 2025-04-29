import API from "./axiosInstance.js";

const registerUser = async (userData) => API.post("users/register", userData);
const loginUser = async (userData) => API.post("users/login", userData);
const logoutUser = async (userData) => API.post("users/logout", userData);

export { registerUser, logoutUser, loginUser }