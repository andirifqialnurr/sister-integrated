# Portable Security Contract dan Security Audit Plan

Status dokumen: portable base + project profile

Dokumen ini adalah baseline security untuk aplikasi yang memiliki autentikasi,
data sensitif, database lokal, dan koneksi ke external API. Dokumen ini bukan
bukti bahwa aplikasi sudah aman. Setiap kontrol harus dibuktikan melalui source
review, test, konfigurasi, UAT, atau audit yang sesuai.

## Project Profile: `sister-integrated`

- Produk: portal administrasi perguruan tinggi yang mengakses SISTER Web Service
  PT melalui server aplikasi.
- Asset utama: session user, credential SISTER, bearer token, data SDM/PII,
  dokumen, database metadata, audit operasi, dan audit security.
- Web boundary: Next.js App Router dengan tRPC sebagai internal API JSON.
- Repository runner/runtime: Bun 1.3.x dengan `bun.lock` dan `bunfig.toml`;
  command dan audit lokal dijalankan melalui `bun run`/`bunx`.
- Persistence: PostgreSQL melalui Prisma; nama tabel dan kolom fisik lowercase
  `snake_case`.
- External boundary: SISTER API tidak pernah dipanggil langsung oleh browser.
- File boundary: upload multipart dan download binary menggunakan Route Handler
  capability yang eksplisit.
- UI boundary: primitive pada `src/component/ui/`, widget pada
  `src/component/widget/`, warna/font pada `src/const/theme.ts`.
- Profile-specific details: credential `/authorize`, role WS-BASIC/WS-PRO,
  token TTL 60 menit, PII SISTER, dan 236 endpoint dalam 39 domain.

Jika dipindahkan ke project lain, ganti external system, asset, role, exposure,
framework, database, dan retention policy pada profile ini. Pertahankan prinsip
defense in depth, fail closed, least privilege, redaction, dan evidence audit.

## Cara menggunakan

1. Baca repository tujuan, deployment, auth, database, API, dan test yang sudah
   ada sebelum menetapkan kontrol sebagai implemented.
2. Tandai setiap pernyataan sebagai `Required`, `Observed`, `Inferred`, atau
   `Unverified`.
3. Pilih kontrol berdasarkan asset dan threat yang benar-benar ada; jangan
   menyalin checklist yang tidak relevan.
4. Hubungkan temuan audit ke invariant, owner, evidence, severity, dan status
   perbaikannya.
5. Jangan mencatat secret, token, password, binary, atau PII penuh di dokumen,
   log, issue, screenshot, atau evidence.

## 1. Security boundary dan asset

### 1.1 Trust boundary

    Browser / client tidak tepercaya
      -> HTTPS dan local application session
      -> Next.js route dan tRPC context
      -> permission serta module use case
      -> Prisma/PostgreSQL atau SISTER adapter
      -> SISTER Web Service instance PT

Browser, query parameter, form, file, tautan, header, dan response external
dianggap input yang perlu divalidasi. Database dan secret manager adalah boundary
server-side; aksesnya tidak boleh diberikan ke component atau client bundle.

### 1.2 Asset dan klasifikasi

| Asset | Klasifikasi minimum | Kontrol utama |
| --- | --- | --- |
| Session aplikasi | confidential | Secure/HttpOnly cookie, expiry, rotation, revocation |
| Username/password/id_pengguna SISTER | secret | secret manager, server-only, rotation |
| Bearer token SISTER | secret | memory/TTL cache, redaction, tidak ke browser |
| NIK, NPWP, alamat, kontak, data keluarga | restricted PII | least privilege, minimisasi, audit akses |
| Data SDM dan aktivitas | confidential | permission, integration isolation, stale labeling |
| File dan link dokumen | confidential/untrusted | validation, safe delivery, access control |
| Database metadata | confidential | DB least privilege, encryption, backup/restore |
| `sister_operation` | audit bisnis | append-oriented, correlation ID, redaction |
| `security_audit_event` | security audit | restricted read, retention, tamper detection |

## 2. Threat model

Threat model portable minimum:

- attacker tanpa session mencoba mengakses route privat;
- user valid dengan role rendah mencoba IDOR, privilege escalation, atau akses
  lintas integration/PT;
- operator memasukkan field, URL, file, atau identifier yang berbahaya;
- credential, token, PII, atau detail error bocor melalui browser, log, cache,
  backup, atau exception;
- request ke external system diarahkan ke host internal melalui SSRF atau proxy
  generic;
