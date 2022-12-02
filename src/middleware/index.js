import React from "react";
import { Route, Redirect } from "react-router-dom";

const NonAuthmiddleware = ({ component: Component, layout: Layout }) => (
  <Route
    render={props => {
      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
  />
);

const Authmiddleware = ({
  component: Component,
  layout: Layout,
  isAuthenticate,
  ...rest
}) => (
  <Route
    render={props => {
      if (isAuthenticate === false) {
        return (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        );
      }

      if (isAuthenticate === "") {
        return null;
      }

      return (
        <Layout>
          <Component {...props} />
        </Layout>
      );
    }}
    {...rest}
  />
);

export { NonAuthmiddleware, Authmiddleware };
