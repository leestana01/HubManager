import { createBrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage";

export default createBrowserRouter([
    {
        path: "/",
        element: <MainPage/>
    }
])