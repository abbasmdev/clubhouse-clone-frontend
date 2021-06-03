import clsx from "clsx";
import Avatar from "../../components/Avatar";
import React from "react";
import {
  Person as PersonIcon,
  ChatOutlined as ChatOutlinedIcon,
} from "@material-ui/icons";
import styled from "styled-components";
import "./Room.scss";
import IconButton from "../IconButton";
import { PROIFLE_IMAGES_BASE_URL } from "../../config/app.config";
const Room = ({ className, onClick, onJoinRoomClick, room, isPublic }) => {
  const onJoinRoomClicked = () => {
    onJoinRoomClick();
  };
  return (
    <div
      onClick={!isPublic ? onClick : null}
      className={clsx("room", className)}
    >
      {/*Title */}
      <h4>{room?.name}</h4>
      {/*active persons */}
      {!isPublic && (
        <ActivePersonsContainer>
          <ActivePersonsAvatars>
            {[...room?.speakers]?.splice(0, 4)?.map((sp, index) => (
              <Avatar
                key={sp.id}
                className={index === 1 && `activePersonsAvatars__second`}
                src={`${PROIFLE_IMAGES_BASE_URL}/${sp?.user?.profilePhotoName}`}
              />
            ))}
          </ActivePersonsAvatars>
          <ActivePersonsAvatarsNames>
            {[...room?.speakers]?.splice(0, 2)?.map((sp, index) => (
              <ActivePersonsAvatarsNamesItem>
                <h3>{sp?.user?.fullName}</h3>
                <ChatOutlinedIcon />
              </ActivePersonsAvatarsNamesItem>
            ))}
          </ActivePersonsAvatarsNames>
        </ActivePersonsContainer>
      )}

      {/*Total-and-inchat */}

      <FooterContainer>
        {!isPublic ? (
          <>
            <FooterTotalUsersContainer>
              <span>{room?.users?.length}</span>
              <PersonIcon />
            </FooterTotalUsersContainer>
            <FooterActiveUsersContainer>
              <span>{room?.speakers?.length}</span>
              <ChatOutlinedIcon />
            </FooterActiveUsersContainer>
          </>
        ) : (
          <FooterPublicRoom>
            <FooterTotalUsersContainer>
              <span>{room?.users?.length}</span>
              <PersonIcon />
            </FooterTotalUsersContainer>
            <IconButton onClick={onJoinRoomClicked}>Join room</IconButton>
          </FooterPublicRoom>
        )}
      </FooterContainer>
    </div>
  );
};

export default Room;

const FooterPublicRoom = styled.div`
  display: flex;
  gap: 10px;
`;
const FooterContainer = styled.div`
  padding-top: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: gray;
  font-size: 12px;
  border-top: 1px solid whitesmoke;

  .MuiSvgIcon-root {
    font-size: 20px;
    margin-left: 2px;
  }
`;
const FooterTotalUsersContainer = styled.div`
  display: flex;
  align-items: center;
`;
const FooterActiveUsersContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ActivePersonsContainer = styled.div`
  padding-top: 8px;
  min-height: 60px;
  display: flex;
  gap: 10px;

  align-items: flex-start;
`;

const ActivePersonsAvatars = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;

  > .activePersonsAvatars__second {
    position: absolute;
    top: 50%;
    left: 50%;
  }
`;

const ActivePersonsAvatarsNames = styled.div`
  margin-left: 40px;
  padding-top: 5px;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  gap: 4px;
`;

const ActivePersonsAvatarsNamesItem = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  > .MuiSvgIcon-root {
    color: gray;
    font-size: 12px;
  }
  > h3 {
    font-weight: 400;
    font-size: 14px;
    color: #7b7676ee;
  }
`;
