/* ==========================================================
   站点自定义脚本
   1) 私信表单：通过 FormSubmit 直接发到站长邮箱（无需后端）
   2) 评论未配置时的友好提示
   ========================================================== */
(function () {
  'use strict'

  var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

  /* ---------------- 私信表单 ---------------- */
  var cfg = window.DM_CONFIG || {}
  var ownerEmail = String(cfg.ownerEmail || '').trim()
  var form = document.getElementById('dm-form')
  var statusEl = document.getElementById('dm-status')
  var submitBtn = document.getElementById('dm-submit')
  var mailtoEl = document.getElementById('dm-mailto')

  function setStatus (msg, type) {
    if (!statusEl) return
    statusEl.textContent = msg || ''
    statusEl.className = 'dm-status' + (type ? ' dm-status--' + type : '')
  }

  if (form) {
    var configured = EMAIL_RE.test(ownerEmail)

    if (configured && mailtoEl) {
      mailtoEl.href = 'mailto:' + ownerEmail
      mailtoEl.textContent = ownerEmail
    }

    if (!configured) {
      if (submitBtn) submitBtn.disabled = true
      setStatus('私信通道正在配置中，暂时请通过 GitHub 联系我。', 'info')
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault()
      if (!configured) return

      var name = (document.getElementById('dm-name') || {}).value || ''
      var email = (document.getElementById('dm-email') || {}).value || ''
      var message = (document.getElementById('dm-message') || {}).value || ''
      var honey = (form.querySelector('[name="_honey"]') || {}).value || ''

      name = name.trim()
      email = email.trim()
      message = message.trim()

      if (honey) return // 机器人，静默丢弃
      if (!message) {
        setStatus('内容不能为空。', 'error')
        return
      }
      if (email && !EMAIL_RE.test(email)) {
        setStatus('邮箱格式不正确。', 'error')
        return
      }

      if (submitBtn) {
        submitBtn.disabled = true
        submitBtn.textContent = '发送中…'
      }
      setStatus('', '')

      var done = function (ok, errMsg) {
        if (submitBtn) {
          submitBtn.disabled = false
          submitBtn.textContent = '发送私信'
        }
        if (ok) {
          setStatus('私信已发送，我会尽快回复你。', 'success')
          form.reset()
        } else {
          setStatus('发送失败（' + errMsg + '），稍后重试，或直接发邮件到 ' + ownerEmail + '。', 'error')
        }
      }

      if (cfg.mode === 'mailto') {
        var subject = encodeURIComponent('博客私信' + (name ? '：' + name : ''))
        var body = encodeURIComponent(message + '\n\n—— 来自博客私信' + (email ? '\n回复邮箱：' + email : ''))
        window.location.href = 'mailto:' + ownerEmail + '?subject=' + subject + '&body=' + body
        done(true)
        return
      }

      fetch('https://formsubmit.co/ajax/' + encodeURIComponent(ownerEmail), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: '博客私信' + (name ? '：' + name : ''),
          _template: 'table',
          _captcha: 'false',
          name: name || '匿名访客',
          email: email || '未填写',
          message: message
        })
      })
        .then(function (res) {
          return res.json().catch(function () { return {} }).then(function (data) {
            if (!res.ok || (data && data.success === 'false')) {
              throw new Error(data.message || ('HTTP ' + res.status))
            }
            done(true)
          })
        })
        .catch(function (err) {
          done(false, err && err.message ? err.message : '网络错误')
        })
    })
  }

  /* ---------------- 评论未配置时的提示 ---------------- */
  var tries = 0
  var timer = setInterval(function () {
    var wrap = document.getElementById('giscus-wrap')
    if (!wrap) {
      if (++tries > 15) clearInterval(timer)
      return
    }
    var script = wrap.querySelector('script[src*="giscus"]')
    if (!script) {
      if (++tries > 15) clearInterval(timer)
      return
    }
    clearInterval(timer)
    if (!script.getAttribute('data-category-id')) {
      wrap.innerHTML =
        '<div class="dm-notice">评论系统即将上线，想留言可以先 <a href="/message/">给我发一条私信</a>。</div>'
    }
  }, 200)

  /* ---------------- 微信联系弹窗 ---------------- */
  var WECHAT = {
    id: '15605021185',
    // 可选：把微信二维码图片放到 source/img/wechat-qr.png，即可在弹窗中展示
    qr: '/img/wechat-qr.png'
  }

  var wechatModal = null

  function buildWechatModal () {
    if (wechatModal) return wechatModal

    var mask = document.createElement('div')
    mask.className = 'dm-modal-mask'
    mask.id = 'dm-wechat-modal'
    mask.innerHTML =
      '<div class="dm-modal" role="dialog" aria-modal="true" aria-label="添加我的微信">' +
      '  <button class="dm-modal-close" type="button" aria-label="关闭">×</button>' +
      '  <div class="dm-modal-icon"><i class="fab fa-weixin"></i></div>' +
      '  <h3 class="dm-modal-title">添加我的微信</h3>' +
      '  <p class="dm-modal-desc">打开微信 → 添加朋友 → 搜索微信号 / 手机号</p>' +
      '  <div class="dm-wechat-id">' +
      '    <span id="dm-wechat-value">' + WECHAT.id + '</span>' +
      '    <button class="dm-copy" id="dm-copy-wechat" type="button">复制</button>' +
      '  </div>' +
      '  <div class="dm-wechat-qr" hidden><img alt="微信二维码"></div>' +
      '  <p class="dm-modal-tip">添加时请备注「博客」，方便我通过。</p>' +
      '</div>'

    mask.addEventListener('click', function (e) {
      if (e.target === mask || (e.target.closest && e.target.closest('.dm-modal-close'))) {
        closeWechat()
      }
    })

    var copyBtn = mask.querySelector('#dm-copy-wechat')
    copyBtn.addEventListener('click', function () {
      var text = WECHAT.id
      function done () {
        copyBtn.textContent = '已复制'
        setTimeout(function () { copyBtn.textContent = '复制' }, 2000)
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback)
      } else {
        fallback()
      }
      function fallback () {
        var ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        try { document.execCommand('copy'); done() } catch (e) { copyBtn.textContent = '请手动复制' }
        document.body.removeChild(ta)
      }
    })

    var qrWrap = mask.querySelector('.dm-wechat-qr')
    var qrImg = qrWrap.querySelector('img')
    qrImg.onload = function () { qrWrap.hidden = false }
    qrImg.onerror = function () { qrWrap.hidden = true }
    qrImg.src = WECHAT.qr

    document.body.appendChild(mask)
    wechatModal = mask
    return mask
  }

  function openWechat () {
    var mask = buildWechatModal()
    mask.classList.add('is-open')
    document.body.classList.add('dm-modal-open')
  }

  function closeWechat () {
    if (!wechatModal) return
    wechatModal.classList.remove('is-open')
    document.body.classList.remove('dm-modal-open')
  }

  document.addEventListener('click', function (e) {
    var target = e.target
    if (!target || !target.closest) return
    var trigger = target.closest('a[title="WeChat"], a[href$="#wechat"]')
    if (trigger) {
      e.preventDefault()
      openWechat()
    }
  })

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeWechat()
  })

  // 支持分享链接 https://zhshen1949.github.io/#wechat 直接打开弹窗
  if (window.location.hash === '#wechat') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', openWechat)
    } else {
      openWechat()
    }
  }
})()
