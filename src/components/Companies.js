import React from "react";
import { Table, Button, Form, Modal } from 'react-bootstrap';

class Companies extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            name: '',
            cnpj: '',
            address: '',
            companies: [],
            users_selected: [],
            users: [],
            modalShow: false,
            filter: ''
        }
    }

    componentDidMount() {
        this.searchCompanies();
        this.searchUsers();
    }

    searchUsers = (ids_user_edit = null) => {
        fetch("http://localhost:8000/user")
            .then(response => response.json())
            .then(datas => {
                let users_filter = datas.data;
                if(ids_user_edit!=null)
                    users_filter = datas.data.filter(item => !ids_user_edit.includes(item.id))

                this.setState({ users: users_filter });
            })
    }

    searchCompanies = () => {
        fetch("http://localhost:8000/company")
            .then(response => response.json())
            .then(datas => {
                this.setState({ companies: datas.data });
            })
    }

    searchCompaniesWithParams = (event) => {
        let search = event.target.value;

        if(search === '' || search === undefined || search === null || this.state.filter === '' || this.state.filter === undefined || this.state.filter === null)
            this.searchUsers();

        fetch(`http://localhost:8000/company?${this.state.filter}=${search}`)
            .then(response => response.json())
            .then(datas => {
                let companies;
                (datas.data.length == undefined) ? companies = [datas.data] : companies = datas.data;
                this.setState({ companies: companies })
            })
    }

    deleteCompany = (id) => {
        fetch("http://localhost:8000/company/"+id, { method: 'DELETE' })
            .then(response => response.json())
            .then(datas => {
                if(datas.status === 'success') {
                    this.searchCompanies();
                }
            })
    }

    deleteUser = (user_add) => {
        let new_users = this.state.users;
        new_users.push(user_add);

        this.setState(
            {
                users_selected: this.state.users_selected.filter(user => user.id != user_add.id),
                users: new_users

            }
        )
    }

    addUser = (user_add) => {
        let new_users = this.state.users_selected;
        new_users.push(user_add);

        this.setState(
            {
                users_selected: new_users,
                users: this.state.users.filter(user => user.id != user_add.id),

            }
        )
    }

    loadCompany = (id) => {
        fetch("http://localhost:8000/company/"+id, { method: 'GET' })
            .then(response => response.json())
            .then(datas => {
                
                this.setState({ 
                    id: datas.data.id,
                    name: datas.data.name,
                    cnpj: datas.data.cnpj,
                    address: datas.data.address,
                    users_selected: datas.data.users,
                 })

                let ids_user_edit = datas.data.users.map(function(user) {
                    return user.id;
                });

                 this.handleOpen();
                 this.searchUsers(ids_user_edit);
            })
    }

    createCompany = (company) => {
        fetch("http://localhost:8000/company", {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(company)
        })
        .then(response => response.json())
        .then(datas => {
            if(datas.status === 'success') {
                this.searchCompanies();
            }
        })
    }

    updateCompany = (company) => {
        fetch("http://localhost:8000/company/"+company.id, {
            method: 'PUT',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(company)
        })
        .then(response => response.json())
        .then(datas => {
            if(datas.status === 'success') {
                this.searchCompanies();
            }
        })
    }

    renderTable() {
        return <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Cnpj</th>
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
                                <Button variant="secondary" onClick={() => this.loadCompany(company.id)}>Editar</Button>
                                <Button variant="danger" onClick={() => this.deleteCompany(company.id)}>Excluir</Button>
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

    updateCnpj = (event) => {
        this.setState(
            {
                cnpj: event.target.value
            }
        )
    }

    updateAddress = (event) => {
        this.setState(
            {
                address: event.target.value
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
        let ids_user_save = this.state.users_selected.map(function(user) {
            return user.id;
        });

        if(this.state.id == 0) {
            const company = {
                name: this.state.name,
                cnpj: this.state.cnpj,
                address: this.state.address,
                user_ids: ids_user_save
            };
    
            this.createCompany(company);
        } else {
            const company = {
                id: this.state.id,
                name: this.state.name,
                cnpj: this.state.cnpj,
                address: this.state.address,
                user_ids: ids_user_save
            };
    
            this.updateCompany(company);
        }
        this.handleClose();
    }

    reset = () =>  {
        this.setState(
            {
                id: 0,
                name: '',
                cnpj: '',
                address: '',
                users_ids: []
            }
        )
        this.searchUsers();
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
                                <Form.Label>Cnpj</Form.Label>
                                <Form.Control type="text" placeholder="Preencha o cnpj" value={this.state.cnpj} onChange={this.updateCnpj}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Endereço</Form.Label>
                                <Form.Control type="text" placeholder="Preencha o endereço" value={this.state.address} onChange={this.updateAddress}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicTable">
                                <Form.Label>Usuários</Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Opções</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.users.map((user, index) =>
                                            <tr key={index}>
                                                <td>{user.name}</td>
                                                <td>
                                                    <Button variant="success" onClick={() => this.addUser(user)}>Adicionar</Button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </Table>
                            </Form.Group>
                            
                            <Form.Group className="mb-3" controlId="formBasicTable">
                                <Form.Label>Usuários selecionadas</Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Opções</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.users_selected.map((user, index) =>
                                            <tr key={index}>
                                                <td>{user.name}</td>
                                                <td>
                                                    <Button variant="danger" onClick={() => this.deleteUser(user)}>Remover</Button>
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
                        <Form.Control type="text" placeholder="Buscar" onChange={this.searchCompaniesWithParams}/>

                        <Form.Select aria-label="filter" value={this.state.filter} onChange={this.updateFilter}>
                            <option>Campo</option>
                            <option value="name">Nome</option>
                            <option value="cnpj">Cnpj</option>
                            <option value="address">Endereço</option>
                            <option value="user">Usuário</option>
                        </Form.Select>
                    </Form.Group>
                </Form>

                {this.renderTable()}
            </div>
        )
    }
}

export default Companies;