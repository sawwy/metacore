import styled from "@emotion/styled";
import { motion } from "framer-motion";

/**
 * This is an example of layout animations in Framer Motion 2.
 *
 * It's as simple as adding a `layout` prop to the `motion.div`. When
 * the flexbox changes, the handle smoothly animates between layouts.
 *
 * Try adding whileHover={{ scale: 1.2 }} to the handle - the layout
 * animation is now fully compatible with user-set transforms.
 */

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
