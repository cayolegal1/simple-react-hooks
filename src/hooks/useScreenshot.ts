import { useState, useCallback } from "react";
import html2canvas, { type Options } from "html2canvas";

const defaultConfig = {
  scale: 0.8,
  useCORS: true,
};

export const useScreenshot = () => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [error, setError] = useState<unknown>(undefined);

  const isValid = useCallback((elementId: string) => {
    if (!document) {
      setImage(undefined);
      setError("Document is not available");
      return false;
    }

    if (typeof elementId !== "string") {
      setImage(undefined);
      setError("Element ID is not valid");
      return false;
    }

    const element = document.getElementById(elementId);
    if (!element) {
      setImage(undefined);
      setError("Element not found");
      return false;
    }

    return true;
  }, []);

  const screenshot = useCallback(async (elementId: string, options: Partial<Options> = defaultConfig) => {
    if (!isValid(elementId)) return;
    try {
      const element = document.getElementById(elementId);
      if (element) {
        const canvas = await html2canvas(element, options);
        const imageData = canvas.toDataURL("image/png");
        setImage(imageData);
      }
    } catch (error) {
      setError(error);
      setImage(undefined);
    }
  }, []);

  return {
    error,
    image,
    screenshot,
  };
};
