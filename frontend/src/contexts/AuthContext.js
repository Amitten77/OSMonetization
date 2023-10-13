'use client'
import {  createContext, useContext, useState } from "react";


const AuthContext = createContext(null);


const useAccount = () => {
    const context = useContext(AuthContext)
    return context;
}

export const AuthProvider = (props) => {
    const [account, setAccount] = useState("No Metamask Account");
    const [gitAccount, setGitAccount] = useState("No Github Account")

    const changeAccount = (acc) => {
      setAccount(acc)
    }

    const changeGitAccount = (acc) => {
      setGitAccount(acc)
    }

    return (
      <AuthContext.Provider value={{ account, changeAccount, gitAccount, changeGitAccount}}>
        {props.children}
      </AuthContext.Provider>
    );
  };

export default useAccount;
