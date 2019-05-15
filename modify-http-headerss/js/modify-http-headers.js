/**
 * Created by youfu on 7/29/2014.
 */

$(document).ready(function(){
    var mhh = localStorage['salmonMHH'];
    if(mhh == undefined) {
         window.open('options.html');
         window.close();
    }
    var headerInfo = JSON.parse(mhh);
    var info='';

    info+="<table><tr>";
    if (headerInfo[0].notChanged) {
        info += '<input id="'+1+'" type="checkbox" name='+"header" +'>Change Header';
    } else {
        info += '<input id="'+1+'" type="checkbox" checked name='+ "header"+'>Change Header';
    }

    info+='</tr><tr>';

    if (headerInfo[1].notChanged) {
        info += '<input id="'+2+'" type="checkbox" name='+"js" +'>Change js';
    } else {
        info += '<input id="'+2+'" type="checkbox" checked name='+ "js"+'>Change js';
    }
info+="</tr><br>"+localStorage['lasturl'];
    info+="</table>";


    $('#div1').html(info);
    $('input[type=checkbox]').on('change', function(){
        var name = $(this).attr('name');
        var custom = $(this).prop('checked');
        if(name=="header"){
            headerInfo[0].notChanged = !custom;
        }
        if(name=="js"){
            headerInfo[1].notChanged = !custom;
        }
        localStorage.salmonMHH = JSON.stringify(headerInfo);
    });

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        localStorage.setItem('lasturl',tabs[0].url);
    });




});
