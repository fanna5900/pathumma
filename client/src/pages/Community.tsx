import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  ThumbsUp,
  MessageCircle,
  Plus,
  Send,
  X,
  User as UserIcon,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import api from '../services/api';
import { CommunityPost } from '../types';
import { useAuth } from '../context/AuthContext';

export const Community: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Comment input state per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // New post modal
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    subject: 'Data Structures and Algorithms',
    tags: 'Algorithms, GATE',
  });

  const subjects = [
    'All',
    'Data Structures and Algorithms',
    'Operating Systems',
    'Database Management Systems',
    'Artificial Intelligence',
    'GATE Preparation',
    'General Academics',
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (subjectFilter !== 'All') params.subject = subjectFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/community/posts', { params });
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error('Fetch community error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [subjectFilter]);

  const handleLike = async (postId: string) => {
    if (!user) {
      alert('Please log in to upvote discussions.');
      return;
    }
    try {
      const res = await api.post(`/community/posts/${postId}/like`);
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likesCount: res.data.likesCount } : p))
        );
      }
    } catch (err) {
      // ignore
    }
  };

  const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId];
    if (!commentText || !commentText.trim()) return;

    if (!user) {
      alert('Please log in to join academic discussions.');
      return;
    }

    try {
      const res = await api.post(`/community/posts/${postId}/comment`, {
        content: commentText.trim(),
      });
      if (res.data.success) {
        setCommentInputs({ ...commentInputs, [postId]: '' });
        fetchPosts();
      }
    } catch (err: any) {
      alert('Failed to post comment.');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to start a community discussion.');
      return;
    }

    try {
      const res = await api.post('/community/posts', newPost);
      if (res.data.success) {
        setPostModalOpen(false);
        setNewPost({
          title: '',
          content: '',
          subject: 'Data Structures and Algorithms',
          tags: 'Algorithms, GATE',
        });
        fetchPosts();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create discussion post.');
    }
  };

  return (
    <div className="min-h-screen bg-[#021814] text-slate-100 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-semibold mb-3">
              <MessageSquare className="w-4 h-4" />
              <span>Academic Forum & Collaboration</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              Student Community & Q&A
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              Ask academic questions, discuss complex problem proofs, and share insights across universities with peers and faculty mentors.
            </p>
          </div>

          <button
            onClick={() => setPostModalOpen(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-glow-emerald flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ask Academic Question</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="rounded-3xl glass-panel bg-[#03241e]/90 border border-emerald-800/60 p-6 space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchPosts()}
              placeholder="Search discussions by topic, concept, or tag..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-emerald-950">
            {subjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSubjectFilter(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  subjectFilter === sub
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow-emerald'
                    : 'bg-forest-900 text-slate-300 hover:text-white border border-emerald-800/40'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-sm">Loading community discussions...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-3xl p-8 max-w-lg mx-auto space-y-3">
            <MessageSquare className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Discussions Found</h3>
            <p className="text-xs text-slate-400">
              Be the first to start an academic discussion or ask a coursework doubt!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="rounded-3xl glass-panel p-6 border border-emerald-900/60 space-y-4"
              >
                {/* Author & Subject */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-forest-900 border border-emerald-800/60 flex items-center justify-center font-bold text-emerald-300 text-xs">
                      {post.author.username.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {post.author.studentProfile?.fullName ||
                          post.author.facultyProfile?.fullName ||
                          post.author.username}
                      </h4>
                      <p className="text-[11px] text-emerald-400">
                        {post.author.role} • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {post.subject}
                  </span>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                  {post.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.split(',').map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded bg-forest-950 text-slate-400 border border-emerald-900/40"
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Like & Comments Stats */}
                <div className="flex items-center space-x-4 pt-3 border-t border-emerald-950 text-xs text-slate-400">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1.5 hover:text-emerald-400 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
                    <span>{post.likesCount} Upvotes</span>
                  </button>
                  <span className="flex items-center space-x-1.5">
                    <MessageCircle className="w-4 h-4 text-slate-400" />
                    <span>{post.comments?.length || 0} Answers</span>
                  </span>
                </div>

                {/* Comments List */}
                {post.comments && post.comments.length > 0 && (
                  <div className="space-y-2.5 pt-2 pl-4 border-l-2 border-emerald-900/60">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="p-3 rounded-xl bg-forest-950/70 border border-emerald-900/40 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300">
                            {comment.author?.studentProfile?.fullName ||
                              comment.author?.facultyProfile?.fullName ||
                              comment.author?.username}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment Input */}
                <form
                  onSubmit={(e) => handleCommentSubmit(post.id, e)}
                  className="flex items-center space-x-2 pt-2"
                >
                  <input
                    type="text"
                    value={commentInputs[post.id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                    }
                    placeholder="Contribute your insight or answer..."
                    className="flex-1 px-4 py-2 rounded-xl bg-forest-900/80 border border-emerald-800/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="rounded-3xl glass-panel bg-[#02221b] border border-emerald-500/40 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-3">
              <h3 className="text-lg font-bold text-white">Ask an Academic Question</h3>
              <button onClick={() => setPostModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Question / Discussion Title *
                </label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="e.g. How does 2-phase locking prevent serializability anomalies?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Subject *
                </label>
                <select
                  value={newPost.subject}
                  onChange={(e) => setNewPost({ ...newPost, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Data Structures and Algorithms">Data Structures and Algorithms</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Database Management Systems">Database Management Systems</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="GATE Preparation">GATE Preparation</option>
                  <option value="General Academics">General Academics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Details & Context *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Explain what concept you are trying to understand and what specific part is unclear..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  placeholder="DBMS, Concurrency, ACID"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-emerald-800 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-glow-emerald"
                >
                  Publish Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
