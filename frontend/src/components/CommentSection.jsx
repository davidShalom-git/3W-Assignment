import { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import { addComment } from '../api/posts';
import { timeAgo } from '../utils/timeAgo';

export default function CommentSection({ postId, comments, onCommentsChange }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const updated = await addComment(postId, text.trim());
      onCommentsChange(updated);
      setText('');
    } finally {
      setSending(false);
    }
  }

  return (
    <Box>
      <Typography fontWeight={600} sx={{ mb: 2 }}>
        Comments ({comments.length})
      </Typography>

      {comments.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No comments yet. Say something!
        </Typography>
      )}

      {comments.map((comment) => (
        <Box key={comment._id} sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32, fontSize: 14, fontWeight: 600 }}>
            {comment.username[0].toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'inline-block',
                bgcolor: '#f0f2f5',
                borderRadius: '14px',
                px: 1.5,
                py: 0.8,
              }}
            >
              <Typography variant="body2" fontWeight={600} component="span">
                {comment.username}
              </Typography>
              <Typography variant="body2" component="span" sx={{ ml: 0.75 }}>
                {comment.text}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3, ml: 0.5 }}>
              {timeAgo(comment.createdAt)}
            </Typography>
          </Box>
        </Box>
      ))}

      <Box sx={{ display: 'flex', gap: 1, mt: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
        />
        <IconButton
          onClick={handleSend}
          disabled={sending || !text.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: '#fff',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: '#e4e6eb', color: '#bcc0c4' },
          }}
        >
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
