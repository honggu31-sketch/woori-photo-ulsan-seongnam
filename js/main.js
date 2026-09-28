/* 홈페이지 공통 동작 (메뉴, 연락처 채우기, 가격표, 갤러리, 사진 크게 보기)
   ※ 사진관 정보·가격·사진 목록은 info.js 에서 수정하세요. 이 파일은 고칠 필요가 없습니다. */

(function () {
  const page = document.body.dataset.page || "";
  const telHref = "tel:" + SHOP.phone.replace(/[^0-9+]/g, "");
  const mapSearch = encodeURIComponent(SHOP.mapQuery);

  // 카카오톡 채널이 없으면 문자(SMS) 문의로 대신 연결
  const hasKakao = !!SHOP.kakao;
  const chatName = hasKakao ? "카톡" : "문자";

  const LINKS = {
    tel: telHref,
    kakao: hasKakao ? SHOP.kakao : "sms:" + SHOP.phone.replace(/[^0-9+]/g, ""),
    booking: SHOP.booking,
    naverMap: SHOP.naverPlace || "https://map.naver.com/p/search/" + mapSearch,
    kakaoMap: "https://map.kakao.com/?q=" + mapSearch,
    instagram: SHOP.instagram,
  };

  const NAV = [
    ["family", "family.html", "가족사진"],
    ["idphoto", "id-photo.html", "증명·여권사진"],
    ["profile", "profile.html", "프로필사진"],
    ["gallery", "gallery.html", "갤러리"],
    ["price", "price.html", "가격안내"],
    ["location", "location.html", "오시는 길"],
  ];

  const ICON = {
    phone: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 2.8 1.8 5.3 4.6 6.7L5.7 21l4-2.6c.7.1 1.5.2 2.3.2 5.5 0 10-3.6 10-8S17.5 3 12 3z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm-2 8h14v10H5V10z"/></svg>',
  };

  /* ---------- 머리글(메뉴) ---------- */
  const header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    header.innerHTML = `
      <div class="container header-inner">
        <a class="logo" href="index.html">${SHOP.name}<small>${SHOP.branch}</small></a>
        <nav class="nav" id="nav" aria-label="주요 메뉴">
          ${NAV.map(([key, href, label]) => `<a href="${href}"${key === page ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
          <a class="btn btn-primary nav-cta" href="${LINKS.booking}" target="_blank" rel="noopener">예약하기</a>
        </nav>
        <button class="menu-toggle" id="menu-toggle" aria-label="메뉴 열기" aria-expanded="false" aria-controls="nav">
          <span></span><span></span><span></span>
        </button>
      </div>`;
    const toggle = document.getElementById("menu-toggle");
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 바닥글 ---------- */
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = `
      <div class="container footer-inner">
        <div>
          <p class="logo">${SHOP.name}<small>${SHOP.branch}</small></p>
          <p class="muted">가족사진 · 증명·여권사진 · 프로필사진</p>
        </div>
        <div class="footer-info">
          <p><strong>전화</strong> <a href="${LINKS.tel}">${SHOP.phone}</a></p>
          <p><strong>주소</strong> ${SHOP.address}</p>
          <p><strong>영업</strong> ${SHOP.hours.map((h) => h.join(" ")).join(" / ")}</p>
          ${SHOP.payment ? `<p><strong>결제</strong> ${SHOP.payment}</p>` : ""}
          ${SHOP.naverPlace ? `<p><strong>네이버</strong> <a href="${SHOP.naverPlace}" target="_blank" rel="noopener">플레이스 · 리뷰 보기</a></p>` : ""}
          ${SHOP.instagram ? `<p><strong>인스타그램</strong> <a href="${SHOP.instagram}" target="_blank" rel="noopener">바로가기</a></p>` : ""}
        </div>
      </div>
      <div class="container footer-copy">© ${new Date().getFullYear()} ${SHOP.name} ${SHOP.branch}</div>`;
  }

  /* ---------- 휴대폰 하단 고정 버튼 ---------- */
  const bar = document.createElement("div");
  bar.className = "mobile-bar";
  bar.innerHTML = `
    <a href="${LINKS.tel}">${ICON.phone}<span>전화</span></a>
    <a href="${LINKS.kakao}"${hasKakao ? ' target="_blank" rel="noopener"' : ""}>${ICON.chat}<span>${chatName} 문의</span></a>
    <a class="primary" href="${LINKS.booking}" target="_blank" rel="noopener">${ICON.cal}<span>예약하기</span></a>`;
  document.body.appendChild(bar);

  /* ---------- 연락처·주소 자동 채우기 ---------- */
  document.querySelectorAll("[data-shop]").forEach((el) => {
    const v = SHOP[el.dataset.shop];
    if (v) el.textContent = v;
  });
  document.querySelectorAll("[data-link]").forEach((el) => {
    const v = LINKS[el.dataset.link];
    if (!v) { el.hidden = true; return; }
    el.href = v;
    if (!/^(tel|sms):/.test(v)) { el.target = "_blank"; el.rel = "noopener"; }
    if (el.dataset.link === "kakao" && !hasKakao) {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const n = walker.currentNode;
        n.nodeValue = n.nodeValue.replace(/카카오톡|카톡/g, "문자").replace("의상 사진, 참고 사진을 보내며 상담", "사진을 보내며 편하게 문의");
      }
    }
  });
  document.querySelectorAll("[data-hours]").forEach((el) => {
    el.innerHTML = SHOP.hours.map(([d, t]) => `<div><dt>${d}</dt><dd>${t}</dd></div>`).join("");
  });
  document.querySelectorAll("[data-map]").forEach((el) => {
    el.innerHTML = `<iframe title="${SHOP.name} ${SHOP.branch} 지도" loading="lazy"
      src="https://maps.google.com/maps?q=${mapSearch}&z=17&output=embed"></iframe>`;
  });

  /* ---------- 가격표 ---------- */
  const priceText = (p) => p || '<span class="ask">가격 문의</span>';

  function priceHTML(cat, withTitle) {
    const cards = withTitle ? [] : cat.cards || []; // 전체 가격표 페이지에서는 목록만 보여줌
    const groups = cat.groups || [];
    const notes = cat.notes || [];
    return `
      ${withTitle ? `<h2 class="price-cat-title">${cat.label}</h2>` : ""}
      ${cards.length ? `<div class="price-grid${cards.length === 2 ? " two" : ""}">${cards.map((p) => `
        <article class="price-card${p.best ? " best" : ""}">
          ${p.best ? '<span class="badge">인기</span>' : ""}
          <h3>${p.title}</h3>
          <p class="price">${priceText(p.price)}</p>
          <ul>${p.items.map((i) => `<li>${i}</li>`).join("")}</ul>
        </article>`).join("")}</div>` : ""}
      ${groups.length ? `<div class="price-table">${groups.map((g) => `
        <section class="price-group">
          <h3>${g.title}</h3>
          <ul>${g.rows.map(([name, price, desc]) => `
            <li><div class="pt-name">${name}${desc ? `<small>${desc}</small>` : ""}</div><div class="pt-price">${priceText(price)}</div></li>`).join("")}
          </ul>
        </section>`).join("")}</div>` : ""}
      ${notes.length ? `<ul class="price-notes">${notes.map((n) => `<li>${n}</li>`).join("")}</ul>` : ""}`;
  }

  document.querySelectorAll("[data-prices]").forEach((el) => {
    const cat = PRICES[el.dataset.prices];
    if (cat) el.innerHTML = priceHTML(cat, false);
  });

  /* 가격안내 페이지: 모든 분야를 차례로 */
  const all = document.querySelector("[data-prices-all]");
  if (all) {
    const keys = Object.keys(PRICES);
    const tabs = document.querySelector("[data-price-tabs]");
    if (tabs) tabs.innerHTML = keys.map((k) => `<a href="#p-${k}">${PRICES[k].label}</a>`).join("");
    all.innerHTML = keys.map((k) => `<div class="price-cat" id="p-${k}">${priceHTML(PRICES[k], true)}</div>`).join("");
  }

  /* ---------- 갤러리 ---------- */
  const TYPE_LABEL = { family: "가족사진", idphoto: "증명·여권사진", profile: "프로필사진" };
  let current = [];

  function renderGallery(el, type) {
    const limit = parseInt(el.dataset.limit || "0", 10);
    let items = type && type !== "all" ? GALLERY.filter((g) => g.type === type) : GALLERY.slice();
    if (limit) items = items.slice(0, limit);
    el.innerHTML = items.map((g, i) => `
      <figure class="g-item">
        <button type="button" data-index="${i}" aria-label="${g.caption} 크게 보기">
          <img src="${g.src}" alt="${g.caption}" loading="lazy">
        </button>
        <figcaption><span>${TYPE_LABEL[g.type] || ""}</span>${g.caption}</figcaption>
      </figure>`).join("");
    el.onclick = (e) => {
      const b = e.target.closest("button[data-index]");
      if (!b) return;
      current = items;
      openLightbox(+b.dataset.index);
    };
  }

  document.querySelectorAll("[data-gallery]").forEach((el) => renderGallery(el, el.dataset.gallery));

  const filters = document.querySelector("[data-filters]");
  if (filters) {
    const target = document.querySelector(filters.dataset.filters);
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button[data-type]");
      if (!b) return;
      filters.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", x === b));
      renderGallery(target, b.dataset.type);
    });
    const hash = location.hash.replace("#", "");
    const start = filters.querySelector(`button[data-type="${hash}"]`);
    if (start) start.click();
  }

  /* ---------- 사진 크게 보기 ---------- */
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.hidden = true;
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.innerHTML = `
    <button class="lb-close" aria-label="닫기">&times;</button>
    <button class="lb-prev" aria-label="이전 사진">&#8249;</button>
    <figure><img alt=""><figcaption></figcaption></figure>
    <button class="lb-next" aria-label="다음 사진">&#8250;</button>`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  let idx = 0;

  function show(i) {
    idx = (i + current.length) % current.length;
    const g = current[idx];
    lbImg.src = g.src;
    lbImg.alt = g.caption;
    lbCap.textContent = `${g.caption}  (${idx + 1} / ${current.length})`;
    lb.classList.toggle("single", current.length < 2);
  }
  function openLightbox(i) {
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = "";
  }
  lb.querySelector(".lb-close").onclick = closeLightbox;
  lb.querySelector(".lb-prev").onclick = () => show(idx - 1);
  lb.querySelector(".lb-next").onclick = () => show(idx + 1);
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "FIGURE") closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
  let startX = null;
  lb.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    startX = null;
  });

  /* 단일 사진(히어로 등)도 눌러서 크게 보기 */
  document.querySelectorAll("[data-zoom]").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      current = [{ src: img.getAttribute("src"), caption: img.alt }];
      openLightbox(0);
    });
  });

  /* ---------- 자주 묻는 질문: 하나 열면 나머지는 닫기 ---------- */
  document.querySelectorAll(".faq details").forEach((d, _, all) => {
    d.addEventListener("toggle", () => { if (d.open) all.forEach((o) => o !== d && (o.open = false)); });
  });
})();
