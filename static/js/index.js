import {widthShrinkEffect} from './base.js';
function setSelectPanelWidth(){
    $('.select-panel').each(function(){
        let left_panel_width = $(this).children('.left-panel').innerWidth();
        let right_panel_width = $(this).children('.right-panel').innerWidth();
        $(this).data('left-panel_width',left_panel_width); 
        $(this).data('right-panel_width',right_panel_width); 
        $(this).children('.left-panel').css('width',left_panel_width);
        $(this).children('.right-panel').css('width',right_panel_width);
        $(this).css('--data-shrinkWidth',(left_panel_width+right_panel_width)+'px');
        $(this).css('--data-extendWidth','100%');
    });
}
function setSelectPanelBorder(){
    setSelectPanelWidth();
    $('.select-panel').each(function(){
        $(this).css('border-top-left-radius',$(this).data('left-panel_width'));
        $(this).css('border-bottom-left-radius',$(this).data('left-panel_width'));
        $(this).css('border-top-right-radius',$(this).data('right-panel_width'));
        $(this).css('border-bottom-right-radius',$(this).data('right-panel_width'));
        let mid = $(this).children('.middle-panel');
        mid.css('left',$(this).data('left-panel_width')).css('right',$(this).data('right-panel_width'));
    });
}
$(document).ready(function(){
    $(window).on('resize',setSelectPanelBorder);
    setSelectPanelWidth();
    setSelectPanelBorder();
    widthShrinkEffect();
});