import React from 'react';
import ForgetPassword from 'client/src/pages/ForgetPassword';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';

// Mock the API call
jest.mock('client/src/api/account', () => ({
  forgetPassword: jest.fn(() => Promise.resolve({ message: 'Success message' })),
}));

// Mock the Notification
jest.mock('client/src/components/Notification', () => ({
  showNotification: jest.fn(),
}));

describe('ForgetPassword', () => {
  test('renders ForgetPassword component', () => {
    render(<Router><ForgetPassword /></Router>);
  });

  test('show notification on successful password reset', async () => {
    const { forgetPassword } = require('client/src/api/account');
    const { showNotification } = require('client/src/components/Notification');
    const { getByPlaceholderText, getByText } = render(<Router><ForgetPassword /></Router>);

    // Simulate user input
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    // Simulate form submission
    const submitButton = getByText('Reset Password');
    fireEvent.click(submitButton);

    // Wait for promises to be resolved
    await waitFor(() => {
      // Check if the API was called with correct data
      expect(forgetPassword).toHaveBeenCalledWith({ email: 'test@test.com' });

      // Check if the notification was shown
      expect(showNotification).toHaveBeenCalledWith('Success message');
    });
  });
});
