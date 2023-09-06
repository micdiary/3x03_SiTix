import Login from "./pages/Login";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import * as constants from "./constants";
import { Route, Routes, BrowserRouter } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={constants.HOME_URL}
                    element={<Layout page={"home"} />}
                />
                {/* example for register  */}
                <Route path="/event" element={<Layout page={"register"} />} />
                {/* <Route path="/event" element={<Layout page={"event"} />} />
                <Route path="/queue" element={<Layout page={"queue  "} />} /> */}
                <Route path={constants.LOGIN_URL} element={<Login />} />
                <Route path={constants.REGISTER_URL} element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
