var blacklist, remover, zremover, cleaner, cleanerDeb, startTime, mos;
blacklist = {
  items: []
};
console.log("[cleanext] start..");
remover = function(sel){
  sel = (Array.isArray(sel)
    ? sel
    : [sel]).filter(function(it){
    return it;
  });
  return sel.map(function(s){
    return Array.from(document.querySelectorAll(s)).map(function(n){
      return n.parentNode.removeChild(n);
    });
  });
};
zremover = debounce(350, function(){
  return Array.from(document.querySelectorAll('*')).map(function(n){
    var style, zidx;
    if (!(style = window.getComputedStyle(n))) {
      return;
    }
    zidx = style.zIndex;
    if ((zidx && !isNaN(+zidx) && +zidx > 500) || style.position === 'fixed') {
      return n.parentNode.removeChild(n);
    }
  });
});
cleaner = function(opt){
  var matched, curTime;
  opt == null && (opt = {});
  console.log("[cleanext] cleaner called with opt ", opt);
  matched = !!blacklist.items.map(function(it){
    return new RegExp(it);
  }).filter(function(it){
    return it.exec(window.location.host);
  }).length;
  if (!(matched || opt.force)) {
    return;
  }
  console.log("[cleanext] start cleaning ...");
  remover(['.onesignal-slidedown-container', 'iframe', 'ins', '.adsbygoogle', '._popIn_recommend_article']);
  curTime = Date.now();
  if (curTime - startTime > 15000) {
    return;
  }
  console.log("[cleanext] change detected. start cleaner ...");
  remover(['.onesignal-slidedown-container', 'iframe', 'ins', '.adsbygoogle']);
  return zremover();
};
cleanerDeb = debounce(500, function(){
  return setTimeout(function(){
    return cleaner();
  }, 0);
});
chrome.storage.sync.get(['blacklist'], function(ret){
  blacklist.items = ret.blacklist || [];
  console.log("[cleanext] blacklist: ", blacklist.items);
  return chrome.storage;
});
startTime = Date.now();
mos = new MutationObserver(cleanerDeb);
mos.observe(document.body, {
  childList: true,
  subtree: true
});
chrome.runtime.onMessage.addListener(function(msg, sender, res){
  var hosts, i, rule;
  msg == null && (msg = {});
  if (msg.action === 'blacklist') {
    hosts = window.location.host.split('.');
    hosts = (function(){
      var i$, to$, results$ = [];
      for (i$ = hosts.length - 3, to$ = hosts.length; i$ < to$; ++i$) {
        i = i$;
        results$.push(hosts[i]);
      }
      return results$;
    }()).filter(function(it){
      return it;
    });
    rule = "^(.+\\.)*" + hosts.join('\\.');
    if (!~blacklist.items.indexOf(rule)) {
      console.log("[cleanext] add site " + window.location.host + " into blacklist ...");
      blacklist.items.push(rule);
      return chrome.storage.sync.set({
        blacklist: blacklist.items
      }, function(){
        console.log("[cleanext] added. force clean now ...");
        return cleaner({
          force: true
        });
      });
    } else {
      return console.log("[cleanext] site " + window.location.host + " is already in blacklist.");
    }
  } else if (msg.action = 'clean') {
    return cleaner({
      force: true
    });
  }
});