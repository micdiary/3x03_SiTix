import { render, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Login from 'client/src/pages/Login';
import { BrowserRouter } from "react-router-dom";
import React from "react";

//... rest of your code.

describe('Login', () => {
  it('renders correctly', () => {
    const { getAllByText, getByPlaceholderText } = render(<BrowserRouter><Login /></BrowserRouter>);
    
    const loginElements = getAllByText('Login');
    expect(loginElements[0]).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('shows an error if the form is submitted without a username', async () => {
    const { getByRole, getAllByRole } = render(<BrowserRouter><Login /></BrowserRouter>);
    
    fireEvent.click(getByRole('button', { name: /login button/i }));
    
    await waitFor(() => {
      const alerts = getAllByRole('alert');
      // find the specific alert you expect based on its text content
      const usernameAlert = alerts.find(alert => alert.textContent === 'Please enter your Username.');
      expect(usernameAlert).toBeInTheDocument();
    });
  });

  it('shows an error if the form is submitted without a password', async () => {
    const { getByText, getByRole, getAllByRole } = render(<BrowserRouter><Login /></BrowserRouter>);
    
    fireEvent.click(getByRole('button', { name: /login button/i }));
    
    await waitFor(() => {
      const alerts = getAllByRole('alert');
      // let's assume the password alert is the second one
      expect(alerts[1]).toHaveTextContent('Please enter your Password.');
    });
  });
});