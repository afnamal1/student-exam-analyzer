let students = [];
let selectedStudent = null;
let comparisonStudents = [];
let charts = [];

// Veriyi yükle
async function loadData() {
  try {
    // Cache'i bypass etmek için timestamp ekle
    const timestamp = new Date().getTime();
    const response = await fetch(`student_data.json?t=${timestamp}`, {
      cache: 'no-cache',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    students = await response.json();

    // Genel Ortalama ve Okul Ortalaması gibi genel verileri filtrele
    students = students.filter(
      (s) =>
        !s.name.includes('Genel Ortalama') &&
        !s.name.includes('Okul Ortalaması')
    );

    console.log(`✅ ${students.length} öğrenci verisi yüklendi.`);

    // Öğrenci sayısını göster
    const countElement = document.getElementById('studentCount');
    if (countElement) {
      countElement.textContent = `📚 ${students.length} öğrenci verisi yüklendi`;
    }

    // Eğer öğrenci yoksa örnek veri ekle
    if (students.length === 0) {
      console.warn('⚠️ Veri bulunamadı, örnek veri kullanılıyor.');
      students = [
        { name: 'Ahmet Yılmaz', scores: [85, 90, 78, 92, 88], average: 86.6 },
        { name: 'Ayşe Demir', scores: [95, 88, 92, 90, 94], average: 91.8 },
        { name: 'Mehmet Kaya', scores: [75, 80, 72, 78, 76], average: 76.2 },
        { name: 'Zeynep Şahin', scores: [88, 85, 90, 87, 89], average: 87.8 },
        { name: 'Ali Öztürk', scores: [92, 95, 88, 93, 91], average: 91.8 },
      ];
      if (countElement) {
        countElement.textContent = `⚠️ Örnek veri kullanılıyor (${students.length} öğrenci)`;
      }
    }

    renderStudentList();
  } catch (error) {
    console.error('❌ Veri yükleme hatası:', error);
    // Fallback veri
    students = [
      { name: 'Ahmet Yılmaz', scores: [85, 90, 78, 92, 88], average: 86.6 },
      { name: 'Ayşe Demir', scores: [95, 88, 92, 90, 94], average: 91.8 },
      { name: 'Mehmet Kaya', scores: [75, 80, 72, 78, 76], average: 76.2 },
      { name: 'Zeynep Şahin', scores: [88, 85, 90, 87, 89], average: 87.8 },
      { name: 'Ali Öztürk', scores: [92, 95, 88, 93, 91], average: 91.8 },
    ];
    renderStudentList();
  }
}

// Öğrenci listesini render et
function renderStudentList() {
  const listContainer = document.getElementById('studentList');
  listContainer.innerHTML = '';

  students.forEach((student, index) => {
    const item = document.createElement('div');
    item.className = 'student-item';
    if (selectedStudent && selectedStudent.name === student.name) {
      item.classList.add('selected');
    }

    item.innerHTML = `
            <span class="name">${student.name}</span>
            <span class="average">${student.average.toFixed(1)}</span>
        `;

    item.addEventListener('click', () => selectStudent(student));
    listContainer.appendChild(item);
  });

  // Karşılaştırma butonlarını ekle
  setTimeout(addComparisonButtons, 50);
}

// Öğrenci seç
function selectStudent(student) {
  selectedStudent = student;
  renderStudentList();
  renderStudentDetails(student);
  updateComparisonList();
}

// Ders adlarını Türkçe'ye çevir
function getDersName(dersKey) {
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
}

// Öğrenci detaylarını render et
function renderStudentDetails(student) {
  const detailsContainer = document.getElementById('studentDetails');

  const maxScore = student.scores.length > 0 ? Math.max(...student.scores) : 0;
  const minScore = student.scores.length > 0 ? Math.min(...student.scores) : 0;
  const totalScore = student.scores.reduce((a, b) => a + b, 0);

  // Ders bilgileri HTML'i
  let derslerHTML = '';
  if (student.dersler) {
    const dersSirasi = [
      'turkce',
      'tarih',
      'din',
      'ingilizce',
      'matematik',
      'fen',
      'toplam',
    ];
    derslerHTML = `
      <h3 style="margin: 30px 0 20px 0; color: #667eea;">📚 Ders Detayları</h3>
      <table class="scores-table">
        <thead>
          <tr>
            <th>Ders</th>
            <th>Doğru</th>
            <th>Yanlış</th>
            <th>Net</th>
            <th>Net (100'lük)</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          ${dersSirasi
            .map((dersKey) => {
              if (student.dersler[dersKey]) {
                const ders = student.dersler[dersKey];
                const net100 = ders.net * 5; // 20'lik -> 100'lük
                return `
                <tr>
                  <td><strong>${getDersName(dersKey)}</strong></td>
                  <td>${ders.dogru}</td>
                  <td>${ders.yanlis}</td>
                  <td><strong>${ders.net.toFixed(2)}</strong></td>
                  <td><strong>${net100.toFixed(1)}</strong></td>
                  <td>
                    <span class="score-badge ${getScoreClass(net100)}">
                      ${getScoreLabel(net100)}
                    </span>
                  </td>
                </tr>
              `;
              }
              return '';
            })
            .join('')}
        </tbody>
      </table>
    `;
  }

  // LGS ve Derece bilgileri
  let lgsHTML = '';
  if (student.lgs_puani) {
    lgsHTML = `
      <div class="lgs-section" style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
        <h3 style="margin: 0 0 15px 0; color: white;">🎯 LGS Puanı</h3>
        <div style="font-size: 2.5em; font-weight: bold; text-align: center;">${student.lgs_puani.toFixed(
          3
        )}</div>
      </div>
    `;
  }

  let dereceHTML = '';
  if (student.dereceler && Object.keys(student.dereceler).length > 0) {
    const dereceNames = {
      sinif: 'Sınıf',
      okul: 'Okul',
      ilce: 'İlçe',
      il: 'İl',
      genel: 'Genel',
    };

    dereceHTML = `
      <h3 style="margin: 30px 0 20px 0; color: #667eea;">🏆 Dereceler</h3>
      <div class="stats-grid">
        ${Object.entries(student.dereceler)
          .map(([key, value]) => {
            const sira = value.sira || 'N/A';
            const yuzde = value.yuzde ? ` (%${value.yuzde.toFixed(2)})` : '';
            return `
            <div class="stat-card">
              <div class="label">${dereceNames[key] || key}</div>
              <div class="value">${sira}${yuzde}</div>
            </div>
          `;
          })
          .join('')}
      </div>
    `;
  }

  detailsContainer.innerHTML = `
        <div class="detail-card">
            <div class="detail-header">
                <div>
                    <h2>${student.name}</h2>
                    ${
                      student.ogrenci_no
                        ? `<p style="margin: 5px 0; color: #666;">Öğrenci No: ${student.ogrenci_no}</p>`
                        : ''
                    }
                    ${
                      student.sinif
                        ? `<p style="margin: 5px 0; color: #666;">Sınıf: ${student.sinif}</p>`
                        : ''
                    }
                </div>
                <div class="average-badge">Ortalama: ${student.average.toFixed(
                  2
                )}</div>
            </div>
            
            ${derslerHTML}
            
            ${lgsHTML}
            
            ${dereceHTML}
            
            <h3 style="margin: 30px 0 20px 0; color: #667eea;">📊 Net Değerleri Grafiği</h3>
            <div class="chart-container">
                <canvas id="studentChart"></canvas>
            </div>
        </div>
    `;

  // Grafik oluştur
  setTimeout(() => {
    renderStudentChart(student);
  }, 100);
}

// Öğrenci grafiğini render et
function renderStudentChart(student) {
  const ctx = document.getElementById('studentChart');
  if (!ctx) return;

  // Önceki grafiği temizle
  if (charts.length > 0) {
    charts.forEach((chart) => chart.destroy());
    charts = [];
  }

  // Ders bilgileri varsa ders bazlı grafik, yoksa genel grafik
  let labels = [];
  let datasets = [];

  if (student.dersler) {
    const dersSirasi = [
      'turkce',
      'tarih',
      'din',
      'ingilizce',
      'matematik',
      'fen',
    ];
    labels = dersSirasi.map((d) => getDersName(d));

    // Net değerleri (20'lik sistem)
    datasets.push({
      label: "Net (20'lik)",
      data: dersSirasi.map((d) =>
        student.dersler[d] ? student.dersler[d].net : 0
      ),
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
      yAxisID: 'y',
    });

    // Net değerleri (100'lük sistem)
    datasets.push({
      label: "Net (100'lük)",
      data: dersSirasi.map((d) =>
        student.dersler[d] ? student.dersler[d].net * 5 : 0
      ),
      borderColor: '#f093fb',
      backgroundColor: 'rgba(240, 147, 251, 0.1)',
      borderWidth: 2,
      borderDash: [5, 5],
      fill: false,
      tension: 0.4,
      pointRadius: 5,
      yAxisID: 'y1',
    });
  } else {
    // Eski format - genel grafik
    labels = student.scores.map((_, i) => `Sınav ${i + 1}`);
    datasets.push({
      label: 'Not',
      data: student.scores,
      borderColor: '#667eea',
      backgroundColor: 'rgba(102, 126, 234, 0.1)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 6,
      pointHoverRadius: 8,
    });
  }

  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: datasets.length > 1,
          position: 'top',
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14,
          },
          bodyFont: {
            size: 14,
          },
        },
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: true,
          max: 20,
          title: {
            display: true,
            text: "Net (20'lik)",
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
        },
        y1: {
          type: 'linear',
          display: datasets.length > 1,
          position: 'right',
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: "Net (100'lük)",
          },
          grid: {
            drawOnChartArea: false,
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });

  charts.push(chart);
}

