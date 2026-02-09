console.log('content script loaded')

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'HELLO_FROM_POPUP') {
    alert('来自 Vue 插件 popup 的消息 👋')
  }
})
