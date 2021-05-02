import React, { useState } from 'react';

function Volume({ volume, volumes, updateVolume }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => setIsOpen(prev => !prev);

    return (
        <div className="volume">
            {isOpen && (
                <div className="volume-grid btn">
                    {volumes.map(([vol, isChecked]) => (
                        <label key={vol}>
                            <input
                                type="checkbox"
                                name="volume"
                                value={vol}
                                checked={isChecked}
                                onChange={updateVolume}
                            />
                            <span></span>
                        </label>
                    ))}
                </div>
            )}
            <div className="volume-icon" onClick={handleOpen}>
                <svg id="volume-icon" className="on" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 22">
                    <path
                        d="M8.12,6H2.53A1.49,1.49,0,0,0,1,7.47v6.92a1.5,1.5,0,0,0,1.53,1.47H8.11a1.56,1.56,0,0,1,1,.35l5.33,4.43A1.54,1.54,0,0,0,17,19.53V2.47a1.53,1.53,0,0,0-2.51-1.12L9.1,5.66A1.56,1.56,0,0,1,8.12,6Z"
                        fill="#ddd"
                    />
                    {volume === 0 ? (
                        <g id="off">
                            <line
                                x1="18.35"
                                y1="7.1"
                                x2="25.6"
                                y2="14.05"
                                fill="none"
                                stroke="#ddd"
                                strokeLinecap="round"
                                strokeWidth="1.91"
                            />
                            <line
                                x1="18.35"
                                y1="14.05"
                                x2="25.6"
                                y2="7.1"
                                fill="none"
                                stroke="#ddd"
                                strokeLinecap="round"
                                strokeWidth="1.91"
                            />
                        </g>
                    ) : (
                        <g id="on">
                            <path
                                d="M19.6,6.26A7.67,7.67,0,0,1,21.39,11a7.3,7.3,0,0,1-1.79,4.74"
                                fill="none"
                                stroke="#ddd"
                                strokeLinecap="round"
                                strokeWidth="1.91"
                            />
                            <path
                                d="M23.16,4.16A11,11,0,0,1,25.75,11a10.49,10.49,0,0,1-2.59,6.84"
                                fill="none"
                                stroke="#ddd"
                                strokeLinecap="round"
                                strokeWidth="1.91"
                            />
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}

export default Volume;
