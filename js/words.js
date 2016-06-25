//this file references an array defined in words_list.js

$(function() {
  var current_word = get_a_word();
  var next_word = get_a_word();
  var correct_words_count = 0;
  var correct_words_spree = 0;
  var current_typing;
  var word_range = 20000; //max size of the array of words.
  var started = false;
  var run_time = 0;
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
    correct_words_count++;
    correct_words_spree++;
    calc_wpm();
  }

  //updates the sections of the page
  function update_page(){
    $('#current_word').text(current_word);
    $('#next_word').text(next_word);
    $('#correct_words_count').text(correct_words_count);
    $('#correct_words_spree').text(correct_words_spree);
  }

  function calc_wpm(){
    var wpm = correct_words_count / run_time * 60;
    $('#wpm').text(wpm.toFixed(2));
  }

  function wpm_timer(){
    if (started){
      run_time++;
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
      correct_words_spree = 0;
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
