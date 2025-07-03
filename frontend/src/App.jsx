import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./router/routes";
import PageLoader from "./components/PageLoader";
import { fetchCurrentUser } from "./features/auth/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createSocket } from "./lib/socket";
import { useSelector } from "react-redux";

function App() {

const dispatch = useDispatch();
 const [appLoader,setAppLoader] = React.useState(true);
  

useEffect(() => {


    const fetchUserAndConnectSocket = async () => {

      try {
        const response = await dispatch(fetchCurrentUser()).unwrap();
      
        if (response?.user?._id) {
          const socket = createSocket(response?.user?._id);
          socket?.connect();
        }
      } catch (error) {
        console.log("Error in Login:", error);
      } finally {
        setAppLoader(false);
      }
    };

    fetchUserAndConnectSocket();
  }, [dispatch]);

   if (appLoader){
   
    return <PageLoader />
   }


  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
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
