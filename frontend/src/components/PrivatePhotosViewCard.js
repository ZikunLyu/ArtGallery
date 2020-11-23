import React, { Component } from "react";
import { Tag, notification, Col, Row,Typography,Upload, Button, message,Popconfirm  } from 'antd';
import moment from 'moment';
import axios from 'axios';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title,Paragraph  } = Typography;

export default class PrivatePhotosViewCard extends Component {
  state = {
    currentArtwork:[]
  };
  componentDidMount() {
    axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/arts/getFileInfoByTitleArtist',
      params: { title: this.props.title,
                artist: this.props.artist
      }
    }).then(res => {
      this.setState({currentArtwork:res.data})
    }).catch((err) => console.log(err));
  }

  handleUploadData(){
    let uploadInfo={
      title: this.state.currentArtwork.title,
      artist: this.state.currentArtwork.artist
    }
    return uploadInfo;
  }

  deleteArt= () =>{
    axios({
      method: 'delete',
      url: 'http://localhost:3001/api/v1/arts/deleteArtworkFilesByTitleArtist',
      params: {title: this.state.currentArtwork.title,
        artist: this.state.currentArtwork.artist}
    }).then(res => {
      console.log(res);
      axios({
        method: 'delete',
        url: 'http://localhost:3001/api/v1/arts/deleteArtworkByTitleArtist',
        params: {title: this.state.currentArtwork.title,
          artist: this.state.currentArtwork.artist}
      }).then(res => {
        console.log(res);
          notification.info({
            message: `Successfully deleted`,
            placement: `bottomRight`,
          });
          this.setState({currentArtwork:[]});
      }
        ).catch((err) => console.log(err));
    }).catch((err) => console.log(err));
  }

  handler = (info) => {
    const status = info.file.status;
    if(status === 'done'){
      axios({
        method: 'get',
        url: 'http://localhost:3001/api/v1/arts/compressByfilepath',
        params: { imagePathReq: info.file.response.path
        }
      }).then(res => {
        console.log(res);
      }).catch((err) => console.log(err));
    }
  }

  render() {
    return (
      <Col span={8}>
        <Row justify="space-around"><Tag color="blue">{this.state.currentArtwork.ccLicense}</Tag></Row>
        <Row justify="space-around"><Title level={2}>{this.state.currentArtwork.title}</Title></Row>
        <Row justify="space-around"><Title level={4}>by {this.state.currentArtwork.artist}</Title></Row>
        <Row justify="space-around"><Title level={4}>{this.state.currentArtwork.medium} created on {moment(this.state.currentArtwork.creationTime).format('YYYY.MM.DD')}</Title></Row>
        <Row justify="space-around"><Title level={5}>{this.state.currentArtwork.height}cm x {this.state.currentArtwork.width}cm</Title></Row>
        <Row justify="space-around"><Paragraph ellipsis={{ rows: 5, expandable: true, symbol: 'more' }}>{this.state.currentArtwork.description}</Paragraph></Row>
        <Row justify="space-around"><Title level={4}>Download for $ {this.state.currentArtwork.download_price}</Title></Row>
        <Row justify="space-around"><Title level={4}>Sale for $ {this.state.currentArtwork.sale_price}</Title></Row>
        <Row justify="space-around"><Title level={4}>Rental for $ {this.state.currentArtwork.rental_price}</Title></Row>
        <Row justify="space-around">
          <Upload name={'file'}
                  accept={'image/jpeg'}
                  action={'http://localhost:3001/api/v1/arts/uploadFileByTitleArtist'}
                  data={() => this.handleUploadData()}
                  onChange={this.handler}
          > <Button icon={<UploadOutlined />}>Update file</Button></Upload>

          <Popconfirm
            title="Are you sure to delete this artwork?"
            onConfirm={this.deleteArt}
            okText="Yes"
            cancelText="No"
          >
          <Button icon={<DeleteOutlined />}  danger>Delete this</Button></Popconfirm>
        </Row>
      </Col>
      )
  }
}