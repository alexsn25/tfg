import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import Manuscript from '../../ethereum/manuscript';

class ReviewerNew extends Component {
    state = {
        reviewer: '',
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(props) {
        const manuscript = Manuscript(props.query.address);
        const summary = await manuscript.methods.getSummary().call();
        return { 
            address: props.query.address,
            title: summary[0],
            editor: summary[2],
            manuscript: manuscript
        };
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: ""});

        try {
        const accounts = await web3.eth.getAccounts();
        if(this.props.editor != accounts[0]) {
            const e = new Error("Only the editor can assing a reviewer");
            throw e;
        }
        const manuscript = Manuscript(this.props.address);
        await manuscript.methods.assignReviewer(this.state.reviewer).send({
            from: accounts[0]
        });
            Router.pushRoute(`/manuscript/${this.props.address}`);        
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <h3>Assign new reviewer</h3>
                <p>Fill the following form to assign a reviewer to a manuscript. 
                    Once the reviewer is assigned, he/she will be able to submit 
                    a review for that manuscript.</p>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Manuscript
                        <Input 
                            value={ this.props.title + ' (' + this.props.address + ')'}
                            disabled
                            />
                        </label>
                    </Form.Field>
                    <Form.Field>
                        <label>Reviewer Address
                        <Input 
                            value={this.state.reviewer}
                            onChange={event => this.setState({reviewer: event.target.value})}
                            required
                            />
                        </label>
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Assign Reviewer</Button>
                </Form>
            </Layout>
        );
    }
}

export default ReviewerNew;