$(document).ready(function(){
    // breadcrumb
    let breadcrumb_data = {
      pages: [
        {
          page_name: 'Dashboard',
          page_link: 'dashboard.php',
          breadcrumb_class: 'breadcrumb-item'
        },
        {
          page_name: 'Contact Manager',
          page_link: '',
          breadcrumb_class: 'breadcrumb-item active'
        }
      ]
    }
    // templater('breadcrumb', breadcrumb_data, 'breadcrumbu')
  
    // client id
    let clientData = {
      'client_id': parseInt($('input[name=client_id]').val())
    };

    show_muted_message('send_contact_message_feedback', '160 characters remaining, 0 messages')
    show_muted_message('send_group_message_feedback', '160 characters remaining, 0 messages')
    show_muted_message('single_senderID_feedback', '20 characters remaining')
    show_muted_message('group_senderID_feedback', '20 characters remaining')


    // group message sender ID
    $('.group_sender_id').on('input', function(evt){
      evt.preventDefault();
      let message_text = $(this).val();
      let message_text_count = message_text.length;
      // console.log(message_text_count);
      if (message_text_count === 0) {
        show_danger_message('group_senderID_feedback', '20 characters remaining');
        show_form_errors('group_sender_id', 'groupsenderid', 'Sender ID required');
      } else {
        sender_id_validator('group_sender_id', 'group_senderID_feedback', message_text_count);
      }
    });

    // single message sender ID
    $('.single_sender_id').on('input', function(evt){
      evt.preventDefault();
      let message_text = $(this).val();
      let message_text_count = message_text.length;
      // console.log(message_text_count);
      if (message_text_count === 0) {
        show_danger_message('single_senderID_feedback', '20 characters remaining');
        show_form_errors('single_sender_id', 'singlesenderid', 'Sender ID required');
      } else {
        sender_id_validator('single_sender_id', 'single_senderID_feedback', message_text_count);
      }
    });

    // // collapse btn icon change on click
    // let rotated = false;
    // $(document).on('click', '#collapse_btn', function (evt) {
    //   evt.preventDefault()
    //   $('#collapse_btn'),deg = rotated ? 0 : 180;
    //   $(this).css({"-ms-transform":"rotate('+deg+'deg)", "oTransform": "rotate('+deg+'deg)", "-moz-transform": "rotate('+deg+'deg)", "-webkit-transform": "rotate('+deg+'deg)", "transform": "rotate('+deg+'deg)"});
    //   rotated = !rotated;
    // });
  
    // fetching client messages sent from the server
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (GET for our form)
        url: 'private/apis/client/contacts/contacts.php', // the url where we want to GET branch accounts
        data: clientData, // our data object
        dataType: 'json', // what type of data do we expect back from the server
    })
    .done(function (data) {
      // console.log(data)
      if (!data.success) {
        console.log(data.errors);
      } else {
        // client account balance and message plan
        $('.account_balance').text(data.client_info.client_account_balance);

        // contacts table
        let contacts_data = {
          single_contacts: data.contacts,
          group_contacts: data.group_contacts
        }

        $('.client_contacts_num').text(contacts_data.single_contacts.length)
        $('.client_contacts_groups_num').text(contacts_data.group_contacts.length)

        templater('group_contacts', contacts_data, 'group_contacts');
        templater('contacts', contacts_data, 'contacts');
      }
    })
    .fail(function (data) {
      console.log(data);
    });

    // closing the add client contact modal
    $("#add_contact_modal").on('hidden.bs.modal', (e) => {
      e.preventDefault();
      reset_form('add_single_contact_form')
      clearErrors(['contact','contact_name'], ['invalid-feedback', 'alert'])
    });


    // add single contact
    $('#add_single_contact_form').submit(function(evt){
        evt.preventDefault();
        // remove error messages
        clearErrors(['contact','contact_name'], ['invalid-feedback', 'alert'])
        // single_contact object
        let single_contact = {
          'contact': $('input[name=contact]').val(),
          'name': $('input[name=contact_name]').val(),
          'client_id': parseInt($('input[name=client_id]').val())
        };
    
        if (single_contact.contact === '' || single_contact.name === '') {
          show_alert_message('add_single_contact_form', 'All form fields required to add contact.')
        } else {
          // disable btn to avoid double submission
          disable_btn('add_single_contact_btn');
          // changing button text to show progress
          change_btn_text('add_single_contact_btn', 'sending ...');
    
          // sending data to the php restful api
          $.ajax({
              type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
              url: 'private/apis/client/contacts/add_single_contact.php', // the url where we want to POST
              data: single_contact, // our data object
              dataType: 'json' // what type of data do we expect back from the server
          }).done(function(data) {
            // console.log(data);
            if (!data.success) {
                // console.log(data.errors);
                if (data.errors['uniqueness_error']) {
                  show_alert_message('add_single_contact_form', 'An error was encountered while adding contact. Please check refresh your browser and try again');
                } else if (data.errors['client_notexists'] || data.errors['client_id']) {
                  show_alert_message('add_single_contact_form', 'Error adding contact. Please refresh and try again');
                } else if (data.errors['contact_exists'] || data.errors['client_id']) {
                  show_alert_message('add_single_contact_form', 'Contact already exists among your contacts');
                } else if (data.errors['query_error'] || data.errors['client_id']) {
                  show_alert_message('add_single_contact_form', 'Error getting your contact. Please refresh and try again');
                } else if (data.errors['register_error']) {
                  show_alert_message('add_single_contact_form', 'An error was encountered while adding contact. Please check refresh your browser and try again');
                } else if (data.errors['contact']) {
                  show_form_errors('contact', 'cc', data.errors['contact']);
                } else if (data.errors['name']) {
                  show_form_errors('contact_name', 'cn', data.errors['name']);
                }          

                // changing button text to show progress
                change_btn_text('add_single_contact_btn', 'Add Contact');
                // disable btn to avoid double submission
                enable_btn('add_single_contact_btn');
            } else {
              // reset form
              reset_form('add_single_contact_form');

              // contacts table
              let contacts_data = {
                single_contacts: data.contacts
              }

              $('.client_contacts_num').text(contacts_data.single_contacts.length)

              templater('contacts', contacts_data, 'contacts');

              // hide delete modal
              $('.add_contact_modal').modal('toggle')
              // show success message
              $('.success_message').text(data.message);
              $('.success_modal').modal('show');
    
              // changing button text to show progress
              change_btn_text('add_single_contact_btn', 'Add Contact');
              // disable btn to avoid double submission
              enable_btn('add_single_contact_btn');
            }
          }).fail(function(data){
            // show any errors from the server
            show_alert_message('add_single_contact_form', 'Error: Unable to connect to the server.');
            // log errors to the log file
            // console.log(data);
    
            // changing button text to show progress
            change_btn_text('add_single_contact_btn', 'Add Contact');
            // disable btn to avoid double submission
            enable_btn('add_single_contact_btn');
          });
          // End of processing the form
        }
      });

    // send sms to contact
    $(document).on('click', '.send_message', function (evt) {
      evt.preventDefault();
      // contact id
      let contact_id = $(this).attr('contact_id');
      $('#send_message_contact_id').val(contact_id);

      let sms_contact = $(this).attr('client_contact');
      $('#send_message_contact').val(sms_contact)

      // showing modal
      $('.send_message_modal').modal('show');
    });

    // track changes in the text feilds
    $('.send_contact_message_body').on('input', function(evt){
      evt.preventDefault();
      let message_text = $(this).val();
      let message_text_count = message_text.length;
      if (message_text_count === 0) {
        show_danger_message('send_contact_message_feedback', '160 characters remaining, 0 messages');
        show_form_errors('send_contact_message_body', 'scmbody', 'SMS message required');
      } else {
        message_body_validator('send_contact_message_body', 'send_contact_message_feedback', message_text_count);
      }
    });

    // close send contact message modal
    $("#send_message_modal").on('hidden.bs.modal', (e) => {
      e.preventDefault();
      // reset form
      reset_form('send_contact_message_form')
      // remove error messages
      clearErrors(['send_contact_message_body'], ['invalid-feedback', 'alert'])

      show_muted_message('send_contact_message_feedback', '160 characters remaining, 0 messages')
    });

    // send single sms
    $('#send_contact_message_form').submit(function(evt){
      evt.preventDefault();
      // remove error messages
      clearErrors(['send_contact_message_body'], ['invalid-feedback', 'alert'])
      // single sms object
      let singleSmsData = {
        'single_sms_message': $('textarea[name=send_contact_message_body]').val(),
        'single_sms_recipient_contact': $('input[name=send_message_contact]').val(),
        'sender_id': $('input[name=single_sender_id]').val(),
        'client_id': clientData.client_id
      };
  
      if (singleSmsData.single_sms_message === "") {
        show_alert_message('send_contact_message_form', 'All form fields required to send SMS.')
      } else {
        // disable btn to avoid double submission
        disable_btn('send_contact_message_btn');
        // changing button text to show progress
        change_btn_text('send_contact_message_btn', 'sending ...');
  
        // sending data to the php restful api
        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: 'private/apis/client/messages/send_single_sms.php', // the url where we want to POST
            data: singleSmsData, // our data object
            dataType: 'json' // what type of data do we expect back from the server
        }).done(function(data) {
          // console.log(data);
          if (!data.success) {
              // console.log(data.errors);
              if (data.errors['uniqueness_error'] || data.errors['request_error']) {
                show_alert_message('send_contact_message_form', 'An error was encountered while sending SMS. Please check refresh your browser and try again');
              } else if (data.errors['client_notexists'] || data.errors['client_id'] || data.errors['single_sms_recipient_contact']) {
                show_alert_message('send_contact_message_form', 'An error occured while sending SMS. Please refresh your browser and try again');
              } else if (data.errors['register_error']) {
                show_alert_message('send_contact_message_form', 'An error was encountered while sending SMS. Please check refresh your browser and try again');
              } else if (data.errors['sms_sending_error']) {
                show_alert_message('send_contact_message_form', data.errors['sms_sending_error']);
              } else if (data.errors['insufficient_account_balance']) {
                show_alert_message('send_contact_message_form', 'Your account balance is insufficient to send SMS. Please recharge your account and try again');
              } else if (data.errors['single_sms_message']) {
                show_form_errors('send_contact_message_body', 'scmbody', data.errors['single_sms_message']);
              } else if (data.errors['sender_id']) {
                show_form_errors('single_sender_id', 'singlesenderid', data.errors['sender_id']);
              }             

              // changing button text to show progress
              change_btn_text('send_contact_message_btn', 'Send Message');
              // disable btn to avoid double submission
              enable_btn('send_contact_message_btn');
          } else {
            // reset form
            reset_form('send_contact_message_form');
            show_muted_message('send_contact_message_feedback', '160 characters remaining, 0 messages')
            show_muted_message('single_senderID_feedback', '20 characters remaining')

            // client account balance and message plan
            $('.account_balance').text(data.account_balance);
            // show success message
            $('.send_message_modal').modal('toggle')
            $('.success_message').text(data.message);
            $('.success_modal').modal('show');
  
            // changing button text to show progress
            change_btn_text('send_contact_message_btn', 'Send Message');
            // disable btn to avoid double submission
            enable_btn('send_contact_message_btn');
          }
        }).fail(function(data){
          // show any errors from the server
          show_alert_message('send_contact_message_form', 'Error: Unable to connect to the server.');
          // log errors to the log file
          // console.log(data);
  
          // changing button text to show progress
          change_btn_text('send_contact_message_btn', 'Send Message');
          // disable btn to avoid double submission
          enable_btn('send_contact_message_btn');
        });
        // End of processing the form
      }
    });

    // delete contact
    $(document).on('click', '.delete_contact', function (evt) {
      evt.preventDefault();
      // contact id
      let contact_id = $(this).attr('contact_id');
      $('#delete_contact_id').val(contact_id);

      let sms_contact = $(this).attr('client_contact');
      $('#delete_contact_para').text(`Are you sure you want to remove ${sms_contact} from your contacts lists ?`)

      // showing modal
      $('.delete_contact_modal').modal('show');
    });

    // close delete contact modal
    $("#delete_contact_modal").on('hidden.bs.modal', (e) => {
      e.preventDefault();
      $('#delete_contact_id').val('');
      $('.delete_contact_para').text('');
    });

    // delete
    $(document).on('click', '.delete_contact_btn', function (evt) {
      evt.preventDefault();

      let delete_contact_data = {
        'contact_id': parseInt($('input[name=delete_contact_id]').val()),
        'client_id': parseInt($('input[name=client_id]').val())
      }

      // disable btn to avoid double submission
      disable_btn('delete_contact_btn');
      // changing button text to show progress
      change_btn_text('delete_contact_btn', 'sending ...');

      $.ajax({
          type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
          url: 'private/apis/client/contacts/delete_contact.php', // the url where we want to POST
          data: delete_contact_data, // our data object
          dataType: 'json' // what type of data do we expect back from the server
      }).done(data => {
        // console.log(data)
        if (!data.success) {

          // hide delete modal
          $('.delete_contact_modal').modal('toggle')
          // show error message
          $('.error_message').text('An error occured while deleting contact. Refresh your browser and try again');
          // show error modal
          $('.error_modal').modal('show');              

          // changing button text to show progress
          change_btn_text('delete_contact_btn', 'Delete Contact');
          // disable btn to avoid double submission
          enable_btn('delete_contact_btn');
          
        } else {

          // contacts table
          let contacts_data = {
            single_contacts: data.contacts
          }
          templater('contacts', contacts_data, 'contacts');
          $('.client_contacts_num').text(contacts_data.single_contacts.length)

          // hide delete modal
          $('.delete_contact_modal').modal('toggle')
          // show success message
          $('.success_message').text(data.message);
          $('.success_modal').modal('show');

          // changing button text to show progress
          change_btn_text('delete_contact_btn', 'Delete Contact');
          // disable btn to avoid double submission
          enable_btn('delete_contact_btn');
        }

      }).fail( data => {
        // log errors to the log file
        console.log(data);

        // hide delete modal
        $('.delete_contact_modal').modal('toggle')
        // show error message
        $('.error_message').text('unable to connect to the server');
        // show error modal
        $('.error_modal').modal('show');

        // changing button text to show progress
        change_btn_text('delete_contact_btn', 'Delete Contact');
        // disable btn to avoid double submission
        enable_btn('delete_contact_btn');
      })

    });



    // edit contact
    let edit_contact_data = {};
    $(document).on('click', '.edit_contact', function (evt) {
      evt.preventDefault();

      // contact name
      let contact_name = $(this).attr('contact_name');
      edit_contact_data.contact_name = contact_name;
      $('#edit_contact_name').val(contact_name);

      // client contact
      let client_contact = $(this).attr('client_contact');
      edit_contact_data.client_contact = client_contact;
      $('#edit_client_contact').val(client_contact);

      // contact id
      let contact_id = $(this).attr('contact_id');
      $('#edit_contact_id').val(contact_id);

      // show that not change to the form
      change_btn_text('edit_contact_btn', 'No Changes Made Yet');

      // disable btn to avoid double submission
      disable_btn('edit_contact_btn');

      // showing modal
      $('.edit_contact_modal').modal('show');
    });

    // check for edit changes
    let edit_client_contact_form_feilds = ['edit_contact_name', 'edit_client_contact'];
    function track_edit_client_contact_changes (changedData, editClientContactData) {
      if (editClientContactData.contact_name !== changedData[0] ||
        editClientContactData.client_contact !== changedData[1]) {
        return true;
      } else {
        return false;
      }
    }

    // contact name change
    $('#edit_contact_name').on('input', function (evt) {
      evt.preventDefault();
      let edit_contact_form_data = fetch_inputfields_data(edit_client_contact_form_feilds);
      if (track_edit_client_contact_changes(edit_contact_form_data, edit_contact_data)) {
        // show that not change to the form
        change_btn_text('edit_contact_btn', 'Save Changes');
        // enable button to save changes
        enable_btn('edit_contact_btn');
      } else {
        // show that not change to the form
        change_btn_text('edit_contact_btn', 'No Changes Made Yet');
        // disable btn to avoid double submission
        disable_btn('edit_contact_btn');
      }
    });

    // client contact change
    $('#edit_client_contact').on('input', function (evt) {
      evt.preventDefault();
      let edit_contact_form_data = fetch_inputfields_data(edit_client_contact_form_feilds);
      if (track_edit_client_contact_changes(edit_contact_form_data, edit_contact_data)) {
        // show that not change to the form
        change_btn_text('edit_contact_btn', 'Save Changes');
        // enable button to save changes
        enable_btn('edit_contact_btn');
      } else {
        // show that not change to the form
        change_btn_text('edit_contact_btn', 'No Changes Made Yet');
        // disable btn to avoid double submission
        disable_btn('edit_contact_btn');
      }
    });

    // edit
    $('#edit_contact_form').submit(function(evt){
      evt.preventDefault();
      // remove error messages
      clearErrors(['edit_contact_name','edit_client_contact'], ['invalid-feedback', 'alert'])

      let edit_contact_data = {
        'contact_name': $('input[name=edit_contact_name]').val(),
        'contact': $('input[name=edit_client_contact]').val(),
        'contact_id': parseInt($('input[name=edit_contact_id]').val()),
        'client_id': parseInt($('input[name=client_id]').val())
      }

      if (edit_contact_data.contact_name === '' || edit_contact_data.contact === '') {
        show_alert_message('edit_contact_form', 'All form fields required to edit contact.')
      } else {
        // disable btn to avoid double submission
        disable_btn('edit_contact_btn');
        // changing button text to show progress
        change_btn_text('edit_contact_btn', 'sending ...');

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: 'private/apis/client/contacts/edit_contact.php', // the url where we want to POST
            data: edit_contact_data, // our data object
            dataType: 'json' // what type of data do we expect back from the server
        }).done(data => {
          // console.log(data)
          if (!data.success) {

            if (data.errors['uniqueness_error']) {
              show_alert_message('edit_contact_form', 'An error was encountered while editing contact. Please check refresh your browser and try again');
            } else if (data.errors['client_not_existing'] || data.errors['client_id']) {
              show_alert_message('edit_contact_form', 'Error editing contact. Please refresh and try again');
            } else if (data.errors['contact_not_existing'] || data.errors['client_id']) {
              show_alert_message('edit_contact_form', 'Invalid Contact');
            } else if (data.errors['client_id'] || data.errors['contact_id']) {
              show_alert_message('edit_contact_form', 'An error occured editing contact');
            } else if (data.errors['query_error']) {
              show_alert_message('edit_contact_form', 'Error getting your contact. Please refresh your browser and check for changes to your contact your editing');
            } else if (data.errors['edit_error']) {
              show_alert_message('edit_contact_form', 'An error was encountered while editing your contact. Please check refresh your browser and try again');
            } else if (data.errors['contact']) {
              show_form_errors('edit_client_contact', 'econtact', data.errors['contact']);
            } else if (data.errors['contact_name']) {
              show_form_errors('edit_contact_name', 'ename', data.errors['contact_name']);
            }              

            // changing button text to show progress
            change_btn_text('edit_contact_btn', 'Save Changes');
            // disable btn to avoid double submission
            enable_btn('edit_contact_btn');
            
          } else {
            // reset form
            reset_form('edit_contact_form');

            // contacts table
            let contacts_data = {
              single_contacts: data.contacts
            }
            templater('contacts', contacts_data, 'contacts');

            // hide delete modal
            $('.edit_contact_modal').modal('toggle')
            // show success message
            $('.success_message').text(data.message);
            $('.success_modal').modal('show');

            // changing button text to show progress
            change_btn_text('edit_contact_btn', 'Save Changes');
            // disable btn to avoid double submission
            enable_btn('edit_contact_btn');
          }

        }).fail( data => {
          // show any errors from the server
          show_alert_message('edit_contact_form', 'Error: Unable to connect to the server.');
          // log errors to the log file
          console.log(data);

          // changing button text to show progress
          change_btn_text('edit_contact_btn', 'Save Changes');
          // disable btn to avoid double submission
          enable_btn('edit_contact_btn');
        })

      }

    });


    // closing the add client group contacts modal
    $("#add_group_contacts_modal").on('hidden.bs.modal', (e) => {
      e.preventDefault();
      reset_form('add_group_contacts_form')
      clearErrors(['group_contactz','group_name'], ['invalid-feedback', 'alert'])
    });


    // add group contacts
    $('#add_group_contacts_form').submit(function(evt){
        evt.preventDefault();
        // remove error messages
        clearErrors(['group_contactz','group_name'], ['invalid-feedback', 'alert'])
        // group_contact object
        let client_group_contacts = $('textarea[name=group_contactz]').val();
        let group_contact = {
          'group_contacts': stringed_contacts(client_group_contacts),
          'group_name': $('input[name=group_name]').val(),
          'client_id': parseInt($('input[name=client_id]').val())
        };
        
    
        if (group_contact.group_contacts.length === 0 || group_contact.group_name === '') {
          show_alert_message('add_group_contacts_form', 'All form fields required to add group.')
        } else {
          // disable btn to avoid double submission
          disable_btn('add_group_btn');
          // changing button text to show progress
          change_btn_text('add_group_btn', 'sending ...');
    
          // sending data to the php restful api
          $.ajax({
              type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
              url: 'private/apis/client/contacts/add_group_contacts.php', // the url where we want to POST
              data: group_contact, // our data object
              dataType: 'json' // what type of data do we expect back from the server
          }).done(function(data) {
            // console.log(data);
            if (!data.success) {
                // console.log(data.errors);
                if (data.errors['uniqueness_error']) {
                  show_alert_message('add_group_contacts_form', 'An error was encountered while adding contact. Please check refresh your browser and try again');
                } else if (data.errors['group_name_exits'] || data.errors['client_id']) {
                  show_alert_message('add_group_contacts_form', 'Group name already exists among your contacts groups. Please choose another group name');
                } else if (data.errors['query_error'] || data.errors['client_id']) {
                  show_alert_message('add_group_contacts_form', 'Error getting your contact. Please refresh and try again');
                } else if (data.errors['register_error']) {
                  show_alert_message('add_group_contacts_form', 'An error was encountered while adding contact. Please check refresh your browser and try again');
                } else if (data.errors['group_contacts']) {
                  show_form_errors('group_contactz', 'gc', data.errors['group_contacts']);
                } else if (data.errors['group_name']) {
                  show_form_errors('group_name', 'gn', data.errors['group_name']);
                }              

                // changing button text to show progress
                change_btn_text('add_group_btn', 'Add Contacts Group');
                // disable btn to avoid double submission
                enable_btn('add_group_btn');
            } else {
              // reset form
              reset_form('add_group_contacts_form');

              // contacts table
              let contacts_data = {
                group_contacts: data.group_contacts
              }
              
              $('.client_contacts_groups_num').text(contacts_data.group_contacts.length)
              templater('group_contacts', contacts_data, 'group_contacts');

              // hide delete modal
              $('.add_group_contacts_modal').modal('toggle')
              // show success message
              $('.success_message').text(data.message);
              $('.success_modal').modal('show');
    
              // changing button text to show progress
              change_btn_text('add_group_btn', 'Add Contacts Group');
              // disable btn to avoid double submission
              enable_btn('add_group_btn');
            }
          }).fail(function(data){
            // show any errors from the server
            show_alert_message('add_group_contacts_form', 'Error: Unable to connect to the server.');
            // log errors to the log file
            console.log(data);
    
            // changing button text to show progress
            change_btn_text('add_group_btn', 'Add Contacts Group');
            // disable btn to avoid double submission
            enable_btn('add_group_btn');
          });
          // End of processing the form
        }
      });




      /** add group contact */
      // opening add group contact modal
      $(document).on('click', '.add_group_contact', function (evt) {
        evt.preventDefault();

        // group id
        let group_id = $(this).attr('group_id');
        $('#add_group_contact_id').val(group_id);

        // showing modal
        $('.add_group_contact_modal').modal('show');
      });

      // closing the add client contact modal
      $("#add_group_contact_modal").on('hidden.bs.modal', (e) => {
        e.preventDefault();
        reset_form('add_group_contact_form')
        clearErrors(['group_contact', 'add_group_contact_id'], ['invalid-feedback', 'alert'])
      });

      // add one or more contacts to group
      $('#add_group_contact_form').submit(function(evt){
        evt.preventDefault();
        // remove error messages
        clearErrors(['group_contact','add_group_contact_id'], ['invalid-feedback', 'alert'])
        // group_contact object
        let contacta = $('textarea[name=group_contact]').val();
        let group_contact = {
          'contacts': stringed_contacts(contacta),
          'group_id': $('input[name=add_group_contact_id]').val(),
          'client_id': parseInt($('input[name=client_id]').val())
        };
    
        if (group_contact.contact === '') {
          show_alert_message('add_group_contact_form', 'All form fields required to add contact.')
        } else {
          // disable btn to avoid double submission
          disable_btn('add_group_contact_btn');
          // changing button text to show progress
          change_btn_text('add_group_contact_btn', 'sending ...');
    
          // sending data to the php restful api
          $.ajax({
              type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
              url: 'private/apis/client/contacts/add_group_contact.php', // the url where we want to POST
              data: group_contact, // our data object
              dataType: 'json' // what type of data do we expect back from the server
          }).done(function(data) {
            // console.log(data);
            if (!data.success) {
                // console.log(data.errors);
                if (data.errors['uniqueness_error']) {
                  show_alert_message('add_group_contact_form', 'An error was encountered while adding group contact. Please check refresh your browser and try again');
                } else if (data.errors['client_notexists'] || data.errors['client_id']) {
                  show_alert_message('add_group_contact_form', 'Error adding group contact. Please refresh and try again');
                } else if (data.errors['contact_exists']) {
                  show_alert_message('add_group_contact_form', 'Contact already exists among your contacts group');
                } else if (data.errors['query_error'] || data.errors['client_id']  || data.errors['group_id']) {
                  show_alert_message('add_group_contact_form', 'Error getting your group contact. Please refresh and try again');
                } else if (data.errors['register_error']) {
                  show_alert_message('add_group_contact_form', 'An error was encountered while adding group contact. Please check refresh your browser and try again');
                } else if (data.errors['contact']) {
                  show_form_errors('group_contact', 'groupcontact', data.errors['contact']);
                }              

                // changing button text to show progress
                change_btn_text('add_group_contact_btn', 'Add Group Contacts');
                // disable btn to avoid double submission
                enable_btn('add_group_contact_btn');
            } else {
              // reset form
              reset_form('add_group_contact_form');

              // contacts table
              let contacts_data = {
                group_contacts: data.group_contacts
              }
      
              templater('group_contacts', contacts_data, 'group_contacts');

              // show success message
              $('.add_group_contact_modal').modal('toggle');
              $('.success_message').text(data.message);
              $('.success_modal').modal('show');
    
              // changing button text to show progress
              change_btn_text('add_group_contact_btn', 'Add Group Contacts');
              // disable btn to avoid double submission
              enable_btn('add_group_contact_btn');
            }
          }).fail(function(data){
            // show any errors from the server
            show_alert_message('add_group_contact_form', 'Error: Unable to connect to the server.');
            // log errors to the log file
            console.log(data);
    
            // changing button text to show progress
            change_btn_text('add_group_contact_btn', 'Add Group Contacts');
            // disable btn to avoid double submission
            enable_btn('add_group_contact_btn');
          });
          // End of processing the form
        }
      });







      /** delete contacts group */
      // opening delete group contact modal
      $(document).on('click', '.delete_group', function (evt) {
        evt.preventDefault();

        // group id
        let group_id = $(this).attr('group_id');
        $('#delete_contacts_group_id').val(group_id);

        // group name 
        let group_name = $(this).attr('group_name');
        $('#delete_contacts_group_para').text(`Are you sure you want to delete "${group_name}" group ?`);

        // showing modal
        $('.delete_group_modal').modal('show');
      });

      // closing the delete client contact modal
      $("#delete_group_modal").on('hidden.bs.modal', (e) => {
        e.preventDefault();
        clearErrors(['delete_contacts_group_para', 'delete_contacts_group_id'], ['invalid-feedback', 'alert'])
      });

      // delete group contact
      $(document).on('click', '.delete_contacts_group_btn', function (evt) {
        evt.preventDefault();

        let delete_contact_data = {
          'group_id': parseInt($('input[name=delete_contacts_group_id]').val()),
          'client_id': parseInt($('input[name=client_id]').val())
        }

        // disable btn to avoid double submission
        disable_btn('delete_contacts_group_btn');
        // changing button text to show progress
        change_btn_text('delete_contacts_group_btn', 'sending ...');

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: 'private/apis/client/contacts/delete_contacts_group.php', // the url where we want to POST
            data: delete_contact_data, // our data object
            dataType: 'json' // what type of data do we expect back from the server
        }).done(data => {
          // console.log(data)
          if (!data.success) {

            // hide delete modal
            $('.delete_group_modal').modal('toggle')
            // show error message
            $('.error_message').text('An error occured while deleting contacts group. Refresh your browser and try again');
            // show error modal
            $('.error_modal').modal('show');              

            // changing button text to show progress
            change_btn_text('delete_contacts_group_btn', 'Delete Contacts Group');
            // disable btn to avoid double submission
            enable_btn('delete_contacts_group_btn');
            
          } else {

            // contacts table
            let contacts_data = {
              group_contacts: data.group_contacts
            }
    
            $('.client_contacts_groups_num').text(contacts_data.group_contacts.length)
    
            templater('group_contacts', contacts_data, 'group_contacts');

            // hide delete modal
            $('.delete_group_modal').modal('toggle')
            // show success message
            $('.success_message').text(data.message);
            $('.success_modal').modal('show');

            // changing button text to show progress
            change_btn_text('delete_contacts_group_btn', 'Delete Contacts Group');
            // disable btn to avoid double submission
            enable_btn('delete_contacts_group_btn');
          }

        }).fail( data => {
          // log errors to the log file
          console.log(data);

          // hide delete modal
          $('.delete_group_modal').modal('toggle')
          // show error message
          $('.error_message').text('unable to connect to the server');
          // show error modal
          $('.error_modal').modal('show');

          // changing button text to show progress
          change_btn_text('delete_contacts_group_btn', 'Delete Contacts Group');
          // disable btn to avoid double submission
          enable_btn('delete_contacts_group_btn');
        })

      });








      /** edit contacts group */
      // opening edit group modal
      let edit_group_data = {}
      $(document).on('click', '.edit_group', function (evt) {
        evt.preventDefault();

        // group id
        let group_id = $(this).attr('group_id');
        $('#edit_group_id').val(group_id);

        // name 
        let group_name = $(this).attr('group_name');
        edit_group_data.group_name = group_name
        $('#edit_group_name').val(group_name);

        // show that not change to the form
        change_btn_text('edit_group_btn', 'No Changes Made Yet');

        // disable btn to avoid double submission
        disable_btn('edit_group_btn');
        

        // showing modal
        $('.edit_group_modal').modal('show');
      });

      // closing the delete client contact modal
      $("#edit_group_modal").on('hidden.bs.modal', (e) => {
        e.preventDefault();
        clearErrors(['edit_group_id', 'edit_group_name'], ['invalid-feedback', 'alert'])
      });

      // check for edit changes
      let edit_group_form_feilds = ['edit_group_name'];
      function track_edit_group_changes (changedData, editGroupData) {
        if (editGroupData.group_name !== changedData[0]) {
          return true;
        } else {
          return false;
        }
      }

      // contact name change
      $('#edit_group_name').on('input', function (evt) {
        evt.preventDefault();
        let edit_group_form_data = fetch_inputfields_data(edit_group_form_feilds);
        if (track_edit_group_changes(edit_group_form_data, edit_group_data)) {
          // show that not change to the form
          change_btn_text('edit_group_btn', 'Save Changes');
          // enable button to save changes
          enable_btn('edit_group_btn');
        } else {
          // show that not change to the form
          change_btn_text('edit_group_btn', 'No Changes Made Yet');
          // disable btn to avoid double submission
          disable_btn('edit_group_btn');
        }
      });

      // edit
      $('#edit_group_form').submit(function(evt){
        evt.preventDefault();
        // remove error messages
        clearErrors(['edit_group_name','edit_group_id'], ['invalid-feedback', 'alert'])

        let edit_contact_data = {
          'group_name': $('input[name=edit_group_name]').val(),
          'group_id': parseInt($('input[name=edit_group_id]').val()),
          'client_id': parseInt($('input[name=client_id]').val())
        }

        if (edit_contact_data.edit_group_name === '') {
          show_alert_message('edit_group_form', 'All form fields required to edit contacts group name.')
        } else {
          // disable btn to avoid double submission
          disable_btn('edit_group_btn');
          // changing button text to show progress
          change_btn_text('edit_group_btn', 'sending ...');

          $.ajax({
              type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
              url: 'private/apis/client/contacts/edit_contacts_group.php', // the url where we want to POST
              data: edit_contact_data, // our data object
              dataType: 'json' // what type of data do we expect back from the server
          }).done(data => {
            // console.log(data)
            if (!data.success) {

              if (data.errors['uniqueness_error']) {
                show_alert_message('edit_group_form', 'An error was encountered while editing contacts group. Please check refresh your browser and try again');
              } else if (data.errors['client_not_existing'] || data.errors['client_id'] || data.errors['group_id']) {
                show_alert_message('edit_group_form', 'Error editing contacts group name. Please refresh and try again');
              } else if (data.errors['contact_not_existing'] || data.errors['client_id']) {
                show_alert_message('edit_group_form', 'Invalid Contact');
              } else if (data.errors['client_id'] || data.errors['contact_id']) {
                show_alert_message('edit_group_form', 'An error occured editing contacts group name');
              } else if (data.errors['query_error']) {
                show_alert_message('edit_group_form', 'Error getting your contacts groups contacts. Please refresh your browser and check for changes to your contacts group name your editing');
              } else if (data.errors['edit_error']) {
                show_alert_message('edit_group_form', 'An error was encountered while editing your contacts group name. Please check refresh your browser and try again');
              } else if (data.errors['group_name']) {
                show_form_errors('edit_group_name', 'egname', data.errors['group_name']);
              } else if (data.errors['group_name_exits']) {
                show_alert_message('edit_group_form', 'Group name already exists');
              }           

              // changing button text to show progress
              change_btn_text('edit_group_btn', 'Save Changes');
              // disable btn to avoid double submission
              enable_btn('edit_group_btn');
              
            } else {
              // reset form
              reset_form('edit_contact_form');

              // contacts table
              let contacts_data = {
                group_contacts: data.group_contacts
              }
      
              templater('group_contacts', contacts_data, 'group_contacts');

              // hide delete modal
              $('.edit_group_modal').modal('toggle')
              // show success message
              $('.success_message').text(data.message);
              $('.success_modal').modal('show');

              // changing button text to show progress
              change_btn_text('edit_group_btn', 'Save Changes');
              // disable btn to avoid double submission
              enable_btn('edit_group_btn');
            }

          }).fail( data => {
            // show any errors from the server
            show_alert_message('edit_group_form', 'Error: Unable to connect to the server.');
            // log errors to the log file
            console.log(data);

            // changing button text to show progress
            change_btn_text('edit_group_btn', 'Save Changes');
            // disable btn to avoid double submission
            enable_btn('edit_group_btn');
          })

        }

      });













      /** delete group contact */
      // opening delete group contact modal
      $(document).on('click', '.delete_group_contact', function (evt) {
        evt.preventDefault();

        // contact id
        let contact_id = $(this).attr('contact_id');
        $('#delete_group_contact_id').val(contact_id);

        // group id
        let group_id = $(this).attr('contact_group');
        $('#contact_group_id').val(group_id);

        // contact 
        let group_contact = $(this).attr('group_contact');
        $('#delete_group_contact_para').text(`Are you sure you want to delete ${group_contact} from group ?`);

        // showing modal
        $('.delete_group_contact_modal').modal('show');
      });

      // closing the delete group contact modal
      $("#delete_group_contact_modal").on('hidden.bs.modal', (e) => {
        e.preventDefault();
        clearErrors(['delete_group_contact_para', 'delete_group_contact_id'], ['invalid-feedback', 'alert'])
      });

      // delete group contact
      $(document).on('click', '.delete_group_contact_btn', function (evt) {
        evt.preventDefault();

        let delete_contact_data = {
          'contact_id': parseInt($('input[name=delete_group_contact_id]').val()),
          'group_id': parseInt($('input[name=contact_group_id]').val()),
          'client_id': parseInt($('input[name=client_id]').val())
        }

        // disable btn to avoid double submission
        disable_btn('delete_group_contact_btn');
        // changing button text to show progress
        change_btn_text('delete_group_contact_btn', 'sending ...');

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: 'private/apis/client/contacts/delete_group_contact.php', // the url where we want to POST
            data: delete_contact_data, // our data object
            dataType: 'json' // what type of data do we expect back from the server
        }).done(data => {
          // console.log(data)
          if (!data.success) {

            // hide delete modal
            $('.delete_group_contact_modal').modal('toggle')
            // show error message
            $('.error_message').text('An error occured while deleting group contact. Refresh your browser and try again');
            // show error modal
            $('.error_modal').modal('show');              

            // changing button text to show progress
            change_btn_text('delete_group_contact_btn', 'Delete Contact');
            // disable btn to avoid double submission
            enable_btn('delete_group_contact_btn');
            
          } else {

            // contacts table
            let contacts_data = {
              group_contacts: data.group_contacts
            }
    
            templater('group_contacts', contacts_data, 'group_contacts');

            // hide delete modal
            $('.delete_group_contact_modal').modal('toggle')
            // show success message
            $('.success_message').text(data.message);
            $('.success_modal').modal('show');

            // changing button text to show progress
            change_btn_text('delete_group_contact_btn', 'Delete Contact');
            // disable btn to avoid double submission
            enable_btn('delete_group_contact_btn');
          }

        }).fail( data => {
          // log errors to the log file
          console.log(data);

          // hide delete modal
          $('.delete_group_contact_modal').modal('toggle')
          // show error message
          $('.error_message').text('unable to connect to the server');
          // show error modal
          $('.error_modal').modal('show');

          // changing button text to show progress
          change_btn_text('delete_group_contact_btn', 'Delete Contact');
          // disable btn to avoid double submission
          enable_btn('delete_group_contact_btn');
        })

      });




      /** send group message */
      // opening send group message modal
      $(document).on('click', '.send_group_message', function (evt) {
        evt.preventDefault();

        // group id
        let group_id = $(this).attr('group_id');
        $('#send_message_group_id').val(group_id);

        // showing modal
        $('.send_group_message_modal').modal('show');
      });

      // closing the send group sms modal
      $("#send_group_message_modal").on('hidden.bs.modal', (e) => {
        e.preventDefault();
        clearErrors(['send_message_group_id', 'send_group_message_body'], ['invalid-feedback', 'alert'])
        show_muted_message('send_group_message_feedback', '160 characters remaining, 0 messages')
      });

      // track changes in the text feilds
      $('.send_group_message_body').on('input', function(evt){
        evt.preventDefault();
        let message_text = $(this).val();
        let message_text_count = message_text.length;
        if (message_text_count === 0) {
          show_danger_message('send_group_message_feedback', '160 characters remaining, 0 messages');
          show_form_errors('send_group_message_body', 'sgmbody', 'SMS message required');
        } else {
          message_body_validator('send_group_message_body', 'send_group_message_feedback', message_text_count);
        }
      });

      // send group sms
      $('#send_group_message_form').submit(function(evt){
        evt.preventDefault();
        // remove error messages
        clearErrors(['send_message_group_id','send_group_message_body'], ['invalid-feedback', 'alert'])
        // contacts group sms object
        let groupSmsData = {
          'group_message_body': $('textarea[name=send_group_message_body]').val(),
          'contacts_group': parseInt($('input[name=send_message_group_id]').val()),
          'sender_id': $('input[name=group_sender_id]').val(),
          'client_id': clientData.client_id
        };

        if (groupSmsData.group_message_body === "" || groupSmsData.contacts_group === 0) {
          show_alert_message('send_group_message_form', 'All form fields required to send SMS.')
        } else {
          // disable btn to avoid double submission
          disable_btn('send_group_message_btn');
          // changing button text to show progress
          change_btn_text('send_group_message_btn', 'sending ...');
    
          // sending data to the php restful api
          $.ajax({
              type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
              url: 'private/apis/client/messages/send_group_sms.php', // the url where we want to POST
              data: groupSmsData, // our data object
              dataType: 'json' // what type of data do we expect back from the server
          }).done(function(data) {
            // console.log(data);
            if (!data.success) {
                // console.log(data.errors);
                if (data.errors['uniqueness_error']) {
                  show_alert_message('send_group_message_form', 'An error was encountered while sending SMS. Please check refresh your browser and try again');
                } else if (data.errors['client_notexists'] || data.errors['client_id'] || data.errors['contacts_group']) {
                  show_alert_message('send_group_message_form', 'Invalid user');
                } else if (data.errors['register_error']) {
                  show_alert_message('send_group_message_form', 'An error was encountered while sending SMS. Please check refresh your browser and try again');
                } else if (data.errors['sms_sending_error']) {
                  show_alert_message('send_group_message_form', 'An error occured with sending SMS. Please check your internet connection, refresh your browser and try again');
                } else if (data.errors['insufficient_account_balance']) {
                  show_alert_message('send_group_message_form', 'Your account balance is insufficient to send SMS. Please recharge your account and try again');
                } else if (data.errors['group_message_body']) {
                  show_form_errors('send_group_message_body', 'sgmbody', data.errors['group_message_body']);
                } else if (data.errors['sender_id']) {
                  show_form_errors('group_sender_id', 'groupsenderid', data.errors['sender_id']);
                }

                // changing button text to show progress
                change_btn_text('send_group_message_btn', 'Send Group Message');
                // disable btn to avoid double submission
                enable_btn('send_group_message_btn');
            } else {
              // reset form
              reset_form('send_group_message_form');
              show_muted_message('send_group_message_feedback', '160 characters remaining, 0 messages')
              show_muted_message('group_senderID_feedback', '20 characters remaining')

              // client account balance and message plan
              $('.account_balance').text(data.account_balance);

              if (data.some_sms_failed) {
                // show success message
                show_success_message('send_group_message_form', data.message);

                let failed_contacts = data.failed_sms_contacts.length;

                for (let a = 0; a < failed_contacts; a++) {
                     let contact_error_message = data.failed_sms_contacts[a][0]+": "+ data.failed_sms_contacts[a][1]
                     show_alert_message('send_group_message_form', contact_error_message);         
                }

              } else {
                // show success message
                $('.send_group_message_modal').modal('toggle')
                $('.success_message').text(data.message);
                $('.success_modal').modal('show');
              }
    
              // changing button text to show progress
              change_btn_text('send_group_message_btn', 'Send Group Message');
              // disable btn to avoid double submission
              enable_btn('send_group_message_btn');
            }
          }).fail(function(data){
            // show any errors from the server
            show_alert_message('send_group_message_form', 'Error: Unable to connect to the server.');
            // log errors to the log file
            console.log(data);
    
            // changing button text to show progress
            change_btn_text('send_group_message_btn', 'Send Group Message');
            // disable btn to avoid double submission
            enable_btn('send_group_message_btn');
          });
          // End of processing the form
        }

      });

  });
  