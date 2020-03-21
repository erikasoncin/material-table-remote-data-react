import React, {Component} from 'react'
import Navbar from './components/Navbar'
import Books from './components/Books'
import Test from './components/test'
import Test2 from './components/test2'
import Collections from './components/Collections'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route} from 'react-router-dom'

class App extends Component {
   render(){
     return(
     <BrowserRouter>
      <div className="App">
        <Navbar />
        <Route exact path="/" component={Books} />
       <Route path="/collections" component={Collections} /> 
       <Route path="/books" component={Books} /> 
       <Route path="/test" component={Test} /> 
       <Route path="/test2" component={Test2} /> 
      </div>
     </BrowserRouter>
     )
   }
  }
  export default App