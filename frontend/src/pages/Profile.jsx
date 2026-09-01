import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import PostCard from '../components/PostCard';
import { getPostsBy } from '../api/posts';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { label: 'My Posts', param: 'authorId' },
  { label: 'Liked', param: 'likedBy' },
  { label: 'Commented', param: 'commentedBy' },
];

export default function Profile() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    const filterParams = { [TABS[tab].param]: user.id };
    getPostsBy(filterParams)
      .then((data) => {
        setPosts(data.posts);
        setNextCursor(data.nextCursor);
      })
      .finally(() => setLoading(false));
  }, [tab, user.id]);

  async function handleLoadMore() {
    setLoadingMore(true);
    try {
      const filterParams = { [TABS[tab].param]: user.id };
      const data = await getPostsBy(filterParams, nextCursor);
      setPosts((prev) => [...prev, ...data.posts]);
      setNextCursor(data.nextCursor);
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 28, fontWeight: 600 }}>
          {user.username[0].toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={700}>
            {user.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Tabs
        value={tab}
        onChange={(e, value) => setTab(value)}
        sx={{ mb: 2, borderBottom: '1px solid #e4e6eb' }}
      >
        {TABS.map((t) => (
          <Tab key={t.label} label={t.label} />
        ))}
      </Tabs>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && posts.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
          Nothing here yet.
        </Typography>
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
