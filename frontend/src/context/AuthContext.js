import React, { createContext, useState, useEffect } from "react";
import api from "../api/Axios";


export const AuthContext = createContext()


export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const token = localStorage.getItem("token")
        const savedUser = localStorage.getItem("user")
        if(token && savedUser){
            setUser(JSON.parse(savedUser))
        }
        setLoading(false)
    },[])

    const register = async (username, password) => {
        try{
            const res = await api.post("/auth/register",{username, password})
        
            const {token, user} = res.data
            localStorage.setItem("token",token)
            localStorage.setItem("user",JSON.stringify(user))
            setUser(user)
            return {success:true}
        }catch(err){
            return {success:false,error:err.response?.data?.error || "Registration failed"}
        }
    }

    const login = async (username, password) => {
        try{
            const res = await api.post("/auth/login",{username, password})
        
            const {token, user} = res.data
            localStorage.setItem("token",token)
            localStorage.setItem("user",JSON.stringify(user))
            setUser(user)
            return {success:true}
        }catch(err){
            return {success:false,error:err.response?.data?.error || "Registration failed"}
        }
    }

    const logout = ()=>{
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user, register, login, logout, loading}}>
            {children}
        </AuthContext.Provider>
    )
}
