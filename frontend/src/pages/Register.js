import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css"

const Register = () =>{
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()
    const {register} = useContext(AuthContext)

    const handleSubmit = async (e) =>{
        e.preventDefault()
        setError("")

        const res = await register(username, password)

        if (res.success){
            navigate("/notes")
        }else{
            setError(res.error)
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Register</h2>
                {error && <div className="error-message">{error}</div>}
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
                    
                    <button className="btn-primary" type="submit">Register</button>
                </form>
                <p className="auth-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    )
}

export default Register