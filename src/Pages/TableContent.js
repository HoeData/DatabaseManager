import React, { Component, useEffect, useState, useCallback, useRef } from 'react';

import {
    Button, Table, Modal, Space, Pagination, Tooltip,
    Spin, Upload, message, Input, Select
} from 'antd'
import { useStoreActions, useStoreState } from 'easy-peasy';
import {
    PlusOutlined, DeleteOutlined, ReloadOutlined, UploadOutlined,
    LineChartOutlined, HistoryOutlined, DownloadOutlined, ArrowDownOutlined,
    VerticalAlignBottomOutlined, SearchOutlined, ArrowRightOutlined
} from '@ant-design/icons';
import FileSaver from 'file-saver';
import { Parser } from 'json2csv';
import PointInfoModal from './PointInfoModal';
import { DataType, getDataTypeFromInt, getDataTypeFromString } from './DataType'
import { getQualityFromInt, Quality } from './Quality'
import GlobalSetting from './GlobalSetting';
import { EditableRow, EditableCell } from '../Common/EditableTable'
import moment from 'moment'
import UseInterval from '../Common/UseInterval'
import { CSVLink, CSVDownload } from "react-csv";
import { walkUpBindingElementsAndPatterns } from 'typescript';
import { GetBaseUrl } from '../Common/BaseUrl'
import CSVReader from 'react-csv-reader';
import SetOneValueModal from './SetOneValueModal';
import TreeNodeModal from '../DeviceTree/TreeNodeModal';
import SetValueModal from '../Common/SetValueModal';

import ResizeTable from '../Common/ResizeTable'

const { confirm } = Modal;
const { Option } = Select;

