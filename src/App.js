import {Route, Switch, Redirect} from 'react-router-dom'
import AllQoute from './pages/AllQoutes';
import NewQoute from './pages/NewQoute';
import QouteDetail from './pages/QouteDetail';
import Layout from './components/layout/Layout';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/quotes" />
        </Route>
        <Route path="/quotes" exact>
          <AllQoute />
        </Route>
        <Route path="/quotes/:quoteId">
          <QouteDetail />
        </Route>
        <Route path="/new-quote">
          <NewQoute />
        </Route>
        <Route path='*'>
          <NotFound />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
