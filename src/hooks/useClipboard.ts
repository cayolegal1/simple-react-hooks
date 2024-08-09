import { useState, useEffect, useCallback } from "react";
import { isString } from "utilities-lib";

type UseClipboardProps = {
  successDuration?: number;
};

export const useClipboard = ({ successDuration = 1000 }: UseClipboardProps = {}) => {
  const [copiedText, setCopiedText] = useState<string | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<unknown>("");

  const copy = useCallback(async (text: string) => {

    if (!navigator.clipboard) {
      setError("Navigator does not support clipboard api");
      return;
    }

    if (!isString(text)) {
      setError("Value is not text to copy to clipboard");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setCopied(true);
    } catch (error) {
      setError(error);
      setCopiedText(undefined);
    }
  }, []);

  useEffect(() => {
    if (!copiedText) return;
    const id = setTimeout(() => {
      setCopied(false);
    }, successDuration);

    return () => {
      clearTimeout(id);
    }
  }, [copiedText]);

  return {
    copiedText,
    copy,
    error,
    copied,
  }
};