- file berbahaya, file palsu, path traversal, atau content type yang menipu;
- CSRF/XSS memicu atau memanipulasi mutation;
- timeout, replay, atau retry ganda menyebabkan mutation external tidak konsisten;
- dependency, image, secret CI, reverse proxy, atau konfigurasi deployment
  disusupi;
- admin atau operator yang sah menyalahgunakan akses tanpa jejak audit yang
  cukup.

Untuk profile SISTER, risiko paling penting adalah kebocoran credential/token,
akses data SDM lintas PT, mutation dengan role yang salah, PUT partial yang
menghapus data, upload dokumen yang salah attach, dan status 204 yang salah
diinterpretasikan.

## 3. Security invariants

Invariant berikut harus dapat diuji dan berlaku pada semua implementation:

| ID | Invariant |
| --- | --- |
| SEC-01 | Browser tidak pernah menerima atau menyimpan credential/bearer token external. |
| SEC-02 | Setiap request privat memiliki session valid dan authorization server-side. |
| SEC-03 | Authorization memeriksa actor, operation, resource, dan integration/PT final. |
| SEC-04 | Tidak ada route atau tRPC procedure generic yang menerima arbitrary path. |
| SEC-05 | Input JSON, query, header, identifier, URL, dan file divalidasi dengan allowlist/schema. |
| SEC-06 | Output, error, log, cache, dan audit tidak membocorkan secret atau PII berlebihan. |
| SEC-07 | Mutation external diaudit, memiliki correlation ID, dan tidak blind retry. |
| SEC-08 | Unknown auth, permission, integration, atau outcome mutation diperlakukan fail closed/`NEEDS_REVIEW`. |
| SEC-09 | File tidak dipercaya hanya dari extension atau client-provided MIME. |
| SEC-10 | Query database menggunakan Prisma/parameterized query dan DB role least privilege. |
| SEC-11 | Security event penting masuk ke audit security yang dapat dibaca oleh owner terbatas. |
| SEC-12 | Control hanya disebut PASS jika evidence yang tepat benar-benar tersedia. |

## 4. Kontrol per layer

### 4.1 Browser dan UI

- Gunakan HTTPS untuk seluruh session.
- Simpan session hanya melalui mekanisme cookie server yang aman; jangan simpan
  token SISTER pada `localStorage`, `sessionStorage`, URL, atau state global yang
  terkirim ke client.
- Jangan render PII hanya karena data tersedia pada response; kontrol visibility
  berdasarkan permission dan kebutuhan halaman.
- Escape text dan jangan merender HTML dari external API tanpa sanitizer yang
  disetujui dan konteks yang aman.
- Link dokumen external memakai `https` yang tervalidasi; jangan membuat
  `javascript:`, `data:`, atau redirect arbitrary.
- Tombol mutation menampilkan target yang jelas, confirmation bila berisiko,
  disabled/loading state segera setelah submit, dan tidak mengulang click.
- Error UI menampilkan pesan aman dan correlation ID, bukan stack trace,
  credential, raw header, atau response penuh.
- Status permission, stale, forbidden, dan audit ditampilkan dengan teks serta
  tidak bergantung pada warna saja.
- Gunakan CSP, frame protection, Referrer-Policy, Permissions-Policy, dan
  security headers yang sesuai deployment.

### 4.2 Next.js route dan tRPC boundary

- Semua procedure memakai input schema Zod dan output DTO yang eksplisit.
- `context` memuat session, actor, integration context, request ID, dan policy
  yang diperlukan; context tidak memuat secret untuk dikirim ke client.
- Permission diperiksa kembali di server untuk setiap query sensitif dan
  mutation. UI check hanya bantuan UX.
- Procedure dikelompokkan per capability/module, misalnya `pegawai.search`;
  jangan membuat `proxy(path)` atau procedure yang meneruskan arbitrary request.
- Terapkan body size limit, timeout, rate limit, dan concurrency limit pada
  route sesuai risiko dan kapasitas deployment.
- Jika session berbasis cookie, lindungi mutation dari CSRF menggunakan
  SameSite yang tepat, origin/fetch metadata check, dan CSRF token untuk alur
  yang memerlukannya.
- CORS default deny. Cross-origin hanya dibuka untuk origin, method, header,
  dan capability yang terdokumentasi.
- Map error ke kategori aman; log detail hanya di server dengan redaction.
- File multipart/binary memiliki route terpisah dari procedure JSON tRPC.

### 4.3 Authentication dan session

- Gunakan provider auth yang terawat atau implementasi framework yang sudah
  diaudit; jangan membuat password hashing/session protocol sendiri tanpa alasan.