// Not sınıfını belirle
function getScoreClass(score) {
  if (score >= 70) return 'score-excellent';
  if (score >= 50) return 'score-good';
  if (score >= 30) return 'score-average';
  return 'score-poor';
}

// Not etiketini belirle
function getScoreLabel(score) {
  if (score >= 70) return 'Mükemmel';
  if (score >= 50) return 'İyi';
  if (score >= 30) return 'Orta';
  return 'Zayıf';
}

// Arama
document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  if (query.length === 0) {
    document.getElementById('searchResults').innerHTML = '';
    return;
  }

  const results = students.filter((s) => s.name.toLowerCase().includes(query));

  renderSearchResults(results);
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = document
    .getElementById('searchInput')
    .value.toLowerCase()
    .trim();
  if (query.length === 0) return;

  const results = students.filter((s) => s.name.toLowerCase().includes(query));

  renderSearchResults(results);
});

function renderSearchResults(results) {
  const resultsContainer = document.getElementById('searchResults');

  if (results.length === 0) {
    resultsContainer.innerHTML =
      '<div style="padding: 20px; text-align: center; color: #999;">Sonuç bulunamadı</div>';
    return;
  }

  resultsContainer.innerHTML = results
    .map(
      (student) => `
        <div class="search-result-item" onclick="selectStudent(${students.indexOf(
          student
        )})">
            <span>${student.name}</span>
            <span style="color: #667eea; font-weight: bold;">${student.average.toFixed(
              1
            )}</span>
        </div>
    `
    )
    .join('');
}

