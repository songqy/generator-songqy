let dispatch,history;
function setDispatch(val){
    dispatch = val;
}
function setHistory(val){
    history = val;
}
function getDispatch(){
    return dispatch;
}
function getHistory(){
    return history;
}
export default {
    setDispatch,
    getDispatch,
    setHistory,
    getHistory
}