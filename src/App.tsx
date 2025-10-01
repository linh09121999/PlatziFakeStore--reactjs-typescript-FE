import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate, Outlet, BrowserRouter } from 'react-router-dom';

import { FooterAdmin, HeaderAdmin, NavAdmin } from './components/dashboard';
import { FooterWeb, HeaderWeb, NavWeb } from './components/web';

import BackToTop from './components/BackToTop';


const Home = React.lazy(() => import('./pages/web/home'));

const Admin = React.lazy(() => import('./pages/dashboard/dashboard'));

const ProtectedRouteWeb: React.FC = () => {
  // const { isMobile } = useGlobalContext();
  return (
    <div className="flex flex-col w-full" style={{ height: "100vh", backgroundColor: '#007bff' }}>
      {/* <!-- Header --> */}
      <BackToTop />
      <HeaderWeb />
      <NavWeb />
      <Outlet />
      <FooterWeb />
    </div>

  );
};

const ProtectedRouteAdmin: React.FC = () => {
  // const { isMobile } = useGlobalContext();
  return (
    <div className="flex flex-col w-full" style={{ height: "100vh", backgroundColor: '#007bff' }}>
      {/* <!-- Header --> */}
      <BackToTop />
      <HeaderAdmin />
      <NavAdmin />
      <Outlet />
      <FooterAdmin />
    </div>

  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter >
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<ProtectedRouteWeb />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path='/admin' element={<ProtectedRouteAdmin />}>
            <Route >
              <Route index element={<Admin />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter >
  )
};

export default App
