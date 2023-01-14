import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import Manuscript from '../../ethereum/manuscript';
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import ipfs from '../../ipfs';

class ReviewerNew extends Component {
    state = {
        errorMessage: '',
        loading: false,
        file: null
    };

    static async getInitialProps(props) {
        const manuscript = Manuscript(props.query.address);
        const summary = await manuscript.methods.getSummary().call();
        const reviewersList = await manuscript.methods.getReviewersList().call();
        return { 
            address: props.query.address,
            title: summary[0],
            reviewersList: reviewersList,
            manuscript: manuscript
        };
    }

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: ""});

        try {
        const accounts = await web3.eth.getAccounts();
        if(!this.props.reviewersList.includes(accounts[0])) {
            const e = new Error("Only reviewers can submit a review");
            throw e;
        }
        const added = await ipfs.add(this.state.file);
        const manuscript = Manuscript(this.props.address);
        await manuscript.methods.submitReview(added.path).send({
            from: accounts[0]
        });
            Router.pushRoute(`/manuscript/${this.props.address}`);        
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    onChange = async (e) => {
        this.setState({file: e.target.files[0]});
    }

    render() {
        return (
            <Layout>
                <h3>Submit a New Review</h3>
                <p>Fill the following form to submit a review of the corresponding manuscript. 
                    Remember that only reviewers elected from the editor are able to submit a review.
                </p>

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
                        <label>Document PDF</label>
                        <p>Please upload the review in PDF format. Any other file extension is not supported.</p>
                        <Input
                          type="file"
                          onChange={this.onChange}
                          required
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Submit Review</Button>
                </Form>
            </Layout>
        );
    }
}

export default ReviewerNew;