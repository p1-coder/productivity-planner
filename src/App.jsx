import { useState } from 'react';
import Header from './components/Header';
import TaskManager from './components/TaskManager';
import Stopwatch from './components/Timer';
import GoalManager from './components/GoalManager';

function App() {
    const [activeTab, setActiveTab] = useState('tasks');
    const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('tasks')) || []);
    const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem('goals')) || []);

    const updateTasks = (newTasks) => {
        setTasks(newTasks);
        localStorage.setItem('tasks', JSON.stringify(newTasks));
    };

    const updateGoals = (newGoals) => {
        setGoals(newGoals);
        localStorage.setItem('goals', JSON.stringify(newGoals));
    };

    return (
        <div>
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="main-container">
                {activeTab === 'tasks' && <TaskManager tasks={tasks} updateTasks={updateTasks} />}
                {activeTab === 'timer' && <Stopwatch />}
                {activeTab === 'goals' && (
                    <GoalManager tasks={tasks} goals={goals} updateGoals={updateGoals} />
                )}
            </div>
        </div>
    );
}

export default App;