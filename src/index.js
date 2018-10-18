
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {HashRouter,
  Switch,
  Route,
  Link} from 'react-router-dom';


const helpContent = window.helpContent.slice();

//Create url-safe id's, add them to each help topic, 
//   and initialize a lookup object
const lookup = {};
helpContent.forEach((help)=>{
  const id = encodeURIComponent(help.subject);
  help.id = id;
  lookup[id] = help;
});

//Sort once for the page that displays in alpha order
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

const AlphaList = () => (
  <div>
    A-Z
    {sortedContent.map((page)=>(
      <li><Link to={`/view/${page.id}`}>{page.subject}</Link></li>
    ))}
  </div>
)

const Search = () => (
  <div>
    Search
  </div>
)

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
