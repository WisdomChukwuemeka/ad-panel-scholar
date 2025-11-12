'use client';

import { useState, useEffect } from 'react';
import { PublicationAPI } from '../services/api';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, AlertCircle, User, Calendar, FileText, RefreshCw, AlertTriangle } from 'lucide-react';

export default function EditorActivities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchActivities = async (page = 1) => {
    if (!refreshing) setLoading(true);
    setRefreshing(true);

    try {
      const response = await PublicationAPI.editorActivities({ params: { page } });
      const data = response.data;
      const results = data.results || [];
      console.log('Fetched activities:', results);

      // ✅ Remove duplicates by combining title + action + timestamp
      const seen = new Set();
      const uniqueActivities = results.filter((item) => {
        const key = `${item.publication_title}-${item.action}-${item.timestamp}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      // Sort by most recent first
      uniqueActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setActivities(uniqueActivities);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setTotalCount(data.count || 0);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load editor activities');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(() => fetchActivities(currentPage), 30000);
    return () => clearInterval(interval);
  }, [currentPage]);

  const handleNext = () => nextPage && fetchActivities(currentPage + 1);
  const handlePrevious = () => previousPage && fetchActivities(currentPage - 1);

  const getActionConfig = (action) => {
    switch (action) {
      case 'approved':
        return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Approved' };
      case 'rejected':
        return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Rejected' };
      case 'under_review':
        return { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Under Review' };
      default:
        return { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', label: action };
    }
  };

  const getRejectionBadge = (count) => {
    if (count === 0)
      return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">0</span>;
    if (count <= 2)
      return (
        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> {count}
        </span>
      );
    return (
      <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> {count} High
      </span>
    );
  };

  if (loading && !refreshing) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-80 mb-6"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <div>
            <p className="font-medium">Failed to load activities</p>
            <p className="text-sm">Please check your connection and try again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-9 h-9 text-blue-600" />
            Editor Activities Log
          </h1>
          <p className="text-gray-600 mt-1">Track all review actions by editors</p>
        </div>
        <button
          onClick={() => fetchActivities(currentPage)}
          disabled={refreshing}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md"
        >
          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-lg">
          <p className="text-3xl font-bold">{totalCount}</p>
          <p className="text-blue-100">Total Actions</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-xl shadow-lg">
          <p className="text-3xl font-bold">{activities.filter(a => a.action === 'approved').length}</p>
          <p className="text-green-100">Approved</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-5 rounded-xl shadow-lg">
          <p className="text-3xl font-bold">{activities.filter(a => a.action === 'rejected').length}</p>
          <p className="text-red-100">Rejected</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-5 rounded-xl shadow-lg">
          <p className="text-3xl font-bold">{activities.filter(a => a.action === 'under_review').length}</p>
          <p className="text-yellow-100">Under Review</p>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => {
            const config = getActionConfig(activity.action);
            const Icon = config.icon;
            return (
              <div
                key={`${activity.id}-${activity.timestamp}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 "
              >
                
                <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1 flex items-start gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <FileText className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {activity.publication_title || 'Untitled Publication'}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Author: <span className="font-medium">{activity.author_name || 'Unknown'}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Editor: <span className="font-medium">{activity.editor_name || 'System'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {/* Action Badge (with tooltip if rejected) */}
<div className="relative group">
  <div
    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${config.border} ${config.bg} cursor-pointer`}
  >
    <Icon className={`w-5 h-5 ${config.color}`} />
    <span className={`font-semibold ${config.color}`}>{config.label}</span>
  </div>

  {activity.action === "rejected" && (
    <div className="absolute bottom-full  mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block z-20 w-72 bg-white text-gray-800 text-sm rounded-lg shadow-lg p-3">
      <p className="font-semibold mb-1 text-red-600">Rejection Details</p>
      <div className="space-y-1">
        <p className="font-medium text-gray-900 truncate">
          {activity.publication_title || "Untitled"}
        </p>
        <p className="text-gray-600 text-xs">
          Reason: {activity.note || "No reason provided"}
        </p>
        <p className="text-gray-500 text-xs">
          Editor: {activity.editor_name || "Unknown"}
        </p>
        <p className="text-gray-400 text-xs">
          {format(new Date(activity.timestamp), "MMM dd, yyyy hh:mm a")}
        </p>
      </div>
    </div>
  )}
</div>


                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(activity.timestamp), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(activity.timestamp), 'hh:mm a')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 text-gray-500">
            No Activities Yet
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center items-center text-sm text-gray-600 gap-5">
        <button
          onClick={handlePrevious}
          disabled={!previousPage}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(totalCount / 10)}</span>
        <button
          onClick={handleNext}
          disabled={!nextPage}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
