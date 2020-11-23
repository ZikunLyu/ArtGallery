import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image'
import { FaSearch } from 'react-icons/fa';
import { Dropdown } from 'semantic-ui-react';
import Pagination from './Pagination';
import axios from 'axios';
import '../css/Gallery.css';
import 'antd/dist/antd.css';
import { Tag, Descriptions, Modal, Tooltip, Typography } from 'antd';
import {
  FolderOpenOutlined,
  ShoppingCartOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import by_nc_nd from '../images/ccLicenses/by-nc-nd.png';
import by_nc_sa from '../images/ccLicenses/by-nc-sa.png';
import by_nc from '../images/ccLicenses/by-nc.png';
import by_nd from '../images/ccLicenses/by-nd.png';
import by_sa from '../images/ccLicenses/by-sa.png';
import by from '../images/ccLicenses/by.png';
import cc_zero from '../images/ccLicenses/cc-zero.png';

const { Link, Text } = Typography;
const PAGE_LIMIT = 6;
const PAGE_NEIGHBORS = 1;
const NONE = 'None';
const PHOTOGRAPH = 'Photograph';
const PAINTING = 'Painting';
const SCULPTURE = 'Sculpture';

const categories = [
  {
    key: "isForDownload",
    text: "For Download",
    value: "isForDownload"
  },
  {
    key: "isForRental",
    text: "For Rental",
    value: "isForRental"
  },
  {
    key: "isForSale",
    text: "For Purchase",
    value: "isForSale"
  },
  {
    key: "PhotoRepo",
    text: "Photo Repo",
    value: "PhotoRepo",
  },
  {
    key: NONE,
    text: NONE,
    value: NONE
  }
];

const mediums = [
  {
    key: PHOTOGRAPH,
    text: PHOTOGRAPH,
    value: PHOTOGRAPH
  },
  {
    key: PAINTING,
    text: PAINTING,
    value: PAINTING
  },
  {
    key: SCULPTURE,
    text: SCULPTURE,
    value: SCULPTURE
  },
  {
    key: 'Glass Art',
    text: 'Glass Art',
    value: 'Glass Art'
  },
  {
    key: 'Drawing & Illustration',
    text: 'Drawing & Illustration',
    value: 'Drawing & Illustration'
  },
  {
    key: 'Mixed Media & Collage',
    text: 'Mixed Media & Collage',
    value: 'Mixed Media & Collage'
  },
  {
    key: 'Fibre Arts',
    text: 'Fibre Arts',
    value: 'Fibre Arts'
  },
  {
    key: 'Dolls & Miniatures',
    text: 'Dolls & Miniatures',
    value: 'Dolls & Miniatures'
  },
  {
    key: 'Other',
    text: 'Other',
    value: 'Other'
  },
  {
    key: NONE,
    text: NONE,
    value: NONE
  }
];

const sortOptions = [
  {
    key: 'price',
    text: 'Price',
    value: 'price'
  },
  {
    key: 'creationTime',
    text: 'Upload Date',
    value: 'creationTime'
  },
  {
    key: NONE,
    text: NONE,
    value: NONE
  }
];

export default class Gallery extends Component {
  constructor(props) {
    super(props);
    this.sendTransaction = this.sendTransaction.bind(this);
  }

  state = {
    totalArtworks: 0,
    currentArtworks: [],
    currentPage: 1,
    totalPages: null,
    apiParams: new URLSearchParams(),
    keyword_search: '',
    // Modal related
    overlay_visible: false,
    artwork: new Object(),
    isForDownload: false,
    isForRental: false,
    isForSale: false,
    categorySelected: '',
  };

  componentDidMount() {
    axios({
      method: 'get',
      url: 'http://localhost:3001/api/v1/arts/artworksNum'
    }).then(response => {
      this.setState({ totalArtworks: response.data.results });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    // Set any Filter by or Sort by or Search keyword will update the apiParams in the state
    // which will trigger componentDidUpdate(), so here we send the new query api call

    const { apiParams, currentPage } = this.state;
    if (apiParams !== prevState.apiParams) {
      // Update the total number of artworks searched
      axios({
        method: 'get',
        url: 'http://localhost:3001/api/v1/arts/artworksNum',
        params: apiParams
      }).then(response => {
        this.setState({
          totalArtworks: response.data.results
        });
      });

      // Update the artworks on the current page(the 1st page)
      axios({
        method: 'get',
        url: `http://localhost:3001/api/v1/arts/artworks?page=${currentPage}&limit=${PAGE_LIMIT}`,
        params: apiParams
      }).then(response => {
        const currentArtworks = response.data.data.artworks;
        this.setState({ currentArtworks });
      });
    }
  }

  onPageChanged = data => {
    const { currentPage, totalPages, pageLimit } = data;
    axios({
      method: 'get',
      url: `http://localhost:3001/api/v1/arts/artworks?page=${currentPage}&limit=${pageLimit}`,
      params: this.state.apiParams
    }).then(response => {
      const currentArtworks = response.data.data.artworks;
      this.setState({
        currentPage,
        currentArtworks,
        totalPages
      });
    });
  };

  addColorTag = e => {
    if (e === 'Photograph') return 'magenta';
    else if (e === 'Painting') return 'red';
    else if (e === 'Sculpture') return 'volcano';
    else if (e === 'Glass Art') return 'orange';
    else if (e === 'Drawing & illustration') return 'gold';
    else if (e === 'Mixed Media & Collage') return 'lime';
  };

  handleCategoryChange = (e, { value }) => {
    let newParams = new URLSearchParams(this.state.apiParams);
    newParams.delete('category');
    if (value !== NONE) { 
      newParams.append('category', value);
      this.setState({ categorySelected: value });
    } else {
      this.setState({ categorySelected: '' });
    }
    this.setState({ apiParams: newParams, currentPage: 1 });
  };

  handleMediumChange = (e, { value }) => {
    let newParams = new URLSearchParams(this.state.apiParams);
    newParams.delete('medium');
    if (value !== NONE) {
      newParams.append('medium', value);
    }
    this.setState({ apiParams: newParams, currentPage: 1 });
  };

  handleSortChange = (e, { value }) => {
    let newParams = new URLSearchParams(this.state.apiParams);
    newParams.delete('sort');
    if (value !== NONE) {
      newParams.append('sort', value);
    }
    this.setState({ apiParams: newParams, currentPage: 1 });
  };

  onChangeSearch = e => {
    this.setState({
      keyword_search: e.target.value
    });
    // If the search bar is deleted to empty, search all artworks automatically
    if (e.target.value.trim() === '') {
      let newParams = new URLSearchParams(this.state.apiParams);
      newParams.delete('search');
      this.setState({ apiParams: newParams, currentPage: 1 });
    }
  };

  search = e => {
    e.preventDefault();
    let newParams = new URLSearchParams(this.state.apiParams);
    newParams.delete('search');
    if (this.state.keyword_search.trim() !== '') {
      newParams.append('search', this.state.keyword_search);
    }
    this.setState({ apiParams: newParams, currentPage: 1 });
  };

  showOverlay = artwork => {
    this.setState({
      overlay_visible: true,
      artwork,
      isForDownload: artwork.isForDownload,
      isForRental: artwork.isForRental,
      isForSale: artwork.isForSale
    });
  };

  hideOverlay = () => {
    this.setState({ overlay_visible: false });
  };

  async sendTransaction(artwork, transType) {
    let body = {
      sender_email: window.localStorage.getItem('loggedInEmail'),
      receiver_email: artwork.artistEmail,
      type: transType,
      artwork: artwork._id,
      artworkTitle: artwork.title,
      artist: artwork.artist,
    };
    await axios({
      method: 'post',
      url: 'http://localhost:3001/api/v1/transactions/transaction',
      data: body,
      headers: { 
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + window.localStorage.getItem('token'),
      }
    });
    this.hideOverlay();
  };

  getPrice = artwork => {
    const { categorySelected } = this.state;
    if (categorySelected === '') {
      return 'Details';
    } else if (categorySelected === 'isForDownload') {
      return `$${artwork.download_price}`;
    } else if (categorySelected === 'isForRental') {
      return `$${artwork.rental_price}`;
    } else if (categorySelected === 'isForSale') {
      return `$${artwork.sale_price}`;
    } else {
      return '$0'
    }
  }

  printCCLicenseText = (cclicense) => {
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

  getCcLicenseImg = license => {
    let src = null;
    if (license === 'N/A') {
      return (<div 
        style={{ height: '35px', width: '80px' }}
      />);
    } else if (license === 'CC-BY-NC-ND') {
      src = by_nc_nd;
    } else if (license === 'CC-BY-NC-SA') {
      src = by_nc_sa;
    } else if (license === 'CC-BY-NC') {
      src = by_nc;
    } else if (license === 'CC-BY-ND') {
      src = by_nd;
    } else if (license === 'CC-BY-SA') {
      src = by_sa;
    } else if (license === 'CC-BY') {
      src = by;
    } else {
      src = cc_zero;
    }
    return (<Tooltip placement='right' title={this.printCCLicenseText(license)}><Image 
      src={src}
      alt={license}
      style={{ height: '30px', width: '80px', marginTop: '5px' }}
    /></Tooltip>);
  }

  render() {
    const {
      totalArtworks,
      currentArtworks,
      overlay_visible,
      artwork
    } = this.state;

    return (
      <div className="m-5">
        <div className="gallery-searchbar">
          <h4 className="filterBy-label mr-2">Filter by</h4>
          <Dropdown
            placeholder="Category"
            selection
            options={categories}
            onChange={this.handleCategoryChange}
            className="mr-2"
          />
          <Dropdown
            placeholder="Medium"
            selection
            options={mediums}
            onChange={this.handleMediumChange}
            className="mr-3"
          />
          {this.state.categorySelected ? (
          <h4 className="sortBy-label mr-2">Sort by</h4>) : null}
          {this.state.categorySelected ? (
          <Dropdown
            placeholder="Sort"
            selection
            options={sortOptions}
            onChange={this.handleSortChange}
            className="mr-5"
          />) : null}

          <Form inline className="searchForm ml-4">
            <FormControl
              type="text"
              placeholder="Search keyword"
              className="mr-sm-2"
              onChange={this.onChangeSearch}
            />
            <Button variant="outline-info" onClick={e => this.search(e)}>
              <FaSearch className="searchIcon" />
            </Button>
          </Form>
        </div>
        <div>
          <Modal
            visible={overlay_visible}
            title={artwork.title}
            onOk={() => {}}
            onCancel={this.hideOverlay}
            footer={[
              <Button
                variant="success"
                onClick={() => this.sendTransaction(artwork, 'Download')}
                key='downloadBtn'
                disabled={!this.state.isForDownload}
              >
                Request Download
              </Button>,
              <Button
                variant="success"
                onClick={() => this.sendTransaction(artwork, 'Rental')}
                key='rentalBtn'
                disabled={!this.state.isForRental}
              >
                Request Rental
              </Button>,
              <Button
                variant="success"
                onClick={() => this.sendTransaction(artwork, 'Sale')}
                key='saleBtn'
                disabled={!this.state.isForSale}
              >
                Request Purchase
              </Button>,
            ]}
            width={'65vw'}
          >
            <Image src="holder.js/100px250" 
              fluid
              src={`http://localhost:3001/api/v1/arts/getFilepathByTitleArtist?artist=${artwork.artist}&title=${artwork.title}&imageSize=-large`}
              alt="Not Found"
            />
            
            <Descriptions bordered style={{ marginTop: '20px' }}>
              <Descriptions.Item label="Availability" span={3}>
                {`${artwork.isForDownload ? '  Download' : ''}${artwork.isForRental ? '  Rental' : ''}${artwork.isForSale ? '  Sale' : ''}`}
              </Descriptions.Item>
              <Descriptions.Item label="Download Price">
                {artwork.isForDownload ? `$${artwork.download_price}` : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Rental Price (Monthly)">
                {artwork.isForRental ? `$${artwork.rental_price}` : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Sale Price">
                {artwork.isForSale ? `$${artwork.sale_price}` : 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Artist">
                <a href={`/profile?email=${artwork.artistEmail}`}>
                  {artwork.artist}
                </a>
              </Descriptions.Item>
              <Descriptions.Item label="Artist Email">
                {artwork.artistEmail}
              </Descriptions.Item>
              <Descriptions.Item label="Upload Date">
                {artwork.creationTime === undefined ? '' : artwork.creationTime.substring(0, 10)}
              </Descriptions.Item>
              <Descriptions.Item label="Medium">
                <Tag color={this.addColorTag(artwork.medium)}>
                  {artwork.medium}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Width">
                {artwork.width}
              </Descriptions.Item>
              <Descriptions.Item label="Height">
                {artwork.height}
              </Descriptions.Item>
              <Descriptions.Item label="Description" span={3}>
                {artwork.description}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </div>
        <div className="d-flex flex-row py-4 align-items-center">
          <Pagination
            totalRecords={totalArtworks}
            pageLimit={PAGE_LIMIT}
            pageNeighbours={PAGE_NEIGHBORS}
            onPageChanged={this.onPageChanged}
          />
        </div>
        {this.state.categorySelected === 'PhotoRepo' ? (<div>
          <Text className="ant-form-text" type="secondary">Below is the Photo Repository where all photos are under Creative Commons Lisense. They are free of charge.</Text>
          <Link href="https://creativecommons.org/about/cclicenses/" target="_blank">
            Click for more information about Creative Commons license
          </Link>
        </div>) : null}
        <div>
          {currentArtworks.map((artwork, index) => (
            <Card style={{ width: '25vw' }} key={index} className="artwork m-4">
              <Card.Img
                variant="top"
                src={`http://localhost:3001/api/v1/arts/getFilepathByTitleArtist?artist=${artwork.artist}&title=${artwork.title}&imageSize=-small`}
                alt="Not Found"
                style={{ height: '250px' }}
              />
              <Card.Body>
                <Card.Title>
                  {artwork.title}{' '}
                  <Tag color={this.addColorTag(artwork.medium)}>
                    {artwork.medium}
                  </Tag>
                </Card.Title>
                <Card.Text>
                  <a href={`/profile?email=${artwork.artistEmail}`}>
                    By {artwork.artist}
                  </a>
                  <div>
                    {artwork.isForDownload ? (
                    <Tag
                      icon={<DownloadOutlined />}
                      color={'success'}
                    >
                      {' '}
                      Download
                    </Tag>) : null }
                    {artwork.isForSale ? (
                    <Tag
                      icon={<ShoppingCartOutlined />}
                      color={'success'}
                    >
                      {' '}
                      Sale
                    </Tag>) : null }
                    {artwork.isForRental ? (
                    <Tag
                      icon={<FolderOpenOutlined />}
                      color={'success'}
                    >
                      Rental
                    </Tag>) : null }
                  </div>
                  {this.getCcLicenseImg(artwork.ccLicense)}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => this.showOverlay(artwork)}
                >
                  {this.getPrice(artwork)}
                </Button>
                {(artwork.accessList.includes(window.localStorage.getItem('loggedInEmail')) || artwork.download_price === 0) && artwork.isForDownload ? (
                <Button
                  variant="danger"
                  href={`http://localhost:3001/api/v1/arts/getFilepathByTitleArtist?artist=${artwork.artist}&title=${artwork.title}&imageSize=`}
                >
                  Download
                </Button>) : null}
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    );
  }
}
