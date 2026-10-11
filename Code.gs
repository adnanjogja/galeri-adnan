// Tempel di Apps Script yang TERIKAT ke Google Sheet (Extensions > Apps Script).
// Deploy: Web app, Execute as "Me", Who has access "Anyone". Setiap ubah kode => Deploy > Manage deployments > New version.
// Kredensial admin TIDAK disimpan sebagai teks; hanya hash SHA-256 dari "gp|username|password".
const ADMIN_HASH = '7a68e5ae018ebeb2a22d69fa61eae91974118915506052f9c3df2b9df7458a8f';
const FOLDER = 'Galeri Pernikahan';
const DEF = {eyebrow:'The Wedding Of', title:'Adnan & Kartika', sub:'Abadikan momen indah bersama kami', loc:'', date:'',
  bgId:'', bgZoom:100, bgX:50, bgY:50, bgDark:55, hHeight:340};

const sheet = () => SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
const out = o => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
function folder() { const f = DriveApp.getFoldersByName(FOLDER); return f.hasNext() ? f.next() : DriveApp.createFolder(FOLDER); }
function cfg() { const p = PropertiesService.getScriptProperties().getProperty('cfg'); return Object.assign({}, DEF, p ? JSON.parse(p) : {}); }
function save(b64, mime, name) {
  const f = folder().createFile(Utilities.newBlob(Utilities.base64Decode(b64), mime, name));
  f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return f;
}
function trash(id) { try { if (id) DriveApp.getFileById(id).setTrashed(true); } catch (e) {} }
function photos(withIp) {
  return sheet().getDataRange().getValues().slice(1).filter(r => r[3]).map(r => {
    const o = {timestamp: r[0], uploaderName: r[1], fileId: r[3], fileName: r[4], mimeType: r[5]};
    if (withIp) o.ipAddress = r[2];
    return o;
  });
}

// Publik: konfigurasi + daftar foto (tanpa IP)
function doGet() { return out({config: cfg(), photos: photos(false)}); }

function doPost(e) {
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents), s = sheet();
    if (!s.getLastRow()) s.appendRow(['timestamp', 'nama', 'ip', 'fileId', 'fileName', 'mimeType']);

    if (d.action === 'upload') {
      if (!/^image\//.test(d.mimeType || '')) return out({success: false, error: 'hanya foto'});
      const f = save(d.fileBase64, 'image/jpeg', d.fileName || 'kenangan.jpg');
      s.appendRow([new Date(), String(d.uploaderName || 'Tamu').slice(0, 40), d.ipAddress || '', f.getId(), f.getName(), d.mimeType]);
      return out({success: true});
    }

    // Semua aksi di bawah wajib lolos verifikasi hash admin (dicek di server)
    if (d.h !== ADMIN_HASH) return out({success: false, error: 'auth'});

    if (d.action === 'login' || d.action === 'list') return out({success: true, config: cfg(), photos: photos(true)});

    if (d.action === 'delete') {
      const rows = s.getDataRange().getValues();
      for (let i = rows.length - 1; i >= 1; i--) {
        if (rows[i][3] === d.fileId) { s.deleteRow(i + 1); trash(d.fileId); return out({success: true}); }
      }
      return out({success: false, error: 'tidak ditemukan'});
    }

    if (d.action === 'config') {
      const c = cfg();
      Object.keys(DEF).forEach(k => { if (k !== 'bgId' && d.config && d.config[k] !== undefined) c[k] = d.config[k]; });
      if (d.clearBg || d.bgBase64) { trash(c.bgId); c.bgId = ''; }
      if (d.bgBase64) c.bgId = save(d.bgBase64, 'image/jpeg', 'bg_header.jpg').getId();
      PropertiesService.getScriptProperties().setProperty('cfg', JSON.stringify(c));
      return out({success: true, config: c});
    }
    return out({success: false, error: 'aksi tidak dikenal'});
  } catch (err) {
    return out({success: false, error: String(err)});
  } finally { lock.releaseLock(); }
}
