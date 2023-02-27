import React from "react";
import { Table, Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import { API } from "../constants";

class Companies extends React.Component{

    constructor(props) {
        super(props);

        this.state = {
            id: 0,
            name: '',
            cnpj: '',
            atual_cnpj: '',
            address: '',
            companies: [],
            users_selected: [],
            users: [],
            modalShow: false,
            modalShowRemove: false,
            filter: 'name',
            search: '',
            validated: false,
            validatedName: true,
            validatedCnpj: true,
            validatedCnpjUnique: true,
            validatedCnpjFormat: true,
            validatedAddress: true,
            validatedUser: true,
            dNoneCustom: true
        }
    }

    componentDidMount() {
        this.searchCompanies();
        this.searchUsers();
    }

    searchUsers = (ids_user_edit = null) => {
        fetch(`${API['BASE_URL']}/${API['USER']}`)
            .then(response => response.json())
            .then(datas => {
                let users_filter = datas.data;
                if(ids_user_edit!=null)
                    users_filter = datas.data.filter(item => !ids_user_edit.includes(item.id))

                this.setState({ users: users_filter });
            })
    }

    searchCompanies = () => {
        fetch(`${API['BASE_URL']}/${API['COMPANY']}`)
            .then(response => response.json())
            .then(datas => {
                this.setState({ companies: datas.data });
            })
    }

    searchCompaniesWithParams = (event) => {
        if(event != undefined && 'target' in event)
            this.setState(
                {
                    search: event.target.value
                }
            )

        if(this.state.search === '' || this.state.search === undefined || this.state.search === null || this.state.filter === '' || this.state.filter === undefined || this.state.filter === null)
            this.searchUsers();

        fetch(`${API['BASE_URL']}/${API['COMPANY']}?${this.state.filter}=${this.state.search}`)
            .then(response => response.json())
            .then(datas => {
                let companies;
                (datas.data.length == undefined) ? companies = [datas.data] : companies = datas.data;
                this.setState({ companies: companies })
            })
    }

    deleteCompany = (id) => {
        fetch(`${API['BASE_URL']}/${API['COMPANY']}/${id}`, { method: 'DELETE' })
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
        fetch(`${API['BASE_URL']}/${API['COMPANY']}/${id}`, { method: 'GET' })
            .then(response => response.json())
            .then(datas => {
                
                this.setState({ 
                    id: datas.data.id,
                    name: datas.data.name,
                    cnpj: datas.data.cnpj,
                    atual_cnpj: datas.data.cnpj,
                    address: datas.data.address,
                    users_selected: datas.data.users,
                 })

                let ids_user_edit = datas.data.users.map(function(user) {
                    return user.id;
                });
                this.searchUsers(ids_user_edit);
            });
            this.handleOpen();
    }

    createCompany = (company) => {
        fetch(`${API['BASE_URL']}/${API['COMPANY']}`, {
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
        fetch(`${API['BASE_URL']}/${API['COMPANY']}/${this.state.id}`, {
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
                            <td className="d-flex justify-content-center">
                                <Button variant="secondary" onClick={() => this.loadCompany(company.id)}>Editar</Button>
                                <Button variant="danger" onClick={() => this.handleOpenRemove(company.id)} className="ms-2">Excluir</Button>
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
        let cnpjValue = event.target.value;

        cnpjValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

        this.setState(
            {
                cnpj: cnpjValue
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
        this.searchCompaniesWithParams();
    }

    submit = () => {
        const fields_validations = [
            {
                name: 'name',
                validatedKey: 'validatedName'
            },
            {
                name: 'cnpj',
                validatedKey: 'validatedCnpj',
                validatedKeyUnique: 'validatedCnpjUnique',
                validatedKeyFormat: 'validatedCnpjFormat'
            },
            {
                name: 'address',
                validatedKey: 'validatedAddress',
            },
            {
                name: 'users_selected',
                validatedKey: 'validatedUser'
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

            if(field.name === 'cnpj') {
                const element = this.state.companies.find(objeto => objeto.cnpj === this.state[field.name]);
                
                //const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                /*if(!regex.test(this.state.cnpj))
                    this.setState(
                    {
                        validated: false,
                        validatedCnpjFormat: false
                    });
                if(regex.test(this.state.cnpj))
                    this.setState(
                    {
                        validated: false,
                        validatedCnpjFormat: true
                    });*/

                if(element && element.cnpj == this.state.cnpj && this.state.cnpj != this.state['atual_cnpj']) {
                    this.setState(
                        {
                            validated: false,
                            validatedCnpjUnique: false
                        });
                } else {
                    this.setState(
                    {
                        validated: false,
                        validatedCnpjUnique: true
                    });
                }
            }

        });

        let fields_flag = true;

        fields_validations.map((field) => {
            if(this.state[field.name].length == 0) {
                fields_flag = false;
            }

            if(field.name === 'cnpj') {
                /*const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if(!regex.test(this.state.cnpj))
                    fields_flag = false;*/

                const element = this.state.companies.find(objeto => objeto.cnpj === this.state[field.name]);

                if(element && element.cnpj == this.state.cnpj && this.state.cnpj != this.state['atual_cnpj']) {
                    fields_flag = false;
                }
            }
        });


        if(!fields_flag)
            return;



        let ids_user_save = this.state.users_selected.map(function(user) {
            return user.id;
        });


        if(this.state.id == 0) {
            const company = {
                name: this.state.name,
                cnpj: this.state.cnpj,
                address: this.state.address,
                user_ids: ids_user_save,
            };

            this.createCompany(company);
            
        } else {

            const company = {
                name: this.state.name,
                cnpj: this.state.cnpj,
                address: this.state.address,
                user_ids: ids_user_save
            };
    
            this.updateCompany(company);
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
                cnpj: '',
                address: '',
                users_ids: [],
                users_selected: [],
                validated: false,
                validatedName: true,
                validatedCnpj: true,
                validatedCnpjUnique: true,
                validatedAddress: true,
                validatedUser: true,
                dNoneCustom: true
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
        this.deleteCompany(this.state.id);
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
                    <Modal.Title>Dados da empresa</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={this.state.validated}>
                            <Form.Group className="mb-3" controlId="formBasicId">
                                <Form.Label>Id</Form.Label>
                                <Form.Control type="text" value={this.state.id} readOnly={true} disabled={true}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" placeholder="Preencha o nome" value={this.state.name} onChange={this.updateName}/>
                                {
                                    !this.state.validatedName ?<div type="invalid" className="invalid-feedback-custom">O campo nome é obrigatório.</div> : ''
                                }
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Cnpj</Form.Label>
                                <Form.Control type="text" placeholder="Preencha o cnpj" value={this.state.cnpj} onChange={this.updateCnpj}/>
                                {
                                    !this.state.validatedCnpj ?<div type="invalid" className="invalid-feedback-custom">O campo cnpj é obrigatório.</div> : ''
                                }
                                 {
                                    !this.state.validatedCnpjUnique ?<div type="invalid" className="invalid-feedback-custom">Este cnpj já está cadastrado.</div> : ''
                                }
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Endereço</Form.Label>
                                <Form.Control type="text" placeholder="Preencha o endereço" value={this.state.address} onChange={this.updateAddress}/>
                                {
                                    !this.state.validatedAddress ?<div type="invalid" className="invalid-feedback-custom">O campo nome é obrigatório.</div> : ''
                                }
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicTable">
                                <Form.Label>Usuários</Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>E-mail</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.users.map((user, index) =>
                                            <tr key={index}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <Button variant="success" onClick={() => this.addUser(user)}>Adicionar</Button>
                                                </td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </Table>
                            </Form.Group>

                            {
                                !this.state.validatedUser ? <div type="invalid" className="invalid-feedback-custom mb-2">O campo usuários é obrigatório.</div> : ''
                            }
                            
                            <Form.Group className="mb-3" controlId="formBasicTable">
                                <Form.Label>Usuários selecionadas</Form.Label>
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>E-mail</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        this.state.users_selected.map((user, index) =>
                                            <tr key={index}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
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
                                        <Form.Control type="text" placeholder="Buscar" value={this.state.search} onChange={this.searchCompaniesWithParams}/>
                                    </Col>
                                    <Col>
                                        <Form.Select aria-label="filter" value={this.state.filter} onChange={this.updateFilter}>
                                            <option value="name">Campo</option>
                                            <option value="name">Nome</option>
                                            <option value="cnpj">Cnpj</option>
                                            <option value="address">Endereço</option>
                                            <option value="user">Usuário</option>
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

export default Companies;