import { renderHook, act } from "@testing-library/react";
import { useScreenshot } from "@src/hooks";
import { vi, Mock } from "vitest";
import html2canvas from "html2canvas";

vi.mock("html2canvas", () => ({
  __esModule: true,
  default: vi.fn(),
}));

beforeEach(() => {
  document.body.innerHTML = "";
});

describe("useScreenshot hook", () => {
  it("should capture a screenshot and set the result", async () => {
    document.body.innerHTML = "<div id='valid-id'></div>";

    const fakeUrl = "data:image/png;base64,imagedata";

    const mockCanvas = {
      toDataURL: vi.fn(() => fakeUrl),
    };

    (html2canvas as unknown as Mock).mockResolvedValue(mockCanvas);

    const { result } = renderHook(() => useScreenshot());

    await act(async () => {
      await result.current.screenshot("valid-id");
    });

    expect(result.current.result).toBe(fakeUrl);
  });

  it("should handle errors during screenshot generation", async () => {
    (html2canvas as unknown as Mock).mockRejectedValueOnce(
      new Error("Screenshot failed")
    );

    const { result } = renderHook(() => useScreenshot());

    await act(async () => {
      await result.current.screenshot("valid-id");
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.result).toBeUndefined();
  });
});
