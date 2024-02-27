import { DatePicker, TreeSelect } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import OrderRevanueByMonth from './OrderRevanueByMonth';
import OrderRevanueByWeek from './OrderRevanueByWeek';
import OrderRevanueByQuarter from './OrderRevanueByQuarter';
import ProductRevanue from './ProductStatistic';
import OrderStatistic from './OrderStatistic';


const { RangePicker } = DatePicker;
const LayoutStatistic
  = () => {
    const navigate = useNavigate()
    dayjs.extend(customParseFormat);
    const dateFormat = 'YYYY/MM/DD';
    const [value, setValue] = useState<string>("week");

    const treeData = [
      {
        title: 'Theo thời gian',
        value: 'date',
        children: [
          {
            title: 'Theo tuần',
            value: 'week',
          },
          {
            title: 'Theo tháng',
            value: 'month',
          },
          {
            title: 'Theo quý',
            value: 'quarter',
          },
        ],
      },
      {
        title: 'Theo sản phẩm',
        value: 'product',

      },
      {
        title: 'Theo đơn hàng',
        value: 'order',

      },
    ];

    const onChange = (newValue: string) => {
      // navigate(`/admin/statistic/by_` +newValue)
      setValue(newValue);
    };
    const renderComponent = () => {
      switch (value) {
        case 'week':
          return <OrderRevanueByWeek showTable ={true} />;
        case 'month':
          return <OrderRevanueByMonth showTable ={true}/>;
        case 'quarter':
          return <OrderRevanueByQuarter showTable ={true} />;
        case 'product':
          return <ProductRevanue showTable ={true} />;
        case 'order':
          return <OrderStatistic showTable ={true} />;
        default:
          return null;
      }
    };
    return (
      <>
        <h3 className='text-xl font-semibold text-[#1677ff]'>Hoạt dộng kinh doanh</h3>
        <p className='my-4 text-[#1677ff]'>Ghi nhận theo ngày giao hàng thành công</p>

        <div className='flex justify-end'>
          {/* <label htmlFor="">  Khoảng thời gian:   <RangePicker
          style={{ marginLeft: 10 }}
          defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]}
          format={dateFormat}
        /></label> */}
          <label htmlFor="" className='block ml-10 text my-3'>Loại báo cáo:
            <TreeSelect
              style={{ width: 200, marginLeft: 10 }}
              value={value}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              treeDefaultExpandAll
              onChange={onChange}
              defaultValue='1'
            />
          </label>
        </div>
        {renderComponent()}
      </>
    )
  }

export default LayoutStatistic
