import React, {Component} from 'react';
import {render} from 'react-dom';
import Map from './map';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './redux/reducers';

const store = createStore(reducers);

export default class App extends Component {
  render() {
    return (
     <Map/>
    );
  }
}

export function renderToDom(container) {
  render(<Provider store={store}><App /></Provider>, container);
}
