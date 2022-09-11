import { Fragment } from "react";
import { useParams, Route, Link, useRouteMatch } from "react-router-dom";
import Comments from '../components/comments/Comments'
import HighlightedQuote from "../components/quotes/HighlightedQuote";
import { getSingleQuote } from "../lib/api";
import useHttp from "../hooks/use-http";
import { useEffect, useContext } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import AuthContext from "../store/auth-context";

const QouteDetail = () => {
    const {sendRequest, status, data: loadedQuote} = useHttp(getSingleQuote, true);
    const match = useRouteMatch()
    const authCtx = useContext(AuthContext)
    const params  = useParams()
    const { quoteId } = params;
    useEffect(() => {
      sendRequest(quoteId)
    }, [sendRequest, quoteId])

    if(status === 'pending') {
      return <div className="centered">
        <LoadingSpinner />  
      </div>
    }


    if (status === "completed" && !loadedQuote.text) {
      return <div className="centered">No quote found!</div>;
    }
    

        return (
          <Fragment>
            <h1>Quotes Detail</h1>
            <HighlightedQuote text={loadedQuote.text} author={loadedQuote.author} />

            {authCtx.userIsLoggedIn && <Route path={match.path} exact>
              <div className="centered">
                <Link className="btn--flat" to={`${match.url}/comments`}>
                  Comment
                </Link>
              </div>
            </Route>}

            {!authCtx.userIsLoggedIn && <Comments />}

            <Route path={`${match.path}/comments`}>
              <Comments />
            </Route>
          </Fragment>
        );

};
export default QouteDetail;
