import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('Application Smoke Test', () => {
  it('renders the header and navigation without crashing', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const elements = screen.getAllByText(/Centre For/i);
    expect(elements.length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Our Staff & Specialists/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Sixs Sports Ecosystem/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Our Leadership/i).length).toBeGreaterThan(0);
  });
});