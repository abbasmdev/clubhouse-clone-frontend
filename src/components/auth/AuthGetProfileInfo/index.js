import { ArrowLeft, ArrowRightAlt } from "@material-ui/icons";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Avatar from "../../Avatar";
import BlankPaper from "../../BlankPaper";
import IconButton from "../../IconButton";
import "./AuthGetProfileInfo.scss";
function AuthGetProfileInfo({ className, onNextClicked, onBackClicked }) {
  const fileRef = useRef(null);
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [previewUrl, setPreview] = useState();
  const [isNextActive, setIsNextActive] = useState(false);
  const onNextClick = () => {
    onNextClicked({ userName, fullName, selectedFile });
  };
  const onBackClick = () => {
    onBackClicked();
  };

  useEffect(() => {
    if (
      userName?.trim()?.length >= 3 &&
      fullName?.trim()?.length >= 3 &&
      selectedFile
    ) {
      setIsNextActive(true);
    } else {
      setIsNextActive(false);
    }
  }, [userName, fullName, selectedFile]);

  useEffect(() => {
    fileRef.current.onchange = function () {
      if (fileRef.current.files.length === 1) {
        const file = fileRef.current.files[0];
        if (!["image/png", "image/jpg", "image/jpeg"].includes(file.type)) {
          setSelectedFile(undefined);
          setPreview(undefined);
          return;
        }

        setSelectedFile(file);
        const fr = new FileReader();
        fr.readAsDataURL(file);
        fr.onload = function (e) {
          setPreview(this.result);
        };
      } else {
        setSelectedFile(undefined);
        setPreview(undefined);
      }
    };
  }, [fileRef.current]);
  const onChooseFileClick = () => {
    fileRef.current.click();
  };

  return (
    <div className={clsx("authGetProfileInfo", className)}>
      <Container>
        <Header>
          <p className="authGetProfileInfo__header__icon">💁‍♂️</p>
          <p className="authGetProfileInfo__header__message1">
            We need some more information about you
          </p>
        </Header>
        <CustomBlankPaper>
          <UserProfilePicContainer>
            <CustomAvatar src={previewUrl} />
            <ChoosePhotoButton onClick={onChooseFileClick}>
              <p>Choose photo</p>
            </ChoosePhotoButton>
            <input
              type="file"
              accept="image/png,image/jpeg"
              ref={fileRef}
              hidden
            />
          </UserProfilePicContainer>
          <UserNameContainer>
            <Input
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              maxLength="30"
              placeholder="username"
              required
            />
          </UserNameContainer>
          <FullNameContainer>
            <Input
              onChange={(e) => setFullName(e.target.value)}
              type="text"
              maxLength="50"
              placeholder="full name"
              required
            />
          </FullNameContainer>

          <ActionsContainer>
            <IconButton onClick={onBackClick}>
              <ArrowLeft />
              <p>Back</p>
            </IconButton>
            <IconButton onClick={onNextClick} disabled={!isNextActive}>
              <p>Next</p>
              <ArrowRightAlt></ArrowRightAlt>
            </IconButton>
          </ActionsContainer>
        </CustomBlankPaper>
      </Container>
    </div>
  );
}

export default AuthGetProfileInfo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid gray;
  outline: none;
  border-radius: 30px;
  padding: 15px;
`;
const UserNameContainer = styled.div`
  display: flex;

  width: 100%;
`;
const FullNameContainer = styled.div`
  display: flex;

  width: 100%;
`;
const UserProfilePicContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
`;
const CustomBlankPaper = styled(BlankPaper)`
  display: flex;
  margin-top: 20px;
  padding-top: 40px;
  flex-direction: column;
  align-items: center;

  gap: 15px;
  > p {
    font-size: 12px;
    color: grey;
  }
`;
const Header = styled.div`
  display: flex;
  gap: 3px;
  flex-direction: column;
  align-items: center;
  .authGetProfileInfo__header__icon {
    font-size: 30px;
    color: red;
  }
  .authGetProfileInfo__header__message1 {
    font-weight: 700;
  }
`;

const CustomAvatar = styled(Avatar)`
  width: 80px;
  height: 80px;
`;

const ChoosePhotoButton = styled(IconButton)`
  background-color: transparent;
  color: blue;
`;
