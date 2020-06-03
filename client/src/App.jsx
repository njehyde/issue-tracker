import React from 'react';
import { Provider } from 'react-redux';
import { Router, Switch, Route } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import { ThemeProvider } from 'styled-components';

import PrivateRoute from 'components/core/PrivateRoute';
import { paths } from 'constants/routes';
import { AuthProvider } from 'contexts/auth';
import LoginScreen from 'screens/LoginScreen';
import AddUserScreen from 'screens/AddUserScreen';
import LogoutScreen from 'screens/LogoutScreen';
import HomeScreen from 'screens/HomeScreen';
import ProjectsScreen from 'screens/ProjectsScreen';
import ProjectScreen from 'screens/ProjectScreen';
import configureStore from 'services/configureStore';
import history from 'services/history';

import theme from './theme';

const { store, persistor } = configureStore();

const App = () => (
  <div className="App">
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <DndProvider backend={Backend}>
            <AuthProvider>
              <Router history={history}>
                <Switch>
                  <Route path={paths.LOGIN} component={LoginScreen} />
                  <Route path={paths.REGISTER} component={AddUserScreen} />
                  <Route path={paths.LOGOUT} component={LogoutScreen} />
                  <PrivateRoute
                    exact
                    path={paths.LIST_PROJECTS}
                    component={ProjectsScreen}
                  />
                  <PrivateRoute
                    path="/projects/:id"
                    component={ProjectScreen}
                  />
                  <PrivateRoute
                    exact
                    path={paths.HOME}
                    component={HomeScreen}
                  />
                </Switch>
              </Router>
            </AuthProvider>
          </DndProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </div>
);

export default App;
