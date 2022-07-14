var remover, zremover, startTime, mos;
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
remover(['.onesignal-slidedown-container', 'iframe', 'ins', '.adsbygoogle', '._popIn_recommend_article']);
zremover = debounce(350, function(){
  return Array.from(document.querySelectorAll('*')).map(function(n){
    var style, zidx;
    style = window.getComputedStyle(n);
    zidx = style.zIndex;
    if ((zidx && !isNaN(+zidx) && +zidx > 500) || style.position === 'fixed') {
      return n.parentNode.removeChild(n);
    }
  });
});
startTime = Date.now();
mos = new MutationObserver(function(){
  var curTime;
  curTime = Date.now();
  if (curTime - startTime > 15000) {
    return;
  }
  console.log("[cleanext] change detected. start cleaner ...");
  remover(['.onesignal-slidedown-container', 'iframe', 'ins', '.adsbygoogle']);
  return zremover();
});
mos.observe(document.body, {
  childList: true,
  subtree: true
});