//'use strict';
var autoscrolling=false;
var currentSec='cover';
var mousePos=[0,0];//mousePos==[mouseX,mouseY]
var jellies_amount=0;

function setCurrentSec(str){
    if(str===null){
        currentSec = 'cover';
        return;
    }
    currentSec = str;
    $('#show4').text('currentSec: '+currentSec);
}

var main_img_move_up_inPercentage=50;
function update_mainbackgroundimg(){ 
    var scroll_velocity = $('#main-img').css('--scroll_velocity');
    var pos = $(window).scrollTop(); 
    // subtract some from the height b/c of the padding
    $('#main-img').css('backgroundPosition', '50% calc(' + Math.round(-pos * scroll_velocity) +  'px +  '+main_img_move_up_inPercentage+"%)"); 
    $("#show").text($('#main-img').height()+"  "+$(window).scrollTop());
}
$(window).on('scroll', function(){
    update_mainbackgroundimg();
    checkAppearEffectElem();
    $('#show4').text('currentSec: '+currentSec);
    $('#show3').text('autoscrolling:'+autoscrolling.toString());

    if(currentSec=='cover'){
        //若存在#intro0則檢查是否需要自動向下滾
        if(typeof $('#intro0').val()!=='undefined'){
            autoScrollDown($('#main').offset().top,$('#intro0').offset().top,0);
        }
    }else if(currentSec==0){
        var self=$('#intro'+currentSec);
        var lower=$('#intro'+(currentSec+1));
        autoScrollUp(0,$('#main').offset().top,$('#intro0').offset().top,'cover');
        autoScrollDown(self.offset().top+self.innerHeight(),lower.offset().top,currentSec+1);
    }else{
        var upper=$('#intro'+(currentSec-1));
        var self=$('#intro'+currentSec);
        var lower=$('#intro'+(currentSec+1));
        autoScrollUp(upper.offset().top,upper.offset().top+upper.innerHeight(),self.offset().top,currentSec-1);

        if(typeof lower.val()!=='undefined'){
            autoScrollDown(self.offset().top+self.innerHeight(),lower.offset().top,currentSec+1);
        }
    }
});
function autoScrollDown(upper_line,lower_line,lowerTargetSec){
    console.log('autoScrollDown'+"\n"+upper_line+"\n"+lower_line+"\n"+lowerTargetSec+"\n"+$(window).scrollTop()+$(window).height());
    //判斷過屆下線要微調，不然會太靈敏
    if($(window).scrollTop()+$(window).height()>upper_line+10 && !autoscrolling){
        //alert($(window).scrollTop()+$(window).height()+" "+(upper_line+100));
        autoscrolling=true;
        var hash="main";
        
        $('html , body').animate(
            {
                scrollTop: lower_line
            },
            800,
            //executed after the animation!
            function(){
                autoscrolling=false;
                if(lowerTargetSec==0){
                    //alert('under break point!');
                    setCurrentSec(0);

                    //it will automatically scroll the page: window.location.hash=hash;
                    //use this instead
                    history.pushState(null,null,'#'+hash);

                    disableNavbar(true);
                    showNavbarWhenNeeded();
                }else{
                    setCurrentSec(lowerTargetSec);
                }
                $('#show3').text('autoscrolling:'+autoscrolling.toString());
            }

        );
        console.log('finished under bp!');
    }
}
function autoScrollUp(upper_elem_top,upper_line,lower_line,upperTargetSec){
    console.log('autoScrollUp'+"\n"+upper_elem_top+"\n"+upper_line+"\n"+lower_line+"\n"+upperTargetSec);
    //判斷過屆上線要微調，不然會太靈敏
    if($(window).scrollTop()<lower_line-10 && !autoscrolling){
        //alert($(window).scrollTop()+" "+lower_line);
        autoscrolling=true;

        $('html , body').animate(
            {
                scrollTop: upper_elem_top
            },
            800,
            //executed after the animation!
            function(){
                autoscrolling=false;
                if(upperTargetSec=='cover'){
                    //alert('above break point!');
                    setCurrentSec(null);

                    //it will automatically scroll the page: window.location.hash="";
                    //use this instead
                    history.pushState(null,null,'#');

                    enableNavbar();
                }else{
                    setCurrentSec(upperTargetSec);
                }
                $('#show3').text('autoscrolling:'+autoscrolling.toString());
            }

        );
        console.log('finished after bp!');
    }
}

