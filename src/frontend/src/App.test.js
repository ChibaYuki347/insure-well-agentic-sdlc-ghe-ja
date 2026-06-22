import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

describe('App authentication flow', () => {
  beforeEach(() => {
    axios.get.mockReset();
    axios.post.mockReset();
  });

  test('shows login screen when not authenticated', async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 401 } });

    render(<App />);

    expect(await screen.findByTestId('login-form')).toBeInTheDocument();
  });

  test('logs in and loads dashboard', async () => {
    axios.get.mockImplementation((url) => {
      if (url === '/api/auth/me') {
        return Promise.reject({ response: { status: 401 } });
      }
      if (url === '/api/policies') {
        return Promise.resolve({
          data: [
            {
              id: 'POL-2024-001',
              holderName: 'InsureWell Admin',
              planName: 'Admin View Plan',
              coverageAmount: 1000,
              status: 'active',
              startDate: '2024-01-01',
              endDate: '2025-01-01',
              createdAt: '2024-01-01T00:00:00Z'
            }
          ]
        });
      }
      if (url === '/api/claims') {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error(`Unexpected GET ${url}`));
    });

    axios.post.mockImplementation((url) => {
      if (url === '/api/auth/login') {
        return Promise.resolve({
          data: {
            username: 'admin',
            fullName: 'InsureWell Admin',
            role: 'ADMIN'
          }
        });
      }
      return Promise.reject(new Error(`Unexpected POST ${url}`));
    });

    render(<App />);

    fireEvent.change(await screen.findByTestId('login-username'), { target: { value: 'admin' } });
    fireEvent.change(screen.getByTestId('login-password'), { target: { value: 'admin123' } });
    fireEvent.click(screen.getByTestId('login-submit'));

    expect(await screen.findByTestId('navbar-user')).toBeInTheDocument();
    await waitFor(() => expect(axios.post).toHaveBeenCalledWith('/api/auth/login', { username: 'admin', password: 'admin123' }));
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('/api/policies'));
  });
});