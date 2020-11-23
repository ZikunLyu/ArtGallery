import React, { Component } from "react";
import './profile/common-css/fluidbox.min.css';
import './profile/css/styles.css';
import axios from 'axios';
import profile from '../images/profile.jpg'


export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            user: [],
            exper: [],
            a: ['1', '2', '3']
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: 'http://localhost:3001/api/v1/users/getAUser',
            params: { email: new URLSearchParams(this.props.location.search).get("email") }
        }).then(res => { 
            console.log(res.data.user);
            const user = res.data.user;
            this.setState({ user: user });
        }).catch((err) => console.log(err));

        axios({
            method: 'get',
            url: 'http://localhost:3001/api/v1/expers/getAllExperience',
            params: { email: new URLSearchParams(this.props.location.search).get("email") }
        }).then(res => {
            console.log(res.data.exper);
            const exper = res.data.exper;
            this.setState({ exper: exper });
        }).catch((err) => console.log(err));

    }

    handleSubmit(e) {
        e.preventDefault();
    }

    // renderUserName() {
    //     const name = this.state.user.age;
    //     return name;
    // }

    render() {

        return (
            <div>
                <header>
                    <div class="container">
                        <div class="heading-wrapper">
                            <div class="row">
                                <div class="col-sm-6 col-md-6 col-lg-4">
                                    <div class="info">
                                        <div class="right-area">
                                            <h5>{this.state.user.street}</h5>
                                            <h5>{this.state.user.region}</h5>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-6 col-md-6 col-lg-4">
                                    <div class="info">
                                        {/* <i class="icon ion-ios-telephone-outline"></i> */}
                                        <div class="right-area">
                                            <h5>Major: {this.state.user.major}</h5>
                                            <h6>MIN - FRI,8AM - 7PM</h6>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-6 col-md-6 col-lg-4">
                                    <div class="info">
                                        {/* <i class="icon ion-ios-chatboxes-outline"></i> */}
                                        <div class="right-area">
                                            <h5>{this.state.user.email}</h5>
                                            <h6>REPLY IN 24 HOURS</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </header>

                <section class="intro-section">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-1 col-lg-2"></div>
                            <div class="col-md-10 col-lg-8">
                                <div class="intro">
                                    <div class="profile-img">
                                        <img src={profile} alt="" />
                                    </div>
                                    <h2><b>{this.state.user.name}</b></h2>
                                    <h4 class="font-yellow">McGill Student</h4>
                                    <ul class="information margin-tb-30">
                                        {/* <li><b>BORN : </b>August 25, 1997</li> */}
                                        {/* <li><b>EMAIL : </b>{this.state.user.email}</li> */}
                                        {/* <li><b>Age : </b>{this.state.user.age}</li> */}
                                    </ul>
                                    <ul class="social-icons">
                                        <li><a href="#"><i class="ion-social-pinterest"></i></a></li>
                                        <li><a href="#"><i class="ion-social-linkedin"></i></a></li>
                                        <li><a href="#"><i class="ion-social-instagram"></i></a></li>
                                        <li><a href="#"><i class="ion-social-facebook"></i></a></li>
                                        <li><a href="#"><i class="ion-social-twitter"></i></a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="about-section section">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="heading">
                                    <h3><b>About me</b></h3>
                                </div>
                            </div>
                            <div class="col-sm-8">
                                <p class="margin-b-50">{this.state.user.about}</p>

                            </div>
                        </div>
                    </div>
                </section>

                <section class="experience-section section">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="heading">
                                    <h3 style={{ color: 'white' }}><b>Experience</b></h3>
                                    <h6 class="font-lite-black"><b>My Journey</b></h6>
                                </div>
                            </div>
                            <div class="col-sm-8">
                            {this.state.exper.map((exp) =>
                                <div class="experience margin-b-50">
                                    <h4 style={{ color: 'white' }}><b>{exp.title}</b></h4>
                                    {/* <h6 class="margin-t-10" style={{ color: 'white' }}>{exp.date}</h6>  */}
                                    <p class="font-semi-white margin-tb-30" style={{ color: 'white' }}>{exp.description}</p>
                                </div>
                                  )}
                            </div>
                        </div>
                    </div>

                </section>
            </div>
        )
    }
}