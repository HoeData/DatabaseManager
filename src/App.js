import logo from './logo.svg';
import 'antd/dist/antd.css'
import './App.css';

import MainPage from './Pages/MainPage'
import { StoreProvider} from 'easy-peasy';

import store from './Store/store'
import Router from './Router/Router'
import ResizeTable from './Common/ResizeTable';

// {/*<StoreProvider store={store}>
 //    <Router></Router>
 // </StoreProvider>*/}
function App() {
  return (  <StoreProvider store={store}>
       <Router></Router>
     </StoreProvider>
  );
}

export default App;
