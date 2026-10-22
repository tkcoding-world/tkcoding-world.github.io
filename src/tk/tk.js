/*!
 * TK UI v1.0 — 交互脚本（可选，约 2KB）
 * 放在 <head> 中引入即可：<script src="tk/tk.js"></script>
 * 所有交互通过 data-* 属性声明，无需手动初始化。
 */
(function (w, d) {
  'use strict';
  var root = d.documentElement;
  var MODE_KEY = 'tk-mode';

  // 尽早应用用户选择的明暗模式，避免页面闪烁
  root.classList.add('tk-js');
  try {
    var saved = localStorage.getItem(MODE_KEY);
    if (saved) root.dataset.mode = saved;
  } catch (e) {}

  function isDark() {
    return root.dataset.mode ? root.dataset.mode === 'dark' : w.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function selectTab(tab) {
    var box = tab.closest('.tabs');
    if (!box) return;
    box.querySelectorAll('.tab').forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on);
      var panel = d.getElementById(t.dataset.tab);
      if (panel) panel.hidden = !on;
    });
  }

  var TK = {
    /** 切换明暗模式，并记住选择 */
    toggleMode: function () {
      var mode = isDark() ? 'light' : 'dark';
      root.dataset.mode = mode;
      try { localStorage.setItem(MODE_KEY, mode); } catch (e) {}
    },
    /** 运行时修改主题色：TK.setPrimary('#e11d48')，可传入元素以局部生效 */
    setPrimary: function (color, el) {
      (el || root).style.setProperty('--tk-primary', color);
    },
    /** 打开 / 关闭 <dialog class="modal"> */
    open: function (id) {
      var el = d.getElementById(id);
      if (el && el.showModal) el.showModal();
    },
    close: function (id) {
      var el = d.getElementById(id);
      if (el) el.close();
    },
    /** 轻提示：TK.toast('已保存', 'success'|'warning'|'danger'|'info', 毫秒) */
    toast: function (msg, type, ms) {
      var host = d.querySelector('.toast-host');
      if (!host) {
        host = d.createElement('div');
        host.className = 'toast-host';
        host.setAttribute('aria-live', 'polite');
        d.body.appendChild(host);
      }
      var el = d.createElement('div');
      el.className = 'toast' + (type ? ' ' + type : '');
      el.textContent = msg;
      host.appendChild(el);
      setTimeout(function () {
        el.classList.add('out');
        setTimeout(function () { el.remove(); }, 260);
      }, ms || 2800);
    }
  };

  // 事件委托：一个监听器处理所有声明式交互
  d.addEventListener('click', function (e) {
    var t = e.target, b;
    if (!t.closest) return;

    if ((b = t.closest('[data-tk-mode]'))) TK.toggleMode();

    if ((b = t.closest('[data-tk-nav]'))) {
      var nav = b.closest('.navbar');
      b.setAttribute('aria-expanded', nav.classList.toggle('open'));
    } else if (t.closest('.navbar.open .nav-menu a')) {
      t.closest('.navbar').classList.remove('open');
    }

    if ((b = t.closest('[data-tk-open]'))) TK.open(b.dataset.tkOpen);
    if ((b = t.closest('[data-tk-close]'))) b.closest('dialog').close();
    // 点击遮罩关闭对话框（内容区域铺满 dialog，因此只有遮罩会命中 dialog 本身）
    if (t.tagName === 'DIALOG' && t.classList.contains('modal')) t.close();

    if ((b = t.closest('[data-tk-toast]'))) TK.toast(b.dataset.tkToast, b.dataset.type);

    if ((b = t.closest('.tab[data-tab]'))) selectTab(b);
  });

  d.addEventListener('DOMContentLoaded', function () {
    // 初始化标签页：没有选中项时默认选中第一个
    d.querySelectorAll('.tabs').forEach(function (box) {
      var tab = box.querySelector('.tab[aria-selected="true"]') || box.querySelector('.tab');
      if (tab) selectTab(tab);
    });

    // 滚动进入视口时显示 .reveal 元素
    var items = d.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in w)) {
      items.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  });

  w.TK = TK;
})(window, document);
