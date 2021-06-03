import IconButton from "../../components/IconButton";
import clsx from "clsx";
import React from "react";
import styled from "styled-components";
import "./WelcomePage.scss";
import { ArrowRightAlt } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../features/auth/authSlice";
import { useEffect } from "react";
function WelcomePage({ className }) {
  const history = useHistory();
  const onSigninClick = () => {
    history.push("/auth");
  };
  const onSignupClick = () => {
    history.push("/auth?signup");
  };

  const authToken = useSelector(selectAuthToken);
  useEffect(() => {
    if (authToken) {
      history.replace("/");
    }
  }, [authToken]);
  return (
    <div className={clsx("welcomePage", className)}>
      <Container>
        <Header>
          <img src="/images/hand.png" alt="" />
          <p>Welcome to Clubhouse!</p>
        </Header>
        <Message>
          We're working hard to get Clubhouse ready for everyone! while we wrap
          up the finishing youches, we're adding people gradually to make sure
          nothing breaks!
        </Message>
        <Footer>
          <SignUpButton onClick={onSignupClick}>
            <p>Sinup</p>
            <ArrowRightAlt />
          </SignUpButton>
          <SinginContainer>
            <SignInMessage>Have an account?</SignInMessage>
            <SingInButton onClick={onSigninClick}>Singin</SingInButton>
          </SinginContainer>
        </Footer>
      </Container>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  background-color: white;
  padding: 30px;
  max-width: 425px;
  border-radius: 20px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  > img {
    width: 40px;
    height: 40px;
  }
  > p {
    font-weight: 600;
    font-size: 18px;
    color: black;
  }
`;
const Message = styled.p`
  color: #404040;
`;
const Footer = styled.div`
  display: flex;

  flex-direction: column;
  max-width: fit-content;
  gap: 10px;
  align-self: center;
`;
const SignUpButton = styled(IconButton)`
  gap: 10px;
  justify-content: center;
`;
const SinginContainer = styled.div`
  display: flex;

  gap: 2px;
  > p {
    color: #5d5d5d;
  }
`;
const SignInMessage = styled.p``;
const SingInButton = styled(IconButton)`
  background-color: white;
  color: #404099;
  font-weight: 500;
  font-size: 14px;
`;

export default WelcomePage;
