import React from 'react';
import { Navigate } from 'react-router-dom';

const withRole = (allowedRoles, WrappedComponent) => {
    return (props) => {
        const userRole = props.userRole.toString();

        if(allowedRoles !== "all"){
            if (!allowedRoles.includes(parseInt(userRole))) {
                return <Navigate to="/access-denied" replace />;
            }
        }       

        return <WrappedComponent {...props} />;
    };
};

export default withRole;