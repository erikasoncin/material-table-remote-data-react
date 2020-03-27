import React, {Component} from 'react'
import axios from 'axios'
import { Input, Label, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup} from 'reactstrap';
import { green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';

class Collections extends Component{
    state = {
        collections:[],
        newCollectionData: {
            title: '',
        },
        newBookData: {
            id: '',
            books: '',
        },
        editCollectionData: {
            id: '',
            title: '',
            books: []
        },
        detailsCollectionData: {
            id: '',
            title: '',
            books: []
        },
        newCollectionModal: false,
        newBookModal: false,
        editCollectionModal: false,
        detailsCollectionModal: false
    }

    componentDidMount(){
        this._refreshcollections();
    }

    togglenewCollectionModal(){
        this.setState({
            newCollectionModal: ! this.state.newCollectionModal
        })
    }

    editBookModal(id ){
        this.setState({
            newBookData:{id}, newBookModal: ! this.state.newBookModal
        })

    }

    toggleeditCollectionModal(){
        this.setState({
            editCollectionModal: ! this.state.editCollectionModal
        })
    }

    toggledetailsCollectionModal(){
        this.setState({
            detailsCollectionModal: ! this.state.detailsCollectionModal
        })
    }

    addCollection(){
        axios.post('https://localhost:5001/api/v1/collections', this.state.newCollectionData)
        .then((response)=>{
           let { collections } = this.state;

           collections.push(response.data);

           this.setState({collections, newCollectionModal: false, newCollectionData: {
            title: '',
            } });
        })
    }

    addBook(){
        
        let {books} = this.state.newBookData;
        //console.log(id)
        axios.put('https://localhost:5001/api/v1/collections/'+this.state.newBookData.id+'/books/'+books).then((response) =>{
            this._refreshcollections();

            this.setState({books,
                newBookModal: false, newBookData: {id: '', books:''}
            })
        })
    }

    updateCollection(){
        let {title} = this.state.editCollectionData;
        axios.put('https://localhost:5001/api/v1/collections/' + this.state.editCollectionData.id, {
            title
        }).then((response) =>{
            this._refreshcollections();
            
            this.setState({
                editCollectionModal: false, editCollectionData: {id: '', title:''}
            })
        })
    }

    editCollection(id, title){
        this.setState({
            editCollectionData: {id, title}, editCollectionModal: ! this.state.editCollectionModal
        })
    }


    detailsCollection(id){
        axios.get('https://localhost:5001/api/v1/collections/'+id)
        .then((response)=>{
            console.log(response.data);
            this.setState({
                detailsCollectionData: response.data,
                detailsCollectionModal: ! this.state.detailsCollectionModal
            })
        });
    }

    deleteCollection(id){
        axios.delete('https://localhost:5001/api/v1/collections/'+id)
        .then((response)=>{
            this._refreshcollections();
        });
    }

    deleteBook(idCollection, idBook){
        axios.delete('https://localhost:5001/api/v1/collections/'+idCollection+'/books/'+idBook)
        .then((response)=>{
            this._refreshcollections();
        });
    }

    _refreshcollections(){
        axios.get('https://localhost:5001/api/v1/collections')
        .then((response)=>{
            this.setState({
                collections: response.data
            })
        })
    }


    render(){
        let collections = this.state.collections.map((collection)=>{
            let id = collection.selfUrl.substr(42, 24);  
            console.log(collection.books)
            return(
            <tr key={id}>
            <th scope="row"></th>
            <td>{id}</td>
            <td>{collection.title}</td>
            <td>
            {collection.books.map((book) => {
                let idBook = book.substr(36, 24);  
                return (
                    <div>
                            {idBook}
                        <IconButton aria-label="delete" onClick={this.deleteBook.bind(this, id, idBook)}>
                            <DeleteIcon color="secondary"/>
                        </IconButton>
                    </div>
                   )
                })}
                {/* <Button color="primary" size="sm" className="my-2" onClick={this.editBookModal.bind(this, id)} >Add a book</Button> */}
                <IconButton aria-label="add" onClick={this.editBookModal.bind(this, id)}>
                    <AddCircleRoundedIcon style={{ color: green[500] }} fontSize="large"/>
                </IconButton>
                </td>
            <td> 
                <Button color="primary" size="sm" className="mr-2" onClick={this.detailsCollection.bind(this, id)} >Details</Button>
                <Button color="success" size="sm" className="mr-2" onClick={this.editCollection.bind(this, id,collection.title)}>Edit</Button>
                <Button color="danger" size="sm" onClick={this.deleteCollection.bind(this, id)}>Delete</Button>
            </td>
    </tr>
    );
    });
    
    return (
        <div className="app container">

        <h1> Collections </h1>

        <Button className="my-3" color="primary" onClick={this.togglenewCollectionModal.bind(this)}>Add a Collection</Button>

        {/* add a new book */}
        <Modal isOpen={this.state.newBookModal} toggle={this.editBookModal.bind(this)}>
            <ModalHeader toggle={this.editBookModal.bind(this)}>Add a new book</ModalHeader>
            <ModalBody>

            <FormGroup>
                <Label for="title">Book</Label>
                <Input id="title" value={this.state.newBookData.books} onChange={(e)=>{
                    let { newBookData} = this.state;
                    newBookData.books = e.target.value;
                    this.setState({newBookData})
                }}/>
            </FormGroup>

            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={this.addBook.bind(this)}>Add a Book</Button>{' '}
            <Button color="secondary" onClick={this.editBookModal.bind(this)}>Cancel</Button>
            </ModalFooter>
        </Modal>

        {/* add a collection */}
        <Modal isOpen={this.state.newCollectionModal} toggle={this.togglenewCollectionModal.bind(this)}>
            <ModalHeader toggle={this.togglenewCollectionModal.bind(this)}>Add a new collection</ModalHeader>
            <ModalBody>

            <FormGroup>
                <Label for="title">Title</Label>
                <Input id="title" value={this.state.newCollectionData.title} onChange={(e)=>{
                    let { newCollectionData} = this.state;
                    newCollectionData.title = e.target.value;
                    this.setState({newCollectionData})
                }}/>
            </FormGroup>

            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={this.addCollection.bind(this)}>Add Collection</Button>{' '}
            <Button color="secondary" onClick={this.togglenewCollectionModal.bind(this)}>Cancel</Button>
            </ModalFooter>
        </Modal>


        {/* edit a collection */}
        <Modal isOpen={this.state.editCollectionModal} toggle={this.toggleeditCollectionModal.bind(this)}>
            <ModalHeader toggle={this.toggleeditCollectionModal.bind(this)}>Edit collection</ModalHeader>
            <ModalBody>

            <FormGroup>
                <Label for="title">Title</Label>
                <Input id="title" value={this.state.editCollectionData.title} onChange={(e)=>{
                    let { editCollectionData} = this.state;
                    editCollectionData.title = e.target.value;
                    this.setState({editCollectionData})
                }}/>
            </FormGroup>

            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={this.updateCollection.bind(this)}>Edit Collection</Button>{' '}
            <Button color="secondary" onClick={this.toggleeditCollectionModal.bind(this)}>Cancel</Button>
            </ModalFooter>
        </Modal>

        {/* details a book */}
        <Modal isOpen={this.state.detailsCollectionModal} toggle={this.toggledetailsCollectionModal.bind(this)}>
            <ModalHeader toggle={this.toggledetailsCollectionModal.bind(this)}>Details</ModalHeader>
            <ModalBody>

            <FormGroup>
                <Label for="title">Title</Label>
                <p>{this.state.detailsCollectionData.title}
                    </p>
            </FormGroup>

            <FormGroup>
                <Label for="books">Books</Label>
                {this.state.detailsCollectionData.books.map((book) => {
                let idBook = book.substr(36, 24);  
                return (
                    <div>
                            {idBook}
                      
                    </div>
                   )
                })}
            </FormGroup>

            </ModalBody>
            <ModalFooter>
            <Button color="secondary" onClick={this.toggledetailsCollectionModal.bind(this)}>Cancel</Button>
            </ModalFooter>
        </Modal>

        <Table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Books</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
               {collections}
                </tbody>
        </Table>
        </div>
    )
    }
}

export default Collections