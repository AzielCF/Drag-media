
export const executeOnScrollThreshold = (functionToExecute: () => void) => {
  const handleScroll = (event: Event) => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    if (scrollY + windowHeight >= documentHeight / 2) {
      functionToExecute();
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
};
