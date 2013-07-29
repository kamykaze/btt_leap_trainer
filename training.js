(function ( $ ) {
 
    $.fn.BttLeapTraining = function( options ) {
 
        // default options
        var settings = $.extend({
            gestures: [                 // list of all available gestures
              'U', 'D', 'L', 'R', 
              '2U', '2D', '2L', '2R',
              '3U', '3D', '3L', '3R',
              '5U', '5D', '5L', '5R',
              'CW', 'CCW', '2CW', '2CC',
              'T', '2T', '3T', '5T',
              'CLP'
            ],
            number_of_gestures: 20,   // number of gestures to be generated in the lesson
            lesson: '.lesson_data',   // lesson data container
            work: '.work_data',       // work data container (must be an input field)
            stats: '.stats'           // stats data container
        }, options );

        var $cont = $(this);
        var training = this;
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

          $cont.find(settings.lesson).html(result);
          $cont.find(settings.lesson).find('.gesture').first().addClass('active');
        }

        this.playLesson = function() {
          $cont.find(settings.lesson).removeClass('idle');
        }

        this.pauseLesson = function() {
          $cont.find(settings.lesson).addClass('idle');
        }

        this.checkAnswer = function(e) {
          var $work = $(this);
          var $answer = $(this).val();
          var code = (e.keyCode ? e.keyCode : e.which);
          var $cur_gesture = $cont.find(settings.lesson).find('.gesture.active').eq(0);
          var $next_gesture = $cur_gesture.next();

          if(String.fromCharCode(code) !== ' ') {
            return;
          }
          else {
            $next_gesture.addClass('active');
            $cur_gesture.removeClass('active');;
            if ($answer.trim(' ') == $cur_gesture.html()) {
              $cur_gesture.addClass('correct')
              training.correct++;
              training.total++;
            }
            else {
              $cur_gesture.addClass('incorrect')
              training.incorrect++;
              training.total++;
            }
            $work.val('');
          }
          training.updateLesson();
          training.updateStats();
        }

        this.updateLesson = function () {
          var $cur_gesture = $cont.find(settings.lesson).find('.gesture.active').eq(0);
          var $next_gesture = $cur_gesture.next();
          var offset = $next_gesture.offset().left - $next_gesture.offsetParent().offset().left;
          $cont.find(settings.lesson + ' .container').css('margin-left', $cont.width()/2 + (-1*offset));
        }

        this.updateStats = function () {
          var $correct = $cont.find(settings.stats + ' .correct');
          var $incorrect = $cont.find(settings.stats + ' .incorrect');
          var $accuracy = $cont.find(settings.stats + ' .accuracy');
          console.log(training.correct, training.incorrect, training.correct/training.total);

          $correct.find('.data').html(training.correct);
          $incorrect.find('.data').html(training.incorrect);
          $accuracy.find('.data').html(Math.round(100*training.correct/training.total)+'%');
        }

        // initialization
        this.init = function () {
          this.getLesson(settings.number_of_gestures);
          this.updateLesson();

          $cont.find(settings.work).on('focus', this.playLesson);
          $cont.find(settings.work).on('blur', this.pauseLesson);
          $cont.find(settings.work).on('keyup', this.checkAnswer);
        }

        this.init();
        return this;
    };
 
}( jQuery ));
