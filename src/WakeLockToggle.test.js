import { jest } from "@jest/globals";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import WakeLockToggle from "./WakeLockToggle";

const DEFAULT_LABEL = "Prevent screen timeout";

describe("WakeLockToggle Component", () => {
  const setWakeLockMock = (wakeLock) => {
    Object.defineProperty(global.navigator, "wakeLock", {
      get: jest.fn(() => wakeLock),
      configurable: true,
    });
  };

  const mockWakeLock = () => {
    const mockRelease = jest.fn();
    const eventListeners = {};

    const mockRequest = jest.fn().mockResolvedValue({
      addEventListener: jest.fn((event, callback) => {
        eventListeners[event] = callback;
      }),
      release: mockRelease,
    });

    const mockedWakeLock = {
      request: mockRequest,
      release: mockRelease,
      dispatchEvent: (event) => {
        if (eventListeners[event.type]) {
          eventListeners[event.type](event);
        }
      },
    };

    setWakeLockMock(mockedWakeLock);

    return mockedWakeLock;
  };

  describe("when wakeLock is not supported", () => {
    let originalNavigator;

    beforeEach(() => {
      originalNavigator = global.navigator;
      const mockNavigator = { ...originalNavigator };
      mockNavigator.wakeLock = undefined;
      global.navigator = mockNavigator;
    });

    it("does not render the component", () => {
      render(<WakeLockToggle label={DEFAULT_LABEL} />);

      expect(screen.queryByText(DEFAULT_LABEL)).not.toBeInTheDocument();
      expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    });
  });

  describe("when wakeLock is supported", () => {
    let mockedWakeLock;

    beforeAll(() => {
      mockedWakeLock = mockWakeLock();
    });

    it("renders the component", () => {
      render(<WakeLockToggle label={DEFAULT_LABEL} />);

      expect(screen.getByText(DEFAULT_LABEL)).toBeInTheDocument();
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });

    it("requests screen wake lock when the checkbox is clicked", async () => {
      render(<WakeLockToggle />);
      const checkbox = screen.getByRole("switch");

      await userEvent.click(checkbox);

      expect(mockedWakeLock.request).toHaveBeenCalledWith("screen");
    });

    it("sets checked state when checked", async () => {
      render(<WakeLockToggle />);
      const checkbox = screen.getByRole("switch");

      await userEvent.click(checkbox);

      expect(checkbox.checked).toBe(true);
    });

    it("leaves checked state when unchecked", async () => {
      render(<WakeLockToggle />);
      const checkbox = screen.getByRole("switch");

      await userEvent.click(checkbox);
      await userEvent.click(checkbox);

      expect(checkbox.checked).toBe(false);
    });

    it("releases wake lock when unchecked", async () => {
      render(<WakeLockToggle />);
      const checkbox = screen.getByRole("switch");

      await userEvent.click(checkbox);
      await userEvent.click(checkbox);

      expect(mockedWakeLock.release).toHaveBeenCalled();
    });

    it("unchecks the checkbox when wake lock is released via other means", async () => {
      render(<WakeLockToggle />);
      const checkbox = screen.getByRole("switch");

      await userEvent.click(checkbox);

      await act(async () => {
        mockedWakeLock.dispatchEvent(new Event("release"));
      });

      expect(checkbox.checked).toBe(false);
    });

    it("calls alert with error details when requesting wake lock results in an error", async () => {
      global.alert = jest.fn();

      setWakeLockMock({
        request: jest.fn().mockRejectedValue(new Error("foobar")),
      });

      render(<WakeLockToggle />);
      const checkbox = screen.getByRole("switch");
      await userEvent.click(checkbox);

      expect(global.alert).toHaveBeenCalledWith(`foobar`);
    });
  });
});
