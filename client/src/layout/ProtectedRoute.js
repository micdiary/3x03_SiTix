import React from "react";
import { Navigate } from "react-router-dom";
import * as constants from "../constants";

const ProtectedRoute = ({
    user,
    redirectPath = constants.HOME_URL,
    children,
}) => {
    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
