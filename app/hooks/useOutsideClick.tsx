import { useEffect } from "react";

const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) => {
  const handleClick = (e: MouseEvent) => {
    if (
      ref.current &&
      !ref.current.contains(e.currentTarget as HTMLDivElement)
    ) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};

export default useOutsideClick;
