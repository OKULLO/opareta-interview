$(document).ready(function(){
    // breadcrumb
    let breadcrumb_data = {
      pages: [
        {
          page_name: 'Documents',
          page_link: 'student.php',
          breadcrumb_class: 'breadcrumb-item'
        },
        {
          page_name: 'Single Document',
          page_link: '',
          breadcrumb_class: 'breadcrumb-item active'
        }
      ]
    }
    templater('breadcrumb', breadcrumb_data, 'breadcrumbu')

    let stdData = {id: 1}

    // current page url
    let current_page_url = window.location.href

    let single_doc = parseURLParams(current_page_url)

    let decrypted_data = atob(single_doc.q[0])

    let parsed_data = JSON.parse(decrypted_data)

    let doc_id = parseInt(parsed_data.q)

    let single_doc_data = {
        id: stdData.id,
        doc_id: doc_id
    }
    // console.log(single_doc_data)

    // fetching student documnets from the server
    $.ajax({
        type: 'post', // define the type of HTTP verb we want to use (GET for our form)
        url: '../private/api/student/single_document.php', // the url where we want to GET branch accounts
        data: single_doc_data, // our data object
        dataType: 'json', // what type of data do we expect back from the server
    }).done(function (data) {
      // console.log(data)
      if (!data.success) {
        console.log(data.errors);
      } else {
        console.log(data.document)

        let document_data = {
          document: data.document
        }

        templater('single_documente', document_data, 'single_documente')
      }
    })
    .fail(function (data) {
      console.log(data);
    });

  });
