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

  // tools/importer/import-press-release.js
  var import_press_release_exports = {};
  __export(import_press_release_exports, {
    default: () => import_press_release_default
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
      const heading = document.createElement(h.tagName.toLowerCase());
      if (a) {
        const l = link(document, a.getAttribute("href"), h.textContent);
        const inner = inlineNodes(document, h).filter((n) => n.nodeName !== "A");
        if (inner.length && !h.querySelector("a")) l.replaceChildren(...inner);
        heading.append(l);
      } else heading.append(...inlineNodes(document, h));
      out.push(heading);
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
    const heading = content.querySelector("h1, h2, h3, h4, h5, h6");
    if (heading && clean(heading.textContent)) {
      cell.push(headingFrom(document, heading, heading.tagName.toLowerCase()));
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

  // tools/importer/parsers/hero.js
  function parse5(element, { document, params }) {
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

  // tools/importer/parsers/columns-sidebar.js
  var RAW_TABLE_ATTR = "data-excat-raw-table";
  function parse6(element, { document, params }) {
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

  // tools/importer/parsers/table-data.js
  function sidebarRow(element, params) {
    var _a, _b;
    const def = (((_b = (_a = params == null ? void 0 : params.targets) == null ? void 0 : _a.template) == null ? void 0 : _b.blocks) || []).find((b) => b.name === "columns-sidebar");
    if (!def) return null;
    for (let row = element.parentElement; row; row = row.parentElement) {
      const main = row.matches(".frach-grid-row") && row.querySelector(":scope > .frach-grid-col-mq3-8");
      if (!main || !main.contains(element)) continue;
      const matches = (def.instances || []).some((s) => {
        try {
          return row.matches(s);
        } catch (e) {
          return false;
        }
      });
      if (matches) return row;
    }
    return null;
  }
  function cellContent(document, cell) {
    normalizeContent(document, cell);
    const nodes = [...cell.childNodes].filter((n) => n.nodeType === 1 || clean(n.textContent));
    if (!nodes.length) return "";
    if (nodes.every((n) => n.nodeType === 3 || /^(SPAN|STRONG|B|EM|I|A|BR|SUP|SUB)$/.test(n.tagName))) {
      const p = document.createElement("p");
      nodes.forEach((n) => p.append(n.nodeType === 3 ? document.createTextNode(n.textContent.replace(/\s+/g, " ")) : n));
      return [p];
    }
    return nodes;
  }
  function parse7(element, { document, params }) {
    const row = sidebarRow(element, params);
    if (row) {
      parse6(row, { document, params });
      return;
    }
    const tables = element.matches("table") ? [element] : [...element.querySelectorAll("table")];
    const cells = [];
    tables.forEach((table) => {
      table.querySelectorAll("tr").forEach((tr) => {
        if (tr.closest("table") !== table) return;
        const row2 = [...tr.children].filter((c) => /^T[HD]$/.test(c.tagName)).map((c) => cellContent(document, c));
        if (!row2.length) return;
        if (row2.every((c) => c === "")) {
          cells.push(row2.map(() => ""));
          return;
        }
        cells.push(row2);
      });
    });
    const name = tables.length > 1 ? "table-data (side-by-side)" : "table-data";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [[""]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/section-title.js
  function parse8(element, { document }) {
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
  function parse9(element, { document, params }) {
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
        parse9(comp, { document, params: payload && payload.params || {} });
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

  // tools/importer/import-press-release.js
  var PAGE_TEMPLATE = {
    "name": "press-release",
    "description": "Article body in a wide main column with a narrow right sidebar for contacts and downloads",
    "urls": [
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/ausgezeichnetes-einkaufserlebnis.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/flaschenpfand-geht-an-vier-neue-organisationen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-brasil-uebernimmt-betrieb-der-brasilianischen-flughaefen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-geschaeftsjahr-2017--starkes-ergebnis-gestuetzt-von-deut.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-initiative-fuer-innovative-foerderprojekte-geht-in-die-z.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-vergibt-auftrag-fuer-neues-passagier-transport-system-zu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-2017--mehr-als-64-millionen-fluggaeste-am.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-februar-2018--wachstum-setzt-sich-fort.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-januar-2018--starkes-wachstum-zum-jahr.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/gut-vorbereitet-und-entspannt-in-die-osterfeiertage-starten.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/paradies-fuer-schulabgaenger--ausbildungsmesse-am-flughafen-fran.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/sommerflugplan-2018--von-frankfurt-in-alle-welt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/wachstum-schafft-arbeitsplaetze--fraport-stellt-mehr-als-1-800-b.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport--kapazitaet-des-stromnetzes-deutlich-erweitert.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport-city--weiterer-verkaufserfolg-auf-dem-moenchho.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-ag-nimmt-am-flughafen-frankfurt-zusaetzliche-sicherheits.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erhaelt-ceiv-pharma-zertifikat-fuer-expertise-im-ramp-ha.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erprobt-den-einsatz-von-drohnen-am-frankfurter-flughafen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-legt-konzernweite-klimaschutzziele-fest--deutliche-reduk.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-quartalsmitteilung-q1-2018--erfolgreicher-start-ins-neue.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-schliesst-mietvertrag-mit-swissport-in-der-cargocity-sue.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-2018.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-mai-2018--erneut-starkes-wachstum.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/gedenkfeier-zum-70--jubilaeum-der-berliner-luftbruecke-am-flugha.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/girls--day-2018---auf-schnuppertour-am-frankfurter-flughafen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/neuer-nistplatz-fuer-eisvoegel-am-moenchwaldsee.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/sommerferienstart-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/-terminal-3-wird-mit-allen-verkehrsmitteln-sehr-gut-erreichbar-s.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ag-veraeussert-ihre-anteile-am-flughafen-hannover.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-begruesst-entscheidung-des-hessischen-verwaltungsgericht.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ergaenzt-dachsicherungsprogramm-um-zusaetzliche-angebote.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-richtfest-fuer-neues-winterdienstgebaeude.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-spatenstich-fuer-neues-terminal-in-thessaloniki.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2018--gu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-staerkt-elektromobilitaet-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-usa-erhaelt-zuschlag-fuer-centermanagement-am-flughafen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-august-2018--passagier-plus-in-frankfu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-ersten-halbjahr-2018--positive-entwick.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-juli-2018--wachstum-setzt-sich-fort.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verlaengert-vertrag-des-vorstandsvorsitzenden-dr--stefan.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/frueh-da-sein--direkt-zur-sicherheitskontrolle-gehen-und-handgep.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/hochleistungen-bei-hitze-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/infos-zum-anfassen--vierte--tech-night--am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/karrierestart-bei-fraport--123-junge-menschen-beginnen-ihre-ausb.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/weltpremiere-fuer-digitale-gefahrgutdeklaration-am-flughafen-fra.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/erweiterung-anschlussstelle-zeppelinheim--vorbereitende-arbeiten.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--mehr-ziele--mehr-fluege--mehr-sitzplaetze.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--startschuss-fuer-rohbau-von-terminal-3.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-bleibt-premium-partner-bei-eintracht-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-testet-gemeinsam-mit-lufthansa-ferngesteuerten-flugzeugs.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-und-esa-bringen-weltraum-zum-sprechen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-oktober-2018--weiter-auf-wachstumskurs.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/friedensfest-der-drei-grossen-buchreligionen-am-flughafen-frankf.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gewinner-der-zweiten-fraport-initiative-fuer-bildungsprojekte-st.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gut-vorbereitet-in-die-weihnachtsfeiertage-starten.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/konzern-quartalsmitteilung-q3-9m-2018--fraport-setzt-wachstumsku.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/lufthansa-und-fraport-setzen-zusammenarbeit-bei-der-flugzeugabfe.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/notfalluebung-am-flughafen-frankfurt-erfolgreich-abgeschlossen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/turnusmaessige-notfalluebung-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-mobilitaet-der-zukunft--fraport-und-volocopter-entwickeln-flugh.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/ab-flughafen-frankfurt-ins-fruehjahr-starten.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--betrieb-laeuft-nach-streikende-wieder-stabi.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--streik-der-sicherheitsdienstleister-am-dien.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-ausbildungszentrum-am-flughafen-ljubljana.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-neue-ausbildungswerkstatt-am-flughafen-frankfu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-geschaeftsjahr-2018--umsatz-und-ergebnis-deutlich-gestei.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-2018--mehr-als-69-5-millionen-passagiere-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fuer-die-sicherheit--fraport-weitet-dachsicherungsprogramm-aus.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/pierre-dominique-pruemm-verstaerkt-fraport-vorstand.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/von-der-elektrik-bis-zur-luftsicherheitskontrolle--am-flughafen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-flughafen-frankfurt--reibungsloser-betrieb-trotz-hohem-passagie.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-initiative-2019-unterstuetzt-innovative-projekte-in-der.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-quartalsmitteilung-q1-2019--erfolgreicher-start-ins-neu.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-201.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-2-00.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--in-frankfurt-und-international-gut-fue.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-plant-rund-2-300-neueinstellungen-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-und-deutsche-bahn-testen-kuenstliche-intelligenz-am-flug.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/grundstein-fuer-terminal-3-gelegt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/sommerferien-bringen-bis-zu-240-000-fluggaeste-pro-tag.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/-herbstferien-starten.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/20-jahre-proregion--flughafenstiftung-zur-foerderung-der-berufli.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/ausbildung-am-airport---tech-night--bietet-spannende-einblicke-i.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/flughafen-frankfurt--sieben-neue-luftsicherheitskontrollspuren-f.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-ist--fahrradfreundlicher-arbeitgeber-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-kooperiert-mit-techquartier-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2019--st.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-setzt-kuenftig-auf-flugdaten-von-flightaware-zur-passgen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-august-2019--wachstum-in-frankfurt-set.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-ersten-halbjahr-2019--stabile-entwickl.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/pfand-drauf--flaschenpfand-geht-an-vier-neue-organisationen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/zukunftsperspektive-flughafen--125-junge-menschen-beginnen-ihre-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-lila-pferd--auf-spendentour--fraport-unterstuetzt-wohltaetige-p.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/boeing-und-fraport-eroeffnen-boeing-ecodemonstrator-european-exp.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/frankfurt-airport--im-winter-zu-259-zielen-rund-um-den-globus.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-feiert-richtfest-fuer-neue-feuer--und-rettungswache.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2019.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-november-2019--ruecklaeufige-verkehrse.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/gepaeckservice-und-navigation--fraport-und-e-novia-testen-autono.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/grundsteinlegung-fuer-luftfrachthalle-von-swissport-in-der-cargo.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/inklusion-leben--aktionsplan-feiert-5-jaehriges-jubilaeum.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/innovative-sozialprojekte-ueberzeugen-die-fraport-initiative-201.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/jetzt-gut-vorbereiten--flugreise-im-winter.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/zeichen-fuer-frieden-und-gemeinschaft--fraport-feiert-fest-der-a.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/am-frankfurt-airport-ab-17--maerz-rundfahrten-voruebergehend-aus.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/faszination-flughafen-hautnah-erleben--ausbildungsmesse--airport.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--frachtinfrastruktur-steht-uneingeschraenkt-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-arbeitet-mit-hochdruck-an-abtransport-von-pfc-belastetem.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-erhaelt-klimazertifikat-fuer-den-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-g.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/AbfertigungwirdabSiebtenAprilimTerminal1konzentriert.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/NeuerAsphaltFuerSuedbahn.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/VerkehrszahlenKW16.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/bauarbeiten-erfolgreich-abgeschlossen--suedbahn-am-frankfurter-f.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt-startklar-fuer-sicheres-fliegen.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flugziele-ab-frankfurt-legen-weiter-zu-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/frankfurt-airport--ab-juni-wieder-mehr-flugziele-geplant.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-ag-fuehrt-hauptversammlung-am-26--mai-ausschliesslich-vi.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2020.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-setzt-am-flughafen-frankfurt-auf-gruenstrom-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/garant-in-der-krise--flughafen-frankfurt-sichert-als-europas-fue.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/nachhaltige-hilfe-fuer-die-region--bilanz-des-fraport-umweltfond.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/sommerurlaub-2020--zahlreiche-sonnenziele-wieder-im-programm.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-l.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/berufsstart-am-flughafen-frankfurt--89-junge-menschen-beginnen-i.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--startbahn-18-west-ab-15--oktober-wieder-in-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-uebergibt-luftfrachthalle-an-swissport.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/ausflugsziel-flughafen-frankfurt---multimediales-fraport-besuche.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juni-2021--beginnender-aufwaertstrend-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/sanierung-der-rollbruecke-ost-am-flughafen-frankfurt0.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html",
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/-alexa--frage-frankfurt-airport-nach-lh400---virtueller-assisten.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/-faces-behind-the-voices-.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/-umgeparkt--holiday-parking--und--carsharing--wechseln-standorte.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/der-sommer-kann-kommen.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/faszination-flughafenfeuerwehr.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/flughafen-frankfurt-in-weihnachtsstimmung-.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/flughafenflair-im-freien--flughafen-frankfurt-eroeffnet-dachterr.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/flugsteige-d-und-e-voellig-neu-erleben.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/glueckliche-zeiten--jaguar-e-pace-im-wert-von-60-000-euro-und-vi.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/lieblingsparkplatz-garantiert--vorausbuchungsfunktion-nun-auch-f.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/luxus-fuer-jedermann--primeclass-lounge-verspricht-entspannte-au.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/modernes-tagungszentrum-in-top-lage.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/neue-rundfahrt-mit-aussicht.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/o-zapft-is--oktoberfest-stimmung-am-flughafen-frankfurt.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/positive-ladung--flughafen-frankfurt-richtet-weitere-e-parkplaet.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/schnell-und-einfach-durch-die-grenzkontrolle.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/typisch-deutsch-.html",
      "https://www.fraport.com/de/newsroom/service-news/2018/wm-fieber-am-flughafen-frankfurt--hier-koennen-fluggaeste-die-sp.html",
      "https://www.fraport.com/de/newsroom/service-news/2022/koffer-know-how.html"
    ],
    "blocks": [
      {
        "name": "breadcrumb",
        "instances": [
          "frach-m-breadcrumb-navigation"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/ausgezeichnetes-einkaufserlebnis.html": [
            "#press-3cf4bd5c7b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/flaschenpfand-geht-an-vier-neue-organisationen.html": [
            "#press-3130b4f5d6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-brasil-uebernimmt-betrieb-der-brasilianischen-flughaefen.html": [
            "#press-eccf190f21 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-geschaeftsjahr-2017--starkes-ergebnis-gestuetzt-von-deut.html": [
            "#press-47945717cc > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-initiative-fuer-innovative-foerderprojekte-geht-in-die-z.html": [
            "#press-88ace86cd7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-vergibt-auftrag-fuer-neues-passagier-transport-system-zu.html": [
            "#press-5e0cd4ff19 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-2017--mehr-als-64-millionen-fluggaeste-am.html": [
            "#press-0c876d84e1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-februar-2018--wachstum-setzt-sich-fort.html": [
            "#press-4cbd7e468f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-januar-2018--starkes-wachstum-zum-jahr.html": [
            "#press-e93159b9a4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/gut-vorbereitet-und-entspannt-in-die-osterfeiertage-starten.html": [
            "#press-8c47906f9b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/paradies-fuer-schulabgaenger--ausbildungsmesse-am-flughafen-fran.html": [
            "#press-92d021c17e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/sommerflugplan-2018--von-frankfurt-in-alle-welt.html": [
            "#press-3e0985ea98 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/wachstum-schafft-arbeitsplaetze--fraport-stellt-mehr-als-1-800-b.html": [
            "#press-b2a4597734 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport--kapazitaet-des-stromnetzes-deutlich-erweitert.html": [
            "#press-aeafbcb935 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport-city--weiterer-verkaufserfolg-auf-dem-moenchho.html": [
            "#press-33051a241f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-ag-nimmt-am-flughafen-frankfurt-zusaetzliche-sicherheits.html": [
            "#press-95170e0c76 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erhaelt-ceiv-pharma-zertifikat-fuer-expertise-im-ramp-ha.html": [
            "#press-af96efeb20 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erprobt-den-einsatz-von-drohnen-am-frankfurter-flughafen.html": [
            "#press-0d202a018e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50.html": [
            "#press-c36edfb8e6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-legt-konzernweite-klimaschutzziele-fest--deutliche-reduk.html": [
            "#press-671939d42c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-quartalsmitteilung-q1-2018--erfolgreicher-start-ins-neue.html": [
            "#press-53fa58bd4b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-schliesst-mietvertrag-mit-swissport-in-der-cargocity-sue.html": [
            "#press-ec598663fe > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet.html": [
            "#press-2b3104e490 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-.html": [
            "#press-f2ad4776c3 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-2018.html": [
            "#press-dbd2863ee0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-mai-2018--erneut-starkes-wachstum.html": [
            "#press-18805b3e76 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/gedenkfeier-zum-70--jubilaeum-der-berliner-luftbruecke-am-flugha.html": [
            "#press-2e7c05a05a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/girls--day-2018---auf-schnuppertour-am-frankfurter-flughafen.html": [
            "#press-8d309f0459 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/neuer-nistplatz-fuer-eisvoegel-am-moenchwaldsee.html": [
            "#press-5bc8955d98 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/sommerferienstart-am-flughafen-frankfurt.html": [
            "#press-ec94ab806c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/-terminal-3-wird-mit-allen-verkehrsmitteln-sehr-gut-erreichbar-s.html": [
            "#press-0e1a69761e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen.html": [
            "#press-89936663c8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ag-veraeussert-ihre-anteile-am-flughafen-hannover.html": [
            "#press-6ce31f7c1f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-begruesst-entscheidung-des-hessischen-verwaltungsgericht.html": [
            "#press-dfb4849989 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ergaenzt-dachsicherungsprogramm-um-zusaetzliche-angebote.html": [
            "#press-1e82e46657 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g.html": [
            "#press-f0474bf367 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-richtfest-fuer-neues-winterdienstgebaeude.html": [
            "#press-f5d526e3e8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-spatenstich-fuer-neues-terminal-in-thessaloniki.html": [
            "#press-912f3e8e6f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2018--gu.html": [
            "#press-4db49e01ce > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-staerkt-elektromobilitaet-am-flughafen-frankfurt.html": [
            "#press-276275c7bc > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-usa-erhaelt-zuschlag-fuer-centermanagement-am-flughafen-.html": [
            "#press-6ff01104f9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-august-2018--passagier-plus-in-frankfu.html": [
            "#press-967229aa3e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-ersten-halbjahr-2018--positive-entwick.html": [
            "#press-799528e32f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-juli-2018--wachstum-setzt-sich-fort.html": [
            "#press-fd1955cc8f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verlaengert-vertrag-des-vorstandsvorsitzenden-dr--stefan.html": [
            "#press-a1face5438 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/frueh-da-sein--direkt-zur-sicherheitskontrolle-gehen-und-handgep.html": [
            "#press-a023bd867a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/hochleistungen-bei-hitze-am-flughafen-frankfurt.html": [
            "#press-f47a41b04f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/infos-zum-anfassen--vierte--tech-night--am-flughafen-frankfurt.html": [
            "#press-7aabdd9a1b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/karrierestart-bei-fraport--123-junge-menschen-beginnen-ihre-ausb.html": [
            "#press-16e7867ab1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/weltpremiere-fuer-digitale-gefahrgutdeklaration-am-flughafen-fra.html": [
            "#press-0e3a043d2d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/erweiterung-anschlussstelle-zeppelinheim--vorbereitende-arbeiten.html": [
            "#press-2c7ef37c21 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--mehr-ziele--mehr-fluege--mehr-sitzplaetze.html": [
            "#press-c521934d25 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--startschuss-fuer-rohbau-von-terminal-3.html": [
            "#press-223250fb99 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-bleibt-premium-partner-bei-eintracht-frankfurt.html": [
            "#press-bbc89c3b27 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-testet-gemeinsam-mit-lufthansa-ferngesteuerten-flugzeugs.html": [
            "#press-2e9219509b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-und-esa-bringen-weltraum-zum-sprechen.html": [
            "#press-00cfb6feb1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for.html": [
            "#press-be07520d2c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-oktober-2018--weiter-auf-wachstumskurs.html": [
            "#press-9b3a731d98 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
            "#press-9f9f2d6ca9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/friedensfest-der-drei-grossen-buchreligionen-am-flughafen-frankf.html": [
            "#press-cafaac4951 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gewinner-der-zweiten-fraport-initiative-fuer-bildungsprojekte-st.html": [
            "#press-0d9b8e0f6d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gut-vorbereitet-in-die-weihnachtsfeiertage-starten.html": [
            "#press-b278535722 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/konzern-quartalsmitteilung-q3-9m-2018--fraport-setzt-wachstumsku.html": [
            "#press-9365b8d110 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/lufthansa-und-fraport-setzen-zusammenarbeit-bei-der-flugzeugabfe.html": [
            "#press-e24ecc385c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/notfalluebung-am-flughafen-frankfurt-erfolgreich-abgeschlossen.html": [
            "#press-9154cf6973 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck.html": [
            "#press-9bce6558b1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/turnusmaessige-notfalluebung-am-flughafen-frankfurt.html": [
            "#press-7edff3d06d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv.html": [
            "#press-9464def4fb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se.html": [
            "#press-8298129bdc > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-mobilitaet-der-zukunft--fraport-und-volocopter-entwickeln-flugh.html": [
            "#press-280273ecfe > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/ab-flughafen-frankfurt-ins-fruehjahr-starten.html": [
            "#press-079bfafd79 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--betrieb-laeuft-nach-streikende-wieder-stabi.html": [
            "#press-7c8c5e96dd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--streik-der-sicherheitsdienstleister-am-dien.html": [
            "#press-a5255392e5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-ausbildungszentrum-am-flughafen-ljubljana.html": [
            "#press-fe6648c638 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-neue-ausbildungswerkstatt-am-flughafen-frankfu.html": [
            "#press-a3968aa07a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-geschaeftsjahr-2018--umsatz-und-ergebnis-deutlich-gestei.html": [
            "#press-d6331d2e63 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-2018--mehr-als-69-5-millionen-passagiere-.html": [
            "#press-7d48692a05 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j.html": [
            "#press-27d12d2aee > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fuer-die-sicherheit--fraport-weitet-dachsicherungsprogramm-aus.html": [
            "#press-d4a4b0f9a9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen.html": [
            "#press-b3edf946cb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/pierre-dominique-pruemm-verstaerkt-fraport-vorstand.html": [
            "#press-acef37f883 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/von-der-elektrik-bis-zur-luftsicherheitskontrolle--am-flughafen-.html": [
            "#press-dde22a83a7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-flughafen-frankfurt--reibungsloser-betrieb-trotz-hohem-passagie.html": [
            "#press-f3c1a38970 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent.html": [
            "#press-7072773c36 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-initiative-2019-unterstuetzt-innovative-projekte-in-der.html": [
            "#press-624ba92605 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-quartalsmitteilung-q1-2019--erfolgreicher-start-ins-neu.html": [
            "#press-0f82b0c349 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-201.html": [
            "#press-b005ff090c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-2-00.html": [
            "#press-4606a67aef > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--in-frankfurt-und-international-gut-fue.html": [
            "#press-6e87b590eb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-plant-rund-2-300-neueinstellungen-am-flughafen-frankfurt.html": [
            "#press-445e8069a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-und-deutsche-bahn-testen-kuenstliche-intelligenz-am-flug.html": [
            "#press-9e273d080f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur.html": [
            "#press-61fc42d63e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/grundstein-fuer-terminal-3-gelegt.html": [
            "#press-be060d5bd6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/sommerferien-bringen-bis-zu-240-000-fluggaeste-pro-tag.html": [
            "#press-dd46a9b53f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/-herbstferien-starten.html": [
            "#press-0fa3c0db78 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/20-jahre-proregion--flughafenstiftung-zur-foerderung-der-berufli.html": [
            "#press-64e6c0a833 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/ausbildung-am-airport---tech-night--bietet-spannende-einblicke-i.html": [
            "#press-0f19d94924 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/flughafen-frankfurt--sieben-neue-luftsicherheitskontrollspuren-f.html": [
            "#press-c117c80c9e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-ist--fahrradfreundlicher-arbeitgeber-.html": [
            "#press-b950537ca4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-kooperiert-mit-techquartier-frankfurt.html": [
            "#press-555aa46946 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2019--st.html": [
            "#press-8c0e857b66 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-setzt-kuenftig-auf-flugdaten-von-flightaware-zur-passgen.html": [
            "#press-dd6d6483e7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-august-2019--wachstum-in-frankfurt-set.html": [
            "#press-33fab8869f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-ersten-halbjahr-2019--stabile-entwickl.html": [
            "#press-eaf1ab2bb9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt.html": [
            "#press-38cfd9b992 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/pfand-drauf--flaschenpfand-geht-an-vier-neue-organisationen.html": [
            "#press-454defdd9d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/zukunftsperspektive-flughafen--125-junge-menschen-beginnen-ihre-.html": [
            "#press-aeaf3cf137 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-.html": [
            "#press-1933a4fc08 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-lila-pferd--auf-spendentour--fraport-unterstuetzt-wohltaetige-p.html": [
            "#press-eee0138776 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/boeing-und-fraport-eroeffnen-boeing-ecodemonstrator-european-exp.html": [
            "#press-69051ccdcd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen.html": [
            "#press-4ce18950d7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2.html": [
            "#press-7fcf69fe8f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne.html": [
            "#press-9975c6c027 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/frankfurt-airport--im-winter-zu-259-zielen-rund-um-den-globus.html": [
            "#press-96b39bec90 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-feiert-richtfest-fuer-neue-feuer--und-rettungswache.html": [
            "#press-f52f208beb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2019.html": [
            "#press-9948043196 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-november-2019--ruecklaeufige-verkehrse.html": [
            "#press-814f2e025f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec.html": [
            "#press-774335e3ac > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
            "#press-17e577c551 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/gepaeckservice-und-navigation--fraport-und-e-novia-testen-autono.html": [
            "#press-e83dfca934 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/grundsteinlegung-fuer-luftfrachthalle-von-swissport-in-der-cargo.html": [
            "#press-a51d7c1b4f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/inklusion-leben--aktionsplan-feiert-5-jaehriges-jubilaeum.html": [
            "#press-e9ee463c0c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/innovative-sozialprojekte-ueberzeugen-die-fraport-initiative-201.html": [
            "#press-126b78dc15 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/jetzt-gut-vorbereiten--flugreise-im-winter.html": [
            "#press-d0f1905d5f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/zeichen-fuer-frieden-und-gemeinschaft--fraport-feiert-fest-der-a.html": [
            "#press-df9b37b0ce > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/am-frankfurt-airport-ab-17--maerz-rundfahrten-voruebergehend-aus.html": [
            "#press-0b5d5874b9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/faszination-flughafen-hautnah-erleben--ausbildungsmesse--airport.html": [
            "#press-36bad9bbc7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--frachtinfrastruktur-steht-uneingeschraenkt-.html": [
            "#press-8a66ac370f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-.html": [
            "#press-5472bdaa7f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-.html": [
            "#press-17703057e6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019.html": [
            "#press-087a9b396e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-arbeitet-mit-hochdruck-an-abtransport-von-pfc-belastetem.html": [
            "#press-cf18987c4d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-erhaelt-klimazertifikat-fuer-den-flughafen-frankfurt.html": [
            "#press-ba7312a893 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio.html": [
            "#press-3dd76627e9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-g.html": [
            "#press-0a78b896de > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/AbfertigungwirdabSiebtenAprilimTerminal1konzentriert.html": [
            "#press-225b46eadc > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/NeuerAsphaltFuerSuedbahn.html": [
            "#press-4ca7178535 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/VerkehrszahlenKW16.html": [
            "#press-a01270f12c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/bauarbeiten-erfolgreich-abgeschlossen--suedbahn-am-frankfurter-f.html": [
            "#press-f4d87085db > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap.html": [
            "#press-afc1f34d1f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet.html": [
            "#press-1bfc662bef > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-.html": [
            "#press-99e15705f7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a.html": [
            "#press-3ff661eb18 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0.html": [
            "#press-4779c0f4c5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-.html": [
            "#press-f245628a24 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m.html": [
            "#press-7555e165a0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--.html": [
            "#press-ba48dd05e0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--.html": [
            "#press-ede96020fe > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--.html": [
            "#press-407dbb04aa > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--.html": [
            "#press-e3679f585a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--.html": [
            "#press-5e2416a6db > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--.html": [
            "#press-9401ff430e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-.html": [
            "#press-eea32307e5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt-startklar-fuer-sicheres-fliegen.html": [
            "#press-f2efa67d29 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flugziele-ab-frankfurt-legen-weiter-zu-.html": [
            "#press-21d49dca4f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/frankfurt-airport--ab-juni-wieder-mehr-flugziele-geplant.html": [
            "#press-177a185f01 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-ag-fuehrt-hauptversammlung-am-26--mai-ausschliesslich-vi.html": [
            "#press-8e858513e0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#press-0880df27fb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
            "#press-d1196ff38a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2020.html": [
            "#press-48ede90c84 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-setzt-am-flughafen-frankfurt-auf-gruenstrom-.html": [
            "#press-b615b1564a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/garant-in-der-krise--flughafen-frankfurt-sichert-als-europas-fue.html": [
            "#press-641a8e6bfa > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/nachhaltige-hilfe-fuer-die-region--bilanz-des-fraport-umweltfond.html": [
            "#press-3643858669 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#press-d314919191 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/sommerurlaub-2020--zahlreiche-sonnenziele-wieder-im-programm.html": [
            "#press-1f55b9bb55 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-l.html": [
            "#press-052e8ac03d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/berufsstart-am-flughafen-frankfurt--89-junge-menschen-beginnen-i.html": [
            "#press-4e0bae3534 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--startbahn-18-west-ab-15--oktober-wieder-in-.html": [
            "#press-2cef6ae71d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--.html": [
            "#press-d20e1a4fa2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--.html": [
            "#press-73909b9774 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--.html": [
            "#press-9c86744160 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--.html": [
            "#press-adc9c1d325 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-.html": [
            "#press-f48517bd21 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august.html": [
            "#press-9692d1a20c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august.html": [
            "#press-37fb4ca99c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--.html": [
            "#press-feb0ddaffb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august.html": [
            "#press-9c1feb6e68 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli.html": [
            "#press-2d886634e3 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun.html": [
            "#press-8eb487337f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center.html": [
            "#press-ee0b4ef210 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-uebergibt-luftfrachthalle-an-swissport.html": [
            "#press-843e496303 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/ausflugsziel-flughafen-frankfurt---multimediales-fraport-besuche.html": [
            "#press-f9c15438b1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
            "#press-217b78067f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juni-2021--beginnender-aufwaertstrend-.html": [
            "#press-77f06219d9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/sanierung-der-rollbruecke-ost-am-flughafen-frankfurt0.html": [
            "#press-ddde720bbc > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#press-d08ed7f1b4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
            "#press-a9e68b7a08 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/-alexa--frage-frankfurt-airport-nach-lh400---virtueller-assisten.html": [
            "#press-22f50755ab > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/-faces-behind-the-voices-.html": [
            "#press-a83b37d0ae > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/-umgeparkt--holiday-parking--und--carsharing--wechseln-standorte.html": [
            "#press-fee7684d21 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/der-sommer-kann-kommen.html": [
            "#press-a8f973e913 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/faszination-flughafenfeuerwehr.html": [
            "#press-3c75db983e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/flughafen-frankfurt-in-weihnachtsstimmung-.html": [
            "#press-9570b00459 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/flughafenflair-im-freien--flughafen-frankfurt-eroeffnet-dachterr.html": [
            "#press-b04eb91d48 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/flugsteige-d-und-e-voellig-neu-erleben.html": [
            "#press-4231398823 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/glueckliche-zeiten--jaguar-e-pace-im-wert-von-60-000-euro-und-vi.html": [
            "#press-3617492bb7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/lieblingsparkplatz-garantiert--vorausbuchungsfunktion-nun-auch-f.html": [
            "#press-37885dcc49 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/luxus-fuer-jedermann--primeclass-lounge-verspricht-entspannte-au.html": [
            "#press-d09e62e85b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/modernes-tagungszentrum-in-top-lage.html": [
            "#press-796a73bba7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/neue-rundfahrt-mit-aussicht.html": [
            "#press-98c87660cd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/o-zapft-is--oktoberfest-stimmung-am-flughafen-frankfurt.html": [
            "#press-ebb912c984 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/positive-ladung--flughafen-frankfurt-richtet-weitere-e-parkplaet.html": [
            "#press-0441059466 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/schnell-und-einfach-durch-die-grenzkontrolle.html": [
            "#press-fedc5d132e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/typisch-deutsch-.html": [
            "#press-08934e0288 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/wm-fieber-am-flughafen-frankfurt--hier-koennen-fluggaeste-die-sp.html": [
            "#press-085015e227 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/koffer-know-how.html": [
            "#press-8f501339d0 > div.frach-m-page > frach-m-breadcrumb-navigation"
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
        "name": "tag-list",
        "instances": [
          "#main-content frach-m-hero .frach-m-page-meta-data__tags:has(frach-e-tag)"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/ausgezeichnetes-einkaufserlebnis.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/flaschenpfand-geht-an-vier-neue-organisationen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-brasil-uebernimmt-betrieb-der-brasilianischen-flughaefen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-geschaeftsjahr-2017--starkes-ergebnis-gestuetzt-von-deut.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-initiative-fuer-innovative-foerderprojekte-geht-in-die-z.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-vergibt-auftrag-fuer-neues-passagier-transport-system-zu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-2017--mehr-als-64-millionen-fluggaeste-am.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-februar-2018--wachstum-setzt-sich-fort.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-januar-2018--starkes-wachstum-zum-jahr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/gut-vorbereitet-und-entspannt-in-die-osterfeiertage-starten.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/paradies-fuer-schulabgaenger--ausbildungsmesse-am-flughafen-fran.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/sommerflugplan-2018--von-frankfurt-in-alle-welt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/wachstum-schafft-arbeitsplaetze--fraport-stellt-mehr-als-1-800-b.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport--kapazitaet-des-stromnetzes-deutlich-erweitert.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport-city--weiterer-verkaufserfolg-auf-dem-moenchho.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-ag-nimmt-am-flughafen-frankfurt-zusaetzliche-sicherheits.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erhaelt-ceiv-pharma-zertifikat-fuer-expertise-im-ramp-ha.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erprobt-den-einsatz-von-drohnen-am-frankfurter-flughafen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-legt-konzernweite-klimaschutzziele-fest--deutliche-reduk.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-quartalsmitteilung-q1-2018--erfolgreicher-start-ins-neue.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-schliesst-mietvertrag-mit-swissport-in-der-cargocity-sue.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-2018.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-mai-2018--erneut-starkes-wachstum.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/gedenkfeier-zum-70--jubilaeum-der-berliner-luftbruecke-am-flugha.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/girls--day-2018---auf-schnuppertour-am-frankfurter-flughafen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/neuer-nistplatz-fuer-eisvoegel-am-moenchwaldsee.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/sommerferienstart-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/-terminal-3-wird-mit-allen-verkehrsmitteln-sehr-gut-erreichbar-s.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ag-veraeussert-ihre-anteile-am-flughafen-hannover.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-begruesst-entscheidung-des-hessischen-verwaltungsgericht.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ergaenzt-dachsicherungsprogramm-um-zusaetzliche-angebote.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-richtfest-fuer-neues-winterdienstgebaeude.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-spatenstich-fuer-neues-terminal-in-thessaloniki.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2018--gu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-staerkt-elektromobilitaet-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-usa-erhaelt-zuschlag-fuer-centermanagement-am-flughafen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-august-2018--passagier-plus-in-frankfu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-ersten-halbjahr-2018--positive-entwick.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-juli-2018--wachstum-setzt-sich-fort.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verlaengert-vertrag-des-vorstandsvorsitzenden-dr--stefan.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/frueh-da-sein--direkt-zur-sicherheitskontrolle-gehen-und-handgep.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/hochleistungen-bei-hitze-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/infos-zum-anfassen--vierte--tech-night--am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/karrierestart-bei-fraport--123-junge-menschen-beginnen-ihre-ausb.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/weltpremiere-fuer-digitale-gefahrgutdeklaration-am-flughafen-fra.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/erweiterung-anschlussstelle-zeppelinheim--vorbereitende-arbeiten.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--mehr-ziele--mehr-fluege--mehr-sitzplaetze.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--startschuss-fuer-rohbau-von-terminal-3.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-bleibt-premium-partner-bei-eintracht-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-testet-gemeinsam-mit-lufthansa-ferngesteuerten-flugzeugs.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-und-esa-bringen-weltraum-zum-sprechen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-oktober-2018--weiter-auf-wachstumskurs.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/friedensfest-der-drei-grossen-buchreligionen-am-flughafen-frankf.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gewinner-der-zweiten-fraport-initiative-fuer-bildungsprojekte-st.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gut-vorbereitet-in-die-weihnachtsfeiertage-starten.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/konzern-quartalsmitteilung-q3-9m-2018--fraport-setzt-wachstumsku.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/lufthansa-und-fraport-setzen-zusammenarbeit-bei-der-flugzeugabfe.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/notfalluebung-am-flughafen-frankfurt-erfolgreich-abgeschlossen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/turnusmaessige-notfalluebung-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-mobilitaet-der-zukunft--fraport-und-volocopter-entwickeln-flugh.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/ab-flughafen-frankfurt-ins-fruehjahr-starten.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--betrieb-laeuft-nach-streikende-wieder-stabi.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--streik-der-sicherheitsdienstleister-am-dien.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-ausbildungszentrum-am-flughafen-ljubljana.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-neue-ausbildungswerkstatt-am-flughafen-frankfu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-geschaeftsjahr-2018--umsatz-und-ergebnis-deutlich-gestei.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-2018--mehr-als-69-5-millionen-passagiere-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fuer-die-sicherheit--fraport-weitet-dachsicherungsprogramm-aus.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/pierre-dominique-pruemm-verstaerkt-fraport-vorstand.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/von-der-elektrik-bis-zur-luftsicherheitskontrolle--am-flughafen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-flughafen-frankfurt--reibungsloser-betrieb-trotz-hohem-passagie.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-initiative-2019-unterstuetzt-innovative-projekte-in-der.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-quartalsmitteilung-q1-2019--erfolgreicher-start-ins-neu.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-201.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-2-00.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--in-frankfurt-und-international-gut-fue.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-plant-rund-2-300-neueinstellungen-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-und-deutsche-bahn-testen-kuenstliche-intelligenz-am-flug.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/grundstein-fuer-terminal-3-gelegt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/sommerferien-bringen-bis-zu-240-000-fluggaeste-pro-tag.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/-herbstferien-starten.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/20-jahre-proregion--flughafenstiftung-zur-foerderung-der-berufli.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/ausbildung-am-airport---tech-night--bietet-spannende-einblicke-i.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/flughafen-frankfurt--sieben-neue-luftsicherheitskontrollspuren-f.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-ist--fahrradfreundlicher-arbeitgeber-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-kooperiert-mit-techquartier-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2019--st.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-setzt-kuenftig-auf-flugdaten-von-flightaware-zur-passgen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-august-2019--wachstum-in-frankfurt-set.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-ersten-halbjahr-2019--stabile-entwickl.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/pfand-drauf--flaschenpfand-geht-an-vier-neue-organisationen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/zukunftsperspektive-flughafen--125-junge-menschen-beginnen-ihre-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-lila-pferd--auf-spendentour--fraport-unterstuetzt-wohltaetige-p.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/boeing-und-fraport-eroeffnen-boeing-ecodemonstrator-european-exp.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/frankfurt-airport--im-winter-zu-259-zielen-rund-um-den-globus.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-feiert-richtfest-fuer-neue-feuer--und-rettungswache.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2019.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-november-2019--ruecklaeufige-verkehrse.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/gepaeckservice-und-navigation--fraport-und-e-novia-testen-autono.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/grundsteinlegung-fuer-luftfrachthalle-von-swissport-in-der-cargo.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/inklusion-leben--aktionsplan-feiert-5-jaehriges-jubilaeum.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/innovative-sozialprojekte-ueberzeugen-die-fraport-initiative-201.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/jetzt-gut-vorbereiten--flugreise-im-winter.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/zeichen-fuer-frieden-und-gemeinschaft--fraport-feiert-fest-der-a.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/am-frankfurt-airport-ab-17--maerz-rundfahrten-voruebergehend-aus.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/faszination-flughafen-hautnah-erleben--ausbildungsmesse--airport.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--frachtinfrastruktur-steht-uneingeschraenkt-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-arbeitet-mit-hochdruck-an-abtransport-von-pfc-belastetem.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-erhaelt-klimazertifikat-fuer-den-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-g.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/AbfertigungwirdabSiebtenAprilimTerminal1konzentriert.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/NeuerAsphaltFuerSuedbahn.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/VerkehrszahlenKW16.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/bauarbeiten-erfolgreich-abgeschlossen--suedbahn-am-frankfurter-f.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt-startklar-fuer-sicheres-fliegen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flugziele-ab-frankfurt-legen-weiter-zu-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/frankfurt-airport--ab-juni-wieder-mehr-flugziele-geplant.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-ag-fuehrt-hauptversammlung-am-26--mai-ausschliesslich-vi.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2020.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-setzt-am-flughafen-frankfurt-auf-gruenstrom-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/garant-in-der-krise--flughafen-frankfurt-sichert-als-europas-fue.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/nachhaltige-hilfe-fuer-die-region--bilanz-des-fraport-umweltfond.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/sommerurlaub-2020--zahlreiche-sonnenziele-wieder-im-programm.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-l.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/berufsstart-am-flughafen-frankfurt--89-junge-menschen-beginnen-i.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--startbahn-18-west-ab-15--oktober-wieder-in-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-uebergibt-luftfrachthalle-an-swissport.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/ausflugsziel-flughafen-frankfurt---multimediales-fraport-besuche.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juni-2021--beginnender-aufwaertstrend-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/sanierung-der-rollbruecke-ost-am-flughafen-frankfurt0.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/-alexa--frage-frankfurt-airport-nach-lh400---virtueller-assisten.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/-faces-behind-the-voices-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/-umgeparkt--holiday-parking--und--carsharing--wechseln-standorte.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/der-sommer-kann-kommen.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/faszination-flughafenfeuerwehr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/flughafen-frankfurt-in-weihnachtsstimmung-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/flughafenflair-im-freien--flughafen-frankfurt-eroeffnet-dachterr.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/flugsteige-d-und-e-voellig-neu-erleben.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/glueckliche-zeiten--jaguar-e-pace-im-wert-von-60-000-euro-und-vi.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/lieblingsparkplatz-garantiert--vorausbuchungsfunktion-nun-auch-f.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/luxus-fuer-jedermann--primeclass-lounge-verspricht-entspannte-au.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/modernes-tagungszentrum-in-top-lage.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/neue-rundfahrt-mit-aussicht.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/o-zapft-is--oktoberfest-stimmung-am-flughafen-frankfurt.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/positive-ladung--flughafen-frankfurt-richtet-weitere-e-parkplaet.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/schnell-und-einfach-durch-die-grenzkontrolle.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/typisch-deutsch-.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2018/wm-fieber-am-flughafen-frankfurt--hier-koennen-fluggaeste-die-sp.html": [
            "#main-content > div > div > section:nth-child(1) > frach-m-hero > div.frach-m-page-meta-data > div > div > div.frach-grid-col-mq1-12.frach-m-page-meta-data__overview > div.frach-m-page-meta-data__tags"
          ],
          "https://www.fraport.com/de/newsroom/service-news/2022/koffer-know-how.html": [
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
        "name": "columns-sidebar",
        "instances": [
          "#main-content .frach-grid-row:has(> .frach-grid-col-mq3-8 + .frach-grid-col-mq3-4)"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/VerkehrszahlenKW16.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ]
        }
      },
      {
        "name": "table-data",
        "instances": [
          "#main-content frach-e-table"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > div > div > div.frach-grid-col-mq1-12.frach-grid-col-mq3-8 > div > section:nth-child(2)"
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
          "table-data",
          "anchor-list",
          "section-title"
        ],
        "defaultContent": [
          ".frach-m-text",
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
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/ausgezeichnetes-einkaufserlebnis.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-df81eb3ea5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/flaschenpfand-geht-an-vier-neue-organisationen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3ec21e0fc1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-brasil-uebernimmt-betrieb-der-brasilianischen-flughaefen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9bc91379ca-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-geschaeftsjahr-2017--starkes-ergebnis-gestuetzt-von-deut.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-836c5246eb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-initiative-fuer-innovative-foerderprojekte-geht-in-die-z.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-27786d2b5d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-vergibt-auftrag-fuer-neues-passagier-transport-system-zu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1644c6b3f6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-2017--mehr-als-64-millionen-fluggaeste-am.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-38a0bb3cdf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-februar-2018--wachstum-setzt-sich-fort.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-88893ec685-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/fraport-verkehrszahlen-im-januar-2018--starkes-wachstum-zum-jahr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2db2204ff7-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/gut-vorbereitet-und-entspannt-in-die-osterfeiertage-starten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2f21c0311a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/paradies-fuer-schulabgaenger--ausbildungsmesse-am-flughafen-fran.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cea7f137d3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/sommerflugplan-2018--von-frankfurt-in-alle-welt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2d122b729a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q1-2018/wachstum-schafft-arbeitsplaetze--fraport-stellt-mehr-als-1-800-b.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8222c3b276-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport--kapazitaet-des-stromnetzes-deutlich-erweitert.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-083a03390d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/frankfurt-airport-city--weiterer-verkaufserfolg-auf-dem-moenchho.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5ca5f853d2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-ag-nimmt-am-flughafen-frankfurt-zusaetzliche-sicherheits.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cb3e4f28e1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erhaelt-ceiv-pharma-zertifikat-fuer-expertise-im-ramp-ha.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a74e3db75b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-erprobt-den-einsatz-von-drohnen-am-frankfurter-flughafen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1caf2cdbb2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-1-50.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-67dda6d516-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-legt-konzernweite-klimaschutzziele-fest--deutliche-reduk.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cb296896e8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-quartalsmitteilung-q1-2018--erfolgreicher-start-ins-neue.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-62367362f8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-schliesst-mietvertrag-mit-swissport-in-der-cargocity-sue.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dd0116d688-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-sprecher-stellt-klar--am-flughafen-kommt-keine--veraltet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4b66a77da8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-april-2018--deutliches-wachstum-setzt-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-951b8a9afc-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-2018.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-62d961e8b3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/fraport-verkehrszahlen-im-mai-2018--erneut-starkes-wachstum.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cea706c140-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/gedenkfeier-zum-70--jubilaeum-der-berliner-luftbruecke-am-flugha.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6a5667766d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/girls--day-2018---auf-schnuppertour-am-frankfurter-flughafen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-556d48f6cd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/neuer-nistplatz-fuer-eisvoegel-am-moenchwaldsee.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4df9827c25-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q2-2018/sommerferienstart-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6c0d09e28b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/-terminal-3-wird-mit-allen-verkehrsmitteln-sehr-gut-erreichbar-s.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1789e9f6af-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/betrieb-nach-terminalraeumung-wieder-angelaufen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9a972d7a5e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ag-veraeussert-ihre-anteile-am-flughafen-hannover.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0a1e5f4922-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-begruesst-entscheidung-des-hessischen-verwaltungsgericht.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7bed3f33a4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-ergaenzt-dachsicherungsprogramm-um-zusaetzliche-angebote.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6d1f98e440-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-erhaelt-baugenehmigung-fuer-flugsteig-g.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cd3ed41347-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-richtfest-fuer-neues-winterdienstgebaeude.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2280b42fb6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-feiert-spatenstich-fuer-neues-terminal-in-thessaloniki.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0bbb872249-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2018--gu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-231df919a3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-staerkt-elektromobilitaet-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b0df0e419a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-usa-erhaelt-zuschlag-fuer-centermanagement-am-flughafen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a49d899adf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-august-2018--passagier-plus-in-frankfu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7355ab22ee-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-ersten-halbjahr-2018--positive-entwick.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e8d6159ecd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verkehrszahlen-im-juli-2018--wachstum-setzt-sich-fort.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d9bf26d195-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/fraport-verlaengert-vertrag-des-vorstandsvorsitzenden-dr--stefan.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-75a7731d16-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/frueh-da-sein--direkt-zur-sicherheitskontrolle-gehen-und-handgep.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c86f3a0722-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/hochleistungen-bei-hitze-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3eebe68d0a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/infos-zum-anfassen--vierte--tech-night--am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9b200793e7-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/karrierestart-bei-fraport--123-junge-menschen-beginnen-ihre-ausb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-45bc766d84-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q3-2018/weltpremiere-fuer-digitale-gefahrgutdeklaration-am-flughafen-fra.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5213e2e445-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/erweiterung-anschlussstelle-zeppelinheim--vorbereitende-arbeiten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f3adfeba74-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--mehr-ziele--mehr-fluege--mehr-sitzplaetze.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3d2c414a6f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/frankfurt-airport--startschuss-fuer-rohbau-von-terminal-3.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bf464c11fa-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-bleibt-premium-partner-bei-eintracht-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c9d4a7966a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-testet-gemeinsam-mit-lufthansa-ferngesteuerten-flugzeugs.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-df7ea014dd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-und-esa-bringen-weltraum-zum-sprechen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-493ce78be3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-november-2018--wachstum-setzt-sich-for.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fa6dd36bf5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-oktober-2018--weiter-auf-wachstumskurs.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-11d9648937-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-18c595e916-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/friedensfest-der-drei-grossen-buchreligionen-am-flughafen-frankf.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7e85b8be45-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gewinner-der-zweiten-fraport-initiative-fuer-bildungsprojekte-st.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a273179e13-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/gut-vorbereitet-in-die-weihnachtsfeiertage-starten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c760e9d2d6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/konzern-quartalsmitteilung-q3-9m-2018--fraport-setzt-wachstumsku.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5c28d4e5b8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/lufthansa-und-fraport-setzen-zusammenarbeit-bei-der-flugzeugabfe.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3fe7c60c18-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/notfalluebung-am-flughafen-frankfurt-erfolgreich-abgeschlossen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2cbc01ae4e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/spende-statt-geschenke--70-000-euro-fuer-den-guten-zweck.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2b5544d9e5-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2018/q4-2018/turnusmaessige-notfalluebung-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6331b2844e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-jetzt-auch-am-flughafen-nashville-aktiv.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-59cc9135db-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-fraport-verkehrszahlen-im-februar-2019--positive-entwicklung-se.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0f906db6d8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/-mobilitaet-der-zukunft--fraport-und-volocopter-entwickeln-flugh.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b9340fedf6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/ab-flughafen-frankfurt-ins-fruehjahr-starten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8005181dbe-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--betrieb-laeuft-nach-streikende-wieder-stabi.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e7e96cc7f9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/flughafen-frankfurt--streik-der-sicherheitsdienstleister-am-dien.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-932c1eeed8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-ausbildungszentrum-am-flughafen-ljubljana.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-328a4f4b82-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-eroeffnet-neue-ausbildungswerkstatt-am-flughafen-frankfu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4ab6dbc83b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-geschaeftsjahr-2018--umsatz-und-ergebnis-deutlich-gestei.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-07995aef86-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-2018--mehr-als-69-5-millionen-passagiere-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4143bb5286-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fraport-verkehrszahlen-im-januar-2019--positive-entwicklung-zu-j.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cd2f46b576-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/fuer-die-sicherheit--fraport-weitet-dachsicherungsprogramm-aus.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-861550aba4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/girls-day-2019--blick-hinter-die-kulissen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0898643724-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/pierre-dominique-pruemm-verstaerkt-fraport-vorstand.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-69dce91b88-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q1-2019/von-der-elektrik-bis-zur-luftsicherheitskontrolle--am-flughafen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c84e779382-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-flughafen-frankfurt--reibungsloser-betrieb-trotz-hohem-passagie.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b1787a82f0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-erhoeht-beteiligung-an-lima-airport-auf-80-prozent.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-85542ddf76-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-initiative-2019-unterstuetzt-innovative-projekte-in-der.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7b3ed5c38f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-quartalsmitteilung-q1-2019--erfolgreicher-start-ins-neu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-20c1bdf6a3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/-fraport-verkehrszahlen-im-maerz-und-den-ersten-drei-monaten-201.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-286203fe90-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--aktionaere-erhalten-dividende-von-2-00.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3b90130441-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-hauptversammlung--in-frankfurt-und-international-gut-fue.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b3c63a236a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-plant-rund-2-300-neueinstellungen-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7a97489dc2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-und-deutsche-bahn-testen-kuenstliche-intelligenz-am-flug.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7f79ff0309-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/fraport-verkehrszahlen-im-april-2019--weiterhin-auf-wachstumskur.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f38f9ddae0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/grundstein-fuer-terminal-3-gelegt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-22338be974-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q2-2019/sommerferien-bringen-bis-zu-240-000-fluggaeste-pro-tag.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1c8107a2c1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/-herbstferien-starten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-54559e1458-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/20-jahre-proregion--flughafenstiftung-zur-foerderung-der-berufli.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d8ceec536a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/ausbildung-am-airport---tech-night--bietet-spannende-einblicke-i.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4c21c1d475-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/flughafen-frankfurt--sieben-neue-luftsicherheitskontrollspuren-f.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bf3e4019bf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-ist--fahrradfreundlicher-arbeitgeber-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bf973fecc1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-ag-kooperiert-mit-techquartier-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-21e6075e49-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-konzern-zwischenbericht-fuer-das-erste-halbjahr-2019--st.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2d6a922371-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-setzt-kuenftig-auf-flugdaten-von-flightaware-zur-passgen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2580115ae8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-august-2019--wachstum-in-frankfurt-set.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3309a61aed-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-ersten-halbjahr-2019--stabile-entwickl.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-71ab6ca30f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/fraport-verkehrszahlen-im-juli-2019--passagier-plus-in-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6187de74a0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/pfand-drauf--flaschenpfand-geht-an-vier-neue-organisationen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b6bdc91e8b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q3-2019/zukunftsperspektive-flughafen--125-junge-menschen-beginnen-ihre-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-da02188a05-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-fraport-usa-erhaelt-zuschlag-fuer-centermanagement-im-terminal-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-de04943407-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/-lila-pferd--auf-spendentour--fraport-unterstuetzt-wohltaetige-p.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dc0ddfa445-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/boeing-und-fraport-eroeffnen-boeing-ecodemonstrator-european-exp.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a8dbcf885b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/eine-von-70-millionen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-25cefa9a88-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--25-jahre-terminal-2.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b5ef420645-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/flughafen-frankfurt--weltweit-auf-platz-zwei-der-am-besten-verne.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3b82922fbc-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/frankfurt-airport--im-winter-zu-259-zielen-rund-um-den-globus.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7dcda8b3e2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-feiert-richtfest-fuer-neue-feuer--und-rettungswache.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9a43f13fe4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-konzern-zwischenbericht-fuer-die-ersten-neun-monate-2019.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b0022e883d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-november-2019--ruecklaeufige-verkehrse.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3f459c9bf7-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-oktober-2019--wachstumsdynamik-schwaec.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2e3643e676-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/fraport-verkehrszahlen-im-september-und-in-den-ersten-neun-monat.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f3e42348ab-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/gepaeckservice-und-navigation--fraport-und-e-novia-testen-autono.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3a1300f7a2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/grundsteinlegung-fuer-luftfrachthalle-von-swissport-in-der-cargo.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-06c0410b5a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/inklusion-leben--aktionsplan-feiert-5-jaehriges-jubilaeum.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-15f08db238-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/innovative-sozialprojekte-ueberzeugen-die-fraport-initiative-201.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f80f31853a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/jetzt-gut-vorbereiten--flugreise-im-winter.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-73b617415b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2019/q4-2019/zeichen-fuer-frieden-und-gemeinschaft--fraport-feiert-fest-der-a.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-40d54e2867-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/am-frankfurt-airport-ab-17--maerz-rundfahrten-voruebergehend-aus.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-da942c958c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/faszination-flughafen-hautnah-erleben--ausbildungsmesse--airport.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-af76ac0b0f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--frachtinfrastruktur-steht-uneingeschraenkt-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4d5792979a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-12--16----22--maerz-2020-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-39bd985db6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/flughafen-frankfurt--verkehrszahlen-kw-13--23---29--maerz-2020-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b130847c30-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport--keine-dividende-fuer-2019.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e6752eca73-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-arbeitet-mit-hochdruck-an-abtransport-von-pfc-belastetem.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d7a4dabc5e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-erhaelt-klimazertifikat-fuer-den-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f2f3b09dd9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/fraport-reduziert-kostenbasis--umfassende-massnahmen-als-reaktio.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c2b9af1f29-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q1-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-g.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-599fbff4f9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/AbfertigungwirdabSiebtenAprilimTerminal1konzentriert.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-476352d5ac-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/NeuerAsphaltFuerSuedbahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9bee072ace-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/VerkehrszahlenKW16.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3692939ec9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/bauarbeiten-erfolgreich-abgeschlossen--suedbahn-am-frankfurter-f.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3624415e70-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/finanzminister-boddenberg-zum-aufsichtsratsvorsitzenden-der-frap.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ed76bf7bcf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--landebahn-nordwest-ab-8--juli-wieder-in-bet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2657f9e552-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-14--30--maerz-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c5b88dc0b3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-15--6----12--a.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f6116d998c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-17--20----26--0.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ef6b90d047-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-18--27--april-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-debbc69c82-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-19--4----10--m.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9c8c7d8fa1-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-20--11----17--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f7a45c69ff-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-21--18----24--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2a8d5fbc6f-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-22--25----31--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-63cec7c5a8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-24--08----14--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0862047577-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-25--15----21--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d5a75373fd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-26--22----28--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-55d05e7d86-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt--verkehrszahlen-kw-23--01----07--juni-2020-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-eec13d82f6-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flughafen-frankfurt-startklar-fuer-sicheres-fliegen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c0463a7c90-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/flugziele-ab-frankfurt-legen-weiter-zu-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a989c8cc99-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/frankfurt-airport--ab-juni-wieder-mehr-flugziele-geplant.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cb270d8e62-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-ag-fuehrt-hauptversammlung-am-26--mai-ausschliesslich-vi.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-25809cea5b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c1a7ff660a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-ak.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f71964a13d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-konzern-zwischenbericht-fuer-die-ersten-drei-monate-2020.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fa2ca6fec0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/fraport-setzt-am-flughafen-frankfurt-auf-gruenstrom-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fbd9c59d06-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/garant-in-der-krise--flughafen-frankfurt-sichert-als-europas-fue.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fe6cd7ebea-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/nachhaltige-hilfe-fuer-die-region--bilanz-des-fraport-umweltfond.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5cba0b102a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/rede-von-dr--stefan-schulte-zur-hauptversammlung-der-fraport-ag-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-980c1402f3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/sommerurlaub-2020--zahlreiche-sonnenziele-wieder-im-programm.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-537ea9d1f3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q2-2020/terminal-3-baustelle--abtransport-von-pfc-belastetem-erdaushub-l.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-963258ce0a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/berufsstart-am-flughafen-frankfurt--89-junge-menschen-beginnen-i.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-80f9bbc306-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--startbahn-18-west-ab-15--oktober-wieder-in-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e947926e63-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-27--29--juni--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ff03646069-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-29--13----19--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9e3db9bdab-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-30--20----26--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a39443afaa-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-31--27--juli--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b229e325f9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-32--3--august-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b6340f4dfe-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-33--10--august.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e584fea99c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-34--17--august.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-83866288c2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-35--24----30--.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e6ae42baa8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-36--31--august.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-71e8687bdb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-frankfurt--verkehrszahlen-kalenderwoche-6-12-juli.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cc8e96ce08-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/flughafen-lima-sichert-sich-450-millionen-dollar-zur-finanzierun.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4efbb06fcc-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-ag-startet-zusammenarbeit-mit-plug-and-play-tech-center.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-164e5f2713-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2020/q3-2020/fraport-uebergibt-luftfrachthalle-an-swissport.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ed8c633e38-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/ausflugsziel-flughafen-frankfurt---multimediales-fraport-besuche.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-753e34fc3c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-konzern-zwischenbericht-fuer-die-ersten-sechs-monate-202.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-580ba6893c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2021/q3-2021/fraport-verkehrszahlen-im-juni-2021--beginnender-aufwaertstrend-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-df6c0b4e77-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q1/sanierung-der-rollbruecke-ost-am-flughafen-frankfurt0.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ee560f980a-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--aktionaerinnen-und-aktionaere-stimmen-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cd113277d2-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemitteilungen/2024/q2/fraport-hauptversammlung--vorstand-und-aufsichtsrat-berichten-he.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bf307e87e3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/-alexa--frage-frankfurt-airport-nach-lh400---virtueller-assisten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-026bab3d61-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/-faces-behind-the-voices-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d18896f655-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/-umgeparkt--holiday-parking--und--carsharing--wechseln-standorte.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5b251d16d0-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/der-sommer-kann-kommen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9d5d75c949-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/faszination-flughafenfeuerwehr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4a05b78dc4-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/flughafen-frankfurt-in-weihnachtsstimmung-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a8d4d5bf3e-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/flughafenflair-im-freien--flughafen-frankfurt-eroeffnet-dachterr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4da5b87231-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/flugsteige-d-und-e-voellig-neu-erleben.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1d990a9443-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/glueckliche-zeiten--jaguar-e-pace-im-wert-von-60-000-euro-und-vi.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-46c456c21b-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/lieblingsparkplatz-garantiert--vorausbuchungsfunktion-nun-auch-f.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4bc9c836b3-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/luxus-fuer-jedermann--primeclass-lounge-verspricht-entspannte-au.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-743472d4f9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/modernes-tagungszentrum-in-top-lage.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0117bb2f88-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/neue-rundfahrt-mit-aussicht.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-695be469b7-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/o-zapft-is--oktoberfest-stimmung-am-flughafen-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fcfdda5c8d-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/positive-ladung--flughafen-frankfurt-richtet-weitere-e-parkplaet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e5b985c003-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/schnell-und-einfach-durch-die-grenzkontrolle.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f9df4795eb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/typisch-deutsch-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-53b37d8e59-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2018/wm-fieber-am-flughafen-frankfurt--hier-koennen-fluggaeste-die-sp.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d82920a2f9-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/service-news/2022/koffer-know-how.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5fd8156d30-notification-overlay"
      ]
    }
  };
  var parsers = {
    "breadcrumb": parse,
    "sticky-patch": parse2,
    "anchor-list": parse3,
    "tag-list": parse4,
    "hero": parse5,
    "columns-sidebar": parse6,
    "table-data": parse7,
    "section-title": parse8
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
  var import_press_release_default = {
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
  return __toCommonJS(import_press_release_exports);
})();
