import Home from './components/Home';
import Users from './components/Users';
import Companies from './components/Companies';
import About from './components/About';
import {BrowserRouter, Routes, Link, Route} from 'react-router-dom';
import {Nav} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <h1>Desafio | Fullstack</h1>
      
      <BrowserRouter>
      <Nav variant="tabs">
        <Nav.Link as={Link} to="/">Página Inicial</Nav.Link>
        <Nav.Link as={Link} to="/usuarios">Cadastro de usuários</Nav.Link>
        <Nav.Link as={Link} to="/empresas">Cadastro de empresas</Nav.Link>
        <Nav.Link as={Link} to="/sobre">Sobre</Nav.Link>
      </Nav>

      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/usuarios" element={<Users/>}></Route>
        <Route path="/empresas" element={<Companies/>}></Route>
        <Route path="/sobre" element={<About/>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
