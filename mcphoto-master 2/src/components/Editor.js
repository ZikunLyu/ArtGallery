import React, { Component } from "react";
import axios from 'axios';
import '../css/Editor.css';
import { Avatar, Layout, Menu, Form, Input,
    Tooltip, Cascader, Select, Row,
    Col, Checkbox, Button, AutoComplete, } from 'antd';
import 'antd/dist/antd.css';
import { QuestionCircleOutlined, MailOutlined, AppstoreOutlined, SettingOutlined, UserOutlined, PictureOutlined
} from '@ant-design/icons';
import ProfileChanger from './ProfileChanger';
import {  Route, Switch, Redirect, NavLink } from 'react-router-dom'
import PrivatePhotosViewer from './PrivatePhotosViewer';


export default class Editor extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            current: '/editor/info',
            user: []
        }
    }

    handleClick = e => {
        this.setState({ current: e.key });
    };

    componentDidMount() {
        axios({
            method: 'get',
            url: 'http://localhost:3001/api/v1/users/getAUser',
            params: { email: window.localStorage.getItem("loggedInEmail") }
        }).then(res => {
            const user = res.data.user;
            this.setState({ user });
        }).catch((err) => console.log(err));

    }
    
    handleSubmit(e) {
        e.preventDefault();
    }

    render() {
        const { SubMenu } = Menu;
        const { Header, Footer, Sider, Content } = Layout;
        const { current } = this.state;
        const { Option } = Select;
        const AutoCompleteOption = AutoComplete.Option;

        return (
          <Layout className="editor-background">
              <Sider className="avatar-sider">
                  <div className="avatar-space">
                  <Avatar shape="square" size={100} icon={<UserOutlined />} />
                      <div style={{marginTop: '5%'}}>{this.state.user.name}</div>
                  </div>
              </Sider>
              <Content className="container">
                  <Menu onClick={this.handleClick} selectedKeys={[current]} mode="horizontal">
                  <Menu.Item key="/editor/info" icon={<UserOutlined />}>
                      <NavLink to="/editor/info">
                      Info
                      </NavLink>
                  </Menu.Item>
                  <Menu.Item key="/editor/portfolio" icon={<PictureOutlined />}>
                      <NavLink to="/editor/portfolio">
                      Portfolio
                      </NavLink>
                  </Menu.Item>
                  <Menu.Item key="/editor/preference" disabled icon={<SettingOutlined />}>
                      <NavLink to="/editor/preference">
                      Preference
                      </NavLink>
                  </Menu.Item>
                  </Menu>
                  <Switch>
                      <Route path="/editor/info" component={ProfileChanger} />
                      <Route path="/editor/portfolio" component={PrivatePhotosViewer} />
                      <Redirect from="/*" to="/editor/info" />
                  </Switch>
              </Content>
          </Layout>
        )
    }
}