import os
import subprocess
from pathlib import Path

base = os.environ.get("E2E_BASE_URL", "http://127.0.0.1:5179")
artifacts = Path(os.environ.get("E2E_ARTIFACTS", "/tmp/ui-kit-5-pickers"))
artifacts.mkdir(parents=True, exist_ok=True)
env = dict(os.environ, BU_NAME="ui-kit-5-e2e", BU_CDP_URL="http://127.0.0.1:9223", BH_TAB_MARKER="0")
helpers = '''
import time

def expect(expression):
    deadline=time.monotonic()+5
    while time.monotonic()<deadline:
        if js(expression): return
        time.sleep(.1)
    raise AssertionError(expression)

def click(name, role='button'):
    nodes=[n for n in cdp('Accessibility.getFullAXTree')['nodes'] if n.get('role',{}).get('value')==role and n.get('name',{}).get('value')==name]
    assert len(nodes)==1, (name,len(nodes))
    node=nodes[0]['backendDOMNodeId']
    cdp('DOM.scrollIntoViewIfNeeded',backendNodeId=node)
    box=cdp('DOM.getBoxModel',backendNodeId=node)['model']['content']
    click_at_xy(sum(box[0::2])/4,sum(box[1::2])/4)
    time.sleep(.15)

def key(value):
    cdp('Input.dispatchKeyEvent',type='keyDown',key=value,text=chr(13) if value=='Enter' else '')
    cdp('Input.dispatchKeyEvent',type='keyUp',key=value)
'''


def browser(name, code):
    result = subprocess.run(["browser-use"], input=helpers + code, text=True, capture_output=True, env=env, timeout=29)
    (artifacts / f"{name}.log").write_text(result.stdout + result.stderr)
    assert result.returncode == 0, result.stdout + result.stderr
    print("PASS", name, flush=True)


