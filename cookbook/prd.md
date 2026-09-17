# Portable Product Requirements Document dan Project Profile

Status: portable base + project profile

Dokumen ini memiliki dua lapisan. Struktur requirement, acceptance criteria,
dan non-functional requirement dapat dipakai ulang. Detail SISTER adalah
`Project Profile` untuk repository `sister-integrated` dan harus diganti bila
dokumen dipindahkan ke project lain.

Security requirement lintas layer, threat model, dan audit evidence dirinci pada
[security.md](./security.md). PRD ini hanya menetapkan security behavior yang
merupakan bagian dari product scope.

## Project Profile: `sister-integrated`

- Produk: portal administrasi perguruan tinggi terintegrasi SISTER.
- External system: SISTER Web Service PT API Reference versi 1.0.0.
- Runner/runtime repository: Bun 1.3.x dengan `bun.lock` dan `bunfig.toml`;
  perintah standar memakai `bun install` dan `bun run <script>`.
- Sumber batas capability: [SISTER Web Service PT.pdf](../SISTER%20Web%20Service%20PT.pdf).
- Scope reference: 236 endpoint unik dalam 39 domain; tidak seluruhnya masuk
  release pertama.
- Module awal: `pegawai`, dengan seluruh page, API procedure, service, schema,
  widget, dan repository khusus berada di `src/modules/pegawai/`.
- Internal API: tRPC typed API; upload multipart dan download binary memakai
  Route Handler khusus.
- Local persistence: PostgreSQL + Prisma untuk metadata aplikasi; table dan
  column physical name menggunakan lowercase `snake_case`.
- Shared UI: `component/ui/`; composite UI berulang: `component/widget/`.
- Theme: warna primary hijau, konfigurasi warna/font pada `const/theme.ts`, dan
  chart menggunakan ApexCharts.
- Security: server-only secret boundary, least privilege, redacted audit, dan
  security audit event terpisah dari audit operasi.

## Cara mengadaptasi PRD

Saat dipindahkan ke project lain, ganti nama produk, external system, actor,
permission, module, capability, field, status, dan acceptance criteria yang
bergantung pada API. Pertahankan pemisahan source of truth, scope release,
security boundary, dan evidence testing. Jangan membawa requirement SISTER ke
project lain tanpa kontrak external API yang sesuai.

Nama produk, PT target, base URL, dan workflow write pertama pada profile ini
masih perlu dikonfirmasi.

## 1. Ringkasan produk

Aplikasi ini adalah portal administrasi perguruan tinggi yang menyediakan
akses terkontrol ke data SISTER melalui Web Service PT. Aplikasi membantu
operator membaca data SDM, aktivitas tridharma, BKD, dokumen, dan status ajuan
dalam antarmuka kerja yang konsisten.

Aplikasi bukan pengganti SISTER dan bukan layanan self-service dosen secara
default. SISTER tetap menjadi sistem utama yang menyimpan dan memverifikasi
data.

## 2. Latar belakang dan masalah

API SISTER menyediakan banyak endpoint dengan format, referensi, role, dan
aturan mutation yang berbeda. Tanpa lapisan aplikasi:

- operator harus memahami endpoint dan ID referensi secara langsung;
- credential API berisiko tersebar ke client;
- update dapat salah karena PUT membutuhkan payload lengkap;
- upload dokumen dan attach data utama dapat tidak sinkron;
- response 204 WS-BASIC mudah salah dipahami sebagai data final;
- data read-only dapat keliru diberi tombol edit;
- error 400, 401, 403, 404, 405, 409, dan 500 perlu diterjemahkan ke UX.

Produk menyelesaikan masalah tersebut melalui tRPC BFF server-side, form tervalidasi,
selector referensi, audit operasi, status ajuan, dan rekonsiliasi.

## 3. Tujuan produk

### Tujuan utama

1. Menyediakan pencarian dan detail SDM berbasis id_sdm.
2. Menampilkan data SISTER dengan state UI yang jelas.
3. Menyediakan akses BKD dan data aktivitas yang tersedia pada API.
4. Menyediakan perubahan data secara aman sesuai role WS-BASIC atau WS-PRO.
5. Menangani dokumen dan status ajuan tanpa menghilangkan konteks SISTER.
6. Menyediakan jejak audit untuk operasi yang dilakukan melalui aplikasi.

### Indikator keberhasilan

