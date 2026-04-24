import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/home/Home';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Marketplace from '../pages/product/Marketplace';
import ProductDetails from '../pages/product/ProductDetails';
import AddProduct from '../pages/product/AddProduct';
import EditProduct from '../pages/product/EditProduct';
import UpcycleProduct from '../pages/product/UpcucleProduct';
import UserProfile from '../pages/user/UserProfile';
import Dashboard from '../pages/dashboard/Dashboard';
import SwapRequests from '../pages/swap/SwapRequests';
import SwapDetails from '../pages/swap/SwapDetails';
import DigitalCloset from '../pages/user/DigitalCloset';
import StyleFeed from '../pages/home/StyleFeed';
import MyListings from '../pages/MyListings';
import Cart from '../pages/Cart';
import Wishlist from '../pages/Wishlist';
import Checkout from '../pages/Checkout';
import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'marketplace', element: <Marketplace /> },
      { path: 'product/:id', element: <ProductDetails /> },
      { path: 'add-product', element: <AddProduct /> },
      { path: 'upcycle-product', element: <UpcycleProduct /> },
      { path: 'upcycle-product/:id', element: <UpcycleProduct /> },
      { path: 'edit-product/:id', element: <EditProduct /> },
      { path: 'profile', element: <UserProfile /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'swap-requests', element: <SwapRequests /> },
      { path: 'swap/:id', element: <SwapDetails /> },
      { path: 'digital-closet', element: <DigitalCloset /> },
      { path: 'style-feed', element: <StyleFeed /> },
      { path: 'my-listings', element: <MyListings /> },
      { path: 'cart', element: <Cart /> },
      { path: 'saved', element: <Wishlist /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'unauthorized', element: <Unauthorized /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default router;
