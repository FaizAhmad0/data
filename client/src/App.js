import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LogIn from "./Pages/LogIn";
import ManagerDash from "./Pages/ManagerDash";
import AdminDash from "./Pages/AdminDash";
import SupervisorDash from "./Pages/SupervisorDash";
import ManagerPrivateRoute from "./Components/ManagerPrivateRoute";
import AdminPrivateRoute from "./Components/AdminPrivateRoute";
import SupPrivateRoute from "./Components/SupPrivateRoute";
    import AllManagers from "./Pages/AllManagers";
import AddNewUser from "./Pages/AddNewUser";
import AllSupervisor from "./Pages/AllSupervisor";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<LogIn />} />
          <Route path="/login" exact element={<LogIn />} />

          {/* Manager Routes */}
          <Route element={<ManagerPrivateRoute />}>
            <Route path="/managerdash" element={<ManagerDash />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<AdminPrivateRoute />}>
            <Route path="/admindash" element={<AdminDash />} />
            <Route path="/managers" element={<AllManagers />} />
            <Route path="/supervisors" element={<AllSupervisor />} />
            <Route path="/add" element={<AddNewUser />} />
          </Route>

          {/* Supervisor Routes */}
          <Route element={<SupPrivateRoute />}>
            <Route path="/supervisordash" element={<SupervisorDash />} />
            <Route path="/addnew" element={<AddNewUser />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
