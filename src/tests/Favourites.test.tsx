import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import Favourites from '../pages/Favourites';
import { BrowserRouter } from 'react-router-dom';

beforeEach(() => {
  Object.defineProperty(window, "localStorage", {
    value: {
      getItem: jest.fn(() => null),
      setItem: jest.fn(() => null)
    },
    writable: true
  });
});

describe('University list screen', () => {
  it('should have no favourites initially', async () => {
    render(<BrowserRouter><Favourites /></BrowserRouter>);
    expect(screen.getByText(`You don't have any favourites!`)).toBeVisible();
  })

  it('should have button to navigate to list page initially', async () => {
    render(<BrowserRouter><Favourites /></BrowserRouter>);
    expect(screen.getByRole('button')).toBeVisible();
    fireEvent.click(screen.getByRole('button'));
  })

  it('should have called getlocalstorage', () => {
    render(<BrowserRouter><Favourites /></BrowserRouter>);
    expect(window.localStorage.getItem).toHaveBeenCalled();
  })

  it('should render table', () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => JSON.stringify([{ name: 'AKGEC', country: 'India', domains: ['akgec.in'] }, { name: 'IMS', country: 'India', domains: ['ims.in'] }])),
        setItem: jest.fn(() => null)
      },
      writable: true
    });
    render(<BrowserRouter><Favourites /></BrowserRouter>);
    expect(screen.getByTestId('favourites-table')).toBeVisible();
    expect(screen.getByTestId('favourites-table').children[1].children.length).toBe(2);
  })

  it('should remove from favourites', () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => JSON.stringify([{ name: 'AKGEC', country: 'India', domains: ['akgec.in'] }, { name: 'IMS', country: 'India', domains: ['ims.in'] }])),
        setItem: jest.fn(() => null)
      },
      writable: true
    });
    render(<BrowserRouter><Favourites /></BrowserRouter>);
    expect(screen.getByTestId('favourites-table')).toBeVisible();
    expect(screen.getByTestId('favourites-table').children[1].children.length).toBe(2);
    const removeButtons = within(screen.getByTestId('favourites-table')).getAllByRole('button');
    fireEvent.click(removeButtons[0]);
    expect(screen.getByTestId('favourites-table').children[1].children.length).toBe(1);
    expect(screen.getByTestId('SuccessOutlinedIcon')).toBeVisible();
    fireEvent.click(screen.getByTestId('CloseIcon'));
  })

  // it('should have table containing 3 data items after first API call', async () => {
  //   render(<BrowserRouter><List /></BrowserRouter>);
  //   await waitFor(() => screen.getByTestId('list-table'));
  //   expect(screen.getByTestId('list-table')).toBeVisible();
  //   expect(screen.getByTestId('list-table').children[1].children.length).toBe(3); // Accessing table -> tbody -> tr
  // })

  // it('should call the API on change of name', async () => {
  //   render(<BrowserRouter><List /></BrowserRouter>);
  //   await waitFor(() => screen.getByTestId('list-table'));
  //   fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'abes' } })
  //   await waitForElementToBeRemoved(() => screen.queryByTestId('list-table')); // Table will be removed only when the API is called again
  //   await waitForElementToBeRemoved(() => screen.getByText('Loading...')); // Loading will be visible when the API is called
  //   expect(screen.getByAltText('No data image')).toBeVisible(); // Lastly, the no data image will be visible because empty array is passed as mocked data
  // })

  // it('should call the API on change of country', async () => {
  //   render(<BrowserRouter><List /></BrowserRouter>);
  //   await waitFor(() => screen.getByTestId('list-table'));
  //   fireEvent.change(screen.getByLabelText('Country'), { target: { value: 'Indonesia' } })
  //   await waitForElementToBeRemoved(() => screen.queryByTestId('list-table')); // Table will be removed only when the API is called again
  //   await waitForElementToBeRemoved(() => screen.getByText('Loading...')); // Loading will be visible when the API is called
  //   expect(screen.getByText('Indonesia University')).toBeVisible();
  // })

  // it('should show success snackbar and then info snackbar', async () => {
  //   render(<BrowserRouter><List /></BrowserRouter>);
  //   await waitFor(() => screen.getByTestId('list-table'));
  //   const addToFavouritesButtons = within(screen.getByTestId('list-table')).getAllByRole('button');
  //   expect(addToFavouritesButtons.length).toBe(3);
  //   fireEvent.click(addToFavouritesButtons[0]);
  //   expect(screen.getByTestId('SuccessOutlinedIcon')).toBeVisible();
  //   fireEvent.click(addToFavouritesButtons[0]);
  //   expect(screen.getByTestId('InfoOutlinedIcon')).toBeVisible();
  // })
});