function onresizeHandler(){
    var main_img= $('#main-img');
    if(typeof main_img.val()==='undefined'){
        return;
    }

    // Remove url() or in case of Chrome url("") in "background-image" css property of the main background img
    var image_url = main_img.css('background-image').match(/^url\("?(.+?)"?\)$/)[1];
    console.log(image_url);

    var image=new Image();
    $(image).on('load',function () {
        //alert('image loaded!!!  '+image.width + 'x' + image.height);
    });
    //assign img url to img element
    image.src = image_url;

    //the width and height that the img has to fit(img's width and height shoud be both larger than window_width and window_height)
    var window_width=$(window).width();
    var window_height=$(window).height()*(main_img.css('--least-height').replace(/\D/g,'')/100.0);
    //alert(window_height);
    console.log("window's width: "+window_width+"  window's height: "+window_height+"\n"+"img width: "+image.width+"  img height: "+image.height+"\n"+"window:"+window_height/window_width);
    if(window_height/window_width<image.height/image.width){
        main_img.css('background-size','100% auto');
        console.log('make width fit');
    }else{
        let max_height=main_img.css("--max-height");
        main_img.css('background-size','auto '+max_height);
        console.log('make height fit');
    }
}
$(window).on('resize', onresizeHandler);



function getMousePosition(event){
    var mouseX=event.pageX-$(window).scrollLeft();
    var mouseY=event.pageY-$(window).scrollTop();
    return [mouseX,mouseY];
}
$(document).on('mousemove', function(event){
    mousePos=getMousePosition(event);
    $('#show2').text("mouse position: "+mousePos[0]+" "+mousePos[1]);
    showNavbarWhenNeeded();
});
function enableNavbar(){
    $('#main-nav').removeClass('hidden light-effect');
}
function disableNavbar(lightup=true){
    $('#main-nav').addClass('hidden');
    if(lightup){
        $('#main-nav').addClass('light-effect');
    }
}
function showNavbarWhenNeeded(forceToDetect){
    //works only when currentSec is not 'cover'
    if(currentSec!='cover' || forceToDetect===true){
        if(mousePos[1]<=25){
            $('#main-nav').removeClass('hidden');
        }else if(mousePos[1]>$('.navbar').height()){
            $('#main-nav').addClass('hidden');        
        }
    }
}
function showNavbarOnLoaded(){
    var time_delay=150;
    $('.navbar li.hidden').each(function(index){
        var li=this;
        setTimeout(function(){$(li).removeClass('hidden')}, time_delay * (index+1));
    });
}






function typingeffect(elem,keep_underscore){
    console.log('fukc');

    if(typeof $(elem).attr('data-text')==='undefined'){
        $(elem).attr('data-text',$(elem).html().trim());
    }
    var text=$(elem).attr('data-text').trim();
    var count=1;
    var typeSpeed=(typeof $(elem).attr("data-typeeffect-speed")==='undefined')? 5:$(elem).attr("data-typeeffect-speed");
    //alert(typeSpeed);
    $(elem).html('_');
    clearInterval($(elem).attr('data-intervalID-0'));
    clearInterval($(elem).attr('data-intervalID-1'));
    var id=setInterval(
        function(){
           if (count<=text.length){
               $(elem).html(text.slice(0,count++)+"_");
           }else{
               var currtext=$(elem).html().trim();

               //delete the '_' at the end of the text
               $(elem).html(currtext.slice(0,currtext.length-1));

               //make a routine
               if(keep_underscore){
                   var addUnderscore=true;
                   var id2=setInterval(
                       function(){
                           var currtext=$(elem).html().trim();
                           if(addUnderscore){
                               $(elem).html(currtext+"_");
                           }else{
                               $(elem).html(currtext.slice(0,currtext.length-1));
                           }
                           addUnderscore=!addUnderscore;
                       },
                       500
                   );
                   $(elem).attr('data-intervalID-1',id2);
               }

               //or just stop the interval
               clearInterval(id);
           }
        },
        1/typeSpeed*1000
    );
    $(elem).attr('data-intervalID-0',id);
}

