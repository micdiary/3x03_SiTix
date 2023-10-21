/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect'
import { createMemoryHistory } from 'history';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from 'client/src/pages/Login';
// import { Login } from 'client/src/pages/Login';
import * as api from 'client/src/api/account';
import { useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store/User.js';
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

  // it('renders Login component', () => {
  //   render(<Provider store={store}><Login /></Provider>);

  //   expect(screen.getByText(/Login/i)).toBeInTheDocument();
  // });

  // it('handles input and form submission', async () => {
  //   render(<Provider store={store}><Login /></Provider>);

  //   fireEvent.input(screen.getByPlaceholderText(/Username/i), {
  //     target: { value: 'testuser' },
  //   });

  //   fireEvent.input(screen.getByPlaceholderText(/Password/i), {
  //     target: { value: 'testpass' },
  //   });

  //   fireEvent.click(screen.getByText(/Login/i));

  //   await waitFor(() => expect(api.login).toHaveBeenCalled());
  //   await waitFor(() => expect(navigate).toHaveBeenCalled());
  // });

  // it('handles input and form submission', () => {
  //   // mock the history object
  //   const history = createMemoryHistory();
    
  //   // render the Login component
    // render(
    //   <Router history={history}>
    //     <Login />
    //   </Router>
    // );
    
  //   // Check if login form is visible
  //   const usernameInput = screen.getByPlaceholderText('Username');
  //   const passwordInput = screen.getByPlaceholderText('Password');
  //   const loginButton = screen.getByText('Login');
    
  //   // Simulate user input
  //   fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
  //   fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
  
  //   // Submit the form
  //   fireEvent.click(loginButton);
    
  //   // Assert that the form data was submitted
  //   // Note: you need to add the corresponding assertions depending on what the form submission does in your actual login function.
  // });
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