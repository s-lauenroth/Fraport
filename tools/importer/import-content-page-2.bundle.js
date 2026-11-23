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

  // tools/importer/import-content-page-2.js
  var import_content_page_2_exports = {};
  __export(import_content_page_2_exports, {
    default: () => import_content_page_2_default
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
  function makeImages(document, scope) {
    return [...scope.querySelectorAll("frach-e-lazy-image, img:not(.ff_preview)")].filter((n) => !(n.tagName === "IMG" && n.closest("frach-e-lazy-image, noscript, frach-e-icon"))).map((n) => makeImage(document, n)).filter(Boolean);
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
  function imageTextCard(document, col) {
    const cards = [...col.querySelectorAll(".frach-m-card")];
    if (cards.length) return cards.flatMap((card) => cardComponent(document, card));
    const cell = [];
    const imageComp = col.querySelector("frach-m-image") || col;
    const img = makeImage(document, imageComp);
    const target = imageLink(imageComp);
    const textComp = col.querySelector(".frach-m-text, .cmp-text");
    const texts = textComp ? textContent(document, textComp) : [];
    if (img) cell.push(para(document, img));
    const cap = imageComp.querySelector && imageComp.querySelector("figcaption, .frach-m-image__caption");
    if (cap && clean(cap.textContent)) cell.push(para(document, document.createTextNode(clean(cap.textContent))));
    const heading2 = texts.find((n) => /^H[1-6]$/.test(n.tagName));
    if (heading2 && !heading2.querySelector("a") && target) {
      const a = document.createElement("a");
      a.setAttribute("href", absUrl2(target));
      a.append(...heading2.childNodes);
      heading2.append(a);
    }
    cell.push(...texts);
    return cell;
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

  // tools/importer/parsers/teaser-mosaic.js
  function textOf(document, content) {
    const out = [];
    if (!content) return out;
    normalizeContent(document, content);
    content.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a[href]").forEach((n) => {
      if (n.matches("a") && n.closest("p, h1, h2, h3, h4, h5, h6")) return;
      if (!clean(n.textContent)) return;
      if (/^H[1-6]$/.test(n.tagName)) {
        const h = document.createElement(n.tagName.toLowerCase());
        h.textContent = clean(n.textContent);
        out.push(h);
      } else if (n.tagName === "A") out.push(para(document, link(document, n.getAttribute("href"), n.textContent)));
      else out.push(n);
    });
    return out;
  }
  function videoCell(document, video) {
    const source = video.querySelector("video source[src], source[data-src], source[src]");
    const src = source ? bestSrc(source) : "";
    if (!src) return null;
    const cell = [para(document, link(document, src, absUrl2(src)))];
    const v = video.querySelector("video[poster]");
    const posterSrc = v && v.getAttribute("poster") || bestSrc(video.querySelector("img"));
    if (posterSrc) {
      const img = document.createElement("img");
      img.setAttribute("src", absUrl2(posterSrc));
      cell.unshift(para(document, img));
    }
    return cell;
  }
  function parse4(element, { document, params }) {
    const row = element.matches("frach-m-topicwall-first-row") ? element : element.querySelector("frach-m-topicwall-first-row") || element;
    const tiles = [...row.children].filter((c) => c.querySelector('[class*="frach-m-topicwall-"]') || /frach-m-topicwall-/.test(c.className || ""));
    const cells = [];
    let video = false;
    tiles.forEach((tile, i) => {
      const lazyVideo = tile.querySelector("frach-e-lazy-video, .frach-e-lazy-video");
      if (lazyVideo) {
        const cell2 = videoCell(document, lazyVideo);
        if (cell2) {
          if (i === 0) video = true;
          cells.push([cell2]);
          return;
        }
      }
      const cell = [];
      const imgWrap = tile.querySelector('[class*="__image-container"]');
      const img = imgWrap ? makeImage(document, imgWrap) : null;
      if (img) cell.push(para(document, img));
      const content = tile.querySelector('[class*="__content-box"], [class*="__content"]');
      if (content) {
        const icon = content.querySelector('img[class*="item-icon"], img');
        if (icon && !img) {
          const iconImg = makeImage(document, icon);
          if (iconImg) cell.push(para(document, iconImg));
        }
        cell.push(...textOf(document, content));
      }
      cells.push([cell.length ? cell : ""]);
    });
    const smallTiles = [...row.querySelectorAll("frach-m-topicwall-1-by-8")];
    const alt = !video && smallTiles.length > 0 && smallTiles.every((t) => /__white/.test(t.className || ""));
    let name = "teaser-mosaic";
    if (video) name = "teaser-mosaic (video)";
    else if (alt) name = "teaser-mosaic (alt)";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [[""]] });
    element.replaceWith(block);
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

  // tools/importer/parsers/video-player.js
  function parse6(element, { document, params }) {
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

  // tools/importer/parsers/teaser-feature.js
  function parse7(element, { document, params }) {
    const tile = element.matches("frach-m-topicwall-1-by-2, frach-m-topicwall-1-by-4") ? element : element.querySelector("frach-m-topicwall-1-by-2, frach-m-topicwall-1-by-4.frach-m-topicwall-1-by-4__blue, frach-m-topicwall-1-by-4") || element;
    const blue = /frach-m-topicwall-1-by-4__blue/.test(tile.className || "") || !!element.querySelector(".frach-m-topicwall-1-by-4__blue");
    const imgWrap = tile.querySelector('[class*="__image-container"]') || tile;
    const img = makeImage(document, imgWrap);
    const text = [];
    const contents = [...tile.querySelectorAll('[class*="__content"]')].filter((c) => !c.parentElement.closest('[class*="__content"]') || c.matches(".frach-m-topicwall-1-by-4__content"));
    const content = tile.querySelector(".frach-m-topicwall-1-by-4__content") || contents[0];
    if (content) {
      normalizeContent(document, content);
      content.querySelectorAll("h1, h2, h3, h4, h5, h6, p, a[href]").forEach((n) => {
        if (n.matches("a") && n.closest("p, h1, h2, h3, h4, h5, h6")) return;
        if (!clean(n.textContent)) return;
        if (/^H[1-6]$/.test(n.tagName)) {
          const h = document.createElement(n.tagName.toLowerCase());
          h.textContent = clean(n.textContent);
          text.push(h);
        } else if (n.tagName === "A") {
          text.push(para(document, link(document, n.getAttribute("href"), n.textContent)));
        } else {
          text.push(n);
        }
      });
    }
    const row = [];
    if (img) row.push([para(document, img)]);
    if (text.length) row.push(text);
    const name = blue ? "teaser-feature (square-text-over-image)" : "teaser-feature";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: [row.length ? row : [""]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/downloads.js
  function groupHeading(document, list) {
    let prev = list.previousElementSibling;
    while (prev && !clean(prev.textContent)) prev = prev.previousElementSibling;
    if (!prev || !prev.matches(".frach-m-download-list__hdl, h1, h2, h3, h4, h5, h6")) return null;
    const level = /^H[1-6]$/.test(prev.tagName) ? prev.tagName.toLowerCase() : "h6";
    const h = document.createElement(level);
    h.textContent = clean(prev.textContent);
    prev.remove();
    return h;
  }
  function parse8(element, { document, params }) {
    const cell = [];
    if (element.matches(".frach-m-download-list")) {
      const h = groupHeading(document, element);
      const ul = downloadList(document, element);
      if (ul) cell.push(...h ? [h, ul] : [ul]);
    } else if (element.querySelector(".frach-m-download-list")) {
      cell.push(...componentContent(document, element));
    }
    if (!cell.length) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "downloads", cells: [[cell]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards.js
  var DATE = /^\s*\d{1,2}\.\d{1,2}\.\d{4}\s*$/;
  function contactCell(document, col) {
    const cell = [];
    const img = makeImage(document, col);
    if (img) cell.push(para(document, img));
    const info = col.querySelector("address, .frach-m-contact__info");
    if (info) cell.push(...textContent(document, info));
    return cell;
  }
  function parse9(element, { document, params }) {
    const isContact = !!element.querySelector(".frach-m-contact") || element.matches(".frach-m-contact-list");
    const row = isContact ? element.querySelector(".frach-m-contact-list .frach-grid-row") || findRoot(element, ".frach-grid-row") : findRoot(element, ".frach-grid-row");
    let cols = gridColumns(row);
    if (!cols.length) cols = [row];
    const cells = [];
    let dated = false;
    cols.forEach((col) => {
      const cell = isContact ? contactCell(document, col) : imageTextCard(document, col);
      if (!cell.length) return;
      const firstText = cell.find((n) => n.tagName === "P" && clean(n.textContent));
      if (!isContact && firstText && DATE.test(firstText.textContent)) dated = true;
      cells.push([cell]);
    });
    let name = "cards";
    if (isContact) name = "cards (contact)";
    else if (dated) name = "cards (dated)";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-sidebar.js
  var RAW_TABLE_ATTR = "data-excat-raw-table";
  function parse10(element, { document, params }) {
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
  function parse11(element, { document, params }) {
    const row = sidebarRow(element, params);
    if (row) {
      parse10(row, { document, params });
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

  // tools/importer/parsers/cta.js
  function parse12(element, { document, params }) {
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

  // tools/importer/parsers/link-box.js
  function panelContent(document, box) {
    const out = [];
    const editorial = box.querySelector(".frach-m-link-box__editorial") || box;
    normalizeContent(document, editorial);
    const walk = (node) => {
      [...node.children].forEach((c) => {
        if (/^H[1-6]$/.test(c.tagName)) {
          const h = headingFrom(document, c);
          if (clean(h.textContent)) out.push(h);
        } else if (c.matches("ul, ol")) {
          const list = document.createElement(c.tagName.toLowerCase());
          c.querySelectorAll(":scope > li").forEach((li) => {
            const a = li.querySelector("a[href]");
            const item = document.createElement("li");
            if (a) item.append(link(document, a.getAttribute("href"), a.textContent));
            else item.textContent = clean(li.textContent);
            if (clean(item.textContent)) list.append(item);
          });
          if (list.children.length) out.push(list);
        } else if (c.matches(".frach-m-link-box__cta")) {
          c.querySelectorAll("a[href]").forEach((a) => {
            const label = a.querySelector(".frach-e-button__label") || a;
            if (!clean(label.textContent)) return;
            const strong = document.createElement("strong");
            strong.append(link(document, a.getAttribute("href"), label.textContent));
            out.push(para(document, strong));
          });
        } else if (c.matches("p")) {
          if (clean(c.textContent)) out.push(c);
        } else if (c.matches("dl")) {
          c.querySelectorAll("dt").forEach((dt) => {
            const p = document.createElement("p");
            const strong = document.createElement("strong");
            strong.textContent = clean(dt.textContent);
            p.append(strong);
            let dd = dt.nextElementSibling;
            while (dd && dd.tagName === "DD") {
              p.append(document.createTextNode(" "), ...dd.childNodes);
              dd = dd.nextElementSibling;
            }
            if (clean(p.textContent)) out.push(p);
          });
        } else walk(c);
      });
    };
    walk(editorial);
    return out;
  }
  function parse13(element, { document, params }) {
    const box = element.matches(".frach-m-link-box") ? element : element.querySelector(".frach-m-link-box");
    if (!box) return;
    const row = element.matches(".frach-grid-row") ? element : element.querySelector(".frach-grid-row");
    const cols = row ? gridColumns(row) : [];
    const boxCol = cols.find((c) => c.contains(box));
    const others = cols.filter((c) => c !== boxCol);
    const cardRows = [];
    let imageCell = [];
    others.forEach((col) => {
      col.querySelectorAll(".frach-m-card").forEach((card) => {
        const cell = cardComponent(document, card);
        if (cell.length) cardRows.push([cell]);
      });
      if (!col.querySelector(".frach-m-card")) {
        col.querySelectorAll("frach-m-image").forEach((img) => {
          imageCell.push(...imageComponent(document, img));
        });
      }
    });
    imageCell = imageCell.map((n) => {
      if (n.dataset) delete n.dataset.caption;
      return n;
    });
    const panel = panelContent(document, box);
    const grey = element.matches(".frach-h-bg--grey") || !!element.closest(".frach-h-bg--grey");
    const light = grey && imageCell.length > 0;
    let cells;
    if (light) cells = [[imageCell, panel]];
    else cells = [[[...imageCell, ...panel]]];
    const block = WebImporter.Blocks.createBlock(document, { name: light ? "link-box (light)" : "link-box", cells });
    if (cardRows.length) {
      const cards = WebImporter.Blocks.createBlock(document, { name: "cards", cells: cardRows });
      const frag = document.createDocumentFragment();
      frag.append(cards, block);
      element.replaceWith(frag);
      return;
    }
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns.js
  function hasCol(col, n) {
    return new RegExp(`(^|\\s)frach-grid-col-mq3-${n}(\\s|$)`).test(col.className || "");
  }
  function parse14(element, { document, params }) {
    const row = findRoot(element, ".frach-grid-row");
    let cols = gridColumns(row);
    if (!cols.length) cols = [row];
    const cellContents = cols.map((col) => componentContent(document, col)).filter((c) => c.length);
    const classes = [];
    const greyBand = element.matches(".frach-h-bg--grey") || !!element.closest(".frach-h-bg--grey");
    if (element.closest(".frach-m-accordion__section-inner")) classes.push("grey");
    else if (greyBand) classes.push("light");
    if (cols.length === 2 && (hasCol(cols[0], 4) && hasCol(cols[1], 8) || hasCol(cols[0], 8) && hasCol(cols[1], 4))) {
      classes.push("one-third");
    }
    cellContents.forEach((c) => c.forEach((n) => {
      if (n.dataset && n.dataset.caption) delete n.dataset.caption;
    }));
    const name = classes.length ? `columns (${classes.join(", ")})` : "columns";
    const cells = [cellContents.length ? cellContents : [""]];
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
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
  function parse15(element, { document, params }) {
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
  function parse16(element, { document, params }) {
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
        parse15(slider, { document, params });
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

  // tools/importer/parsers/accordion.js
  var AUTO_ID = /^(accordionrow[\w-]*|accordion-[0-9a-f]+)$/i;
  var NESTED = [
    ["frach-e-table", parse11],
    [".frach-m-download-list", parse8],
    [".frach-m-contact-list", parse9],
    [".frach-m-cta", parse12],
    [".frach-m-link-box", parse13],
    // image galleries (tiles + lightbox) -> image-gallery-tiles, so the lightbox's full-size
    // images do not stay behind as stacked default content in the panel
    ["frach-m-image-gallery-tiles, .frach-m-image-gallery", parse16]
  ];
  function convertNested(document, inner, params) {
    NESTED.forEach(([selector, parser, resolve]) => {
      let guard = 0;
      const next = () => [...inner.querySelectorAll(selector)].find((n) => !n.closest("[data-acc-done], table"));
      let el = next();
      while (el && guard < 50) {
        guard += 1;
        const target = resolve ? resolve(el) : el;
        try {
          parser(target, { document, params });
        } catch (e) {
        }
        if (target.isConnected && inner.contains(target)) target.setAttribute("data-acc-done", "");
        el = next();
      }
    });
    [...inner.querySelectorAll(".frach-grid-row")].forEach((row) => {
      if (!row.isConnected || row.closest("table") || gridColumns(row).length < 2) return;
      if (row.parentElement && row.parentElement.closest(".frach-grid-row") && inner.contains(row.parentElement.closest(".frach-grid-row"))) return;
      try {
        parse14(row, { document, params });
      } catch (e) {
      }
    });
    inner.querySelectorAll("[data-acc-done]").forEach((n) => n.removeAttribute("data-acc-done"));
  }
  function isOpen(item) {
    const input = item.querySelector(".frach-m-accordion__input");
    const toggle = item.querySelector(".frach-m-accordion__toggle");
    return !!(input && input.hasAttribute("checked") || toggle && toggle.getAttribute("aria-expanded") === "true" || /(^|\s)frach-state-active(\s|$)/.test(item.getAttribute("class") || ""));
  }
  function hasFollowingItem(item) {
    const acc = item.closest("frach-m-accordion, .frach-m-accordion__accordion-container");
    const scope = acc || item.parentElement;
    if (!scope) return false;
    return [...scope.querySelectorAll(".frach-m-accordion__section")].some((s) => s !== item && !item.contains(s) && item.compareDocumentPosition(s) & 4);
  }
  function parse17(element, { document, params }) {
    const scope = element.matches("frach-m-accordion") ? element : element.querySelector("frach-m-accordion") || element;
    let items = [...scope.querySelectorAll(".frach-m-accordion__section")].filter((s) => {
      const parentInner = s.parentElement && s.parentElement.closest(".frach-m-accordion__section-inner");
      return !parentInner || !scope.contains(parentInner);
    });
    if (scope.matches(".frach-m-accordion__section")) items = [scope];
    if (!items.length) {
      const up = element.closest(".frach-m-accordion__section");
      if (up) items = [up];
    }
    const frag = document.createDocumentFragment();
    if (!items.length) {
      convertNested(document, element, params);
      normalizeContent(document, element);
      const content = [...element.childNodes];
      frag.append(WebImporter.Blocks.createBlock(document, { name: "accordion", cells: [[""]] }), ...content);
      frag.append(document.createElement("hr"));
      element.replaceWith(frag);
      return;
    }
    const last = items[items.length - 1];
    const closesGroup = !hasFollowingItem(last);
    items.forEach((item) => {
      const labelEl = item.querySelector(".frach-m-accordion__toggle-label") || item.querySelector(".frach-m-accordion__toggle");
      const label = labelEl ? clean(labelEl.textContent) : "";
      const input = item.querySelector(".frach-m-accordion__input");
      const id = input && input.id && !AUTO_ID.test(input.id) ? input.id : "";
      const inner = item.querySelector(".frach-m-accordion__section-inner") || item.querySelector(".frach-m-accordion__section-content");
      const options = [];
      if (isOpen(item)) options.push("open");
      if (inner && inner.querySelector(".frach-m-download-list")) options.push("grey");
      else if (inner && inner.querySelector(".frach-m-contact")) options.push("shadow");
      const name = options.length ? `accordion (${options.join(", ")})` : "accordion";
      frag.append(WebImporter.Blocks.createBlock(document, { name, cells: [[label, id]] }));
      if (inner) {
        inner.querySelectorAll("input.frach-m-accordion__input, label.frach-m-accordion__toggle").forEach((n) => n.remove());
        convertNested(document, inner, params);
        normalizeContent(document, inner);
        if (clean(inner.textContent) || inner.querySelector("img, iframe, video, table")) {
          const panel = document.createElement("div");
          panel.append(...inner.childNodes);
          frag.append(panel);
        }
      }
    });
    if (closesGroup) frag.append(document.createElement("hr"));
    element.replaceWith(frag);
  }

  // tools/importer/parsers/key-figures.js
  var KF = "frach-m-key-figures, .frach-m-key-figures, frach-m-pictogram-key-figures";
  function parse18(element, { document, params }) {
    const lang = pageLang(document, params);
    const kfs = element.matches(KF) ? [element] : [...element.querySelectorAll(KF)].filter((k) => !k.parentElement.closest(KF));
    const hasItems = !!element.querySelector(".frach-m-pictogram-key-figures__item, .frach-m-key-figures__number");
    const kf = kfs.length > 1 || !kfs.length && hasItems ? element : kfs[0];
    const pictograms = !!(kf && (kf.matches("frach-m-pictogram-key-figures") || kf.querySelector(".frach-m-pictogram-key-figures__item")));
    const rows = [];
    let textCell = [];
    let variant = "";
    if (kf) {
      kf.querySelectorAll(".frach-m-key-figures__number").forEach((n) => {
        const value = animatedNumber(n.querySelector("frach-e-animated-number, .frach-m-key-figures__number-value"), lang);
        const caption = n.querySelector(".frach-m-key-figures__number-text");
        if (!value && !(caption && clean(caption.textContent))) return;
        rows.push([value, caption ? clean(caption.textContent) : ""]);
      });
      kf.querySelectorAll(".frach-m-pictogram-key-figures__item").forEach((item) => {
        const img = makeImage(document, item.querySelector(".frach-m-pictogram-key-figures__item-pictogram") || item);
        const value = animatedNumber(item.querySelector("frach-e-animated-number"), lang);
        const captionEl = item.querySelector(".frach-m-pictogram-key-figures__item-text");
        const caption = [];
        if (captionEl && clean(captionEl.textContent)) caption.push(para(document, document.createTextNode(clean(captionEl.textContent))));
        item.querySelectorAll(".frach-m-pictogram-key-figures__info-text").forEach((info) => {
          if (clean(info.textContent)) caption.push(para(document, document.createTextNode(clean(info.textContent))));
        });
        const comp = item.closest("frach-m-pictogram-key-figures");
        const compItems = comp ? [...comp.querySelectorAll(".frach-m-pictogram-key-figures__item")] : [];
        const legend = comp && compItems[compItems.length - 1] === item && comp.querySelector(".frach-m-pictogram-key-figures__legend");
        if (legend && clean(legend.textContent)) caption.push(para(document, document.createTextNode(clean(legend.textContent))));
        rows.push(img ? [para(document, img), value, caption] : [value, caption]);
      });
      const text = kf.querySelector(".frach-m-key-figures__text");
      if (text && clean(text.textContent)) {
        const h = text.querySelector(".frach-m-key-figures__headline, h1, h2, h3, h4, h5, h6");
        if (h && clean(h.textContent)) textCell.push(headingFrom(document, h));
        const copies = [...text.querySelectorAll(".frach-m-key-figures__copy, p")];
        copies.filter((p) => !copies.some((o) => o !== p && p.contains(o))).forEach((p) => {
          if (p !== h && !p.closest(".frach-m-key-figures__headline") && clean(p.textContent)) textCell.push(paraFrom(document, p));
        });
        variant = rows.length > 1 ? "with-text, with-text-4" : "with-text";
      }
      if (kf.querySelector(".frach-m-key-figures__exchange-data-wrapper") && !variant) variant = "stock";
      kfs.forEach((k) => {
        if (k !== element) k.remove();
      });
    }
    if (!textCell.length && !element.matches(KF) && (kfs.length || !hasItems)) {
      const extra = componentContent(document, element);
      if (extra.length) {
        textCell = extra;
        variant = pictograms ? "with-text-3" : "with-text";
      }
    }
    const greyBand = element.matches(".frach-h-bg--grey") || !!element.closest(".frach-h-bg--grey");
    if (greyBand && pictograms && variant !== "stock") variant = variant ? `light, ${variant}` : "light";
    const width = Math.max(0, ...rows.map((r) => r.length));
    rows.forEach((r) => {
      while (r.length < width) r.splice(r.length - 1, 0, "");
    });
    const cells = [];
    if (textCell.length) cells.push([textCell]);
    cells.push(...rows);
    if (!cells.length) cells.push([""]);
    const name = variant ? `key-figures (${variant})` : "key-figures";
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed.js
  function iframeSrc(iframe) {
    const src = bestSrc(iframe) || iframe.getAttribute("data-url") || "";
    const yt = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/);
    if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
    return src;
  }
  function playerCell(document, iframe) {
    const src = iframeSrc(iframe);
    if (!src) return null;
    const title = clean(iframe.getAttribute("title")) || src;
    return [para(document, link(document, src, title))];
  }
  function cellFor(document, scope) {
    const iframes = scope.matches("iframe") ? [scope] : [...scope.querySelectorAll("iframe")];
    const textish = scope.querySelector(".frach-m-text, .cmp-text, frach-m-image");
    if (iframes.length === 1 && !textish) return playerCell(document, iframes[0]);
    if (!iframes.length && !textish) return null;
    return componentContent(document, scope);
  }
  function parse19(element, { document, params }) {
    restoreIframes(document, element);
    const row = element.matches(".frach-grid-row") ? element : element.querySelector(".frach-grid-row");
    let scopes = row ? gridColumns(row) : [];
    if (!scopes.length) scopes = [element];
    const frames = element.matches("iframe") ? [element] : [...element.querySelectorAll("iframe")];
    const wall = frames.some((f) => /walls\.io/i.test(iframeSrc(f)));
    const cellsRow = scopes.map((s) => cellFor(document, s)).filter((c) => c && c.length);
    if (!cellsRow.length) {
      element.remove();
      return;
    }
    const cells = [cellsRow];
    const block = WebImporter.Blocks.createBlock(document, { name: wall ? "embed (wall)" : "embed", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/form.js
  var TYPES = ["text", "email", "tel", "number", "date", "textarea", "select", "radio", "checkbox"];
  var UNIT = 'frach-m-input-group, frach-e-text-input, frach-e-textarea, frach-e-select, frach-e-checkbox, .forminfotext, p.requiredtext, button[type="submit"], input[type="submit"], fieldset > legend';
  function splitRequired(text, input) {
    let label = clean(text);
    let required = !!(input && (input.required || input.getAttribute("aria-required") === "true"));
    if (/\*\s*$/.test(label)) {
      required = true;
      label = label.replace(/\s*\*\s*$/, "");
    }
    return { label, required: required ? "yes" : "" };
  }
  function labelText(unit) {
    const lbl = unit.querySelector(".frach-e-input__label-text, label.frach-e-input__label, label");
    const input = unit.querySelector("input, textarea, select");
    const text = lbl && clean(lbl.textContent) || input && (input.getAttribute("placeholder") || input.getAttribute("aria-label") || input.getAttribute("name")) || "";
    return { text, input };
  }
  var ownerUnit = (node) => node.parentElement && node.parentElement.closest(UNIT);
  function inNestedContainer(node, unit) {
    const fc = node.closest(".formcontainer");
    return !!(fc && fc !== unit && unit.contains(fc));
  }
  function isCaptcha(unit) {
    const fc = unit.closest(".formcomponent");
    const input = unit.querySelector('input:not([type="hidden"])');
    return unit.matches(".captcha") || !!unit.querySelector("img.captchaimg") || /captcha/i.test(fc && fc.getAttribute("data-id") || "") || /captcha/i.test(input && input.getAttribute("name") || "");
  }
  function helpRow(document, unit) {
    const msg = [...unit.querySelectorAll(".frach-e-input__message--info")].find((m) => m.closest(UNIT) === unit && !inNestedContainer(m, unit));
    if (!msg) return null;
    const copy = msg.cloneNode(true);
    copy.querySelectorAll(".ffvalidation").forEach((n) => n.remove());
    const text = clean(copy.textContent);
    if (!text) return null;
    const p = document.createElement("p");
    p.textContent = text;
    return [[p], "plaintext", "", ""];
  }
  function fieldRow(document, unit) {
    const row = baseRow(document, unit);
    if (!row || unit.matches('button, input[type="submit"], .forminfotext, p.requiredtext')) return row;
    const help = helpRow(document, unit);
    if (!help) return row;
    return { rows: [...row.rows || [row], help] };
  }
  function baseRow(document, unit) {
    if (unit.matches('button, input[type="submit"]')) {
      const lbl = unit.querySelector(".frach-e-button__label") || unit;
      const text2 = clean(lbl.textContent) || unit.getAttribute("value") || "Absenden";
      return [text2, "submit", "", ""];
    }
    if (unit.matches("legend")) {
      const text2 = clean(unit.textContent);
      if (!text2) return null;
      const h = document.createElement("h4");
      h.textContent = text2;
      return [[h], "plaintext", "", ""];
    }
    if (unit.matches(".forminfotext, p.requiredtext")) {
      const box = document.createElement("div");
      if (unit.matches("p.requiredtext")) {
        const p = document.createElement("p");
        p.textContent = clean([...unit.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(" "));
        if (!clean(p.textContent)) return null;
        box.append(p);
      } else {
        normalizeContent(document, unit);
        unit.querySelectorAll("br").forEach((br) => {
          if (!br.nextSibling || !clean(br.nextSibling.textContent || "")) br.remove();
        });
        box.append(...unit.childNodes);
      }
      if (!clean(box.textContent)) return null;
      return [[...box.childNodes], "plaintext", "", ""];
    }
    if (unit.matches("frach-m-input-group")) {
      const legend = unit.querySelector("legend, h1, h2, h3, h4, h5, h6, .frach-m-input-group__headline");
      const inputs = [...unit.querySelectorAll('input[type="radio"], input[type="checkbox"]')].filter((inp) => inp.closest("frach-m-input-group") === unit && !inNestedContainer(inp, unit));
      if (!inputs.length) return null;
      const type2 = inputs[0].type === "checkbox" ? "checkbox" : "radio";
      const options = inputs.map((inp) => {
        const l = unit.querySelector(`label[for="${inp.id}"]`) || inp.closest("frach-e-radio-button, frach-e-checkbox");
        return clean(l && l.textContent || inp.value).replace(/,/g, " ");
      }).filter(Boolean);
      const { label: label2, required: required2 } = splitRequired(legend ? legend.textContent : inputs[0].name, inputs[0]);
      return [label2, type2, options.join(", "), required2];
    }
    const { text, input } = labelText(unit);
    if (!input || input.type === "hidden") return null;
    if (input.type === "file") {
      const lbl = unit.querySelector(":scope > .label, span.label");
      const zone = unit.querySelector(".ff_uploadzone");
      let labelSrc = lbl ? clean(lbl.textContent) : "";
      if (!labelSrc) {
        const copy = unit.cloneNode(true);
        copy.querySelectorAll(".ff_uploadzone, .frach-e-input__message, a, frach-e-icon").forEach((n) => n.remove());
        labelSrc = clean(copy.textContent) || text;
      }
      const { label: label2, required: required2 } = splitRequired(labelSrc, input);
      const rows = [[label2 || "Datei", "text", "", required2]];
      const hint = zone && [...zone.querySelectorAll(".ff_filetypeinfo, .ff_uploadinfo")].map((n) => clean([...n.childNodes].map((c) => c.nodeName === "BR" ? " " : c.textContent).join(" "))).filter(Boolean).join(" ");
      if (hint) {
        const p = document.createElement("p");
        p.textContent = hint;
        rows.push([[p], "plaintext", "", ""]);
      }
      return { rows };
    }
    const { label, required } = splitRequired(text, input);
    if (unit.matches("frach-e-select") || input.tagName === "SELECT") {
      const opts = [...unit.querySelectorAll("option")].filter((o) => o.value !== "" && clean(o.textContent)).map((o) => clean(o.textContent).replace(/,/g, " "));
      return [label, "select", opts.join(", "), required];
    }
    if (unit.matches("frach-e-textarea") || input.tagName === "TEXTAREA") return [label, "textarea", "", required];
    if (unit.matches("frach-e-checkbox") || input.type === "checkbox") return [label, "checkbox", "", required];
    const type = TYPES.includes(input.type) ? input.type : "text";
    return [label, type, "", required];
  }
  function parse20(element, { document, params }) {
    const forms = element.matches("form") ? [element] : [...element.querySelectorAll("form")];
    const scopes = forms.length ? forms : [element];
    const cells = [];
    scopes.forEach((form) => {
      const units = [...form.querySelectorAll(UNIT)];
      const seenInputs = /* @__PURE__ */ new Set();
      const isRow = (u) => {
        const owner = ownerUnit(u);
        return !owner || inNestedContainer(u, owner) && isRow(owner);
      };
      units.filter(isRow).filter((u) => !isCaptcha(u)).filter((u) => {
        const input = u.matches("input") ? u : u.querySelector('input:not([type="hidden"]), textarea, select');
        if (!input) return true;
        if (seenInputs.has(input) || input.id && seenInputs.has(input.id)) return false;
        seenInputs.add(input);
        if (input.id) seenInputs.add(input.id);
        return true;
      }).forEach((u) => {
        const result = fieldRow(document, u);
        if (!result) return;
        (result.rows || [result]).forEach((row) => pushRow(row));
      });
    });
    function pushRow(row) {
      const text = (r) => clean(Array.isArray(r[0]) ? r[0].map((n) => n.textContent).join(" ") : r[0]);
      const prev = cells[cells.length - 1];
      if (prev && row[1] === "plaintext" && prev[1] === "plaintext" && text(prev) === text(row)) return;
      cells.push(row);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "form", cells: cells.length ? cells : [[""]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/testimonial.js
  function textP(document, text) {
    return para(document, document.createTextNode(clean(text)));
  }
  function pictureParagraph(document, scope) {
    const img = makeImage(document, scope);
    if (!img) return null;
    const href = imageLink(scope);
    if (href && href !== "#" && !/^javascript:/i.test(href)) {
      const a = document.createElement("a");
      a.setAttribute("href", absUrl2(href));
      a.append(img);
      return para(document, a);
    }
    return para(document, img);
  }
  function parse21(element, { document, params }) {
    const cell = [];
    let variant = "";
    const t = element.matches(".frach-m-testimonial") ? element : element.querySelector(".frach-m-testimonial");
    if (t) {
      variant = "text-over-image";
      const pic = pictureParagraph(document, t.querySelector(".frach-m-testimonial__image") || t);
      if (pic) cell.push(pic);
      const meta = t.querySelector(".frach-m-testimonial__meta");
      const headline = t.querySelector(".frach-m-testimonial__quote-headline");
      if (meta && clean(meta.textContent)) {
        cell.push(textP(document, meta.textContent));
        if (headline && clean(headline.textContent)) cell.push(textP(document, headline.textContent));
      } else if (headline && clean(headline.textContent)) {
        cell.push(textP(document, headline.textContent));
      }
      t.querySelectorAll(".frach-m-testimonial__quote-text, blockquote").forEach((q) => {
        if (!clean(q.textContent) || q.parentElement.closest("blockquote")) return;
        const bq = document.createElement("blockquote");
        bq.append(textP(document, q.textContent));
        cell.push(bq);
      });
    } else {
      const imageComp = element.querySelector("frach-m-image");
      const pic = imageComp ? pictureParagraph(document, imageComp) : null;
      if (pic) cell.push(pic);
      const cap = imageComp && imageComp.querySelector("figcaption, .frach-m-image__caption");
      const pull = element.querySelector("blockquote.frach-e-pull-quote, .frach-m-text-media__media-quote blockquote");
      const author = pull && pull.querySelector(".frach-e-pull-quote__author");
      const caption = clean(cap && cap.textContent || author && author.textContent || "");
      if (caption) cell.push(textP(document, caption));
      element.querySelectorAll(".frach-m-text").forEach((txt) => {
        if (imageComp && imageComp.contains(txt)) return;
        textContent(document, txt).forEach((n) => {
          if (/^H[1-6]$/.test(n.tagName)) cell.push(textP(document, n.textContent));
          else cell.push(n);
        });
      });
      if (pull) {
        const q = pull.querySelector(".frach-e-pull-quote__quote") || pull;
        const bq = document.createElement("blockquote");
        bq.append(textP(document, q.textContent));
        cell.push(bq);
      }
    }
    const name = variant ? `testimonial (${variant})` : "testimonial";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: [[cell.length ? cell : ""]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-topic.js
  var slug = (s) => s.toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tab";
  var COMPLEX = "table, frach-m-accordion, .frach-m-download-list, frach-e-table, frach-m-key-figures, frach-m-pictogram-key-figures, iframe, frach-m-embed, form, .fraformsform, frach-m-image-gallery-tiles, .frach-m-image-gallery, .frach-m-contact, .frach-m-card, frach-m-teaser-slider, .frach-m-cta, .frach-m-link-box, frach-m-milestones, frach-e-lazy-image, img, frach-m-image";
  var NESTED2 = [
    ["frach-m-accordion", parse17],
    ["frach-m-milestones > .frach-m-slider", parse15],
    ["frach-m-image-gallery-tiles, .frach-m-image-gallery", parse16],
    [".fraformsform, form", parse20],
    ["frach-m-key-figures, frach-m-pictogram-key-figures", parse18],
    ["frach-e-table", parse11],
    [".frach-m-download-list", parse8, (el) => el.closest(".frach-grid-row") || el],
    [".frach-m-contact-list", parse9],
    [".frach-m-cta", parse12],
    [".frach-m-link-box", parse13],
    [".frach-m-testimonial", parse21, (el) => el.closest("section.frach-h-component-margin") || el],
    ["frach-m-embed, iframe", parse19, (el) => el.closest("section.frach-h-component-margin") || el]
  ];
  function pagePath2(params, document) {
    const candidates = [params && params.originalURL, document && document.URL];
    for (const c of candidates) {
      try {
        const u = new URL(c);
        if (!/^https?:$/.test(u.protocol)) continue;
        return u.pathname.replace(/\/$/, "").replace(/\.html?$/, "") || "/index";
      } catch (e) {
      }
    }
    return "/page";
  }
  function convertNested2(document, container, params) {
    NESTED2.forEach(([selector, parser, resolve]) => {
      let guard = 0;
      let el = container.querySelector(selector);
      while (el && guard < 50) {
        guard += 1;
        const target = resolve ? resolve(el) : el;
        const scope = container.contains(target) ? target : el;
        try {
          parser(scope, { document, params });
        } catch (e) {
        }
        if (scope.isConnected && container.contains(scope)) scope.setAttribute("data-tabs-done", "");
        el = [...container.querySelectorAll(selector)].find((n) => !n.closest("[data-tabs-done]") && !n.closest("table"));
      }
    });
    [...container.querySelectorAll(".frach-grid-row")].forEach((row) => {
      if (!row.isConnected || row.closest("table") || gridColumns(row).length < 2) return;
      try {
        parse14(row, { document, params });
      } catch (e) {
      }
    });
    container.querySelectorAll("[data-tabs-done]").forEach((n) => n.removeAttribute("data-tabs-done"));
  }
  function parse22(element, { document, params }) {
    const nav = element.matches("frach-m-tab-navigation") ? element : element.querySelector("frach-m-tab-navigation") || element;
    const tabbed = nav.closest("frach-m-tabbed-content, .frach-m-tabbed-content") || (element.matches("frach-m-tabbed-content") ? element : null);
    const panels = tabbed ? [...tabbed.querySelectorAll(".frach-m-tabbed-content__panel")].filter((p) => p.closest("frach-m-tabbed-content, .frach-m-tabbed-content") === tabbed) : [];
    const tabs = [...nav.querySelectorAll('a.frach-m-tab-navigation__tab, [role="tab"]')];
    const base = pagePath2(params || {}, document);
    const cells = [];
    const used = /* @__PURE__ */ new Set();
    tabs.forEach((tab, i) => {
      const label = clean(tab.textContent);
      if (!label) return;
      let id = (tab.getAttribute("href") || "").replace(/^#/, "");
      try {
        id = decodeURIComponent(id);
      } catch (e) {
      }
      const panel = panels.find((p) => p.id === id || p.getAttribute("aria-labelledby") === tab.id) || panels[i];
      if (!panel || used.has(panel)) {
        cells.push([label]);
        return;
      }
      used.add(panel);
      const complex = !!panel.querySelector(COMPLEX) || [...panel.querySelectorAll(".frach-grid-row")].some((r) => gridColumns(r).length > 1);
      if (!complex) {
        const content2 = componentContent(document, panel);
        cells.push([label, content2.length ? content2 : ""]);
        return;
      }
      const container = document.createElement("div");
      container.append(...panel.childNodes);
      const fragParams = __spreadProps(__spreadValues({}, params || {}), { fragments: params && params.fragments || [] });
      convertNested2(document, container, fragParams);
      const content = componentContent(document, container);
      const fragment = document.createElement("div");
      fragment.append(...content);
      const path = `/fragments${base}/${slug(label)}`;
      const safePath = WebImporter.FileUtils && WebImporter.FileUtils.sanitizePath ? WebImporter.FileUtils.sanitizePath(path) : path;
      if (params && Array.isArray(params.fragments)) params.fragments.push({ element: fragment, path: safePath });
      const a = document.createElement("a");
      a.setAttribute("href", safePath);
      a.textContent = safePath;
      cells.push([label, [para(document, a)]]);
    });
    const name = "tabs-topic";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [[""]] });
    element.replaceWith(block);
    panels.forEach((p) => {
      if (p.isConnected && !clean(p.textContent) && !p.querySelector("img, iframe, table")) p.remove();
    });
  }

  // tools/importer/parsers/newsroom-feed.js
  function dateTime(document, scope) {
    const out = [];
    const date = scope.querySelector(".frach-m-teaser-collection__list-item-date, .frach-m-card__date");
    if (!date) return out;
    const spans = [...date.querySelectorAll(":scope > span, time")];
    const time = date.querySelector("time");
    const d = clean(time ? time.textContent : spans[0] && spans[0].textContent || date.textContent);
    if (d) out.push(para(document, document.createTextNode(d)));
    const t = spans.map((s) => clean(s.textContent)).find((s) => /Uhr|\d{1,2}:\d{2}/.test(s) && s !== d);
    if (t) out.push(para(document, document.createTextNode(t)));
    return out;
  }
  function ctaParagraphs(document, scope) {
    return [...scope.querySelectorAll("a.frach-e-button[href]")].map((a) => {
      const label = a.querySelector(".frach-e-button__label") || a;
      if (!clean(label.textContent)) return null;
      const l = link(document, a.getAttribute("href"), label.textContent);
      const cls = a.className || "";
      let wrapped = l;
      if (/frach-e-button--primary/.test(cls)) {
        wrapped = document.createElement("strong");
        wrapped.append(l);
      } else if (/frach-e-button--secondary/.test(cls)) {
        wrapped = document.createElement("em");
        wrapped.append(l);
      }
      return para(document, wrapped);
    }).filter(Boolean);
  }
  function parse23(element, { document, params }) {
    const tc = element.matches(".frach-m-teaser-collection") ? element : element.querySelector(".frach-m-teaser-collection") || element;
    const cells = [];
    const before = [];
    const after = [];
    let thumbnails = false;
    const box = tc.querySelector(".frach-m-teaser-collection__link-box, .frach-m-link-box");
    const listItems = [...tc.querySelectorAll("a.frach-m-teaser-collection__list-item")];
    if (listItems.length) {
      thumbnails = true;
      listItems.forEach((item) => {
        const cell = [];
        const img = makeImage(document, item.querySelector(".frach-m-teaser-collection__list-item-image-wrapper") || item);
        if (img) cell.push(para(document, img));
        cell.push(...dateTime(document, item));
        const hl = item.querySelector(".frach-m-teaser-collection__list-item-headline");
        if (hl && clean(hl.textContent)) cell.push(para(document, link(document, item.getAttribute("href"), hl.textContent)));
        const desc = item.querySelector(".frach-m-teaser-collection__list-item-description");
        if (desc && clean(desc.textContent)) cell.push(para(document, document.createTextNode(clean(desc.textContent))));
        if (cell.length) cells.push([cell]);
      });
      const ctas = ctaParagraphs(document, tc);
      if (ctas.length) cells.push([ctas]);
    } else {
      const cardRows = [];
      tc.querySelectorAll(".frach-m-card").forEach((card) => {
        const a = card.querySelector("a[href]");
        const cell = [];
        const img = makeImage(document, card.querySelector(".frach-m-card__image-wrapper") || card);
        if (img) cell.push(para(document, img));
        cell.push(...dateTime(document, card).slice(0, 1));
        const theme = card.querySelector(".frach-m-teaser__theme");
        if (theme && clean(theme.textContent)) cell.push(para(document, document.createTextNode(clean(theme.textContent).replace(/\s+,/g, ","))));
        const h = card.querySelector("h1, h2, h3, h4, h5, h6");
        if (h) {
          const heading2 = document.createElement(h.tagName.toLowerCase());
          if (a) heading2.append(link(document, a.getAttribute("href"), h.textContent));
          else heading2.textContent = clean(h.textContent);
          cell.push(heading2);
        }
        if (cell.length) cardRows.push([cell]);
      });
      if (cardRows.length) before.push(WebImporter.Blocks.createBlock(document, { name: "cards (dated)", cells: cardRows }));
      if (box) {
        const title = box.querySelector("h1, h2, h3, h4, h5, h6");
        if (title && clean(title.textContent)) {
          const h = document.createElement(title.tagName.toLowerCase());
          h.textContent = clean(title.textContent);
          cells.push([h]);
        }
        box.querySelectorAll("a.frach-m-teaser-collection__link-box-item[href]").forEach((item) => {
          const cell = dateTime(document, item);
          const hl = item.querySelector(".frach-m-teaser-collection__link-box-item-headline");
          const text = clean(hl ? hl.textContent : item.textContent);
          if (text) cell.push(para(document, link(document, item.getAttribute("href"), text)));
          if (cell.length) cells.push([cell]);
        });
        const ctas = ctaParagraphs(document, box);
        if (ctas.length) cells.push([ctas]);
      }
    }
    const row = element.matches(".frach-grid-row") ? element : null;
    if (row) {
      gridColumns(row).filter((c) => !c.contains(tc)).forEach((c) => after.push(...componentContent(document, c)));
    }
    const name = thumbnails ? "newsroom-feed (thumbnails)" : "newsroom-feed";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [[""]] });
    if (before.length || after.length) {
      const frag = document.createDocumentFragment();
      frag.append(...before, block, ...after);
      element.replaceWith(frag);
      return;
    }
    element.replaceWith(block);
  }

  // tools/importer/parsers/text-media.js
  var MEDIA = "frach-m-image, frach-e-lazy-image, iframe, video, frach-e-lazy-video, frach-m-slider";
  function mediaCell(document, col) {
    const frame = col.querySelector("iframe");
    if (frame) {
      let src = bestSrc(frame);
      const yt = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/);
      if (yt) src = `https://www.youtube.com/watch?v=${yt[1]}`;
      return { cell: src ? [para(document, link(document, src, clean(frame.getAttribute("title")) || src))] : [], video: true };
    }
    const vsrc = col.querySelector("video source[src], source[data-src]");
    if (vsrc && bestSrc(vsrc)) {
      const src = bestSrc(vsrc);
      return { cell: [para(document, link(document, src, src))], video: true };
    }
    const images = makeImages(document, col);
    if (images.length > 1) return { cell: images.map((img) => para(document, img)), multi: true };
    const comp = col.querySelector("frach-m-image");
    if (comp) return { cell: imageComponent(document, comp).map((n) => {
      if (n.dataset) delete n.dataset.caption;
      return n;
    }) };
    return { cell: images.map((img) => para(document, img)) };
  }
  function quoteCell(document, t) {
    const cell = [];
    const imgScope = t.querySelector(".frach-m-testimonial__image-container, .frach-m-testimonial__image") || t;
    const img = makeImage(document, imgScope);
    if (img) {
      const tLink = t.querySelector("a.frach-m-testimonial__link[href]");
      const href = imageLink(imgScope) || (tLink ? tLink.getAttribute("href") : "");
      if (href && href !== "#" && !/^javascript:/i.test(href)) {
        const a = document.createElement("a");
        a.setAttribute("href", absUrl2(href));
        a.append(img);
        cell.push(para(document, a));
      } else cell.push(para(document, img));
    }
    const headline = t.querySelector(".frach-m-testimonial__quote-headline");
    if (headline && clean(headline.textContent)) cell.push(paraFrom(document, headline));
    t.querySelectorAll(".frach-m-testimonial__quote-text, blockquote").forEach((q) => {
      if (!clean(q.textContent) || q.parentElement.closest("blockquote")) return;
      const bq = document.createElement("blockquote");
      bq.append(paraFrom(document, q));
      cell.push(bq);
    });
    const meta = t.querySelector(".frach-m-testimonial__meta");
    if (meta && clean(meta.textContent)) cell.push(paraFrom(document, meta));
    return cell;
  }
  var colWidth = (c) => parseInt(((c.className || "").match(/frach-grid-col-mq3-(\d+)/) || [])[1] || "0", 10);
  function floatOptions(tm) {
    const cls = tm && tm.getAttribute && tm.getAttribute("class") || "";
    const out = [];
    if (/frach-m-text-media--left(\s|$)/.test(cls)) out.push("left");
    else if (/frach-m-text-media--right(\s|$)/.test(cls)) out.push("right");
    if (!out.length) return out;
    if (/frach-m-text-media--50-50(\s|$)/.test(cls)) out.push("half");
    else if (/frach-m-text-media--(33-66|66-33)(\s|$)/.test(cls)) out.push("third");
    return out;
  }
  var textLength = (c) => {
    const copy = c.cloneNode(true);
    copy.querySelectorAll("figcaption, .frach-m-image__caption, .frach-e-button__label, button, noscript, frach-e-icon, .frach-m-media-lightbox, .frach-m-overlay, .frach-m-image__icon-overlay, .frach-m-slider__controls").forEach((n) => n.remove());
    return clean(copy.textContent).length;
  };
  var hasMedia = (c) => !!c.querySelector(MEDIA);
  var isMediaCol = (c) => hasMedia(c) && textLength(c) < 2;
  function textMediaBlock(document, cols, opts = {}) {
    let media = null;
    let mediaCol = null;
    const textParts = opts.headline ? [headingFrom(document, opts.headline)] : [];
    cols.forEach((c) => {
      if (!mediaCol && opts.quote && c === opts.quote) {
        mediaCol = c;
        media = { cell: quoteCell(document, c.querySelector(".frach-m-testimonial") || c), quote: true };
      } else if (!mediaCol && !opts.quote && isMediaCol(c)) {
        mediaCol = c;
        media = mediaCell(document, c);
      } else textParts.push(...componentContent(document, c));
    });
    let options = opts.options || [];
    if (!options.length) {
      const textCols = cols.filter((c) => c !== mediaCol);
      const mediaFirst = mediaCol && cols[0] === mediaCol;
      const mw = mediaCol ? colWidth(mediaCol) : 0;
      const tw = textCols.length === 1 ? colWidth(textCols[0]) : 0;
      if (media && media.video) options = ["wide-media"];
      else if (media && media.multi) options = ["blue"];
      else if (media && media.quote) options = ["quote-overlay"];
      else if (media && mediaFirst && mw && tw) options = ["image-left"];
      else if (media && !mediaFirst && mw && tw && mw === tw) options = ["alt"];
    }
    const cells = [media && media.cell.length ? [media.cell, textParts] : [textParts.length ? textParts : ""]];
    const name = options.length ? `text-media (${options.join(", ")})` : "text-media";
    return WebImporter.Blocks.createBlock(document, { name, cells });
  }
  function componentBlock(document, tm, extraCols = []) {
    const { headline, media, text } = textMediaParts(tm);
    const parts = [media, text, ...extraCols].filter(Boolean);
    const options = extraCols.length || !(media && hasMedia(media)) ? [] : floatOptions(tm);
    return textMediaBlock(document, parts, { headline, options });
  }
  function topRows(element) {
    if (element.matches(".frach-grid-row")) return [element];
    return [...element.querySelectorAll(".frach-grid-row")].filter((r) => {
      const up = r.parentElement.closest(".frach-grid-row");
      return !up || !element.contains(up);
    });
  }
  function parse24(element, { document, params }) {
    const collection = element.matches("a.frach-m-teaser-collection__list-item") && element.closest(".frach-m-teaser-collection");
    if (collection) {
      parse23(collection, { document, params });
      return;
    }
    const out = [];
    const rows = topRows(element);
    if (!rows.length) {
      const tm = element.matches("frach-m-text-media") ? element : element.querySelector("frach-m-text-media");
      out.push(tm ? componentBlock(document, tm) : textMediaBlock(document, [element]));
    }
    rows.forEach((row) => {
      let cols = gridColumns(row);
      if (!cols.length) cols = [row];
      const mediaCols = cols.filter(isMediaCol);
      const quoteCols = cols.filter((c) => c.querySelector(".frach-m-testimonial") && !c.querySelector("frach-m-text-media"));
      const tmCols = cols.filter((c) => {
        const m = c.querySelector("frach-m-text-media .frach-m-text-media__media");
        return m && hasMedia(m);
      });
      if (quoteCols.length === 1 && cols.length === 2) {
        out.push(textMediaBlock(document, cols, { quote: quoteCols[0] }));
      } else if (!mediaCols.length && tmCols.length === 1 && cols.length >= 2) {
        const tm = tmCols[0].querySelector("frach-m-text-media");
        out.push(componentBlock(document, tm, cols.filter((c) => c !== tmCols[0])));
      } else if (mediaCols.length === 1 && cols.length >= 2) {
        out.push(textMediaBlock(document, cols));
      } else if (cols.length === 1) {
        const tm = cols[0].querySelector("frach-m-text-media");
        const tmMedia = tm && tm.querySelector(".frach-m-text-media__media");
        if (tm && tmMedia && hasMedia(tmMedia)) {
          out.push(componentBlock(document, tm));
        } else out.push(...componentContent(document, cols[0]));
      } else {
        if (row === element) {
          parse14(element, { document, params });
          return;
        }
        const holder = document.createElement("div");
        row.before(holder);
        holder.append(row);
        parse14(row, { document, params });
        out.push(...holder.childNodes);
        holder.remove();
      }
    });
    if (!element.isConnected && !out.length) return;
    if (!out.length) out.push(textMediaBlock(document, [element]));
    if (out.length === 1) {
      element.replaceWith(out[0]);
      return;
    }
    const frag = document.createDocumentFragment();
    frag.append(...out);
    element.replaceWith(frag);
  }

  // tools/importer/parsers/cards-teaser.js
  function parse25(element, { document, params }) {
    const seen = /* @__PURE__ */ new Set();
    const teasers = [...element.querySelectorAll(".frach-m-teaser")].filter((t) => !t.parentElement.closest(".frach-m-teaser")).filter((t) => {
      const h = t.querySelector(".frach-m-teaser__headline");
      const a = t.querySelector("a[href]");
      const key = `${clean(h && h.textContent)}|${a ? a.getAttribute("href") : ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const cells = [];
    if (!teasers.length) {
      const row = element.matches(".frach-grid-row") ? element : element.querySelector(".frach-grid-row");
      if (row && row.querySelector(".frach-e-pull-quote")) {
        parse24(element, { document, params });
        return;
      }
      gridColumns(row).forEach((col) => {
        const cell = imageTextCard(document, col);
        if (cell.length) cells.push([cell]);
      });
    }
    teasers.forEach((teaser) => {
      const cell = [];
      const imgWrap = teaser.querySelector(".frach-m-teaser__image-wrapper");
      const img = imgWrap ? makeImage(document, imgWrap) : null;
      if (img) cell.push(para(document, img));
      const theme = teaser.querySelector(".frach-m-teaser__theme");
      if (theme && clean(theme.textContent)) {
        cell.push(para(document, document.createTextNode(clean(theme.textContent).replace(/\s+,/g, ","))));
      }
      const cta = teaser.querySelector("a.frach-m-teaser__link[href], a.frach-e-button[href]");
      const headline = teaser.querySelector(".frach-m-teaser__headline");
      if (headline && clean(headline.textContent)) {
        const level = /^H[1-6]$/.test(headline.tagName) ? headline.tagName.toLowerCase() : "h6";
        const h = document.createElement(level);
        const ha = headline.querySelector("a[href]");
        const href = ha && ha.getAttribute("href") || cta && cta.getAttribute("href");
        if (href) h.append(link(document, href, headline.textContent));
        else h.textContent = clean(headline.textContent);
        cell.push(h);
      }
      teaser.querySelectorAll(".frach-m-teaser__text").forEach((t) => {
        if (clean(t.textContent)) cell.push(para(document, document.createTextNode(clean(t.textContent))));
      });
      if (cta) {
        const label = cta.querySelector(".frach-e-button__label") || cta;
        if (clean(label.textContent)) cell.push(para(document, link(document, cta.getAttribute("href"), label.textContent)));
      }
      if (cell.length) cells.push([cell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-teaser", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/share-price.js
  function parse26(element, { document, params }) {
    const lang = pageLang(document, params);
    const root = element.matches("frach-m-key-figures") ? element : element.querySelector("frach-m-key-figures:has(.frach-m-key-figures__exchange-data-wrapper)") || element.querySelector("frach-m-key-figures") || element;
    const textCell = [];
    const text = root.querySelector(".frach-m-key-figures__text");
    if (text) {
      const h = text.querySelector(".frach-m-key-figures__headline, h1, h2, h3, h4, h5, h6");
      if (h && clean(h.textContent)) {
        const heading2 = document.createElement(/^H[1-6]$/.test(h.tagName) ? h.tagName.toLowerCase() : "h3");
        heading2.textContent = clean(h.textContent);
        textCell.push(heading2);
      }
      text.querySelectorAll(".frach-m-key-figures__copy, p").forEach((p) => {
        if (p !== h && clean(p.textContent)) textCell.push(para(document, document.createTextNode(clean(p.textContent))));
      });
    }
    const wrap = root.querySelector(".frach-m-key-figures__exchange-data-wrapper") || root;
    const priceCell = [];
    const price = animatedNumber(wrap.querySelector("frach-e-animated-number, .frach-m-key-figures__number-value"), lang);
    if (price) priceCell.push(para(document, document.createTextNode(price)));
    const caption = wrap.querySelector(".frach-m-key-figures__number-text");
    if (caption && clean(caption.textContent)) priceCell.push(para(document, document.createTextNode(clean(caption.textContent))));
    const cells = [textCell.length ? [textCell, priceCell] : [priceCell]];
    const block = WebImporter.Blocks.createBlock(document, { name: "share-price", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/timeline.js
  function entryRow(document, item) {
    const year = clean((item.querySelector(".frach-m-timeline-item__timespan-value, .frach-m-timeline-item__timespan") || {}).textContent || "");
    const cell = [];
    const box = item.querySelector(".frach-m-timeline-item__content-box") || item;
    const img = makeImage(document, box);
    if (img) cell.push(para(document, img));
    const text = box.querySelector(".frach-m-timeline-item__text-box") || box;
    normalizeContent(document, text);
    [...text.querySelectorAll("h1, h2, h3, h4, h5, h6, p, ul, ol")].filter((n) => !n.parentElement.closest("p, ul, ol, h1, h2, h3, h4, h5, h6")).forEach((n) => {
      if (clean(n.textContent) || n.querySelector("img")) cell.push(n);
    });
    return [year, cell.length ? cell : ""];
  }
  function parse27(element, { document, params }) {
    const items = element.matches("frach-m-timeline-item") ? [element] : [...element.querySelectorAll("frach-m-timeline-item, .frach-m-timeline-item")].filter((n) => !n.parentElement.closest("frach-m-timeline-item, .frach-m-timeline-item"));
    let cells;
    let name = "timeline";
    if (items.length) {
      cells = items.map((item) => entryRow(document, item));
    } else {
      const row = element.matches(".frach-grid-row") ? element : element.querySelector(".frach-grid-row");
      const cols = row ? gridColumns(row) : [element];
      const rowCells = cols.map((c) => componentContent(document, c)).filter((c) => c.length);
      cells = [rowCells.length ? rowCells : [""]];
      name = "timeline (shadow)";
    }
    const block = WebImporter.Blocks.createBlock(document, { name, cells });
    if (element.matches("frach-m-timeline-item") && name === "timeline") {
      let prev = element.previousElementSibling;
      while (prev && prev.tagName !== "TABLE" && !clean(prev.textContent) && !prev.querySelector("img")) prev = prev.previousElementSibling;
      const head = prev && prev.tagName === "TABLE" ? prev.querySelector("tr") : null;
      if (head && /^timeline$/i.test(clean(head.textContent))) {
        const rows = [...block.querySelectorAll("tr")].slice(1);
        rows.forEach((tr) => head.parentElement.append(tr));
        element.remove();
        return;
      }
    }
    element.replaceWith(block);
  }

  // tools/importer/parsers/operating-direction.js
  function parse28(element, { document, params }) {
    const widget = element.querySelector(".betriebsrichtungsanzeige");
    if (!widget) return;
    const graphicCell = [];
    const fallback = widget.querySelector("#fallback img, img");
    const img = fallback ? makeImage(document, fallback) : null;
    if (img) graphicCell.push(para(document, img));
    const statusCell = [];
    let stand = null;
    const status = widget.querySelector("#betriebsrichtung") || widget;
    status.querySelectorAll("h1, h2, h3, h4, h5, h6, p").forEach((n) => {
      const text = clean(n.textContent);
      if (!text) return;
      if (/^H[1-6]$/.test(n.tagName)) {
        const h = document.createElement("h3");
        h.textContent = text;
        statusCell.push(h);
        return;
      }
      if (/^(Stand|As of)\b/i.test(text)) {
        stand = para(document, document.createTextNode(text));
        return;
      }
      const p = document.createElement("p");
      [...n.childNodes].forEach((c) => {
        if (c.nodeName === "BR") p.append(document.createElement("br"));
        else if (clean(c.textContent)) p.append(document.createTextNode(clean(c.textContent)));
      });
      statusCell.push(p);
    });
    if (stand) statusCell.push(stand);
    const row = element.matches(".frach-grid-row") ? element : element.querySelector(".frach-grid-row");
    const textCell = [];
    gridColumns(row).filter((c) => !c.contains(widget)).forEach((c) => textCell.push(...componentContent(document, c)));
    const rowCells = [graphicCell, statusCell, textCell].filter((c) => c.length);
    const block = WebImporter.Blocks.createBlock(document, { name: "operating-direction", cells: [rowCells.length ? rowCells : [""]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tiles.js
  function tilesOfColumn(document, col) {
    const tiles = [];
    let current = null;
    const comps = [...col.querySelectorAll("frach-m-image, .frach-m-text")].filter((c) => !c.parentElement.closest("frach-m-image, .frach-m-text"));
    comps.forEach((c) => {
      if (c.matches("frach-m-image")) {
        current = imageComponent(document, c).map((n) => {
          if (n.dataset) delete n.dataset.caption;
          return n;
        });
        tiles.push(current);
      } else {
        if (!current) {
          current = [];
          tiles.push(current);
        }
        current.push(...textContent(document, c));
      }
    });
    return tiles.filter((t) => t.length);
  }
  function parse29(element, { document, params }) {
    const row = findRoot(element, ".frach-grid-row");
    let cols = gridColumns(row);
    if (!cols.length) cols = [row];
    const tiles = cols.flatMap((c) => tilesOfColumn(document, c));
    const perRow = Math.max(1, Math.min(cols.length, 3));
    const cells = [];
    for (let i = 0; i < tiles.length; i += perRow) {
      const r = tiles.slice(i, i + perRow);
      while (r.length < perRow) r.push("");
      cells.push(r);
    }
    const linked = (t) => t.some((n) => n.querySelector && n.querySelector('a[href]:not([href="#"])') && (n.querySelector("img") || /^H[1-6]$/.test(n.tagName)));
    const hasCopy = tiles.some((t) => t.some((n) => n.tagName === "P" && !n.querySelector("img") && clean(n.textContent).length > 30 && !n.querySelector("a")));
    const name = hasCopy && tiles.some((t) => !linked(t)) ? "tiles (alt)" : "tiles";
    const block = WebImporter.Blocks.createBlock(document, { name, cells: cells.length ? cells : [[""]] });
    element.replaceWith(block);
  }

  // tools/importer/parsers/section-title.js
  function parse30(element, { document }) {
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
        parse6(comp, { document, params: payload && payload.params || {} });
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
    const slug2 = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return { name: slug2(m[1] || ""), options: (m[2] || "").split(",").map(slug2).filter(Boolean) };
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

  // tools/importer/import-content-page-2.js
  var PAGE_TEMPLATE = {
    "name": "content-page-2",
    "description": "Content and landing page led by a full-width hero with a white headline over a photo, followed by mixed blocks",
    "urls": [
      "https://www.fraport.com/",
      "https://www.fraport.com/de.html",
      "https://www.fraport.com/de/geschaeftsfelder.html",
      "https://www.fraport.com/de/geschaeftsfelder/bau.html",
      "https://www.fraport.com/de/geschaeftsfelder/bau/flughafenausbau.html",
      "https://www.fraport.com/de/geschaeftsfelder/bau/hessens-tor-zur-welt.html",
      "https://www.fraport.com/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/kontakt.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte/flughafenentgelte.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center/anfrageformular-lehrgaenge-ftc.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/flugzeugbergung.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/frankfurt-cargohub/einladung-cargo.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/ground-services-equipment.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/anmeldung-spezialsprechstunde.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung-grippe.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/Zeigen-dass-wir-Verantwortung-tragen.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html",
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen.html",
      "https://www.fraport.com/de/geschaeftsfelder/international-activities.html",
      "https://www.fraport.com/de/geschaeftsfelder/service.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung/recurrent-training.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/allgemeine-informationen.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/archiv.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/online-ausweisbeantragung.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise/ausweis-services-auf-einen-blick.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/faq.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen/antrag-auf-registrierung-einer-firma.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/Bekanntmachungen.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/elektronischer-rechnungsversand.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-a-schoenberger.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-i-schaefer.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/richtlinien-und-zahlungsbedingungen.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/asset---property-management.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/baulandentwicklung---konversion.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/energiemanagement.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/projektentwicklung---investment.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/real-estate-consulting.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/ueber-uns.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/unser-track-record.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/airport-retailing.html",
      "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/flughafenwerbung.html",
      "https://www.fraport.com/de/investoren.html",
      "https://www.fraport.com/de/investoren/ansprechpartner.html",
      "https://www.fraport.com/de/investoren/corporate-governance.html",
      "https://www.fraport.com/de/investoren/creditor-relations.html",
      "https://www.fraport.com/de/investoren/fraport-aktie.html",
      "https://www.fraport.com/de/investoren/hauptversammlung.html",
      "https://www.fraport.com/de/investoren/indizes-und-ratings.html",
      "https://www.fraport.com/de/investoren/publikationen-termine.html",
      "https://www.fraport.com/de/investoren/verkehrszahlen.html",
      "https://www.fraport.com/de/konzern.html",
      "https://www.fraport.com/de/konzern/digitalisierung.html",
      "https://www.fraport.com/de/konzern/digitalisierung/ai-fraport.html",
      "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html",
      "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html",
      "https://www.fraport.com/de/konzern/digitalisierung/robotikstrategie.html",
      "https://www.fraport.com/de/konzern/konzernstrategie.html",
      "https://www.fraport.com/de/konzern/managementsysteme.html",
      "https://www.fraport.com/de/konzern/managementsysteme/arbeitsschutzmanagement.html",
      "https://www.fraport.com/de/konzern/managementsysteme/qualitaetsmanagement.html",
      "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html",
      "https://www.fraport.com/de/konzern/regionales-engagement.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/Newsletter.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/Veranstaltungen.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/kultur.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/kreiere-deinen-emoji.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/profisport/internationales-festhallen-reitturnier.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/profisport/loewen-frankfurt-nachwuchs.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen.html",
      "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen/antrag.html",
      "https://www.fraport.com/de/konzern/ueber-uns.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeitsstaette-fra.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gastro-erlebnis-kaffeegarten.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gewinnspiel-after-work-party.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/passenger-journey.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/reise-in-die-vergangenheit.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/seit-50-jahren-in-bewegung.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel.html",
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/zwei-urgesteine-mit-hundert-jahren-auf-dem-buckel.html",
      "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html",
      "https://www.fraport.com/de/konzern/ueber-uns/compliance.html",
      "https://www.fraport.com/de/konzern/ueber-uns/compliance/hinweisgebersysteme.html",
      "https://www.fraport.com/de/konzern/ueber-uns/diversity.html",
      "https://www.fraport.com/de/konzern/ueber-uns/vorstand.html",
      "https://www.fraport.com/de/konzern/ueber-uns/zahlen--daten-und-fakten1.html",
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html",
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Airport-Cater-Service-GmbH/kontakt-airport-cater-service-gmbh.html",
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/FraSec-Fraport-Security-Services-GmbH/kontaktformular-frasec.html",
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Frankfurt-Airport-Retail-GmbH/kontakt-frankfurt-airport-retail-gmbh---co--kg.html",
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Casa-GmbH/kontakt-fraport-casa-gmbh.html",
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Regional-Airports-of-Greece-Management-Company/kontakt-fraport-regional-airports-of-greece-management-company-s.html",
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Slovenija/kontakt-aerodrom-ljubljana--d-o-o-.html",
      "https://www.fraport.com/de/nachhaltigkeit.html",
      "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html",
      "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html",
      "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html",
      "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/aktuelle-betriebsrichtung.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/prognosen.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/bahnensystem-und-betriebszeiten.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/allgemeine-informationen.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/fluglaermkonturen.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messberichte.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messergebnisse-und-routennutzung.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/glossar.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/luftqualitaet.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/passives-schallschutzprogramm.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html",
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/weitere-kontakte.html",
      "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html",
      "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung.html",
      "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz.html",
      "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html",
      "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html",
      "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1.html",
      "https://www.fraport.com/de/newsroom.html",
      "https://www.fraport.com/de/newsroom/bilddatenbank.html",
      "https://www.fraport.com/de/newsroom/bilddatenbank/desktop-wallpapers.html",
      "https://www.fraport.com/de/newsroom/bilddatenbank/nutzungsbedingungen.html",
      "https://www.fraport.com/de/newsroom/bilddatenbank/smartphone-wallpapers.html",
      "https://www.fraport.com/de/newsroom/frafacts.html",
      "https://www.fraport.com/de/newsroom/infofilme.html",
      "https://www.fraport.com/de/newsroom/infofilme/flugzeugabfertigung.html",
      "https://www.fraport.com/de/newsroom/infofilme/sicherer-flugbetrieb.html",
      "https://www.fraport.com/de/newsroom/pressemappe.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/30-07-2021-besucherzentrum.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-vip-terminal.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html",
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html",
      "https://www.fraport.com/de/newsroom/videomaterial.html",
      "https://www.fraport.com/de/newsroom/videomaterial/nutzungsbedingungen.html",
      "https://www.fraport.com/de/tools/disclaimer.html",
      "https://www.fraport.com/de/tools/impressum.html"
    ],
    "blocks": [
      {
        "name": "breadcrumb",
        "instances": [
          "frach-m-breadcrumb-navigation"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder.html": [
            "#content-537a527afa > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
            "#content-ace63d60b2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/bau/flughafenausbau.html": [
            "#content-ccbb392298 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/bau/hessens-tor-zur-welt.html": [
            "#content-518fb98448 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen.html": [
            "#content-0462726a7b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
            "#content-fe4c12892b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html": [
            "#content-ef6c7ecdfa > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen.html": [
            "#content-5014c9a271 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar.html": [
            "#content-daa2dc5031 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html": [
            "#content-cf034a9857 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html": [
            "#content-8392e91ba0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html": [
            "#content-b318ef23c7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das.html": [
            "#content-27dbc99965 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab.html": [
            "#content-54dd34baab > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich.html": [
            "#content-7e0c5d0d7f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html": [
            "#content-fbfc19b9d9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/kontakt.html": [
            "#content-7ec8ab8f1b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
            "#content-94e0b2a1ae > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte/flughafenentgelte.html": [
            "#content-574ee445ae > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
            "#content-febaaa2880 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
            "#content-a29c22d8b8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
            "#content-2d18e100ac > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center/anfrageformular-lehrgaenge-ftc.html": [
            "#content-c00f2db2e8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/flugzeugbergung.html": [
            "#content-1cb7c055fd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
            "#content-eee860178e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html": [
            "#content-5a643d8d09 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html": [
            "#content-faf1100710 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/frankfurt-cargohub/einladung-cargo.html": [
            "#content-cbef42f44d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/ground-services-equipment.html": [
            "#content-3d8d2c4b04 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
            "#content-a394cc3644 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/anmeldung-spezialsprechstunde.html": [
            "#content-bc830b6498 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
            "#content-a709b40d79 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung-grippe.html": [
            "#content-2f6f21b53f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung.html": [
            "#content-a496411e0a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
            "#content-a788a16760 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
            "#content-77e73e5284 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/Zeigen-dass-wir-Verantwortung-tragen.html": [
            "#content-8e432c4fa6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html": [
            "#content-c957a268d4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html": [
            "#content-586c8daec9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet.html": [
            "#content-96b9ad1a1e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf.html": [
            "#content-84eb5a0b10 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html": [
            "#content-f741251b48 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen.html": [
            "#content-f286af4148 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
            "#content-4ecc9eaa94 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service.html": [
            "#content-96ffffb1cb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
            "#content-ea837bb978 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung/recurrent-training.html": [
            "#content-3c46506438 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
            "#content-1093455a65 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/allgemeine-informationen.html": [
            "#content-10945cadef > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html": [
            "#content-7c03d327a8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/archiv.html": [
            "#content-56ad5aaa9a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
            "#content-2a3e832410 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/online-ausweisbeantragung.html": [
            "#content-eae3622639 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise.html": [
            "#content-e19c643cda > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise/ausweis-services-auf-einen-blick.html": [
            "#content-4930928583 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/faq.html": [
            "#content-6588f4bf1e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung.html": [
            "#content-482d124de1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-.html": [
            "#content-d57e1f4867 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise.html": [
            "#content-4b6df3191c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen.html": [
            "#content-f6b19f2990 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen/antrag-auf-registrierung-einer-firma.html": [
            "#content-ad31dff7e5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html": [
            "#content-8fd426e1d7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/Bekanntmachungen.html": [
            "#content-22fc7c4e3b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html": [
            "#content-c5bb3d1ef0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/elektronischer-rechnungsversand.html": [
            "#content-44264f4283 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen.html": [
            "#content-6628355d8a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-a-schoenberger.html": [
            "#content-8a48eb5aaf > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-i-schaefer.html": [
            "#content-60e540cec5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/richtlinien-und-zahlungsbedingungen.html": [
            "#content-92d1cb51d0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html": [
            "#content-e61602a658 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
            "#content-b9b11fde3a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
            "#content-905f01d722 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/asset---property-management.html": [
            "#content-cc3e256d7a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/baulandentwicklung---konversion.html": [
            "#content-4743629020 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/energiemanagement.html": [
            "#content-7995012322 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/projektentwicklung---investment.html": [
            "#content-6c7ef98615 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/real-estate-consulting.html": [
            "#content-0800e5e937 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/ueber-uns.html": [
            "#content-b1b1bc255e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/unser-track-record.html": [
            "#content-d3c2bc6984 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung.html": [
            "#content-565614a084 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung.html": [
            "#content-e7476edd10 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
            "#content-a9bf8de399 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/airport-retailing.html": [
            "#content-14674bdbee > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/flughafenwerbung.html": [
            "#content-f0fb5cbf2c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/investoren.html": [
            "#content-eb8d513184 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/investoren/ansprechpartner.html": [
            "#content-5806f05e7e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/investoren/corporate-governance.html": [
            "#content-86ac2115e6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/investoren/creditor-relations.html": [
            "#content-d465f79875 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/investoren/fraport-aktie.html": [
            "#content-6d559b231d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/investoren/hauptversammlung.html": [
            "#content-1fa124a7b8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/investoren/indizes-und-ratings.html": [
            "#content-a9399e14b7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/investoren/publikationen-termine.html": [
            "#content-d05a755001 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
            "#content-1e764166e2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern.html": [
            "#content-adf976c480 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung.html": [
            "#content-329bc02e5a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/ai-fraport.html": [
            "#content-af92300507 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
            "#content-2b14b02452 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html": [
            "#content-c215903c75 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/robotikstrategie.html": [
            "#content-a34da67ddc > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/konzernstrategie.html": [
            "#content-ae71da4608 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/managementsysteme.html": [
            "#content-d37599113e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/managementsysteme/arbeitsschutzmanagement.html": [
            "#content-f1d5840375 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/managementsysteme/qualitaetsmanagement.html": [
            "#content-81c0c41334 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html": [
            "#content-f02853d396 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement.html": [
            "#content-0dab5acfe5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/Newsletter.html": [
            "#content-feaba3fcbf > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/Veranstaltungen.html": [
            "#content-573230ac52 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html": [
            "#content-bde4031039 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/kultur.html": [
            "#content-877d6235fa > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt.html": [
            "#content-af9360fb6d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html": [
            "#content-244319f842 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/kreiere-deinen-emoji.html": [
            "#content-35ef1df7b1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/profisport/internationales-festhallen-reitturnier.html": [
            "#content-1b8399d43a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/profisport/loewen-frankfurt-nachwuchs.html": [
            "#content-0c67f34b58 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen.html": [
            "#content-0dcbf3c985 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen/antrag.html": [
            "#content-2445ad7d37 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns.html": [
            "#content-cf6d975969 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
            "#content-fa84549bee > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute.html": [
            "#content-8829230c0e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
            "#content-f39cf93cbf > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette.html": [
            "#content-390a89426f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeitsstaette-fra.html": [
            "#content-fc89e9e9d6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html": [
            "#content-f17e821128 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html": [
            "#content-022cdfbd62 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region.html": [
            "#content-594358c803 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten.html": [
            "#content-9646d046b1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
            "#content-544b915ad4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html": [
            "#content-42426a7da8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-.html": [
            "#content-e8584c5a08 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra.html": [
            "#content-9722329fd2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html": [
            "#content-94be5da969 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html": [
            "#content-17594f514c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
            "#content-be988cd6ea > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1.html": [
            "#content-7a1026f0a2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gastro-erlebnis-kaffeegarten.html": [
            "#content-ebaecae6b0 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gewinnspiel-after-work-party.html": [
            "#content-7a09b53fc8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
            "#content-5c1ce5e09a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra.html": [
            "#content-6e9876c116 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick.html": [
            "#content-e01a5db645 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung.html": [
            "#content-f2d9236084 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-.html": [
            "#content-c8d6e91b51 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt.html": [
            "#content-4ca4e3fa39 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0.html": [
            "#content-f01411c254 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post.html": [
            "#content-259bd428aa > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu.html": [
            "#content-41f435b897 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen.html": [
            "#content-a41e98a1ca > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/passenger-journey.html": [
            "#content-fec0f63e61 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
            "#event-f3a08748f7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/reise-in-die-vergangenheit.html": [
            "#content-a3b2185c5c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/seit-50-jahren-in-bewegung.html": [
            "#content-d535d288ce > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-.html": [
            "#content-76e8fed943 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html": [
            "#content-55bb545fdf > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
            "#content-15a43168ca > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel.html": [
            "#content-a65475f97f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/zwei-urgesteine-mit-hundert-jahren-auf-dem-buckel.html": [
            "#content-f14f715982 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html": [
            "#content-b45573e17b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
            "#content-92cd7cccd5 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/compliance/hinweisgebersysteme.html": [
            "#content-42b695e38c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/diversity.html": [
            "#content-ef09cdc863 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/vorstand.html": [
            "#content-78706e354b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/zahlen--daten-und-fakten1.html": [
            "#content-a783909c7e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
            "#content-669ae30600 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Airport-Cater-Service-GmbH/kontakt-airport-cater-service-gmbh.html": [
            "#content-5650a6fd78 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/FraSec-Fraport-Security-Services-GmbH/kontaktformular-frasec.html": [
            "#content-0111a8fb0c > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Frankfurt-Airport-Retail-GmbH/kontakt-frankfurt-airport-retail-gmbh---co--kg.html": [
            "#content-7e4b2aa0e3 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Casa-GmbH/kontakt-fraport-casa-gmbh.html": [
            "#content-d89d6944b4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Regional-Airports-of-Greece-Management-Company/kontakt-fraport-regional-airports-of-greece-management-company-s.html": [
            "#content-7aace7fde1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Slovenija/kontakt-aerodrom-ljubljana--d-o-o-.html": [
            "#content-0d51f8de4a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit.html": [
            "#content-af1e933ca8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
            "#content-4f08566e96 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
            "#content-645db6a464 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
            "#content-3fb39ad0f4 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html": [
            "#content-bf682d45b8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html": [
            "#content-5ea1f21053 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles.html": [
            "#content-b031ff6578 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/aktuelle-betriebsrichtung.html": [
            "#content-ed6d760055 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023.html": [
            "#content-2fea9c1ff2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/prognosen.html": [
            "#content-9398833c89 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten.html": [
            "#content-7504aaf10d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten.html": [
            "#content-b46c90df40 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft.html": [
            "#content-d2448094b9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb.html": [
            "#content-18a49b9403 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/bahnensystem-und-betriebszeiten.html": [
            "#content-0a61858a06 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung.html": [
            "#content-ccc2805911 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm.html": [
            "#content-894eef1059 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/allgemeine-informationen.html": [
            "#content-e45a29af95 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/fluglaermkonturen.html": [
            "#content-15ce188db6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messberichte.html": [
            "#content-3ec33f01fa > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messergebnisse-und-routennutzung.html": [
            "#content-64dc147c2d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/glossar.html": [
            "#content-47fa45ed15 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/luftqualitaet.html": [
            "#content-9d581db8f6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen.html": [
            "#content-524fef9be9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm.html": [
            "#content-9096343582 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm.html": [
            "#content-16a9eefbeb > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/passives-schallschutzprogramm.html": [
            "#content-7cf9202907 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
            "#content-73c24e7119 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal.html": [
            "#content-e661253371 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm.html": [
            "#content-bdfb9cc8ef > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html": [
            "#content-693e2b1a7d > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/weitere-kontakte.html": [
            "#content-618cb431d1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
            "#content-0afaea7ee3 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung.html": [
            "#content-cebeb9c9e6 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz.html": [
            "#content-c49ebda468 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html": [
            "#content-1dcf20904b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html": [
            "#content-c18357f7c1 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1.html": [
            "#content-e05b379806 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom.html": [
            "#content-63328224af > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/bilddatenbank.html": [
            "#content-fcf22dbb1a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/bilddatenbank/desktop-wallpapers.html": [
            "#content-f16fe935b9 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/bilddatenbank/nutzungsbedingungen.html": [
            "#content-2bdb284799 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/bilddatenbank/smartphone-wallpapers.html": [
            "#content-cc97152d75 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/frafacts.html": [
            "#content-47c579053f > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/infofilme.html": [
            "#content-1b15d24104 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/infofilme/flugzeugabfertigung.html": [
            "#content-1bcc4c9bb8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/infofilme/sicherer-flugbetrieb.html": [
            "#content-6ad3ead47e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe.html": [
            "#content-b1d39f1e2e > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3.html": [
            "#content-05c26bdf3a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/30-07-2021-besucherzentrum.html": [
            "#content-9b5c75be03 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html": [
            "#content-7390ac7dc7 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html": [
            "#content-ca39736fc8 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021.html": [
            "#content-a670d00f72 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html": [
            "#content-7f855b5c03 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main.html": [
            "#content-a80a6716dd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html": [
            "#content-c131753e8a > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html": [
            "#content-a5746708ae > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html": [
            "#content-9604d6ea0b > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html": [
            "#content-be046d4316 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html": [
            "#content-62b3739282 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-vip-terminal.html": [
            "#content-cda35881ee > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn.html": [
            "#content-dd66719220 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html": [
            "#content-39043c6fdd > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html": [
            "#content-50501bc440 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/videomaterial.html": [
            "#content-52145325df > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/newsroom/videomaterial/nutzungsbedingungen.html": [
            "#content-8350aa06c2 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/tools/disclaimer.html": [
            "#content-2e67356288 > div.frach-m-page > frach-m-breadcrumb-navigation"
          ],
          "https://www.fraport.com/de/tools/impressum.html": [
            "#content-61d950ba2e > div.frach-m-page > frach-m-breadcrumb-navigation"
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
        "name": "teaser-mosaic",
        "instances": [
          "#main-content frach-m-topicwall-first-row"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(1)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2) > div.firstRow.section",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12 > div.firstRow.section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
            "#main-content > div > div > div > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12 > div:nth-child(4)"
          ]
        }
      },
      {
        "name": "hero",
        "instances": [
          "#main-content frach-m-hero",
          "#main-content frach-m-topicwall-1-by-4.frach-m-topicwall-1-by-4__white"
        ],
        "pageInstances": {
          "https://www.fraport.com/": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/investoren.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/konzernstrategie.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/managementsysteme.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/Newsletter.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
            "#main-content > div > div > section",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(3) > frach-m-topicwall-third-row > div.onebyfourtile_2.oneByFour.frach-m-topicwall-third-row__1-4--2.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(7) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(9) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(12) > frach-m-topicwall-third-row > div.onebyfourtile_1.oneByFour.frach-m-topicwall-third-row__1-4--1.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(12) > frach-m-topicwall-third-row > div.onebyfourtile_2.oneByFour.frach-m-topicwall-third-row__1-4--2.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(12) > frach-m-topicwall-third-row > div.onebyfourtile_3.oneByFour.frach-m-topicwall-third-row__1-4--3.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(13) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(13) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(15) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(20) > frach-m-topicwall-third-row > div.onebyfourtile_2.oneByFour.frach-m-topicwall-third-row__1-4--2.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(20) > frach-m-topicwall-third-row > div.onebyfourtile_4.oneByFour.frach-m-topicwall-third-row__1-4--4.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(20) > frach-m-topicwall-third-row > div.onebyfourtile_5.oneByFour.frach-m-topicwall-third-row__1-4--5.frach-m-topicwall-third-row__1-4"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeitsstaette-fra.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gastro-erlebnis-kaffeegarten.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gewinnspiel-after-work-party.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/passenger-journey.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
            "#main-content > div > div > div > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12 > div:nth-child(1) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/reise-in-die-vergangenheit.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/seit-50-jahren-in-bewegung.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/zwei-urgesteine-mit-hundert-jahren-auf-dem-buckel.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/newsroom.html": [
            "#main-content > div > div > section"
          ],
          "https://www.fraport.com/de/newsroom/videomaterial.html": [
            "#main-content > div > div > section"
          ]
        }
      },
      {
        "name": "video-player",
        "instances": [
          "#main-content frach-m-topicwall-16-by-9"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(2) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(5) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(7) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(9) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(11) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(15) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(17) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(19) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div:nth-child(1) > frach-m-topicwall-first-row > div.sixteentoninetile.sixteenByNine.frach-m-topicwall-first-row__16-9"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html": [
            "#lazy-video-7814"
          ]
        }
      },
      {
        "name": "teaser-feature",
        "instances": [
          "#main-content frach-m-topicwall-1-by-2",
          "#main-content frach-m-topicwall-1-by-4.frach-m-topicwall-1-by-4__blue"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(2) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(3) > frach-m-topicwall-third-row > div.onebyfourtile_5.oneByFour.frach-m-topicwall-third-row__1-4--5.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(4) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(5) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(6) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(8) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(10) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(10) > frach-m-topicwall-second-row > div.onebyfourtile_1.oneByFour.frach-m-topicwall-second-row__1-4--1.frach-m-topicwall-second-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(11) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(12) > frach-m-topicwall-third-row > div.onebyfourtile_4.oneByFour.frach-m-topicwall-third-row__1-4--4.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(14) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(16) > frach-m-topicwall-third-row > div.onebyfourtile_3.oneByFour.frach-m-topicwall-third-row__1-4--3.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(16) > frach-m-topicwall-third-row > div.onebyfourtile_4.oneByFour.frach-m-topicwall-third-row__1-4--4.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(18) > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > div:nth-child(20) > frach-m-topicwall-third-row > div.onebyfourtile_1.oneByFour.frach-m-topicwall-third-row__1-4--1.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2) > div.secondRow.section > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div:nth-child(1) > frach-m-topicwall-first-row > div.onebyfourtile.oneByFour.frach-m-topicwall-first-row__1-4.frach-m-topicwall-first-row__1-4--1",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div.secondRow.section > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div.secondRow.section > frach-m-topicwall-second-row > div.onebyfourtile_1.oneByFour.frach-m-topicwall-second-row__1-4--1.frach-m-topicwall-second-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div.secondRow.section > frach-m-topicwall-second-row > div.onebyfourtile_2.oneByFour.frach-m-topicwall-second-row__1-4--2.frach-m-topicwall-second-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div.thirdRow.section > frach-m-topicwall-third-row > div.onebyfourtile_2.oneByFour.frach-m-topicwall-third-row__1-4--2.frach-m-topicwall-third-row__1-4",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3) > div.thirdRow.section > frach-m-topicwall-third-row > div.onebyfourtile_3.oneByFour.frach-m-topicwall-third-row__1-4--3.frach-m-topicwall-third-row__1-4"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12 > div.secondRow.section > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
            "#main-content > div > div > div > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12 > div.secondRow.section > frach-m-topicwall-second-row > div.onebytwo.oneByTwo.frach-m-topicwall-second-row__1-2"
          ]
        }
      },
      {
        "name": "accordion",
        "instances": [
          "#main-content frach-m-accordion"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
            "#accordion-5dd77cf4f2 > div:nth-child(1)",
            "#accordion-5dd77cf4f2 > div:nth-child(2)",
            "#accordion-5dd77cf4f2 > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen.html": [
            "#accordion-c6f2e3fc77 > div:nth-child(1)",
            "#accordion-c6f2e3fc77 > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen.html": [
            "#accordion-9c805a5281 > div:nth-child(1)",
            "#accordion-9c805a5281 > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar.html": [
            "#accordion-4195c89d7b > div:nth-child(1)",
            "#accordion-4195c89d7b > div:nth-child(2)",
            "#accordion-4195c89d7b > div:nth-child(3)",
            "#accordion-4195c89d7b > div:nth-child(4)",
            "#accordion-4195c89d7b > div:nth-child(5)",
            "#accordion-4195c89d7b > div:nth-child(6)",
            "#accordion-4195c89d7b > div:nth-child(7)",
            "#accordion-4195c89d7b > div:nth-child(8)",
            "#accordion-4195c89d7b > div:nth-child(9)",
            "#accordion-4195c89d7b > div:nth-child(10)",
            "#accordion-4195c89d7b > div:nth-child(11)",
            "#accordion-4195c89d7b > div:nth-child(12)",
            "#accordion-4195c89d7b > div:nth-child(13)",
            "#accordion-4195c89d7b > div:nth-child(14)",
            "#accordion-4195c89d7b > div:nth-child(15)",
            "#accordion-4195c89d7b > div:nth-child(16)",
            "#accordion-4195c89d7b > div:nth-child(17)",
            "#accordion-4195c89d7b > div:nth-child(18)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html": [
            "#accordion-9939d8cf2f > div:nth-child(1)",
            "#accordion-9939d8cf2f > div:nth-child(2)",
            "#accordion-9939d8cf2f > div:nth-child(3)",
            "#accordion-c306ce2300 > div:nth-child(1)",
            "#accordion-c306ce2300 > div:nth-child(2)",
            "#accordion-c306ce2300 > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html": [
            "#accordion-c1d889ff61 > div:nth-child(1)",
            "#accordion-c1d889ff61 > div:nth-child(2)",
            "#accordion-c1d889ff61 > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html": [
            "#accordion-0cd6eb06da > div:nth-child(1)",
            "#accordion-0cd6eb06da > div:nth-child(2)",
            "#accordion-0cd6eb06da > div:nth-child(3)",
            "#accordion-0cd6eb06da > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das.html": [
            "#accordion-1b88c375dd > div:nth-child(1)",
            "#accordion-1b88c375dd > div:nth-child(2)",
            "#accordion-1b88c375dd > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab.html": [
            "#accordion-1636345e69 > div:nth-child(1)",
            "#accordion-1636345e69 > div:nth-child(2)",
            "#accordion-1636345e69 > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich.html": [
            "#accordion-7f3f3a3fba > div:nth-child(1)",
            "#accordion-7f3f3a3fba > div:nth-child(2)",
            "#accordion-7f3f3a3fba > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html": [
            "#accordion-551b100a2d > div:nth-child(1)",
            "#accordion-551b100a2d > div:nth-child(2)",
            "#accordion-551b100a2d > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
            "#accordion-7472ece460 > div:nth-child(1)",
            "#accordion-7472ece460 > div:nth-child(2)",
            "#accordion-7472ece460 > div:nth-child(3)",
            "#accordion-7472ece460 > div:nth-child(4)",
            "#accordion-7472ece460 > div:nth-child(5)",
            "#accordion-7472ece460 > div:nth-child(6)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
            "#accordion-a7ecaed9f6 > div:nth-child(1)",
            "#accordion-a7ecaed9f6 > div:nth-child(2)",
            "#accordion-a7ecaed9f6 > div:nth-child(3)",
            "#accordion-a7ecaed9f6 > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html": [
            "#accordion-c01971c214 > div:nth-child(1)",
            "#accordion-c01971c214 > div:nth-child(2)",
            "#accordion-c01971c214 > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html": [
            "#accordion-0432b6a395 > div:nth-child(1)",
            "#accordion-0432b6a395 > div:nth-child(2)",
            "#accordion-0432b6a395 > div:nth-child(3)",
            "#accordion-0432b6a395 > div:nth-child(4)",
            "#accordion-0432b6a395 > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
            "#accordion-4dba61b984 > div:nth-child(1)",
            "#accordion-4dba61b984 > div:nth-child(2)",
            "#accordion-4dba61b984 > div:nth-child(3)",
            "#accordion-4dba61b984 > div:nth-child(4)",
            "#accordion-4dba61b984 > div:nth-child(5)",
            "#accordion-4dba61b984 > div:nth-child(6)",
            "#accordion-4dba61b984 > div:nth-child(7)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
            "#accordion-70102d4a46 > div:nth-child(1)",
            "#accordion-70102d4a46 > div:nth-child(2)",
            "#accordion-70102d4a46 > div:nth-child(3)",
            "#accordion-70102d4a46 > div:nth-child(4)",
            "#accordion-70102d4a46 > div:nth-child(5)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
            "#accordion-1f4bf33aeb > div:nth-child(1)",
            "#accordion-1f4bf33aeb > div:nth-child(2)",
            "#accordion-1f4bf33aeb > div:nth-child(3)",
            "#accordion-1f4bf33aeb > div:nth-child(4)",
            "#accordion-1f4bf33aeb > div:nth-child(5)",
            "#accordion-1f4bf33aeb > div:nth-child(6)",
            "#accordion-1f4bf33aeb > div:nth-child(7)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung/recurrent-training.html": [
            "#accordion-350f943bb1 > div:nth-child(1)",
            "#accordion-350f943bb1 > div:nth-child(2)",
            "#accordion-350f943bb1 > div:nth-child(3)",
            "#accordion-350f943bb1 > div:nth-child(4)",
            "#accordion-350f943bb1 > div:nth-child(5)",
            "#accordion-350f943bb1 > div:nth-child(6)",
            "#accordion-350f943bb1 > div:nth-child(7)",
            "#accordion-350f943bb1 > div:nth-child(8)",
            "#accordion-350f943bb1 > div:nth-child(9)",
            "#accordion-350f943bb1 > div:nth-child(10)",
            "#accordion-350f943bb1 > div:nth-child(11)",
            "#accordion-350f943bb1 > div:nth-child(12)",
            "#accordion-b2a7264009 > div:nth-child(1)",
            "#accordion-b2a7264009 > div:nth-child(2)",
            "#accordion-b2a7264009 > div:nth-child(3)",
            "#accordion-b2a7264009 > div:nth-child(4)",
            "#accordion-b2a7264009 > div:nth-child(5)",
            "#accordion-b2a7264009 > div:nth-child(6)",
            "#accordion-b2a7264009 > div:nth-child(7)",
            "#accordion-b2a7264009 > div:nth-child(8)",
            "#accordion-b2a7264009 > div:nth-child(9)",
            "#accordion-b2a7264009 > div:nth-child(10)",
            "#accordion-b2a7264009 > div:nth-child(11)",
            "#accordion-b2a7264009 > div:nth-child(12)",
            "#accordion-80a1e67a94 > div:nth-child(1)",
            "#accordion-80a1e67a94 > div:nth-child(2)",
            "#accordion-80a1e67a94 > div:nth-child(3)",
            "#accordion-80a1e67a94 > div:nth-child(4)",
            "#accordion-80a1e67a94 > div:nth-child(5)",
            "#accordion-80a1e67a94 > div:nth-child(6)",
            "#accordion-80a1e67a94 > div:nth-child(7)",
            "#accordion-80a1e67a94 > div:nth-child(8)",
            "#accordion-80a1e67a94 > div:nth-child(9)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(12)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/allgemeine-informationen.html": [
            "#accordion-a26cbf591b > div:nth-child(1)",
            "#accordion-a26cbf591b > div:nth-child(2)",
            "#accordion-a26cbf591b > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/archiv.html": [
            "#accordion-7caaa6cca5 > div:nth-child(1)",
            "#accordion-7caaa6cca5 > div:nth-child(2)",
            "#accordion-7caaa6cca5 > div:nth-child(3)",
            "#accordion-7caaa6cca5 > div:nth-child(4)",
            "#accordion-7caaa6cca5 > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
            "#accordion-0c43f04b72 > div:nth-child(1)",
            "#accordion-0c43f04b72 > div:nth-child(2)",
            "#accordion-0c43f04b72 > div:nth-child(3)",
            "#accordion-0c43f04b72 > div:nth-child(4)",
            "#accordion-0c43f04b72 > div:nth-child(5)",
            "#accordion-0c43f04b72 > div:nth-child(6)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise/ausweis-services-auf-einen-blick.html": [
            "#accordion-026dc7ae24 > div:nth-child(1)",
            "#accordion-026dc7ae24 > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/faq.html": [
            "#accordion-f3ecb9f122 > div:nth-child(1)",
            "#accordion-f3ecb9f122 > div:nth-child(2)",
            "#accordion-f3ecb9f122 > div:nth-child(3)",
            "#accordion-f3ecb9f122 > div:nth-child(4)",
            "#accordion-f3ecb9f122 > div:nth-child(5)",
            "#accordion-ffa9f5b42d > div:nth-child(1)",
            "#accordion-ffa9f5b42d > div:nth-child(2)",
            "#accordion-ffa9f5b42d > div:nth-child(3)",
            "#accordion-ffa9f5b42d > div:nth-child(4)",
            "#accordion-ffa9f5b42d > div:nth-child(5)",
            "#accordion-38303dd51e > div:nth-child(1)",
            "#accordion-38303dd51e > div:nth-child(2)",
            "#accordion-38303dd51e > div:nth-child(3)",
            "#accordion-38303dd51e > div:nth-child(4)",
            "#accordion-38303dd51e > div:nth-child(5)",
            "#accordion-38303dd51e > div:nth-child(6)",
            "#accordion-38303dd51e > div:nth-child(7)",
            "#accordion-38303dd51e > div:nth-child(8)",
            "#accordion-38303dd51e > div:nth-child(9)",
            "#accordion-38303dd51e > div:nth-child(10)",
            "#accordion-38303dd51e > div:nth-child(11)",
            "#accordion-38303dd51e > div:nth-child(12)",
            "#accordion-38303dd51e > div:nth-child(13)",
            "#accordion-38303dd51e > div:nth-child(14)",
            "#accordion-38303dd51e > div:nth-child(15)",
            "#accordion-f3dff4e15d > div:nth-child(1)",
            "#accordion-f3dff4e15d > div:nth-child(2)",
            "#accordion-f3dff4e15d > div:nth-child(3)",
            "#accordion-bf9e4cacc7 > div:nth-child(1)",
            "#accordion-bf9e4cacc7 > div:nth-child(2)",
            "#accordion-3630d719aa > div:nth-child(1)",
            "#accordion-3630d719aa > div:nth-child(2)",
            "#accordion-3630d719aa > div:nth-child(3)",
            "#accordion-3630d719aa > div:nth-child(4)",
            "#accordion-9186a09869 > div:nth-child(1)",
            "#accordion-9186a09869 > div:nth-child(2)",
            "#accordion-9186a09869 > div:nth-child(3)",
            "#accordion-9186a09869 > div:nth-child(4)",
            "#accordion-9186a09869 > div:nth-child(5)",
            "#accordion-9186a09869 > div:nth-child(6)",
            "#accordion-9186a09869 > div:nth-child(7)",
            "#accordion-baf9644a05 > div:nth-child(1)",
            "#accordion-baf9644a05 > div:nth-child(2)",
            "#accordion-baf9644a05 > div:nth-child(3)",
            "#accordion-baf9644a05 > div:nth-child(4)",
            "#accordion-baf9644a05 > div:nth-child(5)",
            "#accordion-baf9644a05 > div:nth-child(6)",
            "#accordion-baf9644a05 > div:nth-child(7)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-.html": [
            "#accordion-b7918c27d1 > div:nth-child(1)",
            "#accordion-b7918c27d1 > div:nth-child(2)",
            "#accordion-b7918c27d1 > div:nth-child(3)",
            "#accordion-b7918c27d1 > div:nth-child(4)",
            "#accordion-b7918c27d1 > div:nth-child(5)",
            "#accordion-b7918c27d1 > div:nth-child(6)",
            "#accordion-b7918c27d1 > div:nth-child(7)",
            "#accordion-b7918c27d1 > div:nth-child(8)",
            "#accordion-b7918c27d1 > div:nth-child(9)",
            "#accordion-b7918c27d1 > div:nth-child(10)",
            "#accordion-b7918c27d1 > div:nth-child(11)",
            "#accordion-b7918c27d1 > div:nth-child(12)",
            "#accordion-b7918c27d1 > div:nth-child(13)",
            "#accordion-b7918c27d1 > div:nth-child(14)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html": [
            "#accordion-87ce58c4c2 > div:nth-child(1)",
            "#accordion-87ce58c4c2 > div:nth-child(2)",
            "#accordion-87ce58c4c2 > div:nth-child(3)",
            "#accordion-87ce58c4c2 > div:nth-child(4)",
            "#accordion-56bb506dec > div:nth-child(1)",
            "#accordion-56bb506dec > div:nth-child(2)",
            "#accordion-56bb506dec > div:nth-child(3)",
            "#CAD_bearbeitung > div:nth-child(7)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen.html": [
            "#accordion-09fed2b42a > div:nth-child(1)",
            "#accordion-09fed2b42a > div:nth-child(2)",
            "#accordion-09fed2b42a > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html": [
            "#accordion-ad42c7da4b > div:nth-child(1)",
            "#accordion-ad42c7da4b > div:nth-child(2)",
            "#accordion-ad42c7da4b > div:nth-child(3)",
            "#accordion-ad42c7da4b > div:nth-child(4)",
            "#accordion-ad42c7da4b > div:nth-child(5)",
            "#accordion-ad42c7da4b > div:nth-child(6)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
            "#accordion-e6f0c54070 > div:nth-child(1)",
            "#accordion-e6f0c54070 > div:nth-child(2)",
            "#accordion-e6f0c54070 > div:nth-child(3)",
            "#accordion-e6f0c54070 > div:nth-child(4)",
            "#accordion-e6f0c54070 > div:nth-child(5)",
            "#accordion-e6f0c54070 > div:nth-child(6)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(9)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/energiemanagement.html": [
            "#accordion-cb69b7442d > div:nth-child(1)",
            "#accordion-cb69b7442d > div:nth-child(2)",
            "#accordion-cb69b7442d > div:nth-child(3)",
            "#accordion-cb69b7442d > div:nth-child(4)",
            "#accordion-cb69b7442d > div:nth-child(5)",
            "#accordion-cb69b7442d > div:nth-child(6)",
            "#accordion-cb69b7442d > div:nth-child(7)",
            "#accordion-cb69b7442d > div:nth-child(8)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/real-estate-consulting.html": [
            "#accordion-081d82da94 > div:nth-child(1)",
            "#accordion-081d82da94 > div:nth-child(2)",
            "#accordion-081d82da94 > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/ueber-uns.html": [
            "#accordion-3c02704772 > div:nth-child(1)",
            "#accordion-3c02704772 > div:nth-child(2)",
            "#accordion-3c02704772 > div:nth-child(3)",
            "#accordion-3c02704772 > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung.html": [
            "#accordion-d65db34026 > div:nth-child(1)",
            "#accordion-d65db34026 > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/airport-retailing.html": [
            "#accordion-02e9fd94dd > div:nth-child(1)",
            "#accordion-02e9fd94dd > div:nth-child(2)",
            "#accordion-02e9fd94dd > div:nth-child(3)",
            "#accordion-02e9fd94dd > div:nth-child(4)",
            "#accordion-02e9fd94dd > div:nth-child(5)",
            "#accordion-02e9fd94dd > div:nth-child(6)"
          ],
          "https://www.fraport.com/de/investoren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(10)"
          ],
          "https://www.fraport.com/de/investoren/corporate-governance.html": [
            "#accordion-21d93404ce > div:nth-child(1)",
            "#accordion-21d93404ce > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/investoren/fraport-aktie.html": [
            "#accordion-87a984c8ef > div:nth-child(1)",
            "#accordion-87a984c8ef > div:nth-child(2)",
            "#accordion-87a984c8ef > div:nth-child(3)",
            "#accordion-87a984c8ef > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/investoren/hauptversammlung.html": [
            "#accordion-c2023bc3b7 > div:nth-child(1)",
            "#accordion-c2023bc3b7 > div:nth-child(2)",
            "#accordion-c2023bc3b7 > div:nth-child(3)",
            "#accordion-c2023bc3b7 > div:nth-child(4)",
            "#accordion-c2023bc3b7 > div:nth-child(5)",
            "#accordion-c2023bc3b7 > div:nth-child(6)",
            "#accordion-21e78adb8f > div:nth-child(1)",
            "#accordion-21e78adb8f > div:nth-child(3)",
            "#accordion-21e78adb8f > div:nth-child(4)",
            "#accordion-21e78adb8f > div:nth-child(5)",
            "#accordion-21e78adb8f > div:nth-child(6)",
            "#accordion-21e78adb8f > div:nth-child(7)",
            "#accordion-21e78adb8f > div:nth-child(8)",
            "#accordion-21e78adb8f > div:nth-child(9)",
            "#accordion-21e78adb8f > div:nth-child(10)",
            "#accordion-21e78adb8f > div:nth-child(11)",
            "#accordion-21e78adb8f > div:nth-child(12)",
            "#accordion-21e78adb8f > div:nth-child(13)"
          ],
          "https://www.fraport.com/de/investoren/indizes-und-ratings.html": [
            "#accordion-0bd8ad4224 > div:nth-child(1)",
            "#accordion-0bd8ad4224 > div:nth-child(2)",
            "#accordion-0bd8ad4224 > div:nth-child(3)",
            "#accordion-0bd8ad4224 > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/investoren/publikationen-termine.html": [
            "#accordion-4bb3bd9112 > div:nth-child(1)",
            "#accordion-4bb3bd9112 > div:nth-child(2)",
            "#accordion-4bb3bd9112 > div:nth-child(3)",
            "#accordion-4bb3bd9112 > div:nth-child(4)",
            "#accordion-4bb3bd9112 > div:nth-child(5)",
            "#accordion-4bb3bd9112 > div:nth-child(6)",
            "#accordion-4bb3bd9112 > div:nth-child(7)",
            "#accordion-4bb3bd9112 > div:nth-child(8)",
            "#accordion-4bb3bd9112 > div:nth-child(9)",
            "#accordion-4bb3bd9112 > div:nth-child(10)",
            "#accordion-4bb3bd9112 > div:nth-child(11)",
            "#accordion-4bb3bd9112 > div:nth-child(12)",
            "#accordion-4bb3bd9112 > div:nth-child(13)",
            "#accordion-4bb3bd9112 > div:nth-child(14)",
            "#accordion-4bb3bd9112 > div:nth-child(15)"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/ai-fraport.html": [
            "#accordion-439f5e8881 > div:nth-child(1)",
            "#accordion-439f5e8881 > div:nth-child(2)",
            "#accordion-439f5e8881 > div:nth-child(3)",
            "#accordion-439f5e8881 > div:nth-child(4)",
            "#accordion-439f5e8881 > div:nth-child(5)",
            "#accordion-439f5e8881 > div:nth-child(6)",
            "#accordion-439f5e8881 > div:nth-child(7)",
            "#accordion-439f5e8881 > div:nth-child(8)"
          ],
          "https://www.fraport.com/de/konzern/konzernstrategie.html": [
            "#accordion-cc6978df97 > div:nth-child(1)",
            "#accordion-cc6978df97 > div:nth-child(2)",
            "#accordion-cc6978df97 > div:nth-child(3)",
            "#accordion-cc6978df97 > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement.html": [
            "#accordion-b58a2d6469 > div:nth-child(1)",
            "#accordion-b58a2d6469 > div:nth-child(2)",
            "#accordion-b58a2d6469 > div:nth-child(3)",
            "#accordion-b58a2d6469 > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/Newsletter.html": [
            "#accordion-47ca75172b > div:nth-child(1)",
            "#accordion-47ca75172b > div:nth-child(2)",
            "#accordion-47ca75172b > div:nth-child(3)",
            "#accordion-47ca75172b > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/kreiere-deinen-emoji.html": [
            "#accordion-9706f25e94 > div:nth-child(1)",
            "#accordion-9706f25e94 > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen.html": [
            "#accordion-ce3268b4e4 > div:nth-child(1)",
            "#accordion-ce3268b4e4 > div:nth-child(2)",
            "#accordion-ce3268b4e4 > div:nth-child(3)",
            "#accordion-ce3268b4e4 > div:nth-child(4)",
            "#accordion-ce3268b4e4 > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
            "#container-2cd4e3017c > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1.html": [
            "#accordion-0920334c0c > div:nth-child(1)",
            "#accordion-0920334c0c > div:nth-child(2)",
            "#accordion-0920334c0c > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
            "#accordion-a1dddffe96 > div:nth-child(1)",
            "#accordion-a1dddffe96 > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra.html": [
            "#accordion-8238b30fdc > div:nth-child(1)",
            "#accordion-8238b30fdc > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
            "#main-content > div > div > div > div > div:nth-child(6)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.wcm-io-parsys.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
            "#accordion-b520ba6660 > div:nth-child(1)",
            "#accordion-b520ba6660 > div:nth-child(2)",
            "#accordion-b520ba6660 > div:nth-child(3)",
            "#accordion-b520ba6660 > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/compliance/hinweisgebersysteme.html": [
            "#accordion-7cf706d4b5 > div:nth-child(1)",
            "#accordion-7cf706d4b5 > div:nth-child(2)",
            "#accordion-7cf706d4b5 > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/diversity.html": [
            "#accordion-bcf2f4d5d1 > div:nth-child(1)",
            "#accordion-bcf2f4d5d1 > div:nth-child(2)",
            "#accordion-bcf2f4d5d1 > div:nth-child(3)",
            "#accordion-bcf2f4d5d1 > div:nth-child(4)",
            "#accordion-bcf2f4d5d1 > div:nth-child(5)",
            "#accordion-bcf2f4d5d1 > div:nth-child(6)",
            "#accordion-bcf2f4d5d1 > div:nth-child(7)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/vorstand.html": [
            "#accordion-de994c9278 > div:nth-child(1)",
            "#accordion-de994c9278 > div:nth-child(2)",
            "#accordion-de994c9278 > div:nth-child(3)",
            "#accordion-de994c9278 > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit.html": [
            "#accordion-6fea86d668 > div:nth-child(1)",
            "#accordion-6fea86d668 > div:nth-child(2)",
            "#accordion-6fea86d668 > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
            "#accordion-efd10d1836 > div:nth-child(1)",
            "#accordion-efd10d1836 > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten.html": [
            "#accordion-d803bd08a7 > div:nth-child(1)",
            "#accordion-d803bd08a7 > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/fluglaermkonturen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messberichte.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/glossar.html": [
            "#accordion-ae89d898c8 > div:nth-child(1)",
            "#accordion-ae89d898c8 > div:nth-child(2)",
            "#accordion-ae89d898c8 > div:nth-child(3)",
            "#accordion-ae89d898c8 > div:nth-child(4)",
            "#accordion-ae89d898c8 > div:nth-child(5)",
            "#accordion-ae89d898c8 > div:nth-child(6)",
            "#accordion-ae89d898c8 > div:nth-child(7)",
            "#accordion-ae89d898c8 > div:nth-child(8)",
            "#accordion-ae89d898c8 > div:nth-child(9)",
            "#accordion-ae89d898c8 > div:nth-child(10)",
            "#accordion-ae89d898c8 > div:nth-child(11)",
            "#accordion-ae89d898c8 > div:nth-child(12)",
            "#accordion-ae89d898c8 > div:nth-child(13)",
            "#accordion-ae89d898c8 > div:nth-child(14)",
            "#accordion-ae89d898c8 > div:nth-child(15)",
            "#accordion-ae89d898c8 > div:nth-child(16)",
            "#accordion-ae89d898c8 > div:nth-child(17)",
            "#accordion-ae89d898c8 > div:nth-child(18)",
            "#accordion-ae89d898c8 > div:nth-child(19)",
            "#accordion-ae89d898c8 > div:nth-child(20)",
            "#accordion-ae89d898c8 > div:nth-child(21)",
            "#accordion-ae89d898c8 > div:nth-child(22)",
            "#accordion-ae89d898c8 > div:nth-child(23)",
            "#accordion-ae89d898c8 > div:nth-child(24)",
            "#accordion-ae89d898c8 > div:nth-child(25)",
            "#accordion-ae89d898c8 > div:nth-child(26)",
            "#accordion-ae89d898c8 > div:nth-child(27)",
            "#accordion-ae89d898c8 > div:nth-child(28)",
            "#accordion-ae89d898c8 > div:nth-child(29)",
            "#accordion-ae89d898c8 > div:nth-child(30)",
            "#accordion-ae89d898c8 > div:nth-child(31)",
            "#accordion-ae89d898c8 > div:nth-child(32)",
            "#accordion-ae89d898c8 > div:nth-child(33)",
            "#accordion-ae89d898c8 > div:nth-child(34)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm.html": [
            "#accordion-4aebcf09f8 > div:nth-child(1)",
            "#accordion-4aebcf09f8 > div:nth-child(2)",
            "#accordion-4aebcf09f8 > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html": [
            "#accordion-d44be35026 > div:nth-child(1)",
            "#accordion-d44be35026 > div:nth-child(2)",
            "#accordion-d44be35026 > div:nth-child(3)",
            "#accordion-d44be35026 > div:nth-child(4)",
            "#accordion-d44be35026 > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz.html": [
            "#accordion-4493420cce > div:nth-child(1)",
            "#accordion-4493420cce > div:nth-child(2)",
            "#accordion-4493420cce > div:nth-child(3)",
            "#accordion-4493420cce > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html": [
            "#accordion-9d2f26886a > div:nth-child(1)",
            "#accordion-9d2f26886a > div:nth-child(2)",
            "#accordion-9d2f26886a > div:nth-child(3)",
            "#accordion-9d2f26886a > div:nth-child(4)",
            "#accordion-9d2f26886a > div:nth-child(5)",
            "#accordion-9d2f26886a > div:nth-child(6)",
            "#accordion-9d2f26886a > div:nth-child(7)",
            "#accordion-02e5fe4dd6 > div:nth-child(1)",
            "#accordion-02e5fe4dd6 > div:nth-child(2)",
            "#accordion-02e5fe4dd6 > div:nth-child(3)",
            "#accordion-02e5fe4dd6 > div:nth-child(4)",
            "#accordion-6b39f54eee > div:nth-child(1)",
            "#accordion-6b39f54eee > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1.html": [
            "#accordion-b639bdfbf6 > div:nth-child(1)",
            "#accordion-b639bdfbf6 > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom.html": [
            "#container-cf6a893b8a > div:nth-child(2) > frach-e-audio-player > div > div > div.frach-e-audio-player__content-container > div.frach-e-audio-player__player"
          ],
          "https://www.fraport.com/de/newsroom/bilddatenbank.html": [
            "#accordion-edc72e27ab > div:nth-child(1)",
            "#accordion-edc72e27ab > div:nth-child(2)",
            "#accordion-edc72e27ab > div:nth-child(3)",
            "#accordion-edc72e27ab > div:nth-child(4)",
            "#accordion-edc72e27ab > div:nth-child(5)",
            "#accordion-edc72e27ab > div:nth-child(6)",
            "#accordion-edc72e27ab > div:nth-child(7)",
            "#accordion-edc72e27ab > div:nth-child(8)"
          ],
          "https://www.fraport.com/de/newsroom/frafacts.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3.html": [
            "#accordion-e6c4a3919f > div:nth-child(1)",
            "#accordion-e6c4a3919f > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html": [
            "#Pressemitteilung"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html": [
            "#accordion-472a5eeb77 > div:nth-child(1)",
            "#accordion-472a5eeb77 > div:nth-child(2)",
            "#accordion-472a5eeb77 > div:nth-child(3)",
            "#accordion-472a5eeb77 > div:nth-child(4)",
            "#accordion-472a5eeb77 > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021.html": [
            "#accordion-6fdb3a551e > div:nth-child(1)",
            "#accordion-6fdb3a551e > div:nth-child(2)",
            "#accordion-6fdb3a551e > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html": [
            "#Pressemeldung"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main.html": [
            "#Pressefoto"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html": [
            "#accordion-c1ba728c53 > div:nth-child(1)",
            "#accordion-c1ba728c53 > div:nth-child(2)",
            "#accordion-c1ba728c53 > div:nth-child(3)",
            "#accordion-c1ba728c53 > div:nth-child(4)",
            "#accordion-c1ba728c53 > div:nth-child(5)",
            "#accordion-c1ba728c53 > div:nth-child(6)",
            "#accordion-c1ba728c53 > div:nth-child(7)",
            "#accordion-c1ba728c53 > div:nth-child(8)",
            "#accordion-c1ba728c53 > div:nth-child(9)",
            "#accordion-c1ba728c53 > div:nth-child(10)",
            "#accordion-c1ba728c53 > div:nth-child(11)",
            "#accordion-c1ba728c53 > div:nth-child(12)",
            "#accordion-c1ba728c53 > div:nth-child(13)",
            "#accordion-c1ba728c53 > div:nth-child(14)",
            "#accordion-c1ba728c53 > div:nth-child(15)",
            "#accordion-c1ba728c53 > div:nth-child(16)",
            "#accordion-c1ba728c53 > div:nth-child(17)",
            "#accordion-c1ba728c53 > div:nth-child(18)",
            "#accordion-c1ba728c53 > div:nth-child(19)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html": [
            "#accordion-10cab334c3 > div:nth-child(1)",
            "#accordion-10cab334c3 > div:nth-child(2)",
            "#accordion-10cab334c3 > div:nth-child(3)",
            "#accordion-10cab334c3 > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html": [
            "#Pressemeldungen"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html": [
            "#accordion-d180a260b2 > div:nth-child(1)",
            "#accordion-d180a260b2 > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html": [
            "#accordion-4d00361d9f > div:nth-child(1)",
            "#accordion-4d00361d9f > div:nth-child(2)",
            "#accordion-4d00361d9f > div:nth-child(3)",
            "#accordion-4d00361d9f > div:nth-child(4)",
            "#accordion-4d00361d9f > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html": [
            "#accordion-6a916d32c4 > div:nth-child(1)",
            "#accordion-6a916d32c4 > div:nth-child(2)",
            "#accordion-6a916d32c4 > div:nth-child(3)",
            "#accordion-6a916d32c4 > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html": [
            "#Pressemeldung"
          ],
          "https://www.fraport.com/de/newsroom/videomaterial.html": [
            "#accordion-66f0c6102f > div:nth-child(1)",
            "#accordion-66f0c6102f > div:nth-child(2)",
            "#accordion-66f0c6102f > div:nth-child(3)",
            "#accordion-66f0c6102f > div:nth-child(4)",
            "#accordion-66f0c6102f > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/tools/disclaimer.html": [
            "#accordion-123b8b06f8 > div:nth-child(1)",
            "#accordion-123b8b06f8 > div:nth-child(2)",
            "#accordion-123b8b06f8 > div:nth-child(3)",
            "#accordion-123b8b06f8 > div:nth-child(4)",
            "#accordion-123b8b06f8 > div:nth-child(5)",
            "#accordion-123b8b06f8 > div:nth-child(6)",
            "#accordion-123b8b06f8 > div:nth-child(7)",
            "#accordion-123b8b06f8 > div:nth-child(8)"
          ]
        }
      },
      {
        "name": "tabs-topic",
        "instances": [
          "#main-content frach-m-tab-navigation"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/bau/flughafenausbau.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
            "#container-79d7b0cbb0 > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/investoren/creditor-relations.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/kultur.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/zahlen--daten-und-fakten1.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/bahnensystem-und-betriebszeiten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/allgemeine-informationen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/luftqualitaet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/30-07-2021-besucherzentrum.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-vip-terminal.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ],
          "https://www.fraport.com/de/newsroom/videomaterial.html": [
            "#container-f18ab7741a > section:nth-child(3) > frach-m-tabbed-content > div > div > div > frach-m-tab-navigation"
          ]
        }
      },
      {
        "name": "carousel-text-media",
        "instances": [
          "#main-content frach-m-milestones > .frach-m-slider"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
            "#container-bc4106a222 > section:nth-child(2) > frach-m-milestones > div.frach-m-slider.frach-state-animating"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/Zeigen-dass-wir-Verantwortung-tragen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > frach-m-milestones > div.frach-m-slider.frach-state-animating"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/diversity.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > frach-m-milestones > div.frach-m-slider.frach-state-animating"
          ]
        }
      },
      {
        "name": "image-gallery-tiles",
        "instances": [
          "#main-content frach-m-image-gallery-tiles"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/flughafenwerbung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern.html": [
            "#gallery-3697d97832 > div > div > div"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/Veranstaltungen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7)"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(15)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(16)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
            "#container-98f8858bd3 > section:nth-child(5)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4) > frach-m-text-media > div > div > div.frach-m-text-media__media"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12 > frach-m-text-media > div > div > div.frach-m-text-media__media"
          ],
          "https://www.fraport.com/de/newsroom.html": [
            "#container-81952826d3 > section > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
          ],
          "https://www.fraport.com/de/newsroom/bilddatenbank/desktop-wallpapers.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.experiencefragment.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/bilddatenbank/smartphone-wallpapers.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.experiencefragment.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/newsroom/infofilme/flugzeugabfertigung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
          ],
          "https://www.fraport.com/de/newsroom/infofilme/sicherer-flugbetrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe.html": [
            "#t3Mappen > section > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls",
            "#weitereMappen > section > frach-m-milestones > div.frach-m-slider.frach-state-animating > div.frach-m-slider__controls.frach-js-slider__controls"
          ]
        }
      },
      {
        "name": "cards-teaser",
        "instances": [
          "#main-content frach-m-teaser-slider.frach-m-related-content"
        ],
        "pageInstances": {
          "https://www.fraport.com/": [
            "#relatedContent-2d918be24b > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport",
            "#container-dca7058f21 > section:nth-child(2)",
            "#relatedContent-65d6072f7b > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de.html": [
            "#relatedContent-2d918be24b > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport",
            "#container-dca7058f21 > section:nth-child(2)",
            "#relatedContent-65d6072f7b > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder.html": [
            "#relatedContent-8e80dc7fd5 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
            "#container-2bb442baf8 > div",
            "#relatedContent-5325d33afc > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
            "#relatedContent-941ca400c8 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html": [
            "#container-b93ac1825e > section > div > div:nth-child(2)",
            "#relatedContent-55b277bf35 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar.html": [
            "#relatedContent-a5304d802c"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html": [
            "#relatedContent-545400785d"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html": [
            "#relatedContent-cee0a78f78"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html": [
            "#relatedContent-0eabcdac1d"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das.html": [
            "#relatedContent-1f711bb10e"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab.html": [
            "#relatedContent-6ebd3e0afd"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich.html": [
            "#relatedContent-1efe578779"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html": [
            "#relatedContent-f3223ca778"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
            "#relatedContent-5f309d781a > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
            "#relatedContent-f7d8503726 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
            "#relatedContent-2d769645b4",
            "#relatedContent-56ae7cf858 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
            "#relatedContent-b8646c9c74",
            "#relatedContent-b17b9a62dd > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/flugzeugbergung.html": [
            "#relatedContent-60d9e67f98",
            "#relatedContent-a917c8b086 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
            "#relatedContent-b612df14ed",
            "#relatedContent-f7a3dd6183 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html": [
            "#relatedContent-a00056af74",
            "#relatedContent-7caeefd29e > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
            "#relatedContent-a4feabbcd4 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
            "#relatedContent-d38ab42019 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
            "#relatedContent-e41ca29688 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
            "#relatedContent-dc7f279ae4"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)",
            "#relatedContent-ceb6178d7d > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
            "#relatedContent-5dfb7bbaaf > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
            "#relatedContent-a2b82cec46 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html": [
            "#relatedContent-a150bdcb10 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html": [
            "#relatedContent-51a4ba4da9 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
            "#relatedContent-77e5f054be > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/asset---property-management.html": [
            "#relatedContent-f2697462dd"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/baulandentwicklung---konversion.html": [
            "#relatedContent-38798eb72f"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/energiemanagement.html": [
            "#relatedContent-20b80e015d"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/projektentwicklung---investment.html": [
            "#relatedContent-8625c6f6c9"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/real-estate-consulting.html": [
            "#relatedContent-871fae8574"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
            "#relatedContent-300a0a151d > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/investoren.html": [
            "#relatedContent-6b7d864c84 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/konzern.html": [
            "#relatedContent-e8473650be > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung.html": [
            "#relatedContent-7ff47f136a > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
            "#relatedContent-a766a7c66d > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/konzern/konzernstrategie.html": [
            "#relatedContent-2f14279776 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/konzern/managementsysteme.html": [
            "#relatedContent-c3c9674ebd",
            "#relatedContent-ed10da8cc2 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement.html": [
            "#relatedContent-0b59ee2ecd > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns.html": [
            "#relatedContent-e7185ba16c > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/vorstand.html": [
            "#relatedContent-ef764ea68f"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
            "#relatedContent-47549dd997 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/nachhaltigkeit.html": [
            "#relatedContent-eccc96d23f > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
            "#relatedContent-ee4fc47af1 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
            "#relatedContent-7b0bbe65ab > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
            "#relatedContent-efc9743796 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html": [
            "#relatedContent-0e9e15ec69 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
            "#relatedContent-e6a31b4e29 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung.html": [
            "#relatedContent-521f042a36 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html": [
            "#relatedContent-c2fb351fe6 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html": [
            "#relatedContent-2bc8adf142 > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ],
          "https://www.fraport.com/de/newsroom.html": [
            "#relatedContent-1271ff6cee > div > div > div:nth-child(1) > div > frach-m-slider > div.frach-m-slider__viewport"
          ]
        }
      },
      {
        "name": "newsroom-feed",
        "instances": [
          "#main-content .frach-m-teaser-collection.frach-m-teaser-collection--card-view"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html": [
            "#container-02968a7e6b > section > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom.html": [
            "#container-384a21e6fc > section.frach-h-component-margin.frach-js-refresh-root > div.frach-m-teaser-collection.frach-m-teaser-collection--card-view"
          ]
        }
      },
      {
        "name": "link-box",
        "instances": [
          "#main-content .frach-m-link-box"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-padding.frach-js-refresh-root.frach-h-bg--grey.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-padding.frach-js-refresh-root.aem-GridColumn.aem-GridColumn--default--12"
          ]
        }
      },
      {
        "name": "testimonial",
        "instances": [
          "#main-content .frach-m-testimonial"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
            "#container-b1bab638ae > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
            "#Wer_sind_wir > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/airport-retailing.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ]
        }
      },
      {
        "name": "share-price",
        "instances": [
          "#main-content frach-m-key-figures:has(.frach-m-key-figures__exchange-data-wrapper)"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/investoren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
          ]
        }
      },
      {
        "name": "key-figures",
        "instances": [
          "#main-content frach-m-key-figures",
          "#main-content frach-m-pictogram-key-figures"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
            "#Allgemeines > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung.html": [
            "#container-1fde3a4200 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12 > frach-m-pictogram-key-figures > div > div > div"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12 > frach-m-pictogram-key-figures > div > div > div"
          ],
          "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
            "#container-ffe2bb936b > section",
            "#container-e461f0469d > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
            "#container-edaee3466d > section.AEM_WRAPPER_ELEMENT.frach-h-component-margin"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/zahlen--daten-und-fakten1.html": [
            "#\\32 4-stunden"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/passives-schallschutzprogramm.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ]
        }
      },
      {
        "name": "timeline",
        "instances": [
          "#main-content .frach-m-timeline__items"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
            "#container-d384fe8197 > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > frach-m-timeline > div > div > div > div > frach-m-timeline-item:nth-child(1)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > frach-m-timeline > div > div > div > div > frach-m-timeline-item:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > frach-m-timeline > div > div > div > div > frach-m-timeline-item:nth-child(3)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1) > frach-m-timeline > div > div > div > div > frach-m-timeline-item:nth-child(4)"
          ]
        }
      },
      {
        "name": "form",
        "instances": [
          "#main-content .fraformsform"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center/anfrageformular-lehrgaenge-ftc.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/frankfurt-cargohub/einladung-cargo.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-a-schoenberger.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-i-schaefer.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html": [
            "#anmeldung"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen/antrag.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Airport-Cater-Service-GmbH/kontakt-airport-cater-service-gmbh.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/FraSec-Fraport-Security-Services-GmbH/kontaktformular-frasec.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Frankfurt-Airport-Retail-GmbH/kontakt-frankfurt-airport-retail-gmbh---co--kg.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Casa-GmbH/kontakt-fraport-casa-gmbh.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Regional-Airports-of-Greece-Management-Company/kontakt-fraport-regional-airports-of-greece-management-company-s.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Slovenija/kontakt-aerodrom-ljubljana--d-o-o-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal.html": [
            "#fluglaerm-formular"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm.html": [
            "#dachsicherung"
          ]
        }
      },
      {
        "name": "table-data",
        "instances": [
          "#main-content frach-e-table"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/Veranstaltungen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html": [
            "#Vorsitz"
          ]
        }
      },
      {
        "name": "operating-direction",
        "instances": [
          "#main-content section.frach-h-component-margin:has(> .frach-grid > .frach-grid-row > .frach-grid-col-mq3-8 > .aem-Grid > section > frach-m-embed)"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/aktuelle-betriebsrichtung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ]
        }
      },
      {
        "name": "embed",
        "instances": [
          "#main-content frach-m-embed",
          "#main-content iframe.moin-ai-teaser"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/anmeldung-spezialsprechstunde.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
            "#Allgemeines_Testangebot > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung-grippe.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
            "#moin-ai-teaser"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
            "#moin-ai-teaser"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen.html": [
            "#moin-ai-teaser"
          ],
          "https://www.fraport.com/de/investoren/fraport-aktie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
            "#Verkehrszahlen_Konzern"
          ],
          "https://www.fraport.com/de/newsroom.html": [
            "#container-ab3335afdb > section",
            "#container-036ebf24d9 > section:nth-child(4)"
          ]
        }
      },
      {
        "name": "columns-sidebar",
        "instances": [
          "#main-content .frach-grid-row:has(> .frach-grid-col-mq3-8 + .frach-grid-col-mq3-4 .frach-m-download-list)"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(8) > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/asset---property-management.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/investoren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(9)"
          ],
          "https://www.fraport.com/de/investoren/ansprechpartner.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/investoren/publikationen-termine.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ]
        }
      },
      {
        "name": "downloads",
        "instances": [
          "#main-content .frach-m-tabbed-content__panel .frach-m-download-list"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html": [
            "#Downloads_\\&_Links"
          ]
        }
      },
      {
        "name": "cta",
        "instances": [
          "#main-content .frach-m-cta"
        ],
        "pageInstances": {
          "https://www.fraport.com/": [
            "#container-f66b6c683d > div:nth-child(2)"
          ],
          "https://www.fraport.com/de.html": [
            "#container-f66b6c683d > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/Zeigen-dass-wir-Verantwortung-tragen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(1)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(6)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/investoren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(7)"
          ],
          "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)",
            "#container-1fde3a4200 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(8)"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/konzernstrategie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/diversity.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.frach-h-component-margin.frach-js-refresh-root.aem-GridColumn--default--none.aem-GridColumn.aem-GridColumn--default--12.aem-GridColumn--offset--default--0"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom.html": [
            "#container-384a21e6fc > div:nth-child(2)",
            "#container-cf6a893b8a > div:nth-child(3)",
            "#container-036ebf24d9 > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/newsroom/bilddatenbank/nutzungsbedingungen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/infofilme/flugzeugabfertigung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/newsroom/infofilme/sicherer-flugbetrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/newsroom/videomaterial.html": [
            "#container-f18ab7741a > div:nth-child(4)"
          ]
        }
      },
      {
        "name": "cards",
        "instances": [
          "#main-content .frach-grid-row:has(> .frach-grid-col-mq3-4 + .frach-grid-col-mq3-4 + .frach-grid-col-mq3-4 frach-m-image)"
        ],
        "pageInstances": {
          "https://www.fraport.com/": [
            "#container-dca7058f21 > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de.html": [
            "#container-dca7058f21 > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
            "#container-2bb442baf8 > section > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/kontakt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3) > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4) > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2) > div > div:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(12)"
          ],
          "https://www.fraport.com/de/investoren/ansprechpartner.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung.html": [
            "#container-1fde3a4200 > div > section:nth-child(6) > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html": [
            "#Spenden > section:nth-child(2) > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(8)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(9)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(10)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(11)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(12)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(13)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(14)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(17)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(13)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(7) > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/weitere-kontakte.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ]
        }
      },
      {
        "name": "tiles",
        "instances": [
          "#main-content section.frach-h-bg--grey > .frach-grid > .frach-grid-row:has(> .frach-grid-col-mq3-6 + .frach-grid-col-mq3-6 frach-m-image)"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom/infofilme.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ]
        }
      },
      {
        "name": "columns",
        "instances": [
          "#main-content section.frach-h-bg--grey > .frach-grid > .frach-grid-row:has(> .frach-grid-col-mq3-4 frach-m-text-media)"
        ],
        "pageInstances": {
          "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)"
          ]
        }
      },
      {
        "name": "text-media",
        "instances": [
          "#main-content section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding:has(frach-m-image):has(.frach-m-text)",
          "#main-content frach-m-text-media:has(.frach-m-slider)"
        ],
        "pageInstances": {
          "https://www.fraport.com/": [
            "#container-f83a543818 > section > div > div:nth-child(2)",
            "#container-f66b6c683d > section"
          ],
          "https://www.fraport.com/de.html": [
            "#container-f83a543818 > section > div > div:nth-child(2)",
            "#container-f66b6c683d > section"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
            "#container-9c85b3a3a1 > section > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div.container.responsivegrid.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/online-ausweisbeantragung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/investoren.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
          ],
          "https://www.fraport.com/de/investoren/hauptversammlung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung.html": [
            "#container-eb709c208e > section > div > div:nth-child(2)",
            "#container-1fde3a4200 > div > section:nth-child(4)",
            "#container-f123e1d106 > section > div.frach-m-teaser-collection.frach-m-teaser-collection--card-view > div > div > div > div.frach-m-teaser-collection__list-wrapper > a:nth-child(1)",
            "#container-f123e1d106 > section > div.frach-m-teaser-collection.frach-m-teaser-collection--card-view > div > div > div > div.frach-m-teaser-collection__list-wrapper > a:nth-child(2)",
            "#container-f123e1d106 > section > div.frach-m-teaser-collection.frach-m-teaser-collection--card-view > div > div > div > div.frach-m-teaser-collection__list-wrapper > a:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern/digitalisierung/robotikstrategie.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(8)"
          ],
          "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(5)",
            "#container-4ef6c0cda1 > section:nth-child(1)",
            "#container-4ef6c0cda1 > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region.html": [
            "#container-6ca87e43f8 > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(6)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(8)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(11)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(15)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
            "#container-f6f31b707a > section",
            "#container-2cd4e3017c > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
            "#container-edaee3466d > section:nth-child(1)",
            "#container-98f8858bd3 > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(1)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(4)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-.html": [
            "#container-53286bb005 > section:nth-child(1)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(9)"
          ],
          "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(2)",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(5)"
          ],
          "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12",
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section:nth-child(3)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding.aem-GridColumn.aem-GridColumn--default--12 > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1.html": [
            "#main-content > div > div > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div > section"
          ],
          "https://www.fraport.com/de/newsroom.html": [
            "#container-384a21e6fc > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding",
            "#container-036ebf24d9 > section.frach-h-component-margin.frach-h-bg--grey.frach-h-component-padding",
            "#container-ba4fbaabc1 > section > div > div:nth-child(2)"
          ],
          "https://www.fraport.com/de/newsroom/pressemappe.html": [
            "#aktuelleMappe > section > div > div:nth-child(2)",
            "#KlimaMappe > section > div > div:nth-child(2)"
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
          "hero"
        ],
        "defaultContent": [
          ".frach-m-text"
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
          "teaser-mosaic",
          "video-player",
          "teaser-feature",
          "accordion",
          "tabs-topic",
          "carousel-text-media",
          "image-gallery-tiles",
          "cards-teaser",
          "newsroom-feed",
          "link-box",
          "testimonial",
          "share-price",
          "key-figures",
          "timeline",
          "form",
          "table-data",
          "operating-direction",
          "embed",
          "columns-sidebar",
          "downloads",
          "cta",
          "cards",
          "tiles",
          "columns",
          "text-media",
          "hero",
          "anchor-list",
          "section-title"
        ],
        "defaultContent": [
          "frach-m-text-media.frach-m-text-media--100",
          ".frach-m-text",
          "frach-m-image"
        ]
      },
      {
        "id": "chat-widget",
        "name": "Chat widget",
        "selector": [
          "#moin-ai-container"
        ],
        "style": null,
        "blocks": [
          "embed"
        ],
        "defaultContent": []
      }
    ],
    "pageCleanup": {
      "https://www.fraport.com/": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1fb21bd210-notification-overlay"
      ],
      "https://www.fraport.com/de.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1fb21bd210-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6144969bdd-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/bau.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-032b55076c-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/bau/flughafenausbau.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4c59bfb3d6-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/bau/hessens-tor-zur-welt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-18917c339d-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/bau/wirtschaftsfaktor-flughafen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-be8ec3b1e7-notification-overlay",
        "#content-0462726a7b > frach-m-media-lightbox:nth-child(9)",
        "#content-0462726a7b > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay",
        "#item-ea426ddb61-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-8c0ce5ebf8-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-cecefa4e28-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-82cf67068a-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-bad90dbc62-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-fd36b9abbb-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-88ff857efe-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-4f644d8776-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-64a56c663b-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-0e937da507-hotspot > frach-e-tooltip:nth-child(2)",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--right"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2e74e277fd-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-202a8f52f8-notification-overlay",
        "#item-8605ff2e66-hotspot > frach-e-tooltip:nth-child(2)",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--right",
        "#item-3a88404ce8-hotspot > frach-e-tooltip:nth-child(2)",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/bahnsperrungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-70daa33e18-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/glossar.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8d71b752a6-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/warum-braucht-es-das.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-03809f08ac-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-aendert-sich.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f0f44b62f1-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/was-wird-fuer-den-schallschutz-getan.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c3adb57547-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/welche-auswirkungen-hat-das.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5209dc45a9-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-laeuft-der-prozess-ab.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-92c700ebad-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/wie-veraendert-sich-der-laermschutzbereich.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ed241e4466-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/betriebskonzept/worum-geht-es.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-23b873472d-notification-overlay",
        "#content-fbfc19b9d9 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flug--und-terminalbetrieb/kontakt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c0f98e25a9-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b31e672804-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenentgelte/flughafenentgelte.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-78804c46ca-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3184f23a5c-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/abwehrender-brandschutz.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f4e297c36a-notification-overlay",
        "#content-a29c22d8b8 > frach-m-media-lightbox:nth-child(9)",
        "#content-a29c22d8b8 > frach-m-media-lightbox:nth-child(9)",
        "#content-a29c22d8b8 > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-87e0db773a-notification-overlay",
        "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
        "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
        "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
        "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
        "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
        "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
        "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
        "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
        "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
        "#content-2d18e100ac > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/feuerwehr-training-center/anfrageformular-lehrgaenge-ftc.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a466864c24-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/flugzeugbergung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cfb07ead2f-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/technik.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-db45a856e9-notification-overlay",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)",
        "#content-eee860178e > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenfeuerwehr/vorbeugender-brandschutz.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8b64878d3b-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/flughafenlieferungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b44871c69c-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/frankfurt-cargohub/einladung-cargo.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-13058f0065-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/ground-services-equipment.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4120035f0e-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a58a5ed39a-notification-overlay",
        "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
        "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
        "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
        "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
        "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
        "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
        "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
        "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)",
        "#content-a394cc3644 > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/anmeldung-spezialsprechstunde.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-32069a7f2d-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/corona-testmoeglichkeiten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-03ed21ca0f-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung-grippe.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e7e05153ac-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/medical-center/terminbuchung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-11556fcaf3-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8eb96956f0-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c4c95a667d-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/Zeigen-dass-wir-Verantwortung-tragen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-627cad71c1-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/reagieren--wenn-jede-sekunde-zaehlt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bcdc8780ee-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/respektieren--was-grenzen-setzt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-94b957b5d9-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/schuetzen--was-uns-verbindet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a5005d2a40-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/sehen--was-niemand-uebersehen-darf.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f343bec64c-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/unterstuetzen--wenn-technik-und-einsatz-gefordert-sind.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-120634c4fc-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/betrieb/unternehmenssicherheit/security-awareness/verzichten--um-andere-zu-schuetzen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0ced201b68-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/international-activities.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-068d8aa829-notification-overlay",
        "#content-4ecc9eaa94 > frach-m-media-lightbox:nth-child(9)",
        "#content-4ecc9eaa94 > frach-m-media-lightbox:nth-child(9)",
        "#content-4ecc9eaa94 > frach-m-media-lightbox:nth-child(9)",
        "#content-4ecc9eaa94 > frach-m-media-lightbox:nth-child(9)",
        "#content-4ecc9eaa94 > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0f8afca1e9-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-36f71c763a-notification-overlay",
        "#content-ea837bb978 > frach-m-media-lightbox:nth-child(9)",
        "#content-ea837bb978 > frach-m-media-lightbox:nth-child(9)",
        "#content-ea837bb978 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/fahrerausbildung/recurrent-training.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b1a29f2ec8-notification-overlay",
        "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
        "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
        "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
        "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
        "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
        "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
        "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
        "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
        "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
        "#content-3c46506438 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4e19adfcef-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/allgemeine-informationen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6a1a85c506-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ansprechpartner.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d0f1e5182a-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/archiv.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fad257c964-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fab4d97e43-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/ausweisbeantragung0/online-ausweisbeantragung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4f2311f5ba-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dad46a3382-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/digitalisierungsmassnahmen-im-servicecenter-flughafenausweise/ausweis-services-auf-einen-blick.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0e3265e4f2-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/faq.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-901571aacd-notification-overlay",
        "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
        "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
        "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
        "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
        "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
        "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
        "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
        "#content-6588f4bf1e > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-71e4f4ea60-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/luftsicherheitsschulung/11-2-6-2-interaktives-sicherheitstraining--ist-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5ae7a8af73-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/preise-fuer-flughafenausweise.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2e03af87a3-notification-overlay",
        "#content-4b6df3191c > frach-m-media-lightbox:nth-child(9)",
        "#content-4b6df3191c > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-25bfd4ab59-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/flughafenausweise/voraussetzungen/antrag-auf-registrierung-einer-firma.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6423f2f1a8-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-317c4289ae-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/Bekanntmachungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-784be111d3-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/einkauf-und-bauvergabe.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-800acc67a4-notification-overlay",
        "#content-c5bb3d1ef0 > frach-m-media-lightbox:nth-child(9)",
        "#content-c5bb3d1ef0 > frach-m-media-lightbox:nth-child(9)",
        "#content-c5bb3d1ef0 > frach-m-media-lightbox:nth-child(9)",
        "#content-c5bb3d1ef0 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/elektronischer-rechnungsversand.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d352e8235c-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7ba52fd672-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-a-schoenberger.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7fcc774540-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/gewerbliche-taetigkeit-und-gestattungen/gewerbliche-taetigkeiten-i-schaefer.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3ba8ea5765-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/geschaeftspartner/richtlinien-und-zahlungsbedingungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e3e45d8b6b-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/it-services.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ffa5da45f3-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/parken---mobilitaet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6c0046d82a-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-69c4ca700e-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/asset---property-management.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bfa60f8e14-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/baulandentwicklung---konversion.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c836883184-notification-overlay",
        "#content-4743629020 > frach-m-media-lightbox:nth-child(9)",
        "#content-4743629020 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/energiemanagement.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-03aec086a0-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/projektentwicklung---investment.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4377243dd3-notification-overlay",
        "#content-6c7ef98615 > frach-m-media-lightbox:nth-child(9)",
        "#content-6c7ef98615 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/real-estate-consulting.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a4974eeb59-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/ueber-uns.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-94ec219c47-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/unser-track-record.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-220f2d688d-notification-overlay",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "#content-d3c2bc6984 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e25586f1e1-notification-overlay",
        "#content-565614a084 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/real-estate/vermietung/schliessanlagenverwaltung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-452d34328b-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c9b815ab5c-notification-overlay"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/airport-retailing.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ee32789b95-notification-overlay",
        "#content-14674bdbee > frach-m-media-lightbox:nth-child(9)",
        "#content-14674bdbee > frach-m-media-lightbox:nth-child(9)",
        "#content-14674bdbee > frach-m-media-lightbox:nth-child(9)",
        "#content-14674bdbee > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/geschaeftsfelder/service/retailing---advertising/flughafenwerbung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7aad609ac0-notification-overlay"
      ],
      "https://www.fraport.com/de/investoren.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-65ffd9f155-notification-overlay"
      ],
      "https://www.fraport.com/de/investoren/ansprechpartner.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-376d462a5b-notification-overlay"
      ],
      "https://www.fraport.com/de/investoren/corporate-governance.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8a1be2c195-notification-overlay"
      ],
      "https://www.fraport.com/de/investoren/creditor-relations.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-529095cce3-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/investoren/fraport-aktie.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d2197fa26d-notification-overlay"
      ],
      "https://www.fraport.com/de/investoren/hauptversammlung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-06ed620bf5-notification-overlay"
      ],
      "https://www.fraport.com/de/investoren/indizes-und-ratings.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c62fb92861-notification-overlay"
      ],
      "https://www.fraport.com/de/investoren/publikationen-termine.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cb5efa6840-notification-overlay"
      ],
      "https://www.fraport.com/de/investoren/verkehrszahlen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-eb317b1105-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-90bde30043-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/digitalisierung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-15bb827f20-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/digitalisierung/ai-fraport.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-237cab5809-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-32ba324781-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/digitalisierung/open-pitch-day/anmeldung-open-pitch-day.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e9af0b8b61-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/digitalisierung/robotikstrategie.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3f2048bac8-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/konzernstrategie.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-998ad955ae-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/managementsysteme.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f0397d382c-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/managementsysteme/arbeitsschutzmanagement.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c30dfe14a0-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/managementsysteme/qualitaetsmanagement.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-218075ee27-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/managementsysteme/safety-management-system.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c3ff015389-notification-overlay",
        "#content-f02853d396 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-88746e6af4-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/Newsletter.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-610f4afc73-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/Veranstaltungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8a9cbfb8b1-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/bildung-und-soziales.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2430b7b78e-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/kultur.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-97aea4675f-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-228d29b918-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/eintracht-wir-leben-dich.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-56647e6973-notification-overlay",
        "#content-244319f842 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/profisport/eintracht-frankfurt/kreiere-deinen-emoji.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c04c5ff611-notification-overlay",
        "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
        "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
        "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
        "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
        "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
        "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)",
        "#content-35ef1df7b1 > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/profisport/internationales-festhallen-reitturnier.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4a4679a949-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/profisport/loewen-frankfurt-nachwuchs.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b94917349c-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a4ee128714-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/regionales-engagement/rundfahrten-fuer-vereine-im-nachbarschaftsrahmen/antrag.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aec2da85ff-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-efbf28ecef-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-63a8598c47-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/100-jahre-luftfahrt---flughafen-frankfurt-frueher-und-heute.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-66b4c7a570-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/afterwork-party--achtung-terminverschiebung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-32eeeaf49a-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeiten-im-wimmelbild---wie-jan-paul-mueller-die-arbeitsstaette.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c5f01d8d36-notification-overlay",
        "#content-390a89426f > frach-m-media-lightbox:nth-child(9)",
        "#content-390a89426f > frach-m-media-lightbox:nth-child(9)",
        "#content-390a89426f > frach-m-media-lightbox:nth-child(9)",
        "#content-390a89426f > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/arbeitsstaette-fra.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3782a87a0a-notification-overlay",
        "#content-fc89e9e9d6 > frach-m-media-lightbox:nth-child(9)",
        "#content-fc89e9e9d6 > frach-m-media-lightbox:nth-child(9)",
        "#content-fc89e9e9d6 > frach-m-media-lightbox:nth-child(9)",
        "#content-fc89e9e9d6 > frach-m-media-lightbox:nth-child(9)",
        "#content-fc89e9e9d6 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/architektur-am-airport.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9bdfbb98f8-notification-overlay",
        "#content-f17e821128 > frach-m-media-lightbox:nth-child(10)"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/ausflugsziel-airport.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a5510b5de6-notification-overlay",
        "#content-022cdfbd62 > frach-m-media-lightbox:nth-child(9)",
        "#content-022cdfbd62 > frach-m-media-lightbox:nth-child(9)",
        "#content-022cdfbd62 > frach-m-media-lightbox:nth-child(9)",
        "#content-022cdfbd62 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/connecting-the-world-with-music---musik-fuer-die-region.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2e6304584d-notification-overlay",
        "#content-594358c803 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deine-welt-der-moeglichkeiten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fbdb9e75b4-notification-overlay",
        "#content-9646d046b1 > frach-m-media-lightbox:nth-child(9)",
        "#content-9646d046b1 > frach-m-media-lightbox:nth-child(9)",
        "#content-9646d046b1 > frach-m-media-lightbox:nth-child(9)",
        "#content-9646d046b1 > frach-m-media-lightbox:nth-child(9)",
        "#content-9646d046b1 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/der-flughafen-als-ausflugsziel.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8690bd76fe-notification-overlay",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "#content-544b915ad4 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/deutschlands-tor-zur-welt-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1769036832-notification-overlay",
        "#content-42426a7da8 > frach-m-media-lightbox:nth-child(9)",
        "#content-42426a7da8 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/doppeltes-netz-fuer-sichere-hoehenfluege-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f6208507f9-notification-overlay",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "#content-e8584c5a08 > frach-m-media-lightbox:nth-child(10)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/einkaufsparadies-fra.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5bd8e581d5-notification-overlay",
        "#content-9722329fd2 > frach-m-media-lightbox:nth-child(9)",
        "#content-9722329fd2 > frach-m-media-lightbox:nth-child(9)",
        "#content-9722329fd2 > frach-m-media-lightbox:nth-child(9)",
        "#content-9722329fd2 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/entspannt-reisen-ab-fra.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-56abe9b5f8-notification-overlay",
        "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
        "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
        "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
        "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
        "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
        "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
        "#content-94be5da969 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/festschrift-gewinnen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7bdf990433-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/flughafen-frankfurt-mit-kindern.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3d7dbb4da4-notification-overlay",
        "#content-be988cd6ea > frach-m-media-lightbox:nth-child(9)",
        "#content-be988cd6ea > frach-m-media-lightbox:nth-child(9)",
        "#content-be988cd6ea > frach-m-media-lightbox:nth-child(9)",
        "#content-be988cd6ea > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/frankfurt-am-meer---europas-f-r-ischehafen--1.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0d17d2ae83-notification-overlay",
        "#content-7a1026f0a2 > frach-m-media-lightbox:nth-child(9)",
        "#content-7a1026f0a2 > frach-m-media-lightbox:nth-child(9)",
        "#content-7a1026f0a2 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gastro-erlebnis-kaffeegarten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-37311ca604-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/gewinnspiel-after-work-party.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cc2d261b27-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/heiss-begehrt--know-how-der-flughafenfeuerwehr.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e306fae64d-notification-overlay",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)",
        "#content-5c1ce5e09a > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/herzensmomente--fra.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-96e6b5778d-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-besonderem-adrenalin-kick.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b14b90e7ed-notification-overlay",
        "#content-e01a5db645 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/hoehenflug-mit-bodenhaftung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c4aaacb1cf-notification-overlay",
        "#content-f2d9236084 > frach-m-media-lightbox:nth-child(9)",
        "#content-f2d9236084 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/jugendfeuerwehr-meets-flughafenfeuerwehr-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8dbeafab7e-notification-overlay",
        "#content-c8d6e91b51 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-473c590b58-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/kunstvoll-bewegt0.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9739e6bdc6-notification-overlay",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "#content-f01411c254 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/luftige-gruesse-per-post.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-12991c6bff-notification-overlay",
        "#content-259bd428aa > frach-m-media-lightbox:nth-child(9)",
        "#content-259bd428aa > frach-m-media-lightbox:nth-child(9)",
        "#content-259bd428aa > frach-m-media-lightbox:nth-child(9)",
        "#content-259bd428aa > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen-frankfurt---momem-und-fraport-laden-zu.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-14274bd108-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/party-sommer-am-flughafen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d7cd5d7123-notification-overlay",
        "#content-a41e98a1ca > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/passenger-journey.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5a7c7e3cc9-notification-overlay",
        "#content-fec0f63e61 > frach-m-media-lightbox:nth-child(9)",
        "#content-fec0f63e61 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/planespotting--fra.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-445c11c737-notification-overlay",
        "#event-f3a08748f7 > frach-m-media-lightbox:nth-child(9)",
        "#event-f3a08748f7 > frach-m-media-lightbox:nth-child(9)",
        "#event-f3a08748f7 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/reise-in-die-vergangenheit.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-247fdfe7a6-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/seit-50-jahren-in-bewegung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-214bb3630f-notification-overlay",
        "#content-d535d288ce > frach-m-media-lightbox:nth-child(9)",
        "#content-d535d288ce > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/sonnige-aussichten-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8bb15c60ef-notification-overlay",
        "#content-76e8fed943 > frach-m-media-lightbox:nth-child(10)",
        "#content-76e8fed943 > frach-m-media-lightbox:nth-child(10)",
        "#content-76e8fed943 > frach-m-media-lightbox:nth-child(10)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/stadt-der-champions.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a584930da8-notification-overlay",
        "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
        "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
        "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
        "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
        "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
        "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
        "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
        "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)",
        "#content-55bb545fdf > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gut-versorgt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f61f5d94fa-notification-overlay",
        "#content-15a43168ca > frach-m-media-lightbox:nth-child(9)",
        "#content-15a43168ca > frach-m-media-lightbox:nth-child(9)",
        "#content-15a43168ca > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/tierisch-gutes-gewinnspiel.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-10dc035623-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/100jahrewieimflug/zwei-urgesteine-mit-hundert-jahren-auf-dem-buckel.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9c0046134a-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/aufsichtsrat.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3345acfc0e-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/compliance.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-822575e35e-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/compliance/hinweisgebersysteme.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-38b50b23c9-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/diversity.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-48f71160ee-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/vorstand.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5d7634cd04-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/ueber-uns/zahlen--daten-und-fakten1.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dd25206c20-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay",
        "#item-5d2a8734b8-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-14176e00ca-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-0c2352a3d9-hotspot > frach-e-tooltip:nth-child(2)",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left",
        "#item-756ce8d382-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-b38334e63b-hotspot > frach-e-tooltip:nth-child(2)",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--right"
      ],
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dcfa81979f-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Airport-Cater-Service-GmbH/kontakt-airport-cater-service-gmbh.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-2b9eb26c6b-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/FraSec-Fraport-Security-Services-GmbH/kontaktformular-frasec.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bf960160e9-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Frankfurt-Airport-Retail-GmbH/kontakt-frankfurt-airport-retail-gmbh---co--kg.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-615a05be68-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Casa-GmbH/kontakt-fraport-casa-gmbh.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a464d140c2-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Regional-Airports-of-Greece-Management-Company/kontakt-fraport-regional-airports-of-greece-management-company-s.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c93515aed9-notification-overlay"
      ],
      "https://www.fraport.com/de/konzern/unsere-internationalen-flughaefen-und-beteiligungen/Fraport-Slovenija/kontakt-aerodrom-ljubljana--d-o-o-.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-587f545949-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-11ac05ea99-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a1d8bd022c-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/arbeitsmedizin--praevention-und-gesundheitsmanagement.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-956108a3d0-notification-overlay",
        "#content-645db6a464 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/Beschaeftigte/konzernarbeitsschutz.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d25dfeb5a2-notification-overlay",
        "#content-3fb39ad0f4 > frach-m-media-lightbox:nth-child(9)",
        "#content-3fb39ad0f4 > frach-m-media-lightbox:nth-child(9)",
        "#content-3fb39ad0f4 > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/gesellschaft.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-e66b8c7c55-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0dcb440f1a-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-1e1243631e-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/aktuelle-betriebsrichtung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-da711a24c1-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/news/2023.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8f6ceefd59-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/aktuelles/prognosen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-dfa990764d-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7b647dbc26-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/interaktive-karten/flugrouten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-cbb06d8431-notification-overlay",
        "#content-b46c90df40 > frach-m-media-lightbox:nth-child(9)",
        "#content-b46c90df40 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b9ba6ce086-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-54bfba5130-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/bahnensystem-und-betriebszeiten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-20f8483fe0-notification-overlay",
        "#content-0a61858a06 > frach-m-media-lightbox:nth-child(9)",
        "#content-0a61858a06 > frach-m-media-lightbox:nth-child(9)",
        "#content-0a61858a06 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/flugbetrieb/betriebsrichtung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aa2949f6cf-notification-overlay",
        "#content-ccc2805911 > frach-m-media-lightbox:nth-child(10)",
        "#content-ccc2805911 > frach-m-media-lightbox:nth-child(10)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c5427ae27b-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/allgemeine-informationen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9ebc8f5b9f-notification-overlay",
        "#item-23fdce7adc-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-29f1c3ceea-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-b6ae21b72f-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-f3ef6ffdf2-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-dfffd7074f-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-8e8a1412ef-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-9fd650b59d-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-0ed9f29c56-hotspot > frach-e-tooltip:nth-child(2)",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--right"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/fluglaermkonturen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-041ee8e29c-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messberichte.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bce7870e38-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/fluglaerm/messergebnisse-und-routennutzung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a50278b59f-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/glossar.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-df46581784-notification-overlay",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "#content-47fa45ed15 > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/luftqualitaet.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4a977a86ff-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--right"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0472aee3f1-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/aktives-schallschutzprogramm.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d1353e5e29-notification-overlay",
        "#content-9096343582 > frach-m-media-lightbox:nth-child(9)",
        "#content-9096343582 > frach-m-media-lightbox:nth-child(9)",
        "#content-9096343582 > frach-m-media-lightbox:nth-child(9)",
        "#content-9096343582 > frach-m-media-lightbox:nth-child(9)",
        "#content-9096343582 > frach-m-media-lightbox:nth-child(9)",
        "#content-9096343582 > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/dachsicherungsprogramm.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f92f622a7c-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/laerm-und-luft/massnahmen/passives-schallschutzprogramm.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-18c716d196-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5c38991daf-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/anfrage-portal.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6d27bd4bf8-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/feedback-dachsicherungsprogramm.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-61c5a576d3-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/fragen-und-antworten.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-52ba596aaf-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/nachbarschaftsdialog/mein-anliegen/weitere-kontakte.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-87f81ca9fb-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/umwelt-und-klimaschutz.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-a4e037c03e-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-03f7ac6a95-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/unternehmensfuehrung/lieferkettensorgfaltspflichtengesetz.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-aeff0d7e2a-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/wertschaffung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-600c72308a-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/selbstverpflichtungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-c784613572-notification-overlay"
      ],
      "https://www.fraport.com/de/nachhaltigkeit/wertschaffung/stakeholder-dialog1.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-80eb71800c-notification-overlay",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/newsroom.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6ed2a18c36-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/bilddatenbank.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-f46ddc2877-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/bilddatenbank/desktop-wallpapers.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-897f36f4bf-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/bilddatenbank/nutzungsbedingungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-42b38d7308-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/bilddatenbank/smartphone-wallpapers.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-b7b354bc57-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/frafacts.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-929f4ed303-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/infofilme.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6fc5ad8ce8-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/infofilme/flugzeugabfertigung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-600d862dbd-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/infofilme/sicherer-flugbetrieb.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7779c83d69-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-911ad1b115-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/15-09-2021-terminal-3.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-466b9e4dbd-notification-overlay",
        "#content-05c26bdf3a > frach-m-media-lightbox:nth-child(9)",
        "#content-05c26bdf3a > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/30-07-2021-besucherzentrum.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7b51e12b37-notification-overlay",
        "#content-9b5c75be03 > frach-m-media-lightbox:nth-child(9)",
        "#content-9b5c75be03 > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/50-jahre-terminal-1.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-6771473084-notification-overlay",
        "#content-7390ac7dc7 > frach-m-media-lightbox:nth-child(9)",
        "#content-7390ac7dc7 > frach-m-media-lightbox:nth-child(9)",
        "#item-3a04c111e2-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-14475aac1b-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-c810877ab7-hotspot > frach-e-tooltip:nth-child(2)",
        "#item-5ed4e1d7ab-hotspot > frach-e-tooltip:nth-child(2)",
        "frach-e-tooltip.frach-e-tooltip.frach-e-tooltip--left"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/begehung-pier-g.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-ca109b2932-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/boddenberg26-07-2021.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-eb2531916c-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pharma-fra.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-affb0a446d-notification-overlay",
        "#content-7f855b5c03 > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--flughafenfeuerwehr-frankfurt-am-main.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-8547a8dd7f-notification-overlay",
        "#content-a80a6716dd > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--klima-und-umwelt.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bdb5014f5a-notification-overlay",
        "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)",
        "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)",
        "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)",
        "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)",
        "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)",
        "#content-c131753e8a > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--neue-sky-line-bahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-fafd109c23-notification-overlay",
        "#content-a5746708ae > frach-m-media-lightbox:nth-child(9)",
        "#content-a5746708ae > frach-m-media-lightbox:nth-child(9)",
        "#content-a5746708ae > frach-m-media-lightbox:nth-child(9)",
        "#content-a5746708ae > frach-m-media-lightbox:nth-child(9)",
        "#content-a5746708ae > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe--sonnenstrom-fuer-fraport.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-9614a80a7f-notification-overlay",
        "#content-9604d6ea0b > frach-m-media-lightbox:nth-child(10)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-eroeffnung-betriebstag-terminal-3.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-bbafd9bace-notification-overlay",
        "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
        "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
        "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
        "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
        "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
        "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
        "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)",
        "#content-be046d4316 > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-terminal-3-besichtigung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3e49837d2d-notification-overlay",
        "#content-62b3739282 > frach-m-media-lightbox:nth-child(10)",
        "#content-62b3739282 > frach-m-media-lightbox:nth-child(10)",
        "#content-62b3739282 > frach-m-media-lightbox:nth-child(10)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-vip-terminal.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-7f1aca62ab-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-neuen-sky-line-bahn.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-d7d21f249f-notification-overlay",
        "#content-dd66719220 > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/pressemappe-zur-terminal-3-besichtigung.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-5fd167fba6-notification-overlay",
        "#content-39043c6fdd > frach-m-media-lightbox:nth-child(9)",
        "#content-39043c6fdd > frach-m-media-lightbox:nth-child(9)"
      ],
      "https://www.fraport.com/de/newsroom/pressemappe/pressemappen/t3-pressetermin.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-0316a9efcb-notification-overlay"
      ],
      "https://www.fraport.com/de/newsroom/videomaterial.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4c79ed8483-notification-overlay",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "#content-52145325df > frach-m-media-lightbox:nth-child(9)",
        "frach-m-media-lightbox.frach-m-media-lightbox.frach-m-overlay"
      ],
      "https://www.fraport.com/de/newsroom/videomaterial/nutzungsbedingungen.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-3cf769f1d0-notification-overlay"
      ],
      "https://www.fraport.com/de/tools/disclaimer.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-4f03c83f24-notification-overlay"
      ],
      "https://www.fraport.com/de/tools/impressum.html": [
        "#usercentrics-cmp",
        "#usercentrics-root",
        "#metaNavigation-189a1b5aa9-notification-overlay"
      ]
    }
  };
  var parsers = {
    "breadcrumb": parse,
    "sticky-patch": parse2,
    "anchor-list": parse3,
    "teaser-mosaic": parse4,
    "hero": parse5,
    "video-player": parse6,
    "teaser-feature": parse7,
    "accordion": parse17,
    "tabs-topic": parse22,
    "carousel-text-media": parse15,
    "image-gallery-tiles": parse16,
    "cards-teaser": parse25,
    "newsroom-feed": parse23,
    "link-box": parse13,
    "testimonial": parse21,
    "share-price": parse26,
    "key-figures": parse18,
    "timeline": parse27,
    "form": parse20,
    "table-data": parse11,
    "operating-direction": parse28,
    "embed": parse19,
    "columns-sidebar": parse10,
    "downloads": parse8,
    "cta": parse12,
    "cards": parse9,
    "tiles": parse29,
    "columns": parse14,
    "text-media": parse24,
    "section-title": parse30
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
  var import_content_page_2_default = {
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
  return __toCommonJS(import_content_page_2_exports);
})();
