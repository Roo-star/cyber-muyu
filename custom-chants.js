// custom-chants.js
// 自定義文字記憶模組 — 完全獨立，不影響主程式
// 與主程式唯一的橋接：window._muyu.sel / window._muyu.col

(function() {
  'use strict';

  var STORE_KEY = 'muyu_custom_chants_v1';
  var COLORS = ['#e8d4ff','#aaddff','#ffe4aa','#aaffcc','#ffaacc','#ccddff','#ffccaa'];

  // ── 讀取/儲存 ──
  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
    catch(e) { return []; }
  }
  function save(arr) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); } catch(e) {}
  }

  // ── 等待 DOM 就緒 ──
  function init() {
    var panel = document.getElementById('phrase-panel');
    var ci    = document.getElementById('ci');
    if (!panel || !ci) { setTimeout(init, 200); return; }

    // 建立容器（插入 phrase-panel 底部）
    var container = document.createElement('div');
    container.id = 'cc-container';
    container.style.cssText = [
      'width:100%',
      'margin-top:0',
      'display:flex',
      'flex-direction:column',
      'gap:3px'
    ].join(';');
    panel.appendChild(container);

    // 分隔線（有內容才顯示）
    var divider = document.createElement('div');
    divider.id = 'cc-divider';
    divider.style.cssText = 'display:none;height:1px;background:rgba(255,200,100,.08);margin:4px 0 4px 0;width:100%;';
    panel.insertBefore(divider, container);

    var customs = load();

    // ── 清除所有 .pb 的 on 狀態（全域） ──
    function clearAll() {
      document.querySelectorAll('.pb').forEach(function(b) { b.classList.remove('on'); });
    }

    // ── 設定 selPhrase/selColor（透過橋接） ──
    function setSelected(text, color) {
      if (window._muyu) { window._muyu.sel = text; window._muyu.col = color; }
    }
    function clearSelected() {
      if (window._muyu) { window._muyu.sel = null; window._muyu.col = null; }
    }
    function getSelected() {
      return window._muyu ? window._muyu.sel : null;
    }

    // ── 渲染清單 ──
    function render() {
      container.innerHTML = '';
      divider.style.display = customs.length ? 'block' : 'none';

      customs.forEach(function(item, idx) {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:2px;width:100%;';

        var btn = document.createElement('button');
        btn.className = 'pb';
        btn.dataset.t = item.t;
        btn.dataset.c = item.c;
        btn.textContent = item.t;
        btn.title = item.t;
        btn.style.cssText = 'flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;';

        btn.addEventListener('click', function() {
          var cur = getSelected();
          if (cur === item.t) {
            btn.classList.remove('on');
            clearSelected();
          } else {
            clearAll();
            btn.classList.add('on');
            setSelected(item.t, item.c);
          }
        });

        var del = document.createElement('button');
        del.textContent = '×';
        del.title = '移除';
        del.style.cssText = [
          'flex-shrink:0',
          'width:18px','height:18px',
          'background:none','border:none',
          'color:rgba(255,100,100,.4)',
          'font-size:13px','line-height:18px',
          'text-align:center','cursor:pointer',
          'padding:0','font-family:monospace',
          'transition:color .15s'
        ].join(';');
        del.addEventListener('mouseover', function() { del.style.color = 'rgba(255,80,80,.9)'; });
        del.addEventListener('mouseout',  function() { del.style.color = 'rgba(255,100,100,.4)'; });
        del.addEventListener('click', function(e) {
          e.stopPropagation();
          if (getSelected() === item.t) clearSelected();
          customs.splice(idx, 1);
          save(customs);
          render();
        });

        row.appendChild(btn);
        row.appendChild(del);
        container.appendChild(row);
      });
    }

    render();

    // ── 監聽 Enter 發送，加入清單 ──
    ci.addEventListener('keydown', function(e) {
      if (e.key !== 'Enter') return;
      var raw = ci.value.trim();
      if (!raw) return;

      var full  = raw + ' +1';
      var color = COLORS[Math.floor(Math.random() * COLORS.length)];

      // 去重
      var exists = customs.some(function(c) { return c.t === full; });
      if (!exists) {
        customs.push({ t: full, c: color });
        save(customs);
        render();
      } else {
        // 已存在：找到它的顏色
        for (var i = 0; i < customs.length; i++) {
          if (customs[i].t === full) { color = customs[i].c; break; }
        }
      }

      // 自動選中此項
      setTimeout(function() {
        clearAll();
        setSelected(full, color);
        // 找到對應按鈕點亮
        container.querySelectorAll('.pb').forEach(function(b) {
          if (b.dataset.t === full) b.classList.add('on');
        });
      }, 0);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
