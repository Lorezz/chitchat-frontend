import axios from 'axios';

const endpoint = process.env.NEXT_PUBLIC_API_HOST;
axios.defaults.withCredentials = true;

export const fbAuth = (data) =>
  axios.post(`${endpoint}/authenticate/facebook`, data);
export const signUp = (data) => axios.post(`${endpoint}/signup`, data);
export const signIn = (data) => axios.post(`${endpoint}/signin`, data);
export const verify = (data) => axios.post(`${endpoint}/verify`, data);
export const signOut = () => axios.post(`${endpoint}/signout`);

export const getRooms = () => axios.get(`${endpoint}/rooms`);
export const getProfile = () => axios.get(`${endpoint}/profile`);
export const addRoom = (data) => axios.post(`${endpoint}/addRoom`, data);
export const getPlayers = (id) => axios.get(`${endpoint}/players/${id}`);

export const upload = (data, headers) =>
  axios.post(`${endpoint}/upload`, data, headers);
