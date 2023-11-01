import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom'; // To wrap your component in a router
import Home from 'client/src/pages/Home';
import { getEvent } from 'client/src/api/event'; // Replace with your actual API module

// Mock the getEvent function
jest.mock('client/src/api/event');

describe('Home Component', () => {
  const mockEvents = [
    {
      id: 1,
      event_name: 'Event 1',
      banner_img: 'base64encodedimage1', // Replace with your actual base64-encoded image
    },
    {
      id: 2,
      event_name: 'Event 2',
      banner_img: 'base64encodedimage2', // Replace with your actual base64-encoded image
    },
  ];

  beforeEach(() => {
    // Mock the API response for getEvent
    getEvent.mockResolvedValue({ events: mockEvents });
  });

  it('renders the home component with events', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for API data to be loaded
    await waitFor(() => {
      // Check if the title is rendered
      const title = screen.getByText('All Events', { selector: 'h2' });
      expect(title).toBeInTheDocument();

      // Check if the images from API data are rendered
      const eventImages = screen.getAllByAltText(/^Event \d$/);
      expect(eventImages).toHaveLength(mockEvents.length);

      // Verify that at least one image is loaded
      expect(eventImages[0]).toBeInTheDocument();
    });
  });
});
