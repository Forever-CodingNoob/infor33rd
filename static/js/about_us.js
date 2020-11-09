import {currentSec, setCurrentSec, showNavbarWhenNeeded} from './base.js';
var currentPerson=null;
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
        currentPerson = name;
    }catch(e){//person doesn't exist or there's no hash at all
        console.log('cannot find person!');
        $("#us-inner > span .details").addClass('hidden');
        currentPerson = null;
    }
};
$(document).on('mousemove', function(){
   showNavbarWhenNeeded(currentPerson!==null);
});
$(document).ready(function(){
    $(window).on('scroll',function(e){
        if(currentPerson===null){
           e.stopPropagation();
            e.preventDefault();
        }
    });
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
    
    window.onhashchange = open_intro;
    //window.onpopstate = open_intro;
    open_intro();
});