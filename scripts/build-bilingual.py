"""Build crawlable Russian and English pages from retained public page sources."""
import json,re,posixpath,html
from pathlib import Path
from urllib.parse import urlsplit,urlunsplit
from bs4 import BeautifulSoup,NavigableString
ROOT=Path(__file__).resolve().parent.parent
BASE='https://garnemax-del.github.io/digital/'
sources=json.loads((ROOT/'scripts/page-sources.json').read_text())
translations=json.loads((ROOT/'scripts/en-translations.json').read_text())
norm=lambda x:' '.join(str(x).split())
# Page-specific search titles. Descriptions are derived from the visible page introduction.
names={
'index.html':('Маркетинговое агентство в Турции','Marketing agency in Turkey'),
'work.html':('Кейсы маркетинга: рестораны, медицина, бренды','Marketing cases: hospitality, healthcare and brands'),
'team.html':('Команда маркетингового агентства','Meet our marketing team'),
'blog.html':('Статьи о маркетинге и развитии бизнеса в Турции','Marketing and business growth insights for Turkey'),
'thank-you.html':('Спасибо за заявку','Thank you for your enquiry'),
'cases/mazi.html':('MAZI: айдентика и запуск ресторана в Стамбуле','MAZI: restaurant brand identity and launch in Istanbul'),
'cases/fine-dining-istanbul.html':('Sakhalin Istanbul: маркетинг премиального ресторана','Sakhalin Istanbul: premium restaurant marketing'),
'cases/sakhalin-bodrum.html':('Sakhalin Bodrum: рост обращений на 20,6%','Sakhalin Bodrum: 20.6% more enquiries'),
'cases/health-solutions.html':('Health Solutions: маркетинг клиник в Турции','Health Solutions: clinic marketing in Turkey'),
'cases/papagalos-dubai.html':('Papagalos Dubai: бренд и подготовка открытия','Papagalos Dubai: branding and pre-launch communications'),
'cases/berkara.html':('BERKARA: B2B-маркетинг поставщика колёс','BERKARA: B2B marketing for a wheel supplier'),
'cases/globalmedik.html':('Globalmedik: маркетинг медицинского туризма','Globalmedik: medical tourism marketing'),
'cases/la-sultane.html':('La Sultane de Saba: продвижение косметики в Турции','La Sultane de Saba: beauty marketing in Turkey'),
'cases/ozbi-goodfood.html':('OZBI и Good Food Russia: маркетинг FMCG','OZBI and Good Food Russia: FMCG marketing'),
'services/strategy.html':('Маркетинговая стратегия для бизнеса в Турции','Marketing strategy for businesses in Turkey'),
'services/content.html':('Брендинг, айдентика и создание контента','Branding, visual identity and content production'),
'services/advertising.html':('Реклама и привлечение клиентов в Турции','Paid advertising and customer acquisition in Turkey'),
'services/websites.html':('Разработка сайтов для бизнеса в Турции','Website design and development in Turkey'),
'services/seo.html':('SEO и видимость в Google и ИИ-поиске','SEO and visibility in Google and AI search'),
'services/consulting.html':('Частные консультации по маркетингу','One-to-one marketing consultations'),
'articles/b2b-seo.html':('SEO для B2B: как привлекать целевые запросы','B2B SEO: attracting qualified search enquiries'),
'articles/hospitality.html':('Маркетинг ресторанов: от поиска до визита','Restaurant marketing: from search to a visit'),
'articles/market-entry.html':('Выход бренда на рынок Турции','Bringing a brand to the Turkish market'),
'articles/retention.html':('Удержание клиентов и повторные продажи','Customer retention and repeat purchases')}
attrs={'Как с вами связаться?':'How can we reach you?','Ваше имя':'Your name','Телефон или email':'Phone or email','Расскажите о проекте':'Tell us about your project'}
missing=set()
for source,raw in sources.items():
 for lang in ['ru','en']:
  out=('en/' if lang=='en' else '')+source
  s=BeautifulSoup(raw,'html.parser');s.html['lang']=lang
  for t in list(s.select('script')):
   if 'motion.js' not in t.get('src',''): t.decompose()
  for t in s.select('header'):t.decompose()
  if lang=='en':
   for t in list(s.select('[data-en]')):t.clear();t.append(t['data-en'])
   for n in list(s.body.find_all(string=True)):
    if n.parent.name in ['script','style']:continue
    k=norm(n)
    if k in translations:
     lead=re.match(r'^\s*',str(n)).group();tail=re.search(r'\s*$',str(n)).group();n.replace_with(lead+translations[k]+tail)
    elif re.search('[А-Яа-яЁё]',k):missing.add(k)
   for t in s.find_all(True):
    for a in ['alt','title','aria-label','placeholder']:
     if a in t.attrs and re.search('[А-Яа-яЁё]',t[a]):
      t[a]=translations.get(norm(t[a]),attrs.get(norm(t[a]), 'Digital Clever — '+names[source][1] if a=='alt' else 'Contact Digital Clever'))
  for t in s.find_all(True):
   for a in list(t.attrs):
    if a.startswith(('data-ru','data-tr','data-en','data-profile-','data-placeholder-','data-i18n')) or a in ['data-k','data-lang','onclick']:del t[a]
  # Resolve links against the original source, then point to the same language.
  for t in s.find_all(True):
   for attr in ['href','src','poster']:
    if not t.get(attr):continue
    u=urlsplit(t[attr])
    if u.scheme or u.netloc or not u.path or u.path.startswith('/'):continue
    dest=posixpath.normpath(posixpath.join(posixpath.dirname(source),u.path))
    if dest in sources and lang=='en':dest='en/'+dest
    query=u.query
    if 'lang=' in query:query=''
    t[attr]=urlunsplit(('','',posixpath.relpath(dest,posixpath.dirname(out) or '.'),query,u.fragment))
  def link(path):return posixpath.relpath(('en/' if lang=='en' else '')+path,posixpath.dirname(out) or '.')
  labels=['Главная','Кейсы','Услуги','Команда','Статьи','Обсудить проект'] if lang=='ru' else ['Home','Cases','Services','Team','Insights','Let’s talk']
  dests=['index.html','work.html','index.html#capabilities','team.html','blog.html','index.html#contact']
  nav=''.join(f'<a href="{link(d)}">{l}</a>' for d,l in zip(dests,labels))
  switches=''.join(f'<a lang="{l}" hreflang="{l}" href="{posixpath.relpath(("en/" if l=="en" else "")+source,posixpath.dirname(out) or ".")}"'+(' aria-current="page"' if l==lang else '')+f'>{l.upper()}</a>' for l in ['ru','en'])
  header=BeautifulSoup(f'<header class="dc-header"><a class="dc-brand" href="{link("index.html")}">DIGITAL CLEVER</a><nav class="dc-desktop" aria-label="{"Основное меню" if lang=="ru" else "Main navigation"}">{nav}</nav><nav class="dc-languages" aria-label="Language">{switches}</nav><details class="dc-mobile"><summary>{"Меню" if lang=="ru" else "Menu"}</summary><nav>{nav}</nav></details></header>','html.parser')
  s.body.insert(0,header)
  if source!='index.html':
   crumb=BeautifulSoup(f'<nav class="dc-return" aria-label="{"Возвратное меню" if lang=="ru" else "Return navigation"}"><a href="{link("index.html")}">← {labels[0]}</a><a href="{link("work.html")}">{"Все кейсы" if lang=="ru" else "All cases"} ↗</a></nav>','html.parser');s.body.insert(1,crumb)
  if source=='work.html' and not s.select_one('h1'):
   heading=s.select_one('main h2');heading.name='h1'
  # Form works without JavaScript; thank-you is a distinct conversion destination.
  for f in s.select('form[data-email-form]'):
   f.select_one('[name="_next"]')['value']=BASE+('en/' if lang=='en' else '')+'thank-you.html'
   f.select_one('[name="_subject"]')['value']='Digital Clever — website enquiry' if lang=='en' else 'Digital Clever — новая заявка с сайта'
  greeting='Hello! I found your website online. My enquiry is:' if lang=='en' else 'Здравствуйте! Я нашёл ваш сайт в интернете. У меня следующий запрос:'
  from urllib.parse import quote
  for t in s.select('a[href*="wa.me"]'):t['href']='https://wa.me/905343582898?text='+quote(greeting)
  for t in s.select('link[rel="canonical"],link[hreflang],meta[name="description"],meta[name="keywords"],meta[name="robots"],meta[property^="og:"],meta[name^="twitter:"]'):t.decompose()
  title=names[source][lang=='en']+' | Digital Clever';s.title.string=title
  intro=s.select_one('.hero p, .editor-hero p, main > p, main p')
  description=norm(intro.text) if intro else title
  if source=='index.html':description=('Берём маркетинг бренда в Турции на себя: стратегия, брендинг, реклама, сайты, SEO и консультации. Кейсы ресторанов, медицины и международных брендов.' if lang=='ru' else 'Marketing for brands in Turkey: strategy, branding, advertising, websites, SEO and consulting. Explore our hospitality, healthcare and international brand cases.')
  if source=='blog.html':description='Практические статьи Digital Clever: выход на рынок Турции, маркетинг ресторанов, SEO для B2B и удержание клиентов.' if lang=='ru' else 'Practical Digital Clever insights on entering Turkey, restaurant marketing, B2B SEO and customer retention.'
  description=description[:197].rsplit(' ',1)[0]+('…' if len(description)>197 else '') if len(description)>197 else description
  canonical=BASE+('en/' if lang=='en' else '')+('' if source=='index.html' else source)
  def add(tagname,**kwargs):t=s.new_tag(tagname,attrs=kwargs);s.head.append(t);return t
  add('meta',name='description',content=description)
  add('meta',name='robots',content='noindex,follow' if source=='thank-you.html' else 'index,follow,max-image-preview:large')
  add('link',rel='canonical',href=canonical)
  for l in ['ru','en','x-default']:add('link',rel='alternate',hreflang=l,href=BASE+('en/' if l=='en' else '')+('' if source=='index.html' else source))
  for key,val in {'title':title,'description':description,'url':canonical,'type':'article' if source.startswith('articles/') else 'website','site_name':'Digital Clever','locale':'en_GB' if lang=='en' else 'ru_RU'}.items():add('meta',property='og:'+key,content=val)
  social=s.select_one('main img[src]')
  has_social=False
  if social:
   imagepath=posixpath.normpath(posixpath.join(posixpath.dirname(out),social['src'].split('?')[0]))
   if imagepath.lower().endswith(('.jpg','.jpeg','.png','.webp')):
    add('meta',property='og:image',content=BASE+imagepath);has_social=True
  add('meta',name='twitter:card',content='summary_large_image' if has_social else 'summary')
  org={'@type':'Organization','@id':BASE+'#organization','name':'Digital Clever','url':BASE,'logo':BASE+'assets/logo.svg','email':'info@digitalclever.net','telephone':'+905343582898'}
  page={'@type':'WebPage','@id':canonical+'#webpage','url':canonical,'name':title,'description':description,'inLanguage':lang,'isPartOf':{'@id':BASE+'#website'},'publisher':{'@id':BASE+'#organization'}}
  graph=[org,{'@type':'WebSite','@id':BASE+'#website','url':BASE,'name':'Digital Clever','inLanguage':['ru','en'],'publisher':{'@id':BASE+'#organization'}},page]
  if source!='index.html':
   graph.append({'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':labels[0],'item':BASE+('en/' if lang=='en' else '')},{'@type':'ListItem','position':2,'name':names[source][lang=='en'],'item':canonical}]})
  if source.startswith('services/'):
   graph.append({'@type':'Service','name':names[source][lang=='en'],'description':description,'url':canonical,'provider':{'@id':BASE+'#organization'},'areaServed':{'@type':'Country','name':'Turkey'}})
  if source.startswith('articles/'):
   graph.append({'@type':'Article','headline':names[source][lang=='en'],'description':description,'inLanguage':lang,'mainEntityOfPage':canonical,'author':{'@id':BASE+'#organization'},'publisher':{'@id':BASE+'#organization'}})
  t=add('script',type='application/ld+json');t.string=json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=False)
  if not s.select_one('link[href*="site.css"]'):add('link',rel='stylesheet',href=posixpath.relpath('assets/site.css',posixpath.dirname(out) or '.')+'?v=24')
  for t in s.select('link[href*="site.css"],script[src*="motion.js"]'):
   a='href' if t.name=='link' else 'src';t[a]=t[a].split('?')[0]+'?v=24'
  js=s.new_tag('script',src=posixpath.relpath('assets/site.js',posixpath.dirname(out) or '.')+'?v=24',defer=True);s.body.append(js)
  # Remove obsolete anonymous wording from the now-public Sakhalin case.
  result=str(s)
  if lang=='ru':
   result=result.replace('Кейс опубликован без названия проекта','Кейс Sakhalin Istanbul').replace('Работа под NDA','Маркетинг Sakhalin Istanbul')
  (ROOT/out).parent.mkdir(parents=True,exist_ok=True);(ROOT/out).write_text(result)
print('Untranslated:',json.dumps(sorted(missing),ensure_ascii=False,indent=2))
urls=[BASE+('en/' if lang=='en' else '')+('' if p=='index.html' else p) for p in sources if p!='thank-you.html' for lang in ['ru','en']]
(ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+''.join('<url><loc>'+html.escape(u)+'</loc></url>\n' for u in urls)+'</urlset>')
(ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+BASE+'sitemap.xml\n')
(ROOT/'dist/index.html').write_text('<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><meta http-equiv="refresh" content="0;url=../index.html"><link rel="canonical" href="'+BASE+'"><title>Digital Clever</title></head><body><a href="../index.html">Digital Clever</a></body></html>')
