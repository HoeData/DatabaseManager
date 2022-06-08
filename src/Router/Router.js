import React from 'react';
import {HashRouter, Route, Switch,hashHistory} from 'react-router-dom';
import LoginPage from '../Pages/LoginPage';
import MainPage from '../Pages/MainPage'
import TestMapPage from '../Pages/TestMapPage'
import TestPage1 from '../Pages/TestPage1'

const Router = () => (
    <HashRouter history={HashRouter}>
        <Switch>
            <Route exact path="/" component={LoginPage}/>
            <Route exact path="/main" component={MainPage}/>
            <Route exact path="/map" component={TestMapPage}/>
            <Route exact path="/test1"  component={TestPage1}/>
        </Switch>
    </HashRouter>
);


export default Router;