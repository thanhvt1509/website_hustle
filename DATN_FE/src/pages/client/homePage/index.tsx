import { useLocation } from "react-router-dom";
import Banner from "../../../layout/Banner";
import Footer from "../../../layout/Footer";
import Header from "../../../layout/Header";
import Category from "./Category";
import Outstanding_Product from "./Outstanding_Product";
import Policy from "./Policy";
import Product_Collection from "./Product_Collection";
import Sale from "./Sale";
import { useEffect } from "react";
import Vouchers from "./Vourcher";
import Outfit from "./Outfit";
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
const homePage = () => {
    return <>
        <ScrollToTop></ScrollToTop>
        <Header></Header>
        <Banner></Banner>
        <Vouchers></Vouchers>
        <Category></Category>
        <Sale></Sale>
        <Outstanding_Product></Outstanding_Product>
        <Outfit></Outfit>
        <Product_Collection></Product_Collection>
        <Policy></Policy>
        <Footer></Footer>

    </>
}
export default homePage;