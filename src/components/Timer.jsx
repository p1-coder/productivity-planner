import { useState, useEffect } from 'react';
import TimerModal from './TimerModal';
import ProgressRing from './ProgressRing';

function Timer() {
    const [mode, setMode] = useState('Pomodoro'); // Pomodoro or Stopwatch
    const [time, setTime] = useState(0); // Time in seconds
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]); // For Stopwatch mode
    const [sessionType, setSessionType] = useState('Work'); // Work, Short Break, Long Break
    const [workSessionsCompleted, setWorkSessionsCompleted] = useState(0); // Track completed work sessions
    const [showModal, setShowModal] = useState(false); // Show modal when session ends

    const workDuration = 25 * 60; // 25 minutes in seconds
    const shortBreakDuration = 5 * 60; // 5 minutes in seconds
    const longBreakDuration = 15 * 60; // 15 minutes in seconds

    // Determine the duration based on the session type
    const duration =
        mode === 'Pomodoro'
            ? sessionType === 'Work'
                ? workDuration
                : sessionType === 'Short Break'
                ? shortBreakDuration
                : longBreakDuration
            : Infinity;

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime + 1;

                    // Check if the current session has ended
                    if (mode === 'Pomodoro' && newTime >= duration) {
                        clearInterval(interval);
                        setIsRunning(false);
                        setShowModal(true);

                        // Handle session transitions
                        if (sessionType === 'Work') {
                            const newWorkSessionsCompleted = workSessionsCompleted + 1;
                            setWorkSessionsCompleted(newWorkSessionsCompleted);
                            setSessionType(newWorkSessionsCompleted % 4 === 0 ? 'Long Break' : 'Short Break');
                        } else {
                            setSessionType('Work');
                            if (sessionType === 'Long Break') {
                                setWorkSessionsCompleted(0); // Reset after a Long Break
                            }
                        }
                        return 0; // Reset time for the next session
                    }
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, mode, duration, sessionType, workSessionsCompleted]);

    const startStop = () => {
        setIsRunning((prev) => !prev);
    };

    const reset = () => {
        setTime(0);
        setIsRunning(false);
        setLaps([]);
        setShowModal(false);
        setSessionType('Work');
        setWorkSessionsCompleted(0);
    };

    const addLap = () => {
        if (time > 0 && mode === 'Stopwatch') {
            setLaps([...laps, time]);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setTime(0); // Ensure time is reset when modal closes
        setIsRunning(false); // Ensure timer is paused when modal closes
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="card">
            <h2 className="card-title">
                {mode === 'Pomodoro' ? `Pomodoro Timer (${sessionType})` : 'Stopwatch'}
            </h2>
            <div className="animate-scale-in">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <button
                        className={`btn ${mode === 'Pomodoro' ? 'active' : ''}`}
                        onClick={() => {
                            setMode('Pomodoro');
                            reset();
                        }}
                    >
                        Pomodoro
                    </button>
                    <button
                        className={`btn ${mode === 'Stopwatch' ? 'active' : ''}`}
                        onClick={() => {
                            setMode('Stopwatch');
                            reset();
                        }}
                    >
                        Stopwatch
                    </button>
                </div>
                <div className="progress-ring">
                    <ProgressRing
                        radius={100}
                        stroke={8}
                        progress={mode === 'Pomodoro' ? (time / duration) * 100 : 0}
                    />
                    <div className="progress-ring-text">{formatTime(time)}</div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                    <button onClick={startStop} className="btn">
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={addLap} className="btn btn-secondary" disabled={mode === 'Pomodoro'}>
                        Lap
                    </button>
                    <button onClick={reset} className="btn btn-secondary">
                        Reset
                    </button>
                </div>
                {laps.length > 0 && (
                    <ul style={{ marginTop: '1rem' }}>
                        {laps.map((lap, index) => (
                            <li key={index} style={{ padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>
                                Lap {index + 1}: {formatTime(lap)}
                            </li>
                        ))}
                    </ul>
                )}
                {showModal && <TimerModal onClose={handleModalClose} />}
            </div>
        </div>
    );
}

export default Timer;