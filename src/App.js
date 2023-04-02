import { useContext } from 'react'
import { ThemeContex } from './contexts/ThemeContext'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/header'

// Views
import HomView from './views/HomView'
import UserInfoView from './views/UserInfoView'
import VideosView from './views/VideosView'

const App = () => {
	const { theme } = useContext(ThemeContex)
	const body = document.querySelector("body")
	body.style.background = theme === "light" ? "#f3f5f7" : "#25262B"

	return (
		<div className={`${theme}`} style={{ background: theme === "light" ? "#f3f5f7" : "#25262B", height: "100vh" }}>
			<Header />
			<Routes>
				<Route element={<AuthProvider />}>
					<Route path='/' element={<VideosView />} />
					<Route path='/u/:id' element={<h1>User</h1>} />
					<Route path='/p/:uuid' element={<h1>post</h1>} />
					<Route path='/lives/:id' element={<h1>Live</h1>} />
				</Route>
				<Route path='user-info' element={<UserInfoView />} />
			</Routes>
		</div>
	)
}

export default App
