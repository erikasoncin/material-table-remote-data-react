import React, {useEffect} from 'react';
import MaterialTable from 'material-table';
import axios from 'axios'
import { Container } from 'reactstrap';

export default function MaterialTableDemo() {
    
  const [entries, setEntries] = React.useState({
      data:[
          {
              selfUrl: "",
              title: "",
              isbn: ""
          }
      ],
    });
    const [state] = React.useState({
    columns: [
      { title: 'Id', field: 'selfUrl', editable: 'never'},
      { title: 'Title', field: 'title'},
      { title: 'ISBN', field: 'isbn'}
    ],
  });


    useEffect(() => {
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
    setEntries({ data: data });
    })
    .catch(function(error) {
        console.log(error);
    });
    }, []);

  return (
      <Container fixed="true">
    <MaterialTable
      tableRef={React.createRef()}
      title="Books"
      columns={state.columns}
      options={{
          paging: false,
          actionsColumnIndex: -1
        }}

        data={entries.data}

    editable={{
        

        onRowAdd: newData =>
        new Promise(resolve => {
            setTimeout(() => {
                resolve();
                const data = [...entries.data];
    
                data.push(newData);
                axios
                    .post("https://localhost:5001/api/v1/books/", newData)
                    .then(res => console.log(res.data));
                    //this.tableRef.current.onQueryChange();
                setEntries({ ...entries, data });
            }, 600);
            
        }),
        onRowUpdate: (newData, oldData) =>
        new Promise(resolve => {
            setTimeout(() => {
            resolve();
            const data = [...entries.data];

            //index of row
            const index = oldData.tableData.id;
            data[data.indexOf(oldData)] = newData;
            axios
                .put("https://localhost:5001/api/v1/books/"+entries.data[index].selfUrl, 
                    newData
                )
                .then(res => console.log(res.data));
            setEntries({ ...entries, data });
        }, 600);
        }),
        onRowDelete: oldData =>
        new Promise(resolve => {
            setTimeout(() => {
            resolve();
            const data = [...entries.data];
            //index of row 
            const index = oldData.tableData.id;
            console.log(index)
            data.splice(data.indexOf(oldData), 1);
           
            axios
                .delete("https://localhost:5001/api/v1/books/"+entries.data[index].selfUrl)
                .then(res => console.log(res.data));
            setEntries({ ...entries, data });
        }, 600);
        }),
    }}
    />
    </Container>
  );
}
