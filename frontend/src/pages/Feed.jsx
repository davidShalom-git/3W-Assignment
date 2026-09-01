import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import CreatePostBox from '../components/CreatePostBox';
import PostCard from '../components/PostCard';
import { getFeed } from '../api/posts';

function PostCardSkeleton() {
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1.5 }} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="35%" height={20} />
          <Skeleton variant="text" width="20%" height={16} />
        </Box>
      </Box>
      <Skeleton variant="text" width="90%" />
      <Skeleton variant="text" width="60%" />
    </Paper>
  );
}

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    getFeed()
      .then((data) => {
        setPosts(data.posts);
        setNextCursor(data.nextCursor);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const data = await getFeed(nextCursor);
      setPosts((prev) => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  }

  function handlePostCreated(post) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <CreatePostBox onPostCreated={handlePostCreated} />

      {loading && (
        <>
          <PostCardSkeleton />
          <PostCardSkeleton />
        </>
      )}

      {!loading && posts.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 6, color: 'text.secondary' }}>
          <ForumRoundedIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
          <Typography>No posts yet. Be the first to share something!</Typography>
        </Box>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {nextCursor && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
          <Button variant="outlined" onClick={handleLoadMore} disabled={loadingMore}>
            {loadingMore ? <CircularProgress size={20} /> : 'Load more'}
          </Button>
        </Box>
      )}
    </Container>
  );
}
