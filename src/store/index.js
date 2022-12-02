import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";
import thunk from "redux-thunk";
import rootSaga from "./sagas";

const initialState = {};

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware, thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);
sagaMiddleware.run(rootSaga);

export default store;
