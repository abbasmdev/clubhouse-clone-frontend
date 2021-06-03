import Modal from "react-modal";
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import styled from "styled-components";
import "./AdddUserToRoom.scss";
import { useRef } from "react";
import IconButton from "../../IconButton";
import { Add as AddIcon } from "@material-ui/icons";
import axios from "axios";
import { API_BASE_URL } from "../../../config/app.config";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../../features/auth/authSlice";
function AdddUserToRoom({ className, roomId, open, onOpenChanged }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDatavalid, setIsDatavalid] = useState(false);
  const jwtToken = useSelector(selectAuthToken);

  const [username, setUsername] = useState("");
  function openModal() {
    setIsModalOpen(true);
    onOpenChanged(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    onOpenChanged(false);
  }
  const onAddBtnClick = () => {
    const url = `${API_BASE_URL}/rooms/add-member`;
    axios
      .post(
        url,
        { username: username, roomId: roomId },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      )
      .then((res) => {
        alert("user added");
        closeModal();
      })
      .catch((e) => {
        const msg = e?.response?.data?.message || "Error";
        alert(msg);
      });
  };

  useEffect(() => {
    setIsModalOpen(open);
  }, [open]);
  useEffect(() => {
    if (username?.trim()?.length >= 3) {
      setIsDatavalid(true);
    } else {
      setIsDatavalid(false);
    }
  }, [username]);

  return (
    <Modal
      ariaHideApp={false}
      className={clsx("addUserToRoom", className)}
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      overlayClassName="myoverlay"
    >
      <Container>
        <Header>
          <p>Add user to this room</p>
        </Header>
        <Main>
          <UserNameInput
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="username"
          />
        </Main>
        <Footer>
          <IconButton onClick={onAddBtnClick} disabled={!isDatavalid}>
            <AddIcon />
            <p>Add</p>
          </IconButton>
        </Footer>
      </Container>
    </Modal>
  );
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
  /* justify-content: center; */
  align-items: stretch;
  justify-content: center;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  > p {
    margin-left: 4px;
    font-weight: 600;
  }
  border-bottom: 1px solid whitesmoke;
`;

const Main = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  flex-direction: column;
`;
const UserNameInput = styled.input`
  outline: none;
  border: 1px solid green;
  padding: 10px;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
export default AdddUserToRoom;
