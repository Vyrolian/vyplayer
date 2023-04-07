// outsideClickHandler.ts
const outsideClickHandler = (
  ref: React.RefObject<HTMLDivElement>,
  callback: () => void
) => {
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (ref.current && !ref.current.contains(target)) {
      callback();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
};

export default outsideClickHandler;
