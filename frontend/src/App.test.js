import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';

let inputElement
let buttonElement

beforeEach(() => {
  render(<App />)
  inputElement = screen.getByTestId('number');
  buttonElement = screen.getByRole('button', { id: 'senbtn' });
})

test('renders component', () => {
  render(<App />);
  expect(inputElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});



