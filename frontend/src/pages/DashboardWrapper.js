import { Navigate } from "react-router-dom";

const DashboardWrapper = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" />; // redirect to login if no token
    }

    return children;
};

export default DashboardWrapper;
