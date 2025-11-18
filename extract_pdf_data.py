import json
import re
import pdfplumber

def clean_name(name):
    """İsimden sınıf bilgisi ve sayıları temizle"""
    # Sınıf bilgilerini kaldır (8-H, 8-F, R8-E, vb.)
    name = re.sub(r'[R]?\d+[-]?[A-H]', '', name)
    name = re.sub(r'\d+[-]?[A-H]', '', name)
    name = re.sub(r'8-XX', '', name)
    
    # Sayıları kaldır (ondalık sayılar dahil)
    name = re.sub(r'[-]?\d+[.,]?\d*', '', name)
    
    # Fazla boşlukları temizle
    name = ' '.join(name.split())
    
    return name.strip()

def parse_dyn_value(cell_str):
    """D Y N formatındaki değeri parse et (Doğru, Yanlış, Net)"""
    if not cell_str:
        return None
    
    cell_str = str(cell_str).strip()
    
    # D Y N formatı: "18 2 17,33"
    if ' ' in cell_str and re.search(r'\d', cell_str):
        parts = cell_str.split()
        if len(parts) >= 3:
            try:
                dogru = int(parts[0])
                yanlis = int(parts[1])
                net = float(parts[2].replace(',', '.'))
                return {'dogru': dogru, 'yanlis': yanlis, 'net': net}
            except:
                pass
    
    return None

