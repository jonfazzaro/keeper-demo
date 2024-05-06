import React from 'react';
import {render, screen} from '@testing-library/react';
import App from './App';
import clock from "./clock";

test('should render without crashing', () => {
  render(<App />);
});

test.each([
  [6, "Good morning!"],
  [11, "Good morning!"],
  [12, "Good afternoon!"],
  [16, "Good afternoon!"],
  [17, "Good evening!"],
  [22, "Isn't it past your bedtime?"],
  [0, "Isn't it past your bedtime?"],
  [5, "You're up early!"],
])("At %s:00, greets with '%s'.", (hour, expected) => {
  clock.hour.mockReturnValue(hour)
  render(<App />);
  expect(screen.getByTestId("greeting").textContent).toBe(expected);
});

jest.mock('./clock')
