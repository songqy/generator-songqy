import React from 'react';
import { Router, Route } from 'dva/router';
import App from '../App';
import request from 'utils/axios';
import middleTransformer from 'utils/middleTransformer';
function RouterConfig({ history }) {

    request.setHeaders();
    request.setHistory(history);
    middleTransformer.setHistory(history);

    return (
        <Router history={history}>
            <Route component={App} />
        </Router>
    )
}

export default RouterConfig;