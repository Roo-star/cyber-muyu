(function(){
  var STORE='muyu_v1';
  var COLORS=['#e8d4ff','#aaddff','#ffe4aa','#aaffcc','#ffaacc','#ccddff','#ffccaa'];
  function load(){try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch(e){return[]}}
  function save(a){try{localStorage.setItem(STORE,JSON.stringify(a))}catch(e){}}

  function init(){
    var panel=document.getElementById('phrase-panel');
    var ci=document.getElementById('ci');
    if(!panel||!ci){setTimeout(init,300);return;}

    var sep=document.createElement('div');
    sep.style.cssText='display:none;height:1px;background:rgba(255,200,100,.08);margin:4px 0;';
    panel.appendChild(sep);

    var box=document.createElement('div');
    box.style.cssText='width:100%;display:flex;flex-direction:column;gap:3px;';
    panel.appendChild(box);

    var list=load();

    function clearAllOn(){document.querySelectorAll('.pb').forEach(function(b){b.classList.remove('on');});}
    function setSel(t,c){if(window._muyu){window._muyu.p=t;window._muyu.c=c;}}
    function clrSel(){if(window._muyu){window._muyu.p=null;window._muyu.c=null;}}
    function getSel(){return window._muyu?window._muyu.p:null;}

    function render(){
      box.innerHTML='';
      sep.style.display=list.length?'block':'none';
      list.forEach(function(item,idx){
        var row=document.createElement('div');
        row.style.cssText='display:flex;align-items:center;gap:2px;';
        var btn=document.createElement('button');
        btn.className='pb';
        btn.dataset.t=item.t;
        btn.dataset.c=item.c;
        btn.textContent=item.t;
        btn.title=item.t;
        btn.style.cssText='flex:1;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;';
        btn.addEventListener('click',function(){
          if(getSel()===item.t){btn.classList.remove('on');clrSel();}
          else{clearAllOn();btn.classList.add('on');setSel(item.t,item.c);}
        });
        var del=document.createElement('button');
        del.textContent='\u00d7';
        del.style.cssText='flex-shrink:0;width:18px;height:18px;background:none;border:none;color:rgba(255,100,100,.4);font-size:13px;cursor:pointer;padding:0;';
        del.addEventListener('mouseover',function(){del.style.color='rgba(255,80,80,.9)';});
        del.addEventListener('mouseout',function(){del.style.color='rgba(255,100,100,.4)';});
        del.addEventListener('click',function(e){
          e.stopPropagation();
          if(getSel()===item.t)clrSel();
          list.splice(idx,1);save(list);render();
        });
        row.appendChild(btn);row.appendChild(del);box.appendChild(row);
      });
    }
    render();

    ci.addEventListener('keydown',function(e){
      if(e.key!=='Enter')return;
      var raw=ci.value.trim();
      if(!raw)return;
      var full=raw+' +1';
      var col=COLORS[Math.floor(Math.random()*COLORS.length)];
      var found=false;
      for(var i=0;i<list.length;i++){if(list[i].t===full){col=list[i].c;found=true;break;}}
      if(!found){list.push({t:full,c:col});save(list);render();}
      setTimeout(function(){
        clearAllOn();setSel(full,col);
        box.querySelectorAll('.pb').forEach(function(b){if(b.dataset.t===full)b.classList.add('on');});
      },0);
    });
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
  else{init();}
})();