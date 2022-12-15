import "./App.css";
import { Checkbox, Select } from "antd";
import {
  Col,
  Divider,
  Row,
  Form,
  Input,
  Modal,
  Popconfirm,
  Button,
  Table,
} from "antd";
import { EditTwoTone } from "@ant-design/icons";
import { useState, useEffect, useRef, useContext, createContext } from "react";

const style = {
  // background: "#0092ff",
  padding: "8px 4px",
  width: "100%",
  maxWidth: 300,
};

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([
    {
      Key: "0",
      Value: "1234567890",
    },
  ]);
  const [count, setCount] = useState(1);

  const EditableContext = createContext(null);

  const defaultColumns = [
    {
      title: "Key",
      dataIndex: "Key",
      width: "50%",
      editable: true,
    },
    {
      title: "Value",
      dataIndex: "Value",
      editable: true,
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];

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
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  const handleAdd = () => {
    const newData = {
      Key: count,
      Value: `0000`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
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
        handleSave,
      }),
    };
  });

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };
  const onCheck = (value) => {
    console.log("check:", value);
  };
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <div className="App">
      <Form
        name="basic"
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ maxWidth: 1000 }}
        >
          <Col span={8}>
            <Form.Item
              label="Event Source"
              name="eventSource"
              rules={[
                { required: true, message: "Please input your Event Source!" },
              ]}
            >
              <Select
                style={style}
                showSearch
                placeholder="Event Source"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "tom",
                    label: "Tom",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Source Type"
              name="sourceType"
              rules={[
                { required: true, message: "Please input your Source Type!" },
              ]}
            >
              <Select
                style={style}
                showSearch
                placeholder="Source Type"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "tom",
                    label: "Tom",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Event"
              name="event"
              rules={[{ required: true, message: "Please input your Event!" }]}
            >
              <Select
                style={style}
                showSearch
                placeholder="Event"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "tom",
                    label: "Tom",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Milestone"
              name="milestone"
              rules={[
                { required: true, message: "Please input your Milestone!" },
              ]}
            >
              <Select
                style={style}
                showSearch
                placeholder="Milestone"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "tom",
                    label: "Tom",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Subscriber Type"
              name="subscriberType"
              rules={[
                {
                  required: true,
                  message: "Please input your Subscriber Type!",
                },
              ]}
            >
              <Select
                style={style}
                showSearch
                placeholder="Subscriber Type"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "tom",
                    label: "Tom",
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Subscriber Name"
              name="subscriberName"
              rules={[
                {
                  required: true,
                  message: "Please input your Subscriber Name!",
                },
              ]}
            >
              <Select
                style={style}
                showSearch
                placeholder="Subscriber Name"
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={[
                  {
                    value: "jack",
                    label: "Jack",
                  },
                  {
                    value: "lucy",
                    label: "Lucy",
                  },
                  {
                    value: "tom",
                    label: "Tom",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Divider orientation="left">Notified by</Divider>
        </Row>
        <Row>
          <div className="notifications">
            <div className="notified_options">Email</div>
            <div className="notified_options">
              <EditTwoTone twoToneColor="#a3a3a3" onClick={showModal} />
            </div>
            <div className="notified_options">
              <Checkbox onCheck={onCheck} />
            </div>
          </div>
        </Row>
        <Row>
          <div className="notifications">
            <div className="notified_options">WhatsApp</div>
            <div className="notified_options">
              <EditTwoTone twoToneColor="#a3a3a3" onClick={showModal} />
            </div>
            <div className="notified_options">
              <Checkbox onCheck={onCheck} />
            </div>
          </div>
        </Row>
        <Row>
          <div className="notifications">
            <div className="notified_options">TradeChain</div>
            <div className="notified_options">
              <EditTwoTone twoToneColor="#a3a3a3" onClick={showModal} />
            </div>
            <div className="notified_options">
              <Checkbox onCheck={onCheck} />
            </div>
          </div>
        </Row>
        <Row style={{ marginTop: 15 }}>
          <Button type="primary">Submit</Button>
        </Row>
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <div>
            <Button
              onClick={handleAdd}
              type="primary"
              style={{
                marginBottom: 16,
              }}
            >
              Add a row
            </Button>
            <Table
              components={components}
              rowClassName={() => "editable-row"}
              bordered
              dataSource={dataSource}
              columns={columns}
            />
          </div>
        </Modal>
      </Form>
    </div>
  );
}

export default App;
