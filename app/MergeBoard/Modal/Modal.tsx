import { motion } from "framer-motion";
import { Backdrop } from "./Backdrop";
import styled from "@emotion/styled";

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

export const Modal = ({ handleClose, children }) => {
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <Content>{children}</Content>
        <button onClick={handleClose}>Close</button>
      </motion.div>
    </Backdrop>
  );
};

const Content = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
`;
