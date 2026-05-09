import React from 'react';
import { useRouteError, useNavigate } from 'react-router';
import { IconAlertTriangle, IconRefresh, IconHome } from '@tabler/icons-react';

const ErrorElement = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error('Route Error:', error);

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 p-6 font-sans">
            <div className="max-w-xl w-full bg-white p-12 rounded-2xl shadow-xl text-center border border-slate-200">
                <div className="mb-6 flex justify-center text-red-500">
                    <IconAlertTriangle size={80} stroke={1.5} />
                </div>

                <h1 className="text-3xl font-bold text-slate-800 mb-4">
                    Oops! Something went wrong
                </h1>

                <p className="text-slate-600 mb-8 text-lg">
                    {error?.message || 'An unexpected error occurred while loading this page.'}
                </p>

                {error?.stack &&
        <div className="mb-8 text-left bg-slate-100 p-4 rounded-lg overflow-auto max-h-48 border border-slate-200">
                        <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                            {error.stack}
                        </pre>
                    </div>
        }

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md">
            
                        <IconRefresh size={18} />
                        Reload Page
                    </button>
                    <button
            onClick={() => navigate('/school/dashboard')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-semibold transition-colors shadow-sm">
            
                        <IconHome size={18} />
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>);

};

export default ErrorElement;