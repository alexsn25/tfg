import React, { Component } from 'react';
import web3 from '../../ethereum/web3';
import { Card, Button, Loader, Dimmer, Segment, Image, Label } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import Manuscript from '../../ethereum/manuscript';
import fields from '../../fields';
import accountsinfo from '../../accountsinfo';


class AuthorIndex extends Component {

  state = {
    authoredManuscripts: null
  };

  constructor(props) {
    super(props)
    this.button = React.createRef();
  }

  componentDidMount() {
    this.button.current.click();
  }

  loadManuscripts = async event => {
    const accounts = await web3.eth.getAccounts();
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
      
        if(author == accounts[0]) {
          manuscriptsProps.push([address, title, author, editor, doccid, description, tags, field]);
        }

    }));

    this.setState({authoredManuscripts: manuscriptsProps});
  }

  renderManuscripts() {

    if((this.state.authoredManuscripts != null) && (this.state.authoredManuscripts.length != 0)) {
        return this.state.authoredManuscripts.map(manprops => {

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
    } else if(this.state.authoredManuscripts != null) {
        return <p style={{ color: 'black', fontSize: '0.95em'}}>No manuscripts found</p>
    } else {
        return (
            <Segment>
                <Dimmer active inverted>
                    <Loader size='large'>Loading</Loader>
                </Dimmer>
            <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' />
            </Segment>
        )
    }
}

  render() {
    return (
    <Layout> 
    <div>
        <h2>My Author's page</h2>
        <p>This is your Author's page. Down below you will find the manuscripts 
            you have submitted and that are in the process of being reviewed. </p>
        <Link route={`/author/new`}>
        <a>
        <Button floated="right" content="Submit Manuscript" icon="add circle" primary/>
        </a>
        </Link>
        <h3>My Manuscripts</h3>
        {this.renderManuscripts()}
    </div>
    <button ref={this.button} onClick={this.loadManuscripts} hidden></button>
    </Layout>
    )
  }
}


export default AuthorIndex;