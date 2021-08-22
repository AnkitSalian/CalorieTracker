import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import Login from "./components/Login";
import Home from "./components/Home";
import UserProvider from "./context/UserProvider";

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="app-container">
          <div className="route-container">
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/home" component={Home} />
              <Route exact path="/" render={() => <Redirect to="/home" />} />
            </Switch>
          </div>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
