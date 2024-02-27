import "./App.css";
import { Routes, Route } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";
import AdminLayout from "./layout/adminLayout";
import BaseLayout from "./layout/baseLayout";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <Routes>
      {/* Client */}
      {publicRoutes?.map((route, index) => {
        const Page = route.Component;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <BaseLayout>
                <Page />
              </BaseLayout>
            }
          />
        );
      })}

      {/* Admin */}
      {privateRoutes?.map((route, index) => {
        const Page = route.Component;
        return (
          <Route
            key={index}
            path={route.path}
            element={
              <AdminLayout>
                <Page />
              </AdminLayout>
            }
          />
        );
      })
      }
    </Routes>
  );
}

export default App;
