import './App.css';
import{ React, useEffect, useState} from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Home from './components/User/Home';
import Profile from './components/Layout/Profile'
import Login from './components/Layout/Login';
import Register from './components/Layout/Register';
import Forget from './components/Layout/Forget';
import Verify from './components/Layout/Verify';
import RMenu from './components/Restaurant/RMenu';
import Category from './components/User/Category'
import MenuNew from './components/Restaurant/MenuNew';
import MenuUpdate from './components/Restaurant/MenuUpdate';
import RHome from './components/Restaurant/RHome';
import Cuisine from './components/User/Cuisine';
import Offer from './components/User/Offer';
import AiRecipe from './components/User/AiRecipe';
import RestaurantDetail from './components/User/Restaurant/RestaurantDetail';
import Cart from './components/User/Cart';
import Checkout from './components/User/Checkout';
import MenuDetail from './components/User/Restaurant/MenuDetail';
import RMenuDetails from './components/Restaurant/RMenuDetails';
import Footer from './components/Layout/Footer';
import SearchFilter from './components/User/SearchFilter';
import MyRestaurant from './components/Restaurant/MyRestaurant';
import SplMenu from './components/Restaurant/SplMenu';
import SplNew from './components/Restaurant/SplNew';
import Success from './components/User/Success';
import Cancel from './components/User/Cancel';
import Order from './components/User/Order';
import Create from './components/Restaurant/Create';
import Rlogin from './components/Restaurant/Rlogin';
import Rregister from './components/Restaurant/Rregister';
import Rorder from './components/Restaurant/Rorder';
import RsplDetails from './components/Restaurant/RsplDetails';
import SplMenuUpdate from './components/Restaurant/SplMenuUpdate';
import History from './components/User/History';
import RHistory from './components/Restaurant/RHistory';
import Users from './components/Admin/User';
import Orders from './components/Admin/Order';
import Restaurants from './components/Admin/Restaurant';
import Menus from './components/Admin/Menu';
import AHome from './components/Admin/Home'
import Special from './components/User/Special';
import Reset from './components/Layout/Reset';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cuisine/:cuisine" element={<Category/>} />
        <Route path="/cuisine" element={<Cuisine/>} />
        <Route path="/offers" element={<Offer/>} />
        <Route path="/special" element={<Special/>} />
        <Route path="/recipe" element={<AiRecipe/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/signin" element={<Login/>} />
        <Route path="/signup" element={<Register/>} />
        <Route path="/password/forgot" element={<Forget/>} />
        <Route path="/password/reset/:resetToken" element={<Reset/>} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/search/:keyword" element={<SearchFilter />} />
        <Route path="/restaurant" element={<RHome />} />
        <Route path="/restaurant/signin" element={<Rlogin/>} />
        <Route path="/restaurant/menu/new" element={<MenuNew />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/menu/:id" element={<MenuDetail/>} />
        <Route path="/restaurant/menudetail/:id" element={<RMenuDetails/>} />
        <Route path="/restaurant/menu/:id" element={<MenuUpdate/>} />
        <Route path="/restaurnt/new/:id" element={<Create/>} />
        <Route path="/restaurant/signup" element={<Rregister/>} />
        <Route path="/restaurnt/new" element={<Create/>} />
        <Route path="/restaurant/profile" element={<MyRestaurant/>} />
        <Route path="/restaurant/special" element={<SplMenu />} />
        <Route path="/restaurant/special/new" element={<SplNew />} />
        <Route  path='/order/verify' element={<Success />}/>
        <Route  path='/cancel' element={<Cancel />}/>
        <Route  path='/myorders' element={<Order />}/>
        <Route  path='/restaurant/myorders' element={<Rorder />}/>
        <Route path="/restaurant/splmenudetail/:id" element={<RsplDetails/>} />
        <Route path="/restaurant/splmenu/:id" element={<SplMenuUpdate/>} />
        <Route  path='/history' element={<History/>}/>
        <Route  path='/restaurant/history' element={<RHistory/>}/>
        <Route  path='/admin' element={<AHome/>}/>
        <Route  path='/admin/user' element={<Users/>}/>
        <Route  path='/admin/order' element={<Orders/>}/>
        <Route  path='/admin/restaurant' element={<Restaurants/>}/>
        <Route  path='/admin/menu' element={<Menus/>}/>
       
      </Routes>
      <Footer/> 
    </div>
  );
}

export default App;