def extract_student_data(pdf_path):
    """PDF'ten öğrenci verilerini çıkarır"""
    students = []
    seen_sira = set()
    
    # Ders sütun indeksleri (D, Y, N ayrı sütunlar)
    ders_columns = {
        'turkce': {'d': 5, 'y': 6, 'n': 7},      # Türkçe
        'tarih': {'d': 9, 'y': 10, 'n': 11},     # Tarih
        'din': {'d': 12, 'y': 13, 'n': 14},      # Din K.ve A.B.
        'ingilizce': {'d': 15, 'y': 16, 'n': 17}, # İngilizce
        'matematik': {'d': 19, 'y': 20, 'n': 21}, # Matematik
        'fen': {'d': 22, 'y': 23, 'n': 24},      # Fen
        'toplam': {'d': 25, 'y': 26, 'n': 27},   # Toplam
    }
    
    lgs_puan_column = 29  # LGS Puanı
    derece_columns = {
        'sinif': 31,    # Snf
        'okul': 32,     # Okul
        'ilce': 33,     # İlçe
        'il': 34,       # İl
        'genel': 35     # Genel
    }
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            print(f"Toplam sayfa sayısı: {len(pdf.pages)}")
            
            for page_num, page in enumerate(pdf.pages, 1):
                print(f"Sayfa {page_num} işleniyor...")
                
                tables = page.extract_tables()
                
                if tables:
                    for table in tables:
                        # Başlık satırını bul
                        header_row_idx = None
                        for idx, row in enumerate(table):
                            if row and len(row) > 2:
                                first_cell = str(row[0]).strip() if row[0] else ''
                                if 'Sıra' in first_cell or 'İsim' in first_cell:
                                    header_row_idx = idx
                                    break
                        
                        # Öğrenci verilerini çıkar
                        for row_idx, row in enumerate(table):
                            if not row or len(row) < 3:
                                continue
                            
                            # Başlık satırını atla
                            if header_row_idx is not None and row_idx <= header_row_idx:
                                continue
                            
                            # İlk sütun kontrolü - sıra numarası olmalı
                            first_cell = str(row[0]).strip() if row[0] else ''
                            
                            # "Genel Ortalama", "Okul Ortalaması" gibi satırları atla
                            if any(word in first_cell for word in ['Genel', 'Okul', 'Ortalama', 'Toplam']):
                                continue
                            
                            # Sıra numarası kontrolü (sayı olmalı)
                            if not first_cell.isdigit():
                                continue
                            
                            # Aynı sıra numarasını tekrar işleme
                            if first_cell in seen_sira:
                                continue
                            seen_sira.add(first_cell)
                            
                            # İsim sütunu bul
                            name_parts = []
                            for col_idx in range(1, min(len(row), 6)):
                                if col_idx < len(row) and row[col_idx]:
                                    cell = str(row[col_idx]).strip()
                                    if (cell and 
                                        len(cell) > 0 and 
                                        not cell.isdigit() and
                                        cell not in ['YALOVA', 'MERKEZ', 'OKUL', 'İL', 'İLÇE', 'None'] and
                                        not re.match(r'^\d+$', cell) and
                                        not re.match(r'^[R]?\d+[-]?[A-H]$', cell) and
                                        not re.match(r'^[-]?\d+[.,]?\d*$', cell)):
                                        name_parts.append(cell)
                            
                            if not name_parts:
                                continue
                            
                            # İsimi birleştir ve temizle
                            raw_name = ' '.join(name_parts[:5])
                            name = clean_name(raw_name)
                            
                            # Boşluklu isimleri düzelt
                            if ' ' in name and len(name.split()) > 4:
                                parts = name.split()
                                fixed_parts = []
                                i = 0
                                while i < len(parts):
                                    if len(parts[i]) == 1 and i + 1 < len(parts) and len(parts[i+1]) == 1:
                                        combined = parts[i] + parts[i+1]
                                        fixed_parts.append(combined)
                                        i += 2
                                    else:
                                        fixed_parts.append(parts[i])
                                        i += 1
                                name = ' '.join(fixed_parts)
                            
                            if not name or len(name) < 3:
                                continue
                            
                            # Öğrenci numarası
                            ogrenci_no = None
                            if len(row) > 1 and row[1]:
                                try:
                                    ogrenci_no = int(str(row[1]).strip())
                                except:
                                    pass
                            
                            # Sınıf
                            sinif = None
                            if len(row) > 4 and row[4]:
                                sinif = str(row[4]).strip()
                            
                            # Ders bilgilerini çıkar
                            dersler = {}
                            for ders_adi, cols in ders_columns.items():
                                dogru = None
                                yanlis = None
                                net = None
                                
                                # Doğru sayısı
                                if cols['d'] < len(row) and row[cols['d']]:
                                    try:
                                        dogru = int(str(row[cols['d']]).strip())
                                    except:
                                        pass
                                
                                # Yanlış sayısı
                                if cols['y'] < len(row) and row[cols['y']]:
                                    try:
                                        yanlis = int(str(row[cols['y']]).strip())
                                    except:
                                        pass
                                
                                # Net değer
                                if cols['n'] < len(row) and row[cols['n']]:
                                    try:
                                        net = float(str(row[cols['n']]).replace(',', '.').strip())
                                    except:
                                        pass
                                
                                if dogru is not None or yanlis is not None or net is not None:
                                    dersler[ders_adi] = {
                                        'dogru': dogru if dogru is not None else 0,
                                        'yanlis': yanlis if yanlis is not None else 0,
                                        'net': net if net is not None else 0.0
                                    }
                            
                            # LGS Puanı
                            lgs_puani = None
                            if lgs_puan_column < len(row) and row[lgs_puan_column]:
                                try:
                                    lgs_puani = float(str(row[lgs_puan_column]).replace(',', '.').strip())
                                except:
                                    pass
                            
                            # Dereceler
                            dereceler = {}
                            for derece_adi, col_idx in derece_columns.items():
                                if col_idx < len(row) and row[col_idx]:
                                    try:
                                        derece_str = str(row[col_idx]).strip()
                                        if derece_str and derece_str != 'None':
                                            # Yüzde işareti varsa ayır (genel için)
                                            if '%' in derece_str:
                                                parts = derece_str.split()
                                                if len(parts) >= 2:
                                                    sira = None
                                                    yuzde = None
                                                    for part in parts:
                                                        if part.replace('%', '').replace(',', '.').replace('.', '').isdigit():
                                                            if '%' in part:
                                                                yuzde = float(part.replace('%', '').replace(',', '.'))
                                                            else:
                                                                sira = int(part)
                                                    dereceler[derece_adi] = {
                                                        'sira': sira,
                                                        'yuzde': yuzde
                                                    }
                                            else:
                                                # Sadece sıra numarası
                                                if derece_str.isdigit():
                                                    dereceler[derece_adi] = {'sira': int(derece_str)}
                                    except Exception as e:
                                        pass
                            
                            # Net değerlerden scores array'i oluştur
                            scores = []
                            for ders_adi in ['turkce', 'tarih', 'din', 'ingilizce', 'matematik', 'fen']:
                                if ders_adi in dersler and dersler[ders_adi]['net'] > 0:
                                    scores.append(dersler[ders_adi]['net'] * 5)  # 20'lik -> 100'lük
                            
                            # Ortalama hesapla
                            average = round(sum(scores) / len(scores), 2) if scores else 0
                            
                            # Toplam net hesapla (20'lik sistemde)
                            toplam_net = 0
                            if 'toplam' in dersler:
                                toplam_net = dersler['toplam']['net']
                            else:
                                # Toplam yoksa derslerin net değerlerini topla
                                for ders_adi in ['turkce', 'tarih', 'din', 'ingilizce', 'matematik', 'fen']:
                                    if ders_adi in dersler:
                                        toplam_net += dersler[ders_adi]['net']
                            
                            # Öğrenci verisini oluştur
                            student_data = {
                                'name': name,
                                'scores': scores,
                                'average': average,
                                'toplam_net': round(toplam_net, 2),
                                'ogrenci_no': ogrenci_no,
                                'sinif': sinif,
                                'dersler': dersler,
                                'lgs_puani': lgs_puani,
                                'dereceler': dereceler
                            }
                            
                            students.append(student_data)
                
    except Exception as e:
        print(f"Hata: {e}")
        import traceback
        traceback.print_exc()
    
    # İsme göre sırala
    students.sort(key=lambda x: x['name'])
    
    print(f"\n{'='*50}")
    print(f"Toplam {len(students)} öğrenci bulundu.")
    print(f"{'='*50}\n")
    
    return students

