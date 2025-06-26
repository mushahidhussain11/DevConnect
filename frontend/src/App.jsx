import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./router/routes";
import PageLoader from "./components/PageLoader";
import { lazy } from "react";

const AuthWrapper = lazy(() => import("./components/AuthWrapper"));

function App() {

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <AuthWrapper />
        <Routes>
          {routes.map(({ path, element }, index) => (
            <Route key={index} path={path} element={element} />
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
