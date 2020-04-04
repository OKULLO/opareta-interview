"use strict";
/* Function for:-
  > clear form errors
  > reset table
*/

// hambugger sidebar menu
/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "320px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// numbers/currency with commas
function numberWithCommas(x){
  let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
}

// encrpyt url handlebars helper function
Handlebars.registerHelper('encrpyt_url', function (arg1, arg2) {
  let encrpyted_url = "";

  let link_data = JSON.stringify({q: arg2});

  let encrpyted_link_data = btoa(link_data);

  encrpyted_url = arg1+'?q='+encrpyted_link_data;

  return encrpyted_url;
});

// adds commas to amount in tables
Handlebars.registerHelper('commaSeparateNumber', function(arg1){
  let val = parseInt(arg1);
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
});

// create collapse class
Handlebars.registerHelper('collapse_class', function(arg1){
  return 'contact_group'+arg1;
});

// ifEquals handlebars helper function
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// ifEqualizer handlebars helper function
Handlebars.registerHelper('ifEqualizer', function(arg1, options) {
    return (parseInt(arg1) === 0) ? options.fn(this) : options.inverse(this);
});

// ifEqualizeralpha handlebars helper function
Handlebars.registerHelper('ifEqualizeralpha', function(arg1, options) {
    return (arg1 === "") ? options.fn(this) : options.inverse(this);
});

// getContactsNum handlebars helper function
Handlebars.registerHelper('getContactsNum', function(contacts_string) {
  let contacts_array = contacts_string.replace(/,\s+/g,",").split(/[\n,]/) // most effective algorithm

  return contacts_array.length;
});

function remove_empty_string_index_from_array(arr){
  let arr_length = arr.length;
  let array_without_empty_index = [];

  for (let q = 0; q < arr_length; q++) {
    // let [arr_val] = arr;
    if (arr[q] !== '') {
      array_without_empty_index.push(arr[q])
    }
  }

  return array_without_empty_index;
}

let compare_dates = (a,b) => {
  const a_date = new Date(a.message_sent_on);
  const b_date = new Date(b.message_sent_on);

  let comparison = 0;
  if (a_date.getTime() > b_date.getTime()) {
    comparison = 1;
  } else {
    comparison = -1;
  }

  return comparison;
}

// comparing values
function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      // property doesn't exist on either object
      return 0;
    }

    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    );
  };
}

// contacts retriever
function contact_retriever (contacts_string) {
  // return contacts_string.split(/[ ,]+/);
  // return contacts_string.replace(/,\s+/g,",").split(/[\n,\s+]/)
  let contacts_array = contacts_string.replace(/,\s+/g,",").split(/[\n,]/) // most effective algorithm

  return remove_empty_string_index_from_array(contacts_array);
}

function stringed_contacts (contacts_string) {
  // return contacts_string.split(/[ ,]+/).filter(function(v){return v!==''}).join(',')
  return contacts_string.replace(/,\s+/g,",").split(/[\n,]/).filter(function(v){return v!==''}).join(',')
}

function stringed (arr_string) {
  let string_arr = arr_string.replace(/,\s+/g,",").split(/[\n,]/).filter(function(v){return v!==''}).join(',')
  return string_arr.replace(/\s*/g, '').split(" ").filter(function(v){return v!==''}).join(',')
}

// gender array
let gender = [
  {
    value: 'female',
    text: 'Female'
  },
  {
    value: 'male',
    text: 'Male'
  }
];

// userpermissions array
let userpermissions = [
  {
    value: 'normal',
    text: 'Normal User'
  },
  {
    value: 'admin',
    text: 'Admin'
  }
];

// due date
function due_date () {
  var date = new Date();
  date.setDate(date.getDate() + 7);
  var month = date.getMonth() + 1;
  return date.getFullYear()+'-'+month+'-'+date.getDate();
}

// closing the success message modal
$('#success_message').on('hidden.bs.modal', (e) => {
  e.preventDefault();
  // removing data to the modal label
  $('.message').html('');
});

function my_date (dateString) {
  let index = dateString.indexOf("-");
  let month = dateString.substr(0, index);
  let dall = dateString.substr(index + 1);
  let a = dall.indexOf("-");
  let day = dall.substr(0, a);
  let year = dall.substr(index + 1);

  return year+'-'+month+'-'+day;
}

// remove errors function
function clearErrors(c_elements, r_elements) {
  // clearing elements of error alerts
  c_elements.forEach((c_element) => $(`#${c_element}`).removeClass('is-invalid'))
  // removing elements
  r_elements.forEach((r_element) => $(`.${r_element}`).remove())
}

function reset_form (form) {
  $( '#'+form ).each(function(){
      this.reset();
  });
}

// This function returns an array input fields
function fetch_inputfields_data (input_fields) {
  let inputs_data = []
  input_fields.forEach((input_field) => inputs_data.push($(`#${input_field}`).val()))
  return inputs_data
}

function form_reset (form_inputs) {
  form_inputs.forEach((form_input) => $(`#${form_input}`).val(''))
}

// disable/deactivate button
function disable_btn (btne) {
  $(`#${btne}`).prop('disabled', true);
}

