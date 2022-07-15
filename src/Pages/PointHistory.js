import React, { Component, useEffect, useRef, useState } from 'react';
import { Space, DatePicker, Radio, Button, Table, Alert, InputNumber, Select } from 'antd'
import moment from 'moment';
import { useStoreActions, useStoreState } from 'easy-peasy';
import userEvent from '@testing-library/user-event';
import { getQualityFromInt, Quality } from './Quality'

const { Option } = Select;

function PointHistory(props) {

    const { pointName } = props;

    const [state, setState] = useState({
        spanType: 0,
        startTime: moment().add(-1, 'hours'),
        endTime: moment(),
        valueList: [],
        columns: undefined
    })

    const [intervalState, setIntervalState] = useState({
        intervalType: 0,
        interval: 1
    })

    const intervalChange = (value) => {
        intervalState.interval = value;
        setIntervalState({ ...intervalState })
    }
    const intervalTypeChange = (value) => {
        intervalState.intervalType = value;
        setIntervalState({ ...intervalState })
    }

    const [tableState, setTableState] = useState({
        tableHeight: 100,
        isAlert: false,
    })

    const getArchivedValues = useStoreActions((actions) => actions.database.getArchivedValues);
    const getIntervalValues = useStoreActions((actions) => actions.database.getIntervalValues);
    const getNumberSummary = useStoreActions((actions) => actions.database.getNumberSummary);
    const getNumberSummaryInBatches = useStoreActions((actions) => actions.database.getNumberSummaryInBatches);

    const pointHistoryList = useStoreState((state) => state.database.pointHistoryList);

    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            width: 50,
            ellipsis: true,
        },
        {
            title: '时间',
            dataIndex: 'Time',
            width: 100,
            ellipsis: true,
            render: (text) => {
                return moment(text).format("yyyy-MM-DD HH:mm:ss.SSS");
            }
        },
        {
            title: '值',
            dataIndex: 'Value',
            width: 60,
            ellipsis: true,
            render: (text, row) => {
                return row.Type === 0 ? Number(text): (text + "");
            }
        },
        {
            title: '质量码',
            dataIndex: 'Qualitie',
            width: 100,
            ellipsis: true,
            render: (text) => {
                let title = "";
                Quality.map((elem) => {
                    if (elem.value + "" == text)
                        title = elem.title;
                })
                return title;
            }
        },
    ]

    const columnsSumary = [
        {
            title: '编号',
            dataIndex: 'id',
            width: 50,
            ellipsis: true,
        },
        {
            title: '类型',
            dataIndex: 'Type',
            width: 60,
            ellipsis: true,
        },
        {
            title: '值',
            dataIndex: 'Value',
            width: 60,
            ellipsis: true,
        },
    ]
    const columnsSumary2 = [
        {
            title: '编号',
            dataIndex: 'id',
            width: 50,
            ellipsis: true,
        },
        {
            title: '时间',
            dataIndex: 'Time',
            width: 100,
            ellipsis: true,
            render: (text) => {
                return moment(text).format("yyyy-MM-DD HH:mm:ss.SSS");
            }
        },
        {
            title: '最大值',
            dataIndex: 'Max',
            width: 100,
            ellipsis: true,
        },
        {
            title: '最小值',
            dataIndex: 'Min',
            width: 100,
            ellipsis: true,
        },
        {
            title: '算术平均值',
            dataIndex: 'Avg',
            width: 100,
            ellipsis: true,
        },
        /*{
            title: '加权平均值',
            dataIndex: 'PowerAvg',
            width: 100,
            ellipsis: true,
        }, */
        {
            title: '累积值',
            dataIndex: 'Total',
            width: 100,
            ellipsis: true,
        },
    ]
    const onStartTimeChange = (value) => {
        state.startTime = value;
        setState({...state})
    }
    const onEndTimeChange = (value) => {
        state.endTime = value;
        setState({...state})
    }
    //查询类型改变
    const onRadioChange = (e) => {

        state.spanType = e.target.value;
        setState({ ...state })
    }
    const onOk = () => {

    }
    const onChange = () => {

    }
    const [selectionType, setSelectionType] = useState('checkbox');
    const rowSelection = {
        selectedRowKeys: state.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setState({ ...state, selectedRowKeys: selectedRowKeys, selectedRows: selectedRows })
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };
    //点击查询按钮
    const searchHistoryClick = () => {

        let diff = state.endTime.diff(state.startTime, 'days');

        if (diff >= 35) {
            state.isAlert = true;
            setState({ ...state })
            return;
        }

        state.isAlert = false;
        state.columns = columns;
        if (state.spanType == 0)//存储值
        {
            getArchivedValues({
                tagName: props.pointName, count: 10000,
                startTime: state.startTime.format('yyyy-MM-DD HH:mm:ss'),
                endTime: state.endTime.format('yyyy-MM-DD HH:mm:ss')
            });
        }
        else if (state.spanType == 2)//统计值
        {
            state.columns = columnsSumary;
            getNumberSummary({
                tagName: props.pointName, count: 10000,
                startTime: state.startTime.format('yyyy-MM-DD HH:mm:ss'),
                endTime: state.endTime.format('yyyy-MM-DD HH:mm:ss')
            });
        }
        else if (state.spanType == 1)//等间隔插值 
        {
            let interval = intervalState.interval;

            if (intervalState.intervalType == 0)//秒
            {
                interval = intervalState.interval;
            }
            else if (intervalState.intervalType == 1)//分
            {
                interval = intervalState.interval * 60;
            }
            else if (intervalState.intervalType == 2)//时
            {
                interval = intervalState.interval * 3600;
            }
            else if (intervalState.intervalType == 3)//天
            {
                interval = intervalState.interval * 86400;
            }
            interval*=1000;//间隔单位变成ms
            getIntervalValues({
                tagName: props.pointName, count: 10000, interval: interval,
                startTime: state.startTime.format('yyyy-MM-DD HH:mm:ss'),
                endTime: state.endTime.format('yyyy-MM-DD HH:mm:ss')
            });
        } 
        else if (state.spanType == 3)//时间段等间隔统计值
        {
            state.columns = columnsSumary2;
            let interval = intervalState.interval;

            if (intervalState.intervalType == 0)//秒
            {
                interval = intervalState.interval;
            }
            else if (intervalState.intervalType == 1)//分
            {
                interval = intervalState.interval * 60;
            }
            else if (intervalState.intervalType == 2)//时
            {
                interval = intervalState.interval * 3600;
            }
            else if (intervalState.intervalType == 3)//天
            {
                interval = intervalState.interval * 86400;
            }
            getNumberSummaryInBatches({
                tagName: props.pointName, count: 10000, interval: interval*1000,
                startTime: state.startTime.format('yyyy-MM-DD HH:mm:ss'),
                endTime: state.endTime.format('yyyy-MM-DD HH:mm:ss')
            });
        }
        setState({ ...state })
    }

    //获得表高度
    const init = useRef();
    useEffect(() => {
        if (!init.current) {
            init.current = true;

            tableState.tableHeight = document.body.clientHeight - 300;
            tableState.scrollY = tableState.tableHeight - 90;
            setTableState({ ...tableState })
        }
    }, [init.current])
    //刷新历史数据
    useEffect(() => {
        if (pointHistoryList) {
            (pointHistoryList).forEach(element => {
                if (element.pointName === pointName) {
                    state.valueList = element.valueList;

                }
            });
            console.log(state.valueList)
            setState({ ...state })
        }
    }, [pointHistoryList])

    const todayButtonClick=()=>{
        state.startTime=moment().set('hour',0).set('minute',0).set('second',0);
        state.endTime=moment().add(1,'days').set('hour',0).set('minute',0).set('second',0);
        setState({...state})
    }
    const yestodayButtonClick=()=>{
        state.startTime=moment().add(-1,'days').set('hour',0).set('minute',0).set('second',0);
        state.endTime=moment().set('hour',0).set('minute',0).set('second',0);
        setState({...state})
    }
    const curMonthButtonClick=()=>{
        state.startTime=moment().add(-1,'days').set('hour',0).set('minute',0).set('second',0).set('date',1);
        state.endTime=moment().add(1,'days').set('hour',0).set('minute',0).set('second',0);
        setState({...state})
    }  
    const oneHourButtonClick=()=>{
        state.startTime=moment().add(-1,'hours');
        state.endTime=moment();
        setState({...state})
    }
    return <div style={{ padding: '10px' }} >
        <div >标签名：<span style={{ fontWeight: 'bold' }}>{pointName} </span></div>
        <div style={{ margin: '10px' }}></div>
        <div >
            <Space>
                <span >起始时间:</span>
                <DatePicker showTime onChange={onStartTimeChange}
                    onOk={onOk}
                    defaultValue={moment().add(-1, 'hours')}
                    value={state.startTime}
                    placeholder="选择起始时间"
                />
                <span >结束时间:</span>
                <DatePicker showTime onChange={onEndTimeChange} onOk={onOk}
                    placeholder="选择结束时间"
                    value={state.endTime}
                    defaultValue={moment()}
                />
                <Button type='primary' onClick={oneHourButtonClick}>最近一小时</Button> 
                <Button type='primary' onClick={todayButtonClick}>今天</Button> 
                <Button type='primary' onClick={yestodayButtonClick}>昨天</Button>
                <Button type='primary' onClick={curMonthButtonClick}>当月</Button>
            </Space>
            {state.isAlert ? <Alert type='warning' message='时间段不能超过35天'></Alert> : null}
        </div>
        <div style={{ margin: '10px' }}></div>
        <div>
            <Radio.Group onChange={onRadioChange} value={state.spanType}>
                <Radio value={0}>时间段内存储值</Radio>
                <Radio value={1}>时间段内等间隔插值</Radio>
                <Radio value={2}>时间段内统计值</Radio>
                <Radio value={3}>时间段内等间隔统计值</Radio>
            </Radio.Group>
        </div>
        <div style={{ margin: '10px' }}></div>
        {state.spanType == 1||state.spanType == 3 ? <Space>
            <span>查询间隔:</span>
            <InputNumber style={{ width: 80 }} value={intervalState.interval} onChange={intervalChange}></InputNumber>
            <Select defaultValue={intervalState.intervalType} vlaue={intervalState.intervalType} onChange={intervalTypeChange} style={{ width: '60px' }}>
                <Option value={0} title='秒'>秒</Option>
                <Option value={1} title='分'>分</Option>
                <Option value={2} title='时'>时</Option>
                <Option value={3} title='天'>天</Option>
            </Select>
        </Space> : null}
        <div style={{ margin: '10px' }}></div>
        <div>
            <Button onClick={searchHistoryClick} type='primary'>查询</Button>
        </div>
        <div style={{ margin: '10px' }}></div>
        <Table
            style={{ height: tableState.tableHeight }}
            columns={state.columns} dataSource={state.valueList}
           
            pagination={{ pageSize: 30,showSizeChanger:false }}
            scroll={{ x: 1000, y: tableState.scrollY }}
            size='small'
            onRow={record => {
                return {
                    onClick: event => { }, // 点击行
                    onDoubleClick: event => {

                        state.record = record;
                        setState({ ...state })
                    },
                    onContextMenu: event => { },
                    onMouseEnter: event => { }, // 鼠标移入行
                    onMouseLeave: event => { },
                };
            }}
        ></Table>
    </div>
}

export default PointHistory;