- operator dapat menemukan SDM tanpa mengetik UUID manual;
- halaman detail menampilkan data dari endpoint yang benar;
- form hanya menampilkan field dan option yang didukung endpoint;
- update tidak menghapus field atau dokumen yang tidak sedang diedit;
- user dapat membedakan data master, ajuan, empty state, error, dan data stale;
- token SISTER tidak pernah terlihat pada browser atau log;
- operasi yang hasilnya tidak pasti masuk ke daftar NEEDS_REVIEW;
- setiap fitur yang dirilis memiliki bukti test yang sesuai.

## 4. Non-goals

Produk tidak mencakup:

- scraping atau otomasi klik pada website SISTER;
- akses database internal SISTER;
- penyimpanan lokal sebagai source of truth;
- login dosen individual tanpa kontrak SSO/API resmi;
- perubahan data pada domain yang dinyatakan read-only;
- sinkronisasi seluruh 236 endpoint pada release pertama;
- webhook atau callback yang tidak tersedia pada dokumentasi;
- OCR, AI, enrichment, payment, atau workflow kepegawaian di luar API;
- analytics yang membutuhkan field yang tidak tersedia dari response SISTER.

## 5. Pengguna dan permission

### 5.1 Operator PT

Mencari SDM, membaca detail, menggunakan form, mengunggah dokumen, dan
menjalankan mutation yang diizinkan credential SISTER.

### 5.2 Reviewer atau verifikator lokal

Membaca data, melihat operasi, dan memantau ajuan. Hak mutation dapat
dinonaktifkan secara default.

### 5.3 Auditor atau viewer

Membaca data yang diizinkan dan melihat status/audit yang tidak sensitif.

### 5.4 Administrator aplikasi

Mengatur user lokal, permission, integrasi, health check, dan secret reference.
Administrator aplikasi tidak otomatis memiliki role WS-PRO.

### 5.5 Dosen individual

Bukan target default API ini karena PDF menyatakan Web Service PT ditujukan
untuk developer/admin perguruan tinggi dan dapat mengakses data seluruh dosen
pada PT. Dosen individual hanya dapat ditambahkan jika ada keputusan produk dan
mekanisme SSO/authorization resmi.

## 6. Model source of truth

| Data | Pemilik utama | Penyimpanan aplikasi |
| --- | --- | --- |
| profil dan data SDM | SISTER | fetch live atau cache terbatas |
| BKD dan aktivitas | SISTER/PDDIKTI sesuai endpoint | cache bila diperlukan |
| referensi | SISTER | cache disposable |
| dokumen | SISTER | metadata operasi, binary tidak default |
| status ajuan | SISTER | tampilan live/cache |
| user aplikasi | aplikasi | database lokal |
| audit request | aplikasi | database lokal |
| status rekonsiliasi | aplikasi | database lokal |
| security audit event | aplikasi/security owner | database/log sink terbatas |

### 6.1 Konvensi implementasi repository

Requirement teknis berikut berlaku untuk project `sister-integrated`:

- setiap module memiliki satu folder pusat, misalnya `src/modules/pegawai/`;
- route Next.js di `app/` hanya menjadi entry point tipis;
- procedure JSON internal menggunakan tRPC dan divalidasi dengan Zod;
- Prisma hanya mengelola tabel metadata lokal melalui `prisma/schema.prisma`;
- nama tabel dan kolom fisik database selalu lowercase `snake_case`;
- component dasar berada di `component/ui/`;
- UI gabungan yang digunakan berulang disebut widget dan berada di
  `component/widget/` atau `<module>/widget/`;
- warna, font, dan chart palette diambil dari `const/theme.ts`;
- chart yang dipakai harus menggunakan `ReportChart` berbasis ApexCharts.

Konvensi ini adalah implementation profile, bukan requirement bisnis. Jika
project lain sudah memiliki framework atau API boundary berbeda, adaptasikan
lokasinya tanpa mengubah acceptance criteria yang memang relevan.

## 7. Ruang lingkup capability

### 7.1 Release pertama: foundation dan read

- konfigurasi integration instance;
- health check dan status role;
- autentikasi server ke /authorize;
- pencarian SDM melalui /referensi/sdm;
- informasi PT melalui /referensi/profil_pt;
- pilihan semester melalui /referensi/semester;
- detail profil, kepegawaian, pendidikan, penugasan, dan data relevan yang
  dipilih stakeholder;
