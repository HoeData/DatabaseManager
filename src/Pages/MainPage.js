import React, { useEffect, useState, useRef, useCallback } from 'react';

import { Layout, Tree, Tabs, Divider, Space, Modal, Input, message, Row, Col, Tooltip } from 'antd';
import { useStoreActions, useStoreState } from 'easy-peasy';
import TableContent from './TableContent';
import PointHistory from './PointHistory';
import GlobalSetting from './GlobalSetting';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
    ReloadOutlined, DeleteOutlined, PlusOutlined, CopyOutlined, CloseCircleOutlined,
    LogoutOutlined, FileOutlined, LineChartOutlined, HistoryOutlined, CloseOutlined
} from '@ant-design/icons';
import AppendTableModal from './AppendTableModal';
import copy from 'copy-to-clipboard';
import PointTrend from './PointTrend';
import PointTrendEcharts from './PointTrendEcharts';
import TestFuncPage from './TestFuncPage';
import TestMapPage from './TestMapPage';
import TestMapFuncPage from './TestMapFuncPage';
import TreeEditPage from '../DeviceTree/TreeEditPage';
import DataTypePage from '../DeviceTree/DataTypePage';
import AlarmAreaEditPage from '../Alarm/AlarmAreaEditPage';
import AlarmGroupEditPage from '../Alarm/AlarmGroupEditPage';
import AlarmLevelEditPage from '../Alarm/AlarmLevelEditPage';
import AlarmSystemEditPage from '../Alarm/AlarmSystemEditPage';

import { hostIp, hostPort, setHostIp, setHostPort } from '../Common/BaseUrl';

import { DndProvider, useDrag, useDrop } from 'react-dnd';

import '../Styles/main.css'

import { HTML5Backend } from 'react-dnd-html5-backend';

const { Header, Footer, Sider, Content } = Layout;
const { DirectoryTree } = Tree;
 
const { TabPane } = Tabs;
const { confirm } = Modal;