- Session ID harus random, meaningless, server-bound, dan tidak memuat PII.
- Cookie produksi menggunakan `Secure`, `HttpOnly`, dan `SameSite` yang sesuai;
  session memiliki idle timeout, absolute timeout, logout, revocation, dan
  rotation setelah perubahan privilege atau re-authentication.
- Login gagal, login berhasil, logout, expiry, revocation, dan perubahan role
  dicatat sebagai security event tanpa password/token.
- Rate limit dan lockout harus mencegah brute force tanpa membuat denial of
  service mudah dilakukan oleh attacker.
- Credential SISTER tidak boleh dipakai sebagai password login user aplikasi.
- Untuk profile SISTER, POST `/authorize` hanya dipanggil dari server dengan
  `username`, `password`, dan `id_pengguna` dari secret reference.

### 4.4 Authorization dan module isolation

- Terapkan least privilege untuk role lokal `ADMIN`, `OPERATOR`, `REVIEWER`,
  dan `VIEWER`.
- Bedakan role lokal dari role external WS-BASIC/WS-PRO.
- Periksa resource ownership, `id_sdm`, integration/PT, dan operation sebelum
  membaca atau mengubah data.
- Jangan mempercayai ID yang berasal dari URL; resolve ID melalui context dan
  repository/adapter yang benar.
- Capability read-only tidak boleh memiliki mutation procedure atau tombol UI.
- Admin aplikasi tidak otomatis berhak mengubah data external.
- Component dan widget tidak boleh melewati service/use case untuk mengakses
  Prisma atau SISTER.
- Perubahan permission, role, integration, dan secret reference harus diaudit
  serta membutuhkan re-authentication bila risikonya tinggi.

### 4.5 Input validation, serialization, dan error

- Validasi panjang, tipe, enum, format tanggal, number range, array length,
  identifier, content type, dan nested object di server.
- Gunakan allowlist untuk method, endpoint capability, host, protocol, dan
  reference ID; denylist bukan kontrol utama.
- Jangan menggabungkan string user menjadi SQL, command, path filesystem, HTML,
  header, atau URL tanpa API/context encoding yang benar.
- Bedakan `null`, `0`, `[]`, missing field, empty result, dan error sesuai
  kontrak external API.
- Error response ke browser tidak boleh mengungkap keberadaan secret, detail
  infrastructure, stack trace, query, credential, atau PII.
- Pastikan serializer tidak mengirim field Prisma yang tidak diperlukan.

### 4.6 External API dan outbound network

- Base URL external disimpan dalam konfigurasi tervalidasi dan allowlist; jangan
  menerima host arbitrary dari browser.
- Hanya gunakan scheme dan port yang disetujui, validasi DNS/IP, cegah private
  network/metadata endpoint, dan matikan redirect outbound yang tidak perlu.
- Header Authorization dibangun di adapter server dan tidak masuk log.
- Token SISTER TTL 60 menit dikelola server-side; refresh/reauthorize dibatasi
  dan tidak dilakukan tanpa kontrol.
- Client memvalidasi status, Content-Type, ukuran response, dan schema sebelum
  meneruskan data ke UI.
- POST/PUT/DELETE tidak otomatis diulang ketika hasil external belum diketahui.
- Untuk profile SISTER, scope request harus terikat pada PT pemilik token dan
  role WS-BASIC/WS-PRO yang sudah dikonfirmasi.

### 4.7 Prisma dan PostgreSQL

- Prisma hanya mengelola metadata lokal, bukan database internal SISTER.
- Tabel dan kolom fisik selalu lowercase `snake_case`; migration direview dan
  dapat dijalankan pada database kosong.
- Application DB user tidak memiliki hak DDL atau akses superuser pada runtime.
- Jangan memakai raw SQL; bila benar-benar diperlukan, gunakan parameterized
  query, review, dan test khusus.
- Terapkan foreign key, unique constraint, check constraint, dan index untuk
  isolation/audit yang memang dibutuhkan.
- PII disimpan seminimal mungkin; field JSON harus ter-redact dan memiliki
  retention policy.
- Backup terenkripsi, akses backup dibatasi, restore diuji, dan log database
  tidak memuat credential atau payload sensitif penuh.
- `security_audit_event` dan audit operation tidak boleh dapat diubah oleh
  user aplikasi biasa.

### 4.8 File dan dokumen

- Terapkan size limit, extension allowlist, MIME/content sniffing, filename
  normalization, dan random storage key.
- Jangan memakai nama file user sebagai path, jangan simpan file executable di
  web root, dan gunakan `Content-Disposition: attachment` bila sesuai.
