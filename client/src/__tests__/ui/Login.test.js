import '@testing-library/jest-dom'
import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from 'client/src/pages/Login';
import * as api from 'client/src/api/account';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('client/src/api/account');
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

  test('renders login elements', () => {
    //render(<YourComponent />); // render your component
    render(
      <Router history={history}>
        <Login />
      </Router>
    );
    const allLoginElements = screen.getAllByText('Login'); // find all elements with "Login" text
  
    // Expect the correct number of Login elements
    // This could differ depending on your actual layout
    expect(allLoginElements.length).toBe(2); 
  
    // Expect the particular elements to be in the document
    expect(allLoginElements[0]).toBeInTheDocument();
    expect(allLoginElements[1]).toBeInTheDocument();
  });


});