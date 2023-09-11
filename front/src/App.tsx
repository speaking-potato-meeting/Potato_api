import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './components/Layout/Root'
import './App.css';
import Home from './pages/Home';
import StudyRules from './pages/StudyRules';
import Members from './pages/Members';
import ToDo from './pages/ToDo';
import StopWatch from './pages/StopWatch';
import MyPage from './pages/MyPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <div>잘못된 주소입니다. 다시 입력해주세요! 🫠</div>,
		children: [
			{ index: true, element: <Home /> },
			{ path: '/study-rules', element: <StudyRules /> },
      { path: '/members', element: <Members /> },
      { path: '/todo', element: <ToDo /> },
      { path: '/stop-watch', element: <StopWatch /> },
      { path: '/my-page', element: <MyPage /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <SignUp /> },
		],
	},
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
};

export default App;