import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import "./CodeInput.scss";
function CodeInput({ className, onValuChanged }) {
  const [c1, setC1] = useState();
  const [c2, setC2] = useState();
  const [c3, setC3] = useState();
  const [c4, setC4] = useState();
  const c1Ref = useRef();
  const c2Ref = useRef();
  const c3Ref = useRef();
  const c4Ref = useRef();

  const goBackForward = (e, index) => {
    if (e?.target?.value?.length == 1) {
      switch (index) {
        case 0:
          c2Ref.current.focus();
          break;
        case 1:
          c3Ref.current.focus();
          break;
        case 2:
          c4Ref.current.focus();
          break;
        case 3:
          break;
        default:
          break;
      }
    }
  };
  useEffect(() => {
    onValuChanged && onValuChanged({ c1, c2, c3, c4 });
  }, [c1, c2, c3, c4]);
  return (
    <div className={clsx("codeInput", className)}>
      <Container>
        <input
          ref={c1Ref}
          max={"9"}
          value={c1}
          className="codeinput__input"
          type="text"
          maxLength={1}
          onChange={(e) => {
            goBackForward(e, 0);
            setC1(e.target.value);
          }}
        />
        <input
          ref={c2Ref}
          value={c2}
          className="codeinput__input"
          type="text"
          maxLength={1}
          onChange={(e) => {
            goBackForward(e, 1);
            setC2(e.target.value);
          }}
        />
        <input
          ref={c3Ref}
          value={c3}
          className="codeinput__input"
          type="text"
          maxLength={1}
          onChange={(e) => {
            goBackForward(e, 2);
            setC3(e.target.value);
          }}
        />
        <input
          ref={c4Ref}
          value={c4}
          className="codeinput__input"
          type="text"
          maxLength={1}
          onChange={(e) => {
            goBackForward(e, 3);
            setC4(e.target.value);
          }}
        />
      </Container>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  gap: 10px;
  .codeinput__input {
    width: 100%;
    padding: 10px 5px;
    text-align: center;
    border-top-left-radius: 50px;
    border-top-right-radius: 50px;
    border-bottom-left-radius: 50px;
    border-bottom-right-radius: 50px;
    outline: 0;
    border: 1px solid rgba(0, 0, 0, 0.2);
    ::-webkit-inner-spin-button {
      display: none;
    }
  }
`;

export default CodeInput;
