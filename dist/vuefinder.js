var Ce = Object.defineProperty;
var Se = (p, e, s) => e in p ? Ce(p, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : p[e] = s;
var fe = (p, e, s) => (Se(p, typeof e != "symbol" ? e + "" : e, s), s);
import { reactive as ie, watch as de, ref as k, computed as ee, inject as T, openBlock as l, createElementBlock as u, unref as a, createCommentVNode as S, normalizeClass as z, createElementVNode as t, createTextVNode as N, toDisplayString as v, customRef as Me, withModifiers as W, Fragment as U, renderList as I, withDirectives as q, withKeys as Z, isRef as _e, vModelText as Q, nextTick as ce, createVNode as H, TransitionGroup as Ee, withCtx as A, onMounted as P, onUpdated as De, onBeforeUnmount as ke, vShow as re, normalizeStyle as ye, vModelSelect as pe, provide as je, Transition as Ae, createBlock as F, resolveDynamicComponent as Le, renderSlot as le, onUnmounted as Fe, vModelCheckbox as Te } from "vue";
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
    const o = Object.assign({}, s.headers, n, e.headers), r = Object.assign({}, s.params, e.params), d = e.body, c = s.baseUrl + e.url, i = e.method;
    let m;
    i !== "get" && (d instanceof FormData ? (m = d, s.body != null && Object.entries(this.config.body).forEach(([_, b]) => {
      m.append(_, b);
    })) : (m = { ...d }, s.body != null && Object.assign(m, this.config.body)));
    const f = {
      url: c,
      method: i,
      headers: o,
      params: r,
      body: m
    };
    if (s.transformRequest != null) {
      const _ = s.transformRequest({
        url: c,
        method: i,
        headers: o,
        params: r,
        body: m
      });
      _.url != null && (f.url = _.url), _.method != null && (f.method = _.method), _.params != null && (f.params = _.params ?? {}), _.headers != null && (f.headers = _.headers ?? {}), _.body != null && (f.body = _.body);
    }
    return f;
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
    let n = window.vueFinderSessionKey;
    const o = window.vueFinderSessionKeyDate, r = this.config;
    if (!n || !o || /* @__PURE__ */ new Date() - o > 54e4)
      try {
        const c = r.baseUrl + "/refreshSession.php", i = new XMLHttpRequest();
        if (i.open("GET", c, !1), i.withCredentials = !1, i.setRequestHeader("Authorization", r.headers.Authorization), i.send(), i.status === 200) {
          const m = JSON.parse(i.responseText);
          window.vueFinderSessionKey = m.sessionKey, n = window.vueFinderSessionKey, window.vueFinderSessionKeyDate = /* @__PURE__ */ new Date();
        }
      } catch (c) {
        console.error(c);
      }
    const d = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: s.path, sessionKey: n }
    });
    return d.url + "?" + new URLSearchParams(d.params).toString();
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
      let c;
      s.body instanceof FormData ? c = e.body : (c = JSON.stringify(s.body), o.headers["Content-Type"] = "application/json"), o.body = c;
    }
    const d = await fetch(r, o);
    if (d.ok)
      return await d[n]();
    throw await d.json();
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
  function o(i, m) {
    s[i] = m;
  }
  function r(i) {
    delete s[i];
  }
  function d() {
    Object.keys(s).map((i) => r(i));
  }
  return { getStore: (i, m = null) => s.hasOwnProperty(i) ? s[i] : m, setStore: o, removeStore: r, clearStore: d };
}
async function Ie(p, e) {
  const s = e[p];
  return typeof s == "function" ? (await s()).default : s;
}
function Pe(p, e, s, n) {
  const { getStore: o, setStore: r } = p, d = k({}), c = k(o("locale", e)), i = (_, b = e) => {
    Ie(_, n).then((x) => {
      d.value = x, r("locale", _), c.value = _, r("translations", x), Object.values(n).length > 1 && (s.emit("vf-toast-push", { label: "The language is set to " + _ }), s.emit("vf-language-saved"));
    }).catch((x) => {
      b ? (s.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), i(b, null)) : s.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  !o("locale") && !n.length ? i(e) : d.value = o("translations");
  const m = (_, ...b) => b.length ? m(_ = _.replace("%s", b.shift()), ...b) : _;
  function f(_, ...b) {
    return d.value && d.value.hasOwnProperty(_) ? m(d.value[_], ...b) : m(_, ...b);
  }
  return { t: f, changeLocale: i, locale: c };
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
}, Ke = Object.values(B), Ge = "2.2.11";
function be(p, e, s, n, o) {
  return (e = Math, s = e.log, n = 1024, o = s(p) / s(n) | 0, p / e.pow(n, o)).toFixed(0) + " " + (o ? "KMGTPEZY"[--o] + "iB" : "B");
}
function we(p, e, s, n, o) {
  return (e = Math, s = e.log, n = 1e3, o = s(p) / s(n) | 0, p / e.pow(n, o)).toFixed(0) + " " + (o ? "KMGTPEZY"[--o] + "B" : "B");
}
function We(p) {
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
  const o = window.matchMedia("(prefers-color-scheme: dark)"), r = (d) => {
    s.value === J.DARK || s.value === J.SYSTEM && d.matches ? n.value = J.DARK : n.value = J.LIGHT;
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
    set(d) {
      s.value = d, d !== J.SYSTEM ? p.setStore("theme", d) : p.removeStore("theme"), r(o);
    }
  };
}
const Je = (p, e) => {
  const s = qe(p.id), n = Oe(), o = s.getStore("metricUnits", !1), r = Ye(s, p.theme), d = e.i18n, c = p.locale ?? e.locale, i = ee(() => Pe(s, c, n, d)), m = (_) => Array.isArray(_) ? _ : Ke, f = p.persist ? s.getStore("path", p.path) : p.path;
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
    features: m(p.features),
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
    filesize: o ? we : be,
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
    path: f,
    // persist state
    persist: p.persist,
    // storage
    storage: s,
    // fetched items
    data: { adapter: s.getStore("adapter"), storages: [], dirname: f, files: [] },
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
}, bt = { class: "pl-2" }, wt = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, xt = {
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
}, Lt = ["aria-label"], Ft = {
  key: 0,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
}, Tt = {
  key: 1,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
}, Ot = {
  name: "VFToolbar"
}, Nt = /* @__PURE__ */ Object.assign(Ot, {
  setup(p) {
    const e = T("ServiceContainer"), { setStore: s } = e.storage, { t: n } = e.i18n, o = k([]), r = k("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      r.value = i;
    });
    const d = () => {
      e.fullScreen = !e.fullScreen, s("full-screen", e.fullScreen), e.emitter.emit("vf-fullscreen-toggle");
    };
    e.emitter.on("vf-nodes-selected", (i) => {
      o.value = i;
    });
    const c = () => {
      e.view = e.view === "list" ? "grid" : "list", s("viewport", e.view);
    };
    return (i, m) => (l(), u("div", Xe, [
      r.value.length ? (l(), u("div", yt, [
        t("div", bt, [
          N(v(a(n)("Search results for")) + " ", 1),
          t("span", wt, v(r.value), 1)
        ]),
        a(e).loading ? (l(), u("svg", xt, St)) : S("", !0)
      ])) : (l(), u("div", Ze, [
        a(e).features.includes(a(B).NEW_FOLDER) ? (l(), u("div", {
          key: 0,
          class: "mx-1.5",
          "aria-label": a(n)("New Folder"),
          "data-microtip-position": "bottom-right",
          role: "tooltip",
          onClick: m[0] || (m[0] = (f) => a(e).emitter.emit("vf-modal-show", { type: "new-folder", items: o.value }))
        }, tt, 8, Qe)) : S("", !0),
        a(e).features.includes(a(B).NEW_FILE) ? (l(), u("div", {
          key: 1,
          class: "mx-1.5",
          "aria-label": a(n)("New File"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: m[1] || (m[1] = (f) => a(e).emitter.emit("vf-modal-show", { type: "new-file", items: o.value }))
        }, ot, 8, st)) : S("", !0),
        a(e).features.includes(a(B).RENAME) ? (l(), u("div", {
          key: 2,
          class: "mx-1.5",
          "aria-label": a(n)("Rename"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: m[2] || (m[2] = (f) => o.value.length != 1 || a(e).emitter.emit("vf-modal-show", { type: "rename", items: o.value }))
        }, [
          (l(), u("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length == 1 ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, lt, 2))
        ], 8, rt)) : S("", !0),
        a(e).features.includes(a(B).DELETE) ? (l(), u("div", {
          key: 3,
          class: "mx-1.5",
          "aria-label": a(n)("Delete"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: m[3] || (m[3] = (f) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "delete", items: o.value }))
        }, [
          (l(), u("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, ct, 2))
        ], 8, it)) : S("", !0),
        a(e).features.includes(a(B).UPLOAD) ? (l(), u("div", {
          key: 4,
          class: "mx-1.5",
          "aria-label": a(n)("Upload"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: m[4] || (m[4] = (f) => a(e).emitter.emit("vf-modal-show", { type: "upload", items: o.value }))
        }, vt, 8, ut)) : S("", !0),
        a(e).features.includes(a(B).UNARCHIVE) && o.value.length == 1 && o.value[0].mime_type == "application/zip" ? (l(), u("div", {
          key: 5,
          class: "mx-1.5",
          "aria-label": a(n)("Unarchive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: m[5] || (m[5] = (f) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "unarchive", items: o.value }))
        }, [
          (l(), u("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, ft, 2))
        ], 8, pt)) : S("", !0),
        a(e).features.includes(a(B).ARCHIVE) ? (l(), u("div", {
          key: 6,
          class: "mx-1.5",
          "aria-label": a(n)("Archive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: m[6] || (m[6] = (f) => !o.value.length || a(e).emitter.emit("vf-modal-show", { type: "archive", items: o.value }))
        }, [
          (l(), u("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([o.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, kt, 2))
        ], 8, gt)) : S("", !0)
      ])),
      t("div", Mt, [
        a(e).features.includes(a(B).FULL_SCREEN) ? (l(), u("div", {
          key: 0,
          class: "mx-1.5",
          "aria-label": a(n)("Toggle Full Screen"),
          "data-microtip-position": "bottom-left",
          role: "tooltip",
          onClick: d
        }, [
          (l(), u("svg", Dt, [
            a(e).fullScreen ? (l(), u("path", jt)) : (l(), u("path", At))
          ]))
        ], 8, Et)) : S("", !0),
        t("div", {
          class: "mx-1.5",
          "aria-label": a(n)("Change View"),
          "data-microtip-position": "bottom-left",
          role: "tooltip",
          onClick: m[7] || (m[7] = (f) => r.value.length || c())
        }, [
          (l(), u("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([r.value.length ? "stroke-gray-200  dark:stroke-gray-700" : "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, [
            a(e).view === "grid" ? (l(), u("path", Ft)) : S("", !0),
            a(e).view === "list" ? (l(), u("path", Tt)) : S("", !0)
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
      (d) => {
        n.value = d, r();
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
], Kt = ["aria-label"], Gt = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M6 18L18 6M6 6l12 12"
}, null, -1), Wt = [
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
    const e = k(null), s = k([]), n = k(!1), o = k(null), r = T("ServiceContainer"), { t: d } = r.i18n;
    r.emitter.on("vf-explorer-update", () => {
      let M = [], h = [];
      e.value = r.data.dirname ?? r.adapter + "://", e.value.length == 0 && (s.value = []), e.value.replace(r.adapter + "://", "").split("/").forEach(function(g) {
        M.push(g), M.join("/") != "" && h.push({
          basename: g,
          name: g,
          path: r.adapter + "://" + M.join("/"),
          type: "dir"
        });
      }), h.length > 4 && (h = h.slice(-5), h[0].name = ".."), s.value = h;
    });
    const c = () => {
      n.value = !1, m.value = "";
    };
    r.emitter.on("vf-search-exit", () => {
      c();
    });
    const i = () => {
      r.features.includes(B.SEARCH) && (n.value = !0, ce(() => o.value.focus()));
    }, m = Bt("", 400);
    de(m, (M) => {
      r.emitter.emit("vf-toast-clear"), r.emitter.emit("vf-search-query", { newQuery: M });
    });
    const f = () => s.value.length && !n.value, _ = (M, h = null) => {
      M.preventDefault(), x(M), h ?? (h = s.value.length - 2);
      let g = JSON.parse(M.dataTransfer.getData("items"));
      if (g.find((V) => V.storage !== r.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      r.emitter.emit("vf-modal-show", {
        type: "move",
        items: { from: g, to: s.value[h] ?? { path: r.adapter + "://" } }
      });
    }, b = (M) => {
      M.preventDefault(), f() ? (M.dataTransfer.dropEffect = "copy", M.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-500")) : (M.dataTransfer.dropEffect = "none", M.dataTransfer.effectAllowed = "none");
    }, x = (M) => {
      M.preventDefault(), M.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-500"), f() && M.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-500");
    }, E = () => {
      m.value == "" && c();
    };
    return (M, h) => (l(), u("div", zt, [
      t("span", {
        "aria-label": a(d)("Go up a directory"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (l(), u("svg", {
          onDragover: h[0] || (h[0] = (g) => b(g)),
          onDragleave: h[1] || (h[1] = (g) => x(g)),
          onDrop: h[2] || (h[2] = (g) => _(g)),
          onClick: h[3] || (h[3] = (g) => {
            var V;
            return !f() || a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter, path: ((V = s.value[s.value.length - 2]) == null ? void 0 : V.path) ?? a(r).adapter + "://" } });
          }),
          class: z(["h-6 w-6 p-0.5 rounded", f() ? "text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer" : "text-gray-400 dark:text-neutral-500"]),
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor"
        }, Rt, 34))
      ], 8, Ut),
      a(r).loading ? (l(), u("span", {
        key: 1,
        "aria-label": a(d)("Cancel"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (l(), u("svg", {
          onClick: h[5] || (h[5] = (g) => a(r).emitter.emit("vf-fetch-abort")),
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.5",
          stroke: "currentColor",
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer"
        }, Wt))
      ], 8, Kt)) : (l(), u("span", {
        key: 0,
        "aria-label": a(d)("Refresh"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (l(), u("svg", {
          onClick: h[4] || (h[4] = (g) => {
            a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter, path: a(r).data.dirname } });
          }),
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "-40 -40 580 580",
          fill: "currentColor"
        }, Pt))
      ], 8, qt)),
      n.value ? (l(), u("div", os, [
        rs,
        q(t("input", {
          ref_key: "searchInput",
          ref: o,
          onKeydown: Z(c, ["esc"]),
          onBlur: E,
          "onUpdate:modelValue": h[10] || (h[10] = (g) => _e(m) ? m.value = g : null),
          placeholder: a(d)("Search anything.."),
          class: "w-full pb-0 px-1 border-0 text-base ring-0 outline-0 text-gray-600 focus:ring-transparent focus:border-transparent dark:focus:ring-transparent dark:focus:border-transparent dark:text-gray-300 bg-transparent",
          type: "text"
        }, null, 40, ns), [
          [Q, a(m)]
        ]),
        (l(), u("svg", {
          class: "w-6 h-6 cursor-pointer",
          onClick: c,
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.5",
          stroke: "currentColor"
        }, is))
      ])) : (l(), u("div", {
        key: 2,
        class: "group flex bg-white dark:bg-gray-700 items-center rounded p-1 ml-2 w-full",
        onClick: W(i, ["self"])
      }, [
        (l(), u("svg", {
          onDragover: h[6] || (h[6] = (g) => b(g)),
          onDragleave: h[7] || (h[7] = (g) => x(g)),
          onDrop: h[8] || (h[8] = (g) => _(g, -1)),
          onClick: h[9] || (h[9] = (g) => a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter } })),
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor"
        }, Jt, 32)),
        t("div", Xt, [
          (l(!0), u(U, null, I(s.value, (g, V) => (l(), u("div", { key: V }, [
            Zt,
            t("span", {
              onDragover: (R) => V === s.value.length - 1 || b(R),
              onDragleave: (R) => V === s.value.length - 1 || x(R),
              onDrop: (R) => V === s.value.length - 1 || _(R, V),
              class: "px-1.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded cursor-pointer",
              title: g.basename,
              onClick: (R) => a(r).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(r).data.adapter, path: g.path } })
            }, v(g.name), 41, Qt)
          ]))), 128))
        ]),
        a(r).loading ? (l(), u("svg", es, as)) : S("", !0)
      ]))
    ]));
  }
}), xe = (p, e = null) => new Date(p * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), us = {
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
    return (e, s) => (l(), u("div", null, [
      p.direction === "down" ? (l(), u("svg", us, vs)) : S("", !0),
      p.direction === "up" ? (l(), u("svg", ps, fs)) : S("", !0)
    ]));
  }
}), _s = ["onClick"], ks = {
  name: "VFToast.vue"
}, ys = /* @__PURE__ */ Object.assign(ks, {
  setup(p) {
    const e = T("ServiceContainer"), { getStore: s } = e.storage, n = k(s("full-screen", !1)), o = k([]), r = (i) => i === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", d = (i) => {
      o.value.splice(i, 1);
    }, c = (i) => {
      let m = o.value.findIndex((f) => f.id === i);
      m !== -1 && d(m);
    };
    return e.emitter.on("vf-toast-clear", () => {
      o.value = [];
    }), e.emitter.on("vf-toast-push", (i) => {
      let m = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      i.id = m, o.value.push(i), setTimeout(() => {
        c(m);
      }, 5e3);
    }), (i, m) => (l(), u("div", {
      class: z([n.value.value ? "fixed" : "absolute", "bottom-0 max-w-fit flex flex-col bottom-0 left-1/2 -translate-x-1/2"])
    }, [
      H(Ee, {
        name: "vf-toast-item",
        "leave-active-class": "transition-all duration-1000",
        "leave-to-class": "opacity-0"
      }, {
        default: A(() => [
          (l(!0), u(U, null, I(o.value, (f, _) => (l(), u("div", {
            onClick: (b) => d(_),
            key: f,
            class: z([r(f.type), "inline-block mx-auto my-0.5 py-0.5 px-2 min-w-max bg-gray-50 dark:bg-gray-600 border text-xs sm:text-sm rounded cursor-pointer"])
          }, v(f.label), 11, _s))), 128))
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
const bs = { class: "relative flex-auto flex flex-col overflow-hidden" }, ws = {
  key: 0,
  class: "grid grid-cols-12 border-b border-neutral-300 border-gray-200 dark:border-gray-700 text-xs select-none"
}, xs = { class: "absolute" }, $s = /* @__PURE__ */ t("svg", {
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
}, Fs = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Ts = [
  Fs
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
], Ks = { class: "overflow-ellipsis overflow-hidden whitespace-nowrap" }, Gs = { class: "col-span-2 text-center" }, Ws = { class: "col-span-3 overflow-ellipsis overflow-hidden whitespace-nowrap" }, Ys = ["onDblclick", "onContextmenu", "onDragstart", "onDragover", "onDrop", "data-type", "data-item", "data-index"], Js = { class: "relative" }, Xs = {
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
    const e = T("ServiceContainer"), { t: s } = e.i18n;
    e.storage;
    const n = (w) => w == null ? void 0 : w.substring(0, 3), o = k(null), r = k(null), d = k(0), c = k(null), i = Math.floor(Math.random() * 2 ** 32), m = k("");
    let f;
    e.emitter.on("vf-fullscreen-toggle", () => {
      o.value.style.height = null;
    }), e.emitter.on("vf-search-query", ({ newQuery: w }) => {
      m.value = w, w ? e.emitter.emit("vf-fetch", {
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
    let _ = null;
    const b = () => {
      _ && clearTimeout(_);
    }, x = k(!0), E = (w) => {
      w.touches.length > 1 && (x.value ? (c.value.stop(), e.emitter.emit("vf-toast-push", { label: s("Drag&Drop: off") })) : (c.value.start(), e.emitter.emit("vf-toast-push", { label: s("Drag&Drop: on") }), e.emitter.emit("vf-explorer-update")), x.value = !x.value);
    }, M = (w) => {
      _ = setTimeout(() => {
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
    }, g = ie({ active: !1, column: "", order: "" }), V = (w = !0) => {
      let D = [...e.data.files], $ = g.column, j = g.order == "asc" ? 1 : -1;
      if (!w)
        return D;
      const C = (y, L) => typeof y == "string" && typeof L == "string" ? y.toLowerCase().localeCompare(L.toLowerCase()) : y < L ? -1 : y > L ? 1 : 0;
      return g.active && (D = D.slice().sort((y, L) => C(y[$], L[$]) * j)), D;
    }, R = (w) => {
      g.active && g.column == w ? (g.active = g.order == "asc", g.column = w, g.order = "desc") : (g.active = !0, g.column = w, g.order = "asc");
    }, Y = () => c.value.getSelection().map((w) => JSON.parse(w.dataset.item)), te = (w, D) => {
      if (w.altKey || w.ctrlKey || w.metaKey)
        return w.preventDefault(), !1;
      w.dataTransfer.setDragImage(r.value, 0, 15), w.dataTransfer.effectAllowed = "all", w.dataTransfer.dropEffect = "copy", w.dataTransfer.setData("items", JSON.stringify(Y()));
    }, se = (w, D) => {
      w.preventDefault();
      let $ = JSON.parse(w.dataTransfer.getData("items"));
      if ($.find((j) => j.storage !== e.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.emitter.emit("vf-modal-show", { type: "move", items: { from: $, to: D } });
    }, ae = (w, D) => {
      w.preventDefault(), !D || D.type !== "dir" || c.value.getSelection().find(($) => $ == w.currentTarget) ? (w.dataTransfer.dropEffect = "none", w.dataTransfer.effectAllowed = "none") : w.dataTransfer.dropEffect = "copy";
    }, oe = () => {
      c.value = new Ne({
        area: o.value,
        keyboardDrag: !1,
        selectedClass: "vf-explorer-selected",
        selectorClass: "vf-explorer-selector"
      }), e.emitter.on("vf-explorer-update", () => ce(() => {
        c.value.clearSelection(), c.value.setSettings({
          selectables: document.getElementsByClassName("vf-item-" + i)
        });
      })), c.value.subscribe("predragstart", ({ event: w, isDragging: D }) => {
        if (D)
          d.value = c.value.getSelection().length, c.value.break();
        else {
          const $ = w.target.offsetWidth - w.offsetX, j = w.target.offsetHeight - w.offsetY;
          $ < 15 && j < 15 && (c.value.clearSelection(), c.value.break());
        }
      }), c.value.subscribe("predragmove", ({ isDragging: w }) => {
        w && c.value.break();
      }), c.value.subscribe("callback", ({ items: w, event: D, isDragging: $ }) => {
        e.emitter.emit("vf-nodes-selected", Y()), d.value = c.value.getSelection().length;
      });
    };
    return P(() => {
      f = new Ve(o.value), oe();
    }), De(() => {
      c.value.Area.reset(), c.value.SelectorArea.updatePos(), f.update();
    }), P(() => {
      de(() => e.view, () => e.emitter.emit("vf-explorer-update"));
    }), ke(() => {
      f.destroy();
    }), (w, D) => (l(), u("div", bs, [
      a(e).view == "list" || m.value.length ? (l(), u("div", ws, [
        t("div", {
          onClick: D[0] || (D[0] = ($) => R("basename")),
          class: "col-span-7 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center pl-1"
        }, [
          N(v(a(s)("Name")) + " ", 1),
          q(H(ne, {
            direction: g.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, g.active && g.column == "basename"]
          ])
        ]),
        m.value.length ? S("", !0) : (l(), u("div", {
          key: 0,
          onClick: D[1] || (D[1] = ($) => R("file_size")),
          class: "col-span-2 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center border-l border-r dark:border-gray-700"
        }, [
          N(v(a(s)("Size")) + " ", 1),
          q(H(ne, {
            direction: g.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, g.active && g.column == "file_size"]
          ])
        ])),
        m.value.length ? S("", !0) : (l(), u("div", {
          key: 1,
          onClick: D[2] || (D[2] = ($) => R("last_modified")),
          class: "col-span-3 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center"
        }, [
          N(v(a(s)("Date")) + " ", 1),
          q(H(ne, {
            direction: g.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, g.active && g.column == "last_modified"]
          ])
        ])),
        m.value.length ? (l(), u("div", {
          key: 2,
          onClick: D[3] || (D[3] = ($) => R("path")),
          class: "col-span-5 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center border-l dark:border-gray-700"
        }, [
          N(v(a(s)("Filepath")) + " ", 1),
          q(H(ne, {
            direction: g.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, g.active && g.column == "path"]
          ])
        ])) : S("", !0)
      ])) : S("", !0),
      t("div", xs, [
        t("div", {
          ref_key: "dragImage",
          ref: r,
          class: "absolute -z-50 -top-96"
        }, [
          $s,
          t("div", Cs, v(d.value), 1)
        ], 512)
      ]),
      t("div", {
        onTouchstart: E,
        onContextmenu: D[10] || (D[10] = W(($) => a(e).emitter.emit("vf-contextmenu-show", { event: $, area: o.value, items: Y() }), ["self", "prevent"])),
        class: z([a(e).fullScreen ? "" : "resize-y", "h-full w-full text-xs vf-selector-area vf-scrollbar min-h-[150px] overflow-auto p-1 z-0"]),
        ref_key: "selectorArea",
        ref: o
      }, [
        m.value.length ? (l(!0), u(U, { key: 0 }, I(V(), ($, j) => (l(), u("div", {
          onDblclick: (C) => h($),
          onTouchstart: D[4] || (D[4] = (C) => M(C)),
          onTouchend: D[5] || (D[5] = (C) => b()),
          onContextmenu: W((C) => a(e).emitter.emit("vf-contextmenu-show", { event: C, area: o.value, items: Y(), target: $ }), ["prevent"]),
          class: z(["vf-item-" + a(i), "grid grid-cols-1 border hover:bg-neutral-50 dark:hover:bg-gray-700 border-transparent my-0.5 w-full select-none"]),
          "data-type": $.type,
          "data-item": JSON.stringify($),
          "data-index": j
        }, [
          t("div", Ms, [
            t("div", Es, [
              $.type === "dir" ? (l(), u("svg", Ds, As)) : (l(), u("svg", Ls, Ts)),
              t("span", Os, v($.basename), 1)
            ]),
            t("div", Ns, v($.path), 1)
          ])
        ], 42, Ss))), 256)) : S("", !0),
        a(e).view === "list" && !m.value.length ? (l(!0), u(U, { key: 1 }, I(V(), ($, j) => (l(), u("div", {
          draggable: "true",
          onDblclick: (C) => h($),
          onTouchstart: D[6] || (D[6] = (C) => M(C)),
          onTouchend: D[7] || (D[7] = (C) => b()),
          onContextmenu: W((C) => a(e).emitter.emit("vf-contextmenu-show", { event: C, area: o.value, items: Y(), target: $ }), ["prevent"]),
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
              $.type === "dir" ? (l(), u("svg", Us, Rs)) : (l(), u("svg", qs, Ps)),
              t("span", Ks, v($.basename), 1)
            ]),
            t("div", Gs, v($.file_size ? a(e).filesize($.file_size) : ""), 1),
            t("div", Ws, v(a(xe)($.last_modified)), 1)
          ])
        ], 42, Vs))), 256)) : S("", !0),
        a(e).view === "grid" && !m.value.length ? (l(!0), u(U, { key: 2 }, I(V(!1), ($, j) => (l(), u("div", {
          draggable: "true",
          onDblclick: (C) => h($),
          onTouchstart: D[8] || (D[8] = (C) => M(C)),
          onTouchend: D[9] || (D[9] = (C) => b()),
          onContextmenu: W((C) => a(e).emitter.emit("vf-contextmenu-show", { event: C, area: o.value, items: Y(), target: $ }), ["prevent"]),
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
              $.type === "dir" ? (l(), u("svg", Xs, Qs)) : ($.mime_type ?? "").startsWith("image") ? (l(), u("img", {
                key: 1,
                class: "lazy h-10 md:h-12 m-auto",
                "data-src": a(e).requester.getPreviewUrl(a(e).adapter, $),
                alt: $.basename
              }, null, 8, ea)) : (l(), u("svg", ta, aa)),
              !($.mime_type ?? "").startsWith("image") && $.type != "dir" ? (l(), u("div", oa, v(n($.extension)), 1)) : S("", !0)
            ]),
            t("span", ra, v(a(he)($.basename)), 1)
          ])
        ], 42, Ys))), 256)) : S("", !0)
      ], 34),
      H(ys)
    ]));
  }
}), ia = ["onClick"], da = /* @__PURE__ */ t("span", { class: "px-1" }, null, -1), ca = {
  name: "VFContextMenu"
}, ua = /* @__PURE__ */ Object.assign(ca, {
  setup(p) {
    const e = T("ServiceContainer"), { t: s } = e.i18n, n = k(null), o = k([]), r = k(""), d = ie({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    }), c = ee(() => d.items.filter((_) => _.key == null || e.features.includes(_.key)));
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
    }, m = (_) => {
      e.emitter.emit("vf-contextmenu-hide"), _.action();
    };
    e.emitter.on("vf-search-query", ({ newQuery: _ }) => {
      r.value = _;
    }), e.emitter.on("vf-contextmenu-show", ({ event: _, area: b, items: x, target: E = null }) => {
      if (d.items = [], r.value)
        if (E)
          d.items.push(i.openDir), e.emitter.emit("vf-context-selected", [E]);
        else
          return;
      else
        !E && !r.value ? (d.items.push(i.refresh), d.items.push(i.newfolder), e.emitter.emit("vf-context-selected", [])) : x.length > 1 && x.some((M) => M.path === E.path) ? (d.items.push(i.refresh), d.items.push(i.archive), d.items.push(i.delete), e.emitter.emit("vf-context-selected", x)) : (E.type == "dir" ? d.items.push(i.open) : (d.items.push(i.preview), d.items.push(i.download)), d.items.push(i.rename), E.mime_type == "application/zip" ? d.items.push(i.unarchive) : d.items.push(i.archive), d.items.push(i.delete), e.emitter.emit("vf-context-selected", [E]));
      f(_, b);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      d.active = !1;
    });
    const f = (_, b) => {
      d.active = !0, ce(() => {
        const x = e.root.getBoundingClientRect(), E = b.getBoundingClientRect();
        let M = _.pageX - x.left, h = _.pageY - x.top, g = n.value.offsetHeight, V = n.value.offsetWidth;
        M = E.right - _.pageX + window.scrollX < V ? M - V : M, h = E.bottom - _.pageY + window.scrollY < g ? h - g : h, d.positions = {
          left: M + "px",
          top: h + "px"
        };
      });
    };
    return (_, b) => d.active ? (l(), u("ul", {
      key: 0,
      class: "z-30 absolute text-xs bg-neutral-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-neutral-300 dark:border-gray-600 shadow rounded select-none",
      ref_key: "contextmenu",
      ref: n,
      style: ye(d.positions)
    }, [
      (l(!0), u(U, null, I(c.value, (x) => (l(), u("li", {
        class: "px-2 py-1.5 cursor-pointer hover:bg-neutral-200 dark:hover:bg-gray-700",
        key: x.title,
        onClick: (E) => m(x)
      }, [
        da,
        t("span", null, v(x.title()), 1)
      ], 8, ia))), 128))
    ], 4)) : S("", !0);
  }
}), ma = { class: "p-1 text-xs border-t border-neutral-300 dark:border-gray-700/50 flex justify-between select-none" }, va = { class: "flex leading-5 items-center" }, pa = ["aria-label"], ha = /* @__PURE__ */ t("svg", {
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
], -1), fa = [
  ha
], ga = ["value"], _a = { class: "ml-3" }, ka = { key: 0 }, ya = { class: "ml-1" }, ba = { class: "flex leading-5 items-center justify-end" }, wa = ["disabled"], xa = ["aria-label"], $a = /* @__PURE__ */ t("svg", {
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
], -1), Ca = [
  $a
], Sa = {
  name: "VFStatusbar"
}, Ma = /* @__PURE__ */ Object.assign(Sa, {
  setup(p) {
    const e = T("ServiceContainer"), { t: s } = e.i18n, { setStore: n } = e.storage, o = k(0), r = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.adapter } }), n("adapter", e.adapter);
    };
    e.emitter.on("vf-nodes-selected", (i) => {
      o.value = i.length;
    });
    const d = k("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      d.value = i;
    });
    const c = ee(() => {
      const i = e.selectButton.multiple ? e.selectedItems.length > 0 : e.selectedItems.length === 1;
      return e.selectButton.active && i;
    });
    return (i, m) => (l(), u("div", ma, [
      t("div", va, [
        t("div", {
          class: "mx-2",
          "aria-label": a(s)("Storage"),
          "data-microtip-position": "top-right",
          role: "tooltip"
        }, fa, 8, pa),
        q(t("select", {
          "onUpdate:modelValue": m[0] || (m[0] = (f) => a(e).adapter = f),
          onChange: r,
          class: "py-0.5 text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded pl-2 pr-8"
        }, [
          (l(!0), u(U, null, I(a(e).data.storages, (f) => (l(), u("option", { value: f }, v(f), 9, ga))), 256))
        ], 544), [
          [pe, a(e).adapter]
        ]),
        t("div", _a, [
          d.value.length ? (l(), u("span", ka, v(a(e).data.files.length) + " items found. ", 1)) : S("", !0),
          t("span", ya, v(o.value > 0 ? a(s)("%s item(s) selected.", o.value) : ""), 1)
        ])
      ]),
      t("div", ba, [
        a(e).selectButton.active ? (l(), u("button", {
          key: 0,
          class: z(["vf-btn py-0 vf-btn-primary", { disabled: !c.value }]),
          disabled: !c.value,
          onClick: m[1] || (m[1] = (f) => a(e).selectButton.click(a(e).selectedItems, f))
        }, v(a(s)("Select")), 11, wa)) : S("", !0),
        t("span", {
          class: "mr-1",
          "aria-label": a(s)("Settings"),
          "data-microtip-position": "top-left",
          role: "tooltip",
          onClick: m[2] || (m[2] = (f) => a(e).emitter.emit("vf-modal-show", { type: "about" }))
        }, Ca, 8, xa)
      ])
    ]));
  }
}), Ea = {
  name: "VueFinder"
}, Da = /* @__PURE__ */ Object.assign(Ea, {
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
    const n = s, r = Je(p, T("VueFinderOptions"));
    je("ServiceContainer", r);
    const { setStore: d } = r.storage, c = k(null);
    r.root = c, r.i18n, r.emitter.on("vf-modal-close", () => {
      r.modal.active = !1;
    }), r.emitter.on("vf-modal-show", (f) => {
      r.modal.active = !0, r.modal.type = f.type, r.modal.data = f;
    });
    const i = (f) => {
      Object.assign(r.data, f), r.emitter.emit("vf-nodes-selected", {}), r.emitter.emit("vf-explorer-update");
    };
    r.emitter.on("vf-nodes-selected", (f) => {
      r.selectedItems = f, n("select", f);
    });
    let m;
    return r.emitter.on("vf-fetch-abort", () => {
      m.abort(), r.loading = !1;
    }), r.emitter.on("vf-fetch", ({ params: f, body: _ = null, onSuccess: b = null, onError: x = null, noCloseModal: E = !1 }) => {
      ["index", "search"].includes(f.q) && (m && m.abort(), r.loading = !0), m = new AbortController();
      const M = m.signal;
      r.requester.send({
        url: "",
        method: f.m || "get",
        params: f,
        body: _,
        abortSignal: M
      }).then((h) => {
        r.adapter = h.adapter, r.persist && (r.path = h.dirname, d("path", r.path)), ["index", "search"].includes(f.q) && (r.loading = !1), E || r.emitter.emit("vf-modal-close"), f.q === "index" && h.sessionKey && (window.vueFinderSessionKey = h.sessionKey, window.vueFinderSessionKeyDate = /* @__PURE__ */ new Date()), i(h), b && b(h);
      }).catch((h) => {
        console.error(h), x && x(h);
      });
    }), r.emitter.on("vf-download", (f) => {
      console.log("download");
    }), P(() => {
      let f = {};
      r.path.includes("://") && (f = {
        adapter: r.path.split("://")[0],
        path: r.path
      }), r.emitter.emit("vf-fetch", { params: { q: "index", adapter: r.adapter, ...f } });
    }), e({
      app: r
    }), (f, _) => (l(), u("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: c
    }, [
      t("div", {
        class: z(a(r).theme.actualValue === "dark" ? "dark" : "")
      }, [
        t("div", {
          class: z([a(r).fullscreen ? "fixed w-screen inset-0 z-20" : "relative rounded-md", "border flex flex-col bg-white dark:bg-gray-800 text-gray-700 dark:text-neutral-400 border-neutral-300 dark:border-gray-900 min-w-min select-none"]),
          style: ye(a(r).fullscreen ? "" : "height: 100%; width: 100%;"),
          onMousedown: _[0] || (_[0] = (b) => a(r).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: _[1] || (_[1] = (b) => a(r).emitter.emit("vf-contextmenu-hide"))
        }, [
          H(Nt),
          H(cs),
          H(la),
          H(Ma)
        ], 38),
        H(Ae, { name: "fade" }, {
          default: A(() => [
            a(r).modal.active ? (l(), F(Le("v-f-modal-" + a(r).modal.type), { key: 0 })) : S("", !0)
          ]),
          _: 1
        }),
        H(ua)
      ], 2)
    ], 512));
  }
}), ja = /* @__PURE__ */ t("div", { class: "fixed inset-0 bg-gray-500 dark:bg-gray-600 dark:bg-opacity-75 bg-opacity-75 transition-opacity" }, null, -1), Aa = { class: "fixed z-10 inset-0 overflow-hidden" }, La = { class: "relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl md:max-w-2xl lg:max-w-3xl xl:max-w-5xl w-full" }, Fa = { class: "bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4" }, Ta = { class: "bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" }, K = {
  __name: "ModalLayout",
  setup(p) {
    const e = T("ServiceContainer");
    return P(() => {
      const s = document.querySelector(".v-f-modal input");
      s && s.focus();
    }), (s, n) => (l(), u("div", {
      class: "v-f-modal relative z-30",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: n[1] || (n[1] = Z((o) => a(e).emitter.emit("vf-modal-close"), ["esc"])),
      tabindex: "0"
    }, [
      ja,
      t("div", Aa, [
        t("div", {
          class: "flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0",
          onMousedown: n[0] || (n[0] = W((o) => a(e).emitter.emit("vf-modal-close"), ["self"]))
        }, [
          t("div", La, [
            t("div", Fa, [
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
}, Oa = ["aria-label"], Na = /* @__PURE__ */ t("svg", {
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
], -1), Va = [
  Na
], Ba = {
  name: "Message"
}, G = /* @__PURE__ */ Object.assign(Ba, {
  props: {
    error: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["hidden"],
  setup(p, { emit: e }) {
    var m;
    const s = e, n = T("ServiceContainer"), { t: o } = n.i18n, r = k(!1), d = k(null), c = k((m = d.value) == null ? void 0 : m.strMessage);
    de(c, () => r.value = !1);
    const i = () => {
      s("hidden"), r.value = !0;
    };
    return (f, _) => (l(), u("div", null, [
      r.value ? S("", !0) : (l(), u("div", {
        key: 0,
        ref_key: "strMessage",
        ref: d,
        class: z(["flex mt-2 p-1 px-2 rounded text-sm break-all dark:opacity-75", p.error ? "bg-red-100 text-red-600 " : "bg-emerald-100 text-emerald-600"])
      }, [
        le(f.$slots, "default"),
        t("div", {
          class: "ml-auto cursor-pointer",
          onClick: i,
          "aria-label": a(o)("Close"),
          "data-microtip-position": "top-left",
          role: "tooltip"
        }, Va, 8, Oa)
      ], 2))
    ]));
  }
}), za = { class: "sm:flex sm:items-start" }, Ua = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), Ha = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Ra = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, qa = { class: "mt-2" }, Ia = { class: "text-sm text-gray-500" }, Pa = {
  class: "text-gray-500 text-sm mb-1 overflow-auto vf-scrollbar",
  style: { "max-height": "200px" }
}, Ka = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Ga = {
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
}, null, -1), Ya = [
  Wa
], Ja = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Xa = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Za = [
  Xa
], Qa = { class: "ml-1.5" }, eo = { class: "m-auto font-bold text-red-500 text-sm dark:text-red-200 text-center" }, to = {
  name: "VFModalDelete"
}, so = /* @__PURE__ */ Object.assign(to, {
  setup(p) {
    const e = T("ServiceContainer");
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
          items: n.value.map(({ path: d, type: c }) => ({ path: d, type: c }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("Files deleted.") });
        },
        onError: (d) => {
          o.value = s(d.message);
        }
      });
    };
    return (d, c) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-danger"
        }, v(a(s)("Yes, Delete!")), 1),
        t("button", {
          type: "button",
          onClick: c[1] || (c[1] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1),
        t("div", eo, v(a(s)("This action cannot be undone.")), 1)
      ]),
      default: A(() => [
        t("div", za, [
          Ua,
          t("div", Ha, [
            t("h3", Ra, v(a(s)("Delete files")), 1),
            t("div", qa, [
              t("p", Ia, v(a(s)("Are you sure you want to delete these files?")), 1),
              t("div", Pa, [
                (l(!0), u(U, null, I(n.value, (i) => (l(), u("p", Ka, [
                  i.type === "dir" ? (l(), u("svg", Ga, Ya)) : (l(), u("svg", Ja, Za)),
                  t("span", Qa, v(i.basename), 1)
                ]))), 256))
              ]),
              o.value.length ? (l(), F(G, {
                key: 0,
                onHidden: c[0] || (c[0] = (i) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(v(o.value), 1)
                ]),
                _: 1
              })) : S("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), ao = { class: "sm:flex sm:items-start" }, oo = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), ro = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, no = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, lo = { class: "mt-2" }, io = { class: "text-sm text-gray-500" }, co = {
  name: "VFModalMessage"
}, uo = /* @__PURE__ */ Object.assign(co, {
  setup(p) {
    const e = T("ServiceContainer"), { t: s } = e.i18n;
    return (n, o) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: o[0] || (o[0] = (r) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Close")), 1)
      ]),
      default: A(() => {
        var r, d;
        return [
          t("div", ao, [
            oo,
            t("div", ro, [
              t("h3", no, v(((r = a(e).modal.data) == null ? void 0 : r.title) ?? "Title"), 1),
              t("div", lo, [
                t("p", io, v(((d = a(e).modal.data) == null ? void 0 : d.message) ?? "Message"), 1)
              ])
            ])
          ])
        ];
      }),
      _: 1
    }));
  }
}), mo = { class: "sm:flex sm:items-start" }, vo = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), po = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, ho = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, fo = { class: "mt-2" }, go = { class: "text-sm text-gray-500" }, _o = ["placeholder"], ko = {
  name: "VFModalNewFolder"
}, yo = /* @__PURE__ */ Object.assign(ko, {
  setup(p) {
    const e = T("ServiceContainer");
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
        onError: (d) => {
          o.value = s(d.message);
        }
      });
    };
    return (d, c) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Create")), 1),
        t("button", {
          type: "button",
          onClick: c[2] || (c[2] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", mo, [
          vo,
          t("div", po, [
            t("h3", ho, v(a(s)("New Folder")), 1),
            t("div", fo, [
              t("p", go, v(a(s)("Create a new folder")), 1),
              q(t("input", {
                "onUpdate:modelValue": c[0] || (c[0] = (i) => n.value = i),
                onKeyup: Z(r, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("Folder Name"),
                type: "text"
              }, null, 40, _o), [
                [Q, n.value]
              ]),
              o.value.length ? (l(), F(G, {
                key: 0,
                onHidden: c[1] || (c[1] = (i) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(v(o.value), 1)
                ]),
                _: 1
              })) : S("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), bo = { class: "sm:flex sm:items-start" }, wo = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), xo = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, $o = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Co = { class: "mt-2" }, So = { class: "text-sm text-gray-500" }, Mo = ["placeholder"], Eo = {
  name: "VFModalNewFile"
}, Do = /* @__PURE__ */ Object.assign(Eo, {
  setup(p) {
    const e = T("ServiceContainer");
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
        onError: (d) => {
          o.value = s(d.message);
        }
      });
    };
    return (d, c) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Create")), 1),
        t("button", {
          type: "button",
          onClick: c[2] || (c[2] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", bo, [
          wo,
          t("div", xo, [
            t("h3", $o, v(a(s)("New File")), 1),
            t("div", Co, [
              t("p", So, v(a(s)("Create a new file")), 1),
              q(t("input", {
                "onUpdate:modelValue": c[0] || (c[0] = (i) => n.value = i),
                onKeyup: Z(r, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("File Name"),
                type: "text"
              }, null, 40, Mo), [
                [Q, n.value]
              ]),
              o.value.length ? (l(), F(G, {
                key: 0,
                onHidden: c[1] || (c[1] = (i) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(v(o.value), 1)
                ]),
                _: 1
              })) : S("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), jo = { class: "flex" }, Ao = ["aria-label"], Lo = { class: "ml-auto mb-2" }, Fo = {
  key: 0,
  class: "p-2 border font-normal whitespace-pre-wrap border-gray-200 dark:border-gray-700/50 dark:text-gray-200 rounded min-h-[200px] max-h-[60vh] text-xs overflow-auto"
}, To = { key: 1 }, Oo = {
  __name: "Text",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, n = k(""), o = k(""), r = k(null), d = k(!1), c = k(""), i = k(!1), m = T("ServiceContainer"), { t: f } = m.i18n;
    P(() => {
      m.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: m.modal.data.adapter, path: m.modal.data.item.path },
        responseType: "text"
      }).then((x) => {
        n.value = x, s("success");
      });
    });
    const _ = () => {
      d.value = !d.value, o.value = n.value, d.value == !0 && ce(() => {
        r.value.focus();
      });
    }, b = () => {
      c.value = "", i.value = !1, m.requester.send({
        url: "",
        method: "post",
        params: {
          q: "save",
          adapter: m.modal.data.adapter,
          path: m.modal.data.item.path
        },
        body: {
          content: o.value
        },
        responseType: "text"
      }).then((x) => {
        c.value = f("Updated."), n.value = x, s("success"), d.value = !d.value;
      }).catch((x) => {
        c.value = f(x.message), i.value = !0;
      });
    };
    return (x, E) => (l(), u(U, null, [
      t("div", jo, [
        t("div", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(m).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, v(a(m).modal.data.item.basename), 9, Ao),
        t("div", Lo, [
          d.value ? (l(), u("button", {
            key: 0,
            onClick: b,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, v(a(f)("Save")), 1)) : S("", !0),
          a(m).features.includes(a(B).EDIT) ? (l(), u("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: E[0] || (E[0] = (M) => _())
          }, v(d.value ? a(f)("Cancel") : a(f)("Edit")), 1)) : S("", !0)
        ])
      ]),
      t("div", null, [
        d.value ? (l(), u("div", To, [
          q(t("textarea", {
            ref_key: "editInput",
            ref: r,
            "onUpdate:modelValue": E[1] || (E[1] = (M) => o.value = M),
            class: "w-full p-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:selection:bg-gray-500 min-h-[200px] max-h-[60vh] text-xs",
            name: "text",
            id: "",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [Q, o.value]
          ])
        ])) : (l(), u("pre", Fo, v(n.value), 1)),
        c.value.length ? (l(), F(G, {
          key: 2,
          onHidden: E[2] || (E[2] = (M) => c.value = ""),
          error: i.value
        }, {
          default: A(() => [
            N(v(c.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : S("", !0)
      ])
    ], 64));
  }
}, No = { class: "flex" }, Vo = ["aria-label"], Bo = { class: "ml-auto mb-2" }, zo = { class: "w-full flex justify-center" }, Uo = ["src"], Ho = {
  __name: "Image",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, n = T("ServiceContainer"), { t: o } = n.i18n, r = k(null), d = k(null), c = k(!1), i = k(""), m = k(!1), f = () => {
      c.value = !c.value, c.value ? d.value = new Be(r.value, {
        crop(b) {
        }
      }) : d.value.destroy();
    }, _ = () => {
      d.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (b) => {
          i.value = "", m.value = !1;
          const x = new FormData();
          x.set("file", b), n.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: n.modal.data.adapter,
              path: n.modal.data.item.path
            },
            body: x
          }).then((E) => {
            i.value = o("Updated."), r.value.src = n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item), f(), s("success");
          }).catch((E) => {
            i.value = o(E.message), m.value = !0;
          });
        }
      );
    };
    return P(() => {
      s("success");
    }), (b, x) => (l(), u(U, null, [
      t("div", No, [
        t("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(n).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, v(a(n).modal.data.item.basename), 9, Vo),
        t("div", Bo, [
          c.value ? (l(), u("button", {
            key: 0,
            onClick: _,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, v(a(o)("Crop")), 1)) : S("", !0),
          a(n).features.includes(a(B).EDIT) ? (l(), u("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: x[0] || (x[0] = (E) => f())
          }, v(c.value ? a(o)("Cancel") : a(o)("Edit")), 1)) : S("", !0)
        ])
      ]),
      t("div", zo, [
        t("img", {
          ref_key: "image",
          ref: r,
          class: "max-w-[50vh] max-h-[50vh]",
          src: a(n).requester.getPreviewUrl(a(n).modal.data.adapter, a(n).modal.data.item),
          alt: ""
        }, null, 8, Uo)
      ]),
      i.value.length ? (l(), F(G, {
        key: 0,
        onHidden: x[1] || (x[1] = (E) => i.value = ""),
        error: m.value
      }, {
        default: A(() => [
          N(v(i.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : S("", !0)
    ], 64));
  }
}, Ro = { class: "flex" }, qo = ["aria-label"], Io = /* @__PURE__ */ t("div", null, null, -1), Po = {
  __name: "Default",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = T("ServiceContainer"), n = e;
    return P(() => {
      n("success");
    }), (o, r) => (l(), u(U, null, [
      t("div", Ro, [
        t("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(s).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, v(a(s).modal.data.item.basename), 9, qo)
      ]),
      Io
    ], 64));
  }
}, Ko = ["aria-label"], Go = {
  class: "w-full",
  preload: "",
  controls: ""
}, Wo = ["src"], Yo = {
  __name: "Video",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = T("ServiceContainer"), n = e, o = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return P(() => {
      n("success");
    }), (r, d) => (l(), u("div", null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, v(a(s).modal.data.item.basename), 9, Ko),
      t("div", null, [
        t("video", Go, [
          t("source", {
            src: o(),
            type: "video/mp4"
          }, null, 8, Wo),
          N(" Your browser does not support the video tag. ")
        ])
      ])
    ]));
  }
}, Jo = ["aria-label"], Xo = {
  class: "w-full",
  controls: ""
}, Zo = ["src"], Qo = {
  __name: "Audio",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = e, n = T("ServiceContainer"), o = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return P(() => {
      s("success");
    }), (r, d) => (l(), u(U, null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(n).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, v(a(n).modal.data.item.basename), 9, Jo),
      t("div", null, [
        t("audio", Xo, [
          t("source", {
            src: o(),
            type: "audio/mpeg"
          }, null, 8, Zo),
          N(" Your browser does not support the audio element. ")
        ])
      ])
    ], 64));
  }
}, er = ["aria-label"], tr = ["data"], sr = ["src"], ar = /* @__PURE__ */ t("p", null, [
  /* @__PURE__ */ N(" Your browser does not support PDFs. "),
  /* @__PURE__ */ t("a", { href: "https://example.com/test.pdf" }, "Download the PDF"),
  /* @__PURE__ */ N(" . ")
], -1), or = [
  ar
], rr = {
  __name: "Pdf",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = T("ServiceContainer"), n = e, o = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return P(() => {
      n("success");
    }), (r, d) => (l(), u(U, null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, v(a(s).modal.data.item.basename), 9, er),
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
          }, or, 8, sr)
        ], 8, tr)
      ])
    ], 64));
  }
}, nr = { class: "sm:flex sm:items-start" }, lr = { class: "mt-3 text-center sm:mt-0 sm:text-left w-full" }, ir = { key: 0 }, dr = { class: "text-gray-700 dark:text-gray-200 text-sm" }, cr = {
  key: 0,
  class: "flex leading-5"
}, ur = /* @__PURE__ */ t("svg", {
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
], -1), mr = { class: "py-2 flex font-normal break-all dark:text-gray-200 rounded text-xs" }, vr = { class: "font-bold" }, pr = { class: "font-bold pl-2" }, hr = {
  key: 0,
  class: "text-xs text-gray-600 dark:text-gray-400"
}, fr = {
  name: "VFModalPreview"
}, gr = /* @__PURE__ */ Object.assign(fr, {
  setup(p) {
    const e = T("ServiceContainer"), { t: s } = e.i18n, n = k(!1), o = (c) => (e.modal.data.item.mime_type ?? "").startsWith(c), r = () => {
      const c = e.requester.getDownloadUrl(e.modal.data.adapter, e.modal.data.item);
      e.emitter.emit("vf-download", c), e.emitter.emit("vf-modal-close");
    }, d = e.features.includes(B.PREVIEW);
    return d || (n.value = !0), (c, i) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: i[6] || (i[6] = (m) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Close")), 1),
        a(e).features.includes(a(B).DOWNLOAD) ? (l(), u("div", {
          key: 0,
          class: "vf-btn vf-btn-primary",
          onClick: r
        }, v(a(s)("Download")), 1)) : S("", !0)
      ]),
      default: A(() => [
        t("div", nr, [
          t("div", lr, [
            a(d) ? (l(), u("div", ir, [
              o("text") ? (l(), F(Oo, {
                key: 0,
                onSuccess: i[0] || (i[0] = (m) => n.value = !0)
              })) : o("image") ? (l(), F(Ho, {
                key: 1,
                onSuccess: i[1] || (i[1] = (m) => n.value = !0)
              })) : o("video") ? (l(), F(Yo, {
                key: 2,
                onSuccess: i[2] || (i[2] = (m) => n.value = !0)
              })) : o("audio") ? (l(), F(Qo, {
                key: 3,
                onSuccess: i[3] || (i[3] = (m) => n.value = !0)
              })) : o("application/pdf") ? (l(), F(rr, {
                key: 4,
                onSuccess: i[4] || (i[4] = (m) => n.value = !0)
              })) : (l(), F(Po, {
                key: 5,
                onSuccess: i[5] || (i[5] = (m) => n.value = !0)
              }))
            ])) : S("", !0),
            t("div", dr, [
              n.value === !1 ? (l(), u("div", cr, [
                ur,
                t("span", null, v(a(s)("Loading")), 1)
              ])) : S("", !0)
            ])
          ])
        ]),
        t("div", mr, [
          t("div", null, [
            t("span", vr, v(a(s)("File Size")) + ": ", 1),
            N(v(a(e).filesize(a(e).modal.data.item.file_size)), 1)
          ]),
          t("div", null, [
            t("span", pr, v(a(s)("Last Modified")) + ": ", 1),
            N(" " + v(a(xe)(a(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        a(e).features.includes(a(B).DOWNLOAD) ? (l(), u("div", hr)) : S("", !0)
      ]),
      _: 1
    }));
  }
}), _r = { class: "sm:flex sm:items-start" }, kr = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), yr = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, br = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, wr = { class: "mt-2" }, xr = { class: "flex text-sm text-gray-800 dark:text-gray-400 py-2" }, $r = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Cr = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Sr = [
  Cr
], Mr = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Er = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Dr = [
  Er
], jr = { class: "ml-1.5" }, Ar = {
  name: "VFModalRename"
}, Lr = /* @__PURE__ */ Object.assign(Ar, {
  setup(p) {
    const e = T("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = k(e.modal.data.items[0]), o = k(e.modal.data.items[0].basename), r = k(""), d = () => {
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
        onError: (c) => {
          r.value = s(c.message);
        }
      });
    };
    return (c, i) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: d,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Rename")), 1),
        t("button", {
          type: "button",
          onClick: i[2] || (i[2] = (m) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", _r, [
          kr,
          t("div", yr, [
            t("h3", br, v(a(s)("Rename")), 1),
            t("div", wr, [
              t("p", xr, [
                n.value.type === "dir" ? (l(), u("svg", $r, Sr)) : (l(), u("svg", Mr, Dr)),
                t("span", jr, v(n.value.basename), 1)
              ]),
              q(t("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (m) => o.value = m),
                onKeyup: Z(d, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [Q, o.value]
              ]),
              r.value.length ? (l(), F(G, {
                key: 0,
                onHidden: i[1] || (i[1] = (m) => r.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(v(r.value), 1)
                ]),
                _: 1
              })) : S("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Fr = { class: "sm:flex sm:items-start" }, Tr = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), Or = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Nr = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Vr = { class: "mt-2" }, Br = {
  key: 0,
  class: "pointer-events-none"
}, zr = {
  key: 1,
  class: "pointer-events-none"
}, Ur = ["disabled"], Hr = ["disabled"], Rr = { class: "text-gray-500 text-sm mb-1 pr-1 max-h-[200px] overflow-y-auto vf-scrollbar" }, qr = { class: "rounded flex flex-shrink-0 w-6 h-6 border bg-gray-50 text-xs cursor-default dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50" }, Ir = ["textContent"], Pr = { class: "ml-1 w-full h-fit" }, Kr = { class: "text-left hidden md:block" }, Gr = { class: "text-left md:hidden" }, Wr = {
  key: 0,
  class: "ml-auto"
}, Yr = ["title", "disabled", "onClick"], Jr = /* @__PURE__ */ t("svg", {
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
], -1), Xr = [
  Jr
], Zr = {
  key: 0,
  class: "py-2"
}, Qr = ["disabled"], en = {
  name: "VFModalUpload"
}, tn = /* @__PURE__ */ Object.assign(en, {
  setup(p) {
    const e = T("ServiceContainer"), { t: s } = e.i18n, n = s("uppy"), o = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, r = k({ QUEUE_ENTRY_STATUS: o }), d = k(null), c = k(null), i = k(null), m = k(null), f = k(null), _ = k(null), b = k([]), x = k(""), E = k(!1), M = k(!1);
    let h;
    function g(j) {
      return b.value.findIndex((C) => C.id === j);
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
      m.value.click();
    }
    function se() {
      if (!E.value) {
        if (!b.value.filter((j) => j.status !== o.DONE).length) {
          x.value = s("Please select file to upload first.");
          return;
        }
        x.value = "", h.retryAll(), h.upload();
      }
    }
    function ae() {
      h.cancelAll({ reason: "user" }), b.value.forEach((j) => {
        j.status !== o.DONE && (j.status = o.CANCELED, j.statusName = s("Canceled"));
      }), E.value = !1;
    }
    function oe(j) {
      E.value || (h.removeFile(j.id, "removed-by-user"), b.value.splice(g(j.id), 1));
    }
    function w(j) {
      if (!E.value) {
        if (h.cancelAll({ reason: "user" }), j) {
          const C = [];
          b.value.forEach((y) => {
            y.status !== o.DONE && C.push(y);
          }), b.value = [], C.forEach((y) => {
            V(y.originalFile, y.name);
          });
          return;
        }
        b.value.splice(0);
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
          maxFileSize: We(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: n,
        onBeforeFileAdded(y, L) {
          if (L[y.id] != null) {
            const X = g(y.id);
            b.value[X].status === o.PENDING && (x.value = h.i18n("noDuplicates", { fileName: y.name })), b.value = b.value.filter((ue) => ue.id !== y.id);
          }
          return b.value.push({
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
        const O = b.value[g(y.id)];
        oe(O), x.value = L.message;
      }), h.on("upload", () => {
        const y = $();
        h.setMeta({ ...y.body });
        const L = h.getPlugin("XHRUpload");
        L.opts.method = y.method, L.opts.endpoint = y.url + "?" + new URLSearchParams(y.params), L.opts.headers = y.headers, E.value = !0, b.value.forEach((O) => {
          O.status !== o.DONE && (O.percent = null, O.status = o.UPLOADING, O.statusName = s("Pending upload"));
        });
      }), h.on("upload-progress", (y, L) => {
        const O = Math.floor(L.bytesUploaded / L.bytesTotal * 100);
        b.value[g(y.id)].percent = `${O}%`;
      }), h.on("upload-success", (y) => {
        const L = b.value[g(y.id)];
        L.status = o.DONE, L.statusName = s("Done");
      }), h.on("upload-error", (y, L) => {
        const O = b.value[g(y.id)];
        O.percent = null, O.status = o.ERROR, L.isNetworkError ? O.statusName = s("Network Error, Unable establish connection to the server or interrupted.") : O.statusName = L ? L.message : s("Unknown Error");
      }), h.on("error", (y) => {
        x.value = y.message, E.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.data.adapter, path: e.data.dirname },
          noCloseModal: !0
        });
      }), h.on("complete", () => {
        E.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.data.adapter, path: e.data.dirname },
          noCloseModal: !0
        });
      }), m.value.addEventListener("click", () => {
        c.value.click();
      }), f.value.addEventListener("click", () => {
        i.value.click();
      }), _.value.addEventListener("dragover", (y) => {
        y.preventDefault(), M.value = !0;
      }), _.value.addEventListener("dragleave", (y) => {
        y.preventDefault(), M.value = !1;
      });
      function j(y, L) {
        L.isFile && L.file((O) => y(L, O)), L.isDirectory && L.createReader().readEntries((O) => {
          O.forEach((X) => {
            j(y, X);
          });
        });
      }
      _.value.addEventListener("drop", (y) => {
        y.preventDefault(), M.value = !1;
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
      c.value.addEventListener("change", C), i.value.addEventListener("change", C);
    }), ke(() => {
      h == null || h.close({ reason: "unmount" });
    }), (j, C) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          class: z(["vf-btn vf-btn-primary", E.value ? "bg-blue-200 hover:bg-blue-200 dark:bg-gray-700/50 dark:hover:bg-gray-700/50 dark:text-gray-500" : "bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-500"]),
          disabled: E.value,
          onClick: W(se, ["prevent"])
        }, v(a(s)("Upload")), 11, Qr),
        E.value ? (l(), u("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: W(ae, ["prevent"])
        }, v(a(s)("Cancel")), 1)) : (l(), u("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: W(D, ["prevent"])
        }, v(a(s)("Close")), 1))
      ]),
      default: A(() => [
        t("div", Fr, [
          Tr,
          t("div", Or, [
            t("h3", Nr, v(a(s)("Upload Files")), 1),
            t("div", Vr, [
              t("div", {
                ref_key: "dropArea",
                ref: _,
                class: "flex items-center justify-center text-lg mb-4 text-gray-500 border-2 border-gray-300 rounded border-dashed select-none cursor-pointer dark:border-gray-600 h-[120px]",
                onClick: te
              }, [
                M.value ? (l(), u("div", Br, v(a(s)("Release to drop these files.")), 1)) : (l(), u("div", zr, v(a(s)("Drag and drop the files/folders to here or click here.")), 1))
              ], 512),
              t("div", {
                ref_key: "container",
                ref: d,
                class: "text-gray-500 mb-1"
              }, [
                t("button", {
                  ref_key: "pickFiles",
                  ref: m,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, v(a(s)("Select Files")), 513),
                t("button", {
                  ref_key: "pickFolders",
                  ref: f,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, v(a(s)("Select Folders")), 513),
                t("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: E.value,
                  onClick: C[0] || (C[0] = (y) => w(!1))
                }, v(a(s)("Clear all")), 9, Ur),
                t("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: E.value,
                  onClick: C[1] || (C[1] = (y) => w(!0))
                }, v(a(s)("Clear only successful")), 9, Hr)
              ], 512),
              t("div", Rr, [
                (l(!0), u(U, null, I(b.value, (y) => (l(), u("div", {
                  class: "flex hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                  key: y.id
                }, [
                  t("span", qr, [
                    t("span", {
                      class: z(["text-base m-auto", R(y)]),
                      textContent: v(Y(y))
                    }, null, 10, Ir)
                  ]),
                  t("div", Pr, [
                    t("div", Kr, v(a(he)(y.name, 40)) + " (" + v(y.size) + ")", 1),
                    t("div", Gr, v(a(he)(y.name, 16)) + " (" + v(y.size) + ")", 1),
                    t("div", {
                      class: z(["flex break-all text-left", R(y)])
                    }, [
                      N(v(y.statusName) + " ", 1),
                      y.status === r.value.QUEUE_ENTRY_STATUS.UPLOADING ? (l(), u("b", Wr, v(y.percent), 1)) : S("", !0)
                    ], 2)
                  ]),
                  t("button", {
                    type: "button",
                    class: z(["rounded w-5 h-5 border-1 text-base leading-none font-medium focus:outline-none dark:border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:bg-gray-600 ml-auto sm:text-xs hover:text-red-600", E.value ? "disabled:bg-gray-100 text-white text-opacity-50" : "bg-gray-100"]),
                    title: a(s)("Delete"),
                    disabled: E.value,
                    onClick: (L) => oe(y)
                  }, Xr, 10, Yr)
                ]))), 128)),
                b.value.length ? S("", !0) : (l(), u("div", Zr, v(a(s)("No files selected!")), 1))
              ]),
              x.value.length ? (l(), F(G, {
                key: 0,
                onHidden: C[2] || (C[2] = (y) => x.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(v(x.value), 1)
                ]),
                _: 1
              })) : S("", !0)
            ])
          ])
        ]),
        t("input", {
          ref_key: "internalFileInput",
          ref: c,
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
}), sn = { class: "sm:flex sm:items-start" }, an = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), on = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, rn = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, nn = { class: "mt-2" }, ln = {
  class: "text-gray-500 text-sm mb-1 overflow-auto vf-scrollbar",
  style: { "max-height": "200px" }
}, dn = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, cn = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, un = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), mn = [
  un
], vn = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, pn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), hn = [
  pn
], fn = { class: "ml-1.5" }, gn = ["placeholder"], _n = {
  name: "VFModalArchive"
}, kn = /* @__PURE__ */ Object.assign(_n, {
  setup(p) {
    const e = T("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = k(""), o = k(""), r = k(e.modal.data.items), d = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: r.value.map(({ path: c, type: i }) => ({ path: c, type: i })),
          name: n.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("The file(s) archived.") });
        },
        onError: (c) => {
          o.value = s(c.message);
        }
      });
    };
    return (c, i) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: d,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Archive")), 1),
        t("button", {
          type: "button",
          onClick: i[2] || (i[2] = (m) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", sn, [
          an,
          t("div", on, [
            t("h3", rn, v(a(s)("Archive the files")), 1),
            t("div", nn, [
              t("div", ln, [
                (l(!0), u(U, null, I(r.value, (m) => (l(), u("p", dn, [
                  m.type === "dir" ? (l(), u("svg", cn, mn)) : (l(), u("svg", vn, hn)),
                  t("span", fn, v(m.basename), 1)
                ]))), 256))
              ]),
              q(t("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (m) => n.value = m),
                onKeyup: Z(d, ["enter"]),
                class: "my-1 px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, gn), [
                [Q, n.value]
              ]),
              o.value.length ? (l(), F(G, {
                key: 0,
                onHidden: i[1] || (i[1] = (m) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(v(o.value), 1)
                ]),
                _: 1
              })) : S("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), yn = { class: "sm:flex sm:items-start" }, bn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), wn = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, xn = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, $n = { class: "mt-2" }, Cn = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Sn = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Mn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), En = [
  Mn
], Dn = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, jn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), An = [
  jn
], Ln = { class: "ml-1.5" }, Fn = { class: "my-1 text-sm text-gray-500" }, Tn = {
  name: "VFModalUnarchive"
}, On = /* @__PURE__ */ Object.assign(Tn, {
  setup(p) {
    const e = T("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n;
    k("");
    const n = k(e.modal.data.items[0]), o = k(""), r = k([]), d = () => {
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
        onError: (c) => {
          o.value = s(c.message);
        }
      });
    };
    return (c, i) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: d,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Unarchive")), 1),
        t("button", {
          type: "button",
          onClick: i[1] || (i[1] = (m) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", yn, [
          bn,
          t("div", wn, [
            t("h3", xn, v(a(s)("Unarchive")), 1),
            t("div", $n, [
              (l(!0), u(U, null, I(r.value, (m) => (l(), u("p", Cn, [
                m.type === "dir" ? (l(), u("svg", Sn, En)) : (l(), u("svg", Dn, An)),
                t("span", Ln, v(m.basename), 1)
              ]))), 256)),
              t("p", Fn, v(a(s)("The archive will be unarchived at")) + " (" + v(c.current.dirname) + ")", 1),
              o.value.length ? (l(), F(G, {
                key: 0,
                onHidden: i[0] || (i[0] = (m) => o.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(v(o.value), 1)
                ]),
                _: 1
              })) : S("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}), Nn = { class: "sm:flex sm:items-start" }, Vn = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), Bn = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, zn = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Un = { class: "text-sm text-gray-500 pb-1" }, Hn = { class: "max-h-[200px] overflow-y-auto vf-scrollbar text-left" }, Rn = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, qn = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, In = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Pn = [
  In
], Kn = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Gn = /* @__PURE__ */ t("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Wn = [
  Gn
], Yn = { class: "ml-1.5" }, Jn = { class: "font-bold text-xs text-gray-700 dark:text-gray-500 mt-3 tracking-wider" }, Xn = { class: "flex text-sm text-gray-800 dark:text-gray-400 border dark:border-gray-700 p-1 rounded" }, Zn = /* @__PURE__ */ t("svg", {
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
], -1), Qn = { class: "ml-1.5 overflow-auto" }, el = { class: "m-1 mr-auto font-bold text-gray-500 text-sm dark:text-gray-200 self-center" }, tl = {
  name: "VFModalMove"
}, sl = /* @__PURE__ */ Object.assign(tl, {
  setup(p) {
    const e = T("ServiceContainer"), { t: s } = e.i18n;
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
          items: n.value.map(({ path: d, type: c }) => ({ path: d, type: c })),
          item: e.modal.data.items.to.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("Files moved.", e.modal.data.items.to.name) });
        },
        onError: (d) => {
          o.value = s(d.message);
        }
      });
    };
    return (d, c) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, v(a(s)("Yes, Move!")), 1),
        t("button", {
          type: "button",
          onClick: c[1] || (c[1] = (i) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(s)("Cancel")), 1),
        t("div", el, v(a(s)("%s item(s) selected.", n.value.length)), 1)
      ]),
      default: A(() => [
        t("div", Nn, [
          Vn,
          t("div", Bn, [
            t("h3", zn, v(a(s)("Move files")), 1),
            t("p", Un, v(a(s)("Are you sure you want to move these files?")), 1),
            t("div", Hn, [
              (l(!0), u(U, null, I(n.value, (i) => (l(), u("div", Rn, [
                t("div", null, [
                  i.type === "dir" ? (l(), u("svg", qn, Pn)) : (l(), u("svg", Kn, Wn))
                ]),
                t("div", Yn, v(i.path), 1)
              ]))), 256))
            ]),
            t("h4", Jn, v(a(s)("Target Directory")), 1),
            t("p", Xn, [
              Zn,
              t("span", Qn, v(a(e).modal.data.items.to.path), 1)
            ]),
            o.value.length ? (l(), F(G, {
              key: 0,
              onHidden: c[0] || (c[0] = (i) => o.value = ""),
              error: ""
            }, {
              default: A(() => [
                N(v(o.value), 1)
              ]),
              _: 1
            })) : S("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}), al = (p, e) => {
  const s = p.__vccOpts || p;
  for (const [n, o] of e)
    s[n] = o;
  return s;
}, ol = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(p, { emit: e, slots: s }) {
    const n = T("ServiceContainer"), o = k(!1), { t: r } = n.i18n;
    let d = null;
    const c = () => {
      clearTimeout(d), o.value = !0, d = setTimeout(() => {
        o.value = !1;
      }, 2e3);
    };
    return P(() => {
      n.emitter.on(p.on, c);
    }), Fe(() => {
      clearTimeout(d);
    }), {
      shown: o,
      t: r
    };
  }
}, rl = { key: 1 };
function nl(p, e, s, n, o, r) {
  return l(), u("div", {
    class: z(["text-sm text-green-600 dark:text-green-600 transition-opacity duration-500 ease-out", [{ "opacity-0": !n.shown }]])
  }, [
    p.$slots.default ? le(p.$slots, "default", { key: 0 }) : (l(), u("span", rl, v(n.t("Saved.")), 1))
  ], 2);
}
const ve = /* @__PURE__ */ al(ol, [["render", nl]]), ll = { class: "sm:flex sm:items-start" }, il = /* @__PURE__ */ t("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
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
], -1), dl = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, cl = { class: "mt-2" }, ul = { class: "text-lg font-semibold mt-5 text-gray-900 dark:text-gray-400 tracking-wider" }, ml = { class: "mt-3 text-left" }, vl = { class: "space-y-2" }, pl = { class: "flex relative gap-x-3" }, hl = { class: "h-6 items-center" }, fl = { class: "flex-1 block text-sm" }, gl = {
  for: "metric_unit",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400"
}, _l = { class: "flex relative gap-x-3" }, kl = { class: "h-6 items-center" }, yl = {
  for: "theme",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400 text-sm"
}, bl = { class: "flex text-sm" }, wl = ["label"], xl = ["value"], $l = {
  key: 0,
  class: "flex relative gap-x-3"
}, Cl = { class: "h-6 items-center" }, Sl = {
  for: "language",
  class: "flex w-full font-medium text-gray-900 dark:text-gray-400 text-sm text-nowrap"
}, Ml = { class: "flex text-sm" }, El = ["label"], Dl = ["value"], jl = {
  name: "VFModalAbout"
}, Al = /* @__PURE__ */ Object.assign(jl, {
  setup(p) {
    const e = T("ServiceContainer"), { getStore: s, setStore: n, clearStore: o } = e.storage, { t: r, changeLocale: d, locale: c } = e.i18n;
    k(""), k("");
    const i = async () => {
      o(), location.reload();
    }, m = (M) => {
      e.theme.set(M), e.emitter.emit("vf-theme-saved");
    }, f = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? we : be, n("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, { i18n: _ } = T("VueFinderOptions"), x = Object.fromEntries(
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
      }).filter(([M]) => Object.keys(_).includes(M))
    ), E = ee(() => ({
      system: r("System"),
      light: r("Light"),
      dark: r("Dark")
    }));
    return (M, h) => (l(), F(K, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: h[5] || (h[5] = (g) => a(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, v(a(r)("Close")), 1)
      ]),
      default: A(() => [
        t("div", ll, [
          il,
          t("div", dl, [
            t("div", cl, [
              t("div", null, [
                t("h3", ul, v(a(r)("Settings")), 1)
              ]),
              t("div", ml, [
                t("fieldset", null, [
                  t("div", vl, [
                    t("div", pl, [
                      t("div", hl, [
                        q(t("input", {
                          id: "metric_unit",
                          name: "metric_unit",
                          type: "checkbox",
                          "onUpdate:modelValue": h[0] || (h[0] = (g) => a(e).metricUnits = g),
                          onClick: f,
                          class: "h-4 w-4 rounded border-gray-300 text-indigo-600 dark:accent-slate-400 focus:ring-indigo-600"
                        }, null, 512), [
                          [Te, a(e).metricUnits]
                        ])
                      ]),
                      t("div", fl, [
                        t("label", gl, [
                          N(v(a(r)("Use Metric Units")) + " ", 1),
                          H(ve, {
                            class: "ms-3",
                            on: "vf-metric-units-saved"
                          }, {
                            default: A(() => [
                              N(v(a(r)("Saved.")), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ]),
                    t("div", _l, [
                      t("div", kl, [
                        t("label", yl, v(a(r)("Theme")), 1)
                      ]),
                      t("div", bl, [
                        q(t("select", {
                          id: "theme",
                          "onUpdate:modelValue": h[1] || (h[1] = (g) => a(e).theme.value = g),
                          onChange: h[2] || (h[2] = (g) => m(g.target.value)),
                          class: "flex-shrink-0 w-full text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded"
                        }, [
                          t("optgroup", {
                            label: a(r)("Theme")
                          }, [
                            (l(!0), u(U, null, I(E.value, (g, V) => (l(), u("option", { value: V }, v(g), 9, xl))), 256))
                          ], 8, wl)
                        ], 544), [
                          [pe, a(e).theme.value]
                        ]),
                        H(ve, {
                          class: "ms-3 flex-shrink-0 flex-grow basis-full",
                          on: "vf-theme-saved"
                        }, {
                          default: A(() => [
                            N(v(a(r)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    a(e).features.includes(a(B).LANGUAGE) && Object.keys(a(x)).length > 1 ? (l(), u("div", $l, [
                      t("div", Cl, [
                        t("label", Sl, v(a(r)("Language")), 1)
                      ]),
                      t("div", Ml, [
                        q(t("select", {
                          id: "language",
                          "onUpdate:modelValue": h[3] || (h[3] = (g) => _e(c) ? c.value = g : null),
                          onChange: h[4] || (h[4] = (g) => a(d)(g.target.value)),
                          class: "flex-shrink-0 w-1/2 sm:w-full text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded"
                        }, [
                          t("optgroup", {
                            label: a(r)("Language")
                          }, [
                            (l(!0), u(U, null, I(a(x), (g, V) => (l(), u("option", { value: V }, v(g), 9, Dl))), 256))
                          ], 8, El)
                        ], 544), [
                          [pe, a(c)]
                        ]),
                        H(ve, {
                          class: "ms-3 flex-shrink-0 flex-grow basis-full",
                          on: "vf-language-saved"
                        }, {
                          default: A(() => [
                            N(v(a(r)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])) : S("", !0),
                    t("button", {
                      onClick: i,
                      type: "button",
                      class: "vf-btn vf-btn-secondary"
                    }, v(a(r)("Reset Settings")), 1)
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
}), Ll = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ModalAbout: Al,
  ModalArchive: kn,
  ModalDelete: so,
  ModalMessage: uo,
  ModalMove: sl,
  ModalNewFile: Do,
  ModalNewFolder: yo,
  ModalPreview: gr,
  ModalRename: Lr,
  ModalUnarchive: On,
  ModalUpload: tn
}, Symbol.toStringTag, { value: "Module" })), ql = {
  /** @param {import('vue').App} app
   * @param options
   */
  install(p, e = {}) {
    p.component("VueFinder", Da);
    for (const n of Object.values(Ll))
      p.component(n.name, n);
    e.i18n = e.i18n ?? {};
    let [s] = Object.keys(e.i18n);
    e.locale = e.locale ?? s ?? "en", p.provide("VueFinderOptions", e);
  }
};
export {
  ql as default
};
