message = (payload  = {}) ->
  (res, rej) <- new Promise _
  chrome.tabs.query {active: true, currentWindow: true}, (tabs) ->
    chrome.tabs.sendMessage tabs.0.id, payload
  res!
view = new ldview do
  root: document.body
  action: click:
    clean: -> message {action: \clean}
    blacklist: -> message {action: \blacklist}
