"use client";

import React, { useState, useEffect } from "react";
import { PublicationAPI } from "../services/api"; // Adjust path

const PublicationPage = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);

  const fetchPublications = async (pageOrUrl = 1) => {
    try {
      setLoading(true);
      setError(null);

      let pageNumber = 1;

      if (typeof pageOrUrl === "string" && pageOrUrl.includes("page=")) {
        const match = pageOrUrl.match(/page=(\d+)/);
        pageNumber = match ? parseInt(match[1], 10) : 1;
      } else if (typeof pageOrUrl === "number") {
        pageNumber = pageOrUrl;
      }

      const response = await PublicationAPI.paginated(pageNumber);
      const data = response.data;

      setPublications(data.results || []);
      setNextPageUrl(data.next);
      setPrevPageUrl(data.previous);

      // ✅ Only set totalPages if count exists
      if (data.count && data.count > 0) {
        setTotalPages(Math.ceil(data.count / 6));
      }

      setCurrentPage(pageNumber);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching publications:", err);
      setError("Failed to fetch publications. Please try again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications(1);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Publications</h1>

      {loading && <p>Loading publications...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <>
          {publications.length === 0 ? (
            <p>No publications found.</p>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {publications.map((pub) => (
                <li
                  key={pub.id}
                  style={{
                    border: "1px solid #ccc",
                    marginBottom: "10px",
                    padding: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <p><strong>Title:</strong> {pub.title}</p>
                  <p><strong>Author:</strong> {pub.author?.full_name || pub.author}</p>
                  <p><strong>Status:</strong> {pub.status}</p>
                  <p><strong>Publication Date:</strong> {new Date(pub.publication_date).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination Controls */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <button
              onClick={() => fetchPublications(prevPageUrl)}
              disabled={!prevPageUrl}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => fetchPublications(nextPageUrl)}
              disabled={!nextPageUrl}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PublicationPage;
