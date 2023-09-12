import Navbar from '../Navbar';
import { Outlet, useLocation } from 'react-router-dom';

const Root = () => {
    const location = useLocation();
    // 현재 경로(location.pathname)를 기반으로 조건 설정
    const isLoginPage = location.pathname === '/login';
    const isSignupPage = location.pathname === '/signup';

	return ( 
        <>
            {!isLoginPage && !isSignupPage && <Navbar />}
            <Outlet/>
        </>
    )
};

export default Root;