const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => revealObserver.observe(el));

const navLinks = document.querySelectorAll(".navbar nav a");
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
});

const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

const domainData = {
  excavata: {
    name: "Екскавати",
    text: "Переважно одноклітинні еукаріоти з джгутиками. Багато з них паразити, а деякі мають особливу «борозенку» для захоплення їжі.",
    relation: "Одна з найдавніших гілок еукаріотів. Вона відокремилася рано, тому займає базове місце в дереві.",
    example: "Лямблія (Giardia lamblia) — збудник лямбліозу."
  },
  amoebozoa: {
    name: "Амебозої",
    text: "Організми, що пересуваються за допомогою псевдоподій — тимчасових виростів цитоплазми.",
    relation: "Разом з опістоконтами входять до групи Аморфеї.",
    example: "Амеба протей (Amoeba proteus) і слизовики."
  },
  opisthokonta: {
    name: "Опістоконти",
    text: "Група, до якої належать тварини, гриби та їхні одноклітинні родичі. У рухомих клітин є один джгутик на задньому кінці.",
    relation: "Найближчі родичі тварин — хоаноміцети (комірцеві джгутикові). Гриби ближчі до тварин, ніж до рослин.",
    example: "Людина, мухомор, медуза."
  },
  amorphea: {
    name: "Аморфеї",
    text: "Надгрупа, яка об'єднує амебозоїв та опістоконтів. Ці організми мають спільного предка.",
    relation: "Складається з двох груп: Амебозої та Опістоконти.",
    example: "Слизовик Dictyostelium discoideum (амебозой)."
  },
  archaeplastida: {
    name: "Археопластиди",
    text: "Група, до якої входять рослини та водорості з первинними пластидами (хлоропластами). Пластиди виникли після поглинання клітиною ціанобактерії.",
    relation: "Рослини походять від спільного предка з червоними та зеленими водоростями.",
    example: "Троянда, папороть, хламідомонада (одноклітинна зелена водорість)."
  },
  diaphoretickes: {
    name: "Діафоретики",
    text: "Велика група еукаріотів, до якої належать рослини, водорості та багато протистів.",
    relation: "Тісно пов'язана з групою SAR. Разом вони складають велику частину різноманіття протистів.",
    example: "Зелені водорості та рослини, а також діатомові (через групу SAR)."
  },
  sar: {
    name: "SAR",
    text: "Надгрупа протистів, назва складається з початкових літер трьох груп: Stramenopiles, Alveolata і Rhizaria.",
    relation: "Тісно пов'язана з Діафоретиками. До неї належать багато водоростей і одноклітинних організмів моря.",
    example: "Діатомові водорості, динофлагелати, форамініфери."
  }
};

const domainButtons = document.querySelectorAll(".domain");
const tip = document.getElementById("domainTip");
const tipTitle = document.getElementById("tipTitle");
const tipText = document.getElementById("tipText");
const tipRelation = document.getElementById("tipRelation");
const tipExample = document.getElementById("tipExample");
const tipClose = document.getElementById("tipClose");

let activeBtn = null;
let pinned = false;

function showTip(btn) {
  const d = domainData[btn.dataset.domain];
  tipTitle.textContent = d.name;
  tipText.textContent = d.text;
  tipRelation.textContent = d.relation;
  tipExample.textContent = d.example;

  tip.hidden = false;
  activeBtn = btn;
  domainButtons.forEach((b) => b.classList.toggle("active", b === btn));
  positionTip(btn);
}

function hideTip() {
  tip.hidden = true;
  activeBtn = null;
  pinned = false;
  domainButtons.forEach((b) => b.classList.remove("active"));
}

function positionTip(btn) {
  const r = btn.getBoundingClientRect();
  const tw = tip.offsetWidth;
  const th = tip.offsetHeight;

  let left = r.left + r.width / 2 + window.scrollX - tw / 2;
  const minLeft = window.scrollX + 12;
  const maxLeft = window.scrollX + document.documentElement.clientWidth - tw - 12;
  left = Math.max(minLeft, Math.min(left, maxLeft));

  let top = r.bottom + window.scrollY + 14;
  if (r.bottom + th + 20 > window.innerHeight) {
    top = r.top + window.scrollY - th - 14;
  }

  tip.style.left = left + "px";
  tip.style.top = top + "px";
}

domainButtons.forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    if (!pinned) showTip(btn);
  });
  btn.addEventListener("mouseleave", () => {
    if (!pinned) hideTip();
  });
  btn.addEventListener("focus", () => {
    if (!pinned) showTip(btn);
  });
  btn.addEventListener("blur", () => {
    if (!pinned) hideTip();
  });

  btn.addEventListener("click", () => {
    if (pinned && activeBtn === btn) {
      hideTip();
    } else {
      pinned = true;
      showTip(btn);
    }
  });
});

tipClose.addEventListener("click", hideTip);

document.addEventListener("click", (e) => {
  if (!e.target.closest(".domain, .domain-tip")) hideTip();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideTip();
});

window.addEventListener("resize", () => {
  if (activeBtn) positionTip(activeBtn);
});
const scrollThumb = document.querySelector(".scroll-thumb");

function updateScrollThumb() {
  const root = document.documentElement;
  const maxScroll = root.scrollHeight - root.clientHeight;
  const trackHeight = window.innerHeight;
  const thumbHeight = Math.max(40, trackHeight * root.clientHeight / root.scrollHeight);
  const maxTop = trackHeight - thumbHeight;
  const top = maxScroll > 0 ? (window.scrollY / maxScroll) * maxTop : 0;

  scrollThumb.style.height = thumbHeight + "px";
  scrollThumb.style.transform = `translateY(${top}px)`;
}

window.addEventListener("scroll", updateScrollThumb, { passive: true });
window.addEventListener("resize", updateScrollThumb);
updateScrollThumb();

let dragging = false;
let dragStartY = 0;
let dragStartScroll = 0;

scrollThumb.addEventListener("mousedown", (e) => {
  dragging = true;
  dragStartY = e.clientY;
  dragStartScroll = window.scrollY;
  document.body.style.userSelect = "none";
  e.preventDefault();
});

window.addEventListener("mousemove", (e) => {
  if (!dragging) return;
  const root = document.documentElement;
  const maxScroll = root.scrollHeight - root.clientHeight;
  const thumbHeight = scrollThumb.offsetHeight;
  const maxTop = window.innerHeight - thumbHeight;
  const deltaY = e.clientY - dragStartY;
  const scrollDelta = maxTop > 0 ? (deltaY / maxTop) * maxScroll : 0;
  window.scrollTo({ top: dragStartScroll + scrollDelta, behavior: "auto" });
});

window.addEventListener("mouseup", () => {
  if (!dragging) return;
  dragging = false;
  document.body.style.userSelect = "";
});