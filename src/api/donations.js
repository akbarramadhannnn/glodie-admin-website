import axios from "../lib/axiosDefault";

export const ApiGetDonationsLists = async () => {
  const response = await axios.get(`/donations`);
  return response;
};

export const ApiCreateDonations = async formData => {
  const response = await axios.post(`/donations`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const ApiGetDetailDonations = async id => {
  const response = await axios.get(`/donations/${id}`);
  return response;
};

export const ApiUpdateDonations = async (id, formData) => {
  const response = await axios.put(`/donations/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const ApiDeleteDonations = async id => {
  const response = await axios.delete(`/donations/${id}`);
  return response;
};
