import React, {Component} from 'react'
import axios from 'axios'
import { Input, Label, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup} from 'reactstrap';

class Books extends Component{
    state = {
        books:[],
        newBookData: {
            title: '',
            isbn: ''
        },
        editBookData: {
            selfUrl: '',
            title: '',
            isbn: ''
        },
        detailsBookData: {
            id: '',
            title: '',
            isbn: ''
        },
        newbookModal: false,
        editbookModal: false,
        detailsbookModal: false
    }

    componentDidMount(){
        this._refreshBooks();
    }

    toggleNewBookModal(){
        this.setState({
            newbookModal: ! this.state.newbookModal
        })
    }

    toggleEditBookModal(){
        this.setState({
            editbookModal: ! this.state.editbookModal
        })
    }

    toggleDetailsBookModal(){
        this.setState({
            detailsbookModal: ! this.state.detailsbookModal
        })
    }

    addBook(){
        axios.post('https://localhost:5001/api/v1/books', this.state.newBookData)
        .then((response)=>{
           let { books } = this.state;

           books.push(response.data);
           this._refreshBooks();
           this.setState({books, newBookModal: false, newBookData: {
            title: '',
            isbn: ''
            } });
        })
    }

    updateBook(){
        let {title, isbn} = this.state.editBookData;
        axios.put('https://localhost:5001/api/v1/books/' + this.state.editBookData.selfUrl, {
            title, isbn
        }).then((response) =>{
            this._refreshBooks();
            
            this.setState({
                editbookModal: false, editBookData: {selfUrl: '', title:'',isbn:''}
            })
        })
    }

    editBook(selfUrl, title, isbn){
        this.setState({
            editBookData: {selfUrl, title, isbn}, editbookModal: ! this.state.editbookModal
        })
    }

    detailsBook(id){
        axios.get('https://localhost:5001/api/v1/books/'+id)
        .then((response)=>{
            console.log(response.data);
            this.setState({
                detailsBookData: response.data,
                detailsbookModal: ! this.state.detailsbookModal
            })
        });
    }

    deleteBook(id){
        axios.delete('https://localhost:5001/api/v1/books/'+id)
        .then((response)=>{
            this._refreshBooks();
        });
    }

    _refreshBooks(){
        axios.get('https://localhost:5001/api/v1/books')
        .then((response)=>{
            this.setState({
                books: response.data
            })
        })
    }


    render(){
        let books = this.state.books.map((book)=>{
            let id = book.selfUrl.substr(36, 24);
            return(
        <tr key={book.id}>
        <th scope="row"></th>
        <td>{id}</td>
        <td>{book.title}</td>
        <td>{book.isbn}</td>
        <td> 
            <Button color="primary" size="sm" className="mr-2" onClick={this.detailsBook.bind(this, id)} >Details</Button>
            <Button color="success" size="sm" className="mr-2" onClick={this.editBook.bind(this, id,book.title, book.isbn)}>Edit</Button>
            <Button color="danger" size="sm" onClick={this.deleteBook.bind(this, id)}>Delete</Button>
        </td>
    </tr>
    )
    })
    return (
        <div className="app container">

        <h1> Books </h1>

        <Button className="my-3" color="primary" onClick={this.toggleNewBookModal.bind(this)}>Add a Book</Button>

        {/* add a new book */}
        <Modal isOpen={this.state.newbookModal} toggle={this.toggleNewBookModal.bind(this)}>
            <ModalHeader toggle={this.toggleNewBookModal.bind(this)}>Add a new book</ModalHeader>
            <ModalBody>

            <FormGroup>
                <Label for="title">Title</Label>
                <Input id="title" value={this.state.newBookData.title} onChange={(e)=>{
                    let { newBookData} = this.state;
                    newBookData.title = e.target.value;
                    this.setState({newBookData})
                }}/>
            </FormGroup>

            <FormGroup>
                <Label for="isbn">ISBN</Label>
                <Input id="isbn" value={this.state.newBookData.isbn} onChange={(e)=>{
                    let { newBookData} = this.state;
                    newBookData.isbn = e.target.value;
                    this.setState({newBookData})}}/>
            </FormGroup>

            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={this.addBook.bind(this)}>Add Book</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewBookModal.bind(this)}>Cancel</Button>
            </ModalFooter>
        </Modal>


        {/* edit a book */}
        <Modal isOpen={this.state.editbookModal} toggle={this.toggleEditBookModal.bind(this)}>
            <ModalHeader toggle={this.toggleEditBookModal.bind(this)}>Edit a new book</ModalHeader>
            <ModalBody>

            <FormGroup>
                <Label for="title">Title</Label>
                <Input id="title" value={this.state.editBookData.title} onChange={(e)=>{
                    let { editBookData} = this.state;
                    editBookData.title = e.target.value;
                    this.setState({editBookData})
                }}/>
            </FormGroup>

            <FormGroup>
                <Label for="isbn">ISBN</Label>
                <Input id="isbn" value={this.state.editBookData.isbn} onChange={(e)=>{
                    let { editBookData} = this.state;
                    editBookData.isbn = e.target.value;
                    this.setState({editBookData})}}/>
            </FormGroup>

            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={this.updateBook.bind(this)}>Edit Book</Button>{' '}
            <Button color="secondary" onClick={this.toggleEditBookModal.bind(this)}>Cancel</Button>
            </ModalFooter>
        </Modal>

        {/* details a book */}
        <Modal isOpen={this.state.detailsbookModal} toggle={this.toggleDetailsBookModal.bind(this)}>
            <ModalHeader toggle={this.toggleDetailsBookModal.bind(this)}>Details</ModalHeader>
            <ModalBody>

            <FormGroup>
                <Label for="title">Title</Label>
                <p>{this.state.detailsBookData.title}
                    </p>
            </FormGroup>

            <FormGroup>
                <Label for="isbn">ISBN</Label>
                <p>{this.state.detailsBookData.isbn}
                    </p>
            </FormGroup>

            </ModalBody>
            <ModalFooter>
            <Button color="secondary" onClick={this.toggleDetailsBookModal.bind(this)}>Cancel</Button>
            </ModalFooter>
        </Modal>

        <Table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Title</th>
                    <th>ISBN</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
               {books}
                </tbody>
        </Table>
        </div>
    )
    }
}

export default Books