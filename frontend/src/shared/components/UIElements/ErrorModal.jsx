import {PropTypes} from 'prop-types'
import Modal from './Modal';
import Button from '../FormElements/Button';

const ErrorModal = props => {
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onClear()
  }
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<Button onClick={handleSubmit}>Okay</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

ErrorModal.propTypes = {
   onClear : PropTypes.func.isRequired,
   error: PropTypes.string
}

export default ErrorModal;
