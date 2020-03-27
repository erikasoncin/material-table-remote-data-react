import React, {useEffect, Component} from 'react';
import MaterialTable from 'material-table';
import axios from 'axios'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { red, pink } from '@material-ui/core/colors';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';
import { Input, Label, Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Container} from 'reactstrap';
import AddBox from '@material-ui/icons/AddBox';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

class MaterialTableDemo extends Component{
    
    tableRef = React.createRef();

    constructor(props) {
        super(props);
        this.theme = createMuiTheme({
          palette: {
            primary: {
              main: '#4caf50',
            }
          },
    
        });
      }

    state = {
        data:[
            {
                selfUrl: "",
                title: "",
                books: []
            }
        ],
        newBookModal: false,
        columns: [
            { title: 'Id', field: 'selfUrl', editable: 'never'},
            { title: 'Title', field: 'title'},
            { title: 'Books', field: 'books' }
          ],
    }

    componentDidMount(){
        this.refreshData();
    }

    deleteBook(idCollection, idBook){
        console.log("ok")
        axios.delete('https://localhost:5001/api/v1/collections/'+idCollection+'/books/'+idBook)
        .then((response)=>{
            this.refreshData();
        });
    }

    addBook(){
        console.log("funziona");
        let {books} = this.state.data;
        //console.log(id)
        axios.put('https://localhost:5001/api/v1/collections/'+this.state.data.selfUrl+'/books/'+books).then((response) =>{
            this.refreshData();

            this.setState({books,
                newBookModal: false, data: {books:''}
            })
        })
    }

    refreshData(){
        axios.get("https://localhost:5001/api/v1/collections")
        .then(response => {
        let data = [];
        response.data.forEach(el => {
            data.push({
            selfUrl: el.selfUrl.substr(42, 24),
            title: el.title,
            books: el.books.map(book => {
                let idBook = book.substr(36, 24);  
                return (
                    <div>
                            {idBook}
                        <IconButton aria-label="delete" onClick={this.deleteBook.bind(this, el.selfUrl.substr(42, 24), idBook)}>
                            <DeleteIcon style={{ color: red[900] }}/>
                        </IconButton>
                    </div> 
                   )
                }),
        });
    });
    this.setState({ data: data });
    })
    .catch(function(error) {
        console.log(error);
    });
    };


    editCollectionModal(selfUrl ){
        this.setState({
            data:{selfUrl}, newBookModal: ! this.state.newBookModal
        })

    }

    render(){

    return (
        <Container fixed="true">
        <MuiThemeProvider theme={this.theme}>
        <MaterialTable
         actions={[
            {
                icon: () => <AddBox />,
                tooltip: 'Add a Book',
                onClick: (event, rowData) => {
                    console.log(rowData.selfUrl);
                    this.editCollectionModal(rowData.selfUrl);
                }
              }
        ]}
        icons={{Add: () => <IconButton aria-label="add">
                            <AddCircleRoundedIcon style={{ color: pink[500] }} fontSize="large"/>
                            </IconButton>}}
        tableRef={this.tableRef}
        title="Collections"
        columns={this.state.columns}
        
        options={{
            paging: false,
            actionsColumnIndex: -1,
            headerStyle: {
                backgroundColor: '#ec407a',
                color: '#FFF',
                fontWeight: 'bold'
                
              }
            }}

            data={this.state.data}

        editable={{
            onRowAdd: newData =>
            new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                    const data = [...this.state.data];
        
                    data.push(newData);
                    axios
                        .post("https://localhost:5001/api/v1/collections/", newData)
                        .then(res => console.log(res.data));
                        this.setState({ ...this.state, data });
                    }, 600);
                    
                    this.refreshData();
            }),
            onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
                setTimeout(() => {
                resolve();
                const data = [...this.state.data];

                //index of row
                const index = oldData.tableData.id;
                data[data.indexOf(oldData)] = newData;
                axios
                    .put("https://localhost:5001/api/v1/collections/"+this.state.data[index].selfUrl, 
                        newData
                    )
                    .then(res => console.log(res.data));
                    this.setState({ ...this.state, data });
            }, 600);
            }),
            onRowDelete: oldData =>
            new Promise(resolve => {
                setTimeout(() => {
                resolve();
                const data = [...this.state.data];
                //index of row 
                const index = oldData.tableData.id;
                console.log(index)
                data.splice(data.indexOf(oldData), 1);
            
                axios
                    .delete("https://localhost:5001/api/v1/collections/"+this.state.data[index].selfUrl)
                    .then(res => console.log(res.data));
                    this.setState({ ...this.state, data });
            }, 600);
            }),
        }}
        />
                <Modal isOpen={this.state.newBookModal} toggle={this.editCollectionModal.bind(this)}>
                    <ModalHeader toggle={this.editCollectionModal.bind(this)}>Add a new book</ModalHeader>
                    <ModalBody>
            
                    <FormGroup>
                        <Label for="title">Book</Label>
                        <Input id="title" value={this.state.data.books} onChange={(e)=>{
                            let { data} = this.state;
                            data.books = e.target.value;
                            this.setState({data})
                        }}/>
                    </FormGroup>
            
                    </ModalBody>
                    <ModalFooter>
                    <Button color="primary" onClick={this.addBook.bind(this)}>Add a Book</Button>{' '}
                    <Button color="secondary" onClick={this.editCollectionModal.bind(this)}>Cancel</Button>
                    </ModalFooter>
                </Modal>
        </MuiThemeProvider>
        </Container>
    );
}
}

export default MaterialTableDemo