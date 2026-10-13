"""Static release checks; not a substitute for browser visual QA."""
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit,unquote
import json,re,collections,xml.etree.ElementTree as ET
root=Path(__file__).resolve().parent.parent
source=json.loads((root/'scripts/page-sources.json').read_text())
paths=list(source)+['en/'+p for p in source]
pages={p:BeautifulSoup((root/p).read_text(),'html.parser') for p in paths}
for path,s in pages.items():
 assert len(s.select('h1'))==1,path
 assert s.select_one('.dc-header'),path
 assert path.endswith('index.html') or s.select_one('.dc-return'),path
 ids=[x['id'] for x in s.select('[id]')];assert len(ids)==len(set(ids)),path
 assert s.select_one('meta[name=description]')['content'],path
 assert len(s.select('link[hreflang]'))==3,path
 for t in s.select('script[type="application/ld+json"]'):json.loads(t.string)
 if path.startswith('en/'):
  assert not any(re.search('[А-Яа-яЁё]',str(n)) for n in s.body.find_all(string=True) if n.parent.name not in ['style','script']),path
  assert s.html['lang']=='en'
 for t in s.select('[href],[src]'):
  u=urlsplit(t.get('href',t.get('src','')))
  if u.scheme or u.netloc:continue
  target=((root/path).parent/unquote(u.path)).resolve() if u.path else root/path
  assert target.exists(),(path,str(target))
  if u.fragment and target.suffix=='.html':
   key=str(target.relative_to(root));ts=pages.get(key) or BeautifulSoup(target.read_text(),'html.parser')
   assert ts.find(id=u.fragment),(path,u.fragment)
 for f in s.select('form[data-email-form]'):
  assert f.get('method').lower()=='post'
  assert f.select_one('[name="_next"]')['value'].endswith(('en/' if path.startswith('en/') else '')+'thank-you.html')
  assert f.select_one('[name="contact"][required]')
assert len(ET.parse(root/'sitemap.xml').getroot())==46
print('PASS: 48 pages; internal links and anchors; RU/EN text; return menus; metadata, structured data and sitemap; form configuration.')
