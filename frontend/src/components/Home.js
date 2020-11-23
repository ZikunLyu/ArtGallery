import React from 'react';
import { useHistory } from 'react-router-dom';
import { MDBCol, MDBContainer, MDBRow, MDBBtn } from 'mdbreact';
import mcgill from '../images/mcgill.jpg';
import logo from '../images/logo.png';
import '../css/Home.css';

export default function Home() {
  const history = useHistory();
  return (
    <div>
      <MDBContainer fluid className="text-center m-5">
        <MDBRow>
          <MDBCol md="6 mt-4 mb-4">
            <img src={mcgill} alt="McGill Campus" />
          </MDBCol>
          <MDBCol md="5">
            <img src={logo} alt="logo" className="logo" />
            <h4 className="text-uppercase mb-4 font-weight-bold">
              McGill Community Art
            </h4>
            <p>
              Paintings, sculptures, photos... Sign up to McGallery to get your
              artworks recognized, or browse artworks for rental/purchase!
            </p>
            <MDBBtn
              rounded
              outline
              color="secondary"
              className="mt-5"
              onClick={() => {
                history.push("/gallery");
              }}
            >
              Explore the Gallery
            </MDBBtn>
          </MDBCol>
          <MDBCol md="1"></MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
