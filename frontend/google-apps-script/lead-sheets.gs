/**
 * Riceve le richieste dei moduli del sito e le scrive nel Google Sheet
 * "Contatti studiotara", un foglio per modulo.
 *
 * Fogli e colonne sono definiti in frontend/src/lib/googleSheets.ts: questo
 * script crea i fogli che mancano e aggiunge le colonne nuove da solo.
 *
 * Installazione: Estensioni > Apps Script, incolla questo file, sostituisci
 * WEBHOOK_SECRET, poi Esegui il deployment > Nuovo deployment > App web,
 * "Esegui come: Me", "Chi ha accesso: Chiunque".
 */
const WEBHOOK_SECRET = 'INCOLLA_QUI_LA_CHIAVE';
const DATE_COLUMN = 'Data e ora';
const LOCK_TIMEOUT_MS = 20000;

function doPost(e) {
  try {
    const request = JSON.parse(e.postData.contents);
    if (WEBHOOK_SECRET === 'INCOLLA_QUI_LA_CHIAVE' || request.secret !== WEBHOOK_SECRET) {
      return reply_({ ok: false, error: 'unauthorized' });
    }
    const lock = LockService.getScriptLock();
    lock.waitLock(LOCK_TIMEOUT_MS);
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      if (request.setup) {
        spreadsheet.setSpreadsheetTimeZone('Europe/Rome');
        Object.keys(request.setup).forEach(function (name) {
          ensureSheet_(spreadsheet, name, request.setup[name]);
        });
      } else {
        appendRow_(ensureSheet_(spreadsheet, request.sheet, request.columns), request.columns, request.values);
      }
    } finally {
      lock.releaseLock();
    }
    return reply_({ ok: true });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  }
}

function ensureSheet_(spreadsheet, name, columns) {
  const sheet = spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
  const lastColumn = sheet.getLastColumn();
  const headers = lastColumn ? sheet.getRange(1, 1, 1, lastColumn).getValues()[0] : [];
  const missing = [DATE_COLUMN].concat(columns).filter(function (column) {
    return headers.indexOf(column) === -1;
  });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    sheet.getRange(1, 1, 1, headers.length + missing.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function appendRow_(sheet, columns, values) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const cells = headers.map(function () { return ''; });
  columns.forEach(function (column, i) {
    // L'apostrofo forza il testo: "=..." dai moduli non diventa una formula e "+39..." resta un telefono.
    cells[headers.indexOf(column)] = values[i] ? "'" + values[i] : '';
  });
  const rowNumber = sheet.getLastRow() + 1;
  sheet.getRange(rowNumber, 1, 1, headers.length).setValues([cells]);
  sheet.getRange(rowNumber, headers.indexOf(DATE_COLUMN) + 1)
    .setNumberFormat('dd/MM/yyyy HH:mm:ss')
    .setValue(new Date());
}

function reply_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
