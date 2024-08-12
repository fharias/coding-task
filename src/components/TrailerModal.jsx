import React from 'react';
import ReactPlayer from 'react-player';
import '../styles/trailerModal.scss';

const TrailerModal = ({ videoKey, onClose, movie }) => {
    return (
        <div className="trailer-modal-overlay" onClick={onClose}>
            <div className="trailer-modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                <div className="modal-header">
                    {movie && <h2>{movie.title}</h2>}
                </div>
                <div className="modal-body">
                    <ReactPlayer
                        className="video-player"
                        url={`https://www.youtube.com/watch?v=${videoKey}`}
                        controls={true}
                        playing={true}
                        width="100%"
                        height="100%"
                    />
                </div>
            </div>
        </div>
    );
};

export default TrailerModal;