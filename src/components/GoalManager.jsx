import { useState } from 'react';

function GoalManager({ tasks: appTasks, updateTasks: updateAppTasks }) {
    const [goalInput, setGoalInput] = useState('');
    const [target, setTarget] = useState('');
    const [timeCategory, setTimeCategory] = useState('Daily');
    const [goalCategory, setGoalCategory] = useState('Work');
    const [customGoalCategory, setCustomGoalCategory] = useState('');
    const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('goals')) || []);
    const [specificTaskInput, setSpecificTaskInput] = useState('');
    const [specificTaskCategory, setSpecificTaskCategory] = useState('Work');
    const [customSpecificCategory, setCustomSpecificCategory] = useState('');
    const [showSpecificTasks, setShowSpecificTasks] = useState({}); // Track visibility per goal

    const addGoal = () => {
        if (goalInput.trim() && target > 0) {
            const finalGoalCategory = goalCategory === 'Anything' ? (customGoalCategory.trim() || 'Anything') : goalCategory;
            const newGoal = {
                id: Date.now(),
                text: goalInput,
                target: parseInt(target),
                timeCategory, // Daily, Weekly, Monthly, Yearly
                category: finalGoalCategory, // Work, Personal, or custom
                specificTasks: [],
                completed: 0,
            };
            const updatedGoals = [...goals, newGoal];
            setGoals(updatedGoals);
            localStorage.setItem('goals', JSON.stringify(updatedGoals));
            setGoalInput('');
            setTarget('');
            setCustomGoalCategory('');
        }
    };

    const deleteGoal = (id) => {
        const updatedGoals = goals.filter((goal) => goal.id !== id);
        setGoals(updatedGoals);
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
        const newShowSpecificTasks = { ...showSpecificTasks };
        delete newShowSpecificTasks[id];
        setShowSpecificTasks(newShowSpecificTasks);
    };

    const addSpecificTask = (goalId) => {
        if (specificTaskInput.trim()) {
            const finalCategory = specificTaskCategory === 'Anything' ? (customSpecificCategory.trim() || 'Anything') : specificTaskCategory;
            const updatedGoals = goals.map((goal) => {
                if (goal.id === goalId) {
                    const newSpecificTasks = [
                        ...goal.specificTasks,
                        { id: Date.now(), text: specificTaskInput, category: finalCategory, completed: false },
                    ];
                    const completedCount = newSpecificTasks.filter((task) => task.completed).length;
                    return { ...goal, specificTasks: newSpecificTasks, completed: completedCount };
                }
                return goal;
            });
            setGoals(updatedGoals);
            localStorage.setItem('goals', JSON.stringify(updatedGoals));
            setSpecificTaskInput('');
            setCustomSpecificCategory('');
        }
    };

    const toggleSpecificTask = (goalId, specificTaskId) => {
        const updatedGoals = goals.map((goal) => {
            if (goal.id === goalId) {
                const updatedSpecificTasks = goal.specificTasks.map((specificTask) =>
                    specificTask.id === specificTaskId ? { ...specificTask, completed: !specificTask.completed } : specificTask
                );
                const completedCount = updatedSpecificTasks.filter((task) => task.completed).length;
                return { ...goal, specificTasks: updatedSpecificTasks, completed: completedCount };
            }
            return goal;
        });
        setGoals(updatedGoals);
        localStorage.setItem('goals', JSON.stringify(updatedGoals));
    };

    const toggleSpecificTaskVisibility = (goalId) => {
        setShowSpecificTasks((prev) => ({
            ...prev,
            [goalId]: !prev[goalId],
        }));
    };

    const getProgress = (goal) => {
        return (goal.completed / goal.target) * 100;
    };

    const timeCategories = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
    const goalCategories = ['Work', 'Personal', 'Anything'];

    // Define colors for each time category
    const categoryColors = {
        Daily: '#3b82f6', // Blue
        Weekly: '#22c55e', // Green
        Monthly: '#a855f7', // Purple
        Yearly: '#f97316', // Orange
    };

    return (
        <div className="card">
            <h2 className="card-title">Goals</h2>
            <div className="animate-fade-in">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        placeholder="Add a new goal"
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                    />
                    <input
                        type="number"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        placeholder="Target"
                        style={{ width: '100px', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                    />
                    <select
                        value={timeCategory}
                        onChange={(e) => setTimeCategory(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                    >
                        {timeCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <select
                        value={goalCategory}
                        onChange={(e) => setGoalCategory(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                    >
                        {goalCategories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {goalCategory === 'Anything' && (
                        <input
                            type="text"
                            value={customGoalCategory}
                            onChange={(e) => setCustomGoalCategory(e.target.value)}
                            placeholder="Custom category (e.g., Extra)"
                            style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                        />
                    )}
                    <button onClick={addGoal} className="btn">
                        Add
                    </button>
                </div>

                {timeCategories.map((cat) => {
                    const filteredGoals = goals.filter((goal) => goal.timeCategory === cat);
                    return (
                        filteredGoals.length > 0 && (
                            <div key={cat} style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '0.5rem', color: categoryColors[cat] }}>
                                    {cat} Goals
                                </h3>
                                <ul>
                                    {filteredGoals.map((goal) => (
                                        <li key={goal.id} className="goal-item">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <span>
                                                    {goal.text} ({goal.category})
                                                </span>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => toggleSpecificTaskVisibility(goal.id)} className="btn btn-secondary">
                                                        {showSpecificTasks[goal.id] ? 'Hide Specific Tasks' : 'Add Specific Task'}
                                                    </button>
                                                    <button onClick={() => deleteGoal(goal.id)} className="btn btn-secondary">
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: '0.5rem' }}>
                                                <div className="progress-bar">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{ width: `${getProgress(goal)}%`, backgroundColor: categoryColors[cat] }}
                                                    ></div>
                                                </div>
                                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                                    {goal.completed}/{goal.target} completed
                                                </span>
                                            </div>
                                            {showSpecificTasks[goal.id] && (
                                                <div>
                                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                                                        <input
                                                            type="text"
                                                            value={specificTaskInput}
                                                            onChange={(e) => setSpecificTaskInput(e.target.value)}
                                                            placeholder="Add specific task"
                                                            style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                                                        />
                                                        <select
                                                            value={specificTaskCategory}
                                                            onChange={(e) => setSpecificTaskCategory(e.target.value)}
                                                            style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                                                        >
                                                            {goalCategories.map((cat) => (
                                                                <option key={cat} value={cat}>{cat}</option>
                                                            ))}
                                                        </select>
                                                        {specificTaskCategory === 'Anything' && (
                                                            <input
                                                                type="text"
                                                                value={customSpecificCategory}
                                                                onChange={(e) => setCustomSpecificCategory(e.target.value)}
                                                                placeholder="Custom category (e.g., Extra)"
                                                                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                                                            />
                                                        )}
                                                        <button onClick={() => addSpecificTask(goal.id)} className="btn">
                                                            Add Task
                                                        </button>
                                                    </div>
                                                    <ul style={{ marginLeft: '2rem' }}>
                                                        {goal.specificTasks.map((specificTask) => (
                                                            <li
                                                                key={specificTask.id}
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    gap: '0.5rem',
                                                                    padding: '0.5rem',
                                                                    backgroundColor: specificTask.completed ? '#e0e0e0' : 'transparent',
                                                                }}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={specificTask.completed}
                                                                    onChange={() => toggleSpecificTask(goal.id, specificTask.id)}
                                                                />
                                                                <span style={{ flex: 1, textDecoration: specificTask.completed ? 'line-through' : 'none' }}>
                                                                    {specificTask.text} ({specificTask.category})
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    );
                })}
            </div>
        </div>
    );
}

export default GoalManager;