import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ForgetPassword from '../ForgetPassword';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../api/account', () => ({
  forgetPassword: jest.fn(() => Promise.resolve({ message: 'Reset instructions sent.' })),
}));

describe('ForgetPassword', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ForgetPassword />
      </BrowserRouter>
    );
  });

  test('renders ForgetPassword component', () => {
        expect(screen.getByText('Forgot password?')).toBeInTheDocument();
        expect(screen.getByText('No worries, we\'ll send you the reset instructions.')).toBeInTheDocument();
    });

    test('submits the form', async () => {
        const emailInput = screen.getByPlaceholderText('Email');
        const submitButton = screen.getByText('Reset Password');

        fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(screen.getByText('Reset instructions sent.')).toBeInTheDocument());
    });
  });




