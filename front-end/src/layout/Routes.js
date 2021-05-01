import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationForm from "../dashboard/ReservationForm";
import TablesForm from "../dashboard/TablesForm";
import Seating from "../dashboard/Seating";
import FindByMobile from "../dashboard/FindByMobile";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
export default function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationForm type="Create a new"/>
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route path="/tables/new">
        <TablesForm />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Seating />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationForm type="Edit"/>
      </Route>
      <Route path="/search">
        <FindByMobile />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
