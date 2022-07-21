var message, view;
message = function(payload){
  payload == null && (payload = {});
  return new Promise(function(res, rej){
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs){
      return chrome.tabs.sendMessage(tabs[0].id, payload);
    });
    return res();
  });
};
view = new ldview({
  root: document.body,
  action: {
    click: {
      clean: function(){
        return message({
          action: 'clean'
        });
      },
      blacklist: function(){
        return message({
          action: 'blacklist'
        });
      }
    }
  }
});