- BKD akhir dan aktivitas BKD berdasarkan semester;
- referensi bertingkat yang dipakai pada halaman;
- audit read yang perlu untuk diagnosis tanpa menyimpan PII penuh.

### 7.2 Release pertama: UI

- login aplikasi atau auth boundary sesuai keputusan;
- dashboard ringkas berbasis data API yang benar-benar tersedia;
- halaman pencarian SDM;
- halaman detail SDM;
- tabs untuk kelompok data yang masih memiliki konteks SDM yang sama;
- tabel dengan filter, pagination jika endpoint mendukung, empty/loading/error;
- status integrasi dan permission state.

### 7.3 Release kedua: satu workflow write

Workflow write pertama harus dipilih stakeholder. Kandidatnya dapat berupa
satu domain CRUD atau satu domain ajuan yang memang dibutuhkan PT.

Persyaratan:

- endpoint dan payload terverifikasi dari YAML/UAT;
- role WS-BASIC atau WS-PRO tersedia;
- form menggunakan referensi resmi;
- PUT menggunakan full payload;
- dokumen dan status ajuan ditangani bila domain membutuhkannya;
- operasi tercatat;
- hasil eksternal di-refresh;
- konflik dan outcome tidak pasti dapat direkonsiliasi.

### 7.4 Release berikutnya

Perluasan dapat mencakup domain berikut setelah ada acceptance criteria:

- anggota profesi, bahan ajar, beasiswa, detasering, dan diklat;
- inpassing, jabatan fungsional, jabatan struktural, dan kepangkatan;
- kekayaan intelektual, publikasi, penelitian, dan pengabdian;
- kesejahteraan, kolaborator eksternal, orasi ilmiah, pembicara;
- pengelola jurnal, penghargaan, penunjang lain, dan riwayat pekerjaan;
- sertifikasi profesi, nilai tes, tugas tambahan, tunjangan, visiting scientist;
- kelas kuliah dan dokumen tautan.

Bimbing dosen, bimbingan mahasiswa, pengajaran, dan pengujian mahasiswa perlu
keputusan khusus karena PDF menyatakan data dasarnya berasal dari PDDIKTI dan
tidak dapat diubah, sementara beberapa nested bidang_ilmu memiliki PUT.

## 8. Functional requirements

### FR-01 Integration setup

Admin dapat mengatur satu instance SISTER yang sudah diverifikasi:

- base URL;
- API version;
- credential reference;
- expected role;
- status aktif.

Password dan token tidak pernah ditampilkan kembali.

Acceptance:

- konfigurasi invalid ditolak;
- health check hanya menampilkan status aman;
- response authorize tidak disimpan sebagai credential browser;
- role WS-BASIC/WS-PRO terlihat sebagai capability integrasi.

### FR-02 Application authentication

User harus memiliki session aplikasi sebelum mengakses halaman privat. Detail
implementasi login dapat memakai auth lokal atau SSO yang telah disetujui.

Acceptance:

- user tanpa session diarahkan ke login;
- permission diperiksa pada UI dan tRPC server;
- role lokal tidak disamakan dengan role SISTER;
- logout menghapus session lokal.

### FR-03 Search SDM

Operator dapat mencari SDM menggunakan nama, NIDN, NIP, NUPTK, atau parameter
yang disetujui dari /referensi/sdm.

Acceptance:

- hasil menampilkan id_sdm, nama, identifier yang tersedia, status, dan jenis;
- user memilih hasil, bukan memasukkan UUID arbitrary;
- syarat minimal tiga karakter untuk kombinasi id_sp dan nama diberlakukan;
- hasil kosong berbeda dari error;
- pemilihan SDM menjadi context untuk halaman detail.

Implementasi lokal boleh menulis ringkasan hasil ke `sister_sdm_index_cache`
untuk mempercepat lookup detail. Cache harus terikat pada `integration_id`,
memiliki TTL, hanya memuat field ringkasan yang diizinkan, dan tidak boleh
ditampilkan sebagai live bila stale. Detail profil dan kepegawaian tetap
memerlukan pembacaan capability SISTER yang sesuai.

### FR-04 SDM overview

Sistem menampilkan overview dan link/tab ke endpoint data pokok, pendidikan,
penugasan, dan data lain yang masuk release.

Acceptance:

