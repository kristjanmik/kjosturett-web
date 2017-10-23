/* global google */
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class Autocomplete extends React.PureComponent {
  static propTypes = {
    onChange: PropTypes.func,
  };

  state = {
    autocomplete: null,
  };

  componentDidMount() {
    const element = ReactDOM.findDOMNode(this);
    const autocomplete = new google.maps.places.Autocomplete(element, {
      componentRestrictions: {
        country: 'is',
      },
      types: ['geocode'],
    });
    this.changeListener = google.maps.event.addListener(
      autocomplete,
      'place_changed',
      this.onChange,
    );
    this.setState({
      autocomplete,
    });
  }

  componentWillUnmount() {
    google.maps.event.removeListener(this.changeListener);
  }

  onChange = () => {
    const place = this.state.autocomplete.getPlace();

    if (this.props.onChange) {
      this.props.onChange(place);
    }
  };

  getPlace() {
    return (
      this.state.autocomplete.getPlace() || {
        name: this.input.value || this.input.placeholder,
      }
    );
  }

  render() {
    const { onChange, ...props } = this.props;
    return <input ref={input => { this.input = input }} {...props} />;
  }
}

export default Autocomplete;
