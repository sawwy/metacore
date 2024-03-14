import { motion } from "framer-motion";
import styled from "@emotion/styled";
import { ReactNode } from "react";

type BackdropType = {
  children: ReactNode;
};

export const Backdrop = ({ children }: BackdropType) => {
  return (
    <BackdropContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </BackdropContainer>
  );
};

const BackdropContainer = styled(motion.div)`
  position: fixed;
  backdrop: static;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