- setiap tab memiliki route yang dapat dibuka langsung;
- data yang tidak tersedia menampilkan empty atau unavailable state;
- NIK, NPWP, kontak, dan alamat dilindungi permission;
- label berasal dari domain SISTER, bukan istilah internal yang menyesatkan.

### FR-05 BKD

User dapat memilih semester dan melihat:

- laporan akhir BKD;
- pendidikan;
- ajar;
- tunjang;
- pengmas;
- penelitian.

Acceptance:

- id_smt berasal dari /referensi/semester;
- request selalu menggunakan id_sdm yang dipilih;
- angka SKS dan nilai memakai format numerik yang aman;
- tidak ada aksi edit pada endpoint BKD yang terdokumentasi GET-only.

### FR-06 Reference options

Form hanya boleh menggunakan option dari endpoint referensi yang relevan,
termasuk jenis dokumen, bidang studi, kategori kegiatan, wilayah, unit kerja,
mahasiswa PDDIKTI, dan semester.

Acceptance:

- dependent selector menunggu parent ID;
- label dan ID disimpan bersama pilihan;
- cache diberi timestamp;
- error refresh referensi tidak disamakan dengan option kosong.

### FR-07 Data mutation

Sistem hanya menyediakan mutation pada endpoint yang masuk release dan
didukung role.

Acceptance:

- create memakai payload endpoint khusus;
- update membaca detail lengkap sebelum PUT;
- field optional dikirim sesuai kontrak;
- dokumen lama dipertahankan;
- delete memiliki konfirmasi dan permission;
- response 204 tidak dianggap sebagai JSON atau data master baru;
- WS-BASIC menampilkan status ajuan;
- WS-PRO menampilkan hasil direct update sesuai response.

### FR-08 Document handling

User dapat mengunggah file atau menyimpan tautan sesuai kontrak endpoint.

Acceptance:

- file divalidasi sebelum dikirim;
- upload dilakukan ke /dokumen;
- ID dokumen di-attach ke resource utama;
- download binary diteruskan melalui server;
- kegagalan resource setelah upload tercatat;
- aplikasi tidak menghapus orphan document otomatis tanpa kebijakan.

### FR-09 Ajuan

User berwenang dapat melihat ajuan berdasarkan resource.

Acceptance:

- status ajuan ditampilkan sebagai teks;
- jenis Baru, Ubah, dan Hapus terlihat;
- tanggal dan keterangan ditampilkan;
- detail perubahan dan dokumen ditampilkan bila tersedia;
- ajuan tidak dicampur sebagai data master final.

### FR-10 Operation and reconciliation

Setiap mutation memiliki operation ID lokal.

Acceptance:

- method, path template, resource, actor, response status, dan error tercatat;
- token dan PII penuh tidak tercatat;
- timeout ditandai NEEDS_REVIEW jika hasil tidak dapat dipastikan;
- user dapat memeriksa ulang berdasarkan external ID atau fingerprint;
- aplikasi tidak melakukan blind retry mutation.

### FR-11 Security dan audit

Sistem wajib menerapkan kontrol security pada browser, route/tRPC, session,
authorization, validation, external adapter, Prisma/database, file, logging,
dan deployment. Sistem juga menyediakan security audit event terpisah dari
audit operasi bisnis.

Acceptance:

- credential dan bearer token tidak pernah muncul di browser, storage, URL,
  response, log, cache, atau error;
- setiap query/mutation memeriksa session, role lokal, resource, dan
  integration/PT di server;
- input JSON, query, identifier, URL, dan file divalidasi;
- mutation menggunakan CSRF/CORS/rate limit/body limit sesuai boundary;
- file upload/download memeriksa tipe, ukuran, ownership, dan permission;
- event login/session, authorization denied, CSRF/rate limit, input/file
  rejection, secret failure, dan perubahan permission tercatat secara redacted;
- security audit dapat ditelusuri dengan request ID dan aksesnya dibatasi;
- release report membedakan `PASS`, `PARTIAL`, `FAIL`, dan `UNVERIFIED`;
- tidak ada klaim security production tanpa evidence konfigurasi/UAT/audit yang
  relevan.

## 9. User flows

### Flow A: membaca detail SDM

    Login aplikasi
      -> Search SDM
      -> pilih hasil
      -> buka /sdm/{id}
      -> pilih tab profil, kepegawaian, pendidikan, atau BKD
      -> tRPC BFF mengambil data SISTER
      -> tampilkan data dan source timestamp

