import React, { Component } from 'react'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import BootstrapTable from 'react-bootstrap-table-next'
import moment from 'moment';

class MyComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            displayData: [],
            acronyms: [],
            selectedStateAssociation: ''
        };

        this.createDisplayData = this.createDisplayData.bind(this)
        this.createStateAssociationAcronyms = this.createStateAssociationAcronyms.bind(this)
        this.createStateAssociationDropdown = this.createStateAssociationDropdown.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }



    componentDidMount() {
        fetch("https://challenge.nfhsnetwork.com/v2/search/events/upcoming?state_association_key=18bad24aaa&size=50")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result.items
                    })
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }



    createDisplayData() {
        let data = {}
        let filteredItems = new Set()
        this.state.items.map(item => {
            if (item.teams && item.teams.length > 0) {
                for (let team of item.teams) {
                    if (team.state_association_acronym !== "" && team.state_association_acronym === this.state.selectedStateAssociation) {
                        filteredItems.add(item)
                    }
                }
            }
        })
        Array.from(filteredItems).map(item => {
            data = {}
            data.key = item.key
            item.publishers.map(publisher => {
                publisher.broadcasts.map((broadcast) => {
                    data.headline = broadcast.headline
                    data.subheadline = broadcast.subheadline
                    data.start_time = moment(broadcast.start_time).format("LLL")
                })
            })
            this.state.displayData.push(data)
        })
    }

    createStateAssociationAcronyms() {
        let acronymsSet = new Set()
        this.state.items.map(item => {
            if (item.teams && item.teams.length > 0) {
                for (let team of item.teams) {
                    if (team.state_association_acronym !== "") {
                        acronymsSet.add(team.state_association_acronym)
                    }
                }
            }
        })
        this.state.acronyms = Array.from(acronymsSet)
    }

    handleChange(e) {
        this.setState({
            selectedStateAssociation: e.target.value
        })
        this.setState({
            displayData: []
        })
    }

    createStateAssociationDropdown() {
        let results = this.state.acronyms;
        let optionResults = results.map((result) =>
            <option>{result}</option>
        );

        return (
            <div>
                <label for="stateassociation">State Association</label>
                <select
                    id="stateassociation" value={this.state.selectedStateAssociation}
                    onChange={this.handleChange}
                >
                    {optionResults}
                </select>
            </div>
        )
    }

    render() {
        const { error, isLoaded, displayData } = this.state;
        const columns = [{
            dataField: 'key',
            text: 'Key'
        }, {
            dataField: 'headline',
            text: 'Headline'
        }, {
            dataField: 'subheadline',
            text: 'Subheadline'
        }, {
            dataField: 'start_time',
            text: 'Start Time'
        }]

        if (error) {
            return <div>Error: {error.message}</div>
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        }
        return (
            <div>
                {this.createDisplayData()}
                {this.createStateAssociationAcronyms()}
                {this.createStateAssociationDropdown()}
                <br />
                <label for="startdate">Start Date: </label>
                <input type="text" name="startdate" />
                <label for="enddate">End Date: </label>
                <input type="text" name="enddate" />
                <br />

                <BootstrapTable keyField='key' data={displayData} columns={columns} />

            </div>
        )
    }

}

export default MyComponent
