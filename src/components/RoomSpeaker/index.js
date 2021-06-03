import {
  MicOff as MicOffIcon,
  VerifiedUser,
  VerifiedUserOutlined,
} from "@material-ui/icons";
import clsx from "clsx";
import React from "react";
import styled from "styled-components";
import { PROIFLE_IMAGES_BASE_URL } from "../../config/app.config";
import Avatar from "../Avatar";
import "./RoomSpeaker.scss";
function RoomSpeaker({
  className,
  isSpeaking,
  isMicMuted,
  onClick,
  fullName,
  id,
  profilePhotoName,
  username,
  isRoomMod,
  isRoomCreator,
}) {
  return (
    <div onClick={onClick} className={clsx("roomSpeaker", className)}>
      <Container>
        <AvatarMicContainer>
          <CustomAvatar
            isSpeaking={isSpeaking}
            src={`${PROIFLE_IMAGES_BASE_URL}/${profilePhotoName}`}
          />
          {isMicMuted && (
            <MicMutedContainer>
              <MicOffIcon />
            </MicMutedContainer>
          )}
          {(isRoomMod || isRoomCreator) && (
            <VerifiedUserIconContainer>
              <VerifiedUser />
            </VerifiedUserIconContainer>
          )}
        </AvatarMicContainer>
        <p>{fullName}</p>
      </Container>
    </div>
  );
}

export default RoomSpeaker;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const AvatarMicContainer = styled.div`
  position: relative;
`;
const MicMutedContainer = styled.div`
  background-color: white;
  color: red;
  border-radius: 50%;
  position: absolute;
  right: 5%;
  top: 70%;
`;

const VerifiedUserIconContainer = styled.div`
  background-color: white;
  color: green;
  border-radius: 50%;
  position: absolute;
  left: 5%;
  top: 70%;
`;
const CustomAvatar = styled(Avatar)`
  width: 80px;
  height: 80px;
  border: ${(props) =>
    props.isSpeaking ? "3px solid gray" : "3px solid transparent"};
`;