// Karşılaştırma
function addToComparison(student) {
  if (comparisonStudents.find((s) => s.name === student.name)) {
    return;
  }

  comparisonStudents.push(student);
  updateComparisonList();
}

function removeFromComparison(student) {
  comparisonStudents = comparisonStudents.filter(
    (s) => s.name !== student.name
  );
  updateComparisonList();
}

function updateComparisonList() {
  const listContainer = document.getElementById('comparisonList');
  const compareBtn = document.getElementById('compareBtn');

  listContainer.innerHTML = '';

  if (comparisonStudents.length === 0) {
    listContainer.innerHTML =
      '<div style="padding: 10px; text-align: center; color: #999; font-size: 0.9em;">Karşılaştırma için öğrenci ekleyin</div>';
    compareBtn.disabled = true;
    return;
  }

  comparisonStudents.forEach((student) => {
    const item = document.createElement('div');
    item.className = 'comparison-item';
    item.innerHTML = `
            <span>${student.name}</span>
            <button class="remove-btn" onclick="removeFromComparisonByName('${student.name}')">✕</button>
        `;
    listContainer.appendChild(item);
  });

  compareBtn.disabled = comparisonStudents.length < 2;
}

function removeFromComparisonByName(name) {
  removeFromComparison(comparisonStudents.find((s) => s.name === name));
}

