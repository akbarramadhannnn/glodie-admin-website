import axios from "../lib/axiosDefault";

export const ApiGetCollectionsLists = async () => {
  const response = await axios.get(`/collections`);
  return response;
};

export const ApiGetDetailCollectionsLists = async id => {
  const response = await axios.get(`/collections/${id}`);
  return response;
};

export const ApiCreateCollections = async formData => {
  const response = await axios.post(`/collections`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const ApiUpdateCollections = async (id, formData) => {
  const response = await axios.put(`/collections/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const ApiDeleteCollections = async id => {
  const response = await axios.delete(`/collections/${id}`);
  return response;
};
