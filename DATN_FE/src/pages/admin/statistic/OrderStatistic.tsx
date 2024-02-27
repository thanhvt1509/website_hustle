import React from 'react'
import LayoutStatistic from './LayoutStatistic'
import { MonthlyStatistics } from '../../../store/statistic/statistic.interface';
import { useGetOrderRevenueByMonthQuery, useGetOrderRevenueQuery, useGetProductRevenueQuery } from '../../../store/statistic/statistic.service';
import { Button, Space, Spin, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { Excel } from "antd-table-saveas-excel";
import { IExcelColumn } from 'antd-table-saveas-excel/app';
interface DataType {
  key: string;
  orderId: string;
  customerName: string;
  totalQuantitySold: number;
  totalRevenue: number;
  totalProfit: number;
  totalCostPrice: number

}
const columns  = [
  {
    title: 'Mã đơn',
    dataIndex: 'orderId',
    key: 'orderId',
    ellipsis: {
      showTitle: true,
    },
    render: (text) => <Link to={`#`}>#{text}</Link>,
  },
  {
    title: 'Tên khách hàng',
    dataIndex: 'customerName',
    key: 'customerName',
  },
  {
    title: 'Số lượng sản phẩm bán',
    dataIndex: 'totalQuantitySold',
    key: 'totalQuantitySold',
  },
  {
    title: 'Vốn',
    dataIndex: 'totalCostPrice',
    key: 'totalCostPrice',
  },
  {
    title: 'Doanh thu',
    dataIndex: 'totalRevenue',
    render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    key: 'totalRevenue',
  },
  {
    title: 'Lợi nhuận',
    dataIndex: 'totalProfit',
    render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    key: 'totalProfit',
  },

];
interface OrderRevanueByMonthProps {
  showTable?: boolean;
}
const OrderStatistic = (props: OrderRevanueByMonthProps = ({ showTable: true })) => {
  const { data: orderRevanue, isSuccess } = useGetOrderRevenueQuery();
  if (!isSuccess) {
    return <>
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50 ">
        <Spin size='large' />
      </div>
    </>;
  }
  const data: DataType[] = isSuccess
    ? orderRevanue?.map((item: any) => ({
      key: item.orderId,
      orderId: item.orderId,
      customerName: item.customerName,
      totalRevenue: item.totalRevenue,
      totalQuantitySold: item.totalQuantitySold,
      totalCostPrice: item.totalCostPrice,
      totalProfit: item.totalProfit,
    }))
    : [];
    const excelColumns: IExcelColumn[] = columns.map(column => {
      // Lọc ra các thuộc tính quan trọng từ cột
      const { title, dataIndex } = column;
      
      return {
        title,
        dataIndex: dataIndex as string, // Chắc chắn rằng dataIndex là một chuỗi
        key: dataIndex as string, // Chắc chắn rằng dataIndex là một chuỗi
        
      };
    });
    const handleClick = () => {
      console.log(excelColumns);
      const excel = new Excel();
      excel
        .addSheet("test")
        .addColumns(excelColumns)
        .addDataSource(data, {
          str2Percent: true,
        })
        .saveAs("Thongkedonhang.xlsx");
    };
  return (
    
    <div>      
      {props.showTable && (
        <><Button danger onClick={handleClick}>Export</Button>
        <Table
          sticky
          showHeader={true}
          columns={columns}
          dataSource={data}
          pagination={{ size: 'small', pageSize: 10 }}
          summary={() => (
            <Table.Summary.Row className='h-20 bg-blue-50'>
              <Table.Summary.Cell index={0} colSpan={2}>
                <strong>Tổng</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={1}>
                <strong>{data.reduce((acc, current) => acc + current.totalQuantitySold, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} colSpan={1}>
                <strong>{data.reduce((acc, current) => acc + current.totalCostPrice, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={0} colSpan={1}>
                <strong>{data.reduce((acc, current) => acc + current.totalRevenue, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={0} colSpan={1}>
                <strong>{data.reduce((acc, current) => acc + current.totalProfit, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        /></>)}

    </div>
  );
};

export default OrderStatistic;