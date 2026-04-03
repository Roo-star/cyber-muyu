// custom-chants.js — 與主程式橋接：window._muyu.p / window._muyu.c（對應 selPhrase / selColor）
try {
(function() {
  'use strict';

  var STORE_KEY = 'muyu_custom_chants_v1';
  var COLORS = ['#e8d4ff','#aaddff','#ffe4aa','#aaffcc','#ffaacc','#ccddff','#ffccaa'];

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function save(arr) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); } catch (e) {}
  }

  function init() {
    var panel = document.getElementById('phrase-panel');
    var ci = document.getElementById('ci');
    if (!panel || !ci) { setTimeout(init, 200); return; }
    if (document.getElementById('cc-container')) return;

    var container = document.createElement('div');
    container.id = 'cc-container';
    container.style.cssText = 'width:100%;margin-top:0;display:flex;flex-direction:column;gap:3px';
    panel.appendChild(container);

    var divider = document.createElement('div');
    divider.id = 'cc-divider';
    divider.style.cssText = 'display:none;height:1px;background:rgba(255,200,100,.08);margin:4px 0;width:100%';
    panel.insertBefore(divider, container);

    var customs = load();

    function clearAll() {
      document.querySelectorAll('.pb').forEach(function(b) { b.classList.remove('on'); });
    }
    function setSelected(text, color) {
      if (window._muyu) { window._muyu.p = text; window._muyu.c = color; }
    }
    function clearSelected() {
      if (window._muyu) { window._muyu.p = null; window._muyu.c = null; }
    }
    function getSelected() {
      return window._muyu ? window._muyu.p : null;
    }

    function render() {
      container.innerHTML = '';
      divider.style.display = customs.length ? 'block' : 'none';

      customs.forEach(function(item, idx) {
        var row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:2px;width:100%';

        var btn = document.createElement('button');
        btn.className = 'pb';
        btn.dataset.t = item.t;
        btn.dataset.c = item.c;
        btn.textContent = item.t;
        btn.title = item.t;
        btn.style.cssText = 'flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0';

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
        del.textContent = '\u00d7';
        del.title = '\u79fb\u9664';
        del.style.cssText = 'flex-shrink:0;width:18px;height:18px;background:none;border:none;color:rgba(255,100,100,.4);font-size:13px;line-height:18px;text-align:center;cursor:pointer;padding:0;font-family:monospace';
        del.addEventListener('mouseover', function() { del.style.color = 'rgba(255,80,80,.9)'; });
        del.addEventListener('mouseout', function() { del.style.color = 'rgba(255,100,100,.4)'; });
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

    // capture: true — 在主程式 bubble 處理 Enter 並清空輸入框「之前」執行，才能讀到文字
    ci.addEventListener('keydown', function(e) {
      if (e.key !== 'Enter') return;
      var raw = ci.value.trim();
      if (!raw) return;

      var full = raw + ' +1';
      var color = COLORS[Math.floor(Math.random() * COLORS.length)];

      var exists = customs.some(function(c) { return c.t === full; });
      if (!exists) {
        customs.push({ t: full, c: color });
        save(customs);
        render();
      } else {
        for (var i = 0; i < customs.length; i++) {
          if (customs[i].t === full) { color = customs[i].c; break; }
        }
      }

      setTimeout(function() {
        clearAll();
        setSelected(full, color);
        container.querySelectorAll('.pb').forEach(function(b) {
          if (b.dataset.t === full) b.classList.add('on');
        });
      }, 0);
    }, { capture: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
} catch (e) { console.warn('[custom-chants]', e); }
