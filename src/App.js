import { Route, Switch, Redirect } from "react-router-dom";
import React, { Suspense, useContext } from "react";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import Authentication from "./pages/Authentication";
import AuthContext from "./store/auth-context";

const NewQuote = React.lazy(() => import("./pages/NewQoute"));
const AllQoute = React.lazy(() => import("./pages/AllQoutes"));
const QouteDetail = React.lazy(() => import("./pages/QouteDetail"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Suspense
        fallback={
          <div className="centered">
            <LoadingSpinner />
          </div>
        }
      >
        <Switch>
          <Route path="/" exact>
            <Redirect to="/quotes" />
          </Route>
          <Route path="/quotes" exact>
            <AllQoute />
          </Route>
          {!authCtx.userIsLoggedIn && (
            <Route path="/auth">
              <Authentication />
            </Route>
          )}
          <Route path="/quotes/:quoteId">
            <QouteDetail />
          </Route>
          {authCtx.userIsLoggedIn && <Route path="/new-quote">
            <NewQuote />
          </Route>}
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </Suspense>
    </Layout>
  );
}

export default App;
