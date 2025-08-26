import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { taskAPI } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentView, setCurrentView] = useState('tasks'); // 'tasks' or 'create'

  // Load tasks when component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getAllTasks();
      if (response.success) {
        setTasks(response.data);
      } else {
        setError('Failed to load tasks');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Load tasks error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskAPI.createTask(taskData);
      if (response.success) {
        setTasks(prev => [response.data, ...prev]);
        setError('');
        setCurrentView('tasks');
        showToast('Task created! 🎉');
      }
    } catch (err) {
      setError('Failed to create task');
      console.error('Create task error:', err);
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      const response = await taskAPI.updateTask(editingTask.id, taskData);
      if (response.success) {
        setTasks(prev => 
          prev.map(task => 
            task.id === editingTask.id ? response.data : task
          )
        );
        setEditingTask(null);
        setCurrentView('tasks');
        setError('');
        showToast('Task updated! ✨');
      }
    } catch (err) {
      setError('Failed to update task');
      console.error('Update task error:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await taskAPI.deleteTask(taskId);
      if (response.success) {
        setTasks(prev => prev.filter(task => task.id !== taskId));
        setError('');
        showToast('Task deleted! 🗑️');
      }
    } catch (err) {
      setError('Failed to delete task');
      console.error('Delete task error:', err);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setCurrentView('create');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setCurrentView('tasks');
  };

  const handleFormSubmit = (taskData) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  const showToast = (message) => {
    // Simple toast - you could use a proper toast library
    console.log(`Toast: ${message}`);
  };

  const getTaskStats = () => {
    const completed = tasks.filter(task => task.status === 'completed').length;
    const inProgress = tasks.filter(task => task.status === 'in-progress').length;
    const pending = tasks.filter(task => task.status === 'pending').length;
    return { completed, inProgress, pending, total: tasks.length };
  };

  const stats = getTaskStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full blur-3xl"></div>
      </div>

      {/* Mobile Container */}
      <div className="relative z-10 max-w-sm mx-auto min-h-screen bg-white/10 backdrop-blur-lg border-x border-white/20">
        {/* Status Bar Simulation */}
        {/* <div className="h-6 bg-black/20 flex items-center justify-between px-4 text-white text-xs font-medium">
          <span>9:41</span>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-2 border border-white/50 rounded-sm">
              <div className="w-3 h-1 bg-white rounded-sm"></div>
            </div>
          </div>
        </div> */}

        {/* App Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">TaskFlow</h1>
              <p className="text-white/70 text-sm">Stay organized, stay productive</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">📋</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/30">
              <div className="text-lg font-bold text-white">{stats.total}</div>
              <div className="text-xs text-white/70">Total</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/30">
              <div className="text-lg font-bold text-yellow-300">{stats.pending}</div>
              <div className="text-xs text-white/70">Pending</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/30">
              <div className="text-lg font-bold text-blue-300">{stats.inProgress}</div>
              <div className="text-xs text-white/70">Active</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/30">
              <div className="text-lg font-bold text-green-300">{stats.completed}</div>
              <div className="text-xs text-white/70">Done</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-100 px-4 py-3 rounded-2xl">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 px-4 py-4">
          {currentView === 'tasks' ? (
            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              loading={loading}
            />
          ) : (
            <TaskForm
              onSubmit={handleFormSubmit}
              editingTask={editingTask}
              onCancel={handleCancelEdit}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white/10 backdrop-blur-sm border-t border-white/20 px-6 py-2 pb-6">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setCurrentView('tasks')}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                currentView === 'tasks' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-xs font-medium">Tasks</span>
            </button>
            
            <button
              onClick={() => {
                setEditingTask(null);
                setCurrentView('create');
              }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>

            <button
              onClick={() => setCurrentView('create')}
              className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-all ${
                currentView === 'create' 
                  ? 'bg-white/20 text-white' 
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-xs font-medium">Create</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;