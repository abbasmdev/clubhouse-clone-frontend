import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { PROIFLE_IMAGES_BASE_URL } from "../../config/app.config";
import { selectAuthUser } from "../../features/auth/authSlice";
import Avatar from "../Avatar";
import "./Header.scss";
function Header() {
  const user = useSelector(selectAuthUser);
  const history = useHistory();

  return (
    <div className="header">
      <HeaderLeft>
        <HeaderLeftImage src={"/images/hand.png"} />
        <HeaderLeftTitle onClick={() => history.replace("/")}>
          Clubhouse
        </HeaderLeftTitle>
      </HeaderLeft>
      <HeaderRight>
        <PersonName>{user?.username} </PersonName>
        <CustomAvatar
          onClick={() => history.replace(`/profiles/${user._id}`)}
          src={`${PROIFLE_IMAGES_BASE_URL}/${user?.profilePhotoName}`}
        />
      </HeaderRight>
    </div>
  );
}

export default Header;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const CustomAvatar = styled(Avatar)`
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  border: 0.45px solid green;
  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
const HeaderLeftTitle = styled.h3`
  font-weight: 700;
  margin-left: 4px;
  :hover {
    cursor: pointer;
    opacity: 0.8;
  }
`;
const HeaderLeftImage = styled.img`
  height: 40px;

  animation-name: wave-animation;
  animation-duration: 1s;
  animation-iteration-count: 1;

  @keyframes wave-animation {
    0% {
      transform: rotate(0deg);
    }
    20% {
      transform: rotate(-10deg);
    }
    40% {
      transform: rotate(10deg);
    }
    60% {
      transform: rotate(-10deg);
    }
    80% {
      transform: rotate(10deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const PersonName = styled.h3`
  margin-right: 6px;
  display: none;
  @media only screen and (min-width: 425px) {
    display: inline-flex;
  }
`;
