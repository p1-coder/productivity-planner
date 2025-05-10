import { useState } from 'react';

function TaskManager({ tasks, updateTasks }) {
    const [taskInput, setTaskInput] = useState('');
    const [category, setCategory] = useState('Work');
    const [specificTaskInput, setSpecificTaskInput] = useState('');
    const [specificTaskCategory, setSpecificTaskCategory] = useState('Work');
    const [customSpecificCategory, setCustomSpecificCategory] = useState('');
    const [showSpecificTasks, setShowSpecificTasks] = useState({}); // Track visibility per task

    const addTask = () => {
        if (taskInput.trim()) {
            const newTask = { id: Date.now(), text: taskInput, category, completed: false, specificTasks: [] };
            updateTasks([...tasks, newTask]);
            setTaskInput('');
        }
    };

    const toggleTask = (id) => {
        const updatedTasks = tasks.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        updateTasks(updatedTasks);
    };

    const deleteTask = (id) => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        updateTasks(updatedTasks);
        const newShowSpecificTasks = { ...showSpecificTasks };
        delete newShowSpecificTasks[id];
        setShowSpecificTasks(newShowSpecificTasks);
    };

    const addSpecificTask = (taskId) => {
        if (specificTaskInput.trim()) {
            const finalCategory = specificTaskCategory === 'Anything' ? (customSpecificCategory.trim() || 'Anything') : specificTaskCategory;
            const updatedTasks = tasks.map((task) => {
                if (task.id === taskId) {
                    return {
                        ...task,
                        specificTasks: [
                            ...task.specificTasks,
                            { id: Date.now(), text: specificTaskInput, category: finalCategory, completed: false },
                        ],
                    };
                }
                return task;
            });
            updateTasks(updatedTasks);
            setSpecificTaskInput('');
            setCustomSpecificCategory('');
        }
    };

    const toggleSpecificTask = (taskId, specificTaskId) => {
        const updatedTasks = tasks.map((task) => {
            if (task.id === taskId) {
                const updatedSpecificTasks = task.specificTasks.map((specificTask) =>
                    specificTask.id === specificTaskId ? { ...specificTask, completed: !specificTask.completed } : specificTask
                );
                return { ...task, specificTasks: updatedSpecificTasks };
            }
            return task;
        });
        updateTasks(updatedTasks);
    };

    const toggleSpecificTaskVisibility = (taskId) => {
        setShowSpecificTasks((prev) => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    const taskCategories = ['Work', 'Personal', 'Anything'];

    return (
        <div className="card">
            <h2 className="card-title">Tasks</h2>
            <div className="animate-fade-in">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <input
                        type="text"
                        value={taskInput}
                        onChange={(e) => setTaskInput(e.target.value)}
                        placeholder="Add a new task"
                        style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}
                    />
                  
                    <button onClick={addTask} className="btn">
                        Add
                    </button>
                </div>
                <ul>
                    {tasks.map((task) => (
                        <li
                            key={task.id}
                            className={`task-item ${task.category.toLowerCase()} ${task.completed ? 'completed' : ''}`}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTask(task.id)}
                                />
                                <span style={{ flex: 1 }}>
                                    {task.text}
                                </span>
                                <button onClick={() => toggleSpecificTaskVisibility(task.id)} className="btn btn-secondary">
                                    {showSpecificTasks[task.id] ? 'Hide Specific Tasks' : 'Add Specific Task'}
                                </button>
                                <button onClick={() => deleteTask(task.id)} className="btn btn-secondary">
                                    Delete
                                </button>
                            </div>
                            {showSpecificTasks[task.id] && (
                                <div>
                                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', marginLeft: '1.5rem' }}>
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
                                            {taskCategories.map((cat) => (
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
                                        <button onClick={() => addSpecificTask(task.id)} className="btn">
                                            Add Task
                                        </button>
                                    </div>
                                    <ul style={{ marginLeft: '2rem' }}>
                                        {task.specificTasks.map((specificTask) => (
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
                                                    onChange={() => toggleSpecificTask(task.id, specificTask.id)}
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
        </div>
    );
}

export default TaskManager;