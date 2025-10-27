#!/usr/bin/env tsx
import express from 'express'
import process from 'process'

const app = express()
const PORT = process.env.PORT ? Number(process.env.PORT) : 5178

function makeInjectorScript() {
  return `
  <script>
  (function(){
    function qs(el){try{return el.tagName?el.tagName.toLowerCase():'n/a'}catch(e){return'n/a'}}
    function cssPath(el){if(!el) return null; if(el.id) return '#'+el.id; var path=[]; while(el&&el.nodeType===1){var selector=el.tagName.toLowerCase(); if(el.className){selector+='.'+(''+el.className).trim().split(/\s+/).join('.');} var sib=el, nth=1; while(sib.previousElementSibling){sib=sib.previousElementSibling; if(sib.tagName===el.tagName) nth++;} if(nth>1) selector+=":nth-of-type("+nth+")"; path.unshift(selector); el=el.parentElement;} return path.join(' > ');}    
    function xpath(el){if(!el) return null; var segs=[]; for(;el&&el.nodeType===1;el=el.parentNode){var ix=1; for(var sib=el.previousSibling; sib; sib=sib.previousSibling){ if(sib.nodeType===1 && sib.nodeName===el.nodeName) ix++; } segs.unshift(el.nodeName.toLowerCase() + (ix>1?"["+ix+"]":"")); } return '/'+segs.join('/');}
    function attrs(el){var a={}; if(!el||!el.attributes) return a; for(var i=0;i<el.attributes.length;i++){var at=el.attributes[i]; a[at.name]=at.value} return a}
    function aria(el){var out={}; if(!el) return out; ['role','aria-label','aria-labelledby','aria-hidden','aria-describedby'].forEach(function(k){var v=el.getAttribute&&el.getAttribute(k); if(v!==null) out[k]=v}); return out}
    function rect(el){if(!el||!el.getBoundingClientRect) return null; var r=el.getBoundingClientRect(); return {x:Math.round(r.x), y:Math.round(r.y), width:Math.round(r.width), height:Math.round(r.height)}}
    function text(el){if(!el) return ''; try{return el.innerText||el.textContent||''}catch(e){return ''}}
    function indexInParent(el){if(!el||!el.parentElement) return 0; return Array.prototype.indexOf.call(el.parentElement.children, el)}
    function now(){return (new Date()).toISOString()}
    function copyToClipboard(text){var ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');}catch(e){console.warn('copy failed',e);} ta.remove()}
    function payloadFor(el){return {url:location.href, timestamp:now(), tag:qs(el), id:el.id||null, classes:el.className?el.className.split(/\s+/).filter(Boolean):[], cssSelector:cssPath(el), xpath:xpath(el), indexInParent:indexInParent(el), text:text(el), attributes:attrs(el), aria:aria(el), rect:rect(el)}}
    var captureActive=false; var overlay=null; var handler=null;
    function enableCapture(){ if(captureActive) return; captureActive=true; document.body.style.cursor='crosshair'; overlay=document.createElement('div'); overlay.style.position='fixed'; overlay.style.right='12px'; overlay.style.top='12px'; overlay.style.zIndex='999999'; overlay.style.background='rgba(0,0,0,0.6)'; overlay.style.color='white'; overlay.style.padding='6px 8px'; overlay.style.borderRadius='6px'; overlay.style.fontFamily='sans-serif'; overlay.style.fontSize='13px'; overlay.innerText='Capture mode: click any element'; document.body.appendChild(overlay); handler=function(e){ e.preventDefault(); e.stopPropagation(); var el=e.target; var p=payloadFor(el); copyToClipboard(JSON.stringify(p,null,2)); overlay.innerText='Captured '+(p.tag+(p.id?('#'+p.id):''))+" — copied to clipboard"; setTimeout(disableCapture,900); }; document.addEventListener('click', handler, true);}    
    function disableCapture(){ if(!captureActive) return; captureActive=false; document.body.style.cursor=''; if(overlay){overlay.remove(); overlay=null;} if(handler){document.removeEventListener('click', handler, true); handler=null;} }
    function addButton(){ try{var btn=document.createElement('button'); btn.id='__capture_toggle_btn'; btn.innerText='Capture element'; btn.style.position='fixed'; btn.style.right='12px'; btn.style.bottom='12px'; btn.style.zIndex='999999'; btn.style.padding='8px 10px'; btn.style.borderRadius='8px'; btn.style.border='none'; btn.style.background='#0b5cff'; btn.style.color='white'; btn.style.fontFamily='sans-serif'; btn.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)'; btn.addEventListener('click', function(e){ e.stopPropagation(); if(captureActive) disableCapture(); else enableCapture(); }); document.body.appendChild(btn);}catch(e){console.warn(e)} }
    addButton();
  })();
  </script>
  `
}

app.get('/view', async (req, res) => {
  const target = req.query.url as string
  if (!target) {
    res.status(400).send('Missing url param. Usage: /view?url=https://example.com')
    return
  }
  try {
    const resp = await fetch(target, { headers: { 'User-Agent': 'capture-proxy/1.0' } })
    const text = await resp.text()
    // inject <base> into head to make relative urls resolve to original site
    const urlObj = new URL(target)
    let out = text
    if (/<!doctype/i.test(out)) {
      // ok
    }
    // ensure there's a <head>, otherwise add one
    if (!/\<head[^>]*>/i.test(out)) {
      out = out.replace(/<html([^>]*)>/i, '<html$1><head></head>')
    }
  // insert base tag that preserves the original path so relative URLs and SPA navigation work
  const baseHref = urlObj.origin + (urlObj.pathname.endsWith('/') ? urlObj.pathname : urlObj.pathname + '/')
  out = out.replace(/<head([^>]*)>/i, `<head$1><base href="${baseHref}" />`)
    // inject our script before </body>
    const injector = makeInjectorScript()
    if (/<\/body>/i.test(out)) {
      out = out.replace(/<\/body>/i, injector + '</body>')
    } else {
      out = out + injector
    }
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.send(out)
  } catch (err:any) {
    res.status(500).send('Fetch error: ' + String(err))
  }
})

app.get('/', (_req, res) => {
  res.send(`<html><body><h3>Capture proxy</h3><p>Usage: /view?url=https://example.com</p></body></html>`)
})

app.listen(PORT, () => {
  console.log(`Capture proxy listening on http://localhost:${PORT}/ - open /view?url=...`)
})

// Allow running directly via `npx tsx tools/capture-proxy.ts`
