blacklist = {items: []}
console.log "[cleanext] start.."
remover = (sel) ->
  sel = (if Array.isArray(sel) => sel else [sel]).filter -> it
  sel.map (s) ->
    Array.from(document.querySelectorAll(s)).map (n) -> n.parentNode.removeChild(n)

zremover = debounce 350, ->
  Array.from(document.querySelectorAll \*).map (n) ->
    style = window.getComputedStyle(n)
    zidx = style.zIndex
    if (zidx and !isNaN(+zidx) and +zidx > 500) or
    style.position == \fixed => n.parentNode.removeChild(n)

cleaner = (opt = {}) ->
  console.log "[cleanext] cleaner called with opt ", opt
  matched = !!blacklist.items
    .map -> new RegExp(it)
    .filter -> it.exec(window.location.host)
    .length
  if !(matched or opt.force) => return
  console.log "[cleanext] start cleaning ..."

  remover [
    '.onesignal-slidedown-container'
    'iframe'
    'ins'
    '.adsbygoogle'
    '._popIn_recommend_article'
  ]
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
cleaner-deb = debounce 500, -> setTimeout (-> cleaner! ), 0

#chrome.storage.sync.set {blacklist: []}
chrome.storage.sync.get <[blacklist]>, (ret) ->
  blacklist.items = ret.blacklist or []
  console.log "[cleanext] blacklist: ", blacklist.items
  chrome.storage
start-time = Date.now!
mos = new MutationObserver cleaner-deb

mos.observe document.body, {childList: true, subtree: true}

chrome.runtime.onMessage.addListener (msg = {}, sender, res) ->
  if msg.action == \blacklist =>
    hosts = window.location.host.split('.')
    hosts = [hosts[i] for i from hosts.length - 3 til hosts.length].filter(->it)
    rule = "^(.+\\.)*#{hosts.join('\\.')}"
    if !(~blacklist.items.indexOf rule) =>
      console.log "[cleanext] add site #{window.location.host} into blacklist ..."
      blacklist.items.push rule
      chrome.storage.sync.set {blacklist: blacklist.items}, ->
        console.log "[cleanext] added. force clean now ..."
        cleaner force: true
    else
      console.log "[cleanext] site #{window.location.host} is already in blacklist."
  else if msg.action = \clean => cleaner force: true


