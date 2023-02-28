import { fireEvent, render, screen } from '@testing-library/react';
import Companies from 'components/Companies';

test('render button new', () => {
  const { getByText } = render(<Companies />);
  const buttonElement = getByText('Novo');
  fireEvent.click(buttonElement);

  const modal = screen.getByRole('dialog');
  expect(modal).toBeInTheDocument();
});