- Scan malware/DLP dipakai bila risiko dan infrastructure mendukung; ketiadaan
  scanner harus dicatat sebagai limitation, bukan dianggap aman.
- Download selalu memeriksa session, permission, resource ownership, dan
  document ID; jangan menjadi open file proxy.
- Link external tidak di-fetch server secara bebas. Jika harus di-fetch,
  terapkan SSRF controls yang sama dengan outbound API.
- Upload yang ditolak, attachment yang gagal, orphan document, dan download
  sensitif dicatat sesuai kebijakan tanpa menyimpan binary di audit.

### 4.9 Logging dan audit

Pisahkan dua jenis audit:

- `sister_operation`: audit request bisnis/integrasi, status external, payload
  fingerprint, dan rekonsiliasi.
- `security_audit_event`: audit authentication, authorization, policy, secret,
  suspicious request, dan perubahan konfigurasi security.

- Log terstruktur memakai request/correlation ID, actor internal bila ada,
  procedure/path template, outcome, dan timestamp.
- Redact password, bearer token, cookie, Authorization header, full PII,
  binary, raw multipart, dan secret environment sebelum log dibuat.
- Security audit bersifat append-oriented; akses baca dibatasi dan perubahan
  atau penghapusan harus terdeteksi.
- Monitoring harus dapat mendeteksi rangkaian login gagal, authorization denied,
  rate limit, CSRF failure, upload rejected, credential failure, dan anomali
  integration.
- Retention, export, alert owner, time synchronization, dan incident handoff
  ditetapkan sebelum production.

## 5. Model `security_audit_event`

Model ini adalah tambahan untuk schema lokal project. Nama fisik tabel wajib
`security_audit_event` dan seluruh kolom fisik lowercase `snake_case`.

| Field | Tipe | Aturan |
| --- | --- | --- |
| id | UUID | primary key lokal |
| event_type | string/enum | login, logout, authz, csrf, rate limit, upload, secret, config, anomaly |
| severity | enum | INFO, LOW, MEDIUM, HIGH, CRITICAL |
| outcome | enum | SUCCESS, DENIED, FAILED, BLOCKED, DETECTED |
| actor_user_id | UUID atau null | user lokal bila diketahui |
| integration_id | UUID atau null | konteks external bila relevan |
| request_id | string | correlation ID tanpa secret |
| route_or_procedure | string | route/procedure template, bukan query mentah |
| target_type | string atau null | tipe resource |
| target_id | string atau null | ID yang sudah diizinkan untuk audit |
| source_ip_hash | string atau null | keyed hash bila dibutuhkan, bukan IP mentah default |
| user_agent_hash | string atau null | hash atau metadata minimal sesuai privacy policy |
| metadata_redacted_json | JSON atau null | metadata minim dan sudah redacted |
| created_at | timestamp | waktu server tersinkron |
| reviewed_at | timestamp atau null | waktu ditinjau |
| reviewed_by | UUID atau null | reviewer security |

Minimum events yang perlu dipertimbangkan:

- `login_success`, `login_failed`, `logout`, `session_expired`,
  `session_revoked`;
- `authorization_denied`, `csrf_failed`, `rate_limited`, `input_rejected`;
- `upload_rejected`, `download_denied`, `external_auth_failed`;
- `credential_reference_changed`, `secret_access_failed`, `role_changed`,
  `permission_changed`, `integration_disabled`;
- `suspicious_path`, `ssrf_blocked`, `unexpected_content_type`,
  `audit_configuration_changed`.

Event tidak boleh mencatat password, token, cookie, full URL query yang sensitif,
raw body, binary, atau PII penuh. Retention dan akses model ini harus lebih
ketat daripada audit operasional biasa.

## 6. Security audit program

### 6.1 Audit scope

Audit security minimum mencakup:

- threat model dan trust boundary;
- authentication dan session lifecycle;
- authorization/IDOR dan isolation integration/PT;
- tRPC procedure, Route Handler, CSRF, CORS, rate limit, dan error mapping;
- input/output validation, XSS, injection, SSRF, dan open redirect;
- upload/download dan document ownership;
- Prisma schema, migration, raw query, DB privilege, backup, dan restore;
- secret handling, token lifecycle, log redaction, dan audit event;
- dependency, container, CI/CD, HTTPS, headers, dan production configuration.

### 6.2 Evidence level

Gunakan label berikut dalam audit dan release report:

