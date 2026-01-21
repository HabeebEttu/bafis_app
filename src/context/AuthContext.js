import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/config";
import { authService } from "../services/authService";

const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext();
    if (!context) {
        throw Error("Auth context must be used within the auth provider")
    }
    return context;
}

export const AuthProvider = ({children}) => {
    const [userData, setUserData] = useState(null)
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth,async(user)=> {
            setCurrentUser(user)
            if (user) {
                try {
                const data = await authService.getCurrentUserData(user.uid);
                setUserData(data);
                } catch (error) {
                   console.log('failed to gt user',error);
                    
                }

            } else {
                setUserData(null)
            }
            setLoading(false)
        })
        return unSubscribe
    }, [])
    const value = {
        currentUser,
        userData,
        loading,
        login: authService.login,
        register: authService.register,
        logout: authService.logout,
        resetPassword:authService.resetPassword,
    }
    return (
        !loading && {children}
    )
}