// Using React, here are the components we'll use to mock Pinafore/Brutaldon

/*
NavBar - component to hold our navButtons
  navButtons ie. notifications, community, local, search, etc...
Timeline - component that holds the toots
  a post toot component - (toot header, body, footer)
  individual Toot components
 */
import React, { Component } from 'react';
import Nav from './Nav.js';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      navBtns: ['Local', 'Notifications', 'Home'],
    };
  }
  componentDidMount() {
    this.getToots();
  }
  getToots() {
    fetch('https://fosstodon.org/api/v1/timelines/public?local')
      .then(response => {
        return response.json();
      })
      .then(myJson => {
        this.setState({ endpoint: myJson });
      });
  }
  render() {
    return (
      <div>
        <Nav navBtns={this.state.navBtns} />
        <h1>Hello World</h1>
        {this.state.endpoint ?
          this.state.endpoint.map(el => {
            return <div>{el.content}</div>;
          })
            : <div />}
      </div>
    );
  }
}
export default App;

// https://fosstodon.org//api/v1/timelines/public?local

