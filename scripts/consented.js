// add functionality that requires user consent here (analytics, martech, etc.)
import('./martech.js').then((m) => m.loadTags());
