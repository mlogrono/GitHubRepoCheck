// setTimeout(function start (){
//
//     console.log("START TIMEOUT");
//
//     $('.bar').each(function(i){
//         let $bar = $(this);
//         $(this).append('<span class="count"></span>')
//         setTimeout(function(){
//             $bar.css('width', $bar.attr('data-percent'));
//         }, i*100);
//     });
//
//     $('.count').each(function () {
//         $(this).prop('Counter',0).animate({
//             Counter: $(this).parent('.bar').attr('data-percent')
//         }, {
//             duration: 2000,
//             easing: 'swing',
//             step: function (now) {
//                 $(this).text(Math.ceil(now) +'%');
//             }
//         });
//     });
//
//     console.log("END TIMEOUT");
// }, 500)

function setBarAnimation(){

    console.log("START TIMEOUT");

    $('.bar').each(function(i){
        let $bar = $(this);
        $(this).append('<span class="count"></span>')
        setTimeout(function(){
            $bar.css('width', $bar.attr('data-percent'));
        }, i*100);
    });

    $('.count').each(function () {
        $(this).prop('Counter',0).animate({
            Counter: $(this).parent('.bar').attr('data-percent')
        }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now) +'%');
            }
        });
    });

    console.log("END TIMEOUT");
}