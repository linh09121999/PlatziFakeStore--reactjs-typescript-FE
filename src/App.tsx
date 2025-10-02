import React, { Suspense, useEffect } from 'react';
import { HashRouter, Route, Routes, Navigate, Outlet, BrowserRouter } from 'react-router-dom';

import { FooterAdmin, HeaderAdmin, NavAdmin } from './components/dashboard';
import { FooterWeb, HeaderWeb, NavWeb } from './components/web';

import BackToTop from './components/BackToTop';

const Login = React.lazy(() => import('./pages/auth/login'))
const Register = React.lazy(() => import('./pages/auth/register'))


const Page404 = React.lazy(() => import('./pages/page404/Page404'));
const Page500 = React.lazy(() => import('./pages/page500/Page500'));

const Home = React.lazy(() => import('./pages/web/home'));
const Products = React.lazy(() => import('./pages/web/products'))
const Categories = React.lazy(() => import('./pages/web/categories'))
const ProductDetail = React.lazy(() => import('./pages/web/product-detail'))

const Admin = React.lazy(() => import('./pages/dashboard/dashboard'));

const ProtectedRouteWeb: React.FC = () => {
  // const { isMobile } = useGlobalContext();
  return (
    <div className="flex flex-col w-full h-full">
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
    <div className="flex flex-col w-full h-full">
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/" element={<ProtectedRouteWeb />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path='/categories' element={<Categories />} />
            <Route path='/product-detail' element={<ProductDetail />} />
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
