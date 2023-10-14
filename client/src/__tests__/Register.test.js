import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register"; // Import your component

// Mock your API calls and utility functions as needed
jest.mock("../api/account", () => ({
  register: jest.fn(() => Promise.resolve({ message: "Registration successful" })),
}));

jest.mock("../components/Notification", () => ({
  showNotification: jest.fn(),
}));

describe("Register Component", () => {
  it("renders the registration form with the correct elements", () => {
    render(<Register />);

    // Test for the presence of specific elements in the registration form
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  it("submits the registration form and shows a success notification", async () => {
    render(<Register />);

    // Mock user input and submit the registration form
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Sign Up"));

    // Expect the register API function to be called with the user's data
    expect(register).toHaveBeenCalledWith({
      username: "testuser",
      first_name: "John",
      last_name: "Doe",
      email: "test@example.com",
      password: "password123",
    });

    // Wait for the success notification to be displayed
    await screen.findByText("Registration successful");

    // Expect the success notification
    expect(screen.getByText("Registration successful")).toBeInTheDocument();
  });

  it("displays an error notification if registration fails", async () => {
    // Mock the registration function to return an error
    jest.spyOn(require("../api/account"), "register").mockImplementation(() => Promise.reject({ message: "Registration failed" }));

    render(<Register />);

    // Mock user input and submit the registration form
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByPlaceholderText("First Name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("Last Name"), { target: { value: "Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    fireEvent.change(screen.getByPlaceholderText("Confirm Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Sign Up"));

    // Wait for the error notification to be displayed
    await screen.findByText("Registration failed");

    // Expect the error notification
    expect(screen.getByText("Registration failed")).toBeInTheDocument();
  });
});
