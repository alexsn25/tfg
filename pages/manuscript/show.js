import React, {Component} from 'react';
import { Card, Grid, Button, Table, Label } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Manuscript from '../../ethereum/manuscript';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';
import ReviewRow from '../../components/ReviewRow';
import fields from '../../fields';
import accountsinfo from '../../accountsinfo';

class ManuscriptShow extends Component {

    state = {
        isEditor: false,
        isReviewer: false
    }
    
    constructor(props) {
        super(props)
        this.button = React.createRef();
      }
    
      componentDidMount() {
        this.button.current.click();
      }

    static async getInitialProps(props) {
        const manuscript = Manuscript(props.query.address);

        const summary = await manuscript.methods.getSummary().call();
        const reviewsCount = await manuscript.methods.getReviewsCount().call();

        const reviews = await Promise.all(
            Array(parseInt(reviewsCount))
            .fill()
            .map((element, index) => {
                return manuscript.methods.reviews(index).call()
            })
        );

        const reviewersList = await manuscript.methods.getReviewersList().call();

        console.log(summary);
        console.log(reviews);
        console.log(reviewersList);

        const fieldName = fields[summary[6]][0];
        const fieldImgUrl = fields[summary[6]][1];
        
        return {
            address: props.query.address,
            title: summary[0],
            author: summary[1],
            editor: summary[2],
            doccid: summary[3],
            description: summary[4],
            tags: summary[5],
            fieldName: fieldName,
            fieldImgUrl: fieldImgUrl,
            reviews: reviews,
            reviewersList: reviewersList,
            reviewsCount: reviewsCount
        };
    }

    renderReviewersList() {
        var rl = this.props.reviewersList;
        if(rl.length == 0) {
            return <p style={{ color: 'black', fontSize: '0.95em', margin: '0em'}}>No reviewers assigned yet</p>
        } else {
        var list = rl.map(function(address){
                        return <li>{accountsinfo[address][0] + " (" + address + ") from " + accountsinfo[address][1]}</li>;
                      })
            return  <ul style={{ margin: '0', listStyleType: 'none', padding: '0'}}>{ list }</ul>
        }
    }

    renderRows() {
        return this.props.reviews.map((review, index) => {
            return <ReviewRow
                key={index}
                id={index}
                review={review}
                address={this.props.address}
                reviewsCount={this.props.reviewsCount}
            />;
        });
    }

    checkAccount = async event => {
        const accounts = await web3.eth.getAccounts();
        this.setState({isEditor: accounts[0] == this.props.editor, isReviewer: this.props.reviewersList.includes(accounts[0])})
    }

    reviewButton() {
        if(this.state.isReviewer){
        return (
        <Link route={`/manuscript/${this.props.address}/newreview`}>
            <a>
                <Button floated="right" content="New Review" icon="add circle" style={{marginBottom: 10}} primary />
            </a>
        </Link>
        );
        }
    }

    reviewersButton() {
        if(this.state.isEditor){
            return (
            <Link route={`/manuscript/${this.props.address}/newreviewer`}>
                <a>
                    <Button content="Add Reviewer" icon="add circle" style={{marginTop: 10}} primary/>
                </a>
            </Link>
            );
        }
    } 

    renderTags() {
        return this.props.tags.map(tag => {
            return <Label>
                {tag}
            </Label>
        });
    }

    renderField() {
        return (
        <Label color='grey' image>
        <img src={this.props.fieldImgUrl} />
        {this.props.fieldName}
        </Label>
        );
    }

    render() {

        const {Header, Row, HeaderCell, Body} = Table;
        const absUrl = 'https://gateway.pinata.cloud/ipfs/' + this.props.doccid;

        return (
            <Layout>
                <h3>Manuscript Details</h3>
                <h4><div style={{ float: 'left' }}>Title: &nbsp;</div> <div style={{ fontWeight: 'normal' }}>{this.props.title}</div></h4>
                <h4><div style={{ float: 'left' }}>Description: &nbsp;</div> <div style={{ fontWeight: 'normal' }}>{this.props.description}</div></h4>
                <h4><div style={{ float: 'left' }}>Field of Research: &nbsp;</div> <div style={{ fontWeight: 'normal' }}>{this.renderField()}</div></h4>
                <h4><div style={{ float: 'left' }}>Tags/Keywords: &nbsp;</div> <div style={{ fontWeight: 'normal' }}>{this.renderTags()}</div></h4> 
                <h4><div style={{ float: 'left' }}>Contract Address: &nbsp;</div> <div style={{ fontWeight: 'normal' }}>{this.props.address}</div></h4>
                <h4><div style={{ float: 'left' }}>Author: &nbsp;</div> <div style={{ fontWeight: 'normal' }}>
                    {accountsinfo[this.props.author][0] + " (" + this.props.author + ") from " + accountsinfo[this.props.author][1]}</div></h4>
                <h4><div style={{ float: 'left' }}>Editor: &nbsp;</div> <div style={{ fontWeight: 'normal' }}>
                    {accountsinfo[this.props.editor][0] + " (" + this.props.editor + ") from " + accountsinfo[this.props.editor][1]}</div></h4>
                <h4><div style={{ float: 'left' }}>Reviewers: &nbsp;</div> <div style={{ fontWeight: 'normal', display: 'inline-block' }}>{this.renderReviewersList()}{this.reviewersButton()}</div></h4>
                <h4><div style={{ float: 'left' }}>Document CID: &nbsp;</div> <div style={{ fontWeight: 'normal' }}>{this.props.doccid}</div></h4>
                <h3>Document View</h3>
                <iframe src={absUrl} width="100%" height="500px"></iframe>
                <h3>Manuscript Reviews</h3>
                {this.reviewButton()}
                <Table>
                <Header>
                    <Row>
                        <HeaderCell>ID</HeaderCell>
                        <HeaderCell>Reviewer Address</HeaderCell>
                        <HeaderCell>Document CID</HeaderCell>
                        <HeaderCell>View</HeaderCell>
                    </Row>
                </Header>
                <Body>
                    {this.renderRows()}
                </Body>
                </Table>
                <div>Found {this.props.reviewsCount} reviews</div>
                <button ref={this.button} onClick={this.checkAccount} hidden></button>
            </Layout>
        );
    }
}

export default ManuscriptShow;