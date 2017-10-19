import React from 'react';
import renderer from 'react-test-renderer';
import App from '../../components/App';
import Frontpage from './Frontpage';
import { mount } from 'enzyme';

describe('Frontpage', () => {
  test('renders frontpage correctly', () => {
    const wrapper = renderer
      .create(
        <App
          context={{
            insertCss: () => {},
            fetch: () => {},
            store: {
              subscribe: () => {},
              dispatch: () => {},
              getState: () => {}
            }
          }}
        >
          <Frontpage />
        </App>
      )
      .toJSON();

    expect(wrapper).toMatchSnapshot();
  });
  test('has 11 parties', () => {
    const wrapper = mount(
      <App
        context={{
          insertCss: () => {},
          fetch: () => {},
          store: {
            subscribe: () => {},
            dispatch: () => {},
            getState: () => {}
          }
        }}
      >
        <Frontpage />
      </App>
    );

    const partyCount = wrapper.find('.party').length;

    expect(partyCount).toBe(11);
  });
});
