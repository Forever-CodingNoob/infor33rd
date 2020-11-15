import {currentSec, setCurrentSec, showNavbarWhenNeeded, enableNavbar, disableNavbar} from './base.js';
var currentPerson=null;

var scrollLockPos=[0,0];
function lockScroll(e){
    $(window).scrollLeft(scrollLockPos[0]);
    $(window).scrollTop(scrollLockPos[1]);
}
function disableScrolling(){
    scrollLockPos[1]=$(window).scrollTop();
    scrollLockPos[0]=$(window).scrollLeft();
    window.addEventListener('scroll',lockScroll,{ passive: true });
}
function enableScrolling(){
    window.removeEventListener('scroll',lockScroll,{ passive: true })
}

function open_intro(){
    
    //get name in url's hash without the hash symbol
    let name = decodeURI(window.location.hash.slice(1));
    //alert(name);
    
    console.log('hash_changed :"'+name+'"!');
    
    try{//person exists
        let person = $('#'+name);
        if(typeof person.val()==='undefined'){
            throw 'Cannot find any person named "'+name+'".';
        }
        $('#'+name).find('.details').first().removeClass('hidden');
        disableScrolling();
        disableNavbar(false);
        currentPerson = name;
    }catch(e){//person doesn't exist or there's no hash at all
        console.log('cannot find person!');
        $("#us-inner > span .details").addClass('hidden');
        enableScrolling();
        enableNavbar();
        currentPerson = null;
    }
};
$(document).on('mousemove', function(){
   if(currentPerson!==null){
       showNavbarWhenNeeded(currentPerson!==null);
   }
});




$(document).ready(function(){
    /*disable scrolling
    window.addEventListener('wheel mousewheel touchmove',function(e){
        //alert(currentPerson);
        if(currentPerson!==null){
            //alert(currentPerson);
            e.preventDefault();
            //e.stopPropagation();

        }
    },{ passive: false });
    */
    disableScrolling();
    $("#us-inner > span .img").hover(
        function(){
            $(this).addClass('effect-dodging-stop');
        },function(){
            $(this).removeClass('effect-dodging-stop');
        }
    );
    $("#us-inner > span .img").on('click',function(){
        let name=$(this).parents('span').first().find('div.name').text().trim();
        //alert(name);
        history.pushState(null,null,'#'+name);
        open_intro();
    });
    $('#us-inner > span .details').on('click',function(e){
        let target = $(e.target);
        if(target.is($(this)) || target.is($(this).find('.details-inner').first())){
            //按到空白區域(非name或text)
            history.pushState(null,null,'#');
            open_intro();
        }
    });
    
    window.onhashchange = open_intro;
    //window.onpopstate = open_intro;
    open_intro();
});