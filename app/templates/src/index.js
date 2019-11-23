
import dva from 'dva';
import createLoading from 'dva-loading';
import 'index.less';
import 'utils/emojiLog';
import request from 'utils/axios';
import './i18n';
import { message } from 'maycur-antd';

message.config({
    duration: 5,
    top: 50
});
// 1. Initialize
const app = dva({
    extraReducers: {},
    onError: (event, dispatch) => {
        event.preventDefault();
        
    },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
app.model(require('models/appModel').default);

// 4. Router
app.router(require('router').default);

// 5. Start
app.start('#root');
request.setStore(app._store);
