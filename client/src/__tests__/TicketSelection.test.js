import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TicketSelection from "./TicketSelection"; // Import your component

describe("TicketSelection Component", () => {
  it("renders the ticket selection form with the correct elements", () => {
    render(<TicketSelection />);

    // Test for the presence of specific elements in the ticket selection form
    expect(screen.getByText("Event Name")).toBeInTheDocument();
    expect(screen.getByText("Event Venue")).toBeInTheDocument();
    expect(screen.getByText("Timer")).toBeInTheDocument();
    expect(screen.getByText("Pick Your Seat:")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByAltText("Seating Map")).toBeInTheDocument();
    // You can add more assertions for specific elements as needed.
  });

  it("allows the user to select ticket type and quantity", () => {
    render(<TicketSelection />);

    // Select ticket type
    const ticketTypeSelect = screen.getByLabelText("*Ticket Type");
    fireEvent.change(ticketTypeSelect, { target: { value: "Cat 2" } });

    // Select ticket quantity
    const quantitySelect = screen.getByLabelText("Quantity");
    fireEvent.change(quantitySelect, { target: { value: "2" } });

    // Ensure that the selected ticket type and quantity are displayed correctly
    expect(screen.getByText("Cat 2")).toBeInTheDocument();
    expect(screen.getByText("$196")).toBeInTheDocument(); // Price of 2 Cat 2 tickets

    // You can add more assertions for selected ticket type and quantity as needed.
  });

  it("clicking the 'Next' button navigates to the next page", () => {
    const navigateMock = jest.fn();
    jest.mock("react-router-dom", () => ({
      useNavigate: () => navigateMock,
    }));

    render(<TicketSelection />);

    // Click the "Next" button
    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Verify that the navigate function is called with the correct URL
    expect(navigateMock).toHaveBeenCalledWith("/purchase"); // Update the URL as needed

    // You can add more assertions or navigation checks as needed.
  });
});
