import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ResetPassword from 'client/src/pages/ResetPassword';
import * as module from 'client/src/api/account';

// Mock the navigate function from 'react-router' 
jest.mock('react-router', () => ({
    useNavigate: () => jest.fn(),
}));

// Mock the resetPassword function from 'account' API 
module.resetPassword = jest.fn();

test('renders ResetPassword and triggers onSubmit', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const newPasswordInput = getByPlaceholderText('New Password');
    const confirmNewPasswordInput = getByPlaceholderText('Confirm New Password');

    fireEvent.change(newPasswordInput, { target: { value: 'password' } });
    fireEvent.change(confirmNewPasswordInput, { target: { value: 'password' } });

    expect(newPasswordInput.value).toBe('password');
    expect(confirmNewPasswordInput.value).toBe('password');

    module.resetPassword.mockResolvedValue({
        message: 'Password reset successfully.',
    });

    fireEvent.click(getByText('Reset'));

    // waitFor for the Promise resolution or timeout.
    await waitFor(() => {
        expect(module.resetPassword).toHaveBeenCalled();
    });
});