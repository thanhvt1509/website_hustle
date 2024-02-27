import routes from "../config/routes";
import Banner from "../layout/Banner";
import orderUpdate from "../pages/admin/OrderUpdate";
import VoucherAdd from "../pages/admin/VoucherAdd";
import VoucherPage from "../pages/admin/VoucherPage";
import VoucherUpdate from "../pages/admin/VoucherUpdate";
import categoryAdd from "../pages/admin/categoryAdd";
import categoryPage from "../pages/admin/categoryPage";
import categoryUpdate from "../pages/admin/categoryUpdate";
import dashboardPage from "../pages/admin/dashboard";
import ProductRevanue from "../pages/admin/statistic/ProductStatistic";
import ordersPage from "../pages/admin/ordersPage";
import productAdd from "../pages/admin/productAdd";
import productPage from "../pages/admin/productPage/index.";
import productUpdate from "../pages/admin/productUpdate";
import userPage from "../pages/admin/userPage";
import userUpdate from "../pages/admin/userUpdate";
import About from "../pages/client/About";
import BillConfirm from "../pages/client/BillConfirm";
import CheckoutsPage from "../pages/client/Checkouts";
import Contact from "../pages/client/Contact";
import myAccount from "../pages/client/MyAccount";
import ChangePassword from "../pages/client/MyAccount/changePassword";
import myAddress from "../pages/client/MyAccount/myAddress";
import myOrders from "../pages/client/MyAccount/myOrders";
import OrderDetail from "../pages/client/MyAccount/orderDetail";
import ProductPage from "../pages/client/Products";
import Resetpassword from "../pages/client/ResetPassword";
import SearchResult from "../pages/client/SearchResult";
import cartPage from "../pages/client/cart";
import homePage from "../pages/client/homePage";
import productDetail from "../pages/client/productDetail";
import signin from "../pages/client/signin";
import signup from "../pages/client/signup";
import OrderRevanue from "../pages/admin/statistic/OrderRevanueByMonth";
import OrderRevanueByMonth from "../pages/admin/statistic/OrderRevanueByMonth";
import LayoutStatistic from "../pages/admin/statistic/LayoutStatistic";
import productById from "../pages/admin/productById";
import orderReturnPage from "../pages/admin/orderReturnPage";
import orderReturnById from "../pages/admin/orderReturnById";
import OutfitPage from "../pages/client/Outfit";
import outfitPage from "../pages/admin/outfitPage";
import outfitAdd from "../pages/admin/outfitAdd";
import outfitUpdate from "../pages/admin/outfitUpdate/indext";
import { Component } from "react";
import PageNotFound from "../pages/PageNotFound";
import ordersReturn from "../pages/client/MyAccount/orderReturn";
import OrderReturnDetail from "../pages/client/MyAccount/orderReturnDetail";
import userInfo from "../pages/admin/userInfo";


export const publicRoutes = [
  { path: routes.home, Component: homePage },
  { path: routes.banner, Component: Banner },
  { path: routes.about, Component: About },
  { path: routes.contact, Component: Contact },
  { path: routes.productDetail, Component: productDetail },
  { path: routes.cart, Component: cartPage },
  { path: routes.checkout, Component: CheckoutsPage },
  { path: routes.Billconfirm, Component: BillConfirm },
  { path: routes.signin, Component: signin },
  { path: routes.resetPassword, Component: Resetpassword },
  { path: routes.signup, Component: signup },
  { path: routes.myAccount, Component: myAccount },
  { path: routes.orders, Component: myOrders },
  { path: routes.ordersReturn, Component: ordersReturn },
  { path: routes.ordersReturnDetail, Component: OrderReturnDetail },
  { path: routes.changePassword, Component: ChangePassword },
  { path: routes.addresses, Component: myAddress },
  { path: routes.orderDetail, Component: OrderDetail },
  { path: routes.products, Component: ProductPage },
  { path: routes.searchResult, Component: SearchResult },
  { path: routes.outfit, Component: OutfitPage },
  { path: routes.pageNotFound, Component: PageNotFound }
]

export const privateRoutes = [
  { path: routes.admin, Component: dashboardPage },
  { path: routes.adminDashboard, Component: dashboardPage },
  { path: routes.adminProducts, Component: productPage },
  { path: routes.adminProductAdd, Component: productAdd },
  { path: routes.adminProductUpdate, Component: productUpdate },
  { path: routes.adminProductById, Component: productById },
  { path: routes.adminOutfitPage, Component: outfitPage },
  { path: routes.adminOutfitAdd, Component: outfitAdd },
  { path: routes.adminOutfitUpdate, Component: outfitUpdate },
  { path: routes.adminCategorys, Component: categoryPage },
  { path: routes.adminCategoryAdd, Component: categoryAdd },
  { path: routes.adminCategoryUpdate, Component: categoryUpdate },
  { path: routes.adminUsers, Component: userPage },
  { path: routes.adminUserUpdate, Component: userUpdate },
  { path: routes.adminUserInfo, Component: userInfo },
  { path: routes.adminOrdersPage, Component: ordersPage },
  { path: routes.adminOrderUpdate, Component: orderUpdate },
  { path: routes.adminVoucherPage, Component: VoucherPage },
  { path: routes.adminVoucherAdd, Component: VoucherAdd },
  { path: routes.adminVoucherUpdate, Component: VoucherUpdate },
  { path: routes.adminVoucherUpdate, Component: VoucherUpdate },
  { path: routes.adminStatistic, Component: LayoutStatistic },
  { path: routes.adminProductRevanue, Component: ProductRevanue },
  { path: routes.adminOrderRevanue, Component: OrderRevanue },
  { path: routes.adminOrderRevanueByMonth, Component: OrderRevanueByMonth },
  { path: routes.adminOrderReturnPage, Component: orderReturnPage },
  { path: routes.adminOrderReturnGetOne, Component: orderReturnById },
  { path: routes.pageNotFound, Component: PageNotFound }
]