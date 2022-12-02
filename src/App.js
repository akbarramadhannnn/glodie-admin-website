import React, { useEffect, useMemo } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./routes/";

// layouts
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

import { loadAuthAction } from "./store/auth/actions";

import { Authmiddleware, NonAuthmiddleware } from "./middleware";

// Import scss
import "./assets/scss/theme.scss";

const App = () => {
  const dispatch = useDispatch();
  const selectorLayout = useSelector(({ Layout }) => Layout);
  const selectorAuth = useSelector(({ Auth }) => Auth);

  useEffect(() => {
    console.log(process.env.REACT_APP_ENV)
    dispatch(loadAuthAction());
  }, [dispatch]);

  const Layout = useMemo(() => {
    let layoutCls = VerticalLayout;
    switch (selectorLayout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  }, [selectorLayout]);

  if (selectorAuth.isAuth === "") {
    return null;
  }

  return (
    <React.Fragment>
      <Router>
        <Switch>
          {publicRoutes.map((route, idx) => (
            <NonAuthmiddleware
              path={route.path}
              layout={NonAuthLayout}
              component={route.component}
              key={idx}
            />
          ))}

          {authProtectedRoutes.map((route, idx) => (
            <Authmiddleware
              path={route.path}
              layout={Layout}
              component={route.component}
              key={idx}
              isAuthenticate={selectorAuth.isAuth}
              exact
            />
          ))}
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default App;
