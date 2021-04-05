import React, { useState } from 'react';
import Volume from './Volume.js';
import { analyseStats } from '../utils/helpers.js';
import statIcon from '../assets/statistics.svg';

function Settings({
    currSuffixes,
    allRootLabels,
    currRootLabel,
    updateSettings,
    statistics,
    volume,
    currVolumes,
    updateVolume
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    const handleMenu = () => setIsMenuOpen(prev => !prev);
    const handleStats = () => setIsStatsOpen(prev => !prev);

    const stats = statistics.length > 0 ? analyseStats(statistics) : null;

    return (
        <div className="settings">
            <div className="wrapper">
                <div className="menu-container">
                    <Volume volume={volume} currVolumes={currVolumes} updateVolume={updateVolume} />
                    {!isMenuOpen && (
                        <div className={isStatsOpen ? 'stats-icon open' : 'stats-icon'} onClick={handleStats}>
                            <img src={statIcon} alt="open statistics" />
                        </div>
                    )}
                    <div
                        className={isMenuOpen || isStatsOpen ? 'menu-icon open' : 'menu-icon'}
                        onClick={isStatsOpen ? handleStats : handleMenu}
                    >
                        <div className="icon-inner">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>

                    <div className={isStatsOpen ? 'stats open' : 'stats'}>
                        <h3>{stats ? 'Stats:' : 'No statistics yet'}</h3>
                        {stats && (
                            <div className="stats-grid">
                                <hr />
                                <h5>Rounds played:</h5>
                                <p>{statistics.length}</p>
                                <hr />
                                <h5>Flawless rounds:</h5>
                                <p>{stats.flawless}</p>
                                <hr />
                                <h5>Average tries:</h5>
                                <p>{stats.avgTries.toFixed(3)}</p>
                                <hr />
                                <h5 className="span-2">Best identified:</h5>
                                {stats.bestIdentified.map((item, i) => (
                                    <p key={`${item}-${i}`} className="span-2 indent">
                                        <span className="bold width-60px">{item.suffix}:</span> {item.mistakes} mistakes
                                        in {item.count} round(s)
                                    </p>
                                ))}
                                <hr />
                                <h5 className="span-2">Worst identified:</h5>
                                {stats.worstIdentified.map((item, i) => (
                                    <p key={`${i}-${item}`} className="span-2 indent">
                                        <span className="bold width-60px">{item.suffix}:</span> {item.mistakes} mistakes
                                        in {item.count} round(s)
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={isMenuOpen ? 'menu open' : 'menu'}>
                        <h4>Play with these chords:</h4>
                        <div className="menu-suffix">
                            {currSuffixes &&
                                currSuffixes.map(([suffix, isChecked]) => (
                                    <label key={suffix}>
                                        <input
                                            type="checkbox"
                                            name={suffix}
                                            value={isChecked}
                                            checked={isChecked}
                                            onChange={updateSettings}
                                        />
                                        <span className="btn">{suffix}</span>
                                    </label>
                                ))}
                        </div>
                        <h4>Chord root note:</h4>
                        <div className="menu-root">
                            {allRootLabels.map(r => (
                                <label key={r}>
                                    <input
                                        type="radio"
                                        name="root"
                                        value={r}
                                        checked={r === currRootLabel}
                                        onChange={updateSettings}
                                    />
                                    <span className="btn">{r}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
