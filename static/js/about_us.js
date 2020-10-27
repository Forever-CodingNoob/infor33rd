$(document).ready(function(){
    $("#us-inner > span .img").hover(
        function(){
            $(this).addClass('effect-dodging-stop');
        },function(){
            $(this).removeClass('effect-dodging-stop');
        }
    );
});