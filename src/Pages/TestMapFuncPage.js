import React, { Component, useState } from 'react';

import { Input, Space, Button } from 'antd'
import { hostIp, hostPort, setHostIp, setHostPort } from '../Common/BaseUrl'
import moment from 'moment'

const { TextArea } = Input;

function getUrl(ip, port) {
    let url = "http://" + hostIp + ":" + hostPort + "/";
    return url;
}
//测试地图页面
function TestMapFuncPage() {

    const [state, setState] = useState({
        method: "/api/map_data/floor_index?floor_id=57",
        parm: '{}',
        result: ""
    })
    const sendButtonClick = () => {
        let url = 'https://test-easy.mall-to.com';
        fetch(url + state.method, {
            //body:state.parm,
            headers: {
                'content-type': 'application/json',
                'UUID': '1008',
                'App-Id': '999',
                'Timestamp': moment().format("YYYY-MM-DD hh:mm:ss"),
                'Accept': 'application/json',
                'Signature-Version': '999'
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
        })
            .then((res) => {
                const response = res.json();
                response.then((data) => {
                    state.result = JSON.stringify(data, null, "\t");
                    setState({ ...state })
                })
            })
            .catch((e) => {
                console.log(e);
                state.result = e;
                setState({ ...state })
            });
    }
    const methodChange = (e) => {
        state.method = e.target.value;
        setState({ ...state })
    }
    const parmChange = (e) => {
        state.parm = e.target.value;
        setState({ ...state })
    }
    const inputWidth = '500px';
    return <div>
        <div style={{ marginBottom: '10px' }}>
            <Space><span>函数:</span><Input style={{ width: inputWidth }}
                value={state.method} onChange={methodChange}>
            </Input></Space>
        </div>
        <div style={{ marginBottom: '10px' }}>
            <Space><span>参数:</span><TextArea style={{ width: inputWidth, height: '300px' }}
                value={state.parm} onChange={parmChange}
            ></TextArea></Space>
        </div>
        <div style={{ marginBottom: '10px' }}>
            <Button style={{ marginLeft: '450px' }} type='primary'
                onClick={sendButtonClick}
            >发送</Button>
        </div>
        <div style={{ marginBottom: '10px' }}>
            <Space><span>结果:</span><TextArea style={{ width: inputWidth, height: '300px' }}
                value={state.result}
            ></TextArea></Space>
        </div>
    </div>
}

export default TestMapFuncPage;