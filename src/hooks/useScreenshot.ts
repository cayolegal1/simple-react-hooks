import { useState, useCallback } from "react";
import html2canvas, { type Options } from "html2canvas";
import { isString } from "utilities-lib";

export type HTML2CanvasOptions = Partial<Options>;

export const useScreenshot = () => {
  const [result, setResult] = useState<string | undefined>(undefined);
  const [error, setError] = useState<unknown>(undefined);

  const canTakeScreenshot = useCallback((elementId: string) => {
    if (!document) {
      setResult(undefined);
      setError("Document is not available");
      return false;
    }

    if (!isString(elementId)) {
      setResult(undefined);
      setError("Element ID is not valid");
      return false;
    }

    const element = document.getElementById(elementId);
    if (!element) {
      setResult(undefined);
      setError("Element not found");
      return false;
    }

    return true;
  }, []);

  const screenshot = useCallback(
    async (elementId: string, options: HTML2CanvasOptions = {}) => {
      if (!canTakeScreenshot(elementId)) return;
      try {
        const element = document.getElementById(elementId);
        if (element) {
          const canvas = await html2canvas(element, {
            scale: 0.8,
            useCORS: true,
            ...options,
          });
          const imageData = canvas.toDataURL("image/png");
          setResult(imageData);
        }
      } catch (error) {
        setError(error);
        setResult(undefined);
      }
    },
    []
  );

  return {
    error,
    result,
    canTakeScreenshot,
    screenshot,
  };
};
