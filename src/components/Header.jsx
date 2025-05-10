function Header({ activeTab, setActiveTab }) {
    return (
        <header className="header">
            <h1 className="header-title">Productivity Planner</h1>
            <nav className="nav-tabs">
                <button
                    className={`nav-tab ${activeTab === 'tasks' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tasks')}
                >
                    Tasks
                </button>
                <button
                    className={`nav-tab ${activeTab === 'timer' ? 'active' : ''}`}
                    onClick={() => setActiveTab('timer')}
                >
                    Timer
                </button>
                <button
                    className={`nav-tab ${activeTab === 'goals' ? 'active' : ''}`}
                    onClick={() => setActiveTab('goals')}
                >
                    Goals
                </button>
            </nav>
        </header>
    );
}

export default Header;