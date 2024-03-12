import { motion } from "framer-motion";
import { Backdrop } from "./Backdrop";
import styled from "@emotion/styled";

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

export const Modal = ({ handleClose, children }) => {
  return (
    <Backdrop onClick={handleClose}>
      <ModalContainer
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Content>{children}</Content>
        <button onClick={handleClose}>Close</button>
      </ModalContainer>
    </Backdrop>
  );
};

const ModalContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
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
`;
