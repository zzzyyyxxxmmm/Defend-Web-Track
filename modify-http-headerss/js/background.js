var filter = {
    urls: ["<all_urls>"],
    types: [ "main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
};

getUserAgent=function(){
  var myarray=new Array("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:59.0) Gecko/20100101 Firefox/59.0",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36");
  return myarray[Math.floor(Math.random()*8)];
}

getAccept=function(){
  var myarray=new Array("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "application/xml,application/xhtml+xml,text/html;q=0.9, text/plain;q=0.8,image/png,*/*;q=0.5",
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "image/jpeg, application/x-ms-application, image/gif, application/xaml+xml, image/pjpeg, application/x-ms-xbap, application/x-shockwave-flash, application/msword, */*",
  "text/html, application/xhtml+xml, image/jxr, */*",
  "text/html, application/xml;q=0.9, application/xhtml+xml, image/png, image/webp, image/jpeg, image/gif, image/x-xbitmap, */*;q=0.1");
  return myarray[Math.floor(Math.random()*6)];
}

getAcceptLanguage=function(){
  var myarray=new Array("de-DE",
  "en-US","zh-CN,zh"
);
return myarray[Math.floor(Math.random()*3)];
}


chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
    var url = details.url;
    var headerInfo = JSON.parse(localStorage['salmonMHH']);

    if(!headerInfo[1].notChanged){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});
      });
  }
    if (isChange(url)) {
      for (var j = 0; j < details.requestHeaders.length; j++) {

        if(!headerInfo[0].notChanged){
          if(details.requestHeaders[j].name=="User-Agent"){
            details.requestHeaders[j].value=getUserAgent();
            localStorage['lastUA']=details.requestHeaders[j].value;
          }
          if(details.requestHeaders[j].name=="Accept-Language"){
            details.requestHeaders[j].value=getAcceptLanguage();
            localStorage['lastAL']=details.requestHeaders[j].value;
          }
          if(details.requestHeaders[j].name=="Accept"){
            details.requestHeaders[j].value=getAccept();
            localStorage['lastA']=details.requestHeaders[j].value;
          }
        }
      }
    }
      else{
        for (var j = 0; j < details.requestHeaders.length; j++) {

          if(!headerInfo[0].notChanged){
            if(details.requestHeaders[j].name=="User-Agent"){
              details.requestHeaders[j].value=localStorage['lastUA'];
            }
            if(details.requestHeaders[j].name=="Accept-Language"){
              details.requestHeaders[j].value=localStorage['lastAL'];
            }
            if(details.requestHeaders[j].name=="Accept"){
              details.requestHeaders[j].value=localStorage['lastA'];
            }
          }
      }



    }
    return {requestHeaders: details.requestHeaders};
}, filter, ["blocking", "requestHeaders"]);

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
  console.log(tabs[0].url);
    localStorage.setItem('lasturl',tabs[0].url);
});


function isChange(_url)
{
  if(localStorage['lasturl']==undefined){
    return true;
  }
  var lasturl=localStorage.getItem('lasturl');
  if(lasturl.substr(0,10)==_url.substr(0,10)){
    return false;
  }
  else{
    return true;
  }
}

function randomIP()
{
    //perhaps has local area network ip address
     return Math.floor(Math.random()*225)+'.'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255)+'.'+Math.floor(Math.random()*255);
}