//add typing effct if needed
function checkAppearEffectElem(){
    $('.effect').each(function(){
        if($(this).offset().top<=$(window).scrollTop()+$(window).height()){
            if($(this).hasClass('hidden')){
                $(this).removeClass('hidden');
                if($(this).hasClass('effect-typing')){
                    typingeffect($(this),$(this).hasClass('effect-keep_underscore'));
                }else if($(this).hasClass('effect-dodging')){
                    setTimeout($.proxy(function(){dodge($(this));},this),1100);
                }else if($(this).hasClass('effect-widthExtend')){
                    widthExtendEffect($(this));
                }
            }
        }else{
            if(!$(this).hasClass('hidden')){
                $(this).addClass('hidden');
                if($(this).hasClass('effect-dodging')){
                    dont_dodge($(this));
                }else if($(this).hasClass('effect-widthExtend')){
                    widthShrinkEffect($(this));
                }

            }
        }
    });
}
/*$('#intro0-title').on('click',function(){
    typingeffect($(this)); 
});*/
function dodge(elem){
    dont_dodge(elem);
    $(elem).css('transition-property','none');

    const timeInterval=50;

    //make element interact with mouse pointer
    const pos=$(elem).offset();
    const max_force=100*(timeInterval/100);
    const mouse_max_force=75*(timeInterval/100);

    var v=[0,0];
    //$(elem).data('center',[pos.left+$(elem).width()/2,pos.top+$(elem).height()/2]);
    upd_centerPos(elem);
    $(elem).data('radius',$(elem).attr('data-movement_radius'));
    $(elem).data('mouse_radius',$(elem).attr('data-mouse_interact_radius'));
    $(elem).data('oritop',$(elem).css('top'));
    $(elem).data('orileft',$(elem).css('left'));
    //alert($(elem).css('top'));
    //start loop and return its id
    let id= setInterval(function(){
        if($(elem).hasClass('effect-dodging-stop')){
            return;
        }
        const size=[$(elem).width(),$(elem).height()];
        let center=$(elem).data('center');
        const elem_pos=$(elem).offset();
        const pos=[elem_pos.left+size[0]/2,elem_pos.top+size[1]/2];
        let radius=$(elem).data('radius');
        //alert(pos);

        let to_center=[center[0]-pos[0],center[1]-pos[1]];
        let dist=Math.sqrt(to_center[0]**2+to_center[1]**2);
        let force_mag=Math.min((dist**2/radius**2)*max_force,max_force);
        let mag=0;
        if(dist!==0){
            mag=Math.sqrt(force_mag/dist);
        }
        let force=[to_center[0]*mag,to_center[1]*mag];

        let mouse_pos=[mousePos[0]+$(window).scrollLeft(),mousePos[1]+$(window).scrollTop()];
        let mouse_to_elem=[pos[0]-mouse_pos[0],pos[1]-mouse_pos[1]];
        let mouse_dist=Math.sqrt(mouse_to_elem[0]**2+mouse_to_elem[1]**2);
        let mouse_radius=$(elem).data('mouse_radius');
        let mouse_force_mag=(mouse_dist<=mouse_radius)?(Math.min(((radius-mouse_dist)**5/radius**5)*mouse_max_force,mouse_max_force)):(0);
        let mouse_mag=Math.sqrt(mouse_force_mag/mouse_dist);
        let mouse_force=[mouse_to_elem[0]*mouse_mag,mouse_to_elem[1]*mouse_mag];



        v=[v[0]+force[0]+mouse_force[0],v[1]+force[1]+mouse_force[1]];


       $(elem).css('top','calc('+$(elem).data('oritop')+' + '+(v[1]-size[1]/2)+'px)');
        $(elem).css('left','calc('+$(elem).data('orileft')+' + '+(v[0]-size[0]/2)+'px)');
        //console.log(pos+"\n"+center+"\n"+force+"\n"+to_center+"\n"+mag+"\n"+dist+"\n"+v+"\n"+force_mag+"\n\n"+mouse_pos+mouse_force+"\n"+mouse_to_elem+"\n"+mouse_mag+"\n"+mouse_dist+"\n"+mouse_force_mag);
        //console.log(v[1]-$(elem).height()/2);

    },timeInterval);

    $(elem).data('interval_id',id);


}
function dont_dodge(elem){
    clearInterval($(elem).data('interval_id'));
    $(elem).css({'transition-property':'','top':'','left':''});
}
function upd_centerPos(elem){
    const pos=$(elem).offset();
    $(elem).data('center',[pos.left+$(elem).width()/2,pos.top+$(elem).height()/2]);
}


