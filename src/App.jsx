import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Button,
  Snackbar,
  Alert,
  Input,
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  EmojiEvents as EmojiEventsIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  Numbers as NumbersIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StudentList from './components/StudentList';
import StudentDetails from './components/StudentDetails';
import ComparisonView from './components/ComparisonView';
import ComparisonDetails from './components/ComparisonDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f7fa',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const initialExamOptions = [
    { value: 'yaho_student_data.json', label: 'YAHO 8. Sınıf Sınav Sonuçları' },
    { value: 'aydin_student_data.json', label: 'AYDIN Sınav Sonuçları' },
  ];
  const [examOptions, setExamOptions] = useState(initialExamOptions);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [comparisonStudents, setComparisonStudents] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(initialExamOptions[0].value);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [uploadedData, setUploadedData] = useState({});

  useEffect(() => {
    loadData();
  }, [selectedExam, uploadedData]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStudents(
        students.filter((s) => s.name.toLowerCase().includes(query))
      );
    }
  }, [searchQuery, students]);

  const loadData = async () => {
    setLoading(true);
    setSelectedStudent(null);
    setComparisonStudents([]);
    setShowComparison(false);

    try {
      let data;

      if (selectedExam.startsWith('uploaded_')) {
        data = uploadedData[selectedExam] || [];
      } else {
        const timestamp = new Date().getTime();
        const response = await fetch(`/${selectedExam}?t=${timestamp}`, {
          cache: 'no-cache',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        data = await response.json();
      }

      const filtered = data.filter(
        (s) =>
          !s.name.includes('Genel Ortalama') &&
          !s.name.includes('Okul Ortalaması')
      );

      setStudents(filtered);
      setFilteredStudents(filtered);
      setLoading(false);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      setLoading(false);
    }
  };

  const handleExamChange = (event) => {
    setSelectedExam(event.target.value);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setSnackbar({
        open: true,
        message: 'Lütfen PDF dosyası seçin',
        severity: 'error',
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const filtered = result.students.filter(
          (s) =>
            !s.name.includes('Genel Ortalama') &&
            !s.name.includes('Okul Ortalaması')
        );

        const newOptionValue = `uploaded_${Date.now()}`;
        setUploadedData({
          ...uploadedData,
          [newOptionValue]: result.students,
        });

        const newOption = {
          value: newOptionValue,
          label: `📤 ${file.name} (${result.count} öğrenci)`,
        };
        setExamOptions([...examOptions, newOption]);
        setSelectedExam(newOptionValue);

        setStudents(filtered);
        setFilteredStudents(filtered);
        setSelectedStudent(null);
        setComparisonStudents([]);
        setShowComparison(false);

        setSnackbar({
          open: true,
          message: `${result.count} öğrenci başarıyla yüklendi!`,
          severity: 'success',
        });
      } else {
        setSnackbar({
          open: true,
          message: result.error || 'PDF işlenirken hata oluştu',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Sunucuya bağlanılamadı. upload_server.py çalışıyor mu?',
        severity: 'error',
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
  };

  const handleAddToComparison = (student) => {
    if (!comparisonStudents.find((s) => s.name === student.name)) {
      setComparisonStudents([...comparisonStudents, student]);
    }
  };

  const handleRemoveFromComparison = (studentName) => {
    setComparisonStudents(
      comparisonStudents.filter((s) => s.name !== studentName)
    );
  };

  const handleClearComparison = () => {
    setComparisonStudents([]);
    setShowComparison(false);
  };

  const handleCompare = () => {
    if (comparisonStudents.length >= 2) {
      setShowComparison(true);
      setSelectedStudent(null);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Box sx={{ width: '50%', textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Veriler yükleniyor...
            </Typography>
            <LinearProgress />
          </Box>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Paper
          elevation={3}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 1.5,
            mb: 2,
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AssessmentIcon sx={{ fontSize: 28 }} />
                <Box>
                  <Typography
                    variant="h6"
                    component="h1"
                    sx={{ lineHeight: 1.2 }}
                  >
                    Öğrenci Performans Analiz Sistemi
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ opacity: 0.9, fontSize: '0.75rem' }}
                  >
                    {students.length} öğrenci
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  flex: 1,
                  maxWidth: 600,
                }}
              >
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 250,
                    bgcolor: 'white',
                    borderRadius: 1.5,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                  }}
                >
                  <Select
                    value={selectedExam}
                    onChange={handleExamChange}
                    sx={{
                      color: 'text.primary',
                      '& .MuiSelect-select': {
                        py: 1,
                      },
                    }}
                  >
                    {examOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Öğrenci adı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: 1.5,
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        border: 'none',
                      },
                    },
                  }}
                />

                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  sx={{ display: 'none' }}
                  id="pdf-upload-input"
                />
                <label htmlFor="pdf-upload-input">
                  <Button
                    component="span"
                    variant="contained"
                    size="small"
                    startIcon={<CloudUploadIcon />}
                    disabled={uploading}
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      },
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {uploading ? 'Yükleniyor...' : 'PDF Yükle'}
                  </Button>
                </label>
              </Box>
            </Box>
          </Container>
        </Paper>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <Container maxWidth="xl" sx={{ pb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  height: 'calc(100vh - 200px)',
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    flex:
                      comparisonStudents.length > 0 ? '0 0 50%' : '1 1 auto',
                    overflow: 'auto',
                    minHeight: 0,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mb: 2, color: 'primary.main' }}
                  >
                    <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Öğrenci Listesi
                  </Typography>
                  <StudentList
                    students={filteredStudents}
                    selectedStudent={selectedStudent}
                    onSelect={handleStudentSelect}
                    onAddToComparison={handleAddToComparison}
                  />
                </Paper>

                {comparisonStudents.length > 0 && (
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      flex: '0 0 auto',
                      maxHeight: '50%',
                      overflow: 'auto',
                      bgcolor: 'primary.light',
                      background:
                        'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}
                    >
                      <EmojiEventsIcon
                        sx={{ verticalAlign: 'middle', mr: 1 }}
                      />
                      Karşılaştırma ({comparisonStudents.length})
                    </Typography>
                    <ComparisonView
                      students={comparisonStudents}
                      onRemove={handleRemoveFromComparison}
                      onClear={handleClearComparison}
                      onCompare={handleCompare}
                    />
                  </Paper>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              {showComparison && comparisonStudents.length >= 2 ? (
                <ComparisonDetails
                  students={comparisonStudents}
                  allStudents={students}
                />
              ) : selectedStudent ? (
                <StudentDetails
                  student={selectedStudent}
                  allStudents={students}
                />
              ) : (
                <Paper
                  elevation={2}
                  sx={{
                    p: 6,
                    textAlign: 'center',
                    height: 'calc(100vh - 200px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <PersonIcon sx={{ fontSize: 80, color: 'grey.300', mb: 2 }} />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    Hoş Geldiniz
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Bir öğrenci seçin veya arama yapın
                  </Typography>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
