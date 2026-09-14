"use client";

/**
 * SpanishLayer — site-wide Spanish translation without touching page markup.
 *
 * HOW IT WORKS
 * Walks visible text nodes and swaps any string that EXACTLY matches a key in
 * the dictionary. Anything not in the dictionary is left untouched, so phone
 * numbers, emails, town names, staff names and dollar amounts can never be
 * mangled. Toggling back to English restores the original text from memory.
 *
 * A MutationObserver re-runs the swap when React renders new content (opening
 * an orbit panel, expanding an FAQ, loading CMS data), so late content is
 * translated too.
 *
 * SAFETY
 * - Exact match only. No guessing, no machine translation at runtime.
 * - Never touches <script>, <style>, <input> values, or [data-no-translate].
 * - If the dictionary is empty or fails to load, the site stays English.
 *   It cannot crash the page.
 */

import { useEffect } from "react";
import { ES_DICT } from "@/lib/es-dictionary";

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "TEXTAREA", "SVG", "PATH", "CANVAS",
]);

// Attributes whose values are visible to users and worth translating.
const ATTRS = ["placeholder", "aria-label", "title", "alt"];

type Dict = Record<string, string>;

export default function SpanishLayer({
  active,
  extra,
}: {
  active: boolean;
  extra?: Dict;
}) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const dict: Dict = { ...ES_DICT, ...(extra ?? {}) };
    if (Object.keys(dict).length === 0) return;

    // Remember original English so we can switch back cleanly.
    const textOriginals = new WeakMap<Text, string>();
    const attrOriginals = new WeakMap<Element, Record<string, string>>();

    let busy = false;
    let queued = false;

    function acceptNode(n: Node): number {
      const p = (n as Text).parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
      if (p.closest("[data-no-translate]")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }

    function collectText(root: Node): Text[] {
      const out: Text[] = [];
      try {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode,
        } as NodeFilter);
        let n: Node | null;
        while ((n = walker.nextNode())) out.push(n as Text);
      } catch {
        /* ignore — never break the page over a walk failure */
      }
      return out;
    }

    function collectEls(root: Node): Element[] {
      // nodeType 1 === ELEMENT_NODE. Avoids relying on a global `Element`,
      // which is not present in every runtime.
      const isEl = root && (root as Node).nodeType === 1;
      if (!isEl && root !== document.body) return [];
      const base = (isEl ? root : document.body) as Element;
      const list: Element[] = [base];
      try {
        base.querySelectorAll("*").forEach((el) => list.push(el));
      } catch {
        /* ignore */
      }
      return list;
    }

    function toES(root: Node) {
      for (const node of collectText(root)) {
        const raw = node.nodeValue ?? "";
        const key = raw.trim();
        if (!key) continue;
        const hit = dict[key];
        if (!hit || hit === key) continue;
        if (!textOriginals.has(node)) textOriginals.set(node, raw);
        node.nodeValue = raw.replace(key, hit);
      }
      for (const el of collectEls(root)) {
        if (el.closest("[data-no-translate]")) continue;
        for (const a of ATTRS) {
          const v = el.getAttribute(a);
          if (!v) continue;
          const hit = dict[v.trim()];
          if (!hit) continue;
          const store = attrOriginals.get(el) ?? {};
          if (!(a in store)) {
            store[a] = v;
            attrOriginals.set(el, store);
          }
          el.setAttribute(a, hit);
        }
      }
    }

    function toEN(root: Node) {
      for (const node of collectText(root)) {
        const orig = textOriginals.get(node);
        if (orig !== undefined) node.nodeValue = orig;
      }
      for (const el of collectEls(root)) {
        const store = attrOriginals.get(el);
        if (!store) continue;
        for (const [a, v] of Object.entries(store)) el.setAttribute(a, v);
      }
    }

    function run(root: Node = document.body) {
      if (busy) return;
      busy = true;
      try {
        if (active) toES(root);
        else toEN(root);
      } finally {
        // Let the observer settle before accepting new mutations.
        requestAnimationFrame(() => {
          busy = false;
        });
      }
    }

    function schedule() {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        run();
      });
    }

    // Initial pass.
    run();

    // Re-apply when React paints new content.
    let observer: MutationObserver | null = null;
    try {
      observer = new MutationObserver((records) => {
        if (busy) return;
        for (const r of records) {
          if (r.type === "childList" && r.addedNodes.length) return schedule();
          if (r.type === "characterData") return schedule();
          if (r.type === "attributes") return schedule();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ATTRS,
      });
    } catch {
      /* observer unsupported — initial pass still applied */
    }

    // Reflect language on <html> for screen readers and CSS hooks.
    const prevLang = document.documentElement.lang;
    document.documentElement.lang = active ? "es" : "en";

    return () => {
      observer?.disconnect();
      // Always hand the DOM back in English so the next mount starts clean.
      busy = false;
      toEN(document.body);
      document.documentElement.lang = prevLang;
    };
  }, [active, extra]);

  return null;
}
