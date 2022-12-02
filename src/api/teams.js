import axios from "../lib/axiosDefault";

export const ApiGetTeamsLists = async () => {
  const response = await axios.get(`/teams`);
  return response;
};

export const ApiCreateTeams = async formData => {
  const response = await axios.post(`/teams`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const ApiGetDetailTeams = async id => {
  const response = await axios.get(`/teams/${id}`);
  return response;
};

export const ApiUpdateTeams = async (id, formData) => {
  const response = await axios.put(`/teams/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

export const ApiDeleteTeams = async id => {
  const response = await axios.delete(`/teams/${id}`);
  return response;
};
