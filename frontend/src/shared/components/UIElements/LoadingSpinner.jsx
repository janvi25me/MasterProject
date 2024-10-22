import PropTypes from 'prop-types';

import './LoadingSpinner.css';

const LoadingSpinner = props => {
  return (
    <div className={`${props.asOverlay && 'loading-spinner__overlay'}`}>
      <div className="lds-dual-ring"></div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  asOverlay: PropTypes.bool
}

export default LoadingSpinner;
