/* eslint-disable */
/* global WebImporter */
import {
  makeImage, para, clean, gridColumns, componentContent,
} from '../utils/fraport-parser-utils.js';

/**
 * Parser for operating-direction (AEM section / grid row): the runway operating-direction widget
 * (.betriebsrichtungsanzeige inside frach-m-embed) beside an explanatory text column.
 *
 * Block contract (blocks/operating-direction): one row — graphic cell (picture), status cell
 * (a heading per status item followed by its value lines, last a "Stand …" paragraph), text
 * cell (copy and details link). No config row (no JSON feed is known for the live data).
 *
 * The runway graphic is an inline SVG in the source; its static fallback image
 * (#fallback img, e.g. westbetrieb.gif) is used as the picture.
 */
export default function parse(element, { document, params }) {
  const widget = element.querySelector('.betriebsrichtungsanzeige');
  // The generic selector (8/4 row with a frach-m-embed) also matches other embeds, e.g. a
  // video beside text: without the widget this is not an operating-direction block.
  if (!widget) return;

  // graphic
  const graphicCell = [];
  const fallback = widget.querySelector('#fallback img, img');
  const img = fallback ? makeImage(document, fallback) : null;
  if (img) graphicCell.push(para(document, img));

  // status panel: heading per item, value lines, "Stand" timestamp last
  const statusCell = [];
  let stand = null;
  const status = widget.querySelector('#betriebsrichtung') || widget;
  status.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach((n) => {
    const text = clean(n.textContent);
    if (!text) return;
    if (/^H[1-6]$/.test(n.tagName)) {
      const h = document.createElement('h3');
      h.textContent = text;
      statusCell.push(h);
      return;
    }
    if (/^(Stand|As of)\b/i.test(text)) { stand = para(document, document.createTextNode(text)); return; }
    // value lines: keep the <br> line breaks
    const p = document.createElement('p');
    [...n.childNodes].forEach((c) => {
      if (c.nodeName === 'BR') p.append(document.createElement('br'));
      else if (clean(c.textContent)) p.append(document.createTextNode(clean(c.textContent)));
    });
    statusCell.push(p);
  });
  if (stand) statusCell.push(stand);

  // explanatory text: the grid column(s) not holding the widget
  const row = element.matches('.frach-grid-row') ? element : element.querySelector('.frach-grid-row');
  const textCell = [];
  gridColumns(row).filter((c) => !c.contains(widget)).forEach((c) => textCell.push(...componentContent(document, c)));

  const rowCells = [graphicCell, statusCell, textCell].filter((c) => c.length);
  const block = WebImporter.Blocks.createBlock(document, { name: 'operating-direction', cells: [rowCells.length ? rowCells : ['']] });
  element.replaceWith(block);
}
