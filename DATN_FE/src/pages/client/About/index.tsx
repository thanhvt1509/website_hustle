import Header from "../../../layout/Header";
import { Link } from "react-router-dom";
import Footer from "../../../layout/Footer";

const About = () => {
  return (
    <>
      <Header></Header>
      <div className="bg-[#f5f5f5] mb-7">
        <div className="max-w-[1500px] mx-auto py-[10px] text-[#333333] px-2 text-sm">
          <Link to="/">Trang chủ</Link>
          <span className="mx-[6px]">/</span>
          <Link to="">Giới thiệu</Link>
        </div>
      </div>
      <div className="container">
        <div className="mt-[60px] text-center mb-9">
          <p className="tracking-[0.3em] uppercase">VỀ CHÚNG TÔI</p>
          <h2 className="text-[26px] font-bold uppercase">
            THƯƠNG HIỆU THỜI TRANG NAM HUSTLE
          </h2>
        </div>
        <div className="px-[150px] mb-[60px] flex gap-x-6">
          <p className="px-4 max-w-[590px]">
            Hustle là thương hiệu thời trang cho phái mạnh hàng đầu Việt Nam
            thành lập vào năm 2015 bởi công ty CP đầu tư T&L Việt Nam., hướng
            tới sự phóng khoáng, lịch lãm và trẻ trung. Sau nhiều năm hoạt động
            và phát triển, đến nay, Hustle đã có cho mình 30 cửa hàng chi nhánh
            khắp cả nước để phục vụ cho khách hàng trên toàn quốc.
          </p>
          <p className="px-4">
            Hustle luôn đầu tư mạnh về đội ngũ kinh doanh, thiết kế để cho ra
            những sản phẩm quần áo đẹp mắt. Chất liệu vải được ưu tiên hàng đầu,
            cửa hàng luôn tìm những loại vải mềm, thoáng mát, thoải mái khi mặc.
            Form dáng may chuẩn size, là hàng VNXK nên đường may đều tỉ mỉ, gọn
            gàng.
          </p>
        </div>
        <div className="mb-[60px]">
          <div className="flex items-center mb-[60px]">
            <img
              src="/images/about/about01_introduce1_img.jpg"
              alt=""
              className="w-[750px] h-[411px]"
            />
            <div className="px-[80px]">
              <p className="tracking-[0.3em] uppercase text-center ">Hustle</p>
              <h2 className="text-[26px] font-bold uppercase mb-[35px] text-center ">
                CÂU CHUYỆN THƯƠNG HIỆU
              </h2>
              <p className="leading-[1.6]">
                Theo đuổi phong cách lịch lãm, sang trọng và trẻ trung cũng như
                muốn đem đến cho các quý ông vẻ ngoài luôn tự tin cuốn hút mọi
                lúc mọi nơi, vào năm 2015 Hustle đã được thành lập được thành
                lập bởi công ty CP đầu tư T&L Việt Nam. Trong suốt 7 năm hoạt
                động Hustle vô cùng tự hào đã đem đến cho các quý khách hàng hơn
                1 triệu chiếc áo Polo, khẳng định vị thế cũng như thương hiệu và
                chất lượng sản phẩm trên thị trường hiện nay.
              </p>
            </div>
          </div>
          <div className="flex items-center mb-[60px]">
            <div className="px-[80px]">
              <p className="tracking-[0.3em] uppercase text-center ">
                MODE FASHION
              </p>
              <h2 className="text-[26px] font-bold uppercase mb-[35px] text-center ">
                GIÁ TRỊ CỐT LÕI
              </h2>
              <p className="leading-[1.6]">
                Hustle là một hãng thời trang lịch lãm và thanh lịch. Giá trị
                cốt lõi của thương hiệu này tập trung vào việc mang đến sự tinh
                tế, sáng tạo và phong cách cho khách hàng của họ. Sản phẩm của
                Hustle thường được thiết kế với sự cân nhắc và chăm chút, tạo ra
                những bộ quần áo và phụ kiện thời thượng và đẳng cấp. Hustle
                không chỉ thể hiện tính cá nhân của mỗi người mà còn tôn trọng
                vẻ đẹp và sự thanh lịch trong từng sản phẩm. Thương hiệu này tạo
                ra những lựa chọn thời trang phù hợp cho những người yêu thích
                phong cách lịch lãm và muốn tỏa sáng trong mọi tình huống.
                Hustle là biểu tượng của sự thanh lịch và ấn tượng trong thế
                giới thời trang.
              </p>
            </div>
            <img
              src="/images/about/about01_introduce2_img.jpg"
              alt=""
              className="w-[750px] h-[411px]"
            />
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
};

export default About;
