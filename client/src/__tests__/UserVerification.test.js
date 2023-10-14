import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserVerification from "./UserVerification"; // Import your component

// Mock your API calls and utility functions as needed
jest.mock("../api/account", () => ({
  verifyEmail: jest.fn(() => Promise.resolve()),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe("UserVerification Component", () => {
  it("displays a success message after verifying the email", async () => {
    render(<UserVerification />);
    
    // Mock the token received in the URL
    const locationMock = {
      search: "?token=mock-token",
    };
    require("react-router-dom").useLocation.mockReturnValue(locationMock);

    // Wait for the verification API call to complete
    await waitFor(() => {
      expect(screen.getByText("Verified")).toBeInTheDocument();
      expect(screen.getByText("Your account has been verified.")).toBeInTheDocument();
      expect(screen.getByText("Login")).toBeInTheDocument();
    });

    // Expect that the verification function was called with the token
    expect(verifyEmail).toHaveBeenCalledWith({ token: "mock-token" });
  });

  it("clicking the 'Login' button navigates to the login page", () => {
    const navigateMock = jest.fn();
    require("react-router-dom").useNavigate.mockReturnValue(navigateMock);

    render(<UserVerification />);

    // Mock the token received in the URL
    const locationMock = {
      search: "?token=mock-token",
    };
    require("react-router-dom").useLocation.mockReturnValue(locationMock);

    // Click the "Login" button
    fireEvent.click(screen.getByText("Login"));

    // Verify that the navigate function is called with the correct URL
    expect(navigateMock).toHaveBeenCalledWith("/login"); // Update the URL as needed
  });
});
