import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { useAuth } from '../context/AuthContext';
import { toggleLike, sharePost } from '../api/posts';
import { timeAgo } from '../utils/timeAgo';

export default function PostCard({ post }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(post.likes.some((like) => like.userId === user.id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [sharesCount, setSharesCount] = useState(post.shares ?? 0);
  const [busy, setBusy] = useState(false);
  const [justLiked, setJustLiked] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  async function handleLike() {
    if (busy) return;
    setBusy(true);

    // optimistic update so the UI feels instant, roll back if the request fails
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((c) => c + (nextLiked ? 1 : -1));
    if (nextLiked) {
      setJustLiked(true);
      setTimeout(() => setJustLiked(false), 300);
    }

    try {
      const result = await toggleLike(post._id);
      setLiked(result.liked);
      setLikesCount(result.likesCount);
    } catch (err) {
      setLiked(liked);
      setLikesCount((c) => c + (nextLiked ? -1 : 1));
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    setSharesCount((c) => c + 1);
    try {
      const result = await sharePost(post._id);
      setSharesCount(result.sharesCount);
    } catch (err) {
      setSharesCount((c) => c - 1);
      return;
    }

    const link = `${window.location.origin}/post/${post._id}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {
      // clipboard permission denied - the share count above still updates
    }
    setShareToast(true);
  }

  return (
    <Paper
      sx={{
        mb: 2,
        overflow: 'hidden',
        transition: 'box-shadow 200ms ease, transform 200ms ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(28, 30, 33, 0.10)',
        },
      }}
    >
      <Box sx={{ p: 2, pb: post.text ? 1 : 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 1.5, fontWeight: 600 }}>
            {post.authorUsername[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography fontWeight={600}>{post.authorUsername}</Typography>
            <Typography variant="caption" color="text.secondary">
              {timeAgo(post.createdAt)}
            </Typography>
          </Box>
        </Box>

        {post.text && (
          <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1.5 }}>{post.text}</Typography>
        )}
      </Box>

      {post.imageUrl && (
        <Box
          component="img"
          src={post.imageUrl}
          alt="post"
          sx={{ width: '100%', maxHeight: 500, objectFit: 'cover', display: 'block' }}
        />
      )}

      <Box sx={{ display: 'flex', gap: 1, borderTop: '1px solid #eef0f2', px: 1.5, py: 0.5 }}>
        <Button
          size="small"
          onClick={handleLike}
          startIcon={
            <Box
              component={liked ? FavoriteIcon : FavoriteBorderIcon}
              sx={{
                transform: justLiked ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            />
          }
          sx={{
            color: liked ? 'error.main' : 'text.secondary',
            '&:hover': { bgcolor: 'rgba(224, 36, 94, 0.08)' },
          }}
        >
          {likesCount}
        </Button>
        <Button
          size="small"
          onClick={() => navigate(`/post/${post._id}`)}
          startIcon={<ChatBubbleOutlineIcon />}
          sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(24, 119, 242, 0.08)' } }}
        >
          {post.comments.length}
        </Button>
        <Button
          size="small"
          onClick={handleShare}
          startIcon={<ShareOutlinedIcon />}
          sx={{ color: 'text.secondary', '&:hover': { bgcolor: 'rgba(245, 166, 35, 0.12)' } }}
        >
          {sharesCount}
        </Button>
      </Box>

      <Snackbar
        open={shareToast}
        autoHideDuration={2500}
        onClose={() => setShareToast(false)}
        message="Link copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Paper>
  );
}
