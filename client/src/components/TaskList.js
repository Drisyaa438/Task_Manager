import React from "react";

const TaskList = ({ tasks, onEdit, onDelete, loading }) => {
  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-white/30 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
        </div>
        <p className="text-white/70 text-sm">Loading your tasks...</p>
      </div>
    );
  }

  // Empty State
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No tasks yet</h3>
        <p className="text-white/70 text-sm">
          Tap the + button to create your first task
        </p>
      </div>
    );
  }

  // Helpers
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "✅";
      case "in-progress":
        return "⚡";
      case "pending":
        return "📋";
      default:
        return "📋";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-400/30";
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/30";
      case "pending":
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/30";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = (taskId, taskTitle) => {
    if (
      window.confirm(
        `Delete "${taskTitle}"?\n\nThis action cannot be undone.`
      )
    ) {
      onDelete(taskId);
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          style={{
            animationDelay: `${index * 100}ms`,
            animation: "slideIn 0.5s ease-out forwards",
          }}
        >
          {/* Task Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0 mt-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(
                    task.status
                  )} border backdrop-blur-sm`}
                >
                  <span className="text-sm">{getStatusIcon(task.status)}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-lg leading-tight mb-1 truncate">
                  {task.title}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-white/60">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{formatDate(task.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(task)}
                className="w-8 h-8 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
              >
                <svg
                  className="w-4 h-4 text-blue-300"
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
              </button>
              <button
                onClick={() => handleDelete(task.id, task.title)}
                className="w-8 h-8 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 active:scale-90"
              >
                <svg
                  className="w-4 h-4 text-red-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Task Description */}
          {task.description && (
            <div className="mb-3 pl-11">
              <p className="text-white/80 text-sm leading-relaxed line-clamp-2">
                {task.description}
              </p>
            </div>
          )}

          {/* Task Footer */}
          <div className="flex items-center justify-between pl-11">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                task.status
              )} backdrop-blur-sm`}
            >
              {task.status.replace("-", " ").toUpperCase()}
            </span>

            {task.updated_at !== task.created_at && (
              <span className="text-xs text-white/50">
                Updated {formatDate(task.updated_at)}
              </span>
            )}
          </div>

          {/* Mobile swipe indicator */}
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-30">
            <div className="w-1 h-8 bg-white/30 rounded-full"></div>
          </div>
        </div>
      ))}

      {/* Slide-in animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TaskList;
