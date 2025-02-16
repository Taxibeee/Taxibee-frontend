import { createContext, PropsWithChildren, useContext, useState, useEffect } from "react";
import  axiosInstance  from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

export type User = {
    id: number;
    name: string;
    username: string;
    password: string;
    role: string
}

type AuthContext = {
    authToken?: string | null;
    currentUser?: User | null;
    handleLogin: (username: string, password: string, role: string) => Promise<void>;
    handleLogout: () => void;
    error?: Error | null
};

type Error = {
    message: string;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = PropsWithChildren;

export default function AuthProvider({ children }: AuthProviderProps) {
    const [ authToken, setAuthToken  ] = useState<string | null>();
    const [ currentUser, setCurrentUser  ] = useState<User | null>();
    const [ error, setError ] = useState<Error | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user = localStorage.getItem('currentUser');

        if (token && user) {
            setAuthToken(token);
            setCurrentUser(JSON.parse(user));
        }

        if (!token || !user) {
            navigate('/login');
        }
    }, [])


    async function handleLogin(username: string, password: string, role: string) {
        try {
            const response = await axiosInstance.post('/auth/login', { username, password, role })
            const { access_token, user } = response.data;
            setAuthToken(access_token);
            setCurrentUser(user);
            console.log(access_token);
            console.log(user);
            localStorage.setItem('authToken', access_token);
            localStorage.setItem('currentUser', JSON.stringify(user));
        } catch (error) {
            setAuthToken(null);
            setCurrentUser(null);
            setError(error as Error)
            console.error(error);
        }
    }

    async function handleLogout() {
        setAuthToken(null);
        setCurrentUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        navigate('/login', { replace: true })
    }

    return <AuthContext.Provider
        value={{
            authToken,
            currentUser,
            handleLogin,
            handleLogout,
            error
        }}
    >
        { children }
    </AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}