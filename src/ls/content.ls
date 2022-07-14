console.log "[cleanext] start.."
remover = (sel) ->
  sel = (if Array.isArray(sel) => sel else [sel]).filter -> it
  sel.map (s) ->
    Array.from(document.querySelectorAll(s)).map (n) -> n.parentNode.removeChild(n)

remover [
  '.onesignal-slidedown-container'
  'iframe'
  'ins'
  '.adsbygoogle'
  '._popIn_recommend_article'
]

zremover = debounce 350, ->
  Array.from(document.querySelectorAll \*).map (n) ->
    style = window.getComputedStyle(n)
    zidx = style.zIndex
    if (zidx and !isNaN(+zidx) and +zidx > 500) or
    style.position == \fixed => n.parentNode.removeChild(n)

start-time = Date.now!
mos = new MutationObserver ->
  cur-time = Date.now!
  if cur-time - start-time > 15000 => return
  console.log "[cleanext] change detected. start cleaner ..."
  remover [
    '.onesignal-slidedown-container'
    'iframe'
    'ins'
    '.adsbygoogle'
  ]
  zremover!

mos.observe document.body, {childList: true, subtree: true}
