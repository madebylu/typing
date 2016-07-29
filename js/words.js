//this file references an array defined in words_list.js

$(function() {
  var current_word = get_a_word();
  var next_word = get_a_word();
  var correct_words_total = 0;
  var incorrect_words_total = 0;
  var current_spree = 0;
  var best_spree = 0;
  var current_typing;
  var word_range = $('#difficulty_number').val();
  var started = false;
  var run_time = 0;
  var session_run_time = 0;
  var timer = setInterval(wpm_timer, 1000);

  //currently selecting with uniform distribution from the first n words
  // where n is the 'difficulty' and is an int less than 20k.
  function get_a_word(){
      word_range = $('#number_of_possible_words').val();
      return words[Math.floor(Math.random()*word_range)];
  }

  //to be called when a correct word is entered
  function correct_word(){
    $('#user_input').val('');
    current_word = next_word;
    next_word = get_a_word();
    correct_words_total++;
    current_spree++;
    calc_wpm();
  }

  //updates the sections of the page
  function update_page(){
    $('#current_word').text(current_word);
    $('#next_word').text(next_word);
    $('#correct_words_total').text(correct_words_total);
    $('#current_spree').text(current_spree);
    $('#best_spree').text(best_spree);
    var accuracy = incorrect_words_total == 0 ? 0 : 100 * correct_words_total / ( correct_words_total + incorrect_words_total);
    $('#accuracy').text(accuracy.toFixed(0));
  }

  function calc_wpm(){
    var wpm = current_spree / run_time * 60;
    var session_wpm = correct_words_total / session_run_time * 60;
    $('#session_wpm').text(session_wpm.toFixed(2));
    $('#wpm').text(wpm.toFixed(2));
  }

  function wpm_timer(){
    if (started){
      run_time++;
      session_run_time++;
    }
  }

  //initialise
  update_page();
  $('#user_input').focus();
  $('#spree-ended').hide();

  //process user input into the text input area.
  $('#user_input').on('keyup', function(e) {
    started = true;
    current_typing = $(this).val();
    if(current_typing == current_word.substring(0, current_typing.length)){
      $('#current_word').removeClass('incorrect');
    } else if (current_typing == current_word + ' '){
      correct_word();
    } else {
      $('#current_word').addClass('incorrect');
      $('#user_input').val('');
      $('#spree-ended').show();
      $('#spree-ended').fadeOut(3000);
      next_word = current_word;
      current_spree > best_spree ? best_spree = current_spree : true;
      current_spree = 0;
      run_time = 0;
      incorrect_words_total++;
    }
    update_page();
  });

  //update 'difficulty'
  $('#number_of_possible_words').on('change input', function(e){
    current_word = get_a_word();
    next_word = get_a_word();
    run_time = 0;
    correct_words_spree = 0;
    correct_words_count = 0;
    started = false;
    update_page();
    $('#difficulty_number').text($(this).val());
    $('#user_input').focus();
  });

});
