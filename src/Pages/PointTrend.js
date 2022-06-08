
import React, { Component, useEffect, useState } from 'react';

import UseInterval from '../Common/UseInterval'
import moment from 'moment'
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Line } from '@ant-design/charts';
import { Select, Space } from 'antd'

const { Option } = Select

//趋势面板 g2-plot版
function PointTrend(props) {
    const { FullName, TagDesc } = props;
    const getPlotValues = useStoreActions((actions) => actions.database.getPlotValues);
    const pointTrendDataList = useStoreState((state) => state.database.pointTrendDataList);

    const [state, setState] = useState({
        data: [],
        spanType: 0,
    })

    const config = {
        width: 1500,
        height: 800,
        autoFit: true,
        xField: 'Time',
        yField: 'Value',

        xAxis: {
            tickCount: 8,
            animate: false,
            nice: true
        },
        smooth: true,
    };

    useEffect(() => {
        let find = false;
        if (pointTrendDataList) {
            pointTrendDataList.forEach(element => {
                if (element.pointName == FullName) {
                    find = true;
                    setState({ ...state, data: element.valueList })
                }
            });
        }
        if (!find)
            getTrendData();

    }, [pointTrendDataList])

    //获取趋势数据
    const getTrendData = () => {
        let startTime = moment().add(-0.1, 'hours').format("yyyy-MM-DD HH:mm:ss");
        let endTime = moment().format("yyyy-MM-DD HH:mm:ss");
        switch (state.spanType) {
            case 0:

                break;
            case 1://1小时
                startTime = moment().add(-1, 'hours').format("yyyy-MM-DD HH:mm:ss");
                endTime = moment().format("yyyy-MM-DD HH:mm:ss");
                break;
            case 2://10小时
                startTime = moment().add(-10, 'hours').format("yyyy-MM-DD HH:mm:ss");
                endTime = moment().format("yyyy-MM-DD HH:mm:ss");
                break;
            case 3://1天
                startTime = moment().add(-1, 'days').format("yyyy-MM-DD HH:mm:ss");
                endTime = moment().format("yyyy-MM-DD HH:mm:ss");
                break;
            case 4://1月
                startTime = moment().add(-1, 'months').format("yyyy-MM-DD HH:mm:ss");
                endTime = moment().format("yyyy-MM-DD HH:mm:ss");
                break;
            default:
        }
        getPlotValues({ tagName: FullName, tagDesc: TagDesc, startTime: startTime, endTime: endTime, interval: 1000, count: 3000 })
    }
    //定时器
    UseInterval(() => {
        getTrendData()
    }, 3000)

    const spanChange = (value) => {
        setState({ ...state, spanType: value })
        getTrendData();
    }
    return (<div>
        <div style={{ margin: '10px' }}>
            <Space>
                <span>{TagDesc}</span>
                <Select style={{ width: '100px' }} defaultValue={0} value={state.spanType} onChange={spanChange}>
                    <Option value={0}>10分钟</Option>
                    <Option value={1}>1小时</Option>
                    <Option value={2}>10小时</Option>
                    <Option value={3}>1天</Option>
                    <Option value={4}>1月</Option>
                </Select>
            </Space>
        </div>
        <Line
            {...config}
            data={state.data}
        />
    </div>
    );
}

export default PointTrend; 