import axios from "axios";
import ConfigEnv from "../config/env";
import { LOAD_AUTH } from "../store/auth/actionTypes";
import store from "../store";

let countRefresh = 0;

const axiosInstanceDefault = axios.create({
  baseURL: ConfigEnv.baserUrlAPI,
});
axiosInstanceDefault.interceptors.request.use(async config => {
  const configs = config;
  configs.headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    Accept: "application/json",
  };
  return config;
});
axiosInstanceDefault.interceptors.response.use(
  async response => {
    if (response.data.status === 401) {
      if (countRefresh === 1) {
        store.dispatch({
          type: LOAD_AUTH,
          payload: {
            isAuth: false,
            user: {},
          },
        });
        console.log("isLogout [401]");
        localStorage.removeItem("token");
      }

      countRefresh += 1;
    }
    return response.data;
  },
  async error => {
    console.log("error", error);
  }
);

export default axiosInstanceDefault;
