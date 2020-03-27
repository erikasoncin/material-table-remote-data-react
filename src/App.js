import React, {Component} from 'react'
import Navbar from './components/Navbar'
import Books from './components/TestTableBooks'
import Test from './components/Books'
import Test2 from './components/TestTableCollections'
import Collections from './components/Collections'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route} from 'react-router-dom'

class App extends Component {
   render(){
     return(
     <BrowserRouter>
      <div className="App">
        <Navbar />
        <Route exact path="/" component={Test} />
       <Route path="/collections" component={Collections} /> 
       <Route path="/books" component={Test} /> 
       <Route path="/test" component={Books} /> 
       <Route path="/test2" component={Test2} /> 
      </div>
     </BrowserRouter>
     )
   }
  }
  export default App