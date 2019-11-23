/*
 * @Description: file content
 * @Author: RongWei
 * @Date: 2019-10-17 10:34:14
 * @LastEditors: RongWei
 * @LastEditTime: 2019-10-31 15:41:40
 */
/*
    重点注意：axios目前不要做catch的处理，处理了catch，会导致dva model中effects无法获取error的信息，
    所以对axios中错误的status code处理，都移动到dva的onError事件中处理
*/
import axios from 'axios';
import utils from 'utils/utils';
import { message } from 'maycur-antd';

let request = {};
let history = undefined;
let dispatch = undefined;
let appStore = null;

function activeLoadingFor(pageId) {
    dispatch({ type: 'app/togglePageLoading', payload: { pageId, active: true } });
}

function unactiveLoadingFor(pageId) {
    setTimeout(() => {
        dispatch({ type: 'app/togglePageLoading', payload: { pageId, active: false } });
    }, 500);
}

request.toastError = (errorMsg, type) => {
    setTimeout(() => {
        if (errorMsg) {
            if (type === 'info') {
                message.info(errorMsg);
            } else if (type === 'warning') {
                message.warning(errorMsg);
            } else if (type === 'success') {
                message.success(errorMsg);
            } else {
                message.error(errorMsg);
            }
        }

    }, 300)
};

function urlRamKey(url) {
    let randomKey = new Date().getTime();
    return /\?/.test(url) ? `${url}&${randomKey}` : `${url}?${randomKey}`;
}

/* 开始前载入loading效果 */
axios.interceptors.request.use(config => {
    if (config && config.pageId) activeLoadingFor(config.pageId);
    config.timeout = config.timeout || 60000;
    return config;
});

axios.interceptors.response.use(response => {
    const { data, config, status } = response;
    if (/59\d$/.test(status)) {
        window.location.reload();
    }
    if (config && config.pageId) {
        unactiveLoadingFor(config.pageId);
    }
    try {
        if (JSON.parse(config.data).modalClose) {
            return response
        }
    } catch (e) {

    }
    if (data && data.code !== 'ACK' &&
        data.code !== 'VALIDATION_ERROR' &&
        (data.code !== 'NACK' || !data.data)) {
        //应用已到期
        if (data.bizCode === 'LC0001') {
            dispatch({ type: 'app/setDdAuthState', payload: { authState: 'expired', initMessage: data.message } });
        }
        //用户未在使用授权范围内
        else if (data.bizCode === 'LC0002') {
            dispatch({ type: 'app/setDdAuthState', payload: { authState: 'unauth', initMessage: data.message } });
        }
        //其他错误
        else {
            request.toastError(data.message);
        }
    } else {
        const code = data && data.code;
        if (code) {
            let type = code === 'ACK' ? 'success' : '';
            let msg = data.message;
            if (type && config && config.noSuccessToast) msg = '';
            request.toastError(msg, type);
        }
    }

    // if (data && (data.code !== 'ACK' && data.code !== 'VALIDATION_ERROR')) {
    //     request.toastError(data.message);
    // }
    return response;
}, error => {
    let { config, response } = error;
    if (response && /59\d$/.test(response.status)) {
        window.location.reload();
    }
    if (config && config.pageId) {
        unactiveLoadingFor(config.pageId);
    }
    // if (response && response.status && response.status === 456) {
    //     dispatch({ type: 'app/setDdAuthState', payload: { authState: 'clientCross', initMessage: '您是集团版本用户，请登录集团版本的应用。' } });
    // }
    request.toastError(response && response.data && response.data.message);
    return Promise.reject({ response: error || {}, reLogin: false });
}
);

request.post = (url, data, option = {}) => {
    url = urlRamKey(url);
    let config = {
        showLoad: option.showLoad,
        pageId: option.pageId,
        noSuccessToast: option.noSuccessToast
    };
    return new Promise((resolve, reject) => {
        axios.post(url, data, config).then((response) => {
            resolve(response.data);
        }).catch((error) => {
            console.log(error);
            let { response } = error;
            reject(response ? response : {});
        });
    })
};

request.get = (url, option = {}) => {
    url = urlRamKey(url);
    let config = {
        showLoad: option.showLoad,
        pageId: option.pageId,
        params: option.params
    };
    return axios.get(url, config).then((response) => {
        return response.data;
    });
};

request.put = (url, data, option = {}) => {
    url = urlRamKey(url);
    let config = {
        showLoad: option.showLoad,
        pageId: option.pageId
    };
    return new Promise((resolve, reject) => {
        axios.put(url, data, config).then((response) => {
            resolve(response.data);
        })
            .catch((error) => {
                console.log(error);
                let { response } = error;
                reject(response ? response : {});
            });
    })
};

request.patch = (url, data, option = {}) => {
    url = urlRamKey(url);
    let config = {
        showLoad: option.showLoad,
        pageId: option.pageId
    };
    return new Promise((resolve, reject) => {
        axios.patch(url, data, config).then((response) => {
            resolve(response.data);
        })
            .catch((error) => {
                console.log(error);
                let { response } = error;
                reject(response ? response : {});
            });
    })
};

request.delete = (url, option = {}) => {
    url = urlRamKey(url);
    let config = {
        showLoad: option.showLoad,
        pageId: option.pageId,
        params: option.params
    };
    return axios.delete(url, config).then((response) => {
        return response.data;
    })
};

request.setHistory = (reactHistory) => {
    history = reactHistory;
};

request.getRouterHistory = () => {
    return history;
};

request.setDispatch = (reduxDispatch) => {
    dispatch = reduxDispatch;
};

request.getReduxDispatch = () => {
    return dispatch;
};

request.setStore = (store) => {
    appStore = store;
};
request.getStore = () => {
    return appStore;
};

request.setHeaders = (data) => {
    /* 设置请求基本参数 */
    const maycurData = { ...utils.getMaycurData(), ...(data || {}) };
    if (maycurData) {
        let tokenId, entCode, lang;
        tokenId = maycurData.maycurTokenId;
        entCode = maycurData.entCode;
        lang = maycurData.lang;
        axios.defaults.headers = {
            tokenId,
            lang,
            entCode
        };
    }
};

request.clearHeaders = () => {
    axios.defaults.headers = {};
}

request.setHeaders();

export default request;
