import { Fragment } from "react";
import { useParams, Route, Link, useRouteMatch } from "react-router-dom";
import Comments from '../components/comments/Comments'
import HighlightedQuote from "../components/quotes/HighlightedQuote";
import { getSingleQuote } from "../lib/api";
import useHttp from "../hooks/use-http";
import { useEffect } from "react";
import LoadingSpinner from "../components/UI/LoadingSpinner";


const QouteDetail = () => {
    const {sendRequest, status, data: loadedQuote} = useHttp(getSingleQuote, true);
    const match = useRouteMatch()
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
      return <div className="centered">No qoute found!</div>;
    }
    

        return (
          <Fragment>
            <h1>Qoutes Detail</h1>
            <HighlightedQuote text={loadedQuote.text} author={loadedQuote.author} />

            <Route path={match.path} exact>
              <div className="centered">
                <Link className="btn--flat" to={`${match.url}/comments`}>
                  Comment
                </Link>
              </div>
            </Route>

            <Route path={`${match.path}/comments`}>
              <Comments />
            </Route>
          </Fragment>
        );

};
export default QouteDetail;
