import React from "react";
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { API } from "../constants";

class Users extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            name: '',
            email: '',
            users: [],
            companies_selected: [],
            companies: [],
            modalShow: false,
            filter: ''
        }
    }

    componentDidMount() {
        this.searchUsers();
        this.searchCompanies();
    }

    searchCompanies = (ids_company_edit = null) => {
        fetch(`${API['BASE_URL']}/${API['COMPANY']}`)
            .then(response => response.json())
            .then(datas => {
                let companies_filter = datas.data;
                if(ids_company_edit!=null)
                    companies_filter = datas.data.filter(item => !ids_company_edit.includes(item.id))

                this.setState({ companies: companies_filter });
            })
    }

    searchUsers = () => {
        fetch(`${API['BASE_URL']}/${API['USER']}`)
            .then(response => response.json())
            .then(datas => {
                this.setState({ users: datas.data });
            })
    }

    searchUsersWithParams = (event) => {
        let search = event.target.value;

        if(search === '' || search === undefined || search === null || this.state.filter === '' || this.state.filter === undefined || this.state.filter === null)
            this.searchUsers();

        fetch(`${API['BASE_URL']}/${API['USER']}?${this.state.filter}=${search}`)
            .then(response => response.json())
            .then(datas => {
                let users;
                (datas.data.length == undefined) ? users = [datas.data] : users = datas.data;
                this.setState({ users: users });
            })
    }

    deleteUser = (id) => {
        fetch(`${API['BASE_URL']}/${API['USER']}/`+id, { method: 'DELETE' })
            .then(response => response.json())
            .then(datas => {
                if(datas.status === 'success') {
                    this.searchUsers();
                }
            })
    }

    deleteCompany = (company_add) => {
        let new_companies = this.state.companies;
        new_companies.push(company_add);

        this.setState(
            {
                companies_selected: this.state.companies_selected.filter(company => company.id != company_add.id),
                companies: new_companies

            }
        )
    }

    addCompany = (company_add) => {
        let new_companies = this.state.companies_selected;
        new_companies.push(company_add);

        this.setState(
            {
                companies_selected: new_companies,
                companies: this.state.companies.filter(company => company.id != company_add.id),

            }
        )
    }

    loadUser = (id) => {
        fetch(`${API['BASE_URL']}/${API['USER']}/${id}`, { method: 'GET' })
            .then(response => response.json())
            .then(datas => {
                
                this.setState({ 
                    id: datas.data.id,
                    name: datas.data.name,
                    email: datas.data.email,
                    companies_selected: datas.data.companies,
                 })

                let ids_company_edit = datas.data.companies.map(function(company) {
                    return company.id;
                });

                 this.handleOpen();
                 this.searchCompanies(ids_company_edit);
            })
    }

    createUser = (user) => {
        fetch(`${API['BASE_URL']}/${API['USER']}`, {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(datas => {
            if(datas.status === 'success') {
                this.searchUsers();
            }
        })
    }

    updateUser = (user) => {
        fetch(`${API['BASE_URL']}/${API['USER']}/${user.id}`, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(user)
        })
        .then(response => response.json())
        .then(datas => {
            if(datas.status === 'success') {
                this.searchUsers();
            }
        })
    }

    renderTable() {
        return <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Opções</th>
                </tr>
            </thead>
            <tbody>
                {
                    this.state.users.map((user, index) =>
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button variant="secondary" onClick={() => this.loadUser(user.id)}>Editar</Button>
                                <Button variant="danger" onClick={() => this.deleteUser(user.id)}>Excluir</Button>
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </Table>
    }

    updateName = (event) => {
        this.setState(
            {
                name: event.target.value
            }
        )
    }

    updateEmail = (event) => {
        this.setState(
            {
                email: event.target.value
            }
        )
    }

    updateFilter = (event) => {
        this.setState(
            {
                filter: event.target.value
            }
        )
    }

    submit = () => {
        let ids_company_save = this.state.companies_selected.map(function(company) {
            return company.id;
        });


        if(this.state.id == 0) {
            const user = {
                name: this.state.name,
                email: this.state.email,
                phone: '383333333',
                date: '2023-02-22',
                city: 'Montes Claros',
                company_ids: ids_company_save
            };
    
            this.createUser(user);
        } else {
            const user = {
                id: this.state.id,
                name: this.state.name,
                email: this.state.email,
                phone: '383333333',
                date: '2023-02-22',
                city: 'Montes Claros',
                company_ids: ids_company_save
            };
    
            this.updateUser(user);
        }
        this.handleClose();
    }

    reset = () =>  {
        this.setState(
            {
                id: 0,
                name: '',
                email: '',
                companies_selected: []
            }
        )
        this.searchCompanies();
        this.handleOpen();
    }

    handleClose = () => {
        this.setState(
            {
                modalShow: false
            }
        )
    }

    handleOpen = () => {
        this.setState(
            {
                modalShow: true
            }
        )
    }

    render() {
        return(
            <div>
                <Modal show={this.state.modalShow} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Dados do usuário</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicId">
                                <Form.Label>Id</Form.Label>
                                <Form.Control type="text" value={this.state.id} readOnly={true} disabled={true}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" placeholder="Preencha o nome" value={this.state.name} onChange={this.updateName}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control type="email" placeholder="Preencha o e-mail" value={this.state.email} onChange={this.updateEmail}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicTable">
                                <Form.Label>Empresas</Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>CNPJ</th>
                                            <th>Endereço</th>
                                            <th>Opções</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.companies.map((company, index) =>
                                            <tr key={index}>
                                                <td>{company.name}</td>
                                                <td>{company.cnpj}</td>
                                                <td>{company.address}</td>
                                                <td>
                                                    <Button variant="success" onClick={() => this.addCompany(company)}>Adicionar</Button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </Table>
                            </Form.Group>
                            
                            <Form.Group className="mb-3" controlId="formBasicTable">
                                <Form.Label>Empresas selecionadas</Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>CNPJ</th>
                                            <th>Endereço</th>
                                            <th>Opções</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.companies_selected.map((company, index) =>
                                            <tr key={index}>
                                                <td>{company.name}</td>
                                                <td>{company.cnpj}</td>
                                                <td>{company.address}</td>
                                                <td>
                                                    <Button variant="danger" onClick={() => this.deleteCompany(company)}>Remover</Button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </Table>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Sair
                        </Button>
                        <Button variant="primary" type="button" onClick={this.submit}>
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Modal>
                
                <Button variant="warning" type="button" onClick={this.reset}>
                    Novo
                </Button>

                <Form>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Control type="text" placeholder="Buscar" onChange={this.searchUsersWithParams}/>

                        <Form.Select aria-label="filter" value={this.state.filter} onChange={this.updateFilter}>
                            <option>Campo</option>
                            <option value="name">Nome</option>
                            <option value="email">E-mail</option>
                            <option value="phone">Telefone</option>
                            <option value="date">Data</option>
                            <option value="city">Cidade</option>
                            <option value="company">Empresa</option>
                        </Form.Select>
                    </Form.Group>
                </Form>

                {this.renderTable()}
            </div>
        )
    }
}

export default Users;