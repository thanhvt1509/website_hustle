import { Link } from "react-router-dom";

const Breadcrumb = () => {
  return (
    <div className="bg-[#f5f5f5] mb-7">
      <div className="max-w-[1500px] mx-auto py-[10px] text-[#333333] px-2 text-sm">
        <Link to="/">Trang chủ</Link>
        <span className="mx-[6px]">/</span>
        <Link to="">Áo Tanktop họa tiết</Link>
        <span className="mx-[6px]">/</span>
        <Link to="">Áo Tanktop họa tiết Defeat ESTA010</Link>
      </div>
    </div>
  );
};

export default Breadcrumb;