if __name__ == '__main__':
    import sys
    
    pdf_files = [
        ('YAHO 8LER LİSTE.pdf', 'yaho_student_data.json', 'YAHO 8. Sınıf Sınav Sonuçları'),
        ('AYDIN LİSTE VE KARNE.pdf', 'aydin_student_data.json', 'AYDIN Sınav Sonuçları'),
    ]
    
    for pdf_path, json_filename, exam_name in pdf_files:
        try:
            print(f"\n{'='*60}")
            print(f"📄 {exam_name} işleniyor...")
            print(f"{'='*60}\n")
            
            students = extract_student_data(pdf_path)
            
            if students:
                print(f"✅ {len(students)} öğrenci bulundu.")
                
                json_path = json_filename
                public_json_path = f'public/{json_filename}'
                
                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(students, f, ensure_ascii=False, indent=2)
                
                import os
                os.makedirs('public', exist_ok=True)
                with open(public_json_path, 'w', encoding='utf-8') as f:
                    json.dump(students, f, ensure_ascii=False, indent=2)
                
                print(f"✅ Veriler '{json_path}' ve '{public_json_path}' dosyalarına kaydedildi.")
            else:
                print(f"⚠️ {pdf_path} dosyasından öğrenci bulunamadı.")
        except FileNotFoundError:
            print(f"⚠️ {pdf_path} dosyası bulunamadı, atlanıyor...")
        except Exception as e:
            print(f"❌ {pdf_path} işlenirken hata: {e}")
            import traceback
            traceback.print_exc()
    
    print(f"\n{'='*60}")
    print("✅ Tüm PDF dosyaları işlendi!")
    print(f"{'='*60}\n")