//主页面
function MainPage(props) {

    const getAllTables = useStoreActions((actions) => actions.database.getAllTables);
    const deleteTable = useStoreActions((actions) => actions.database.deleteTable);

    const errorMessageDatabase = useStoreState((state) => state.database.errorMessage);
    const setErrorMessageDatabase = useStoreActions((actions) => actions.database.setErrorMessage);

    const searchInBatches = useStoreActions((actions) => actions.database.searchInBatches);
    const searchPointsCount = useStoreActions((actions) => actions.database.searchPointsCount);
    const tableList = useStoreState((state) => state.database.tableList);
    const tablePointList = useStoreState((state) => state.database.tablePointList);
    const removeTablePoint = useStoreActions((actions) => actions.database.removeTablePoint);
    const removePointHistory = useStoreActions((actions) => actions.database.removePointHistory);
    const pointHisList = useStoreState((state) => state.database.pointHisList);

    const addPointHistory = useStoreActions((actions) => actions.database.addPointHistory);

    const pointTrendList = useStoreState((state) => state.database.pointTrendList);
    const pointTrendDataList = useStoreState((state) => state.database.pointTrendDataList);
    const removePointTrend = useStoreActions((actions) => actions.database.removePointTrend);
    const addPointTrend = useStoreActions((actions) => actions.database.addPointTrend);
    const onlyRead = useStoreState((state) => state.common.onlyRead);
    const reset = useStoreActions((actions) => actions.database.reset);

    const errorMessage = useStoreState((state) => state.message.errorMessage);
    const setErrorMessage = useStoreActions((actions) => actions.message.setErrorMessage);

    const successMessage = useStoreState((state) => state.message.successMessage);
    const setSuccessMessage = useStoreActions((actions) => actions.message.setSuccessMessage);

    const setCurTable = useStoreActions((actions) => actions.database.setCurTable);

    const userName = useStoreState((state) => state.database.userName);

    const [treeState, setTreeState] = useState({
        activeKey: undefined,
        expandedKeys: [],
        appendTableModalVisable: false,
        treeHeight: 1000,
    });
    const [filterState, setFilterState] = useState({
        tableFilter: "",
        filterTableList: []
    })
    const [menuState, setMenuState] = useState({
        menuMouseX: null,
        menuMouseY: null,
        menuKey: null,
        deleteTableMenuDisable: false,
        addTableMenuDisable: false,
    })
    const [tabMenuState, setTabMenuState] = useState({
        menuMouseX: null,
        menuMouseY: null,
        menuKey: null,
        deleteTableMenuDisable: false,
        addTableMenuDisable: false,
        tab: null
    })

    const panes = useRef([]);


    const onSelect = (keys, event) => {
        //console.log('Trigger Select', keys, event);
    };

    const onExpand = (v) => {
        let arr = [];
        v.forEach((elem) => {
            arr.push(elem)
        })
        treeState.expandedKeys = arr;
        setTreeState({ ...treeState })
        console.log(v)
    };
    const alarmAreaEditPage = "alarmAreaEditPage";
    const alarmGroupEditPage = "alarmGroupEditPage";
    const alarmSystemEditPage = "alarmSystemEditPage";
    const alarmLevelEditPage = "alarmLevelEditPage";
    const testMapFuncPage = "testMapFuncPage";
    const testMapPage = "testMapPage";
    //双击打开页面
    const dbClick = (e, info) => {
        let find = false;
        if (info.title.indexOf("表(") >= 0)
            return;
        panes.current.forEach(element => {
            if (element.key === 'TestPage' && info.key == 'TestPage') {
                treeState.activeKey = "TestPage"
                setTreeState({ ...treeState })
                find = true;
            }
            else if (element.key === testMapFuncPage && info.key == testMapFuncPage) {
                treeState.activeKey = testMapFuncPage
                setTreeState({ ...treeState })
                find = true;
            }
            else if (element.key === testMapPage && info.key == testMapPage) {
                treeState.activeKey = testMapPage
                setTreeState({ ...treeState })
                find = true;
            }
            else if (element.key === 'TreeEdit' && info.key == 'TreeEdit') {
                treeState.activeKey = "TreeEdit"
                setTreeState({ ...treeState })
                find = true;
            }
            else if (element.key === 'DataTypeEdit' && info.key == 'DataTypeEdit') {
                treeState.activeKey = "DataTypeEdit"
                setTreeState({ ...treeState })
                find = true;
            }
            else if (element.key === alarmAreaEditPage && info.key == alarmAreaEditPage) {
                treeState.activeKey = alarmAreaEditPage
                setTreeState({ ...treeState })
                find = true;
            }
            else if (element.key === alarmGroupEditPage && info.key == alarmGroupEditPage) {
                treeState.activeKey = alarmGroupEditPage
                setTreeState({ ...treeState })
                find = true;
            }
            else if (element.key === alarmSystemEditPage && info.key == alarmSystemEditPage) {
                treeState.activeKey = alarmSystemEditPage
                setTreeState({ ...treeState })
                find = true;
            }
        });
        if (find)
            return;
        if (info.key == "TestPage") //测试页面
        {
            panes.current.push({
                title: "接口测试页面", key: "TestPage", closable: true,
                content: <TestFuncPage ></TestFuncPage>
            });
            treeState.activeKey = "TestPage"
            setTreeState({ ...treeState })
            return;
        }
        /*else if (info.key == testMapPage) //测试地图页面
        {
            panes.current.push({
                title: "测试地图页面", key: testMapPage, closable: true,
                content: <TestMapPage ></TestMapPage>
            });
            treeState.activeKey = testMapPage
            setTreeState({ ...treeState })
            return;
        }   
        else if (info.key == testMapFuncPage) //测试地图接口页面
        {
            panes.current.push({
                title: "测试地图接口页面", key: testMapFuncPage, closable: true,
                content: <TestMapFuncPage ></TestMapFuncPage>
            });
            treeState.activeKey = testMapFuncPage
            setTreeState({ ...treeState })
            return;
        }*/
        else if (info.key == "TreeEdit") //树目录编辑
        {
            panes.current.push({
                title: "树目录编辑", key: "TreeEdit", closable: true,
                content: <TreeEditPage ></TreeEditPage>
            });
            treeState.activeKey = "TreeEdit"
            setTreeState({ ...treeState })
            return;
        }
        else if (info.key == "DataTypeEdit") //数据类型编辑
        {
            panes.current.push({
                title: "数据类型编辑", key: "DataTypeEdit", closable: true,
                content: <DataTypePage ></DataTypePage>
            });
            treeState.activeKey = "DataTypeEdit"
            setTreeState({ ...treeState })
            return;
        }
        else if (info.key == alarmAreaEditPage) //报警区域编辑
        {
            panes.current.push({
                title: "报警区域编辑", key: alarmAreaEditPage, closable: true,
                content: <AlarmAreaEditPage ></AlarmAreaEditPage>
            });
            treeState.activeKey = alarmAreaEditPage
            setTreeState({ ...treeState })
            return;
        }
        else if (info.key == alarmGroupEditPage) //报警组编辑
        {
            panes.current.push({
                title: "报警组编辑", key: alarmGroupEditPage, closable: true,
                content: <AlarmGroupEditPage ></AlarmGroupEditPage>
            });
            treeState.activeKey = alarmGroupEditPage
            setTreeState({ ...treeState })
            return;
        }
        else if (info.key == alarmSystemEditPage) //报警组编辑
        {
            panes.current.push({
                title: "报警系统编辑", key: alarmSystemEditPage, closable: true,
                content: <AlarmSystemEditPage ></AlarmSystemEditPage>
            });
            treeState.activeKey = alarmSystemEditPage
            setTreeState({ ...treeState })
            return;
        }
        else if (info.key == alarmLevelEditPage) //报警级别编辑
        {
            panes.current.push({
                title: "报警级别编辑", key: alarmLevelEditPage, closable: true,
                content: <AlarmLevelEditPage ></AlarmLevelEditPage>
            });
            treeState.activeKey = alarmLevelEditPage
            setTreeState({ ...treeState })
            return;
        }
        console.log(info);
        openPage({ key: info.key, title: info.title });
    }

    //打开测点趋势面板
    const openTrend = useCallback((record, pointTrendList) => {

        let find = false;
        (pointTrendList).forEach(element => {
            if (element === "trend-" + record.FullName) {
                treeState.activeKey = "trend-" + record.FullName;
                setTreeState({ ...treeState });
                find = true;
            }
        });

        if (find)
            return;
        panes.current.push({
            title: record.FullName, key: "trend-" + record.FullName, closable: true, name: "trend-" + record.FullName,
            type: 'trend',
            content: <PointTrendEcharts {...record} ></PointTrendEcharts>
        });
        addPointTrend("trend-" + record.FullName)
        console.log(pointTrendList)
        treeState.activeKey = "trend-" + record.FullName;
        setTreeState({ ...treeState })
    }, [pointTrendList, treeState, addPointTrend])
    //打开测点历史数据面板
    const openHistory = (pointName) => {

        let find = false;

        (pointHisList).forEach(element => {

            if (element === pointName) {
                treeState.activeKey = pointName;
                setTreeState({ ...treeState });
                find = true;
            }
        });

        if (find)
            return;
        panes.current.push({
            title: pointName, key: pointName, closable: true, type: 'hisdata', name: pointName,
            content: <PointHistory pointName={pointName} ></PointHistory>
        });
        addPointHistory(pointName)
        let length = pointHisList.length;

        treeState.activeKey = pointName;
        setTreeState({ ...treeState })
    }

    //打开页面
    const openPage = (info) => {
        //已打开
        // console.log(tablePointList)
        let find = false;
        (tablePointList).forEach(element => {
            if (element.tableName === info.title) {
                treeState.activeKey = info.key;
                setTreeState({ ...treeState });
                find = true;
            }
        });

        if (find)
            return;
        setCurTable(info.title)
        panes.current.push({
            title: info.title, key: info.key, closable: true, type: 'page', name: info.title,
            content: <TableContent tableName={info.title}
                openHistory={openHistory}
                openTrend={openTrend}
            >
            </TableContent>
        });
        let con = { TableName: info.title, TagDesc: "*", TagName: "*", Type: -1 };
        searchPointsCount({ condition: con });
        searchInBatches({ condition: con, start: 0, count: GlobalSetting.TablePointCountPerPage });
        treeState.activeKey = info.key;
        setTreeState({ ...treeState })
    }
    const generateList = () => {
        let dataList = [];
        for (let i = 0; i < tableList.length; i++) {
            const node = tableList[i];
            const { key, title } = node;
            let ind = title.indexOf(filterState.tableFilter);
            if (filterState.tableFilter && ind < 0) {
                continue;
            }
            else {
                dataList.push(node);
            }
        }
        let newArr = []
        /*{ title: "报警系统编辑", key: alarmSystemEditPage, isLeaf: true },
        { title: "报警级别编辑", key: alarmLevelEditPage, isLeaf: true },
        { title: "报警组编辑", key: alarmGroupEditPage, isLeaf: true },
        { title: "报警区域编辑", key: alarmAreaEditPage, isLeaf: true },
        { title: "接口测试页面", key: "TestPage", isLeaf: true },
    { title: "树目录编辑", key: "TreeEdit", isLeaf: true },
    { title: "数据类型编辑", key: "DataTypeEdit", isLeaf: true },];*/
        if (onlyRead)
            newArr = [];
        newArr.push({ title: "表(" + dataList.length + ")", key: "-1", isLeaf: false, children: dataList });
        return newArr;
    };

    const onWindowResize = useCallback(() => {
        treeState.treeHeight = document.body.clientHeight - GlobalSetting.HeaderHeight - 50;
        setTreeState({ ...treeState })
    }, [treeState]);
    //重新加载
    const freshIpPort = () => {
        //读取记录的ip和端口
        if (window.localStorage) {
            let localStorage = window.localStorage;
            setHostIp(localStorage['hostIp']);
            setHostPort(localStorage['hostPort']);
            console.log("reload " + localStorage['hostIp'])
        }
    }
    const temp = useRef();
    useEffect(() => {
        temp.current && window.removeEventListener('resize', temp.current)
        window.addEventListener('resize', onWindowResize)
        temp.current = onWindowResize;
        freshIpPort();

        console.log('get all tables')
        return () => window.removeEventListener('resize', temp.current)
    }, [onWindowResize]);

    useEffect(() => {
        getAllTables();
    }, [])

    useEffect(() => {
        if (successMessage)
            message.success(successMessage, onclose = () => {
                setSuccessMessage(undefined)
            });
    }, [successMessage])


    useEffect(() => {
        if (tableList) {
            treeState.expandedKeys = ["-1"]
            console.log('useeff')
        }
        treeState.treeHeight = document.body.clientHeight - GlobalSetting.HeaderHeight - 50;
    }, [tableList])

    useEffect(() => {
        console.log(pointTrendList)
    }, [pointTrendList])

    useEffect(() => {
        if (tableList) {
            filterState.filterTableList = generateList();
            console.log(filterState.filterTableList)
        }

        setFilterState({ ...filterState })

    }, [tableList, filterState.tableFilter])

    useEffect(() => {
        if (errorMessage) {
            message.error(errorMessage, onclose = () => {
                setErrorMessage(undefined)
            });
        }
    }, [errorMessage])

    //切换tab
    const onChange = activeKey => {
        tableList.forEach((elem) => {
            if (elem.key == activeKey) {
                console.log('cur table', elem.title)
                setCurTable(elem.title)
            }
        })
        treeState.activeKey = activeKey;
        setTreeState({ ...treeState });
    };



    const onEdit = (targetKey, action) => {
        if (action == 'remove') {
            remove(targetKey)
        }
    };

    //关闭tab
    const remove = targetKey => {

        let { activeKey } = treeState;
        let lastIndex;
        let removeName;
        panes.current.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
                removeName = pane.name;
            }
        });
        if (!removeName)
            return;
        if (removeName.indexOf("trend-") >= 0)
            removePointTrend(removeName);
        else
            removePointHistory(removeName);
        //console.log(pointHisList)
        removeTablePoint(removeName);


        panes.current = panes.current.filter(pane => pane.key !== targetKey);

        if (panes.current.length && activeKey === targetKey) {
            if (lastIndex >= 0) {
                treeState.activeKey = panes.current[lastIndex].key;
            } else {
                treeState.activeKey = panes.current[0].key;
            }
        }
        setTreeState({ ...treeState });
    };

    const hideMenu = () => {
        setMenuState({ ...menuState, menuMouseX: null, menuMouseY: null });
    }

    //关闭菜单
    const handleMenuClose = () => {
        hideMenu();
    };
    //关闭tab菜单
    const handleTabMenuClose = () => {
        setTabMenuState({ ...tabMenuState, menuMouseX: null, menuMouseY: null });
    };
    //添加表
    const addTableClick = () => {
        setAppendTableModalVisible(true);
        setMenuState({ ...menuState, menuMouseX: null, menuMouseY: null });
    }
    //重新获取表列表
    const freshTableClick = () => {
        getAllTables({});
        hideMenu();
    }
    //复制表名
    const copyTableNameClick = () => {
        hideMenu();
        copy(menuState.menuKey)
    }
    //删除表
    const deleteTableClick = () => {
        hideMenu();
        confirm({
            content: "确认删除表" + menuState.menuKey + "吗?",
            okText: '确定',
            cancelText: '取消',
            onOk() {
                deleteTable({ tableName: menuState.menuKey })
                removeTablePoint(menuState.menuKey);
                panes.current = panes.current.filter(pane => pane.title !== menuState.menuKey);
                setTreeState({ ...treeState })
            },
            onCancel() {

            },
        });
    }
    //树右键弹出菜单
    const tableTreeNodeRightClick = (e) => {
        if (onlyRead)
            return;
        if (e.node.key < 0)//表文件夹节点
        {
            menuState.deleteTableMenuDisable = true;
        }
        else {
            menuState.deleteTableMenuDisable = false;
        }
        setMenuState({
            ...menuState,
            menuKey: e.node.title,
            menuMouseY: e.event.pageY,
            menuMouseX: e.event.pageX
        })
    }

    //tab点击右键
    const tabContextMenu = (e, panel) => {
        e.preventDefault();
        setTabMenuState({
            ...menuState,
            menuKey: "test",
            tab: panel,
            menuMouseY: e.pageY,
            menuMouseX: e.pageX
        })
    }

    //显示隐藏添加表面板
    const setAppendTableModalVisible = (v) => {
        setTreeState({ ...treeState, appendTableModalVisable: v })
    }
    //筛选表
    const tableFilterChange = (e) => {

        setFilterState({ ...filterState, tableFilter: e.target.value })
    }
    const logoutClick = () => {
        reset();
        props.history.push('/');
    }
    //关闭所有的tab页
    const closeAllTabClick = () => {
        panes.current.forEach((pane, i) => {
            let removeName = pane.name;
            if (removeName.indexOf("trend-") >= 0)
                removePointTrend(removeName);
            else
                removePointHistory(removeName);
            //console.log(pointHisList)
            removeTablePoint(removeName);
        });

        while (panes.current.length > 0)
            panes.current.pop();
        handleTabMenuClose();
    }
    //关闭其它的tab页
    const closeOtherTabClick = (e) => {
        console.log('other:',tabMenuState.tab)
        panes.current.forEach((pane, i) => {
            if (pane.key != tabMenuState.tab.key) {
                let removeName = pane.name;
                if (removeName.indexOf("trend-") >= 0)
                    removePointTrend(removeName);
                else
                    removePointHistory(removeName);
                //console.log(pointHisList)
                removeTablePoint(removeName);
            }
        });
      
        panes.current=panes.current.filter(pane => pane.key === tabMenuState.tab.key) 
        setTabMenuState({...tabMenuState,tab:null})      
        handleTabMenuClose();
    }

    //拖动 tab
    const type = 'DraggableTabNode';
    const DraggableTabNode = ({ index, children, moveNode }) => {
        const ref = useRef(null);
        const [{ isOver, dropClassName }, drop] = useDrop({
          accept: type,
          collect: (monitor) => {
            const { index: dragIndex } = monitor.getItem() || {};
      
            if (dragIndex === index) {
              return {};
            }
      
            return {
              isOver: monitor.isOver(),
              dropClassName: 'dropping',
            };
          },
          drop: (item) => {
            moveNode(item.index, index);
          },
        });
        const [, drag] = useDrag({
          type,
          item: {
            index,
          },
          collect: (monitor) => ({
            isDragging: monitor.isDragging(),
          }),
        });
        drop(drag(ref));
        return (
          <div
            ref={ref}
            style={{
              marginRight: 0,
            }}
            className={isOver ? dropClassName : ''}
          >
            {children}
          </div>
        );
      };
      
      const DraggableTabs = (props) => {
        const { children } = props;
        const [order, setOrder] = useState([]);
      
        const moveTabNode = (dragKey, hoverKey) => {
          const newOrder = order.slice();
          React.Children.forEach(children, (c) => {
            if (c.key && newOrder.indexOf(c.key) === -1) {
              newOrder.push(c.key);
            }
          });
          const dragIndex = newOrder.indexOf(dragKey);
          const hoverIndex = newOrder.indexOf(hoverKey);
          newOrder.splice(dragIndex, 1);
          newOrder.splice(hoverIndex, 0, dragKey);
          setOrder(newOrder);
        };
      
        const renderTabBar = (tabBarProps, DefaultTabBar) => (
          <DefaultTabBar {...tabBarProps}>
            {(node) => (
              <DraggableTabNode key={node.key} index={node.key} moveNode={moveTabNode}>
                {node}
              </DraggableTabNode>
            )}
          </DefaultTabBar>
        );
      
        const tabs = [];
        React.Children.forEach(children, (c) => {
          tabs.push(c);
        });
        const orderTabs = tabs.slice().sort((a, b) => {
          const orderA = order.indexOf(a.key);
          const orderB = order.indexOf(b.key);
      
          if (orderA !== -1 && orderB !== -1) {
            return orderA - orderB;
          }
      
          if (orderA !== -1) {
            return -1;
          }
      
          if (orderB !== -1) {
            return 1;
          }
      
          const ia = tabs.indexOf(a);
          const ib = tabs.indexOf(b);
          return ia - ib;
        });
        return (
          <DndProvider backend={HTML5Backend}>
            <Tabs renderTabBar={renderTabBar} {...props}>
              {orderTabs}
            </Tabs>
          </DndProvider>
        );
      };


    return <Layout >
        <Header style={{
            backgroundColor: 'rgb(24,31,41)', height: '50px',
            border: '1px solid whitesmoke',
        }}>
            <Row  >
                <Col span={18} style={{ height: '50px', display: 'flex', alignItems: 'center' }} >
                    <span style={{ fontSize: '20px', fontFamily: '微软雅黑', color: 'white', marginRight: '30px' }}>
                        {window.globalConfig.mainTitle}
                    </span>
                </Col>
                <Col span={6}  >
                    <div style={{
                        height: '45px', display: 'flex', alignItems: 'center',
                        alignContent: 'space-between', flexDirection: 'row', justifyContent: 'space-around'
                    }}>
                        <div style={{ fontSize: '14px', fontFamily: '微软雅黑', color: 'white' }}>
                            {hostIp}:{hostPort}
                        </div>
                        <div style={{ backgroundColor: 'rgb(56,76,103)', height: '45px', width: '1px', minWidth: '1px' }}>
                        </div>
                        <div style={{ fontSize: '14px', fontFamily: '微软雅黑', color: 'white', textOverflow: 'ellipsis' }}>
                            <span>{window.globalConfig.version}</span>
                        </div>
                        <div style={{ backgroundColor: 'rgb(56,76,103)', height: '45px', width: '1px', minWidth: '1px' }}>
                        </div>
                        <div style={{ fontSize: '14px', fontFamily: '微软雅黑', color: 'white' }}>
                            {window.localStorage['userName']}
                        </div>

                        <div style={{
                            fontSize: '14px', fontFamily: '微软雅黑', color: 'white', cursor: 'pointer',
                            display: 'flex', alignItems: 'center'
                        }} onClick={logoutClick}>
                            <Tooltip title="退出登录"> <LogoutOutlined rotate={-90} style={{ fontSize: '20px' }} /></Tooltip>

                        </div>
                    </div>
                </Col>
            </Row>
        </Header>
        <Layout style={{ backgroundColor: "white" }}>
            <Sider style={{ backgroundColor: "white" }}>
                <div style={{ margin: '5px', border: '1px solid whitesmoke', height: treeState.treeHeight }}>
                    <DirectoryTree
                        treeData={filterState.filterTableList ? filterState.filterTableList : [{ title: "表", key: "-1", isLeaf: false }]}
                        height={treeState.treeHeight}

                        onRightClick={tableTreeNodeRightClick}

                        expandedKeys={treeState.expandedKeys}
                        onDoubleClick={dbClick}
                        onSelect={onSelect}
                        onExpand={onExpand}
                    >
                    </DirectoryTree>
                    {/* tab菜单 */}
                    <Menu
                        keepMounted
                        open={tabMenuState.menuMouseY !== null}
                        onClose={handleTabMenuClose}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            tabMenuState.menuMouseY !== null && tabMenuState.menuMouseX !== null
                                ? { top: tabMenuState.menuMouseY, left: tabMenuState.menuMouseX }
                                : undefined
                        }
                    >
                        <MenuItem onClick={closeOtherTabClick} >
                            <Space>
                                <CloseCircleOutlined />
                                <span>关闭其它</span>
                            </Space>
                        </MenuItem>
                        <MenuItem onClick={closeAllTabClick} >
                            <Space>
                                <CloseOutlined />
                                <span>关闭全部</span>
                            </Space>
                        </MenuItem>
                    </Menu>
                    <Menu
                        keepMounted
                        open={menuState.menuMouseY !== null}
                        onClose={handleMenuClose}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            menuState.menuMouseY !== null && menuState.menuMouseX !== null
                                ? { top: menuState.menuMouseY, left: menuState.menuMouseX }
                                : undefined
                        }
                    >
                        <MenuItem onClick={addTableClick} disabled={menuState.addTableMenuDisable}>
                            <Space>
                                <PlusOutlined />
                                <span>添加表</span>
                            </Space>
                        </MenuItem>
                        <MenuItem onClick={deleteTableClick} disabled={menuState.deleteTableMenuDisable}>
                            <Space>
                                <DeleteOutlined />
                                <span>删除表</span>
                            </Space>
                        </MenuItem>
                        <MenuItem onClick={freshTableClick} disabled={menuState.freshTableMenuDisable}>
                            <Space>
                                <ReloadOutlined />
                                <span>刷新表</span>
                            </Space>
                        </MenuItem>
                        <MenuItem onClick={copyTableNameClick} disabled={menuState.deleteTableMenuDisable}>
                            <Space>
                                <CopyOutlined />
                                <span>复制表名</span>
                            </Space>
                        </MenuItem>
                    </Menu>
                    <AppendTableModal visible={treeState.appendTableModalVisable} setVisible={setAppendTableModalVisible}>

                    </AppendTableModal>
                </div>
                <div style={{ margin: '5px' }}>
                    <Input placeholder="筛选表" onChange={tableFilterChange}></Input>
                </div>
            </Sider>
            <Content style={{ backgroundColor: 'white', margin: '5px' }}>
                <Tabs
                    type="editable-card"
                    hideAdd
                    onChange={onChange}
                    activeKey={treeState.activeKey}
                    onEdit={onEdit}
                >
                    {panes.current.map(pane => (
                        <TabPane tab={
                            <span onContextMenu={(e) => tabContextMenu(e, pane)} style={{ maxWidth: '30px', width: '30px', textOverflow: 'ellipsis' }}>
                                {pane.type == 'page' ? <FileOutlined onContextMenu={(e) => tabContextMenu(e, pane)}  /> : null}
                                {pane.type == 'hisdata' ? <HistoryOutlined onContextMenu={(e) => tabContextMenu(e, pane)}  /> : null}
                                {pane.type == 'trend' ? <LineChartOutlined onContextMenu={(e) => tabContextMenu(e, pane)}  /> : null}
                                {pane.title.length > 15 ? <Tooltip title={pane.title}>
                                    <span style={{ maxWidth: '30px', width: '30px', textOverflow: 'ellipsis' }}
                                        onContextMenu={(e) => tabContextMenu(e, pane)}
                                    >
                                        {pane.title.substr(0, 12) + '...'}
                                    </span>
                                </Tooltip> :
                                    <span style={{ maxWidth: '30px', width: '30px', textOverflow: 'ellipsis' }}
                                        onContextMenu={(e) => tabContextMenu(e, pane)}>
                                        {pane.title}
                                    </span>
                                }
                            </span>
                        } key={pane.key} closable={pane.closable}>
                            {pane.content}
                        </TabPane>
                    ))}
                </Tabs>
            </Content>
        </Layout>
    </Layout>
}

export default MainPage;