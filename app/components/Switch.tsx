import styled from "@emotion/styled";
import { motion } from "framer-motion";

type SwitchPropsType = {
  isOn: boolean;
  onClick: () => void;
};

export const Switch = ({ isOn, onClick }: SwitchPropsType) => {
  return (
    <SwitchContainer isOn={isOn} onClick={onClick}>
      <Handle layout transition={spring} />
    </SwitchContainer>
  );
};

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

const SwitchContainer = styled.div<{
  isOn?: boolean;
}>`
  width: 48px;
  height: 32px;
  background-color: blue;
  display: flex;
  border-radius: 16px;
  padding: 4px;
  cursor: pointer;
  justify-content: ${({ isOn }) => (isOn ? "flex-end;" : "flex-start")};
  background-color: ${({ isOn }) => (isOn ? "blue;" : "grey")};
`;

const Handle = styled(motion.div)`
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 12px;
`;
