import React, { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, editingTask, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
  });

  // Fill form when editing
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || '',
        status: editingTask.status,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
      });
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    onSubmit(formData);

    // Reset form if not editing
    if (!editingTask) {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
      });
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: '📋' },
    { value: 'in-progress', label: 'In Progress', icon: '⚡' },
    { value: 'completed', label: 'Completed', icon: '✅' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-2xl">
            {editingTask ? '✏️' : '✨'}
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mb-1">
          {editingTask ? 'Edit Task' : 'Create New Task'}
        </h2>
        <p className="text-white/60 text-sm">
          {editingTask ? 'Update your task details' : 'Add a new task to stay organized'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title Field */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Task Title
          </label>
          <div className="relative">
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              required
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-200"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-2">
            Description
            <span className="text-white/50 text-xs ml-1">(optional)</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add more details about your task..."
            rows="4"
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-200 resize-none"
          />
        </div>

        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-white/90 mb-3">
            Status
          </label>
          <div className="grid grid-cols-3 gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status: option.value }))}
                className={`p-3 rounded-2xl border-2 transition-all duration-200 ${
                  formData.status === option.value
                    ? 'border-white/50 bg-white/20 backdrop-blur-sm shadow-lg'
                    : 'border-white/20 bg-white/10 hover:bg-white/15 hover:border-white/30'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">{option.icon}</div>
                  <div className="text-xs font-medium text-white/90">{option.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center justify-center space-x-2">
              {editingTask ? (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Update Task</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Create Task</span>
                </>
              )}
            </span>
          </button>

          {editingTask && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-medium py-3 px-6 rounded-2xl backdrop-blur-sm transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Quick Tips */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
              <span className="text-blue-300 text-sm">💡</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-medium text-white/90 mb-1">Pro Tips</h4>
            <ul className="text-xs text-white/60 space-y-1">
              <li>• Use clear, actionable titles</li>
              <li>• Break large tasks into smaller ones</li>
              <li>• Update status as you progress</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
