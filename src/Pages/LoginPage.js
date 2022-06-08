import React, { Component, useCallback, useEffect, useRef, useState } from 'react';

import { Form, Input, Button, Alert, Space, Popover, List } from 'antd';
import { useStoreActions, useStoreState } from 'easy-peasy';
import request from '../Store/request';
import BackImage from '../Assets/back.jpg'
import { hostIp, hostPort, setHostIp, setHostPort } from '../Common/BaseUrl'
import { WindowsFilled } from '@ant-design/icons';
import { HistoryOutlined } from '@ant-design/icons';
 

import '../Styles/login.css'
import { JsxEmit } from 'typescript';

const layout = {
    labelCol: {
        span: 24,
    },
    wrapperCol: {
        span: 24,
    },
};


const LoginPage = (props) => {

    const [alertState, setAlertState] = useState({ showAlert: false, alertMessage: "" });

    const setUserName = useStoreActions((actions) => actions.common.setUserName);
    const setToken = useStoreActions((actions) => actions.common.setToken);
    /*const hostIp = useStoreState((state) => state.database.hostIp);
    const hostPort = useStoreState((state) => state.database.hostPort);
    const setHostIp = useStoreActions((actions) => actions.database.setHostIp);
    const setHostPort = useStoreActions((actions) => actions.database.setHostPort);*/

    const setAlert = useCallback((msg) => {
        setAlertState({ ...alertState, showAlert: true, alertMessage: msg + "" })
    }, [alertState])

    const [state, setState] = useState({
        hisHostMenuVis: false,
        ip: '127.0.0.1',
        port: '21801'
    })


    function getUrl(ip, port) {
        let url = "http://" + ip + ":" + port + "/";
        return url;
    }
    const saveIpPort = () => {
        if (window.localStorage) {
            var storage = window.localStorage;
            // 1、写入a字段
            storage['hostIp'] = hostIp;
            storage['hostPort'] = hostPort;
        }
    }
    //登录
    const onFinish = values => {
        //console.log(values);
        setHostIp(values.ip);
        setHostPort(values.port);
        fetch(getUrl(values.ip,values.port) + 'AuthService/Auth.Login', {
            body: JSON.stringify({ ...values, type: 0 }),
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
                    console.log(data)
                    if (data.StatusCode === 200 && data['Result'].Token) {
                        saveIpPort();
                        setUserName(values.username)
                        setToken(data['Result'].Token)

                        var storage = window.localStorage;
                        storage['userName'] = values.username

                        //保存历史记录
                        var history = storage['history'];
                        let arr = [];
                        if (history) {
                            arr = JSON.parse(history);
                        }
                        let find = false;
                        arr.forEach(element => {
                            if (element.ip == values.ip && element.port == values.port)
                                find = true;
                        });
                        if (!find)
                            arr.push({ ip: values.ip, port: values.port });
                        storage['history'] = JSON.stringify(arr);
                        props.history.push('main')
                    }
                    else {
                        if (data.Error)
                            setAlert(data.Error)
                        else
                            setAlert(data);
                    }
                });
            })
            .catch((e) => {
                console.log(e);
                setAlert(e)
            });


        /*  new Promise((resolve, reject) => {
              const response = request(
                  'AuthService/Auth.Login', { ...values, type: 0 }
              );
              console.log(response)
              resolve(response);
          }).then((response) => {
              if (response && response['StatusCode'] === 200
                  && response['Result'].Token) {
                  console.log(response['Result'])
                  setUserName(response['Result'].UserName)
                  props.history.push('main')
              }
              else {
                  console.log(response)
                  if(response.Error)
                  setAlertState({ ...alertState, showAlert: true, AlertInfo: response.Error })
                  else 
                  setAlertState({ ...alertState, showAlert: true, AlertInfo: response })
              }
          },  // 成功
              (err) => {
                  console.log(err)
                  setAlertState({ ...alertState, showAlert: true, AlertInfo: err })
              } // 失败
          )*/
    };

    //失败
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    const [bodyState, setBodyState] = useState({
        clientHeight: null
    })
    const init = useRef();
    useEffect(() => {
        if (!init.current) {
            init.current = true;
            bodyState.clientHeight = document.body.clientHeight;
            console.log(bodyState.clientHeight)
            setBodyState({ ...bodyState })
        }
    }, [])

    const ipChange = (e) => {
        //setHostIp(e.target.value)
        setState({ ...state, ip: e.target.value })
    }
    const portChange = (e) => {
        //setHostPort(e.target.value)
        setState({ ...state, port: e.target.value })
    }

    const [ipport] = Form.useForm();
    //选择历史地址，刷新到输入框
    const itemClick = (e) => {
        console.log(e)
        // setHostIp(e.ip);
        //setHostPort(e.port);
        ipport.setFieldsValue({
            ip:e.ip,
            port:e.port
        });
        setState({ ...state, hisHostMenuVis: false })
    }

    const hisHostMenu = () => {
        let arrstr = window.localStorage['history'];
        if(!arrstr)
        return null;
        let arr = JSON.parse(arrstr);
        if (!arr)
            return;
        return <List>
            {arr.map((elem) => {
                return <List.Item className='hostItem' key={JSON.stringify(elem)} onClick={() => itemClick(elem)}>
                    {elem.ip}:{elem.port}
                </List.Item>
            })}
        </List>
    }

    const handleHisMenuVisChange = (vis) => {
        setState({ ...state, hisHostMenuVis: vis })
    }
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100vh', backgroundImage: `url(${BackImage})`,
            backgroundSize: '100%'
        }}>
            <div style={{
                backgroundColor: 'white', width: '500px', height: '420px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>

                <div className='loginForm' style={{ backgroundColor: 'white', width: '400px', height: '350px' }}>
                    <div style={{
                        fontSize: '30px', fontFamily: '微软雅黑', color: 'black',
                        marginRight: '30px', textAlign: 'center', marginBottom: '20px'
                    }}>{window.globalConfig.loginTitle}</div>
                    <Form
                        name="basic"
                        initialValues={{
                            remember: true,
                            ip: "127.0.0.1",
                            port: 21801,
                            username: 'admin'
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        form={ipport}>

                        <Form.Item
                            label="地址"
                            name="ip"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        >
                            <Input addonAfter={
                                <Popover content={hisHostMenu} placement='bottom'
                                    onVisibleChange={handleHisMenuVisChange}
                                    trigger="click" visible={state.hisHostMenuVis} >
                                    <HistoryOutlined />
                                </Popover>}
                                onChange={ipChange} />
                        </Form.Item>

                        <Form.Item
                            label="端口"
                            name="port"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                            ]}
                        >
                            <Input value={hostPort} onChange={portChange} />
                        </Form.Item>
                        <Form.Item
                            label="用户"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入用户名!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="密码"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码!',
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        {/*<Form.Item {...tailLayout} name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                   */}
                        <Space direction='vertical'>
                            {alertState.showAlert ? <Alert message={alertState.alertMessage} showIcon={true} type='warning' />
                                : <div></div>}
                            <Form.Item >
                                <Button type="primary" htmlType="submit" style={{ width: '400px', height: '40px' }}>登录</Button>
                            </Form.Item>
                        </Space>
                    </Form>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;