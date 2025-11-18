import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

function StudentList({
  students,
  selectedStudent,
  onSelect,
  onAddToComparison,
}) {
  const getToplamNetColor = (toplamNet) => {
    if (toplamNet >= 70) return 'success';
    if (toplamNet >= 50) return 'info';
    if (toplamNet >= 30) return 'warning';
    return 'error';
  };

  return (
    <List sx={{ p: 0 }}>
      {students.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
          Öğrenci bulunamadı
        </Box>
      ) : (
        students.map((student) => (
          <ListItem
            key={student.name}
            disablePadding
            sx={{
              mb: 1,
              bgcolor:
                selectedStudent?.name === student.name
                  ? 'primary.light'
                  : 'transparent',
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <ListItemButton
              onClick={() => onSelect(student)}
              sx={{ borderRadius: 2 }}
            >
              <ListItemText
                primary={student.name}
                secondary={
                  <Chip
                    label={`Toplam Net: ${(student.toplam_net || 0).toFixed(
                      2
                    )}`}
                    size="small"
                    color={getToplamNetColor(student.toplam_net || 0)}
                    sx={{ mt: 0.5 }}
                  />
                }
              />
            </ListItemButton>
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToComparison(student);
                }}
                color="primary"
              >
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))
      )}
    </List>
  );
}

export default StudentList;
