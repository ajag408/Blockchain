import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Home from "./home/home.component";
import Block from "./block/block.component";
import Transaction from "./transaction/transaction.component";
import Account from "./account/account.component";

const Main = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/block/:blockid" component={Block} />
      <Route exact path="/transaction/:transactionid" component={Transaction} />
      <Route exact path="/account" component={Account} />
      {/* <Route exact path="/signup-student" component={CreateStudent} />
    <Route exact path="/signup-company" component={CreateCompany} />
    <Route exact path="/company-signin" component={CompanySignin} />
    <Route exact path="/student-signin" component={StudentSignin} />
    <Route exact path="/company/landing" component={CompanyJobPosting} />
    <Route exact path="/company/profile" component={CompanyProfile} />
    <Route exact path="/company/students" component={CompanyStudentsTab} />
    <Route exact path="/company/events" component={MakeEvents} />
    <Route exact path="/student/landing" component={JobSearch} />
    <Route exact path="/student/profile" component={StudentProfile} />
    <Route exact path="/student/applications" component={Applications} />
    <Route exact path="/student/events" component={ViewEvents} />
    <Route exact path="/student/students" component={StudentSearch} />
    <Route exact path="/company/student/:id" component={ViewStudentProfileFromCompany} />
    <Route exact path="/student/:id" component={ViewStudentProfileFromStudent} />
    <Route exact path="/company/:id" component={ViewCompanyProfile} />
    */}
      <Route render={() => <Redirect to={{ pathname: "/" }} />} />
    </Switch>
  </BrowserRouter>
);

export default Main;
