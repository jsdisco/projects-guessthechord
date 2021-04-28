import React, { useState, useEffect } from 'react';
import Settings from './components/Settings.js';
import PlayerArea from './components/PlayerArea.js';
import PlaySounds from './components/PlaySounds.js';
import { getRandomRoot, getRandomSuffix } from './utils/helpers.js';
import { allRootLabels, allSuffixes } from './utils/constants.js';
import './css/guessthechord.css';

function GuessTheChord() {
    const [root, setRoot] = useState(null);
    const [currRootLabel, setCurrRootLabel] = useState('random');
    const [play, setPlay] = useState(false);
    const [volume, setVolume] = useState(40);
    const [currVolumes, setCurrVolumes] = useState(null);
    const [instrument, setInstrument] = useState(null);
    const [suffix, setSuffix] = useState(null);
    const [attempts, setAttempts] = useState(null);
    const [gameStatus, setGameStatus] = useState('initial'); // initial, isNewRound, isRunning, isFound
    const [currStats, setCurrStats] = useState(null);
    const [statistics, setStatistics] = useState([]);
    const [currSuffixes, setCurrSuffixes] = useState(null);
    const [delay, setDelay] = useState(0);
    const [currDelays, setCurrDelays] = useState(null);

    useEffect(() => {
        const startGame = () => {
            const allVolumes = [0, 20, 40, 60, 80, 100];
            setCurrVolumes(() => allVolumes.map(vol => (vol <= 40 ? [vol, true] : [vol, false])));
            const allDelays = ['0', 'min', 'medium', 'max'];
            setCurrDelays(() => allDelays.map((delay, i) => (i === 0 ? [delay, true] : [delay, false])));
            const activeSuffixes = ['major', 'minor', '7', 'maj7', 'dim', 'dim7', 'm7', 'sus4', 'aug'];
            setCurrSuffixes(() =>
                allSuffixes.map(suffix => (activeSuffixes.includes(suffix) ? [suffix, true] : [suffix, false]))
            );
            setAttempts(() => activeSuffixes.map(suffix => [suffix, 0]));
        };
        startGame();
    }, []);

    const getActiveSuffixes = arr => arr.filter(([_, isChecked]) => isChecked).map(arr => arr[0]);

    const initAttempts = suffixArr => suffixArr.map(suffix => [suffix, 0]);

    const updatePlay = bool => setPlay(bool);

    const updateSettings = e => {
        if (e.target.name === 'root') {
            setCurrRootLabel(e.target.value);
            setRoot(() => (e.target.value === 'random' ? getRandomRoot() : e.target.value.split('/')[0]));
        } else {
            const newSuffixes = currSuffixes.map(([suffix, isChecked]) => {
                isChecked = suffix === e.target.name ? !isChecked : isChecked;
                return [suffix, isChecked];
            });
            setCurrSuffixes(newSuffixes);
            setAttempts(initAttempts(getActiveSuffixes(newSuffixes)));
        }
        setGameStatus('initial');
    };

    const isCorrectAnswer = e => e.target.name === suffix;

    const updateAttempts = e => {
        setAttempts(prev =>
            prev.map(([suffix, val]) => {
                if (suffix === e.target.name) {
                    if (isCorrectAnswer(e)) {
                        setGameStatus('isFound');
                        setStatistics(prev => [...prev, currStats]);
                        return [suffix, 1];
                    } else {
                        setCurrStats(prev => ({ ...prev, mistakes: prev.mistakes + 1 }));
                        return [suffix, -1];
                    }
                } else {
                    return [suffix, val];
                }
            })
        );
    };

    const updateDelays = e => {
        const highestChecked = +e.target.value;
        setDelay(highestChecked);
        setCurrDelays(prev => prev.map(([delay], i) => (i <= highestChecked ? [delay, true] : [delay, false])));
    };

    const updateVolume = e => {
        const highestChecked = +e.target.value;
        setVolume(highestChecked);
        setCurrVolumes(prev => prev.map(([vol]) => (vol <= highestChecked ? [vol, true] : [vol, false])));
    };

    const playChord = e => {
        if (e.target.closest('.btn').name === 'piano' || e.target.closest('.btn').name === 'guitar') {
            setInstrument(e.target.closest('.btn').name);
            if (gameStatus === 'isFound') {
                setSuffix(currStats.suffix);
            }
        } else {
            setSuffix(e.target.closest('.btn').name);
        }
        if (gameStatus === 'isNewRound') {
            setGameStatus('isRunning');
        }
        setPlay(true);
    };

    const handleNew = () => {
        const actives = getActiveSuffixes(currSuffixes);
        const randomSuffix = getRandomSuffix(actives);
        setSuffix(randomSuffix);
        setAttempts(initAttempts(actives));
        currRootLabel === 'random' && setRoot(getRandomRoot);
        setCurrStats({ mistakes: 0, totalPossibilities: actives.length, suffix: randomSuffix });
        setGameStatus('isNewRound');
    };

    return (
        <div className="guess-the-chord">
            <Settings
                currSuffixes={currSuffixes}
                allRootLabels={allRootLabels}
                currRootLabel={currRootLabel}
                updateSettings={updateSettings}
                statistics={statistics}
                volume={volume}
                currVolumes={currVolumes}
                updateVolume={updateVolume}
            />

            <PlayerArea
                playChord={playChord}
                handleNew={handleNew}
                gameStatus={gameStatus}
                attempts={attempts}
                currDelays={currDelays}
                updateAttempts={updateAttempts}
                updateDelays={updateDelays}
            />
            <PlaySounds
                volume={volume}
                play={play}
                updatePlay={updatePlay}
                root={root}
                suffix={suffix}
                instrument={instrument}
                delay={delay}
            />
        </div>
    );
}

export default GuessTheChord;
