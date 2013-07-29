(function ( $ ) {
 
    $.fn.BttLeapTrainer = function( options ) {
 
        // default options
        var settings = $.extend({
            gestures: [                 // list of all available gestures
              'U', 'D', 'L', 'R', 
              '2U', '2D', '2L', '2R',
              '3U', '3D', '3L', '3R',
              '5U', '5D', '5L', '5R',
              'CW', 'CCW', '2CW', '2CCW',
              'T', '2T', '3T', '5T',
              'CLP'
            ],
            number_of_gestures: 50,   // number of gestures to be generated in the lesson
            lesson: '.lesson_data',   // lesson data container
            work: '.work_data',       // work data container (must be an input field)
            stats: '.stats'           // stats data container
        }, options );

        var trainer = this;
        var $trainer = $(trainer);
        this.current_gesture = 0;
        this.correct = 0;
        this.incorrect = 0;
        this.total = 0;

        // generate a random gesture
        this.randomGesture = function() {
          var g = settings.gestures[Math.floor(Math.random()*settings.gestures.length)];
          return g;
        }

        // generate the gestures for this lesson based on the options provided
        this.getLesson = function (n) {
          var result = '<div class="container">';
          for (var i = 0; i < n; i++) {
            result += '<span class="gesture">'+ this.randomGesture() + "</span>";
          };
          result += '</div><div class="paused">Paused</div>';

          $trainer.find(settings.lesson).html(result);
          $trainer.find(settings.lesson).find('.gesture').first().addClass('active');
        }

        this.playLesson = function() {
          $trainer.find(settings.lesson).removeClass('idle');
        }

        this.pauseLesson = function() {
          $trainer.find(settings.lesson).addClass('idle');
        }

        this.checkAnswer = function(e) {
          var $work = $(this);
          var $answer = $(this).val();
          var code = (e.keyCode ? e.keyCode : e.which);
          var $cur_gesture = $trainer.find(settings.lesson).find('.gesture.active').eq(0);
          var $next_gesture = $cur_gesture.next();

          if(String.fromCharCode(code) !== ' ') {
            return;
          }
          else {
            $next_gesture.addClass('active');
            $cur_gesture.removeClass('active');;
            if ($answer.trim(' ') == $cur_gesture.html()) {
              $cur_gesture.addClass('correct')
              trainer.correct++;
              trainer.total++;
            }
            else {
              $cur_gesture.addClass('incorrect')
              trainer.incorrect++;
              trainer.total++;
            }
            $work.val('');
          }
          trainer.updateLesson();
          trainer.updateStats();
        }

        this.updateLesson = function () {
          var $cont = $trainer.find(settings.lesson);
          var $cur_gesture = $trainer.find(settings.lesson).find('.gesture.active').eq(0);
          var offset;
          if ($cur_gesture.length) {
            offset = $cur_gesture.offset().left - $cur_gesture.offsetParent().offset().left;
            $trainer.find(settings.lesson + ' .container').css('margin-left', $cont.outerWidth()/2 - ($cur_gesture.outerWidth()/2) + (-1*offset));
          }
        }

        this.updateStats = function () {
          var $correct = $trainer.find(settings.stats + ' .correct');
          var $incorrect = $trainer.find(settings.stats + ' .incorrect');
          var $accuracy = $trainer.find(settings.stats + ' .accuracy');

          $correct.find('.data').html(trainer.correct);
          $incorrect.find('.data').html(trainer.incorrect);
          $accuracy.find('.data').html(Math.round(100*trainer.correct/trainer.total)+'%');
        }

        // initialization
        this.init = function () {
          trainer.getLesson(settings.number_of_gestures);
          trainer.updateLesson();

          $trainer.find(settings.work).on('focus', trainer.playLesson);
          $trainer.find(settings.work).on('blur', trainer.pauseLesson);
          $trainer.find(settings.work).on('keyup', trainer.checkAnswer);
        }

        this.init();
        return this;
    };
 
}( jQuery ));
