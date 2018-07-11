import React, { Component } from 'react';
import list from './list';
import { Grid, Row, FormGroup } from 'react-bootstrap';


const DEFAULT_QUERY = 'react';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);
// filter the results by search
function isSearched(searchTerm){
  return function(item){
    return !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class App extends Component {

  // setting up internal component state
  // ES6 class can use constructor to initialize internal state
  constructor(props){
    // super props sets this.props to the constructor
    super(props);

    // setting up state
    this.state = {
      result : null,
      searchTerm: DEFAULT_QUERY
    }

    // bind the functions to this (app component)
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.loadData = this.loadData.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

loadData(result){
  this.setState({ result : result });
}


fetchData(searchTerm){
  fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
  .then(response => response.json())
  .then(result => this.loadData(result))
  .catch(e => e)
}

componentDidMount(){
  this.fetchData(this.state.searchTerm);
}

onSubmit(event){
  this.fetchData(this.state.searchTerm);
  event.preventDefault();
}

 // lets rewrite removeItem function in ES6
 removeItem(id){
   const {result} = this.state;
  // const isNotId = item => item.objectID !== id;
  const updatedList = result.hits.filter(item => item.objectID !== id);
  this.setState({result:{...result, hits: updatedList} });
 }

 // get input field value from search form
 searchValue(event){
  // console.log(event)
  this.setState({ searchTerm: event.target.value });
 }

  render() {

    const { result, searchTerm } = this.state;

    // if(!result){return null;}

    console.log(this);

    return (
      <div>

        <Grid fluid>
          <Row>
            <div className="jumbotron text-center">

            <Search
              onChange={ this.searchValue }
              value={ searchTerm }
              onSubmit={this.onSubmit}
            >NEWSAPP</Search>

            </div>
          </Row>
        </Grid>
        { result &&
          <Table
            list={ result.hits }
            searchTerm={ searchTerm }
            removeItem={ this.removeItem }
          />
        }


      </div>
    );
  }
}


const Search = ({ onChange, value, children, onSubmit }) => {
  return(
      <form onSubmit={onSubmit}>
      <FormGroup>

        <h1 style={{ fontWeight: 'bold' }}>{ children }</h1>
        <hr style={{ border: '2px solid black', width: '100px' }} />

        <div className="input-group">

        <input
          className="form-control width100 searchForm"
          type="text"
          onChange={ onChange }
          value={ value }

        />

        <span className="input-group-btn">
          <button
            className="btn btn-primary searchBtn"
            type="submit"
            // onSubmit={onSubmit}
          >
            Search
          </button>
        </span>

        </div>

        </FormGroup>
      </form>
    )
}


const Table = ({ list, searchTerm, removeItem }) => {
  return(
      <div className="col-sm-10 col-sm-offset-1">
        {
            list.filter( isSearched(searchTerm) ).map(item =>
              <div key={ item.objectID }>
                <h1>
                  <a href={ item.url }>
                    { item.title }</a>
                </h1>
                <h4>

                  { item.author } | { item.num_comments } Comments | { item.points } Points

                <Button
                  className="btn btn-xs"
                  type="button"
                  onClick={ () => removeItem(item.objectID) }>
                    Remove
                </Button>

                </h4> <hr />

              </div>
            )
          }
      </div>
    )
}


const Button = ({ onClick, children, className='' }) =>
  <button
    className={ className }
    onClick={ onClick } >
    { children }
  </button>




export default App;
