import React from "react";
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from "client/src/pages/Home";

test('renders the home component', () => {
    render(
        <Router>
            <Home />
        </Router>
    );
    const title = screen.getByText(/All Events/i);
    expect(title).toBeInTheDocument();

//....
// Check first event card
const firstEventNames = screen.getAllByText('(G)i-dle');
const firstEventDateTimes = screen.getAllByText('Date & Time 1');

// verify that there is at least one match
expect(firstEventNames.length).toBeGreaterThan(0);
expect(firstEventDateTimes.length).toBeGreaterThan(0);

// Check second event card
const secondEventNames = screen.getAllByText('d4vd');
const secondEventDateTimes = screen.getAllByText('Date & Time 2');

// verify that there is at least one match
expect(secondEventNames.length).toBeGreaterThan(0);
expect(secondEventDateTimes.length).toBeGreaterThan(0);

// Check third event card
const thirdEventNames = screen.getAllByText('HallyuPopFest');
const thirdEventDateTimes = screen.getAllByText('Date & Time 3');

// verify that there is at least one match
expect(thirdEventNames.length).toBeGreaterThan(0);
expect(thirdEventDateTimes.length).toBeGreaterThan(0);
//...

    // You can add many more checks according to your needs
}); 