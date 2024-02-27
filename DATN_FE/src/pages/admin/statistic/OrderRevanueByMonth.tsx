import React from 'react'
import LayoutStatistic from './LayoutStatistic'
import { MonthlyStatistics } from '../../../store/statistic/statistic.interface';
import { useGetOrderRevenueByMonthQuery } from '../../../store/statistic/statistic.service';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Button, Spin, Table } from 'antd';
import { Excel } from "antd-table-saveas-excel";

interface DataType {
  key: string;
  month: string;
  totalOrders: number;
  totalOrderValue: number;
  totalRevenue: number;
  totalProfit: number;
  totalQuantitySold: number;
  totalCostPrice: number;

}
const columns = [
  {
    title: 'Tháng',
    dataIndex: 'month',
    key: 'month',
  },
  {
    title: 'Tổng số đơn',
    dataIndex: 'totalOrders',
    render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    key: 'totalOrders',
  },
  {
    title: 'Tiền vốn',
    dataIndex: 'totalCostPrice',
    render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    key: 'totalCostPrice',
  },
  {
    title: 'Tiền hàng',
    dataIndex: 'totalOrderValue',
    render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    key: 'totalOrderValue',
  },
  {
    title: 'Số sản phẩm bán được',
    dataIndex: 'totalQuantitySold',
    render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    key: 'totalQuantitySold',
  },
  {
    title: 'Tổng doanh thu',
    dataIndex: 'totalRevenue',
    render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    key: 'totalRevenue',
  },
  {
    title: 'Tổng lợi nhuận',
    dataIndex: 'totalProfit',
    render: (value: number) => value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    key: 'totalProfit',
  },

  // Thêm các cột khác nếu cần
];
interface OrderRevanueByMonthProps {
  showTable?: boolean;
}
const OrderRevanueByMonth = (props: OrderRevanueByMonthProps = ({ showTable: true })) => {
  const { data: orderRevanueMonth, isSuccess: isSuccessGetRevanueMonth } = useGetOrderRevenueByMonthQuery()
  console.log(orderRevanueMonth);
  console.log(isSuccessGetRevanueMonth);
  if (!isSuccessGetRevanueMonth) {
    return <>
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50 ">
        <Spin size='large' />
      </div>
    </>;
  }
  let filledData: MonthlyStatistics[] = [];

  const generateAllMonths = () => {
    const allMonths = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const month = (currentDate.getMonth() + 1 - i + 12) % 12 + 1;
      const year = currentDate.getFullYear();
      allMonths.unshift(`${year}-${String(month).padStart(2, '0')}`);
    }

    return allMonths;
  };
  const fillMissingMonths = (data: MonthlyStatistics[], allMonths: string[]) => {
    const filledData = allMonths.map(month => {
      const matchingData = data.find(entry => entry.month === month);
      return matchingData || {
        month,
        totalOrders: 0,
        totalOrderValue: 0,
        totalRevenue: 0,
        totalProfit: 0,
        totalCostPrice: 0,
        totalQuantitySold: 0,
      };
    });
    return filledData;
  };
  if (orderRevanueMonth) {
    const allMonths = generateAllMonths();
    filledData = fillMissingMonths(orderRevanueMonth, allMonths);
  }
  const data: DataType[] = isSuccessGetRevanueMonth
    ? orderRevanueMonth?.map((item) => ({
      key: item.month,
      month: item.month,
      totalOrders: item.totalOrders,
      totalQuantitySold: item.totalQuantitySold,
      totalOrderValue: item.totalOrderValue,
      totalRevenue: item.totalRevenue,
      totalProfit: item.totalProfit,
      totalCostPrice: item.totalCostPrice,
    }))
      .sort((a, b) => {
        const dateA = new Date(`${a.month}-01`).getTime();
        const dateB = new Date(`${b.month}-01`).getTime();
        return dateA - dateB;
      })
    : [];
    const handleClick = () => {
      const excel = new Excel();
      excel
        .addSheet("test")
        .addColumns(columns)
        .addDataSource(data, {
          str2Percent: true
        })
        .saveAs("Excel.xlsx");
    };
  return (
    <>
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            chart: {
              type: 'column'
            },
            title: {
              text: 'Biểu đồ doanh thu'
            },
            xAxis: {
              categories: filledData?.map(entry => entry.month) || []
            },
            yAxis: {
              title: {
                text: 'Doanh thu (đơn vị)'
              }
            },
            series: [{
              name: 'Doanh thu',
              data: filledData?.map(entry => entry.totalRevenue) || []
            },
            {
              name: 'Lợi nhuận',
              data: filledData?.map(entry => entry.totalProfit) || []
            },
            ]
          }}
        /></div>
      <div>
      
        {props.showTable && (
          <><Button danger onClick={handleClick}>Export</Button><Table
            columns={columns}
            dataSource={data}
            pagination={{ size: 'small', pageSize: 20 }}
            summary={() => (
              <Table.Summary.Row className='h-20 bg-blue-50'>
                <Table.Summary.Cell index={0} colSpan={1}>
                  <strong>Tổng</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={0} colSpan={1}>
                  <strong>{data.reduce((acc, current) => acc + current.totalOrders, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={1}>
                  <strong>{data.reduce((acc, current) => acc + current.totalCostPrice, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} colSpan={1}>
                  <strong>{data.reduce((acc, current) => acc + current.totalOrderValue, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} colSpan={1}>
                  <strong>{data.reduce((acc, current) => acc + current.totalQuantitySold, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} colSpan={1}>
                  <strong>{data.reduce((acc, current) => acc + current.totalRevenue, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} colSpan={1}>
                  <strong>{data.reduce((acc, current) => acc + current.totalProfit, 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          /></>
          )}
      </div></>
  )
}

export default OrderRevanueByMonth