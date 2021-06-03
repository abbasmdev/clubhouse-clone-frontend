import { IconButton } from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import {
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon,
} from "@material-ui/icons";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useHistory, useLocation } from "react-router-dom";
import Avatar from "../../components/Avatar";
import IconButton2 from "../../components/IconButton";
import "./ProfilePage.scss";
import Modal from "react-modal";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  selectAuthToken,
  selectAuthUser,
} from "../../features/auth/authSlice";
import axios from "axios";
import { API_BASE_URL, PROIFLE_IMAGES_BASE_URL } from "../../config/app.config";
const ProfilePage = ({ className }) => {
  const history = useHistory();
  const [profile, setProfile] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState("idle");
  const [isFollowing, setIsFollowing] = useState(false);
  const location = useLocation();

  const jwtToken = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const loggedInUser = useSelector(selectAuthUser);
  //pathname: "/profiles/1"
  const id = location?.pathname?.split("/")?.[2];

  useEffect(() => {
    setLoading("loading");
    axios
      .get(`${API_BASE_URL}/users/profiles/${id}`, {
        headers: { Authorization: `Bearer ${jwtToken} ` },
      })
      .then((res) => {
        const p = res?.data;

        if (p) setProfile(p);
        setLoading("success");
      })
      .catch((e) => {
        setLoading("rejected");
      });
  }, [id, isFollowing]);

  useEffect(() => {
    if (profile) {
      if (
        profile?.followers?.findIndex(
          (pp) => pp.followerId == loggedInUser?._id
        ) >= 0
      )
        setIsFollowing(true);
    }
  }, [profile]);
  useEffect(() => {
    if (loading == "rejected" && !profile) history.replace("/");
  }, [loading, profile]);

  const followUser = (follow) => {
    axios
      .post(
        `${API_BASE_URL}/users/profiles/${id}/${
          follow ? "follow" : "unfollow"
        }`,
        {},
        {
          headers: { Authorization: `Bearer ${jwtToken} ` },
        }
      )
      .then((res) => {
        setIsFollowing(follow);
      })
      .catch((e) => {});
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onModalLogoutClick = () => {
    console.log("aaa");
    dispatch(logoutUser());
  };

  const buildFollowUnFollow = () => {
    if (isFollowing)
      return (
        <IconButton2 onClick={() => followUser(false)}>Unfollow</IconButton2>
      );
    return <IconButton2 onClick={() => followUser(true)}>Follow</IconButton2>;
  };
  return (
    <div className={clsx("profilePage", className)}>
      {loading == "success" && (
        <>
          <Header />
          <Navbar className="profilePage__navbar">
            <div className="profilePage__navbar__left">
              <IconButton onClick={() => history.push("/")}>
                <ArrowBackIcon />
              </IconButton>
              <h3>Back</h3>
            </div>
          </Navbar>
          <MainContaier>
            <MainHeader>
              <MainHeaderLeft>
                <UserInfoContainer>
                  <CustomAvatar
                    src={`${PROIFLE_IMAGES_BASE_URL}/${profile?.userProfile?.profilePhotoName}`}
                  />
                  <UserNameUsernameContainer>
                    <p id="fullname">{profile?.userProfile?.fullName}</p>
                    <p id="username">@{profile?.userProfile?.username}</p>
                  </UserNameUsernameContainer>
                </UserInfoContainer>
                <ActionsContainer>
                  {loggedInUser?._id != id && buildFollowUnFollow()}
                  <CustomMoreVertIcon onClick={() => setIsModalOpen(true)} />
                </ActionsContainer>
              </MainHeaderLeft>
              <MainHeaderRight>
                <MainHeaderRightContainer>
                  <FollowersContainer>
                    <p className="followContainerP1">
                      {profile?.userProfile?.followers?.length}
                    </p>
                    <p className="followContainerP2">Followers</p>
                  </FollowersContainer>
                  <FollowingContainer>
                    <p className="followContainerP1">
                      {profile?.userProfile?.followings?.length}
                    </p>
                    <p className="followContainerP2">Following</p>
                  </FollowingContainer>
                </MainHeaderRightContainer>
              </MainHeaderRight>
            </MainHeader>
            <MainContent>
              <p>{profile?.userProfile?.bio}</p>
            </MainContent>
            <Modal
              ariaHideApp={false}
              className={clsx("profilePage__Modal")}
              isOpen={isModalOpen}
              onRequestClose={closeModal}
              overlayClassName="profilePage__myoverlay"
            >
              <ModalContainer>
                <IconButton2 onClick={onModalLogoutClick}>Log out</IconButton2>
              </ModalContainer>
            </Modal>
          </MainContaier>
        </>
      )}
    </div>
  );
};
const MainContaier = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
  overflow-y: scroll;

  height: 100%;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  /* justify-content: center; */
  align-items: center;
  justify-content: center;
`;

const CustomMoreVertIcon = styled(MoreVertIcon)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const MainHeader = styled.div`
  display: flex;
  /* flex-wrap: wrap; */
  flex-direction: column;
  @media screen and (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;
const MainHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const CustomAvatar = styled(Avatar)`
  flex: 0.5;
  height: 80px;
  width: 80px;
  max-height: 80px;
  max-width: 80px;
`;

const UserNameUsernameContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0.5;
  margin-left: 10px;
  margin-right: 10px;
  overflow: hidden;
  justify-content: center;
  > #username {
    overflow: hidden;
    text-overflow: ellipsis;
    color: gray;
    font-size: 12px;
  }
  > #fullname {
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
`;
const UserInfoContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const MainHeaderRight = styled.div`
  display: flex;
  justify-content: center;
`;
const MainHeaderRightContainer = styled.div`
  flex-direction: row;
  margin-top: 10px;
  display: flex;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 1px 1px 1px rgba(0, 0, 0, 0.1);
  width: fit-content;
  .followContainerP1 {
    font-weight: 700;
  }
  .followContainerP2 {
    color: grey;
  }
`;

const FollowersContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`;

const FollowingContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 10px;
`;
const MainContent = styled.div`
  margin-top: 20px;
  padding-bottom: 20px;
`;
export default ProfilePage;
