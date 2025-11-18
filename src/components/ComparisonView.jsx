import React from 'react';
import {
  Box,
  Chip,
  IconButton,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Close as CloseIcon,
  CompareArrows as CompareArrowsIcon,
} from '@mui/icons-material';

function ComparisonView({ students, onRemove, onClear, onCompare }) {
  return (
    <Box>
      <List dense>
        {students.map((student) => (
          <ListItem
            key={student.name}
            sx={{
              bgcolor: 'action.hover',
              borderRadius: 1,
              mb: 1,
            }}
          >
            <ListItemText
              primary={student.name}
              secondary={`Toplam Net: ${(student.toplam_net || 0).toFixed(2)}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                size="small"
                onClick={() => onRemove(student.name)}
                color="error"
              >
                <CloseIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      {students.length >= 2 && (
        <Button
          fullWidth
          variant="contained"
          startIcon={<CompareArrowsIcon />}
          sx={{ mt: 2 }}
          onClick={onCompare}
        >
          Karşılaştır ({students.length})
        </Button>
      )}
      <Button
        fullWidth
        variant="outlined"
        color="error"
        onClick={onClear}
        sx={{ mt: 1 }}
      >
        Temizle
      </Button>
    </Box>
  );
}

export default ComparisonView;
