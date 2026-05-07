import { createContext, useState, useEffect } from 'react';
import React from 'react';

import { BlogPost } from 'src/api/blog/blog-data';

// Define BlogContextProps interface













// Create context with default values
export const BlogContext = createContext({
  posts: [],
  sortBy: 'newest',
  selectedPost: null,
  isLoading: true,
  setPosts: () => {},
  setSortBy: () => {},
  setSelectedPost: () => {},
  setLoading: () => {},
  addComment: () => {},
  error: null
});

// BlogProvider component
export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts using fetch API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setPosts(BlogPost);
      } catch (err) {
        setError(err instanceof Error ? err : String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Adds a new comment to a specific post by updating the state
  const addComment = (postId, newComment) => {
    setPosts((prevPosts) =>
    prevPosts.map((post) =>
    post.id === postId ? { ...post, comments: [newComment, ...(post.comments || [])] } : post
    )
    );
  };

  const value = {
    posts,
    sortBy,
    selectedPost,
    isLoading,
    setPosts,
    setSortBy,
    setSelectedPost,
    setLoading,
    addComment,
    error
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};