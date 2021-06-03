import React, { useEffect, useState } from "react";

import Header from "../../components/Header";
import IconButton from "../../components/IconButton";
import Navbar from "../../components/Navbar";
import { Add as AddIcon, ListAlt as ListAltIcon } from "@material-ui/icons";
import RoomsList from "../../components/RoomsList";
import "./RoomsPage.scss";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import CreateRoomDialog from "../../components/CreateRoomDialog";
import { useDispatch, useSelector } from "react-redux";
import {
  getPublicRoomsAsync,
  getUserJoinedRoomsAsync,
  selectJoinedRooms,
  selectPublicRooms,
  setCurrentRoomId,
} from "../../features/rooms/roomsSlice";
import axios from "axios";
import { API_BASE_URL } from "../../config/app.config";
import { selectAuthToken } from "../../features/auth/authSlice";

function RoomsPage() {
  const history = useHistory();

  const dispatch = useDispatch();
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const joinedRooms = useSelector(selectJoinedRooms);
  const publicRooms = useSelector(selectPublicRooms);
  const [reload, setReload] = useState(false);
  const token = useSelector(selectAuthToken);

  const onStartRoomClick = () => {
    setShowCreateRoom(!showCreateRoom);
  };
  const onRoomClick = (roomId) => {
    console.log("onRoomClick>>>", roomId);
    dispatch(setCurrentRoomId(roomId));
    history.push("/room");
  };

  const onJbClick = (roomid) => {
    axios
      .post(
        API_BASE_URL + "/rooms/join-room",
        { roomId: roomid },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setReload(true);
      })
      .catch((e) => {
        setReload(true);
      });
  };
  useEffect(() => {
    dispatch(getUserJoinedRoomsAsync());
    dispatch(getPublicRoomsAsync());
  }, []);

  useEffect(() => {
    if (reload) {
      dispatch(getUserJoinedRoomsAsync());
      dispatch(getPublicRoomsAsync());
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    if (showCreateRoom === false) {
      dispatch(getUserJoinedRoomsAsync());
      dispatch(getPublicRoomsAsync());
    }
  }, [showCreateRoom]);

  return (
    <>
      <div className="roomsPage">
        {/*Header */}
        <Header />

        {/*Navbar */}
        <Navbar className="roomsPage__navbar">
          <div className="roomsPage__navbar__left">
            <ExploreIconButton>
              <ListAltIcon />
              <p>Filters</p>
            </ExploreIconButton>
          </div>
          <div className="roomsPage__navbar__right">
            <StartRoomIconButton onClick={onStartRoomClick}>
              <AddIcon />
              <p>Start a room</p>
            </StartRoomIconButton>
          </div>
        </Navbar>

        <RoomsListContainer>
          <JoinedRoomsContainer>
            <h4 className="roomsPage__roomsListContainer__title">
              Joined Rooms
            </h4>
            {/*Joined rooms */}
            <RoomsList
              rooms={joinedRooms}
              onJoinRoomBtnClick={onJbClick}
              onRoomClick={onRoomClick}
              className="roomsPage__RoomsList"
            />
          </JoinedRoomsContainer>

          <PublicRoomsContainer>
            <h4 className="roomsPage__roomsListContainer__title">
              Public rooms
            </h4>
            <RoomsList
              rooms={publicRooms}
              onJoinRoomBtnClick={onJbClick}
              onRoomClick={onRoomClick}
              className="roomsPage__RoomsList"
              isPublic
            />
          </PublicRoomsContainer>
        </RoomsListContainer>

        <CreateRoomDialog
          open={showCreateRoom}
          onOpenChanged={(newv) => setShowCreateRoom(newv)}
        />
      </div>
    </>
  );
}

export default RoomsPage;

const ExploreIconButton = styled(IconButton)`
  background-color: gray;
`;

const RoomsListContainer = styled.div`
  display: flex;
  height: 100%;
  padding-left: 10px;
  flex-direction: column;
  margin-top: 20px;
  overflow: scroll;
`;

const JoinedRoomsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const PublicRoomsContainer = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
`;

const StartRoomIconButton = styled(IconButton)`
  background-color: #15cc51;
`;
