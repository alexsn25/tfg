import React, {Component} from 'react';
import {Table, Button} from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import manuscript from '../ethereum/manuscript';
import accountsinfo from '../accountsinfo';

class ReviewRow extends Component {
    render() {
        const {Row, Cell} = Table;
        const {id, review, reviewersCount} = this.props;
        const absUrl = 'https://gateway.pinata.cloud/ipfs/' + review.doccid;
        return (
        <Row>
            <Cell>{id}</Cell>
            <Cell>{accountsinfo[review.reviewer][0] + " (" + review.reviewer + ")"}</Cell>
            <Cell>{review.doccid}</Cell>
            <Cell>
                <a href={absUrl} target="_blank">
                    <Button basic color='blue'>View</Button>
                </a>
            </Cell>
        </Row>
        );
    }
}

export default ReviewRow;