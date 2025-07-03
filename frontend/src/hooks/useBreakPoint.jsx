import { useState, useEffect } from "react";

export const useBreakpoint = () => {
  const [screenSize, setScreenSize] = useState("xl"); // default

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 1280) setScreenSize("xl");
      else if (width >= 1024) setScreenSize("lg");
      else if (width >= 768) setScreenSize("md");
      else setScreenSize("sm");
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return screenSize;
};

export default useBreakpoint;