import React, { Component } from 'react';
import { Card, Button, Image, Label } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';
import Manuscript from '../ethereum/manuscript';
import fields from '../fields';
import accountsinfo from '../accountsinfo';

class ManuscriptIndex extends Component {

  static async getInitialProps() {

    const manuscripts = await factory.methods.getManuscripts().call();
    const manuscriptsProps = [];

    await Promise.all(manuscripts.map(async (address) => {
      const manuscript = Manuscript(address);

      const summary = await manuscript.methods.getSummary().call();
      const title = summary[0];
      const author = summary[1];
      const editor = summary[2];
      const doccid = summary[3];
      const description = summary[4];
      const tags = summary[5];
      const field = summary[6];

      manuscriptsProps.push([address, title, author, editor, doccid, description, tags, field]);
    }));

    console.log(manuscriptsProps);

    return { manuscripts, manuscriptsProps };
  }

  renderManuscripts() {
    console.log(this.props.manuscriptsProps);

    if (this.props.manuscriptsProps.length == 0) {
      //return <p style={{ color: 'black', fontSize: '0.95em'}}>No manuscripts found</p>
    } else {
      return this.props.manuscriptsProps.map(manprops => {

        const address = manprops[0];
        const title = manprops[1];
        const author = manprops[2];
        const editor = manprops[3];
        const doccid = manprops[4];
        const description = manprops[5];
        const tags = manprops[6];
        const field = manprops[7];
        const fieldName = fields[field][0];
        const fieldImgUrl = fields[field][1];

        return (
          <Card>
            <Card.Content>
              <Image
                floated='right'
                size='mini'
                src={fieldImgUrl}
              />
              <Card.Header>{title}</Card.Header>
              <Card.Meta>
                <strong>Contract: </strong>{address}
                <br />
                <strong>Author: </strong>{accountsinfo[author][0] + " (" + author + ")"}
              </Card.Meta>
              <Card.Description>
                <strong>Description: </strong>{description}
                <br />
                <strong>Field: </strong>{fieldName}
                <br />
                <strong>Tags: </strong> {tags.map(tag => { return <Label>{tag}</Label> })}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Link route={`/manuscript/${address}`}>
                <a>
                  <Button basic color='blue'> View Details </Button>
                </a>
              </Link>
            </Card.Content>
          </Card>
        );
      });
    }
  }

  render() {
    return (
      <Layout>
        <div>
          <h2>Welcome to the decentralized review system</h2>
          <p>Decentralized Research is a blockchain based app that allows researchers to
            review the manuscripts of their peers without having of a third party involved
            like a journal or magazine. The entire review process is done through an open
            and transparent system where all the data is visible and accesible by everyone.
          </p>
          <h3>What do you want to do now?</h3>
          <p>If you want to check your submitted manuscripts or submit a new one, go to
            your author's webpage. If you are looking to review a manuscript, go to your
            reviewer's page. If you are an editor and you need to check the manuscripts under
            your supervision, go to your editor's page.
          </p>

          <div style={{ textAlign: 'center', margin: '30px' }}>
            <Link route={`/author`}>
              <a>
                <Button content="My Author's page" primary />
              </a>
            </Link>
            <Link route={`/reviewer`}>
              <a>
                <Button style={{ marginLeft: '15px' }} content="My Reviewer's page" primary />
              </a>
            </Link>
            <Link route={`/editor`}>
              <a>
                <Button style={{ marginLeft: '15px' }} content="My Editor's page" primary />
              </a>
            </Link>
          </div>

          <h3>Lastest submitted manuscripts</h3>

          <Card.Group>
            {this.renderManuscripts()}
          </Card.Group>

        </div>
      </Layout>
    )
  }
}

export default ManuscriptIndex;