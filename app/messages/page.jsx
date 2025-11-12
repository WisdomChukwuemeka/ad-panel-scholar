"use client";

import React, { useState, useEffect } from "react";
import { MessageAPI } from "../services/api"; // your API wrapper

const MessagePage = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10; // Assuming 10 items per page, adjust as needed

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    try {
      const response = await MessageAPI.list({ params: { page } });
      const data = response.data;
      setMessages(data.results || []);
      setFilteredMessages(data.results || []);
      setNextPage(data.next);
      setPreviousPage(data.previous);
      setTotalCount(data.count || 10);
      setCurrentPage(page);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch messages. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // ✅ Search filter by name or email (client-side, since search might not be server-side)
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    const filtered = messages.filter(
      (msg) =>
        msg.full_name?.toLowerCase().includes(q) ||
        msg.email?.toLowerCase().includes(q)
    );
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

  const handleNext = () => {
    if (nextPage) {
      const nextPageNum = currentPage + 1;
      fetchMessages(nextPageNum);
    }
  };

  const handlePrevious = () => {
    if (previousPage) {
      const prevPageNum = currentPage - 1;
      fetchMessages(prevPageNum);
    }
  };

  if (loading) return <div className="p-6 text-gray-600">Loading messages...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 xl:p-8">
      <main className="flex-1 overflow-auto">
        <div className="bg-white shadow-sm border border-gray-200 rounded-xl">
          {/* Header */}
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <h2 className="text-lg font-medium text-gray-800">Messages</h2>
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {totalCount}{" "}
                {totalCount === 1 ? "Message" : "Messages"}
              </span>
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 text-sm w-full xl:w-64 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Table for xl screens */}
          <div className="hidden xl:block">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-6 text-left font-medium">From</th>
                  <th className="py-3 px-6 text-left font-medium">Email</th>
                  <th className="py-3 px-6 text-left font-medium">Message</th>
                  <th className="py-3 px-6 text-left font-medium">Sent on</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-gray-400">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                    >
                      <td className="py-3 px-6 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full font-medium">
                          {msg.full_name ? msg.full_name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <span>{msg.full_name}</span>
                      </td>
                      <td className="py-3 px-6">{msg.email}</td>
                      <td className="py-3 px-6 truncate max-w-xs">{msg.text}</td>
                      <td className="py-3 px-6 text-gray-500">
                        {new Date(msg.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Card view for mobile (below xl) */}
          <div className="block xl:hidden divide-y divide-gray-200">
            {filteredMessages.length === 0 ? (
              <p className="text-center py-6 text-gray-400">No messages found.</p>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-6 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full font-semibold text-lg">
                      {msg.full_name ? msg.full_name.charAt(0).toUpperCase() : "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <p className="font-semibold text-gray-900">{msg.full_name}</p>
                        <p className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{msg.email}</p>
                      <p className="text-gray-700 mt-2">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination controls */}
          <div className="flex justify-center items-center px-6 py-4 border-t border-gray-100 gap-5">
            <button
              onClick={handlePrevious}
              disabled={!previousPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {Math.ceil(totalCount / pageSize)}
            </span>
            <button
              onClick={handleNext}
              disabled={!nextPage}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessagePage;