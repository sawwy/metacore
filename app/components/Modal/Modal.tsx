import { motion } from "framer-motion";
import { Backdrop } from "./Backdrop";
import styled from "@emotion/styled";
import { ReactNode } from "react";

const dropIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    opacity: 0,
  },
};

type ModalPropsType = {
  children: ReactNode;
};

export const Modal = ({ children }: ModalPropsType) => {
  return (
    <Backdrop>
      <ModalContainer
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Content>{children}</Content>
      </ModalContainer>
    </Backdrop>
  );
};

const ModalContainer = styled(motion.div)`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const Content = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  flex-direction: column;
`;
