import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Subscribe from '../pages/Subscribe';
import { BrowserRouter } from 'react-router-dom';

describe('Subscribe screen', () => {
  it('should have the subscribe button disabled initially', async () => {
    render(<BrowserRouter><Subscribe /></BrowserRouter>);
    const subscribeButton = screen.getByRole('button');
    expect(subscribeButton).toBeDisabled();
  })

  it('subscribe button should be enabled and success snackbar should be visible', async () => {
    render(<BrowserRouter><Subscribe /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'rish@xendit.co' } })
    const subscribeButton = screen.getByRole('button');
    expect(subscribeButton).not.toBeDisabled();
    fireEvent.click(subscribeButton);
    const snackbar = screen.getByTestId('subscribe-snackbar');
    expect(snackbar).toBeVisible();
    expect(screen.getByTestId('SuccessOutlinedIcon')).toBeVisible();
  })

  it('should have error snackbar on invalid email input', async () => {
    render(<BrowserRouter><Subscribe /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'rish@co' } });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('ErrorOutlineIcon')).toBeVisible();
  })

  it('should have info snackbar on duplicate email input', async () => {
    render(<BrowserRouter><Subscribe /></BrowserRouter>);
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'rish@xendit.co' } });
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getAllByRole('button')[0]); // Snackbar close button will also be present at least for 6s after first click
    expect(screen.getByTestId('InfoOutlinedIcon')).toBeVisible();
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(screen.getByTestId('InfoOutlinedIcon')).not.toBeVisible();
  })
});
