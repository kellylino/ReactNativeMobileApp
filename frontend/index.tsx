import { registerRootComponent } from 'expo';
import { Provider } from 'react-redux'; // Make sure to import Provider
import App from './App';
import store from './src/reducers/store'; // Assuming you have a store.js file

// Create a RootComponent that wraps your App with the Provider
const RootComponent = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// Register the RootComponent
registerRootComponent(RootComponent);