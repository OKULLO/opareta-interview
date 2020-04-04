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
          page_name: 'Buy SMS',
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
  
    // fetching client recharge history sent from the server
    $.ajax({
        type: 'POST', // define the type of HTTP verb we want to use (GET for our form)
        url: 'private/apis/client/buy_sms/recharge.php', // the url where we want to GET branch accounts
        data: clientData, // our data object
        dataType: 'json', // what type of data do we expect back from the server
    }).done(function (data) {
      if (!data.success) {
        console.log(data.errors);
      } else {  
        // client account balance and message plan
        $('.account_balance').text(data.client_info.client_account_balance);

        // sms recharge table
        let sms_recharge_data = {
          recharge_history: data.recharge_history
        }
        table_templater('recharge_history', sms_recharge_data, 'recharge_history', 'recharge_history_tbl');
      }
    })
    .fail(function (data) {
      console.log(data);
    });

    $('.mobile_money_recharge_contact').on('input', function(evt){
      evt.preventDefault();
      let contact = $(this).val();
      let contact_digits = contact.length;
      if (contact_digits === 0) {
        show_form_errors('mobile_money_recharge_contact', 'mmrc', 'Mobile money contact required');
      } else {
        clearErrors(['mobile_money_recharge_contact'], ['invalid-feedback', 'alert'])
      }
    });

    $('.mobile_money_recharge_amount').on('input', function(evt){
        evt.preventDefault();
        clearErrors(['mobile_money_recharge_amount'], ['invalid-feedback', 'alert'])
        let amount = $(this).val();
        if (parseInt(amount) === 0) {
          show_form_errors('mobile_money_recharge_amount', 'mmra', 'Recharge amount required');
        }
    });



    // buy sms
    $('#mobile_money_recharge_form').submit(function(evt){
        evt.preventDefault();
        // remove error messages
        clearErrors(['mobile_money_recharge_contact','mobile_money_recharge_amount'], ['invalid-feedback', 'alert'])
        // buy sms object
        let buySmsData = {
          'contact': $('input[name=mobile_money_recharge_contact]').val(),
          'amount': parseInt($('input[name=mobile_money_recharge_amount]').val()),
          'client_id': clientData.client_id,
          'payment_method': 'mobile money',
          'csrf_token': $('input[name=csrf_token]').val()
        };
    
        if (buySmsData.contact === "" || buySmsData.amount === 0) {
          show_alert_message('mobile_money_recharge_form', 'All form fields required to buy SMS.')
        } else {
          // disable btn to avoid double submission
          disable_btn('mobile_money_recharge_btn');
          // changing button text to show progress
          change_btn_text('mobile_money_recharge_btn', 'sending ...');
    
          // sending data to the php restful api
          $.ajax({
              type: 'POST', // define the type of HTTP verb we want to use (POST for our form)
              url: 'private/apis/client/buy_sms/buy_sms.php', // the url where we want to POST
              data: buySmsData, // our data object
              dataType: 'json' // what type of data do we expect back from the server
          }).done(function(data) {
            // console.log(data);
            if (!data.success) {
                // console.log(data.errors);
                if (data.errors['uniqueness_error']) {
                  show_alert_message('mobile_money_recharge_form', 'An error was encountered while sending SMS. Please check refresh your browser and try again');
                } else if (data.errors['csrf_token_error']) {
                  show_alert_message('mobile_money_recharge_form', 'An error was encountered while sending SMS. Please check refresh your browser and try again');
                } else if (data.errors['client_notexists'] || data.errors['client_id']) {
                  show_alert_message('mobile_money_recharge_form', 'Error racharging. Please refresh and try again');
                } else if (data.errors['register_error']) {
                  show_alert_message('mobile_money_recharge_form', 'An error was encountered while sending SMS. Please check refresh your browser and try again');
                } else if (data.errors['recharge_error']) {
                  show_alert_message('mobile_money_recharge_form', data.errors['recharge_error']);
                } else if (data.errors['contact']) {
                  show_form_errors('mobile_money_recharge_contact', 'mmrc', data.errors['contact']);
                } else if (data.errors['amount']) {
                  show_form_errors('mobile_money_recharge_amount', 'mmra', data.errors['amount']);
                }              

                // changing button text to show progress
                change_btn_text('mobile_money_recharge_btn', 'Buy SMS');
                // disable btn to avoid double submission
                enable_btn('mobile_money_recharge_btn');
            } else {
              // reset form
              reset_form('mobile_money_recharge_form');

              // client account balance and message plan
              $('.account_balance').text(data.account_balance);

              // sms recharge table
              let sms_recharge_data = {
                recharge_history: data.recharge_history
              }
              table_templater('recharge_history', sms_recharge_data, 'recharge_history', 'recharge_history_tbl');

              // show success message
              // show_success_message('mobile_money_recharge_form', data.message);
              $('.success_message').text(data.message);
              $('.success_modal').modal('show');
    
              // changing button text to show progress
              change_btn_text('mobile_money_recharge_btn', 'Buy SMS');
              // disable btn to avoid double submission
              enable_btn('mobile_money_recharge_btn');
            }
          }).fail(function(data){
            // show any errors from the server
            show_alert_message('mobile_money_recharge_form', 'Error: Unable to connect to the server. Please try again or contact us on 0700366742/0778939323 or email us on info@thepandoranetworks.com');
            // log errors to the log file
            console.log(data);
    
            // changing button text to show progress
            change_btn_text('mobile_money_recharge_btn', 'Buy SMS');
            // disable btn to avoid double submission
            enable_btn('mobile_money_recharge_btn');
          });
          // End of processing the form
        }
      });

  });
  