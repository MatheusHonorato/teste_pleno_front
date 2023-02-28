import { render, screen } from '@testing-library/react';
import Home from 'components/Home';

test('render app component', () => {
  render(<Home />);
  let linkElement = screen.getByText('Esta é a página home');
  expect(linkElement).toBeInTheDocument();
});

