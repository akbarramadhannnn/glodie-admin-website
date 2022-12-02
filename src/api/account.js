import axios from "../lib/axiosDefault";

export const ApiGetAccountLists = async () => {
  const response = await axios.get(`/account`);
  return response;
};

export const ApiCreateAccount = async payload => {
  const response = await axios.post(`/account`, payload);
  return response;
};

export const ApiGetDetailAccount = async id => {
  const response = await axios.get(`/account/${id}`);
  return response;
};

export const ApiUpdateAccount = async (id, payload) => {
  const response = await axios.put(`/account/${id}`, payload);
  return response;
};

export const ApiDeleteAccount = async id => {
  const response = await axios.delete(`/account/${id}`);
  return response;
};
