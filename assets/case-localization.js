(() => {
  const page = location.pathname.split("/").pop();
  const q = (selector) => document.querySelector(selector);
  const htmlSelectors = new Set([
    ".hero h1",
    ".context h2",
    ".statement blockquote",
    "#strategy h2",
    ".result-head h2",
    ".process h2",
    ".final h2",
  ]);
  const pages = {
    "mazi.html": {
      ".nav-center a:nth-child(1)": "← Tüm projeler",
      ".nav-center a:nth-child(2)": "Strateji",
      ".nav-center a:nth-child(3)": "Sonuçlar",
      ".nav-right .button": "Projeyi konuşalım",
      ".hero h1":
        "Bir restoran ilk rezervasyon gününde açılmaz. Her şey <em>beklentiyle</em> başlar.",
      ".hero-intro":
        "MAZI için markanın temelini kurduk: konumlandırma, özgün karakterlere dayanan marka kimliği, içerik ve aramadan masaya uzanan anlaşılır misafir yolu.",
      ".hero-side p:nth-of-type(1)":
        "İstanbul’un turistik merkezinde restoran rekabeti çok yoğun. Güzel olmak yetmez; onlarca seçenek arasından tercih edilmek gerekir.",
      ".hero-side p:nth-of-type(2)":
        "Mutfağı, atmosferi ve servis seviyesini ilk ziyaretten önce İngilizce ve Türkçe anlatmak gerekiyordu.",
      ".hero-image figcaption": "Saray mutfağının çağdaş yorumu",
      ".metrics .metric:nth-child(1) span": "iletişim dilleri",
      ".metrics .metric:nth-child(2) span": "Google yorumlarında puan",
      ".metrics .metric:nth-child(3) span":
        "ilk ayda fotoğraf ve videolu yorum",
      ".metrics .metric:nth-child(4) span": "marka ve lansman",
      ".context .eyebrow": "Bağlam",
      ".context h2":
        "Güçlü bir restoran yemeği değil, <em>doğru seçim yaptığınız hissini</em> satar.",
      ".context .aside-note": "Marka kimliği · hospitality · lansman · itibar",
      ".context .body-copy p:nth-child(1)":
        "MAZI, kararların çoğu zaman harita, yorumlar, fotoğraflar ve sayfadaki ilk saniyeler üzerinden verildiği bir bölgede açıldı. Bu nedenle lansmanı yalnızca görsel içerik üzerine değil, güven üzerine kurduk.",
      ".context .body-copy p:nth-child(2)":
        "Türkçe ve İngilizce kitle için marka kimliğini ve ortak dili oluşturduk: görsel kod, tipografi, renk, kompozisyon prensipleri ve art direction. Ardından menüyü, mutfak hikâyesini, lokasyonu, Google yorumlarını ve sosyal medyayı tek bir misafir yolunda birleştirdik.",
      ".statement blockquote":
        "İlk ziyaretten önce kişi, <em>nasıl bir deneyim yaşayacağını</em> anlamalı.",
      ".statement cite": "Digital Clever yaklaşımı",
      "#strategy > .wrap > .eyebrow": "Ne kurduk",
      "#strategy > .wrap > h2":
        "Markayı <em>misafir deneyimi</em> etrafında kurduk.",
      "#strategy .strategy:nth-child(1) h3": "Marka kimliği ve karakterler",
      "#strategy .strategy:nth-child(1) p":
        "İkonik yemeklerden yola çıkan karakterler yarattık. Tarihi kostümler, çağdaş detaylar ve cesur kompozisyonlar MAZI’nin fikrini anlatıyor: saray mutfağının modern yorumu.",
      "#strategy .strategy:nth-child(2) h3": "İki dil, tek karakter",
      "#strategy .strategy:nth-child(2) p":
        "Mesajları İngilizce ve Türkçe olarak turistlere ve yerel kitleye uyarladık; mekanik çeviri kullanmadık.",
      "#strategy .strategy:nth-child(3) h3": "Kararsızlığı azaltan içerik",
      "#strategy .strategy:nth-child(3) p":
        "Menü, iç mekân, servis ve mutfak hikâyesi rezervasyondan önce deneyimi görünür kıldı.",
      "#strategy .strategy:nth-child(4) h3":
        "Misafir kazandıran Google sistemi",
      "#strategy .strategy:nth-child(4) p":
        "Kendi metodolojimizle yorum sürecini kurduk ve restoran profilini, özellikle turistler için, yeni misafirlerin ana kaynaklarından birine dönüştürdük.",
      ".mazi-gallery figure:nth-child(1) figcaption":
        "Markanın mekânı ve atmosferi",
      ".mazi-gallery figure:nth-child(2) figcaption": "Ürün içeriği",
      ".mazi-gallery figure:nth-child(3) figcaption":
        "MAZI marka karakterinin art direction’ı",
      "#results .eyebrow": "Sonuç",
      "#results .result-head h2":
        "Açılıştan, misafirlerin <em>tavsiye ettiği</em> restorana.",
      "#results .result-head > p":
        "Yeni bir restoran için önemli olan tek seferlik görünürlük değil; tanınan marka kimliği, düzenli içerik ve yeni misafir getiren itibardır.",
      "#results .result:nth-child(1) h3": "Google puanı",
      "#results .result:nth-child(1) p":
        "Yüksek puan, daha ziyaret gerçekleşmeden restoran tercihine destek oluyor.",
      "#results .result:nth-child(2) h3": "ilk ayda yorum",
      "#results .result:nth-child(2) p":
        "Misafirlerin fotoğraf ve videoları turistler için güçlü bir sosyal kanıta dönüştü.",
      "#results .result:nth-child(3) h3": "tek marka karakteri",
      "#results .result:nth-child(3) p":
        "Turistler ve yerel kitle için tutarlı iletişim.",
      ".process .eyebrow": "Nasıl çalışıyoruz",
      ".process h2":
        "Pazarlama, misafirin <em>her adımını</em> desteklediğinde restoran büyür.",
      ".process-item:nth-child(1) h3": "Önce deneyimi anlatırız",
      ".process-item:nth-child(1) p":
        "Kişi haritayı açmadan önce mutfağı, servisi ve atmosferi gösteririz.",
      ".process-item:nth-child(2) h3": "Sonra tereddütleri gideririz",
      ".process-item:nth-child(2) p":
        "Yorumlar, menü ve açık bilgiler restoranı güvenle seçmeye yardımcı olur.",
      ".process-item:nth-child(3) h3": "Ziyaretten sonra bağı sürdürürüz",
      ".process-item:nth-child(3) p":
        "İçerik ve itibar, tek bir ziyareti tavsiyeye dönüştürür.",
      ".final .eyebrow": "Sıradaki proje",
      ".final h2":
        "Restoranınız da daha ziyaret edilmeden <em>tercih edilebilir.</em>",
      ".final-copy":
        "Konseptinizi ve lokasyonunuzu anlatın. 24 saat içinde lansman ve tanıtım için ön planımızı iletelim.",
      ".final .button": "Projeyi konuşalım",
      ".footer-row a:nth-of-type(1)": "Ana sayfaya dön",
    },
    "berkara.html": {
      ".nav-center a:nth-child(1)": "← Tüm projeler",
      ".nav-center a:nth-child(2)": "Strateji",
      ".nav-center a:nth-child(3)": "Sonuçlar",
      ".nav-right .button": "Projeyi konuşalım",
      ".hero h1": "423 SKU bir katalog değil. Bir <em>talep sistemidir.</em>",
      ".hero-intro":
        "BERKARA için teknik ürünü, Türkçe arama davranışını ve gerçek satın alma senaryolarını birleştiren SEO temelini kurduk.",
      ".hero-side p:nth-of-type(1)":
        "Endüstriyel bir katalog kolayca kimsenin bulamadığı sayfalar yığınına dönüşebilir.",
      ".hero-side p:nth-of-type(2)":
        "Her ürünün görünürlüğe ve bir sonraki temasa hizmet ettiği anlaşılır bir mimari gerekiyordu.",
      ".hero-image figcaption": "B2B ürün için SEO sistemi",
      ".metrics .metric:nth-child(1) span": "katalog yapısındaki SKU",
      ".metrics .metric:nth-child(2) span": "pazar ve arama talebi",
      ".metrics .metric:nth-child(3) span": "iletişim dili",
      ".metrics .metric:nth-child(4) span": "uzun satış döngüsü",
      ".context .eyebrow": "Bağlam",
      ".context h2":
        "Karmaşık bir ürün, ilk aramadan önce <em>bulunabilir</em> olmalı.",
      ".context .aside-note": "B2B · SEO · endüstriyel ürünler · Türkiye",
      ".context .body-copy p:nth-child(1)":
        "Üreticinin güçlü ürünleri vardı; ancak arama motoru ve yeni müşteri açısından ortak bir mantık oluşturmuyordu. Katalog kozmetik bir yenileme değil, yeni bir yapı gerektiriyordu.",
      ".context .body-copy p:nth-child(2)":
        "Talebi kategori, teknik özellik ve kullanım senaryolarına göre ayırdık; ürün sayfaları, meta veriler, URL, ALT alanları ve ticari talebi olmayan sayfalar için kurallar oluşturduk. Böylece SEO ayrı bir rapor değil, satış sisteminin parçası oldu.",
      ".statement blockquote":
        "B2B katalogdaki her sayfa satın almacının şu sorusunu yanıtlamalı: <em>“Bu ürün benim ihtiyacıma uygun mu?”</em>",
      ".statement cite": "Digital Clever yaklaşımı",
      "#strategy > .wrap > .eyebrow": "Ne kurduk",
      "#strategy > .wrap > h2":
        "Aramayı <em>çözüme</em> götüren bir mimari kurduk.",
      "#strategy .strategy:nth-child(1) h3": "Türkçe talep haritası",
      "#strategy .strategy:nth-child(1) p":
        "Kategori, özellik ve satın alma ihtiyacına göre semantik kümeler oluşturduk.",
      "#strategy .strategy:nth-child(2) h3": "423 SKU için tek model",
      "#strategy .strategy:nth-child(2) p":
        "Katalog kaosa dönüşmeden büyüyebilsin diye alanları, şablonları ve ürün sayfası mantığını standartlaştırdık.",
      "#strategy .strategy:nth-child(3) h3": "Kontrollü indeksleme",
      "#strategy .strategy:nth-child(3) p":
        "Büyüme sayfalarını, filtreleri ve teknik kopyaları ayırdık; noindex ve canonical kurallarını belirledik.",
      "#strategy .strategy:nth-child(4) h3": "Satışa destek olan içerik",
      "#strategy .strategy:nth-child(4) p":
        "Aramadan karşılaştırmaya ve şirketle temasa geçişi kolaylaştıran içerik yapısını hazırladık.",
      ".image-pair figure:nth-child(1) figcaption": "Ürün ve kategori sistemi",
      ".image-pair figure:nth-child(2) figcaption":
        "Teknik ürün gerçek kullanım bağlamında",
      "#results .eyebrow": "Sonuç",
      "#results .result-head h2":
        "Dağınık ürün sayfalarından <em>organik büyüme</em> temeline.",
      "#results .result-head > p":
        "Proje uzun vadeli bir sistem olarak ilerliyor: önce temel ve düzen, ardından içerik kümeleri ve görünürlük birikimi.",
      "#results .result:nth-child(1) h3": "tek modelde ürün",
      "#results .result:nth-child(1) p": "Katalog ölçeklenmeye hazır.",
      "#results .result:nth-child(2) h3": "arama bağlamı",
      "#results .result:nth-child(2) p":
        "Yapı, Türkçe sorguları ve ticari niyeti dikkate alıyor.",
      "#results .result:nth-child(3) h3": "SEO temeli",
      "#results .result:nth-child(3) p":
        "Dağınık sayfalardan yönetilebilir sisteme.",
      ".process .eyebrow": "Nasıl çalışıyoruz",
      ".process h2":
        "SEO, devam ettirilebildiğinde <em>daha güçlü</em> çalışır.",
      ".process-item:nth-child(1) h3": "Önce modeli sabitleriz",
      ".process-item:nth-child(1) p":
        "Yeni sayfalar sistemi bozmasın diye kategorileri, özellikleri, URL yapısını ve alanları belirleriz.",
      ".process-item:nth-child(2) h3": "Sonra talebi büyütürüz",
      ".process-item:nth-child(2) p":
        "Sırf metin olsun diye değil, satın almacının kararına yardımcı olan konuları açarız.",
      ".process-item:nth-child(3) h3": "Temasa kadar olan yolu ölçeriz",
      ".process-item:nth-child(3) p":
        "Görünürlüğü, site davranışını ve talepleri tek bir tabloda birleştiririz.",
      ".final .eyebrow": "Sıradaki proje",
      ".final h2": "Kataloğunuz da bir <em>satış kanalına</em> dönüşebilir.",
      ".final-copy":
        "Kaç ürün ve pazarı tek sisteme toplamak istediğinizi anlatın. 24 saat içinde ön çalışma planımızı iletelim.",
      ".final .button": "Projeyi konuşalım",
      ".footer-row a:nth-of-type(1)": "Ana sayfaya dön",
    },
  };

  const original = new Map();
  const pageCopy = pages[page];
  if (pageCopy)
    Object.keys(pageCopy).forEach((selector) => {
      const el = q(selector);
      if (el)
        original.set(
          selector,
          htmlSelectors.has(selector) ||
            selector.includes(" h1") ||
            selector.endsWith(" h2") ||
            selector.includes("blockquote")
            ? el.innerHTML
            : el.textContent,
        );
    });

  const updateLinks = (lang) => {
    document.querySelectorAll('a[href^="../index.html"]').forEach((link) => {
      const hash = link.getAttribute("href").includes("#")
        ? link.getAttribute("href").split("#")[1]
        : "";
      link.href = `../index.html?lang=${lang}${hash ? `#${hash}` : ""}`;
    });
  };
  const updateProjectProfile = (lang) => {
    document.querySelectorAll("[data-profile-ru]").forEach((element) => {
      const value =
        lang === "tr" ? element.dataset.profileTr : element.dataset.profileRu;
      if (value) element.textContent = value;
    });
  };
  const applyCustom = (lang) => {
    if (!pageCopy) return;
    document.documentElement.lang = lang;
    Object.keys(pageCopy).forEach((selector) => {
      const el = q(selector);
      if (!el) return;
      const value = lang === "tr" ? pageCopy[selector] : original.get(selector);
      if (value === undefined) return;
      if (
        htmlSelectors.has(selector) ||
        selector.includes(" h1") ||
        selector.endsWith(" h2") ||
        selector.includes("blockquote")
      )
        el.innerHTML = value;
      else el.textContent = value;
    });
    document
      .querySelectorAll("[data-lang]")
      .forEach((button) =>
        button.classList.toggle("active", button.dataset.lang === lang),
      );
    localStorage.setItem("dc-language", lang);
    updateLinks(lang);
    updateNavLabels(lang);
    updateProjectProfile(lang);
  };

  const header = q("header");
  const nav = q(".nav-center");
  const navRight = q(".nav-right");
  const whatsapp = document.createElement("a");
  whatsapp.className = "whatsapp-float";
  whatsapp.href =
    "https://wa.me/905343582898?text=" +
    encodeURIComponent(
      "Здравствуйте! Пишу с вашего сайта. У меня следующий запрос:",
    );
  whatsapp.target = "_blank";
  whatsapp.rel = "noopener";
  whatsapp.setAttribute("aria-label", "WhatsApp");
  whatsapp.innerHTML =
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3C8.86 3 3.02 8.78 3.02 15.9c0 2.27.6 4.49 1.74 6.43L3 28.75l6.6-1.72a13.1 13.1 0 0 0 6.43 1.64h.01c7.18 0 13.02-5.78 13.02-12.89C29.06 8.78 23.22 3 16.04 3Zm7.65 18.42c-.32.9-1.88 1.72-2.62 1.82-.67.1-1.52.14-2.45-.15-.57-.18-1.3-.42-2.23-.82-3.92-1.68-6.47-5.59-6.67-5.85-.2-.26-1.6-2.12-1.6-4.04 0-1.92 1.01-2.87 1.37-3.26.36-.39.79-.49 1.05-.49h.76c.24 0 .57-.09.89.68.32.78 1.09 2.66 1.19 2.85.1.2.16.42.03.68-.13.26-.2.42-.39.65-.2.23-.41.51-.59.68-.2.2-.4.41-.17.8.23.39 1.02 1.67 2.19 2.7 1.5 1.33 2.77 1.75 3.16 1.94.39.2.62.16.85-.1.23-.26.98-1.14 1.24-1.53.26-.39.52-.33.88-.2.36.13 2.29 1.08 2.68 1.27.39.2.65.29.75.46.1.16.1.94-.22 1.83Z"/></svg>';
  document.body.appendChild(whatsapp);
  const back = document.createElement("a");
  back.className = "case-back-mobile";
  back.href = "../work.html";
  back.textContent = "← Кейсы";
  const menu = document.createElement("button");
  menu.className = "case-menu-toggle";
  menu.type = "button";
  menu.setAttribute("aria-expanded", "false");
  menu.textContent = "Меню";
  navRight?.prepend(menu);
  navRight?.prepend(back);
  const updateNavLabels = (lang) => {
    back.textContent = lang === "tr" ? "← Projeler" : "← Кейсы";
    menu.textContent = lang === "tr" ? "Menü" : "Меню";
  };
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    header.classList.toggle("is-menu-open", open);
    menu.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      header.classList.remove("is-menu-open");
      menu.setAttribute("aria-expanded", "false");
    }),
  );

  document.querySelectorAll("[data-lang]").forEach((button) =>
    button.addEventListener("click", () => {
      const lang = button.dataset.lang;
      localStorage.setItem("dc-language", lang);
      updateLinks(lang);
      updateNavLabels(lang);
      updateProjectProfile(lang);
      if (pageCopy) applyCustom(lang);
    }),
  );
  const preferred =
    localStorage.getItem("dc-language") === "tr" ||
    new URLSearchParams(location.search).get("lang") === "tr"
      ? "tr"
      : "ru";
  if (pageCopy) applyCustom(preferred);
  else {
    updateLinks(preferred);
    updateNavLabels(preferred);
    if (preferred === "tr") document.querySelector('[data-lang="tr"]')?.click();
  }
  updateProjectProfile(preferred);
})();
