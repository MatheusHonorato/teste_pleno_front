import { render, screen } from '@testing-library/react';
import About from 'components/About';

test('render app component', () => {
  render(<About />);
  let linkElement = screen.getByText('Esta é a página sobre');
  expect(linkElement).toBeInTheDocument();
});

