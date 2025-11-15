import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"

const Login = () =>{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const {login} = useContext(AuthContext)

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setError("")

        const res = await login(username, password)

        if (res.success){
            navigate("/notes")
        }else{
            setError(res.error)
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                {error && <div>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input required
                        value={username}
                        onChange={(e)=>setUsername(e.target.value)}/>
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                    
                    <button type="submit" className="btn-primary">Login</button>
                </form>
                <p>
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login