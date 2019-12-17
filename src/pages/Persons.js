import React, { Component } from 'react';
import {server} from '../config';
import './Persons.css';

class Persons extends Component{

    state = {
        personsList: [
            {
                id: 1,
                firstName: "Cool",
                surName: "Cat",
                ssn: 9009161358,
                country: "Sweden",
                city: "Stockholm",
            },
            {
                id: 2,
                firstName: "Klas",
                surName: "Banan",
                ssn: 9908161756,
                country: "UK",
                city: "London",
            }

        ],
    }


    constructor(props) {
        super(props);
        //this.fetchPersons();
    }

    fetchPersons(){
        fetch(server + "/getPersons")
            .then((response) => {
                return response.json();
            })
            .then((response) =>
            {
                if ((response.error) && response.status === 403) {
                    alert("Not Authorized!");
                    this.props.history.replace('/authPersons');
                }
                else if (response.error) throw new Error("Something went wrong. Please try again.");
                else return response;
            })
            .then(data =>{
                this.updatePersonsList(data);})
            .catch(e => {
                alert(e.message);
            })
    }

    updatePersonsList(data){
        this.setState({personsList: data})
    }

    showPersonsList() {
        if(this.state.personsList && this.state.personsList.length > 0){
            return <table>
                <tbody>
                <tr>
                    <td>{"ID"}</td>

                    <td>{"First name"}</td>

                    <td> {"Surname"}</td>

                    <td> {"SSN"}</td>

                    <td>{"Country"}</td>

                    <td> {"City"}</td>
                </tr>
                { this.state.personsList.map((person, index) =>
                    <tr key={"l" + person.id}>
                        <td>{person.id}</td>

                        <td>{person.firstName}</td>

                        <td>{person.surName}</td>

                        <td>{person.ssn}</td>

                        <td>{person.country}</td>

                        <td>{person.city}</td>
                    </tr>)
                }
            </tbody>
            </table>;
        }
        else{
            return <div id={"listView"}>no results</div>
        }
    }


    render(){
        return(
                this.showPersonsList()
        )
    }

}

export default Persons;