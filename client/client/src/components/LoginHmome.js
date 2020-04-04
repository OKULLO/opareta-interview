import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';


class LoginHome extends Component{
    logOut(e){
        e.preventDefault()
        localStorage.removeItem('usertoken')
        this.props.history.push(`/`)
    }
    render(){
        const loginRegLink = (
            <ul className='navbar-nav'>
                
            </ul>
        )
    }

}
