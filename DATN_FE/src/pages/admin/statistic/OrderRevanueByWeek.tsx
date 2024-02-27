import React from 'react'
import LayoutStatistic from './LayoutStatistic'
// import { WeeklyStatistics } from '../../../store/statistic/statistic.interface';
import { useGetOrderRevenueByMonthQuery, useGetOrderRevenueByWeekQuery } from '../../../store/statistic/statistic.service';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Button, Spin, Table } from 'antd';
import { Excel } from "antd-table-saveas-excel";
import { IExcelColumn } from 'antd-table-saveas-excel/app';
interface DataType {
  key: string;
  day: string;
  totalOrders: number;
  totalOrderValue: number;
  totalRevenue: number;
  totalProfit: number;
  totalQuantitySold: number;
  totalCostPrice: number;

}
const columns = [
  {
    title: 'Ngày',
    dataIndex: 'day',
    key: 'day',
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
];interface OrderRevanueByMonthProps {
  showTable?: boolean; 
}
const OrderRevanueByWeek = (props: OrderRevanueByMonthProps = ({showTable : true})) => {
  const { data: orderRevanueWeek, isSuccess: isSuccessGetRevanueWeek } = useGetOrderRevenueByWeekQuery()
  if (!isSuccessGetRevanueWeek) {
    return <>
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50 ">
        <Spin size='large' />
      </div>
    </>;
  }
  let filledData = [];

  const generateLast7Days = () => {
    const last7Days = [];
    const currentDate = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() - i);
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      last7Days.push(formattedDate);
    }

    return last7Days;
  };
  const fillMissingDays = (data: any, allDays: string[]) => {
    const filledData = allDays.map(day => {
      const matchingData = data.find((entry: any) => entry.day === day);
      return matchingData || {
        day: day,
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

  if (orderRevanueWeek) {
    const allDays = generateLast7Days();
    console.log(allDays);
    filledData = fillMissingDays(orderRevanueWeek, allDays);
  }
  const data: DataType[] = isSuccessGetRevanueWeek
    ? orderRevanueWeek?.map((item) => ({
      key: item.day,
      day: item.day,
      totalOrders: item.totalOrders,
      totalQuantitySold: item.totalQuantitySold,
      totalOrderValue: item.totalOrderValue,
      totalRevenue: item.totalRevenue,
      totalProfit: item.totalProfit,
      totalCostPrice: item.totalCostPrice,

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
        .saveAs("Thongketheotuan.xlsx");
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
              categories: filledData?.map(entry => entry.day) || []
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
        <>      <Button danger onClick={handleClick}>Export</Button>
<Table
          columns={columns}
          dataSource={data}
          pagination={{ size: 'small', pageSize: 5 }}
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
        />        </>)}
      </div></>
  )
}

export default OrderRevanueByWeek