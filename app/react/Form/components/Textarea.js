import React, {Component, PropTypes} from 'react';

export class Textarea extends Component {

  render() {
    const {label} = this.props;
    let className = 'form-group';
    if (this.props.touched && !this.props.valid) {
      className += ' has-error';
    }
    return (
      <div className={className}>
        <label>{label}</label>
        <textarea className="form-control" {...this.props}/>
      </div>
    );
  }

}

Textarea.propTypes = {
  properties: PropTypes.object,
  label: PropTypes.string,
  touched: PropTypes.bool,
  valid: PropTypes.bool
};

export default Textarea;
