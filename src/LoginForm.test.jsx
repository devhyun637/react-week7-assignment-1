
import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import LoginForm from './LoginForm';

describe('LoginForm', () => {
  const handleChange = jest.fn();
  const handleSubmit = jest.fn();
  beforeEach(() => {
    handleChange.mockClear();
    handleSubmit.mockClear();
  });
  
  function renderLoginForm({ email, password }) {
    return render(
      <LoginForm
        fields={{ email, password }}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />);
  }
  it('renders input controls', () => {
    const email = 'test@test.com';
    const password = 'test';

    const { getByLabelText } = renderLoginForm({ email, password });

    const controls = [
        { label: 'E-mail', value: email, value: 'test@test.com' },
        { label: 'Password', value: password, value: 'test' },
    ]

    controls.forEach(({ label, value}) => {
      const input = getByLabelText(label);

      expect(input.value).toBe(value);
    });
  });

  it('listens change events', () => {
    const { getByLabelText } = renderLoginForm({});

    const controls = [
        { label: 'E-mail', name: 'email', value: 'test@test.com' },
        { label: 'Password', name: 'password', value: 'test' },
    ];

    controls.forEach(({ label, name, value }) => {
      const input = getByLabelText(label);

      fireEvent.change(input, { target: { value } });

      expect(handleChange).toBeCalledWith({ name, value });
    });
  });

  it('renders "Log In" button', () => {
    const { getByText } = renderLoginForm({});

    fireEvent.click(getByText('Log In'));
    
    expect(handleSubmit).toBeCalled();
  });
});
