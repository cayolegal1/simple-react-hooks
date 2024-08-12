import { useState } from "react";
import { useScreenshot, type HTML2CanvasOptions } from "./useScreenshot";

export const useDownloadScreenshot = () => {
  const [error, setError] = useState<unknown>(undefined);
  const {
    screenshot,
    result,
    error: screenshootError,
    canTakeScreenshot,
  } = useScreenshot();

  const downloadScreenshot = async (
    fileName: string,
    elementId: string,
    options: HTML2CanvasOptions
  ) => {
    if (!canTakeScreenshot(elementId)) {
      setError(screenshootError);
    }

    try {
      await screenshot(elementId, options);
      if (result) {
        const link = document.createElement("a");
        link.href = result;
        link.download = fileName ?? "screenshot.png";
        link.click();
        document.removeChild(link);
      }
    } catch (error) {
      setError(error);
    }
  };

  return {
    downloadScreenshot,
    error,
  };
};
