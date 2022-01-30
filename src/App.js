import SearchUsers from "./pages/SearchUsers";
import Home from "./pages/Home";
import User from "./pages/User";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { Provider } from "react-redux";
import store from "./redux/store";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <Provider store={store}>
      <Toaster
        position="top-right"
        toastOptions={{
          position: "bottom-right",
          style: {
            backgroundColor: "#24292f",
            color: "#f6f8fa",
            width: "100vw",
          },
          iconTheme: {
            primary: "#f6f8fa",
            secondary: "#24292f",
          },
        }}
      />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchUsers />} />
          <Route path="/users/:username" element={<User />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

//TOKEN:
//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