function widthExtendEffect(elem){
    $(elem).css('width',$(elem).css('--data-extendWidth'));
}
function widthShrinkEffect(elem){
    $(elem).css('width',$(elem).css('--data-shrinkWidth'));
}




function addJellyFish(certain_speed){
    var size=150;
    var image=new Image(size,size);
    image.src="img/jelly.png";
    
    let navbarPadding = $("#main-nav").innerHeight()-$("#main-nav").height();
    var start_height=($("#main-nav").height()-image.height)/2 + navbarPadding;
    if(randint(0,1)){
        var direction='right';
        var start_posleft=-image.width;
    }else{
        var direction='left';
        var start_posleft=$(window).width();
    }
    image.setAttribute('data-movement-direction',direction);

    var speed_max=5;
    if (typeof certain_speed==='undefined'){
        var speed=Math.random()*speed_max;
    }
    else{
        var speed=certain_speed;
    }
    var angle=0;
    var rotation_speed_max = 5;
    var rotation_speed = Math.random()*(2*rotation_speed_max)-rotation_speed_max;
    var horizontal_scale=randfloat(1/500,1/16);
    function height_trail_func(left){
        return Math.sin(left*horizontal_scale)*20+start_height;
    }
    image.style.left=start_posleft+"px";
    $("#jellies").prepend(image);
    jellies_amount++;
    var id=setInterval(
        function(){
            var left=image.offsetLeft;
            var direction=image.getAttribute('data-movement-direction');
            image.style.top=height_trail_func(left)+"px";
            if(direction=='right') left+=speed;
            else left-=speed;
            image.style.left=left+"px";
            angle+=rotation_speed;
            $(image).css('transform',"rotate("+angle+"deg)");
            if (left>=$(window).width() || left<=-image.width){
                remove(image);
                clearInterval(id);
                jellies_amount--;
            }
        },
        50
    );

}
function spam_jellies(interval){
    if(jellies_amount<=20){ addJellyFish(); }
    var rand_millisec=(typeof interval==='undefined')?randint(3000,5000):interval;
    setTimeout(spam_jellies,rand_millisec);
}
function crazily_spam_jellies(){
    addJellyFish(Math.random()*5+20);
    var rand_millisec=100;
    if($("#spam").prop('checked')){
        setTimeout(crazily_spam_jellies,rand_millisec);
    }
}
function toggleGoViral(){
    let testBar=$('#test');
    if(testBar.hasClass('viral')){
        $('#test').removeClass('viral');
    }else{
        $('#test').addClass('viral');
    }
    
    $('.navbar li.bad').removeClass('bad');
}

function remove(elem){
    elem.parentNode.removeChild(elem);
}
function randint(start,end){
    return Math.floor(Math.random()*(end-start+1)+start);
}
function randfloat(start,end){
    return Math.random()*(end-start)+start;
}

$(document).ready(function(){
    $('.colored-btn a').hover(
        function(){
            //alert('hovered!');
            $(this).parent().addClass('running'); 
        },
        function(){
            //alert('hovered!');
            $(this).parent().removeClass('running');
        }
    );
    $("#spam").on('change',function(){
        if($(this).prop('checked')){
            crazily_spam_jellies();
        }
    });
    $('#loading span').on('click',toggleGoViral);
    
    
    //該做正事ㄌ
    update_mainbackgroundimg();
    //$(window).resize();//trigger window's resize event so that the function which properly adjust screen size will be triggered too
    onresizeHandler();
    
    $(window).trigger('scroll');

    
    //execute once the entire page (DOM as well as images or iframes) is ready.
    window.onload = function(){
        setTimeout(function(){
            
            $('#loading').addClass('hidden');
            $('html,body').removeClass('before-loaded');
            spam_jellies();
            showNavbarOnLoaded();
        
        },1000);
    };
});

export {currentSec, mousePos, setCurrentSec, showNavbarWhenNeeded, enableNavbar, disableNavbar,dodge,dont_dodge,upd_centerPos, widthShrinkEffect, widthExtendEffect};
