import React, { Component, useEffect, useState } from 'react';
import { Input, Space, Select, Button, Modal, Alert, InputNumber } from 'antd';
import { DataType } from './DataType';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { IsChar, IsNumber } from '../Common/StringDeal';

const { Option } = Select;

function PointInfoModal(props) {
  let { visible, modalOk, modalCancel, mode, record, tableName } = props;
  const [state, setState] = useState({
    Type: 10,
    UpperLimit: 1000,
    LowerLimit: 0,
    TagName: '',
    TagDesc: '',
    TagUnit: '',
    Remark: '',
    Extra: '',
    TableName: tableName,
    CreateTime: '2020-11-10 0:0:0',
  });
  const insertPoint = useStoreActions(
    (actions) => actions.database.insertPoint
  );

  const changeType = (value) => {
    setState({ ...state, Type: value, UpperLimit: 1000, LowerLimit: 0 });
  };

  useEffect(() => {
    if (mode == 'edit') {
    } else {
      state.title = '添加测点';
    }
  });

  const getDataTypes = () => {
    return DataType.map((element, index) => {
      return (
        <Option value={element.value} key={element.value}>
          {element.title}
        </Option>
      );
    });
  };

  const alertClose = () => {
    state.alertVisible = false;
    state.alertMessage = '';
    setState({ ...state });
  };

  const onModalOkClick = () => {
    let tagName = state.TagName;
    if (!tagName) {
      state.alertVisible = true;
      state.alertMessage = '请填写测点名称！';
      setState({ ...state });
      return;
    }

    if (!IsChar(tagName[0])) {
      state.alertVisible = true;
      state.alertMessage = '测点名的首字符必须是字母！';
      setState({ ...state });
      return false;
    }
    if (tagName.length > 63) {
      state.alertVisible = true;
      state.alertMessage = '测点名字符个数不能大于64！';
      setState({ ...state });
      return false;
    }
    if (state.TagDesc.length > 255) {
      state.alertVisible = true;
      state.alertMessage = '测点描述字符个数不能大于255！';
      setState({ ...state });
      return false;
    }
    if (state.TagUnit.length > 255) {
      state.alertVisible = true;
      state.alertMessage = '测点单位字符个数不能大于255！';
      setState({ ...state });
      return false;
    }
    if (state.Remark.length > 255) {
      state.alertVisible = true;
      state.alertMessage = '测点备注字符个数不能大于255！';
      setState({ ...state });
      return false;
    }

    if (state.UpperLimit < state.LowerLimit) {
      state.alertVisible = true;
      state.alertMessage = '测点上限必须大于下限!';
      setState({ ...state });
      return false;
    }

    //检测上下限
    let r = CheckLimit();
    if (!r) return false;
    //表名必须由字符，数字和下划线组成
    for (let i = 0; i < tagName.length; i++) {
      console.log(tagName[i]);
      if (IsChar(tagName[i])) continue;
      if (IsNumber(tagName[i])) continue;
      if (tagName[i] == '_') continue;
      state.alertVisible = true;
      state.alertMessage = '测点名必须由字符，数字和下划线组成!';
      setState({ ...state });
      return false;
    }
    if (state.Type == 0) {
      //bool
      state.UpperLimit = 1;
      state.LowerLimit = 0;
    }
    insertPoint({ tableName: tableName, point: { ...state } });
    reset();
    modalOk();
  };

  const CheckLimit = () => {
    if (state.Type == 1) {
      //uint8 对应 byte
      return CheckUpLow(0, 255);
    } else if (state.Type == 2) {
      //int8 对应 sbyte
      return CheckUpLow(-128, 127);
    } else if (state.Type == 4) {
      //uint16 对应 uint16
      return CheckUpLow(0, 65535);
    } else if (state.Type == 5) {
      //int16 对应 int16
      return CheckUpLow(-32768, 32767);
    } else if (state.Type == 6) {
      //uint32 对应 uint32
      return CheckUpLow(0, 4294967295);
    } else if (state.Type == 7) {
      //int32 对应 int32
      return CheckUpLow(-2147483648, 2147483647);
    } else if (state.Type == 8) {
      //int64 对应 int64
      return CheckUpLow(-2147483648, 2147483647);
    } else if (state.Type == 8) {
      //int64 对应 int64
      return CheckUpLow(-9223372036854774808, 9223372036854774807);
    } else if (state.Type == 9) {
      //real16 对应 single
      return CheckUpLow(-3.402823e38, +3.402823e38);
    } else if (state.Type == 10) {
      //real32 对应 float
      return CheckUpLow(-3.402823e38, +3.402823e38);
    } else if (state.Type == 11) {
      //real64 对应 double
      return CheckUpLow(-1.79e308, +1.79e308);
    } else {
      return true;
    }
  };
  const CheckUpLow = (low, up) => {
    if (state.UpperLimit > up || state.UpperLimit < low) {
      state.alertVisible = true;
      state.alertMessage = '测点上限值超出范围!';
      setState({ ...state });
      return false;
    }
    if (state.LowerLimit > up || state.LowerLimit < low) {
      state.alertVisible = true;
      state.alertMessage = '测点下限值超出范围!';
      setState({ ...state });
      return false;
    }
    return true;
  };

  const onModalCancelClick = () => {
    alertClose();
    reset();
    modalCancel();
  };

  const reset = () => {
    state.TagName = '';
    state.TagDesc = '';
    state.TagUnit = '';
    state.UpperLimit = 1000;
    state.LowerLimit = 0;
    state.Extra = '';
    state.Remark = '';
    state.Type = 10;
    setState({ ...state });
  };

  const tagChange = (e) => {
    state.TagName = e.target.value;
    setState({ ...state });
  };
  const unitChange = (e) => {
    state.TagUnit = e.target.value;
    setState({ ...state });
  };
  const descChange = (e) => {
    state.TagDesc = e.target.value;
    setState({ ...state });
  };
  const remarkChange = (e) => {
    state.Remark = e.target.value;
    setState({ ...state });
  };
  const upLimitChange = (value) => {
    state.UpperLimit = Math.min(Number.MAX_SAFE_INTEGER, value);
    setState({ ...state });
  };
  const lowLimitChange = (value) => {
    state.LowerLimit = value;
    setState({ ...state });
  };
  const spanMargin = '30px';
  const divMargin = '10px';
  const inputWidth = '350px';
  return (
    <Modal
      onOk={onModalOkClick}
      mask={true}
      maskClosable={false}
      okText='确定'
      cancelText='取消'
      onCancel={onModalCancelClick}
      visible={visible}
      title={state.title}
    >
      <span style={{ margin: spanMargin, width: '100px' }}>测点:</span>
      <Input
        style={{ width: inputWidth }}
        value={state.TagName}
        onChange={tagChange}
      ></Input>
      <div style={{ margin: divMargin, width: '100px' }}></div>
      <span style={{ margin: spanMargin, width: '100px' }}>类型:</span>
      <Select
        style={{ width: inputWidth }}
        value={state.Type}
        onChange={changeType}
      >
        {getDataTypes()}
      </Select>
      <div style={{ margin: divMargin }}></div>
      <span style={{ margin: spanMargin, width: '100px' }}>单位:</span>
      <Input
        style={{ width: inputWidth }}
        value={state.TagUnit}
        onChange={unitChange}
      ></Input>
      <div style={{ margin: divMargin }}></div>
      {state.Type != 0 ? (
        <span style={{ margin: spanMargin, width: '100px' }}>上限:</span>
      ) : null}
      {state.Type != 0 ? (
        <InputNumber
          max={9007199254740991}
          disabled={state.Type == 0}
          style={{ width: inputWidth }}
          value={state.UpperLimit}
          onChange={upLimitChange}
        ></InputNumber>
      ) : null}
      {state.Type != 0 ? <div style={{ margin: divMargin }}></div> : null}
      {state.Type != 0 ? (
        <span style={{ margin: spanMargin, width: '100px' }}>下限:</span>
      ) : null}
      {state.Type != 0 ? (
        <InputNumber
          disabled={state.Type == 0}
          style={{ width: inputWidth }}
          value={state.LowerLimit}
          onChange={lowLimitChange}
        ></InputNumber>
      ) : null}
      {state.Type != 0 ? <div style={{ margin: divMargin }}></div> : null}
      <span style={{ margin: spanMargin, width: '100px' }}>描述:</span>
      <Input
        style={{ width: inputWidth, height: '50px' }}
        multiple
        value={state.TagDesc}
        onChange={descChange}
      ></Input>
      <div style={{ margin: divMargin }}></div>
      <span style={{ margin: spanMargin, width: '100px' }}>备注:</span>
      <Input
        style={{ width: inputWidth, height: '50px' }}
        multiple
        value={state.Remark}
        onChange={remarkChange}
      ></Input>
      {state.alertVisible ? (
        <Alert
          message={state.alertMessage}
          type='warning'
          closable
          onClose={alertClose}
        />
      ) : null}
    </Modal>
  );
}

export default PointInfoModal;
