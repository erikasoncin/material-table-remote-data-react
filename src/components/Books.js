import React, { Component} from 'react';
import MaterialTable from 'material-table';
import axios from 'axios'
import { Container } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
import { green, purple, deepPurple } from '@material-ui/core/colors';
import AddCircleRoundedIcon from '@material-ui/icons/AddCircleRounded';

class MaterialTableDemo extends Component{
    
    tableRef = React.createRef();

    state = {
        data:[
            {
                selfUrl: "",
                title: "",
                isbn: ""
            }
        ],

        columns: [
            { title: 'Id', field: 'selfUrl', editable: 'never'},
            { title: 'Title', field: 'title'},
            { title: 'ISBN', field: 'isbn'}
          ],
    }

    componentDidMount(){
        this.refreshData();
    }

    _refreshBooks(){
        axios.get('https://localhost:5001/api/v1/books')
        .then((response)=>{
            this.setState({
                data: response.data
            })
        })
    }

    refreshData(){
        axios.get("https://localhost:5001/api/v1/books")
        .then(response => {
        let data = [];
        response.data.forEach(el => {
            data.push({
            selfUrl: el.selfUrl.substr(36, 24),
            title: el.title,
            isbn: el.isbn,
        });
    });
    this.setState({ data: data });
    })
    .catch(function(error) {
        console.log(error);
    });
    };

    render(){

    return (
        <Container fixed="true">
        <MaterialTable
        tableRef={this.tableRef}
        title="Books"
        columns={this.state.columns}
        icons={{Add: () => <IconButton aria-label="add">
        <AddCircleRoundedIcon style={{ color: deepPurple['A200'] }} fontSize="large"/>
        </IconButton>}}
        options={{
            paging: false,
            actionsColumnIndex: -1,
            search: true,
            sorting: true,
            headerStyle: {
                backgroundColor: '#7c4dff',
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
                        .post("https://localhost:5001/api/v1/books/", newData)
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
                    .put("https://localhost:5001/api/v1/books/"+this.state.data[index].selfUrl, 
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
                .delete("https://localhost:5001/api/v1/books/"+this.state.data[index].selfUrl)
                .then(res => console.log(res.data));
                this.setState({ ...this.state, data });
        }, 600);
        }),
        }}
        />
         <button
            onClick={() => {
              this.tableRef.current.onQueryChange();
            }}
          >
            ok
          </button>
        </Container>
    );
    }
}
module.hot.accept();
export default MaterialTableDemo