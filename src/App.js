import React, { Component } from 'react';
import list from './list';
import { Grid, Row, FormGroup } from 'react-bootstrap';
import {DEFAULT_QUERY, DEFAULT_PAGE, DEFAULT_HPP, PATH_BASE, PATH_SEARCH, PARAM_SEARCH, PARAM_PAGE, PARAM_HPP} from './constants/index';
import  PropTypes from 'prop-types';


const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
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
      results : null,
      searchKey : '',
      searchTerm: DEFAULT_QUERY
    }

    // bind the functions to this (app component)
    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.loadData = this.loadData.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

checkTopStoriesSearchTerm(searchTerm){
  return !this.state.results[searchTerm];
}

loadData(result){
  const {hits,page} = result;
  const {results, searchKey} = this.state;
  // const oldHits = page!==0 ? this.state.result.hits : [];
  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

  const updatedHits = [...oldHits, ...hits];
  console.log("New hits are : ",updatedHits);
  this.setState({ results: { ...results, [searchKey]: {hits: updatedHits, page} } });
}


fetchData(searchTerm,page){
  fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
  .then(response => response.json())
  .then(result => this.loadData(result))
  .catch(e => e)
}

componentDidMount(){
  const {searchTerm} = this.state;
  this.setState({searchKey : searchTerm});
  this.fetchData(searchTerm, DEFAULT_PAGE);
}

onSubmit(event){
  const {searchTerm} = this.state;
  this.setState({searchKey : searchTerm});
  if(this.checkTopStoriesSearchTerm(searchTerm)){
      this.fetchData(searchTerm, DEFAULT_PAGE);
  }

  event.preventDefault();
}

 // lets rewrite removeItem function in ES6
 removeItem(id){
   const {results, searchKey} = this.state;
   const {hits,page} = results[searchKey];
  // const isNotId = item => item.objectID !== id;
  const updatedList = hits.filter(item => item.objectID !== id);
  this.setState({results:{...results, [searchKey]:{hits: updatedList, page}} });
 }

 // get input field value from search form
 searchValue(event){
  // console.log(event)
  this.setState({ searchTerm: event.target.value });
 }

  render() {

    const { results, searchTerm, searchKey } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page)||0;
    const list = (results && results[searchKey] && results[searchKey].hits) || [];
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
        <Grid>
          <Row>
            <Table
                list={ list }
                searchTerm={ searchTerm }
                removeItem={ this.removeItem }
              />

            <div className="text-center alert">
              <Button
                className="btn btn-success"
                onClick={()=>this.fetchData(searchTerm, page+1)}>
                Load More
              </Button>
            </div>
          </Row>
        </Grid>


      </div>
    );
  }
}


class Search extends Component {
  componentDidMount(){
    // var ele = this.refs.ref1;
    // ele.focus();
    this.input.focus();
  }
  render(){
  const { onChange, value, children, onSubmit } = this.props;

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
            ref = {(node) => {this.input = node}}
          />

          <span className="input-group-btn">
            <Button
              className="btn btn-primary searchBtn"
              type="submit"
              // onSubmit={onSubmit}
            >
              Search
            </Button>
          </span>

          </div>

          </FormGroup>
        </form>
      )
  }
}


const Table = ({ list, searchTerm, removeItem }) => {
  return(
      <div className="col-sm-10 col-sm-offset-1">
        {
            // list.filter( isSearched(searchTerm) ).map(item =>
            list.map(item =>
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

//explicit propTypes
Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author:  PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points:  PropTypes.number
    })
  ).isRequired,
  removeItem: PropTypes.func.isRequired,
}

const Button = ({ onClick, children, className='' }) =>
  <button
    className={ className }
    onClick={ onClick } >
    { children }
  </button>

// PropTypes are used to validate props which are passed from parents to children
// makes code less prone to error
Button.propTypes = {
  onClick : PropTypes.func.isRequired,
  className : PropTypes.string,
  children : PropTypes.node.isRequired
}

//the PropType check will happen only when the default props is evaluated once
Button.defaultProps = {
  className : ''
}

export default App;
