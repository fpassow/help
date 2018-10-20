
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter,
  Switch,
  Route,
  Link,
  Redirect} from 'react-router-dom';


const helpContent = window.helpContent.slice();

//Create url-safe id's, add them to each help topic, 
//   and initialize a lookup object
const lookup = {};
helpContent.forEach((help)=>{
  const id = encodeURIComponent(help.subject);
  help.id = id;
  lookup[id] = help;
});

//(Shallow) copy of the content array, sorted by subject lines
const sortedContent = helpContent.slice();
sortedContent.sort(
  (a,b)=>{
    if (a.subject < b.subject) return -1;
    if (a.subject > b.subject) return  1;
    return 0;
  }
);

const TableOfContents = () => (
  <ul>
    Contents
    {helpContent.map((page)=>(
      <li><Link to={`/view/${page.id}`}>{page.subject}</Link></li>
    ))}
  </ul>
)

const AlphaList = (props) => {
  return (
    <div>
      A-Z
      {sortedContent.map((page)=>(
        <li><Link to={`/view/${page.id}`}>{page.subject}</Link></li>
      ))}
    </div>
  );
}

const Search = (props) => {
  let matches = [];
  let searchexpr = '';
  if (props.match.params.searchExpr) {
    searchexpr = decodeURIComponent(props.match.params.searchExpr);
    matches = helpContent.filter(
      (help)=>(help.content.toUpperCase().indexOf(searchexpr.toUpperCase()) > -1)
    );
  }
  return (
    <div>
      <SearchForm searchexpr={searchexpr} />
      <ul>
        {matches.map((help)=>(
          <li><Link to={`/view/${help.id}`}>{help.subject}</Link></li>
        ))}
      </ul>
    </div>
  );
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    //nextsearch is search text being edited in the form field.
    this.state = {
      nextsearch: props.searchexpr,
      redirect:false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    const updateObj = {};
    updateObj[event.target.name] = event.target.value;
    this.setState(updateObj);
  }
  handleSubmit(event) {
    event.preventDefault();
    this.setState({redirect:true});
  }
  render() {
    if (this.state.redirect) {
      this.state.redirect=false;
      return <Redirect to={'/search/'+encodeURIComponent(this.state.nextsearch)} />;
    } else {
      return (
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="nextsearch" value={this.state.nextsearch} onChange={this.handleChange} />
          <input type="submit" value="Search" />
        </form>
      );
    }
  }
}

const View = (props) => {
  const id = props.match.params.id;
  if (id && lookup[id]) {
    const help= lookup[id];
    return (
      <div>
        <h2>{help.subject}</h2>
        <p>{help.content}</p>
      </div>
    );
  } else {
    return <div>Not found</div>;
  }
}

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><Link to='/home'>Home</Link></li>
        <li><Link to='/alpha'>A-Z</Link></li>
        <li><Link to='/search'>Search</Link></li>
      </ul>
    </nav>
  </header>
)

const Main = () => (
  <main>
    <Switch>
      <Route path='/home' component={TableOfContents}/>
      <Route path='/alpha' component={AlphaList}/>
      <Route path='/search/:searchExpr' component={Search}/>
      <Route path='/search' component={Search}/>
      <Route path='/view/:id' component={View}/>
      <Route component={TableOfContents}/>
    </Switch>
  </main>
)

const App = () => (
  <div>
    <Header />
    <Main />
  </div>
)


ReactDOM.render((
  <HashRouter>
    <App />
  </HashRouter>
), document.getElementById('root'))
