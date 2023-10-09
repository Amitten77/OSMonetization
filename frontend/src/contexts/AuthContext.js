'use client'
import {  createContext, useContext, useState } from "react";


const AuthContext = createContext(null);


const useAccount = () => {
    const context = useContext(AuthContext)
    return context;
}

export const AuthProvider = (props) => {
    const [account, setAccount] = useState("nothing here yet");

    const changeAccount = (acc) => {
      setAccount(acc)
    }
    return (
      <AuthContext.Provider value={{ account, changeAccount}}>
        {props.children}
      </AuthContext.Provider>
    );
  };

export default useAccount;
