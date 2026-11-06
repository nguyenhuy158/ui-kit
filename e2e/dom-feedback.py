import os
import subprocess
from pathlib import Path

base = os.environ.get("E2E_BASE_URL", "http://127.0.0.1:5173")
env = dict(os.environ, BU_NAME="ui-kit-dom-feedback", BU_CDP_URL="http://127.0.0.1:9223", BH_TAB_MARKER="0")
artifacts = Path(os.environ.get("E2E_ARTIFACTS", "/tmp/ui-kit-dom-feedback"))
artifacts.mkdir(parents=True, exist_ok=True)


def browser(code):
    result = subprocess.run(["browser-use"], input=code, text=True, capture_output=True, env=env, timeout=29)
    assert result.returncode == 0, result.stdout + result.stderr
    print(result.stdout)


try:
    browser(f"new_tab({base + '/dom-demo.html'!r})\nwait_for_load()")
    browser("""
import time
cdp('Emulation.setDeviceMetricsOverride', width=1280, height=900, deviceScaleFactor=1, mobile=False)
js("for(let i=0;i<20;i++) document.querySelector('form').requestSubmit()")
assert js("document.querySelector('#count').value") == '1'
assert js("document.querySelector('form button').disabled && document.querySelector('form button').getAttribute('aria-busy') === 'true'")
time.sleep(1.4)
assert js("!document.querySelector('form button').disabled && document.querySelector('.ui-toast').textContent.includes('Đã lưu')")
js("document.querySelector('input').checked = true; document.querySelector('form').requestSubmit()")
time.sleep(1.4)
assert js("document.querySelector('#count').value") == '2'
assert js("!document.querySelector('form button').disabled && document.querySelector('[data-tone=error]') !== null")
js("document.querySelector('input').checked = false; document.querySelector('form').requestSubmit()")
time.sleep(1.4)
assert js("document.querySelector('#count').value") == '3'
assert js("!document.querySelector('form button').disabled")
assert js("import('/src/dom/feedback.mjs').then(({createToasts,createActionGate}) => { const gate=createActionGate(); const release=gate.claim('x'); if(gate.claim('x') !== null) return false; release(); const next=gate.claim('x'); release(); if(!gate.busy('x')) return false; next(); const toast=createToasts(); toast.show('info','<img src=x onerror=alert(1)>',{duration:0}); toast.show('info','<img src=x onerror=alert(1)>',{duration:0}); const region=[...document.querySelectorAll('.ui-toasts')].at(-1); const safe=region.querySelectorAll('img').length===0 && region.children.length===1; region.querySelector('button').click(); const closed=region.children.length===0; toast.destroy(); return safe && closed; })")
""" + f"screenshot({str(artifacts / 'desktop.png')!r})")
    browser("""
import time
cdp('Emulation.setDeviceMetricsOverride', width=390, height=844, deviceScaleFactor=1, mobile=True)
js("document.documentElement.classList.add('dark')")
time.sleep(.2)
assert js("document.documentElement.scrollWidth <= window.innerWidth")
assert js("document.querySelector('form button').getBoundingClientRect().height >= 44")
""" + f"screenshot({str(artifacts / 'mobile-dark.png')!r})")
    print("PASS: rapid submit, pending state, success/error recovery, gate release, text escaping, mobile and dark mode")
finally:
    browser("close_tab()")
