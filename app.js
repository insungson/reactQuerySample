import React from 'react';
import ReactDOM from 'react-dom';
import {hot} from 'react-hot-loader/root';

import Index from './index';

const Hot = hot(Index);

ReactDOM.render(<Hot />, document.querySelector('#root'));
