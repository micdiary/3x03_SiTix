import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Event from "./Event"; // Import your component

// Mock the dependencies and utilities as needed
//test comments
jest.mock("../utils/account", () => ({
  getToken: jest.fn(() => "mock-token"),
}));

jest.mock("../store/User", () => ({
  userStore: jest.fn(() => ({ token: "mock-store-token" })),
}));

describe("Event Component", () => {
  it("renders the component with the correct content", () => {
    render(<Event />);

    // Test for the presence of specific elements or text
    expect(screen.getByText("Event Name")).toBeInTheDocument();
    expect(screen.getByText("Date (Time) / Venue")).toBeInTheDocument();
  });

  it("renders the Buy Now button when a user is logged in", () => {
    render(<Event />);
    
    // Test for the presence of the Buy Now button
    const buyNowButton = screen.getByText("Buy Now");
    expect(buyNowButton).toBeInTheDocument();

    // Simulate a click on the Buy Now button
    fireEvent.click(buyNowButton);

    // Assert the navigation after the button click
    // You may need to mock the `useNavigate` function
    // and verify that it's called with the correct URL.
  });

  it("renders the Login button when a user is not logged in", () => {
    // Mock getToken to simulate a user not being logged in
    jest.spyOn(require("../utils/account"), "getToken").mockImplementation(() => null);
    
    render(<Event />);
    
    // Test for the presence of the Login button
    const loginButton = screen.getByText("Login");
    expect(loginButton).toBeInTheDocument();

    // Simulate a click on the Login button
    fireEvent.click(loginButton);

    // Assert the navigation after the button click
    // You may need to mock the `useNavigate` function
    // and verify that it's called with the correct URL.
  });
});