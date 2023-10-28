import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForgetPassword from 'client/src/pages/ForgetPassword';
import * as apiModule from 'client/src/api/account';
import * as notificationModule from 'client/src/components/Notification';

// Mock the api call
jest.mock('client/src/api/account', () => ({
  forgetPassword: jest.fn(() => Promise.resolve({ message: 'Success message' })),
}));

test('renders ForgetPassword component', () => {
  render(
    <MemoryRouter>
      <ForgetPassword />
    </MemoryRouter>
  );
});

test('show notification on successful password reset', async () => {
  const { getByPlaceholderText, getByText } = render(
    <MemoryRouter>
      <ForgetPassword />
    </MemoryRouter>
  );

  // Spy on the original showNotification function
  const showNotificationSpy = jest.spyOn(notificationModule, 'showNotification');

  // Simulate user input
  const emailInput = getByPlaceholderText('Email');
  fireEvent.change(emailInput, { target: { value: 'test@test.com' } });

  // Simulate form submission
  const submitButton = getByText('Reset Password');
  fireEvent.click(submitButton);

  // Wait for promises to be resolved
  await waitFor(() => {
    // Check if the API was called with the correct data
    expect(apiModule.forgetPassword).toHaveBeenCalledWith({ email: 'test@test.com' });

    // Check if the showNotification function was called with the success message
    expect(showNotificationSpy).toHaveBeenCalledWith('Success message');

    // Restore the original showNotification function
    showNotificationSpy.mockRestore();
  });
});
