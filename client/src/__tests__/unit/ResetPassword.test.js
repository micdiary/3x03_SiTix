import React from 'react';
import ForgetPassword from 'client/src/pages/ForgetPassword';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, fireEvent, waitFor } from '@testing-library/react';

// Mock the api call
jest.mock('client/src/api/account', () => ({
  forgetPassword: jest.fn(() => Promise.resolve({ message: 'Success message' })),
}));

// Mock the notification
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

    // simulate user input
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    // simulate form submission
    const submitButton = getByText('Reset Password');
    fireEvent.click(submitButton);

    // wait for promises to be resolved
    await waitFor(() => {
      // check if the api was called with correct data
      expect(forgetPassword).toHaveBeenCalledWith({ email: 'test@test.com' });

      // check if the notification was shown
      expect(showNotification).toHaveBeenCalledWith('Success message');
    });
  });
});