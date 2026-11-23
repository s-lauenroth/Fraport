/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-article.js
  var import_article_exports = {};
  __export(import_article_exports, {
    default: () => import_article_default
  });

  // tools/importer/parsers/breadcrumb.js
  var BASE = "https://www.fraport.com";
  function absUrl(href, params) {
    if (!href) return href;
    try {
      return new URL(href, params && params.originalURL || BASE).href;
    } catch (e) {
      return href;
    }
  }
  function parse(element, { document, params }) {
    const root = element.matches("frach-m-breadcrumb-navigation, .frach-m-breadcrumb-navigation") ? element : element.querySelector("frach-m-breadcrumb-navigation, .frach-m-breadcrumb-navigation") || element;
    const items = [...root.querySelectorAll("li.frach-m-breadcrumb-navigation__item")];
    const ul = document.createElement("ul");
    items.forEach((item) => {
      const labelEl = item.querySelector(".frach-m-breadcrumb-navigation__label") || item;
      const label = labelEl.textContent.replace(/\s+/g, " ").trim();
      if (!label) return;
      const li = document.createElement("li");
      const link2 = item.querySelector("a[href]");
      if (link2) {
        const a = document.createElement("a");
        a.href = absUrl(link2.getAttribute("href"), params);
        a.textContent = label;
        li.append(a);
      } else {
        li.textContent = label;
      }
      ul.append(li);
    });
    const cells = [[ul.children.length ? ul : ""]];
    const block = WebImporter.Blocks.createBlock(document, { name: "breadcrumb", cells });
    element.replaceWith(block);
  }

  // tools/importer/utils/fraport-parser-utils.js
  var BASE2 = "https://www.fraport.com";
  var PLACEHOLDER = /^data:|blank\.gif|placeholder|spacer\.gif|transparent\.(gif|png)|^about:/i;
  function clean(text) {
    return (text || "").replace(/<\/?[a-z][^>]*>/gi, " ").replace(/\s*[ \t\n\r\f\v]\s*/g, " ").trim();
  }
  var INLINE_KEEP = /* @__PURE__ */ new Set(["STRONG", "EM", "BR", "A", "SUP", "SUB", "U", "CODE"]);
  var INLINE_MAP = { B: "strong", I: "em" };
  var INLINE_DROP = "noscript, script, style, frach-e-icon, svg, button, input, img, frach-e-lazy-image, picture";
  function inlineNodes(document, el) {
    if (!el) return [];
    const out = document.createElement("span");
    const copy = (src, dest) => {
      [...src.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const t = n.textContent.replace(/\s*[ \t\n\r\f\v]\s*/g, " ");
          if (t) dest.append(document.createTextNode(t));
          return;
        }
        if (n.nodeType !== 1 || n.matches(INLINE_DROP)) return;
        const tag = INLINE_MAP[n.tagName] || (INLINE_KEEP.has(n.tagName) ? n.tagName.toLowerCase() : null);
        if (!tag) {
          copy(n, dest);
          return;
        }
        if (tag === "br") {
          dest.append(document.createElement("br"));
          return;
        }
        const e = document.createElement(tag);
        if (tag === "a") {
          const href = n.getAttribute("href");
          if (!href) {
            copy(n, dest);
            return;
          }
          e.setAttribute("href", absUrl2(href));
          if (n.getAttribute("target") === "_blank") e.setAttribute("target", "_blank");
        }
        copy(n, e);
        if (e.textContent.trim() || e.querySelector("br")) dest.append(e);
      });
    };
    copy(el, out);
    out.normalize();
    const trimEnd = (first) => {
      let n = first ? out.firstChild : out.lastChild;
      while (n) {
        if (n.nodeName === "BR") {
          const next = first ? n.nextSibling : n.previousSibling;
          n.remove();
          n = next;
          continue;
        }
        if (n.nodeType === 3) {
          const t = first ? n.textContent.replace(/^[ \t\n\r\f\v]+/, "") : n.textContent.replace(/[ \t\n\r\f\v]+$/, "");
          if (!t.trim()) {
            const next = first ? n.nextSibling : n.previousSibling;
            n.remove();
            n = next;
            continue;
          }
          n.textContent = t;
        }
        break;
      }
    };
    trimEnd(true);
    trimEnd(false);
    return [...out.childNodes];
  }
  function headingFrom(document, src, level) {
    const tag = level || (/^H[1-6]$/.test(src.tagName) ? src.tagName.toLowerCase() : "h3");
    const h = document.createElement(tag);
    h.append(...inlineNodes(document, src));
    return h;
  }
  function paraFrom(document, src) {
    const p = document.createElement("p");
    p.append(...inlineNodes(document, src));
    return p;
  }
  function buttonStyle(a) {
    const cls = a && a.getAttribute && a.getAttribute("class") || "";
    if (!/(^|\s)frach-e-button(\s|$)/.test(cls) || /frach-e-button--icon-only/.test(cls)) return "";
    const m = cls.match(/frach-e-button--(primary|secondary|tertiary)/);
    return m ? m[1] : "";
  }
  function wrapButton(document, node, style) {
    if (style === "primary") {
      const s = document.createElement("strong");
      s.append(node);
      return s;
    }
    if (style === "secondary") {
      const e = document.createElement("em");
      e.append(node);
      return e;
    }
    if (style === "tertiary") {
      const s = document.createElement("strong");
      const e = document.createElement("em");
      e.append(node);
      s.append(e);
      return s;
    }
    return node;
  }
  function styleButtons(document, root, opts = {}) {
    if (!root || !root.querySelectorAll) return root;
    root.querySelectorAll("a[href]").forEach((a) => {
      const style = buttonStyle(a);
      if (!style) return;
      if (opts.skip && a.closest(opts.skip)) return;
      const href = (a.getAttribute("href") || "").trim();
      if (!href || href === "#" || /^javascript:/i.test(href)) return;
      if (a.parentElement && a.parentElement.closest("strong, em, b, i")) return;
      const label = a.querySelector(".frach-e-button__label");
      const text = clean((label || a).textContent);
      if (!text) return;
      a.textContent = text;
      const marker = document.createElement("span");
      a.replaceWith(marker);
      let wrapped = wrapButton(document, a, style);
      if (opts.paragraph && marker.parentElement && !marker.parentElement.closest("p, li, h1, h2, h3, h4, h5, h6, td, th")) {
        wrapped = para(document, wrapped);
      }
      marker.replaceWith(wrapped);
    });
    return root;
  }
  function absUrl2(u) {
    if (!u) return "";
    const s = u.trim();
    if (/^(mailto:|tel:|javascript:|#)/i.test(s)) return s;
    try {
      return new URL(s, BASE2).href;
    } catch (e) {
      return s;
    }
  }
  function restoreIframes(document, root) {
    if (!root || !root.querySelectorAll) return;
    const holders = [
      ...root.matches && root.matches("[data-excat-iframes]") ? [root] : [],
      ...root.querySelectorAll("[data-excat-iframes]")
    ];
    holders.forEach((holder) => {
      let list = [];
      try {
        list = JSON.parse(holder.getAttribute("data-excat-iframes") || "[]");
      } catch (e) {
        list = [];
      }
      holder.removeAttribute("data-excat-iframes");
      list.forEach(({ src, title }) => {
        if (!src) return;
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", src);
        if (title) iframe.setAttribute("title", title);
        holder.appendChild(iframe);
      });
    });
  }
  function findRoot(element, selector) {
    if (element.matches && element.matches(selector)) return element;
    return element.querySelector(selector) || element;
  }
  function bestSrc(el) {
    if (!el || !el.getAttribute) return "";
    for (const c of [el.getAttribute("src"), el.getAttribute("data-src"), el.getAttribute("data-lazy-src")]) {
      if (c && c.trim() && !PLACEHOLDER.test(c.trim())) return c.trim();
    }
    const ss = el.getAttribute("srcset") || el.getAttribute("data-srcset");
    if (ss) {
      const list = ss.split(",").map((s) => s.trim().split(/\s+/)[0]).filter((s) => s && !PLACEHOLDER.test(s));
      if (list.length) return list[list.length - 1];
    }
    return "";
  }
  function dataLayer(el) {
    const raw = el && el.getAttribute && el.getAttribute("data-cmp-data-layer");
    if (!raw) return null;
    try {
      return Object.values(JSON.parse(raw))[0] || null;
    } catch (e) {
      return null;
    }
  }
  function createImg(document, src, alt) {
    const img = document.createElement("img");
    img.setAttribute("src", absUrl2(src));
    const text = clean((alt || "").replace(/&nbsp;|&#160;/gi, " ").replace(/\u00a0/g, " "));
    if (text) img.setAttribute("alt", text);
    return img;
  }
  function makeImage(document, scope) {
    if (!scope) return null;
    const node = scope.matches && scope.matches("img, frach-e-lazy-image") ? scope : scope.querySelector("frach-e-lazy-image, img:not(.ff_preview)");
    if (node) {
      const inner = node.tagName === "IMG" ? null : node.querySelector("img");
      const src = bestSrc(node) || bestSrc(inner);
      const alt = node.getAttribute("alt") || inner && inner.getAttribute("alt") || "";
      if (src) return createImg(document, src, alt);
    }
    const comp = scope.matches && scope.matches("frach-m-image") ? scope : scope.querySelector("frach-m-image");
    const dl = dataLayer(comp);
    const path = dl && dl.image && dl.image["repo:path"];
    if (path) return createImg(document, path, "");
    const video = scope.querySelector && scope.querySelector("video[poster]");
    if (video) return createImg(document, video.getAttribute("poster"), "");
    return null;
  }
  function imageLink(scope) {
    if (!scope) return "";
    const a = scope.querySelector("a.frach-m-image__link[href], figure a[href]");
    if (a) return a.getAttribute("href");
    const comp = scope.matches && scope.matches("frach-m-image") ? scope : scope.querySelector("frach-m-image");
    const dl = dataLayer(comp);
    return dl && dl["xdm:linkURL"] || "";
  }
  function para(document, ...children) {
    const p = document.createElement("p");
    children.filter(Boolean).forEach((c) => p.append(c));
    return p;
  }
  function link(document, href, text) {
    const a = document.createElement("a");
    a.setAttribute("href", absUrl2(href));
    a.textContent = clean(text) || absUrl2(href);
    return a;
  }
  function normalizeContent(document, root) {
    root.querySelectorAll("noscript, frach-e-icon, script, style, button.frach-e-button--icon-only").forEach((n) => n.remove());
    root.querySelectorAll("frach-e-lazy-image").forEach((lazy) => {
      const img = makeImage(document, lazy);
      if (img) lazy.replaceWith(img);
      else lazy.remove();
    });
    root.querySelectorAll("img").forEach((img) => {
      const src = bestSrc(img);
      if (src) img.setAttribute("src", absUrl2(src));
      ["data-src", "srcset", "data-srcset", "sizes"].forEach((a) => img.removeAttribute(a));
    });
    root.querySelectorAll("frach-m-image").forEach((comp) => {
      if (comp.querySelector("img")) return;
      const img = makeImage(document, comp);
      if (img) comp.append(img);
    });
    root.querySelectorAll("a[href]").forEach((a) => a.setAttribute("href", absUrl2(a.getAttribute("href"))));
    styleButtons(document, root);
    return root;
  }
  function textMediaParts(tm) {
    const row = tm.querySelector(".frach-m-text-media__row") || tm;
    const headline = tm.querySelector(".frach-m-text-media__headline") || [...row.children].find((c) => /^H[1-6]$/.test(c.tagName));
    const media = tm.querySelector(".frach-m-text-media__media");
    const text = tm.querySelector(".frach-m-text-media__text");
    const mediaFirst = !text || !media || !!(media.compareDocumentPosition(text) & 4);
    return { headline: headline && clean(headline.textContent) ? headline : null, media, text, mediaFirst };
  }
  var BLOCK_TAGS = /^(P|H[1-6]|UL|OL|TABLE|BLOCKQUOTE|PRE|DIV|SECTION|FIGURE|ADDRESS|DL|HR)$/;
  function textContent(document, container) {
    if (!container) return [];
    const rte = container.matches && container.matches(".cmp-text") ? container : container.querySelector(".cmp-text") || container.querySelector(".frach-m-text__rte-wrapper") || container;
    normalizeContent(document, rte);
    const out = [];
    let loose = null;
    [...rte.childNodes].forEach((n) => {
      if (n.nodeType === 3 && !n.textContent.trim()) return;
      if (n.nodeType === 1 && BLOCK_TAGS.test(n.tagName)) {
        loose = null;
        if (n.tagName === "DIV" || n.tagName === "SECTION") {
          if (clean(n.textContent) || n.querySelector("img, table, iframe")) out.push(n);
        } else if (n.tagName === "P" && !clean(n.textContent) && !n.querySelector("img")) {
        } else out.push(n);
        return;
      }
      if (n.nodeType !== 1 && n.nodeType !== 3) return;
      const isButton = n.nodeType === 1 && /^(STRONG|EM)$/.test(n.tagName) && n.querySelector("a.frach-e-button") && clean(n.textContent) === clean(n.querySelector("a").textContent);
      if (loose && n.nodeType === 1 && (n.tagName === "A" || isButton) && loose.querySelector("a")) loose = null;
      if (loose && isButton && clean(loose.textContent)) loose = null;
      if (!loose) {
        loose = document.createElement("p");
        out.push(loose);
      }
      loose.append(n);
      if (isButton) loose = null;
    });
    const buttons = container.querySelector && container.querySelector(".frach-m-text__buttons");
    if (buttons && !rte.contains(buttons)) out.push(...buttonLinks(document, buttons));
    return out.filter((n) => clean(n.textContent) || n.querySelector && n.querySelector("img, table, iframe"));
  }
  function linkParagraph(document, a) {
    const label = a.querySelector(".frach-e-button__label") || a;
    const l = link(document, a.getAttribute("href"), label.textContent);
    if (a.getAttribute("target") === "_blank") l.setAttribute("target", "_blank");
    const href = (a.getAttribute("href") || "").trim();
    const style = href && href !== "#" && !/^javascript:/i.test(href) ? buttonStyle(a) : "";
    return para(document, wrapButton(document, l, style));
  }
  function buttonLinks(document, scope) {
    if (!scope) return [];
    return [...scope.querySelectorAll("a[href]")].filter((a) => clean(a.textContent)).map((a) => linkParagraph(document, a));
  }
  function gridColumns(row) {
    if (!row) return [];
    return [...row.children].filter((c) => /(^|\s)frach-grid-col-/.test(c.className || ""));
  }
  var RICH_TAGS = "p, h1, h2, h3, h4, h5, h6, ul, ol, table, blockquote, pre, dl, address";
  function richContent(document, root) {
    if (!root) return [];
    normalizeContent(document, root);
    const out = [];
    const walk = (node) => {
      [...node.children].forEach((c) => {
        if (c.matches(RICH_TAGS)) {
          if (clean(c.textContent) || c.querySelector("img")) out.push(c);
        } else if (c.tagName === "IMG") {
          out.push(para(document, c));
        } else if (c.matches("a[href]") && clean(c.textContent)) {
          out.push(linkParagraph(document, c));
        } else walk(c);
      });
    };
    walk(root);
    return out;
  }
  function imageComponent(document, comp) {
    const img = makeImage(document, comp);
    if (!img) return [];
    const href = imageLink(comp);
    let media = img;
    if (href && href !== "#" && !/^javascript:/i.test(href)) {
      media = document.createElement("a");
      media.setAttribute("href", absUrl2(href));
      media.append(img);
    }
    const out = [para(document, media)];
    const cap = comp.querySelector("figcaption, .frach-m-image__caption");
    if (cap && clean(cap.textContent)) {
      const p = para(document, document.createTextNode(clean(cap.textContent)));
      p.dataset.caption = "true";
      out.push(p);
    }
    return out;
  }
  function cardComponent(document, card) {
    const out = [];
    const a = card.querySelector("a.frach-m-card__link[href], a[href]");
    const img = makeImage(document, card.querySelector(".frach-m-card__image-wrapper") || card);
    if (img) out.push(para(document, img));
    card.querySelectorAll(".frach-m-card__meta p, .frach-m-card__meta .frach-m-teaser__theme").forEach((m) => {
      if (clean(m.textContent)) out.push(para(document, document.createTextNode(clean(m.textContent).replace(/\s+,/g, ","))));
    });
    const h = card.querySelector("h1, h2, h3, h4, h5, h6");
    if (h) {
      const heading2 = document.createElement(h.tagName.toLowerCase());
      if (a) {
        const l = link(document, a.getAttribute("href"), h.textContent);
        const inner = inlineNodes(document, h).filter((n) => n.nodeName !== "A");
        if (inner.length && !h.querySelector("a")) l.replaceChildren(...inner);
        heading2.append(l);
      } else heading2.append(...inlineNodes(document, h));
      out.push(heading2);
    }
    card.querySelectorAll(".frach-m-card__text > p, .frach-m-card__description").forEach((p) => {
      if (clean(p.textContent)) out.push(paraFrom(document, p));
    });
    return out;
  }
  var SKIP = "noscript, script, style, .frach-m-media-lightbox, .frach-m-overlay, .frach-js-overlay, button, input, frach-e-icon, .frach-m-slider__controls";
  function componentContent(document, scope) {
    const out = [];
    if (!scope) return out;
    const visit = (node) => {
      [...node.children].forEach((c) => {
        if (c.matches(SKIP)) return;
        if (c.matches("frach-m-text-media, .frach-m-text-media")) {
          const { headline, media, text, mediaFirst } = textMediaParts(c);
          const h = headline ? headingFrom(document, headline) : null;
          const m = media ? visitInto(media) : [];
          const t = text ? textContent(document, text.querySelector(".frach-m-text") || text) : [];
          if (h) out.push(h);
          out.push(...mediaFirst ? [...m, ...t] : [...t, ...m]);
          return;
        }
        if (c.matches("frach-m-image")) {
          out.push(...imageComponent(document, c));
          return;
        }
        if (c.matches(".frach-m-text")) {
          out.push(...textContent(document, c));
          return;
        }
        if (c.matches(".cmp-text")) {
          out.push(...textContent(document, c));
          return;
        }
        if (c.matches(".frach-m-card")) {
          out.push(...cardComponent(document, c));
          return;
        }
        if (c.matches("frach-e-lazy-image, img")) {
          const img = makeImage(document, c);
          if (img) out.push(para(document, img));
          return;
        }
        if (c.matches("iframe[src]")) {
          out.push(para(document, link(document, c.getAttribute("src"), c.getAttribute("src"))));
          return;
        }
        if (c.matches(".frach-m-download-list")) {
          const ul = downloadList(document, c);
          if (ul) out.push(ul);
          return;
        }
        if (c.matches(".frach-m-contact")) {
          const img = makeImage(document, c);
          if (img) out.push(para(document, img));
          const info = c.querySelector("address, .frach-m-contact__info");
          out.push(...textContent(document, info || c));
          return;
        }
        if (c.matches(`.frach-m-link-box, .frach-m-contact, ${RICH_TAGS}`)) {
          if (c.matches(RICH_TAGS)) {
            normalizeContent(document, c);
            if (clean(c.textContent) || c.querySelector("img")) out.push(c);
            return;
          }
          out.push(...richContent(document, c));
          return;
        }
        if (c.matches("a[href]") && clean(c.textContent) && !c.querySelector("div, p, h1, h2, h3, h4, h5, h6, img, frach-e-lazy-image")) {
          out.push(linkParagraph(document, c));
          return;
        }
        visit(c);
      });
    };
    const visitInto = (node) => {
      const saved = out.length;
      visit(node);
      return out.splice(saved);
    };
    visit(scope);
    return out;
  }
  function downloadList(document, dl) {
    const items = [...dl.querySelectorAll("li.frach-m-download-list__item, li")].filter((li) => li.querySelector("a[href]"));
    const ul = document.createElement("ul");
    const seen = /* @__PURE__ */ new Set();
    items.forEach((item) => {
      if (seen.has(item.parentElement && item.parentElement.closest("li.frach-m-download-list__item"))) return;
      seen.add(item);
      const a = item.querySelector("a[href]");
      const nameEl = item.querySelector(".frach-m-download-list__file-name") || a;
      const name = clean(nameEl.textContent);
      if (!name) return;
      const li = document.createElement("li");
      li.append(link(document, a.getAttribute("href"), name));
      const metaEl = item.querySelector(".frach-m-download-list__meta-info");
      const meta = metaEl ? clean(metaEl.textContent) : "";
      if (meta) li.append(document.createElement("br"), document.createTextNode(meta));
      ul.append(li);
    });
    return ul.children.length ? ul : null;
  }
  function pageLang(document, params) {
    const lang = document.documentElement && document.documentElement.getAttribute("lang") || "";
    if (lang) return lang.slice(0, 2).toLowerCase();
    const url = params && params.originalURL || "";
    return url.includes("/en/") ? "en" : "de";
  }
  function animatedNumber(el, lang) {
    if (!el) return "";
    const rendered = clean(el.textContent);
    if (rendered && /\d/.test(rendered)) return rendered;
    const raw = parseFloat(el.getAttribute("value"));
    if (Number.isNaN(raw)) return clean(el.getAttribute("value"));
    const fdAttr = el.getAttribute("fraction-digits");
    const fd = fdAttr != null && fdAttr !== "" ? parseInt(fdAttr, 10) : el.getAttribute("currency") ? 2 : (String(el.getAttribute("value")).match(/\.(\d*[1-9])/) || ["", ""])[1].length;
    let num;
    try {
      num = raw.toLocaleString(lang === "en" ? "en-US" : "de-DE", { minimumFractionDigits: fd, maximumFractionDigits: fd });
    } catch (e) {
      num = raw.toFixed(fd);
    }
    const prefix = clean(el.getAttribute("prefix") || "");
    const CURRENCY = { EUR: "\u20AC", USD: "$", GBP: "\xA3" };
    const cur = el.getAttribute("currency") || "";
    const suffix = clean(el.getAttribute("suffix") || CURRENCY[cur] || cur);
    const sep = (s) => s && !/^[%‰]/.test(s) ? " " : "";
    return `${prefix}${prefix && /[\p{L}.]$/u.test(prefix) ? " " : ""}${num}${suffix ? sep(suffix) + suffix : ""}`;
  }

  // tools/importer/parsers/sticky-patch.js
  function parse2(element, { document }) {
    const root = findRoot(element, "frach-e-sticky-patch, .frach-e-sticky-patch");
    const content = root.querySelector(".frach-e-sticky-patch__content") || root;
    const cell = [];
    const img = makeImage(document, content.querySelector(".frach-e-sticky-patch__icon-image-container") || content);
    if (img) cell.push(para(document, img));
    const heading2 = content.querySelector("h1, h2, h3, h4, h5, h6");
    if (heading2 && clean(heading2.textContent)) {
      cell.push(headingFrom(document, heading2, heading2.tagName.toLowerCase()));
    }
    content.querySelectorAll("p").forEach((p) => {
      if (clean(p.textContent)) cell.push(paraFrom(document, p));
    });
    const a = [...content.querySelectorAll("a[href]")].find((x) => clean(x.textContent));
    if (a) {
      const label = a.querySelector(".frach-e-link__link-label, .frach-e-button__label") || a;
      const l = link(document, a.getAttribute("href"), label.textContent);
      if (a.getAttribute("target") === "_blank") l.setAttribute("target", "_blank");
      cell.push(para(document, l));
    }
    if (!cell.length) {
      element.remove();
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "sticky-patch", cells: [[cell]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/anchor-list.js
  function pagePath(u) {
    try {
      return new URL(u).pathname.replace(/\.html?$/, "").replace(/\/$/, "");
    } catch (e) {
      return "";
    }
  }
  function parse3(element, { document, params }) {
    const root = findRoot(element, "frach-m-anchor-list, .frach-m-anchor-list");
    const content = root.querySelector(".frach-m-accordion__section-content");
    let anchors = content ? [...content.querySelectorAll("a[href]")] : [];
    if (!anchors.length) {
      anchors = [...root.querySelectorAll("a.frach-m-anchor-list__anchor[href]")].filter((a) => !a.classList.contains("frach-m-anchor-list__anchor--toggle-item"));
    }
    const page = pagePath(params && params.originalURL || "");
    const numbered = anchors.some((a) => a.querySelector(".frach-m-anchor-list__number"));
    const ul = document.createElement("ul");
    const seen = /* @__PURE__ */ new Set();
    anchors.forEach((a) => {
      const textEl = a.querySelector(".frach-m-anchor-list__text") || a;
      const text = clean(textEl.textContent);
      let href = a.getAttribute("href") || "";
      if (!text || !href) return;
      if (!href.startsWith("#")) {
        const abs = absUrl2(href);
        const hash = abs.includes("#") ? abs.slice(abs.indexOf("#")) : "";
        href = hash && pagePath(abs) === page ? hash : abs;
      }
      if (seen.has(href)) return;
      seen.add(href);
      const li = document.createElement("li");
      const l = document.createElement("a");
      l.setAttribute("href", href);
      l.textContent = text;
      li.append(l);
      ul.append(li);
    });
    if (!ul.children.length) {
      element.remove();
      return;
    }
    const name = numbered ? "anchor-list (numbered)" : "anchor-list";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: [[ul]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tag-list.js
  function tagListBlock(document, scope) {
    const root = scope.matches && scope.matches(".frach-m-page-meta-data__tags") ? scope : scope.querySelector(".frach-m-page-meta-data__tags") || scope;
    const tags = [...root.querySelectorAll("frach-e-tag, .frach-e-tag")].filter((t) => !t.parentElement.closest("frach-e-tag, .frach-e-tag"));
    const cells = [];
    tags.forEach((tag) => {
      const label = tag.querySelector(".frach-e-tag__label") || tag;
      const text = clean(label.textContent) || clean(tag.getAttribute("title"));
      if (!text) return;
      const ul = document.createElement("ul");
      const li = document.createElement("li");
      const src = tag.matches("a[href]") ? tag : tag.querySelector("a[href]");
      const href = src && src.getAttribute("href");
      if (href && href !== "#" && !/^javascript:/i.test(href)) {
        const a = document.createElement("a");
        a.setAttribute("href", absUrl2(href));
        a.textContent = text;
        li.append(a);
      } else li.textContent = text;
      ul.append(li);
      cells.push([ul]);
    });
    if (!cells.length) return null;
    return WebImporter.Blocks.createBlock(document, { name: "tag-list", cells });
  }
  function parse4(element, { document }) {
    const block = tagListBlock(document, element);
    if (block) element.replaceWith(block);
    else element.remove();
  }

  // tools/importer/parsers/article-footer.js
  function linkLabel(a) {
    const copy = a.cloneNode(true);
    copy.querySelectorAll("frach-e-icon, noscript, svg, img").forEach((n) => n.remove());
    return clean(copy.textContent) || clean(a.getAttribute("title"));
  }
  function parse5(element, { document }) {
    const root = element.matches(".frach-m-page-meta-data") ? element : element.querySelector(".frach-m-page-meta-data") || element;
    const out = [];
    const time = root.querySelector(".frach-m-page-meta-data__date time, .frach-m-page-meta-data__date");
    const date = time && clean(time.textContent);
    if (date) out.push(para(document, document.createTextNode(date)));
    const backSrc = root.querySelector(".frach-m-page-meta-data__text a[href]");
    const label = backSrc && linkLabel(backSrc);
    if (backSrc && label) {
      const cells = [[para(document, link(document, backSrc.getAttribute("href"), label))]];
      out.push(WebImporter.Blocks.createBlock(document, { name: "article-footer", cells }));
    }
    const tags = root.querySelector(".frach-m-page-meta-data__tags");
    const tagBlock = tags && tagListBlock(document, tags);
    if (tagBlock) out.push(tagBlock);
    if (out.length) element.replaceWith(...out);
    else element.remove();
  }

  // tools/importer/parsers/hero.js
  function parse6(element, { document, params }) {
    const root = element.matches("frach-m-hero, .frach-m-hero") ? element : element.querySelector("frach-m-hero, .frach-m-hero") || element;
    const cell = [];
    const media = root.querySelector('.frach-m-hero__media, [class*="__image-container"]') || root;
    const img = makeImage(document, media);
    if (img) cell.push(para(document, img));
    const headline = root.querySelector("h1, .frach-e-headline");
    const variants = [];
    const heroEl = root.closest ? root.closest("frach-m-hero, .frach-m-hero") : null;
    const heroCls = heroEl ? heroEl.getAttribute("class") || "" : "";
    if (/(^|\s)frach-m-hero--21-9(\s|$)/.test(heroCls)) variants.push("ratio-21-9");
    if (/(^|\s)frach-m-hero--full-width(\s|$)/.test(heroCls)) variants.push("full-width");
    let variant = "";
    if (headline && clean(headline.textContent)) {
      const h1 = document.createElement("h1");
      const lines = [...headline.querySelectorAll(".frach-e-headline__line")].map((l) => clean(l.textContent)).filter(Boolean);
      (lines.length ? lines : [clean(headline.textContent)]).forEach((line, i) => {
        if (i) h1.append(document.createElement("br"));
        h1.append(document.createTextNode(line));
      });
      cell.push(h1);
      const cls = headline.className || "";
      if (/frach-h-bg--primary(\s|$)/.test(cls)) variant = "primary";
      else if (/frach-h-bg--secondary(\s|$)/.test(cls)) variant = "secondary";
    } else {
      const content = root.querySelector('[class*="__content"]');
      if (content) {
        const loose = [...content.childNodes].filter((n) => n.nodeType === 3 && clean(n.textContent) || n.nodeType === 1 && n.matches("span") && !n.querySelector("h1, h2, h3, h4, h5, h6, p, a"));
        const wanted = [...content.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a[href], frach-e-animated-number"), ...loose].sort((a, b) => a.compareDocumentPosition(b) & 4 ? -1 : 1);
        wanted.forEach((n) => {
          if (n.nodeType === 1 && n.matches("a") && n.closest("p, h1, h2, h3, h4, h5, h6")) return;
          const text = n.nodeType === 1 && n.matches("frach-e-animated-number") ? animatedNumber(n, pageLang(document, params)) : clean(n.textContent);
          if (!text) return;
          if (/^H[1-6]$/.test(n.tagName)) {
            const h = document.createElement(n.tagName.toLowerCase());
            h.textContent = text;
            cell.push(h);
          } else if (n.tagName === "A") {
            const a = document.createElement("a");
            a.setAttribute("href", absUrl2(n.getAttribute("href")));
            a.textContent = text;
            cell.push(para(document, a));
          } else cell.push(para(document, document.createTextNode(text)));
        });
      }
    }
    if (variant) variants.unshift(variant);
    const name = variants.length ? `hero (${variants.join(", ")})` : "hero";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: [[cell.length ? cell : ""]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-text-media.js
  function textMediaSlide(document, tm) {
    const media = tm.querySelector(".frach-m-text-media__media");
    const img = media ? makeImage(document, media) : null;
    const textWrap = tm.querySelector(".frach-m-text-media__text") || tm;
    const { headline } = textMediaParts(tm);
    const texts = textContent(document, textWrap.querySelector(".frach-m-text, .frach-m-text-media__copy") || textWrap);
    if (headline) texts.unshift(headingFrom(document, headline));
    return { img, texts: texts.map((n) => tablesToLists(document, n)) };
  }
  function tablesToLists(document, node) {
    const toList = (table) => {
      const ul = document.createElement("ul");
      table.querySelectorAll("tr").forEach((tr) => {
        const parts = [...tr.children].filter((c) => /^(TD|TH)$/.test(c.tagName)).map((c) => inlineNodes(document, c)).filter((p) => p.some((n) => clean(n.textContent)));
        if (!parts.length) return;
        const li = document.createElement("li");
        parts.forEach((p, i) => {
          if (i) li.append(document.createTextNode(" \u2013 "));
          li.append(...p);
        });
        ul.append(li);
      });
      return ul;
    };
    if (node.tagName === "TABLE") return toList(node);
    if (node.querySelectorAll) node.querySelectorAll("table").forEach((t) => t.replaceWith(toList(t)));
    return node;
  }
  function testimonialSlide(document, t) {
    const img = makeImage(document, t.querySelector(".frach-m-testimonial__image") || t);
    const texts = [];
    const headline = t.querySelector(".frach-m-testimonial__quote-headline");
    if (headline && clean(headline.textContent)) texts.push(paraFrom(document, headline));
    t.querySelectorAll(".frach-m-testimonial__quote-text").forEach((q) => {
      if (!clean(q.textContent)) return;
      const bq = document.createElement("blockquote");
      bq.append(paraFrom(document, q));
      texts.push(bq);
    });
    const meta = t.querySelector(".frach-m-testimonial__meta");
    if (meta && clean(meta.textContent)) texts.push(paraFrom(document, meta));
    return { img, texts };
  }
  function parse7(element, { document, params }) {
    const slider = element.matches(".frach-m-slider") ? element : element.querySelector(".frach-m-slider") || element;
    let slides = [...slider.querySelectorAll(".frach-m-slider__slide")];
    if (!slides.length) slides = [slider];
    const cells = [];
    let testimonial = 0;
    let rightWithMedia = 0;
    let withMedia = 0;
    let total = 0;
    slides.forEach((slide) => {
      const t = slide.querySelector(".frach-m-testimonial");
      const tm = slide.querySelector("frach-m-text-media, .frach-m-text-media");
      let res;
      if (t) {
        res = testimonialSlide(document, t);
        testimonial += 1;
      } else if (tm) {
        res = textMediaSlide(document, tm);
        if (res.img && /frach-m-text-media--right/.test(tm.className || "")) rightWithMedia += 1;
      } else {
        res = { img: makeImage(document, slide), texts: textContent(document, slide) };
      }
      if (!res.img && !res.texts.length) return;
      total += 1;
      if (res.img) withMedia += 1;
      cells.push(res.img ? [para(document, res.img), res.texts] : [res.texts]);
    });
    let name = "carousel-text-media";
    if (testimonial) name = "carousel-text-media (full-width-photo)";
    else if (rightWithMedia && rightWithMedia === total) name = "carousel-text-media (image-right)";
    else if (total && !withMedia) name = "carousel-text-media (alt)";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/image-gallery-tiles.js
  function heading(document, text) {
    const h = document.createElement("h6");
    h.textContent = clean(text);
    return h;
  }
  function fromLightbox(document, lightbox) {
    const rows = [];
    lightbox.querySelectorAll(".frach-m-slider__slide").forEach((slide) => {
      const img = makeImage(document, slide.querySelector(".frach-m-media-lightbox__image-wrapper") || slide);
      if (!img) return;
      const cell = [para(document, img)];
      const title = slide.querySelector(".frach-m-media-lightbox__text h1, .frach-m-media-lightbox__text h2, .frach-m-media-lightbox__text h3, .frach-m-media-lightbox__text h4, .frach-m-media-lightbox__text h5, .frach-m-media-lightbox__text h6");
      if (title && clean(title.textContent)) cell.push(heading(document, title.textContent));
      const desc = slide.querySelector(".frach-m-media-lightbox__description");
      if (desc && clean(desc.textContent)) cell.push(para(document, document.createTextNode(clean(desc.textContent))));
      const items = [...slide.querySelectorAll(".frach-m-media-lightbox__data-item")].map((li) => clean(li.textContent)).filter(Boolean);
      if (items.length) {
        const ul = document.createElement("ul");
        items.forEach((t) => {
          const li = document.createElement("li");
          li.textContent = t;
          ul.append(li);
        });
        cell.push(ul);
      }
      const dl = slide.querySelector(".frach-m-media-lightbox__button a[href]");
      if (dl && dl.getAttribute("href") !== "#") cell.push(linkParagraph(document, dl));
      rows.push([cell]);
    });
    return rows;
  }
  function lightboxPackage(document, lightbox) {
    const out = [];
    lightbox.querySelectorAll(".frach-m-overlay__footer").forEach((footer) => {
      if (footer.closest(".frach-m-slider__slide")) return;
      const a = footer.querySelector(".frach-m-media-lightbox__button a[href]");
      if (!a || a.getAttribute("href") === "#") return;
      const desc = footer.querySelector(".frach-m-media-lightbox__description");
      if (desc && clean(desc.textContent)) out.push(para(document, document.createTextNode(clean(desc.textContent))));
      const items = [...footer.querySelectorAll(".frach-m-media-lightbox__data-item")].map((li) => clean(li.textContent)).filter(Boolean);
      if (items.length) {
        const ul = document.createElement("ul");
        items.forEach((t) => {
          const li = document.createElement("li");
          li.textContent = t;
          ul.append(li);
        });
        out.push(ul);
      }
      out.push(linkParagraph(document, a));
    });
    return out;
  }
  function fromTiles(document, scope) {
    const rows = [];
    scope.querySelectorAll("frach-m-image").forEach((comp) => {
      if (comp.closest("frach-m-media-lightbox, .frach-m-media-lightbox")) return;
      const img = makeImage(document, comp);
      if (!img) return;
      const cell = [para(document, img)];
      const cap = comp.querySelector("figcaption, .frach-m-image__caption");
      const title = cap && clean(cap.textContent) || "";
      if (title) cell.push(heading(document, title));
      rows.push([cell]);
    });
    return rows;
  }
  function fromSlider(document, slider) {
    const rows = [];
    slider.querySelectorAll(".frach-m-slider__slide").forEach((slide) => {
      const img = makeImage(document, slide.querySelector("frach-m-image, .frach-m-text-media__media, .frach-m-testimonial__image") || slide);
      if (!img) return;
      const cell = [para(document, img)];
      const t = slide.querySelector("h1, h2, h3, h4, h5, h6, figcaption, .frach-m-testimonial__meta, p");
      if (t && clean(t.textContent)) cell.push(heading(document, t.textContent));
      rows.push([cell]);
    });
    return rows;
  }
  function hasSlideCopy(slider) {
    return [...slider.querySelectorAll(".frach-m-slider__slide")].some((slide) => {
      const tm = slide.querySelector("frach-m-text-media, .frach-m-text-media");
      const text = tm && tm.querySelector(".frach-m-text-media__text");
      if (!text) return false;
      if (text.querySelector('table, ul, ol, a[href]:not([href="#"])')) return true;
      const head = clean((tm.querySelector(".frach-m-text-media__headline") || {}).textContent || "");
      const body = clean(text.textContent);
      return body.length > 40 && body !== head;
    });
  }
  function parse8(element, { document, params }) {
    if (!element.matches(".frach-m-slider__controls")) {
      const up = element.closest("frach-m-image-gallery-tiles, .frach-m-image-gallery");
      if (up && up !== element && !element.querySelector("frach-m-image-gallery-tiles, .frach-m-image-gallery")) element = up;
    }
    let cells = [];
    let packageDownload = [];
    let variant = "";
    let target = element;
    if (element.matches(".frach-m-slider__controls")) {
      const slider = element.closest(".frach-m-slider");
      if (slider && hasSlideCopy(slider)) {
        parse7(slider, { document, params });
        if (element.isConnected) element.remove();
        return;
      }
      if (slider) {
        cells = fromSlider(document, slider);
        variant = "alt";
        target = slider;
      }
    } else {
      const gallery = element.matches(".frach-m-image-gallery, frach-m-image-gallery-tiles") ? element : element.querySelector(".frach-m-image-gallery, frach-m-image-gallery-tiles");
      const lightbox = (gallery || element).querySelector("frach-m-media-lightbox, .frach-m-media-lightbox");
      if (gallery && gallery.matches(".frach-m-image-gallery") && gallery.querySelector('[id$="-single-item"], .frach-m-image__icon-overlay--files')) {
        variant = "cover";
      }
      if (lightbox) cells = fromLightbox(document, lightbox);
      if (!cells.length) cells = fromTiles(document, element);
      if (lightbox) packageDownload = lightboxPackage(document, lightbox);
    }
    if (!cells.length) {
      element.remove();
      return;
    }
    const before = [];
    const after = [];
    if (target === element) {
      const firstImg = element.querySelector("frach-m-image");
      [...element.querySelectorAll(".frach-m-text")].filter((t) => !t.closest("frach-m-media-lightbox, .frach-m-media-lightbox, frach-m-image")).forEach((t) => {
        const isBefore = firstImg && !!(t.compareDocumentPosition(firstImg) & 4);
        (isBefore ? before : after).push(...textContent(document, t));
      });
    }
    after.push(...packageDownload);
    const name = variant ? `image-gallery-tiles (${variant})` : "image-gallery-tiles";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    if (before.length || after.length) {
      const frag = document.createDocumentFragment();
      frag.append(...before, block, ...after);
      element.replaceWith(frag);
      return;
    }
    element.replaceWith(block);
    if (target !== element && target.isConnected) target.replaceWith(block);
  }

  // tools/importer/parsers/columns-sidebar.js
  var RAW_TABLE_ATTR = "data-excat-raw-table";
  function parse9(element, { document, params }) {
    const row = findRoot(element, ".frach-grid-row");
    const cols = gridColumns(row);
    const main = cols.find((c) => /frach-grid-col-mq3-8/.test(c.className)) || cols[0] || row;
    const side = cols.find((c) => c !== main && /frach-grid-col-mq3-4/.test(c.className)) || cols.find((c) => c !== main);
    const greyBand = element.matches(".frach-h-bg--grey") || !!element.closest(".frach-h-bg--grey");
    const sideHasContact = !!(side && side.querySelector(".frach-m-contact"));
    const mainHasTable = !!main.querySelector("table, frach-e-table");
    const mainContent = componentContent(document, main);
    const sideContent = side ? componentContent(document, side) : [];
    let variant = "alt";
    if (greyBand) variant = "light-2";
    else if (sideHasContact) variant = "alt-3";
    else if (mainHasTable) variant = "alt-2";
    [...mainContent, ...sideContent].filter((n) => n.nodeType === 1).forEach((n) => {
      if (n.matches("table")) n.removeAttribute(RAW_TABLE_ATTR);
      n.querySelectorAll("table").forEach((t) => t.removeAttribute(RAW_TABLE_ATTR));
    });
    const cells = [sideContent.length ? [mainContent, sideContent] : [mainContent]];
    const block = WebImporter.Blocks.createBlock(document, { name: `columns-sidebar (${variant})`, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cta.js
  function parse10(element, { document, params }) {
    const root = findRoot(element, ".frach-m-cta");
    const cell = [];
    const headline = root.querySelector(".frach-m-cta__headline");
    if (headline && clean(headline.textContent)) {
      const level = /^H[1-6]$/.test(headline.tagName) ? headline.tagName.toLowerCase() : "h3";
      cell.push(headingFrom(document, headline, level));
    }
    root.querySelectorAll(".frach-m-cta__text").forEach((t) => {
      if (clean(t.textContent)) cell.push(paraFrom(document, t));
    });
    let buttons = 0;
    root.querySelectorAll(".frach-m-cta__cta-container a[href], .frach-m-cta__button-container a[href]").forEach((a) => {
      if (cell.some((n) => n.querySelector && n.querySelector(`a[href="${a.href}"]`))) return;
      const label = a.querySelector(".frach-e-button__label") || a;
      if (!clean(label.textContent)) return;
      const l = link(document, a.getAttribute("href"), label.textContent);
      if (a.getAttribute("target") === "_blank") l.setAttribute("target", "_blank");
      cell.push(para(document, wrapButton(document, l, buttonStyle(a))));
      buttons += 1;
    });
    const light = buttons > 1 || !(headline && clean(headline.textContent));
    const name = light ? "cta (light)" : "cta";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: [[cell]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/section-title.js
  function parse11(element, { document }) {
    const root = findRoot(element, ".frach-m-section-title");
    const headline = root.querySelector("h1, h2, h3, h4, h5, h6, .frach-e-headline");
    const cell = [];
    const options = [];
    if (headline && clean(headline.textContent)) {
      const cls = headline.getAttribute("class") || "";
      if (/frach-h-bg--gradient/.test(cls)) options.push("gradient");
      else if (/frach-h-bg--secondary/.test(cls)) options.push("secondary");
      else options.push("primary");
      const h2 = document.createElement("h2");
      const lines = [...headline.querySelectorAll(".frach-e-headline__line")].map((l) => clean(l.textContent)).filter(Boolean);
      (lines.length ? lines : [clean(headline.textContent)]).forEach((line, i) => {
        if (i) h2.append(document.createElement("br"));
        h2.append(document.createTextNode(line));
      });
      cell.push(h2);
    }
    if (/(^|\s)frach-m-section-title--nested(\s|$)/.test(root.getAttribute("class") || "")) options.push("nested");
    root.querySelectorAll("p").forEach((p) => {
      if (headline && headline.contains(p)) return;
      if (clean(p.textContent)) cell.push(paraFrom(document, p));
    });
    if (!cell.length) {
      element.remove();
      return;
    }
    const name = options.length ? `section-title (${options.join(", ")})` : "section-title";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: [[cell]] });
    element.replaceWith(block);
  }

  // tools/importer/utils/fraport-iframes.js
  var fraport_iframes_default = {
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/75-jahre-jubilaeum.html": [
      {
        "src": "https://my.walls.io/Flughafenfeuerwehr",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
      {
        "src": "https://my.walls.io/Flughafenfeuerwehr",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
      {
        "src": "https://my.walls.io/Flughafenfeuerwehr",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
      {
        "src": "https://my.walls.io/Flughafenfeuerwehr",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/anmeldung-spezialsprechstunde.html": [
      {
        "src": "https://www.terminland.de/framed/online/Ambulanz/?mode=frame",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
      {
        "src": "https://www.terminland.de/fratest/default.aspx?lang=de&dl=mc2&hgrp100=4&chartpk=&tc=",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung-grippe.html": [
      {
        "src": "https://www.terminland.de/fratest/online/mc2",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung.html": [
      {
        "src": "https://www.terminland.de/fratest/online/mc3",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
      {
        "src": "https://www.youtube-nocookie.com/embed/x8kSWLbSvE8?enablejsapi=1&origin=https%3A%2F%2Fwww.fraport.com&widgetid=1&forigin=https%3A%2F%2Fwww.fraport.com%2Fde%2Fgeschaeftsfelder%2Fservice%2Fflughafenausweise.html&aoriginsup=1&vf=1",
        "title": "Der Weg zum Flughafenausweis f\xFCr Besch\xE4ftigte"
      }
    ],
    "https://www.fraport.com/de/investoren/fraport-aktie.html": [
      {
        "src": "https://www.fraport.com/chart/fraport/German",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
      {
        "src": "https://app.powerbi.com/reportEmbed?uid=3b3g9",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/bahnensystem-und-betriebszeiten.html": [
      {
        "src": "https://static.fraport.de/ONLINE/nachtfluginfo/index.html",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html": [
      {
        "src": "https://franom.fraport.de/franom.php",
        "title": ""
      }
    ],
    "https://www.fraport.com/de/newsroom.html": [
      {
        "src": "https://my.walls.io/de-fraport-ag",
        "title": ""
      },
      {
        "src": "https://www.youtube-nocookie.com/embed/kH7xDtYOxwk?enablejsapi=1&origin=https%3A%2F%2Fwww.fraport.com&widgetid=1&forigin=https%3A%2F%2Fwww.fraport.com%2Fde%2Fnewsroom.html&aoriginsup=1&vf=1",
        "title": "Terminal 3 startet \u2013 mehr Platz, mehr Fl\xFCge, mehr Frankfurt | Mittendrin - Flughafen Frankfurt 88"
      },
      {
        "src": "https://www.youtube-nocookie.com/embed/HapG52fvFyw?enablejsapi=1&origin=https%3A%2F%2Fwww.fraport.com&widgetid=2&forigin=https%3A%2F%2Fwww.fraport.com%2Fde%2Fnewsroom.html&aoriginsup=1&vf=1",
        "title": "100 Jahre Lufthansa - Propeller, Piloten und Pillbox | Mittendrin - Flughafen Frankfurt 87"
      },
      {
        "src": "https://www.youtube-nocookie.com/embed/pA66zjmcrwI?enablejsapi=1&origin=https%3A%2F%2Fwww.fraport.com&widgetid=3&forigin=https%3A%2F%2Fwww.fraport.com%2Fde%2Fnewsroom.html&aoriginsup=1&vf=1",
        "title": "Drohnen am Flughafen - DFS testet spezielle Radaranlagen | Mittendrin - Flughafen Frankfurt (30)"
      },
      {
        "src": "https://www.youtube-nocookie.com/embed/TZnDvg3KRfM?enablejsapi=1&origin=https%3A%2F%2Fwww.fraport.com&widgetid=4&forigin=https%3A%2F%2Fwww.fraport.com%2Fde%2Fnewsroom.html&aoriginsup=1&vf=1",
        "title": "Feuerwehralarm am Flughafen - Im Einsatz mit Wache 20 | Mittendrin - Flughafen Frankfurt 32"
      }
    ]
  };

  // tools/importer/utils/fraport-pages.js
  var fraport_pages_default = /* @__PURE__ */ new Set(["/", "/de", "/de/deaktivierte-tests/tests/formulartest", "/de/errors/404", "/de/geschaeftsfelder", "/de/geschaeftsfelder/bau", "/de/geschaeftsfelder/bau/flughafenausbau", "/de/geschaeftsfelder/bau/hessens-tor-zur-welt", "/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen", "/de/geschaeftsfelder/betrieb", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/kontakt", "/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/terminal-3", "/de/geschaeftsfelder/betrieb/flughafenentgelte", "/de/geschaeftsfelder/betrieb/flughafenentgelte/flughafenentgelte", "/de/geschaeftsfelder/betrieb/flughafenfeuerwehr", "/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/75-jahre-jubilaeum", "/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz", "/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center", "/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center/anfrageformular-lehrgaenge-ftc", "/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/flugzeugbergung", "/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik", "/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz", "/de/geschaeftsfelder/betrieb/flughafenlieferungen", "/de/geschaeftsfelder/betrieb/frankfurt-cargohub/einladung-cargo", "/de/geschaeftsfelder/betrieb/ground-services-equipment", "/de/geschaeftsfelder/betrieb/medical-center", "/de/geschaeftsfelder/betrieb/medical-center/anmeldung-spezialsprechstunde", "/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten", "/de/geschaeftsfelder/betrieb/medical-center/terminbuchung", "/de/geschaeftsfelder/betrieb/medical-center/terminbuchung-grippe", "/de/geschaeftsfelder/betrieb/unternehmenssicherheit", "/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness", "/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt", "/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt", "/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet", "/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf", "/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind", "/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen", "/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/zeigen-dass-wir-verantwortung-tragen", "/de/geschaeftsfelder/international-activities", "/de/geschaeftsfelder/service", "/de/geschaeftsfelder/service/fahrerausbildung", "/de/geschaeftsfelder/service/fahrerausbildung/recurrent-training", "/de/geschaeftsfelder/service/flughafenausweise", "/de/geschaeftsfelder/service/flughafenausweise/allgemeine-informationen", "/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner", "/de/geschaeftsfelder/service/flughafenausweise/archiv", "/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0", "/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/ausweisantraege/online-antrag--auf-erteilung-eines-fahrzeugausweises", "/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/ausweisantraege/online-antrag-auf-uebertragbare-fahrzeugausweise", "/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/online-ausweisbeantragung", "/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise", "/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise/ausweis-services-auf-einen-blick", "/de/geschaeftsfelder/service/flughafenausweise/faq", "/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung", "/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-", "/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise", "/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen", "/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen/antrag-auf-registrierung-einer-firma", "/de/geschaeftsfelder/service/geschaeftspartner", "/de/geschaeftsfelder/service/geschaeftspartner/bekanntmachungen", "/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe", "/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe/bauvergabe", "/de/geschaeftsfelder/service/geschaeftspartner/elektronischer-rechnungsversand", "/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen", "/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-a-schoenberger", "/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-i-schaefer", "/de/geschaeftsfelder/service/geschaeftspartner/richtlinien-und-zahlungsbedingungen", "/de/geschaeftsfelder/service/it-services", "/de/geschaeftsfelder/service/parken---mobilitaet", "/de/geschaeftsfelder/service/personalbuslinien", "/de/geschaeftsfelder/service/real-estate", "/de/geschaeftsfelder/service/real-estate/asset---property-management", "/de/geschaeftsfelder/service/real-estate/baulandentwicklung---konversion", "/de/geschaeftsfelder/service/real-estate/energiemanagement", "/de/geschaeftsfelder/service/real-estate/projektentwicklung---investment", "/de/geschaeftsfelder/service/real-estate/real-estate-consulting", "/de/geschaeftsfelder/service/real-estate/ueber-uns", "/de/geschaeftsfelder/service/real-estate/unser-track-record", "/de/geschaeftsfelder/service/real-estate/vermietung", "/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung", "/de/geschaeftsfelder/service/retailing---advertising", "/de/geschaeftsfelder/service/retailing---advertising/airport-retailing", "/de/geschaeftsfelder/service/retailing---advertising/flughafenwerbung", "/de/investoren", "/de/investoren/ansprechpartner", "/de/investoren/corporate-governance", "/de/investoren/creditor-relations", "/de/investoren/fraport-aktie", "/de/investoren/hauptversammlung", "/de/investoren/indizes-und-ratings", "/de/investoren/publikationen-termine", "/de/investoren/verkehrszahlen", "/de/konzern", "/de/konzern/digitalisierung", "/de/konzern/digitalisierung/ai-fraport", "/de/konzern/digitalisierung/open-pitch-day", "/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day", "/de/konzern/digitalisierung/open-pitch-day/erfolgsgeschichten", "/de/konzern/digitalisierung/robotikstrategie", "/de/konzern/konzernstrategie", "/de/konzern/managementsysteme", "/de/konzern/managementsysteme/arbeitsschutzmanagement", "/de/konzern/managementsysteme/qualitaetsmanagement", "/de/konzern/managementsysteme/safety-management-system", "/de/konzern/regionales-engagement", "/de/konzern/regionales-engagement/bildung-und-soziales", "/de/konzern/regionales-engagement/kultur", "/de/konzern/regionales-engagement/newsletter", "/de/konzern/regionales-engagement/profisport/eintracht-frankfurt", "/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich", "/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/kreiere-deinen-emoji", "/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/youth", "/de/konzern/regionales-engagement/profisport/internationales-festhallen-reitturnier", "/de/konzern/regionales-engagement/profisport/loewen-frankfurt-nachwuchs", "/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen", "/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen/antrag", "/de/konzern/regionales-engagement/sponsoring-und-spenden", "/de/konzern/regionales-engagement/veranstaltungen", "/de/konzern/ueber-uns", "/de/konzern/ueber-uns/100jahrewieimflug", "/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute", "/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrtgeschichte-in-frankfurt-", "/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung", "/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette", "/de/konzern/ueber-uns/100jahrewieimflug/arbeitsstaette-fra", "/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport", "/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport", "/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region", "/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten", "/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel", "/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-", "/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-", "/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra", "/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra", "/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen", "/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern", "/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1", "/de/konzern/ueber-uns/100jahrewieimflug/gastro-erlebnis-kaffeegarten", "/de/konzern/ueber-uns/100jahrewieimflug/gewinnspiel-after-work-party", "/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr", "/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra", "/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick", "/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung", "/de/konzern/ueber-uns/100jahrewieimflug/home-of-cargo", "/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-", "/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt", "/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0", "/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post", "/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen", "/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu", "/de/konzern/ueber-uns/100jahrewieimflug/passenger-journey", "/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra", "/de/konzern/ueber-uns/100jahrewieimflug/reise-in-die-vergangenheit", "/de/konzern/ueber-uns/100jahrewieimflug/seit-50-jahren-in-bewegung", "/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-", "/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions", "/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt", "/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel", "/de/konzern/ueber-uns/100jahrewieimflug/zwei-urgesteine-mit-hundert-jahren-auf-dem-buckel", "/de/konzern/ueber-uns/aufsichtsrat", "/de/konzern/ueber-uns/compliance", "/de/konzern/ueber-uns/compliance/hinweisgebersysteme", "/de/konzern/ueber-uns/diversity", "/de/konzern/ueber-uns/vorstand", "/de/konzern/ueber-uns/zahlen--daten-und-fakten1", "/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen", "/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/airport-cater-service-gmbh/kontakt-airport-cater-service-gmbh", "/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/frankfurt-airport-retail-gmbh/kontakt-frankfurt-airport-retail-gmbh---co--kg", "/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/fraport-casa-gmbh/kontakt-fraport-casa-gmbh", "/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/fraport-regional-airports-of-greece-management-company/kontakt-fraport-regional-airports-of-greece-management-company-s", "/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/fraport-slovenija/kontakt-aerodrom-ljubljana--d-o-o-", "/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/frasec-fraport-security-services-gmbh/kontaktformular-frasec", "/de/nachhaltigkeit", "/de/nachhaltigkeit/beschaeftigte", "/de/nachhaltigkeit/beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement", "/de/nachhaltigkeit/beschaeftigte/konzernarbeitsschutz", "/de/nachhaltigkeit/gesellschaft", "/de/nachhaltigkeit/nachbarschaftsdialog", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/aktuelle-betriebsrichtung", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot1", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/beginn-probebetrieb-verlegung-der-flugroute-amtix--kurz--im-nove", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/erneute-sperrung-der-landebahn-nordwest-ab-dem-14--dezember", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/relaunch-der-fraport-homepage", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-landebahn-nordwest", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-suedbahn-im-april", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/startbahn-18-ab-15--oktober-wieder-in-betrieb", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/suedbahn-ab-30--april-wieder-in-betrieb", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verkehrsbeeintraechtigungen-durch-erneute-drohnensichtungen", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-nachts-vom-29--oktober-bis-01--november-20201", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-vom-11--bis-14--mai-2020", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nachts", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-nachts-vom-17--bis-20--september-2020", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-vom-18--bis-21--august-2020", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-nachts-vom-22--bis-25--oktober-2020", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-vom-04--bis-07--mai-2020", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-02--bis-05--januar-2020", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-19--bis-22--maerz-2020", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-20--bis-23--februar-2020", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verspaetungen-aufgrund-einer-drohnensichtung", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/wiedereroeffnung-der-landebahn-nord-west", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/abfluege--amtix--kurz---ab-22-04-2021", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ausflottung-der-lufthansa-md-11---mcdonnell-douglas--im-oktober-", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/aussetzung-des-probebetriebs-zur-optimierung-amtix--kurz--", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/centerbahn-voraussichtlich-bis-03--oktober-ausser-betrieb", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ganztaegige-anwendung-des-segmented-approach", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/landebahn-nordwest-und-terminal-2-ab-1--juni-wieder-in-betrieb", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neue-projektphase-zum-thema-ultrafeinstaub-im-bereich-des-flugha", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neuentwicklung-der-fra-map-2-0", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/probebetrieb-zur-optimierten-nutzung-des-start--und-landebahnens", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/verkehrsbeeintraechtigungen-durch-drohnensichtung", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-nordwest-landebahn-vom-15--bis-19--maerz-2021", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom--27--bis-voraussichtlich-28--august-2021--", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-03--und-04--dezember-2021---landebahn-nord", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-06--bis-09--mai-2021---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-07--bis-10--oktober-2021---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-15--bis-18--april-2021", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-19--22-08-2021---landebahn-nordwest", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-23--bis-26--september-2021---landebahn-nor", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-26--bis-27--november-2021---landebahn-nord", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-30--september-bis-03--oktober-2021---suedb", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2022", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-erneut-ausser-betrieb", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-voraussichtlich-bis-31--mai-ausser-betrieb", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/militaerische-grossuebung--air-defender-2023--im-deutschen-luftr", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/nachtfluege-am-20--juni-", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/naechtliche-centerbahnsperrung-vom-03--juli-2023", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/sperrung-der-landebahn-nordwest-am-04--06--oktober-2023", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-10----14--juli-2023-am-frankf", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-19----23--juni--2023-am-frank", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-02--bis-05--maerz-2023---suedbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-07--bis-10--september-2023---suedbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-09-12-maerz-und-vom", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-12--15--und-20--22--oktober-2023---alle-ba", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-21----24--september-2023---landebahn-nord-", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-27--30--april-2023---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-15--juli", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-16--august-2023", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/witterung-beeinflusst-die-regionale-fluglaermbelastung", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/kurzfristige-sperrung-der-landebahn-nordwest", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/naechtliche-centerbahnsperrung-ab-15--juli-20240", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-08--bis-09--juli-2024-", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-11--bis-12--mai-2024---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-04---06--oktober--2024---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-08--bis-10--maerz-2024---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-11---14--april-2024---landebahn-nord-west", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-12---15--september-2024---landebahn-nord-w", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-16---17--november-2024---rund-um-den-flugh", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-26---29--september--2024---landebahn-nordw", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29---01--september-2024---suedbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29--februar---02--maerz-2024---landebahn-n", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-13--august", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-3--august", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/inbetriebnahme-der-neuen-abflugroute-cindy-sulus--ehemals-amtix-", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/neue-interaktive-karte-fra-nom-in-betrieb", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/sonder-vermessungsfluege-vom-05---09--september--2025---centerba", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-03---05--april--2025---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-06---08--maerz-2025---landebahn-nord-west", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---14--september-2025---landebahn-nord-w", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---23--august--2025---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-15--bis-16--november-2025---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-16---19--oktober--2025---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-18---21--september-2025---landebahn-nord-w", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--februar-2025---suedbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--maerz-2025---landebahn-nord-west", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-26--bis-30--mai-2025---rund-um-den-flughaf", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-28---31--august-2025---suedbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/geophysikalische-messfluege-zur-geothermie-erkundung-im-oberrhei", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-am-29--und-30--juni-2026---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-03---06--september-2026---suedbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-12--bis-15--maerz-2026---landebahn-nord-we", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-13--bis-15--februar---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-17---20--september-2026---landebahn-nord-w", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-19--bis-22--maerz-2026---landebahn-nord-we", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-20---23--august--2026---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-22--bis-27--juni-2025---centerbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-24---27--september-2026---landebahn-nord-w", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-26---28--februar-2026---suedbahn", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/zweiwoechige-sperrung-der-centerbahn-im-maerz", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/newsuebersicht", "/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/prognosen", "/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten", "/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/bahnensystem-und-betriebszeiten", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/allgemeine-informationen", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/fluglaermkonturen", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messberichte", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messergebnisse-und-routennutzung", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/glossar", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/luftqualitaet", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm", "/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/passives-schallschutzprogramm", "/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen", "/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal", "/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm", "/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten", "/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/weitere-kontakte", "/de/nachhaltigkeit/umwelt-und-klimaschutz", "/de/nachhaltigkeit/unternehmensfuehrung", "/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz", "/de/nachhaltigkeit/wertschaffung", "/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen", "/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1", "/de/newsroom", "/de/newsroom/ansprechpartner", "/de/newsroom/bilddatenbank", "/de/newsroom/bilddatenbank/desktop-wallpapers", "/de/newsroom/bilddatenbank/nutzungsbedingungen", "/de/newsroom/bilddatenbank/smartphone-wallpapers", "/de/newsroom/frafacts", "/de/newsroom/infofilme", "/de/newsroom/infofilme/flugzeugabfertigung", "/de/newsroom/infofilme/sicherer-flugbetrieb", "/de/newsroom/pressemappe", "/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3", "/de/newsroom/pressemappe/pressemappen/30-07-2021-besucherzentrum", "/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1", "/de/newsroom/pressemappe/pressemappen/begehung-pier-g", "/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021", "/de/newsroom/pressemappe/pressemappen/pharma-fra", "/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main", "/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt", "/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn", "/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport", "/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3", "/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung", "/de/newsroom/pressemappe/pressemappen/pressemappe-vip-terminal", "/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn", "/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung", "/de/newsroom/pressemappe/pressemappen/t3-pressetermin", "/de/newsroom/pressemitteilung", "/de/newsroom/pressemitteilungen/2018/q1-2018/ausgezeichnetes-einkaufserlebnis", "/de/newsroom/pressemitteilungen/2018/q1-2018/flaschenpfand-geht-an-vier-neue-organisationen", "/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-brasil-uebernimmt-betrieb-der-brasilianischen-flughaefen", "/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-geschaeftsjahr-2017--starkes-ergebnis-gestuetzt-von-deut", "/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-initiative-fuer-innovative-foerderprojekte-geht-in-die-z", "/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-vergibt-auftrag-fuer-neues-passagier-transport-system-zu", "/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-2017--mehr-als-64-millionen-fluggaeste-am", "/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-februar-2018--wachstum-setzt-sich-fort", "/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-januar-2018--starkes-wachstum-zum-jahr", "/de/newsroom/pressemitteilungen/2018/q1-2018/gut-vorbereitet-und-entspannt-in-die-osterfeiertage-starten", "/de/newsroom/pressemitteilungen/2018/q1-2018/paradies-fuer-schulabgaenger--ausbildungsmesse-am-flughafen-fran", "/de/newsroom/pressemitteilungen/2018/q1-2018/sommerflugplan-2018--von-frankfurt-in-alle-welt", "/de/newsroom/pressemitteilungen/2018/q1-2018/wachstum-schafft-arbeitsplaetze--fraport-stellt-mehr-als-1-800-b", "/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport--kapazitaet-des-stromnetzes-deutlich-erweitert", "/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport-city--weiterer-verkaufserfolg-auf-dem-moenchho", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-ag-nimmt-am-flughafen-frankfurt-zusaetzliche-sicherheits", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erhaelt-ceiv-pharma-zertifikat-fuer-expertise-im-ramp-ha", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erprobt-den-einsatz-von-drohnen-am-frankfurter-flughafen", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-legt-konzernweite-klimaschutzziele-fest--deutliche-reduk", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-quartalsmitteilung-q1-2018--erfolgreicher-start-ins-neue", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-schliesst-mietvertrag-mit-swissport-in-der-cargocity-sue", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-2018", "/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-mai-2018--erneut-starkes-wachstum", "/de/newsroom/pressemitteilungen/2018/q2-2018/gedenkfeier-zum-70--jubilaeum-der-berliner-luftbruecke-am-flugha", "/de/newsroom/pressemitteilungen/2018/q2-2018/girls--day-2018---auf-schnuppertour-am-frankfurter-flughafen", "/de/newsroom/pressemitteilungen/2018/q2-2018/neuer-nistplatz-fuer-eisvoegel-am-moenchwaldsee", "/de/newsroom/pressemitteilungen/2018/q2-2018/sommerferienstart-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2018/q3-2018/-terminal-3-wird-mit-allen-verkehrsmitteln-sehr-gut-erreichbar-s", "/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ag-veraeussert-ihre-anteile-am-flughafen-hannover", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-begruesst-entscheidung-des-hessischen-verwaltungsgericht", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ergaenzt-dachsicherungsprogramm-um-zusaetzliche-angebote", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-richtfest-fuer-neues-winterdienstgebaeude", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-spatenstich-fuer-neues-terminal-in-thessaloniki", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2018--gu", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-staerkt-elektromobilitaet-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-usa-erhaelt-zuschlag-fuer-centermanagement-am-flughafen-", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-august-2018--passagier-plus-in-frankfu", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-ersten-halbjahr-2018--positive-entwick", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-juli-2018--wachstum-setzt-sich-fort", "/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verlaengert-vertrag-des-vorstandsvorsitzenden-dr--stefan", "/de/newsroom/pressemitteilungen/2018/q3-2018/frueh-da-sein--direkt-zur-sicherheitskontrolle-gehen-und-handgep", "/de/newsroom/pressemitteilungen/2018/q3-2018/hochleistungen-bei-hitze-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2018/q3-2018/infos-zum-anfassen--vierte--tech-night--am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2018/q3-2018/karrierestart-bei-fraport--123-junge-menschen-beginnen-ihre-ausb", "/de/newsroom/pressemitteilungen/2018/q3-2018/weltpremiere-fuer-digitale-gefahrgutdeklaration-am-flughafen-fra", "/de/newsroom/pressemitteilungen/2018/q4-2018/erweiterung-anschlussstelle-zeppelinheim--vorbereitende-arbeiten", "/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--mehr-ziele--mehr-fluege--mehr-sitzplaetze", "/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--startschuss-fuer-rohbau-von-terminal-3", "/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-bleibt-premium-partner-bei-eintracht-frankfurt", "/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-testet-gemeinsam-mit-lufthansa-ferngesteuerten-flugzeugs", "/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-und-esa-bringen-weltraum-zum-sprechen", "/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for", "/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-oktober-2018--weiter-auf-wachstumskurs", "/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat", "/de/newsroom/pressemitteilungen/2018/q4-2018/friedensfest-der-drei-grossen-buchreligionen-am-flughafen-frankf", "/de/newsroom/pressemitteilungen/2018/q4-2018/gewinner-der-zweiten-fraport-initiative-fuer-bildungsprojekte-st", "/de/newsroom/pressemitteilungen/2018/q4-2018/gut-vorbereitet-in-die-weihnachtsfeiertage-starten", "/de/newsroom/pressemitteilungen/2018/q4-2018/konzern-quartalsmitteilung-q3-9m-2018--fraport-setzt-wachstumsku", "/de/newsroom/pressemitteilungen/2018/q4-2018/lufthansa-und-fraport-setzen-zusammenarbeit-bei-der-flugzeugabfe", "/de/newsroom/pressemitteilungen/2018/q4-2018/notfalluebung-am-flughafen-frankfurt-erfolgreich-abgeschlossen", "/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck", "/de/newsroom/pressemitteilungen/2018/q4-2018/turnusmaessige-notfalluebung-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv", "/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se", "/de/newsroom/pressemitteilungen/2019/q1-2019/-mobilitaet-der-zukunft--fraport-und-volocopter-entwickeln-flugh", "/de/newsroom/pressemitteilungen/2019/q1-2019/ab-flughafen-frankfurt-ins-fruehjahr-starten", "/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--betrieb-laeuft-nach-streikende-wieder-stabi", "/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--streik-der-sicherheitsdienstleister-am-dien", "/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-ausbildungszentrum-am-flughafen-ljubljana", "/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-neue-ausbildungswerkstatt-am-flughafen-frankfu", "/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-geschaeftsjahr-2018--umsatz-und-ergebnis-deutlich-gestei", "/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-2018--mehr-als-69-5-millionen-passagiere-", "/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j", "/de/newsroom/pressemitteilungen/2019/q1-2019/fuer-die-sicherheit--fraport-weitet-dachsicherungsprogramm-aus", "/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen", "/de/newsroom/pressemitteilungen/2019/q1-2019/pierre-dominique-pruemm-verstaerkt-fraport-vorstand", "/de/newsroom/pressemitteilungen/2019/q1-2019/von-der-elektrik-bis-zur-luftsicherheitskontrolle--am-flughafen-", "/de/newsroom/pressemitteilungen/2019/q2-2019/-flughafen-frankfurt--reibungsloser-betrieb-trotz-hohem-passagie", "/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent", "/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-initiative-2019-unterstuetzt-innovative-projekte-in-der", "/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-quartalsmitteilung-q1-2019--erfolgreicher-start-ins-neu", "/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-201", "/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-2-00", "/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--in-frankfurt-und-international-gut-fue", "/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-plant-rund-2-300-neueinstellungen-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-und-deutsche-bahn-testen-kuenstliche-intelligenz-am-flug", "/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur", "/de/newsroom/pressemitteilungen/2019/q2-2019/grundstein-fuer-terminal-3-gelegt", "/de/newsroom/pressemitteilungen/2019/q2-2019/osterferien-laeuten-reisewelle-ein", "/de/newsroom/pressemitteilungen/2019/q2-2019/sommerferien-bringen-bis-zu-240-000-fluggaeste-pro-tag", "/de/newsroom/pressemitteilungen/2019/q3-2019/-herbstferien-starten", "/de/newsroom/pressemitteilungen/2019/q3-2019/20-jahre-proregion--flughafenstiftung-zur-foerderung-der-berufli", "/de/newsroom/pressemitteilungen/2019/q3-2019/ausbildung-am-airport---tech-night--bietet-spannende-einblicke-i", "/de/newsroom/pressemitteilungen/2019/q3-2019/flughafen-frankfurt--sieben-neue-luftsicherheitskontrollspuren-f", "/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-ist--fahrradfreundlicher-arbeitgeber-", "/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-kooperiert-mit-techquartier-frankfurt", "/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2019--st", "/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-setzt-kuenftig-auf-flugdaten-von-flightaware-zur-passgen", "/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-august-2019--wachstum-in-frankfurt-set", "/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-ersten-halbjahr-2019--stabile-entwickl", "/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt", "/de/newsroom/pressemitteilungen/2019/q3-2019/pfand-drauf--flaschenpfand-geht-an-vier-neue-organisationen", "/de/newsroom/pressemitteilungen/2019/q3-2019/zukunftsperspektive-flughafen--125-junge-menschen-beginnen-ihre-", "/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-", "/de/newsroom/pressemitteilungen/2019/q4-2019/-lila-pferd--auf-spendentour--fraport-unterstuetzt-wohltaetige-p", "/de/newsroom/pressemitteilungen/2019/q4-2019/boeing-und-fraport-eroeffnen-boeing-ecodemonstrator-european-exp", "/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen", "/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2", "/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne", "/de/newsroom/pressemitteilungen/2019/q4-2019/frankfurt-airport--im-winter-zu-259-zielen-rund-um-den-globus", "/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-feiert-richtfest-fuer-neue-feuer--und-rettungswache", "/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2019", "/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-november-2019--ruecklaeufige-verkehrse", "/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec", "/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat", "/de/newsroom/pressemitteilungen/2019/q4-2019/gepaeckservice-und-navigation--fraport-und-e-novia-testen-autono", "/de/newsroom/pressemitteilungen/2019/q4-2019/grundsteinlegung-fuer-luftfrachthalle-von-swissport-in-der-cargo", "/de/newsroom/pressemitteilungen/2019/q4-2019/inklusion-leben--aktionsplan-feiert-5-jaehriges-jubilaeum", "/de/newsroom/pressemitteilungen/2019/q4-2019/innovative-sozialprojekte-ueberzeugen-die-fraport-initiative-201", "/de/newsroom/pressemitteilungen/2019/q4-2019/jetzt-gut-vorbereiten--flugreise-im-winter", "/de/newsroom/pressemitteilungen/2019/q4-2019/zeichen-fuer-frieden-und-gemeinschaft--fraport-feiert-fest-der-a", "/de/newsroom/pressemitteilungen/2020/q1-2020/am-frankfurt-airport-ab-17--maerz-rundfahrten-voruebergehend-aus", "/de/newsroom/pressemitteilungen/2020/q1-2020/faszination-flughafen-hautnah-erleben--ausbildungsmesse--airport", "/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--frachtinfrastruktur-steht-uneingeschraenkt-", "/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-", "/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-", "/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019", "/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-arbeitet-mit-hochdruck-an-abtransport-von-pfc-belastetem", "/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-erhaelt-klimazertifikat-fuer-den-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-fuehrt-ab-sofort-kurzarbeit-ein---flughafen-frankfurt-bl", "/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-geschaeftsjahr-2019--positive-entwicklung-von-umsatz-und", "/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio", "/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-", "/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-", "/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren", "/de/newsroom/pressemitteilungen/2020/q1-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-g", "/de/newsroom/pressemitteilungen/2020/q1-2020/weimar-kuendigt-rueckzug-aus-fraport-aufsichtsrat-an", "/de/newsroom/pressemitteilungen/2020/q2-2020/abfertigungwirdabsiebtenaprilimterminal1konzentriert", "/de/newsroom/pressemitteilungen/2020/q2-2020/bauarbeiten-erfolgreich-abgeschlossen--suedbahn-am-frankfurter-f", "/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-", "/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt-startklar-fuer-sicheres-fliegen", "/de/newsroom/pressemitteilungen/2020/q2-2020/flugziele-ab-frankfurt-legen-weiter-zu-", "/de/newsroom/pressemitteilungen/2020/q2-2020/frankfurt-airport--ab-juni-wieder-mehr-flugziele-geplant", "/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-ag-fuehrt-hauptversammlung-am-26--mai-ausschliesslich-vi", "/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-", "/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak", "/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2020", "/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-setzt-am-flughafen-frankfurt-auf-gruenstrom-", "/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan", "/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran", "/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au", "/de/newsroom/pressemitteilungen/2020/q2-2020/garant-in-der-krise--flughafen-frankfurt-sichert-als-europas-fue", "/de/newsroom/pressemitteilungen/2020/q2-2020/nachhaltige-hilfe-fuer-die-region--bilanz-des-fraport-umweltfond", "/de/newsroom/pressemitteilungen/2020/q2-2020/neuerasphaltfuersuedbahn", "/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-", "/de/newsroom/pressemitteilungen/2020/q2-2020/sommerurlaub-2020--zahlreiche-sonnenziele-wieder-im-programm", "/de/newsroom/pressemitteilungen/2020/q2-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-l", "/de/newsroom/pressemitteilungen/2020/q2-2020/verkehrszahlenkw16", "/de/newsroom/pressemitteilungen/2020/q3-2020/17-corona-faelle-auf-terminal-3-baustelle", "/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued", "/de/newsroom/pressemitteilungen/2020/q3-2020/berufsstart-am-flughafen-frankfurt--89-junge-menschen-beginnen-i", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--pauschale-quarantaene-anordnung-statt-tests", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--startbahn-18-west-ab-15--oktober-wieder-in-", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli", "/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun", "/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt", "/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center", "/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co", "/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-uebergibt-luftfrachthalle-an-swissport", "/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1", "/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie", "/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a", "/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d", "/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag", "/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde", "/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta", "/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte", "/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land", "/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein", "/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020", "/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am", "/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f", "/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr", "/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-", "/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers", "/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w", "/de/newsroom/pressemitteilungen/2020/q4-2020/vermarktung-von-erweiterungsflaechen-in-der-cargocity-sued-am-fl", "/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-", "/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet", "/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe", "/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend", "/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege", "/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j", "/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi", "/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr", "/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra", "/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb", "/de/newsroom/pressemitteilungen/2021/q1-2021/reisen-waehrend-der-pandemie---sorgfaeltige-vorbereitung-ist-une", "/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord", "/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae", "/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet", "/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p", "/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-", "/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak", "/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021", "/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie", "/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci", "/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran", "/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran", "/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas", "/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein", "/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko", "/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr", "/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-", "/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a", "/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-", "/de/newsroom/pressemitteilungen/2021/q3-2021/ausflugsziel-flughafen-frankfurt---multimediales-fraport-besuche", "/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb", "/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten", "/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale", "/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202", "/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-august-2021--passagierzahlen-in-frankf", "/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an", "/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juni-2021--beginnender-aufwaertstrend-", "/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug", "/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb", "/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau", "/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org", "/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch", "/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os", "/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d", "/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein", "/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021", "/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue", "/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a", "/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi", "/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass", "/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw", "/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis", "/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit", "/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-", "/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen", "/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem", "/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022", "/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken", "/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor", "/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach", "/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig", "/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021", "/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen", "/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi", "/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an", "/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-", "/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more", "/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen", "/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022", "/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022", "/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021", "/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand", "/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland", "/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-", "/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung", "/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-", "/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen", "/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022", "/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag", "/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022", "/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u", "/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued", "/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle", "/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-", "/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k", "/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu", "/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region", "/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f", "/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug", "/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet", "/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue", "/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima", "/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra", "/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-", "/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran", "/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu", "/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-", "/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter", "/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen", "/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell", "/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen", "/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro", "/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern", "/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-", "/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo", "/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher", "/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-17", "/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-27", "/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien", "/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd", "/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr", "/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-", "/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2", "/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza", "/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg", "/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen", "/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-", "/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he", "/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein", "/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-", "/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-erneut-ausser-betrieb", "/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff", "/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank", "/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-", "/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto", "/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-", "/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub", "/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul", "/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-", "/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit", "/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche", "/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro", "/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge", "/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet", "/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae", "/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a", "/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region", "/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale", "/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit", "/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de", "/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr", "/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au", "/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst", "/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug", "/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-", "/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di", "/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik", "/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum", "/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f", "/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-", "/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-", "/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-", "/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter", "/de/newsroom/pressemitteilungen/2024/q1/sanierung-der-rollbruecke-ost-am-flughafen-frankfurt0", "/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-", "/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie", "/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie0", "/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0", "/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter", "/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm", "/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt", "/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-", "/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he", "/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket", "/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil", "/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue", "/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-", "/de/newsroom/pressemitteilungen/2024/q3/flughafen-frankfurt-nach-aktion-von-klimaaktivisten-seit-7-50-uh", "/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-", "/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-", "/de/newsroom/pressemitteilungen/2024/q3/naechtlicher-teilstromausfall-im-terminal-1-am-flughafen-frankfu", "/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-", "/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha", "/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb", "/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc", "/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei", "/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo", "/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata", "/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells", "/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod", "/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis", "/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-", "/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f", "/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr", "/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-", "/de/newsroom/pressemitteilungen/2025/q1/flughafen-frankfurt--ver-di-streik-im-oeffentlichen-dienst-am-10", "/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann", "/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash", "/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges", "/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra", "/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-", "/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern", "/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er", "/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen", "/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi", "/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs", "/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien", "/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-", "/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t", "/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e", "/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun", "/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he", "/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter", "/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-", "/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug", "/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa", "/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht", "/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet", "/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe", "/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde", "/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region", "/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-", "/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl", "/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer", "/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf", "/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre", "/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio", "/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri", "/de/newsroom/pressemitteilungen/2025/q4/technight", "/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den", "/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-", "/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow", "/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft", "/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3", "/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat", "/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb", "/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag", "/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat", "/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt", "/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast", "/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare", "/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel", "/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest", "/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle", "/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen", "/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt", "/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen", "/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026", "/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet", "/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus", "/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3", "/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag", "/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept", "/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung", "/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten", "/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal", "/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb", "/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb", "/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen", "/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb", "/de/newsroom/pressemitteilungen/2026/q2/wechsel-an-der-spitze-der-fraport-unternehmenskommunikation", "/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm", "/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus", "/de/newsroom/pressemitteilungen/2026/q3/ecotow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge", "/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de", "/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb", "/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode", "/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet", "/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie", "/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren", "/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202", "/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau", "/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter", "/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei", "/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m", "/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta", "/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli", "/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022", "/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022", "/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt", "/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber", "/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt", "/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet", "/de/newsroom/retailnews", "/de/newsroom/service-news/2018/-alexa--frage-frankfurt-airport-nach-lh400---virtueller-assisten", "/de/newsroom/service-news/2018/-faces-behind-the-voices-", "/de/newsroom/service-news/2018/-umgeparkt--holiday-parking--und--carsharing--wechseln-standorte", "/de/newsroom/service-news/2018/der-sommer-kann-kommen", "/de/newsroom/service-news/2018/faszination-flughafenfeuerwehr", "/de/newsroom/service-news/2018/flughafen-frankfurt-in-weihnachtsstimmung-", "/de/newsroom/service-news/2018/flughafenflair-im-freien--flughafen-frankfurt-eroeffnet-dachterr", "/de/newsroom/service-news/2018/flugsteige-d-und-e-voellig-neu-erleben", "/de/newsroom/service-news/2018/glueckliche-zeiten--jaguar-e-pace-im-wert-von-60-000-euro-und-vi", "/de/newsroom/service-news/2018/guenstig---und-garantiert-", "/de/newsroom/service-news/2018/lieblingsparkplatz-garantiert--vorausbuchungsfunktion-nun-auch-f", "/de/newsroom/service-news/2018/luxus-fuer-jedermann--primeclass-lounge-verspricht-entspannte-au", "/de/newsroom/service-news/2018/modernes-tagungszentrum-in-top-lage", "/de/newsroom/service-news/2018/neue-rundfahrt-mit-aussicht", "/de/newsroom/service-news/2018/o-zapft-is--oktoberfest-stimmung-am-flughafen-frankfurt", "/de/newsroom/service-news/2018/positive-ladung--flughafen-frankfurt-richtet-weitere-e-parkplaet", "/de/newsroom/service-news/2018/schnell-und-einfach-durch-die-grenzkontrolle", "/de/newsroom/service-news/2018/typisch-deutsch-", "/de/newsroom/service-news/2018/wm-fieber-am-flughafen-frankfurt--hier-koennen-fluggaeste-die-sp", "/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen", "/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest", "/de/newsroom/service-news/2019/auskunft-auf-knopfdruck", "/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina", "/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-", "/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-", "/de/newsroom/service-news/2019/neues-parkprodukt", "/de/newsroom/service-news/2019/rundfahrt-mit-aussicht", "/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken", "/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f", "/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden", "/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o", "/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel", "/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt", "/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt", "/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere", "/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi", "/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt", "/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt", "/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022", "/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-", "/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals", "/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb", "/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r", "/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati", "/de/newsroom/service-news/2022/erst-buchen--dann-parken", "/de/newsroom/service-news/2022/fralounge", "/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische", "/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt", "/de/newsroom/service-news/2022/koffer-know-how", "/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn", "/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt", "/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder", "/de/newsroom/service-news/2023/osterferien-start", "/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der", "/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst", "/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta", "/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt", "/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione", "/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-", "/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor", "/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start", "/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-", "/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug", "/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-", "/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-", "/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe", "/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr", "/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-", "/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur", "/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-", "/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber", "/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat", "/de/newsroom/servicenews", "/de/newsroom/videomaterial", "/de/newsroom/videomaterial/nutzungsbedingungen", "/de/tools/disclaimer", "/de/tools/impressum"]);

  // tools/importer/transformers/fraport-cleanup.js
  var SITE_ORIGIN = "https://www.fraport.com";
  var CATALOG_RULES = [
    '[id*="usercentrics"]',
    'body [class*="overlay"]:not(nav *)',
    '[role="dialog"]'
  ];
  var CHROME_SELECTORS = [
    "frach-m-sticky-page-header-container",
    "frach-m-page-header",
    "frach-m-page-footer",
    "#moin-ai-container",
    // date-picker popup the form script appends to <body> (month / weekday / day grid)
    ".flatpickr-calendar",
    // article meta data reading-time item ("{} min Lesezeit"), display: none on the source
    ".frach-m-page-meta-data__detail",
    ".frach-e-skip-link",
    'a[href="#main-content"]',
    "noscript",
    "script",
    "style",
    "link",
    // leftover cookie / overlay chrome
    '[id*="usercentrics"]',
    "[data-usercentrics]",
    '[role="dialog"]'
  ];
  var RAW_TABLE_ATTR2 = "data-excat-raw-table";
  var IFRAMES_ATTR = "data-excat-iframes";
  var LINKED_IMG_ATTR = "data-excat-linked-img";
  var TRACKING_ATTRS = ["data-cmp-data-layer", "data-cmp-clickable", "data-track", "data-tracking", "data-analytics"];
  var TRACKER_SRC = /(facebook\.com\/tr|doubleclick\.net|google-analytics\.com|googletagmanager\.com|bat\.bing\.com|px\.ads\.linkedin\.com|adobedtm\.com|demdex\.net|omtrdc\.net|\/b\/ss\/)/i;
  function normalizeUrl(u) {
    if (!u) return null;
    try {
      const url = new URL(u);
      return `${url.origin}${url.pathname}`.replace(/\/+$/, "");
    } catch (e) {
      return null;
    }
  }
  function getPageUrl(payload, document) {
    const params = payload && payload.params || {};
    return normalizeUrl(params.originalURL) || normalizeUrl(payload && payload.url) || normalizeUrl(document && document.URL);
  }
  function findPageCleanup(template, pageUrl) {
    const map = template && template.pageCleanup;
    if (!map || !pageUrl) return null;
    const key = Object.keys(map).find((k) => normalizeUrl(k) === pageUrl);
    return key ? map[key] : null;
  }
  function safeQueryAll(root, selector) {
    try {
      return Array.from(root.querySelectorAll(selector));
    } catch (e) {
      return [];
    }
  }
  function isInsideMain(el) {
    return !!(el.closest && el.closest("main, #main-content"));
  }
  function isTrackingPixel(img) {
    const w = img.getAttribute("width");
    const h = img.getAttribute("height");
    const src = img.getAttribute("src") || "";
    if ((w === "1" || w === "0") && (h === "1" || h === "0")) return true;
    return TRACKER_SRC.test(src);
  }
  var CONTENT_TAGS = /* @__PURE__ */ new Set(["IMG", "PICTURE", "VIDEO", "IFRAME", "TABLE", "SVG", "AUDIO", "OBJECT", "EMBED"]);
  function collapseEmptySections(document) {
    const body = document.body;
    if (!body) return;
    const walker = document.createTreeWalker(body, 1 | 4);
    const toRemove = [];
    let seenContent = false;
    let lastHr = null;
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === 3) {
        if (node.textContent.trim()) seenContent = true;
      } else if (node.tagName === "HR") {
        if (!seenContent) toRemove.push(node);
        else lastHr = node;
        seenContent = false;
      } else if (CONTENT_TAGS.has(node.tagName.toUpperCase())) {
        seenContent = true;
      }
      node = walker.nextNode();
    }
    if (!seenContent && lastHr) toRemove.push(lastHr);
    toRemove.forEach((hr) => hr.remove());
  }
  function transform(hookName, element, payload) {
    const document = payload && payload.document || element.ownerDocument;
    const root = element || document.body;
    if (hookName === "beforeTransform") {
      safeQueryAll(document, "table").forEach((t) => t.setAttribute(RAW_TABLE_ATTR2, ""));
      safeQueryAll(document, "a.frach-m-image__link").forEach((a) => {
        const lazy = a.querySelector("frach-e-lazy-image, img");
        let src = lazy && (lazy.getAttribute("src") || lazy.getAttribute("data-src"));
        let alt = lazy && lazy.getAttribute("alt") || "";
        if (!src) {
          const comp = a.closest("frach-m-image");
          let dl = null;
          try {
            dl = Object.values(JSON.parse(comp.getAttribute("data-cmp-data-layer")))[0];
          } catch (e) {
            dl = null;
          }
          const path = dl && (dl.image && dl.image["repo:path"] || dl["dc:description"]);
          if (path && /^\/content\/dam\/.+\.(jpe?g|png|gif|webp|svg)$/i.test(path)) {
            src = path;
            alt = alt || dl["dc:title"] || "";
          }
        }
        if (src) a.setAttribute(LINKED_IMG_ATTR, JSON.stringify({ src, alt }));
      });
      const template = payload && payload.template;
      const pageUrl = getPageUrl(payload, document);
      const unused = (fraport_iframes_default[pageUrl] || []).filter((f) => f.src);
      const take = (test) => {
        const i = unused.findIndex(test);
        return i < 0 ? null : unused.splice(i, 1)[0];
      };
      safeQueryAll(document, ".uc-embedding-container").forEach((el) => {
        const poster = el.querySelector('img[src*="/video/youtube/"]');
        const ytId = poster && (poster.getAttribute("src").match(/\/video\/youtube\/([\w-]+?)-poster/) || [])[1];
        let frame = null;
        if (ytId) {
          frame = take((f) => f.src.includes(ytId)) || { src: `https://www.youtube-nocookie.com/embed/${ytId}`, title: "" };
        } else {
          const text = (el.textContent || "").toLowerCase();
          frame = take((f) => {
            try {
              return text.includes(new URL(f.src).host.replace(/^(www|my|app|static)\./, "").split(".")[0]);
            } catch (e) {
              return false;
            }
          }) || take(() => true);
        }
        if (!frame) return;
        const iframe = document.createElement("iframe");
        iframe.setAttribute("src", frame.src);
        if (frame.title) iframe.setAttribute("title", frame.title);
        el.replaceWith(iframe);
      });
      safeQueryAll(document, "iframe").forEach((f) => {
        const src = f.getAttribute("src") || f.getAttribute("data-src") || f.getAttribute("data-url");
        const holder = f.parentElement;
        if (!src || !holder) return;
        let list = [];
        try {
          list = JSON.parse(holder.getAttribute(IFRAMES_ATTR) || "[]");
        } catch (e) {
          list = [];
        }
        list.push({ src, title: f.getAttribute("title") || "" });
        holder.setAttribute(IFRAMES_ATTR, JSON.stringify(list));
      });
      const pageSelectors = findPageCleanup(template, pageUrl);
      if (Array.isArray(pageSelectors)) {
        pageSelectors.forEach((entry) => {
          const selector = typeof entry === "string" ? entry : entry && entry.selector;
          if (!selector) return;
          const matches = safeQueryAll(document, selector);
          if (matches.length === 1) matches[0].remove();
        });
      } else {
        CATALOG_RULES.forEach((rule) => {
          safeQueryAll(document, rule).filter((el) => el.isConnected && !isInsideMain(el)).forEach((el) => el.remove());
        });
      }
    }
    if (hookName === "afterTransform") {
      safeQueryAll(root, `table[${RAW_TABLE_ATTR2}]`).forEach((table) => {
        var _a;
        if (!table.isConnected || ((_a = table.parentElement) == null ? void 0 : _a.closest(`table[${RAW_TABLE_ATTR2}]`))) return;
        const cells = [...table.querySelectorAll(":scope > tr, :scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr")].map((tr) => [...tr.children].filter((c) => /^(TD|TH)$/.test(c.tagName)).map((c) => {
          const div = document.createElement("div");
          div.innerHTML = c.innerHTML;
          return div;
        })).filter((row) => row.length && row.some((c) => c.textContent.trim() || c.querySelector("img, a")));
        if (!cells.length) {
          table.remove();
          return;
        }
        table.replaceWith(WebImporter.Blocks.createBlock(document, { name: "table-data", cells }));
      });
      safeQueryAll(root, ".frach-m-slider__controls, .frach-js-slider__controls, .frach-m-slider__pagination, .frach-js-slider__pagination").forEach((el) => el.remove());
      const SLIDER_LABEL = /^((previous|next) slide\s*)+$/i;
      safeQueryAll(root, "button, p, a, span, li, div").filter((el) => el.isConnected && SLIDER_LABEL.test((el.textContent || "").replace(/\s+/g, " ").trim()) && !el.querySelector("img, picture, video, iframe, table")).forEach((el) => {
        if (el.matches("a") && el.hasAttribute(LINKED_IMG_ATTR)) el.textContent = "";
        else el.remove();
      });
      safeQueryAll(root, 'input[type="checkbox"], input[type="radio"]').filter((el) => !el.closest('form, .fraformsform, frach-m-form, [class*="form"]')).forEach((el) => el.remove());
      safeQueryAll(root, `a[${LINKED_IMG_ATTR}]`).forEach((a) => {
        let data = null;
        try {
          data = JSON.parse(a.getAttribute(LINKED_IMG_ATTR));
        } catch (e) {
          data = null;
        }
        a.removeAttribute(LINKED_IMG_ATTR);
        a.querySelectorAll("frach-e-icon, noscript, .frach-m-image__icon-overlay").forEach((n) => n.remove());
        if (!data || !data.src || a.querySelector("img, picture") || a.textContent.trim()) return;
        const img = document.createElement("img");
        img.setAttribute("src", new URL(data.src, "https://www.fraport.com").href);
        if (data.alt) img.setAttribute("alt", data.alt);
        const href = a.getAttribute("href") || "";
        if (!href || href === "#" || /^javascript:/i.test(href)) a.replaceWith(img);
        else a.append(img);
      });
      safeQueryAll(root, ".uc-embedding-container").forEach((el) => el.remove());
      safeQueryAll(root, "iframe").forEach((f) => {
        const src = f.getAttribute("src");
        if (!src) {
          f.remove();
          return;
        }
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = src.replace(/^(https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]+)\?.*$/, "$1");
        a.textContent = f.getAttribute("title") || a.href;
        p.append(a);
        f.replaceWith(p);
      });
      CHROME_SELECTORS.forEach((sel) => {
        safeQueryAll(document, sel).forEach((el) => el.remove());
      });
      safeQueryAll(document, 'body [class*="overlay"]:not(nav *)').filter((el) => !isInsideMain(el)).forEach((el) => el.remove());
      safeQueryAll(document, "img").filter(isTrackingPixel).forEach((img) => img.remove());
      safeQueryAll(root, "*").forEach((el) => {
        TRACKING_ATTRS.forEach((attr) => {
          if (el.hasAttribute(attr)) el.removeAttribute(attr);
        });
      });
      safeQueryAll(root, "a[href]").forEach((a) => {
        const href = a.getAttribute("href");
        if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return;
        let url;
        try {
          url = new URL(href, SITE_ORIGIN);
        } catch (e) {
          return;
        }
        if (!/^(www\.)?fraport\.com$/i.test(url.hostname)) return;
        const key = url.pathname.replace(/\.html?$/i, "").replace(/\/$/, "").toLowerCase() || "/";
        if (!fraport_pages_default.has(key) || key !== "/" && !/\.html?$/i.test(url.pathname)) return;
        const path = key === "/" ? "/" : WebImporter.FileUtils.sanitizePath(key);
        a.setAttribute("href", `${path}${url.search}${url.hash}`);
      });
      collapseEmptySections(document);
    }
  }

  // tools/importer/parsers/video-player.js
  function parse12(element, { document, params }) {
    const lazy = element.matches("frach-e-lazy-video, .frach-e-lazy-video") ? element : element.querySelector("frach-e-lazy-video, .frach-e-lazy-video");
    const scope = lazy || element;
    const cell = [];
    const source = scope.querySelector("video source[src], source[data-src], source[src], video[src]");
    let src = source ? bestSrc(source) : "";
    if (!src) {
      const frame = scope.querySelector("iframe");
      if (frame) src = bestSrc(frame);
    }
    if (!src) return;
    cell.push(para(document, link(document, src, absUrl2(src))));
    const video = scope.querySelector("video[poster]");
    const posterSrc = video && video.getAttribute("poster") || bestSrc(scope.querySelector(":scope > img, img"));
    if (posterSrc) cell.push(para(document, createImg(document, posterSrc, "")));
    const fig = element.closest("figure") || element.querySelector("figure");
    const cap = fig && fig.querySelector("figcaption");
    if (cap && clean(cap.textContent)) cell.push(para(document, document.createTextNode(clean(cap.textContent))));
    const autoplay = lazy && lazy.getAttribute("autoplay") === "true" || !!element.closest(".frach-m-image__inline-video-container") || !!element.querySelector(".frach-m-image__inline-video-container");
    const name = autoplay ? "video-player (autoplay-background)" : "video-player";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: [[cell.length ? cell : ""]] });
    element.replaceWith(block);
  }

  // tools/importer/transformers/fraport-sections.js
  var MARKER = "data-excat-section-id";
  function findSectionElement(document, section) {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    for (const sel of selectors) {
      if (!sel) continue;
      try {
        const el = document.querySelector(sel);
        if (el) return el;
      } catch (e) {
      }
    }
    return null;
  }
  var CONTENT_TAGS2 = /* @__PURE__ */ new Set(["IMG", "PICTURE", "VIDEO", "IFRAME", "TABLE", "SVG", "AUDIO", "OBJECT", "EMBED"]);
  function collapseEmptySections2(document) {
    const body = document.body;
    if (!body) return;
    const walker = document.createTreeWalker(body, 1 | 4);
    const toRemove = [];
    let seenContent = false;
    let lastHr = null;
    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === 3) {
        if (node.textContent.trim()) seenContent = true;
      } else if (node.tagName === "HR") {
        if (!seenContent) toRemove.push(node);
        else lastHr = node;
        seenContent = false;
      } else if (CONTENT_TAGS2.has(node.tagName.toUpperCase())) {
        seenContent = true;
      }
      node = walker.nextNode();
    }
    if (!seenContent && lastHr) toRemove.push(lastHr);
    toRemove.forEach((hr) => hr.remove());
  }
  function inlineVideos(document, payload) {
    document.body.querySelectorAll("frach-m-image").forEach((comp) => {
      if (!comp.isConnected || !comp.querySelector(".frach-m-image__inline-video-container frach-e-lazy-video")) return;
      if (comp.closest("[data-excat-block]")) return;
      try {
        parse12(comp, { document, params: payload && payload.params || {} });
      } catch (e) {
      }
    });
  }
  function textDialogs(document) {
    document.body.querySelectorAll("frach-m-media-lightbox, .frach-m-overlay").forEach((dlg) => {
      if (!dlg.isConnected || dlg.matches("a") || dlg.parentElement.closest("frach-m-media-lightbox, .frach-m-overlay")) return;
      if (dlg.querySelector(".frach-m-slider__slide") || !dlg.closest("main, #main-content")) return;
      const body = dlg.querySelector(".frach-m-overlay__body") || dlg;
      body.querySelectorAll(".frach-m-overlay__footer, .frach-m-overlay__close-btn, button, form, input").forEach((n) => n.remove());
      if (!(body.textContent || "").trim() || !body.querySelector("p, h1, h2, h3, h4, h5, h6")) return;
      const box = document.createElement("div");
      box.append(...body.childNodes);
      let block = dlg.closest("[data-excat-block]");
      while (block && block.parentElement && block.parentElement.closest("[data-excat-block]")) {
        block = block.parentElement.closest("[data-excat-block]");
      }
      dlg.remove();
      if (block) block.after(box);
      else if (dlg.parentNode) dlg.replaceWith(box);
    });
  }
  var GREY = "data-excat-grey";
  var SELF_PAINTED = [
    ["tiles", "alt"],
    ["columns", "light"],
    ["columns", "grey"],
    ["columns-sidebar", "light"],
    ["columns-sidebar", "light-2"],
    ["key-figures", "light"],
    ["text-media", "grey"]
  ];
  function markGreyBands(document) {
    const bands = [...document.body.querySelectorAll("section.frach-h-bg--grey, div.frach-h-bg--grey")].filter((el) => !el.parentElement.closest(".frach-h-bg--grey")).filter((el) => !el.closest(".frach-m-accordion__section-inner, .frach-m-tabbed-content__panel, frach-m-tabbed-content")).filter((el) => !(el.parentElement && el.parentElement.closest("[data-excat-block]")));
    bands.forEach((el, i) => {
      const start = document.createElement("hr");
      start.setAttribute(GREY, `start-${i}`);
      const end = document.createElement("hr");
      end.setAttribute(GREY, `end-${i}`);
      el.before(start);
      el.after(end);
    });
  }
  function blockInfo(table) {
    const first = table.querySelector("tr");
    const head = first ? first.textContent.replace(/\s+/g, " ").trim() : "";
    const m = head.match(/^([^(]*)(?:\((.*)\))?$/) || ["", head, ""];
    const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return { name: slug(m[1] || ""), options: (m[2] || "").split(",").map(slug).filter(Boolean) };
  }
  function selfPainted(table) {
    const { name, options } = blockInfo(table);
    if (name === "testimonial") return !options.includes("no-caption") && !options.includes("text-over-image");
    return SELF_PAINTED.some(([n, o]) => n === name && options.includes(o));
  }
  function greySectionMetadata(document) {
    const body = document.body;
    const starts = [...body.querySelectorAll(`hr[${GREY}^="start-"]`)];
    starts.forEach((start) => {
      const id = start.getAttribute(GREY).slice(6);
      const end = body.querySelector(`hr[${GREY}="end-${id}"]`);
      if (!end) {
        start.removeAttribute(GREY);
        return;
      }
      const walker = document.createTreeWalker(body, 1 | 4);
      walker.currentNode = start;
      const closers = [];
      let content = false;
      let plain = false;
      let node = walker.nextNode();
      while (node && node !== end) {
        if (node.nodeType === 1 && node.tagName === "HR") {
          if (content && plain) closers.push(node);
          content = false;
          plain = false;
        } else {
          const isContent = node.nodeType === 3 ? !!node.textContent.trim() : /^(IMG|PICTURE|VIDEO|IFRAME|TABLE)$/.test(node.tagName);
          if (isContent) {
            content = true;
            const el = node.nodeType === 3 ? node.parentElement : node;
            let table = el && el.closest("table");
            while (table && table.parentElement && table.parentElement.closest("table")) table = table.parentElement.closest("table");
            if (!table || !selfPainted(table)) plain = true;
          }
        }
        node = walker.nextNode();
      }
      if (node === end && content && plain) closers.push(end);
      closers.forEach((hr) => {
        hr.before(WebImporter.Blocks.createBlock(document, { name: "Section Metadata", cells: { style: "grey" } }));
      });
      start.removeAttribute(GREY);
      end.removeAttribute(GREY);
    });
  }
  var ANCHOR = "data-excat-anchor-id";
  function markAnchorTargets(document) {
    const done = /* @__PURE__ */ new Set();
    document.body.querySelectorAll("frach-m-anchor-list, .frach-m-anchor-list").forEach((list) => {
      list.querySelectorAll('a[href*="#"]').forEach((a) => {
        const href = a.getAttribute("href") || "";
        let id = href.slice(href.indexOf("#") + 1);
        try {
          id = decodeURIComponent(id);
        } catch (e) {
        }
        if (!id) return;
        const target = document.getElementById(id);
        if (!target || target.contains(list) || list.contains(target)) return;
        if (done.has(id)) return;
        done.add(id);
        if (!target.closest("main, #main-content")) return;
        let at = target;
        const block = target.closest("[data-excat-block]");
        if (block && block !== target) {
          let n = target;
          while (n !== block && n.parentElement && n.parentElement.firstElementChild === n) n = n.parentElement;
          if (n !== block || block.parentElement.closest("[data-excat-block]")) return;
          at = block;
        }
        const marker = document.createElement("div");
        marker.setAttribute(ANCHOR, id);
        at.before(marker);
      });
    });
  }
  function isSectionMetadata(table) {
    const first = table.querySelector("tr");
    return !!first && /^section metadata$/i.test(first.textContent.replace(/\s+/g, " ").trim());
  }
  function anchorSections(document) {
    const breaks = [...document.body.querySelectorAll(`[${ANCHOR}]`)].map((marker) => {
      const id = marker.getAttribute(ANCHOR);
      if (marker.closest("table")) {
        marker.remove();
        return null;
      }
      const hr = document.createElement("hr");
      marker.replaceWith(hr);
      return { id, hr };
    }).filter(Boolean);
    breaks.forEach(({ id, hr }) => {
      const walker = document.createTreeWalker(document.body, 1 | 4);
      walker.currentNode = hr;
      let content = false;
      let meta = null;
      let next = null;
      let node = walker.nextNode();
      while (node) {
        if (node.nodeType === 1 && node.tagName === "HR" && !node.closest("table")) {
          if (content) {
            next = node;
            break;
          }
        } else if (node.nodeType === 1 && node.tagName === "TABLE" && isSectionMetadata(node)) {
          meta = node;
          break;
        } else if (node.nodeType === 3 ? !!node.textContent.trim() : /^(IMG|PICTURE|VIDEO|IFRAME|TABLE)$/.test(node.tagName)) {
          content = true;
        }
        node = walker.nextNode();
      }
      if (meta) {
        const tr = document.createElement("tr");
        const k = document.createElement("td");
        k.textContent = "id";
        const v = document.createElement("td");
        v.textContent = id;
        tr.append(k, v);
        (meta.querySelector("tbody") || meta).append(tr);
        return;
      }
      const block = WebImporter.Blocks.createBlock(document, { name: "Section Metadata", cells: { id } });
      if (next) next.before(block);
      else document.body.append(block);
    });
  }
  function transform2(hookName, element, payload) {
    const document = payload && payload.document || element.ownerDocument;
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (hookName === "beforeTransform") {
      document.body.querySelectorAll(".uc-embedding-container").forEach((el) => el.remove());
      restoreIframes(document, document.body);
      textDialogs(document);
      inlineVideos(document, payload);
      styleButtons(document, document.body, {
        paragraph: true,
        skip: "[data-excat-block], nav, header, footer, frach-m-breadcrumb-navigation, frach-m-sticky-page-header-container, frach-m-page-header, frach-m-page-footer, frach-m-main-navigation, .frach-m-meta-navigation, form, .fraformsform"
      });
      markGreyBands(document);
      markAnchorTargets(document);
    }
    if (hookName === "afterTransform") {
      greySectionMetadata(document);
      anchorSections(document);
    }
    if (sections.length < 2) return;
    if (hookName === "beforeTransform") {
      const present = sections.map((section) => ({ section, el: findSectionElement(document, section) })).filter((s) => s.el);
      for (let i = present.length - 1; i >= 0; i -= 1) {
        const { section, el } = present[i];
        if (!el.parentNode) continue;
        const isFirst = i === 0;
        if (isFirst && !section.style) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(MARKER, section.id);
        if (isFirst) hr.setAttribute("data-excat-first-section", "true");
        el.parentNode.insertBefore(hr, el);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = document.querySelector(`hr[${MARKER}="${section.id}"]`);
        const sectionEl = findSectionElement(document, section);
        const anchor = sectionEl || marker;
        if (!anchor || !anchor.parentNode) continue;
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (sectionEl) {
          sectionEl.after(metaBlock);
        } else {
          let next = marker.nextElementSibling;
          while (next && next.tagName !== "HR") next = next.nextElementSibling;
          if (next) next.before(metaBlock);
          else marker.parentNode.appendChild(metaBlock);
        }
      }
      document.querySelectorAll(`hr[${MARKER}]`).forEach((hr) => hr.removeAttribute(MARKER));
      document.querySelectorAll("hr[data-excat-first-section]").forEach((hr) => hr.remove());
      collapseEmptySections2(document);
    }
  }

  // tools/importer/import-article.js
  var PAGE_TEMPLATE = {
    "name": "article",
    "description": "Text article that opens straight into body paragraphs, without a hero stage",
    "urls": [
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/Vermessungsfluege-nachts.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot1.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/beginn-probebetrieb-verlegung-der-flugroute-amtix--kurz--im-nove.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/erneute-sperrung-der-landebahn-nordwest-ab-dem-14--dezember.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/relaunch-der-fraport-homepage.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-landebahn-nordwest.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-suedbahn-im-april.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/startbahn-18-ab-15--oktober-wieder-in-betrieb.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/suedbahn-ab-30--april-wieder-in-betrieb.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verkehrsbeeintraechtigungen-durch-erneute-drohnensichtungen.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-nachts-vom-29--Oktober-bis-01--November-20201.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-vom-11--bis-14--mai-2020.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-nachts-vom-17--bis-20--september-2020.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-vom-18--bis-21--august-2020.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-nachts-vom-22--bis-25--Oktober-2020.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-vom-04--bis-07--mai-2020.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-02--bis-05--januar-2020.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-19--bis-22--maerz-2020.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-20--bis-23--februar-2020.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verspaetungen-aufgrund-einer-drohnensichtung.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/wiedereroeffnung-der-landebahn-nord-west.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/abfluege--amtix--kurz---ab-22-04-2021.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ausflottung-der-lufthansa-md-11---mcdonnell-douglas--im-oktober-.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/aussetzung-des-probebetriebs-zur-optimierung-amtix--kurz--.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/centerbahn-voraussichtlich-bis-03--oktober-ausser-betrieb.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ganztaegige-anwendung-des-segmented-approach.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/landebahn-nordwest-und-terminal-2-ab-1--juni-wieder-in-betrieb.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neue-projektphase-zum-thema-ultrafeinstaub-im-bereich-des-flugha.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neuentwicklung-der-fra-map-2-0.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/probebetrieb-zur-optimierten-nutzung-des-start--und-landebahnens.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/verkehrsbeeintraechtigungen-durch-drohnensichtung.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-nordwest-landebahn-vom-15--bis-19--maerz-2021.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom--27--bis-voraussichtlich-28--august-2021--.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-03--und-04--dezember-2021---landebahn-nord.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-06--bis-09--mai-2021---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-07--bis-10--oktober-2021---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-15--bis-18--april-2021.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-19--22-08-2021---landebahn-nordwest.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-23--bis-26--september-2021---landebahn-nor.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-26--bis-27--november-2021---landebahn-nord.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-30--september-bis-03--oktober-2021---suedb.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-erneut-ausser-betrieb.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-voraussichtlich-bis-31--mai-ausser-betrieb.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/militaerische-grossuebung--air-defender-2023--im-deutschen-luftr.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/nachtfluege-am-20--juni-.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/naechtliche-centerbahnsperrung-vom-03--juli-2023.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/sperrung-der-landebahn-nordwest-am-04--06--oktober-2023.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-10----14--juli-2023-am-frankf.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-19----23--juni--2023-am-frank.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-02--bis-05--maerz-2023---suedbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-07--bis-10--september-2023---suedbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-09-12-maerz-und-vom.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-12--15--und-20--22--oktober-2023---alle-ba.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-21----24--september-2023---landebahn-nord-.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-27--30--april-2023---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-15--juli.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-16--august-2023.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/witterung-beeinflusst-die-regionale-fluglaermbelastung.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/kurzfristige-sperrung-der-landebahn-nordwest.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/naechtliche-centerbahnsperrung-ab-15--juli-20240.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-08--bis-09--juli-2024-.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-11--bis-12--mai-2024---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-04---06--oktober--2024---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-08--bis-10--maerz-2024---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-11---14--april-2024---landebahn-nord-west.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-12---15--september-2024---landebahn-nord-w.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-16---17--november-2024---rund-um-den-flugh.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-26---29--september--2024---landebahn-nordw.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29---01--september-2024---suedbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29--februar---02--maerz-2024---landebahn-n.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-13--august.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-3--august.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/inbetriebnahme-der-neuen-abflugroute-cindy-sulus--ehemals-amtix-.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/neue-interaktive-karte-fra-nom-in-betrieb.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/sonder-vermessungsfluege-vom-05---09--september--2025---centerba.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-03---05--april--2025---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-06---08--maerz-2025---landebahn-nord-west.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---14--september-2025---landebahn-nord-w.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---23--august--2025---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-15--bis-16--november-2025---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-16---19--oktober--2025---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-18---21--september-2025---landebahn-nord-w.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--februar-2025---suedbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--maerz-2025---landebahn-nord-west.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-26--bis-30--mai-2025---rund-um-den-flughaf.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-28---31--august-2025---suedbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/geophysikalische-messfluege-zur-geothermie-erkundung-im-oberrhei.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-am-29--und-30--juni-2026---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-03---06--september-2026---suedbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-12--bis-15--maerz-2026---landebahn-nord-we.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-13--bis-15--februar---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-17---20--september-2026---landebahn-nord-w.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-19--bis-22--maerz-2026---landebahn-nord-we.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-20---23--august--2026---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-22--bis-27--juni-2025---centerbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-24---27--september-2026---landebahn-nord-w.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-26---28--februar-2026---suedbahn.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/zweiwoechige-sperrung-der-centerbahn-im-maerz.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html",
      "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html",
      "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html",
      "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html",
      "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html",
      "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html",
      "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html",
      "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html",
      "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html",
      "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html",
      "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html",
      "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html",
      "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html",
      "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html",
      "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html",
      "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html",
      "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html",
      "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html",
      "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html",
      "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html",
      "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html",
      "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html",
      "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html",
      "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html",
      "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html",
      "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html",
      "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html",
      "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html",
      "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html",
      "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html",
      "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html",
      "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html",
      "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html",
      "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html",
      "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html",
      "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html",
      "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html",
      "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html",
      "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html",
      "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html",
      "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html",
      "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html"
    ],
    "blocks": [
      {
        "name": "breadcrumb",
        "instances": [
          "frach-m-breadcrumb-navigation"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/Vermessungsfluege-nachts.html": [
            "#press-872253aabd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot.html": [
            "#press-a582e7d41e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot1.html": [
            "#press-dd223539ef > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/beginn-probebetrieb-verlegung-der-flugroute-amtix--kurz--im-nove.html": [
            "#press-75d67fbb45 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/erneute-sperrung-der-landebahn-nordwest-ab-dem-14--dezember.html": [
            "#press-dd418076c4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/relaunch-der-fraport-homepage.html": [
            "#press-b92e6b8b99 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-landebahn-nordwest.html": [
            "#press-78911db295 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-suedbahn-im-april.html": [
            "#press-d3aa64ed79 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/startbahn-18-ab-15--oktober-wieder-in-betrieb.html": [
            "#press-9376031799 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/suedbahn-ab-30--april-wieder-in-betrieb.html": [
            "#press-e3815e739e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verkehrsbeeintraechtigungen-durch-erneute-drohnensichtungen.html": [
            "#press-67767dbc0d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-nachts-vom-29--Oktober-bis-01--November-20201.html": [
            "#press-71a3e8792e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-vom-11--bis-14--mai-2020.html": [
            "#press-314d25ea5d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-nachts-vom-17--bis-20--september-2020.html": [
            "#press-03118447bb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-vom-18--bis-21--august-2020.html": [
            "#press-e853d2bf2c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-nachts-vom-22--bis-25--Oktober-2020.html": [
            "#press-853db4ae2c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-vom-04--bis-07--mai-2020.html": [
            "#press-ab5034c864 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-02--bis-05--januar-2020.html": [
            "#press-816ce31aa1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-19--bis-22--maerz-2020.html": [
            "#press-433b7a337e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-20--bis-23--februar-2020.html": [
            "#press-7f14083bf1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verspaetungen-aufgrund-einer-drohnensichtung.html": [
            "#press-78e50c32fa > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/wiedereroeffnung-der-landebahn-nord-west.html": [
            "#press-80f657b6ee > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/abfluege--amtix--kurz---ab-22-04-2021.html": [
            "#press-8426d1d78d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ausflottung-der-lufthansa-md-11---mcdonnell-douglas--im-oktober-.html": [
            "#press-6e936f1382 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/aussetzung-des-probebetriebs-zur-optimierung-amtix--kurz--.html": [
            "#press-ca33337b05 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/centerbahn-voraussichtlich-bis-03--oktober-ausser-betrieb.html": [
            "#press-367906b889 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ganztaegige-anwendung-des-segmented-approach.html": [
            "#press-72cf970d61 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/landebahn-nordwest-und-terminal-2-ab-1--juni-wieder-in-betrieb.html": [
            "#press-cc62779b21 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neue-projektphase-zum-thema-ultrafeinstaub-im-bereich-des-flugha.html": [
            "#press-9526fe61ba > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neuentwicklung-der-fra-map-2-0.html": [
            "#press-ea85b35b51 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/probebetrieb-zur-optimierten-nutzung-des-start--und-landebahnens.html": [
            "#press-bd46bd77c7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/verkehrsbeeintraechtigungen-durch-drohnensichtung.html": [
            "#press-7521c37179 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-nordwest-landebahn-vom-15--bis-19--maerz-2021.html": [
            "#press-dff318372c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom--27--bis-voraussichtlich-28--august-2021--.html": [
            "#press-8944d8402a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-03--und-04--dezember-2021---landebahn-nord.html": [
            "#press-bfff3f9185 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-06--bis-09--mai-2021---centerbahn.html": [
            "#press-f220617baa > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-07--bis-10--oktober-2021---centerbahn.html": [
            "#press-5e2a2b2ed5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-15--bis-18--april-2021.html": [
            "#press-37995f0a35 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-19--22-08-2021---landebahn-nordwest.html": [
            "#press-0bc38cf2c9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-23--bis-26--september-2021---landebahn-nor.html": [
            "#press-a458846838 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-26--bis-27--november-2021---landebahn-nord.html": [
            "#press-ffa4be9fc1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-30--september-bis-03--oktober-2021---suedb.html": [
            "#press-1e32b5bd01 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-erneut-ausser-betrieb.html": [
            "#press-02678784ec > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-voraussichtlich-bis-31--mai-ausser-betrieb.html": [
            "#press-154a7f8829 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/militaerische-grossuebung--air-defender-2023--im-deutschen-luftr.html": [
            "#press-74f55e9852 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/nachtfluege-am-20--juni-.html": [
            "#press-57e276e1bb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/naechtliche-centerbahnsperrung-vom-03--juli-2023.html": [
            "#press-d57f27f0e6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/sperrung-der-landebahn-nordwest-am-04--06--oktober-2023.html": [
            "#press-4ffddf2936 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-10----14--juli-2023-am-frankf.html": [
            "#press-905abd959c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-19----23--juni--2023-am-frank.html": [
            "#press-9dc7fb98bd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-02--bis-05--maerz-2023---suedbahn.html": [
            "#press-1356312f32 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-07--bis-10--september-2023---suedbahn.html": [
            "#press-173ac1354b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-09-12-maerz-und-vom.html": [
            "#press-16c4abccc0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-12--15--und-20--22--oktober-2023---alle-ba.html": [
            "#press-c55bacb500 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-21----24--september-2023---landebahn-nord-.html": [
            "#press-945928e828 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-27--30--april-2023---centerbahn.html": [
            "#press-1448322f41 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-15--juli.html": [
            "#press-7ddfbb2940 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-16--august-2023.html": [
            "#press-0d72fd4e75 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/witterung-beeinflusst-die-regionale-fluglaermbelastung.html": [
            "#press-5c24cc8e70 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
            "#press-f00ab1757e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/kurzfristige-sperrung-der-landebahn-nordwest.html": [
            "#press-f05fd37af9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/naechtliche-centerbahnsperrung-ab-15--juli-20240.html": [
            "#press-2acf089e51 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-08--bis-09--juli-2024-.html": [
            "#press-08cece3d96 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-11--bis-12--mai-2024---centerbahn.html": [
            "#press-ce6ed51d2c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-04---06--oktober--2024---centerbahn.html": [
            "#press-8bb2d1327e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-08--bis-10--maerz-2024---centerbahn.html": [
            "#press-e70c5ae7ed > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-11---14--april-2024---landebahn-nord-west.html": [
            "#press-171a67cbf0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-12---15--september-2024---landebahn-nord-w.html": [
            "#press-44d1d1d68f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-16---17--november-2024---rund-um-den-flugh.html": [
            "#press-00d8ea0ea0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-26---29--september--2024---landebahn-nordw.html": [
            "#press-9598cc7a5f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29---01--september-2024---suedbahn.html": [
            "#press-bda6d67924 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29--februar---02--maerz-2024---landebahn-n.html": [
            "#press-d351188a7e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-13--august.html": [
            "#press-d3cd5bc9c4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-3--august.html": [
            "#press-64c32d50b7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/inbetriebnahme-der-neuen-abflugroute-cindy-sulus--ehemals-amtix-.html": [
            "#press-002c2ec746 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/neue-interaktive-karte-fra-nom-in-betrieb.html": [
            "#press-e958b61d70 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/sonder-vermessungsfluege-vom-05---09--september--2025---centerba.html": [
            "#press-20905f7784 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-03---05--april--2025---centerbahn.html": [
            "#press-f10bde0d70 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-06---08--maerz-2025---landebahn-nord-west.html": [
            "#press-c96f70501c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---14--september-2025---landebahn-nord-w.html": [
            "#press-cceb494f8d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---23--august--2025---centerbahn.html": [
            "#press-f77ac40f37 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-15--bis-16--november-2025---centerbahn.html": [
            "#press-0cc3ebe1ce > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-16---19--oktober--2025---centerbahn.html": [
            "#press-8a296d43ed > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-18---21--september-2025---landebahn-nord-w.html": [
            "#press-5fb685a694 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--februar-2025---suedbahn.html": [
            "#press-f0d5fa3f1f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--maerz-2025---landebahn-nord-west.html": [
            "#press-c79d2b6fcb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-26--bis-30--mai-2025---rund-um-den-flughaf.html": [
            "#press-27cc9a66b5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-28---31--august-2025---suedbahn.html": [
            "#press-12bb5b2179 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/geophysikalische-messfluege-zur-geothermie-erkundung-im-oberrhei.html": [
            "#press-8ecca00b92 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-am-29--und-30--juni-2026---centerbahn.html": [
            "#press-417e244a2a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-03---06--september-2026---suedbahn.html": [
            "#press-3114427416 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-12--bis-15--maerz-2026---landebahn-nord-we.html": [
            "#press-c564f92cd6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-13--bis-15--februar---centerbahn.html": [
            "#press-6555b035c5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-17---20--september-2026---landebahn-nord-w.html": [
            "#press-17628f974e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-19--bis-22--maerz-2026---landebahn-nord-we.html": [
            "#press-03fc988431 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-20---23--august--2026---centerbahn.html": [
            "#press-c4d24d3b77 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-22--bis-27--juni-2025---centerbahn.html": [
            "#press-7461484934 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-24---27--september-2026---landebahn-nord-w.html": [
            "#press-323ecae140 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-26---28--februar-2026---suedbahn.html": [
            "#press-84b15b195e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/zweiwoechige-sperrung-der-centerbahn-im-maerz.html": [
            "#press-0fc68c135a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html": [
            "#press-ac90d2d732 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html": [
            "#press-59d414f04d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html": [
            "#press-04c822cc0f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html": [
            "#press-d4dc8f6605 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html": [
            "#press-c8f6e8a6da > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html": [
            "#press-6716a7c478 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html": [
            "#press-3f064fe0b8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html": [
            "#press-cfe3dd41a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html": [
            "#press-8caea52aae > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html": [
            "#press-9f12edf309 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html": [
            "#press-a1a97ed8ac > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html": [
            "#press-e3fc651de5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html": [
            "#press-21ef3718e4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
            "#press-a2e59c335e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html": [
            "#press-2e689a2610 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html": [
            "#press-09475654fb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html": [
            "#press-a6805dfc13 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html": [
            "#press-d261f088ae > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html": [
            "#press-4cfaac08f8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html": [
            "#press-3f972c9514 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html": [
            "#press-bd2faa268e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html": [
            "#press-3e2dc8917f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html": [
            "#press-60ed56bda1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html": [
            "#press-47dcf3814b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html": [
            "#press-1719ea91d9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html": [
            "#press-02779a00d8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html": [
            "#press-52db553aad > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html": [
            "#press-5b087bd559 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html": [
            "#press-f286f9b3c1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html": [
            "#press-4209ad012f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html": [
            "#press-5920072f95 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html": [
            "#press-9f258f6b9f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html": [
            "#press-922dd9bd05 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html": [
            "#press-08d1012948 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html": [
            "#press-62e7961f2a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html": [
            "#press-8046f7c27c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html": [
            "#press-baf05cc7ed > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html": [
            "#press-41dd266e7f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html": [
            "#press-cc1741f8c2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html": [
            "#press-587d6574b2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#press-930093a9f8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
            "#press-24ed047de8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html": [
            "#press-249e0785d2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html": [
            "#press-60ebdbd7c6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html": [
            "#press-18e6dccac0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html": [
            "#press-1d87c32831 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html": [
            "#press-7395337dbb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html": [
            "#press-d37ecc1ab4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html": [
            "#press-dd1b39cb49 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html": [
            "#press-70eea48f3d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html": [
            "#press-29c204b8b7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html": [
            "#press-45b2a8a919 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#press-23ae590397 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html": [
            "#press-c216608751 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html": [
            "#press-0e1729a1a9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html": [
            "#press-44060b04e0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html": [
            "#press-1a1828f7f7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html": [
            "#press-349713b9ef > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html": [
            "#press-4e396e1a2a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html": [
            "#press-77d819f2e2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html": [
            "#press-ac3abee500 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html": [
            "#press-e6524b7ce0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html": [
            "#press-2bee678549 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html": [
            "#press-3565c324a0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html": [
            "#press-45c8c14578 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html": [
            "#press-66ea5c74c2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html": [
            "#press-cae0af36c6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html": [
            "#press-659991597d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html": [
            "#press-975a382873 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html": [
            "#press-8c79d1a632 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html": [
            "#press-ea8af060b7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html": [
            "#press-39dab0431b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html": [
            "#press-f07338a704 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html": [
            "#press-083a4d986d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html": [
            "#press-bc64ac95ad > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html": [
            "#press-f65ea1a0e7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html": [
            "#press-56910a7803 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html": [
            "#press-dbf7f80230 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html": [
            "#press-080300a7da > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html": [
            "#press-82a9cb7868 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html": [
            "#press-c6f7250562 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html": [
            "#press-3e8c377ad1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html": [
            "#press-d84d6e101d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html": [
            "#press-2cbbac30f3 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html": [
            "#press-970fa1b7a0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html": [
            "#press-1c06043327 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html": [
            "#press-3df610934c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html": [
            "#press-a484e2055e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html": [
            "#press-33214412ee > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html": [
            "#press-c306f2dbb2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html": [
            "#press-2e1b85fa9f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html": [
            "#press-45995ffac8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html": [
            "#press-adc0bb519d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html": [
            "#press-bccee917c6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html": [
            "#press-449ed28313 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html": [
            "#press-0553c43ab6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html": [
            "#press-f1cc8f63d6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#press-06b75e5dcc > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html": [
            "#press-27b79a04b0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html": [
            "#press-d6364a139f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html": [
            "#press-66ecdef95f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html": [
            "#press-2d06164dc1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html": [
            "#press-b92b248959 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html": [
            "#press-40c2dc7f89 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html": [
            "#press-d9ff180088 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html": [
            "#press-54a0a3c9ff > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html": [
            "#press-fa4eeaa5e4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html": [
            "#press-6f9ebaac7b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html": [
            "#press-8e6dfa45b2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html": [
            "#press-5b5c328907 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html": [
            "#press-c77a5aab43 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html": [
            "#press-803ff5d520 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html": [
            "#press-b5bd8e1c5c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html": [
            "#press-46673f9de9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html": [
            "#press-088edd28ff > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html": [
            "#press-0aea1e6c8a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html": [
            "#press-2d2cd6e76b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html": [
            "#press-034ba57d8d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html": [
            "#press-e07fb4cf63 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html": [
            "#press-129f7961a8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html": [
            "#press-ced8c39597 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
            "#press-cf2a45a4c8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html": [
            "#press-e83e2e7584 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html": [
            "#press-339aef0f8f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
            "#press-af1c9eb64f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html": [
            "#press-7032fd7fd1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html": [
            "#press-f2ff569c97 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html": [
            "#press-523a4d312f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
            "#press-4d3b397b0b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html": [
            "#press-05ed6801ad > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html": [
            "#press-df633da970 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
            "#press-81e160971c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html": [
            "#press-d2ac7c38e5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html": [
            "#press-bed1563156 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html": [
            "#press-b91e237b96 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html": [
            "#press-2e67454b0e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html": [
            "#press-fdb0fa3f24 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html": [
            "#press-06dd252a3a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html": [
            "#press-de0190ec08 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html": [
            "#press-a3a2425785 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html": [
            "#press-77b3ebc692 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#press-73bab5d013 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
            "#press-93ef4c375b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html": [
            "#press-d93d2325f1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html": [
            "#press-353fc16283 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html": [
            "#press-6ac873939b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html": [
            "#press-fe29d51ea6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#press-87c59df1a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html": [
            "#press-e22a3a7e83 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html": [
            "#press-7b3f18381a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html": [
            "#press-7221570b29 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html": [
            "#press-8c49f52bce > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html": [
            "#press-c74abed4e3 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html": [
            "#press-b6274922ba > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html": [
            "#press-412bf390a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html": [
            "#press-11e232d86b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html": [
            "#press-07b52303e5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html": [
            "#press-8e1864e8c0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html": [
            "#press-1130df0a9b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html": [
            "#press-7b854f6172 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html": [
            "#press-191e0bde02 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html": [
            "#press-9259fa4a24 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html": [
            "#press-1ec2cb8cc2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html": [
            "#press-37fc30ed90 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html": [
            "#press-68af4ae479 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html": [
            "#press-ecaf770212 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html": [
            "#press-27a25942d2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
            "#press-558e04e87d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html": [
            "#press-b115f5bd1d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html": [
            "#press-2fe48c6c45 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html": [
            "#press-fcd9905d26 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html": [
            "#press-eaa99cd21b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html": [
            "#press-787dbd356b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html": [
            "#press-2987cc1329 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html": [
            "#press-b7c357acb4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html": [
            "#press-6a0308bf18 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html": [
            "#press-396977a125 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html": [
            "#press-e714a91e72 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html": [
            "#press-c370d10b1c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html": [
            "#press-4b1b1676fe > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html": [
            "#press-788b52a19b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html": [
            "#press-9d054f883a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html": [
            "#press-9ebbbc3443 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html": [
            "#press-3ab03daff9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
            "#press-31823819f8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html": [
            "#press-8252834c91 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html": [
            "#press-c2be4cf4f6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
            "#press-5df1c89082 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html": [
            "#press-504a5882f7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html": [
            "#press-d2986cec53 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html": [
            "#press-02999958fa > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html": [
            "#press-9ee9b94302 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html": [
            "#press-40f3ed3cf8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html": [
            "#press-b0366b8fe5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html": [
            "#press-6b6be61749 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html": [
            "#press-4080291530 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html": [
            "#press-254d4ae222 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html": [
            "#press-eb2e41a16e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html": [
            "#press-3d75ce5128 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html": [
            "#press-244cd04ad9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html": [
            "#press-9f9e6fd076 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html": [
            "#press-0b617eb809 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html": [
            "#press-e923d6a510 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html": [
            "#press-c0bd641673 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html": [
            "#press-f7715b0237 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html": [
            "#press-b026caccc2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html": [
            "#press-dada4ec549 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html": [
            "#press-fbd0ef5fc9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html": [
            "#press-3cfd2d5338 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html": [
            "#press-d9cb8e886e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html": [
            "#press-6a6a62f3cd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html": [
            "#press-c37edf2276 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html": [
            "#press-1ff652c632 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html": [
            "#press-abc1a9e3a7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html": [
            "#press-dff3035b96 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html": [
            "#press-29eaa0616b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html": [
            "#press-45961e2b6f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html": [
            "#press-5b11cdf213 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html": [
            "#press-7e1c9abda6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html": [
            "#press-ffa681f47d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html": [
            "#press-88bb515232 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html": [
            "#press-8631d68893 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html": [
            "#press-c37caad686 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html": [
            "#press-28ad0a20ad > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html": [
            "#press-3b6ea34a24 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html": [
            "#press-79f1d0fa2a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html": [
            "#press-ccc35f9218 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html": [
            "#press-38ad9ce038 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html": [
            "#press-0f4f280163 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html": [
            "#press-5108efc389 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
            "#press-017cb9a21c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html": [
            "#press-80d2dc7f1e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html": [
            "#press-2e2b0e8054 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
            "#press-71da4aee93 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
            "#press-e363f7309c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html": [
            "#press-0f1e7294fe > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html": [
            "#press-a68abdeeda > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html": [
            "#press-67913e67f3 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html": [
            "#press-6108e7aebf > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html": [
            "#press-691458143e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html": [
            "#press-64842047fd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html": [
            "#press-38b5997a90 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html": [
            "#press-4a2551f1f0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html": [
            "#press-d35029bb5e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html": [
            "#press-2ff294f055 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html": [
            "#press-d8c2ebedc5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html": [
            "#press-5ee062bf7a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
            "#press-59c132a54a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html": [
            "#press-ea77b07e28 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html": [
            "#press-f6256584de > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html": [
            "#press-0a0ee7ab4a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html": [
            "#press-ce4871c245 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html": [
            "#press-fdf89f6040 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html": [
            "#press-50f9e21b96 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html": [
            "#press-d12e764a7a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html": [
            "#press-b62ee525c2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html": [
            "#press-32d3063eb1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html": [
            "#press-11d702412a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html": [
            "#press-6ea8fa3817 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html": [
            "#press-595d203b44 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html": [
            "#press-662753cce9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html": [
            "#press-9056c483e0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html": [
            "#press-b88bec805d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html": [
            "#press-9f90e95d13 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html": [
            "#press-10fc6597c0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html": [
            "#press-48260e4c54 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html": [
            "#press-cfc7ee6f70 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html": [
            "#press-beb531eaf6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html": [
            "#press-681ee8722f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html": [
            "#press-00160073fc > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html": [
            "#press-c729a4a3bf > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html": [
            "#press-270e34ef9d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html": [
            "#press-110a0ca670 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html": [
            "#press-771d224bc9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html": [
            "#press-e52cad1eb4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html": [
            "#press-f5c934cb67 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html": [
            "#press-bf60741263 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html": [
            "#press-81f7da0850 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html": [
            "#press-f3c2191a41 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html": [
            "#press-acdc3af55d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html": [
            "#press-0fde614bc6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
            "#press-1c4d524dfb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
            "#press-607cb5239e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html": [
            "#press-f1e75487f3 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html": [
            "#press-ce20e35a71 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html": [
            "#press-b1710d62e8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
            "#press-4b520fce9b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html": [
            "#press-078001b8c8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html": [
            "#press-24badaafbe > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html": [
            "#press-f30d1517ef > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html": [
            "#press-e9ae515fd2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html": [
            "#press-931ae4ff06 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html": [
            "#press-f05b1e0c80 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html": [
            "#press-2fcbfa2f4e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html": [
            "#press-b9203eff8b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html": [
            "#press-4e10362fed > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html": [
            "#press-3ed1754602 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html": [
            "#press-39152a5f84 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html": [
            "#press-a3242244a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
            "#press-b80d9abb9b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html": [
            "#press-4d7882508e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html": [
            "#press-a896a91869 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html": [
            "#press-9d30287cb8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html": [
            "#press-9ad0789086 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html": [
            "#press-a390c0b48b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
            "#press-00f76e8bb6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html": [
            "#press-1d9944d9c5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html": [
            "#press-851d3fc541 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html": [
            "#press-eed27c14eb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html": [
            "#press-da411801d7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html": [
            "#press-a9fa14bc41 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html": [
            "#press-0b70fc1a85 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html": [
            "#press-5bf728a5c9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html": [
            "#press-d96a514a8a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html": [
            "#press-345ccf94d3 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html": [
            "#press-3b02024351 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html": [
            "#press-7248b3baee > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html": [
            "#press-26c0f64b5e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html": [
            "#press-4f073b699f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html": [
            "#press-33f252725a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html": [
            "#press-cce2c8c7f7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html": [
            "#press-46a8836452 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html": [
            "#press-a800a39a7b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html": [
            "#press-b044b0d96a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html": [
            "#press-60eb885a8a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html": [
            "#press-5ac4ade682 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html": [
            "#press-70650b480d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html": [
            "#press-54feed8507 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html": [
            "#press-e0b1391686 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html": [
            "#press-5ca470d31d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html": [
            "#press-c281d07b68 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html": [
            "#press-e1e71723d2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
            "#press-7b71db49fd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html": [
            "#press-b80b448c23 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html": [
            "#press-8a1a4bb2ab > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html": [
            "#press-b72e9aa232 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html": [
            "#press-e52f817d8a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html": [
            "#press-4c9d50776f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html": [
            "#press-c6408ca78b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html": [
            "#press-e2a9aebb83 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html": [
            "#press-2c0fa5e11a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html": [
            "#press-9d9c006fdf > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html": [
            "#press-a34d61bff0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html": [
            "#press-b4706cce3b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html": [
            "#press-ad168230cf > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html": [
            "#press-bea3896155 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html": [
            "#press-c5453bd67a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html": [
            "#press-f42248b8e9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html": [
            "#press-3ad5ddbd33 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html": [
            "#press-230dee35f3 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html": [
            "#press-b79838d0d2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html": [
            "#press-371b6ea75a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html": [
            "#press-295ea1243c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html": [
            "#press-7e0dc1f8fc > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html": [
            "#press-a90e208dee > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html": [
            "#press-f3d9dd8910 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html": [
            "#press-b55da77d33 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html": [
            "#press-92324ab86b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html": [
            "#press-74e050d15c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html": [
            "#press-6d86bd99af > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html": [
            "#press-02d550d821 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html": [
            "#press-8b6bb43d33 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html": [
            "#press-292c2539c7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html": [
            "#press-45dad09827 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html": [
            "#press-5cd9b595ec > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html": [
            "#press-161ad8d11d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html": [
            "#press-c4b5eaf9a4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
            "#press-b9eacd3941 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html": [
            "#press-a8486351ff > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html": [
            "#press-72dc1a2db9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html": [
            "#press-e03ce0f3fd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html": [
            "#press-b254a08ef8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
            "#press-210945bf5a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html": [
            "#press-3e98331af0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html": [
            "#press-b7f51b11c1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html": [
            "#press-d8e90a76ff > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
            "#press-b496f67b35 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html": [
            "#press-743e7e5ba1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html": [
            "#press-b71d07f821 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html": [
            "#press-af643ad23a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html": [
            "#press-6de2b9b942 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html": [
            "#press-92248bc9d4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html": [
            "#press-1e6fa053a8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html": [
            "#press-5d4a3f3b4a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html": [
            "#press-d47b522b2b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html": [
            "#press-be4a8d6076 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html": [
            "#press-ee1384f85e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html": [
            "#press-a961459b5b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html": [
            "#press-0465dbc2ac > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html": [
            "#press-4de5951176 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html": [
            "#press-9b6273785c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html": [
            "#press-ddb49dcc04 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html": [
            "#press-4d368a5e93 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html": [
            "#press-9f5172b237 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html": [
            "#press-e95b7eab2f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html": [
            "#press-8dd7e79599 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html": [
            "#press-94a5a1ad58 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ]
        }
      },
      {
        "name": "sticky-patch",
        "instances": [
          "#main-content frach-e-sticky-patch"
        ]
      },
      {
        "name": "anchor-list",
        "instances": [
          "#main-content frach-m-anchor-list"
        ]
      },
      {
        "name": "article-footer",
        "instances": [
          "#main-content frach-m-hero .frach-m-page-meta-data:has(.frach-m-page-meta-data__text a[href])"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/Vermessungsfluege-nachts.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot1.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/erneute-sperrung-der-landebahn-nordwest-ab-dem-14--dezember.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/relaunch-der-fraport-homepage.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-landebahn-nordwest.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-suedbahn-im-april.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/startbahn-18-ab-15--oktober-wieder-in-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/suedbahn-ab-30--april-wieder-in-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verkehrsbeeintraechtigungen-durch-erneute-drohnensichtungen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-nachts-vom-29--Oktober-bis-01--November-20201.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-vom-11--bis-14--mai-2020.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-nachts-vom-17--bis-20--september-2020.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-vom-18--bis-21--august-2020.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-nachts-vom-22--bis-25--Oktober-2020.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-vom-04--bis-07--mai-2020.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-02--bis-05--januar-2020.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-19--bis-22--maerz-2020.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-20--bis-23--februar-2020.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verspaetungen-aufgrund-einer-drohnensichtung.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/wiedereroeffnung-der-landebahn-nord-west.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/abfluege--amtix--kurz---ab-22-04-2021.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ausflottung-der-lufthansa-md-11---mcdonnell-douglas--im-oktober-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/aussetzung-des-probebetriebs-zur-optimierung-amtix--kurz--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/centerbahn-voraussichtlich-bis-03--oktober-ausser-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ganztaegige-anwendung-des-segmented-approach.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/landebahn-nordwest-und-terminal-2-ab-1--juni-wieder-in-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neue-projektphase-zum-thema-ultrafeinstaub-im-bereich-des-flugha.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neuentwicklung-der-fra-map-2-0.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/probebetrieb-zur-optimierten-nutzung-des-start--und-landebahnens.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/verkehrsbeeintraechtigungen-durch-drohnensichtung.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-nordwest-landebahn-vom-15--bis-19--maerz-2021.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom--27--bis-voraussichtlich-28--august-2021--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-03--und-04--dezember-2021---landebahn-nord.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-06--bis-09--mai-2021---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-07--bis-10--oktober-2021---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-15--bis-18--april-2021.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-19--22-08-2021---landebahn-nordwest.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-23--bis-26--september-2021---landebahn-nor.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-26--bis-27--november-2021---landebahn-nord.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-30--september-bis-03--oktober-2021---suedb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-erneut-ausser-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-voraussichtlich-bis-31--mai-ausser-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/militaerische-grossuebung--air-defender-2023--im-deutschen-luftr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/nachtfluege-am-20--juni-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/naechtliche-centerbahnsperrung-vom-03--juli-2023.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/sperrung-der-landebahn-nordwest-am-04--06--oktober-2023.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-10----14--juli-2023-am-frankf.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-19----23--juni--2023-am-frank.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-02--bis-05--maerz-2023---suedbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-07--bis-10--september-2023---suedbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-09-12-maerz-und-vom.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-12--15--und-20--22--oktober-2023---alle-ba.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-21----24--september-2023---landebahn-nord-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-27--30--april-2023---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-15--juli.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-16--august-2023.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/witterung-beeinflusst-die-regionale-fluglaermbelastung.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/kurzfristige-sperrung-der-landebahn-nordwest.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/naechtliche-centerbahnsperrung-ab-15--juli-20240.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-08--bis-09--juli-2024-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-11--bis-12--mai-2024---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-04---06--oktober--2024---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-08--bis-10--maerz-2024---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-11---14--april-2024---landebahn-nord-west.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-12---15--september-2024---landebahn-nord-w.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-16---17--november-2024---rund-um-den-flugh.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-26---29--september--2024---landebahn-nordw.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29---01--september-2024---suedbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29--februar---02--maerz-2024---landebahn-n.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-13--august.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-3--august.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data"
          ]
        }
      },
      {
        "name": "tag-list",
        "instances": [
          "#main-content frach-m-hero .frach-m-page-meta-data__tags:has(frach-e-tag)"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/beginn-probebetrieb-verlegung-der-flugroute-amtix--kurz--im-nove.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/inbetriebnahme-der-neuen-abflugroute-cindy-sulus--ehemals-amtix-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/sonder-vermessungsfluege-vom-05---09--september--2025---centerba.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-03---05--april--2025---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-06---08--maerz-2025---landebahn-nord-west.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---14--september-2025---landebahn-nord-w.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---23--august--2025---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-15--bis-16--november-2025---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-16---19--oktober--2025---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-18---21--september-2025---landebahn-nord-w.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--februar-2025---suedbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--maerz-2025---landebahn-nord-west.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-26--bis-30--mai-2025---rund-um-den-flughaf.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-28---31--august-2025---suedbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/geophysikalische-messfluege-zur-geothermie-erkundung-im-oberrhei.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-am-29--und-30--juni-2026---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-03---06--september-2026---suedbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-12--bis-15--maerz-2026---landebahn-nord-we.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-13--bis-15--februar---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-17---20--september-2026---landebahn-nord-w.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-19--bis-22--maerz-2026---landebahn-nord-we.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-20---23--august--2026---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-22--bis-27--juni-2025---centerbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-24---27--september-2026---landebahn-nord-w.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-26---28--februar-2026---suedbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/zweiwoechige-sperrung-der-centerbahn-im-maerz.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ]
        }
      },
      {
        "name": "hero",
        "instances": [
          "#main-content frach-m-hero > .frach-grid:has(.frach-m-hero__media)"
        ]
      },
      {
        "name": "image-gallery-tiles",
        "instances": [
          "#main-content frach-m-image-gallery-tiles"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
            "#gallery-cd706d6f40 > div > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html": [
            "#gallery-3ae4d1c5a0 > div > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ]
        }
      },
      {
        "name": "columns-sidebar",
        "instances": [
          "#main-content .frach-grid-row:has(> .frach-grid-col-mq3-8 + .frach-grid-col-mq3-4)"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ]
        }
      },
      {
        "name": "cta",
        "instances": [
          "#main-content .frach-m-cta"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ]
        }
      },
      {
        "name": "section-title",
        "instances": [
          "#main-content .frach-m-section-title"
        ]
      }
    ],
    "sections": [
      {
        "id": "breadcrumb",
        "name": "Breadcrumb",
        "selector": [
          "frach-m-breadcrumb-navigation"
        ],
        "style": null,
        "blocks": [
          "breadcrumb"
        ],
        "defaultContent": []
      },
      {
        "id": "page-header-bar",
        "name": "Sticky page header bar",
        "selector": [
          "frach-m-sticky-page-header-container"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": []
      },
      {
        "id": "stage",
        "name": "Stage",
        "selector": [
          "#main-content > div.root.responsivegrid > div.aem-Grid > section.frach-h-component-margin"
        ],
        "style": null,
        "blocks": [
          "hero",
          "article-footer",
          "tag-list"
        ],
        "defaultContent": [
          ".frach-m-page-meta-data__date"
        ]
      },
      {
        "id": "sticky-patch",
        "name": "Sticky patch",
        "selector": [
          "#main-content > div.root.responsivegrid > div.aem-Grid > div.stickyPatch"
        ],
        "style": null,
        "blocks": [
          "sticky-patch"
        ],
        "defaultContent": [
          "a"
        ]
      },
      {
        "id": "main",
        "name": "Main content",
        "selector": [
          "#main-content > div.root.responsivegrid > div.aem-Grid > div.responsivegrid"
        ],
        "style": null,
        "blocks": [
          "columns-sidebar",
          "cta",
          "image-gallery-tiles",
          "anchor-list",
          "section-title"
        ],
        "defaultContent": [
          "frach-m-text-media",
          ".frach-m-text",
          "frach-m-image",
          "frach-m-embed"
        ]
      },
      {
        "id": "chat-widget",
        "name": "Chat widget",
        "selector": [
          "#moin-ai-container"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": []
      },
      {
        "id": "page-end",
        "name": "Trailing section after main",
        "selector": [
          "#main-content > div.root.responsivegrid > div.aem-Grid > div.responsivegrid ~ section.frach-h-component-margin"
        ],
        "style": null,
        "blocks": [],
        "defaultContent": []
      }
    ],
    "pageCleanup": {
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/Vermessungsfluege-nachts.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bdb0f75835-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6510fcd361-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/aktuelle-informationen-zum-nachtflugverbot1.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7c24dc7102-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/beginn-probebetrieb-verlegung-der-flugroute-amtix--kurz--im-nove.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a728164526-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/erneute-sperrung-der-landebahn-nordwest-ab-dem-14--dezember.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a59141c124-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/relaunch-der-fraport-homepage.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-abf562a88b-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-landebahn-nordwest.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b2575e1414-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/sperrung-der-suedbahn-im-april.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-063255736e-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/startbahn-18-ab-15--oktober-wieder-in-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ea4bf06283-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/suedbahn-ab-30--april-wieder-in-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-57f94ffbed-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verkehrsbeeintraechtigungen-durch-erneute-drohnensichtungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5cff495ea5-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-nachts-vom-29--Oktober-bis-01--November-20201.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-25c022abfb-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-centerbahn-vom-11--bis-14--mai-2020.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-952bdfbcea-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-nachts-vom-17--bis-20--september-2020.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b3c9062866-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-nordwest-landebahn-vom-18--bis-21--august-2020.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f9985a569d-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-nachts-vom-22--bis-25--Oktober-2020.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cd20e140d0-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-suedbahn-vom-04--bis-07--mai-2020.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9e35fad4c2-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-02--bis-05--januar-2020.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9c889922ed-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-19--bis-22--maerz-2020.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-959d35b266-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/vermessungsfluege-vom-20--bis-23--februar-2020.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aa43654498-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/verspaetungen-aufgrund-einer-drohnensichtung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a21c29ac0b-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2020/wiedereroeffnung-der-landebahn-nord-west.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-27936a158d-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/abfluege--amtix--kurz---ab-22-04-2021.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-56a6371aa5-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ausflottung-der-lufthansa-md-11---mcdonnell-douglas--im-oktober-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-31463e752c-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/aussetzung-des-probebetriebs-zur-optimierung-amtix--kurz--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8cc86b1d6b-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/centerbahn-voraussichtlich-bis-03--oktober-ausser-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b0e126acc4-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/ganztaegige-anwendung-des-segmented-approach.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a167896d40-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/landebahn-nordwest-und-terminal-2-ab-1--juni-wieder-in-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-95a6c9fb51-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neue-projektphase-zum-thema-ultrafeinstaub-im-bereich-des-flugha.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0f24ca43be-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/neuentwicklung-der-fra-map-2-0.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-28747f2537-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/probebetrieb-zur-optimierten-nutzung-des-start--und-landebahnens.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2717625c53-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/verkehrsbeeintraechtigungen-durch-drohnensichtung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5ec1088ead-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-nordwest-landebahn-vom-15--bis-19--maerz-2021.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fac923dae4-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom--27--bis-voraussichtlich-28--august-2021--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fad56e8110-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-03--und-04--dezember-2021---landebahn-nord.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-97bd738dbb-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-06--bis-09--mai-2021---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c11c59d758-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-07--bis-10--oktober-2021---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a65ca1c4c7-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-15--bis-18--april-2021.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b40812cb83-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-19--22-08-2021---landebahn-nordwest.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4521181ffc-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-23--bis-26--september-2021---landebahn-nor.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3e7640334a-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-26--bis-27--november-2021---landebahn-nord.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a411b3ab52-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2021/vermessungsfluege-vom-30--september-bis-03--oktober-2021---suedb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0c8766ecbc-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-erneut-ausser-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e243c30fde-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/landebahn-nordwest-voraussichtlich-bis-31--mai-ausser-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-22abb17e26-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/militaerische-grossuebung--air-defender-2023--im-deutschen-luftr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f807ddda25-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/nachtfluege-am-20--juni-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3f1ab235d6-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/naechtliche-centerbahnsperrung-vom-03--juli-2023.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0eea14a864-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/sperrung-der-landebahn-nordwest-am-04--06--oktober-2023.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-211f5d5b0f-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-10----14--juli-2023-am-frankf.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6988ba675e-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/umfangreiche-vermessungsfluege-vom-19----23--juni--2023-am-frank.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c11eb80e7e-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-02--bis-05--maerz-2023---suedbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e7e29d89d0-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-07--bis-10--september-2023---suedbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-79cf5e4757-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-09-12-maerz-und-vom.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5e922d856d-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-12--15--und-20--22--oktober-2023---alle-ba.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-86bc83c8cd-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-21----24--september-2023---landebahn-nord-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aaf48f8728-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/vermessungsfluege-vom-27--30--april-2023---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-accc3fdaaa-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-15--juli.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-397802a686-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/verspaetungen-am-16--august-2023.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f891f7ae1c-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023/witterung-beeinflusst-die-regionale-fluglaermbelastung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0d1b741a89-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1d44dd8d8a-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/kurzfristige-sperrung-der-landebahn-nordwest.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-baa0af6327-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/naechtliche-centerbahnsperrung-ab-15--juli-20240.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6b3683dbd4-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-08--bis-09--juli-2024-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-10e8adb262-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/sonderflug-vermessung-vom-11--bis-12--mai-2024---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-62435765ff-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-04---06--oktober--2024---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-608cd62fb9-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-08--bis-10--maerz-2024---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-413a928c6f-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-11---14--april-2024---landebahn-nord-west.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-948170df73-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-12---15--september-2024---landebahn-nord-w.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7a89385a7c-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-16---17--november-2024---rund-um-den-flugh.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1340ff173c-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-26---29--september--2024---landebahn-nordw.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-de7da0ca9a-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29---01--september-2024---suedbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c33b4ffb90-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/vermessungsfluege-vom-29--februar---02--maerz-2024---landebahn-n.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e21e5e956e-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-13--august.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7dddabc3dc-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2024/verspaetungen-am-3--august.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4f58fcca33-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/inbetriebnahme-der-neuen-abflugroute-cindy-sulus--ehemals-amtix-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2a6726822e-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/neue-interaktive-karte-fra-nom-in-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cfd9d341de-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/sonder-vermessungsfluege-vom-05---09--september--2025---centerba.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6f21064b64-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-03---05--april--2025---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ef5befdc74-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-06---08--maerz-2025---landebahn-nord-west.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aed6dec395-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---14--september-2025---landebahn-nord-w.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-20dee59a52-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-11---23--august--2025---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-81314e4d8c-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-15--bis-16--november-2025---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-39706945bf-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-16---19--oktober--2025---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3ebfb59f85-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-18---21--september-2025---landebahn-nord-w.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-456f0124cb-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--februar-2025---suedbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-818e59351f-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-20---22--maerz-2025---landebahn-nord-west.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-45aed3e3b9-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-26--bis-30--mai-2025---rund-um-den-flughaf.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4adbe3f0a4-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2025/vermessungsfluege-vom-28---31--august-2025---suedbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-691862a5aa-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/geophysikalische-messfluege-zur-geothermie-erkundung-im-oberrhei.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-951ef5af50-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-am-29--und-30--juni-2026---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5ca3da241c-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-03---06--september-2026---suedbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c0defa75bb-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-12--bis-15--maerz-2026---landebahn-nord-we.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ec9d9f081a-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-13--bis-15--februar---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cd0d7037dc-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-17---20--september-2026---landebahn-nord-w.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-27c2305f41-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-19--bis-22--maerz-2026---landebahn-nord-we.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-057b97a650-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-20---23--august--2026---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d323eaa0cd-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-22--bis-27--juni-2025---centerbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-97afd7961c-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-24---27--september-2026---landebahn-nord-w.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-27a89e5a3a-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/vermessungsfluege-vom-26---28--februar-2026---suedbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d209eb6c3d-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2026/zweiwoechige-sperrung-der-centerbahn-im-maerz.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-84be74f736-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-2019--ueber-70-5-millionen-passagiere-am-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b7e5ec24f6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-februar-2020--passagierentwicklung-in-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9a847b77cb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-verkehrszahlen-im-januar-2020--ruecklaeufige-passagieren.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7d4265262d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-april-2020--massiver-passagierrueckgan.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8417a04111-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-maerz-2020--passagieraufkommen-in-fran.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-99e22fcce4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-verkehrszahlen-im-mai-2020--passagieraufkommen-weiter-au.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3ecd447294-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/baubeginn-fuer-neuen-lkw-parkplatz-in-der-cargocity-sued.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-58388fe270-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/frankfurt-airport-bleibt-gefragt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-135fbb1930-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2020--co.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-98942afb41-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-august-2020--passagieraufkommen-weiter1.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3e04cfb81e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juli-2020--weiterhin-geringes-passagie.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7e00b9931d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-verkehrszahlen-im-juni-2020--passagieraufkommen-weiter-a.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-80b0eab1ae-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/herbstferien-start-am-flughafen-frankfurt--alles-wichtige-fuer-d.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7b82d1cef3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/pharma-hub-flughafen-frankfurt-europaweit-fuehrend-beim-umschlag.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-790641eb46-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/rohr-folgt-auf-lohde.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-eb3a76be83-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-ag-entwickelt-innovative-datenausta.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2e34209053-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--fraport-erweitert-thermotransporter-flotte.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fa0e50d72c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/flughafen-frankfurt--voruebergehende-ausserbetriebnahme-der-land.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-61614c3849-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-ag-platziert-erfolgreich-schuldschein.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dc0702dae3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2020.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-47c326b467-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-startet-marktabfrage-fuer-sport---multifunktionshalle-am.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4d8253cd54-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-november-2020--passagieraufkommen-in-f.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dbb61e9081-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-oktober-2020--passagieraufkommen-in-fr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f5693e5a4e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/fraport-verkehrszahlen-im-september-2020--passagieraufkommen-in-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c0c3b3cdee-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/kontaktlos-reisen-mit-gesichtserkennung--lufthansa-group-ist-ers.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cb10206224-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q4-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-w.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bb571b27ce-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/drohnensichtung-am-flughafen-frankfurt--fraport-setzt-belohnung-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c41b0266aa-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-erneut-mit-ceiv-pharma-zertifikat-ausgezeichnet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-64a7c82f93-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-ag-platziert-erfolgreich-unternehmensanleihe.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-069a7f5a2d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-geschaeftsjahr-2020--umsatz-und-ergebnis-trotz-umfassend.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-01d129f1b2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-property-management-erhaelt-zuschlaege.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-031636cc06-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-tav-antalya--konzession-fuer-flughafen-antalya-um-zwei-j.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6c24fd711c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-2020--passagieraufkommen-infolge-der-covi.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d9fe8eb57a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-februar-2021--passagieraufkommen-in-fr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-177ae9c683-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/fraport-verkehrszahlen-im-januar-2021--passagieraufkommen-in-fra.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d8db64e608-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q1-2021/neue-feuerwache-1-am-flughafen-frankfurt-in-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b2b0f6cc59-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/auf-der-ueberholspur-zum-essen--fraport-testet-mit-startup-yoord.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8c32ec0c2c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--check-in-fuer-lufthansa-express-rail-fluggae.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-71a3312351-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--landebahn-nordwest-ab-1--juni-wieder-in-bet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b88b149ff0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/flughafen-frankfurt--terminal-2-oeffnet-ab-1--juni-wieder-fuer-p.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0b0961c40a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5aca1a51ae-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2ba52a4063-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2021.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-16ea020b47-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-setzt-auf-windenergie.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a77c61e121-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-startet-automatische-kennzeichenerkennung-in-der-cargoci.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bdae114e8a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-april-2021--passagieraufkommen-in-fran.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7e6543beaf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-maerz-2021--passagieraufkommen-in-fran.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8df25e3f42-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-verkehrszahlen-im-mai-2021--beginnende-erholung-beim-pas.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-53c93ba0ab-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/fraport-weiht-neues-passagierterminal-am-flughafen-ljubljana-ein.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8095b6ddf1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/neue-partnerschaftliche-aufgabenverteilung-bei-luftsicherheitsko.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-56ddc878ba-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung--groundcollision21--am-flughafen-frankfurt-erfolgr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9b85e8e077-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/notfalluebung-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bd35a036ac-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6d92244b0c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-a.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e8e7df45be-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q2-2021/travel-innovation-award-fuer-digitale-transformation-im-fraport-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f62307bcbb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/frankfurt-airport--centerbahn-zwei-wochen-ausser--betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-52a2b64523-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-ausgleich-fuer-entstandene-vorhaltekosten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-42cf5e5050-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-erhaelt-foerderbescheid-fuer-forschungsprojekt--digitale.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d27066c541-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juli-2021--positiver-trend-haelt-an.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7ab62c69ef-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/herbstferien-2021--bereit-fuer-den-abflug.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-41225bb63a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/karrierestart-am-flughafen--75-junge-menschen-beginnen-ihre-ausb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d234cdaffd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/parken-auf-hoechstem-niveau.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5f1c64b199-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/spendenaktion-laeuft-weiter--flaschenpfand-geht-an-vier-neue-org.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-99c41a7c77-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/wirklich-an-alles-gedacht---flugreise-im-sommer-am-besten-mit-ch.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9ee7b3ffee-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/digitaler-vorreiter-flughafen-frankfurt--import-plattform-fra-os.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2c193c486e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/flughafen-frankfurt-am-main--bundespolizei-beleiht-fraport-mit-d.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bacd7ec1bd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-ag-platziert-erfolgreich-schuldschein.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a370fc7794-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2021.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e43f75028f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-enbw-schliessen-langfristigen-stromabnahmevertrag-fue.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d6e3721404-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-und-tav-erhalten-zuschlag-fuer-neue-betriebskonzession-a.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5b94eb4abf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-november-2021--positive-passagierentwi.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-795d022e73-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-oktober-2021--aufwaertstrend-beim-pass.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9751089a91-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/fraport-verkehrszahlen-im-september-2021--positive-passagierentw.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-450ad3cae4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/im-zeichen-des-friedens-und-des-miteinanders--20-jahre-abrahamis.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0da741a9e0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/sicherung-von-qualitaetsstandards-und-wettbewerbsfaehigkeit.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2f7e8d7493-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/von-frankfurt-in-die-welt--im-winter-ab-fra-zu-244-zielen-in-92-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0d8f6ddd9a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q4-2021/zu-weihnachten-verreisen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-431bfe8a3f-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/50-jahre-terminal-1-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2df4c3394e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/dakosy-vereinfachtes-anmeldesystem.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e948956aa4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/erneuter-streik-der-sicherheitsdienstleister-am-22--maerz-2022.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b49fec2e74-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/flughafen-frankfurt--sicherheitsdienstleister-streiken.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8ea5ba38cb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/frankfurt-airport-bereitet-sich-auf-osterreisewelle-vor.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6d77c60f65-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-ag-spendet-leichtbauhalle-an-kelsterbach.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-611f4cf11b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-aufsichtsrat-bleibt-beschlussfaehig.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bab636e21b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-geschaeftsjahr-2021.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aed4e710ef-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-laesst-geschaeftsaktivitaeten-in-st--petersburg-ruhen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4786d94810-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-und-tav-leisten-vorauszahlung-fuer-neue-betriebskonzessi.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6a31c31558-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/fraport-verkauft-anteil-am-flughafen-in-xi-an.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fa38d2c55b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/lufthansa-und-fraport-recyceln-pet-flaschen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-16e00eff8e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/partnerschaft-miles---more.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a1026e516b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/sommerflugplan-2022--neue-destinationen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-86d407e21d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-01-2022.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e6120fa016-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-02-2022.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-474f7dd99f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/verkehrszahlen-2021.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-27152e9d35-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q1/wechsel-im-fraport-vorstand.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4c5c91c1a0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-beteiligung-in-russland.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5a024bcd62-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-facility-services-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-71393574da-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8f3deb6512-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-hauptversammlung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b10e372a8a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-konzern-steigert-operative-kennzahlen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a58f17757f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-april-2022.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-74538c675e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-maerz-2022--aufwaertstrend-beim-passag.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3829d6da3a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/fraport-verkehrszahlen-im-mai-2022.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e2c039b5d0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/lufthansa--fraport-und-der-flughafen-muenchen-fordern-wirksame-u.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1040ee2bbb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/luftsicherheitskontrollen-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e2e4bdf328-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/neue-frachthalle-in-der-cargocity-sued.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4c608583ae-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/pop-up-am-flughafen-frankfurt---neues-shop-konzept-fuer-mehr-fle.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f10d8175c9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ee08a641c7-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/ausbildungsstart-am-flughafen--81-junge-menschen-beginnen-ihre-k.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-99bcb3d2b8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/da-steckt-zukunft-drin--airport-ausbildungsmesse-zeigt--ausbildu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-68dd3b6a53-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/exploration-zum-sozialmonitoring-flughafen-frankfurt-und-region.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b20d9e4308-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/flughafen-frankfurt--stabiler-und-geordneter-betrieb-am-ersten-f.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-715930a2a9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/fraport-und-ntt-bauen-europas-groesstes-privates-5g-netz-am-flug.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-09e791206a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/intermodaler-hub-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bbd2c93439-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/meilen-sammeln-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-295c47340b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/neuer-lkw-parkplatz-in-der-cargocity-sued-eroeffnet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0eaeb6af3b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/notwendige-instandhaltung--centerbahn-am-flughafen-frankfurt-fue.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7929797832-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q3/sommerferien-start-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a6b545485f-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/ausbau-des-flughafens-lima.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4d84653a62-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/den-koffer-richtig-gepackt---herbstferien-start-am-flughafen-fra.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "div.vjs-playback-rate.vjs-menu-button",
        "div.vjs-chapters-button.vjs-menu-button",
        "div.vjs-descriptions-button.vjs-menu-button",
        "div.vjs-subs-caps-button.vjs-menu-button",
        "div.vjs-audio-button.vjs-menu-button",
        "div.vjs-error-display.vjs-modal-dialog",
        "div.vjs-modal-dialog.vjs-hidden",
        "#metaNavigation-f7f126252f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/fraport-ag-ist-wieder--fahrradfreundlicher-arbeitgeber-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b317043b01-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/hessen-und-fraport-bringen-e-mobilitaet-voran.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bf820b3bf0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/in-den-naechsten-tagen-angespannter-betrieb-am-flughafen-frankfu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6856a434b0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/joint-venture--fraalliance-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4f41549005-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/photovoltaikanteil-waechst-weiter.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aa33eaaff8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/steuerung-der-luftsicherheitskontrollen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-28c4ac56b5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/terminal-3-ausbau--erster-zug-der-neuen-sky-line-bahn-vorgestell.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-08c8b94e34-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsferien-beginnen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-86265504fe-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/weihnachtsspende-in-hoehe-von-58-000-euro.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-620744eb49-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2022/q4/winterflugplan-2022-23--ab-fra-zu-246-zielen-in-96-laendern.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c2e5c0e5ae-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/ausbildung-und-studium-am-airport---technight--bietet-spannende-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1fc2c26245-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/erholung-setzt-sich-fort--starkes-verkehrsaufkommen-praegt-frapo.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f28250079d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt--fraport-uebernimmt-steuerung-der-luftsicher.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-23672b6236-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/flughafen-frankfurt-startet-in-die-osterferien.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-10247379c7-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-ag-spendet-gemeinsam-mit-partner-1-million-euro-fuer-erd.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f8f9724124-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/fraport-unterzeichnet-reserveabkommen-mit-bundeswehr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-39ace4ddf1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/innovation-im-ground-handling--fraport-testet-autonomen-gepaeck-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b682582243-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/schneller-weg-vom-co2.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d7e4d1a4e8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q1/sommerflugplan-2023--neue-destinationen-und-erhoehtes-sitzplatza.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3c2a460d34-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/check-in-im-wandel-am-flughafen-frankfurt--eroeffnung-neuer-bagg.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-03ada678f8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/flaschenpfand-geht-an-vier-neue-organisationen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-28bc3e0461-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5a82e5bbfb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8697586c8e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/fraport-kauft-verstaerkt-windstrom-ein.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b1ff1a1ae4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/landebahn-nordwest-am-flughafen-frankfurt-puenktlich-zurueck-in-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3ae1fd1ee6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/meilenstein-erreicht--zweite-start--und-landebahn-in-lima-eroeff.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9ac02a9960-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/notwendige-instandhaltung--landebahn-nordwest-am-flughafen-frank.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6fd055db70-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e67b4c1bc3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q2/terminal-3--erweiterte-anschlussstelle-zeppelinheim-auf-der-auto.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a65e73eab1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/-fraport-kann-vertraege-nicht-kuendigen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0537a8f387-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-gibt-skyliners-investitionsschub.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3302b58a1a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-setzt-weiter-auf-vorstandsvorsitzenden--dr--stefan-schul.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b55ada6608-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-spendet-weitere-100-000-euro-fuer-humanitaere-zwecke-in-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ba3a7ff569-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/fraport-startet-breite-umfrage-zur-nachhaltigkeit.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-41739dc6ef-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/luxus-im-wohlfuehlambiente--bewaehrtes-konzept-mit-neuer-flaeche.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-63cdf380c7-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/rohde---schwarz-und-fraport-evaluieren-weltweit-ersten-walk-thro.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d399c8df88-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/schnelle-power-fuer-externe-e-fahrzeuge.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1bbf6a5e64-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/terminal-3--vermarktung-fuer-lounges-gestartet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f6cf4158ec-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/urlaubsstart-am-flughafen-frankfurt--ueber-200-000-passagiere-tae.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ad59dd6ae6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q3/zukunftsperspektive-flughafen--108-junge-menschen-starten-ihre-a.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-388456d3e4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in-der-region.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4c4c2f4ca2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/e-projekt-am-airport-nutzt-ladeinfrastruktur--als-bidirektionale.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-45179d3ec4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/frankfurt-airport--im-winter-ab-fra-zu-242-zielen-weltweit.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-48460f735f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/fraport-usa-gewinnt-konzessionen-fuer-das-centermanagement-an-de.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cb505f75e1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/mit-gesichtserkennung-vom-check-in-bis-zum-boarding--sita-und-fr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1115becad0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/q4/sicher--schnell-und-komfortabel--weitere-sicherheitskontrollen-a.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-189c803643-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-erzielt-im-ersten-quartal-deutliche-ergebnis-ver.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7e489b38b4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2023.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-829d8b74bd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-april-2023.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-00a64c807e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-august-2023--passagier--und-frachtaufk.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-24a01a1ebb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-februar-2023--verkehrswachstum-bleibt-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b455bc9fb5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-januar-2023--deutliches-wachstum-zum-j.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4a27aaac65-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juli-2023--erstmals-wieder-ueber-6-mil.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6c1c481bbd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-juni-2023--erstmals-wieder-mehr-als-200000.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2ac98515c5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2023--aufkommen-steigt-weiter-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9ced63858d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-mai-2023--passagierwachstum-bleibt-sta.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-325e115f65-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-november-2023--passagierzahlen-und-flu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-81584130be-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2023--passagierzahlen-und-flug.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8a5adba4c1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/fraport-verkehrszahlen-im-september-2023--aufkommen-weiter-im-au.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aebca9d5a9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2023/verkehrszahlen/konzernweites-passagierwachstum-staerkt-geschaeftszahlen-im-erst.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b48f239dcd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/100-jahre-wie-im-flug.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bba31a54da-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/25-jahre-zertifiziertes-umweltmanagement-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-de02b90a7b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/allivate---dakosy-und-fraport-gruenden-joint-venture-fuer-die-di.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c4b6a6e7bf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/arbeiten-am-airport---technight--und--bewerbertag-servicetechnik.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9d01826da2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--infofon-fuer-anfragen-zu-fluglaerm-geht-zum.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-94babe34cd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt--starke-beeintraechtigungen-im-flugbetrieb-f.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-07c62788d7-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/flughafen-frankfurt-modernisiert-bodenstromversorgung-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2b47644115-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/geschaeftsjahr-2023-im-fraport-konzern--verkehrswachstum-bringt-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d09fa5d512-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/kunst-im-terminal-3--fraport-beauftragt-julius-von-bismarck-mit-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dd51ea1c49-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/photovoltaik-ausbau-am-flughafen-frankfurt-geht-weiter.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b39e2248d8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/spatenstich-fuer-neue-dhl-luftfrachthalle-in-der-cargocity-sued-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d48082683d-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/streik-des-sicherheitspersonals-am-flughafen-frankfurt--passagie.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9075042e4b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/von-frankfurt-in-die-welt--im-sommer-ab-fra-zu-283-destinationen0.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-be19305610-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/das-ticket-zur-fraport-karriere--neues-rekrutierungsbuero-im-ter.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-79ce0fcad1-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/erste-airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegsm.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dfb80e1894-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/flughafen-ljubljana-setzt-auf-softwareloesung-von-assaia-zur-opt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3c081cfbbb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/masterplan-cargohub--fraport-plant-umfassendes-investitionspaket.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e15f861087-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/seit-25-jahren-aktiv--fraport-stiftung-proregion-foerdert-ausbil.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cc715ff1ef-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/alle-wege-fuehren-nach-sueden---oeffentliche-strasse--am-luftbrue.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-89b62d3b6b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/endlich-ferien-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-14ef611cce-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/fraport-veraeussert-anteile-am-flughafen-delhi-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3b258736fd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/nachwuchskraefte-fuer-den-flughafen--118-auszubildende-und-dual-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5f1aad00eb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/neues-dashboard-am-flughafen-frankfurt-liefert-umfassende-cargo-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aefa024766-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/passagierhinweis--ab-september-mitnahme-von-fluessigkeiten-im-ha.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b716a45d57-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/rollbruecke-ost-am-flughafen-frankfurt-geht-wieder-in-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-be9092305b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q3/sicher-und-schneller-ans-gate--weitere-kontrollstellen-mit-ct-sc.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e630b54fc8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/berufliche-zukunft-am-flughafen---technight--bietet-spannende-ei.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-29be6e3758-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-beendet-engagement-am-flughafen-pulkovo.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2d95d7762a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-gewinnt-betriebskonzession-am-flughafen-kalamata.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cc02a7c261-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-schliesst-vierjaehriges-entgeltabkommen-mit--fluggesells.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a68b3f6853-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-stattet-sicherheitsspuren-am-flughafen-frankfurt-mit-mod.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-067aec28bc-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/fraport-testet-nachhaltigen-asphalt-auf-cashew-basis.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2cfa5b462e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/reisetipps-zum-herbstferien-start-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3f80ac695b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/spenden-statt-schenken--zu-weihnachten--wieder-70-000-euro-fuer-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-841054dc06-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/vermarktung-von-erweiterungsflaechen-in-der--cargocity-sued-am-f.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f0d98cce8e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q4/von-fra-aus-zu-243-zielen-in-93-laendern.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-85ef7c1b98-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-konzern-legt-im-ersten-quartal-2024-weiter-zu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2507468646-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-2023--aufwaertstrend-bei-passagierzahlen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-90d28c6844-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-april-2024--passagier--und-frachtaufko.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d228d7f32c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-august-2024--aufkommen-von-passagieren.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d1a0469e5e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-februar-2024--passagierwachstum-trotz-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-83f9cdab37-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-januar-2024--weiteres-passagierwachstu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1660d609b6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juli-2024--fracht-waechst-deutlich---p.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-130b37afd0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-juni-2024--flughafen-frankfurt-mit-sie.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cc42c980a1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2024--streiks-bremsen-passagierw.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-91d47b8741-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-mai-2024--anstieg-bei-passagier--und-f.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fa4bd5eb31-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-november-2024---geringes-wachstum-in-f.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-615eaa1886-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2024---stabiles-fluggastaufkom.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2e96b73c71-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/fraport-verkehrszahlen-im-september-2024--aufkommen-bleibt-im-au.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-065448632f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/geschaeftszahlen-im-ersten-halbjahr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aed191fe75-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/verkehrszahlen/neunmonatsbilanz--auslandsgeschaeft-stuetzt-ergebniswachstum-im-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ea66f9bab4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/frankfurt-setzt-als-weltweit-erster-flughafen-walk-through-scann.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c10e18ba74-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/fraport-usa-gewinnt-neuausschreibung-am-flughafen-baltimore-wash.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-174c2b3962-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/geschaeftsjahr-2024--ergebnis-trotz-unguenstigem-marktumfeld-ges.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-be40a00f32-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/loeschgiganten-fuer-die-sicherheit-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d10903d44a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/neue-schallschutzwand-entlang-des-airport-rings-am-flughafen-fra.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e94e5ccf47-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/terminal-3--gastronomie-partner-stehen-fest-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f9c7fc6903-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q1/von-fra-aus-zu-275-zielen-in-91-laendern.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d4ae20088f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-antalya--beliebtester-ferienflughafen-des-mittelmeers-er.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8671bd1781-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/airport-ausbildungs--und-jobmesse--vielfaeltige-einstiegschancen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ac86067376-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/antalya-airport--langfristige-refinanzierung-in-hoehe-von-2-5-mi.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a4e4e2bd4f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/arbeiten-am-flughafen-frankfurt--fraport-konzern-sucht-nachwuchs.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c74cd79c9e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/cargo-roadshow-bringt-frachtexpertise-nach-indien.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-381d46d24e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/dfs-und-fraport-stellen-weiterentwickeltes-betriebskonzept-fuer-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-97ef172b22-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/einkaufserlebnis-in-terminal-3-definiert--the-art-of-retail-in-t.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-50e2b3599a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ferienstart-am-flughafen-frankfurt--der-fraport-leitfaden-fuer-e.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d1778c9b03-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--breite-zustimmung-zu-allen-tagesordnun.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-75f8eb314f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2773069832-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/ladeinfrastruktur-fuer-e-fahrzeuge-waechst-weiter.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e4ad81e928-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q2/neues-drehkreuz-fuer-suedamerika--fraport-beteiligung-eroeffnet-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aa7c3fecd7-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ecotow--fraport-erhaelt-hessische-foerdermittel--fuer-e-flugzeug.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-87d57d386e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--europas-fuehrender-pharmahub-fuer-den-globa.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fa6701e7ca-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/flughafen-frankfurt--neue-halle-fuer-dhl-am-zentralen-luftfracht.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ff340f13b8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-baut-neue-rad--und-gehwegbruecke-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5793d0dd1e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/fraport-testet-das-terminal-3--rund-8-000-personen-fuer-probebet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-417fcc63c4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/ki-gestuetzte-bodenprozesse--lufthansa--fraport-und-zerog-treibe.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-03d643db80-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q3/vielfaeltige-moeglichkeiten-fuer-nachwuchskraefte--99-auszubilde.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-63463d8b1e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/70-000-euro-fuer-gemeinnuetzige-projekte-in--und-aus-der-region.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f84cd1e2fe-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/feierliche-eroeffnung-des-terminal-3-am-22--april-2026-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fa26649530-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/frankfurt-airport-und-shanghai-pudong-international-airport-schl.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f9a1118dfd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-brasil-s-a--aeroporto-de-fortaleza-erhaelt-zuschlag-fuer.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3fc918d40b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-nimmt-dividendenzahlungen-wieder-auf.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d1d4e34d39-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/fraport-und-mb-park-setzen-mit-neuer-projektentwicklung-erfolgre.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a9a1c6bad6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/kunst-am-bau--fraport-praesentiert-einzigartige-kunstinstallatio.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ae616c580a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/sonnenstrom-fuer-fraport--37-000-vertikale-module-gehen-in-betri.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5ce9a5d7cf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/technight.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c62bd1afa8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/q4/winterflugplan-2025-2026--mit-81-airlines-zu-244-zielen-in-96-lae.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-275180a056-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-im-ersten-quartal-2025-mit-leicht-geringerem-erg.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0ff45a6f61-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-konzern-steigert-operatives-ergebnis--im-zweiten-quartal.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0b8d4927f3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen--flughafen-frankfurt-kehrt-im-zweiten-qua.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-10df69f7dd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-2024--frankfurt-bleibt-fuehrend-bei-der-h.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c70938697f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-april-2025---mehr-fluggaeste-in-frankf.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e6a1d2d327-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-august-2025--passagier--und-cargoaufko.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7b68960802-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-februar-2025---aufkommen-in-frankfurt-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-09362db08a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-januar-2025--rueckgang-in-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a357bd8b5f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-juli-2025--beteiligungsairports-wachse.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-61a2822fa8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2025--aufkommen-in-frankfurt-kau.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1c428dc12a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-mai-2025--flughafen-frankfurt-und-bete.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-61b390825f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-november-2025---deutliches-passagierwa.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f59828221c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2025--aufkommen-in-frankfurt-p.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c9bc25564e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/fraport-verkehrszahlen-im-september-2025--mehr-passagiere-an-den.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c615c3aa4f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2025/verkehrszahlen/neunmonatsbilanz--free-cash-flow-mit-neuem--bestwert-im-dritten-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-41238d8b31-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/geschaeftsjahr-2025--positiver-free-cash-flow.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c4298fd4a5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/bpk/neunmonatsbilanz-starkes-auslandsgeschaeft.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-515ac46843-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/2027-condor-zieht-ins-t3.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9df77f4578-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/alexander-lorz-fraport-aufsichtsrat.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-797b2a6977-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/centerbahn-puenktlich-zurueck-in-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-db70a21f53-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dietmar-focke-vorstand-fraport-ag.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-60b44fdb6e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/dr--kristina-wagner-fraport-aufsichtsrat.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-30095efa40-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/eu-unterstuetzt-grenvolt--projekt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8d2a793064-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/flughafen-frankfurt-setzt-als-weltweit-erster-flughafen-auracast.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-700e51dc65-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/frankfurt-airport-und-bangalore-international-airport-vereinbare.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1b45f15c55-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/fraport-unterzeichnet-mietvertrag-mit-kuehne-nagel.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3e9735ac43-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/grosse-terminal-3-eroeffnungsfest.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0031c1f7b5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/ki-an-der-luftsicherheitskontrolle.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d7e55f0c33-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/osterferien-hessen--erhoehtes-passagieraufkommen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5cbb1d802b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sanierung-der-centerbahn-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4e159cc294-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/schnellladepark-fuer-speditionen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cd39c1601d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/sommerflugplan-2026.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4b17e0fa87-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q1/terminal-3-mit-grossem-festakt-eroeffnet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d43619ed59-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/dr--pierre-dominique-pruemm-scheidet-bei-fraport-aus.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cea3305336-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/erstlandung-am-terminal-3.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c1e74cd75e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/finanzminister-lorz-aufsichtsratsvorsitzender-der-fraport-ag.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a8934a76e1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fluglaermkommission-ueber-weiterentwickeltes-betriebskonzept.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c41f00b6fe-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-erhalten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e7dce0ce75-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-hauptversammlung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4fc2e850d2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/fraport-oeffnet-bewerbungsportal.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b93295e447-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/neue-sky-line--bahn-wieder-in-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-28b4d77c22-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sky-line--bahn-vorruebergehend-ausserbetrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cf2adadb52-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/sommerferien-in-hessen--spuerbarer-anstieg-der-passagierzahlen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d7c7fe4b36-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/terminal-2-operativ-ausser-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f59070f519-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q2/weiterentwickeltes-betriebskonzept-am-flughafen-frankfurt--laerm.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-962cabcc12-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/EcoTow--vollelektrische-flugzeugschlepper-fuer-grossflugzeuge.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9010b71e60-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/bau-des-multi--tenant--neubaus.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-35acb386bd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/fraport-brasil-s-a--aeroporto-de-fortaleza-uebernimmt-betrieb-de.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2ed10b3892-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q3/herbstferien-sorgen-fuer-mehr-betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-73c645df8a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/-fraport-erhaelt-weitere-foerdermittel-fuer--emissionsfreie-bode.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4f82e1f6cf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/gate-of-the-future-am-flughafen-frankfurt-eroeffnet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9815df11dc-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/q4/winterflugplan-2026-2027--231-ziele-ab-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-067081a3b5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport---verkehrszahlen-im-september-2026.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bfd136cf1b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-im-ersten-quartal-2026-mit-wachstum-im-operative.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-79203ef178-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-konzern-legt-operativ-im-ersten-halbjahr-zu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5ca1937aff-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-2025.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5c57f3b444-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-april-2026---sechs-streiktage-bringen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-149711d655-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-august-2026--fracht-waechst-in-frankfu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9840908f9e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-februar-2026---winterwetter-und-streik.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ae694ea743-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-januar-2026---die-meisten-konzern-airp.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-51afa27ef5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juli-2026--anstieg-bei-passagieren-und.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7bcd7c9e10-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-juni-2026.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-10c76a9f57-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-maerz-2026---wachstum-bei-passagieren-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-018c695c33-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/fraport-verkehrszahlen-im-oktober-2026--cargo-waechst---passagie.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7ccc9a84dd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2026/verkehrszahlen/mai-2026--frankfurt-wieder-auf-wachstumskurs-bei-passagieren.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cf933758d5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-786e333fcf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-august-2022---ferienzeit-belebt-flugau.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d9de521016-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juli-2022--aufkommen--steigt-weiter.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4e9b7e08bc-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q3/fraport-verkehrszahlen-im-juni-2022--passagierzahlen-steigen-wei.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f3d24f3423-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-konzern-zwischenbericht-9m.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-72f35773fb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-november-2022--hohes-aufkommen-mit-sta.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-557877d375-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/fraport-verkehrszahlen-im-september-2022--wachstum-weiter-deutli.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-408390c39e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-2022.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-323a921e01-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/verkehrszahlen/q4/verkehrszahlen-oktober-2022.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e13d1916d0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/retail-news/2026/diwali--kampagne-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-16bcc88af3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/retail-news/2026/frankfurt-airport-retail-im-fussballfieber.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e62c70c9d4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/retail-news/2026/retail-media-impact-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0aaaf66a92-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/retail-news/2026/wie-terminal-3-den-flughafenaufenthalt-neu-gestaltet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-50d60bce14-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/-cafe-de-luxe---airport-ausflug-mit-kaffee-und-kuchen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f7adcd524a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/alles-weiss-blau--frankfurt-airport-feiert-oktoberfest.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-426bacc1c2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/auskunft-auf-knopfdruck.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a6eb9e35f6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/dem-glauben-raum-geben--neuer-muslimischer-gebetsraum-im-termina.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dc36c81259-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/geschenktipp-airport--praesente--gutscheine-und-mehr-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8feb0ce4b9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/koschere-snacks-fuer-unterwegs--neuer-automat-in-halle-c-bietet-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-077a1c7469-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/neues-parkprodukt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e1548a99f0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/rundfahrt-mit-aussicht.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5d439f12f8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/sommer---sonne---flieger-gucken.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cd3fcc184f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/von-klassisch-ueber-vegan-bis-schaerfegrad-f.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f04b92f8c5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2019/wie-schnell-geht-mal-was-verloren--und-wird-rasch-wiedergefunden.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9f0d4738a8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2020/buchen--parken--starten--flughafen-frankfurt-bietet-attraktive-o.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-40e07d7226-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2020/comeback-fuer-beliebtes-ausflugsziel.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0eb43b90d1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2020/gute-reise--wir-sorgen-dafuer--gerade-jetzt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d620787579-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2020/raeume-fuer-visionen--kreativzentrum-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b4571e5dbc-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2020/schlafkabinen-bieten-ruhe-und-privatsphaere.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3508812d16-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2021/-sicher-reisen--ueber-den-flughafen-frankfurt--tuev-qualitaetssi.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a3ac5a3e96-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2021/eintauchen-in-den-mega-airport-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c532970c3d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2021/ferienausflug-an-den-mega-airport-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b68dd206fd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2021/oeffnung-besucherzentrum-und-airport-touren-ab-01-01-2022.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-324b7d7616-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2021/vor-dem-start-in-den-urlaub--shoppen-und-schlemmen-am-flughafen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f2ae27250a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2022/ab-2--april-keine-maskentragepflicht-mehr-in-den-terminals.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-776ea69bf8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2022/carsharing-jetzt-auch-mit-e-antrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-272ab6c1d5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2022/ein-ort-zum-innehalten---flughafen-frankfurt-eroeffnet-zweiten-r.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c4dcd1276d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2022/erlebnisraum--fraport-besucherzentrum--exklusiv-als-event-locati.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-85ac783f31-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2022/erst-buchen--dann-parken.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-731bfa010f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2022/fralounge.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bd50a3f406-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2022/fraport-besucherservice-wird-70--jubilaeums-tour-und-historische.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dc39ca7267-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2022/fruehlingserwachen-fuer-die-erlebniswelt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b670c06dce-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2022/neues-lounge-angebot-in-terminal-2---plaza-premium-group-eroeffn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f674dc40b3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2023/ab-in-den-sueden--ferienstart-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b84519c884-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2023/airport-rundfahrten-fuer-viele-vereine--und-institutionen-wieder.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7941d89120-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2023/osterferien-start.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7c40a9f597-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2023/schnellladen-am-airport--neuer-ladepark-fuer--e-fahrzeuge-in-der.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9a26377792-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2024/ein-erlebnis-fuer-die-ganze-familie--flughafen-frankfurt-veranst.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-446aea975f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2024/es-weihnachtet-sehr--reise--und-servicetipps-fuer-den-urlaubssta.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6289bb36d9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2024/kein-spiel-verpassen--fussballfieber-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-18f63ad01b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2024/olympische-highlights-am-flughafen-frankfurt--sportliche-aktione.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-742307ee05-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2024/party-sommer-am-flughafen-frankfurt--momem-und-fraport-laden-zu-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-046489d8db-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2024/reisetipp-fuer-den-sommerurlaub--fruehzeitig-parkplatz-am-airpor.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6821a24ae4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2024/vorverkauf-fuer-2--afterwork-party-am--flughafen-frankfurt-start.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7c665c8eaa-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2025/apron-control--spielend-rollverkehr-dirigieren-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-be15d20730-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2025/countdown-in-den-urlaub--tipps-fuer-den-perfekten-start-vom-flug.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3f627a17ca-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2025/gut-vorbereitet-in-die-herbstferien--reisetipps-fuer-den-abflug-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6280f6a6a5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2025/jetzt-gratis-anmelden--airport-touren-mit-besonderen-einblicken-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f17b310378-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2025/ladepark-nord--neue-e-infrastruktur-in-terminalnaehe.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7f104b0341-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2025/rewe-to-go--snacks-und-getraenke-rund-um-die-uhr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-715362f9a6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2025/spannende-aussichten--restaurants-wechseln--vorfeldblick-bleibt-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ffe33a1d7a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2025/strikte-massnahmen-gegen-drohnensichtungen-am-flughafen-frankfur.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-24f7f1017c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2025/winterliche-reisefreude-ohne-barrieren--entspannt-in-den-urlaub-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b92eec9969-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2026/frankfurt-airport-im-fussballfieber.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1b4dcf840b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2026/terminal-2---mobiliar-vom-flughafen-frankfurt-sucht-neue-heimat.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-70ae215c9e-notification-overlay"
      ]
    }
  };
  var parsers = {
    "breadcrumb": parse,
    "sticky-patch": parse2,
    "anchor-list": parse3,
    "article-footer": parse5,
    "tag-list": parse4,
    "hero": parse6,
    "image-gallery-tiles": parse8,
    "columns-sidebar": parse9,
    "cta": parse10,
    "section-title": parse11
  };
  var sectionTransformers = [transform2];
  var fragmentTransformers = [];
  var lateTransformers = [...sectionTransformers, ...fragmentTransformers];
  var correctionTransformers = [];
  var transformers = [transform, ...lateTransformers, ...correctionTransformers];
  var earlyTransformers = transformers.filter((fn) => !lateTransformers.includes(fn));
  var CATALOG = Boolean(PAGE_TEMPLATE.pageCleanup || PAGE_TEMPLATE.blocks.some((b) => b.pageInstances));
  function executeTransformers(hookName, element, payload, list = transformers) {
    var _a, _b;
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: ((_b = (_a = payload.params) == null ? void 0 : _a.targets) == null ? void 0 : _b.template) || PAGE_TEMPLATE });
    list.forEach((fn) => {
      try {
        fn(hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template, url) {
    const pageBlocks = [];
    const pageKey = (u) => {
      try {
        const { origin, pathname } = new URL(u);
        return `${origin}${pathname.replace(/\/$/, "")}`;
      } catch (e) {
        return u;
      }
    };
    const key = pageKey(url);
    const claim = (blockDef, selector) => {
      let matches = [];
      try {
        matches = document.querySelectorAll(selector);
      } catch (e) {
        return;
      }
      matches.forEach((element) => {
        if (pageBlocks.some((b) => b.element === element || b.element.contains(element) || element.contains(b.element))) return;
        pageBlocks.push({ name: blockDef.name, selector, element });
      });
    };
    template.blocks.forEach((blockDef) => {
      const entry = Object.entries(blockDef.pageInstances || {}).find(([u]) => pageKey(u) === key);
      (entry ? entry[1] : []).forEach((selector) => claim(blockDef, selector));
    });
    template.blocks.forEach((blockDef) => (blockDef.instances || []).forEach((selector) => claim(blockDef, selector)));
    return pageBlocks;
  }
  function markPageTargets(payload) {
    const { document, params } = payload;
    executeTransformers("beforeTransform", document.body, payload, earlyTransformers);
    const blocks = findBlocksOnPage(document, PAGE_TEMPLATE, params.originalURL).map(({ name, selector, element }, i) => {
      element.setAttribute("data-excat-block", String(i));
      return { name, selector };
    });
    const sections = (PAGE_TEMPLATE.sections || []).map((section, i) => {
      const target = (section.selector || []).map((s) => {
        try {
          return document.querySelector(s);
        } catch (e) {
          return null;
        }
      }).find(Boolean);
      if (!target) return section;
      target.setAttribute("data-excat-section", String(i));
      return __spreadProps(__spreadValues({}, section), { selector: [`[data-excat-section="${i}"]`] });
    });
    params.targets = { blocks, template: __spreadProps(__spreadValues({}, PAGE_TEMPLATE), { sections }) };
  }
  var import_article_default = {
    preprocess: (payload) => {
      if (CATALOG) markPageTargets(payload);
    },
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      params.fragments = [];
      if (!params.targets) markPageTargets(payload);
      const pageBlocks = params.targets.blocks.map((block, i) => __spreadProps(__spreadValues({}, block), { element: document.querySelector(`[data-excat-block="${i}"]`) })).filter((block) => block.element);
      executeTransformers("beforeTransform", main, __spreadProps(__spreadValues({}, payload), { pageBlocks }), lateTransformers);
      pageBlocks.forEach((block) => {
        if (!main.contains(block.element)) return;
        const parser = parsers[block.name];
        if (!parser) return;
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      });
      executeTransformers("afterTransform", main, payload);
      main.appendChild(document.createElement("hr"));
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      params.fragments.forEach(({ element }) => {
        executeTransformers("afterTransform", element, payload, earlyTransformers);
        WebImporter.rules.transformBackgroundImages(element, document);
        WebImporter.rules.adjustImageUrls(element, url, params.originalURL);
      });
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: { title: document.title, template: PAGE_TEMPLATE.name, blocks: pageBlocks.map((b) => b.name) }
      }, ...params.fragments];
    }
  };
  return __toCommonJS(import_article_exports);
})();
