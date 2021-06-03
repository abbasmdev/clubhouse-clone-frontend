import clsx from "clsx";
import { io } from "socket.io-client";
import Peer from "peerjs";
import React, { useEffect, useRef, useState } from "react";
import {
  ArrowBack as ArrowBackIcon,
  PanToolOutlined as PanToolOutlined,
  MicOffOutlined as MicOffOutlinedIcon,
  MicOutlined as MicOutlinedIcon,
  PersonAdd as PersonAddIcon,
} from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import IconButton2 from "../../components/IconButton";
import RoomSpeaker from "../../components/RoomSpeaker";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import "./RoomPage.scss";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  getJoinedRoomDetailAsync,
  getJoinedRoomDetailStatus,
  selectCurrentRoom,
  selectCurrentRoomId,
  setCurrentRoom,
  setCurrentRoomId,
  setGetJoinedRoomDetailStatus,
} from "../../features/rooms/roomsSlice";
import { selectAuthToken, selectAuthUser } from "../../features/auth/authSlice";
import { PEER_OPT, SERVER_BASE_URL } from "../../config/app.config";
import AdddUserToRoom from "../../components/modals/AdddUserToRoom";

function RoomPage({ className }) {
  const [audios, setAudios] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [others, setOthers] = useState([]);
  const [isMicOff, setIsMicOff] = useState(true);
  const socketClientRef = useRef();
  const scDisAutoRedirectRef = useRef(true);
  const firstInitRef = useRef(true);
  const peerRef = useRef();
  const myStreamRef = useRef();

  const currentRoom = useSelector(selectCurrentRoom);
  const jwtToken = useSelector(selectAuthToken);
  const currentRoomId = useSelector(selectCurrentRoomId);
  const getJoinedRDS = useSelector(getJoinedRoomDetailStatus);
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch();
  const history = useHistory();
  const [isAddUser2roomOpen, setisAddUser2roomOpen] = useState(false);

  const onRoomSpeakerClick = () => {
    history.replace("/profiles/1");
  };

  const onRaiseHandClick = () => {};
  const onLeaveQuietlyClick = () => {
    history.replace("/");
  };
  const toggleMicMuted = () => {
    const nextVal = !isMicOff;
    setIsMicOff(nextVal);

    let soundPath = "/sounds/mic-off.mp3";
    if (nextVal == false) soundPath = "/sounds/mic-on.mp3";
    const audio = new Audio(soundPath);
    audio.play();
  };

  useEffect(() => {
    console.log("here", isMicOff);
    if (myStreamRef?.current) {
      console.log(
        "myStreamRef.current.getAudioTracks()[0].enabled",
        myStreamRef.current.getAudioTracks()[0].enabled
      );
      myStreamRef.current.getAudioTracks()[0].enabled = !isMicOff;
      socketClientRef?.current?.emit("user-update-event", "micMuted", isMicOff);
    }
  }, [isMicOff]);

  const roomUpdateonYouenteredEvent = () => {
    let soundPath = "/sounds/mic-off.mp3";
    soundPath = "/sounds/room-enter.mp3";
    const audio = new Audio(soundPath);
    audio.play();
  };
  const onCallStream = (remoteStream) => {
    // console.log(", remoteStream);
    setAudios((prevAudios) => [...prevAudios, remoteStream]);
  };
  const onNewUserEntered = (username) => {
    const call = peerRef.current.call(username, myStreamRef.current);
    call.on("stream", onCallStream);
  };
  const onPeerCall = async (call) => {
    console.log("onPeerCall>>", call);
    call.answer(myStreamRef.current);
    call.on("stream", onCallStream);
  };
  const onPeerOpen = async () => {
    myStreamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    myStreamRef.current.getAudioTracks()[0].enabled = !isMicOff;

    socketClientRef.current.on("user-entered", onNewUserEntered);
    socketClientRef.current.emit("enter-room", currentRoom.rtcRoomName);
  };

  const IoOnRoomUpdateEvent = (updateName, data) => {
    switch (updateName) {
      case "you-entered":
        roomUpdateonYouenteredEvent();
        // socketClientRef.current.emit("get-room-info", currentRoom.rtcRoomName);
        break;
      case "room-info":
        const speakers = data?.speakers;
        if (speakers?.length >= 0) setSpeakers(speakers);
        const others = data?.others;
        if (others?.length >= 0) setOthers(others);
        break;
      default:
        break;
    }
    console.log(updateName, data);
  };

  const socketIoOnConnect = async () => {
    try {
      peerRef.current = new Peer(user?.username, PEER_OPT);
      peerRef.current.connect();
      peerRef.current.on("open", onPeerOpen);
      peerRef.current.on("call", onPeerCall);
    } catch (error) {
      alert(error?.message);
    }
  };
  const socketIoOnDisconnect = async () => {
    console.log("socket io disconnected.");
    if (scDisAutoRedirectRef.current === true) {
      console.log("socketIoOnDisconnect>>>");
      history.push("/");
    }
  };

  const init = () => {
    const sc = io(`${SERVER_BASE_URL}`, { query: { token: jwtToken } });
    socketClientRef.current = sc;
    socketClientRef.current.on("connect", socketIoOnConnect);
    socketClientRef.current.on("auth-ok", () => {
      socketClientRef.current.emit("get-room-info", currentRoom.rtcRoomName);
    });
    socketClientRef.current.on("room-update-event", IoOnRoomUpdateEvent);
    socketClientRef.current.on("disconnect", socketIoOnDisconnect);
  };

  const onRemove = () => {
    let soundPath = "/sounds/mic-off.mp3";
    soundPath = "/sounds/room-exit.mp3";
    const audio = new Audio(soundPath);
    audio.play();
    scDisAutoRedirectRef.current = false;

    myStreamRef.current?.getTracks()?.forEach((t) => t?.stop());
    myStreamRef.current = null;
    peerRef.current?.disconnect();
    peerRef.current?.destroy();
    socketClientRef.current?.disconnect();

    console.log("socketClient", socketClientRef.current);
    console.log("myStreamRef", myStreamRef.current);
    console.log("peerRef", peerRef.current);
    console.log("socketClientRef", socketClientRef.current);
    dispatch(setCurrentRoomId(null));
    dispatch(setCurrentRoom(null));
    dispatch(setGetJoinedRoomDetailStatus("idle"));
  };

  //one tiem init base on current room
  useEffect(() => {
    if (currentRoom != null && firstInitRef.current == true) {
      firstInitRef.current = false;
      init();
    }
  }, [currentRoom]);
  //clean on comp. unmount
  useEffect(() => {
    return () => onRemove();
  }, []);

  if (!currentRoomId) {
    history.replace("/");
  }
  if (!currentRoom && currentRoomId) {
    dispatch(getJoinedRoomDetailAsync({ roomId: currentRoomId }));
  }

  return (
    <div className={clsx("roomPage", className)}>
      {/*Header */}
      <Header />

      <Navbar className="roomPage__navbar">
        <div className="roomPage__navbar__left">
          <IconButton onClick={() => history.replace("/")}>
            <ArrowBackIcon />
          </IconButton>

          <h3>All rooms</h3>
        </div>
        <div className="roomPage__navbar__right">
          <IconButton
            onClick={() => {
              setisAddUser2roomOpen(true);
            }}
          >
            <PersonAddIcon />
          </IconButton>
        </div>
      </Navbar>
      <RoomMainContaier>
        {getJoinedRDS === "succeed" && (
          <>
            <RoomMainContaierHeader>
              <p>{currentRoom?.name}</p>
              <ActionsContainer>
                <RighActionsContainer>
                  <HandIconButton onClick={onRaiseHandClick}>
                    <PanToolOutlined />
                  </HandIconButton>
                  <HandIconButton onClick={onRaiseHandClick}>
                    {isMicOff ? (
                      <MicOffOutlinedIcon
                        onClick={toggleMicMuted}
                        style={{ color: "red" }}
                      />
                    ) : (
                      <MicOutlinedIcon onClick={toggleMicMuted} />
                    )}
                  </HandIconButton>
                </RighActionsContainer>

                <LeaveIconButton onClick={onLeaveQuietlyClick}>
                  <p>✌ Leave quietly</p>
                </LeaveIconButton>
              </ActionsContainer>
            </RoomMainContaierHeader>
            <RoomMainContaierSpeakers>
              {speakers?.map((sp) => {
                console.log(sp);
                return (
                  <RoomSpeaker
                    key={sp._id}
                    isMicMuted={sp?.micMuted}
                    fullName={sp?.user?.fullName}
                    id={sp._id}
                    profilePhotoName={sp?.user?.profilePhotoName}
                    username={sp?.user?.username}
                    isRoomMod={sp?.isRoomMod}
                    isRoomCreator={sp?.isRoomCreator}
                    onClick={onRoomSpeakerClick}
                    isSpeaking
                  />
                );
              })}
            </RoomMainContaierSpeakers>
            <RoomMainContaierOthers>
              <p>Other in the room</p>
              <OtherListContainer>
                {others?.map((sp) => (
                  <RoomSpeaker
                    key={sp._id}
                    isMicMuted={sp?.micMuted}
                    fullName={sp?.user?.fullName}
                    id={sp._id}
                    profilePhotoName={sp?.user?.profilePhotoName}
                    username={sp?.user?.username}
                    isRoomMod={sp?.isRoomMod}
                    isRoomCreator={sp?.isRoomCreator}
                    onClick={onRoomSpeakerClick}
                  />
                ))}
              </OtherListContainer>
            </RoomMainContaierOthers>

            <AudioObjectsContainer className="audios__container">
              {audios.map((audioStream) => {
                return (
                  <AudioElement
                    key={audioStream?.id}
                    ref={(ad) => {
                      if (ad) ad.srcObject = audioStream;
                    }}
                    autoPlay={true}
                  />
                );
              })}
            </AudioObjectsContainer>

            <AdddUserToRoom
              roomId={currentRoomId}
              onOpenChanged={(v) => setisAddUser2roomOpen(v)}
              open={isAddUser2roomOpen}
            />
          </>
        )}
      </RoomMainContaier>
    </div>
  );
}