function TableContent(props) {

    const { tableName } = props;
    const tablePointList = useStoreState((state) => state.database.tablePointList);
    const removePoints = useStoreActions((actions) => actions.database.removePoints);
    const searchInBatches = useStoreActions((actions) => actions.database.searchInBatches);
    const updatePoints = useStoreActions((actions) => actions.database.updatePoints);
    const insertPoints = useStoreActions((actions) => actions.database.insertPoints);
    const searchPointsCount = useStoreActions((actions) => actions.database.searchPointsCount);
    const freshTableSnapList = useStoreActions((actions) => actions.database.freshTableSnapList);
    const setErrorMessage = useStoreActions((actions) => actions.database.setErrorMessage);
    const pointTrendList = useStoreState((state) => state.database.pointTrendList);
    const pointHisList = useStoreState((state) => state.database.pointHisList);
    const putSnapshots = useStoreActions((actions) => actions.database.putSnapshots);
    const onlyRead = useStoreState((state) => state.common.onlyRead);

    const curTable = useStoreState((state) => state.database.curTable);
    //页号变化
    const pageChange = (curPage, pageSize) => {
        setState({ ...state, pageNo: curPage })
        let con = { TableName: tableName, TagName: filterState.tagFilter, TagDesc: filterState.descFilter, Type: filterState.dataType };
        let start = (curPage - 1) * GlobalSetting.TablePointCountPerPage;
        searchInBatches({ condition: con, start: start, count: GlobalSetting.TablePointCountPerPage });
    }

    //筛选查询
    const filterSearch = () => {
        let con = { TableName: tableName, TagName: filterState.tagFilter, TagDesc: filterState.descFilter, Type: filterState.dataType };
        let start = 0;
        state.pageNo = 1;
        setState({ ...state })
        searchPointsCount({ condition: con })
        searchInBatches({ condition: con, start: start, count: GlobalSetting.TablePointCountPerPage });
    }

    const [loading, setLoading] = useState(false);
    const [state, setState] = useState({
        pointList: [],
        downPointList: [],
        modalVis: false,
        setAllValueVis: false,
        pageNo: 1,

        pagination: {
            pageSize: 100,
            total: 300,
            hideOnSinglePage: true,
            showSizeChanger: false,
            showTitle: true,
            //onShowSizeChange:pageSizeChange,
            // itemRender:pageItemRender,
            position: ['bottomLeft']
        },
        loading: false,
        setValueModalVis: false,

    });

    const [filterState, setFilterState] = useState({
        tagFilter: undefined,
        descFilter: undefined,
        dataType: -1
    })

    const [treeNodeState, setTreeNodeState] = useState({
        visible: false
    })

    const dataTypeChange = (value) => {
        console.log(value)
        filterState.dataType = value;
        setFilterState({ ...filterState })
    }

    const temp = useRef();
    //页面大小变化
    const onWindowResize = useCallback(() => {
        let tableHeight = document.body.clientHeight - GlobalSetting.HeaderHeight - 160;
        state.scrollY = tableHeight - 50;
        state.tableHeight = tableHeight;
        setState({ ...state })
    }, [state]);

    const refTable = useRef('');

    useEffect(() => {
        refTable.current = tableName;
        console.log(refTable.current)
    }, [])

    useEffect(() => {
        temp.current && window.removeEventListener('resize', temp.current)
        window.addEventListener('resize', onWindowResize)
        temp.current = onWindowResize;
        return () => window.removeEventListener('resize', temp.current)
    }, [onWindowResize]);

    useEffect(() => {
        if (tablePointList) {
            (tablePointList).forEach(element => {
                if (element.tableName === props.tableName) {
                    console.log(element)
                    state.pointList = element.pointList;
                    state.pagination.total = element.count;
                    state.pagination.pageSize = GlobalSetting.TablePointCountPerPage;
                    state.downPointList = [];
                    if (element.pointList && element.pointList.length > 0) {
                        state.pointList.forEach(element => {
                            state.downPointList.push({
                                TagName: element.TagName,
                                TagDesc: element.TagDesc,
                                TagUnit: element.TagUnit,
                                FullName: element.FullName,
                                CreateTime: moment(element.CreateTime).format("yyyy-MM-DD HH:mm:ss.SSS"),
                                UpperLimit: element.UpperLimit + "",
                                LowerLimit: element.LowerLimit + "",
                                Remark: element.Remark,
                                Extra: element.Extra,
                                Type: getDataTypeFromInt(element.Type) + "",
                                Value: element.Value + "",
                                Qualitie: getQualityFromInt(element.Qualitie) + "",
                                Time: element.Time
                            })
                        });
                    }
                    else {
                        state.downPointList.push({
                            TagName: '',
                            TagDesc: '',
                            TagUnit: '',
                            CreateTime: '',
                            UpperLimit: '',
                            LowerLimit: '',
                            Type: '',
                            Value: '',
                            Qualitie: '',
                        })
                    }
                }
            });
        }
        else {
            state.pointList = [];
        }
        console.log(tablePointList)
        let tableHeight = document.body.clientHeight - GlobalSetting.HeaderHeight - 160;
        state.scrollY = tableHeight - 50;
        state.tableHeight = tableHeight;
        setState({ ...state })
    }, [tablePointList])



    //标签筛选
    const tagFilterChange = (e) => {
        setFilterState({ ...filterState, tagFilter: e.target.value })
    }
    //描述筛选
    const descFilterChange = (e) => {
        setFilterState({ ...filterState, descFilter: e.target.value })
    }
    //置数
    const setValueClick = (record) => {
        state.setValueModalVis = true;
        state.record = record;
        setState({ ...state });
    }

    //隐藏置数面板
    const hideSetValueModal = () => {
        state.setValueModalVis = false;
        setState({ ...state });
    }

    const columns = [
        {
            title: 'id',
            dataIndex: '$id',
            width: 50,
            ellipsis: true,
        },
        {
            title: '标签',
            dataIndex: 'TagName',
            width: onlyRead ? 250 : 350,
            ellipsis: true,
            sorter: (a, b) => {
                if (a.TagName > b.TagName)
                    return 1;
                else if (a.TagName < b.TagName)
                    return -1;
                else return 0;
            }
        },
        {
            title: '描述',
            dataIndex: 'TagDesc',
            width: onlyRead ? 250 : 200,
            ellipsis: true,
            editable: true,// onlyRead ? false : true,
            render: (text) => {
                if (text == undefined)
                    return "";
                if (text == null)
                    return "";
                else
                    return text
            }
        },
        {
            title: '值',
            dataIndex: 'Value',
            width: 100,
            ellipsis: true,
            render: (text, row) => {
                if (text == undefined)
                    return "";
                else
                    return row.Type === 0 ? Number(text): (text + "");
            }
        },
        {
            title: '单位',
            dataIndex: 'TagUnit',
            width: 60,
            ellipsis: true,
            editable: onlyRead ? false : true
        },
        {
            title: '时间戳',
            dataIndex: 'Time',
            width: 200,
            render: (text) => {
                if (text) {
                    let dt = moment(text);
                    return dt.format("yyyy-MM-DD HH:mm:ss.SSS")
                }
                else
                    return text;
            },
            ellipsis: true,
        },
        {
            title: '质量码',
            dataIndex: 'Qualitie',
            width: 100,
            render: (text) => {
                if (window.localStorage['qulityType'] == 1) {
                    return text;
                }
                else {
                    let title = "";
                    Quality.map((elem) => {
                        if (elem.value + "" == text)
                            title = elem.title;
                    })
                    if (title == "")
                        return text;
                    return title;
                }
            },
        },
        {
            title: '数据类型',
            dataIndex: 'Type',
            width: 100,
            render: (text) => {
                let title = "";
                DataType.map((elem) => {
                    if (elem.value + "" == text)
                        title = elem.title;
                })
                return title;
            }
        },
        {
            title: "操作",
            dataIndex: 'TagName',
            editable: false,
            width: onlyRead ? 0 : 80,
            render: (text, record) => {
                if (onlyRead)
                    return <div></div>;
                else return <Space size='middle'>
                    <Tooltip title="历史数据" placement='bottom' color={'gray'}>
                        <HistoryOutlined style={{ fontSize: '1.5em' }}
                            onClick={() => { console.log(pointHisList); props.openHistory(record.FullName) }}>
                        </HistoryOutlined>
                    </Tooltip>
                    <Tooltip title="趋势" placement='bottom' color={'gray'}>
                        <LineChartOutlined style={{ fontSize: '1.5em' }}
                            onClick={() => { props.openTrend(record, pointTrendList) }}>
                        </LineChartOutlined>
                    </Tooltip>
                    {/*<Tooltip title="置数" placement='bottom' color={'gray'}>
                        <VerticalAlignBottomOutlined style={{ fontSize: '1.5em' }}
                            onClick={() => { setValueClick(record) }}>
                        </VerticalAlignBottomOutlined>
                    </Tooltip>*/}
                </Space>
            }
        },
        {
            title: '创建时间',
            dataIndex: 'CreateTime',
            width: 200,
            ellipsis: true,
            editable: false,
            render: (text) => {
                if (text) {
                    let dt = moment(text);
                    return dt.format("yyyy-MM-DD HH:mm:ss.SSS")
                }
                else
                    return text;
            },
        },
        {
            title: '上限',
            dataIndex: 'UpperLimit',
            width: 100,
            editable: onlyRead ? false : true
        },
        {
            title: '下限',
            dataIndex: 'LowerLimit',
            width: 100,
            editable: onlyRead ? false : true
        },
        {
            title: '备注',
            dataIndex: 'Remark',
            width: 100,
            ellipsis: true,
            editable: onlyRead ? false : true
        },
    ];
    //定时器
    UseInterval(() => {
        freshTableSnapList({ tableName: tableName })
    }, 2000)
    //添加测点
    const AddPoint = () => {
        state.modalVis = true;
        setState({ ...state })
    }
    //删除测点
    const RemovePoints = () => {
        if (!state.selectedRows || state.selectedRows.length <= 0) {
            alert("请至少选择一个测点!");
            return;
        }
        confirm({
            content: "确认删除测点吗?",
            okText: '确定',
            cancelText: '取消',
            onOk() {
                let tagArray = [];
                state.selectedRows.forEach(element => {
                    tagArray.push(element.FullName);
                });
                removePoints({ pointNames: tagArray, tableName: props.tableName });
                state.selectedRowKeys = [];
                setState({ ...state })
            },
            onCancel() {

            },
        });
    }
    //重新加载测点
    const ReloadPoints = () => {
        let con = { TableName: tableName, TagDesc: filterState.descFilter, TagName: filterState.tagFilter, Type: filterState.dataType };
        searchPointsCount({ condition: con });
        let start = (state.pageNo - 1) * GlobalSetting.TablePointCountPerPage;
        searchInBatches({ condition: con, start: start, count: GlobalSetting.TablePointCountPerPage });
    }



    const modalOk = (e) => {
        state.modalVis = false;
        state.selectedRowKeys = [];
        setState({ ...state })
    }
    const modalCancel = (e) => {
        state.modalVis = false;
        setState({ ...state })
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
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const handleSave = (row) => {
        console.log(row)
        let newRow = { ...row };
        newRow.Time = moment(row.Time).format("yyyy-MM-DD HH:mm:ss.SSS");
        newRow.CreateTime = moment(row.CreateTime).format("yyyy-MM-DD HH:mm:ss.SSS");
        console.log("newRow:", newRow)
        if (newRow.UpperLimit < newRow.LowerLimit) {
            alert("测点上限不能小于下限!");
            return;
        }
        updatePoints({ pointInfos: [newRow], tableName: tableName })
    };
    const actcolumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });

    //获得表全部测点信息
    const getAllPointInfo = (event, done) => {
        let con = { TableName: tableName, TagDesc: filterState.descFilter, TagName: filterState.tagFilter, Type: filterState.dataType };
        let data = { condition: con, start: 0, count: 100000 };
        fetch(GetBaseUrl() + 'DataAdapter/Point.SearchInBatches', {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'Token': '',
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
        })
            .then((res) => {
                const response = res.json();
                response.then((data) => {
                    if (!data) {
                        return;
                    }

                    if (data.StatusCode === 400) {
                        console.log('请求错误 ' + data.Error);
                        return;
                    }

                    findAllPointInfo({ tagNames: data['Result'] }, done)
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }
    //查找所有点信息
    const findAllPointInfo = (data, done) => {

        fetch(GetBaseUrl() + 'DataAdapter/Point.findpoints', {
            body: JSON.stringify(data),
            headers: {
                'content-type': 'application/json',
                'Token': '',
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
        })
            .then((res) => {

                const response = res.json();
                response.then((resdata) => {
                    if (!resdata) {
                        return;
                    }

                    if (resdata.StatusCode === 400) {
                        console.log('请求错误 ' + resdata.Error);
                        return;
                    }

                    findAllPointSnap(data, done, resdata['Result'])
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }
    const downFile = useCallback(
        (data) => {
            console.log(data)
            const parser = new Parser();
            if (!data) {
                data = [];
                data.push({
                    TagName: '',
                    TagDesc: '',
                    TagUnit: '',
                    CreateTime: '',
                    UpperLimit: '',
                    LowerLimit: '',
                    Type: '',
                    Value: '',
                    Qualitie: '',
                })
            }
            if (data) {
                const csvData = parser.parse(data);
                const blob = new Blob(['\uFEFF' + csvData], {
                    type: 'text/plain;charset=utf8;',
                });
                FileSaver.saveAs(blob, tableName + '.csv');
            }
        },
        [tableName]
    );
    //查找所有点快照
    const findAllPointSnap = (sdata, done, resdata) => {

        fetch(GetBaseUrl() + 'DataAdapter/Snapshot.GetSnapshots', {
            body: JSON.stringify(sdata),
            headers: {
                'content-type': 'application/json',
                'Token': '',
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
        })
            .then((res) => {

                const response = res.json();
                response.then((data) => {
                    if (!data) {
                        return;
                    }
                    if (data.StatusCode === 400) {
                        console.log('请求错误 ' + data.Error);
                        return;
                    }
                    let snapData = data['Result'];
                    if (snapData && resdata.length != snapData.length) {
                        console.log('测点信息数据与快照数据数量不一致');
                        return;
                    }
                    let index = 0;
                    if (resdata)
                        resdata.forEach(element => {
                            if (!element)
                                return;
                            if (element.TagName == "")
                                return;
                            delete element.TableName;
                            element.Value = snapData[index] ? snapData[index].Value : "";
                            element.Qualitie = snapData[index] ? getQualityFromInt(snapData[index].Qualitie) : "";
                            element.Type = getDataTypeFromInt(element.Type);
                            element.Time =  snapData[index]? snapData[index].Time : "";
                            element.CreateTime = moment(element.CreateTime).format("yyyy-MM-DD HH:mm:ss.SSS")
                            index++;
                        });
                    downFile(resdata);

                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    //添加测点到目录树
    const moveToTreeNode = () => {
        setTreeNodeState({ ...treeNodeState, visible: true })
    }

    const uploadFile = (data) => {
        document.getElementById('uploadPointFile').value = '';
        const uploadField = [
            {
                key: 'TagName',
                type: 'string',
                require: true,
            },
            {
                key: 'Type',
                type: 'string',
                require: true,
            },
            {
                key: 'TagDesc',
                type: 'string',
                require: false,
            },
            {
                key: 'TagUnit',
                type: 'string',
                require: false,
            },
            {
                key: 'UpperLimit',
                type: 'float',
                require: false,
            },
            {
                key: 'LowerLimit',
                type: 'float',
                require: false,
            },
        ];
        console.log('tableName', curTable);
        let tableName = curTable;
        const uploadData = [];
        for (let i = 0; i < data.length; i++) {
            const uploadRow = {};
            for (let j = 0; j < uploadField.length; j++) {
                const field = uploadField[j];
                const key = field['key'];
                let value = data[i][key];

                if (field['require']) {
                    if (value == null) {
                        setErrorMessage(`第${++i}行的${key}不能为空`);
                        return;
                    }
                }
                if (value !== null && value !== undefined) {
                    if (key == 'Type') {
                        value = getDataTypeFromString(value);
                    }
                    else if (field['type'] === 'string') {
                        value = value.toString();
                    } else if (field['type'] === 'float') {
                        value = parseFloat(value);
                    }
                }
                uploadRow[key] = value;
            }
            uploadRow.TagName = `${uploadRow.TagName}`;
            uploadRow.Remark = '';
            uploadData.push({ ...uploadRow, TableName: tableName });
        }
        setLoading(true);
        insertPoints({ points: uploadData, tableName: tableName });
        setLoading(false);
    }
    const setTreeNodeVisible = (visible) => {
        setTreeNodeState({ ...treeNodeState, visible: visible })
    }
    const setAllValueClick = () => {

        if (!state.selectedRows || state.selectedRows.length <= 0) {
            alert("请至少选择一个测点!");
            return;
        }
        state.setAllValueVis = true;
        setState({ ...state })
    }
    const setAllValueCancel = () => {
        state.setAllValueVis = false;
        setState({ ...state })
    }
    const setAllValue = (value, qulity) => {
        if (!state.selectedRows)
            return;
        let datas = [];

        state.selectedRows.forEach((elem) => {
            datas.push({
                Type: elem.Type,
                TagFullName: elem.FullName,
                Value: value,
                Time: moment().format('yyyy-MM-DD HH:mm:ss.SSS'),
                Qualitie: qulity,
            })
        })
        putSnapshots({
            datas: datas
        })
        state.setAllValueVis = false;
        setState({ ...state })
    }

    const toggleQulityClick = () => {
        let vv = window.localStorage['qulityType'];
        if (vv == 0 || vv == undefined) {
            window.localStorage['qulityType'] = 1;
        }
        else {
            window.localStorage['qulityType'] = 0;
        }
        setState({ ...state })
    }

    const getQualityButtonDesc = () => {
        let vv = window.localStorage['qulityType'];
        if (vv == 0 || vv == undefined) {
            return "质量码显示为数字";
        }
        else {
            return "质量码显示为描述";
        }
    }

    return <div style={{ margin: '0px 5px' }}>
        <Space>

            <Tooltip title="添加测点" placement='bottom' color={'gray'}>
                <Button type='primary' icon={<PlusOutlined />} disabled={onlyRead} onClick={AddPoint}></Button>
            </Tooltip>
            <Tooltip title="删除测点" placement='bottom' color={'gray'}>
                <Button type='primary' icon={<DeleteOutlined />} disabled={onlyRead} onClick={RemovePoints}></Button>
            </Tooltip>
            <Tooltip title="刷新" placement='bottom' color={'gray'}>
                <Button type='primary' icon={<ReloadOutlined />} onClick={ReloadPoints}></Button>
            </Tooltip>
            <Tooltip title="导出本页测点" placement='bottom' color={'gray'}>
                <CSVLink data={state.downPointList} filename={tableName + ".csv"} >
                    <Button type='primary' icon={<ArrowDownOutlined></ArrowDownOutlined>} >
                    </Button>
                </CSVLink>
            </Tooltip>
            <Tooltip title="导出全部测点" placement='bottom' color={'gray'}>
                <Button type='primary' icon={<DownloadOutlined></DownloadOutlined>}
                    onClick={getAllPointInfo}>
                </Button>
            </Tooltip>
            <Tooltip title="导入测点" placement='bottom' color={'gray'}>
                {!onlyRead ? <div className='import-button'>
                    <CSVReader style={{}}
                        disabled={onlyRead}
                        label={<UploadOutlined style={{ color: 'white', fontSize: '1.08em', cursor: 'pointer' }}></UploadOutlined>}
                        fileEncoding='gbk'
                        onFileLoaded={(data, fileInfo) => { uploadFile(data, refTable.current); console.log('tableName', refTable.current) }}
                        onError={(error) => console.log(error)}
                        parserOptions={{
                            header: true,
                            dynamicTyping: true,
                            skipEmptyLines: true,
                            // transformHeader: (header) =>
                            //   header.toLowerCase().replace(/\W/g, '_'),
                        }}
                        inputId='uploadPointFile'
                        inputStyle={{ display: 'none' }}
                    >
                    </CSVReader>
                </div> : null}
            </Tooltip>
            {/*<Tooltip title="移动到目录树" placement='bottom' color={'gray'}>
                <Button type='primary' icon={<ArrowRightOutlined />}
                    onClick={moveToTreeNode} disabled={onlyRead} >
                </Button>
            </Tooltip>*/}
            <Input placeholder="筛选标签,*为通配符" value={filterState.tagFilter}
                onChange={tagFilterChange}
                onPressEnter={filterSearch}
            ></Input>
            <Input placeholder="筛选描述,*为通配符" value={filterState.descFilter} onChange={descFilterChange}
                onPressEnter={filterSearch}></Input>
            <Select value={filterState.dataType} onChange={dataTypeChange} style={{ width: '130px' }}>
                <Option value={-1}>所有测点</Option>
                <Option value={-2}>所有模拟量</Option>
                <Option value={-4}>所有浮点数</Option>
                <Option value={-5}>所有整型</Option>
                <Option value={0}>布尔</Option>
                <Option value={13}>字符串</Option>
            </Select>
            <Button type='primary' icon={<SearchOutlined />} onClick={filterSearch}></Button>
            <span>总计:{state.pagination.total}</span>
            <Button type='primary' onClick={setAllValueClick} >选中置数</Button>
            <Button type='primary' onClick={toggleQulityClick} >{getQualityButtonDesc()}</Button>
        </Space>
        <div style={{ margin: '5px' }}></div>
        <div style={{ border: '1px solid whitesmoke' }}>
            <Spin spinning={state.loading} style={{ width: '100%' }}>
                <ResizeTable
                    components={components}
                    style={{ margin: '10px 10px', height: state.tableHeight }}
                    columns={actcolumns}
                    dataSource={state.pointList}
                    rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                    }}
                    scroll={{ x: 1000, y: state.scrollY }}
                    size='small'
                    pagination={false}
                    onRow={record => {
                        return {
                            onClick: event => { }, // 点击行
                            onDoubleClick: event => {

                            },
                            onContextMenu: event => { },
                            onMouseEnter: event => { }, // 鼠标移入行
                            onMouseLeave: event => { },
                        };
                    }}
                ></ResizeTable>
            </Spin >
        </div>
        <div style={{ margin: "5px 0px " }}>
            <Pagination {...state.pagination} showSizeChanger={false} current={state.pageNo}
                onChange={pageChange}
                size="small">
            </Pagination>
        </div>
        <PointInfoModal visible={state.modalVis}
            modalOk={modalOk}
            modalCancel={modalCancel}
            mode={state.mode}
            tableName={props.tableName}
            record={state.record}>
        </PointInfoModal>
        <SetOneValueModal
            visible={state.setValueModalVis}
            record={state.record}
            closeModal={hideSetValueModal}>
        </SetOneValueModal>
        <TreeNodeModal visible={treeNodeState.visible}
            setVisible={setTreeNodeVisible}
            selectedRows={state.selectedRows}>
        </TreeNodeModal>
        <SetValueModal visible={state.setAllValueVis} oper={setAllValue} oncancel={setAllValueCancel}></SetValueModal>
    </div>
}

export default TableContent;