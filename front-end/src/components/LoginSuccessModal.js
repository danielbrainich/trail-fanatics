const LoginSuccessModal = ({ isVisible, onClose }) => {
    // if (!isVisible) return null;

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Login Successful!</h2>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  };

  export default LoginSuccessModal;