| Label | Arti |
| --- | --- |
| `SOURCE_REVIEWED` | control terlihat pada source yang tepat |
| `UNIT_TESTED` | behavior diuji dalam unit test |
| `CONTRACT_TESTED` | cocok dengan external contract/YAML |
| `INTEGRATION_TESTED` | diuji pada UAT/integration environment |
| `BROWSER_VERIFIED` | diuji melalui browser/device sesuai scope |
| `CONFIG_VERIFIED` | konfigurasi/deployment dibaca dan diverifikasi |
| `TOOL_REPORTED` | scanner/tool menghasilkan evidence yang dapat dibaca |
| `UNVERIFIED` | belum ada evidence yang cukup |

Test lokal atau keberadaan package tidak membuktikan security production.
Temuan dengan evidence tidak lengkap tetap dicatat sebagai gap atau limitation.

### 6.3 Gate audit

- Design gate: threat model, asset classification, invariants, owner, dan
  keputusan accepted risk tersedia.
- Pull request gate: secret scan, dependency audit, lint/typecheck, unit test,
  migration review, dan review perubahan permission/route.
- Pre-UAT gate: auth/session, authorization matrix, input abuse, file boundary,
  log redaction, audit readback, dan error behavior diuji.
- Release gate: HTTPS, cookie/header policy, secret injection, DB privilege,
  backup/restore, rate limit, alerting, incident runbook, dan security sign-off.
- Periodic audit: dependency, access review, secret rotation, audit retention,
  restore test, threat model refresh, dan regression test setelah perubahan API.

Audit hanya boleh berstatus `PASS` bila semua control wajib memiliki evidence
yang sesuai. Selain itu gunakan `PARTIAL`, `FAIL`, atau `UNVERIFIED` dengan gap,
owner, due date, dan compensating control.

## 7. Severity dan reportability

Sebuah security finding reportable bila memiliki kombinasi reachability, asset
atau authority yang terdampak, impact, dan control yang gagal. Prioritaskan:

- credential/token/secret exposure;
- cross-PT atau cross-user data access;
- unauthorized SISTER mutation atau privilege escalation;
- remote code execution, SSRF ke internal/metadata service, injection, XSS
  yang berdampak pada session, serta malicious file execution;
- audit/log tampering yang menghilangkan kemampuan investigation.

Temuan yang hanya berupa hardening umum tanpa entry point, impact, atau asset
yang relevan dicatat sebagai recommendation, bukan otomatis vulnerability.

## 8. Incident response minimum

Jika ada indikasi credential/token atau data sensitif bocor:

1. catat incident dan correlation ID tanpa menyalin secret;
2. blokir atau disable integration yang terdampak;
3. revoke/rotate credential SISTER dan session aplikasi yang relevan;
4. preserve security audit, operation audit, dan deployment evidence;
5. cek kemungkinan mutation/data access melalui rekonsiliasi SISTER;
6. patch root cause, tambahkan regression test, dan lakukan security review;
7. dokumentasikan scope, impact, notification, dan keputusan pemulihan.

Jangan menghapus audit atau retry mutation untuk “memperbaiki” situasi sebelum
status external diverifikasi.

## 9. Out of scope dan limitation

- Dokumen ini tidak mengklaim telah melakukan penetration test, DAST, review
  deployment, atau audit code karena source aplikasi belum tersedia.
- SSO, MFA, WAF, malware scanner, SIEM, dan secret manager tertentu belum boleh
  dianggap ada sebelum dipilih dan diverifikasi.
- Security audit tidak menggantikan UAT SISTER atau approval pemilik data.
- Accepted risk harus memiliki owner, alasan, expiry/review date, dan
  compensating control; `belum dikerjakan` bukan accepted risk.
- Fitur, endpoint, webhook, atau bulk sync di luar kontrak external API tidak
  boleh ditambahkan untuk memudahkan security bypass.

## 10. Adaptasi ke repository lain

1. Ganti `Project Profile` dan inventaris asset.
2. Petakan setiap trust boundary dan exposed surface pada repository tujuan.
3. Hapus control yang tidak relevan, tetapi jangan menghapus invariant tanpa
   keputusan owner dan alasan yang tercatat.
4. Sesuaikan model audit dengan privacy, retention, auth, dan observability
   platform tujuan.
5. Sinkronkan perubahan dengan `schema.md`, `architecture.md`, `prd.md`,
   `todo.md`, dan `design-system.md`.
6. Audit repository tujuan secara read-only terlebih dahulu sebelum menyebut
   control `Observed` atau `PASS`.

## Referensi security

- [OWASP ASVS](https://owasp.org/projects/asvs)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [OWASP SSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
- [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- [OWASP Next.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nextjs_Security_Cheat_Sheet.html)
- [SISTER Web Service PT.pdf](../SISTER%20Web%20Service%20PT.pdf)
