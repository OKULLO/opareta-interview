$(document).ready(function(){
    let stdData = {id: 1}
    // fetching student documnets from the server
    $.ajax({
        type: 'post', // define the type of HTTP verb we want to use (GET for our form)
        url: '../private/api/student/documents.php', // the url where we want to GET branch accounts
        data: stdData, // our data object
        dataType: 'json', // what type of data do we expect back from the server
    }).done(function (data) {
      
       console.log(data)
      if (!data.success) {
        console.log(data.errors);
      } else {
        // documents number
        let docs_num = data.documents.length
        $('.documents_num').text(docs_num)
        let approved_docs = data.documents.filter(document => document.document_status === "Approved")
        let approved_docs_num = approved_docs.length
        $('.approved_docs_num').text(approved_docs_num)
        let pending_docs_num = docs_num - approved_docs_num
        $('.pending_docs_num').text(pending_docs_num)

        // docuements table
        let document_data = {
          student_documents: data.documents
        }
        table_templater('student_documents', document_data, 'student_documents', 'student_documents_tbl');
      }
    })
    .fail(function (data) {
      console.log(data);
    });
    let insertdata ={id:1}
    $.ajax({
      type: 'post',
      url:'../private/api/student/insert_document.php',
      data:stdData,
      dataType:'json'
    }).done(function(data){
        
    });

  });
