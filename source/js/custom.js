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
})()
