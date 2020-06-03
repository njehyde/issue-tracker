import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import thunk from 'redux-thunk';
import axiosMiddleware from 'redux-axios-middleware';
import storage from 'redux-persist/lib/storage';

import authReducer from 'reducers/auth';
import projectReducer from 'reducers/project';
import issueReducer from 'reducers/issue';
import defaultClient from 'services/defaultClient';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    authStore: authReducer,
    projectStore: projectReducer,
    issueStore: issueReducer,
  }),
);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [
  thunk.withExtraArgument(defaultClient),
  axiosMiddleware(defaultClient),
];

export default () => {
  const store = createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(...middlewares)),
  );

  const persistor = persistStore(store);
  return { store, persistor };
};
