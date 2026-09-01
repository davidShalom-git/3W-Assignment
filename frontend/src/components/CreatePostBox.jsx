import { useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CloseIcon from '@mui/icons-material/Close';
import { createPost } from '../api/posts';
import { useAuth } from '../context/AuthContext';

export default function CreatePostBox({ onPostCreated }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  function handleImagePick(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setPreview(null);
    fileInputRef.current.value = '';
  }

  async function handlePost() {
    if (!text.trim() && !imageFile) return;

    setPosting(true);
    setError('');
    try {
      const post = await createPost({ text: text.trim(), imageFile });
      onPostCreated(post);
      setText('');
      clearImage();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create post');
    } finally {
      setPosting(false);
    }
  }

  const canPost = (text.trim() || imageFile) && !posting;

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 1 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 600 }}>{user.username[0].toUpperCase()}</Avatar>
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="standard"
          slotProps={{ input: { disableUnderline: true } }}
        />
      </Box>

      {preview && (
        <Box sx={{ position: 'relative', mt: 1, ml: 6.5, display: 'inline-block' }}>
          <img src={preview} alt="preview" style={{ maxHeight: 200, borderRadius: 12, display: 'block' }} />
          <IconButton
            size="small"
            onClick={clearImage}
            sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.55)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 1, borderTop: '1px solid #eef0f2' }}>
        <IconButton
          component="label"
          sx={{ color: 'secondary.main', '&:hover': { bgcolor: 'rgba(245, 166, 35, 0.1)' } }}
        >
          <PhotoCameraIcon />
          <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleImagePick} />
        </IconButton>

        <Button variant="contained" disabled={!canPost} onClick={handlePost}>
          {posting ? <CircularProgress size={20} color="inherit" /> : 'Post'}
        </Button>
      </Box>
    </Paper>
  );
}
