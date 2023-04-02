import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ThemeProvider from './contexts/ThemeContext';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

// Styles
import 'antd/dist/antd.min.css'
import './styles/theme/index.scss';
import './styles/header.scss';
import './styles/our-token.scss';
import './styles/post.scss';
import './styles/user-info.scss';
import './styles/input.scss';
import './styles/feds.scss';
import './styles/notifications.scss';
import './styles/index.scss';
import './styles/top-coins.scss';
import './styles/Videos.scss';
import 'react-calendar/dist/Calendar.css'

// Redux
import { Provider } from 'react-redux'
import store from './redux/store'
import SocketProvider from './contexts/SocketContext';

// Global axios
axios.defaults.baseURL = "http://localhost:8000"
// console.log(process.env.REACT_APP_API_MAIN_SERVER_URL);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<Provider store={store}>
			<SocketProvider>
				<BrowserRouter>
					<ThemeProvider>
						<App />
					</ThemeProvider>
				</BrowserRouter>
			</SocketProvider>
		</Provider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
