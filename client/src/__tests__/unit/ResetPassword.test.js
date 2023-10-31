import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ForgetPassword from 'client/src/pages/ForgetPassword';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mock the API call and notification
jest.mock('client/src/api/account', () => ({
  forgetPassword: jest.fn(() => Promise.resolve({ message: 'Success message' })),
}));
jest.mock('client/src/components/Notification', () => ({
  showNotification: jest.fn(),
}));

describe('ForgetPassword UI', () => {
  it('renders the ForgetPassword component', () => {
    render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    );
  });

  it('shows notification on successful password reset', async () => {
    const { forgetPassword } = require('client/src/api/account');
    const { showNotification } = require('client/src/components/Notification');
    const { getByPlaceholderText, getByText } = render(
      <MemoryRouter>
        <ForgetPassword />
      </MemoryRouter>
    );

    // Simulate user input
    const emailInput = getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

    // Simulate form submission
    const submitButton = getByText('Reset Password');
    fireEvent.click(submitButton);

    // Wait for promises to be resolved
    await waitFor(() => {
      // Check if the API was called with the correct data
      expect(forgetPassword).toHaveBeenCalledWith({ email: 'test@test.com' });

      // Check if the notification was shown
      expect(showNotification).toHaveBeenCalledWith('Success message');
    });
  });
});
