import React, { Component } from 'react';

const LOCAL_STORAGE_POLLING_INTERVAL = 500; // ms
const URL = 'http://localhost:3000'; // TODO: NICO UNDO THIS
const HEARTBEAT_HTML_URL = `${URL}/heartbeat.html`
const GET_ACTIVE_SOLUTION_REQUEST_MESSAGE = 'GET_ACTIVE_SOLUTION';


export interface IProps {
  onReceiveNewActiveSolution: (solution: ISolution) => void;
}

interface IState {
  activeSolutionId: string | undefined;
}

class Heartbeat extends Component<IProps, IState> {
  node;
  pollingInterval;
  state;

  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = { activeSolutionId: undefined };
  }

  componentDidMount() {
    this.pollingInterval = setInterval(() => {
      this.requestActiveSolution();
    }, LOCAL_STORAGE_POLLING_INTERVAL);

    window.onmessage = this.onWindowMessage
  }

  componentWillUnmount() {
    clearInterval(this.pollingInterval);
    window.onmessage = null;
  }

  private requestActiveSolution = () => {
    if (this.node.current) {
      this.node.current.contentWindow!.postMessage(GET_ACTIVE_SOLUTION_REQUEST_MESSAGE, URL/* '*' */);
    }
  }

  private onWindowMessage = ({ origin, data }) => {
    if (origin !== URL) {
      return;
    }

    try {
      const solutionOrNull: ISolution | null = JSON.parse(data);
      if (solutionOrNull && this.state.activeSolutionId !== ) {
        this.setState({ activeSolutionId: solutionOrNull.id });
        this.props.onReceiveNewActiveSolution(solutionOrNull);
      }
    } catch (err) {
      console.error(err);
    }
  };


  render() {
    return <iframe
      style={{ display: 'none' }}
      src={HEARTBEAT_HTML_URL}
      ref={this.node}
    />
  }
}

export default Heartbeat
