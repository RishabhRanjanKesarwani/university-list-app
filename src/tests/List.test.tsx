import React from 'react';
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react';
import List from '../pages/List';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const response = [
  { name: 'AKGEC', country: 'India', domains: ['akgec.in'] },
  { name: 'Middlesex University', country: 'United States', domains: ['middlesex.com'] },
  { name: 'IMS', country: 'India', domains: ['ims.in'] }
];

const server = setupServer(
  rest.get('http://universities.hipolabs.com/search', (req, res, ctx) => {
    switch (req.url.search) {
      case '?name=&country=India':
        return res(ctx.json(response));
      case '?name=abes&country=India':
        return res(ctx.json([]));
      case '?name=&country=Indonesia':
        return res(ctx.json([{ name: 'Indonesia University', country: 'Indonesia', domains: ['iuniversity.com'] }]));
      default:
        return res(ctx.json(response));
    }
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('University list screen', () => {
  it('should have text fields for name and country and loading state initially', async () => {
    render(<BrowserRouter><List /></BrowserRouter>);
    expect(await screen.getByLabelText('Name')).toBeVisible();
    expect(await screen.getByLabelText('Country')).toBeVisible();
    expect(screen.getByText('Loading...')).toBeVisible();
  })

  it('should have table containing 3 data items after first API call', async () => {
    render(<BrowserRouter><List /></BrowserRouter>);
    await waitFor(() => screen.getByTestId('list-table'));
    expect(screen.getByTestId('list-table')).toBeVisible();
    expect(screen.getByTestId('list-table').children[1].children.length).toBe(3); // Accessing table -> tbody -> tr
  })

  it('should call the API on change of name', async () => {
    render(<BrowserRouter><List /></BrowserRouter>);
    await waitFor(() => screen.getByTestId('list-table'));
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'abes' } })
    await waitForElementToBeRemoved(() => screen.queryByTestId('list-table')); // Table will be removed only when the API is called again
    await waitForElementToBeRemoved(() => screen.getByText('Loading...')); // Loading will be visible when the API is called
    expect(screen.getByAltText('No data image')).toBeVisible(); // Lastly, the no data image will be visible because empty array is passed as mocked data
  })

  it('should call the API on change of country', async () => {
    render(<BrowserRouter><List /></BrowserRouter>);
    await waitFor(() => screen.getByTestId('list-table'));
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'Indonesia' } })
    await waitForElementToBeRemoved(() => screen.queryByTestId('list-table')); // Table will be removed only when the API is called again
    await waitForElementToBeRemoved(() => screen.getByText('Loading...')); // Loading will be visible when the API is called
    expect(screen.getByText('Indonesia University')).toBeVisible();
  })

  it('should show success snackbar and then info snackbar', async () => {
    render(<BrowserRouter><List /></BrowserRouter>);
    await waitFor(() => screen.getByTestId('list-table'));
    const addToFavouritesButtons = within(screen.getByTestId('list-table')).getAllByRole('button');
    expect(addToFavouritesButtons.length).toBe(3);
    fireEvent.click(addToFavouritesButtons[0]);
    expect(screen.getByTestId('SuccessOutlinedIcon')).toBeVisible();
    fireEvent.click(addToFavouritesButtons[0]);
    expect(screen.getByTestId('InfoOutlinedIcon')).toBeVisible();
  })
});
