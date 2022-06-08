import { createStore, action, thunk, actionOn } from 'easy-peasy';
import request from './request';
import moment from 'moment'
import GlobalSetting from '../Pages/GlobalSetting';



const store = createStore({
    common: {
        //只读，不允许操作时序库
        onlyRead: false,
        //错误信息

        userName: undefined,
        token: undefined,
        setToken: action((state, token) => {
            state.token = token;
        }),
        setUserName: action((state, info) => {
            state.userName = info;
        }),
        login: thunk(async (actions, data, { getStoreState }) => {

            const response = await request(
                'AuthService/Auth.Login', data
            );
            console.log(response)
            if (response && response['StatusCode'] === 200) {
                let token = response['Result'].Token;
                actions.setToken(token);
                actions.setUserName(response['Result'].UserNam)
            }
            return response;
        }),
    },
    //信息
    message: {
        successMessage: undefined,
        setSuccessMessage: action((state, info) => {
            state.successMessage = info;
        }),
        errorMessage: undefined,
        setErrorMessage: action((state, info) => {
            state.errorMessage = info;
        }),
    },
    alarm: {
        //alarm system
        deleteAlarmSystem: thunk(async (actions, data, { getStoreActions, getStoreState }) => {
            let state = getStoreState();
            console.log(state.common.token)
            const response = await request(
                'AlarmService/AlarmSystem.DeleteSystem', data, state.common.token
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.setAlarmSystemList();
                action.message.setSuccessMessage("删除报警系统成功!")
            }
            else {
                action.message.setErrorMessage("删除报警系统失败!")
            }

        }),
        updateAlarmSystem: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'AlarmService/AlarmSystem.UpdateSystem', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.setAlarmSystemList();
                action.message.setSuccessMessage("更新报警系统成功!")
            }
            else {
                action.message.setErrorMessage("更新报警系统失败!")
            }

        }),
        addAlarmSystem: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'AlarmService/AlarmSystem.InsertSystem', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.setAlarmSystemList();
                action.message.setSuccessMessage("添加报警系统成功!")
            }
            else {
                action.message.setErrorMessage("添加报警系统失败!")
            }
        }),
        alarmSystemList: undefined,
        setAlarmSystemList: action((state, info) => {
            state.alarmSystemList = info;
        }),
        getAlarmSystemList: thunk(async (actions, data) => {
            const response = await request(
                'AlarmService/AlarmSystem.GetSystem', data
            );

            if (response && response['StatusCode'] === 200) {
                let list = response['Result'];
                console.log(list)
                actions.setAlarmSystemList(list);
            }
            return response;
        }),
        //alarm level
        deleteAlarmLevel: thunk(async (actions, data, { getStoreActions, getStoreState }) => {
            let state = getStoreState();
            console.log(state.common.token)
            const response = await request(
                'AlarmService/AlarmLevel.DeleteLevel', data, state.common.token
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.setAlarmLevelList();
                action.message.setSuccessMessage("删除报警级别成功!")
            }
            else {
                action.message.setErrorMessage("删除报警级别失败!")
            }

        }),
        updateAlarmLevel: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'AlarmService/AlarmLevel.UpdateLevel', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.setAlarmLevelList();
                action.message.setSuccessMessage("更新报警级别成功!")
            }
            else {
                action.message.setErrorMessage("更新报警级别失败!")
            }

        }),
        addAlarmLevel: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'AlarmService/AlarmLevel.InsertLevel', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.setAlarmLevelList();
                action.message.setSuccessMessage("添加报警级别成功!")
            }
            else {
                action.message.setErrorMessage("添加报警级别失败!")
            }
        }),
        alarmLevelList: undefined,
        setAlarmLevelList: action((state, info) => {
            state.alarmLevelList = info;
        }),
        getAlarmLevelList: thunk(async (actions, data) => {
            const response = await request(
                'AlarmService/AlarmLevel.GetLevels', data
            );

            if (response && response['StatusCode'] === 200) {
                let list = response['Result'];
                console.log(list)
                actions.setAlarmLevelList(list);
            }
            return response;
        }),
        //alarm group
        deleteAlarmGroup: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'AlarmService/AlarmGroup.DeleteGroup', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.setAlarmGroupList();
                action.message.setSuccessMessage("删除报警组成功!")
            }
            else {
                action.message.setErrorMessage("删除报警组失败!")
            }

        }),
        updateAlarmGroup: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'AlarmService/AlarmGroup.UpdateGroup', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.setAlarmGroupList();
                action.message.setSuccessMessage("更新报警组成功!")
            }
            else {
                action.message.setErrorMessage("更新报警组失败!")
            }

        }),
        addAlarmGroup: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'AlarmService/AlarmGroup.InsertGroup', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.setAlarmGroupList();
                action.message.setSuccessMessage("添加报警组成功!")
            }
            else {
                action.message.setErrorMessage("添加报警组失败!")
            }
        }),
        alarmGroupList: undefined,
        setAlarmGroupList: action((state, info) => {
            state.alarmGroupList = info;
        }),
        getAlarmGroupList: thunk(async (actions, data) => {
            const response = await request(
                'AlarmService/AlarmGroup.GetGroups', data
            );

            if (response && response['StatusCode'] === 200) {
                let list = response['Result'];
                console.log(list)
                actions.setAlarmGroupList(list);
            }
            return response;
        }),
        //alarm area
        deleteAlarmArea: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'AlarmService/AlarmArea.DeleteArea', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.getAlarmAreaList();
                action.message.setSuccessMessage("删除区域成功!")
            }
            else {
                action.message.setErrorMessage("删除区域失败!")
            }

        }),
        updateAlarmArea: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'AlarmService/AlarmArea.UpdateArea', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.getAlarmAreaList();
                action.message.setSuccessMessage("更新区域成功!")
            }
            else {
                action.message.setErrorMessage("更新区域失败!")
            }

        }),
        addAlarmArea: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'AlarmService/AlarmArea.InsertArea', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {

                actions.getAlarmAreaList();
                action.message.setSuccessMessage("添加区域成功!")
            }
            else {
                action.message.setErrorMessage("添加区域失败!")
            }
        }),
        alarmAreaList: undefined,
        setAlarmAreaList: action((state, info) => {
            state.alarmAreaList = info;
        }),
        getAlarmAreaList: thunk(async (actions, data) => {
            const response = await request(
                'AlarmService/AlarmArea.GetAreas', data
            );

            if (response && response['StatusCode'] === 200) {
                let arr = new Array();
                response['Result'].map((element, index) => {
                    arr.push({ ...element, children: [], title: element.area_name, key: element.id })
                });
                //actArr 用于新增报警页面的区域
                let actArr = [];
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].parent_id > 0) {
                        for (let j = 0; j < arr.length; j++) {
                            if (arr[i].parent_id === arr[j].id) {
                                arr[j].children.push(arr[i]);
                            }
                        }
                    }
                    else {
                        actArr.push(arr[i]);
                    }
                }
                actions.setAlarmAreaList(actArr);
            }
            return response;
        }),
    },
    deviceTree: {
        //datatype
        addDataType: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'DeviceTreeService/DeviceDataType.Add', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.getDataTypeList({});
                action.message.setSuccessMessage('数据类型添加成功!');
            }
            return response;
        }),
        deleteDataType: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'DeviceTreeService/DeviceDataType.Delete', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.getDataTypeList({});
                action.message.setSuccessMessage('数据类型删除成功!');
            }
            return response;
        }),

        dataTypeList: undefined,
        setDataTypeList: action((state, info) => {
            state.dataTypeList = info;
        }),
        getDataTypeList: thunk(async (actions, data) => {
            const response = await request(
                'DeviceTreeService/DeviceDataType.GetList', data
            );

            if (response && response['StatusCode'] === 200) {
                actions.setDataTypeList(response['Result'])
            }
            return response;
        }),

        // tag
        addTag: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'DeviceTreeService/DeviceTag.Add', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                action.message.setSuccessMessage('节点添加标签成功!');
            }
            return response;
        }),
        changeDataType: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'DeviceTreeService/DeviceTag.ChangeDataType', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                action.message.setSuccessMessage('修改数据类型成功!');
            }
            else {
                action.message.setErrorMessage('修改数据类型失败!');
            }
            return response;
        }),
        searchData: undefined,
        setSearchData: action((state, info) => {
            state.searchData = info;
        }),
        tagList: [],
        setTagList: action((state, info) => {
            state.tagList = info;
        }),
        deleteTag: thunk(async (actions, data, { getState, getStoreActions }) => {
            const response = await request(
                'DeviceTreeService/DeviceTag.Delete', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                let state = getState();
                let data = state.searchData;
                actions.searchTag(data);
                action.message.setSuccessMessage('删除标签成功!');
            }
            return response;
        }),
        searchTag: thunk(async (actions, data, { getStoreState }) => {
            const response = await request(
                'DeviceTreeService/DeviceTag.Search', data
            );

            if (response && response['StatusCode'] === 200) {
                let tagList = response['Result'];
                if (tagList == null) {
                    actions.setSearchData(data)
                    actions.setTagList([])
                    return;
                }
                tagList.forEach(element => {
                    element.key = element.id;
                });
                actions.setTagList(tagList)
                actions.setSearchData(data)
            }
            return response;
        }),
        // canculate
        canculateInfo: undefined,
        setCanculateInfo: action((state, info) => {
            state.canculateInfo = info;
        }),

        getCanculateInfo: thunk(async (actions, data, { getStoreActions }) => {

            const response = await request(
                'DeviceTreeService/DeviceTree.GetCanculateInfo', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.setCanculateInfo(response['Result']);
            }
            return response;
        }),
        //node
        addNode: thunk(async (actions, data, { getStoreActions }) => {

            const response = await request(
                'DeviceTreeService/DeviceTree.Add', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.getNodeList();
                action.message.setSuccessMessage('添加节点成功!');
            }
            else {
                action.message.setErrorMessage('添加节点失败!');
            }
            return response;
        }),
        deleteNode: thunk(async (actions, data, { getStoreActions }) => {

            const response = await request(
                'DeviceTreeService/DeviceTree.Delete', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.getNodeList();
                action.message.setSuccessMessage('删除节点成功!');
            }
            return response;
        }),
        updateNode: thunk(async (actions, data, { getStoreActions }) => {

            const response = await request(
                'DeviceTreeService/DeviceTree.Update', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.getNodeList();
                action.message.setSuccessMessage('修改节点成功!');
            }
            return response;
        }),
        createNodeTable: thunk(async (actions, data, { getStoreActions }) => {

            const response = await request(
                'DeviceTreeService/DeviceTree.CreateNodeTable', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                action.message.setSuccessMessage('创建节点数据表成功!');
            }
            return response;
        }),
        startNodeCanculate: thunk(async (actions, data, { getStoreActions }) => {

            const response = await request(
                'DeviceTreeService/DeviceTree.startCanculate', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                action.message.setSuccessMessage('节点启动计算成功!');
            }
            return response;
        }),
        stopNodeCanculate: thunk(async (actions, data, { getStoreActions }) => {

            const response = await request(
                'DeviceTreeService/DeviceTree.stopCanculate', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                action.message.setSuccessMessage('节点停止计算成功!');
            }
            return response;
        }),
        nodeList: null,
        setNodeList: action((state, info) => {
            state.nodeList = info;
        }),
        getNodeList: thunk(async (actions, data, { getStoreState }) => {

            const response = await request(
                'DeviceTreeService/DeviceTree.GetList', data
            )
            console.log(response)
            if (response && response['StatusCode'] === 200) {
                let nodeList = response['Result'];
                actions.setNodeList(nodeList)
            }
            return response;
        }),
    },
    database: {

        reset: thunk(async (actions, data, { getState }) => {
            let state = getState();
            state.pointHisList = [];
            state.pointTrendDataList = [];
            state.pointHistoryList = [];
            state.pointTrendList = [];
            state.tableList = [];
            state.tablePointList = [];
            state.tagList = [];
        }),

        //当前表
        curTable:'',
        setCurTable:action((state, info) => {
            //console.log(info)
            state.curTable = info;
        }),
        //表列表
        tableList: [],
        setTableList: action((state, info) => {
            //console.log(info)
            state.tableList = info;
        }),
        //删除表
        deleteTable: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'DataAdapter/Table.DeleteTable', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.getAllTables();
                action.message.setSuccessMessage("删除表成功!");
            }
            else action.message.setErrorMessage("删除表失败!");
        }),
        //添加表
        appendTable: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'DataAdapter/Table.AppendTable', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.getAllTables();
                action.message.setSuccessMessage("添加表成功!");
            }
            else {
                action.message.setErrorMessage(response);
            }
        }),
        //获取所有表
        getAllTables: thunk(async (actions, data, { getState }) => {
            const response = await request('DataAdapter/Table.GetAllTables', data
            );
            if (response && response['StatusCode'] === 200) {
                let arr = response['Result'];
                if (!arr)
                    return;
                let child = [];
                arr.forEach((element, index) => {
                    child.push({ title: element.TableName, key: element.TableName , isLeaf: true });
                })
                //let newArr = [{ title: "表", key: "-1", isLeaf: false, children: child }];

                actions.setTableList(child)
            }
        }),


        tablePointList: [],
        //获取某表的信息
        getTablePoint: action((state, tableName) => {
            let elem = undefined;
            (state.tablePointList).forEach(element => {
                if (element.tableName == tableName) {
                    elem = element;
                }
            });
            return elem;
        }),
        //关闭页面时，删除页面数据
        removeTablePoint: action((state, title) => {
            state.tablePointList = state.tablePointList.filter(tp => tp.tableName !== title);
        }),
        //设定表测点信息列表
        setTablePointInfoList: action((state, info) => {
            if (!info)
                return;
            let find = false;
            (state.tablePointList).forEach(element => {
                if (element.tableName == info.tableName) {
                    element.pointList = info.pointList;
                    element.condition = info.condition;
                    element.start = info.start;
                    element.tagNames = info.tagNames;
                    find = true;
                }
            });

            if (!find)
                state.tablePointList.push(info);
        }),

        //设定测点个数
        setTablePointCount: action((state, info) => {
            if (!info)
                return;
            let find = false;
            (state.tablePointList).forEach(element => {
                if (element.tableName == info.tableName) {
                    element.count = info.count;
                    find = true;
                }
            });
            if (!find) {
                state.tablePointList.push(info)
            }
        }),
        //设定测点快照值
        setTablePointValueList: action((state, info) => {
            if (!info)
                return;
            if (info == null)
                return;
            if (info.valueList == null)
                return;
            (state.tablePointList).forEach(element => {
                if (element.tableName == info.tableName) {
                    let index = 0;
                    if (element.pointList.length === info.valueList.length) {
                        element.pointList.forEach(element => {
                            if (info.valueList[index] != null) {
                                element.Value = info.valueList[index].Value;
                                element.Time = info.valueList[index].Time;
                                element.Qualitie = info.valueList[index].Qualitie;
                            }
                            index++;
                        });
                    }
                }
            });
        }),
        //获取测点列表个数
        searchPointsCount: thunk(async (actions, data) => {
            const response = await request(
                'DataAdapter/Point.SearchPointsCount', data
            );

            console.log(data)
            if (response && response['StatusCode'] === 200) {
                console.log(response)
                actions.setTablePointCount({ tableName: data.condition.TableName, count: response['Result'] })
            }
        }),
        //获取测点列表
        searchInBatches: thunk(async (actions, data) => {

            const response = await request(
                'DataAdapter/Point.SearchInBatches', data
            );

            if (response && response['StatusCode'] === 200) {
                let points = response['Result'];

                if (!points) {
                    actions.setTablePointInfoList({
                        tableName: data.tableName, pointList: [], condition: data.condition,
                        start: data.start, tagNames: data.tagNames
                    })
                    return;
                }
                let actPoints = points.filter((elem) => {
                    return elem != undefined
                });

                actions.getSearchPointInfoList({
                    tagNames: actPoints, tableName: data.condition.TableName,
                    start: data.start, condition: data.condition
                })

            }
        }),

        //获取测点信息列表
        getSearchPointInfoList: thunk(async (actions, data) => {
            const response = await request(
                'DataAdapter/point.findpoints', data
            );

            if (response && response['StatusCode'] === 200) {
                let arr = new Array();
                if (!response['Result']) {
                    actions.setTablePointInfoList({
                        tableName: data.tableName, pointList: [], condition: data.condition,
                        start: data.start, tagNames: data.tagNames
                    })
                    return;
                }
                let ar = response['Result'];
                ar = ar.filter((a) => a != null)
                ar = ar.sort(function (a, b) {
                    return moment(b.CreateTime) - moment(a.CreateTime)
                });
                let tagNames = [];
                ar.map((element, index) => {
                    if (element) {
                        tagNames.push(element.FullName)
                        arr.push({ ...element, $id: index + data.start, key: index })
                    }
                });

                actions.setTablePointInfoList({
                    tableName: data.tableName, pointList: arr, condition: data.condition,
                    start: data.start, tagNames: tagNames
                })

                actions.getPointSnapList({ tableName: data.tableName, tagNames: tagNames })
            }
            return response;
        }),
        //刷新表的快照
        freshTableSnapList: thunk((actions, data, { getState }) => {
            if (!data)
                return;
            if (!data.tableName)
                return;
            let state = getState();
            (state.tablePointList).forEach(element => {
                if (element.tableName == data.tableName) {
                    let data = {
                        tagNames: element.tagNames, tableName: element.tableName,
                    };
                    //console.log(data)
                    actions.getPointSnapList(data);
                }
            });
        }),
        //获取快照值
        getPointSnapList: thunk(async (actions, data) => {
            const response = await request(
                'DataAdapter/Snapshot.GetSnapshots', data
            );
            // console.log(response)
            if (response && response['StatusCode'] === 200) {
                actions.setTablePointValueList({ tableName: data.tableName, valueList: response['Result'] })
            }
        }),
        //设置快照
        putSnapshots: thunk(async (actions, data) => {
            const response = await request(
                'DataAdapter/Snapshot.PutSnapshots', data
            );
            // console.log(response)
            if (response && response['StatusCode'] === 200) {

            }
        }),

        //打开的测点历史数据列表
        pointHisList: [],
        setPointHisList:action((state, info) => {
            state.pointHisList=info;
        }),
        removePointHistory:thunk(async (actions, pointName,{getState}) => {
            let state=getState()
            let arr= state.pointHisList.filter(tp => tp !== pointName);
            console.log(arr)
            state.pointHisList.splice(state.pointHisList.indexOf(pointName),1)
            state.pointHistoryList = state.pointHistoryList.filter(elem => elem.pointName !== pointName);
        }),
        addPointHistory: thunk(async (actions, pointName,{getState}) => {
            
            let state=getState();
            state.pointHisList.push(pointName)
        }),
        //打开的测点趋势列表
        pointTrendList: [],
        pointTrendDataList: [],
        //获取历史绘图值数据
        getPlotValues: thunk(async (actions, data) => {
            const response = await request(
                'DataAdapter/History.GetPlotValues', data
            );

            if (response && response['StatusCode'] === 200) {
                let valueList = response['Result'];
                let newValueList = [];
                valueList.forEach(element => {
                    if (element && element.Value)
                        newValueList.push(element);
                });
                actions.setPointTrendDataList({ pointName: data.tagName, tagDesc: data.tagDesc, valueList: newValueList });
            }
        }),
        //设置绘图数据
        setPointTrendDataList: action((state, info) => {
            if (!info)
                return;

            let find = false;
            (state.pointTrendDataList).forEach(element => {
                if (element.pointName == "trend-" + info.pointName) {
                    if (info && info.valueList)
                        info.valueList.forEach(element => {
                            element.Time = moment(element.Time).format("yyyy-MM-DD HH:mm:ss");
                        });
                    element.valueList = info.valueList;
                    find = true;
                }
            });
            if (find)
                return;
            state.pointTrendDataList.push({ pointName: "trend-" + info.pointName, valueList: info.valueList });
        }),
        removePointTrend: thunk(async (actions, pointName,{getState}) => {
            let state=getState()
            state.pointTrendDataList = state.pointTrendDataList.filter(elem => elem.pointName !== pointName);
            state.pointTrendList.splice(state.pointTrendList.indexOf(pointName),1);
        }),
        addPointTrend: thunk(async (actions, pointName,{getState}) => {
            console.log(pointName)
            let state=getState();
            state.pointTrendList.push(pointName)
        }),
        //历史数据列表
        pointHistoryList: [],

        //获取历史存储值数据
        getArchivedValues: thunk(async (actions, data) => {
            const response = await request(
                'DataAdapter/History.GetArchivedValues', data
            );
            if (response && response['StatusCode'] === 200) {
                let valueList = response['Result'];
                let id = 0;
                valueList.forEach(element => {
                    element.id = id;
                    id++;
                });
                actions.setPointHistoryList({ pointName: data.tagName, valueList: valueList });
            }
        }),
        //获取历史等间隔插值数据
        getIntervalValues: thunk(async (actions, data) => {
            const response = await request(
                'DataAdapter/History.GetIntervalValues', data
            );
            if (response && response['StatusCode'] === 200) {
                let valueList = response['Result'];
                let id = 0;
                valueList.forEach(element => {
                    if (element)
                        element.id = id;
                    id++;
                });
                actions.setPointHistoryList({ pointName: data.tagName, valueList: valueList });
            }
        }),
        //获取历史时间段统计值
        getNumberSummary: thunk(async (actions, data) => {
            const response = await request(
                'DataAdapter/History.getNumberSummary', data
            );
            if (response && response['StatusCode'] === 200) {
                let value = response['Result'];
                let valueList = [];
                let id = 0;
                valueList.push({ id: 0, Type: '最大值', Value: value.Max })
                valueList.push({ id: 1, Type: '最小值', Value: value.Min })
                valueList.push({ id: 2, Type: '算术平均值', Value: value.Avg })
                //valueList.push({ id: 3, Type: '加权平均值', Value: value.PowerAvg })
                valueList.push({ id: 3, Type: '累积值', Value: value.Total })
                actions.setPointHistoryList({ pointName: data.tagName, valueList: valueList });
            }
        }),
        //获取历史时间段统计值
        getNumberSummaryInBatches: thunk(async (actions, data) => {
            const response = await request(
                'DataAdapter/History.getNumberSummaryInBatches', data
            );
            if (response && response['StatusCode'] === 200) {
                let valueList = response['Result'];
                let id = 0;
                valueList.forEach(element => {
                    element.id = id;
                    element.Time = element.StartTime;
                    id++;
                });

                actions.setPointHistoryList({ pointName: data.tagName, valueList: valueList });
            }
        }),

        //设置历史数据
        setPointHistoryList: action((state, info) => {
            if (!info)
                return;

            let find = false;
            (state.pointHistoryList).forEach(element => {
                if (element.pointName == info.pointName) {
                    element.valueList = info.valueList;
                    find = true;
                }
            });
            if (find)
                return;
            state.pointHistoryList.push({ pointName: info.pointName, valueList: info.valueList });
        }),
        //刷新测点信息
        freshTablePoint: thunk((actions, data, { getState }) => {
            let state = getState();
            (state.tablePointList).forEach(element => {
                if (element.tableName == data.tableName) {
                    if (data.isFreshPoints) {//刷新测点列表
                        actions.searchPointsCount({ condition: element.condition })
                        actions.searchInBatches({
                            condition: element.condition, start: element.start,
                            count: GlobalSetting.TablePointCountPerPage
                        })
                    }
                    else {//只刷新测点信息
                        let data = {
                            condition: element.condition, start: element.start,
                            tagNames: element.tagNames, tableName: element.tableName,
                        };
                        actions.getSearchPointInfoList(data);
                    }
                }
            });
        }),
        //添加测点
        insertPoint: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'DataAdapter/Point.InsertPoint', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                if(response['Result'])
                {
                  //isFreshPoints：是否刷新测点列表
                  actions.freshTablePoint({ tableName: data.tableName, isFreshPoints: true });
                  action.message.setSuccessMessage("添加测点成功!")
                }
                else 
                {
                    action.message.setErrorMessage("添加测点失败!测点名称重复!")
                }
            }
            else 
            {
                action.message.setErrorMessage("添加测点失败!")
            }
        }),
        //删除测点
        removePoints: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'DataAdapter/Point.RemovePoints', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                //isFreshPoints：是否刷新测点列表
                actions.freshTablePoint({ tableName: data.tableName, isFreshPoints: true });
                action.message.setSuccessMessage("删除测点成功!");
            }
        }),

        //更新测点信息
        updatePoints: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'DataAdapter/Point.UpdatePoints', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                //isFreshPoints：是否刷新测点列表
                actions.freshTablePoint({ tableName: data.tableName, isFreshPoints: false });
                action.message.setSuccessMessage("更新测点成功!");
            }
        }),
        //更新测点信息
        insertPoints: thunk(async (actions, data, { getStoreActions }) => {
            const response = await request(
                'DataAdapter/Point.InsertPoints', data
            );
            let action = getStoreActions();
            if (response && response['StatusCode'] === 200) {
                actions.freshTablePoint({ tableName: data.tableName, isFreshPoints: true })
                action.message.setSuccessMessage("添加测点成功!");
            }
        }),
    }
});

export default store;