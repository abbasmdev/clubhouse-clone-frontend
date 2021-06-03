import React, { useEffect, useState } from "react";
import BlankPaper from "../../BlankPaper";
import IconButton from "../../IconButton";
import styled from "styled-components";
import "./AuthGetOtpcode.scss";
import clsx from "clsx";
import { ArrowLeft, ArrowRightAlt } from "@material-ui/icons";
import CodeInput from "./CodeInput";
function AuthGetOtpcode({ className, onNextClicked, onBackClicked }) {
  const [code, setCode] = useState({ c1: null, c2: null, c3: null, c4: null });
  const [isCodeFormatValid, setIsCodeFormatValid] = useState(false);
  const onNextClick = () => {
    onNextClicked({ code: `${code.c1}${code.c2}${code.c3}${code.c4}` });
  };
  const onBackClick = () => {
    onBackClicked();
  };
  const onCodeChanged = (ccode) => {
    setCode(ccode);
  };

  useEffect(() => {
    const reg = /^[0-9]{1}$/;
    if (
      reg.test(code.c1) &&
      reg.test(code.c2) &&
      reg.test(code.c3) &&
      reg.test(code.c4)
    ) {
      setIsCodeFormatValid(true);
    } else {
      setIsCodeFormatValid(false);
    }
  }, [code]);
  return (
    <div className={clsx("authGetOtpcode", className)}>
      <Container>
        <Header>
          <p className="authGetOtpcode__header__icon">🔢</p>
          <p className="authGetOtpcode__header__message1">
            Enter your activate code
            <br />
            <h3 style={{ color: "red" }}>WARNING: USE 1111 ACTIVATION CODE</h3>
          </p>
        </Header>
        <CustomBlankPaper>
          <CodeInput onValuChanged={onCodeChanged} />

          <ActionsContainer>
            <IconButton onClick={onBackClick}>
              <ArrowLeft />
              <p>Back</p>
            </IconButton>
            <IconButton onClick={onNextClick} disabled={!isCodeFormatValid}>
              <p>Next</p>
              <ArrowRightAlt />
            </IconButton>
          </ActionsContainer>
          <p>
            By entering your phone number, you're agreeing to our TOS an privacy
            policy, Thanks!
          </p>
        </CustomBlankPaper>
      </Container>
    </div>
  );
}

const Container = styled.div`
  width: 100%;
`;
const ActionsContainer = styled.div`
  display: flex;
  gap: 2px;
`;
const Header = styled.div`
  display: flex;
  gap: 3px;
  flex-direction: column;
  align-items: center;
  .authGetOtpcode__header__icon {
    font-size: 30px;
    color: red;
  }
  .authGetOtpcode__header__message1 {
    font-weight: 700;
  }
`;
const CustomBlankPaper = styled(BlankPaper)`
  display: flex;
  margin-top: 20px;
  padding-top: 40px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  > p {
    font-size: 12px;
    color: grey;
  }
`;
export default AuthGetOtpcode;
