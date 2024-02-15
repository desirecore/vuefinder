var Ce = Object.defineProperty;
var Se = (p, e, s) => e in p ? Ce(p, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : p[e] = s;
var fe = (p, e, s) => (Se(p, typeof e != "symbol" ? e + "" : e, s), s);
import { reactive as ie, watch as de, ref as k, computed as ee, inject as F, openBlock as l, createElementBlock as d, unref as a, createCommentVNode as M, normalizeClass as z, createElementVNode as t, createTextVNode as N, toDisplayString as u, customRef as Me, withModifiers as K, Fragment as U, renderList as I, withDirectives as q, withKeys as Z, isRef as _e, vModelText as Q, nextTick as ce, createVNode as R, TransitionGroup as Ee, withCtx as A, onMounted as P, onUpdated as De, onBeforeUnmount as ke, vShow as re, normalizeStyle as ye, vModelSelect as pe, provide as je, Transition as Ae, createBlock as T, resolveDynamicComponent as Le, renderSlot as le, onUnmounted as Te, vModelCheckbox as Fe } from "vue";
import Oe from "mitt";
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
    const o = Object.assign({}, s.headers, n, e.headers), r = Object.assign({}, s.params, e.params), c = e.body, m = s.baseUrl + e.url, i = e.method;
    let v;
    i !== "get" && (c instanceof FormData ? (v = c, s.body != null && Object.entries(this.config.body).forEach(([b, _]) => {
      v.append(b, _);
    })) : (v = { ...c }, s.body != null && Object.assign(v, this.config.body)));
    const g = {
      url: m,
      method: i,
      headers: o,
      params: r,
      body: v
    };
    if (s.transformRequest != null) {
      const b = s.transformRequest({
        url: m,
        method: i,
        headers: o,
        params: r,
        body: v
      });
      b.url != null && (g.url = b.url), b.method != null && (g.method = b.method), b.params != null && (g.params = b.params ?? {}), b.headers != null && (g.headers = b.headers ?? {}), b.body != null && (g.body = b.body);
    }
    return g;
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
    const n = window.vueFinderSessionKey, o = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: s.path, sessionKey: n }
    });
    return o.url + "?" + new URLSearchParams(o.params).toString();
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
      let m;
      s.body instanceof FormData ? m = e.body : (m = JSON.stringify(s.body), o.headers["Content-Type"] = "application/json"), o.body = m;
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
  const { getStore: o, setStore: r } = p, c = k({}), m = k(o("locale", e)), i = (b, _ = e) => {
    Ie(b, n).then((E) => {
      c.value = E, r("locale", b), m.value = b, r("translations", E), Object.values(n).length > 1 && (s.emit("vf-toast-push", { label: "The language is set to " + b }), s.emit("vf-language-saved"));
    }).catch((E) => {
      _ ? (s.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), i(_, null)) : s.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  !o("locale") && !n.length ? i(e) : c.value = o("translations");
  const v = (b, ..._) => _.length ? v(b = b.replace("%s", _.shift()), ..._) : b;
  function g(b, ..._) {
    return c.value && c.value.hasOwnProperty(b) ? v(c.value[b], ..._) : v(b, ..._);
  }
  return { t: g, changeLocale: i, locale: m };
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
}, We = Object.values(B), Ge = "2.2.9";
function be(p, e, s, n, o) {
  return (e = Math, s = e.log, n = 1024, o = s(p) / s(n) | 0, p / e.pow(n, o)).toFixed(0) + " " + (o ? "KMGTPEZY"[--o] + "iB" : "B");
}
function xe(p, e, s, n, o) {
  return (e = Math, s = e.log, n = 1e3, o = s(p) / s(n) | 0, p / e.pow(n, o)).toFixed(0) + " " + (o ? "KMGTPEZY"[--o] + "B" : "B");
}
function Ke(p) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, n = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(p);
  return n[1] * Math.pow(1024, e[n[2].toLowerCase()]);
}
const J = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function Ye(p, e) {
  const s = k(J.SYSTEM), n = k(J.LIGHT);
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
  const s = qe(p.id), n = Oe(), o = s.getStore("metricUnits", !1), r = Ye(s, p.theme), c = e.i18n, m = p.locale ?? e.locale, i = ee(() => Pe(s, m, n, c)), v = (b) => Array.isArray(b) ? b : We, g = p.persist ? s.getStore("path", p.path) : p.path;
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
    filesize: o ? xe : be,
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
    path: g,
    // persist state
    persist: p.persist,
    // storage
    storage: s,
    // fetched items
    data: { adapter: s.getStore("adapter"), storages: [], dirname: g, files: [] },
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
], yt = {
  key: 1,
  class: "flex text-center"
}, bt = { class: "pl-2" }, xt = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, wt = {
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
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "none",
  "stroke-width": "1.5"
}, jt = {
  key: 0,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
}, At = {
  key: 1,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
}, Lt = ["aria-label"], Tt = {
  key: 0,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
}, Ft = {
  key: 1,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
}, Ot = {
  name: "VFToolbar"
}, Nt = /* @__PURE__ */ Object.assign(Ot, {
  setup(p) {
    const e = F("ServiceContainer"), { setStore: s } = e.storage, { t: n } = e.i18n, o = k([]), r = k("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      r.value = i;
    });
    const c = () => {
      e.fullScreen = !e.fullScreen, s("full-screen", e.fullScreen), e.emitter.emit("vf-fullscreen-toggle");
    };
    e.emitter.on("vf-nodes-selected", (i) => {
      o.value = i;
    });
    const m = () => {
      e.view = e.view === "list" ? "grid" : "list", s("viewport", e.view);
    };
    return (i, v) => (l(), d("div", Xe, [
      r.value.length ? (l(), d("div", yt, [
        t("div", bt, [
          N(u(a(n)("Search results for")) + " ", 1),
          t("span", xt, u(r.value), 1)
        ]),
        a(e).loading ? (l(), d("svg", wt, St)) : M("", !0)
      ])) : (l(), d("div", Ze, [
        a(e).features.includes(a(B).NEW_FOLDER) ? (l(), d("div", {
          key: 0,
          class: "mx-1.5",
          "aria-label": a(n)("New Folder"),
          "data-microtip-position": "bottom-right",
          role: "tooltip",
          onClick: v[0] || (v[0] = (g) => a(e).emitter.emit("vf-modal-show", { type: "new-folder", items: o.value }))
        }, tt, 8, Qe)) : M("", !0),
        a(e).features.includes(a(B).NEW_FILE) ? (l(), d("div", {
          key: 1,
          class: "mx-1.5",
          "aria-label": a(n)("New File"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: v[1] || (v[1] = (g) => a(e).emitter.emit("vf-modal-show", { type: "new-file", items: o.value }))
        }, ot, 8, st)) : M("", !0),
        a(e).features.includes(a(B).RENAME) ? (l(), d("div", {
          key: 2,
          class: "mx-1.5",
          "aria-label": a(n)("Rename"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: v[2] || (v[2] = (g) => o.value.length != 1 || a(e).emitter.emit("vf-modal-show", { type: "rename", items: o.value }))
        }, [
          (l(), d("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length == 1 ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, lt, 2))
        ], 8, rt)) : M("", !0),
        a(e).features.includes(a(B).DELETE) ? (l(), d("div", {
          key: 3,
          class: "mx-1.5",
          "aria-label": a(n)("Delete"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: v[3] || (v[3] = (g) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "delete", items: o.value }))
        }, [
          (l(), d("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, ct, 2))
        ], 8, it)) : M("", !0),
        a(e).features.includes(a(B).UPLOAD) ? (l(), d("div", {
          key: 4,
          class: "mx-1.5",
          "aria-label": a(n)("Upload"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: v[4] || (v[4] = (g) => a(e).emitter.emit("vf-modal-show", { type: "upload", items: o.value }))
        }, vt, 8, ut)) : M("", !0),
        a(e).features.includes(a(B).UNARCHIVE) && o.value.length == 1 && o.value[0].mime_type == "application/zip" ? (l(), d("div", {
          key: 5,
          class: "mx-1.5",
          "aria-label": a(n)("Unarchive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: v[5] || (v[5] = (g) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "unarchive", items: o.value }))
        }, [
          (l(), d("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, ft, 2))
        ], 8, pt)) : M("", !0),
        a(e).features.includes(a(B).ARCHIVE) ? (l(), d("div", {
          key: 6,
          class: "mx-1.5",
          "aria-label": a(n)("Archive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: v[6] || (v[6] = (g) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "archive", items: o.value }))
        }, [
          (l(), d("svg", {
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
        a(e).features.includes(a(B).FULL_SCREEN) ? (l(), d("div", {
          key: 0,
          class: "mx-1.5",
          "aria-label": a(n)("Toggle Full Screen"),
          "data-microtip-position": "bottom-left",
          role: "tooltip",
          onClick: c
        }, [
          (l(), d("svg", Dt, [
            a(e).fullScreen ? (l(), d("path", jt)) : (l(), d("path", At))
          ]))
        ], 8, Et)) : M("", !0),
        t("div", {
          class: "mx-1.5",
          "aria-label": a(n)("Change View"),
          "data-microtip-position": "bottom-left",
          role: "tooltip",
          onClick: v[7] || (v[7] = (g) => r.value.length || m())
        }, [
          (l(), d("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([r.value.length ? "stroke-gray-200  dark:stroke-gray-700" : "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, [
            a(e).view === "grid" ? (l(), d("path", Tt)) : M("", !0),
            a(e).view === "list" ? (l(), d("path", Ft)) : M("", !0)
          ], 2))
        ], 8, Lt)
      ])
    ]));
  }
}), Vt = (p, e = 0, s = !1) => {
  let n;
  return (...o) => {
    s && !n && p(...o), clearTimeout(n), n = setTimeout(() => {
      p(...o);
    }, e);
  };
}, Bt = (p, e, s) => {
  const n = k(p);
  return Me((o, r) => ({
    get() {
      return o(), n.value;
    },
    set: Vt(
      (c) => {
        n.value = c, r();
      },
      e,
      s
    )
  }));
}, zt = { class: "flex p-1.5 bg-neutral-100 dark:bg-gray-800 border-t border-b border-neutral-300 dark:border-gray-700/50 items-center select-none text-sm" }, Ut = ["aria-label"], Ht = /* @__PURE__ */ t("path", {
  "fill-rule": "evenodd",
  d: "M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z",
  "clip-rule": "evenodd"
}, null, -1), Rt = [
  Ht
], qt = ["aria-label"], It = /* @__PURE__ */ t("path", { d: "M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z" }, null, -1), Pt = [
  It
], Wt = ["aria-label"], Gt = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M6 18L18 6M6 6l12 12"
}, null, -1), Kt = [
  Gt
], Yt = /* @__PURE__ */ t("path", { d: "M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" }, null, -1), Jt = [
  Yt
], Xt = { class: "flex leading-6" }, Zt = /* @__PURE__ */ t("span", { class: "text-neutral-300 dark:text-gray-600 mx-0.5" }, "/", -1), Qt = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], es = {
  key: 0,
  class: "animate-spin p-1 h-6 w-6 text-white ml-auto",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, ts = /* @__PURE__ */ t("circle", {
  class: "opacity-25 stroke-blue-900 dark:stroke-blue-100",
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4"
}, null, -1), ss = /* @__PURE__ */ t("path", {
  class: "opacity-75",
  fill: "currentColor",
  d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
}, null, -1), as = [
  ts,
  ss
], os = {
  key: 3,
  class: "relative flex bg-white dark:bg-gray-700 justify-between items-center rounded p-1 ml-2 w-full"
}, rs = /* @__PURE__ */ t("div", null, [
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
], -1), ns = ["placeholder"], ls = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M6 18L18 6M6 6l12 12"
}, null, -1), is = [
  ls
], ds = {
  name: "VFBreadcrumb"
}, cs = /* @__PURE__ */ Object.assign(ds, {
  setup(p) {
    const e = k(null), s = k([]), n = k(!1), o = k(null), r = F("ServiceContainer"), { t: c } = r.i18n;
    r.emitter.on("vf-explorer-update", () => {
      let w = [], h = [];
      e.value = r.data.dirname ?? r.adapter + "://", e.value.length == 0 && (s.value = []), e.value.replace(r.adapter + "://", "").split("/").forEach(function(f) {
        w.push(f), w.join("/") != "" && h.push({
          basename: f,
          name: f,
          path: r.adapter + "://" + w.join("/"),
          type: "dir"
        });
      }), h.length > 4 && (h = h.slice(-5), h[0].name = ".."), s.value = h;
    });
    const m = () => {
      n.value = !1, v.value = "";
    };
    r.emitter.on("vf-search-exit", () => {
      m();
    });
    const i = () => {
      r.features.includes(B.SEARCH) && (n.value = !0, ce(() => o.value.focus()));
    }, v = Bt("", 400);
    de(v, (w) => {
      r.emitter.emit("vf-toast-clear"), r.emitter.emit("vf-search-query", { newQuery: w });
    });
    const g = () => s.value.length && !n.value, b = (w, h = null) => {
      w.preventDefault(), E(w), h ?? (h = s.value.length - 2);
      let f = JSON.parse(w.dataTransfer.getData("items"));
      if (f.find((V) => V.storage !== r.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      r.emitter.emit("vf-modal-show", {
        type: "move",
        items: { from: f, to: s.value[h] ?? { path: r.adapter + "://" } }
      });
    }, _ = (w) => {
      w.preventDefault(), g() ? (w.dataTransfer.dropEffect = "copy", w.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-500")) : (w.dataTransfer.dropEffect = "none", w.dataTransfer.effectAllowed = "none");
    }, E = (w) => {
      w.preventDefault(), w.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-500"), g() && w.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-500");
    }, S = () => {
      v.value == "" && m();
    };
    return (w, h) => (l(), d("div", zt, [
      t("span", {
        "aria-label": a(c)("Go up a directory"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (l(), d("svg", {
          onDragover: h[0] || (h[0] = (f) => _(f)),
          onDragleave: h[1] || (h[1] = (f) => E(f)),
          onDrop: h[2] || (h[2] = (f) => b(f)),
          onClick: h[3] || (h[3] = (f) => {
            var V;
            return !g() || a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter, path: ((V = s.value[s.value.length - 2]) == null ? void 0 : V.path) ?? a(r).adapter + "://" } });
          }),
          class: z(["h-6 w-6 p-0.5 rounded", g() ? "text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer" : "text-gray-400 dark:text-neutral-500"]),
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor"
        }, Rt, 34))
      ], 8, Ut),
      a(r).loading ? (l(), d("span", {
        key: 1,
        "aria-label": a(c)("Cancel"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (l(), d("svg", {
          onClick: h[5] || (h[5] = (f) => a(r).emitter.emit("vf-fetch-abort")),
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.5",
          stroke: "currentColor",
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer"
        }, Kt))
      ], 8, Wt)) : (l(), d("span", {
        key: 0,
        "aria-label": a(c)("Refresh"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (l(), d("svg", {
          onClick: h[4] || (h[4] = (f) => {
            a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter, path: a(r).data.dirname } });
          }),
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "-40 -40 580 580",
          fill: "currentColor"
        }, Pt))
      ], 8, qt)),
      n.value ? (l(), d("div", os, [
        rs,
        q(t("input", {
          ref_key: "searchInput",
          ref: o,
          onKeydown: Z(m, ["esc"]),
          onBlur: S,
          "onUpdate:modelValue": h[10] || (h[10] = (f) => _e(v) ? v.value = f : null),
          placeholder: a(c)("Search anything.."),
          class: "w-full pb-0 px-1 border-0 text-base ring-0 outline-0 text-gray-600 focus:ring-transparent focus:border-transparent dark:focus:ring-transparent dark:focus:border-transparent dark:text-gray-300 bg-transparent",
          type: "text"
        }, null, 40, ns), [
          [Q, a(v)]
        ]),
        (l(), d("svg", {
          class: "w-6 h-6 cursor-pointer",
          onClick: m,
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.5",
          stroke: "currentColor"
        }, is))
      ])) : (l(), d("div", {
        key: 2,
        class: "group flex bg-white dark:bg-gray-700 items-center rounded p-1 ml-2 w-full",
        onClick: K(i, ["self"])
      }, [
        (l(), d("svg", {
          onDragover: h[6] || (h[6] = (f) => _(f)),
          onDragleave: h[7] || (h[7] = (f) => E(f)),
          onDrop: h[8] || (h[8] = (f) => b(f, -1)),
          onClick: h[9] || (h[9] = (f) => a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter } })),
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor"
        }, Jt, 32)),
        t("div", Xt, [
          (l(!0), d(U, null, I(s.value, (f, V) => (l(), d("div", { key: V }, [
            Zt,
            t("span", {
              onDragover: (H) => V === s.value.length - 1 || _(H),
              onDragleave: (H) => V === s.value.length - 1 || E(H),
              onDrop: (H) => V === s.value.length - 1 || b(H, V),
              class: "px-1.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded cursor-pointer",
              title: f.basename,
              onClick: (H) => a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter, path: f.path } })
            }, u(f.name), 41, Qt)
          ]))), 128))
        ]),
        a(r).loading ? (l(), d("svg", es, as)) : M("", !0)
      ]))
    ]));
  }
}), we = (p, e = null) => new Date(p * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), us = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, ms = /* @__PURE__ */ t("path", {
  "fill-rule": "evenodd",
  d: "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",
  "clip-rule": "evenodd"
}, null, -1), vs = [
  ms
], ps = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5",
  viewBox: "0 0 20 20",
  fill: "currentColor"
}, hs = /* @__PURE__ */ t("path", {
  "fill-rule": "evenodd",
  d: "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",
  "clip-rule": "evenodd"
}, null, -1), fs = [
  hs
], gs = {
  name: "VFSortIcon"
}, ne = /* @__PURE__ */ Object.assign(gs, {
  props: { direction: String },
  setup(p) {
    return (e, s) => (l(), d("div", null, [
      p.direction === "down" ? (l(), d("svg", us, vs)) : M("", !0),
      p.direction === "up" ? (l(), d("svg", ps, fs)) : M("", !0)
    ]));
  }
}), _s = ["onClick"], ks = {
  name: "VFToast.vue"
}, ys = /* @__PURE__ */ Object.assign(ks, {
  setup(p) {
    const e = F("ServiceContainer"), { getStore: s } = e.storage, n = k(s("full-screen", !1)), o = k([]), r = (i) => i === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", c = (i) => {
      o.value.splice(i, 1);
    }, m = (i) => {
      let v = o.value.findIndex((g) => g.id === i);
      v !== -1 && c(v);
    };
    return e.emitter.on("vf-toast-clear", () => {
      o.value = [];
    }), e.emitter.on("vf-toast-push", (i) => {
      let v = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      i.id = v, o.value.push(i), setTimeout(() => {
        m(v);
      }, 5e3);
    }), (i, v) => (l(), d("div", {
      class: z([n.value.value ? "fixed" : "absolute", "bottom-0 max-w-fit flex flex-col bottom-0 left-1/2 -translate-x-1/2"])
    }, [
      R(Ee, {
        name: "vf-toast-item",
        "leave-active-class": "transition-all duration-1000",
        "leave-to-class": "opacity-0"
      }, {
        default: A(() => [
          (l(!0), d(U, null, I(o.value, (g, b) => (l(), d("div", {
            onClick: (_) => c(b),
            key: g,
            class: z([r(g.type), "inline-block mx-auto my-0.5 py-0.5 px-2 min-w-max bg-gray-50 dark:bg-gray-600 border text-xs sm:text-sm rounded cursor-pointer"])
          }, u(g.label), 11, _s))), 128))
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
const bs = { class: "relative flex-auto flex flex-col overflow-hidden" }, xs = {
  key: 0,
  class: "grid grid-cols-12 border-b border-neutral-300 border-gray-200 dark:border-gray-700 text-xs select-none"
}, ws = { class: "absolute" }, $s = /* @__PURE__ */ t("svg", {
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
], -1), Cs = { class: "text-neutral-700 dark:text-neutral-300 p-1 absolute text-center top-4 right-[-2rem] md:top-5 md:right-[-2.4rem] z-20 text-xs" }, Ss = ["onDblclick", "onContextmenu", "data-type", "data-item", "data-index"], Ms = { class: "grid grid-cols-12 items-center" }, Es = { class: "flex col-span-7 items-center" }, Ds = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, js = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), As = [
  js
], Ls = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ts = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Fs = [
  Ts
], Os = { class: "overflow-ellipsis overflow-hidden whitespace-nowrap" }, Ns = { class: "col-span-5 overflow-ellipsis overflow-hidden whitespace-nowrap" }, Vs = ["onDblclick", "onContextmenu", "onDragstart", "onDragover", "onDrop", "data-type", "data-item", "data-index"], Bs = { class: "grid grid-cols-12 items-center" }, zs = { class: "flex col-span-7 items-center" }, Us = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Hs = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Rs = [
  Hs
], qs = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Is = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Ps = [
  Is
], Ws = { class: "overflow-ellipsis overflow-hidden whitespace-nowrap" }, Gs = { class: "col-span-2 text-center" }, Ks = { class: "col-span-3 overflow-ellipsis overflow-hidden whitespace-nowrap" }, Ys = ["onDblclick", "onContextmenu", "onDragstart", "onDragover", "onDrop", "data-type", "data-item", "data-index"], Js = { class: "relative" }, Xs = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-10 w-10 md:h-12 md:w-12 m-auto fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Zs = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Qs = [
  Zs
], ea = ["data-src", "alt"], ta = {
  key: 2,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-10 w-10 md:h-12 md:w-12 m-auto text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, sa = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), aa = [
  sa
], oa = {
  key: 3,
  class: "absolute hidden md:block top-1/2 w-full text-center text-neutral-500"
}, ra = { class: "break-all" }, na = {
  name: "VFExplorer"
}, la = /* @__PURE__ */ Object.assign(na, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n;
    e.storage;
    const n = (x) => x == null ? void 0 : x.substring(0, 3), o = k(null), r = k(null), c = k(0), m = k(null), i = Math.floor(Math.random() * 2 ** 32), v = k("");
    let g;
    e.emitter.on("vf-fullscreen-toggle", () => {
      o.value.style.height = null;
    }), e.emitter.on("vf-search-query", ({ newQuery: x }) => {
      v.value = x, x ? e.emitter.emit("vf-fetch", {
        params: {
          q: "search",
          adapter: e.data.adapter,
          path: e.data.dirname,
          filter: x
        },
        onSuccess: (D) => {
          D.files.length || e.emitter.emit("vf-toast-push", { label: s("No search result found.") });
        }
      }) : e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: e.data.dirname } });
    });
    let b = null;
    const _ = () => {
      b && clearTimeout(b);
    }, E = k(!0), S = (x) => {
      x.touches.length > 1 && (E.value ? (m.value.stop(), e.emitter.emit("vf-toast-push", { label: s("Drag&Drop: off") })) : (m.value.start(), e.emitter.emit("vf-toast-push", { label: s("Drag&Drop: on") }), e.emitter.emit("vf-explorer-update")), E.value = !E.value);
    }, w = (x) => {
      b = setTimeout(() => {
        const D = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: x.target.getBoundingClientRect().x,
          clientY: x.target.getBoundingClientRect().y
        });
        x.target.dispatchEvent(D);
      }, 500);
    }, h = (x) => {
      x.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: x.path } })) : e.emitter.emit("vf-modal-show", { type: "preview", adapter: e.data.adapter, item: x });
    }, f = ie({ active: !1, column: "", order: "" }), V = (x = !0) => {
      let D = [...e.data.files], $ = f.column, j = f.order == "asc" ? 1 : -1;
      if (!x)
        return D;
      const C = (y, L) => typeof y == "string" && typeof L == "string" ? y.toLowerCase().localeCompare(L.toLowerCase()) : y < L ? -1 : y > L ? 1 : 0;
      return f.active && (D = D.slice().sort((y, L) => C(y[$], L[$]) * j)), D;
    }, H = (x) => {
      f.active && f.column == x ? (f.active = f.order == "asc", f.column = x, f.order = "desc") : (f.active = !0, f.column = x, f.order = "asc");
    }, Y = () => m.value.getSelection().map((x) => JSON.parse(x.dataset.item)), te = (x, D) => {
      if (x.altKey || x.ctrlKey || x.metaKey)
        return x.preventDefault(), !1;
      x.dataTransfer.setDragImage(r.value, 0, 15), x.dataTransfer.effectAllowed = "all", x.dataTransfer.dropEffect = "copy", x.dataTransfer.setData("items", JSON.stringify(Y()));
    }, se = (x, D) => {
      x.preventDefault();
      let $ = JSON.parse(x.dataTransfer.getData("items"));
      if ($.find((j) => j.storage !== e.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.emitter.emit("vf-modal-show", { type: "move", items: { from: $, to: D } });
    }, ae = (x, D) => {
      x.preventDefault(), !D || D.type !== "dir" || m.value.getSelection().find(($) => $ == x.currentTarget) ? (x.dataTransfer.dropEffect = "none", x.dataTransfer.effectAllowed = "none") : x.dataTransfer.dropEffect = "copy";
    }, oe = () => {
      m.value = new Ne({
        area: o.value,
        keyboardDrag: !1,
        selectedClass: "vf-explorer-selected",
        selectorClass: "vf-explorer-selector"
      }), e.emitter.on("vf-explorer-update", () => ce(() => {
        m.value.clearSelection(), m.value.setSettings({
          selectables: document.getElementsByClassName("vf-item-" + i)
        });
      })), m.value.subscribe("predragstart", ({ event: x, isDragging: D }) => {
        if (D)
          c.value = m.value.getSelection().length, m.value.break();
        else {
          const $ = x.target.offsetWidth - x.offsetX, j = x.target.offsetHeight - x.offsetY;
          $ < 15 && j < 15 && (m.value.clearSelection(), m.value.break());
        }
      }), m.value.subscribe("predragmove", ({ isDragging: x }) => {
        x && m.value.break();
      }), m.value.subscribe("callback", ({ items: x, event: D, isDragging: $ }) => {
        e.emitter.emit("vf-nodes-selected", Y()), c.value = m.value.getSelection().length;
      });
    };
    return P(() => {
      g = new Ve(o.value), oe();
    }), De(() => {
      m.value.Area.reset(), m.value.SelectorArea.updatePos(), g.update();
    }), P(() => {
      de(() => e.view, () => e.emitter.emit("vf-explorer-update"));
    }), ke(() => {
      g.destroy();
    }), (x, D) => (l(), d("div", bs, [
      a(e).view == "list" || v.value.length ? (l(), d("div", xs, [
        t("div", {
          onClick: D[0] || (D[0] = ($) => H("basename")),
          class: "col-span-7 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center pl-1"
        }, [
          N(u(a(s)("Name")) + " ", 1),
          q(R(ne, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, f.active && f.column == "basename"]
          ])
        ]),
        v.value.length ? M("", !0) : (l(), d("div", {
          key: 0,
          onClick: D[1] || (D[1] = ($) => H("file_size")),
          class: "col-span-2 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center border-l border-r dark:border-gray-700"
        }, [
          N(u(a(s)("Size")) + " ", 1),
          q(R(ne, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, f.active && f.column == "file_size"]
          ])
        ])),
        v.value.length ? M("", !0) : (l(), d("div", {
          key: 1,
          onClick: D[2] || (D[2] = ($) => H("last_modified")),
          class: "col-span-3 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center"
        }, [
          N(u(a(s)("Date")) + " ", 1),
          q(R(ne, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, f.active && f.column == "last_modified"]
          ])
        ])),
        v.value.length ? (l(), d("div", {
          key: 2,
          onClick: D[3] || (D[3] = ($) => H("path")),
          class: "col-span-5 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center border-l dark:border-gray-700"
        }, [
          N(u(a(s)("Filepath")) + " ", 1),
          q(R(ne, {
            direction: f.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, f.active && f.column == "path"]
          ])
        ])) : M("", !0)
      ])) : M("", !0),
      t("div", ws, [
        t("div", {
          ref_key: "dragImage",
          ref: r,
          class: "absolute -z-50 -top-96"
        }, [
          $s,
          t("div", Cs, u(c.value), 1)
        ], 512)
      ]),
      t("div", {
        onTouchstart: S,
        onContextmenu: D[10] || (D[10] = K(($) => a(e).emitter.emit("vf-contextmenu-show", { event: $, area: o.value, items: Y() }), ["self", "prevent"])),
        class: z([a(e).fullScreen ? "" : "resize-y", "h-full w-full text-xs vf-selector-area vf-scrollbar min-h-[150px] overflow-auto p-1 z-0"]),
        ref_key: "selectorArea",
        ref: o
      }, [
        v.value.length ? (l(!0), d(U, { key: 0 }, I(V(), ($, j) => (l(), d("div", {
          onDblclick: (C) => h($),
          onTouchstart: D[4] || (D[4] = (C) => w(C)),
          onTouchend: D[5] || (D[5] = (C) => _()),
          onContextmenu: K((C) => a(e).emitter.emit("vf-contextmenu-show", { event: C, area: o.value, items: Y(), target: $ }), ["prevent"]),
          class: z(["vf-item-" + a(i), "grid grid-cols-1 border hover:bg-neutral-50 dark:hover:bg-gray-700 border-transparent my-0.5 w-full select-none"]),
          "data-type": $.type,
          "data-item": JSON.stringify($),
          "data-index": j
        }, [
          t("div", Ms, [
            t("div", Es, [
              $.type === "dir" ? (l(), d("svg", Ds, As)) : (l(), d("svg", Ls, Fs)),
              t("span", Os, u($.basename), 1)
            ]),
            t("div", Ns, u($.path), 1)
          ])
        ], 42, Ss))), 256)) : M("", !0),
        a(e).view === "list" && !v.value.length ? (l(!0), d(U, { key: 1 }, I(V(), ($, j) => (l(), d("div", {
          draggable: "true",
          onDblclick: (C) => h($),
          onTouchstart: D[6] || (D[6] = (C) => w(C)),
          onTouchend: D[7] || (D[7] = (C) => _()),
          onContextmenu: K((C) => a(e).emitter.emit("vf-contextmenu-show", { event: C, area: o.value, items: Y(), target: $ }), ["prevent"]),
          onDragstart: (C) => te(C),
          onDragover: (C) => ae(C, $),
          onDrop: (C) => se(C, $),
          class: z(["vf-item-" + a(i), "grid grid-cols-1 border hover:bg-neutral-50 dark:hover:bg-gray-700 border-transparent my-0.5 w-full select-none"]),
          "data-type": $.type,
          "data-item": JSON.stringify($),
          "data-index": j
        }, [
          t("div", Bs, [
            t("div", zs, [
              $.type === "dir" ? (l(), d("svg", Us, Rs)) : (l(), d("svg", qs, Ps)),
              t("span", Ws, u($.basename), 1)
            ]),
            t("div", Gs, u($.file_size ? a(e).filesize($.file_size) : ""), 1),
            t("div", Ks, u(a(we)($.last_modified)), 1)
          ])
        ], 42, Vs))), 256)) : M("", !0),
        a(e).view === "grid" && !v.value.length ? (l(!0), d(U, { key: 2 }, I(V(!1), ($, j) => (l(), d("div", {
          draggable: "true",
          onDblclick: (C) => h($),
          onTouchstart: D[8] || (D[8] = (C) => w(C)),
          onTouchend: D[9] || (D[9] = (C) => _()),
          onContextmenu: K((C) => a(e).emitter.emit("vf-contextmenu-show", { event: C, area: o.value, items: Y(), target: $ }), ["prevent"]),
          onDragstart: (C) => te(C),
          onDragover: (C) => ae(C, $),
          onDrop: (C) => se(C, $),
          class: z(["vf-item-" + a(i), "border border-transparent hover:bg-neutral-50 m-1 dark:hover:bg-gray-700 inline-flex w-[5.5rem] h-20 md:w-24 text-center justify-center select-none"]),
          "data-type": $.type,
          "data-item": JSON.stringify($),
          "data-index": j
        }, [
          t("div", null, [
            t("div", Js, [
              $.type === "dir" ? (l(), d("svg", Xs, Qs)) : ($.mime_type ?? "").startsWith("image") ? (l(), d("img", {
                key: 1,
                class: "lazy h-10 md:h-12 m-auto",
                "data-src": a(e).requester.getPreviewUrl(a(e).adapter, $),
                alt: $.basename
              }, null, 8, ea)) : (l(), d("svg", ta, aa)),
              !($.mime_type ?? "").startsWith("image") && $.type != "dir" ? (l(), d("div", oa, u(n($.extension)), 1)) : M("", !0)
            ]),
            t("span", ra, u(a(he)($.basename)), 1)
          ])
        ], 42, Ys))), 256)) : M("", !0)
      ], 34),
      R(ys)
    ]));
  }
}), ia = ["onClick"], da = ["onClick"], ca = /* @__PURE__ */ t("span", { class: "px-1" }, null, -1), ua = /* @__PURE__ */ t("span", { class: "px-1" }, null, -1), ma = {
  name: "VFContextMenu"
}, va = /* @__PURE__ */ Object.assign(ma, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n, n = k(null), o = k([]), r = k(""), c = ie({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    }), m = ee(() => c.items.filter((_) => _.key == null || e.features.includes(_.key)));
    e.emitter.on("vf-context-selected", (_) => {
      o.value = _;
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
          const _ = e.requester.getDownloadUrl(e.data.adapter, o.value[0]);
          e.emitter.emit("vf-download", _);
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
    }, v = (_) => {
      e.emitter.emit("vf-contextmenu-hide"), _.action();
    };
    e.emitter.on("vf-search-query", ({ newQuery: _ }) => {
      r.value = _;
    }), e.emitter.on("vf-contextmenu-show", ({ event: _, area: E, items: S, target: w = null }) => {
      if (c.items = [], r.value)
        if (w)
          c.items.push(i.openDir), e.emitter.emit("vf-context-selected", [w]);
        else
          return;
      else
        !w && !r.value ? (c.items.push(i.refresh), c.items.push(i.newfolder), e.emitter.emit("vf-context-selected", [])) : S.length > 1 && S.some((h) => h.path === w.path) ? (c.items.push(i.refresh), c.items.push(i.archive), c.items.push(i.delete), e.emitter.emit("vf-context-selected", S)) : (w.type == "dir" ? c.items.push(i.open) : (c.items.push(i.preview), c.items.push(i.download)), c.items.push(i.rename), w.mime_type == "application/zip" ? c.items.push(i.unarchive) : c.items.push(i.archive), c.items.push(i.delete), e.emitter.emit("vf-context-selected", [w]));
      g(_, E);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      c.active = !1;
    });
    const g = (_, E) => {
      c.active = !0, ce(() => {
        const S = e.root.getBoundingClientRect(), w = E.getBoundingClientRect();
        let h = _.pageX - S.left, f = _.pageY - S.top, V = n.value.offsetHeight, H = n.value.offsetWidth;
        h = w.right - _.pageX + window.scrollX < H ? h - H : h, f = w.bottom - _.pageY + window.scrollY < V ? f - V : f, c.positions = {
          left: h + "px",
          top: f + "px"
        };
      });
    }, b = (_) => {
      e.emitter.emit("vf-download", _);
    };
    return (_, E) => c.active ? (l(), d("ul", {
      key: 0,
      class: "z-30 absolute text-xs bg-neutral-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-neutral-300 dark:border-gray-600 shadow rounded select-none",
      ref_key: "contextmenu",
      ref: n,
      style: ye(c.positions)
    }, [
      (l(!0), d(U, null, I(m.value, (S) => (l(), d("li", {
        class: "px-2 py-1.5 cursor-pointer hover:bg-neutral-200 dark:hover:bg-gray-700",
        key: S.title,
        onClick: (w) => v(S)
      }, [
        S.link ? (l(), d("div", {
          key: 0,
          onClick: (w) => b(S.link)
        }, [
          ca,
          t("span", null, u(S.title()), 1)
        ], 8, da)) : (l(), d(U, { key: 1 }, [
          ua,
          t("span", null, u(S.title()), 1)
        ], 64))
      ], 8, ia))), 128))
    ], 4)) : M("", !0);
  }
}), pa = { class: "p-1 text-xs border-t border-neutral-300 dark:border-gray-700/50 flex justify-between select-none" }, ha = { class: "flex leading-5 items-center" }, fa = ["aria-label"], ga = /* @__PURE__ */ t("svg", {
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
], -1), _a = [
  ga
], ka = ["value"], ya = { class: "ml-3" }, ba = { key: 0 }, xa = { class: "ml-1" }, wa = { class: "flex leading-5 items-center justify-end" }, $a = ["disabled"], Ca = ["aria-label"], Sa = /* @__PURE__ */ t("svg", {
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
], -1), Ma = [
  Sa
], Ea = {
  name: "VFStatusbar"
}, Da = /* @__PURE__ */ Object.assign(Ea, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n, { setStore: n } = e.storage, o = k(0), r = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.adapter } }), n("adapter", e.adapter);
    };
    e.emitter.on("vf-nodes-selected", (i) => {
      o.value = i.length;
    });
    const c = k("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      c.value = i;
    });
    const m = ee(() => {
      const i = e.selectButton.multiple ? e.selectedItems.length > 0 : e.selectedItems.length === 1;
      return e.selectButton.active && i;
    });
    return (i, v) => (l(), d("div", pa, [
      t("div", ha, [
        t("div", {
          class: "mx-2",
          "aria-label": a(s)("Storage"),
          "data-microtip-position": "top-right",
          role: "tooltip"
        }, _a, 8, fa),
        q(t("select", {
          "onUpdate:modelValue": v[0] || (v[0] = (g) => a(e).adapter = g),
          onChange: r,
          class: "py-0.5 text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded pl-2 pr-8"
        }, [
          (l(!0), d(U, null, I(a(e).data.storages, (g) => (l(), d("option", { value: g }, u(g), 9, ka))), 256))
        ], 544), [
          [pe, a(e).adapter]
        ]),
        t("div", ya, [
          c.value.length ? (l(), d("span", ba, u(a(e).data.files.length) + " items found. ", 1)) : M("", !0),
          t("span", xa, u(o.value > 0 ? a(s)("%s item(s) selected.", o.value) : ""), 1)
        ])
      ]),
      t("div", wa, [
        a(e).selectButton.active ? (l(), d("button", {
          key: 0,
          class: z(["vf-btn py-0 vf-btn-primary", { disabled: !m.value }]),
          disabled: !m.value,
          onClick: v[1] || (v[1] = (g) => a(e).selectButton.click(a(e).selectedItems, g))
        }, u(a(s)("Select")), 11, $a)) : M("", !0),
        t("span", {
          class: "mr-1",
          "aria-label": a(s)("Settings"),
          "data-microtip-position": "top-left",
          role: "tooltip",
          onClick: v[2] || (v[2] = (g) => a(e).emitter.emit("vf-modal-show", { type: "about" }))
        }, Ma, 8, Ca)
      ])
    ]));
  }
}), ja = {
  name: "VueFinder"
}, Aa = /* @__PURE__ */ Object.assign(ja, {
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
    const n = s, r = Je(p, F("VueFinderOptions"));
    je("ServiceContainer", r);
    const { setStore: c } = r.storage, m = k(null);
    r.root = m, r.i18n, r.emitter.on("vf-modal-close", () => {
      r.modal.active = !1;
    }), r.emitter.on("vf-modal-show", (g) => {
      r.modal.active = !0, r.modal.type = g.type, r.modal.data = g;
    });
    const i = (g) => {
      Object.assign(r.data, g), r.emitter.emit("vf-nodes-selected", {}), r.emitter.emit("vf-explorer-update");
    };
    r.emitter.on("vf-nodes-selected", (g) => {
      r.selectedItems = g, n("select", g);
    });
    let v;
    return r.emitter.on("vf-fetch-abort", () => {
      v.abort(), r.loading = !1;
    }), r.emitter.on("vf-fetch", ({ params: g, body: b = null, onSuccess: _ = null, onError: E = null, noCloseModal: S = !1 }) => {
      ["index", "search"].includes(g.q) && (v && v.abort(), r.loading = !0), v = new AbortController();
      const w = v.signal;
      r.requester.send({
        url: "",
        method: g.m || "get",
        params: g,
        body: b,
        abortSignal: w
      }).then((h) => {
        r.adapter = h.adapter, r.persist && (r.path = h.dirname, c("path", r.path)), ["index", "search"].includes(g.q) && (r.loading = !1), S || r.emitter.emit("vf-modal-close"), g.q === "index" && h.sessionKey && (window.vueFinderSessionKey = h.sessionKey), i(h), _ && _(h);
      }).catch((h) => {
        console.error(h), E && E(h);
      });
    }), r.emitter.on("vf-download", (g) => {
      console.log("download");
    }), P(() => {
      let g = {};
      r.path.includes("://") && (g = {
        adapter: r.path.split("://")[0],
        path: r.path
      }), r.emitter.emit("vf-fetch", { params: { q: "index", adapter: r.adapter, ...g } });
    }), e({
      app: r
    }), (g, b) => (l(), d("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: m
    }, [
      t("div", {
        class: z(a(r).theme.actualValue === "dark" ? "dark" : "")
      }, [
        t("div", {
          class: z([a(r).fullscreen ? "fixed w-screen inset-0 z-20" : "relative rounded-md", "border flex flex-col bg-white dark:bg-gray-800 text-gray-700 dark:text-neutral-400 border-neutral-300 dark:border-gray-900 min-w-min select-none"]),
          style: ye(a(r).fullscreen ? "" : "height: 100%; width: 100%;"),
          onMousedown: b[0] || (b[0] = (_) => a(r).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: b[1] || (b[1] = (_) => a(r).emitter.emit("vf-contextmenu-hide"))
        }, [
          R(Nt),
          R(cs),
          R(la),
          R(Da)
        ], 38),
        R(Ae, { name: "fade" }, {
          default: A(() => [
            a(r).modal.active ? (l(), T(Le("v-f-modal-" + a(r).modal.type), { key: 0 })) : M("", !0)
          ]),
          _: 1
        }),
        R(va)
      ], 2)
    ], 512));
  }
}), La = /* @__PURE__ */ t("div", { class: "fixed inset-0 bg-gray-500 dark:bg-gray-600 dark:bg-opacity-75 bg-opacity-75 transition-opacity" }, null, -1), Ta = { class: "fixed z-10 inset-0 overflow-hidden" }, Fa = { class: "relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl w-full" }, Oa = { class: "bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4" }, Na = { class: "bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" }, W = {
  __name: "ModalLayout",
  setup(p) {
    const e = F("ServiceContainer");
    return P(() => {
      const s = document.querySelector(".v-f-modal input");
      s && s.focus();
    }), (s, n) => (l(), d("div", {
      class: "v-f-modal relative z-30",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: n[1] || (n[1] = Z((o) => a(e).emitter.emit("vf-modal-close"), ["esc"])),
      tabindex: "0"
    }, [
      La,
      t("div", Ta, [
        t("div", {
          class: "flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0",
          onMousedown: n[0] || (n[0] = K((o) => a(e).emitter.emit("vf-modal-close"), ["self"]))
        }, [
          t("div", Fa, [
            t("div", Oa, [
              le(s.$slots, "default")
            ]),
            t("div", Na, [
              le(s.$slots, "buttons")
            ])
          ])
        ], 32)
      ])
    ], 32));
  }
}, Va = ["aria-label"], Ba = /* @__PURE__ */ t("svg", {
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
], -1), za = [
  Ba
], Ua = {
  name: "Message"
}, G = /* @__PURE__ */ Object.assign(Ua, {
  props: {
    error: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["hidden"],
  setup(p, { emit: e }) {
    var v;
    const s = e, n = F("ServiceContainer"), { t: o } = n.i18n, r = k(!1), c = k(null), m = k((v = c.value) == null ? void 0 : v.strMessage);
    de(m, () => r.value = !1);
    const i = () => {
      s("hidden"), r.value = !0;
    };
    return (g, b) => (l(), d("div", null, [
      r.value ? M("", !0) : (l(), d("div", {
        key: 0,
        ref_key: "strMessage",
        ref: c,
        class: z(["flex mt-2 p-1 px-2 rounded text-sm break-all dark:opacity-75", p.error ? "bg-red-100 text-red-600 " : "bg-emerald-100 text-emerald-600"])
      }, [
        le(g.$slots, "default"),
        t("div", {
          class: "ml-auto cursor-pointer",
          onClick: i,
          "aria-label": a(o)("Close"),
          "data-microtip-position": "top-left",
          role: "tooltip"
        }, za, 8, Va)
      ], 2))
    ]));
  }
}), Ha = { class: "sm:flex sm:items-start" }, Ra = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), qa = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Ia = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Pa = { class: "mt-2" }, Wa = { class: "text-sm text-gray-500" }, Ga = {
  class: "text-gray-500 text-sm mb-1 overflow-auto vf-scrollbar",
  style: { "max-height": "200px" }
}, Ka = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Ya = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ja = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Xa = [
  Ja
], Za = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Qa = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), eo = [
  Qa
], to = { class: "ml-1.5" }, so = { class: "m-auto font-bold text-red-500 text-sm dark:text-red-200 text-center" }, ao = {
  name: "VFModalDelete"
}, oo = /* @__PURE__ */ Object.assign(ao, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = k(e.modal.data.items), o = k(""), r = () => {
      n.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: n.value.map(({ path: c, type: m }) => ({ path: c, type: m }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("Files deleted.") });
        },
        onError: (c) => {
          o.value = s(c.message);
        }
      });
    };
    return (c, m) => (l(), T(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-danger"
        }, u(a(s)("Yes, Delete!")), 1),
        t("button", {
          type: "button",
          onClick: m[1] || (m[1] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1),
        t("div", so, u(a(s)("This action cannot be undone.")), 1)
      ]),
      default: A(() => [
        t("div", Ha, [
          Ra,
          t("div", qa, [
            t("h3", Ia, u(a(s)("Delete files")), 1),
            t("div", Pa, [
              t("p", Wa, u(a(s)("Are you sure you want to delete these files?")), 1),
              t("div", Ga, [
                (l(!0), d(U, null, I(n.value, (i) => (l(), d("p", Ka, [
                  i.type === "dir" ? (l(), d("svg", Ya, Xa)) : (l(), d("svg", Za, eo)),
                  t("span", to, u(i.basename), 1)
                ]))), 256))
              ]),
              o.value.length ? (l(), T(G, {
                key: 0,
                onHidden: m[0] || (m[0] = (i) => o.value = ""),
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
}), ro = { class: "sm:flex sm:items-start" }, no = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), lo = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, io = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, co = { class: "mt-2" }, uo = { class: "text-sm text-gray-500" }, mo = {
  name: "VFModalMessage"
}, vo = /* @__PURE__ */ Object.assign(mo, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n;
    return (n, o) => (l(), T(W, null, {
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
          t("div", ro, [
            no,
            t("div", lo, [
              t("h3", io, u(((r = a(e).modal.data) == null ? void 0 : r.title) ?? "Title"), 1),
              t("div", co, [
                t("p", uo, u(((c = a(e).modal.data) == null ? void 0 : c.message) ?? "Message"), 1)
              ])
            ])
          ])
        ];
      }),
      _: 1
    }));
  }
}), po = { class: "sm:flex sm:items-start" }, ho = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), fo = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, go = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, _o = { class: "mt-2" }, ko = { class: "text-sm text-gray-500" }, yo = ["placeholder"], bo = {
  name: "VFModalNewFolder"
}, xo = /* @__PURE__ */ Object.assign(bo, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = k(""), o = k(""), r = () => {
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
    return (c, m) => (l(), T(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, u(a(s)("Create")), 1),
        t("button", {
          type: "button",
          onClick: m[2] || (m[2] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", po, [
          ho,
          t("div", fo, [
            t("h3", go, u(a(s)("New Folder")), 1),
            t("div", _o, [
              t("p", ko, u(a(s)("Create a new folder")), 1),
              q(t("input", {
                "onUpdate:modelValue": m[0] || (m[0] = (i) => n.value = i),
                onKeyup: Z(r, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("Folder Name"),
                type: "text"
              }, null, 40, yo), [
                [Q, n.value]
              ]),
              o.value.length ? (l(), T(G, {
                key: 0,
                onHidden: m[1] || (m[1] = (i) => o.value = ""),
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
}), wo = { class: "sm:flex sm:items-start" }, $o = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), Co = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, So = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Mo = { class: "mt-2" }, Eo = { class: "text-sm text-gray-500" }, Do = ["placeholder"], jo = {
  name: "VFModalNewFile"
}, Ao = /* @__PURE__ */ Object.assign(jo, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = k(""), o = k(""), r = () => {
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
    return (c, m) => (l(), T(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, u(a(s)("Create")), 1),
        t("button", {
          type: "button",
          onClick: m[2] || (m[2] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", wo, [
          $o,
          t("div", Co, [
            t("h3", So, u(a(s)("New File")), 1),
            t("div", Mo, [
              t("p", Eo, u(a(s)("Create a new file")), 1),
              q(t("input", {
                "onUpdate:modelValue": m[0] || (m[0] = (i) => n.value = i),
                onKeyup: Z(r, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("File Name"),
                type: "text"
              }, null, 40, Do), [
                [Q, n.value]
              ]),
              o.value.length ? (l(), T(G, {
                key: 0,
                onHidden: m[1] || (m[1] = (i) => o.value = ""),
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
}), Lo = { class: "flex" }, To = ["aria-label"], Fo = { class: "ml-auto mb-2" }, Oo = {
  key: 0,
  class: "p-2 border font-normal whitespace-pre-wrap border-gray-200 dark:border-gray-700/50 dark:text-gray-200 rounded min-h-[200px] max-h-[60vh] text-xs overflow-auto"
}, No = { key: 1 }, Vo = {
  __name: "Text",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, n = k(""), o = k(""), r = k(null), c = k(!1), m = k(""), i = k(!1), v = F("ServiceContainer"), { t: g } = v.i18n;
    P(() => {
      v.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: v.modal.data.adapter, path: v.modal.data.item.path },
        responseType: "text"
      }).then((E) => {
        n.value = E, s("success");
      });
    });
    const b = () => {
      c.value = !c.value, o.value = n.value, c.value == !0 && ce(() => {
        r.value.focus();
      });
    }, _ = () => {
      m.value = "", i.value = !1, v.requester.send({
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
      }).then((E) => {
        m.value = g("Updated."), n.value = E, s("success"), c.value = !c.value;
      }).catch((E) => {
        m.value = g(E.message), i.value = !0;
      });
    };
    return (E, S) => (l(), d(U, null, [
      t("div", Lo, [
        t("div", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(v).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, u(a(v).modal.data.item.basename), 9, To),
        t("div", Fo, [
          c.value ? (l(), d("button", {
            key: 0,
            onClick: _,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, u(a(g)("Save")), 1)) : M("", !0),
          a(v).features.includes(a(B).EDIT) ? (l(), d("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: S[0] || (S[0] = (w) => b())
          }, u(c.value ? a(g)("Cancel") : a(g)("Edit")), 1)) : M("", !0)
        ])
      ]),
      t("div", null, [
        c.value ? (l(), d("div", No, [
          q(t("textarea", {
            ref_key: "editInput",
            ref: r,
            "onUpdate:modelValue": S[1] || (S[1] = (w) => o.value = w),
            class: "w-full p-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:selection:bg-gray-500 min-h-[200px] max-h-[60vh] text-xs",
            name: "text",
            id: "",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [Q, o.value]
          ])
        ])) : (l(), d("pre", Oo, u(n.value), 1)),
        m.value.length ? (l(), T(G, {
          key: 2,
          onHidden: S[2] || (S[2] = (w) => m.value = ""),
          error: i.value
        }, {
          default: A(() => [
            N(u(m.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : M("", !0)
      ])
    ], 64));
  }
}, Bo = { class: "flex" }, zo = ["aria-label"], Uo = { class: "ml-auto mb-2" }, Ho = { class: "w-full flex justify-center" }, Ro = ["src"], qo = {
  __name: "Image",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, n = F("ServiceContainer"), { t: o } = n.i18n, r = k(null), c = k(null), m = k(!1), i = k(""), v = k(!1), g = () => {
      m.value = !m.value, m.value ? c.value = new Be(r.value, {
        crop(_) {
        }
      }) : c.value.destroy();
    }, b = () => {
      c.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (_) => {
          i.value = "", v.value = !1;
          const E = new FormData();
          E.set("file", _), n.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: n.modal.data.adapter,
              path: n.modal.data.item.path
            },
            body: E
          }).then((S) => {
            i.value = o("Updated."), r.value.src = n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item), g(), s("success");
          }).catch((S) => {
            i.value = o(S.message), v.value = !0;
          });
        }
      );
    };
    return P(() => {
      s("success");
    }), (_, E) => (l(), d(U, null, [
      t("div", Bo, [
        t("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(n).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, u(a(n).modal.data.item.basename), 9, zo),
        t("div", Uo, [
          m.value ? (l(), d("button", {
            key: 0,
            onClick: b,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, u(a(o)("Crop")), 1)) : M("", !0),
          a(n).features.includes(a(B).EDIT) ? (l(), d("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: E[0] || (E[0] = (S) => g())
          }, u(m.value ? a(o)("Cancel") : a(o)("Edit")), 1)) : M("", !0)
        ])
      ]),
      t("div", Ho, [
        t("img", {
          ref_key: "image",
          ref: r,
          class: "max-w-[50vh] max-h-[50vh]",
          src: a(n).requester.getPreviewUrl(a(n).modal.data.adapter, a(n).modal.data.item),
          alt: ""
        }, null, 8, Ro)
      ]),
      i.value.length ? (l(), T(G, {
        key: 0,
        onHidden: E[1] || (E[1] = (S) => i.value = ""),
        error: v.value
      }, {
        default: A(() => [
          N(u(i.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : M("", !0)
    ], 64));
  }
}, Io = { class: "flex" }, Po = ["aria-label"], Wo = /* @__PURE__ */ t("div", null, null, -1), Go = {
  __name: "Default",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = F("ServiceContainer"), n = e;
    return P(() => {
      n("success");
    }), (o, r) => (l(), d(U, null, [
      t("div", Io, [
        t("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(s).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, u(a(s).modal.data.item.basename), 9, Po)
      ]),
      Wo
    ], 64));
  }
}, Ko = ["aria-label"], Yo = {
  class: "w-full",
  preload: "",
  controls: ""
}, Jo = ["src"], Xo = {
  __name: "Video",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = F("ServiceContainer"), n = e, o = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return P(() => {
      n("success");
    }), (r, c) => (l(), d("div", null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, u(a(s).modal.data.item.basename), 9, Ko),
      t("div", null, [
        t("video", Yo, [
          t("source", {
            src: o(),
            type: "video/mp4"
          }, null, 8, Jo),
          N(" Your browser does not support the video tag. ")
        ])
      ])
    ]));
  }
}, Zo = ["aria-label"], Qo = {
  class: "w-full",
  controls: ""
}, er = ["src"], tr = {
  __name: "Audio",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, n = F("ServiceContainer"), o = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return P(() => {
      s("success");
    }), (r, c) => (l(), d(U, null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(n).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, u(a(n).modal.data.item.basename), 9, Zo),
      t("div", null, [
        t("audio", Qo, [
          t("source", {
            src: o(),
            type: "audio/mpeg"
          }, null, 8, er),
          N(" Your browser does not support the audio element. ")
        ])
      ])
    ], 64));
  }
}, sr = ["aria-label"], ar = ["data"], or = ["src"], rr = /* @__PURE__ */ t("p", null, [
  /* @__PURE__ */ N(" Your browser does not support PDFs. "),
  /* @__PURE__ */ t("a", { href: "https://example.com/test.pdf" }, "Download the PDF"),
  /* @__PURE__ */ N(" . ")
], -1), nr = [
  rr
], lr = {
  __name: "Pdf",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = F("ServiceContainer"), n = e, o = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return P(() => {
      n("success");
    }), (r, c) => (l(), d(U, null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, u(a(s).modal.data.item.basename), 9, sr),
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
          }, nr, 8, or)
        ], 8, ar)
      ])
    ], 64));
  }
}, ir = { class: "sm:flex sm:items-start" }, dr = { class: "mt-3 text-center sm:mt-0 sm:text-left w-full" }, cr = { key: 0 }, ur = { class: "text-gray-700 dark:text-gray-200 text-sm" }, mr = {
  key: 0,
  class: "flex leading-5"
}, vr = /* @__PURE__ */ t("svg", {
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
], -1), pr = { class: "py-2 flex font-normal break-all dark:text-gray-200 rounded text-xs" }, hr = { class: "font-bold" }, fr = { class: "font-bold pl-2" }, gr = {
  key: 0,
  class: "text-xs text-gray-600 dark:text-gray-400"
}, _r = {
  name: "VFModalPreview"
}, kr = /* @__PURE__ */ Object.assign(_r, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n, n = k(!1), o = (m) => (e.modal.data.item.mime_type ?? "").startsWith(m), r = () => {
      const m = e.requester.getDownloadUrl(e.modal.data.adapter, e.modal.data.item);
      e.emitter.emit("vf-download", m);
    }, c = e.features.includes(B.PREVIEW);
    return c || (n.value = !0), (m, i) => (l(), T(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: i[6] || (i[6] = (v) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Close")), 1),
        a(e).features.includes(a(B).DOWNLOAD) ? (l(), d("div", {
          key: 0,
          class: "vf-btn vf-btn-primary",
          onClick: r
        }, u(a(s)("Download")), 1)) : M("", !0)
      ]),
      default: A(() => [
        t("div", ir, [
          t("div", dr, [
            a(c) ? (l(), d("div", cr, [
              o("text") ? (l(), T(Vo, {
                key: 0,
                onSuccess: i[0] || (i[0] = (v) => n.value = !0)
              })) : o("image") ? (l(), T(qo, {
                key: 1,
                onSuccess: i[1] || (i[1] = (v) => n.value = !0)
              })) : o("video") ? (l(), T(Xo, {
                key: 2,
                onSuccess: i[2] || (i[2] = (v) => n.value = !0)
              })) : o("audio") ? (l(), T(tr, {
                key: 3,
                onSuccess: i[3] || (i[3] = (v) => n.value = !0)
              })) : o("application/pdf") ? (l(), T(lr, {
                key: 4,
                onSuccess: i[4] || (i[4] = (v) => n.value = !0)
              })) : (l(), T(Go, {
                key: 5,
                onSuccess: i[5] || (i[5] = (v) => n.value = !0)
              }))
            ])) : M("", !0),
            t("div", ur, [
              n.value === !1 ? (l(), d("div", mr, [
                vr,
                t("span", null, u(a(s)("Loading")), 1)
              ])) : M("", !0)
            ])
          ])
        ]),
        t("div", pr, [
          t("div", null, [
            t("span", hr, u(a(s)("File Size")) + ": ", 1),
            N(u(a(e).filesize(a(e).modal.data.item.file_size)), 1)
          ]),
          t("div", null, [
            t("span", fr, u(a(s)("Last Modified")) + ": ", 1),
            N(" " + u(a(we)(a(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        a(e).features.includes(a(B).DOWNLOAD) ? (l(), d("div", gr)) : M("", !0)
      ]),
      _: 1
    }));
  }
}), yr = { class: "sm:flex sm:items-start" }, br = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), xr = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, wr = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, $r = { class: "mt-2" }, Cr = { class: "flex text-sm text-gray-800 dark:text-gray-400 py-2" }, Sr = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Mr = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Er = [
  Mr
], Dr = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, jr = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Ar = [
  jr
], Lr = { class: "ml-1.5" }, Tr = {
  name: "VFModalRename"
}, Fr = /* @__PURE__ */ Object.assign(Tr, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = k(e.modal.data.items[0]), o = k(e.modal.data.items[0].basename), r = k(""), c = () => {
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
        onError: (m) => {
          r.value = s(m.message);
        }
      });
    };
    return (m, i) => (l(), T(W, null, {
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
        t("div", yr, [
          br,
          t("div", xr, [
            t("h3", wr, u(a(s)("Rename")), 1),
            t("div", $r, [
              t("p", Cr, [
                n.value.type === "dir" ? (l(), d("svg", Sr, Er)) : (l(), d("svg", Dr, Ar)),
                t("span", Lr, u(n.value.basename), 1)
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
              r.value.length ? (l(), T(G, {
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
}), Or = { class: "sm:flex sm:items-start" }, Nr = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), Vr = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Br = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, zr = { class: "mt-2" }, Ur = {
  key: 0,
  class: "pointer-events-none"
}, Hr = {
  key: 1,
  class: "pointer-events-none"
}, Rr = ["disabled"], qr = ["disabled"], Ir = { class: "text-gray-500 text-sm mb-1 pr-1 max-h-[200px] overflow-y-auto vf-scrollbar" }, Pr = { class: "rounded flex flex-shrink-0 w-6 h-6 border bg-gray-50 text-xs cursor-default dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50" }, Wr = ["textContent"], Gr = { class: "ml-1 w-full h-fit" }, Kr = { class: "text-left hidden md:block" }, Yr = { class: "text-left md:hidden" }, Jr = {
  key: 0,
  class: "ml-auto"
}, Xr = ["title", "disabled", "onClick"], Zr = /* @__PURE__ */ t("svg", {
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
], -1), Qr = [
  Zr
], en = {
  key: 0,
  class: "py-2"
}, tn = ["disabled"], sn = {
  name: "VFModalUpload"
}, an = /* @__PURE__ */ Object.assign(sn, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n, n = s("uppy"), o = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, r = k({ QUEUE_ENTRY_STATUS: o }), c = k(null), m = k(null), i = k(null), v = k(null), g = k(null), b = k(null), _ = k([]), E = k(""), S = k(!1), w = k(!1);
    let h;
    function f(j) {
      return _.value.findIndex((C) => C.id === j);
    }
    function V(j, C = null) {
      C = C ?? (j.webkitRelativePath || j.name), h.addFile({
        name: C,
        type: j.type,
        data: j,
        source: "Local"
      });
    }
    function H(j) {
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
    const Y = (j) => {
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
      if (!S.value) {
        if (!_.value.filter((j) => j.status !== o.DONE).length) {
          E.value = s("Please select file to upload first.");
          return;
        }
        E.value = "", h.retryAll(), h.upload();
      }
    }
    function ae() {
      h.cancelAll({ reason: "user" }), _.value.forEach((j) => {
        j.status !== o.DONE && (j.status = o.CANCELED, j.statusName = s("Canceled"));
      }), S.value = !1;
    }
    function oe(j) {
      S.value || (h.removeFile(j.id, "removed-by-user"), _.value.splice(f(j.id), 1));
    }
    function x(j) {
      if (!S.value) {
        if (h.cancelAll({ reason: "user" }), j) {
          const C = [];
          _.value.forEach((y) => {
            y.status !== o.DONE && C.push(y);
          }), _.value = [], C.forEach((y) => {
            V(y.originalFile, y.name);
          });
          return;
        }
        _.value.splice(0);
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
          maxFileSize: Ke(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: n,
        onBeforeFileAdded(y, L) {
          if (L[y.id] != null) {
            const X = f(y.id);
            _.value[X].status === o.PENDING && (E.value = h.i18n("noDuplicates", { fileName: y.name })), _.value = _.value.filter((ue) => ue.id !== y.id);
          }
          return _.value.push({
            id: y.id,
            name: y.name,
            size: e.filesize(y.size),
            status: o.PENDING,
            statusName: s("Pending upload"),
            percent: null,
            originalFile: y.data
          }), !0;
        }
      }), h.use(Ue, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError(y, L) {
          let O;
          try {
            O = JSON.parse(y).message;
          } catch {
            O = s("Cannot parse server response.");
          }
          return new Error(O);
        }
      }), h.on("restriction-failed", (y, L) => {
        const O = _.value[f(y.id)];
        oe(O), E.value = L.message;
      }), h.on("upload", () => {
        const y = $();
        h.setMeta({ ...y.body });
        const L = h.getPlugin("XHRUpload");
        L.opts.method = y.method, L.opts.endpoint = y.url + "?" + new URLSearchParams(y.params), L.opts.headers = y.headers, S.value = !0, _.value.forEach((O) => {
          O.status !== o.DONE && (O.percent = null, O.status = o.UPLOADING, O.statusName = s("Pending upload"));
        });
      }), h.on("upload-progress", (y, L) => {
        const O = Math.floor(L.bytesUploaded / L.bytesTotal * 100);
        _.value[f(y.id)].percent = `${O}%`;
      }), h.on("upload-success", (y) => {
        const L = _.value[f(y.id)];
        L.status = o.DONE, L.statusName = s("Done");
      }), h.on("upload-error", (y, L) => {
        const O = _.value[f(y.id)];
        O.percent = null, O.status = o.ERROR, L.isNetworkError ? O.statusName = s("Network Error, Unable establish connection to the server or interrupted.") : O.statusName = L ? L.message : s("Unknown Error");
      }), h.on("error", (y) => {
        E.value = y.message, S.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.data.adapter, path: e.data.dirname },
          noCloseModal: !0
        });
      }), h.on("complete", () => {
        S.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.data.adapter, path: e.data.dirname },
          noCloseModal: !0
        });
      }), v.value.addEventListener("click", () => {
        m.value.click();
      }), g.value.addEventListener("click", () => {
        i.value.click();
      }), b.value.addEventListener("dragover", (y) => {
        y.preventDefault(), w.value = !0;
      }), b.value.addEventListener("dragleave", (y) => {
        y.preventDefault(), w.value = !1;
      });
      function j(y, L) {
        L.isFile && L.file((O) => y(L, O)), L.isDirectory && L.createReader().readEntries((O) => {
          O.forEach((X) => {
            j(y, X);
          });
        });
      }
      b.value.addEventListener("drop", (y) => {
        y.preventDefault(), w.value = !1;
        const L = /^[/\\](.+)/;
        [...y.dataTransfer.items].forEach((O) => {
          O.kind === "file" && j((X, ue) => {
            const $e = L.exec(X.fullPath);
            V(ue, $e[1]);
          }, O.webkitGetAsEntry());
        });
      });
      const C = ({ target: y }) => {
        const L = y.files;
        for (const O of L)
          V(O);
        y.value = "";
      };
      m.value.addEventListener("change", C), i.value.addEventListener("change", C);
    }), ke(() => {
      h == null || h.close({ reason: "unmount" });
    }), (j, C) => (l(), T(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          class: z(["vf-btn vf-btn-primary", S.value ? "bg-blue-200 hover:bg-blue-200 dark:bg-gray-700/50 dark:hover:bg-gray-700/50 dark:text-gray-500" : "bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-500"]),
          disabled: S.value,
          onClick: K(se, ["prevent"])
        }, u(a(s)("Upload")), 11, tn),
        S.value ? (l(), d("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: K(ae, ["prevent"])
        }, u(a(s)("Cancel")), 1)) : (l(), d("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: K(D, ["prevent"])
        }, u(a(s)("Close")), 1))
      ]),
      default: A(() => [
        t("div", Or, [
          Nr,
          t("div", Vr, [
            t("h3", Br, u(a(s)("Upload Files")), 1),
            t("div", zr, [
              t("div", {
                ref_key: "dropArea",
                ref: b,
                class: "flex items-center justify-center text-lg mb-4 text-gray-500 border-2 border-gray-300 rounded border-dashed select-none cursor-pointer dark:border-gray-600 h-[120px]",
                onClick: te
              }, [
                w.value ? (l(), d("div", Ur, u(a(s)("Release to drop these files.")), 1)) : (l(), d("div", Hr, u(a(s)("Drag and drop the files/folders to here or click here.")), 1))
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
                  ref: g,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, u(a(s)("Select Folders")), 513),
                t("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: S.value,
                  onClick: C[0] || (C[0] = (y) => x(!1))
                }, u(a(s)("Clear all")), 9, Rr),
                t("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: S.value,
                  onClick: C[1] || (C[1] = (y) => x(!0))
                }, u(a(s)("Clear only successful")), 9, qr)
              ], 512),
              t("div", Ir, [
                (l(!0), d(U, null, I(_.value, (y) => (l(), d("div", {
                  class: "flex hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                  key: y.id
                }, [
                  t("span", Pr, [
                    t("span", {
                      class: z(["text-base m-auto", H(y)]),
                      textContent: u(Y(y))
                    }, null, 10, Wr)
                  ]),
                  t("div", Gr, [
                    t("div", Kr, u(a(he)(y.name, 40)) + " (" + u(y.size) + ")", 1),
                    t("div", Yr, u(a(he)(y.name, 16)) + " (" + u(y.size) + ")", 1),
                    t("div", {
                      class: z(["flex break-all text-left", H(y)])
                    }, [
                      N(u(y.statusName) + " ", 1),
                      y.status === r.value.QUEUE_ENTRY_STATUS.UPLOADING ? (l(), d("b", Jr, u(y.percent), 1)) : M("", !0)
                    ], 2)
                  ]),
                  t("button", {
                    type: "button",
                    class: z(["rounded w-5 h-5 border-1 text-base leading-none font-medium focus:outline-none dark:border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:bg-gray-600 ml-auto sm:text-xs hover:text-red-600", S.value ? "disabled:bg-gray-100 text-white text-opacity-50" : "bg-gray-100"]),
                    title: a(s)("Delete"),
                    disabled: S.value,
                    onClick: (L) => oe(y)
                  }, Qr, 10, Xr)
                ]))), 128)),
                _.value.length ? M("", !0) : (l(), d("div", en, u(a(s)("No files selected!")), 1))
              ]),
              E.value.length ? (l(), T(G, {
                key: 0,
                onHidden: C[2] || (C[2] = (y) => E.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(E.value), 1)
                ]),
                _: 1
              })) : M("", !0)
            ])
          ])
        ]),
        t("input", {
          ref_key: "internalFileInput",
          ref: m,
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
}), on = { class: "sm:flex sm:items-start" }, rn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), nn = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, ln = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, dn = { class: "mt-2" }, cn = {
  class: "text-gray-500 text-sm mb-1 overflow-auto vf-scrollbar",
  style: { "max-height": "200px" }
}, un = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, mn = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, vn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), pn = [
  vn
], hn = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, fn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), gn = [
  fn
], _n = { class: "ml-1.5" }, kn = ["placeholder"], yn = {
  name: "VFModalArchive"
}, bn = /* @__PURE__ */ Object.assign(yn, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = k(""), o = k(""), r = k(e.modal.data.items), c = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: r.value.map(({ path: m, type: i }) => ({ path: m, type: i })),
          name: n.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("The file(s) archived.") });
        },
        onError: (m) => {
          o.value = s(m.message);
        }
      });
    };
    return (m, i) => (l(), T(W, null, {
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
        t("div", on, [
          rn,
          t("div", nn, [
            t("h3", ln, u(a(s)("Archive the files")), 1),
            t("div", dn, [
              t("div", cn, [
                (l(!0), d(U, null, I(r.value, (v) => (l(), d("p", un, [
                  v.type === "dir" ? (l(), d("svg", mn, pn)) : (l(), d("svg", hn, gn)),
                  t("span", _n, u(v.basename), 1)
                ]))), 256))
              ]),
              q(t("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (v) => n.value = v),
                onKeyup: Z(c, ["enter"]),
                class: "my-1 px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, kn), [
                [Q, n.value]
              ]),
              o.value.length ? (l(), T(G, {
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
}), xn = { class: "sm:flex sm:items-start" }, wn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), $n = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Cn = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Sn = { class: "mt-2" }, Mn = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, En = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Dn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), jn = [
  Dn
], An = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ln = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Tn = [
  Ln
], Fn = { class: "ml-1.5" }, On = { class: "my-1 text-sm text-gray-500" }, Nn = {
  name: "VFModalUnarchive"
}, Vn = /* @__PURE__ */ Object.assign(Nn, {
  setup(p) {
    const e = F("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n;
    k("");
    const n = k(e.modal.data.items[0]), o = k(""), r = k([]), c = () => {
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
        onError: (m) => {
          o.value = s(m.message);
        }
      });
    };
    return (m, i) => (l(), T(W, null, {
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
        t("div", xn, [
          wn,
          t("div", $n, [
            t("h3", Cn, u(a(s)("Unarchive")), 1),
            t("div", Sn, [
              (l(!0), d(U, null, I(r.value, (v) => (l(), d("p", Mn, [
                v.type === "dir" ? (l(), d("svg", En, jn)) : (l(), d("svg", An, Tn)),
                t("span", Fn, u(v.basename), 1)
              ]))), 256)),
              t("p", On, u(a(s)("The archive will be unarchived at")) + " (" + u(m.current.dirname) + ")", 1),
              o.value.length ? (l(), T(G, {
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
}), Bn = { class: "sm:flex sm:items-start" }, zn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), Un = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Hn = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Rn = { class: "text-sm text-gray-500 pb-1" }, qn = { class: "max-h-[200px] overflow-y-auto vf-scrollbar text-left" }, In = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Pn = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Wn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Gn = [
  Wn
], Kn = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Yn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Jn = [
  Yn
], Xn = { class: "ml-1.5" }, Zn = { class: "font-bold text-xs text-gray-700 dark:text-gray-500 mt-3 tracking-wider" }, Qn = { class: "flex text-sm text-gray-800 dark:text-gray-400 border dark:border-gray-700 p-1 rounded" }, el = /* @__PURE__ */ t("svg", {
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
], -1), tl = { class: "ml-1.5 overflow-auto" }, sl = { class: "m-1 mr-auto font-bold text-gray-500 text-sm dark:text-gray-200 self-center" }, al = {
  name: "VFModalMove"
}, ol = /* @__PURE__ */ Object.assign(al, {
  setup(p) {
    const e = F("ServiceContainer"), { t: s } = e.i18n;
    e.storage;
    const n = k(e.modal.data.items.from), o = k(""), r = () => {
      n.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: n.value.map(({ path: c, type: m }) => ({ path: c, type: m })),
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
    return (c, m) => (l(), T(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, u(a(s)("Yes, Move!")), 1),
        t("button", {
          type: "button",
          onClick: m[1] || (m[1] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(s)("Cancel")), 1),
        t("div", sl, u(a(s)("%s item(s) selected.", n.value.length)), 1)
      ]),
      default: A(() => [
        t("div", Bn, [
          zn,
          t("div", Un, [
            t("h3", Hn, u(a(s)("Move files")), 1),
            t("p", Rn, u(a(s)("Are you sure you want to move these files?")), 1),
            t("div", qn, [
              (l(!0), d(U, null, I(n.value, (i) => (l(), d("div", In, [
                t("div", null, [
                  i.type === "dir" ? (l(), d("svg", Pn, Gn)) : (l(), d("svg", Kn, Jn))
                ]),
                t("div", Xn, u(i.path), 1)
              ]))), 256))
            ]),
            t("h4", Zn, u(a(s)("Target Directory")), 1),
            t("p", Qn, [
              el,
              t("span", tl, u(a(e).modal.data.items.to.path), 1)
            ]),
            o.value.length ? (l(), T(G, {
              key: 0,
              onHidden: m[0] || (m[0] = (i) => o.value = ""),
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
}), rl = (p, e) => {
  const s = p.__vccOpts || p;
  for (const [n, o] of e)
    s[n] = o;
  return s;
}, nl = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(p, { emit: e, slots: s }) {
    const n = F("ServiceContainer"), o = k(!1), { t: r } = n.i18n;
    let c = null;
    const m = () => {
      clearTimeout(c), o.value = !0, c = setTimeout(() => {
        o.value = !1;
      }, 2e3);
    };
    return P(() => {
      n.emitter.on(p.on, m);
    }), Te(() => {
      clearTimeout(c);
    }), {
      shown: o,
      t: r
    };
  }
}, ll = { key: 1 };
function il(p, e, s, n, o, r) {
  return l(), d("div", {
    class: z(["text-sm text-green-600 dark:text-green-600 transition-opacity duration-500 ease-out", [{ "opacity-0": !n.shown }]])
  }, [
    p.$slots.default ? le(p.$slots, "default", { key: 0 }) : (l(), d("span", ll, u(n.t("Saved.")), 1))
  ], 2);
}
const ve = /* @__PURE__ */ rl(nl, [["render", il]]), dl = { class: "sm:flex sm:items-start" }, cl = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), ul = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, ml = { class: "mt-2" }, vl = { class: "text-lg font-semibold mt-5 text-gray-900 dark:text-gray-400 tracking-wider" }, pl = { class: "mt-3 text-left" }, hl = { class: "space-y-2" }, fl = { class: "flex relative gap-x-3" }, gl = { class: "h-6 items-center" }, _l = { class: "flex-1 block text-sm" }, kl = {
  for: "metric_unit",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400"
}, yl = { class: "flex relative gap-x-3" }, bl = { class: "h-6 items-center" }, xl = {
  for: "theme",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400 text-sm"
}, wl = { class: "flex text-sm" }, $l = ["label"], Cl = ["value"], Sl = {
  key: 0,
  class: "flex relative gap-x-3"
}, Ml = { class: "h-6 items-center" }, El = {
  for: "language",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400 text-sm text-nowrap"
}, Dl = { class: "flex text-sm" }, jl = ["label"], Al = ["value"], Ll = {
  name: "VFModalAbout"
}, Tl = /* @__PURE__ */ Object.assign(Ll, {
  setup(p) {
    const e = F("ServiceContainer"), { getStore: s, setStore: n, clearStore: o } = e.storage, { t: r, changeLocale: c, locale: m } = e.i18n;
    k(""), k("");
    const i = async () => {
      o(), location.reload();
    }, v = (w) => {
      e.theme.set(w), e.emitter.emit("vf-theme-saved");
    }, g = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? xe : be, n("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, { i18n: b } = F("VueFinderOptions"), E = Object.fromEntries(
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
      }).filter(([w]) => Object.keys(b).includes(w))
    ), S = ee(() => ({
      system: r("System"),
      light: r("Light"),
      dark: r("Dark")
    }));
    return (w, h) => (l(), T(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: h[5] || (h[5] = (f) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(a(r)("Close")), 1)
      ]),
      default: A(() => [
        t("div", dl, [
          cl,
          t("div", ul, [
            t("div", ml, [
              t("div", null, [
                t("h3", vl, u(a(r)("Settings")), 1)
              ]),
              t("div", pl, [
                t("fieldset", null, [
                  t("div", hl, [
                    t("div", fl, [
                      t("div", gl, [
                        q(t("input", {
                          id: "metric_unit",
                          name: "metric_unit",
                          type: "checkbox",
                          "onUpdate:modelValue": h[0] || (h[0] = (f) => a(e).metricUnits = f),
                          onClick: g,
                          class: "h-4 w-4 rounded border-gray-300 text-indigo-600 dark:accent-slate-400 focus:ring-indigo-600"
                        }, null, 512), [
                          [Fe, a(e).metricUnits]
                        ])
                      ]),
                      t("div", _l, [
                        t("label", kl, [
                          N(u(a(r)("Use Metric Units")) + " ", 1),
                          R(ve, {
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
                    t("div", yl, [
                      t("div", bl, [
                        t("label", xl, u(a(r)("Theme")), 1)
                      ]),
                      t("div", wl, [
                        q(t("select", {
                          id: "theme",
                          "onUpdate:modelValue": h[1] || (h[1] = (f) => a(e).theme.value = f),
                          onChange: h[2] || (h[2] = (f) => v(f.target.value)),
                          class: "flex-shrink-0 w-full text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded"
                        }, [
                          t("optgroup", {
                            label: a(r)("Theme")
                          }, [
                            (l(!0), d(U, null, I(S.value, (f, V) => (l(), d("option", { value: V }, u(f), 9, Cl))), 256))
                          ], 8, $l)
                        ], 544), [
                          [pe, a(e).theme.value]
                        ]),
                        R(ve, {
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
                    a(e).features.includes(a(B).LANGUAGE) && Object.keys(a(E)).length > 1 ? (l(), d("div", Sl, [
                      t("div", Ml, [
                        t("label", El, u(a(r)("Language")), 1)
                      ]),
                      t("div", Dl, [
                        q(t("select", {
                          id: "language",
                          "onUpdate:modelValue": h[3] || (h[3] = (f) => _e(m) ? m.value = f : null),
                          onChange: h[4] || (h[4] = (f) => a(c)(f.target.value)),
                          class: "flex-shrink-0 w-1/2 sm:w-full text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded"
                        }, [
                          t("optgroup", {
                            label: a(r)("Language")
                          }, [
                            (l(!0), d(U, null, I(a(E), (f, V) => (l(), d("option", { value: V }, u(f), 9, Al))), 256))
                          ], 8, jl)
                        ], 544), [
                          [pe, a(m)]
                        ]),
                        R(ve, {
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
}), Fl = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ModalAbout: Tl,
  ModalArchive: bn,
  ModalDelete: oo,
  ModalMessage: vo,
  ModalMove: ol,
  ModalNewFile: Ao,
  ModalNewFolder: xo,
  ModalPreview: kr,
  ModalRename: Fr,
  ModalUnarchive: Vn,
  ModalUpload: an
}, Symbol.toStringTag, { value: "Module" })), Pl = {
  /** @param {import('vue').App} app
   * @param options
   */
  install(p, e = {}) {
    p.component("VueFinder", Aa);
    for (const n of Object.values(Fl))
      p.component(n.name, n);
    e.i18n = e.i18n ?? {};
    let [s] = Object.keys(e.i18n);
    e.locale = e.locale ?? s ?? "en", p.provide("VueFinderOptions", e);
  }
};
export {
  Pl as default
};