### Flow B: mengajukan perubahan WS-BASIC

    Buka detail
      -> pilih aksi yang diizinkan
      -> form dan referensi
      -> validasi
      -> upload dokumen bila perlu
      -> submit full payload
      -> response 204
      -> tampilkan status Ajuan
      -> baca endpoint /ajuan
      -> monitor status

### Flow C: direct update WS-PRO

    Buka detail
      -> edit field
      -> ambil detail lengkap
      -> merge perubahan
      -> PUT
      -> response 200 detail
      -> re-fetch
      -> catat audit

### Flow D: hasil request tidak pasti

    Submit mutation
      -> network timeout
      -> operation NEEDS_REVIEW
      -> jangan retry otomatis
      -> cek list/detail SISTER
      -> operator memilih reconcile atau menutup operasi

## 10. UX dan design system

Implementasi UI harus mengikuti design-system.md:

- sidebar desktop 224px;
- page header berisi breadcrumb dan action group;
- section memakai whitespace/divider, bukan card bertingkat;
- tabel memiliki satu outer border dan scroll lokal;
- system sans, body 14/22, heading maksimum weight 600;
- spacing scale 4, 8, 12, 16, 24, 32, 48, 64 pixel;
- input/button 40 pixel, target mobile minimal 44 pixel;
- select custom dengan keyboard, typeahead, selected, disabled, dan collision;
- icon-only button memiliki aria-label dan tooltip;
- dialog memiliki focus containment dan close behavior;
- status selalu memakai teks selain warna;
- loading, empty, error, success, disabled, forbidden, dan stale dibedakan;
- route harus bertahan pada refresh, back, dan forward;
- test light/dark pada 1280, 1024, 390, dan 320 pixel.

Page pattern yang disarankan:

- Dashboard: KPI yang benar-benar berasal dari response, tanpa mengulang daftar;
- Chart dashboard, bila diperlukan, wajib menggunakan `ReportChart` berbasis
  ApexCharts dan hanya memvisualisasikan angka agregat yang tersedia dari
  response SISTER;
- List SDM: search, filter, table, dan pagination bila API mendukung;
- Detail SDM: breadcrumb, summary seperlunya, tabs;
- Form: field group, error dekat field, submit/cancel;
- Ajuan: list status dan detail perubahan;
- Dokumen: metadata, upload, download.

## 11. Non-functional requirements

### Security

- seluruh security requirement mengikuti [security.md](./security.md);
- credential, bearer token, cookie, dan secret server-only;
- HTTPS, Secure/HttpOnly/SameSite cookie, CSP, security headers, dan default-deny
  CORS diterapkan sesuai deployment;
- session memiliki expiry, logout, revocation, rotation, dan brute-force control;
- permission ditegakkan di tRPC server dan Route Handler, bukan hanya UI;
- input/output, error, identifier, URL, dan file divalidasi serta di-redact;
- allowlist base URL dan outbound network mencegah SSRF;
- CSRF protection diterapkan pada mutation berbasis cookie;
- upload memakai MIME/content, extension, size, filename, dan ownership control;
- Prisma memakai DB least privilege; PII dan cache mengikuti minimization,
  encryption, backup, dan retention policy;
- `sister_operation` dan `security_audit_event` redacted, restricted, dan dapat
  ditelusuri dengan correlation ID;
- security audit membedakan `PASS`, `PARTIAL`, `FAIL`, dan `UNVERIFIED`.

### Data integrity

- request mengikuti field endpoint secara tepat;
- tanggal dikonversi ke yyyy-mm-dd;
- ID referensi berasal dari SISTER;
- PUT selalu full payload;
- document ID lama tidak hilang karena form parsial;
- data ajuan tidak disajikan sebagai data final.

### Reliability

- response 204 ditangani;
- 401, 403, 404, 405, 409, dan 500 memiliki state jelas;
- write timeout tidak blind retry;
- operation audit dan NEEDS_REVIEW tersedia;
- cache dapat stale tanpa menyamar sebagai live data.

### Accessibility

- keyboard usable;
- semantic label dan aria;
- focus ring;
- dialog focus return;
- table scope dan region label;
- tooltip bukan satu-satunya penjelasan aksi;
- kontras light/dark tervalidasi.

### Performance

