import axios from "../lib/axiosDefault";

export const ApiGetContentWebsite = async menu => {
  const response = await axios.get(`/website/${menu}`);
  return response;
};

export const ApiCreateContentWebsite = async (menu, formData) => {
  const response = await axios.post(`/website/${menu}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const ApiUpdateContentWebsite = async (menu, formData) => {
  const response = await axios.put(`/website/${menu}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
