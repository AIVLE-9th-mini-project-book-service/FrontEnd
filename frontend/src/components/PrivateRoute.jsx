import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;