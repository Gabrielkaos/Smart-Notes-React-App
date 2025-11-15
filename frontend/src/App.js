import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Notes from "./pages/Notes";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/notes"
          element={
            <ProtectedRoute>
              <Notes/>
            </ProtectedRoute>
          }/>
          <Route path="/" element={<Navigate to="/notes" replace/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
