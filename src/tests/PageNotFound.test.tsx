import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import PageNotFound from '../pages/PageNotFound';
import { BrowserRouter } from 'react-router-dom';

describe('PageNotFound screen', () => {
  it('should have the 404 image', async () => {
    render(<BrowserRouter><PageNotFound /></BrowserRouter>);
    expect(await screen.findByAltText('404 image')).toBeVisible();
  })

  it('should have 3 buttons', async () => {
    render(<BrowserRouter><PageNotFound /></BrowserRouter>);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(3);
    buttons.forEach(button => {
      expect(button).not.toBeDisabled();
      fireEvent.click(button);
    })
  })
});