Tidak ada SLA atau rate limit resmi pada PDF. Karena itu release awal tidak
boleh menjanjikan angka performa eksternal. Optimasi yang aman:

- cache referensi;
- query hanya setelah parameter valid;
- pagination hanya pada endpoint yang mendukung;
- lazy load tab detail;
- request deduplication di client;
- jangan mengunduh binary sebelum user meminta.

## 12. API capability matrix

| Capability | Endpoint utama | Release |
| --- | --- | --- |
| Auth API | POST /authorize | Foundation |
| Identitas PT | GET /referensi/profil_pt | MVP |
| Cari SDM | GET /referensi/sdm | MVP |
| Semester | GET /referensi/semester | MVP |
| Data profil | GET /data_pribadi/profil/{id_sdm} | MVP |
| Kepegawaian | GET /data_pribadi/kepegawaian/{id_sdm} | MVP |
| Pendidikan | GET /pendidikan_formal, detail | MVP |
| BKD | GET /bkd/* | MVP |
| Dokumen | GET metadata dan download | MVP/read |
| Ajuan | resource /ajuan | Release write |
| Mutation | resource POST/PUT/DELETE | Satu workflow dahulu |
| Aktivitas tridharma | penelitian, pengabdian, publikasi, dan lainnya | Setelah MVP |
| Read-only PDDIKTI | bimbingan, pengajaran, pengujian | Setelah keputusan nested PUT |

## 13. Open decisions

Sebelum coding domain, stakeholder harus menetapkan:

1. Perguruan tinggi dan instance SISTER target.
2. Base URL API.
3. YAML resmi dan API version aktif.
4. Role credential: WS-BASIC atau WS-PRO.
5. Auth user aplikasi dan apakah SSO eksternal diperlukan.
6. Workflow write pertama.
7. Apakah data detail sensitif boleh dicache.
8. Retention audit dan metadata dokumen.
9. User lokal dan pembagian permission.
10. Environment UAT dan production.
11. Auth/session provider, cookie policy, CSRF strategy, dan MFA bila diperlukan.
12. Secret manager, log sink, security reviewer, alert owner, dan incident
    contact.
13. Security audit scope, evidence level, retention, accepted risk, dan jadwal
    review.
14. Encryption, backup/restore, database runtime privilege, rate limit, dan
    file malware/DLP scanner.

## 14. Release acceptance

Release dapat diterima jika:

- semua open decision yang diperlukan untuk release sudah ditutup;
- endpoint yang dipakai memiliki kontrak YAML/UAT;
- read flow SDM dan BKD berhasil pada UAT;
- UI mengikuti design system;
- tRPC BFF tidak membocorkan token;
- role WS-BASIC/WS-PRO ditampilkan benar;
- mutation pertama memiliki full payload, audit, dan rekonsiliasi;
- dokumen dan 204/409/timeout diuji bila relevan;
- security audit untuk seluruh layer memiliki status dan evidence yang jelas;
- tidak ada Critical/High security finding tanpa keputusan owner, due date,
  atau compensating control;
- security, unit, contract, integration, dan browser evidence dipisahkan;
- tidak ada fitur di luar endpoint SISTER yang masuk release tanpa keputusan
  produk baru.

## 15. Checklist adaptasi ke project lain

Sebelum PRD ini dipakai pada repository lain, AI atau developer harus:

1. membaca struktur repository, framework, package manager/runner, database, auth, dan
   kontrak API yang sudah ada;
2. mengganti `Project Profile` dan menghapus capability yang tidak didukung
   external system baru;
3. memetakan actor dan permission ke istilah project tujuan;
4. menulis ulang source-of-truth table berdasarkan owner data yang sebenarnya;
5. menetapkan module awal, release boundary, dan workflow write pertama;
6. mempertahankan acceptance criteria untuk loading, empty, error, permission,
   audit, security, dan rekonsiliasi bila relevan;
7. mengganti security profile, asset, threat model, dan audit owner di
   `security.md`;
8. menyinkronkan perubahan dengan `schema.md`, `architecture.md`,
   `design-system.md`, `todo.md`, dan `security.md` sebelum implementasi.

Untuk `sister-integrated`, seluruh requirement SISTER, role WS-BASIC/WS-PRO,
status ajuan, aturan PUT penuh, dokumen, dan batas read-only tetap berlaku
selama belum ada keputusan stakeholder yang menggantinya.
