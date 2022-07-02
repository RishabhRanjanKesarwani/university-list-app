import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Home from '../pages/Home';
import { BrowserRouter } from 'react-router-dom';

describe('Home screen', () => {
  it('should have the university image', async () => {
    render(<BrowserRouter><Home /></BrowserRouter>);
    expect(await screen.findByAltText('University list image')).toBeVisible();
  })

  it('the buttons should not be disabled and should be clickable', async () => {
    render(<BrowserRouter><Home /></BrowserRouter>);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).not.toBeDisabled();
      fireEvent.click(button);
    })
  })
});
