function newEntery() {

  /* Get response spreadsheet. */
  var spreadsheet_url = "https://docs.google.com/spreadsheets/d/1JM8sXu0XZl7M05MdQsKTZCpaear8dXFLYRJ1JaVd1PY/edit?usp=sharing"; /* Update with your spreadsheet url*/
  var spreadsheet = SpreadsheetApp.openByUrl(spreadsheet_url);

  /* Get last entered information.
   * Use Column A as your reference since any one will fill a form Google will automatically place a timestamp.
   */
  var last_index  = spreadsheet.getRange("A1:A").getValues().filter(String).length;
  var last_entry  = spreadsheet.getRange(("B"+last_index+":Y"+last_index)).getValues();

  /* Make a copy from document template.
   */
  var template_doc_name = "Copy of Document for merging and changing to PDF"; /* Update with your document template name. */
  var docs_list         = DriveApp.getFilesByName(template_doc_name);

  /* Check if docs_list has files.
   */
  if(docs_list.hasNext())
  {
    var doc_template = docs_list.next();

    /* Make a copy from the tempate. */
    var prj_doc_file = doc_template.makeCopy();

    /* Update it's name.             */
    prj_doc_file.setName(last_entry[0][0]);

    var prj_doc = DocumentApp.openById(prj_doc_file.getId());


    var doc_paragraphs = prj_doc.getBody().getParagraphs();

    var index;
    /* Order is important since it will affect the data filling. */
    var entry_index = 0;

    /* Search and update paragraphs. */
    for(index = 0; index < doc_paragraphs.length; index += 1)
    {
      var paragraph = doc_paragraphs[index].getText();

      if(paragraph.indexOf('Project Name') > -1)
      {
        doc_paragraphs[index].setText(doc_paragraphs[index].getText().replace("\$\{Project Name\}", last_entry[0][entry_index]));
        entry_index += 1;
      }
      else if(paragraph.indexOf('project address') > -1)
      {
        doc_paragraphs[index].setText(doc_paragraphs[index].getText().replace("\$\{project address\}", last_entry[0][entry_index]));
        entry_index += 1;
      }
      else if(paragraph.indexOf('Number of Lots') > - 1)
      {
        doc_paragraphs[index].setText(doc_paragraphs[index].getText().replace("\$\{Number of Lots\}",last_entry[0][entry_index]));
        entry_index += 1;
      }
      else
      {
        /* Do nothing.*/
      }
    }

    /* Save and close the document. */
    prj_doc.saveAndClose();

    /* How to receive the receipent. */
    var receipent_mail = "mustafa.faisal@h-eng.helwan.edu.eg";
    var mail_subject   = "Mail subject text";
    var mail_body      = "Mail body template";

    /* Send email with attachement PDF. */
    MailApp.sendEmail(receipent_mail,
                      mail_subject,
                      mail_body,
                      {
                        name: 'Automatic Emailer Script',
                        attachments: [prj_doc.getAs(MimeType.PDF)]
                      });

    /* Remove the created document. */
    DriveApp.getFileById(prj_doc_file.getId()).setTrashed(true); 
  }
  else
  {
    /* Error */
    Logger.log("Can't locate document template.");
  }
}