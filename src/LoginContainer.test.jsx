import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { useDispatch, useSelector } from 'react-redux';

import LoginContainer from './LoginContainer';

import LOGIN_FIELDS from '../fixtures/loginFields';

jest.mock('react-redux');

describe('LoginContainer', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();

    useDispatch.mockImplementation(() => dispatch);
    useSelector.mockImplementation((selector) => selector({
      accessToken: given.accessToken,
      loginError: given.error,
      loginFields: {
        email: '',
        password: '',
      },
    }));
  });

  const { email: EMAIL, password: PASSWORD } = LOGIN_FIELDS;

  context('when logged out', () => {
    given('accessToken', () => null);

    it('renders email input', () => {
      const { queryByLabelText } = render(<LoginContainer />);

      expect(queryByLabelText('E-mail')).not.toBeNull();
    });

    it('renders password input', () => {
      const { queryByLabelText } = render(<LoginContainer />);

      expect(queryByLabelText('Password')).not.toBeNull();
    });

    it('renders error message when login error', () => {
      given('error', () => true);

      const { queryByText } = render(<LoginContainer />);

      expect(queryByText('아이디 또는 비밀번호를 확인해주세요')).not.toBeNull();
    });

    it('dispatches "changeLoginFields" action when change email and password', () => {
      const { getByLabelText } = render(<LoginContainer />);

      const controls = [{
        label: 'E-mail',
        name: 'email',
        value: EMAIL,
      }, {
        label: 'Password',
        name: 'password',
        value: PASSWORD,
      }];

      controls.forEach(({ label, name, value }) => {
        fireEvent.change(getByLabelText(label), {
          target: {
            value,
          },
        });

        expect(dispatch).toBeCalledWith({
          type: 'changeLoginFields',
          payload: {
            name,
            value,
          },
        });
      });
    });

    it('renders "Log In" button', () => {
      const { queryByText } = render(<LoginContainer />);

      expect(queryByText('Log In')).not.toBeNull();
    });

    it('dispatches action when "log In" button click', () => {
      const { getByText } = render(<LoginContainer />);

      fireEvent.submit(getByText('Log In'));

      expect(dispatch).toBeCalled();
    });
  });

  context('when logged in', () => {
    given('accessToken', () => 'ACCESS_TOKEN');

    it('renders "Log out" button', () => {
      const { queryByText } = render(<LoginContainer />);

      expect(queryByText('Log out')).not.toBeNull();
    });

    it('dispatches "setAccessToken" action when "log Out" button click', () => {
      const { getByText } = render(<LoginContainer />);

      fireEvent.click(getByText('Log out'));

      expect(dispatch).toBeCalledWith({
        type: 'setAccessToken',
        payload: {
          accessToken: null,
        },
      });
    });
  });
});