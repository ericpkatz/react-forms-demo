import React, { Component} from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';
import axios from 'axios';



const root = document.getElementById('root');

class App extends Component{
  constructor(props){
    super();
    this.state = { products: [] }
    this.createProduct = this.createProduct.bind(this);
  }
  createProduct(product){
    axios.post('/api/products', product)
      .then( ()=> axios.get('/api/products'))
      .then( response => response.data)
      .then( products => this.setState( { products }));
  }
  componentDidMount(){
    axios.get('/api/products')
    .then(response => response.data)
    .then( products => this.setState( { products }));
  }
  render(){
    const { products } = this.state;
    return (
      <div className='container'>
        <ul className='nav nav-tabs'>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/products'>Products</Link>
          </li>
          <li>
            <Link to='/products/add'>Add A Product</Link>
          </li>
        </ul>
        { React.cloneElement(this.props.children, { products, createProduct: this.createProduct }) }
      </div> 
    );
  }
}

const Home = ({ products })=> <div className='well'>We have { products.length } Products</div>;
const Products = ({ products })=> {
  return (
    <div className='well'>
      <ul>
        { products.map( product => <li key={ product.id }>{ product.name }</li>) }
      </ul>
    </div>
  );
};

class ProductForm extends Component {
  constructor(){
    super();
    this.state = {name: ''};
    this.handleNameChange = this.handleNameChange.bind(this);
    this.onSaveProduct = this.onSaveProduct.bind(this);
  }
  handleNameChange(e){
    this.setState({ name: e.target.value });
  }
  onSaveProduct(e){
    e.preventDefault();
    this.props.createProduct(this.state);
    this.setState({ name: '' });
    this.props.router.push('/products');
  }
  render(){
    return (
      <form onSubmit={ this.onSaveProduct }>
        <div className='form-group'>
          <label>Name</label>
          <input className='form-control' value={this.state.name} name='name' onChange={ this.handleNameChange }/>
        </div>
        <button className='btn btn-primary'>Create</button>
      </form>
    );
  }
}

const routes = (
  <Router history={ hashHistory }>
    <Route path='/' component={ App }>
      <IndexRoute component={ Home } />
      <Route path='/products' component= { Products } />
      <Route path='/products/add' component= { ProductForm } />
    </Route>
  </Router>
);


render(routes, root);
