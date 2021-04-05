import React from 'react';
import playIcon from '../assets/play.svg';

function PlayerArea({ playChord, handleNew, gameStatus, attempts, currDelays, updateAttempts, updateDelays }) {
    return (
        <div className="player-area">
            <div className="wrapper">
                <div className="player-grid">
                    <div className="play-buttons">
                        <div className={gameStatus === 'initial' ? 'play-delay disabled' : 'play-delay'}>
                            <span>delay</span>
                            {currDelays &&
                                currDelays.map(([label, isChecked], i) => (
                                    <label key={label}>
                                        <input
                                            type="checkbox"
                                            name="delay"
                                            value={i}
                                            disabled={gameStatus === 'initial'}
                                            checked={isChecked}
                                            onChange={updateDelays}
                                        />
                                        <span>{label}</span>
                                    </label>
                                ))}
                        </div>
                        <button
                            type="button"
                            className="btn"
                            name="piano"
                            disabled={gameStatus === 'initial'}
                            onClick={playChord}
                        >
                            <span className="emoji">&#127929;</span>
                            <span className="play-svg">
                                <img src={playIcon} alt="play-button" />
                            </span>
                        </button>
                        <button
                            type="button"
                            className="btn"
                            name="guitar"
                            disabled={gameStatus === 'initial'}
                            onClick={playChord}
                        >
                            <span className="emoji">&#127928;</span>{' '}
                            <span className="play-svg">
                                <img src={playIcon} alt="play-button" />
                            </span>
                        </button>
                    </div>
                    <div className="player-new">
                        <button type="button" className="btn" disabled={gameStatus === 'isRunning'} onClick={handleNew}>
                            new round
                        </button>
                    </div>
                    <div className="player-choices">
                        {attempts &&
                            attempts.map(([suffix, value]) => {
                                const classname =
                                    gameStatus === 'initial' || (value !== 1 && value !== -1)
                                        ? 'btn'
                                        : value === 1
                                        ? 'btn right'
                                        : 'btn wrong';
                                return (
                                    <button
                                        key={suffix}
                                        type="button"
                                        className={classname}
                                        name={suffix}
                                        value={value}
                                        disabled={gameStatus === 'initial' || gameStatus === 'isNewRound'}
                                        onClick={gameStatus === 'isFound' ? playChord : updateAttempts}
                                    >
                                        {gameStatus === 'isFound' ? (
                                            <span>
                                                {suffix}
                                                <img src={playIcon} alt="play-button" />
                                            </span>
                                        ) : (
                                            suffix
                                        )}
                                    </button>
                                );
                            })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerArea;
