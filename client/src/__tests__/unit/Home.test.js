import React from 'react';
import { render, act } from '@testing-library/react';
import Home from 'client/src/pages/Home';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Home Component', () => {
  it('renders the "All Events" title', async () => {
    fetchMock.mockResponse(
      JSON.stringify({
        events: [
          {
            id: 1,
            event_name: 'Event 1',
            banner_img: 'base64encodedimage1',
          },
          {
            id: 2,
            event_name: 'Event 2',
            banner_img: 'base64encodedimage2',
          },
        ],
      })
    );

    let getByText, findByAltText;

    await act(async () => {
      const result = render(
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      );

      getByText = result.getByText;
      findByAltText = result.findByAltText;
    });

    const title = await getByText(/All Events/i);
    expect(title).toBeInTheDocument();

    const image1 = await findByAltText('Event 1');
    expect(image1).toBeInTheDocument();

    const image2 = await findByAltText('Event 2');
    expect(image2).toBeInTheDocument();
  });
});
