import axios from "../lib/axiosDefault";

export const ApiAuth = async () => {
  const response = await axios.get(`/auth`);
  return response;
};

export const ApiLogin = async payload => {
  const response = await axios.post(`/auth`, payload);
  return response;
};
