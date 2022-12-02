import { LOAD_AUTH } from "./actionTypes";
import { ApiAuth } from "../../api/auth";

export const loadAuthAction = () => async dispatch => {
  const response = await ApiAuth();
  if (response.status === 200) {
    dispatch({
      type: LOAD_AUTH,
      payload: {
        isAuth: true,
        user: response.result,
      },
    });
  }

  if (response.status === 401) {
    dispatch(authLogoutAction());
  }
};

export const authLogoutAction = () => async dispatch => {
  localStorage.removeItem("token");
  dispatch({
    type: LOAD_AUTH,
    payload: {
      isAuth: false,
      user: {},
    },
  });
};
