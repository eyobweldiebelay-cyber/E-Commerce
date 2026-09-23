import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/* Public Pages */
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

/* Customer Pages */
import Cart from "./Pages/costomer/Cart";
import Checkout from "./Pages/costomer/Checkout";
import Payment from "./Pages/costomer/Payment";
import OTPVerification from "./Pages/costomer/OTPVerification";
import OrderConfirmation from "./Pages/costomer/OrderConfirmation";
import MyOrders from "./Pages/costomer/MyOrder";
import OrderDetails from "./Pages/costomer/OrderDetails";
import Favorites from "./Pages/costomer/Favorites";
import Profile from "./Pages/costomer/Profile";

/* Admin Pages */
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./Pages/admin/Dashboard";
import AdminProducts from "./Pages/admin/Products";
import AdminCategories from "./Pages/admin/Categories";
import AdminCustomers from "./Pages/admin/Costomer";
import AdminOrders from "./Pages/admin/Order";
import AdminPayments from "./Pages/admin/Payment";
import Footer from "./components/Footer";



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>

          <Navbar />

          <main>
            <Routes>

              {/* Public pages */}

              <Route path="/" element={<Home />} />

              <Route path="/products" element={<Products />} />

              <Route
                path="/products/:id"
                element={<ProductDetails />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/register"
                element={<Register />}
              />


              {/* Customer pages */}

              <Route element={<ProtectedRoute role="customer" />}>

                <Route
                  path="/cart"
                  element={<Cart />}
                />

                <Route
                  path="/checkout"
                  element={<Checkout />}
                />

                {/* FIXED */}
                <Route
                  path="/payment/:orderId"
                  element={<Payment />}
                />

                {/* FIXED */}
                <Route
                  path="/otp-verification/:paymentId"
                  element={<OTPVerification />}
                />

                <Route
               path="/order-confirmation/:orderId"
               element={<OrderConfirmation />}
                />

                <Route
                  path="/orders"
                  element={<MyOrders />}
                />

                <Route
                  path="/orders/:id"
                  element={<OrderDetails />}
                />

                <Route
                  path="/favorites"
                  element={<Favorites />}
                />

                <Route
                  path="/profile"
                  element={<Profile />}
                />

              </Route>

<Route element={<ProtectedRoute role="admin" />}>
    <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="payments" element={<AdminPayments />} />
    </Route>
</Route>

              

            </Routes>
        <Footer/>
          </main>

        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

/*
Jakemy JM-8151

Yihua 8786D

ANENG AN8009 or DT

B-7000 Glue / Amtech Flux
//////////////
"ሰላም! እነዚህን እቃዎች አለችሁ? ዋጋቸው ስንት ነው? (Do you have these tools in stock and what are their prices?)

1. Jakemy JM-8151 precision toolkit
2. Yihua 8786D soldering station
3. ANENG AN8009 multimeter
4. B-7000 glue and Amtech flux

ወደ ክልል በባስ ካርጎ መላክ ትችላላችሁ? (Can you ship to regional areas via bus cargo?)"
*/