import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {auth} from '../components/Auth';
import './Header.css';

/**
 * Presents the user with a navigation bar to navigate the various pages of the web app.
 */
class Header extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }
    }
    render() {
        return (
            <div>
                PERSON PORTAL
                <br/>
                <AuthButton/>
                <p><Link to ='/persons' >persons</Link>
                    {'      '}
                    <Link to ='/home' >home</Link>
                </p>
                {this.props.location.pathname.substring(1)}
            </div>
        );
    }
}

/**
 * Presents the user with a log in button if the user is not logged in and a log out button with username if the user is
 * logged in.
 * @type {React.ComponentType<Own>}
 */
const AuthButton = withRouter(({ history }) => (
    auth.isAuthenticated ? (
            <button type="button" id="headerButton"
                    onClick={() => {
                auth.signout(() => history.push('/login'))
            }}>sign out {auth.user}</button>
    ) : (
        <button type="button" id="headerButton"
                onClick={() => {
                    history.replace('/login');
                }}>log in</button>
    )
))

export default withRouter(Header);
