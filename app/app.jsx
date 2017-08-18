import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Router, IndexRoute, hashHistory} from 'react-router';
import Admission from 'Admission';

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Admission}>
     <Route path="/login" component={Admission}/>
     <Route path="/forgot" component={Admission}/>
    </Route>
  </Router>,
  document.getElementById('app')
);
