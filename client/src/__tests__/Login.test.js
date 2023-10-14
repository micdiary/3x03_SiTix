import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from './Login';
import * as api from '../api/account'; // adjust this to your actual path
import { useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store';

jest.mock('../api/account');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login', () => {
  let navigate;

  beforeEach(() => {
    api.login.mockResolvedValue({
      token: 'dummy_token',
      userType: 'dummy_type',
    });
    
    navigate = jest.fn();

    useNavigate.mockReturnValue(navigate);
  });

  it('renders Login component', () => {
    render(<Provider store={store}><Login /></Provider>);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  it('handles input and form submission', async () => {
    render(<Provider store={store}><Login /></Provider>);

    fireEvent.input(screen.getByPlaceholderText(/Username/i), {
      target: { value: 'testuser' },
    });

    fireEvent.input(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'testpass' },
    });

    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => expect(api.login).toHaveBeenCalled());
    await waitFor(() => expect(navigate).toHaveBeenCalled());
  });
});