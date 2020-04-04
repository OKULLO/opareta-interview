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
          page_name: 'Account',
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

    // console.log(clientData);
  
    // fetching client messages sent from the server
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (GET for our form)
        url: 'private/apis/client/account/account.php', // the url where we want to GET branch accounts
        data: clientData, // our data object
        dataType: 'json', // what type of data do we expect back from the server
    })
    .done(function (data) {
      if (!data.success) {
        console.log(data.errors);
      } else {  
        // client account balance and message plan
        $('.account_balance').text(data.client_info.client_account_balance);

        // profile table
        let client_profile_data = {
          client_profile: data.client_info
        }

        templater('client_profile', client_profile_data, 'client_profile');
      }
    })
    .fail(function (data) {
      console.log(data);
    });



    // edit account profile
    let account_data = {client_id: clientData.client_id}
    $(document).on('click', '.show_edit_profile', function (evt) {
      evt.preventDefault();
      
      // account name
      let account_name = $(this).attr('account_fname');
      $('#euser_name').val(account_name)
      account_data.name = account_name

      // account contact
      let account_contact = $(this).attr('account_contact');
      $('#euser_contact').val(account_contact)
      account_data.contact = account_contact

      // show that not change to the form
      change_btn_text('edit_user_info_btn', 'No Changes Made Yet');

      // disable btn to avoid double submission
      disable_btn('edit_user_info_btn');
  
      // showing modal
      $('.edit_user_info_modal').modal('show');
    });
  
    // close show contact modal
    $("#edit_user_info_modal").on('hidden.bs.modal', (e) => {
      e.preventDefault();
      reset_form('edit_user_info_form')
      clearErrors(['euser_name', 'euser_contact'], ['invalid-feedback', 'alert'])
    });

    // check for edit changes
    let client_info_form_feilds = ['euser_name', 'euser_contact'];
    function track_changes (changedData, original_data) {
      if (original_data.name.toLowerCase() !== changedData[0].toLowerCase() ||
        original_data.contact !== changedData[1]) {
        return true;
      } else {
        return false;
      }
    }

    // name change
    $('#euser_name').on('input', function (evt) {
      evt.preventDefault();
      let edit_client_info_form_data = fetch_inputfields_data(client_info_form_feilds);
      if (track_changes(edit_client_info_form_data, account_data)) {
        // show that not change to the form
        change_btn_text('edit_user_info_btn', 'Save Changes');
        // enable button to save changes
        enable_btn('edit_user_info_btn');
      } else {
        // show that not change to the form
        change_btn_text('edit_user_info_btn', 'No Changes Made Yet');
        // disable btn to avoid double submission
        disable_btn('edit_user_info_btn');
      }
    });


    // contact change
    $('#euser_contact').on('input', function (evt) {
      evt.preventDefault();
      let edit_client_info_form_data = fetch_inputfields_data(client_info_form_feilds);
      if (track_changes(edit_client_info_form_data, account_data)) {
        // show that not change to the form
        change_btn_text('edit_user_info_btn', 'Save Changes');
        // enable button to save changes
        enable_btn('edit_user_info_btn');
      } else {
        // show that not change to the form
        change_btn_text('edit_user_info_btn', 'No Changes Made Yet');
        // disable btn to avoid double submission
        disable_btn('edit_user_info_btn');
      }
    });


    // edit
    $('#edit_user_info_form').submit(function(evt){
      evt.preventDefault();
      // remove error messages
      clearErrors(['euser_name','euser_contact'], ['invalid-feedback', 'alert'])

      let edit_info_data = {
        'name': $('input[name=euser_name]').val(),
        'contact': $('input[name=euser_contact]').val(),
        'client_id': clientData.client_id
      }

      if (edit_info_data.name === '' || edit_info_data.contact === '') {
        show_alert_message('edit_user_info_form', 'All form fields required to edit account.')
      } else {
        // disable btn to avoid double submission
        disable_btn('edit_user_info_btn');
        // changing button text to show progress
        change_btn_text('edit_user_info_btn', 'sending ...');

        $.ajax({
            type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
            url: 'private/apis/client/account/edit_account.php', // the url where we want to POST
            data: edit_info_data, // our data object
            dataType: 'json' // what type of data do we expect back from the server
        }).done(data => {
          // console.log(data)
          if (!data.success) {

            if (data.errors['uniqueness_error']) {
              show_alert_message('edit_user_info_form', 'An error was encountered while editing client. Please refresh your browser and try again');
            } else if (data.errors['client_not_existing']) {
              show_alert_message('edit_user_info_form', 'Error editing client. Please refresh your browser and try again');
            } else if (data.errors['client_id']) {
              show_alert_message('edit_user_info_form', 'An error occured editing client info');
            } else if (data.errors['query_error']) {
              show_alert_message('edit_user_info_form', 'Error getting client info. Please refresh your browser and check for changes to your contact your editing');
            } else if (data.errors['edit_error']) {
              show_alert_message('edit_user_info_form', 'An error was encountered while editing client info. Please check refresh your browser and try again');
            } else if (data.errors['contact']) {
              show_form_errors('edit_client_contact', 'econtact', data.errors['contact']);
            } else if (data.errors['contact_name']) {
              show_form_errors('edit_contact_name', 'ename', data.errors['contact_name']);
            }             

            // changing button text to show progress
            change_btn_text('edit_user_info_btn', 'Save Changes');
            // disable btn to avoid double submission
            enable_btn('edit_user_info_btn');
            
          } else {
            // reset form
            reset_form('edit_user_info_form');

            let client_profile_data = {
              client_profile: data.client_info
            }
    
            templater('client_profile', client_profile_data, 'client_profile');

            // hide delete modal
            $('.edit_user_info_modal').modal('toggle')
            // show success message
            $('.success_message').text(data.message);
            $('.success_modal').modal('show');

            // changing button text to show progress
            change_btn_text('edit_user_info_btn', 'Save Changes');
            // disable btn to avoid double submission
            enable_btn('edit_user_info_btn');
          }

        }).fail( data => {
          // show any errors from the server
          show_alert_message('edit_user_info_form', 'Error: Unable to connect to the server.');
          // log errors to the log file
          console.log(data);

          // changing button text to show progress
          change_btn_text('edit_user_info_btn', 'Save Changes');
          // disable btn to avoid double submission
          enable_btn('edit_user_info_btn');
        })

      }

    });




  });
  