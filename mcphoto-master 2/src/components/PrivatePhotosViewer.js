import React, { Component } from "react";
import PrivatePhotosViewCard from './PrivatePhotosViewCard';
import moment from 'moment';
import '../css/Editor.css';
import { Upload, DatePicker, InputNumber,Collapse, Image, Spin, Row, Col, Divider, Typography, Button, Layout, Modal, Form, Input, Select, Radio, notification} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
const { Panel } = Collapse;
const { Title, Text, Link } = Typography;
const { Content , Header} = Layout
const { Option } = Select;

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

const text = (
  <p style={{ paddingLeft: 24 }}>
    A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found:a welcome guest in many households across the world.
  </p>
);

export default class PrivatePhotosViewer extends Component {
    state = {
      artworks:[],
      modalVisible: false,
      confirmLoading: false,
      user:[],
      uploadVisible: false,
      uploadedFile:[],
      ccLicense:[]
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

    axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/arts/getArtworkListByArtistEmail',
      params: { artistEmail: window.localStorage.getItem("loggedInEmail") }
    }).then(res => {
      this.setState( {artworks:res.data} )
    }).catch((err) => console.log(err));
  }

  formRef = React.createRef();

  search = e => {
    console.log(this.state.artworks[e]);
  }

  showModal = () => {
    this.setState({
      modalVisible: true
    })
  }

  cancelModal = e => {
    this.setState({
      modalVisible: false
    })
  }

  normFile = (e) => {
    console.log('Upload event:', e);

    if (Array.isArray(e)) {
      console.log('Done!');
      return e;
    }
    return e && e.fileList;
  };

  handleUploadCancel = (e) => {
    this.setState({
      uploadVisible:false
    })
  }

  handleUploadData(){
    let uploadInfo={
      title: this.state.uploadedFile.title,
      artist: this.state.uploadedFile.artist
    }
    return uploadInfo;
  }

  getccText = (values) => {
    this.setState({ccLicense: values})
  }

  printCCLicenseText = () => {
    const cclicense = this.state.ccLicense
    if(cclicense == 'CC0') {
      return 'CC0 (aka CC Zero) is a public dedication tool, which allows creators to give up their copyright and put their works into the worldwide public domain. CC0 allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, with no conditions.'
    } else if(cclicense == 'CC-BY-NC-ND') {
      return 'This license allows reusers to copy and distribute the material in any medium or format in unadapted form only, for noncommercial purposes only, and only so long as attribution is given to the creator. '
    } else if(cclicense == 'CC-BY-ND'){
      return 'This license allows reusers to copy and distribute the material in any medium or format in unadapted form only, and only so long as attribution is given to the creator. The license allows for commercial use. '
    } else if(cclicense == 'CC-BY-NC-SA'){
      return 'This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format for noncommercial purposes only, and only so long as attribution is given to the creator. If you remix, adapt, or build upon the material, you must license the modified material under identical terms. '
    } else if(cclicense == 'CC-BY-NC'){
      return 'This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format for noncommercial purposes only, and only so long as attribution is given to the creator. '
    } else if(cclicense == 'CC-BY-SA'){
      return 'This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use. If you remix, adapt, or build upon the material, you must license the modified material under identical terms.'
    } else if(cclicense == 'CC-BY'){
      return 'This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator. The license allows for commercial use.'
    } else if(cclicense == 'N/A'){
      return ''
    }
    return cclicense
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
        notification.success({
          message: 'Successfully uploaded the file',
          placement: 'bottomRight'
        });

        this.setState({
          uploadVisible:false
        })
      }).catch((err) => console.log(err));
    }
  }

  handleOk = (e) => {
    this.setState({
      confirmLoading: true,
    });

    let upload = {
      title: this.formRef.current.getFieldValue('title'),
      downloadPrice: this.formRef.current.getFieldValue('downloadprice'),
      rentalPrice: this.formRef.current.getFieldValue('rentalprice'),
      salePrice: this.formRef.current.getFieldValue('saleprice'),
      description: this.formRef.current.getFieldValue('description'),
      artist: this.state.user.name,
      artistEmail: window.localStorage.getItem("loggedInEmail"),
      creationTime: this.formRef.current.getFieldValue('creationtime')._d,
      medium: this.formRef.current.getFieldValue('medium'),
      width: this.formRef.current.getFieldValue('width'),
      height: this.formRef.current.getFieldValue('height'),
      isForDownload: eval(this.formRef.current.getFieldValue('forDownload')),
      isForSale: eval(this.formRef.current.getFieldValue('forSale')),
      isForRental: eval(this.formRef.current.getFieldValue('forRental')),
      isSoldorRented: false,
      ccLicense: this.formRef.current.getFieldValue('cclicense')
    };

    this.formRef.current.submit(
    axios({
      method: 'post',
      url: 'http://localhost:3001/api/v1/arts/uploadArtInfo',
      data: upload
    }).then(res => {
      console.log("Thank you for upload");
      this.setState({
        confirmLoading: false
      });
      notification.success({
        message: 'Successfully added your work',
        description:
          'You can upload the file right now.',
        placement: 'bottomRight'
      });

      axios({
        method: 'get',
        url: 'http://localhost:3001/api/v1/arts/getArtworkListByArtistEmail',
        params: { artistEmail: window.localStorage.getItem("loggedInEmail") }
      }).then(res => {
        this.setState( {artworks:res.data} )
      }).catch((err) => console.log(err));
      this.setState({
        modalVisible: false,
        uploadVisible: true,
        uploadedFile: upload
      });
    }).catch((err) => console.log(err))
    );
  }

  render() {
    const { artworks } = this.state;
    return (
      <Layout>
        <Content className={'photosviewer-topbar'}>
          <Button onClick={this.showModal} ghost={true} type="primary" className={'addfile-button'} shape="round" icon={<PlusOutlined />} size={'large'}>
            Add your art !
          </Button>
          <Modal onOk={this.handleOk} width={1200} title={'Add a new artwork'} visible={this.state.modalVisible} onCancel={this.cancelModal} confirmLoading={this.state.confirmLoading}>
            <Form
              {...formItemLayout}
              ref={this.formRef}
              name="uploader"
            >
              <Divider>Basic information</Divider>
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  {
                    required: true,
                    message: 'Please input title!',
                    whitespace: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="medium"
                label="Medium"
                hasFeedback
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                  <Select placeholder="Please select medium of your work">
                    <Option value="Photograph">Photograph</Option>
                    <Option value="Painting">Painting</Option>
                    <Option value="Sculpture">Sculpture</Option>
                    <Option value="Glass Art">Glass Art</Option>
                    <Option value="Drawing & Illustration">Drawing & Illustration</Option>
                    <Option value="Mixed Media & Collage">Mixed Media & Collage</Option>
                    <Option value="Fibre Arts">Fibre Arts</Option>
                    <Option value="Dolls & Miniatures">Dolls & Miniatures</Option>
                    <Option value="Other">Other</Option>
                    <Option value="None">None</Option>
                  </Select>
              </Form.Item>

              <Form.Item
                name="downloadprice"
                label="Download price"
                rules={[
                  {
                    pattern: /^[0-9]+$/
                  },
                ]}><InputNumber />
              </Form.Item>
              <Form.Item
                name="saleprice"
                label="Sale price"
                rules={[
                  {
                    pattern: /^[0-9]+$/
                  },
                ]}><InputNumber />
              </Form.Item>
              <Form.Item
                name="rentalprice"
                label="Rental price (Monthly)"
                rules={[
                  {
                    pattern: /^[0-9]+$/
                  },
                ]}><InputNumber />
              </Form.Item>

              <Form.Item name="creationtime"
                         label="CreationTime"
                         rules={[
                           {
                             required: true,
                             message: 'Please select time!',
                           },
                         ]}>
                <DatePicker picker="month" />
              </Form.Item>

              <Form.Item name="description" label="Description">
                <Input.TextArea />
              </Form.Item>
              <Divider>More details about your art work</Divider>

              <Form.Item
                name="width"
                label="Width"
                rules={[
                  {
                    pattern: /^[0-9]+$/,
                    required: true,
                  },
                ]}>
                <InputNumber />
              </Form.Item>

              <Form.Item
                name="height"
                label="Height"
                rules={[
                  {
                    pattern: /^[0-9]+$/,
                    required: true,
                  },
                ]}>
                <InputNumber />
              </Form.Item>

              <Form.Item name="forDownload" label="Provide download?" rules={[
                {
                  required: true,
                },
              ]}>
                <Radio.Group>
                  <Radio value='true'>Yes</Radio>
                  <Radio value='false'>No</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="forSale" label="For sale?" rules={[
                {
                  required: true,
                },
              ]}>
                <Radio.Group>
                  <Radio value='true'>Yes</Radio>
                  <Radio value='false'>No</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item name="forRental" label="For rental?" rules={[
                {
                  required: true,
                },
              ]}>
                <Radio.Group>
                  <Radio value='true'>Yes</Radio>
                  <Radio value='false'>No</Radio>
                </Radio.Group>
              </Form.Item>

              <Divider>Confirm your CClicense</Divider>
              <Form.Item
                name="cclicense"
                label="CClicense"
                hasFeedback
              >
                <Select onChange={this.getccText} placeholder="Please select your cclicense">
                  <Option value="N/A">N/A</Option>
                  <Option value="CC-BY-NC-ND">CC-BY-NC-ND</Option>
                  <Option value="CC-BY-NC-SA">CC-BY-NC-SA</Option>
                  <Option value="CC-BY-NC">CC-BY-NC</Option>
                  <Option value="CC-BY-ND">CC-BY-ND</Option>
                  <Option value="CC-BY-SA">CC-BY-SA</Option>
                  <Option value="CC-BY">CC-BY</Option>
                  <Option value="CC0">CC0</Option>
                </Select>
                <Text className="ant-form-text" type="secondary">{this.printCCLicenseText()}</Text>
                <Link href="https://creativecommons.org/about/cclicenses/" target="_blank">
                  Click for more information about Creative Commons license
                </Link>
              </Form.Item>

            </Form>
          </Modal>

          <Modal title={'Upload file for your work!'} width={850} visible={this.state.uploadVisible} onCancel={this.handleUploadCancel}>
            <Form
              {...formItemLayout}
              ref={this.formRef}
              name="fileuploader"
            >
            <Form.Item
              name="fileupload"
              label="FileUpload"
              valuePropName="fileList"
              getValueFromEvent={this.normFile}
              extra="Please note that you can upload the file later"
            >
              <Upload name={'file'}
                      accept={'image/jpeg'}
                      action={'http://localhost:3001/api/v1/arts/uploadFileByTitleArtist'}
                      data={() => this.handleUploadData()}
                      onChange={this.handler}
                      listType="picture">
                <Button icon={<UploadOutlined />}>Upload .jpeg only</Button>
              </Upload>
            </Form.Item>
            </Form>
          </Modal>

        <Collapse accordion bordered={false} className={'image-panel'}>
        {artworks.map((artwork, index) => (
          <Panel header={`${artwork.title}:   
          ${moment(artwork.createTime).format('YYYY.MM.DD')}`}
                 key={index}
                  forceRender={false}>
            <Row justify="space-around" align="middle">
              <Col span={8}>
                <Image
                  width={300}
                  src={`http://localhost:3001/api/v1/arts/getFilepathByTitleArtist?artist=${artwork.artist}&title=${artwork.title}&imageSize=-medium`}
                  placeholder={
                    <Spin />
                  }
                />
              </Col>
              <PrivatePhotosViewCard title={artwork.title} artist={artwork.artist}/>
            </Row>
          </Panel>
        ))
        }
        </Collapse>
        </Content>
      </Layout>
    );
  }
}