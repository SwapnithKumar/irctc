import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import UserDashboard from './components/UserDashboard/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';


function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/admin" element = {<ProtectedRoute component={AdminDashboard} requiredRole="admin"/>}/>
        <Route path="/" element = {<UserDashboard/>}/>

      </Routes>
    </Router>
  );
}

export default App;
