function TimerModal({ onClose }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Session Complete!</h3>
                <p>Take a break or start the next session.</p>
                <button onClick={onClose} className="btn">
                    Close
                </button>
            </div>
        </div>
    );
}

export default TimerModal;