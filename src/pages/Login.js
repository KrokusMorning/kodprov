import React, {Component} from "react";
import {
    Redirect,
} from "react-router-dom";
import {auth} from '../components/Auth';
import {server} from '../config';

/**
 * Presents the user with a log in form taking username and password. The given values is then posted to the server as a
 * form using fetch.
 */
class Login extends Component{

    state = {
        redirectToReferrer: false,
        username: "",
        password: "",
        usernameError: "",
        passwordError: "",
        genericErrorMessage: "*required"
    }

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
        this.errors = this.errors.bind(this);
        this.mockLogin = this.mockLogin.bind(this);
    }

    /**
     * Checks if any of the input fields are empty and in that case sets the corresponding error state variable to an
     * error message.
     * @returns {boolean}
     */
    errors(){
        let error = false;
        if (this.state.username === null || this.state.username === "") {
            this.setState(() => ({ usernameError: this.state.genericErrorMessage}));
            error = true;
        }
        if (this.state.password === null || this.state.password === "") {
            this.setState(() => ({ passwordError: this.state.genericErrorMessage}));
            error = true;
        }
        return error;

    }

    /**
     * Checks for input errors and then posts the login form to the server.
     * On success sets authenticated to true and adds username in const auth in file
     * Auth. This version logs in the user even if credentials are wrong to simulate login.
     * @param event
     */
    login(event){
        event.preventDefault();
        if(this.errors())
            return;

        const data = new FormData(event.target);
        const url = server;

        fetch(url + '/perform_login', {
            credentials: 'include',
            method: 'POST',
            body: data,
        })
            .then((response) => {
                console.log(response)
                if(!response.ok && response.status === 401) throw new Error("Wrong username or password");
                else if(!response.ok) throw new Error("Oops! Something went wrong. Please try again in a few minutes.");
                else return response.json();
            })
            .then((data) => {
                auth.authenticate(() => {
                    this.setState({ redirectToReferrer: true }, ()=>{auth.user = data.username; this.props.history.replace('/applications')})
                });
            })
            .catch((error) => {
                alert("Mock login activated");
                this.mockLogin();
            });
    };

    /**
     * Handles input from the input fields and updates their corresponding state variables.
     * @param event
     */
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;


        this.setState({
            [name]: value,
            [name + "Error"]: null,

        });
    }

    mockLogin(){
        auth.authenticate(() => {
                this.setState({ redirectToReferrer: true }, ()=>{auth.user = "username"; this.props.history.replace('/persons')})
        });
    }

    render(){

        const { from } = this.props.location.state || { from: { pathname: '/' } }
        const { redirectToReferrer } = this.state

        if (redirectToReferrer === true) {
            return <Redirect to={from} />
        }

        return(
            <div>
                <form onSubmit={this.login}>
                    <label>
                        Username:
                        <input
                            name="username"
                            type="text"
                            value={this.state.username}
                            onChange={this.handleInputChange}/>
                        {!!this.state.usernameError && (<p style={{color: 'red', float: "right"}}>{this.state.usernameError}</p>)}
                    </label>
                    <br />
                    <label>
                        Password:
                        <input
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.handleInputChange}/>
                        {!!this.state.passwordError && (<p style={{color: 'red', float: "right"}}>{this.state.passwordError}</p>)}
                    </label>
                    <br/>
                    <input type="submit" value="Submit" />
                </form>
                <br/>
            </div>
        )
    }
}

export default Login;