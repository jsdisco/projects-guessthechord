import React, { useState, useEffect } from 'react';
import Settings from './components/Settings.js';
import PlayerArea from './components/PlayerArea.js';
import PlaySounds from './components/PlaySounds.js';
import { getRandomValue } from './utils/helpers.js';
import { allRootLabels, allSuffixes } from './utils/constants.js';
import './css/guessthechord.css';

function GuessTheChord() {
    const [root, setRoot] = useState(null);
    const [suffix, setSuffix] = useState(null);
    const [currRootLabels, setCurrRootLabels] = useState(null);
    const [currSuffixes, setCurrSuffixes] = useState(null);

    const [play, setPlay] = useState(false);
    const [volume, setVolume] = useState(40);
    const [volumes, setVolumes] = useState(null);
    const [instrument, setInstrument] = useState(null);
    const [delay, setDelay] = useState(0);
    const [delays, setDelays] = useState(null);

    const [attempts, setAttempts] = useState(null);
    const [gameStatus, setGameStatus] = useState('initial'); // initial, isNewRound, isRunning, isFound
    const [currStats, setCurrStats] = useState(null);
    const [statistics, setStatistics] = useState([]);

    useEffect(() => {
        const startGame = () => {
            const allVolumes = [0, 20, 40, 60, 80, 100];
            setVolumes(() => allVolumes.map(vol => (vol <= 40 ? [vol, true] : [vol, false])));
            const allDelays = ['0', 'min', 'medium', 'max'];
            setDelays(() => allDelays.map((delay, i) => (i === 0 ? [delay, true] : [delay, false])));
            const activeSuffixes = ['major', 'minor', '7', 'maj7', 'dim', 'dim7', 'm7', 'sus4', 'aug'];
            setCurrSuffixes(() =>
                allSuffixes.map(suffix => (activeSuffixes.includes(suffix) ? [suffix, true] : [suffix, false]))
            );
            setCurrRootLabels(() => allRootLabels.map(root => [root, true]));
            setAttempts(() => activeSuffixes.map(suffix => [suffix, 0]));
        };
        startGame();
    }, []);

    const getActiveCheckboxes = arr => arr.filter(([_, isChecked]) => isChecked).map(arr => arr[0]);

    const initAttempts = suffixArr => suffixArr.map(suffix => [suffix, 0]);

    const updatePlay = bool => setPlay(bool);

    const updateSettings = e => {
        if (e.target.classList.contains('input-root')) {
            const newRootLabels = currRootLabels.map(([root, isChecked]) => {
                isChecked = root === e.target.name ? !isChecked : isChecked;
                return [root, isChecked];
            });
            setCurrRootLabels(newRootLabels);
        } else {
            const newSuffixes = currSuffixes.map(([suffix, isChecked]) => {
                isChecked = suffix === e.target.name ? !isChecked : isChecked;
                return [suffix, isChecked];
            });
            setCurrSuffixes(newSuffixes);
            setAttempts(initAttempts(getActiveCheckboxes(newSuffixes)));
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
        setDelays(prev => prev.map(([delay], i) => (i <= highestChecked ? [delay, true] : [delay, false])));
    };

    const updateVolume = e => {
        const highestChecked = +e.target.value;
        setVolume(highestChecked);
        setVolumes(prev => prev.map(([vol]) => (vol <= highestChecked ? [vol, true] : [vol, false])));
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
        const activeSuffixes = getActiveCheckboxes(currSuffixes);
        const randomSuffix = getRandomValue(activeSuffixes);
        setSuffix(randomSuffix);

        const activeRoots = getActiveCheckboxes(currRootLabels);
        const randomRoot = getRandomValue(activeRoots);
        setRoot(randomRoot.split('/')[0]);

        setAttempts(initAttempts(activeSuffixes));
        setCurrStats({ mistakes: 0, totalPossibilities: activeSuffixes.length, suffix: randomSuffix });
        setGameStatus('isNewRound');
    };

    return (
        <div className="guess-the-chord">
            <Settings
                currSuffixes={currSuffixes}
                currRootLabels={currRootLabels}
                updateSettings={updateSettings}
                statistics={statistics}
                volume={volume}
                volumes={volumes}
                updateVolume={updateVolume}
            />
            <PlayerArea
                playChord={playChord}
                handleNew={handleNew}
                gameStatus={gameStatus}
                attempts={attempts}
                delays={delays}
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