export default RoomPage;
const AudioObjectsContainer = styled.div``;

const AudioElement = styled.audio``;
const HandIconButton = styled(IconButton2)`
  background-color: lightgray;
  color: black;
  border-radius: 50%;
  height: 50px;
  width: 50px;
  align-items: center;
  justify-content: center;
`;

const RighActionsContainer = styled.div`
  display: flex;
  flex-direction: flex-row;
  gap: 10px;
`;

const LeaveIconButton = styled(IconButton2)`
  background-color: lightgray;
  color: black;
  color: red;
  font-weight: 600;
  align-items: center;
  justify-content: center;
`;

const RoomMainContaier = styled.div`
  overflow-y: scroll;
  background-color: white;
  border-top-right-radius: 40px;
  border-top-left-radius: 40px;
  flex-grow: 1;
  padding: 20px;
  margin-top: 5px;
`;
const ActionsContainer = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* gap: 10px; */
`;
const RoomMainContaierHeader = styled.div`
  > p {
    font-weight: 700;
    font-size: 20px;
  }
`;
const RoomMainContaierSpeakers = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 10px;
`;
const RoomMainContaierOthers = styled.div`
  margin-top: 35px;

  > p {
    color: gray;
  }
`;

const OtherListContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  row-gap: 10px;
  column-gap: 10px;
`;
