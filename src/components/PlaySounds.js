import React, { useState, useEffect, useRef, useCallback } from 'react';
import MIDISounds from 'midi-sounds-react';
import chordData from '../utils/chordData.json';

function PlaySounds({ volume, play, updatePlay, root, suffix, instrument, delay }) {
    const midiSounds = useRef(null);
    const [timeoutIds, setTimeoutIds] = useState([]);
    const pianoSoundIndex = 3;
    const guitarSoundIndex = 259;
    const setMidiVolume = v => midiSounds.current && midiSounds.current.setMasterVolume(v / 100);

    const playChordCallback = useCallback(() => {
        const playNote = (mk, ik) => midiSounds.current.playChordNow(ik, [mk], 2);

        timeoutIds.forEach(id => clearTimeout(id));
        const ids = [];

        const instrKey = instrument === 'piano' ? pianoSoundIndex : guitarSoundIndex;
        const midiArr = chordData[root][suffix];

        if (midiArr) {
            midiArr.forEach((midiKey, i) => {
                if (delay === '0') {
                    playNote(midiKey, instrKey);
                } else {
                    const id = setTimeout(() => {
                        playNote(midiKey, instrKey);
                    }, +delay * i * 100);
                    ids.push(id);
                }
            });
            if (delay !== '0') {
                setTimeoutIds(ids);
            }
        }

        updatePlay(false);
    }, [instrument, suffix, updatePlay, root, delay, timeoutIds]);

    useEffect(() => {
        if (play) {
            playChordCallback();
        }
    }, [playChordCallback, play]);

    useEffect(() => {
        setMidiVolume(volume);
    }, [volume]);

    return (
        <div className="midi">
            <MIDISounds
                ref={ref => {
                    midiSounds.current = ref;
                    setMidiVolume(volume);
                }}
                instruments={[pianoSoundIndex, guitarSoundIndex]}
            />
        </div>
    );
}

export default PlaySounds;