try:
    browser("open", f"new_tab({base + '/picker-demo.html'!r})\nwait_for_load()\nexpect(\"document.querySelector('h1') !== null\")")
    browser("listbox", '''
cdp('Emulation.setDeviceMetricsOverride',width=1280,height=960,deviceScaleFactor=1,mobile=False)
click('Lưu lựa chọn')
expect("document.querySelector('[role=alert]')?.textContent.includes('Vui lòng chọn')")
key('ArrowDown')
expect("document.querySelector('[role=listbox]') !== null")
key('ArrowDown')
expect("document.getElementById(document.activeElement.getAttribute('aria-activedescendant'))?.textContent.includes('FarmLink')")
key('End')
expect("document.getElementById(document.activeElement.getAttribute('aria-activedescendant'))?.textContent.includes('Dự án mẫu 16')")
assert js("(()=>{const list=document.querySelector('[role=listbox]').getBoundingClientRect(); const item=document.getElementById(document.activeElement.getAttribute('aria-activedescendant')).getBoundingClientRect();return item.top>=list.top && item.bottom<=list.bottom})()")
key('Home')
key('ArrowDown')
key('Enter')
expect("document.querySelector('[name=project]').value === 'fl'")
expect("document.querySelector('[role=listbox]') === null")
click('Lưu lựa chọn')
expect("document.querySelector('output').textContent.includes('fl')")
assert js("document.querySelectorAll('[role=combobox]')[1].disabled")
click('Dự án','combobox')
key('Home')
key('Escape')
assert js("document.querySelector('[name=project]').value === 'fl'")
''')
    browser("range-across-month", '''
click('Khoảng thực hiện')
expect("document.querySelector('[role=dialog]') !== null")
click('28/11/2026')
assert js("document.querySelector('#range-value').textContent") == '2026-11-06 → 2026-11-15'
click('Tháng sau')
click('03/12/2026')
expect("document.querySelector('#range-value').textContent === '2026-11-28 → 2026-12-03'")
assert js("document.activeElement.getAttribute('aria-haspopup') === 'dialog'")
click('Khoảng thực hiện')
click('29/11/2026')
key('Escape')
assert js("document.querySelector('#range-value').textContent") == '2026-11-28 → 2026-12-03'
click('Khoảng thực hiện')
click('Tháng sau')
click('12/12/2026')
click('04/12/2026')
expect("document.querySelector('#range-value').textContent === '2026-12-04 → 2026-12-12'")
click('Khoảng thực hiện')
click('05/12/2026')
click('05/12/2026')
expect("document.querySelector('#range-value').textContent === '2026-12-05 → 2026-12-05'")
''')
    browser("calendar-keyboard-bounds", '''
click('Khoảng thực hiện')
key('ArrowRight')
expect("document.activeElement.dataset.date === '2026-12-06'")
key('Enter')
key('ArrowRight')
key('Enter')
expect("document.querySelector('#range-value').textContent === '2026-12-06 → 2026-12-07'")
click('Khoảng thực hiện')
key('PageDown')
expect("document.activeElement.dataset.date === '2026-12-31'")
key('ArrowRight')
assert js("document.activeElement.dataset.date") == '2026-12-31'
key('PageUp')
expect("document.activeElement.dataset.date === '2026-11-30'")
key('PageUp')
expect("document.activeElement.dataset.date === '2026-11-01'")
key('ArrowLeft')
assert js("document.activeElement.dataset.date") == '2026-11-01'
key('Escape')
click('Một ngày')
key('ArrowRight')
expect("document.activeElement.dataset.date === '2028-02-29'")
key('Enter')
expect("document.querySelector('[aria-haspopup=dialog]').textContent.includes('06/12/2026')")
click('Một ngày')
assert js("[...document.querySelectorAll('button[data-date]')].find(b=>b.dataset.date==='2028-02-29').getAttribute('aria-pressed')") == 'true'
assert js("[...document.querySelectorAll('[role=dialog] button')].find(b=>b.textContent==='Hôm nay').disabled")
key('Escape')
''')
    browser("textarea", r''' 
click('Checklist tự giãn','textbox')
initial=js("document.querySelector('textarea').clientHeight")
cdp('Input.dispatchKeyEvent',type='keyDown',key='a',code='KeyA',modifiers=4,commands=['selectAll'])
cdp('Input.dispatchKeyEvent',type='keyUp',key='a',code='KeyA',modifiers=4)
cdp('Input.insertText',text='\n'.join(['Dòng checklist dài để kiểm tra chiều cao tự động.']*30))
expect('document.querySelector("textarea").clientHeight > 500')
assert js('document.querySelector("textarea").scrollHeight <= document.querySelector("textarea").clientHeight + 1')
click('Rút gọn nội dung')
expect('document.querySelector("textarea").clientHeight < 200')
assert js('document.querySelector("textarea").value') == 'Một dòng ngắn'
''')
    browser("desktop-evidence", f"goto_url({base + '/picker-demo.html'!r})\nexpect(\"document.querySelector('h1') !== null\")\nclick('Khoảng thực hiện')\nscreenshot({str(artifacts / 'range-desktop.png')!r})\nkey('Escape')\nclick('Dự án','combobox')\nscreenshot({str(artifacts / 'select-desktop.png')!r})\nkey('Escape')")
    browser("mobile-evidence", '''
cdp('Emulation.setDeviceMetricsOverride',width=390,height=844,deviceScaleFactor=1,mobile=True)
click('Sáng / tối')
time.sleep(.2)
click('Khoảng thực hiện')
expect('document.documentElement.scrollWidth <= innerWidth')
''' + f"screenshot({str(artifacts / 'range-mobile-dark.png')!r})\nkey('Escape')\nclick('Dự án','combobox')\nscreenshot({str(artifacts / 'select-mobile-dark.png')!r})\nkey('Escape')")
    browser("small-mobile", '''
cdp('Emulation.setDeviceMetricsOverride',width=320,height=740,deviceScaleFactor=1,mobile=True)
click('Khoảng thực hiện')
expect('document.documentElement.scrollWidth <= innerWidth')
key('Escape')
''')
finally:
    browser("close", "close_tab()")
