import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('Home screen', () => {
  it('should have the university image', async () => {
    const { container } = render(<App />);
    expect(container.getElementsByClassName('App')[0]).toBeVisible()
  })
});
