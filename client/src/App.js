import Login from "./pages/Login";
import Queue from "./pages/Queue";
import Layout from "./layout/Layout";
import Register from "./pages/Register";
import * as constants from "./constants";
import ResetPassword from "./pages/ResetPassword";
import ForgetPassword from "./pages/ForgetPassword";
import UserVerification from "./pages/UserVerification";
import { Route, Routes, BrowserRouter } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={constants.HOME_URL}
                    element={<Layout page={"home"} />}
                />
                <Route
                    path={constants.CATEGORY_URL}
                    element={<Layout page={"category"} />}
                />
                <Route
                    path={constants.EVENT_URL}
                    element={<Layout page={"event"} />}
                />
                <Route
                    path={constants.TICKET_URL}
                    element={<Layout page={"ticket"} />}
                />
                <Route
                    path={constants.PURCHASE_URL}
                    element={<Layout page={"purchase"} />}
                />
                <Route
                    path={constants.HISTORY_URL}
                    element={<Layout page={"history"} />}
                />
                <Route
                    path={constants.USER_VERIFICATION_URL}
                    element={<UserVerification />}
                />
                <Route path={constants.LOGIN_URL} element={<Login />} />
                <Route path={constants.REGISTER_URL} element={<Register />} />
                <Route
                    path={constants.FORGET_PASSWORD_URL}
                    element={<ForgetPassword />}
                />
                <Route
                    path={constants.RESET_PASSWORD_URL}
                    element={<ResetPassword />}
                />
                <Route path={constants.QUEUE_URL} element={<Queue />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