document.getElementById('compareBtn').addEventListener('click', () => {
  if (comparisonStudents.length < 2) return;
  renderComparison();
});

document.getElementById('clearCompareBtn').addEventListener('click', () => {
  comparisonStudents = [];
  updateComparisonList();
  document.getElementById('comparisonView').classList.add('hidden');
});

function renderComparison() {
  const comparisonView = document.getElementById('comparisonView');
  const chartsContainer = document.getElementById('comparisonCharts');

  comparisonView.classList.remove('hidden');
  chartsContainer.innerHTML = '';

  // Önceki grafikleri temizle
  charts.forEach((chart) => chart.destroy());
  charts = [];

  // Karşılaştırma grafiği
  const comparisonChartCard = document.createElement('div');
  comparisonChartCard.className = 'comparison-chart-card';
  comparisonChartCard.innerHTML =
    '<h3 style="margin-bottom: 20px; color: #667eea;">Not Karşılaştırması</h3><canvas id="comparisonChart"></canvas>';
  chartsContainer.appendChild(comparisonChartCard);

  // Ortalama karşılaştırması
  const averageChartCard = document.createElement('div');
  averageChartCard.className = 'comparison-chart-card';
  averageChartCard.innerHTML =
    '<h3 style="margin-bottom: 20px; color: #667eea;">Ortalama Karşılaştırması</h3><canvas id="averageChart"></canvas>';
  chartsContainer.appendChild(averageChartCard);

  setTimeout(() => {
    // Karşılaştırma grafiği
    const ctx1 = document.getElementById('comparisonChart');
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];

    const comparisonChart = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: Array.from(
          {
            length: Math.max(...comparisonStudents.map((s) => s.scores.length)),
          },
          (_, i) => `Sınav ${i + 1}`
        ),
        datasets: comparisonStudents.map((student, index) => ({
          label: student.name,
          data: student.scores,
          borderColor: colors[index % colors.length],
          backgroundColor: colors[index % colors.length] + '20',
          borderWidth: 3,
          fill: false,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
        })),
      },
      options: {
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
            max: 100,
          },
        },
      },
    });

    // Ortalama karşılaştırması
    const ctx2 = document.getElementById('averageChart');
    const averageChart = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels: comparisonStudents.map((s) => s.name),
        datasets: [
          {
            label: 'Ortalama',
            data: comparisonStudents.map((s) => s.average),
            backgroundColor: comparisonStudents.map(
              (_, i) => colors[i % colors.length] + '80'
            ),
            borderColor: comparisonStudents.map(
              (_, i) => colors[i % colors.length]
            ),
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
          },
        },
      },
    });

    charts.push(comparisonChart, averageChart);
  }, 100);

  // Sayfayı karşılaştırma görünümüne kaydır
  comparisonView.scrollIntoView({ behavior: 'smooth' });
}

// Öğrenci listesine karşılaştırma butonu ekle
function addComparisonButtons() {
  document.querySelectorAll('.student-item').forEach((item) => {
    const nameElement = item.querySelector('.name');
    if (!nameElement) return;

    const studentName = nameElement.textContent.trim();
    const student = students.find((s) => s.name === studentName);
    if (!student) return;

    // Eğer buton zaten varsa ekleme
    if (item.querySelector('.add-compare-btn')) return;

    const addBtn = document.createElement('button');
    addBtn.textContent = '+';
    addBtn.className = 'add-compare-btn';
    addBtn.style.cssText =
      'background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 10px; font-weight: bold;';
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      addToComparison(student);
    });

    item.appendChild(addBtn);
  });
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
  loadData().then(() => {
    // İlk yüklemeden sonra karşılaştırma butonlarını ekle
    setTimeout(addComparisonButtons, 100);
  });
});

// Global fonksiyonlar
window.selectStudent = (index) => {
  if (typeof index === 'number') {
    selectStudent(students[index]);
  } else {
    selectStudent(index);
  }
};

window.removeFromComparisonByName = removeFromComparisonByName;
