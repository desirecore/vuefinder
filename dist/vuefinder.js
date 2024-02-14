var Ce = Object.defineProperty;
var Se = (p, e, s) => e in p ? Ce(p, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : p[e] = s;
var fe = (p, e, s) => (Se(p, typeof e != "symbol" ? e + "" : e, s), s);
import { reactive as ie, watch as de, ref as _, computed as ee, inject as O, openBlock as n, createElementBlock as m, unref as o, createCommentVNode as M, normalizeClass as z, createElementVNode as t, createTextVNode as N, toDisplayString as u, customRef as Me, withModifiers as Y, Fragment as U, renderList as I, withDirectives as q, withKeys as Z, isRef as _e, vModelText as Q, nextTick as ce, createVNode as H, TransitionGroup as Ee, withCtx as A, onMounted as P, onUpdated as De, onBeforeUnmount as ke, vShow as re, normalizeStyle as be, vModelSelect as pe, provide as je, Transition as Ae, createBlock as L, resolveDynamicComponent as Te, renderSlot as le, onUnmounted as Le, vModelCheckbox as Oe } from "vue";
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
    const s = this.config, r = {};
    me != null && me !== "" && (r[s.xsrfHeaderName] = me);
    const a = Object.assign({}, s.headers, r, e.headers), d = Object.assign({}, s.params, e.params), c = e.body, i = s.baseUrl + e.url, l = e.method;
    let v;
    l !== "get" && (c instanceof FormData ? (v = c, s.body != null && Object.entries(this.config.body).forEach(([g, w]) => {
      v.append(g, w);
    })) : (v = { ...c }, s.body != null && Object.assign(v, this.config.body)));
    const b = {
      url: i,
      method: l,
      headers: a,
      params: d,
      body: v
    };
    if (s.transformRequest != null) {
      const g = s.transformRequest({
        url: i,
        method: l,
        headers: a,
        params: d,
        body: v
      });
      g.url != null && (b.url = g.url), g.method != null && (b.method = g.method), g.params != null && (b.params = g.params ?? {}), g.headers != null && (b.headers = g.headers ?? {}), g.body != null && (b.body = g.body);
    }
    return b;
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
    const r = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "download", adapter: e, path: s.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
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
    const r = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: s.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
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
    const s = this.transformRequestParams(e), r = e.responseType || "json", a = {
      method: e.method,
      headers: s.headers,
      signal: e.abortSignal
    }, d = s.url + "?" + new URLSearchParams(s.params);
    if (s.method !== "get" && s.body != null) {
      let i;
      s.body instanceof FormData ? i = e.body : (i = JSON.stringify(s.body), a.headers["Content-Type"] = "application/json"), a.body = i;
    }
    const c = await fetch(d, a);
    if (c.ok)
      return await c[r]();
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
  de(s, r);
  function r() {
    Object.keys(s).length ? localStorage.setItem(p + "_storage", JSON.stringify(s)) : localStorage.removeItem(p + "_storage");
  }
  function a(l, v) {
    s[l] = v;
  }
  function d(l) {
    delete s[l];
  }
  function c() {
    Object.keys(s).map((l) => d(l));
  }
  return { getStore: (l, v = null) => s.hasOwnProperty(l) ? s[l] : v, setStore: a, removeStore: d, clearStore: c };
}
async function Ie(p, e) {
  const s = e[p];
  return typeof s == "function" ? (await s()).default : s;
}
function Pe(p, e, s, r) {
  const { getStore: a, setStore: d } = p, c = _({}), i = _(a("locale", e)), l = (g, w = e) => {
    Ie(g, r).then((y) => {
      c.value = y, d("locale", g), i.value = g, d("translations", y), Object.values(r).length > 1 && (s.emit("vf-toast-push", { label: "The language is set to " + g }), s.emit("vf-language-saved"));
    }).catch((y) => {
      w ? (s.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), l(w, null)) : s.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  !a("locale") && !r.length ? l(e) : c.value = a("translations");
  const v = (g, ...w) => w.length ? v(g = g.replace("%s", w.shift()), ...w) : g;
  function b(g, ...w) {
    return c.value && c.value.hasOwnProperty(g) ? v(c.value[g], ...w) : v(g, ...w);
  }
  return { t: b, changeLocale: l, locale: i };
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
}, We = Object.values(B), Ge = "2.2.2";
function ye(p, e, s, r, a) {
  return (e = Math, s = e.log, r = 1024, a = s(p) / s(r) | 0, p / e.pow(r, a)).toFixed(0) + " " + (a ? "KMGTPEZY"[--a] + "iB" : "B");
}
function xe(p, e, s, r, a) {
  return (e = Math, s = e.log, r = 1e3, a = s(p) / s(r) | 0, p / e.pow(r, a)).toFixed(0) + " " + (a ? "KMGTPEZY"[--a] + "B" : "B");
}
function Ye(p) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, r = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(p);
  return r[1] * Math.pow(1024, e[r[2].toLowerCase()]);
}
const J = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function Ke(p, e) {
  const s = _(J.SYSTEM), r = _(J.LIGHT);
  s.value = p.getStore("theme", e ?? J.SYSTEM);
  const a = window.matchMedia("(prefers-color-scheme: dark)"), d = (c) => {
    s.value === J.DARK || s.value === J.SYSTEM && c.matches ? r.value = J.DARK : r.value = J.LIGHT;
  };
  return d(a), a.addEventListener("change", d), {
    /**
     * @type {import('vue').Ref<Theme>}
     */
    value: s,
    /**
     * @type {import('vue').Ref<Theme>}
     */
    actualValue: r,
    /**
     * @param {Theme} value
     */
    set(c) {
      s.value = c, c !== J.SYSTEM ? p.setStore("theme", c) : p.removeStore("theme"), d(a);
    }
  };
}
const Je = (p, e) => {
  const s = qe(p.id), r = Fe(), a = s.getStore("metricUnits", !1), d = Ke(s, p.theme), c = e.i18n, i = p.locale ?? e.locale, l = ee(() => Pe(s, i, r, c)), v = (g) => Array.isArray(g) ? g : We, b = p.persist ? s.getStore("path", p.path) : p.path;
  return ie({
    // app version
    version: Ge,
    // root element
    root: null,
    // app id
    debug: p.debug,
    // Event Bus
    emitter: r,
    // active features
    features: v(p.features),
    // http object
    requester: Re(p.request),
    // theme state
    theme: d,
    // view state
    view: s.getStore("viewport", "grid"),
    // fullscreen state
    // fullScreen: storage.getStore('full-screen', props.fullScreen),
    fullscreen: !1,
    // selectButton state
    selectButton: p.selectButton,
    // unit state - for example: GB or GiB
    metricUnits: a,
    // human readable file sizes
    filesize: a ? xe : ye,
    // max file size
    maxFileSize: p.maxFileSize,
    // loading state
    loading: !1,
    // default locale
    i18n: l,
    // modal state
    modal: {
      active: !1,
      type: "delete",
      data: {}
    },
    // main storage adapter
    adapter: s.getStore("adapter"),
    // main storage adapter
    path: b,
    // persist state
    persist: p.persist,
    // storage
    storage: s,
    // fetched items
    data: { adapter: s.getStore("adapter"), storages: [], dirname: b, files: [] },
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
    const e = O("ServiceContainer"), { setStore: s } = e.storage, { t: r } = e.i18n, a = _([]), d = _("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      d.value = i;
    }), e.emitter.on("vf-nodes-selected", (i) => {
      a.value = i;
    });
    const c = () => {
      e.view = e.view === "list" ? "grid" : "list", s("viewport", e.view);
    };
    return (i, l) => (n(), m("div", Xe, [
      d.value.length ? (n(), m("div", bt, [
        t("div", yt, [
          N(u(o(r)("Search results for")) + " ", 1),
          t("span", xt, u(d.value), 1)
        ]),
        o(e).loading ? (n(), m("svg", wt, St)) : M("", !0)
      ])) : (n(), m("div", Ze, [
        o(e).features.includes(o(B).NEW_FOLDER) ? (n(), m("div", {
          key: 0,
          class: "mx-1.5",
          "aria-label": o(r)("New Folder"),
          "data-microtip-position": "bottom-right",
          role: "tooltip",
          onClick: l[0] || (l[0] = (v) => o(e).emitter.emit("vf-modal-show", { type: "new-folder", items: a.value }))
        }, tt, 8, Qe)) : M("", !0),
        o(e).features.includes(o(B).NEW_FILE) ? (n(), m("div", {
          key: 1,
          class: "mx-1.5",
          "aria-label": o(r)("New File"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: l[1] || (l[1] = (v) => o(e).emitter.emit("vf-modal-show", { type: "new-file", items: a.value }))
        }, ot, 8, st)) : M("", !0),
        o(e).features.includes(o(B).RENAME) ? (n(), m("div", {
          key: 2,
          class: "mx-1.5",
          "aria-label": o(r)("Rename"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: l[2] || (l[2] = (v) => a.value.length != 1 || o(e).emitter.emit("vf-modal-show", { type: "rename", items: a.value }))
        }, [
          (n(), m("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([a.value.length == 1 ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, lt, 2))
        ], 8, rt)) : M("", !0),
        o(e).features.includes(o(B).DELETE) ? (n(), m("div", {
          key: 3,
          class: "mx-1.5",
          "aria-label": o(r)("Delete"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: l[3] || (l[3] = (v) => !a.value.length || o(e).emitter.emit("vf-modal-show", { type: "delete", items: a.value }))
        }, [
          (n(), m("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([a.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, ct, 2))
        ], 8, it)) : M("", !0),
        o(e).features.includes(o(B).UPLOAD) ? (n(), m("div", {
          key: 4,
          class: "mx-1.5",
          "aria-label": o(r)("Upload"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: l[4] || (l[4] = (v) => o(e).emitter.emit("vf-modal-show", { type: "upload", items: a.value }))
        }, vt, 8, ut)) : M("", !0),
        o(e).features.includes(o(B).UNARCHIVE) && a.value.length == 1 && a.value[0].mime_type == "application/zip" ? (n(), m("div", {
          key: 5,
          class: "mx-1.5",
          "aria-label": o(r)("Unarchive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: l[5] || (l[5] = (v) => !a.value.length || o(e).emitter.emit("vf-modal-show", { type: "unarchive", items: a.value }))
        }, [
          (n(), m("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([a.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, ft, 2))
        ], 8, pt)) : M("", !0),
        o(e).features.includes(o(B).ARCHIVE) ? (n(), m("div", {
          key: 6,
          class: "mx-1.5",
          "aria-label": o(r)("Archive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: l[6] || (l[6] = (v) => !a.value.length || o(e).emitter.emit("vf-modal-show", { type: "archive", items: a.value }))
        }, [
          (n(), m("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([a.value.length ? "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300" : "stroke-gray-200  dark:stroke-gray-700", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
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
          "aria-label": o(r)("Change View"),
          "data-microtip-position": "bottom-left",
          role: "tooltip",
          onClick: l[7] || (l[7] = (v) => d.value.length || c())
        }, [
          (n(), m("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            class: z([d.value.length ? "stroke-gray-200  dark:stroke-gray-700" : "cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300", "h-6 w-6 md:h-8 md:w-8 m-auto"]),
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "none",
            "stroke-width": "1.5"
          }, [
            o(e).view === "grid" ? (n(), m("path", Dt)) : M("", !0),
            o(e).view === "list" ? (n(), m("path", jt)) : M("", !0)
          ], 2))
        ], 8, Et)
      ])
    ]));
  }
}), Lt = (p, e = 0, s = !1) => {
  let r;
  return (...a) => {
    s && !r && p(...a), clearTimeout(r), r = setTimeout(() => {
      p(...a);
    }, e);
  };
}, Ot = (p, e, s) => {
  const r = _(p);
  return Me((a, d) => ({
    get() {
      return a(), r.value;
    },
    set: Lt(
      (c) => {
        r.value = c, d();
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
    const e = _(null), s = _([]), r = _(!1), a = _(null), d = O("ServiceContainer"), { t: c } = d.i18n;
    d.emitter.on("vf-explorer-update", () => {
      let $ = [], f = [];
      e.value = d.data.dirname ?? d.adapter + "://", e.value.length == 0 && (s.value = []), e.value.replace(d.adapter + "://", "").split("/").forEach(function(h) {
        $.push(h), $.join("/") != "" && f.push({
          basename: h,
          name: h,
          path: d.adapter + "://" + $.join("/"),
          type: "dir"
        });
      }), f.length > 4 && (f = f.slice(-5), f[0].name = ".."), s.value = f;
    });
    const i = () => {
      r.value = !1, v.value = "";
    };
    d.emitter.on("vf-search-exit", () => {
      i();
    });
    const l = () => {
      d.features.includes(B.SEARCH) && (r.value = !0, ce(() => a.value.focus()));
    }, v = Ot("", 400);
    de(v, ($) => {
      d.emitter.emit("vf-toast-clear"), d.emitter.emit("vf-search-query", { newQuery: $ });
    });
    const b = () => s.value.length && !r.value, g = ($, f = null) => {
      $.preventDefault(), y($), f ?? (f = s.value.length - 2);
      let h = JSON.parse($.dataTransfer.getData("items"));
      if (h.find((V) => V.storage !== d.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      d.emitter.emit("vf-modal-show", {
        type: "move",
        items: { from: h, to: s.value[f] ?? { path: d.adapter + "://" } }
      });
    }, w = ($) => {
      $.preventDefault(), b() ? ($.dataTransfer.dropEffect = "copy", $.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-500")) : ($.dataTransfer.dropEffect = "none", $.dataTransfer.effectAllowed = "none");
    }, y = ($) => {
      $.preventDefault(), $.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-500"), b() && $.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-500");
    }, E = () => {
      v.value == "" && i();
    };
    return ($, f) => (n(), m("div", Ft, [
      t("span", {
        "aria-label": o(c)("Go up a directory"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (n(), m("svg", {
          onDragover: f[0] || (f[0] = (h) => w(h)),
          onDragleave: f[1] || (f[1] = (h) => y(h)),
          onDrop: f[2] || (f[2] = (h) => g(h)),
          onClick: f[3] || (f[3] = (h) => {
            var V;
            return !b() || o(d).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(d).data.adapter, path: ((V = s.value[s.value.length - 2]) == null ? void 0 : V.path) ?? o(d).adapter + "://" } });
          }),
          class: z(["h-6 w-6 p-0.5 rounded", b() ? "text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer" : "text-gray-400 dark:text-neutral-500"]),
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor"
        }, Bt, 34))
      ], 8, Nt),
      o(d).loading ? (n(), m("span", {
        key: 1,
        "aria-label": o(c)("Cancel"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (n(), m("svg", {
          onClick: f[5] || (f[5] = (h) => o(d).emitter.emit("vf-fetch-abort")),
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.5",
          stroke: "currentColor",
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer"
        }, It))
      ], 8, Rt)) : (n(), m("span", {
        key: 0,
        "aria-label": o(c)("Refresh"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        (n(), m("svg", {
          onClick: f[4] || (f[4] = (h) => {
            o(d).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(d).data.adapter, path: o(d).data.dirname } });
          }),
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "-40 -40 580 580",
          fill: "currentColor"
        }, Ht))
      ], 8, zt)),
      r.value ? (n(), m("div", es, [
        ts,
        q(t("input", {
          ref_key: "searchInput",
          ref: a,
          onKeydown: Z(i, ["esc"]),
          onBlur: E,
          "onUpdate:modelValue": f[10] || (f[10] = (h) => _e(v) ? v.value = h : null),
          placeholder: o(c)("Search anything.."),
          class: "w-full pb-0 px-1 border-0 text-base ring-0 outline-0 text-gray-600 focus:ring-transparent focus:border-transparent dark:focus:ring-transparent dark:focus:border-transparent dark:text-gray-300 bg-transparent",
          type: "text"
        }, null, 40, ss), [
          [Q, o(v)]
        ]),
        (n(), m("svg", {
          class: "w-6 h-6 cursor-pointer",
          onClick: i,
          xmlns: "http://www.w3.org/2000/svg",
          fill: "none",
          viewBox: "0 0 24 24",
          "stroke-width": "1.5",
          stroke: "currentColor"
        }, os))
      ])) : (n(), m("div", {
        key: 2,
        class: "group flex bg-white dark:bg-gray-700 items-center rounded p-1 ml-2 w-full",
        onClick: Y(l, ["self"])
      }, [
        (n(), m("svg", {
          onDragover: f[6] || (f[6] = (h) => w(h)),
          onDragleave: f[7] || (f[7] = (h) => y(h)),
          onDrop: f[8] || (f[8] = (h) => g(h, -1)),
          onClick: f[9] || (f[9] = (h) => o(d).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(d).data.adapter } })),
          class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor"
        }, Wt, 32)),
        t("div", Gt, [
          (n(!0), m(U, null, I(s.value, (h, V) => (n(), m("div", { key: V }, [
            Yt,
            t("span", {
              onDragover: (R) => V === s.value.length - 1 || w(R),
              onDragleave: (R) => V === s.value.length - 1 || y(R),
              onDrop: (R) => V === s.value.length - 1 || g(R, V),
              class: "px-1.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded cursor-pointer",
              title: h.basename,
              onClick: (R) => o(d).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(d).data.adapter, path: h.path } })
            }, u(h.name), 41, Kt)
          ]))), 128))
        ]),
        o(d).loading ? (n(), m("svg", Jt, Qt)) : M("", !0)
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
    return (e, s) => (n(), m("div", null, [
      p.direction === "down" ? (n(), m("svg", ls, ds)) : M("", !0),
      p.direction === "up" ? (n(), m("svg", cs, ms)) : M("", !0)
    ]));
  }
}), ps = ["onClick"], hs = {
  name: "VFToast.vue"
}, fs = /* @__PURE__ */ Object.assign(hs, {
  setup(p) {
    const e = O("ServiceContainer"), { getStore: s } = e.storage, r = _(s("full-screen", !1)), a = _([]), d = (l) => l === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", c = (l) => {
      a.value.splice(l, 1);
    }, i = (l) => {
      let v = a.value.findIndex((b) => b.id === l);
      v !== -1 && c(v);
    };
    return e.emitter.on("vf-toast-clear", () => {
      a.value = [];
    }), e.emitter.on("vf-toast-push", (l) => {
      let v = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      l.id = v, a.value.push(l), setTimeout(() => {
        i(v);
      }, 5e3);
    }), (l, v) => (n(), m("div", {
      class: z([r.value.value ? "fixed" : "absolute", "bottom-0 max-w-fit flex flex-col bottom-0 left-1/2 -translate-x-1/2"])
    }, [
      H(Ee, {
        name: "vf-toast-item",
        "leave-active-class": "transition-all duration-1000",
        "leave-to-class": "opacity-0"
      }, {
        default: A(() => [
          (n(!0), m(U, null, I(a.value, (b, g) => (n(), m("div", {
            onClick: (w) => c(g),
            key: b,
            class: z([d(b.type), "inline-block mx-auto my-0.5 py-0.5 px-2 min-w-max bg-gray-50 dark:bg-gray-600 border text-xs sm:text-sm rounded cursor-pointer"])
          }, u(b.label), 11, ps))), 128))
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
    const r = (x) => x == null ? void 0 : x.substring(0, 3), a = _(null), d = _(null), c = _(0), i = _(null), l = Math.floor(Math.random() * 2 ** 32), v = _("");
    let b;
    e.emitter.on("vf-fullscreen-toggle", () => {
      a.value.style.height = null;
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
    let g = null;
    const w = () => {
      g && clearTimeout(g);
    }, y = _(!0), E = (x) => {
      x.touches.length > 1 && (y.value ? (i.value.stop(), e.emitter.emit("vf-toast-push", { label: s("Drag&Drop: off") })) : (i.value.start(), e.emitter.emit("vf-toast-push", { label: s("Drag&Drop: on") }), e.emitter.emit("vf-explorer-update")), y.value = !y.value);
    }, $ = (x) => {
      g = setTimeout(() => {
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
    }, f = (x) => {
      x.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: x.path } })) : e.emitter.emit("vf-modal-show", { type: "preview", adapter: e.data.adapter, item: x });
    }, h = ie({ active: !1, column: "", order: "" }), V = (x = !0) => {
      let D = [...e.data.files], C = h.column, j = h.order == "asc" ? 1 : -1;
      if (!x)
        return D;
      const S = (k, T) => typeof k == "string" && typeof T == "string" ? k.toLowerCase().localeCompare(T.toLowerCase()) : k < T ? -1 : k > T ? 1 : 0;
      return h.active && (D = D.slice().sort((k, T) => S(k[C], T[C]) * j)), D;
    }, R = (x) => {
      h.active && h.column == x ? (h.active = h.order == "asc", h.column = x, h.order = "desc") : (h.active = !0, h.column = x, h.order = "asc");
    }, K = () => i.value.getSelection().map((x) => JSON.parse(x.dataset.item)), te = (x, D) => {
      if (x.altKey || x.ctrlKey || x.metaKey)
        return x.preventDefault(), !1;
      x.dataTransfer.setDragImage(d.value, 0, 15), x.dataTransfer.effectAllowed = "all", x.dataTransfer.dropEffect = "copy", x.dataTransfer.setData("items", JSON.stringify(K()));
    }, se = (x, D) => {
      x.preventDefault();
      let C = JSON.parse(x.dataTransfer.getData("items"));
      if (C.find((j) => j.storage !== e.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.emitter.emit("vf-modal-show", { type: "move", items: { from: C, to: D } });
    }, ae = (x, D) => {
      x.preventDefault(), !D || D.type !== "dir" || i.value.getSelection().find((C) => C == x.currentTarget) ? (x.dataTransfer.dropEffect = "none", x.dataTransfer.effectAllowed = "none") : x.dataTransfer.dropEffect = "copy";
    }, oe = () => {
      i.value = new Ne({
        area: a.value,
        keyboardDrag: !1,
        selectedClass: "vf-explorer-selected",
        selectorClass: "vf-explorer-selector"
      }), e.emitter.on("vf-explorer-update", () => ce(() => {
        i.value.clearSelection(), i.value.setSettings({
          selectables: document.getElementsByClassName("vf-item-" + l)
        });
      })), i.value.subscribe("predragstart", ({ event: x, isDragging: D }) => {
        if (D)
          c.value = i.value.getSelection().length, i.value.break();
        else {
          const C = x.target.offsetWidth - x.offsetX, j = x.target.offsetHeight - x.offsetY;
          C < 15 && j < 15 && (i.value.clearSelection(), i.value.break());
        }
      }), i.value.subscribe("predragmove", ({ isDragging: x }) => {
        x && i.value.break();
      }), i.value.subscribe("callback", ({ items: x, event: D, isDragging: C }) => {
        e.emitter.emit("vf-nodes-selected", K()), c.value = i.value.getSelection().length;
      });
    };
    return P(() => {
      b = new Ve(a.value), oe();
    }), De(() => {
      i.value.Area.reset(), i.value.SelectorArea.updatePos(), b.update();
    }), P(() => {
      de(() => e.view, () => e.emitter.emit("vf-explorer-update"));
    }), ke(() => {
      b.destroy();
    }), (x, D) => (n(), m("div", gs, [
      o(e).view == "list" || v.value.length ? (n(), m("div", _s, [
        t("div", {
          onClick: D[0] || (D[0] = (C) => R("basename")),
          class: "col-span-7 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center pl-1"
        }, [
          N(u(o(s)("Name")) + " ", 1),
          q(H(ne, {
            direction: h.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, h.active && h.column == "basename"]
          ])
        ]),
        v.value.length ? M("", !0) : (n(), m("div", {
          key: 0,
          onClick: D[1] || (D[1] = (C) => R("file_size")),
          class: "col-span-2 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center border-l border-r dark:border-gray-700"
        }, [
          N(u(o(s)("Size")) + " ", 1),
          q(H(ne, {
            direction: h.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, h.active && h.column == "file_size"]
          ])
        ])),
        v.value.length ? M("", !0) : (n(), m("div", {
          key: 1,
          onClick: D[2] || (D[2] = (C) => R("last_modified")),
          class: "col-span-3 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center"
        }, [
          N(u(o(s)("Date")) + " ", 1),
          q(H(ne, {
            direction: h.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, h.active && h.column == "last_modified"]
          ])
        ])),
        v.value.length ? (n(), m("div", {
          key: 2,
          onClick: D[3] || (D[3] = (C) => R("path")),
          class: "col-span-5 py-1 leading-6 hover:bg-neutral-100 bg-neutral-50 dark:bg-gray-800 dark:hover:bg-gray-700/10 flex items-center justify-center border-l dark:border-gray-700"
        }, [
          N(u(o(s)("Filepath")) + " ", 1),
          q(H(ne, {
            direction: h.order == "asc" ? "down" : "up"
          }, null, 8, ["direction"]), [
            [re, h.active && h.column == "path"]
          ])
        ])) : M("", !0)
      ])) : M("", !0),
      t("div", ks, [
        t("div", {
          ref_key: "dragImage",
          ref: d,
          class: "absolute -z-50 -top-96"
        }, [
          bs,
          t("div", ys, u(c.value), 1)
        ], 512)
      ]),
      t("div", {
        onTouchstart: E,
        onContextmenu: D[10] || (D[10] = Y((C) => o(e).emitter.emit("vf-contextmenu-show", { event: C, area: a.value, items: K() }), ["self", "prevent"])),
        class: z([o(e).fullScreen ? "" : "resize-y", "h-full w-full text-xs vf-selector-area vf-scrollbar min-h-[150px] overflow-auto p-1 z-0"]),
        ref_key: "selectorArea",
        ref: a
      }, [
        v.value.length ? (n(!0), m(U, { key: 0 }, I(V(), (C, j) => (n(), m("div", {
          onDblclick: (S) => f(C),
          onTouchstart: D[4] || (D[4] = (S) => $(S)),
          onTouchend: D[5] || (D[5] = (S) => w()),
          onContextmenu: Y((S) => o(e).emitter.emit("vf-contextmenu-show", { event: S, area: a.value, items: K(), target: C }), ["prevent"]),
          class: z(["vf-item-" + o(l), "grid grid-cols-1 border hover:bg-neutral-50 dark:hover:bg-gray-700 border-transparent my-0.5 w-full select-none"]),
          "data-type": C.type,
          "data-item": JSON.stringify(C),
          "data-index": j
        }, [
          t("div", ws, [
            t("div", $s, [
              C.type === "dir" ? (n(), m("svg", Cs, Ms)) : (n(), m("svg", Es, js)),
              t("span", As, u(C.basename), 1)
            ]),
            t("div", Ts, u(C.path), 1)
          ])
        ], 42, xs))), 256)) : M("", !0),
        o(e).view === "list" && !v.value.length ? (n(!0), m(U, { key: 1 }, I(V(), (C, j) => (n(), m("div", {
          draggable: "true",
          onDblclick: (S) => f(C),
          onTouchstart: D[6] || (D[6] = (S) => $(S)),
          onTouchend: D[7] || (D[7] = (S) => w()),
          onContextmenu: Y((S) => o(e).emitter.emit("vf-contextmenu-show", { event: S, area: a.value, items: K(), target: C }), ["prevent"]),
          onDragstart: (S) => te(S),
          onDragover: (S) => ae(S, C),
          onDrop: (S) => se(S, C),
          class: z(["vf-item-" + o(l), "grid grid-cols-1 border hover:bg-neutral-50 dark:hover:bg-gray-700 border-transparent my-0.5 w-full select-none"]),
          "data-type": C.type,
          "data-item": JSON.stringify(C),
          "data-index": j
        }, [
          t("div", Os, [
            t("div", Fs, [
              C.type === "dir" ? (n(), m("svg", Ns, Bs)) : (n(), m("svg", zs, Hs)),
              t("span", Rs, u(C.basename), 1)
            ]),
            t("div", qs, u(C.file_size ? o(e).filesize(C.file_size) : ""), 1),
            t("div", Is, u(o(we)(C.last_modified)), 1)
          ])
        ], 42, Ls))), 256)) : M("", !0),
        o(e).view === "grid" && !v.value.length ? (n(!0), m(U, { key: 2 }, I(V(!1), (C, j) => (n(), m("div", {
          draggable: "true",
          onDblclick: (S) => f(C),
          onTouchstart: D[8] || (D[8] = (S) => $(S)),
          onTouchend: D[9] || (D[9] = (S) => w()),
          onContextmenu: Y((S) => o(e).emitter.emit("vf-contextmenu-show", { event: S, area: a.value, items: K(), target: C }), ["prevent"]),
          onDragstart: (S) => te(S),
          onDragover: (S) => ae(S, C),
          onDrop: (S) => se(S, C),
          class: z(["vf-item-" + o(l), "border border-transparent hover:bg-neutral-50 m-1 dark:hover:bg-gray-700 inline-flex w-[5.5rem] h-20 md:w-24 text-center justify-center select-none"]),
          "data-type": C.type,
          "data-item": JSON.stringify(C),
          "data-index": j
        }, [
          t("div", null, [
            t("div", Ws, [
              C.type === "dir" ? (n(), m("svg", Gs, Ks)) : (C.mime_type ?? "").startsWith("image") ? (n(), m("img", {
                key: 1,
                class: "lazy h-10 md:h-12 m-auto",
                "data-src": o(e).requester.getPreviewUrl(o(e).adapter, C),
                alt: C.basename
              }, null, 8, Js)) : (n(), m("svg", Xs, Qs)),
              !(C.mime_type ?? "").startsWith("image") && C.type != "dir" ? (n(), m("div", ea, u(r(C.extension)), 1)) : M("", !0)
            ]),
            t("span", ta, u(o(he)(C.basename)), 1)
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
    const e = O("ServiceContainer"), { t: s } = e.i18n, r = _(null), a = _([]), d = _(""), c = ie({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    }), i = ee(() => c.items.filter((g) => g.key == null || e.features.includes(g.key)));
    e.emitter.on("vf-context-selected", (g) => {
      a.value = g;
    });
    const l = {
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
          e.emitter.emit("vf-modal-show", { type: "delete", items: a });
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
          e.emitter.emit("vf-modal-show", { type: "preview", adapter: e.data.adapter, item: a.value[0] });
        }
      },
      open: {
        title: () => s("Open"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: a.value[0].path } });
        }
      },
      openDir: {
        title: () => s("Open containing folder"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.data.adapter, path: a.value[0].dir } });
        }
      },
      download: {
        key: B.DOWNLOAD,
        link: ee(() => e.requester.getDownloadUrl(e.data.adapter, a.value[0])),
        title: () => s("Download"),
        action: () => {
          const g = e.requester.getDownloadUrl(e.data.adapter, a.value[0]);
          e.emitter.emit("vf-download", g);
        }
      },
      archive: {
        key: B.ARCHIVE,
        title: () => s("Archive"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "archive", items: a });
        }
      },
      unarchive: {
        key: B.UNARCHIVE,
        title: () => s("Unarchive"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "unarchive", items: a });
        }
      },
      rename: {
        key: B.RENAME,
        title: () => s("Rename"),
        action: () => {
          e.emitter.emit("vf-modal-show", { type: "rename", items: a });
        }
      }
    }, v = (g) => {
      e.emitter.emit("vf-contextmenu-hide"), g.action();
    };
    e.emitter.on("vf-search-query", ({ newQuery: g }) => {
      d.value = g;
    }), e.emitter.on("vf-contextmenu-show", ({ event: g, area: w, items: y, target: E = null }) => {
      if (c.items = [], d.value)
        if (E)
          c.items.push(l.openDir), e.emitter.emit("vf-context-selected", [E]);
        else
          return;
      else
        !E && !d.value ? (c.items.push(l.refresh), c.items.push(l.newfolder), e.emitter.emit("vf-context-selected", [])) : y.length > 1 && y.some(($) => $.path === E.path) ? (c.items.push(l.refresh), c.items.push(l.archive), c.items.push(l.delete), e.emitter.emit("vf-context-selected", y)) : (E.type == "dir" ? c.items.push(l.open) : (c.items.push(l.preview), c.items.push(l.download)), c.items.push(l.rename), E.mime_type == "application/zip" ? c.items.push(l.unarchive) : c.items.push(l.archive), c.items.push(l.delete), e.emitter.emit("vf-context-selected", [E]));
      b(g, w);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      c.active = !1;
    });
    const b = (g, w) => {
      c.active = !0, ce(() => {
        const y = e.root.getBoundingClientRect(), E = w.getBoundingClientRect();
        let $ = g.pageX - y.left, f = g.pageY - y.top, h = r.value.offsetHeight, V = r.value.offsetWidth;
        $ = E.right - g.pageX + window.scrollX < V ? $ - V : $, f = E.bottom - g.pageY + window.scrollY < h ? f - h : f, c.positions = {
          left: $ + "px",
          top: f + "px"
        };
      });
    };
    return (g, w) => c.active ? (n(), m("ul", {
      key: 0,
      class: "z-30 absolute text-xs bg-neutral-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-neutral-300 dark:border-gray-600 shadow rounded select-none",
      ref_key: "contextmenu",
      ref: r,
      style: be(c.positions)
    }, [
      (n(!0), m(U, null, I(i.value, (y) => (n(), m("li", {
        class: "px-2 py-1.5 cursor-pointer hover:bg-neutral-200 dark:hover:bg-gray-700",
        key: y.title,
        onClick: (E) => v(y)
      }, [
        y.link ? (n(), m("a", {
          key: 0,
          target: "_blank",
          href: y.link,
          download: y.link
        }, [
          na,
          t("span", null, u(y.title()), 1)
        ], 8, ra)) : (n(), m(U, { key: 1 }, [
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
    const e = O("ServiceContainer"), { t: s } = e.i18n, { setStore: r } = e.storage, a = _(0), d = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.adapter } }), r("adapter", e.adapter);
    };
    e.emitter.on("vf-nodes-selected", (l) => {
      a.value = l.length;
    });
    const c = _("");
    e.emitter.on("vf-search-query", ({ newQuery: l }) => {
      c.value = l;
    });
    const i = ee(() => {
      const l = e.selectButton.multiple ? e.selectedItems.length > 0 : e.selectedItems.length === 1;
      return e.selectButton.active && l;
    });
    return (l, v) => (n(), m("div", ca, [
      t("div", ua, [
        t("div", {
          class: "mx-2",
          "aria-label": o(s)("Storage"),
          "data-microtip-position": "top-right",
          role: "tooltip"
        }, pa, 8, ma),
        q(t("select", {
          "onUpdate:modelValue": v[0] || (v[0] = (b) => o(e).adapter = b),
          onChange: d,
          class: "py-0.5 text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded pl-2 pr-8"
        }, [
          (n(!0), m(U, null, I(o(e).data.storages, (b) => (n(), m("option", { value: b }, u(b), 9, ha))), 256))
        ], 544), [
          [pe, o(e).adapter]
        ]),
        t("div", fa, [
          c.value.length ? (n(), m("span", ga, u(o(e).data.files.length) + " items found. ", 1)) : M("", !0),
          t("span", _a, u(a.value > 0 ? o(s)("%s item(s) selected.", a.value) : ""), 1)
        ])
      ]),
      t("div", ka, [
        o(e).selectButton.active ? (n(), m("button", {
          key: 0,
          class: z(["vf-btn py-0 vf-btn-primary", { disabled: !i.value }]),
          disabled: !i.value,
          onClick: v[1] || (v[1] = (b) => o(e).selectButton.click(o(e).selectedItems, b))
        }, u(o(s)("Select")), 11, ba)) : M("", !0),
        t("span", {
          class: "mr-1",
          "aria-label": o(s)("Settings"),
          "data-microtip-position": "top-left",
          role: "tooltip",
          onClick: v[2] || (v[2] = (b) => o(e).emitter.emit("vf-modal-show", { type: "about" }))
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
  setup(p, { emit: e }) {
    const s = e, a = Je(p, O("VueFinderOptions"));
    je("ServiceContainer", a);
    const { setStore: d } = a.storage, c = _(null);
    a.root = c, a.i18n, a.emitter.on("vf-modal-close", () => {
      a.modal.active = !1;
    }), a.emitter.on("vf-modal-show", (v) => {
      a.modal.active = !0, a.modal.type = v.type, a.modal.data = v;
    });
    const i = (v) => {
      Object.assign(a.data, v), a.emitter.emit("vf-nodes-selected", {}), a.emitter.emit("vf-explorer-update");
    };
    a.emitter.on("vf-nodes-selected", (v) => {
      a.selectedItems = v, s("select", v);
    });
    let l;
    return a.emitter.on("vf-fetch-abort", () => {
      l.abort(), a.loading = !1;
    }), a.emitter.on("vf-fetch", ({ params: v, body: b = null, onSuccess: g = null, onError: w = null, noCloseModal: y = !1 }) => {
      ["index", "search"].includes(v.q) && (l && l.abort(), a.loading = !0), l = new AbortController();
      const E = l.signal;
      a.requester.send({
        url: "",
        method: v.m || "get",
        params: v,
        body: b,
        abortSignal: E
      }).then(($) => {
        a.adapter = $.adapter, a.persist && (a.path = $.dirname, d("path", a.path)), ["index", "search"].includes(v.q) && (a.loading = !1), y || a.emitter.emit("vf-modal-close"), i($), g && g($);
      }).catch(($) => {
        console.error($), w && w($);
      });
    }), a.emitter.on("vf-download", (v) => {
      const b = document.createElement("a");
      b.style.display = "none", b.target = "_blank", b.href = v, b.download = v, a.root.appendChild(b), b.click(), b.remove();
    }), P(() => {
      let v = {};
      a.path.includes("://") && (v = {
        adapter: a.path.split("://")[0],
        path: a.path
      }), a.emitter.emit("vf-fetch", { params: { q: "index", adapter: a.adapter, ...v } });
    }), (v, b) => (n(), m("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: c
    }, [
      t("div", {
        class: z(o(a).theme.actualValue === "dark" ? "dark" : "")
      }, [
        t("div", {
          class: z([o(a).fullscreen ? "fixed w-screen inset-0 z-20" : "relative rounded-md", "border flex flex-col bg-white dark:bg-gray-800 text-gray-700 dark:text-neutral-400 border-neutral-300 dark:border-gray-900 min-w-min select-none"]),
          style: be(o(a).fullscreen ? "" : "height: 100%; width: 100%;"),
          onMousedown: b[0] || (b[0] = (g) => o(a).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: b[1] || (b[1] = (g) => o(a).emitter.emit("vf-contextmenu-hide"))
        }, [
          H(Tt),
          H(ns),
          H(aa),
          H(Ca)
        ], 38),
        H(Ae, { name: "fade" }, {
          default: A(() => [
            o(a).modal.active ? (n(), L(Te("v-f-modal-" + o(a).modal.type), { key: 0 })) : M("", !0)
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
    }), (s, r) => (n(), m("div", {
      class: "v-f-modal relative z-30",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: r[1] || (r[1] = Z((a) => o(e).emitter.emit("vf-modal-close"), ["esc"])),
      tabindex: "0"
    }, [
      Ea,
      t("div", Da, [
        t("div", {
          class: "flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0",
          onMousedown: r[0] || (r[0] = Y((a) => o(e).emitter.emit("vf-modal-close"), ["self"]))
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
    const s = e, r = O("ServiceContainer"), { t: a } = r.i18n, d = _(!1), c = _(null), i = _((v = c.value) == null ? void 0 : v.strMessage);
    de(i, () => d.value = !1);
    const l = () => {
      s("hidden"), d.value = !0;
    };
    return (b, g) => (n(), m("div", null, [
      d.value ? M("", !0) : (n(), m("div", {
        key: 0,
        ref_key: "strMessage",
        ref: c,
        class: z(["flex mt-2 p-1 px-2 rounded text-sm break-all dark:opacity-75", p.error ? "bg-red-100 text-red-600 " : "bg-emerald-100 text-emerald-600"])
      }, [
        le(b.$slots, "default"),
        t("div", {
          class: "ml-auto cursor-pointer",
          onClick: l,
          "aria-label": o(a)("Close"),
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
    const { t: s } = e.i18n, r = _(e.modal.data.items), a = _(""), d = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: r.value.map(({ path: c, type: i }) => ({ path: c, type: i }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("Files deleted.") });
        },
        onError: (c) => {
          a.value = s(c.message);
        }
      });
    };
    return (c, i) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: d,
          class: "vf-btn vf-btn-danger"
        }, u(o(s)("Yes, Delete!")), 1),
        t("button", {
          type: "button",
          onClick: i[1] || (i[1] = (l) => o(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(o(s)("Cancel")), 1),
        t("div", Za, u(o(s)("This action cannot be undone.")), 1)
      ]),
      default: A(() => [
        t("div", Va, [
          Ba,
          t("div", za, [
            t("h3", Ua, u(o(s)("Delete files")), 1),
            t("div", Ha, [
              t("p", Ra, u(o(s)("Are you sure you want to delete these files?")), 1),
              t("div", qa, [
                (n(!0), m(U, null, I(r.value, (l) => (n(), m("p", Ia, [
                  l.type === "dir" ? (n(), m("svg", Pa, Ga)) : (n(), m("svg", Ya, Ja)),
                  t("span", Xa, u(l.basename), 1)
                ]))), 256))
              ]),
              a.value.length ? (n(), L(G, {
                key: 0,
                onHidden: i[0] || (i[0] = (l) => a.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(a.value), 1)
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
    return (r, a) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: a[0] || (a[0] = (d) => o(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(o(s)("Close")), 1)
      ]),
      default: A(() => {
        var d, c;
        return [
          t("div", to, [
            so,
            t("div", ao, [
              t("h3", oo, u(((d = o(e).modal.data) == null ? void 0 : d.title) ?? "Title"), 1),
              t("div", ro, [
                t("p", no, u(((c = o(e).modal.data) == null ? void 0 : c.message) ?? "Message"), 1)
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
    const { t: s } = e.i18n, r = _(""), a = _(""), d = () => {
      r.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfolder",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("%s is created.", r.value) });
        },
        onError: (c) => {
          a.value = s(c.message);
        }
      });
    };
    return (c, i) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: d,
          class: "vf-btn vf-btn-primary"
        }, u(o(s)("Create")), 1),
        t("button", {
          type: "button",
          onClick: i[2] || (i[2] = (l) => o(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(o(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", co, [
          uo,
          t("div", mo, [
            t("h3", vo, u(o(s)("New Folder")), 1),
            t("div", po, [
              t("p", ho, u(o(s)("Create a new folder")), 1),
              q(t("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (l) => r.value = l),
                onKeyup: Z(d, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: o(s)("Folder Name"),
                type: "text"
              }, null, 40, fo), [
                [Q, r.value]
              ]),
              a.value.length ? (n(), L(G, {
                key: 0,
                onHidden: i[1] || (i[1] = (l) => a.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(a.value), 1)
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
    const { t: s } = e.i18n, r = _(""), a = _(""), d = () => {
      r.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfile",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("%s is created.", r.value) });
        },
        onError: (c) => {
          a.value = s(c.message);
        }
      });
    };
    return (c, i) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: d,
          class: "vf-btn vf-btn-primary"
        }, u(o(s)("Create")), 1),
        t("button", {
          type: "button",
          onClick: i[2] || (i[2] = (l) => o(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(o(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", ko, [
          bo,
          t("div", yo, [
            t("h3", xo, u(o(s)("New File")), 1),
            t("div", wo, [
              t("p", $o, u(o(s)("Create a new file")), 1),
              q(t("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (l) => r.value = l),
                onKeyup: Z(d, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: o(s)("File Name"),
                type: "text"
              }, null, 40, Co), [
                [Q, r.value]
              ]),
              a.value.length ? (n(), L(G, {
                key: 0,
                onHidden: i[1] || (i[1] = (l) => a.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(a.value), 1)
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
    const s = e, r = _(""), a = _(""), d = _(null), c = _(!1), i = _(""), l = _(!1), v = O("ServiceContainer"), { t: b } = v.i18n;
    P(() => {
      v.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: v.modal.data.adapter, path: v.modal.data.item.path },
        responseType: "text"
      }).then((y) => {
        r.value = y, s("success");
      });
    });
    const g = () => {
      c.value = !c.value, a.value = r.value, c.value == !0 && ce(() => {
        d.value.focus();
      });
    }, w = () => {
      i.value = "", l.value = !1, v.requester.send({
        url: "",
        method: "post",
        params: {
          q: "save",
          adapter: v.modal.data.adapter,
          path: v.modal.data.item.path
        },
        body: {
          content: a.value
        },
        responseType: "text"
      }).then((y) => {
        i.value = b("Updated."), r.value = y, s("success"), c.value = !c.value;
      }).catch((y) => {
        i.value = b(y.message), l.value = !0;
      });
    };
    return (y, E) => (n(), m(U, null, [
      t("div", Eo, [
        t("div", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": o(v).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, u(o(v).modal.data.item.basename), 9, Do),
        t("div", jo, [
          c.value ? (n(), m("button", {
            key: 0,
            onClick: w,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, u(o(b)("Save")), 1)) : M("", !0),
          o(v).features.includes(o(B).EDIT) ? (n(), m("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: E[0] || (E[0] = ($) => g())
          }, u(c.value ? o(b)("Cancel") : o(b)("Edit")), 1)) : M("", !0)
        ])
      ]),
      t("div", null, [
        c.value ? (n(), m("div", To, [
          q(t("textarea", {
            ref_key: "editInput",
            ref: d,
            "onUpdate:modelValue": E[1] || (E[1] = ($) => a.value = $),
            class: "w-full p-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:selection:bg-gray-500 min-h-[200px] max-h-[60vh] text-xs",
            name: "text",
            id: "",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [Q, a.value]
          ])
        ])) : (n(), m("pre", Ao, u(r.value), 1)),
        i.value.length ? (n(), L(G, {
          key: 2,
          onHidden: E[2] || (E[2] = ($) => i.value = ""),
          error: l.value
        }, {
          default: A(() => [
            N(u(i.value), 1)
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
    const s = e, r = O("ServiceContainer"), { t: a } = r.i18n, d = _(null), c = _(null), i = _(!1), l = _(""), v = _(!1), b = () => {
      i.value = !i.value, i.value ? c.value = new Be(d.value, {
        crop(w) {
        }
      }) : c.value.destroy();
    }, g = () => {
      c.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (w) => {
          l.value = "", v.value = !1;
          const y = new FormData();
          y.set("file", w), r.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: r.modal.data.adapter,
              path: r.modal.data.item.path
            },
            body: y
          }).then((E) => {
            l.value = a("Updated."), d.value.src = r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item), b(), s("success");
          }).catch((E) => {
            l.value = a(E.message), v.value = !0;
          });
        }
      );
    };
    return P(() => {
      s("success");
    }), (w, y) => (n(), m(U, null, [
      t("div", Oo, [
        t("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": o(r).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, u(o(r).modal.data.item.basename), 9, Fo),
        t("div", No, [
          i.value ? (n(), m("button", {
            key: 0,
            onClick: g,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, u(o(a)("Crop")), 1)) : M("", !0),
          o(r).features.includes(o(B).EDIT) ? (n(), m("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: y[0] || (y[0] = (E) => b())
          }, u(i.value ? o(a)("Cancel") : o(a)("Edit")), 1)) : M("", !0)
        ])
      ]),
      t("div", Vo, [
        t("img", {
          ref_key: "image",
          ref: d,
          class: "max-w-[50vh] max-h-[50vh]",
          src: o(r).requester.getPreviewUrl(o(r).modal.data.adapter, o(r).modal.data.item),
          alt: ""
        }, null, 8, Bo)
      ]),
      l.value.length ? (n(), L(G, {
        key: 0,
        onHidden: y[1] || (y[1] = (E) => l.value = ""),
        error: v.value
      }, {
        default: A(() => [
          N(u(l.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : M("", !0)
    ], 64));
  }
}, Uo = { class: "flex" }, Ho = ["aria-label"], Ro = /* @__PURE__ */ t("div", null, null, -1), qo = {
  __name: "Default",
  emits: ["success"],
  setup(p, { emit: e }) {
    const s = O("ServiceContainer"), r = e;
    return P(() => {
      r("success");
    }), (a, d) => (n(), m(U, null, [
      t("div", Uo, [
        t("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": o(s).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, u(o(s).modal.data.item.basename), 9, Ho)
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
    const s = O("ServiceContainer"), r = e, a = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return P(() => {
      r("success");
    }), (d, c) => (n(), m("div", null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": o(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, u(o(s).modal.data.item.basename), 9, Io),
      t("div", null, [
        t("video", Po, [
          t("source", {
            src: a(),
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
    const s = e, r = O("ServiceContainer"), a = () => r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item);
    return P(() => {
      s("success");
    }), (d, c) => (n(), m(U, null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": o(r).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, u(o(r).modal.data.item.basename), 9, Yo),
      t("div", null, [
        t("audio", Ko, [
          t("source", {
            src: a(),
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
    const s = O("ServiceContainer"), r = e, a = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return P(() => {
      r("success");
    }), (d, c) => (n(), m(U, null, [
      t("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": o(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, u(o(s).modal.data.item.basename), 9, Zo),
      t("div", null, [
        t("object", {
          class: "h-[60vh]",
          data: a(),
          type: "application/pdf",
          width: "100%",
          height: "100%"
        }, [
          t("iframe", {
            class: "border-0",
            src: a(),
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
    const e = O("ServiceContainer"), { t: s } = e.i18n, r = _(!1), a = (c) => (e.modal.data.item.mime_type ?? "").startsWith(c), d = e.features.includes(B.PREVIEW);
    return d || (r.value = !0), (c, i) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: i[6] || (i[6] = (l) => o(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(o(s)("Close")), 1),
        o(e).features.includes(o(B).DOWNLOAD) ? (n(), m("a", {
          key: 0,
          target: "_blank",
          class: "vf-btn vf-btn-primary",
          download: o(e).requester.getDownloadUrl(o(e).modal.data.adapter, o(e).modal.data.item),
          href: o(e).requester.getDownloadUrl(o(e).modal.data.adapter, o(e).modal.data.item)
        }, u(o(s)("Download")), 9, pr)) : M("", !0)
      ]),
      default: A(() => [
        t("div", or, [
          t("div", rr, [
            o(d) ? (n(), m("div", nr, [
              a("text") ? (n(), L(Lo, {
                key: 0,
                onSuccess: i[0] || (i[0] = (l) => r.value = !0)
              })) : a("image") ? (n(), L(zo, {
                key: 1,
                onSuccess: i[1] || (i[1] = (l) => r.value = !0)
              })) : a("video") ? (n(), L(Go, {
                key: 2,
                onSuccess: i[2] || (i[2] = (l) => r.value = !0)
              })) : a("audio") ? (n(), L(Xo, {
                key: 3,
                onSuccess: i[3] || (i[3] = (l) => r.value = !0)
              })) : a("application/pdf") ? (n(), L(ar, {
                key: 4,
                onSuccess: i[4] || (i[4] = (l) => r.value = !0)
              })) : (n(), L(qo, {
                key: 5,
                onSuccess: i[5] || (i[5] = (l) => r.value = !0)
              }))
            ])) : M("", !0),
            t("div", lr, [
              r.value === !1 ? (n(), m("div", ir, [
                dr,
                t("span", null, u(o(s)("Loading")), 1)
              ])) : M("", !0)
            ])
          ])
        ]),
        t("div", cr, [
          t("div", null, [
            t("span", ur, u(o(s)("File Size")) + ": ", 1),
            N(u(o(e).filesize(o(e).modal.data.item.file_size)), 1)
          ]),
          t("div", null, [
            t("span", mr, u(o(s)("Last Modified")) + ": ", 1),
            N(" " + u(o(we)(o(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        o(e).features.includes(o(B).DOWNLOAD) ? (n(), m("div", vr, [
          t("span", null, u(o(s)(`Download doesn't work? You can try right-click "Download" button, select "Save link as...".`)), 1)
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
    const { t: s } = e.i18n, r = _(e.modal.data.items[0]), a = _(e.modal.data.items[0].basename), d = _(""), c = () => {
      a.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "rename",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          item: r.value.path,
          name: a.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("%s is renamed.", a.value) });
        },
        onError: (i) => {
          d.value = s(i.message);
        }
      });
    };
    return (i, l) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, u(o(s)("Rename")), 1),
        t("button", {
          type: "button",
          onClick: l[2] || (l[2] = (v) => o(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(o(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", gr, [
          _r,
          t("div", kr, [
            t("h3", br, u(o(s)("Rename")), 1),
            t("div", yr, [
              t("p", xr, [
                r.value.type === "dir" ? (n(), m("svg", wr, Cr)) : (n(), m("svg", Sr, Er)),
                t("span", Dr, u(r.value.basename), 1)
              ]),
              q(t("input", {
                "onUpdate:modelValue": l[0] || (l[0] = (v) => a.value = v),
                onKeyup: Z(c, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [Q, a.value]
              ]),
              d.value.length ? (n(), L(G, {
                key: 0,
                onHidden: l[1] || (l[1] = (v) => d.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(d.value), 1)
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
    const e = O("ServiceContainer"), { t: s } = e.i18n, r = s("uppy"), a = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, d = _({ QUEUE_ENTRY_STATUS: a }), c = _(null), i = _(null), l = _(null), v = _(null), b = _(null), g = _(null), w = _([]), y = _(""), E = _(!1), $ = _(!1);
    let f;
    function h(j) {
      return w.value.findIndex((S) => S.id === j);
    }
    function V(j, S = null) {
      S = S ?? (j.webkitRelativePath || j.name), f.addFile({
        name: S,
        type: j.type,
        data: j,
        source: "Local"
      });
    }
    function R(j) {
      switch (j.status) {
        case a.DONE:
          return "text-green-600";
        case a.ERROR:
          return "text-red-600";
        case a.CANCELED:
          return "text-red-600";
        case a.PENDING:
        default:
          return "";
      }
    }
    const K = (j) => {
      switch (j.status) {
        case a.DONE:
          return "✓";
        case a.ERROR:
        case a.CANCELED:
          return "!";
        case a.PENDING:
        default:
          return "...";
      }
    };
    function te() {
      v.value.click();
    }
    function se() {
      if (!E.value) {
        if (!w.value.filter((j) => j.status !== a.DONE).length) {
          y.value = s("Please select file to upload first.");
          return;
        }
        y.value = "", f.retryAll(), f.upload();
      }
    }
    function ae() {
      f.cancelAll({ reason: "user" }), w.value.forEach((j) => {
        j.status !== a.DONE && (j.status = a.CANCELED, j.statusName = s("Canceled"));
      }), E.value = !1;
    }
    function oe(j) {
      E.value || (f.removeFile(j.id, "removed-by-user"), w.value.splice(h(j.id), 1));
    }
    function x(j) {
      if (!E.value) {
        if (f.cancelAll({ reason: "user" }), j) {
          const S = [];
          w.value.forEach((k) => {
            k.status !== a.DONE && S.push(k);
          }), w.value = [], S.forEach((k) => {
            V(k.originalFile, k.name);
          });
          return;
        }
        w.value.splice(0);
      }
    }
    function D() {
      e.emitter.emit("vf-modal-close");
    }
    function C() {
      return e.requester.transformRequestParams({
        url: "",
        method: "post",
        params: { q: "upload", adapter: e.data.adapter, path: e.data.dirname }
      });
    }
    return P(async () => {
      f = new ze({
        debug: e.debug,
        restrictions: {
          maxFileSize: Ye(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: r,
        onBeforeFileAdded(k, T) {
          if (T[k.id] != null) {
            const X = h(k.id);
            w.value[X].status === a.PENDING && (y.value = f.i18n("noDuplicates", { fileName: k.name })), w.value = w.value.filter((ue) => ue.id !== k.id);
          }
          return w.value.push({
            id: k.id,
            name: k.name,
            size: e.filesize(k.size),
            status: a.PENDING,
            statusName: s("Pending upload"),
            percent: null,
            originalFile: k.data
          }), !0;
        }
      }), f.use(Ue, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError(k, T) {
          let F;
          try {
            F = JSON.parse(k).message;
          } catch {
            F = s("Cannot parse server response.");
          }
          return new Error(F);
        }
      }), f.on("restriction-failed", (k, T) => {
        const F = w.value[h(k.id)];
        oe(F), y.value = T.message;
      }), f.on("upload", () => {
        const k = C();
        f.setMeta({ ...k.body });
        const T = f.getPlugin("XHRUpload");
        T.opts.method = k.method, T.opts.endpoint = k.url + "?" + new URLSearchParams(k.params), T.opts.headers = k.headers, E.value = !0, w.value.forEach((F) => {
          F.status !== a.DONE && (F.percent = null, F.status = a.UPLOADING, F.statusName = s("Pending upload"));
        });
      }), f.on("upload-progress", (k, T) => {
        const F = Math.floor(T.bytesUploaded / T.bytesTotal * 100);
        w.value[h(k.id)].percent = `${F}%`;
      }), f.on("upload-success", (k) => {
        const T = w.value[h(k.id)];
        T.status = a.DONE, T.statusName = s("Done");
      }), f.on("upload-error", (k, T) => {
        const F = w.value[h(k.id)];
        F.percent = null, F.status = a.ERROR, T.isNetworkError ? F.statusName = s("Network Error, Unable establish connection to the server or interrupted.") : F.statusName = T ? T.message : s("Unknown Error");
      }), f.on("error", (k) => {
        y.value = k.message, E.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.data.adapter, path: e.data.dirname },
          noCloseModal: !0
        });
      }), f.on("complete", () => {
        E.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.data.adapter, path: e.data.dirname },
          noCloseModal: !0
        });
      }), v.value.addEventListener("click", () => {
        i.value.click();
      }), b.value.addEventListener("click", () => {
        l.value.click();
      }), g.value.addEventListener("dragover", (k) => {
        k.preventDefault(), $.value = !0;
      }), g.value.addEventListener("dragleave", (k) => {
        k.preventDefault(), $.value = !1;
      });
      function j(k, T) {
        T.isFile && T.file((F) => k(T, F)), T.isDirectory && T.createReader().readEntries((F) => {
          F.forEach((X) => {
            j(k, X);
          });
        });
      }
      g.value.addEventListener("drop", (k) => {
        k.preventDefault(), $.value = !1;
        const T = /^[/\\](.+)/;
        [...k.dataTransfer.items].forEach((F) => {
          F.kind === "file" && j((X, ue) => {
            const $e = T.exec(X.fullPath);
            V(ue, $e[1]);
          }, F.webkitGetAsEntry());
        });
      });
      const S = ({ target: k }) => {
        const T = k.files;
        for (const F of T)
          V(F);
        k.value = "";
      };
      i.value.addEventListener("change", S), l.value.addEventListener("change", S);
    }), ke(() => {
      f == null || f.close({ reason: "unmount" });
    }), (j, S) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          class: z(["vf-btn vf-btn-primary", E.value ? "bg-blue-200 hover:bg-blue-200 dark:bg-gray-700/50 dark:hover:bg-gray-700/50 dark:text-gray-500" : "bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-500"]),
          disabled: E.value,
          onClick: Y(se, ["prevent"])
        }, u(o(s)("Upload")), 11, Zr),
        E.value ? (n(), m("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: Y(ae, ["prevent"])
        }, u(o(s)("Cancel")), 1)) : (n(), m("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: Y(D, ["prevent"])
        }, u(o(s)("Close")), 1))
      ]),
      default: A(() => [
        t("div", Tr, [
          Lr,
          t("div", Or, [
            t("h3", Fr, u(o(s)("Upload Files")), 1),
            t("div", Nr, [
              t("div", {
                ref_key: "dropArea",
                ref: g,
                class: "flex items-center justify-center text-lg mb-4 text-gray-500 border-2 border-gray-300 rounded border-dashed select-none cursor-pointer dark:border-gray-600 h-[120px]",
                onClick: te
              }, [
                $.value ? (n(), m("div", Vr, u(o(s)("Release to drop these files.")), 1)) : (n(), m("div", Br, u(o(s)("Drag and drop the files/folders to here or click here.")), 1))
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
                }, u(o(s)("Select Files")), 513),
                t("button", {
                  ref_key: "pickFolders",
                  ref: b,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, u(o(s)("Select Folders")), 513),
                t("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: E.value,
                  onClick: S[0] || (S[0] = (k) => x(!1))
                }, u(o(s)("Clear all")), 9, zr),
                t("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: E.value,
                  onClick: S[1] || (S[1] = (k) => x(!0))
                }, u(o(s)("Clear only successful")), 9, Ur)
              ], 512),
              t("div", Hr, [
                (n(!0), m(U, null, I(w.value, (k) => (n(), m("div", {
                  class: "flex hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                  key: k.id
                }, [
                  t("span", Rr, [
                    t("span", {
                      class: z(["text-base m-auto", R(k)]),
                      textContent: u(K(k))
                    }, null, 10, qr)
                  ]),
                  t("div", Ir, [
                    t("div", Pr, u(o(he)(k.name, 40)) + " (" + u(k.size) + ")", 1),
                    t("div", Wr, u(o(he)(k.name, 16)) + " (" + u(k.size) + ")", 1),
                    t("div", {
                      class: z(["flex break-all text-left", R(k)])
                    }, [
                      N(u(k.statusName) + " ", 1),
                      k.status === d.value.QUEUE_ENTRY_STATUS.UPLOADING ? (n(), m("b", Gr, u(k.percent), 1)) : M("", !0)
                    ], 2)
                  ]),
                  t("button", {
                    type: "button",
                    class: z(["rounded w-5 h-5 border-1 text-base leading-none font-medium focus:outline-none dark:border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:bg-gray-600 ml-auto sm:text-xs hover:text-red-600", E.value ? "disabled:bg-gray-100 text-white text-opacity-50" : "bg-gray-100"]),
                    title: o(s)("Delete"),
                    disabled: E.value,
                    onClick: (T) => oe(k)
                  }, Jr, 10, Yr)
                ]))), 128)),
                w.value.length ? M("", !0) : (n(), m("div", Xr, u(o(s)("No files selected!")), 1))
              ]),
              y.value.length ? (n(), L(G, {
                key: 0,
                onHidden: S[2] || (S[2] = (k) => y.value = ""),
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
          ref: i,
          type: "file",
          multiple: "",
          class: "hidden"
        }, null, 512),
        t("input", {
          ref_key: "internalFolderInput",
          ref: l,
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
    const { t: s } = e.i18n, r = _(""), a = _(""), d = _(e.modal.data.items), c = () => {
      d.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: d.value.map(({ path: i, type: l }) => ({ path: i, type: l })),
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("The file(s) archived.") });
        },
        onError: (i) => {
          a.value = s(i.message);
        }
      });
    };
    return (i, l) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, u(o(s)("Archive")), 1),
        t("button", {
          type: "button",
          onClick: l[2] || (l[2] = (v) => o(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(o(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", tn, [
          sn,
          t("div", an, [
            t("h3", on, u(o(s)("Archive the files")), 1),
            t("div", rn, [
              t("div", nn, [
                (n(!0), m(U, null, I(d.value, (v) => (n(), m("p", ln, [
                  v.type === "dir" ? (n(), m("svg", dn, un)) : (n(), m("svg", mn, pn)),
                  t("span", hn, u(v.basename), 1)
                ]))), 256))
              ]),
              q(t("input", {
                "onUpdate:modelValue": l[0] || (l[0] = (v) => r.value = v),
                onKeyup: Z(c, ["enter"]),
                class: "my-1 px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: o(s)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, fn), [
                [Q, r.value]
              ]),
              a.value.length ? (n(), L(G, {
                key: 0,
                onHidden: l[1] || (l[1] = (v) => a.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(a.value), 1)
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
    const r = _(e.modal.data.items[0]), a = _(""), d = _([]), c = () => {
      e.emitter.emit("vf-fetch", {
        params: {
          q: "unarchive",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          item: r.value.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("The file unarchived.") });
        },
        onError: (i) => {
          a.value = s(i.message);
        }
      });
    };
    return (i, l) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, u(o(s)("Unarchive")), 1),
        t("button", {
          type: "button",
          onClick: l[1] || (l[1] = (v) => o(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(o(s)("Cancel")), 1)
      ]),
      default: A(() => [
        t("div", kn, [
          bn,
          t("div", yn, [
            t("h3", xn, u(o(s)("Unarchive")), 1),
            t("div", wn, [
              (n(!0), m(U, null, I(d.value, (v) => (n(), m("p", $n, [
                v.type === "dir" ? (n(), m("svg", Cn, Mn)) : (n(), m("svg", En, jn)),
                t("span", An, u(v.basename), 1)
              ]))), 256)),
              t("p", Tn, u(o(s)("The archive will be unarchived at")) + " (" + u(i.current.dirname) + ")", 1),
              a.value.length ? (n(), L(G, {
                key: 0,
                onHidden: l[0] || (l[0] = (v) => a.value = ""),
                error: ""
              }, {
                default: A(() => [
                  N(u(a.value), 1)
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
    const r = _(e.modal.data.items.from), a = _(""), d = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.adapter,
          path: e.data.dirname
        },
        body: {
          items: r.value.map(({ path: c, type: i }) => ({ path: c, type: i })),
          item: e.modal.data.items.to.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: s("Files moved.", e.modal.data.items.to.name) });
        },
        onError: (c) => {
          a.value = s(c.message);
        }
      });
    };
    return (c, i) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: d,
          class: "vf-btn vf-btn-primary"
        }, u(o(s)("Yes, Move!")), 1),
        t("button", {
          type: "button",
          onClick: i[1] || (i[1] = (l) => o(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(o(s)("Cancel")), 1),
        t("div", Qn, u(o(s)("%s item(s) selected.", r.value.length)), 1)
      ]),
      default: A(() => [
        t("div", Fn, [
          Nn,
          t("div", Vn, [
            t("h3", Bn, u(o(s)("Move files")), 1),
            t("p", zn, u(o(s)("Are you sure you want to move these files?")), 1),
            t("div", Un, [
              (n(!0), m(U, null, I(r.value, (l) => (n(), m("div", Hn, [
                t("div", null, [
                  l.type === "dir" ? (n(), m("svg", Rn, In)) : (n(), m("svg", Pn, Gn))
                ]),
                t("div", Yn, u(l.path), 1)
              ]))), 256))
            ]),
            t("h4", Kn, u(o(s)("Target Directory")), 1),
            t("p", Jn, [
              Xn,
              t("span", Zn, u(o(e).modal.data.items.to.path), 1)
            ]),
            a.value.length ? (n(), L(G, {
              key: 0,
              onHidden: i[0] || (i[0] = (l) => a.value = ""),
              error: ""
            }, {
              default: A(() => [
                N(u(a.value), 1)
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
  for (const [r, a] of e)
    s[r] = a;
  return s;
}, al = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(p, { emit: e, slots: s }) {
    const r = O("ServiceContainer"), a = _(!1), { t: d } = r.i18n;
    let c = null;
    const i = () => {
      clearTimeout(c), a.value = !0, c = setTimeout(() => {
        a.value = !1;
      }, 2e3);
    };
    return P(() => {
      r.emitter.on(p.on, i);
    }), Le(() => {
      clearTimeout(c);
    }), {
      shown: a,
      t: d
    };
  }
}, ol = { key: 1 };
function rl(p, e, s, r, a, d) {
  return n(), m("div", {
    class: z(["text-sm text-green-600 dark:text-green-600 transition-opacity duration-500 ease-out", [{ "opacity-0": !r.shown }]])
  }, [
    p.$slots.default ? le(p.$slots, "default", { key: 0 }) : (n(), m("span", ol, u(r.t("Saved.")), 1))
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
    const e = O("ServiceContainer"), { getStore: s, setStore: r, clearStore: a } = e.storage, { t: d, changeLocale: c, locale: i } = e.i18n;
    _(""), _("");
    const l = async () => {
      a(), location.reload();
    }, v = ($) => {
      e.theme.set($), e.emitter.emit("vf-theme-saved");
    }, b = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? xe : ye, r("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
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
      }).filter(([$]) => Object.keys(g).includes($))
    ), E = ee(() => ({
      system: d("System"),
      light: d("Light"),
      dark: d("Dark")
    }));
    return ($, f) => (n(), L(W, null, {
      buttons: A(() => [
        t("button", {
          type: "button",
          onClick: f[5] || (f[5] = (h) => o(e).emitter.emit("vf-modal-close")),
          class: "vf-btn vf-btn-secondary"
        }, u(o(d)("Close")), 1)
      ]),
      default: A(() => [
        t("div", nl, [
          ll,
          t("div", il, [
            t("div", dl, [
              t("div", null, [
                t("h3", cl, u(o(d)("Settings")), 1)
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
                          "onUpdate:modelValue": f[0] || (f[0] = (h) => o(e).metricUnits = h),
                          onClick: b,
                          class: "h-4 w-4 rounded border-gray-300 text-indigo-600 dark:accent-slate-400 focus:ring-indigo-600"
                        }, null, 512), [
                          [Oe, o(e).metricUnits]
                        ])
                      ]),
                      t("div", hl, [
                        t("label", fl, [
                          N(u(o(d)("Use Metric Units")) + " ", 1),
                          H(ve, {
                            class: "ms-3",
                            on: "vf-metric-units-saved"
                          }, {
                            default: A(() => [
                              N(u(o(d)("Saved.")), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ]),
                    t("div", gl, [
                      t("div", _l, [
                        t("label", kl, u(o(d)("Theme")), 1)
                      ]),
                      t("div", bl, [
                        q(t("select", {
                          id: "theme",
                          "onUpdate:modelValue": f[1] || (f[1] = (h) => o(e).theme.value = h),
                          onChange: f[2] || (f[2] = (h) => v(h.target.value)),
                          class: "flex-shrink-0 w-full text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded"
                        }, [
                          t("optgroup", {
                            label: o(d)("Theme")
                          }, [
                            (n(!0), m(U, null, I(E.value, (h, V) => (n(), m("option", { value: V }, u(h), 9, xl))), 256))
                          ], 8, yl)
                        ], 544), [
                          [pe, o(e).theme.value]
                        ]),
                        H(ve, {
                          class: "ms-3 flex-shrink-0 flex-grow basis-full",
                          on: "vf-theme-saved"
                        }, {
                          default: A(() => [
                            N(u(o(d)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ]),
                    o(e).features.includes(o(B).LANGUAGE) && Object.keys(o(y)).length > 1 ? (n(), m("div", wl, [
                      t("div", $l, [
                        t("label", Cl, u(o(d)("Language")), 1)
                      ]),
                      t("div", Sl, [
                        q(t("select", {
                          id: "language",
                          "onUpdate:modelValue": f[3] || (f[3] = (h) => _e(i) ? i.value = h : null),
                          onChange: f[4] || (f[4] = (h) => o(c)(h.target.value)),
                          class: "flex-shrink-0 w-1/2 sm:w-full text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded"
                        }, [
                          t("optgroup", {
                            label: o(d)("Language")
                          }, [
                            (n(!0), m(U, null, I(o(y), (h, V) => (n(), m("option", { value: V }, u(h), 9, El))), 256))
                          ], 8, Ml)
                        ], 544), [
                          [pe, o(i)]
                        ]),
                        H(ve, {
                          class: "ms-3 flex-shrink-0 flex-grow basis-full",
                          on: "vf-language-saved"
                        }, {
                          default: A(() => [
                            N(u(o(d)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])) : M("", !0),
                    t("button", {
                      onClick: l,
                      type: "button",
                      class: "vf-btn vf-btn-secondary"
                    }, u(o(d)("Reset Settings")), 1)
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
    for (const r of Object.values(Al))
      p.component(r.name, r);
    e.i18n = e.i18n ?? {};
    let [s] = Object.keys(e.i18n);
    e.locale = e.locale ?? s ?? "en", p.provide("VueFinderOptions", e);
  }
};
export {
  Rl as default
};
