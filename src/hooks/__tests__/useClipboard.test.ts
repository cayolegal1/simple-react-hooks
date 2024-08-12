import { renderHook, act } from "@testing-library/react";
import { useClipboard } from "@src/hooks";

describe("useClipboard hook", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
  });

  it("should copy text to clipboard and set copied state to true", async () => {
    const { result } = renderHook(() => useClipboard());

    await act(async () => {
      await result.current.copy("Hello, World!");
    });

    // Check if text was copied
    expect(result.current.copiedText).toBe("Hello, World!");
    expect(result.current.copied).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Hello, World!");
  });

  it("should reset copied state after success duration", async () => {
    const { result,  } = renderHook(() =>
      useClipboard({ successDuration: 500 })
    );

    // Act: copy text
    await act(async () => {
      await result.current.copy("Hello, World!");
    });

    // Wait for copied state to reset
    await vi.waitFor(() => expect(result.current.copied).toBe(false), {
      timeout: 1000,
    });
  });

  it("should handle errors when clipboard API is not available", async () => {
    Object.assign(navigator, { clipboard: undefined });
    const { result } = renderHook(() => useClipboard());

    act(() => {
      result.current.copy("Hello, World!");
    });

    expect(result.current.error).toBe(
      "Navigator does not support clipboard api"
    );
  });

  it("should handle non-string values", async () => {
    const { result } = renderHook(() => useClipboard());

    act(() => {
      result.current.copy(123 as unknown as string);
    });

    expect(result.current.error).toBe("Value is not text to copy");
  });
});
