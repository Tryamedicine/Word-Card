function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Words');
  if (!sheet) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    sheet = ss.insertSheet('Words');
    // Initialize headers if new sheet
    sheet.appendRow(['id', 'text', 'phonetic', 'definition', 'example', 'partOfSpeech', 'mastery', 'lastReviewed']);
  }

  // Cross-Origin Resource Sharing (CORS) headers
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };

  // Preflight check (OPTIONS) - unlikely to reach here in standard Web App simple request but good to have
  // Note: GAS doesn't explicitly handle OPTIONS well in all cases, but GET/POST is the main focus.

  var action = e.parameter.action;

  try {
    if (e.postData && e.postData.contents) {
      try {
        var body = JSON.parse(e.postData.contents);
        if (body.action) action = body.action;
      } catch (err) {
        // Not JSON or empty body
      }
    }

    if (action === 'add') {
      var data = JSON.parse(e.postData.contents);
      // Ensure data has all fields, default to empty string/0
      var row = [
        data.id, 
        data.text, 
        data.phonetic || '', 
        data.definition || '', 
        data.example || '', 
        data.partOfSpeech || '', 
        data.mastery || 0, 
        data.lastReviewed || Date.now()
      ];
      sheet.appendRow(row);
      return createResponse({ status: 'success', message: 'Word added' });

    } else if (action === 'update') {
      var data = JSON.parse(e.postData.contents);
      var id = data.id;
      var range = sheet.getDataRange();
      var values = range.getValues();
      var rowIndex = -1;
      
      // Find row by ID (assuming ID is first column, index 0)
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] == id) {
          rowIndex = i + 1; // 1-based index
          break;
        }
      }

      if (rowIndex > 0) {
        // Update mastery (col 7) and lastReviewed (col 8)
        // GAS columns are 1-based
        sheet.getRange(rowIndex, 7).setValue(data.mastery);
        sheet.getRange(rowIndex, 8).setValue(data.lastReviewed);
        return createResponse({ status: 'success', message: 'Word updated' });
      } else {
        return createResponse({ status: 'error', message: 'Word not found' });
      }

    } else {
      // Default: GET all words
      var rows = sheet.getDataRange().getValues();
      var headersRow = rows[0];
      var words = [];
      
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        var word = {};
        // Map row array to object based on fixed structure
        // 'id', 'text', 'phonetic', 'definition', 'example', 'partOfSpeech', 'mastery', 'lastReviewed'
        word.id = row[0];
        word.text = row[1];
        word.phonetic = row[2];
        word.definition = row[3];
        word.example = row[4];
        word.partOfSpeech = row[5];
        word.mastery = Number(row[6]);
        word.lastReviewed = Number(row[7]);
        words.push(word);
      }
      return createResponse(words);
    }

  } catch (error) {
    return createResponse({ status: 'error', message: error.toString() });
  }
}

function createResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
