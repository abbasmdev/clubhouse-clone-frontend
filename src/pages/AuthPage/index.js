import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import AuthGetPhone from "../../components/auth/AuthGetPhone";
import AuthGetOtpcode from "../../components/auth/AuthGetOtpcode";
import AuthGetProfileInfo from "../../components/auth/AuthGetProfileInfo";

import "./AuthPage.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUserAync,
  loginUserStatusIdle,
  registerUserAync,
  selectAuthSendOtpCodeToUserStatus,
  selectAuthToken,
  selectLoginUserStatus,
  selectRegisterUserErrorMessage,
  selectRegisterUserStatus,
  sendOtpCodeToUserAsync,
  sendOtpCodeToUserStatusIdle,
  setRegisterUserStatusMsgIdle,
} from "../../features/auth/authSlice";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

function AuthPage({ className }) {
  const sendOtpStatus = useSelector(selectAuthSendOtpCodeToUserStatus);
  const loginUserStatus = useSelector(selectLoginUserStatus);
  const registerUserErrorMessage = useSelector(selectRegisterUserErrorMessage);
  const registerUserStatus = useSelector(selectRegisterUserStatus);

  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const isSignup = useRef(false);
  const [phone, setPhone] = useState({});
  const [code, setCode] = useState();
  const history = useHistory();
  const locaiton = useLocation();

  const onGetPhoneNextClick = ({ phone, ccode }) => {
    setPhone(`0${phone}`);
    dispatch(sendOtpCodeToUserAsync({ mobile: `0${phone}` }));
  };

  const onGetOtpCodeNextClick = ({ code }) => {
    setCode(code);
    if (isSignup.current === true) {
      setStep(3);
    } else {
      dispatch(loginUserAync({ mobile: phone, code }));
    }
  };
  const onGetProfileInfoNextClick = ({ userName, fullName, selectedFile }) => {
    dispatch(
      registerUserAync({
        userName,
        code,
        fullName,
        imageFile: selectedFile,
        mobile: phone,
      })
    );
  };

  useEffect(() => {
    if (locaiton?.search === "?signup") isSignup.current = true;
  }, [locaiton]);
  useEffect(() => {
    if (sendOtpStatus === "succeed") {
      dispatch(sendOtpCodeToUserStatusIdle());
      setStep(2);
    }
    if (sendOtpStatus === "rejected") {
      dispatch(sendOtpCodeToUserStatusIdle());
      alert("Error on sending code.");
    }
  }, [sendOtpStatus]);

  useEffect(() => {
    if (loginUserStatus == "succeed") {
      dispatch(loginUserStatusIdle());
      history.replace("/");
    }
    if (loginUserStatus === "rejected") {
      dispatch(loginUserStatusIdle());
      alert("login failed.  make sure mobile and code is correct.");
    }
  }, [loginUserStatus]);

  useEffect(() => {
    if (registerUserStatus === "rejected") {
      dispatch(setRegisterUserStatusMsgIdle());
      alert(registerUserErrorMessage || "Unknown error");
    }
    if (registerUserStatus === "succeed") {
      dispatch(setRegisterUserStatusMsgIdle());
      history.replace("/");
    }
  }, [registerUserErrorMessage, registerUserStatus]);
  const authToken = useSelector(selectAuthToken);
  useEffect(() => {
    if (authToken) {
      history.replace("/");
    }
  }, [authToken]);
  return (
    <div className={clsx("authPage", className)}>
      <AuthGetPhoneContainer hidden={step !== 1}>
        <AuthGetPhone onNextClicked={onGetPhoneNextClick} />
      </AuthGetPhoneContainer>
      <AuthGetOtpcodeContainer hidden={step !== 2}>
        <AuthGetOtpcode
          onBackClicked={() => {
            setStep(1);
          }}
          onNextClicked={onGetOtpCodeNextClick}
        />
      </AuthGetOtpcodeContainer>

      <AuthGetProfileInfoContainer hidden={step !== 3}>
        <AuthGetProfileInfo
          onBackClicked={() => {
            setStep(2);
          }}
          onNextClicked={onGetProfileInfoNextClick}
        />
      </AuthGetProfileInfoContainer>
    </div>
  );
}

const AuthGetPhoneContainer = styled.div``;
const AuthGetOtpcodeContainer = styled.div``;
const AuthGetProfileInfoContainer = styled.div``;
export default AuthPage;
