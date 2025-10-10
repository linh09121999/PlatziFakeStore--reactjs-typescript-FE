import React, { Suspense } from 'react';
import { Route, Routes, Navigate, Outlet, BrowserRouter } from 'react-router-dom';
import { useGlobal } from './context/GlobalContext';
import { HeaderAdmin, NavAdmin, BarAdmin } from './components/dashboard';
import { HeaderWeb, NavWeb } from './components/web';
import Footer from './components/Footer';

import BackToTop from './components/BackToTop';

const Login = React.lazy(() => import('./pages/auth/login'))
const Register = React.lazy(() => import('./pages/auth/register'))


const Page404 = React.lazy(() => import('./pages/page404/Page404'));
const Page500 = React.lazy(() => import('./pages/page500/Page500'));

const Home = React.lazy(() => import('./pages/web/home'));
const Products = React.lazy(() => import('./pages/web/products'))
const Categories = React.lazy(() => import('./pages/web/categories'))
const ProductDetail = React.lazy(() => import('./pages/web/product-detail'))
const Cart = React.lazy(() => import('./pages/web/cart'))

const Admin = React.lazy(() => import('./pages/dashboard/dashboard'));
const ProductsAdmin = React.lazy(() => import('./pages/dashboard/products'))
const CategoriesAdmin = React.lazy(() => import('./pages/dashboard/categories'))
const SettingAdmin = React.lazy(() => import('./pages/dashboard/setting'))

type propsProtectedRouteAdmin = {
  isAuthenticated: boolean;
  onLogout: () => void
}

type propsProtectedRouteWeb = {
  onLogout: () => void
}

const ProtectedRouteWeb: React.FC<propsProtectedRouteWeb> = ({ onLogout }) => {
  // const { isMobile } = useGlobalContext();
  return (
    <div className="flex flex-col w-full h-full">
      {/* <!-- Header --> */}
      <BackToTop />
      <HeaderWeb onLogout={onLogout} />
      <NavWeb />
      <Outlet />
      <Footer />
    </div>
  );
};



const ProtectedRouteAdmin: React.FC<propsProtectedRouteAdmin> = ({ isAuthenticated, onLogout }) => {
  // const { isMobile } = useGlobalContext();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const { sidebarOpen } = useGlobal()
  return (
    <div className="flex w-full h-full">
      {/* <!-- Header --> */}
      <BackToTop />
      <div>
        <BarAdmin onLogout={onLogout} />
      </div>
      <div className={`flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-[90px]" : "lg:ml-[280px]"} `} >
        <HeaderAdmin onLogout={onLogout} />
        <NavAdmin />
        <Outlet />
        <Footer />
      </div>
    </div>

  );
};

const App: React.FC = () => {
  const { isAuthenticated, handleLoginSuccess, handleLogout } = useGlobal()

  return (
    <BrowserRouter >
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/404" element={<Page404 />} />
          <Route path="/500" element={<Page500 />} />
          <Route path="/" element={<ProtectedRouteWeb onLogout={handleLogout} />}>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path='/products' element={<Products />} />
            <Route path='/categories' element={<Categories />} />
            <Route path='/product-detail' element={<ProductDetail />} />
            <Route path='/cart' element={<Cart />} />
          </Route>
          <Route path='/admin' element={<ProtectedRouteAdmin isAuthenticated={isAuthenticated}
            onLogout={handleLogout} />}>
            <Route >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path='/admin/dashboard' element={<Admin />} />
              <Route path='/admin/products' element={<ProductsAdmin />} />
              <Route path='/admin/categories' element={<CategoriesAdmin />} />
              <Route path='/admin/setting' element={<SettingAdmin />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter >
  )
};

export default App
