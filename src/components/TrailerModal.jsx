import React from 'react';
import YouTubePlayer from './YoutubePlayer';
import '../styles/trailerModal.scss';

const TrailerModal = ({ isOpen, onClose, videoKey, movieTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                <h2 className="movie-title">{movieTitle}</h2>
                <YouTubePlayer videoKey={videoKey} />
            </div>
        </div>
    );
};

export default TrailerModal;