import React from 'react';
import {Nav} from 'react-bootstrap';
import CollectionsBookmarkTwoToneIcon from '@material-ui/icons/CollectionsBookmarkTwoTone';
import purple from '@material-ui/core/colors/purple';
import pink from '@material-ui/core/colors/pink';
import IconButton from '@material-ui/core/IconButton';
import MenuBookTwoToneIcon from '@material-ui/icons/MenuBookTwoTone';

const MyNavbar = (props) => {

  return (
    <Nav className="justify-content-center" activeKey="/home">
    <Nav.Item>
      <Nav.Link href="/books">
          <IconButton aria-label="add" >
            <MenuBookTwoToneIcon style={{ color: purple[900] }} fontSize="large"/>
          </IconButton>
        Books
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link href="/collections">
          <IconButton aria-label="add" >
            <CollectionsBookmarkTwoToneIcon style={{ color: pink[900] }} fontSize="large"/>
          </IconButton>
        Collections
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link href="/test">
        Test books
      </Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link href="/test2">
        Test collections
      </Nav.Link>
    </Nav.Item>
  </Nav>
  );
}

export default MyNavbar;