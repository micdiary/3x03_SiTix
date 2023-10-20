import { render, fireEvent, waitFor } from "@testing-library/react";
import Login from 'client/src/pages/Login';
import { BrowserRouter } from "react-router-dom";

describe('Login', () => {
  it('renders correctly', () => {
    const { getByText, getByPlaceholderText } = render(<BrowserRouter><Login /></BrowserRouter>);
    
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByPlaceholderText('Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('shows an error if the form is submitted without a username', async () => {
    const { getByText, getByRole } = render(<BrowserRouter><Login /></BrowserRouter>);
    
    fireEvent.click(getByText('Login'));
    
    await waitFor(() => {
      expect(getByRole('alert')).toHaveTextContent('Please enter your Username.');
    });
  });

  it('shows an error if the form is submitted without a password', async () => {
    const { getByText, getByRole } = render(<BrowserRouter><Login /></BrowserRouter>);
    
    fireEvent.click(getByText('Login'));
    
    await waitFor(() => {
      expect(getByRole('alert')).toHaveTextContent('Please enter your Password.');
    });
  });
});