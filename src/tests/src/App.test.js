import { render, screen } from '@testing-library/react';
import App from '../../App';

test('render app component', () => {
  render(<App />);
  let linkElement = screen.getByText('Desafio | Fullstack');
  expect(linkElement).toBeInTheDocument();

  linkElement = screen.getByText('Página Inicial');
  expect(linkElement).toBeInTheDocument();

  linkElement = screen.getByText('Cadastro de usuários');
  expect(linkElement).toBeInTheDocument();

  linkElement = screen.getByText('Cadastro de empresas');
  expect(linkElement).toBeInTheDocument();

  linkElement = screen.getByText('Sobre');
  expect(linkElement).toBeInTheDocument();
});

