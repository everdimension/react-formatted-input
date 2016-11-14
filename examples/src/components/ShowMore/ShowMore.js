import React, { PropTypes } from 'react';
import './ShowMore.css';

const propTypes = {
  expanded: PropTypes.bool,
  keepInDOM: PropTypes.bool,
  children: PropTypes.node.isRequired,
  collapsedText: PropTypes.string,
  expandedText: PropTypes.string,
};

const defaultProps = {
  expanded: false,
  keepInDOM: true,
  collapsedText: 'Show code',
  expandedText: 'Hide code',
};

class ShowMore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  render() {
    const { collapsedText, expandedText, keepInDOM, children } = this.props;
    const { expanded } = this.state;
    const childrenToDisplay = expanded ? children : null;
    return (
      <div className="ShowMore">
        <button className="ShowMoreBtn" onClick={this.handleClick}>
          {expanded ?
            expandedText :
            collapsedText
          }
        </button>
        {keepInDOM ? (
          <div style={expanded ? null : { display: 'none' }}>
            {children}
          </div>
        ) : (
          childrenToDisplay
        )}
      </div>
    );
  }
}

ShowMore.propTypes = propTypes;
ShowMore.defaultProps = defaultProps;

export default ShowMore;
