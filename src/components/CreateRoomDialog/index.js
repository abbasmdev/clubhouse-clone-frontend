import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import {
  Public as PublicIcon,
  Lock as LockIcon,
  Group as GroupIcon,
} from "@material-ui/icons";
import clsx from "clsx";
import "./CreateRoomDialog.scss";
import IconButton from "../IconButton";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoomAsync,
  selectCreateRoomStatus,
  setCreateRoomStatus,
} from "../../features/rooms/roomsSlice";
function CreateRoomDialog({ className, open, onOpenChanged }) {
  const [roomtType, setRoomType] = useState("open");
  const [topicName, setTopicName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDataValid, setIsDataValid] = useState(false);
  const createRoomStatus = useSelector(selectCreateRoomStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (createRoomStatus == "rejected") {
      dispatch(setCreateRoomStatus("idle"));
      alert("error on creating room.");
      closeModal();
    } else if (createRoomStatus == "succeed") {
      dispatch(setCreateRoomStatus("idle"));
      closeModal();
      alert("Room created.");
    }
  }, [createRoomStatus]);

  function openModal() {
    setIsModalOpen(true);
    onOpenChanged(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    onOpenChanged(false);
  }

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  const onLestsGoClick = () => {
    dispatch(
      createRoomAsync({
        roomName: topicName,
        roomType: roomtType.toUpperCase(),
      })
    );
  };
  useEffect(() => {
    if (
      ["open", "social", "closed"].includes(roomtType) &&
      topicName?.trim()?.length >= 3
    ) {
      setIsDataValid(true);
    } else {
      setIsDataValid(false);
    }
  }, [roomtType, topicName]);
  return (
    <Modal
      ariaHideApp={false}
      className={clsx("createRoomDialog", className)}
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      overlayClassName="myoverlay"
    >
      <Container>
        <RoomNameContainer>
          <p className="createRoomDialog__sectionTitle">Topic name</p>
          <input
            value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            type="text"
            maxLength={50}
            placeholder="Enter the topic to be discussed."
          />
        </RoomNameContainer>
        <RoomTypeContainer>
          <p className="createRoomDialog__sectionTitle">Room type</p>
          <RoomTypeItems>
            <RoomTypeItem
              onClick={() => setRoomType("open")}
              selected={roomtType == "open"}
            >
              <PublicIcon />
              <p>Open</p>
            </RoomTypeItem>
            <RoomTypeItem
              onClick={() => setRoomType("social")}
              selected={roomtType == "social"}
            >
              <GroupIcon />
              <p>Social</p>
            </RoomTypeItem>
            <RoomTypeItem
              onClick={() => setRoomType("closed")}
              selected={roomtType == "closed"}
            >
              <LockIcon />
              <p>Closed</p>
            </RoomTypeItem>
          </RoomTypeItems>
          {roomtType == "open" && <p>Room is open to everyone</p>}
          {roomtType == "social" && <p>Room members added by room users</p>}
          {roomtType == "closed" && <p>Room members added by admin</p>}
        </RoomTypeContainer>
        <LetsGoButton
          onClick={onLestsGoClick}
          disabled={!isDataValid || createRoomStatus != "idle"}
        >
          <p>🎉 Let's go</p>
        </LetsGoButton>
      </Container>
    </Modal>
  );
}

export default CreateRoomDialog;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  /* justify-content: center; */
  align-items: center;
  justify-content: center;

  .createRoomDialog__sectionTitle {
    font-weight: 700;
    color: #303030;
  }
`;
const LetsGoButton = styled(IconButton)`
  background-color: green;
  padding: 10px 20px;
`;

const RoomNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 5px;
  input {
    padding: 8px;
    border-radius: 10px;
    outline: none;
    border: 1px solid gray;
  }
`;
const RoomTypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;

  gap: 15px;
`;

const RoomTypeItems = styled.div`
  display: flex;

  justify-content: space-evenly;
`;
const RoomTypeItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 7px;
  ${(props) =>
    props.selected &&
    "background-color: #6565f1;color:white;border-radius:10px"}
`;
