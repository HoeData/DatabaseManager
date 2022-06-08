import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Tooltip, Popconfirm, Form } from 'antd';
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const [changed,setChanged]=useState(false)
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    console.log('editing', editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const onInputChange=(e)=>{
     if(e.target.value.length>255)
     {
       alert("字符不能超过255个！");
       return;
     }
      setChanged(true)
  }

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      if(changed)
      handleSave({ ...record, ...values });
      setChanged(false)
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  console.log('children', children);
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[]}
      >
        <Input ref={inputRef} onPressEnter={save} onChange={onInputChange} onBlur={save} />
      </Form.Item>
    ) : (
      children.length > 1 && (children[1] != '' && typeof children[1] === 'string' || typeof children[1] === 'number') ? 
      <Tooltip title={children}><div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          minWidth: '20px',
          minHeight: '20px',
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
      </Tooltip> : <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          minWidth: '20px',
          minHeight: '20px',
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  else 
  {
    childNode = (
      (children.length > 1 && (children[1] != '' && typeof children[1] === 'string' || typeof children[1] === 'number') ?
      <Tooltip  title={children}><div>{children}</div></Tooltip>:<div>{children}</div>));
  }

  return <td {...restProps}>{childNode}</td>;
}

export { EditableCell, EditableRow };