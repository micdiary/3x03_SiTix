import React from 'react';
import { render } from '@testing-library/react';
import Home from 'client/src/pages/Home';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';


test('renders without crashing', () => {
    const { getByText } = render(
      <Router>
        <Home />
      </Router>
    );
    
    const linkElement = getByText(/All Events/i);
    expect(linkElement).toBeInTheDocument();
  });