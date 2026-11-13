---
title: 私信
date: 2026-11-13 16:10:00
comments: false
description: 给站长发一条只有我能看到的私信。
---

想说的话，悄悄告诉我。这里的消息**只有我能看到**，不会公开。

<div class="dm-app" id="dm-app">
  <form id="dm-form" class="dm-form" novalidate>
    <div class="dm-field">
      <label for="dm-name">称呼</label>
      <input id="dm-name" name="name" type="text" maxlength="40" placeholder="怎么称呼你（选填）" autocomplete="name">
    </div>
    <div class="dm-field">
      <label for="dm-email">邮箱</label>
      <input id="dm-email" name="email" type="email" maxlength="80" placeholder="方便我回复你（选填）" autocomplete="email">
    </div>
    <div class="dm-field">
      <label for="dm-message">内容 <span class="dm-required">*</span></label>
      <textarea id="dm-message" name="message" rows="6" maxlength="2000" required placeholder="想对我说的话，比如合作、建议、问题，或者只是打个招呼…"></textarea>
    </div>
    <input type="text" name="_honey" class="dm-honey" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="dm-actions">
      <button type="submit" id="dm-submit" class="dm-submit">发送私信</button>
      <span class="dm-hint">内容直接送达我的邮箱，不会出现在网站上</span>
    </div>
    <div id="dm-status" class="dm-status" role="status" aria-live="polite"></div>
  </form>
  <p class="dm-alt">也可以直接发邮件：<a id="dm-mailto" href="https://github.com/ZHshen1949">GitHub 联系我</a></p>
</div>

<script>
  window.DM_CONFIG = {
    // ← 把这里改成你的邮箱，私信会通过 FormSubmit 转发到该邮箱
    ownerEmail: '',
    // 'formsubmit'：网页内直接发送（推荐）；'mailto'：打开本地邮件客户端
    mode: 'formsubmit'
  }
</script>
