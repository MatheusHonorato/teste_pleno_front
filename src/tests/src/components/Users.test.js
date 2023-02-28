import { fireEvent, render, screen } from '@testing-library/react';
import Users from 'components/Users';

test('render button new', () => {
  const { getByText } = render(<Users />);
  const buttonElement = getByText('Novo');
  fireEvent.click(buttonElement);

  const modal = screen.getByRole('dialog');
  expect(modal).toBeInTheDocument();
});
