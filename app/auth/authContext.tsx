import React, {createContext,useContext,useEffect,useState} from "react"
import {User,signInWithEmailAndPassword,createUserWithEmailAndPassword,signOut,onAuthStateChanged} from "firebase/auth"
import {auth, getUserData} from './firebase';


const AuthContext=createContext({});
export const useAuth = () => useContext<any>(AuthContext);

export function AuthContextProvider({children}:{children:React.ReactNode}){
    const [user,setUser]=useState<User|null>(null);
    const [userData,setUserData]=useState({});
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(auth,(currentUser)=>{
            setUser(currentUser);
            setUserData(getUserData("users"));
            setLoading(false);
        });

        return ()=> unsubscribe();
    },[]);

    const logOut = async () => {
        setUser(null);
        return await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user,userData, logOut }}>
            {loading ? null : children}
        </AuthContext.Provider>
    );

}