import React from 'react';
import LayoutStatistic from './LayoutStatistic';
import { QuarterlyStatistics } from '../../../store/statistic/statistic.interface';
import { useGetOrderRevenueByQuarterQuery } from '../../../store/statistic/statistic.service';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { Button, Spin, Table } from 'antd';
import { IExcelColumn } from 'antd-table-saveas-excel/app';
import { Excel } from "antd-table-saveas-excel";

interface DataType {
  key: string;
  quarter: string;
  totalOrders: number;
  totalOrderValue: number;
  totalRevenue: number;
  totalProfit: number;
  totalQuantitySold: number;
  totalCostPrice: number;
}

const columns = [
  {
    title: 'Quý',
    dataIndex: 'quarter',
    key: 'quarter',
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
];
interface OrderRevanueByMonthProps {
  showTable?: boolean; 
}
const OrderRevanueByQuarter = (props: OrderRevanueByMonthProps = ({showTable : true})) => {
  const { data: orderRevanueQuarter, isSuccess: isSuccessGetRevanueQuarter } = useGetOrderRevenueByQuarterQuery();

  if (!isSuccessGetRevanueQuarter) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-50 ">
        <Spin size='large' />
      </div>
    );
  }

  let filledData: QuarterlyStatistics[] = [];
  function getQuarter(month: string) {
    const monthNumber = parseInt(month.split('-')[1]);

    if (monthNumber >= 1 && monthNumber <= 3) {
      return 'Q1';
    } else if (monthNumber >= 4 && monthNumber <= 6) {
      return 'Q2';
    } else if (monthNumber >= 7 && monthNumber <= 9) {
      return 'Q3';
    } else {
      return 'Q4';
    }
  }
  const generateAllQuarters = () => {
    const allQuarters = [];
    const currentDate = new Date();

    for (let i = 0; i < 4; i++) {
      const quarter = getQuarter(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);
      allQuarters.unshift(quarter);
      currentDate.setMonth(currentDate.getMonth() - 3); // Di chuyển về quý trước
    }

    return allQuarters;
  };

  const fillMissingQuarters = (data: QuarterlyStatistics[], allQuarters: string[]) => {
    const filledData = allQuarters.map(quarter => {
      const matchingData = data.find(entry => entry.quarter === quarter);
      return matchingData || {
        quarter,
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

  if (orderRevanueQuarter) {
    const allQuarters = generateAllQuarters();
    filledData = fillMissingQuarters(orderRevanueQuarter, allQuarters);
  }

  const data: DataType[] = isSuccessGetRevanueQuarter
    ? filledData.map((item) => ({
      key: item.quarter,
      quarter: item.quarter,
      totalOrders: item.totalOrders,
      totalQuantitySold: item.totalQuantitySold,
      totalOrderValue: item.totalOrderValue,
      totalRevenue: item.totalRevenue,
      totalProfit: item.totalProfit,
      totalCostPrice: item.totalCostPrice,
    }))
      .sort((a, b) => {
        const quarterA = parseInt(a.quarter.substring(1));
        const quarterB = parseInt(b.quarter.substring(1));
        return quarterA - quarterB;
      })
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
        .saveAs("Thongkesanpham.xlsx");
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
              text: 'Biểu đồ doanh thu theo quý'
            },
            xAxis: {
              categories: filledData?.map(entry => entry.quarter) || []
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
        />
      </div>
      <div>
      {props.showTable && (
        <>      <Button danger onClick={handleClick}>Export</Button>
<Table
          columns={columns}
          dataSource={data}
          pagination={{ size: 'small', pageSize: 20 }}
          summary={() => (
            <Table.Summary.Row className='h-20 bg-blue-50'>
              <Table.Summary.Cell index={0} colSpan={1}>
                <strong>Tổng</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={1}>
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
      </div>
    </>
  );
}

export default OrderRevanueByQuarter;