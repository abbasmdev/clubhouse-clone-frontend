import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useHistory } from "react-router-dom";
import {
  fetchLocalAndSetToken,
  getMeAsync,
  selectAuthToken,
  selectAuthUser,
  selectInitalized,
  setToken,
  setUser,
} from "../../features/auth/authSlice";

function AppLayout({ children }) {
  const dispatch = useDispatch();
  const initalized = useSelector(selectInitalized);
  const history = useHistory();
  const authToken = useSelector(selectAuthToken);
  const user = useSelector(selectAuthUser);
  useEffect(() => {
    if (!authToken && initalized) {
      history.replace("/welcome");
    }
    if (authToken && !user) {
      dispatch(getMeAsync());
    }
  }, [authToken, initalized]);

  useEffect(() => {
    dispatch(fetchLocalAndSetToken());
    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          dispatch(setToken(null));
          dispatch(setUser(null));
        }

        return Promise.reject(error);
      }
    );
  }, []);
  return <>{initalized && children}</>;
}

export default AppLayout;
