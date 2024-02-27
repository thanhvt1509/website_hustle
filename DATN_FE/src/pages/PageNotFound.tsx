import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <>
      <Header></Header>
      <div className="mx-auto max-w-[1500px] text-center mt-[41px] mb-[60px]">
        <h1 className="text-[170px] font-bold not-found text-white leading-[204px]">404</h1>    
        <h2 className="text-[40px] font-bold leading-[47px] text-[#333333] mb-5">Không tìm thấy trang</h2>
        <p className="max-w-[520px] mx-auto mb-8">
          Trang bạn đang tìm kiếm có thể đã bị xóa, chuyển đi, thay đổi link
          hoặc chưa bao giờ tồn tại.
        </p>
        <Link to="/" className="uppercase py-3 px-6 rounded inline-block bg-[#333333] text-white hover:bg-black transition-all">Trở về trang chủ</Link>
      </div>
      <Footer></Footer>
    </>
  );
};

export default PageNotFound;
