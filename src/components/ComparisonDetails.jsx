import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Person as PersonIcon,
  CompareArrows as CompareArrowsIcon,
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ComparisonDetails({ students, allStudents }) {
  const dersNames = {
    turkce: 'Türkçe',
    tarih: 'Tarih',
    din: 'Din',
    ingilizce: 'İngilizce',
    matematik: 'Matematik',
    fen: 'Fen',
    toplam: 'Toplam',
  };

  const chartData = {
    labels: ['Türkçe', 'Tarih', 'Din', 'İngilizce', 'Matematik', 'Fen'],
    datasets: students.map((student, index) => {
      const colors = [
        '#667eea',
        '#f093fb',
        '#4facfe',
        '#43e97b',
        '#fa709a',
        '#fee140',
      ];
      return {
        label: student.name,
        data: ['turkce', 'tarih', 'din', 'ingilizce', 'matematik', 'fen'].map(
          (d) =>
            student.dersler && student.dersler[d] ? student.dersler[d].net : 0
        ),
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length] + '20',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
      };
    }),
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 20,
        title: {
          display: true,
          text: "Net (20'lik)",
        },
      },
    },
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{
            bgcolor: 'primary.main',
            width: 64,
            height: 64,
            mr: 2,
          }}
        >
          <CompareArrowsIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Öğrenci Karşılaştırması
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {students.length} öğrenci karşılaştırılıyor
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {students.map((student) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={12 / students.length}
            key={student.name}
          >
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">{student.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {student.ogrenci_no && (
                    <Chip
                      label={`Öğrenci No: ${student.ogrenci_no}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  {student.sinif && (
                    <Chip
                      label={`Sınıf: ${student.sinif}`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                  <Chip
                    icon={<TrendingUpIcon />}
                    label={`Ortalama: ${student.average.toFixed(2)}`}
                    color="primary"
                    size="small"
                  />
                  {student.toplam_net && (
                    <Chip
                      icon={<EmojiEventsIcon />}
                      label={`Toplam Net: ${student.toplam_net.toFixed(2)}`}
                      color="success"
                      size="small"
                    />
                  )}
                  {student.lgs_puani && (
                    <Chip
                      label={`LGS: ${student.lgs_puani.toFixed(3)}`}
                      color="secondary"
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="h5"
        gutterBottom
        sx={{ mb: 2, color: 'primary.main' }}
      >
        📚 Ders Detayları Karşılaştırması
      </Typography>
      <TableContainer component={Paper} elevation={1} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>
                <strong>Ders</strong>
              </TableCell>
              {students.map((student) => (
                <TableCell key={student.name} align="center">
                  <strong>{student.name}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              'turkce',
              'tarih',
              'din',
              'ingilizce',
              'matematik',
              'fen',
              'toplam',
            ].map((dersKey) => {
              const allHaveDers = students.every(
                (s) => s.dersler && s.dersler[dersKey]
              );
              if (!allHaveDers) return null;

              return (
                <TableRow key={dersKey} hover>
                  <TableCell>
                    <strong>{dersNames[dersKey] || dersKey}</strong>
                  </TableCell>
                  {students.map((student) => {
                    const ders = student.dersler[dersKey];
                    return (
                      <TableCell key={student.name} align="center">
                        <Box>
                          <Typography variant="body2">
                            <strong>Net: {ders.net.toFixed(2)}</strong>
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            D: {ders.dogru} | Y: {ders.yanlis}
                          </Typography>
                        </Box>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="h5"
        gutterBottom
        sx={{ mb: 2, color: 'primary.main' }}
      >
        📊 Net Değerleri Grafiği
      </Typography>
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box sx={{ height: 400 }}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </Paper>
    </Paper>
  );
}

export default ComparisonDetails;