// disable/deactivate button and show loading
function disable_btn_loading (btne) {
  $(`#${btne}`).prop('disabled', true);
}

// enable/activate button
function enable_btn (btne) {
  $(`#${btne}`).prop('disabled', false);
}

// show form errors
function show_form_errors (form_input, outer_div, error_message) {
  $(`#${form_input}`).addClass('is-invalid'); // add the error class to show red input
  $(`.${outer_div}`).append(`<div class="invalid-feedback">${error_message}</div>`); // add the actual error message under our input
}

// show error alert message
function show_alert_message (data_form, error_message) {
  $(`#${data_form}`).append(`<div class="alert alert-danger my-1 text-left" role="alert">${error_message}</div>`); // add the actual error message under our input
}

function message_body_validator (input_element, feedback_div, sms_text_count) {
  // clear errors
  clearErrors([input_element], ['invalid-feedback', 'alert']);

  let one_message = 160;

  let message_count = parseInt(sms_text_count/one_message);
  let text_used = parseInt(sms_text_count%one_message);
  let remaining_text = one_message-text_used;

  let new_message_count = message_count + 1;

  if (new_message_count > 1) {
    let feedback_text = `${new_message_count} messages, ${remaining_text} characters remaining`;
    show_muted_message(feedback_div, feedback_text)
  } else {
    let feedback_text = `${new_message_count} message, ${remaining_text} characters remaining`;
    show_muted_message(feedback_div, feedback_text)
  }
}

function sender_id_validator (input_element, feedback_div, sms_text_count) {
  // clear errors
  clearErrors([input_element], ['invalid-feedback', 'alert']);

  let remaining_text = 20-sms_text_count;

  let feedback_text = `${remaining_text} characters remaining`;
  show_muted_message(feedback_div, feedback_text)
}

// avoiding loading modal from disappering when someone clicks outside the modal
// $('#loading_modal').modal({
//   backdrop: 'static',
//   keyboard: false
// })

// show form submision success
function show_success_message (data_form, success_message) {
  $(`#${data_form}`).append(`<div class="alert alert-success text-left alert-dismissible fade show" role="alert">
    <strong>Congragulations:</strong> ${success_message}
    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span></button></div>`);
}

// show paragraph messages
function show_muted_message (target_div, target_text) {
  $(`#${target_div}`).html(`<small class="text-muted">${target_text}</small>`);
}

function show_info_message (target_div, target_text) {
  $(`#${target_div}`).html(`<small class="text-info">${target_text}</small>`);
}

function show_success_message (target_div, target_text) {
  $(`#${target_div}`).html(`<small class="text-success">${target_text}</small>`);
}

function show_danger_message (target_div, target_text) {
  $(`#${target_div}`).html(`<small class="text-danger">${target_text}</small>`);
}

function show_warning_message (target_div, target_text) {
  $(`#${target_div}`).html(`<small class="text-warning">${target_text}</small>`);
}

function show_whitr_message (target_div, target_text) {
  $(`#${target_div}`).html(`<small class="text-white">${target_text}</small>`);
}

function hide_data_holders (input_fields) {
  input_fields.forEach((input_field) => $(`#${input_field}`).hide())
}

function parseURLParams(url){
  let queryStart = url.indexOf("?") + 1,
      queryEnd = url.indexOf("#") + 1 || url.length + 1,
      query = url.slice(queryStart, queryEnd - 1),
      pairs = query.replace(/\+/g, " ").split("&"),
      params = {}, i, n, v, nv;

      if (query === url || query === "") return;

      for (let i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=", 2);
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!params.hasOwnProperty(n)) params[n] = [];
        params[n].push(nv.length === 2 ? v : null);
      }
  return params;
}

function change_btn_text (btne, btn_text) {
  $(`#${btne}`).text(btn_text);
}

function get_data_from_server (ajax_method, server_url_api) {
  let data_obj = {};
  $.ajax({
      type: ajax_method, // define the type of HTTP verb we want to use (GET for our form)
      url: server_url_api, // the url where we want to GET faculties ans courses
      dataType: 'json', // what type of data do we expect back from the server
  })
  .done(function (data) {
    return data;
  })
  .fail(function (data) {
    return data;
  });
  console.log(data_obj);
}

// closing success modal
$("#success_modal").on('hidden.bs.modal', (e) => {
  e.preventDefault();
  $('.success_message').text('');
});

// closing error modal
$("#error_modal").on('hidden.bs.modal', (e) => {
  e.preventDefault();
  $('.error_message').text('');
});

(function() {
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    Date.prototype.getMonthName = function() {
        return months[ this.getMonth() ];
    };
    Date.prototype.getDayName = function() {
        return days[ this.getDay() ];
    };
})();

var now = new Date();
var dd = String(now.getDate()).padStart(2, '0');
var mm = String(now.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = now.getFullYear();

var day = now.getDayName();
var month = now.getMonthName();

let currentDate = day + '    ' + dd + '/' + month + '/' + yyyy;

// show badge value
function show_badge_value (badge_ele, badge_val) {
  $(`.${badge_ele}`).text(badge_val);
}
