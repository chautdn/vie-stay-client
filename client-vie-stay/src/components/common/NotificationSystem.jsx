import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Create context for notifications
const NotificationContext = createContext();

// Notification types
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Individual notification component
const NotificationItem = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case NOTIFICATION_TYPES.ERROR:
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case NOTIFICATION_TYPES.WARNING:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case NOTIFICATION_TYPES.INFO:
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'bg-green-50 border-green-200';
      case NOTIFICATION_TYPES.ERROR:
        return 'bg-red-50 border-red-200';
      case NOTIFICATION_TYPES.WARNING:
        return 'bg-yellow-50 border-yellow-200';
      case NOTIFICATION_TYPES.INFO:
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case NOTIFICATION_TYPES.SUCCESS:
        return 'text-green-800';
      case NOTIFICATION_TYPES.ERROR:
        return 'text-red-800';
      case NOTIFICATION_TYPES.WARNING:
        return 'text-yellow-800';
      case NOTIFICATION_TYPES.INFO:
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className={`${getBackgroundColor()} border rounded-lg p-4 shadow-lg transition-all duration-300 transform animate-slideIn`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          {notification.title && (
            <h4 className={`font-semibold ${getTextColor()} mb-1`}>
              {notification.title}
            </h4>
          )}
          <p className={`text-sm ${getTextColor()}`}>
            {notification.message}
          </p>
          {notification.action && (
            <div className="mt-2">
              <button
                onClick={notification.action.onClick}
                className={`text-sm font-medium underline ${getTextColor()} hover:no-underline`}
              >
                {notification.action.label}
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => onClose(notification.id)}
          className={`flex-shrink-0 ml-2 p-1 rounded-full hover:bg-white hover:bg-opacity-50 transition-colors ${getTextColor()}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Main notification container
const NotificationContainer = ({ notifications, onClose }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm w-full">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Context provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: NOTIFICATION_TYPES.INFO,
      autoClose: true,
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-close notification if enabled
    if (newNotification.autoClose) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const success = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message,
      ...options
    });
  }, [addNotification]);

  const error = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.ERROR,
      message,
      duration: 7000, // Errors stay longer
      ...options
    });
  }, [addNotification]);

  const warning = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.WARNING,
      message,
      ...options
    });
  }, [addNotification]);

  const info = useCallback((message, options = {}) => {
    return addNotification({
      type: NOTIFICATION_TYPES.INFO,
      message,
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </NotificationContext.Provider>
  );
};

// Hook to use notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Export notification types for convenience
export { NOTIFICATION_TYPES };

// Usage example component (you can remove this)
const NotificationExample = () => {
  const { success, error, warning, info } = useNotification();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">Notification Examples</h2>
      <div className="space-x-2">
        <button
          onClick={() => success('Post created successfully!')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Success
        </button>
        <button
          onClick={() => error('Failed to create post. Please try again.')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Error
        </button>
        <button
          onClick={() => warning('Your wallet balance is low.')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Warning
        </button>
        <button
          onClick={() => info('Select a plan to continue.', {
            title: 'Plan Selection',
            action: {
              label: 'Learn More',
              onClick: () => console.log('Learn more clicked')
            }
          })}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Info with Action
        </button>
      </div>
    </div>
  );
};

export default NotificationExample;