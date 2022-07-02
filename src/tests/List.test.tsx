import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import List from '../pages/List';
import { BrowserRouter } from 'react-router-dom';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const response = [
  { name: 'AKGEC', country: 'India', domains: ['akgec.in'] },
  { name: 'Middlesex University', country: 'United States', domains: ['middlesex.com'] },
  { name: 'IMS', country: 'India', domains: ['ims.in'] }
]

const server = setupServer(
  rest.get('http://universities.hipolabs.com/search', (req, res, ctx) => {
    console.log(req.url.href, req.url.search, req.url.searchParams);
    switch (req.url.search) {
      case '?name=&country=India':
        return res(ctx.json(response));
      case '?name=abes&country=India':
        return res(ctx.json([]));
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

  it('should have table after first load', async () => {
    render(<BrowserRouter><List /></BrowserRouter>);
    await waitFor(() => screen.getByTestId('list-table'));
    expect(screen.getByTestId('list-table')).toBeVisible();
  })

  // it('should call API on change of name or country', async () => {
  //   render(<BrowserRouter><List /></BrowserRouter>);
  //   await waitFor(() => screen.getByTestId('list-table'));
  //   fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'abes' } })
  //   await waitFor(() => { return; }, { timeout: 1000 });
  //   expect(screen.getByAltText('No data image')).toBeVisible();
  // })
});
