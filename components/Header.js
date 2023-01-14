import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Link route='/'>
                <a className="item">
                    Decentralized Research
                </a>
            </Link>
            <Menu.Menu position="right">
            <Link route='/author'>
                <a className="item">
                Author
                </a>
            </Link>
            <Link route='/reviewer'>
                <a className="item">
                Reviewer
                </a>
            </Link>
            <Link route='/editor'>
                <a className="item">
                Editor
                </a>
            </Link>
            </Menu.Menu>
        </Menu>
    )
}