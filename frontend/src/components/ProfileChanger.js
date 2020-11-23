import React, { Component, useState } from "react";
import moment from 'moment';
import {
  Form,
  Input,
  Tooltip,
  Select,
  Button,
  AutoComplete,
  Divider,
  Popconfirm,
  message
} from 'antd'
import { QuestionCircleOutlined, InfoCircleOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Option } = Select;
const AutoCompleteOption = AutoComplete.Option;
const dateFormat = 'YYYY.MM';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 14,
    },
    sm: {
      span: 10,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 1,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export default class ProfileChanger extends Component {

  componentDidMount() {
    axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/users/getAUser',
      params: { email: window.localStorage.getItem("loggedInEmail") }
    }).then(res => {
      const user = res.data.user;
      this.setState({ user: user });
      this.formRef.current.setFieldsValue({
        email: this.state.user.email,
        nickname: this.state.user.name,
        major: this.state.user.major
      })
    }).catch((err) => console.log(err));
  }

  state = {
    editDisabled: true,
    user: []
  };

  formRef = React.createRef();
  onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  enableEdit = (e) => {
    if(this.state.editDisabled) this.setState({editDisabled: false})
    else this.setState({editDisabled: true})
  }

  confirm = (e) => {
    console.log(e);
    message.success('Information updated!');
  }

  cancel = (e) => {
    console.log(e);
    message.error('Canceled!');
  }

  render() {

    return (
      <Form
        {...formItemLayout}
        ref={this.formRef}
        name="register"
        onFinish={this.onFinish}
        initialValues={{
          city:'Montreal',
          bio:'Photography lover !'
        }}
      >
        <Divider>Your Account</Divider>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input disabled={true}  bordered={false} />
        </Form.Item>


        <Form.Item
          name="nickname"
          label={
            <span>
            name&nbsp;
              <Tooltip title="What do you want others to call you?">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
          }
          rules={[
            {
              required: true,
              message: 'Please input your nickname!',
              whitespace: true,
            },
          ]}
        >
          <Input disabled={true} bordered={false} />
        </Form.Item>

        <Divider>Let others know you</Divider>

        {/*
        <Form.Item
          name="birthday"
          label="birthday"
          rules={[
            {
              required: false
            },
          ]}
        >
          <Space direction="vertical" size={20}>
            <DatePicker disabled={this.state.editDisabled} bordered={false} defaultValue={moment('2000/01/01', dateFormat)} format={dateFormat} />
          </Space>
        </Form.Item>
        */}

        <Form.Item
          name="bio"
          label="bio"
          rules={[
            {
              required: false
            },
          ]}
        >
          <Input disabled={this.state.editDisabled} />
        </Form.Item>

        <Form.Item
          name="major"
          label={
            <span>
            major&nbsp;
              <Tooltip title="What do you study in McGill?">
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
          }
          rules={[
            {
              required: false,
              whitespace: true,
            },
          ]}
        >
          <Input disabled={this.state.editDisabled}  />
        </Form.Item>

        <Form.Item
          name="region"
          label="region"
          rules={[
            {
              required: false,
              whitespace: true,
            },
          ]}
        >
          <Input.Group compact>
            <Select defaultValue="Québec" disabled={this.state.editDisabled}>
              <Option value="Alberta">Alberta</Option>
              <Option value="British Columbia">British Columbia</Option>
              <Option value="Manitoba">Manitoba</Option>
              <Option value="Newfoundland and Labrador">Newfoundland and Labrador</Option>
              <Option value="New Brunswick">New Brunswick</Option>
              <Option value="Nova Scotia">Nova Scotia</Option>
              <Option value="Ontario">Ontario</Option>
              <Option value="PEI">PEI</Option>
              <Option value="Québec">Québec</Option>
              <Option value="Saskatchewan">Saskatchewan</Option>
              <Option value="Nunavut">Nunavut</Option>
              <Option value="Northwest Territories">Northwest Territories</Option>
              <Option value="Yukon">Yukon</Option>
            </Select>
            {/* <Input disabled={this.state.editDisabled} defaultValue="McGill Campus"  /> */}
            {/* <Input disabled={this.state.editDisabled} defaultValue="H3C123" /> */}
          </Input.Group>
        </Form.Item>

        <Form.Item
          name="city"
          label="city"
          rules={[
            {
              required: false,
              whitespace: true,
            },
          ]}
        >
          <Input disabled={this.state.editDisabled}  />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Popconfirm
            title="Are you sure to update your information?"
            onConfirm={this.confirm}
            onCancel={this.cancel}
            okText="Yes"
            cancelText="No"
          >
          <Button htmlType="submit" type="primary" style={{marginRight:'5%', width:'20%'}} icon={<CheckOutlined />} shape="round" size={'large'}>
            Update&nbsp;
          </Button>
          </Popconfirm>
          <Button onClick={this.enableEdit} shape="round" style={{marginLeft:'5%', width:'20%'}} icon={<EditOutlined />} size={'large'}>
            Edit
          </Button>
        </Form.Item>
      </Form>
    );
  }
};
