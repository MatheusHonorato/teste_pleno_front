import React from "react";
import { Table, Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import { API } from "../constants";

class Users extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            name: '',
            email: '',
            phone: '',
            date: '',
            city: '',
            users: [],
            selected_companies: [],
            companies: [],
            modalShow: false,
            modalShowRemove: false,
            filter: 'name',
            search: '',
            validated: false,
            validatedName: true,
            validatedEmail: true,
            validatedEmailUnique: true,
            validatedEmailFormat: true,
            validatedPhone: true,
            validatedDate: true,
            validatedCity: true,
            validatedCompany: true,
            dNoneCustom: true
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
        if(event != undefined && 'target' in event)
            this.setState(
                {
                    search: event.target.value
                }
            )

        if(this.state.search === '' || this.state.search === undefined || this.state.search === null || this.state.filter === '' || this.state.filter === undefined || this.state.filter === null)
            this.searchUsers();

        fetch(`${API['BASE_URL']}/${API['USER']}?${this.state.filter}=${this.state.search}`)
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
                selected_companies: this.state.selected_companies.filter(company => company.id != company_add.id),
                companies: new_companies

            }
        )
    }

    addCompany = (company_add) => {
        let new_companies = this.state.selected_companies;
        new_companies.push(company_add);

        this.setState(
            {
                selected_companies: new_companies,
                companies: this.state.companies.filter(company => company.id != company_add.id),

            }
        )
    }

    loadUser = (id) => {
        fetch(`${API['BASE_URL']}/${API['USER']}/${id}`, { method: 'GET' })
            .then(response => response.json())
            .then(datas => {
                this.reset();
                this.setState({ 
                    id: datas.data.id,
                    name: datas.data.name,
                    email: datas.data.email,
                    atual_email: datas.data.email,
                    phone: datas.data.phone,
                    date: datas.data.date,
                    city: datas.data.city,
                    selected_companies: datas.data.companies,
                 })

                let ids_company_edit = datas.data.companies.map(function(company) {
                    return company.id;
                });
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
        fetch(`${API['BASE_URL']}/${API['USER']}/${this.state.id}`, {
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
                    <th>Telefone</th>
                    <th>Nascimento</th>
                    <th>Cidade</th>
                </tr>
            </thead>
            <tbody>
                {
                    this.state.users.map((user, index) =>
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.date}</td>
                            <td>{user.city}</td>
                            <td className="d-flex justify-content-center">
                                <Button variant="secondary" onClick={() => this.loadUser(user.id)}>Editar</Button>
                                <Button variant="danger" onClick={() => this.handleOpenRemove(user.id)} className="ms-2">Excluir</Button>
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

    updatePhone = (event) => {
        let phoneValue = event.target.value;

        phoneValue = phoneValue.replace(/\D/g, '');

        phoneValue = phoneValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

        this.setState(
            {
                phone: phoneValue
            }
        )
    }

    updateDate = (event) => {
        this.setState(
            {
                date: event.target.value
            }
        )
    }

    updateCity = (event) => {
        this.setState(
            {
                city: event.target.value
            }
        )
    }

    updateFilter = (event) => {
        this.setState(
            {
                filter: event.target.value
            }
        )
        this.searchUsersWithParams();
    }

    submit = () => {
        const fields_validations = [
            {
                name: 'name',
                validatedKey: 'validatedName'
            },
            {
                name: 'email',
                validatedKey: 'validatedEmail',
                validatedKeyUnique: 'validatedEmailUnique',
                validatedKeyFormat: 'validatedEmailFormat'
            },
            {
                name: 'selected_companies',
                validatedKey: 'validatedCompany'
            }
        ];

        fields_validations.map((field) => {
            if(this.state[field.name].length === 0) {
                this.setState(
                {
                    validated: false,
                    [field.validatedKey]: false
                });
            } else {
                this.setState(
                {
                    validated: false,
                    [field.validatedKey]: true
                });
            }

            if(field.name === 'email') {
                const element = this.state.users.find(objeto => objeto.email === this.state[field.name]);

                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if(!regex.test(this.state.email))
                    this.setState(
                    {
                        validated: false,
                        validatedEmailFormat: false
                    });
                if(regex.test(this.state.email))
                    this.setState(
                    {
                        validated: false,
                        validatedEmailFormat: true
                    });

                if(element && element.email == this.state.email && this.state.email != this.state['atual_email']) {
                    this.setState(
                        {
                            validated: false,
                            validatedEmailUnique: false
                        });
                } else {
                    this.setState(
                    {
                        validated: false,
                        validatedEmailUnique: true
                    });
                }
            }

        });

        let fields_flag = true;

        fields_validations.map((field) => {
            if(this.state[field.name].length == 0) {
                fields_flag = false;
            }

            if(field.name === 'email') {
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if(!regex.test(this.state.email))
                    fields_flag = false;

                const element = this.state.users.find(objeto => objeto.email === this.state[field.name]);

                if(element && element.email == this.state.email && this.state.email != this.state['atual_email']) {
                    fields_flag = false;
                }
            }
        });

        if(!fields_flag)
            return;

        let ids_company_save = this.state.selected_companies.map(function(company) {
            return company.id;
        });

        if(this.state.id == 0) {
            const user = {
                name: this.state.name,
                email: this.state.email,
                phone: this.state.phone,
                date: (this.state.date == '') ? null : this.state.date,
                city: this.state.city,
                company_ids: ids_company_save
            };
    
            this.createUser(user);
        } else {
            const user = {
                name: this.state.name,
                email: this.state.email,
                phone: this.state.phone,
                date: (this.state.date == '') ? null : this.state.date,
                city: this.state.city,
                company_ids: ids_company_save
            };
    
            this.updateUser(user);
        }
        this.handleClose();
        this.setState(
            {
                dNoneCustom: false
            });
        
    }

    reset = () =>  {
        this.setState(
            {
                id: 0,
                name: '',
                email: '',
                atual_email: '',
                phone: '',
                date: '',
                city: '',
                selected_companies: [],
                validated: false,
                validatedName: true,
                validatedEmail: true,
                validatedEmailUnique: true,
                validatedEmailFormat: true,
                validatedPhone: true,
                validatedDate: true,
                validatedCity: true,
                validatedCompany: true,
                dNoneCustom: true
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

    handleCloseRemove = () => {
        this.setState(
            {
                modalShowRemove: false
            }
        )
    }

    handleOpenRemove = (id) => {
        this.setState(
            {
                id: id,
                modalShowRemove: true
            }
        )
    }

    handleSaveRemove = () => {
        this.deleteUser(this.state.id);
        this.setState(
            {
                modalShowRemove: false,
                dNoneCustom: false
            }
        )
        this.handleCloseRemove();
    }

    render() {
        return(
            <div className="component">
                <Modal show={this.state.modalShowRemove} onHide={this.state.modalShowRemove}>
                    <Modal.Header>
                    <Modal.Title>Excluir</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Deseja remover o item?</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseRemove}>
                        Sair
                    </Button>
                    <Button variant="primary" onClick={this.handleSaveRemove}>
                        Confirmar
                    </Button>
                    </Modal.Footer>
                </Modal>
                {
                    (this.state.validated == false && this.state.dNoneCustom == false) ? <Alert key='success' variant='success' show="true">Operação efetuada com sucesso!</Alert> : ''
                }
                
                <Modal show={this.state.modalShow} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Dados do usuário</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={this.state.validated}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" placeholder="Preencha o nome" value={this.state.name} onChange={this.updateName} required/>
                                {
                                    !this.state.validatedName ?<div type="invalid" className="invalid-feedback-custom">O campo nome é obrigatório.</div> : ''
                                }
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>E-mail</Form.Label>
                                <Form.Control type="email" placeholder="Preencha o e-mail" value={this.state.email} onChange={this.updateEmail} required/>
                                {
                                    !this.state.validatedEmail ? <div type="invalid" className="invalid-feedback-custom">O campo e-mail é obrigatório.</div> : ''
                                
                                }
                                {
                                    !this.state.validatedEmailUnique ? <div type="invalid" className="invalid-feedback-custom">O endereço de e-mail já está sendo utilizado.</div> : ''
                                }
                                {
                                    !this.state.validatedEmailFormat ? <div type="invalid" className="invalid-feedback-custom">O valor não é um endereço de e-mail válido.</div> : ''
                                }
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPhone">
                                <Form.Label>Telefone</Form.Label>
                                <Form.Control type="text" placeholder="Preencha o telefone" value={this.state.phone} onChange={this.updatePhone}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicDate">
                                <Form.Label>Data de nascimento</Form.Label>
                                <Form.Control type="date" value={this.state.date} onChange={this.updateDate}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Cidade onde nasceu</Form.Label>
                                <Form.Control type="text" placeholder="Preencha a cidade de nascimento" value={this.state.city} onChange={this.updateCity}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicTable">
                                <Form.Label>Empresas</Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>CNPJ</th>
                                            <th>Endereço</th>
                                            <th></th>
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

                            {
                                !this.state.validatedCompany ? <div type="invalid" className="invalid-feedback-custom mb-2">O campo empresas é obrigatório.</div> : ''
                            }
                            
                            <Form.Group className="mb-3" controlId="formBasicTable">
                                <Form.Label>Empresas selecionadas</Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>CNPJ</th>
                                            <th>Endereço</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.selected_companies.map((company, index) =>
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

                <Row>
                    <Col>
                        <Button variant="warning" type="button" onClick={this.reset}>
                            Novo
                        </Button>
                    </Col>
                    <Col>
                        <Form>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Row>
                                    <Col>
                                        <Form.Control type="text" placeholder="Buscar..." value={this.state.search} onChange={this.searchUsersWithParams}/>
                                    </Col>
                                    <Col>
                                        <Form.Select aria-label="filter" value={this.state.filter} onChange={this.updateFilter}>
                                            <option value="name">Campo</option>
                                            <option value="name">Nome</option>
                                            <option value="email">E-mail</option>
                                            <option value="phone">Telefone</option>
                                            <option value="date">Data</option>
                                            <option value="city">Cidade</option>
                                            <option value="company">Empresa</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>

                {this.renderTable()}
            </div>
        )
    }
}

export default Users;