import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPassword from "./ResetPassword"; // Import your component

// Mock your API calls and utility functions as needed
jest.mock("../api/account", () => ({
  resetPassword: jest.fn(() => Promise.resolve({ message: "Password reset successful" })),
}));

jest.mock("../utils/account", () => ({
  getToken: jest.fn(() => "mock-token"),
}));

jest.mock("../components/Notification", () => ({
  showNotification: jest.fn(),
}));

describe("ResetPassword Component", () => {
  it("renders the reset password form with the correct elements", () => {
    render(<ResetPassword />);

    // Test for the presence of specific elements in the reset password form
    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm New Password")).toBeInTheDocument();
  });

  it("submits the reset password form and shows a success notification", async () => {
    render(<ResetPassword />);

    // Mock user input and submit the reset password form
    fireEvent.change(screen.getByPlaceholderText("New Password"), { target: { value: "newpassword123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm New Password"), { target: { value: "newpassword123" } });

    fireEvent.click(screen.getByText("Reset"));

    // Expect the resetPassword API function to be called with the new password
    expect(resetPassword).toHaveBeenCalledWith({
      token: "mock-token",
      newPassword: "newpassword123",
    });

    // Wait for the success notification to be displayed
    await screen.findByText("Password reset successful");

    // Expect the success notification
    expect(screen.getByText("Password reset successful")).toBeInTheDocument();
  });

  it("displays an error notification if password reset fails", async () => {
    // Mock the resetPassword function to return an error
    jest.spyOn(require("../api/account"), "resetPassword").mockImplementation(() => Promise.reject({ message: "Password reset failed" }));

    render(<ResetPassword />);

    // Mock user input and submit the reset password form
    fireEvent.change(screen.getByPlaceholderText("New Password"), { target: { value: "newpassword123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm New Password"), { target: { value: "newpassword123" } });

    fireEvent.click(screen.getByText("Reset"));

    // Wait for the error notification to be displayed
    await screen.findByText("Password reset failed");

    // Expect the error notification
    expect(screen.getByText("Password reset failed")).toBeInTheDocument();
  });
});
