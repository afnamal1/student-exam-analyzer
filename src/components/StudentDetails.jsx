import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Class as ClassIcon,
  Numbers as NumbersIcon,
  EmojiEvents as EmojiEventsIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
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

function StudentDetails({ student, allStudents }) {
  const getDersName = (dersKey) => {
    const dersNames = {
      turkce: 'Türkçe',
      tarih: 'Tarih',
      din: 'Din K.ve A.B.',
      ingilizce: 'İngilizce',
      matematik: 'Matematik',
      fen: 'Fen',
      toplam: 'Toplam',
    };
    return dersNames[dersKey] || dersKey;
  };

  const getScoreClass = (score, dersKey) => {
    if (dersKey === 'toplam') {
      if (score >= 350) return 'success';
      if (score >= 250) return 'info';
      if (score >= 150) return 'warning';
      return 'error';
    } else if (
      dersKey === 'turkce' ||
      dersKey === 'matematik' ||
      dersKey === 'fen'
    ) {
      if (score >= 70) return 'success';
      if (score >= 50) return 'info';
      if (score >= 30) return 'warning';
      return 'error';
    } else {
      if (score >= 35) return 'success';
      if (score >= 25) return 'info';
      if (score >= 15) return 'warning';
      return 'error';
    }
  };

  const getScoreLabel = (score, dersKey) => {
    if (dersKey === 'toplam') {
      if (score >= 350) return 'Mükemmel';
      if (score >= 250) return 'İyi';
      if (score >= 150) return 'Orta';
      return 'Zayıf';
    } else if (
      dersKey === 'turkce' ||
      dersKey === 'matematik' ||
      dersKey === 'fen'
    ) {
      if (score >= 70) return 'Mükemmel';
      if (score >= 50) return 'İyi';
      if (score >= 30) return 'Orta';
      return 'Zayıf';
    } else {
      if (score >= 35) return 'Mükemmel';
      if (score >= 25) return 'İyi';
      if (score >= 15) return 'Orta';
      return 'Zayıf';
    }
  };

  const dereceNames = {
    sinif: 'Sınıf',
    okul: 'Okul',
    ilce: 'İlçe',
    il: 'İl',
    genel: 'Genel',
  };

  const calculateDersRanking = (dersKey) => {
    if (!allStudents || !student.dersler || !student.dersler[dersKey]) {
      return null;
    }

    const studentNet = student.dersler[dersKey].net;

    const dersNetleri = allStudents.map((s) => {
      if (
        s.dersler &&
        s.dersler[dersKey] &&
        s.dersler[dersKey].net !== undefined
      ) {
        return s.dersler[dersKey].net;
      }
      return 0;
    });

    const higherCount = dersNetleri.filter((net) => net > studentNet).length;

    const rank = higherCount + 1;

    const sameNetCount = dersNetleri.filter((net) => net === studentNet).length;

    return {
      sira: rank,
      toplam: dersNetleri.length,
      ayniNet: sameNetCount,
    };
  };

  const chartData = student.dersler
    ? {
        labels: ['Türkçe', 'Tarih', 'Din', 'İngilizce', 'Matematik', 'Fen'],
        datasets: [
          {
            label: 'Net',
            data: [
              'turkce',
              'tarih',
              'din',
              'ingilizce',
              'matematik',
              'fen',
            ].map((d) => (student.dersler[d] ? student.dersler[d].net : 0)),
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
          },
        ],
      }
    : null;

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
          <PersonIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            {student.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
            {student.ogrenci_no && (
              <Chip
                icon={<NumbersIcon />}
                label={`Öğrenci No: ${student.ogrenci_no}`}
                variant="outlined"
              />
            )}
            {student.sinif && (
              <Chip
                icon={<ClassIcon />}
                label={`Sınıf: ${student.sinif}`}
                variant="outlined"
              />
            )}
            <Chip
              icon={<TrendingUpIcon />}
              label={`Ortalama: ${student.average.toFixed(2)}`}
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 'bold' }}
            />
            {student.toplam_net && (
              <Chip
                icon={<EmojiEventsIcon />}
                label={`Toplam Net: ${student.toplam_net.toFixed(2)}`}
                color="success"
                sx={{ fontWeight: 'bold' }}
              />
            )}
            {student.lgs_puani && (
              <Chip
                icon={<EmojiEventsIcon />}
                label={`LGS: ${student.lgs_puani.toFixed(3)}`}
                color="secondary"
                sx={{ fontWeight: 'bold' }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {student.dersler && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 2, color: 'primary.main' }}
          >
            📚 Ders Detayları
          </Typography>
          <TableContainer component={Paper} elevation={1} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell>
                    <strong>Ders</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Doğru</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Yanlış</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Net</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Net (100'lük)</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Durum</strong>
                  </TableCell>
                  <TableCell align="center">
                    <strong>Okul Sırası</strong>
                  </TableCell>
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
                  if (!student.dersler[dersKey]) return null;
                  const ders = student.dersler[dersKey];
                  const net100 = ders.net * 5;
                  const ranking = calculateDersRanking(dersKey);
                  return (
                    <TableRow key={dersKey} hover>
                      <TableCell>
                        <strong>{getDersName(dersKey)}</strong>
                      </TableCell>
                      <TableCell align="center">{ders.dogru}</TableCell>
                      <TableCell align="center">{ders.yanlis}</TableCell>
                      <TableCell align="center">
                        <strong>{ders.net.toFixed(2)}</strong>
                      </TableCell>
                      <TableCell align="center">
                        <strong>{net100.toFixed(1)}</strong>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={getScoreLabel(net100, dersKey)}
                          color={getScoreClass(net100, dersKey)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {ranking ? (
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                              }}
                            >
                              {ranking.sira}. sıra
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {ranking.toplam} öğrenci arasında
                            </Typography>
                            {ranking.ayniNet > 1 && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                ({ranking.ayniNet} öğrenci aynı net)
                              </Typography>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {student.dereceler && Object.keys(student.dereceler).length > 0 && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 2, color: 'primary.main' }}
          >
            🏆 Dereceler
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {Object.entries(student.dereceler).map(([key, value]) => {
              const sira = value.sira || 'N/A';
              const yuzde = value.yuzde ? ` (%${value.yuzde.toFixed(2)})` : '';
              return (
                <Grid item xs={6} sm={4} md={2.4} key={key}>
                  <Card elevation={2}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <SchoolIcon
                        sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {dereceNames[key] || key}
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        {sira}
                        {yuzde}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}

      {chartData && (
        <>
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
        </>
      )}
    </Paper>
  );
}

export default StudentDetails;
