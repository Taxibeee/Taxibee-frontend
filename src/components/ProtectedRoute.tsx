import { PropsWithChildren } from "react";
import { useAuth, User } from "../auth/AuthProvider";

type ProtectedRouteProps = PropsWithChildren & {
    allowedRoles?: User['role'][];
}


export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { currentUser } = useAuth();

    if (currentUser === undefined) {
        return <div>Loading...</div>
    }

    if (currentUser === null || (allowedRoles && !allowedRoles.includes(currentUser.role))) {
        return <div>Access Denied</div>
    } 

    return children;
}

