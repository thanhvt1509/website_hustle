import {
    Space,
    Table,
    Button,
    Popconfirm,
    message,
    Image,
    Spin,
    Tooltip,
    Select
} from 'antd';
import {
    EditFilled,
    DeleteFilled,
    PlusOutlined,
    SearchOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { Link } from "react-router-dom";
import { Dispatch, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ColumnsType, TableProps } from 'antd/es/table';
import axios from 'axios';
interface DataType {
    _id: string;
    fullname: string;
    email: string;
    address: string;
    role: string;
    createdAt: any;
}

const userPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const user = useSelector((state: any) => state.user);

    const [userList, setUserList] = useState([]);
    const [sortOption, setSortOption] = useState<Number>(1);
    if (user) {
        const token = user.token;
        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        useEffect(() => {
            axios.get(`http://localhost:8080/api/auth/users`, config)
                .then((response) => {
                    setUserList(response.data.data);
                })
                .catch((error) => {
                    console.log(error);

                });
        }, []);
    }
    const users = userList.filter((user: any) => user.role !== 'admin');
    // const confirm = async (id: string) => {
    //     try {
    //         if (id) {
    //             await onRemove(id).then(() => dispatch(deleteCategorySlice(id)))
    //             messageApi.open({
    //                 type: 'success',
    //                 content: 'Delete category successfully!',
    //             });
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }

    // }

    const columns = [
        {
            title: 'STT',
            dataIndex: 'key',
            render: (value: any) => <Link to={``} className='uppercase font-bold '>{value}</Link>,
            className: 'w-[100px]'
        },
        {
            title: 'MÃ KHÁCH HÀNG',
            dataIndex: '_id',
            render: (value: any) => <Link to={``} className='uppercase'>#{value.slice(0, 10)}</Link>,
            className: 'w-1/5'
        },
        {
            title: 'HỌ TÊN',
            key: 'fullname',
            render: (record: any) => (
                <div className="flex items-center  ">
                    <a className='w-full '>{record.fullname}</a>
                </div>
            ),
        },
        {
            title: 'EMAIL',
            dataIndex: 'email',
            key: 'email',

        },
        {
            title: 'Vai trò',
            key: 'role',
            render: (value: any) => (value.role === 'user' ? 'Thành viên' : '')

        },
        {
            title: '',
            key: 'action',
            render: (record: any) => (
                <Space size="middle" className='flex justify-end'>
                    {/* <Popconfirm
                        title="Delete category"
                        description="Are you sure to delete this category?"
                        onConfirm={() => confirm(record._id!)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ className: "text-white bg-blue-400" }}
                    >
                        <DeleteFilled className='text-xl text-red-400' />
                    </Popconfirm>
                    <Link to={`/admin/category/update/${record._id}`}>
                        <EditFilled className='text-xl text-yellow-400' />
                    </Link> */}
                    <Tooltip title="Xem" color={'green'} key={'green'}>
                        <Link to={`/admin/user/${record?._id}`}>
                            <EyeOutlined className='text-xl text-green-500' />
                        </Link>
                    </Tooltip>
                </Space>
            ),
        },

    ];

    const data: DataType[] = users.map((user: any, index) => ({
        key: index + 1,
        _id: user._id,
        fullname: user.fullname,
        // phone: user.phone,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt
    }));
    console.log(data);

    const sorrUser = [...users];

    switch (sortOption) {
        case 1:
            // Mới nhất
            sorrUser.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
        case 2:
            // Cũ nhất
            sorrUser.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            break;
        default:
            break;
    }
    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    return (
        <div className="">
            {contextHolder}
            <Space className='flex justify-between mb-5'>
                <div className="">
                    <span className="block text-xl text-[#1677ff]">
                        QUẢN LÝ KHÁCH HÀNG
                    </span>
                    {/* <span className="block text-base  text-[#1677ff]">
                        Manage your users
                    </span> */}
                </div>
                {/* <Link to={`add`}>
                    <Button type='primary' className='bg-blue-500'
                        icon={<PlusOutlined />}
                    >
                        Add New Category
                    </Button>
                </Link> */}
            </Space>
            <div className="border min-h-[300px] p-3 rounded-lg  bg-white">
                <div className="flex pb-6 pt-3 justify-between">
                    <form
                        //  onSubmit={handleSubmit(handleSearch)} 
                        className='w-[500px]'>
                        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                //  onChange={(e) => setSearch(e.target.value)} 
                                type="text" id="default-search" className="block w-full outline-none p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-[#1677ff] hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Tìm kiếm</button>
                        </div>
                    </form>


                </div>
                <div className="flex justify-end items-start mb-6">
                    <div className="flex items-center">
                        <span className="mr-3 text-sm text-[#333333]">Sắp xếp theo:</span>
                        <Select
                            defaultValue={1}
                            style={{ width: 200 }}
                            options={[
                                { value: 1, label: 'Mới nhất' },
                                { value: 2, label: 'Cũ nhất' },


                            ]}
                            onChange={(value: any) => setSortOption(value)}
                        />
                    </div>
                </div>
                <Table columns={columns} dataSource={sorrUser} pagination={{ pageSize: 20 }} onChange={onChange} />
            </div>
        </div>
    )
}
export default userPage;