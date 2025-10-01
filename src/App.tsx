import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate, Outlet, BrowserRouter } from 'react-router-dom';

import { FooterAdmin, HeaderAdmin, NavAdmin } from './components/dashboard';
import { FooterWeb, HeaderWeb, NavWeb } from './components/web';


// const Home = React.lazy(() => import('./view/index'));

const ProtectedRoute: React.FC = () => {
  // const { isMobile } = useGlobalContext();
  return (
    <div className="flex flex-col w-full" style={{ height: "100vh", backgroundColor: '#007bff' }}>
      {/* <!-- Header --> */}
      <HeaderWeb />
      <NavWeb />
      <Outlet />
      <FooterWeb />
    </div>

  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter >
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<ProtectedRoute />}>
            {/* <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} /> */}
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter >
  )
};

export default App
