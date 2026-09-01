import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PostCard from '../components/PostCard';
import CommentSection from '../components/CommentSection';
import { getPost } from '../api/posts';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getPost(postId)
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [postId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notFound || !post) {
    return (
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography sx={{ mb: 2 }}>Post not found.</Typography>
        <Button startIcon={<ArrowBackRoundedIcon />} onClick={() => navigate('/')}>
          Back to feed
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate('/')}
        sx={{ mb: 1.5, color: 'text.secondary' }}
      >
        Back to feed
      </Button>

      <PostCard post={post} />
      <Paper sx={{ p: 2 }}>
        <CommentSection
          postId={post._id}
          comments={post.comments}
          onCommentsChange={(comments) => setPost({ ...post, comments })}
        />
      </Paper>
    </Container>
  );
}
