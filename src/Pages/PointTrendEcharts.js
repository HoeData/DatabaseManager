import React, { Component, useEffect, useRef, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import UseInterval from '../Common/UseInterval'
import moment from 'moment'
import { useStoreActions, useStoreState } from 'easy-peasy';
import { Select, Space } from 'antd'
import cloneDeep from 'lodash.clonedeep';

const { Option } = Select
function PointTrendEcharts(props) {
    const { FullName, TagDesc, TagUnit } = props;
    const getPlotValues = useStoreActions((actions) => actions.database.getPlotValues);
    const pointTrendDataList = useStoreState((state) => state.database.pointTrendDataList);

    let { UpperLimit, LowerLimit } = props;

    const  fomatFloat=(src,pos)=>{    
      return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);    
    } 

     
    const limitType=useRef(0);

    const [state, setState] = useState({
        spanType: 0,
        UpperLimit: 1000,
        LowerLimit: 0,
        option: {
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis',
                renderMode: 'html', 
                formatter: function (params) {
                    var color = params[0].color;//图例颜色
                    var htmlStr ='<div>';
                    htmlStr += params[0].name + '<br/>';//x轴的名称
                    
                    //为了保证和原来的效果一样，这里自己实现了一个点的效果
                    htmlStr += '<span style="margin-right:5px;display:inline-block;vertical-align:middle;width:10px;height:10px;border-radius:5px;background-color:'+color+';"></span>';
         
                    // 文本颜色设置--2020-07-23(需要设置,请解注释下面一行)
                    //htmlStr += '<span style="color:'+color+'">';
                    
                    //添加一个汉字，这里你可以格式你的数字或者自定义文本内容
                    htmlStr +='<span style="display: inline-block;max-width:200px;text-overflow:ellipsis;overflow:hidden;text-align:center;vertical-align:middle;">'+params[0].seriesName+'</span> '  
                    htmlStr += '<span style=" display: inline-block;text-overflow:ellipsis;vertical-align:middle;">'
                    + fomatFloat(params[0].value,6) +'</span> ' ;
         
                    // 文本颜色设置--2020-07-23(需要设置,请解注释下面一行)
                    //htmlStr += '</span>';
                    
                    htmlStr += '</div>';
                    
                    return htmlStr; 
                }
    
            },
            legend: {
                data: []
            },
            toolbox: {
                show: false,
                feature: {
                    dataView: { readOnly: false },
                    restore: {},
                    saveAsImage: {}
                }
            },
            /* grid: {
                 top: 60,
                 left: 30,
                 right: 60,
                 bottom: 30
             },*/
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: []
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    name: TagUnit,
                    max: UpperLimit,
                    min: LowerLimit,
                    boundaryGap: [0.2, 0.2]
                }
            ],
            series: [
                {
                    name: TagDesc,
                    type: 'line',
                    data: []
                }
            ]
        }
    })

    useEffect(() => {
        state.UpperLimit = UpperLimit;
        state.LowerLimit = LowerLimit;
        setState({ ...state })
    }, [])


    useEffect(() => {
        let find = false;
        if (pointTrendDataList) {
            pointTrendDataList.forEach(element => {
                if (element.pointName == "trend-" + FullName) {
                    find = true;
                    let timeArr = [], valueArr = [];
                    let maxLimit = undefined, minLimit = undefined;
                    (element.valueList).forEach(element => {
                        timeArr.push(element.Time);
                        valueArr.push(element.Value);
                        if (maxLimit == undefined)
                            maxLimit = element.Value;
                        else if (element.Value > maxLimit)
                            maxLimit = element.Value;
                        if (minLimit == undefined)
                            minLimit = element.Value;
                        else if (element.Value < minLimit)
                            minLimit = element.Value;
                    });
                    const option = cloneDeep(state.option);
                    option.xAxis[0].data = timeArr;
                    option.animation=false
                    option.series[0].data = valueArr;
                    if ( limitType.current == 0) {
                        option.yAxis[0].max = props.UpperLimit;
                        option.yAxis[0].min = props.LowerLimit;
                    }
                    else {
                        if (maxLimit > 0)
                            maxLimit *= 1.2;
                        else
                            maxLimit *= 0.8;
                        if (minLimit > 0)
                            minLimit *= 0.8;
                        else
                            minLimit *= 1.2;
                        option.yAxis[0].max = maxLimit.toFixed(0);
                        option.yAxis[0].min = minLimit.toFixed(0);
                    }
                    state.chartHeight = document.body.clientHeight - 250;
                   
                   setState({ ...state, option })
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

    const limitTypeChange = (v) => {

        limitType.current = v;
        setState({...state})
    }
    return (<div>
        <div style={{ margin: '10px' }}>
            <div style={{width:'100%'}}><span style={{fontWeight:'bold',marginRight:'10px'}}>{FullName}</span>{TagDesc}</div>
            <div style={{marginTop:'10px'}}>
                <Select style={{ width: '100px' }} defaultValue={0} value={state.spanType} onChange={spanChange}>
                    <Option value={0}>10分钟</Option>
                    <Option value={1}>1小时</Option>
                    <Option value={2}>10小时</Option>
                    <Option value={3}>1天</Option>
                    <Option value={4}>1月</Option>
                </Select>
                <span style={{ marginLeft: '10px' }}>量程:</span>
                <Select style={{ marginLeft: '10px', width: '100px' }}
                    onChange={limitTypeChange}
                     
                    value={limitType.current}>
                    <Option value={0}>固定量程</Option>
                    <Option value={1}>自由量程</Option>
                </Select>
            </div>

        </div>
        <ReactEcharts option={state.option} style={{ height: state.chartHeight }} />
    </div>
    );
}

export default PointTrendEcharts;
