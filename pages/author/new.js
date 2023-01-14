import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message} from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import ipfs from '../../ipfs';
import editors from '../../editors';

class ManuscriptNew extends Component {
    state = {
        title: '',
        description: '',
        keywords: '',
        field: '5',
        errorMessage: '',
        loading: false,
        file: null,
    };

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: ""});

        try {
        const accounts = await web3.eth.getAccounts();

        console.log(accounts[0]);
        console.log(web3);

        const added = await ipfs.add(this.state.file);

        var tagsTogether = new String(this.state.keywords);
        var tagsSplit = tagsTogether.split(/[, ]+/);

        const fieldNumber = parseInt(this.state.field);
        const editor = editors[fieldNumber];

        await factory.methods
            .submitManuscript(editor, added.path, this.state.title, this.state.description, tagsSplit, fieldNumber)
            .send({
                from: accounts[0]
            });
            Router.pushRoute('/author');        
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    onChange = async (e) => {
        this.setState({file: e.target.files[0]});
    }

    render() {
        console.log("render");
        console.log(web3.eth.getAccounts[0]);

        return (
            <Layout>
                <h3>Submit new manuscript</h3>

                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Title
                        <Input 
                            value={this.state.title}
                            onChange={event => this.setState({title: event.target.value})}
                            required
                        />
                        </label>
                        <label>Description
                        <Input 
                            value={this.state.description}
                            onChange={event => this.setState({description: event.target.value})}
                            required
                            />
                        </label>
                        <label style={{ marginTop: '10px' }}>Field of Research
                        <select 
                            value={this.state.field}
                            onChange={event => this.setState({field: event.target.value})}>
                                <option value='0'>Physical, Chemical and Earth Sciences</option>
                                <option value='1'>Humanities and Creative Arts</option>
                                <option value='2'>Engineering and Environmental Sciences</option>
                                <option value='3'>Education and Human Society</option>
                                <option value='4'>Economics and Commerce</option>
                                <option selected value='5'>Mathematical, Information and Computing Sciences</option>
                                <option value='6'>Biological and Biotechnological Sciences</option>
                                <option value='7'>Medical and Health Sciences</option>
                        </select>
                        </label>
                        <label>Tags/Keywords</label>
                        <p>Provide the tags/keywords separated by commas (e.g. "keyword1, keyword2, keyword3")</p>
                        <Input 
                            value={this.state.keywords}
                            onChange={event => this.setState({keywords: event.target.value})}
                            required
                        />
                        <label>Document PDF</label>
                        <p>Please upload the manuscript in PDF format. Any other file extension is not supported.</p>
                        <Input
                          type="file"
                          onChange={this.onChange}
                          required
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button loading={this.state.loading} primary>Submit</Button>
                </Form>
            </Layout>
        );
    }
}

export default ManuscriptNew;