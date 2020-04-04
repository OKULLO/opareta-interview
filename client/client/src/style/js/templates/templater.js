let templater = (hb_template, temp_data, dom_ref) => {
  let theTemplateScript = $('#'+ hb_template).html();
  // Compile the template
  let theTemplate = Handlebars.compile(theTemplateScript);
  // Pass our data to the template
  let theCompiledHtml = theTemplate(temp_data);
  // Add the compiled html to the page
  $(`.${dom_ref}`).html(theCompiledHtml);
}

let table_templater = (hb_template, temp_data, dom_ref, data_table) => {
  // Grab the template script
  let theTemplateScript = $('#'+ hb_template).html();
  // Compile the template
  let theTemplate = Handlebars.compile(theTemplateScript);
  // Pass our data to the template
  let theCompiledHtml = theTemplate(temp_data);
  // Add the compiled html to the page
  $('.' + dom_ref).html(theCompiledHtml);
  // intializing datatables
  $(`#${data_table}`).DataTable();
}
