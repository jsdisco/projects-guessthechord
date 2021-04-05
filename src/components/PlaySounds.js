import React, { useEffect, useRef, useCallback } from 'react';
import MIDISounds from 'midi-sounds-react';
import { noteToMidiKey } from '../utils/helpers.js';
import { chordNotes } from '../utils/chordData.js';

function PlaySounds({ volume, play, updatePlay, root, suffix, instrument, delay }) {
    const midiSounds = useRef(null);
    const pianoSoundIndex = 3;
    const guitarSoundIndex = 259;
    const setMidiVolume = v => midiSounds.current && midiSounds.current.setMasterVolume(v / 100);

    const playChordCallback = useCallback(() => {
        const playNote = (mk, ik) => midiSounds.current.playChordNow(ik, [mk], 2);

        const instrKey = instrument === 'piano' ? pianoSoundIndex : guitarSoundIndex;
        const notesArr = chordNotes[root][suffix];
        notesArr.forEach((noteOctave, i) => {
            const [note, octave] = noteOctave.split('-');
            const midiKey = noteToMidiKey(note, +octave);
            if (delay === '0') {
                playNote(midiKey, instrKey);
            } else {
                setTimeout(() => {
                    playNote(midiKey, instrKey);
                }, +delay * i * 100);
            }
        });

        updatePlay(false);
    }, [instrument, suffix, updatePlay, root, delay]);

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
