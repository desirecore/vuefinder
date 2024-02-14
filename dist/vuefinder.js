var Ce = Object.defineProperty;
var Se = (p, e, s) => e in p ? Ce(p, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : p[e] = s;
var fe = (p, e, s) => (Se(p, typeof e != "symbol" ? e + "" : e, s), s);
import { reactive as ie, watch as de, ref as _, computed as ee, inject as O, openBlock as l, createElementBlock as m, unref as a, createCommentVNode as M, normalizeClass as z, createElementVNode as t, createTextVNode as N, toDisplayString as u, customRef as Me, withModifiers as Y, Fragment as U, renderList as I, withDirectives as q, withKeys as Z, isRef as _e, vModelText as Q, nextTick as ce, createVNode as H, TransitionGroup as Ee, withCtx as A, onMounted as P, onUpdated as De, onBeforeUnmount as ke, vShow as re, normalizeStyle as be, vModelSelect as pe, provide as je, Transition as Ae, createBlock as L, resolveDynamicComponent as Te, renderSlot as le, onUnmounted as Le, vModelCheckbox as Oe } from "vue";
import Fe from "mitt";
import Ne from "dragselect";
import Ve from "vanilla-lazyload";
import "cropperjs/dist/cropper.css";
import Be from "cropperjs";
import ze from "@uppy/core";
import Ue from "@uppy/xhr-upload";
import "microtip/microtip.css";
var ge;
const me = (ge = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : ge.getAttribute("content");
class He {
  /** @param {RequestConfig} config */
  constructor(e) {
    /** @type {RequestConfig} */
    fe(this, "config");
    this.config = e;
  }
  /** @type {RequestConfig} */
  get config() {
    return this.config;
  }
  /**
   * Transform request params
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {Record<String,?String>|FormData=} input.body
   * @return {RequestTransformResultInternal}
   */
  transformRequestParams(e) {
    const s = this.config, n = {};
    me != null && me !== "" && (n[s.xsrfHeaderName] = me);
    const o = Object.assign({}, s.headers, n, e.headers), r = Object.assign({}, s.params, e.params), c = e.body, d = s.baseUrl + e.url, i = e.method;
    let v;
    i !== "get" && (c instanceof FormData ? (v = c, s.body != null && Object.entries(this.config.body).forEach(([g, x]) => {
      v.append(g, x);
    })) : (v = { ...c }, s.body != null && Object.assign(v, this.config.body)));
    const k = {
      url: d,
      method: i,
      headers: o,
      params: r,
      body: v
    };
    if (s.transformRequest != null) {
      const g = s.transformRequest({
        url: d,
        method: i,
        headers: o,
        params: r,
        body: v
      });
      g.url != null && (k.url = g.url), g.method != null && (k.method = g.method), g.params != null && (k.params = g.params ?? {}), g.headers != null && (k.headers = g.headers ?? {}), g.body != null && (k.body = g.body);
    }
    return k;
  }
  /**
   * Get download url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getDownloadUrl(e, s) {
    if (s.url != null)
      return s.url;
    const n = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "download", adapter: e, path: s.path }
    });
    return n.url + "?" + new URLSearchParams(n.params).toString();
  }
  /**
   * Get preview url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getPreviewUrl(e, s) {
    if (s.url != null)
      return s.url;
    const n = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: s.path }
    });
    return n.url + "?" + new URLSearchParams(n.params).toString();
  }
  /**
   * Send request
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {(Record<String,?String>|FormData|null)=} input.body
   * @param {'arrayBuffer'|'blob'|'json'|'text'=} input.responseType
   * @param {AbortSignal=} input.abortSignal
   * @returns {Promise<(ArrayBuffer|Blob|Record<String,?String>|String|null)>}
   * @throws {Record<String,?String>|null} resp json error
   */
  async send(e) {
    const s = this.transformRequestParams(e), n = e.responseType || "json", o = {
      method: e.method,
      headers: s.headers,
      signal: e.abortSignal
    }, r = s.url + "?" + new URLSearchParams(s.params);
    if (s.method !== "get" && s.body != null) {
      let d;
      s.body instanceof FormData ? d = e.body : (d = JSON.stringify(s.body), o.headers["Content-Type"] = "application/json"), o.body = d;
    }
    const c = await fetch(r, o);
    if (c.ok)
      return await c[n]();
    throw await c.json();
  }
}
function Re(p) {
  const e = {
    baseUrl: "",
    headers: {},
    params: {},
    body: {},
    xsrfHeaderName: "X-CSRF-Token"
  };
  return typeof p == "string" ? Object.assign(e, { baseUrl: p }) : Object.assign(e, p), new He(e);
}
function qe(p) {
  let e = localStorage.getItem(p + "_storage");
  const s = ie(JSON.parse(e ?? "{}"));
  de(s, n);
  function n() {
    Object.keys(s).length ? localStorage.setItem(p + "_storage", JSON.stringify(s)) : localStorage.removeItem(p + "_storage");
  }
  function o(i, v) {
    s[i] = v;
  }
  function r(i) {
    delete s[i];
  }
  function c() {
    Object.keys(s).map((i) => r(i));
  }
  return { getStore: (i, v = null) => s.hasOwnProperty(i) ? s[i] : v, setStore: o, removeStore: r, clearStore: c };
}
async function Ie(p, e) {
  const s = e[p];
  return typeof s == "function" ? (await s()).default : s;
}
function Pe(p, e, s, n) {
  const { getStore: o, setStore: r } = p, c = _({}), d = _(o("locale", e)), i = (g, x = e) => {
    Ie(g, n).then((y) => {
      c.value = y, r("locale", g), d.value = g, r("translations", y), Object.values(n).length > 1 && (s.emit("vf-toast-push", { label: "The language is set to " + g }), s.emit("vf-language-saved"));
    }).catch((y) => {
      x ? (s.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), i(x, null)) : s.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  !o("locale") && !n.length ? i(e) : c.value = o("translations");
  const v = (g, ...x) => x.length ? v(g = g.replace("%s", x.shift()), ...x) : g;
  function k(g, ...x) {
    return c.value && c.value.hasOwnProperty(g) ? v(c.value[g], ...x) : v(g, ...x);
  }
  return { t: k, changeLocale: i, locale: d };
}
const B = {
  EDIT: "edit",
  NEW_FILE: "newfile",
  NEW_FOLDER: "newfolder",
  PREVIEW: "preview",
  ARCHIVE: "archive",
  UNARCHIVE: "unarchive",
  SEARCH: "search",
  RENAME: "rename",
  UPLOAD: "upload",
  DELETE: "delete",
  FULL_SCREEN: "fullscreen",
  DOWNLOAD: "download",
  LANGUAGE: "language"
}, We = Object.values(B), Ge = "2.2.5";
function ye(p, e, s, n, o) {
  return (e = Math, s = e.log, n = 1024, o = s(p) / s(n) | 0, p / e.pow(n, o)).toFixed(0) + " " + (o ? "KMGTPEZY"[--o] + "iB" : "B");
}
function xe(p, e, s, n, o) {
  return (e = Math, s = e.log, n = 1e3, o = s(p) / s(n) | 0, p / e.pow(n, o)).toFixed(0) + " " + (o ? "KMGTPEZY"[--o] + "B" : "B");
}
function Ye(p) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, n = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(p);
  return n[1] * Math.pow(1024, e[n[2].toLowerCase()]);
}
const J = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function Ke(p, e) {
  const s = _(J.SYSTEM), n = _(J.LIGHT);
  s.value = p.getStore("theme", e ?? J.SYSTEM);
  const o = window.matchMedia("(prefers-color-scheme: dark)"), r = (c) => {
    s.value === J.DARK || s.value === J.SYSTEM && c.matches ? n.value = J.DARK : n.value = J.LIGHT;
  };
  return r(o), o.addEventListener("change", r), {
    /**
     * @type {import('vue').Ref<Theme>}
     */
    value: s,
    /**
     * @type {import('vue').Ref<Theme>}
     */
    actualValue: n,
    /**
     * @param {Theme} value
     */
    set(c) {
      s.value = c, c !== J.SYSTEM ? p.setStore("theme", c) : p.removeStore("theme"), r(o);
    }
  };
}
const Je = (p, e) => {
  const s = qe(p.id), n = Fe(), o = s.getStore("metricUnits", !1), r = Ke(s, p.theme), c = e.i18n, d = p.locale ?? e.locale, i = ee(() => Pe(s, d, n, c)), v = (g) => Array.isArray(g) ? g : We, k = p.persist ? s.getStore("path", p.path) : p.path;
  return ie({
    // app version
    version: Ge,
    // root element
    root: null,
    // app id
    debug: p.debug,
    // Event Bus
    emitter: n,
    // active features
    features: v(p.features),
    // http object
    requester: Re(p.request),
    // theme state
    theme: r,
    // view state
    view: s.getStore("viewport", "grid"),
    // fullscreen state
    // fullScreen: storage.getStore('full-screen', props.fullScreen),
    fullscreen: !1,
    // selectButton state
    selectButton: p.selectButton,
    // unit state - for example: GB or GiB
    metricUnits: o,
    // human readable file sizes
    filesize: o ? xe : ye,
    // max file size
    maxFileSize: p.maxFileSize,
    // loading state
    loading: !1,
    // default locale
    i18n: i,
    // modal state
    modal: {
      active: !1,
      type: "delete",
      data: {}
    },
    // main storage adapter
    adapter: s.getStore("adapter"),
    // main storage adapter
    path: k,
    // persist state
    persist: p.persist,
    // storage
    storage: s,
    // fetched items
    data: { adapter: s.getStore("adapter"), storages: [], dirname: k, files: [] },
    // selected items
    selectedItems: []
  });
}, Xe = { class: "border-neutral-300 flex justify-between items-center py-1 text-sm" }, Ze = {
  key: 0,
  class: "flex text-center"
}, Qe = ["aria-label"], et = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "none",
  "stroke-width": "1.5"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
  })
], -1), tt = [
  et
], st = ["aria-label"], at = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "none",
  "stroke-width": "1.5"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
  })
], -1), ot = [
  at
], rt = ["aria-label"], nt = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
}, null, -1), lt = [
  nt
], it = ["aria-label"], dt = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
}, null, -1), ct = [
  dt
], ut = ["aria-label"], mt = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "none",
  "stroke-width": "1.5"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
  })
], -1), vt = [
  mt
], pt = ["aria-label"], ht = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
}, null, -1), ft = [
  ht
], gt = ["aria-label"], _t = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
}, null, -1), kt = [
  _t
], bt = {
  key: 1,
  class: "flex text-center"
}, yt = { class: "pl-2" }, xt = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, wt = {
  key: 0,
  class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, $t = /* @__PURE__ */ t("circle", {
  class: "opacity-25 stroke-blue-900 dark:stroke-blue-100",
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4"
}, null, -1), Ct = /* @__PURE__ */ t("path", {
  class: "opacity-75",
  fill: "currentColor",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
}, null, -1), St = [
  $t,
  Ct
], Mt = { class: "flex text-center items-center justify-end" }, Et = ["aria-label"], Dt = {
  key: 0,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
}, jt = {
  key: 1,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
}, At = {
  name: "VFToolbar"
}, Tt = /* @__PURE__ */ Object.assign(At, {
  setup(p) {
    const e = O("ServiceContainer"), { setStore: s } = e.storage, { t: n } = e.i18n, o = _([]), r = _("");
    e.emitter.on("vf-search-query", ({ newQuery: d }) => {
      r.value = d;
    }), e.emitter.on("vf-nodes-selected", (d) => {
      o.value = d;
    });
    const c = () => {
      e.view = e.view === "list" ? "grid" : "list", s("viewport", e.view);
    };
    return (d, i) => (l(), m("div", Xe, [
      r.value.length ? (l(), m("div", bt, [
        t("div", yt, [
          N(u(a(n)("Search results for")) + " ", 1),
          t("span", xt, u(r.value), 1)
        ]),
        a(e).loading ? (l(), m("svg", wt, St)) : M("", !0)
      ])) : (l(), m("div", Ze, [
        a(e).features.includes(a(B).NEW_FOLDER) ? (l(), m("div", {
          key: 0,
          class: "mx-1.5",
          "aria-label": a(n)("New Folder"),
          "data-microtip-position": "bottom-right",
          role: "tooltip",
          onClick: i[0] || (i[0] = (v) => a(e).emitter.emit("vf-modal-show", { type: "new-folder", items: o.value }))
        }, tt, 8, Qe)) : M("", !0),
        a(e).features.includes(a(B).NEW_FILE) ? (l(), m("div", {
          key: 1,
          class: "mx-1.5",
          "aria-label": a(n)("New File"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: i[1] || (i[1] = (v) => a(e).emitter.emit("vf-modal-show", { type: "new-file", items: o.value }))
        }, ot, 8, st)) : M("", !0),
        a(e).features.includes(a(B).RENAME) ? (l(), m("div", {
          key: 2,
          class: "mx-1.5",
          "aria-label": a(n)("Rename"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: i[2] || (i[2] = (v) => o.value.length != 1 || a(e).emitter.emit("vf-modal-show", { type: "rename", items: o.value }))
        }, [
          (l(), m("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length == 1 ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, lt, 2))
        ], 8, rt)) : M("", !0),
        a(e).features.includes(a(B).DELETE) ? (l(), m("div", {
          key: 3,
          class: "mx-1.5",
          "aria-label": a(n)("Delete"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: i[3] || (i[3] = (v) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "delete", items: o.value }))
        }, [
          (l(), m("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, ct, 2))
        ], 8, it)) : M("", !0),
        a(e).features.includes(a(B).UPLOAD) ? (l(), m("div", {
          key: 4,
          class: "mx-1.5",
          "aria-label": a(n)("Upload"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: i[4] || (i[4] = (v) => a(e).emitter.emit("vf-modal-show", { type: "upload", items: o.value }))
        }, vt, 8, ut)) : M("", !0),
        a(e).features.includes(a(B).UNARCHIVE) && o.value.length == 1 && o.value[0].mime_type == "application/zip" ? (l(), m("div", {
          key: 5,
          class: "mx-1.5",
          "aria-label": a(n)("Unarchive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: i[5] || (i[5] = (v) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "unarchive", items: o.value }))
        }, [
          (l(), m("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, ft, 2))
        ], 8, pt)) : M("", !0),
        a(e).features.includes(a(B).ARCHIVE) ? (l(), m("div", {
          key: 6,
          class: "mx-1.5",
          "aria-label": a(n)("Archive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: i[6] || (i[6] = (v) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "archive", items: o.value }))
        }, [
          (l(), m("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, kt, 2))
        ], 8, gt)) : M("", !0)
      ])),
      t("div", Mt, [
        t("div", {
          class: "mx-1.5",
          "aria-label": a(n)("Change View"),
          "data-microtip-position": "bottom-left",
          role: "tooltip",
          onClick: i[7] || (i[7] = (v) => r.value.length || c())
        }, [
          (l(), m("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([r.value.length ? "stroke-gray-200  dark:stroke-gray-700" : "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, [
            a(e).view === "grid" ? (l(), m("path", Dt)) : M("", !0),
            a(e).view === "list" ? (l(), m("path", jt)) : M("", !0)
          ], 2))
        ], 8, Et)
      ])
    ]));
  }
}), Lt = (p, e = 0, s = !1) => {
  let n;
  return (...o) => {
    s && !n && p(...o), clearTimeout(n), n = setTimeout(() => {
      p(...o);
    }, e);
  };
}, Ot = (p, e, s) => {
  const n = _(p);
  return Me((o, r) => ({
    get() {
      return o(), n.value;
    },
    set: Lt(
      (c) => {
        n.value = c, r();
      },
      e,
      s
    )
  }));
}, Ft = { class: "flex p-1.5 bg-neutral-100 dark:bg-gray-800 border-t border-b border-neutral-300 dark:border-gray-700/50 items-center select-none text-sm" }, Nt = ["aria-label"], Vt = /* @__PURE__ */ t("path", {
  "fill-rule": "evenodd",
  d: "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z",
  "clip-rule": "evenodd"
}, null, -1), Bt = [
  Vt
], zt = ["aria-label"], Ut = /* @__PURE__ */ t("path", { d: "M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" }, null, -1), Ht = [
  Ut
], Rt = ["aria-label"], qt = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M6 18L18 6M6 6l12 12"
}, null, -1), It = [
  qt
], Pt = /* @__PURE__ */ t("path", { d: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" }, null, -1), Wt = [
  Pt
], Gt = { class: "flex leading-6" }, Yt = /* @__PURE__ */ t("span", { class: "text-neutral-300 dark:text-gray-600 mx-0.5" }, "/", -1), Kt = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], Jt = {
  key: 0,
  class: "animate-spin p-1 h-6 w-6 text-white ml-auto",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, Xt = /* @__PURE__ */ t("circle", {
  class: "opacity-25 stroke-blue-900 dark:stroke-blue-100",
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4"
}, null, -1), Zt = /* @__PURE__ */ t("path", {
  class: "opacity-75",
  fill: "currentColor",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
}, null, -1), Qt = [
  Xt,
  Zt
], es = {
  key: 3,
  class: "relative flex bg-white dark:bg-gray-700 justify-between items-center rounded p-1 ml-2 w-full"
}, ts = /* @__PURE__ */ t("div", null, [
  /* @__PURE__ */ t("svg", {
    class: "h-6 w-6 p-1 m-auto stroke-gray-400 fill-gray-100 dark:stroke-gray-400 dark:fill-gray-400/20",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    })
  ])
], -1), ss = ["placeholder"], as = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M6 18L18 6M6 6l12 12"
}, null, -1), os = [
  as
], rs = {
  name: "VFBreadcrumb"
}, ns = /* @__PURE__ */ Object.assign(rs, {
  setup(p) {
    const e = _(null), s = _([]), n = _(!1), o = _(null), r = O("ServiceContainer"), { t: c } = r.i18n;
    r.emitter.on("vf-explorer-update", () => {
      let S = [], h = [];
      e.value = r.data.dirname ?? r.adapter + "://", e.value.length == 0 && (s.value = []), e.value.replace(r.adapter + "://", "").split("/").forEach(function(f) {
        S.push(f), S.join("/") != "" && h.push({
          basename: f,
          name: f,
          path: r.adapter + "://" + S.join("/"),
          type: "dir"
        });
      }), h.length > 4 && (h = h.slice(-5), h[0].name = ".."), s.value = h;
    });
    const d = () => {
      n.value = !1, v.value = "";
    };
    r.emitter.on("vf-search-exit", () => {
      d();
    });
    const i = () => {
      r.features.includes(B.SEARCH) && (n.value = !0, ce(() => o.value.focus()));
    }, v = Ot("", 400);
    de(v, (S) => {
      r.emitter.emit("vf-toast-clear"), r.emitter.emit("vf-search-query", { newQuery: S });
    });
    const k = () => s.value.length && !n.value, g = (S, h = null) => {
      S.preventDefault(), y(S), h ?? (h = s.value.length - 2);
      let f = JSON.parse(S.dataTransfer.getData("items"));
      if (f.find((V) => V.storage !== r.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      r.emitter.emit("vf-modal-show", {
        type: "move",
        items: { from: f, to: s.value[h] ?? { path: r.adapter + "://" } }
      });
    }, x = (S) => {
      S.preventDefault(), k() ? (S.dataTransfer.dropEffect = "copy", S.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-500")) : (S.dataTransfer.dropEffect = "none", S.dataTransfer.effectAllowed = "none");
    }, y = (S) => {
      S.preventDefault(), S.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-500"), k() && S.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-500");
    }, E = () => {
      v.value == "" && d();
    };
    return (S, h) => (l(), m("div", Ft, [
      t("span", {
        "aria-label": a(c)("Go up a directory"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (l(), m("svg", {
          onDragover: h[0] || (h[0] = (f) => x(f)),
          onDragleave: h[1] || (h[1] = (f) => y(f)),
          onDrop: h[2] || (h[2] = (f) => g(f)),
          onClick: h[3] || (h[3] = (f) => {
            var V;
            return !k() || a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter, path: ((V = s.value[s.value.length - 2]) == null ? void 0 : V.path) ?? a(r).adapter + "://" } });
          }),
          class: z(["h-6 w-6 p-0.5 rounded", k() ? "text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer" : "text-gray-400 dark:text-neutral-500"]),
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor"
        }, Bt, 34))
      ], 8, Nt),
      a(r).loading ? (l(), m("span", {
        key: 1,
        "aria-label": a(c)("Cancel"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (l(), m("svg", {
          onClick: h[5] || (h[5] = (f) => a(r).emitter.emit("vf-fetch-abort")),
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.5",
          stroke: "currentColor",
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer"
        }, It))
      ], 8, Rt)) : (l(), m("span", {
        key: 0,
        "aria-label": a(c)("Refresh"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (l(), m("svg", {
          onClick: h[4] || (h[4] = (f) => {
            a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter, path: a(r).data.dirname } });
          }),
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "-40 -40 580 580",
          fill: "currentColor"
        }, Ht))
      ], 8, zt)),
      n.value ? (l(), m("div", es, [
        ts,
        q(t("input", {
          ref_key: "searchInput",
          ref: o,
          onKeydown: Z(d, ["esc"]),
          onBlur: E,
          "onUpdate:modelValue": h[10] || (h[10] = (f) => _e(v) ? v.value = f : null),
          placeholder: a(c)("Search anything.."),
          class: "w-full pb-0 px-1 border-0 text-base ring-0 outline-0 text-gray-600 focus:ring-transparent focus:border-transparent dark:focus:ring-transparent dark:focus:border-transparent dark:text-gray-300 bg-transparent",
          type: "text"
        }, null, 40, ss), [
          [Q, a(v)]
        ]),
        (l(), m("svg", {
          class: "w-6 h-6 cursor-pointer",
          onClick: d,
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.5",
          stroke: "currentColor"
        }, os))
      ])) : (l(), m("div", {
        key: 2,
        class: "group flex bg-white dark:bg-gray-700 items-center rounded p-1 ml-2 w-full",
        onClick: Y(i, ["self"])
      }, [
        (l(), m("svg", {
          onDragover: h[6] || (h[6] = (f) => x(f)),
          onDragleave: h[7] || (h[7] = (f) => y(f)),
          onDrop: h[8] || (h[8] = (f) => g(f, -1)),
          onClick: h[9] || (h[9] = (f) => a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter } })),
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor"
        }, Wt, 32)),
        t("div", Gt, [
          (l(!0), m(U, null, I(s.value, (f, V) => (l(), m("div", { key: V }, [
            Yt,
            t("span", {
              onDragover: (R) => V === s.value.length - 1 || x(R),
              onDragleave: (R) => V === s.value.length - 1 || y(R),
              onDrop: (R) => V === s.value.length - 1 || g(R, V),
              class: "px-1.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded cursor-pointer",
              title: f.basename,
              onClick: (R) => a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter, path: f.path } })
            }, u(f.name), 41, Kt)
          ]))), 128))
        ]),
        a(r).loading ? (l(), m("svg", Jt, Qt)) : M("", !0)
      ]))
    ]));
  }
}), we = (p, e = null) => new Date(p * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), ls = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, is = /* @__PURE__ */ t("path", {
  "fill-rule": "evenodd",
  d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
  "clip-rule": "evenodd"
}, null, -1), ds = [
  is
], cs = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, us = /* @__PURE__ */ t("path", {
  "fill-rule": "evenodd",
  d: "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",
  "clip-rule": "evenodd"
}, null, -1), ms = [
  us
], vs = {
  name: "VFSortIcon"
}, ne = /* @__PURE__ */ Object.assign(vs, {
  props: { direction: String },
  setup(p) {
    return (e, s) => (l(), m("div", null, [
      p.direction === "down" ? (l(), m("svg", ls, ds)) : M("", !0),
      p.direction === "up" ? (l(), m("svg", cs, ms)) : M("", !0)
    ]));
  }
}), ps = ["onClick"], hs = {
  name: "VFToast.vue"
}, fs = /* @__PURE__ */ Object.assign(hs, {
  setup(p) {
    const e = O("ServiceContainer"), { getStore: s } = e.storage, n = _(s("full-screen", !1)), o = _([]), r = (i) => i === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", c = (i) => {
      o.value.splice(i, 1);
    }, d = (i) => {
      let v = o.value.findIndex((k) => k.id === i);
      v !== -1 && c(v);
    };
    return e.emitter.on("vf-toast-clear", () => {
      o.value = [];
    }), e.emitter.on("vf-toast-push", (i) => {
      let v = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      i.id = v, o.value.push(i), setTimeout(() => {
        d(v);
      }, 5e3);
    }), (i, v) => (l(), m("div", {
      class: z([n.value.value ? "fixed" : "absolute", "bottom-0 max-w-fit flex flex-col bottom-0 left-1/2 -translate-x-1/2"])
    }, [
      H(Ee, {
        name: "vf-toast-item",
        "leave-active-class": "transition-all duration-1000",
        "leave-to-class": "opacity-0"
      }, {
        default: A(() => [
          (l(!0), m(U, null, I(o.value, (k, g) => (l(), m("div", {
            onClick: (x) => c(g),
            key: k,
            class: z([r(k.type), "inline-block mx-auto my-0.5 py-0.5 px-2 min-w-max bg-gray-50 dark:bg-gray-600 border text-xs sm:text-sm rounded cursor-pointer"])
          }, u(k.label), 11, ps))), 128))
        ]),
        _: 1
      })
    ], 2));
  }
});
function he(p, e = 14) {
  let s = `((?=([\\w\\W]{0,${e}}))([\\w\\W]{${e + 1},})([\\w\\W]{8,}))`;
  return p.replace(new RegExp(s), "$2..$4");
}
const gs = { class: "relative flex-auto flex flex-col overflow-hidden" }, _s = {
  key: 0,
  class: "grid grid-cols-12 border-b border-neutral-300 border-gray-200 dark:border-gray-700 text-xs select-none"
}, ks = { class: "absolute" }, bs = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "absolute h-6 w-6 md:h-12 md:w-12 m-auto stroke-neutral-500 fill-white dark:fill-gray-700 dark:stroke-gray-600 z-10",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
  })
], -1), ys = { class: "text-neutral-700 dark:text-neutral-300 p-1 absolute text-center top-4 right-[-2rem] md:top-5 md:right-[-2.4rem] z-20 text-xs" }, xs = ["onDblclick", "onContextmenu", "data-type", "data-item", "data-index"], ws = { class: "grid grid-cols-12 items-center" }, $s = { class: "flex col-span-7 items-center" }, Cs = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ss = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Ms = [
  Ss
], Es = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ds = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), js = [
  Ds
], As = { class: "overflow-ellipsis overflow-hidden whitespace-nowrap" }, Ts = { class: "col-span-5 overflow-ellipsis overflow-hidden whitespace-nowrap" }, Ls = ["onDblclick", "onContextmenu", "onDragstart", "onDragover", "onDrop", "data-type", "data-item", "data-index"], Os = { class: "grid grid-cols-12 items-center" }, Fs = { class: "flex col-span-7 items-center" }, Ns = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Vs = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Bs = [
  Vs
], zs = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Us = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Hs = [
  Us
], Rs = { class: "overflow-ellipsis overflow-hidden whitespace-nowrap" }, qs = { class: "col-span-2 text-center" }, Is = { class: "col-span-3 overflow-ellipsis overflow-hidden whitespace-nowrap" }, Ps = ["onDblclick", "onContextmenu", "onDragstart", "onDragover", "onDrop", "data-type", "data-item", "data-index"], Ws = { class: "relative" }, Gs = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-10 w-10 md:h-12 md:w-12 m-auto fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ys = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Ks = [
  Ys
], Js = ["data-src", "alt"], Xs = {
  key: 2,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-10 w-10 md:h-12 md:w-12 m-auto text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Zs = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Qs = [
  Zs
], ea = {
  key: 3,
  class: "absolute hidden md:block top-1/2 w-full text-center text-neutral-500"
}, ta = { class: "break-all" }, sa = {
  name: "VFExplorer"
}, aa = /* @__PURE__ */ Object.assign(sa, {
  setup(p) {
    const e = O("ServiceContainer"), { t: s } = e.i18n;
    e.storage;
    const n = (w) => w == null ? void 0 : w.substring(0, 3), o = _(null), r = _(null), c = _(0), d = _(null), i = Math.floor(Math.random() * 2 ** 32), v = _("");
    let k;
    e.emitter.on("vf-fullscreen-toggle", () => {
      o.value.style.height = null;
    }), e.emitter.on("vf-search-query", ({ newQuery: w }) => {
      v.value = w, w ? e.emitter.emit("vf-fetch", {
        params: {
          q: "search",
          adapter: e.data.adapter,
          path: e.data.dirname,
          filter: w
        },
        onSuccess: (D) => {
          D.files.length || e.emitter.emit("vf-toast-push", { label: s("No search result found.") });
        }
      }) : e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: e.data.dirname } });
    });
    let g = null;
    const x = () => {
      g && clearTimeout(g);
    }, y = _(!0), E = (w) => {
      w.touches.length > 1 && (y.value ? (d.value.stop(), e.emitter.emit("vf-toast-push", { label: s("Drag&Drop: off") })) : (d.value.start(), e.emitter.emit("vf-toast-push", { label: s("Drag&Drop: on") }), e.emitter.emit("vf-explorer-update")), y.value = !y.value);
    }, S = (w) => {
      g = setTimeout(() => {
        const D = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: w.target.getBoundingClientRect().x,
          clientY: w.target.getBoundingClientRect().y
        });
        w.target.dispatchEvent(D);
      }, 500);
    }, h = (w) => {
      w.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: w.path } })) : e.emitter.emit("vf-modal-show", { type: "preview", adapter: e.data.adapter, item: w });
    }, f = ie({ active: !1, column: "", order: "" }), V = (w = !0) => {
      let D = [...e.data.files], $ = f.column, j = f.order == "asc" ? 1 : -1;
      if (!w)
        return D;
      const C = (b, T) => typeof b == "string" && typeof T == "string" ? b.toLowerCase().localeCompare(T.toLowerCase()) : b < T ? -1 : b > T ? 1 : 0;
      return f.active && (D = D.slice().sort((b, T) => C(b[$], T[$]) * j)), D;
    }, R = (w) => {
      f.active && f.column == w ? (f.active = f.order == "asc", f.column = w, f.order = "desc") : (f.active = !0, f.column = w, f.order = "asc");
    }, K = () => d.value.getSelection().map((w) => JSON.parse(w.dataset.item)), te = (w, D) => {
      if (w.altKey || w.ctrlKey || w.metaKey)
        return w.preventDefault(), !1;
      w.dataTransfer.setDragImage(r.value, 0, 15), w.dataTransfer.effectAllowed = "all", w.dataTransfer.dropEffect = "copy", w.dataTransfer.setData("items", JSON.stringify(K()));
    }, se = (w, D) => {
      w.preventDefault();
      let $ = JSON.parse(w.dataTransfer.getData("items"));
      if ($.find((j) => j.storage !== e.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.emitter.emit("vf-modal-show", { type: "move", items: { from: $, to: D } });
    }, ae = (w, D) => {
      w.preventDefault(), !D || D.type !== "dir" || d.value.getSelection().find(($) => $ == w.currentTarget) ? (w.dataTransfer.dropEffect = "none", w.dataTransfer.effectAllowed = "none") : w.dataTransfer.dropEffect = "copy";
    }, oe = () => {
      d.value = new Ne({
        area: o.value,
        keyboardDrag: !1,
        selectedClass: "vf-explorer-selected",
        selectorClass: "vf-explorer-selector"
      }), e.emitter.on("vf-explorer-update", () => ce(() => {
        d.value.clearSelection(), d.value.setSettings({
          selectables: document.getElementsByClassName("vf-item-" + i)
        });
      })), d.value.subscribe("predragstart", ({ event: w, isDragging: D }) => {
        if (D)
          c.value = d.value.getSelection().length, d.value.break();
        else {
          const $ = w.target.offsetWidth - w.offsetX, j = w.target.offsetHeight - w.offsetY;
          $ < 15 && j < 15 && (d.value.clearSelection(), d.value.break());
        }
      }), d.value.subscribe("predragmove", ({ isDragging: w }) => {
        w && d.value.break();
      }), d.value.subscribe("callback", ({ items: w, event: D, isDragging: $ }) => {
        e.emitter.emit("vf-nodes-selected", K()), c.value = d.value.getSelection().length;
      });
    };
    return P(() => {
      k = new Ve(o.value), oe();
    }), De(() => {
      d.value.Area.reset(), d.value.SelectorArea.updatePos(), k.update();
    }), P(() => {
      de(() => e.view, () => e.emitter.emit("vf-explorer-update"));
    }), ke(() => {
      k.destroy();
    }), (w, D) => (l(), m("div", gs, [
      a(e).view == "list" || v.value.length ? (l(), m("div", _s, [
        t("div", {
          onClick: D[0] || (D[0] = ($) => R("basename")),
          class: "col-span-7 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center pl-1"
        }, [
          N(u(a(s)("Name")) + " ", 1),
          q(H(ne, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, f.active && f.column == "basename"]
          ])
        ]),
        v.value.length ? M("", !0) : (l(), m("div", {
          key: 0,
          onClick: D[1] || (D[1] = ($) => R("file_size")),
          class: "col-span-2 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center border-l border-r dark:border-gray-700"
        }, [
          N(u(a(s)("Size")) + " ", 1),
          q(H(ne, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, f.active && f.column == "file_size"]
          ])
        ])),
        v.value.length ? M("", !0) : (l(), m("div", {
          key: 1,
          onClick: D[2] || (D[2] = ($) => R("last_modified")),
          class: "col-span-3 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center"
        }, [
          N(u(a(s)("Date")) + " ", 1),
          q(H(ne, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, f.active && f.column == "last_modified"]
          ])
        ])),
        v.value.length ? (l(), m("div", {
          key: 2,
          onClick: D[3] || (D[3] = ($) => R("path")),
          class: "col-span-5 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center border-l dark:border-gray-700"
        }, [
          N(u(a(s)("Filepath")) + " ", 1),
          q(H(ne, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, f.active && f.column == "path"]
          ])
        ])) : M("", !0)
      ])) : M("", !0),
      t("div", ks, [
        t("div", {
          ref_key: "dragImage",
          ref: r,
          class: "absolute -z-50 -top-96"
        }, [
          bs,
          t("div", ys, u(c.value), 1)
        ], 512)
      ]),
      t("div", {
        onTouchstart: E,
        onContextmenu: D[10] || (D[10] = Y(($) => a(e).emitter.emit("vf-contextmenu-show", { event: $, area: o.value, items: K() }), ["self", "prevent"])),
        class: z([a(e).fullScreen ? "" : "resize-y", "h-full w-full text-xs vf-selector-area vf-scrollbar min-h-[150px] overflow-auto p-1 z-0"]),
        ref_key: "selectorArea",
        ref: o
      }, [
        v.value.length ? (l(!0), m(U, { key: 0 }, I(V(), ($, j) => (l(), m("div", {
          onDblclick: (C) => h($),
          onTouchstart: D[4] || (D[4] = (C) => S(C)),
          onTouchend: D[5] || (D[5] = (C) => x()),
          onContextmenu: Y((C) => a(e).emitter.emit("vf-contextmenu-show", { event: C, area: o.value, items: K(), target: $ }), ["prevent"]),
          class: z(["vf-item-" + a(i), "grid grid-cols-1 border hover:bg-neutral-50 dark:hover:bg-gray-700 border-transparent my-0.5 w-full select-none"]),
          "data-type": $.type,
          "data-item": JSON.stringify($),
          "data-index": j
        }, [
          t("div", ws, [
            t("div", $s, [
              $.type === "dir" ? (l(), m("svg", Cs, Ms)) : (l(), m("svg", Es, js)),
              t("span", As, u($.basename), 1)
            ]),
            t("div", Ts, u($.path), 1)
          ])
        ], 42, xs))), 256)) : M("", !0),
        a(e).view === "list" && !v.value.length ? (l(!0), m(U, { key: 1 }, I(V(), ($, j) => (l(), m("div", {
          draggable: "true",
          onDblclick: (C) => h($),
          onTouchstart: D[6] || (D[6] = (C) => S(C)),
          onTouchend: D[7] || (D[7] = (C) => x()),
          onContextmenu: Y((C) => a(e).emitter.emit("vf-contextmenu-show", { event: C, area: o.value, items: K(), target: $ }), ["prevent"]),
          onDragstart: (C) => te(C),
          onDragover: (C) => ae(C, $),
          onDrop: (C) => se(C, $),
          class: z(["vf-item-" + a(i), "grid grid-cols-1 border hover:bg-neutral-50 dark:hover:bg-gray-700 border-transparent my-0.5 w-full select-none"]),
          "data-type": $.type,
          "data-item": JSON.stringify($),
          "data-index": j
        }, [
          t("div", Os, [
            t("div", Fs, [
              $.type === "dir" ? (l(), m("svg", Ns, Bs)) : (l(), m("svg", zs, Hs)),
              t("span", Rs, u($.basename), 1)
            ]),
            t("div", qs, u($.file_size ? a(e).filesize($.file_size) : ""), 1),
            t("div", Is, u(a(we)($.last_modified)), 1)
          ])
        ], 42, Ls))), 256)) : M("", !0),
        a(e).view === "grid" && !v.value.length ? (l(!0), m(U, { key: 2 }, I(V(!1), ($, j) => (l(), m("div", {
          draggable: "true",
          onDblclick: (C) => h($),
          onTouchstart: D[8] || (D[8] = (C) => S(C)),
          onTouchend: D[9] || (D[9] = (C) => x()),
          onContextmenu: Y((C) => a(e).emitter.emit("vf-contextmenu-show", { event: C, area: o.value, items: K(), target: $ }), ["prevent"]),
          onDragstart: (C) => te(C),
          onDragover: (C) => ae(C, $),
          onDrop: (C) => se(C, $),
          class: z(["vf-item-" + a(i), "border border-transparent hover:bg-neutral-50 m-1 dark:hover:bg-gray-700 inline-flex w-[5.5rem] h-20 md:w-24 text-center justify-center select-none"]),
          "data-type": $.type,
          "data-item": JSON.stringify($),
          "data-index": j
        }, [
          t("div", null, [
            t("div", Ws, [
              $.type === "dir" ? (l(), m("svg", Gs, Ks)) : ($.mime_type ?? "").startsWith("image") ? (l(), m("img", {
                key: 1,
                class: "lazy h-10 md:h-12 m-auto",
                "data-src": a(e).requester.getPreviewUrl(a(e).adapter, $),
                alt: $.basename
              }, null, 8, Js)) : (l(), m("svg", Xs, Qs)),
              !($.mime_type ?? "").startsWith("image") && $.type != "dir" ? (l(), m("div", ea, u(n($.extension)), 1)) : M("", !0)
            ]),
            t("span", ta, u(a(he)($.basename)), 1)
          ])
        ], 42, Ps))), 256)) : M("", !0)
      ], 34),
      H(fs)
    ]));
  }
}), oa = ["onClick"], ra = ["href", "download"], na = /* @__PURE__ */ t("span", { class: "px-1" }, null, -1), la = /* @__PURE__ */ t("span", { class: "px-1" }, null, -1), ia = {
  name: "VFContextMenu"
}, da = /* @__PURE__ */ Object.assign(ia, {
  setup(p) {
    const e = O("ServiceContainer"), { t: s } = e.i18n, n = _(null), o = _([]), r = _(""), c = ie({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    }), d = ee(() => c.items.filter((g) => g.key == null || e.features.includes(g.key)));
    e.emitter.on("vf-context-selected", (g) => {
      o.value = g;
    });
    const i = {
      newfolder: {
        key: B.NEW_FOLDER,
        title: () => s("New Folder"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "new-folder" });
        }
      },
      delete: {
        key: B.DELETE,
        title: () => s("Delete"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "delete", items: o });
        }
      },
      refresh: {
        title: () => s("Refresh"),
        action: () => {
          e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: e.data.dirname } });
        }
      },
      preview: {
        key: B.PREVIEW,
        title: () => s("Preview"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "preview", adapter: e.data.adapter, item: o.value[0] });
        }
      },
      open: {
        title: () => s("Open"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: o.value[0].path } });
        }
      },
      openDir: {
        title: () => s("Open containing folder"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: o.value[0].dir } });
        }
      },
      download: {
        key: B.DOWNLOAD,
        link: ee(() => e.requester.getDownloadUrl(e.data.adapter, o.value[0])),
        title: () => s("Download"),
        action: () => {
          const g = e.requester.getDownloadUrl(e.data.adapter, o.value[0]);
          e.emitter.emit("vf-download", g);
        }
      },
      archive: {
        key: B.ARCHIVE,
        title: () => s("Archive"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "archive", items: o });
        }
      },
      unarchive: {
        key: B.UNARCHIVE,
        title: () => s("Unarchive"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "unarchive", items: o });
        }
      },
      rename: {
        key: B.RENAME,
        title: () => s("Rename"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "rename", items: o });
        }
      }
    }, v = (g) => {
      e.emitter.emit("vf-contextmenu-hide"), g.action();
    };
    e.emitter.on("vf-search-query", ({ newQuery: g }) => {
      r.value = g;
    }), e.emitter.on("vf-contextmenu-show", ({ event: g, area: x, items: y, target: E = null }) => {
      if (c.items = [], r.value)
        if (E)
          c.items.push(i.openDir), e.emitter.emit("vf-context-selected", [E]);
        else
          return;
      else
        !E && !r.value ? (c.items.push(i.refresh), c.items.push(i.newfolder), e.emitter.emit("vf-context-selected", [])) : y.length > 1 && y.some((S) => S.path === E.path) ? (c.items.push(i.refresh), c.items.push(i.archive), c.items.push(i.delete), e.emitter.emit("vf-context-selected", y)) : (E.type == "dir" ? c.items.push(i.open) : (c.items.push(i.preview), c.items.push(i.download)), c.items.push(i.rename), E.mime_type == "application/zip" ? c.items.push(i.unarchive) : c.items.push(i.archive), c.items.push(i.delete), e.emitter.emit("vf-context-selected", [E]));
      k(g, x);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      c.active = !1;
    });
    const k = (g, x) => {
      c.active = !0, ce(() => {
        const y = e.root.getBoundingClientRect(), E = x.getBoundingClientRect();
        let S = g.pageX - y.left, h = g.pageY - y.top, f = n.value.offsetHeight, V = n.value.offsetWidth;
        S = E.right - g.pageX + window.scrollX < V ? S - V : S, h = E.bottom - g.pageY + window.scrollY < f ? h - f : h, c.positions = {
          left: S + "px",
          top: h + "px"
        };
      });
    };
    return (g, x) => c.active ? (l(), m("ul", {
      key: 0,
      class: "z-30 absolute text-xs bg-neutral-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-neutral-300 dark:border-gray-600 shadow rounded select-none",
      ref_key: "contextmenu",
      ref: n,
      style: be(c.positions)
    }, [
      (l(!0), m(U, null, I(d.value, (y) => (l(), m("li", {
        class: "px-2 py-1.5 cursor-pointer hover:bg-neutral-200 dark:hover:bg-gray-700",
        key: y.title,
        onClick: (E) => v(y)
      }, [
        y.link ? (l(), m("a", {
          key: 0,
          target: "_blank",
          href: y.link,
          download: y.link
        }, [
          na,
          t("span", null, u(y.title()), 1)
        ], 8, ra)) : (l(), m(U, { key: 1 }, [
          la,
          t("span", null, u(y.title()), 1)
        ], 64))
      ], 8, oa))), 128))
    ], 4)) : M("", !0);
  }
}), ca = { class: "p-1 text-xs border-t border-neutral-300 dark:border-gray-700/50 flex justify-between select-none" }, ua = { class: "flex leading-5 items-center" }, ma = ["aria-label"], va = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
  })
], -1), pa = [
  va
], ha = ["value"], fa = { class: "ml-3" }, ga = { key: 0 }, _a = { class: "ml-1" }, ka = { class: "flex leading-5 items-center justify-end" }, ba = ["disabled"], ya = ["aria-label"], xa = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 stroke-slate-500 cursor-pointer",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
  }),
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  })
], -1), wa = [
  xa
], $a = {
  name: "VFStatusbar"
}, Ca = /* @__PURE__ */ Object.assign($a, {
  setup(p) {
    const e = O("ServiceContainer"), { t: s } = e.i18n, { setStore: n } = e.storage, o = _(0), r = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.adapter } }), n("adapter", e.adapter);
    };
    e.emitter.on("vf-nodes-selected", (i) => {
      o.value = i.length;
    });
    const c = _("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      c.value = i;
    });
    const d = ee(() => {
      const i = e.selectButton.multiple ? e.selectedItems.length > 0 : e.selectedItems.length === 1;
      return e.selectButton.active && i;
    });
    return (i, v) => (l(), m("div", ca, [
      t("div", ua, [
        t("div", {
          class: "mx-2",
          "aria-label": a(s)("Storage"),
          "data-microtip-position": "top-right",
          role: "tooltip"
        }, pa, 8, ma),
        q(t("select", {
          "onUpdate:modelValue": v[0] || (v[0] = (k) => a(e).adapter = k),
          onChange: r,
          class: "py-0.5 text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded pl-2 pr-8"
        }, [
          (l(!0), m(U, null, I(a(e).data.storages, (k) => (l(), m("option", { value: k }, u(k), 9, ha))), 256))
        ], 544), [
          [pe, a(e).adapter]
        ]),
        t("div", fa, [
          c.value.length ? (l(), m("span", ga, u(a(e).data.files.length) + " items found. ", 1)) : M("", !0),
          t("span", _a, u(o.value > 0 ? a(s)("%s item(s) selected.", o.value) : ""), 1)
        ])
      ]),
      t("div", ka, [
        a(e).selectButton.active ? (l(), m("button", {
          key: 0,
          class: z(["vf-btn py-0 vf-btn-primary", { disabled: !d.value }]),
          disabled: !d.value,
          onClick: v[1] || (v[1] = (k) => a(e).selectButton.click(a(e).selectedItems, k))
        }, u(a(s)("Select")), 11, ba)) : M("", !0),
        t("span", {
          class: "mr-1",
          "aria-label": a(s)("Settings"),
          "data-microtip-position": "top-left",
          role: "tooltip",
          onClick: v[2] || (v[2] = (k) => a(e).emitter.emit("vf-modal-show", { type: "about" }))
        }, wa, 8, ya)
      ])
    ]));
  }
}), Sa = {
  name: "VueFinder"
}, Ma = /* @__PURE__ */ Object.assign(Sa, {
  props: {
    id: {
      type: String,
      default: "vf"
    },
    request: {
      type: [String, Object],
      required: !0
    },
    persist: {
      type: Boolean,
      default: !1
    },
    path: {
      type: String,
      default: "."
    },
    features: {
      type: [Array, Boolean],
      default: !0
    },
    debug: {
      type: Boolean,
      default: !1
    },
    theme: {
      type: String,
      default: "system"
    },
    locale: {
      type: String,
      default: null
    },
    maxHeight: {
      type: String,
      default: "600px"
    },
    maxFileSize: {
      type: String,
      default: "10mb"
    },
    fullScreen: {
      type: Boolean,
      default: !1
    },
    selectButton: {
      type: Object,
      default(p) {
        return {
          active: !1,
          multiple: !1,
          click: (e) => {
          },
          ...p
        };
      }
    }
  },
  emits: ["select"],
  setup(p, { expose: e, emit: s }) {
    const n = s, r = Je(p, O("VueFinderOptions"));
    je("ServiceContainer", r);
    const { setStore: c } = r.storage, d = _(null);
    r.root = d, r.i18n, r.emitter.on("vf-modal-close", () => {
      r.modal.active = !1;
    }), r.emitter.on("vf-modal-show", (k) => {
      r.modal.active = !0, r.modal.type = k.type, r.modal.data = k;
    });
    const i = (k) => {
      Object.assign(r.data, k), r.emitter.emit("vf-nodes-selected", {}), r.emitter.emit("vf-explorer-update");
    };
    r.emitter.on("vf-nodes-selected", (k) => {
      r.selectedItems = k, n("select", k);
    });
    let v;
    return r.emitter.on("vf-fetch-abort", () => {
      v.abort(), r.loading = !1;
    }), r.emitter.on("vf-fetch", ({ params: k, body: g = null, onSuccess: x = null, onError: y = null, noCloseModal: E = !1 }) => {
      ["index", "search"].includes(k.q) && (v && v.abort(), r.loading = !0), v = new AbortController();
      const S = v.signal;
      r.requester.send({
        url: "",
        method: k.m || "get",
        params: k,
        body: g,
        abortSignal: S
      }).then((h) => {
        r.adapter = h.adapter, r.persist && (r.path = h.dirname, c("path", r.path)), ["index", "search"].includes(k.q) && (r.loading = !1), E || r.emitter.emit("vf-modal-close"), i(h), x && x(h);
      }).catch((h) => {
        console.error(h), y && y(h);
      });
    }), P(() => {
      let k = {};
      r.path.includes("://") && (k = {
        adapter: r.path.split("://")[0],
        path: r.path
      }), r.emitter.emit("vf-fetch", { params: { q: "index", adapter: r.adapter, ...k } });
    }), e({
      app: r
    }), (k, g) => (l(), m("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: d
    }, [
      t("div", {
        class: z(a(r).theme.actualValue === "dark" ? "dark" : "")
      }, [
        t("div", {
          class: z([a(r).fullscreen ? "fixed w-screen inset-0 z-20" : "relative rounded-md", "border flex flex-col bg-white dark:bg-gray-800 text-gray-700 dark:text-neutral-400 border-neutral-300 dark:border-gray-900 min-w-min select-none"]),
          style: be(a(r).fullscreen ? "" : "height: 100%; width: 100%;"),
          onMousedown: g[0] || (g[0] = (x) => a(r).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: g[1] || (g[1] = (x) => a(r).emitter.emit("vf-contextmenu-hide"))
        }, [
          H(Tt),
          H(ns),
          H(aa),
          H(Ca)
        ], 38),
        H(Ae, { name: "fade" }, {
          default: A(() => [
            a(r).modal.active ? (l(), L(Te("v-f-modal-" + a(r).modal.type), { key: 0 })) : M("", !0)
          ]),
          _: 1
        }),
        H(da)
      ], 2)
    ], 512));
  }
}), Ea = /* @__PURE__ */ t("div", { class: "fixed inset-0 bg-gray-500 dark:bg-gray-600 dark:bg-opacity-75 bg-opacity-75 transition-opacity" }, null, -1), Da = { class: "fixed z-10 inset-0 overflow-hidden" }, ja = { class: "relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl w-full" }, Aa = { class: "bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4" }, Ta = { class: "bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" }, W = {
  __name: "ModalLayout",
  setup(p) {
    const e = O("ServiceContainer");
    return P(() => {
      const s = document.querySelector(".v-f-modal input");
      s && s.focus();
    }), (s, n) => (l(), m("div", {
      class: "v-f-modal relative z-30",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: n[1] || (n[1] = Z((o) => a(e).emitter.emit("vf-modal-close"), ["esc"])),
      tabindex: "0"
    }, [
      Ea,
      t("div", Da, [
        t("div", {
          class: "flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0",
          onMousedown: n[0] || (n[0] = Y((o) => a(e).emitter.emit("vf-modal-close"), ["self"]))
        }, [
          t("div", ja, [
            t("div", Aa, [
              le(s.$slots, "default")
            ]),
            t("div", Ta, [
              le(s.$slots, "buttons")
            ])
          ])
        ], 32)
      ])
    ], 32));
  }
}, La = ["aria-label"], Oa = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  stroke: "currentColor",
  class: "w-5 h-5"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M6 18L18 6M6 6l12 12"
  })
], -1), Fa = [
  Oa
], Na = {
  name: "Message"
}, G = /* @__PURE__ */ Object.assign(Na, {
  props: {
    error: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["hidden"],
  setup(p, { emit: e }) {
    var v;
    const s = e, n = O("ServiceContainer"), { t: o } = n.i18n, r = _(!1), c = _(null), d = _((v = c.value) == null ? void 0 : v.strMessage);
    de(d, () => r.value = !1);
    const i = () => {
      s("hidden"), r.value = !0;
    };
    return (k, g) => (l(), m("div", null, [
      r.value ? M("", !0) : (l(), m("div", {
        key: 0,
        ref_key: "strMessage",
        ref: c,
        class: z(["flex mt-2 p-1 px-2 rounded text-sm break-all dark:opacity-75", p.error ? "bg-red-100 text-red-600 " : "bg-emerald-100 text-emerald-600"])
      }, [
        le(k.$slots, "default"),
        t("div", {
          class: "ml-auto cursor-pointer",
          onClick: i,
          "aria-label": a(o)("Close"),
          "data-microtip-position": "top-left",
          role: "tooltip"
        }, Fa, 8, La)
      ], 2))
    ]));
  }
}), Va = { class: "sm:flex sm:items-start" }, Ba = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-red-600 dark:stroke-red-200",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    })
  ])
], -1), za = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Ua = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Ha = { class: "mt-2" }, Ra = { class: "text-sm text-gray-500" }, qa = {
  class: "text-gray-500 text-sm mb-1 overflow-auto vf-scrollbar",
  style: { "max-height": "200px" }
}, Ia = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Pa = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Wa = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Ga = [
  Wa
], Ya = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ka = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Ja = [
  Ka
], Xa = { class: "ml-1.5" }, Za = { class: "m-auto font-bold text-red-500 text-sm dark:text-red-200 text-center" }, Qa = {
  name: "VFModalDelete"
}, eo = /* @__PURE__ */ Object.assign(Qa, {
  setup(p) {
    const e = O("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = _(e.modal.data.items), o = _(""), r = () => {
      n.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: n.value.map(({ path: c, type: d }) => ({ path: c, type: d }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("Files deleted.") });
        },
        onError: (c) => {
          o.value = s(c.message);
        }
      });
    };
    return (c, d) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-danger"
        }, u(a(s)("Yes, Delete!")), 1),
        t("button", {
          type: "button",
          onClick: d[1] || (d[1] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1),
        t("div", Za, u(a(s)("This action cannot be undone.")), 1)
      ]),
      default: A(() => [
        t("div", Va, [
          Ba,
          t("div", za, [
            t("h3", Ua, u(a(s)("Delete files")), 1),
            t("div", Ha, [
              t("p", Ra, u(a(s)("Are you sure you want to delete these files?")), 1),
              t("div", qa, [
                (l(!0), m(U, null, I(n.value, (i) => (l(), m("p", Ia, [
                  i.type === "dir" ? (l(), m("svg", Pa, Ga)) : (l(), m("svg", Ya, Ja)),
                  t("span", Xa, u(i.basename), 1)
                ]))), 256))
              ]),
              o.value.length ? (l(), L(G, {
                key: 0,
                onHidden: d[0] || (d[0] = (i) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(o.value), 1)
                ]),
                _: 1
              })) : M("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), to = { class: "sm:flex sm:items-start" }, so = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "2"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    })
  ])
], -1), ao = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, oo = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, ro = { class: "mt-2" }, no = { class: "text-sm text-gray-500" }, lo = {
  name: "VFModalMessage"
}, io = /* @__PURE__ */ Object.assign(lo, {
  setup(p) {
    const e = O("ServiceContainer"), { t: s } = e.i18n;
    return (n, o) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: o[0] || (o[0] = (r) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Close")), 1)
      ]),
      default: A(() => {
        var r, c;
        return [
          t("div", to, [
            so,
            t("div", ao, [
              t("h3", oo, u(((r = a(e).modal.data) == null ? void 0 : r.title) ?? "Title"), 1),
              t("div", ro, [
                t("p", no, u(((c = a(e).modal.data) == null ? void 0 : c.message) ?? "Message"), 1)
              ])
            ])
          ])
        ];
      }),
      _: 1
    }));
  }
}), co = { class: "sm:flex sm:items-start" }, uo = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
    })
  ])
], -1), mo = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, vo = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, po = { class: "mt-2" }, ho = { class: "text-sm text-gray-500" }, fo = ["placeholder"], go = {
  name: "VFModalNewFolder"
}, _o = /* @__PURE__ */ Object.assign(go, {
  setup(p) {
    const e = O("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = _(""), o = _(""), r = () => {
      n.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfolder",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          name: n.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("%s is created.", n.value) });
        },
        onError: (c) => {
          o.value = s(c.message);
        }
      });
    };
    return (c, d) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, u(a(s)("Create")), 1),
        t("button", {
          type: "button",
          onClick: d[2] || (d[2] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", co, [
          uo,
          t("div", mo, [
            t("h3", vo, u(a(s)("New Folder")), 1),
            t("div", po, [
              t("p", ho, u(a(s)("Create a new folder")), 1),
              q(t("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (i) => n.value = i),
                onKeyup: Z(r, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("Folder Name"),
                type: "text"
              }, null, 40, fo), [
                [Q, n.value]
              ]),
              o.value.length ? (l(), L(G, {
                key: 0,
                onHidden: d[1] || (d[1] = (i) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(o.value), 1)
                ]),
                _: 1
              })) : M("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), ko = { class: "sm:flex sm:items-start" }, bo = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    })
  ])
], -1), yo = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, xo = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, wo = { class: "mt-2" }, $o = { class: "text-sm text-gray-500" }, Co = ["placeholder"], So = {
  name: "VFModalNewFile"
}, Mo = /* @__PURE__ */ Object.assign(So, {
  setup(p) {
    const e = O("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = _(""), o = _(""), r = () => {
      n.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfile",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          name: n.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("%s is created.", n.value) });
        },
        onError: (c) => {
          o.value = s(c.message);
        }
      });
    };
    return (c, d) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, u(a(s)("Create")), 1),
        t("button", {
          type: "button",
          onClick: d[2] || (d[2] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", ko, [
          bo,
          t("div", yo, [
            t("h3", xo, u(a(s)("New File")), 1),
            t("div", wo, [
              t("p", $o, u(a(s)("Create a new file")), 1),
              q(t("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (i) => n.value = i),
                onKeyup: Z(r, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("File Name"),
                type: "text"
              }, null, 40, Co), [
                [Q, n.value]
              ]),
              o.value.length ? (l(), L(G, {
                key: 0,
                onHidden: d[1] || (d[1] = (i) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(o.value), 1)
                ]),
                _: 1
              })) : M("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Eo = { class: "flex" }, Do = ["aria-label"], jo = { class: "ml-auto mb-2" }, Ao = {
  key: 0,
  class: "p-2 border font-normal whitespace-pre-wrap border-gray-200 dark:border-gray-700/50 dark:text-gray-200 rounded min-h-[200px] max-h-[60vh] text-xs overflow-auto"
}, To = { key: 1 }, Lo = {
  __name: "Text",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, n = _(""), o = _(""), r = _(null), c = _(!1), d = _(""), i = _(!1), v = O("ServiceContainer"), { t: k } = v.i18n;
    P(() => {
      v.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: v.modal.data.adapter, path: v.modal.data.item.path },
        responseType: "text"
      }).then((y) => {
        n.value = y, s("success");
      });
    });
    const g = () => {
      c.value = !c.value, o.value = n.value, c.value == !0 && ce(() => {
        r.value.focus();
      });
    }, x = () => {
      d.value = "", i.value = !1, v.requester.send({
        url: "",
        method: "post",
        params: {
          q: "save",
          adapter: v.modal.data.adapter,
          path: v.modal.data.item.path
        },
        body: {
          content: o.value
        },
        responseType: "text"
      }).then((y) => {
        d.value = k("Updated."), n.value = y, s("success"), c.value = !c.value;
      }).catch((y) => {
        d.value = k(y.message), i.value = !0;
      });
    };
    return (y, E) => (l(), m(U, null, [
      t("div", Eo, [
        t("div", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(v).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, u(a(v).modal.data.item.basename), 9, Do),
        t("div", jo, [
          c.value ? (l(), m("button", {
            key: 0,
            onClick: x,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, u(a(k)("Save")), 1)) : M("", !0),
          a(v).features.includes(a(B).EDIT) ? (l(), m("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: E[0] || (E[0] = (S) => g())
          }, u(c.value ? a(k)("Cancel") : a(k)("Edit")), 1)) : M("", !0)
        ])
      ]),
      t("div", null, [
        c.value ? (l(), m("div", To, [
          q(t("textarea", {
            ref_key: "editInput",
            ref: r,
            "onUpdate:modelValue": E[1] || (E[1] = (S) => o.value = S),
            class: "w-full p-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:selection:bg-gray-500 min-h-[200px] max-h-[60vh] text-xs",
            name: "text",
            id: "",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [Q, o.value]
          ])
        ])) : (l(), m("pre", Ao, u(n.value), 1)),
        d.value.length ? (l(), L(G, {
          key: 2,
          onHidden: E[2] || (E[2] = (S) => d.value = ""),
          error: i.value
        }, {
          default: A(() => [
            N(u(d.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : M("", !0)
      ])
    ], 64));
  }
}, Oo = { class: "flex" }, Fo = ["aria-label"], No = { class: "ml-auto mb-2" }, Vo = { class: "w-full flex justify-center" }, Bo = ["src"], zo = {
  __name: "Image",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, n = O("ServiceContainer"), { t: o } = n.i18n, r = _(null), c = _(null), d = _(!1), i = _(""), v = _(!1), k = () => {
      d.value = !d.value, d.value ? c.value = new Be(r.value, {
        crop(x) {
        }
      }) : c.value.destroy();
    }, g = () => {
      c.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (x) => {
          i.value = "", v.value = !1;
          const y = new FormData();
          y.set("file", x), n.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: n.modal.data.adapter,
              path: n.modal.data.item.path
            },
            body: y
          }).then((E) => {
            i.value = o("Updated."), r.value.src = n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item), k(), s("success");
          }).catch((E) => {
            i.value = o(E.message), v.value = !0;
          });
        }
      );
    };
    return P(() => {
      s("success");
    }), (x, y) => (l(), m(U, null, [
      t("div", Oo, [
        t("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(n).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, u(a(n).modal.data.item.basename), 9, Fo),
        t("div", No, [
          d.value ? (l(), m("button", {
            key: 0,
            onClick: g,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, u(a(o)("Crop")), 1)) : M("", !0),
          a(n).features.includes(a(B).EDIT) ? (l(), m("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: y[0] || (y[0] = (E) => k())
          }, u(d.value ? a(o)("Cancel") : a(o)("Edit")), 1)) : M("", !0)
        ])
      ]),
      t("div", Vo, [
        t("img", {
          ref_key: "image",
          ref: r,
          class: "max-w-[50vh] max-h-[50vh]",
          src: a(n).requester.getPreviewUrl(a(n).modal.data.adapter, a(n).modal.data.item),
          alt: ""
        }, null, 8, Bo)
      ]),
      i.value.length ? (l(), L(G, {
        key: 0,
        onHidden: y[1] || (y[1] = (E) => i.value = ""),
        error: v.value
      }, {
        default: A(() => [
          N(u(i.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : M("", !0)
    ], 64));
  }
}, Uo = { class: "flex" }, Ho = ["aria-label"], Ro = /* @__PURE__ */ t("div", null, null, -1), qo = {
  __name: "Default",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = O("ServiceContainer"), n = e;
    return P(() => {
      n("success");
    }), (o, r) => (l(), m(U, null, [
      t("div", Uo, [
        t("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(s).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, u(a(s).modal.data.item.basename), 9, Ho)
      ]),
      Ro
    ], 64));
  }
}, Io = ["aria-label"], Po = {
  class: "w-full",
  preload: "",
  controls: ""
}, Wo = ["src"], Go = {
  __name: "Video",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = O("ServiceContainer"), n = e, o = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return P(() => {
      n("success");
    }), (r, c) => (l(), m("div", null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, u(a(s).modal.data.item.basename), 9, Io),
      t("div", null, [
        t("video", Po, [
          t("source", {
            src: o(),
            type: "video/mp4"
          }, null, 8, Wo),
          N(" Your browser does not support the video tag. ")
        ])
      ])
    ]));
  }
}, Yo = ["aria-label"], Ko = {
  class: "w-full",
  controls: ""
}, Jo = ["src"], Xo = {
  __name: "Audio",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, n = O("ServiceContainer"), o = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return P(() => {
      s("success");
    }), (r, c) => (l(), m(U, null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(n).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, u(a(n).modal.data.item.basename), 9, Yo),
      t("div", null, [
        t("audio", Ko, [
          t("source", {
            src: o(),
            type: "audio/mpeg"
          }, null, 8, Jo),
          N(" Your browser does not support the audio element. ")
        ])
      ])
    ], 64));
  }
}, Zo = ["aria-label"], Qo = ["data"], er = ["src"], tr = /* @__PURE__ */ t("p", null, [
  /* @__PURE__ */ N(" Your browser does not support PDFs. "),
  /* @__PURE__ */ t("a", { href: "https://example.com/test.pdf" }, "Download the PDF"),
  /* @__PURE__ */ N(" . ")
], -1), sr = [
  tr
], ar = {
  __name: "Pdf",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = O("ServiceContainer"), n = e, o = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return P(() => {
      n("success");
    }), (r, c) => (l(), m(U, null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, u(a(s).modal.data.item.basename), 9, Zo),
      t("div", null, [
        t("object", {
          class: "h-[60vh]",
          data: o(),
          type: "application/pdf",
          width: "100%",
          height: "100%"
        }, [
          t("iframe", {
            class: "border-0",
            src: o(),
            width: "100%",
            height: "100%"
          }, sr, 8, er)
        ], 8, Qo)
      ])
    ], 64));
  }
}, or = { class: "sm:flex sm:items-start" }, rr = { class: "mt-3 text-center sm:mt-0 sm:text-left w-full" }, nr = { key: 0 }, lr = { class: "text-gray-700 dark:text-gray-200 text-sm" }, ir = {
  key: 0,
  class: "flex leading-5"
}, dr = /* @__PURE__ */ t("svg", {
  class: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, [
  /* @__PURE__ */ t("circle", {
    class: "opacity-25 stroke-blue-900 dark:stroke-blue-100",
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    "stroke-width": "4"
  }),
  /* @__PURE__ */ t("path", {
    class: "opacity-75",
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  })
], -1), cr = { class: "py-2 flex font-normal break-all dark:text-gray-200 rounded text-xs" }, ur = { class: "font-bold" }, mr = { class: "font-bold pl-2" }, vr = {
  key: 0,
  class: "text-xs text-gray-600 dark:text-gray-400"
}, pr = ["download", "href"], hr = {
  name: "VFModalPreview"
}, fr = /* @__PURE__ */ Object.assign(hr, {
  setup(p) {
    const e = O("ServiceContainer"), { t: s } = e.i18n, n = _(!1), o = (c) => (e.modal.data.item.mime_type ?? "").startsWith(c), r = e.features.includes(B.PREVIEW);
    return r || (n.value = !0), (c, d) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: d[6] || (d[6] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Close")), 1),
        a(e).features.includes(a(B).DOWNLOAD) ? (l(), m("a", {
          key: 0,
          target: "_blank",
          class: "vf-btn vf-btn-primary",
          download: a(e).requester.getDownloadUrl(a(e).modal.data.adapter, a(e).modal.data.item),
          href: a(e).requester.getDownloadUrl(a(e).modal.data.adapter, a(e).modal.data.item)
        }, u(a(s)("Download")), 9, pr)) : M("", !0)
      ]),
      default: A(() => [
        t("div", or, [
          t("div", rr, [
            a(r) ? (l(), m("div", nr, [
              o("text") ? (l(), L(Lo, {
                key: 0,
                onSuccess: d[0] || (d[0] = (i) => n.value = !0)
              })) : o("image") ? (l(), L(zo, {
                key: 1,
                onSuccess: d[1] || (d[1] = (i) => n.value = !0)
              })) : o("video") ? (l(), L(Go, {
                key: 2,
                onSuccess: d[2] || (d[2] = (i) => n.value = !0)
              })) : o("audio") ? (l(), L(Xo, {
                key: 3,
                onSuccess: d[3] || (d[3] = (i) => n.value = !0)
              })) : o("application/pdf") ? (l(), L(ar, {
                key: 4,
                onSuccess: d[4] || (d[4] = (i) => n.value = !0)
              })) : (l(), L(qo, {
                key: 5,
                onSuccess: d[5] || (d[5] = (i) => n.value = !0)
              }))
            ])) : M("", !0),
            t("div", lr, [
              n.value === !1 ? (l(), m("div", ir, [
                dr,
                t("span", null, u(a(s)("Loading")), 1)
              ])) : M("", !0)
            ])
          ])
        ]),
        t("div", cr, [
          t("div", null, [
            t("span", ur, u(a(s)("File Size")) + ": ", 1),
            N(u(a(e).filesize(a(e).modal.data.item.file_size)), 1)
          ]),
          t("div", null, [
            t("span", mr, u(a(s)("Last Modified")) + ": ", 1),
            N(" " + u(a(we)(a(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        a(e).features.includes(a(B).DOWNLOAD) ? (l(), m("div", vr, [
          t("span", null, u(a(s)(`Download doesn't work? You can try right-click "Download" button, select "Save link as...".`)), 1)
        ])) : M("", !0)
      ]),
      _: 1
    }));
  }
}), gr = { class: "sm:flex sm:items-start" }, _r = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    })
  ])
], -1), kr = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, br = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, yr = { class: "mt-2" }, xr = { class: "flex text-sm text-gray-800 dark:text-gray-400 py-2" }, wr = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, $r = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Cr = [
  $r
], Sr = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Mr = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Er = [
  Mr
], Dr = { class: "ml-1.5" }, jr = {
  name: "VFModalRename"
}, Ar = /* @__PURE__ */ Object.assign(jr, {
  setup(p) {
    const e = O("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = _(e.modal.data.items[0]), o = _(e.modal.data.items[0].basename), r = _(""), c = () => {
      o.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "rename",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          item: n.value.path,
          name: o.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("%s is renamed.", o.value) });
        },
        onError: (d) => {
          r.value = s(d.message);
        }
      });
    };
    return (d, i) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, u(a(s)("Rename")), 1),
        t("button", {
          type: "button",
          onClick: i[2] || (i[2] = (v) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", gr, [
          _r,
          t("div", kr, [
            t("h3", br, u(a(s)("Rename")), 1),
            t("div", yr, [
              t("p", xr, [
                n.value.type === "dir" ? (l(), m("svg", wr, Cr)) : (l(), m("svg", Sr, Er)),
                t("span", Dr, u(n.value.basename), 1)
              ]),
              q(t("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (v) => o.value = v),
                onKeyup: Z(c, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [Q, o.value]
              ]),
              r.value.length ? (l(), L(G, {
                key: 0,
                onHidden: i[1] || (i[1] = (v) => r.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(r.value), 1)
                ]),
                _: 1
              })) : M("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Tr = { class: "sm:flex sm:items-start" }, Lr = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    })
  ])
], -1), Or = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Fr = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Nr = { class: "mt-2" }, Vr = {
  key: 0,
  class: "pointer-events-none"
}, Br = {
  key: 1,
  class: "pointer-events-none"
}, zr = ["disabled"], Ur = ["disabled"], Hr = { class: "text-gray-500 text-sm mb-1 pr-1 max-h-[200px] overflow-y-auto vf-scrollbar" }, Rr = { class: "rounded flex flex-shrink-0 w-6 h-6 border bg-gray-50 text-xs cursor-default dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50" }, qr = ["textContent"], Ir = { class: "ml-1 w-full h-fit" }, Pr = { class: "text-left hidden md:block" }, Wr = { class: "text-left md:hidden" }, Gr = {
  key: 0,
  class: "ml-auto"
}, Yr = ["title", "disabled", "onClick"], Kr = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  stroke: "currentColor",
  class: "w-5 h-5"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M6 18L18 6M6 6l12 12"
  })
], -1), Jr = [
  Kr
], Xr = {
  key: 0,
  class: "py-2"
}, Zr = ["disabled"], Qr = {
  name: "VFModalUpload"
}, en = /* @__PURE__ */ Object.assign(Qr, {
  setup(p) {
    const e = O("ServiceContainer"), { t: s } = e.i18n, n = s("uppy"), o = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, r = _({ QUEUE_ENTRY_STATUS: o }), c = _(null), d = _(null), i = _(null), v = _(null), k = _(null), g = _(null), x = _([]), y = _(""), E = _(!1), S = _(!1);
    let h;
    function f(j) {
      return x.value.findIndex((C) => C.id === j);
    }
    function V(j, C = null) {
      C = C ?? (j.webkitRelativePath || j.name), h.addFile({
        name: C,
        type: j.type,
        data: j,
        source: "Local"
      });
    }
    function R(j) {
      switch (j.status) {
        case o.DONE:
          return "text-green-600";
        case o.ERROR:
          return "text-red-600";
        case o.CANCELED:
          return "text-red-600";
        case o.PENDING:
        default:
          return "";
      }
    }
    const K = (j) => {
      switch (j.status) {
        case o.DONE:
          return "✓";
        case o.ERROR:
        case o.CANCELED:
          return "!";
        case o.PENDING:
        default:
          return "...";
      }
    };
    function te() {
      v.value.click();
    }
    function se() {
      if (!E.value) {
        if (!x.value.filter((j) => j.status !== o.DONE).length) {
          y.value = s("Please select file to upload first.");
          return;
        }
        y.value = "", h.retryAll(), h.upload();
      }
    }
    function ae() {
      h.cancelAll({ reason: "user" }), x.value.forEach((j) => {
        j.status !== o.DONE && (j.status = o.CANCELED, j.statusName = s("Canceled"));
      }), E.value = !1;
    }
    function oe(j) {
      E.value || (h.removeFile(j.id, "removed-by-user"), x.value.splice(f(j.id), 1));
    }
    function w(j) {
      if (!E.value) {
        if (h.cancelAll({ reason: "user" }), j) {
          const C = [];
          x.value.forEach((b) => {
            b.status !== o.DONE && C.push(b);
          }), x.value = [], C.forEach((b) => {
            V(b.originalFile, b.name);
          });
          return;
        }
        x.value.splice(0);
      }
    }
    function D() {
      e.emitter.emit("vf-modal-close");
    }
    function $() {
      return e.requester.transformRequestParams({
        url: "",
        method: "post",
        params: { q: "upload", adapter: e.data.adapter, path: e.data.dirname }
      });
    }
    return P(async () => {
      h = new ze({
        debug: e.debug,
        restrictions: {
          maxFileSize: Ye(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: n,
        onBeforeFileAdded(b, T) {
          if (T[b.id] != null) {
            const X = f(b.id);
            x.value[X].status === o.PENDING && (y.value = h.i18n("noDuplicates", { fileName: b.name })), x.value = x.value.filter((ue) => ue.id !== b.id);
          }
          return x.value.push({
            id: b.id,
            name: b.name,
            size: e.filesize(b.size),
            status: o.PENDING,
            statusName: s("Pending upload"),
            percent: null,
            originalFile: b.data
          }), !0;
        }
      }), h.use(Ue, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError(b, T) {
          let F;
          try {
            F = JSON.parse(b).message;
          } catch {
            F = s("Cannot parse server response.");
          }
          return new Error(F);
        }
      }), h.on("restriction-failed", (b, T) => {
        const F = x.value[f(b.id)];
        oe(F), y.value = T.message;
      }), h.on("upload", () => {
        const b = $();
        h.setMeta({ ...b.body });
        const T = h.getPlugin("XHRUpload");
        T.opts.method = b.method, T.opts.endpoint = b.url + "?" + new URLSearchParams(b.params), T.opts.headers = b.headers, E.value = !0, x.value.forEach((F) => {
          F.status !== o.DONE && (F.percent = null, F.status = o.UPLOADING, F.statusName = s("Pending upload"));
        });
      }), h.on("upload-progress", (b, T) => {
        const F = Math.floor(T.bytesUploaded / T.bytesTotal * 100);
        x.value[f(b.id)].percent = `${F}%`;
      }), h.on("upload-success", (b) => {
        const T = x.value[f(b.id)];
        T.status = o.DONE, T.statusName = s("Done");
      }), h.on("upload-error", (b, T) => {
        const F = x.value[f(b.id)];
        F.percent = null, F.status = o.ERROR, T.isNetworkError ? F.statusName = s("Network Error, Unable establish connection to the server or interrupted.") : F.statusName = T ? T.message : s("Unknown Error");
      }), h.on("error", (b) => {
        y.value = b.message, E.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.data.adapter, path: e.data.dirname },
          noCloseModal: !0
        });
      }), h.on("complete", () => {
        E.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.data.adapter, path: e.data.dirname },
          noCloseModal: !0
        });
      }), v.value.addEventListener("click", () => {
        d.value.click();
      }), k.value.addEventListener("click", () => {
        i.value.click();
      }), g.value.addEventListener("dragover", (b) => {
        b.preventDefault(), S.value = !0;
      }), g.value.addEventListener("dragleave", (b) => {
        b.preventDefault(), S.value = !1;
      });
      function j(b, T) {
        T.isFile && T.file((F) => b(T, F)), T.isDirectory && T.createReader().readEntries((F) => {
          F.forEach((X) => {
            j(b, X);
          });
        });
      }
      g.value.addEventListener("drop", (b) => {
        b.preventDefault(), S.value = !1;
        const T = /^[/\\](.+)/;
        [...b.dataTransfer.items].forEach((F) => {
          F.kind === "file" && j((X, ue) => {
            const $e = T.exec(X.fullPath);
            V(ue, $e[1]);
          }, F.webkitGetAsEntry());
        });
      });
      const C = ({ target: b }) => {
        const T = b.files;
        for (const F of T)
          V(F);
        b.value = "";
      };
      d.value.addEventListener("change", C), i.value.addEventListener("change", C);
    }), ke(() => {
      h == null || h.close({ reason: "unmount" });
    }), (j, C) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          class: z(["vf-btn vf-btn-primary", E.value ? "bg-blue-200 hover:bg-blue-200 dark:bg-gray-700/50 dark:hover:bg-gray-700/50 dark:text-gray-500" : "bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-500"]),
          disabled: E.value,
          onClick: Y(se, ["prevent"])
        }, u(a(s)("Upload")), 11, Zr),
        E.value ? (l(), m("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: Y(ae, ["prevent"])
        }, u(a(s)("Cancel")), 1)) : (l(), m("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: Y(D, ["prevent"])
        }, u(a(s)("Close")), 1))
      ]),
      default: A(() => [
        t("div", Tr, [
          Lr,
          t("div", Or, [
            t("h3", Fr, u(a(s)("Upload Files")), 1),
            t("div", Nr, [
              t("div", {
                ref_key: "dropArea",
                ref: g,
                class: "flex items-center justify-center text-lg mb-4 text-gray-500 border-2 border-gray-300 rounded border-dashed select-none cursor-pointer dark:border-gray-600 h-[120px]",
                onClick: te
              }, [
                S.value ? (l(), m("div", Vr, u(a(s)("Release to drop these files.")), 1)) : (l(), m("div", Br, u(a(s)("Drag and drop the files/folders to here or click here.")), 1))
              ], 512),
              t("div", {
                ref_key: "container",
                ref: c,
                class: "text-gray-500 mb-1"
              }, [
                t("button", {
                  ref_key: "pickFiles",
                  ref: v,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, u(a(s)("Select Files")), 513),
                t("button", {
                  ref_key: "pickFolders",
                  ref: k,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, u(a(s)("Select Folders")), 513),
                t("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: E.value,
                  onClick: C[0] || (C[0] = (b) => w(!1))
                }, u(a(s)("Clear all")), 9, zr),
                t("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: E.value,
                  onClick: C[1] || (C[1] = (b) => w(!0))
                }, u(a(s)("Clear only successful")), 9, Ur)
              ], 512),
              t("div", Hr, [
                (l(!0), m(U, null, I(x.value, (b) => (l(), m("div", {
                  class: "flex hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                  key: b.id
                }, [
                  t("span", Rr, [
                    t("span", {
                      class: z(["text-base m-auto", R(b)]),
                      textContent: u(K(b))
                    }, null, 10, qr)
                  ]),
                  t("div", Ir, [
                    t("div", Pr, u(a(he)(b.name, 40)) + " (" + u(b.size) + ")", 1),
                    t("div", Wr, u(a(he)(b.name, 16)) + " (" + u(b.size) + ")", 1),
                    t("div", {
                      class: z(["flex break-all text-left", R(b)])
                    }, [
                      N(u(b.statusName) + " ", 1),
                      b.status === r.value.QUEUE_ENTRY_STATUS.UPLOADING ? (l(), m("b", Gr, u(b.percent), 1)) : M("", !0)
                    ], 2)
                  ]),
                  t("button", {
                    type: "button",
                    class: z(["rounded w-5 h-5 border-1 text-base leading-none font-medium focus:outline-none dark:border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:bg-gray-600 ml-auto sm:text-xs hover:text-red-600", E.value ? "disabled:bg-gray-100 text-white text-opacity-50" : "bg-gray-100"]),
                    title: a(s)("Delete"),
                    disabled: E.value,
                    onClick: (T) => oe(b)
                  }, Jr, 10, Yr)
                ]))), 128)),
                x.value.length ? M("", !0) : (l(), m("div", Xr, u(a(s)("No files selected!")), 1))
              ]),
              y.value.length ? (l(), L(G, {
                key: 0,
                onHidden: C[2] || (C[2] = (b) => y.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(y.value), 1)
                ]),
                _: 1
              })) : M("", !0)
            ])
          ])
        ]),
        t("input", {
          ref_key: "internalFileInput",
          ref: d,
          type: "file",
          multiple: "",
          class: "hidden"
        }, null, 512),
        t("input", {
          ref_key: "internalFolderInput",
          ref: i,
          type: "file",
          multiple: "",
          webkitdirectory: "",
          class: "hidden"
        }, null, 512)
      ]),
      _: 1
    }));
  }
}), tn = { class: "sm:flex sm:items-start" }, sn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    })
  ])
], -1), an = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, on = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, rn = { class: "mt-2" }, nn = {
  class: "text-gray-500 text-sm mb-1 overflow-auto vf-scrollbar",
  style: { "max-height": "200px" }
}, ln = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, dn = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, cn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), un = [
  cn
], mn = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, vn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), pn = [
  vn
], hn = { class: "ml-1.5" }, fn = ["placeholder"], gn = {
  name: "VFModalArchive"
}, _n = /* @__PURE__ */ Object.assign(gn, {
  setup(p) {
    const e = O("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = _(""), o = _(""), r = _(e.modal.data.items), c = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: r.value.map(({ path: d, type: i }) => ({ path: d, type: i })),
          name: n.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("The file(s) archived.") });
        },
        onError: (d) => {
          o.value = s(d.message);
        }
      });
    };
    return (d, i) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, u(a(s)("Archive")), 1),
        t("button", {
          type: "button",
          onClick: i[2] || (i[2] = (v) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", tn, [
          sn,
          t("div", an, [
            t("h3", on, u(a(s)("Archive the files")), 1),
            t("div", rn, [
              t("div", nn, [
                (l(!0), m(U, null, I(r.value, (v) => (l(), m("p", ln, [
                  v.type === "dir" ? (l(), m("svg", dn, un)) : (l(), m("svg", mn, pn)),
                  t("span", hn, u(v.basename), 1)
                ]))), 256))
              ]),
              q(t("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (v) => n.value = v),
                onKeyup: Z(c, ["enter"]),
                class: "my-1 px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, fn), [
                [Q, n.value]
              ]),
              o.value.length ? (l(), L(G, {
                key: 0,
                onHidden: i[1] || (i[1] = (v) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(o.value), 1)
                ]),
                _: 1
              })) : M("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), kn = { class: "sm:flex sm:items-start" }, bn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    })
  ])
], -1), yn = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, xn = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, wn = { class: "mt-2" }, $n = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Cn = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Sn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Mn = [
  Sn
], En = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Dn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), jn = [
  Dn
], An = { class: "ml-1.5" }, Tn = { class: "my-1 text-sm text-gray-500" }, Ln = {
  name: "VFModalUnarchive"
}, On = /* @__PURE__ */ Object.assign(Ln, {
  setup(p) {
    const e = O("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n;
    _("");
    const n = _(e.modal.data.items[0]), o = _(""), r = _([]), c = () => {
      e.emitter.emit("vf-fetch", {
        params: {
          q: "unarchive",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          item: n.value.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("The file unarchived.") });
        },
        onError: (d) => {
          o.value = s(d.message);
        }
      });
    };
    return (d, i) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, u(a(s)("Unarchive")), 1),
        t("button", {
          type: "button",
          onClick: i[1] || (i[1] = (v) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", kn, [
          bn,
          t("div", yn, [
            t("h3", xn, u(a(s)("Unarchive")), 1),
            t("div", wn, [
              (l(!0), m(U, null, I(r.value, (v) => (l(), m("p", $n, [
                v.type === "dir" ? (l(), m("svg", Cn, Mn)) : (l(), m("svg", En, jn)),
                t("span", An, u(v.basename), 1)
              ]))), 256)),
              t("p", Tn, u(a(s)("The archive will be unarchived at")) + " (" + u(d.current.dirname) + ")", 1),
              o.value.length ? (l(), L(G, {
                key: 0,
                onHidden: i[0] || (i[0] = (v) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(o.value), 1)
                ]),
                _: 1
              })) : M("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Fn = { class: "sm:flex sm:items-start" }, Nn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    "stroke-width": "2",
    stroke: "currentColor",
    "aria-hidden": "true"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    })
  ])
], -1), Vn = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Bn = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, zn = { class: "text-sm text-gray-500 pb-1" }, Un = { class: "max-h-[200px] overflow-y-auto vf-scrollbar text-left" }, Hn = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Rn = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, qn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), In = [
  qn
], Pn = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Wn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Gn = [
  Wn
], Yn = { class: "ml-1.5" }, Kn = { class: "font-bold text-xs text-gray-700 dark:text-gray-500 mt-3 tracking-wider" }, Jn = { class: "flex text-sm text-gray-800 dark:text-gray-400 border dark:border-gray-700 p-1 rounded" }, Xn = /* @__PURE__ */ t("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, [
  /* @__PURE__ */ t("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
  })
], -1), Zn = { class: "ml-1.5 overflow-auto" }, Qn = { class: "m-1 mr-auto font-bold text-gray-500 text-sm dark:text-gray-200 self-center" }, el = {
  name: "VFModalMove"
}, tl = /* @__PURE__ */ Object.assign(el, {
  setup(p) {
    const e = O("ServiceContainer"), { t: s } = e.i18n;
    e.storage;
    const n = _(e.modal.data.items.from), o = _(""), r = () => {
      n.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: n.value.map(({ path: c, type: d }) => ({ path: c, type: d })),
          item: e.modal.data.items.to.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("Files moved.", e.modal.data.items.to.name) });
        },
        onError: (c) => {
          o.value = s(c.message);
        }
      });
    };
    return (c, d) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, u(a(s)("Yes, Move!")), 1),
        t("button", {
          type: "button",
          onClick: d[1] || (d[1] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1),
        t("div", Qn, u(a(s)("%s item(s) selected.", n.value.length)), 1)
      ]),
      default: A(() => [
        t("div", Fn, [
          Nn,
          t("div", Vn, [
            t("h3", Bn, u(a(s)("Move files")), 1),
            t("p", zn, u(a(s)("Are you sure you want to move these files?")), 1),
            t("div", Un, [
              (l(!0), m(U, null, I(n.value, (i) => (l(), m("div", Hn, [
                t("div", null, [
                  i.type === "dir" ? (l(), m("svg", Rn, In)) : (l(), m("svg", Pn, Gn))
                ]),
                t("div", Yn, u(i.path), 1)
              ]))), 256))
            ]),
            t("h4", Kn, u(a(s)("Target Directory")), 1),
            t("p", Jn, [
              Xn,
              t("span", Zn, u(a(e).modal.data.items.to.path), 1)
            ]),
            o.value.length ? (l(), L(G, {
              key: 0,
              onHidden: d[0] || (d[0] = (i) => o.value = ""),
              error: ""
            }, {
              default: A(() => [
                N(u(o.value), 1)
              ]),
              _: 1
            })) : M("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}), sl = (p, e) => {
  const s = p.__vccOpts || p;
  for (const [n, o] of e)
    s[n] = o;
  return s;
}, al = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(p, { emit: e, slots: s }) {
    const n = O("ServiceContainer"), o = _(!1), { t: r } = n.i18n;
    let c = null;
    const d = () => {
      clearTimeout(c), o.value = !0, c = setTimeout(() => {
        o.value = !1;
      }, 2e3);
    };
    return P(() => {
      n.emitter.on(p.on, d);
    }), Le(() => {
      clearTimeout(c);
    }), {
      shown: o,
      t: r
    };
  }
}, ol = { key: 1 };
function rl(p, e, s, n, o, r) {
  return l(), m("div", {
    class: z(["text-sm text-green-600 dark:text-green-600 transition-opacity duration-500 ease-out", [{ "opacity-0": !n.shown }]])
  }, [
    p.$slots.default ? le(p.$slots, "default", { key: 0 }) : (l(), m("span", ol, u(n.t("Saved.")), 1))
  ], 2);
}
const ve = /* @__PURE__ */ sl(al, [["render", rl]]), nl = { class: "sm:flex sm:items-start" }, ll = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ t("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    "stroke-width": "1.5",
    stroke: "currentColor"
  }, [
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
    }),
    /* @__PURE__ */ t("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    })
  ])
], -1), il = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, dl = { class: "mt-2" }, cl = { class: "text-lg font-semibold mt-5 text-gray-900 dark:text-gray-400 tracking-wider" }, ul = { class: "mt-3 text-left" }, ml = { class: "space-y-2" }, vl = { class: "flex relative gap-x-3" }, pl = { class: "h-6 items-center" }, hl = { class: "flex-1 block text-sm" }, fl = {
  for: "metric_unit",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400"
}, gl = { class: "flex relative gap-x-3" }, _l = { class: "h-6 items-center" }, kl = {
  for: "theme",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400 text-sm"
}, bl = { class: "flex text-sm" }, yl = ["label"], xl = ["value"], wl = {
  key: 0,
  class: "flex relative gap-x-3"
}, $l = { class: "h-6 items-center" }, Cl = {
  for: "language",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400 text-sm text-nowrap"
}, Sl = { class: "flex text-sm" }, Ml = ["label"], El = ["value"], Dl = {
  name: "VFModalAbout"
}, jl = /* @__PURE__ */ Object.assign(Dl, {
  setup(p) {
    const e = O("ServiceContainer"), { getStore: s, setStore: n, clearStore: o } = e.storage, { t: r, changeLocale: c, locale: d } = e.i18n;
    _(""), _("");
    const i = async () => {
      o(), location.reload();
    }, v = (S) => {
      e.theme.set(S), e.emitter.emit("vf-theme-saved");
    }, k = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? xe : ye, n("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, { i18n: g } = O("VueFinderOptions"), y = Object.fromEntries(
      Object.entries({
        en: "English",
        fr: "French (Français)",
        de: "German (Deutsch)",
        fa: "Persian (فارسی)",
        he: "Hebrew (עִברִית)",
        hi: "Hindi (हिंदी)",
        ru: "Russian (Pусский)",
        sv: "Swedish (Svenska)",
        tr: "Turkish (Türkçe)",
        zhCN: "Simplified Chinese (简体中文)",
        zhTW: "Traditional Chinese (繁體中文)"
      }).filter(([S]) => Object.keys(g).includes(S))
    ), E = ee(() => ({
      system: r("System"),
      light: r("Light"),
      dark: r("Dark")
    }));
    return (S, h) => (l(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: h[5] || (h[5] = (f) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(r)("Close")), 1)
      ]),
      default: A(() => [
        t("div", nl, [
          ll,
          t("div", il, [
            t("div", dl, [
              t("div", null, [
                t("h3", cl, u(a(r)("Settings")), 1)
              ]),
              t("div", ul, [
                t("fieldset", null, [
                  t("div", ml, [
                    t("div", vl, [
                      t("div", pl, [
                        q(t("input", {
                          id: "metric_unit",
                          name: "metric_unit",
                          type: "checkbox",
                          "onUpdate:modelValue": h[0] || (h[0] = (f) => a(e).metricUnits = f),
                          onClick: k,
                          class: "h-4 w-4 rounded border-gray-300 text-indigo-600 dark:accent-slate-400 focus:ring-indigo-600"
                        }, null, 512), [
                          [Oe, a(e).metricUnits]
                        ])
                      ]),
                      t("div", hl, [
                        t("label", fl, [
                          N(u(a(r)("Use Metric Units")) + " ", 1),
                          H(ve, {
                            class: "ms-3",
                            on: "vf-metric-units-saved"
                          }, {
                            default: A(() => [
                              N(u(a(r)("Saved.")), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ]),
                    t("div", gl, [
                      t("div", _l, [
                        t("label", kl, u(a(r)("Theme")), 1)
                      ]),
                      t("div", bl, [
                        q(t("select", {
                          id: "theme",
                          "onUpdate:modelValue": h[1] || (h[1] = (f) => a(e).theme.value = f),
                          onChange: h[2] || (h[2] = (f) => v(f.target.value)),
                          class: "flex-shrink-0 w-full text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded"
                        }, [
                          t("optgroup", {
                            label: a(r)("Theme")
                          }, [
                            (l(!0), m(U, null, I(E.value, (f, V) => (l(), m("option", { value: V }, u(f), 9, xl))), 256))
                          ], 8, yl)
                        ], 544), [
                          [pe, a(e).theme.value]
                        ]),
                        H(ve, {
                          class: "ms-3 flex-shrink-0 flex-grow basis-full",
                          on: "vf-theme-saved"
                        }, {
                          default: A(() => [
                            N(u(a(r)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    a(e).features.includes(a(B).LANGUAGE) && Object.keys(a(y)).length > 1 ? (l(), m("div", wl, [
                      t("div", $l, [
                        t("label", Cl, u(a(r)("Language")), 1)
                      ]),
                      t("div", Sl, [
                        q(t("select", {
                          id: "language",
                          "onUpdate:modelValue": h[3] || (h[3] = (f) => _e(d) ? d.value = f : null),
                          onChange: h[4] || (h[4] = (f) => a(c)(f.target.value)),
                          class: "flex-shrink-0 w-1/2 sm:w-full text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded"
                        }, [
                          t("optgroup", {
                            label: a(r)("Language")
                          }, [
                            (l(!0), m(U, null, I(a(y), (f, V) => (l(), m("option", { value: V }, u(f), 9, El))), 256))
                          ], 8, Ml)
                        ], 544), [
                          [pe, a(d)]
                        ]),
                        H(ve, {
                          class: "ms-3 flex-shrink-0 flex-grow basis-full",
                          on: "vf-language-saved"
                        }, {
                          default: A(() => [
                            N(u(a(r)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])) : M("", !0),
                    t("button", {
                      onClick: i,
                      type: "button",
                      class: "vf-btn vf-btn-secondary"
                    }, u(a(r)("Reset Settings")), 1)
                  ])
                ])
              ])
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Al = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ModalAbout: jl,
  ModalArchive: _n,
  ModalDelete: eo,
  ModalMessage: io,
  ModalMove: tl,
  ModalNewFile: Mo,
  ModalNewFolder: _o,
  ModalPreview: fr,
  ModalRename: Ar,
  ModalUnarchive: On,
  ModalUpload: en
}, Symbol.toStringTag, { value: "Module" })), Rl = {
  /** @param {import('vue').App} app
   * @param options
   */
  install(p, e = {}) {
    p.component("VueFinder", Ma);
    for (const n of Object.values(Al))
      p.component(n.name, n);
    e.i18n = e.i18n ?? {};
    let [s] = Object.keys(e.i18n);
    e.locale = e.locale ?? s ?? "en", p.provide("VueFinderOptions", e);
  }
};
export {
  Rl as default
};
