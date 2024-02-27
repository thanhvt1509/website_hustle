import React, { Dispatch, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
type Props = { children: React.ReactNode };

import {
  PieChartOutlined,
  CodeSandboxOutlined,
  AppstoreAddOutlined,
  LogoutOutlined,
  UserOutlined,
  TagOutlined,
  SolutionOutlined,
  BarChartOutlined,
  EyeOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, message, theme } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/user/userSlice";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link to={"/admin/dashboard"}>Dashboard</Link >, '1', <PieChartOutlined />),
  getItem('Sản phẩm', 'sub1', <CodeSandboxOutlined />, [
    getItem(<Link to={"/admin/product/add"}>Tạo mới sản phẩm</Link >, '3'),
    getItem(<Link to={"/admin/product"}>Quản lý sản phẩm</Link >, '4'),
    getItem(<Link to={"/admin/outfit"}>Quản lý Outfit</Link >, '12'),
  ]),
  getItem('Danh mục', 'sub2', <AppstoreAddOutlined />, [
    getItem(<Link to={"/admin/category/add"}>Tạo mới danh mục</Link >, '5'),
    getItem(<Link to={"/admin/category"}>Quản lý danh mục</Link >, '6'),
  ]),
  getItem(<Link to={"/admin/user"}>Khách hàng</Link >, '7', <UserOutlined />),
  getItem('Đơn hàng', 'sub3', <SolutionOutlined />, [
    getItem(<Link to={"/admin/order"}>Quản lý đơn hàng</Link >, '8'),
    getItem(<Link to={"/admin/orderreturn"}>Quản lý đổi hàng</Link >, '9'),
  ]),
  getItem(<Link to={"/admin/voucher"}>Khuyến mại</Link >, '10', <TagOutlined />,),

  getItem('Thống kê', 'sub4', <BarChartOutlined />, [
    getItem(<Link to={"/admin/statistic"}>Báo cáo bán hàng</Link >, '11'),
  ]),
];

const AdminLayout = ({ children }: Props) => {
  const dispatch: Dispatch<any> = useDispatch()

  const user = useSelector((state: any) => state.user);
  const role = user?.current?.role
  const navigate = useNavigate();
  useEffect(() => {
    if (role != "admin") {
      return navigate("/");
    }
  }, [navigate, role]);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const logOut = () => {
    // Gọi action đăng xuất
    dispatch(logout());
    message.info("Đăng xuất thành công");
    localStorage.removeItem("carts")
    navigate("/signin");
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="my-3 flex justify-between items-center px-3">
          <Link to={`/admin`}>
            <img className="w-[130px]" src="../../public/images/logo/Layer12.png" alt="" />
          </Link>
          <div className="">
            <Link to={`/`}> <EyeOutlined className="text-xl text-gray-300" /></Link>
          </div>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
        <div className="fixed bottom-0">
          <button className="text-gray-300 bg-gray-800 w-[200px] py-3 hover:text-white" onClick={() => logOut()}>
            <LogoutOutlined className="mr-2" />
            Đăng xuất
          </button>
        </div>
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Content className="">
          <div className="bg-stone-50" style={{ padding: 24, minHeight: 360 }}>
            {children}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
