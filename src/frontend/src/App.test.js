import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import App from './App';

jest.mock('axios');

const defaultPolicies = [
  {
    id: 'POL-2024-001',
    holderName: 'Alex Johnson',
    planName: 'InsureWell Premium Health Plan',
    coverageAmount: 250000,
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2026-12-31',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

const defaultClaims = [
  {
    id: 'CLM-1715787000000',
    policyId: 'POL-2024-001',
    amount: 1500,
    description: 'Doctor visit for annual checkup',
    status: 'Approved',
    fileName: null,
    submittedAt: '2024-05-15T14:30:00.000Z',
    updatedAt: '2024-05-15T14:30:00.000Z',
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

test('allows a user to sign in and reach the protected dashboard', async () => {
  axios.get
    .mockRejectedValueOnce({ response: { status: 401 } })
    .mockResolvedValueOnce({ data: defaultPolicies })
    .mockResolvedValueOnce({ data: defaultClaims });

  axios.post.mockResolvedValueOnce({
    data: {
      message: 'Signed in successfully',
      user: {
        id: 1,
        username: 'admin',
        displayName: 'Default Admin',
        role: 'ADMIN',
      },
    },
  });

  render(<App />);

  expect(await screen.findByTestId('auth-screen')).toBeInTheDocument();

  fireEvent.change(screen.getByTestId('auth-username'), { target: { value: 'admin' } });
  fireEvent.change(screen.getByTestId('auth-password'), { target: { value: 'Admin123!' } });
  fireEvent.click(screen.getByTestId('auth-submit-btn'));

  expect(await screen.findByTestId('dashboard')).toBeInTheDocument();
  expect(screen.getByTestId('current-user-chip')).toHaveTextContent('Default Admin');
  expect(screen.getByTestId('signout-button')).toBeInTheDocument();
});

test('shows a login error when credentials are invalid', async () => {
  axios.get.mockRejectedValueOnce({ response: { status: 401 } });

  axios.post.mockRejectedValueOnce({
    response: {
      status: 401,
      data: { error: 'Invalid username or password' },
    },
  });

  render(<App />);

  expect(await screen.findByTestId('auth-screen')).toBeInTheDocument();

  fireEvent.change(screen.getByTestId('auth-username'), { target: { value: 'admin' } });
  fireEvent.change(screen.getByTestId('auth-password'), { target: { value: 'wrong-password' } });
  fireEvent.click(screen.getByTestId('auth-submit-btn'));

  expect(await screen.findByTestId('auth-error')).toHaveTextContent('Invalid username or password');
  expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
  expect(screen.queryByTestId('claims')).not.toBeInTheDocument();
});

test('keeps protected routes hidden until the session is authenticated', async () => {
  axios.get.mockRejectedValueOnce({ response: { status: 401 } });

  render(<App />);

  expect(await screen.findByTestId('auth-screen')).toBeInTheDocument();
  expect(screen.queryByTestId('dashboard')).not.toBeInTheDocument();
  expect(screen.queryByTestId('claims')).not.toBeInTheDocument();
});

test('signs out and returns to the login screen', async () => {
  axios.get
    .mockResolvedValueOnce({
      data: {
        message: 'Authenticated',
        user: {
          id: 1,
          username: 'admin',
          displayName: 'Default Admin',
          role: 'ADMIN',
        },
      },
    })
    .mockResolvedValueOnce({ data: defaultPolicies })
    .mockResolvedValueOnce({ data: defaultClaims });

  axios.post.mockResolvedValueOnce({ data: { message: 'Signed out' } });

  render(<App />);

  expect(await screen.findByTestId('dashboard')).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('signout-button'));

  expect(await screen.findByTestId('auth-screen')).toBeInTheDocument();
});