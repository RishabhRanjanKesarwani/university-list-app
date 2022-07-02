import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Header from '../components/Header';
import { BrowserRouter } from 'react-router-dom';

describe('Header', () => {
  it('should have the school icon', async () => {
    render(<BrowserRouter><Header /></BrowserRouter>);
    const schoolIcons = screen.getAllByTestId('SchoolIcon');
    expect(schoolIcons.length).toBe(2);
    schoolIcons[0].nextSibling !== null && fireEvent.click(schoolIcons[0].nextSibling);
    schoolIcons[1].nextSibling !== null && fireEvent.click(schoolIcons[1].nextSibling);
  })

  it('should have 3 page buttons in desktop screen', async () => {
    render(<BrowserRouter><Header /></BrowserRouter>);
    const buttons = screen.getAllByTestId('page-button');
    expect(buttons.length).toBe(3);
    buttons.forEach(button => {
      fireEvent.click(button);
    })
  })

  it('should open and close nav menu on small screen', () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));
    render(<BrowserRouter><Header /></BrowserRouter>);
    const menuIcon = screen.getByTestId('MenuIcon');
    expect(menuIcon).toBeVisible();
    fireEvent.click(menuIcon);
    const menuButtons = screen.getAllByTestId('menu-button');
    expect(menuButtons.length).toBe(3);
    fireEvent.click(menuButtons[0].children[0]);
  })
});
