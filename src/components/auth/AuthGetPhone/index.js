import { ArrowRightAlt } from "@material-ui/icons";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import BlankPaper from "../../BlankPaper";
import IconButton from "../../IconButton";
import PhoneInput from "../../PhoneInput";
import "./AuthGetPhone.scss";
function AuthGetPhone({ className, onNextClicked }) {
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [phone, setPhone] = useState("");
  const [ccode, setCcode] = useState("");
  const onPhoneChanged = ({ ccode, phone }) => {
    setPhone(phone);
    setCcode(ccode);
  };
  const onNextClick = () => {
    onNextClicked({ phone, ccode });
  };

  useEffect(() => {
    if (ccode == "+98" && /^9[0-9]{9}$/.test(phone)) {
      console.log("valid");
      setIsPhoneValid(true);
    } else {
      setIsPhoneValid(false);
    }
  }, [phone, ccode]);

  return (
    <div className={clsx("authGetPhone", className)}>
      <Container>
        <Header>
          <p className="authGetPhone__header__icon">📱</p>
          <p className="authGetPhone__header__message1">
            Enter your phone number
          </p>
          <p className="authGetPhone__header__message2">
            We will send you a confirmation code
          </p>
        </Header>
        <CustomBlankPaper>
          <PhoneInput onValChange={onPhoneChanged} />
          <IconButton disabled={!isPhoneValid} onClick={onNextClick}>
            <p>Next</p>
            <ArrowRightAlt></ArrowRightAlt>
          </IconButton>
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
const Header = styled.div`
  display: flex;
  gap: 3px;
  flex-direction: column;
  align-items: center;
  .authGetOtpcodePhone__header__icon {
    font-size: 30px;
    color: red;
  }
  .authGetOtpcodePhone__header__message1 {
    font-weight: 700;
  }
  .authGetOtpcodePhone__header__message2 {
    color: gray;
  }
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
export default AuthGetPhone;
