import React from 'react'
import { connect } from 'react-redux'
import { selectSideElement } from '../reducers/actions'

import { REST_SERVER } from '../constants/constants'


class MainContent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tableRows: [],
		};
	}

	componentDidMount() {
		// Fetch polls from hyperledger REST API
		fetch(REST_SERVER + '/api/Poll')
		.then(result => {
			return result.json();
		}).then(data => {
			let polls = data.map((poll) => {
				return(
					<tr>
                    	<td>{poll.pollId}</td>
                    	<td>{poll.pollOwner.split("#")[1]}</td>
                    	<td>{poll.pollObject.title}</td>
                    	<td>{poll.pollObject.questions.length}</td>
                    </tr>
				)
			});
			this.setState({tableRows: polls});
		})
	}
	render() {
		return ( //<!-- className="active" -->
			<div class="content">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="header">
                                <h4 class="title">Polls in the blockchain</h4>
                                <p class="category">List of polls that are currently stored in the distributed ledger</p>
                            </div>
                            <div class="content table-responsive table-full-width">
                                <table class="table table-striped">
                                    <thead>
                                        <th>ID</th>
                                    	<th>Owner</th>
                                    	<th>Title</th>
                                    	<th>Questions</th>
                                    </thead>
                                    <tbody>
                                       {this.state.tableRows}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
		);
	}
}


//Arrow function (avoid typing return statement)
const mapStateToProps = (state) => ({
	sideElements: state.sideElements
})

//Same as above, but without arguments: simple object
const mapDispatchToProps = {
	sideElementAction: selectSideElement
}


export default connect(mapStateToProps, mapDispatchToProps)(MainContent);
