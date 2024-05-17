var Dn = Object.defineProperty;
var Mn = (t, e, s) => e in t ? Dn(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s;
var to = (t, e, s) => (Mn(t, typeof e != "symbol" ? e + "" : e, s), s);
import { reactive as Ot, watch as At, ref as D, shallowRef as Ln, onMounted as Me, onUnmounted as On, onUpdated as Ao, nextTick as Dt, computed as vt, inject as fe, openBlock as v, createElementBlock as _, withKeys as _t, unref as a, createElementVNode as l, withModifiers as tt, renderSlot as Gt, normalizeClass as ye, createCommentVNode as K, createBlock as te, withCtx as ne, toDisplayString as x, withDirectives as Se, vModelText as wt, createTextVNode as he, Fragment as ke, renderList as Re, onBeforeUnmount as Do, createVNode as re, customRef as Tn, vShow as at, isRef as Hn, TransitionGroup as Rn, normalizeStyle as Ns, vModelSelect as Bn, provide as In, Transition as Fn, resolveDynamicComponent as Nn } from "vue";
import Vn from "mitt";
import zn from "dragselect";
import Pn from "@uppy/core";
import Un from "@uppy/xhr-upload";
import jn from "vanilla-lazyload";
import "cropperjs/dist/cropper.css";
import qn from "cropperjs";
import "microtip/microtip.css";
var Eo;
const hs = (Eo = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : Eo.getAttribute("content");
class Gn {
  /** @param {RequestConfig} config */
  constructor(e) {
    /** @type {RequestConfig} */
    to(this, "config");
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
    hs != null && hs !== "" && (n[s.xsrfHeaderName] = hs);
    const o = Object.assign({}, s.headers, n, e.headers), r = Object.assign({}, s.params, e.params), c = e.body, d = s.baseUrl + e.url, i = e.method;
    let u;
    i !== "get" && (c instanceof FormData ? (u = c, s.body != null && Object.entries(this.config.body).forEach(([f, p]) => {
      u.append(f, p);
    })) : (u = { ...c }, s.body != null && Object.assign(u, this.config.body)));
    const m = {
      url: d,
      method: i,
      headers: o,
      params: r,
      body: u
    };
    if (s.transformRequest != null) {
      const f = s.transformRequest({
        url: d,
        method: i,
        headers: o,
        params: r,
        body: u
      });
      f.url != null && (m.url = f.url), f.method != null && (m.method = f.method), f.params != null && (m.params = f.params ?? {}), f.headers != null && (m.headers = f.headers ?? {}), f.body != null && (m.body = f.body);
    }
    return m;
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
        const d = r.baseUrl + "/refreshSession.php", i = new XMLHttpRequest();
        if (i.open("GET", d, !1), i.withCredentials = !1, i.setRequestHeader("Authorization", r.headers.Authorization), i.send(), i.status === 200) {
          const u = JSON.parse(i.responseText);
          window.vueFinderSessionKey = u.sessionKey, n = window.vueFinderSessionKey, window.vueFinderSessionKeyDate = /* @__PURE__ */ new Date();
        }
      } catch (d) {
        console.error(d);
      }
    const c = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: s.path, sessionKey: n }
    });
    return c.url + "?" + new URLSearchParams(c.params).toString();
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
function Kn(t) {
  const e = {
    baseUrl: "",
    headers: {},
    params: {},
    body: {},
    xsrfHeaderName: "X-CSRF-Token"
  };
  return typeof t == "string" ? Object.assign(e, { baseUrl: t }) : Object.assign(e, t), new Gn(e);
}
function Wn(t) {
  let e = localStorage.getItem(t + "_storage");
  const s = Ot(JSON.parse(e ?? "{}"));
  At(s, n);
  function n() {
    Object.keys(s).length ? localStorage.setItem(t + "_storage", JSON.stringify(s)) : localStorage.removeItem(t + "_storage");
  }
  function o(i, u) {
    s[i] = u;
  }
  function r(i) {
    delete s[i];
  }
  function c() {
    Object.keys(s).map((i) => r(i));
  }
  return { getStore: (i, u = null) => s.hasOwnProperty(i) ? s[i] : u, setStore: o, removeStore: r, clearStore: c };
}
async function Yn(t, e) {
  const s = e[t];
  return typeof s == "function" ? (await s()).default : s;
}
function Jn(t, e, s, n) {
  const { getStore: o, setStore: r } = t, c = D({}), d = D(o("locale", e)), i = (f, p = e) => {
    Yn(f, n).then((h) => {
      c.value = h, r("locale", f), d.value = f, r("translations", h), Object.values(n).length > 1 && (s.emit("vf-toast-push", { label: "The language is set to " + f }), s.emit("vf-language-saved"));
    }).catch((h) => {
      p ? (s.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), i(p, null)) : s.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  !o("locale") && !n.length ? i(e) : c.value = o("translations");
  const u = (f, ...p) => p.length ? u(f = f.replace("%s", p.shift()), ...p) : f;
  function m(f, ...p) {
    return c.value && c.value.hasOwnProperty(f) ? u(c.value[f], ...p) : u(f, ...p);
  }
  return { t: m, changeLocale: i, locale: d };
}
const be = {
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
}, Xn = Object.values(be), Zn = "2.4.4";
function Qn(t, e, s, n, o) {
  return (e = Math, s = e.log, n = 1024, o = s(t) / s(n) | 0, t / e.pow(n, o)).toFixed(0) + " " + (o ? "KMGTPEZY"[--o] + "iB" : "B");
}
function er(t, e, s, n, o) {
  return (e = Math, s = e.log, n = 1e3, o = s(t) / s(n) | 0, t / e.pow(n, o)).toFixed(0) + " " + (o ? "KMGTPEZY"[--o] + "B" : "B");
}
function tr(t) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, n = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(t);
  return n[1] * Math.pow(1024, e[n[2].toLowerCase()]);
}
const Ze = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function sr(t, e) {
  const s = D(Ze.SYSTEM), n = D(Ze.LIGHT);
  s.value = t.getStore("theme", e ?? Ze.SYSTEM);
  const o = window.matchMedia("(prefers-color-scheme: dark)"), r = (c) => {
    s.value === Ze.DARK || s.value === Ze.SYSTEM && c.matches ? n.value = Ze.DARK : n.value = Ze.LIGHT;
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
      s.value = c, c !== Ze.SYSTEM ? t.setStore("theme", c) : t.removeStore("theme"), r(o);
    }
  };
}
function or() {
  const t = Ln(null), e = D(!1), s = D();
  return { visible: e, type: t, data: s, open: (r, c = null) => {
    e.value = !0, t.value = r, s.value = c;
  }, close: () => {
    e.value = !1, t.value = null;
  } };
}
/*!
 * OverlayScrollbars
 * Version: 2.8.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
const Te = (t, e) => {
  const { o: s, i: n, u: o } = t;
  let r = s, c;
  const d = (m, f) => {
    const p = r, h = m, g = f || (n ? !n(p, h) : p !== h);
    return (g || o) && (r = h, c = p), [r, g, c];
  };
  return [e ? (m) => d(e(r, c), m) : d, (m) => [r, !!m, c]];
}, Mo = typeof window < "u" && typeof document < "u", De = Mo ? window : {}, Ut = Math.max, nr = Math.min, ks = Math.round, Kt = Math.abs, so = Math.sign, Lo = De.cancelAnimationFrame, Oo = De.requestAnimationFrame, Wt = De.setTimeout, $s = De.clearTimeout, ts = (t) => typeof De[t] < "u" ? De[t] : void 0, rr = ts("MutationObserver"), oo = ts("IntersectionObserver"), Yt = ts("ResizeObserver"), Ss = ts("ScrollTimeline"), To = Mo && Node.ELEMENT_NODE, { toString: ar, hasOwnProperty: gs } = Object.prototype, lr = /^\[object (.+)\]$/, Tt = (t) => t === void 0, ss = (t) => t === null, ir = (t) => Tt(t) || ss(t) ? `${t}` : ar.call(t).replace(lr, "$1").toLowerCase(), qe = (t) => typeof t == "number", os = (t) => typeof t == "string", Ho = (t) => typeof t == "boolean", Fe = (t) => typeof t == "function", Ge = (t) => Array.isArray(t), Mt = (t) => typeof t == "object" && !Ge(t) && !ss(t), ns = (t) => {
  const e = !!t && t.length, s = qe(e) && e > -1 && e % 1 == 0;
  return Ge(t) || !Fe(t) && s ? e > 0 && Mt(t) ? e - 1 in t : !0 : !1;
}, Jt = (t) => {
  if (!t || !Mt(t) || ir(t) !== "object")
    return !1;
  let e;
  const s = "constructor", n = t[s], o = n && n.prototype, r = gs.call(t, s), c = o && gs.call(o, "isPrototypeOf");
  if (n && !r && !c)
    return !1;
  for (e in t)
    ;
  return Tt(e) || gs.call(t, e);
}, Xt = (t) => {
  const e = HTMLElement;
  return t ? e ? t instanceof e : t.nodeType === To : !1;
}, rs = (t) => {
  const e = Element;
  return t ? e ? t instanceof e : t.nodeType === To : !1;
};
function oe(t, e) {
  if (ns(t))
    for (let s = 0; s < t.length && e(t[s], s, t) !== !1; s++)
      ;
  else
    t && oe(Object.keys(t), (s) => e(t[s], s, t));
  return t;
}
const as = (t, e) => t.indexOf(e) >= 0, We = (t, e) => t.concat(e), ve = (t, e, s) => (!os(e) && ns(e) ? Array.prototype.push.apply(t, e) : t.push(e), t), nt = (t) => Array.from(t || []), Ro = (t) => Ge(t) ? t : [t], Cs = (t) => !!t && !t.length, no = (t) => nt(new Set(t)), Ne = (t, e, s) => {
  oe(t, (o) => o && o.apply(void 0, e || [])), !s && (t.length = 0);
}, Bo = "paddingTop", Io = "paddingRight", Fo = "paddingLeft", No = "paddingBottom", Vo = "marginLeft", zo = "marginRight", Po = "marginBottom", cr = "overflowX", dr = "overflowY", ht = "width", gt = "height", et = "visible", lt = "hidden", bt = "scroll", ur = (t) => {
  const e = String(t || "");
  return e ? e[0].toUpperCase() + e.slice(1) : "";
}, ls = (t, e, s, n) => {
  if (t && e) {
    let o = !0;
    return oe(s, (r) => {
      const c = t[r], d = e[r];
      c !== d && (o = !1);
    }), o;
  }
  return !1;
}, Uo = (t, e) => ls(t, e, ["w", "h"]), jt = (t, e) => ls(t, e, ["x", "y"]), mr = (t, e) => ls(t, e, ["t", "r", "b", "l"]), st = () => {
}, J = (t, ...e) => t.bind(0, ...e), it = (t) => {
  let e;
  const s = t ? Wt : Oo, n = t ? $s : Lo;
  return [(o) => {
    n(e), e = s(o, Fe(t) ? t() : t);
  }, () => n(e)];
}, jo = (t, e) => {
  let s, n, o, r = st;
  const { _: c, p: d, v: i } = e || {}, u = function(g) {
    r(), $s(s), s = n = void 0, r = st, t.apply(this, g);
  }, m = (h) => i && n ? i(n, h) : h, f = () => {
    r !== st && u(m(o) || o);
  }, p = function() {
    const g = nt(arguments), y = Fe(c) ? c() : c;
    if (qe(y) && y >= 0) {
      const C = Fe(d) ? d() : d, b = qe(C) && C >= 0, S = y > 0 ? Wt : Oo, N = y > 0 ? $s : Lo, k = m(g) || g, L = u.bind(0, k);
      r();
      const P = S(L, y);
      r = () => N(P), b && !s && (s = Wt(f, C)), n = o = k;
    } else
      u(g);
  };
  return p.S = f, p;
}, qo = (t, e) => Object.prototype.hasOwnProperty.call(t, e), Ye = (t) => t ? Object.keys(t) : [], se = (t, e, s, n, o, r, c) => {
  const d = [e, s, n, o, r, c];
  return (typeof t != "object" || ss(t)) && !Fe(t) && (t = {}), oe(d, (i) => {
    oe(i, (u, m) => {
      const f = i[m];
      if (t === f)
        return !0;
      const p = Ge(f);
      if (f && Jt(f)) {
        const h = t[m];
        let g = h;
        p && !Ge(h) ? g = [] : !p && !Jt(h) && (g = {}), t[m] = se(g, f);
      } else
        t[m] = p ? f.slice() : f;
    });
  }), t;
}, Go = (t, e) => oe(se({}, t), (s, n, o) => {
  s === void 0 ? delete o[n] : s && Jt(s) && (o[n] = Go(s));
}), Vs = (t) => {
  for (const e in t)
    return !1;
  return !0;
}, Es = (t, e, s) => Ut(t, nr(e, s)), ct = (t) => nt(new Set((Ge(t) ? t : (t || "").split(" ")).filter((e) => e))), is = (t, e) => t && t.getAttribute(e), ro = (t, e) => t && t.hasAttribute(e), Ue = (t, e, s) => {
  oe(ct(e), (n) => {
    t && t.setAttribute(n, String(s || ""));
  });
}, Ve = (t, e) => {
  oe(ct(e), (s) => t && t.removeAttribute(s));
}, cs = (t, e) => {
  const s = ct(is(t, e)), n = J(Ue, t, e), o = (r, c) => {
    const d = new Set(s);
    return oe(ct(r), (i) => {
      d[c](i);
    }), nt(d).join(" ");
  };
  return {
    m: (r) => n(o(r, "delete")),
    O: (r) => n(o(r, "add")),
    $: (r) => {
      const c = ct(r);
      return c.reduce((d, i) => d && s.includes(i), c.length > 0);
    }
  };
}, Ko = (t, e, s) => (cs(t, e).m(s), J(zs, t, e, s)), zs = (t, e, s) => (cs(t, e).O(s), J(Ko, t, e, s)), As = (t, e, s, n) => (n ? zs : Ko)(t, e, s), fr = (t, e, s) => cs(t, e).$(s), Wo = (t) => cs(t, "class"), Yo = (t, e) => {
  Wo(t).m(e);
}, Ps = (t, e) => (Wo(t).O(e), J(Yo, t, e)), Jo = (t, e) => {
  const s = [], n = e ? rs(e) && e : document;
  return n ? ve(s, n.querySelectorAll(t)) : s;
}, pr = (t, e) => {
  const s = e ? rs(e) && e : document;
  return s ? s.querySelector(t) : null;
}, Zt = (t, e) => rs(t) ? t.matches(e) : !1, Xo = (t) => Zt(t, "body"), Ds = (t) => t ? nt(t.childNodes) : [], yt = (t) => t && t.parentElement, mt = (t, e) => rs(t) && t.closest(e), Ms = (t) => document.activeElement, vr = (t, e, s) => {
  const n = mt(t, e), o = t && pr(s, n), r = mt(o, e) === n;
  return n && o ? n === t || o === t || r && mt(mt(t, s), e) !== n : !1;
}, ot = (t) => {
  if (ns(t))
    oe(nt(t), (e) => ot(e));
  else if (t) {
    const e = yt(t);
    e && e.removeChild(t);
  }
}, Zo = (t, e, s) => {
  if (s && t) {
    let n = e, o;
    return ns(s) ? (o = document.createDocumentFragment(), oe(s, (r) => {
      r === n && (n = r.previousSibling), o.appendChild(r);
    })) : o = s, e && (n ? n !== e && (n = n.nextSibling) : n = t.firstChild), t.insertBefore(o, n || null), () => ot(s);
  }
  return st;
}, He = (t, e) => Zo(t, null, e), ao = (t, e) => Zo(yt(t), t && t.nextSibling, e), ft = (t) => {
  const e = document.createElement("div");
  return Ue(e, "class", t), e;
}, Qo = (t) => {
  const e = ft();
  return e.innerHTML = t.trim(), oe(Ds(e), (s) => ot(s));
}, hr = /^--/, lo = (t, e) => t.getPropertyValue(e) || t[e] || "", Us = (t) => {
  const e = t || 0;
  return isFinite(e) ? e : 0;
}, Vt = (t) => Us(parseFloat(t || "")), io = (t) => `${(Us(t) * 100).toFixed(3)}%`, Ls = (t) => `${Us(t)}px`;
function Lt(t, e) {
  t && e && oe(e, (s, n) => {
    try {
      const o = t.style, r = qe(s) ? Ls(s) : (s || "") + "";
      hr.test(n) ? o.setProperty(n, r) : o[n] = r;
    } catch {
    }
  });
}
function dt(t, e, s) {
  const n = os(e);
  let o = n ? "" : {};
  if (t) {
    const r = De.getComputedStyle(t, s) || t.style;
    o = n ? lo(r, e) : nt(e).reduce((c, d) => (c[d] = lo(r, d), c), o);
  }
  return o;
}
const co = (t, e, s) => {
  const n = e ? `${e}-` : "", o = s ? `-${s}` : "", r = `${n}top${o}`, c = `${n}right${o}`, d = `${n}bottom${o}`, i = `${n}left${o}`, u = dt(t, [r, c, d, i]);
  return {
    t: Vt(u[r]),
    r: Vt(u[c]),
    b: Vt(u[d]),
    l: Vt(u[i])
  };
}, bs = (t, e) => `translate${Mt(t) ? `(${t.x},${t.y})` : `${e ? "X" : "Y"}(${t})`}`, gr = (t) => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length), br = {
  w: 0,
  h: 0
}, ds = (t, e) => e ? {
  w: e[`${t}Width`],
  h: e[`${t}Height`]
} : br, yr = (t) => ds("inner", t || De), Ct = J(ds, "offset"), en = J(ds, "client"), Qt = J(ds, "scroll"), js = (t) => {
  const e = parseFloat(dt(t, ht)) || 0, s = parseFloat(dt(t, gt)) || 0;
  return {
    w: e - ks(e),
    h: s - ks(s)
  };
}, Et = (t) => t.getBoundingClientRect(), _r = (t) => !!t && gr(t), Os = (t) => !!(t && (t[gt] || t[ht])), tn = (t, e) => {
  const s = Os(t);
  return !Os(e) && s;
}, uo = (t, e, s, n) => {
  oe(ct(e), (o) => {
    t && t.removeEventListener(o, s, n);
  });
}, me = (t, e, s, n) => {
  var o;
  const r = (o = n && n.C) != null ? o : !0, c = n && n.H || !1, d = n && n.A || !1, i = {
    passive: r,
    capture: c
  };
  return J(Ne, ct(e).map((u) => {
    const m = d ? (f) => {
      uo(t, u, m, c), s && s(f);
    } : s;
    return t && t.addEventListener(u, m, i), J(uo, t, u, m, c);
  }));
}, qs = (t) => t.stopPropagation(), Ts = (t) => t.preventDefault(), wr = (t) => qs(t) || Ts(t), je = (t, e) => {
  const { x: s, y: n } = qe(e) ? {
    x: e,
    y: e
  } : e || {};
  qe(s) && (t.scrollLeft = s), qe(n) && (t.scrollTop = n);
}, Ie = (t) => ({
  x: t.scrollLeft,
  y: t.scrollTop
}), sn = () => ({
  I: {
    x: 0,
    y: 0
  },
  T: {
    x: 0,
    y: 0
  }
}), xr = (t, e) => {
  const { I: s, T: n } = t, { w: o, h: r } = e, c = (f, p, h) => {
    let g = so(f) * h, y = so(p) * h;
    if (g === y) {
      const w = Kt(f), C = Kt(p);
      y = w > C ? 0 : y, g = w < C ? 0 : g;
    }
    return [g + 0, y + 0];
  }, [d, i] = c(s.x, n.x, o), [u, m] = c(s.y, n.y, r);
  return {
    I: {
      x: d,
      y: u
    },
    T: {
      x: i,
      y: m
    }
  };
}, mo = ({ I: t, T: e }) => {
  const s = (n, o) => n === 0 && n <= o;
  return {
    x: s(t.x, e.x),
    y: s(t.y, e.y)
  };
}, fo = ({ I: t, T: e }, s) => {
  const n = (o, r, c) => Es(0, 1, (o - c) / (o - r) || 0);
  return {
    x: n(t.x, e.x, s.x),
    y: n(t.y, e.y, s.y)
  };
}, po = (t, e) => {
  oe(Ro(e), t);
}, Hs = (t) => {
  const e = /* @__PURE__ */ new Map(), s = (r, c) => {
    if (r) {
      const d = e.get(r);
      po((i) => {
        d && d[i ? "delete" : "clear"](i);
      }, c);
    } else
      e.forEach((d) => {
        d.clear();
      }), e.clear();
  }, n = (r, c) => {
    if (os(r)) {
      const u = e.get(r) || /* @__PURE__ */ new Set();
      return e.set(r, u), po((m) => {
        Fe(m) && u.add(m);
      }, c), J(s, r, c);
    }
    Ho(c) && c && s();
    const d = Ye(r), i = [];
    return oe(d, (u) => {
      const m = r[u];
      m && ve(i, n(u, m));
    }), J(Ne, i);
  }, o = (r, c) => {
    oe(nt(e.get(r)), (d) => {
      c && !Cs(c) ? d.apply(0, c) : d();
    });
  };
  return n(t || {}), [n, s, o];
}, vo = (t) => JSON.stringify(t, (e, s) => {
  if (Fe(s))
    throw 0;
  return s;
}), ho = (t, e) => t ? `${e}`.split(".").reduce((s, n) => s && qo(s, n) ? s[n] : void 0, t) : void 0, kr = {
  paddingAbsolute: !1,
  showNativeOverlaidScrollbars: !1,
  update: {
    elementEvents: [["img", "load"]],
    debounce: [0, 33],
    attributes: null,
    ignoreMutation: null
  },
  overflow: {
    x: "scroll",
    y: "scroll"
  },
  scrollbars: {
    theme: "os-theme-dark",
    visibility: "auto",
    autoHide: "never",
    autoHideDelay: 1300,
    autoHideSuspend: !1,
    dragScroll: !0,
    clickScroll: !1,
    pointers: ["mouse", "touch", "pen"]
  }
}, on = (t, e) => {
  const s = {}, n = We(Ye(e), Ye(t));
  return oe(n, (o) => {
    const r = t[o], c = e[o];
    if (Mt(r) && Mt(c))
      se(s[o] = {}, on(r, c)), Vs(s[o]) && delete s[o];
    else if (qo(e, o) && c !== r) {
      let d = !0;
      if (Ge(r) || Ge(c))
        try {
          vo(r) === vo(c) && (d = !1);
        } catch {
        }
      d && (s[o] = c);
    }
  }), s;
}, go = (t, e, s) => (n) => [ho(t, n), s || ho(e, n) !== void 0], xt = "data-overlayscrollbars", qt = "os-environment", zt = `${qt}-scrollbar-hidden`, ys = `${xt}-initialize`, bo = "noClipping", yo = `${xt}-body`, pt = xt, $r = "host", Qe = `${xt}-viewport`, Sr = cr, Cr = dr, Er = "arrange", Gs = "measuring", nn = "scrollbarHidden", Ar = "scrollbarPressed", Dr = "noContent", Rs = `${xt}-padding`, _o = `${xt}-content`, Ks = "os-size-observer", Mr = `${Ks}-appear`, Lr = `${Ks}-listener`, Or = "os-trinsic-observer", Tr = "os-theme-none", Be = "os-scrollbar", Hr = `${Be}-rtl`, Rr = `${Be}-horizontal`, Br = `${Be}-vertical`, rn = `${Be}-track`, Ws = `${Be}-handle`, Ir = `${Be}-visible`, Fr = `${Be}-cornerless`, wo = `${Be}-interaction`, xo = `${Be}-unusable`, Bs = `${Be}-auto-hide`, ko = `${Bs}-hidden`, $o = `${Be}-wheel`, Nr = `${rn}-interactive`, Vr = `${Ws}-interactive`;
let _s;
const zr = () => {
  const t = (b, S, N) => {
    He(document.body, b), He(document.body, b);
    const O = en(b), k = Ct(b), L = js(S);
    return N && ot(b), {
      x: k.h - O.h + L.h,
      y: k.w - O.w + L.w
    };
  }, e = (b) => {
    let S = !1;
    const N = Ps(b, zt);
    try {
      S = dt(b, "scrollbar-width") === "none" || dt(b, "display", "::-webkit-scrollbar") === "none";
    } catch {
    }
    return N(), S;
  }, s = `.${qt}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${qt} div{width:200%;height:200%;margin:10px 0}.${zt}{scrollbar-width:none!important}.${zt}::-webkit-scrollbar,.${zt}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`, o = Qo(`<div class="${qt}"><div></div><style>${s}</style></div>`)[0], r = o.firstChild, [c, , d] = Hs(), [i, u] = Te({
    o: t(o, r),
    i: jt
  }, J(t, o, r, !0)), [m] = u(), f = e(o), p = {
    x: m.x === 0,
    y: m.y === 0
  }, h = {
    elements: {
      host: null,
      padding: !f,
      viewport: (b) => f && Xo(b) && b,
      content: !1
    },
    scrollbars: {
      slot: !0
    },
    cancel: {
      nativeScrollbarsOverlaid: !1,
      body: null
    }
  }, g = se({}, kr), y = J(se, {}, g), w = J(se, {}, h), C = {
    D: m,
    k: p,
    R: f,
    M: !!Ss,
    V: J(c, "r"),
    L: w,
    P: (b) => se(h, b) && w(),
    U: y,
    N: (b) => se(g, b) && y(),
    j: se({}, h),
    q: se({}, g)
  };
  if (Ve(o, "style"), ot(o), me(De, "resize", () => {
    d("r", []);
  }), Fe(De.matchMedia) && !f && (!p.x || !p.y)) {
    const b = (S) => {
      const N = De.matchMedia(`(resolution: ${De.devicePixelRatio}dppx)`);
      me(N, "change", () => {
        S(), b(S);
      }, {
        A: !0
      });
    };
    b(() => {
      const [S, N] = i();
      se(C.D, S), d("r", [N]);
    });
  }
  return C;
}, ze = () => (_s || (_s = zr()), _s), an = (t, e) => Fe(e) ? e.apply(0, t) : e, Pr = (t, e, s, n) => {
  const o = Tt(n) ? s : n;
  return an(t, o) || e.apply(0, t);
}, ln = (t, e, s, n) => {
  const o = Tt(n) ? s : n, r = an(t, o);
  return !!r && (Xt(r) ? r : e.apply(0, t));
}, Ur = (t, e) => {
  const { nativeScrollbarsOverlaid: s, body: n } = e || {}, { k: o, R: r, L: c } = ze(), { nativeScrollbarsOverlaid: d, body: i } = c().cancel, u = s ?? d, m = Tt(n) ? i : n, f = (o.x || o.y) && u, p = t && (ss(m) ? !r : m);
  return !!f || !!p;
}, Ys = /* @__PURE__ */ new WeakMap(), jr = (t, e) => {
  Ys.set(t, e);
}, qr = (t) => {
  Ys.delete(t);
}, cn = (t) => Ys.get(t), Gr = (t, e, s) => {
  let n = !1;
  const o = s ? /* @__PURE__ */ new WeakMap() : !1, r = () => {
    n = !0;
  }, c = (d) => {
    if (o && s) {
      const i = s.map((u) => {
        const [m, f] = u || [];
        return [f && m ? (d || Jo)(m, t) : [], f];
      });
      oe(i, (u) => oe(u[0], (m) => {
        const f = u[1], p = o.get(m) || [];
        if (t.contains(m) && f) {
          const g = me(m, f, (y) => {
            n ? (g(), o.delete(m)) : e(y);
          });
          o.set(m, ve(p, g));
        } else
          Ne(p), o.delete(m);
      }));
    }
  };
  return c(), [r, c];
}, So = (t, e, s, n) => {
  let o = !1;
  const { F: r, B: c, X: d, Y: i, W: u, J: m } = n || {}, f = jo(() => o && s(!0), {
    _: 33,
    p: 99
  }), [p, h] = Gr(t, f, d), g = r || [], y = c || [], w = We(g, y), C = (S, N) => {
    if (!Cs(N)) {
      const O = u || st, k = m || st, L = [], P = [];
      let I = !1, V = !1;
      if (oe(N, (B) => {
        const { attributeName: T, target: A, type: $, oldValue: M, addedNodes: F, removedNodes: Z } = B, ie = $ === "attributes", ae = $ === "childList", H = t === A, X = ie && T, ee = X && is(A, T || "") || null, U = X && M !== ee, ce = as(y, T) && U;
        if (e && (ae || !H)) {
          const z = ie && U, Y = z && i && Zt(A, i), G = (Y ? !O(A, T, M, ee) : !ie || z) && !k(B, !!Y, t, n);
          oe(F, (E) => ve(L, E)), oe(Z, (E) => ve(L, E)), V = V || G;
        }
        !e && H && U && !O(A, T, M, ee) && (ve(P, T), I = I || ce);
      }), h((B) => no(L).reduce((T, A) => (ve(T, Jo(B, A)), Zt(A, B) ? ve(T, A) : T), [])), e)
        return !S && V && s(!1), [!1];
      if (!Cs(P) || I) {
        const B = [no(P), I];
        return !S && s.apply(0, B), B;
      }
    }
  }, b = new rr(J(C, !1));
  return [() => (b.observe(t, {
    attributes: !0,
    attributeOldValue: !0,
    attributeFilter: w,
    subtree: e,
    childList: e,
    characterData: e
  }), o = !0, () => {
    o && (p(), b.disconnect(), o = !1);
  }), () => {
    if (o)
      return f.S(), C(!0, b.takeRecords());
  }];
}, dn = {}, un = {}, Kr = (t) => {
  oe(t, (e) => oe(e, (s, n) => {
    dn[n] = e[n];
  }));
}, mn = (t, e, s) => Ye(t).map((n) => {
  const { static: o, instance: r } = t[n], [c, d, i] = s || [], u = s ? r : o;
  if (u) {
    const m = s ? u(c, d, e) : u(e);
    return (i || un)[n] = m;
  }
}), Ht = (t) => un[t], Wr = "__osOptionsValidationPlugin", Yr = "__osSizeObserverPlugin", Jr = (t, e) => {
  const { k: s } = e, [n, o] = t("showNativeOverlaidScrollbars");
  return [n && s.x && s.y, o];
}, es = (t) => t.indexOf(et) === 0, Xr = (t, e) => {
  const s = (o, r, c, d) => {
    const i = o === et ? lt : o.replace(`${et}-`, ""), u = es(o), m = es(c);
    return !r && !d ? lt : u && m ? et : u ? r && d ? i : r ? et : lt : r ? i : m && d ? et : lt;
  }, n = {
    x: s(e.x, t.x, e.y, t.y),
    y: s(e.y, t.y, e.x, t.x)
  };
  return {
    K: n,
    G: {
      x: n.x === bt,
      y: n.y === bt
    }
  };
}, fn = "__osScrollbarsHidingPlugin", Zr = "__osClickScrollPlugin", pn = (t, e, s) => {
  const { dt: n } = s || {}, o = Ht(Yr), [r] = Te({
    o: !1,
    u: !0
  });
  return () => {
    const c = [], i = Qo(`<div class="${Ks}"><div class="${Lr}"></div></div>`)[0], u = i.firstChild, m = (f) => {
      const p = f instanceof ResizeObserverEntry;
      let h = !1, g = !1;
      if (p) {
        const [y, , w] = r(f.contentRect), C = Os(y);
        g = tn(y, w), h = !g && !C;
      } else
        g = f === !0;
      h || e({
        _t: !0,
        dt: g
      });
    };
    if (Yt) {
      const f = new Yt((p) => m(p.pop()));
      f.observe(u), ve(c, () => {
        f.disconnect();
      });
    } else if (o) {
      const [f, p] = o(u, m, n);
      ve(c, We([Ps(i, Mr), me(i, "animationstart", f)], p));
    } else
      return st;
    return J(Ne, ve(c, He(t, i)));
  };
}, Qr = (t, e) => {
  let s;
  const n = (i) => i.h === 0 || i.isIntersecting || i.intersectionRatio > 0, o = ft(Or), [r] = Te({
    o: !1
  }), c = (i, u) => {
    if (i) {
      const m = r(n(i)), [, f] = m;
      return f && !u && e(m) && [m];
    }
  }, d = (i, u) => c(u.pop(), i);
  return [() => {
    const i = [];
    if (oo)
      s = new oo(J(d, !1), {
        root: t
      }), s.observe(o), ve(i, () => {
        s.disconnect();
      });
    else {
      const u = () => {
        const m = Ct(o);
        c(m);
      };
      ve(i, pn(o, u)()), u();
    }
    return J(Ne, ve(i, He(t, o)));
  }, () => s && d(!0, s.takeRecords())];
}, ea = (t, e, s, n) => {
  let o, r, c, d, i, u;
  const { R: m } = ze(), f = `[${pt}]`, p = `[${Qe}]`, h = ["tabindex"], g = ["wrap", "cols", "rows"], y = ["id", "class", "style", "open"], { ft: w, vt: C, nt: b, ht: S, gt: N, bt: O, tt: k, wt: L, yt: P } = t, I = (E) => dt(E, "direction") === "rtl", V = {
    St: !1,
    et: I(w)
  }, B = ze(), T = Ht(fn), [A] = Te({
    i: Uo,
    o: {
      w: 0,
      h: 0
    }
  }, () => {
    const E = T && T.Z(t, e, V, B, s).it, R = !k && L(Er), W = R && Ie(S), q = P(Gs, !0), Q = R && E && E()[0], ue = Qt(N), we = Qt(b), xe = js(b);
    return Q && Q(), je(S, W), q(), {
      w: we.w + ue.w + xe.w,
      h: we.h + ue.h + xe.h
    };
  }), $ = O ? g : We(y, g), M = jo(n, {
    _: () => o,
    p: () => r,
    v(E, R) {
      const [W] = E, [q] = R;
      return [We(Ye(W), Ye(q)).reduce((Q, ue) => (Q[ue] = W[ue] || q[ue], Q), {})];
    }
  }), F = (E) => {
    const R = I(w);
    se(E, {
      Ot: u !== R
    }), se(V, {
      et: R
    }), u = R;
  }, Z = (E) => {
    oe(E || h, (R) => {
      if (as(h, R)) {
        const W = is(C, R);
        os(W) ? Ue(b, R, W) : Ve(b, R);
      }
    });
  }, ie = (E, R) => {
    const [W, q] = E, Q = {
      $t: q
    };
    return se(V, {
      St: W
    }), !R && n(Q), Q;
  }, ae = ({ _t: E, dt: R }) => {
    const q = !(E && !R) && m ? M : n, Q = {
      _t: E || R,
      dt: R
    };
    F(Q), q(Q);
  }, H = (E, R) => {
    const [, W] = A(), q = {
      Ct: W
    };
    return F(q), W && !R && (E ? n : M)(q), q;
  }, X = (E, R, W) => {
    const q = {
      xt: R
    };
    return F(q), R && !W ? M(q) : k || Z(E), q;
  }, { V: ee } = B, [U, ce] = N ? Qr(C, ie) : [], z = !k && pn(C, ae, {
    dt: !0
  }), [Y, j] = So(C, !1, X, {
    B: y,
    F: We(y, h)
  }), G = k && Yt && new Yt((E) => {
    const R = E[E.length - 1].contentRect;
    ae({
      _t: !0,
      dt: tn(R, i)
    }), i = R;
  });
  return [() => {
    Z(), G && G.observe(C);
    const E = z && z(), R = U && U(), W = Y(), q = ee((Q) => {
      const [, ue] = A();
      M({
        Ht: Q,
        Ct: ue
      });
    });
    return () => {
      G && G.disconnect(), E && E(), R && R(), d && d(), W(), q();
    };
  }, ({ Et: E, zt: R, At: W }) => {
    const q = {}, [Q] = E("update.ignoreMutation"), [ue, we] = E("update.attributes"), [xe, le] = E("update.elementEvents"), [ge, Le] = E("update.debounce"), Ce = le || we, $e = R || W, Ee = (_e) => Fe(Q) && Q(_e);
    if (Ce) {
      c && c(), d && d();
      const [_e, pe] = So(N || b, !0, H, {
        F: We($, ue || []),
        X: xe,
        Y: f,
        J: (de, Oe) => {
          const { target: Ae, attributeName: rt } = de;
          return (!Oe && rt && !k ? vr(Ae, f, p) : !1) || !!mt(Ae, `.${Be}`) || !!Ee(de);
        }
      });
      d = _e(), c = pe;
    }
    if (Le)
      if (M.S(), Ge(ge)) {
        const _e = ge[0], pe = ge[1];
        o = qe(_e) && _e, r = qe(pe) && pe;
      } else
        qe(ge) ? (o = ge, r = !1) : (o = !1, r = !1);
    if ($e) {
      const _e = j(), pe = ce && ce(), de = c && c();
      _e && se(q, X(_e[0], _e[1], $e)), pe && se(q, ie(pe[0], $e)), de && se(q, H(de[0], $e));
    }
    return F(q), q;
  }, V];
}, ta = (t, e, s, n) => {
  const { L: o } = ze(), { scrollbars: r } = o(), { slot: c } = r, { ft: d, vt: i, nt: u, It: m, ht: f, Tt: p, tt: h } = e, { scrollbars: g } = m ? {} : t, { slot: y } = g || {}, w = /* @__PURE__ */ new Map(), C = (z) => Ss && new Ss({
    source: f,
    axis: z
  }), b = {
    x: C("x"),
    y: C("y")
  }, S = ln([d, i, u], () => h && p ? d : i, c, y), N = (z, Y) => {
    if (Y) {
      const q = z ? ht : gt, { Dt: Q, kt: ue } = Y, we = Et(ue)[q], xe = Et(Q)[q];
      return Es(0, 1, we / xe || 0);
    }
    const j = z ? "x" : "y", { Rt: G, Mt: E } = s, R = E[j], W = G[j];
    return Es(0, 1, R / (R + W) || 0);
  }, O = (z, Y, j) => {
    const G = N(j, z);
    return 1 / G * (1 - G) * Y;
  }, k = (z) => se(z, {
    clear: ["left"]
  }), L = (z) => {
    w.forEach((Y, j) => {
      (z ? as(Ro(z), j) : !0) && (oe(Y || [], (E) => {
        E && E.cancel();
      }), w.delete(j));
    });
  }, P = (z, Y, j, G) => {
    const E = w.get(z) || [], R = E.find((W) => W && W.timeline === Y);
    R ? R.effect = new KeyframeEffect(z, j, {
      composite: G
    }) : w.set(z, We(E, [z.animate(j, {
      timeline: Y,
      composite: G
    })]));
  }, I = (z, Y, j) => {
    const G = j ? Ps : Yo;
    oe(z, (E) => {
      G(E.Vt, Y);
    });
  }, V = (z, Y) => {
    oe(z, (j) => {
      const [G, E] = Y(j);
      Lt(G, E);
    });
  }, B = (z, Y) => {
    V(z, (j) => {
      const { kt: G } = j;
      return [G, {
        [Y ? ht : gt]: io(N(Y))
      }];
    });
  }, T = (z, Y) => {
    const { Lt: j } = s, G = Y ? "x" : "y", E = b[G], R = mo(j)[G], W = (q, Q) => bs(io(O(q, R ? Q : 1 - Q, Y)), Y);
    E ? oe(z, (q) => {
      const { kt: Q } = q;
      P(Q, E, k({
        transform: [0, 1].map((ue) => W(q, ue))
      }));
    }) : V(z, (q) => [q.kt, {
      transform: W(q, fo(j, Ie(f))[G])
    }]);
  }, A = (z) => h && !p && yt(z) === u, $ = [], M = [], F = [], Z = (z, Y, j) => {
    const G = Ho(j), E = G ? j : !0, R = G ? !j : !0;
    E && I(M, z, Y), R && I(F, z, Y);
  }, ie = () => {
    B(M, !0), B(F);
  }, ae = () => {
    T(M, !0), T(F);
  }, H = () => {
    if (h) {
      const { Rt: z, Lt: Y } = s, j = mo(Y), G = 0.5;
      if (b.x && b.y)
        oe(We(F, M), ({ Vt: E }) => {
          if (A(E)) {
            const R = (W) => P(E, b[W], k({
              transform: [0, j[W] ? 1 : -1].map((q) => bs(Ls(q * (z[W] - G)), W === "x"))
            }), "add");
            R("x"), R("y");
          } else
            L(E);
        });
      else {
        const E = fo(Y, Ie(f)), R = (W) => {
          const { Vt: q } = W, Q = A(q) && q, ue = (we, xe, le) => {
            const ge = xe * we;
            return Ls(le ? ge : -ge);
          };
          return [Q, Q && {
            transform: bs({
              x: ue(E.x, z.x, j.x),
              y: ue(E.y, z.y, j.y)
            })
          }];
        };
        V(M, R), V(F, R);
      }
    }
  }, X = (z) => {
    const j = ft(`${Be} ${z ? Rr : Br}`), G = ft(rn), E = ft(Ws), R = {
      Vt: j,
      Dt: G,
      kt: E
    };
    return ve(z ? M : F, R), ve($, [He(j, G), He(G, E), J(ot, j), L, n(R, Z, T, z)]), R;
  }, ee = J(X, !0), U = J(X, !1), ce = () => (He(S, M[0].Vt), He(S, F[0].Vt), J(Ne, $));
  return ee(), U(), [{
    Pt: ie,
    Ut: ae,
    Nt: H,
    jt: Z,
    qt: {
      M: b.x,
      Ft: M,
      Bt: ee,
      Xt: J(V, M)
    },
    Yt: {
      M: b.y,
      Ft: F,
      Bt: U,
      Xt: J(V, F)
    }
  }, ce];
}, sa = (t, e, s, n) => (o, r, c, d) => {
  const { vt: i, nt: u, tt: m, ht: f, Wt: p, yt: h } = e, { Vt: g, Dt: y, kt: w } = o, [C, b] = it(333), [S, N] = it(444), [O, k] = it(), L = J(c, [o], d), P = (A) => {
    Fe(f.scrollBy) && f.scrollBy({
      behavior: "smooth",
      left: A.x,
      top: A.y
    });
  }, I = d ? ht : gt, V = () => {
    const A = "pointerup pointercancel lostpointercapture", $ = `client${d ? "X" : "Y"}`, M = d ? "left" : "top", F = d ? "w" : "h", Z = d ? "x" : "y", ie = (ae, H) => (X) => {
      const { Rt: ee } = s, U = Ct(y)[F] - Ct(w)[F], z = H * X / U * ee[Z];
      je(f, {
        [Z]: ae + z
      });
    };
    return me(y, "pointerdown", (ae) => {
      const H = mt(ae.target, `.${Ws}`) === w, X = H ? w : y, ee = t.scrollbars, { button: U, isPrimary: ce, pointerType: z } = ae, { pointers: Y } = ee;
      if (U === 0 && ce && ee[H ? "dragScroll" : "clickScroll"] && (Y || []).includes(z)) {
        N();
        const G = !H && ae.shiftKey, E = J(Et, w), R = J(Et, y), W = (de, Oe) => (de || E())[M] - (Oe || R())[M], q = ks(Et(f)[I]) / Ct(f)[F] || 1, Q = ie(Ie(f)[Z], 1 / q), ue = ae[$], we = E(), xe = R(), le = we[I], ge = W(we, xe) + le / 2, Le = ue - xe[M], Ce = H ? 0 : Le - ge, $e = (de) => {
          Ne(pe), X.releasePointerCapture(de.pointerId);
        }, Ee = () => h(Ar, !0), _e = Ee(), pe = [() => {
          const de = Ie(f);
          _e();
          const Oe = Ie(f), Ae = {
            x: Oe.x - de.x,
            y: Oe.y - de.y
          };
          (Kt(Ae.x) > 3 || Kt(Ae.y) > 3) && (Ee(), je(f, de), P(Ae), S(_e));
        }, me(p, A, $e), me(p, "selectstart", (de) => Ts(de), {
          C: !1
        }), me(y, A, $e), me(y, "pointermove", (de) => {
          const Oe = de[$] - ue;
          (H || G) && Q(Ce + Oe);
        })];
        if (X.setPointerCapture(ae.pointerId), G)
          Q(Ce);
        else if (!H) {
          const de = Ht(Zr);
          de && ve(pe, de(Q, W, Ce, le, Le));
        }
      }
    });
  };
  let B = !0;
  const T = (A) => A.propertyName.indexOf(I) > -1;
  return J(Ne, [me(w, "pointermove pointerleave", n), me(g, "pointerenter", () => {
    r(wo, !0);
  }), me(g, "pointerleave pointercancel", () => {
    r(wo, !1);
  }), !m && me(g, "mousedown", () => {
    const A = Ms();
    (ro(A, Qe) || ro(A, pt) || A === document.body) && Wt(() => {
      u.focus({
        preventScroll: !0
      });
    }, 25);
  }), me(g, "wheel", (A) => {
    const { deltaX: $, deltaY: M, deltaMode: F } = A;
    B && F === 0 && yt(g) === i && P({
      x: $,
      y: M
    }), B = !1, r($o, !0), C(() => {
      B = !0, r($o);
    }), Ts(A);
  }, {
    C: !1,
    H: !0
  }), me(w, "transitionstart", (A) => {
    if (T(A)) {
      const $ = () => {
        L(), O($);
      };
      $();
    }
  }), me(w, "transitionend transitioncancel", (A) => {
    T(A) && (k(), L());
  }), me(g, "pointerdown", J(me, p, "click", wr, {
    A: !0,
    H: !0,
    C: !1
  }), {
    H: !0
  }), V(), b, N, k]);
}, oa = (t, e, s, n, o, r) => {
  let c, d, i, u, m, f = st, p = 0;
  const h = (H) => H.pointerType === "mouse", [g, y] = it(), [w, C] = it(100), [b, S] = it(100), [N, O] = it(() => p), [k, L] = ta(t, o, n, sa(e, o, n, (H) => h(H) && F())), { vt: P, Jt: I, Tt: V } = o, { jt: B, Pt: T, Ut: A, Nt: $ } = k, M = (H, X) => {
    if (O(), H)
      B(ko);
    else {
      const ee = J(B, ko, !0);
      p > 0 && !X ? N(ee) : ee();
    }
  }, F = () => {
    (i ? !c : !u) && (M(!0), w(() => {
      M(!1);
    }));
  }, Z = (H) => {
    B(Bs, H, !0), B(Bs, H, !1);
  }, ie = (H) => {
    h(H) && (c = i, i && M(!0));
  }, ae = [O, C, S, y, () => f(), me(P, "pointerover", ie, {
    A: !0
  }), me(P, "pointerenter", ie), me(P, "pointerleave", (H) => {
    h(H) && (c = !1, i && M(!1));
  }), me(P, "pointermove", (H) => {
    h(H) && d && F();
  }), me(I, "scroll", (H) => {
    g(() => {
      A(), F();
    }), r(H), $();
  })];
  return [() => J(Ne, ve(ae, L())), ({ Et: H, At: X, Kt: ee, Gt: U }) => {
    const { Qt: ce, Zt: z, tn: Y, nn: j } = U || {}, { Ot: G, dt: E } = ee || {}, { et: R } = s, { k: W } = ze(), { K: q, sn: Q } = n, [ue, we] = H("showNativeOverlaidScrollbars"), [xe, le] = H("scrollbars.theme"), [ge, Le] = H("scrollbars.visibility"), [Ce, $e] = H("scrollbars.autoHide"), [Ee, _e] = H("scrollbars.autoHideSuspend"), [pe] = H("scrollbars.autoHideDelay"), [de, Oe] = H("scrollbars.dragScroll"), [Ae, rt] = H("scrollbars.clickScroll"), [kt, us] = H("overflow"), ms = E && !X, fs = Q.x || Q.y, Pe = ce || z || j || G || X, ps = Y || Le || us, Rt = ue && W.x && W.y, Bt = (Xe, $t, It) => {
      const Ft = Xe.includes(bt) && (ge === et || ge === "auto" && $t === bt);
      return B(Ir, Ft, It), Ft;
    };
    if (p = pe, ms && (Ee && fs ? (Z(!1), f(), b(() => {
      f = me(I, "scroll", J(Z, !0), {
        A: !0
      });
    })) : Z(!0)), we && B(Tr, Rt), le && (B(m), B(xe, !0), m = xe), _e && !Ee && Z(!0), $e && (d = Ce === "move", i = Ce === "leave", u = Ce === "never", M(u, !0)), Oe && B(Vr, de), rt && B(Nr, Ae), ps) {
      const Xe = Bt(kt.x, q.x, !0), $t = Bt(kt.y, q.y, !1);
      B(Fr, !(Xe && $t));
    }
    Pe && (T(), A(), $(), B(xo, !Q.x, !0), B(xo, !Q.y, !1), B(Hr, R && !V));
  }, {}, k];
}, na = (t) => {
  const e = ze(), { L: s, R: n } = e, { elements: o } = s(), { host: r, padding: c, viewport: d, content: i } = o, u = Xt(t), m = u ? {} : t, { elements: f } = m, { host: p, padding: h, viewport: g, content: y } = f || {}, w = u ? t : m.target, C = Xo(w), b = Zt(w, "textarea"), S = w.ownerDocument, N = S.documentElement, O = () => S.defaultView || De, k = (le) => {
    le && le.focus && le.focus({
      preventScroll: !0
    });
  }, L = J(Pr, [w]), P = J(ln, [w]), I = J(ft, ""), V = J(L, I, d), B = J(P, I, i), T = V(g), A = T === w, $ = A && C, M = !A && B(y), F = !A && T === M, Z = $ ? N : T, ie = b ? L(I, r, p) : w, ae = $ ? Z : ie, H = !A && P(I, c, h), X = !F && M, ee = [X, Z, H, ae].map((le) => Xt(le) && !yt(le) && le), U = (le) => le && as(ee, le), ce = U(Z) ? w : Z, z = {
    ft: w,
    vt: ae,
    nt: Z,
    en: H,
    gt: X,
    ht: $ ? N : Z,
    Jt: $ ? S : Z,
    cn: C ? N : ce,
    Wt: S,
    bt: b,
    Tt: C,
    It: u,
    tt: A,
    rn: O,
    wt: (le) => fr(Z, Qe, le),
    yt: (le, ge) => As(Z, Qe, le, ge)
  }, { ft: Y, vt: j, en: G, nt: E, gt: R } = z, W = [() => {
    Ve(j, [pt, ys]), Ve(Y, ys), C && Ve(N, [ys, pt]);
  }], q = b && U(j);
  let Q = b ? Y : Ds([R, E, G, j, Y].find((le) => le && !U(le)));
  const ue = $ ? Y : R || E, we = J(Ne, W);
  return [z, () => {
    const le = O(), ge = Ms(), Le = (pe) => {
      He(yt(pe), Ds(pe)), ot(pe);
    }, Ce = (pe) => me(pe, "focusin focusout focus blur", qs, {
      H: !0
    }), $e = "tabindex", Ee = is(E, $e), _e = Ce(ge);
    return Ue(j, pt, A ? "" : $r), Ue(G, Rs, ""), Ue(E, Qe, ""), Ue(R, _o, ""), A || (Ue(E, $e, Ee || "-1"), C && Ue(N, yo, "")), q && (ao(Y, j), ve(W, () => {
      ao(j, Y), ot(j);
    })), He(ue, Q), He(j, G), He(G || j, !A && E), He(E, R), ve(W, [_e, () => {
      const pe = Ms(), de = Ce(pe);
      Ve(G, Rs), Ve(R, _o), Ve(E, Qe), C && Ve(N, yo), Ee ? Ue(E, $e, Ee) : Ve(E, $e), U(R) && Le(R), U(E) && Le(E), U(G) && Le(G), k(pe), de();
    }]), n && !A && (zs(E, Qe, nn), ve(W, J(Ve, E, Qe))), k(!A && ge === w && le.top === le ? E : ge), _e(), Q = 0, we;
  }, we];
}, ra = ({ gt: t }) => ({ Kt: e, ln: s, At: n }) => {
  const { $t: o } = e || {}, { St: r } = s;
  t && (o || n) && Lt(t, {
    [gt]: r && "100%"
  });
}, aa = ({ vt: t, en: e, nt: s, tt: n }, o) => {
  const [r, c] = Te({
    i: mr,
    o: co()
  }, J(co, t, "padding", ""));
  return ({ Et: d, Kt: i, ln: u, At: m }) => {
    let [f, p] = c(m);
    const { R: h } = ze(), { _t: g, Ct: y, Ot: w } = i || {}, { et: C } = u, [b, S] = d("paddingAbsolute");
    (g || p || (m || y)) && ([f, p] = r(m));
    const O = !n && (S || w || p);
    if (O) {
      const k = !b || !e && !h, L = f.r + f.l, P = f.t + f.b, I = {
        [zo]: k && !C ? -L : 0,
        [Po]: k ? -P : 0,
        [Vo]: k && C ? -L : 0,
        top: k ? -f.t : 0,
        right: k ? C ? -f.r : "auto" : 0,
        left: k ? C ? "auto" : -f.l : 0,
        [ht]: k && `calc(100% + ${L}px)`
      }, V = {
        [Bo]: k ? f.t : 0,
        [Io]: k ? f.r : 0,
        [No]: k ? f.b : 0,
        [Fo]: k ? f.l : 0
      };
      Lt(e || s, I), Lt(s, V), se(o, {
        en: f,
        an: !k,
        ct: e ? V : se({}, I, V)
      });
    }
    return {
      un: O
    };
  };
}, la = (t, e) => {
  const s = ze(), { vt: n, en: o, nt: r, tt: c, ht: d, Tt: i, yt: u, rn: m } = t, { R: f } = s, p = i && c, h = J(Ut, 0), g = ["display", "direction", "flexDirection", "writingMode"], y = {
    i: Uo,
    o: {
      w: 0,
      h: 0
    }
  }, w = {
    i: jt,
    o: {}
  }, C = (H, X) => {
    const ee = De.devicePixelRatio % 1 !== 0 ? 1 : 0, U = {
      w: h(H.w - X.w),
      h: h(H.h - X.h)
    };
    return {
      w: U.w > ee ? U.w : 0,
      h: U.h > ee ? U.h : 0
    };
  }, b = () => {
    const H = Ie(d), X = u(Dr, !0), ee = me(d, bt, qs, {
      H: !0
    });
    je(d, {
      x: 0,
      y: 0
    }), X();
    const U = Ie(d), ce = Qt(d);
    je(d, {
      x: ce.w,
      y: ce.h
    });
    const z = Ie(d);
    je(d, {
      x: z.x - U.x < 1 && -ce.w,
      y: z.y - U.y < 1 && -ce.h
    });
    const Y = Ie(d);
    return je(d, H), ee(), {
      I: U,
      T: Y
    };
  }, S = () => se({}, _r(r) ? dt(r, g) : {}), [N, O] = Te(y, J(js, r)), [k, L] = Te(y, J(Qt, r)), [P, I] = Te(y), [V] = Te(w), [B, T] = Te(y), [A] = Te(w), [$] = Te({
    i: (H, X) => ls(H, X, g),
    o: {}
  }), [M, F] = Te({
    i: (H, X) => jt(H.I, X.I) && jt(H.T, X.T),
    o: sn()
  }), Z = Ht(fn), ie = (H, X) => `${X ? Sr : Cr}${ur(H)}`, ae = (H) => {
    const { K: X } = H;
    oe(Ye(X), (ee) => {
      const U = ee === "x", ce = [et, lt, bt].map((z) => ie(z, U));
      u(ce.join(" ")), u(ie(X[ee], U), !0);
    });
  };
  return ({ Et: H, Kt: X, ln: ee, At: U }, { un: ce }) => {
    const { _t: z, Ct: Y, Ot: j, dt: G, Ht: E } = X || {}, R = Z && Z.Z(t, e, ee, s, H), { lt: W, it: q, ut: Q } = R || {}, [ue, we] = Jr(H, s), [xe, le] = H("overflow"), ge = es(xe.x), Le = es(xe.y), Ce = z || ce || Y || j || E || we;
    let $e = O(U), Ee = L(U), _e = I(U), pe = T(U);
    if (we && f && u(nn, !ue), Ce) {
      const [Js] = q ? q() : [], [Nt] = $e = N(U), [St] = Ee = k(U), vs = en(r), Xs = St, Zs = vs;
      Js && Js();
      const Qs = yr(m()), An = {
        w: h(Ut(St.w, Xs.w) + Nt.w),
        h: h(Ut(St.h, Xs.h) + Nt.h)
      }, eo = {
        w: h((p ? Qs.w : Zs.w + h(vs.w - St.w)) + Nt.w),
        h: h((p ? Qs.h : Zs.h + h(vs.h - St.h)) + Nt.h)
      };
      pe = B(eo), _e = P(C(An, eo), U);
    }
    const [de, Oe] = pe, [Ae, rt] = _e, [kt, us] = Ee, [ms, fs] = $e, [Pe, ps] = V({
      x: Ae.w > 0,
      y: Ae.h > 0
    }), Rt = ge && Le && (Pe.x || Pe.y) || ge && Pe.x && !Pe.y || Le && Pe.y && !Pe.x, Bt = ce || j || E || fs || us || Oe || rt || le || we || Ce, Xe = Xr(Pe, xe), [$t, It] = A(Xe.K), [, Ft] = $(S(), U), Sn = j || G || Ft || ps || U, [Cn, En] = Sn ? M(b(), U) : F();
    return Bt && (ae(Xe), Q && W && Lt(r, Q(Xe, ee, W(Xe, kt, ms)))), As(n, pt, bo, Rt), As(o, Rs, bo, Rt), se(e, {
      K: $t,
      Mt: {
        x: de.w,
        y: de.h
      },
      Rt: {
        x: Ae.w,
        y: Ae.h
      },
      sn: Pe,
      Lt: xr(Cn, Ae)
    }), {
      tn: It,
      Qt: Oe,
      Zt: rt,
      nn: En || rt
    };
  };
}, ia = (t) => {
  const [e, s, n] = na(t), o = {
    en: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    an: !1,
    ct: {
      [zo]: 0,
      [Po]: 0,
      [Vo]: 0,
      [Bo]: 0,
      [Io]: 0,
      [No]: 0,
      [Fo]: 0
    },
    Mt: {
      x: 0,
      y: 0
    },
    Rt: {
      x: 0,
      y: 0
    },
    K: {
      x: lt,
      y: lt
    },
    sn: {
      x: !1,
      y: !1
    },
    Lt: sn()
  }, { ft: r, ht: c, tt: d, yt: i } = e, { R: u, k: m } = ze(), f = !u && (m.x || m.y), p = [ra(e), aa(e, o), la(e, o)];
  return [s, (h) => {
    const g = {}, y = f, w = i(Gs, !0), C = y && Ie(c);
    return oe(p, (b) => {
      se(g, b(h, g) || {});
    }), je(c, C), !d && je(r, 0), w(), g;
  }, o, e, n];
}, ca = (t, e, s, n) => {
  const o = go(e, {}), [r, c, d, i, u] = ia(t), [m, f, p] = ea(i, d, o, (b) => {
    C({}, b);
  }), [h, g, , y] = oa(t, e, p, d, i, n), w = (b) => Ye(b).some((S) => !!b[S]), C = (b, S) => {
    const { dn: N, At: O, zt: k, _n: L } = b, P = N || {}, I = !!O, V = {
      Et: go(e, P, I),
      dn: P,
      At: I
    };
    if (L)
      return g(V), !1;
    const B = S || f(se({}, V, {
      zt: k
    })), T = c(se({}, V, {
      ln: p,
      Kt: B
    }));
    g(se({}, V, {
      Kt: B,
      Gt: T
    }));
    const A = w(B), $ = w(T), M = A || $ || !Vs(P) || I;
    return M && s(b, {
      Kt: B,
      Gt: T
    }), M;
  };
  return [() => {
    const { cn: b, ht: S, yt: N } = i, O = N(Gs, !0), k = Ie(b), L = [m(), r(), h()];
    return je(S, k), O(), J(Ne, L);
  }, C, () => ({
    fn: p,
    pn: d
  }), {
    vn: i,
    hn: y
  }, u];
}, ut = (t, e, s) => {
  const { U: n } = ze(), o = Xt(t), r = o ? t : t.target, c = cn(r);
  if (e && !c) {
    let d = !1;
    const i = [], u = {}, m = (V) => {
      const B = Go(V), T = Ht(Wr);
      return T ? T(B, !0) : B;
    }, f = se({}, n(), m(e)), [p, h, g] = Hs(), [y, w, C] = Hs(s), b = (V, B) => {
      C(V, B), g(V, B);
    }, [S, N, O, k, L] = ca(t, f, ({ dn: V, At: B }, { Kt: T, Gt: A }) => {
      const { _t: $, Ot: M, $t: F, Ct: Z, xt: ie, dt: ae } = T, { Qt: H, Zt: X, tn: ee, nn: U } = A;
      b("updated", [I, {
        updateHints: {
          sizeChanged: !!$,
          directionChanged: !!M,
          heightIntrinsicChanged: !!F,
          overflowEdgeChanged: !!H,
          overflowAmountChanged: !!X,
          overflowStyleChanged: !!ee,
          scrollCoordinatesChanged: !!U,
          contentMutation: !!Z,
          hostMutation: !!ie,
          appear: !!ae
        },
        changedOptions: V || {},
        force: !!B
      }]);
    }, (V) => b("scroll", [I, V])), P = (V) => {
      qr(r), Ne(i), d = !0, b("destroyed", [I, V]), h(), w();
    }, I = {
      options(V, B) {
        if (V) {
          const T = B ? n() : {}, A = on(f, se(T, m(V)));
          Vs(A) || (se(f, A), N({
            dn: A
          }));
        }
        return se({}, f);
      },
      on: y,
      off: (V, B) => {
        V && B && w(V, B);
      },
      state() {
        const { fn: V, pn: B } = O(), { et: T } = V, { Mt: A, Rt: $, K: M, sn: F, en: Z, an: ie, Lt: ae } = B;
        return se({}, {
          overflowEdge: A,
          overflowAmount: $,
          overflowStyle: M,
          hasOverflow: F,
          scrollCoordinates: {
            start: ae.I,
            end: ae.T
          },
          padding: Z,
          paddingAbsolute: ie,
          directionRTL: T,
          destroyed: d
        });
      },
      elements() {
        const { ft: V, vt: B, en: T, nt: A, gt: $, ht: M, Jt: F } = k.vn, { qt: Z, Yt: ie } = k.hn, ae = (X) => {
          const { kt: ee, Dt: U, Vt: ce } = X;
          return {
            scrollbar: ce,
            track: U,
            handle: ee
          };
        }, H = (X) => {
          const { Ft: ee, Bt: U } = X, ce = ae(ee[0]);
          return se({}, ce, {
            clone: () => {
              const z = ae(U());
              return N({
                _n: !0
              }), z;
            }
          });
        };
        return se({}, {
          target: V,
          host: B,
          padding: T || A,
          viewport: A,
          content: $ || A,
          scrollOffsetElement: M,
          scrollEventElement: F,
          scrollbarHorizontal: H(Z),
          scrollbarVertical: H(ie)
        });
      },
      update: (V) => N({
        At: V,
        zt: !0
      }),
      destroy: J(P, !1),
      plugin: (V) => u[Ye(V)[0]]
    };
    return ve(i, [L]), jr(r, I), mn(dn, ut, [I, p, u]), Ur(k.vn.Tt, !o && t.cancel) ? (P(!0), I) : (ve(i, S()), b("initialized", [I]), I.update(!0), I);
  }
  return c;
};
ut.plugin = (t) => {
  const e = Ge(t), s = e ? t : [t], n = s.map((o) => mn(o, ut)[0]);
  return Kr(s), e ? n : n[0];
};
ut.valid = (t) => {
  const e = t && t.elements, s = Fe(e) && e();
  return Jt(s) && !!cn(s.target);
};
ut.env = () => {
  const { D: t, k: e, R: s, M: n, j: o, q: r, L: c, P: d, U: i, N: u } = ze();
  return se({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: e,
    scrollbarsHiding: s,
    scrollTimeline: n,
    staticDefaultInitialization: o,
    staticDefaultOptions: r,
    getDefaultInitialization: c,
    setDefaultInitialization: d,
    getDefaultOptions: i,
    setDefaultOptions: u
  });
};
function da() {
  let t;
  const e = D(null), s = Math.floor(Math.random() * 2 ** 32), n = D(!1), o = D([]), r = () => o.value, c = () => t.getSelection(), d = () => o.value.length, i = () => t.clearSelection(!0), u = D(), m = D(null), f = D(null), p = D(null);
  function h() {
    t = new zn({
      area: e.value,
      keyboardDrag: !1,
      selectedClass: "vf-explorer-selected",
      selectorClass: "vf-explorer-selector"
    }), t.subscribe("DS:start:pre", ({ items: b, event: S, isDragging: N }) => {
      if (N)
        t.Interaction._reset(S);
      else {
        n.value = !1;
        const O = e.value.offsetWidth - S.offsetX, k = e.value.offsetHeight - S.offsetY;
        O < 15 && k < 15 && t.Interaction._reset(S), S.target.classList.contains("os-scrollbar-handle") && t.Interaction._reset(S);
      }
    }), document.addEventListener("dragleave", (b) => {
      !b.buttons && n.value && (n.value = !1);
    });
  }
  const g = () => Dt(() => {
    const b = r().map((S) => S.path);
    i(), t.setSettings({
      selectables: document.getElementsByClassName("vf-item-" + s)
    }), t.addSelection(
      t.getSelectables().filter((S) => b.includes(JSON.parse(S.dataset.item).path))
    ), o.value = t.getSelection().map((S) => JSON.parse(S.dataset.item)), u.value(o.value), w();
  }), y = (b) => {
    u.value = b, t.subscribe("DS:end", ({ items: S, event: N, isDragging: O }) => {
      o.value = S.map((k) => JSON.parse(k.dataset.item)), b(S.map((k) => JSON.parse(k.dataset.item)));
    });
  }, w = () => {
    m.value && (e.value.getBoundingClientRect().height < e.value.scrollHeight ? (f.value.style.height = e.value.scrollHeight + "px", f.value.style.display = "block") : (f.value.style.height = "100%", f.value.style.display = "none"));
  }, C = (b) => {
    if (!m.value)
      return;
    const { scrollOffsetElement: S } = m.value.elements();
    S.scrollTo(
      {
        top: e.value.scrollTop,
        left: 0
      }
    );
  };
  return Me(() => {
    ut(p.value, {
      scrollbars: {
        theme: "vf-theme-dark dark:vf-theme-light"
      },
      plugins: {
        OverlayScrollbars: ut
        // ScrollbarsHidingPlugin,
        // SizeObserverPlugin,
        // ClickScrollPlugin
      }
    }, {
      initialized: (b) => {
        m.value = b;
      },
      scroll: (b, S) => {
        const { scrollOffsetElement: N } = b.elements();
        e.value.scrollTo({
          top: N.scrollTop,
          left: 0
        });
      }
    }), h(), w(), new ResizeObserver(w).observe(e.value), e.value.addEventListener("scroll", C), t.subscribe("DS:scroll", ({ isDragging: b }) => b || C());
  }), On(() => {
    t && t.stop();
  }), Ao(() => {
    t && t.Area.reset();
  }), {
    area: e,
    explorerId: s,
    isDraggingRef: n,
    scrollBar: f,
    scrollBarContainer: p,
    getSelected: r,
    getSelection: c,
    clearSelection: i,
    refreshSelection: g,
    getCount: d,
    onSelect: y
  };
}
function ua(t, e) {
  const s = D(t), n = D(e), o = D([]), r = D([]), c = D([]), d = D(!1), i = D(5);
  let u = !1, m = !1;
  const f = Ot({
    adapter: s,
    storages: [],
    dirname: n,
    files: []
  });
  function p() {
    let b = [], S = [], N = n.value ?? s.value + "://";
    N.length === 0 && (o.value = []), N.replace(s.value + "://", "").split("/").forEach(function(L) {
      b.push(L), b.join("/") !== "" && S.push({
        basename: L,
        name: L,
        path: s.value + "://" + b.join("/"),
        type: "dir"
      });
    }), r.value = S;
    const [O, k] = g(S, i.value);
    c.value = k, o.value = O;
  }
  function h(b) {
    i.value = b, p();
  }
  function g(b, S) {
    return b.length > S ? [b.slice(-S), b.slice(0, -S)] : [b, []];
  }
  function y(b = null) {
    d.value = b ?? !d.value;
  }
  function w() {
    return o.value && o.value.length && !m;
  }
  const C = vt(() => {
    var b;
    return ((b = o.value[o.value.length - 2]) == null ? void 0 : b.path) ?? s.value + "://";
  });
  return Me(() => {
  }), At(n, p), Me(p), {
    adapter: s,
    path: n,
    loading: u,
    searchMode: m,
    data: f,
    breadcrumbs: o,
    breadcrumbItems: r,
    limitBreadcrumbItems: h,
    hiddenBreadcrumbs: c,
    showHiddenBreadcrumbs: d,
    toggleHiddenBreadcrumbs: y,
    isGoUpAvailable: w,
    parentFolderPath: C
  };
}
const ma = (t, e) => {
  const s = Wn(t.id), n = Vn(), o = s.getStore("metricUnits", !1), r = sr(s, t.theme), c = e.i18n, d = t.locale ?? e.locale, i = s.getStore("adapter"), u = (p) => Array.isArray(p) ? p : Xn, m = s.getStore("persist-path", t.persist), f = m ? s.getStore("path", t.path) : t.path;
  return Ot({
    /*
    * Core properties
    * */
    // app version
    version: Zn,
    // root element
    root: null,
    // app id
    debug: t.debug,
    // Event Bus
    emitter: n,
    // storage
    storage: s,
    // localization object
    i18n: vt(() => Jn(s, d, n, c)),
    // modal state
    modal: or(),
    // dragSelect object, it is responsible for selecting items
    dragSelect: vt(() => da()),
    // http object
    requester: Kn(t.request),
    // active features
    features: u(t.features),
    // view state
    view: s.getStore("viewport", "grid"),
    // fullscreen state
    // fullScreen: storage.getStore('full-screen', props.fullScreen),
    fullscreen: !1,
    // selectButton state
    selectButton: t.selectButton,
    // max file size
    maxFileSize: t.maxFileSize,
    /*
    * Settings
    * */
    // theme state
    theme: r,
    // unit state - for example: GB or GiB
    metricUnits: o,
    // human readable file sizes
    filesize: o ? er : Qn,
    // show large icons in list view
    compactListView: s.getStore("compact-list-view", !0),
    // persist state
    persist: m,
    // show thumbnails
    showThumbnails: s.getStore("show-thumbnails", t.showThumbnails),
    // file system
    fs: ua(i, f)
  });
}, fa = /* @__PURE__ */ l("div", { class: "fixed inset-0 bg-gray-500 dark:bg-gray-600 dark:bg-opacity-75 bg-opacity-75 transition-opacity" }, null, -1), pa = { class: "fixed z-10 inset-0 overflow-hidden" }, va = { class: "bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4" }, ha = { class: "bg-gray-50 dark:bg-gray-800 dark:border-t dark:border-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse" }, Je = {
  __name: "ModalLayout",
  setup(t) {
    const e = D(null), s = fe("ServiceContainer");
    return Me(() => {
      const n = document.querySelector(".v-f-modal input");
      n && n.focus(), Dt(() => {
        if (document.querySelector(".v-f-modal input") && window.innerWidth < 768) {
          const o = e.value.getBoundingClientRect().bottom + 16;
          window.scrollTo({
            top: o,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    }), (n, o) => (v(), _("div", {
      class: "v-f-modal relative z-30",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: o[1] || (o[1] = _t((r) => a(s).modal.close(), ["esc"])),
      tabindex: "0"
    }, [
      fa,
      l("div", pa, [
        l("div", {
          class: "flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0",
          onMousedown: o[0] || (o[0] = tt((r) => a(s).modal.close(), ["self"]))
        }, [
          l("div", {
            ref_key: "modalBody",
            ref: e,
            class: "relative bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl md:max-w-2xl lg:max-w-3xl xl:max-w-3xl w-full"
          }, [
            l("div", va, [
              Gt(n.$slots, "default")
            ]),
            l("div", ha, [
              Gt(n.$slots, "buttons")
            ])
          ], 512)
        ], 32)
      ])
    ], 32));
  }
}, ga = ["aria-label"], ba = /* @__PURE__ */ l("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  stroke: "currentColor",
  class: "w-5 h-5"
}, [
  /* @__PURE__ */ l("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M6 18L18 6M6 6l12 12"
  })
], -1), ya = [
  ba
], Ke = {
  __name: "Message",
  props: {
    error: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["hidden"],
  setup(t, { emit: e }) {
    var u;
    const s = e, n = fe("ServiceContainer"), { t: o } = n.i18n, r = D(!1), c = D(null), d = D((u = c.value) == null ? void 0 : u.strMessage);
    At(d, () => r.value = !1);
    const i = () => {
      s("hidden"), r.value = !0;
    };
    return (m, f) => (v(), _("div", null, [
      r.value ? K("", !0) : (v(), _("div", {
        key: 0,
        ref_key: "strMessage",
        ref: c,
        class: ye(["flex mt-2 p-1 px-2 rounded text-sm break-all dark:opacity-75", t.error ? "bg-red-100 text-red-600 " : "bg-emerald-100 text-emerald-600"])
      }, [
        Gt(m.$slots, "default"),
        l("div", {
          class: "ml-auto cursor-pointer",
          onClick: i,
          "aria-label": a(o)("Close"),
          "data-microtip-position": "top-left",
          role: "tooltip"
        }, ya, 8, ga)
      ], 2))
    ]));
  }
}, _a = { class: "sm:flex sm:items-start" }, wa = /* @__PURE__ */ l("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ l("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
    })
  ])
], -1), xa = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, ka = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, $a = { class: "mt-2" }, Sa = { class: "text-sm text-gray-500" }, Ca = ["placeholder"], vn = {
  __name: "ModalNewFolder",
  setup(t) {
    const e = fe("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = D(""), o = D(""), r = () => {
      n.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfolder",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
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
    return (c, d) => (v(), te(Je, null, {
      buttons: ne(() => [
        l("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, x(a(s)("Create")), 1),
        l("button", {
          type: "button",
          onClick: d[2] || (d[2] = (i) => a(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, x(a(s)("Cancel")), 1)
      ]),
      default: ne(() => [
        l("div", _a, [
          wa,
          l("div", xa, [
            l("h3", ka, x(a(s)("New Folder")), 1),
            l("div", $a, [
              l("p", Sa, x(a(s)("Create a new folder")), 1),
              Se(l("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (i) => n.value = i),
                onKeyup: _t(r, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("Folder Name"),
                type: "text"
              }, null, 40, Ca), [
                [wt, n.value]
              ]),
              o.value.length ? (v(), te(Ke, {
                key: 0,
                onHidden: d[1] || (d[1] = (i) => o.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  he(x(o.value), 1)
                ]),
                _: 1
              })) : K("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Ea = { class: "sm:flex sm:items-start" }, Aa = /* @__PURE__ */ l("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ l("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    })
  ])
], -1), Da = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Ma = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, La = { class: "mt-2" }, Oa = { class: "text-sm text-gray-500" }, Ta = ["placeholder"], Ha = {
  __name: "ModalNewFile",
  setup(t) {
    const e = fe("ServiceContainer");
    e.storage;
    const { t: s } = e.i18n, n = D(""), o = D(""), r = () => {
      n.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfile",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
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
    return (c, d) => (v(), te(Je, null, {
      buttons: ne(() => [
        l("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, x(a(s)("Create")), 1),
        l("button", {
          type: "button",
          onClick: d[2] || (d[2] = (i) => a(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, x(a(s)("Cancel")), 1)
      ]),
      default: ne(() => [
        l("div", Ea, [
          Aa,
          l("div", Da, [
            l("h3", Ma, x(a(s)("New File")), 1),
            l("div", La, [
              l("p", Oa, x(a(s)("Create a new file")), 1),
              Se(l("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (i) => n.value = i),
                onKeyup: _t(r, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("File Name"),
                type: "text"
              }, null, 40, Ta), [
                [wt, n.value]
              ]),
              o.value.length ? (v(), te(Ke, {
                key: 0,
                onHidden: d[1] || (d[1] = (i) => o.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  he(x(o.value), 1)
                ]),
                _: 1
              })) : K("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Ra = { class: "sm:flex sm:items-start" }, Ba = /* @__PURE__ */ l("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ l("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    })
  ])
], -1), Ia = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Fa = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Na = { class: "mt-2" }, Va = { class: "flex text-sm text-gray-800 dark:text-gray-400 py-2" }, za = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Pa = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Ua = [
  Pa
], ja = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, qa = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Ga = [
  qa
], Ka = { class: "ml-1.5" }, hn = {
  __name: "ModalRename",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, n = D(e.modal.data.items[0]), o = D(e.modal.data.items[0].basename), r = D(""), c = () => {
      o.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "rename",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
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
    return (d, i) => (v(), te(Je, null, {
      buttons: ne(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, x(a(s)("Rename")), 1),
        l("button", {
          type: "button",
          onClick: i[2] || (i[2] = (u) => a(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, x(a(s)("Cancel")), 1)
      ]),
      default: ne(() => [
        l("div", Ra, [
          Ba,
          l("div", Ia, [
            l("h3", Fa, x(a(s)("Rename")), 1),
            l("div", Na, [
              l("p", Va, [
                n.value.type === "dir" ? (v(), _("svg", za, Ua)) : (v(), _("svg", ja, Ga)),
                l("span", Ka, x(n.value.basename), 1)
              ]),
              Se(l("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (u) => o.value = u),
                onKeyup: _t(c, ["enter"]),
                class: "px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [wt, o.value]
              ]),
              r.value.length ? (v(), te(Ke, {
                key: 0,
                onHidden: i[1] || (i[1] = (u) => r.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  he(x(r.value), 1)
                ]),
                _: 1
              })) : K("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Wa = { class: "sm:flex sm:items-start" }, Ya = /* @__PURE__ */ l("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ l("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-red-600 dark:stroke-red-200",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    })
  ])
], -1), Ja = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Xa = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Za = { class: "mt-2" }, Qa = { class: "text-sm text-gray-500" }, el = {
  class: "text-gray-500 text-sm mb-1 overflow-auto vf-scrollbar",
  style: { "max-height": "200px" }
}, tl = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, sl = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, ol = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), nl = [
  ol
], rl = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, al = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), ll = [
  al
], il = { class: "ml-1.5" }, cl = { class: "m-auto font-bold text-red-500 text-sm dark:text-red-200 text-center" }, gn = {
  __name: "ModalDelete",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, n = D(e.modal.data.items), o = D(""), r = () => {
      n.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
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
    return (c, d) => (v(), te(Je, null, {
      buttons: ne(() => [
        l("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-danger"
        }, x(a(s)("Yes, Delete!")), 1),
        l("button", {
          type: "button",
          onClick: d[1] || (d[1] = (i) => a(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, x(a(s)("Cancel")), 1),
        l("div", cl, x(a(s)("This action cannot be undone.")), 1)
      ]),
      default: ne(() => [
        l("div", Wa, [
          Ya,
          l("div", Ja, [
            l("h3", Xa, x(a(s)("Delete files")), 1),
            l("div", Za, [
              l("p", Qa, x(a(s)("Are you sure you want to delete these files?")), 1),
              l("div", el, [
                (v(!0), _(ke, null, Re(n.value, (i) => (v(), _("p", tl, [
                  i.type === "dir" ? (v(), _("svg", sl, nl)) : (v(), _("svg", rl, ll)),
                  l("span", il, x(i.basename), 1)
                ]))), 256))
              ]),
              o.value.length ? (v(), te(Ke, {
                key: 0,
                onHidden: d[0] || (d[0] = (i) => o.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  he(x(o.value), 1)
                ]),
                _: 1
              })) : K("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
};
function Is(t, e = 14) {
  let s = `((?=([\\w\\W]{0,${e}}))([\\w\\W]{${e + 1},})([\\w\\W]{8,}))`;
  return t.replace(new RegExp(s), "$2..$4");
}
const dl = { class: "sm:flex sm:items-start" }, ul = /* @__PURE__ */ l("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ l("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    })
  ])
], -1), ml = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, fl = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, pl = { class: "mt-2" }, vl = {
  key: 0,
  class: "pointer-events-none"
}, hl = {
  key: 1,
  class: "pointer-events-none"
}, gl = ["disabled"], bl = ["disabled"], yl = { class: "text-gray-500 text-sm mb-1 pr-1 max-h-[200px] overflow-y-auto vf-scrollbar" }, _l = { class: "rounded flex flex-shrink-0 w-6 h-6 border bg-gray-50 text-xs cursor-default dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50" }, wl = ["textContent"], xl = { class: "ml-1 w-full h-fit" }, kl = { class: "text-left hidden md:block" }, $l = { class: "text-left md:hidden" }, Sl = {
  key: 0,
  class: "ml-auto"
}, Cl = ["title", "disabled", "onClick"], El = /* @__PURE__ */ l("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  "stroke-width": "1.5",
  stroke: "currentColor",
  class: "w-5 h-5"
}, [
  /* @__PURE__ */ l("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M6 18L18 6M6 6l12 12"
  })
], -1), Al = [
  El
], Dl = {
  key: 0,
  class: "py-2"
}, Ml = ["disabled"], bn = {
  __name: "ModalUpload",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, n = s("uppy"), o = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, r = D({ QUEUE_ENTRY_STATUS: o }), c = D(null), d = D(null), i = D(null), u = D(null), m = D(null), f = D(null), p = D([]), h = D(""), g = D(!1), y = D(!1);
    let w;
    function C(T) {
      return p.value.findIndex((A) => A.id === T);
    }
    function b(T, A = null) {
      A = A ?? (T.webkitRelativePath || T.name), w.addFile({
        name: A,
        type: T.type,
        data: T,
        source: "Local"
      });
    }
    function S(T) {
      switch (T.status) {
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
    const N = (T) => {
      switch (T.status) {
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
    function O() {
      u.value.click();
    }
    function k() {
      if (!g.value) {
        if (!p.value.filter((T) => T.status !== o.DONE).length) {
          h.value = s("Please select file to upload first.");
          return;
        }
        h.value = "", w.retryAll(), w.upload();
      }
    }
    function L() {
      w.cancelAll({ reason: "user" }), p.value.forEach((T) => {
        T.status !== o.DONE && (T.status = o.CANCELED, T.statusName = s("Canceled"));
      }), g.value = !1;
    }
    function P(T) {
      g.value || (w.removeFile(T.id, "removed-by-user"), p.value.splice(C(T.id), 1));
    }
    function I(T) {
      if (!g.value) {
        if (w.cancelAll({ reason: "user" }), T) {
          const A = [];
          p.value.forEach(($) => {
            $.status !== o.DONE && A.push($);
          }), p.value = [], A.forEach(($) => {
            b($.originalFile, $.name);
          });
          return;
        }
        p.value.splice(0);
      }
    }
    function V() {
      e.modal.close();
    }
    function B() {
      return e.requester.transformRequestParams({
        url: "",
        method: "post",
        params: { q: "upload", adapter: e.fs.adapter, path: e.fs.data.dirname }
      });
    }
    return Me(async () => {
      w = new Pn({
        debug: e.debug,
        restrictions: {
          maxFileSize: tr(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: n,
        onBeforeFileAdded($, M) {
          if (M[$.id] != null) {
            const Z = C($.id);
            p.value[Z].status === o.PENDING && (h.value = w.i18n("noDuplicates", { fileName: $.name })), p.value = p.value.filter((ie) => ie.id !== $.id);
          }
          return p.value.push({
            id: $.id,
            name: $.name,
            size: e.filesize($.size),
            status: o.PENDING,
            statusName: s("Pending upload"),
            percent: null,
            originalFile: $.data
          }), !0;
        }
      }), w.use(Un, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError($, M) {
          let F;
          try {
            F = JSON.parse($).message;
          } catch {
            F = s("Cannot parse server response.");
          }
          return new Error(F);
        }
      }), w.on("restriction-failed", ($, M) => {
        const F = p.value[C($.id)];
        P(F), h.value = M.message;
      }), w.on("upload", () => {
        const $ = B();
        w.setMeta({ ...$.body });
        const M = w.getPlugin("XHRUpload");
        M.opts.method = $.method, M.opts.endpoint = $.url + "?" + new URLSearchParams($.params), M.opts.headers = $.headers, g.value = !0, p.value.forEach((F) => {
          F.status !== o.DONE && (F.percent = null, F.status = o.UPLOADING, F.statusName = s("Pending upload"));
        });
      }), w.on("upload-progress", ($, M) => {
        const F = Math.floor(M.bytesUploaded / M.bytesTotal * 100);
        p.value[C($.id)].percent = `${F}%`;
      }), w.on("upload-success", ($) => {
        const M = p.value[C($.id)];
        M.status = o.DONE, M.statusName = s("Done");
      }), w.on("upload-error", ($, M) => {
        const F = p.value[C($.id)];
        F.percent = null, F.status = o.ERROR, M.isNetworkError ? F.statusName = s("Network Error, Unable establish connection to the server or interrupted.") : F.statusName = M ? M.message : s("Unknown Error");
      }), w.on("error", ($) => {
        h.value = $.message, g.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), w.on("complete", () => {
        g.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), u.value.addEventListener("click", () => {
        d.value.click();
      }), m.value.addEventListener("click", () => {
        i.value.click();
      }), f.value.addEventListener("dragover", ($) => {
        $.preventDefault(), y.value = !0;
      }), f.value.addEventListener("dragleave", ($) => {
        $.preventDefault(), y.value = !1;
      });
      function T($, M) {
        M.isFile && M.file((F) => $(M, F)), M.isDirectory && M.createReader().readEntries((F) => {
          F.forEach((Z) => {
            T($, Z);
          });
        });
      }
      f.value.addEventListener("drop", ($) => {
        $.preventDefault(), y.value = !1;
        const M = /^[/\\](.+)/;
        [...$.dataTransfer.items].forEach((F) => {
          F.kind === "file" && T((Z, ie) => {
            const ae = M.exec(Z.fullPath);
            b(ie, ae[1]);
          }, F.webkitGetAsEntry());
        });
      });
      const A = ({ target: $ }) => {
        const M = $.files;
        for (const F of M)
          b(F);
        $.value = "";
      };
      d.value.addEventListener("change", A), i.value.addEventListener("change", A), console.log("初始化"), window.tmpFileList && (console.log(window.tmpFileList), window.tmpFileList.forEach(({ file: $, path: M }) => {
        b($, M);
      }), window.tmpFileList = null);
    }), Do(() => {
      w == null || w.close({ reason: "unmount" });
    }), (T, A) => (v(), te(Je, null, {
      buttons: ne(() => [
        l("button", {
          type: "button",
          class: ye(["vf-btn vf-btn-primary", g.value ? "bg-blue-200 hover:bg-blue-200 dark:bg-gray-700/50 dark:hover:bg-gray-700/50 dark:text-gray-500" : "bg-blue-600 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-500"]),
          disabled: g.value,
          onClick: tt(k, ["prevent"])
        }, x(a(s)("Upload")), 11, Ml),
        g.value ? (v(), _("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: tt(L, ["prevent"])
        }, x(a(s)("Cancel")), 1)) : (v(), _("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: tt(V, ["prevent"])
        }, x(a(s)("Close")), 1))
      ]),
      default: ne(() => [
        l("div", dl, [
          ul,
          l("div", ml, [
            l("h3", fl, x(a(s)("Upload Files")), 1),
            l("div", pl, [
              l("div", {
                ref_key: "dropArea",
                ref: f,
                class: "flex items-center justify-center text-lg mb-4 text-gray-500 border-2 border-gray-300 rounded border-dashed select-none cursor-pointer dark:border-gray-600 h-[120px]",
                onClick: O
              }, [
                y.value ? (v(), _("div", vl, x(a(s)("Release to drop these files.")), 1)) : (v(), _("div", hl, x(a(s)("Drag and drop the files/folders to here or click here.")), 1))
              ], 512),
              l("div", {
                ref_key: "container",
                ref: c,
                class: "text-gray-500 mb-1"
              }, [
                l("button", {
                  ref_key: "pickFiles",
                  ref: u,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, x(a(s)("Select Files")), 513),
                l("button", {
                  ref_key: "pickFolders",
                  ref: m,
                  type: "button",
                  class: "vf-btn vf-btn-secondary"
                }, x(a(s)("Select Folders")), 513),
                l("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: g.value,
                  onClick: A[0] || (A[0] = ($) => I(!1))
                }, x(a(s)("Clear all")), 9, gl),
                l("button", {
                  type: "button",
                  class: "vf-btn vf-btn-secondary",
                  disabled: g.value,
                  onClick: A[1] || (A[1] = ($) => I(!0))
                }, x(a(s)("Clear only successful")), 9, bl)
              ], 512),
              l("div", yl, [
                (v(!0), _(ke, null, Re(p.value, ($) => (v(), _("div", {
                  class: "flex hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-300",
                  key: $.id
                }, [
                  l("span", _l, [
                    l("span", {
                      class: ye(["text-base m-auto", S($)]),
                      textContent: x(N($))
                    }, null, 10, wl)
                  ]),
                  l("div", xl, [
                    l("div", kl, x(a(Is)($.name, 40)) + " (" + x($.size) + ")", 1),
                    l("div", $l, x(a(Is)($.name, 16)) + " (" + x($.size) + ")", 1),
                    l("div", {
                      class: ye(["flex break-all text-left", S($)])
                    }, [
                      he(x($.statusName) + " ", 1),
                      $.status === r.value.QUEUE_ENTRY_STATUS.UPLOADING ? (v(), _("b", Sl, x($.percent), 1)) : K("", !0)
                    ], 2)
                  ]),
                  l("button", {
                    type: "button",
                    class: ye(["rounded w-5 h-5 border-1 text-base leading-none font-medium focus:outline-none dark:border-gray-200 dark:text-gray-400 dark:hover:text-gray-200 dark:bg-gray-600 ml-auto sm:text-xs hover:text-red-600", g.value ? "disabled:bg-gray-100 text-white text-opacity-50" : "bg-gray-100"]),
                    title: a(s)("Delete"),
                    disabled: g.value,
                    onClick: (M) => P($)
                  }, Al, 10, Cl)
                ]))), 128)),
                p.value.length ? K("", !0) : (v(), _("div", Dl, x(a(s)("No files selected!")), 1))
              ]),
              h.value.length ? (v(), te(Ke, {
                key: 0,
                onHidden: A[2] || (A[2] = ($) => h.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  he(x(h.value), 1)
                ]),
                _: 1
              })) : K("", !0)
            ])
          ])
        ]),
        l("input", {
          ref_key: "internalFileInput",
          ref: d,
          type: "file",
          multiple: "",
          class: "hidden"
        }, null, 512),
        l("input", {
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
}, Ll = { class: "sm:flex sm:items-start" }, Ol = /* @__PURE__ */ l("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ l("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    })
  ])
], -1), Tl = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Hl = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Rl = { class: "mt-2" }, Bl = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Il = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Fl = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Nl = [
  Fl
], Vl = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, zl = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Pl = [
  zl
], Ul = { class: "ml-1.5" }, jl = { class: "my-1 text-sm text-gray-500" }, yn = {
  __name: "ModalUnarchive",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, n = D(e.modal.data.items[0]), o = D(""), r = D([]), c = () => {
      e.emitter.emit("vf-fetch", {
        params: {
          q: "unarchive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
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
    return (d, i) => (v(), te(Je, null, {
      buttons: ne(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, x(a(s)("Unarchive")), 1),
        l("button", {
          type: "button",
          onClick: i[1] || (i[1] = (u) => a(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, x(a(s)("Cancel")), 1)
      ]),
      default: ne(() => [
        l("div", Ll, [
          Ol,
          l("div", Tl, [
            l("h3", Hl, x(a(s)("Unarchive")), 1),
            l("div", Rl, [
              (v(!0), _(ke, null, Re(r.value, (u) => (v(), _("p", Bl, [
                u.type === "dir" ? (v(), _("svg", Il, Nl)) : (v(), _("svg", Vl, Pl)),
                l("span", Ul, x(u.basename), 1)
              ]))), 256)),
              l("p", jl, x(a(s)("The archive will be unarchived at")) + " (" + x(a(e).fs.data.dirname) + ")", 1),
              o.value.length ? (v(), te(Ke, {
                key: 0,
                onHidden: i[0] || (i[0] = (u) => o.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  he(x(o.value), 1)
                ]),
                _: 1
              })) : K("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ql = { class: "sm:flex sm:items-start" }, Gl = /* @__PURE__ */ l("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ l("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "none",
    "stroke-width": "1.5"
  }, [
    /* @__PURE__ */ l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    })
  ])
], -1), Kl = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Wl = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Yl = { class: "mt-2" }, Jl = {
  class: "text-gray-500 text-sm mb-1 overflow-auto vf-scrollbar",
  style: { "max-height": "200px" }
}, Xl = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Zl = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ql = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), ei = [
  Ql
], ti = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, si = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), oi = [
  si
], ni = { class: "ml-1.5" }, ri = ["placeholder"], _n = {
  __name: "ModalArchive",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, n = D(""), o = D(""), r = D(e.modal.data.items), c = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
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
    return (d, i) => (v(), te(Je, null, {
      buttons: ne(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, x(a(s)("Archive")), 1),
        l("button", {
          type: "button",
          onClick: i[2] || (i[2] = (u) => a(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, x(a(s)("Cancel")), 1)
      ]),
      default: ne(() => [
        l("div", ql, [
          Gl,
          l("div", Kl, [
            l("h3", Wl, x(a(s)("Archive the files")), 1),
            l("div", Yl, [
              l("div", Jl, [
                (v(!0), _(ke, null, Re(r.value, (u) => (v(), _("p", Xl, [
                  u.type === "dir" ? (v(), _("svg", Zl, ei)) : (v(), _("svg", ti, oi)),
                  l("span", ni, x(u.basename), 1)
                ]))), 256))
              ]),
              Se(l("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (u) => n.value = u),
                onKeyup: _t(c, ["enter"]),
                class: "my-1 px-2 py-1 border rounded dark:bg-gray-700/25 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:text-gray-100 w-full",
                placeholder: a(s)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, ri), [
                [wt, n.value]
              ]),
              o.value.length ? (v(), te(Ke, {
                key: 0,
                onHidden: i[1] || (i[1] = (u) => o.value = ""),
                error: ""
              }, {
                default: ne(() => [
                  he(x(o.value), 1)
                ]),
                _: 1
              })) : K("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ai = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
}, li = /* @__PURE__ */ l("path", { d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" }, null, -1), ii = [
  li
];
function ci(t, e) {
  return v(), _("svg", ai, [...ii]);
}
const di = { render: ci }, ui = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
}, mi = /* @__PURE__ */ l("path", { d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9" }, null, -1), fi = [
  mi
];
function pi(t, e) {
  return v(), _("svg", ui, [...fi]);
}
const vi = { render: pi }, hi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
}, gi = /* @__PURE__ */ l("path", { d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" }, null, -1), bi = [
  gi
];
function yi(t, e) {
  return v(), _("svg", hi, [...bi]);
}
const _i = { render: yi }, wi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
}, xi = /* @__PURE__ */ l("path", { d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" }, null, -1), ki = [
  xi
];
function $i(t, e) {
  return v(), _("svg", wi, [...ki]);
}
const Si = { render: $i }, Ci = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
}, Ei = /* @__PURE__ */ l("path", { d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" }, null, -1), Ai = [
  Ei
];
function Di(t, e) {
  return v(), _("svg", Ci, [...Ai]);
}
const Mi = { render: Di }, Li = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
}, Oi = /* @__PURE__ */ l("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1), Ti = [
  Oi
];
function Hi(t, e) {
  return v(), _("svg", Li, [...Ti]);
}
const Ri = { render: Hi }, Bi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
}, Ii = /* @__PURE__ */ l("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1), Fi = [
  Ii
];
function Ni(t, e) {
  return v(), _("svg", Bi, [...Fi]);
}
const Vi = { render: Ni }, zi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
  viewBox: "0 0 24 24"
}, Pi = /* @__PURE__ */ l("circle", {
  cx: "12",
  cy: "12",
  r: "10",
  stroke: "currentColor",
  "stroke-width": "4",
  class: "opacity-25 stroke-blue-900 dark:stroke-blue-100"
}, null, -1), Ui = /* @__PURE__ */ l("path", {
  fill: "currentColor",
  d: "M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.96 7.96 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938z",
  class: "opacity-75"
}, null, -1), ji = [
  Pi,
  Ui
];
function qi(t, e) {
  return v(), _("svg", zi, [...ji]);
}
const wn = { render: qi }, Gi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
}, Ki = /* @__PURE__ */ l("path", { d: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18z" }, null, -1), Wi = [
  Ki
];
function Yi(t, e) {
  return v(), _("svg", Gi, [...Wi]);
}
const Ji = { render: Yi }, Xi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
}, Zi = /* @__PURE__ */ l("path", { d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75" }, null, -1), Qi = [
  Zi
];
function ec(t, e) {
  return v(), _("svg", Xi, [...Qi]);
}
const tc = { render: ec }, sc = { class: "border-neutral-300 flex justify-between items-center py-1 text-sm" }, oc = {
  key: 0,
  class: "flex text-center"
}, nc = ["aria-label"], rc = ["aria-label"], ac = ["aria-label"], lc = ["aria-label"], ic = ["aria-label"], cc = ["aria-label"], dc = ["aria-label"], uc = {
  key: 1,
  class: "flex text-center"
}, mc = { class: "pl-2" }, fc = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, pc = { class: "flex text-center items-center justify-end" }, vc = ["aria-label"], hc = {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto cursor-pointer stroke-gray-500 hover:stroke-cyan-700 dark:stroke-gray-400 dark:hover:stroke-gray-300",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "none",
  "stroke-width": "1.5"
}, gc = {
  key: 0,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
}, bc = {
  key: 1,
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
}, yc = ["aria-label"], _c = {
  __name: "Toolbar",
  setup(t) {
    const e = fe("ServiceContainer"), { setStore: s } = e.storage, { t: n } = e.i18n, o = e.dragSelect, r = D("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      r.value = i;
    });
    const c = () => {
      e.fullScreen = !e.fullScreen, s("full-screen", e.fullScreen), e.emitter.emit("vf-fullscreen-toggle");
    }, d = () => {
      e.view = e.view === "list" ? "grid" : "list", o.refreshSelection(), s("viewport", e.view);
    };
    return (i, u) => (v(), _("div", sc, [
      r.value.length ? (v(), _("div", uc, [
        l("div", mc, [
          he(x(a(n)("Search results for")) + " ", 1),
          l("span", fc, x(r.value), 1)
        ]),
        a(e).fs.loading ? (v(), te(a(wn), { key: 0 })) : K("", !0)
      ])) : (v(), _("div", oc, [
        a(e).features.includes(a(be).NEW_FOLDER) ? (v(), _("div", {
          key: 0,
          class: "mx-1.5",
          "aria-label": a(n)("New Folder"),
          "data-microtip-position": "bottom-right",
          role: "tooltip",
          onClick: u[0] || (u[0] = (m) => a(e).modal.open(vn, { items: a(o).getSelected() }))
        }, [
          re(a(di))
        ], 8, nc)) : K("", !0),
        a(e).features.includes(a(be).NEW_FILE) ? (v(), _("div", {
          key: 1,
          class: "mx-1.5",
          "aria-label": a(n)("New File"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: u[1] || (u[1] = (m) => a(e).modal.open(Ha, { items: a(o).getSelected() }))
        }, [
          re(a(vi))
        ], 8, rc)) : K("", !0),
        a(e).features.includes(a(be).RENAME) ? (v(), _("div", {
          key: 2,
          class: "mx-1.5",
          "aria-label": a(n)("Rename"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: u[2] || (u[2] = (m) => a(o).getCount() !== 1 || a(e).modal.open(hn, { items: a(o).getSelected() }))
        }, [
          re(a(_i), {
            class: ye(a(o).getCount() === 1 ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, ac)) : K("", !0),
        a(e).features.includes(a(be).DELETE) ? (v(), _("div", {
          key: 3,
          class: "mx-1.5",
          "aria-label": a(n)("Delete"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: u[3] || (u[3] = (m) => !a(o).getCount() || a(e).modal.open(gn, { items: a(o).getSelected() }))
        }, [
          re(a(Si), {
            class: ye(a(o).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, lc)) : K("", !0),
        a(e).features.includes(a(be).UPLOAD) ? (v(), _("div", {
          key: 4,
          class: "mx-1.5",
          "aria-label": a(n)("Upload"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: u[4] || (u[4] = (m) => a(e).modal.open(bn, { items: a(o).getSelected() }))
        }, [
          re(a(Mi))
        ], 8, ic)) : K("", !0),
        a(e).features.includes(a(be).UNARCHIVE) && a(o).getCount() === 1 && a(o).getSelected()[0].mime_type === "application/zip" ? (v(), _("div", {
          key: 5,
          class: "mx-1.5",
          "aria-label": a(n)("Unarchive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: u[5] || (u[5] = (m) => !a(o).getCount() || a(e).modal.open(yn, { items: a(o).getSelected() }))
        }, [
          re(a(Vi), {
            class: ye(a(o).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, cc)) : K("", !0),
        a(e).features.includes(a(be).ARCHIVE) ? (v(), _("div", {
          key: 6,
          class: "mx-1.5",
          "aria-label": a(n)("Archive"),
          "data-microtip-position": "bottom",
          role: "tooltip",
          onClick: u[6] || (u[6] = (m) => !a(o).getCount() || a(e).modal.open(_n, { items: a(o).getSelected() }))
        }, [
          re(a(Ri), {
            class: ye(a(o).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled")
          }, null, 8, ["class"])
        ], 8, dc)) : K("", !0)
      ])),
      l("div", pc, [
        a(e).features.includes(a(be).FULL_SCREEN) ? (v(), _("div", {
          key: 0,
          class: "mx-1.5",
          "aria-label": a(n)("Toggle Full Screen"),
          "data-microtip-position": "bottom-left",
          role: "tooltip",
          onClick: c
        }, [
          (v(), _("svg", hc, [
            a(e).fullScreen ? (v(), _("path", gc)) : (v(), _("path", bc))
          ]))
        ], 8, vc)) : K("", !0),
        l("div", {
          class: "mx-1.5",
          "aria-label": a(n)("Change View"),
          "data-microtip-position": "bottom-left",
          role: "tooltip",
          onClick: u[7] || (u[7] = (m) => r.value.length || d())
        }, [
          a(e).view === "grid" ? (v(), te(a(Ji), {
            key: 0,
            class: ye(r.value.length ? "vf-toolbar-icon-disabled" : "vf-toolbar-icon")
          }, null, 8, ["class"])) : K("", !0),
          a(e).view === "list" ? (v(), te(a(tc), {
            key: 1,
            class: ye(r.value.length ? "vf-toolbar-icon-disabled" : "vf-toolbar-icon")
          }, null, 8, ["class"])) : K("", !0)
        ], 8, yc)
      ])
    ]));
  }
}, wc = (t, e = 0, s = !1) => {
  let n;
  return (...o) => {
    s && !n && t(...o), clearTimeout(n), n = setTimeout(() => {
      t(...o);
    }, e);
  };
}, Co = (t, e, s) => {
  const n = D(t);
  return Tn((o, r) => ({
    get() {
      return o(), n.value;
    },
    set: wc(
      (c) => {
        n.value = c, r();
      },
      e,
      s
    )
  }));
}, xc = { class: "sm:flex sm:items-start" }, kc = /* @__PURE__ */ l("div", { class: "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-50 dark:bg-gray-500 sm:mx-0 sm:h-10 sm:w-10" }, [
  /* @__PURE__ */ l("svg", {
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    "stroke-width": "2",
    stroke: "currentColor",
    "aria-hidden": "true"
  }, [
    /* @__PURE__ */ l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    })
  ])
], -1), $c = { class: "mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full" }, Sc = {
  class: "text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
  id: "modal-title"
}, Cc = { class: "text-sm text-gray-500 pb-1" }, Ec = { class: "max-h-[200px] overflow-y-auto vf-scrollbar text-left" }, Ac = { class: "flex text-sm text-gray-800 dark:text-gray-400" }, Dc = {
  key: 0,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Mc = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
}, null, -1), Lc = [
  Mc
], Oc = {
  key: 1,
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Tc = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
}, null, -1), Hc = [
  Tc
], Rc = { class: "ml-1.5" }, Bc = { class: "font-bold text-xs text-gray-700 dark:text-gray-500 mt-3 tracking-wider" }, Ic = { class: "flex text-sm text-gray-800 dark:text-gray-400 border dark:border-gray-700 p-1 rounded" }, Fc = /* @__PURE__ */ l("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, [
  /* @__PURE__ */ l("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
  })
], -1), Nc = { class: "ml-1.5 overflow-auto" }, Vc = { class: "m-1 mr-auto font-bold text-gray-500 text-sm dark:text-gray-200 self-center" }, Fs = {
  __name: "ModalMove",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, n = D(e.modal.data.items.from), o = D(""), r = () => {
      n.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
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
    return (c, d) => (v(), te(Je, null, {
      buttons: ne(() => [
        l("button", {
          type: "button",
          onClick: r,
          class: "vf-btn vf-btn-primary"
        }, x(a(s)("Yes, Move!")), 1),
        l("button", {
          type: "button",
          onClick: d[1] || (d[1] = (i) => a(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, x(a(s)("Cancel")), 1),
        l("div", Vc, x(a(s)("%s item(s) selected.", n.value.length)), 1)
      ]),
      default: ne(() => [
        l("div", xc, [
          kc,
          l("div", $c, [
            l("h3", Sc, x(a(s)("Move files")), 1),
            l("p", Cc, x(a(s)("Are you sure you want to move these files?")), 1),
            l("div", Ec, [
              (v(!0), _(ke, null, Re(n.value, (i) => (v(), _("div", Ac, [
                l("div", null, [
                  i.type === "dir" ? (v(), _("svg", Dc, Lc)) : (v(), _("svg", Oc, Hc))
                ]),
                l("div", Rc, x(i.path), 1)
              ]))), 256))
            ]),
            l("h4", Bc, x(a(s)("Target Directory")), 1),
            l("p", Ic, [
              Fc,
              l("span", Nc, x(a(e).modal.data.items.to.path), 1)
            ]),
            o.value.length ? (v(), te(Ke, {
              key: 0,
              onHidden: d[0] || (d[0] = (i) => o.value = ""),
              error: ""
            }, {
              default: ne(() => [
                he(x(o.value), 1)
              ]),
              _: 1
            })) : K("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, zc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "-40 -40 580 580"
}, Pc = /* @__PURE__ */ l("path", { d: "M463.5 224h8.5c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224z" }, null, -1), Uc = [
  Pc
];
function jc(t, e) {
  return v(), _("svg", zc, [...Uc]);
}
const qc = { render: jc }, Gc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-0.5 rounded",
  viewBox: "0 0 20 20"
}, Kc = /* @__PURE__ */ l("path", {
  "fill-rule": "evenodd",
  d: "M5.293 9.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L11 7.414V15a1 1 0 1 1-2 0V7.414L6.707 9.707a1 1 0 0 1-1.414 0",
  class: "pointer-events-none",
  "clip-rule": "evenodd"
}, null, -1), Wc = [
  Kc
];
function Yc(t, e) {
  return v(), _("svg", Gc, [...Wc]);
}
const Jc = { render: Yc }, Xc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "0 0 24 24"
}, Zc = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M6 18 18 6M6 6l12 12"
}, null, -1), Qc = [
  Zc
];
function ed(t, e) {
  return v(), _("svg", Xc, [...Qc]);
}
const td = { render: ed }, sd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 20 20"
}, od = /* @__PURE__ */ l("path", {
  d: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414z",
  class: "pointer-events-none"
}, null, -1), nd = [
  od
];
function rd(t, e) {
  return v(), _("svg", sd, [...nd]);
}
const ad = { render: rd }, ld = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 m-auto stroke-gray-400 fill-gray-100 dark:stroke-gray-400 dark:fill-gray-400/20",
  viewBox: "0 0 20 20"
}, id = /* @__PURE__ */ l("path", { d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607" }, null, -1), cd = [
  id
];
function dd(t, e) {
  return v(), _("svg", ld, [...cd]);
}
const ud = { render: dd }, md = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "w-6 h-6 cursor-pointer",
  viewBox: "0 0 24 24"
}, fd = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M6 18 18 6M6 6l12 12"
}, null, -1), pd = [
  fd
];
function vd(t, e) {
  return v(), _("svg", md, [...pd]);
}
const hd = { render: vd }, gd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  viewBox: "0 0 24 24"
}, bd = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2"
}, null, -1), yd = [
  bd
];
function _d(t, e) {
  return v(), _("svg", gd, [...yd]);
}
const xn = { render: _d }, wd = {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 rounded text-slate-700 hover:bg-neutral-100 dark:fill-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 448 512"
}, xd = /* @__PURE__ */ l("path", { d: "M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112" }, null, -1), kd = [
  xd
];
function $d(t, e) {
  return v(), _("svg", wd, [...kd]);
}
const Sd = { render: $d }, Cd = { class: "flex p-1.5 bg-neutral-100 dark:bg-gray-800 border-t border-b border-neutral-300 dark:border-gray-700/50 items-center select-none text-sm" }, Ed = ["aria-label"], Ad = ["aria-label"], Dd = ["aria-label"], Md = { class: "flex leading-6" }, Ld = {
  key: 0,
  class: "flex"
}, Od = /* @__PURE__ */ l("div", { class: "text-neutral-300 dark:text-gray-600 mx-0.5" }, "/", -1), Td = { class: "relative" }, Hd = /* @__PURE__ */ l("span", { class: "text-neutral-300 dark:text-gray-600 mx-0.5" }, "/", -1), Rd = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], Bd = { class: "relative flex bg-white dark:bg-gray-700 justify-between items-center rounded p-1 ml-2 w-full" }, Id = ["placeholder"], Fd = { class: "z-30 absolute top-[65px] md:top-[75px] left-[90px] rounded -mx-1.5 mt-1 bg-neutral-50 dark:bg-gray-800 max-w-80 max-h-50 shadow overflow-y-auto text-gray-700 dark:text-gray-200 border border-neutral-300 dark:border-gray-600" }, Nd = ["onDrop", "onClick"], Vd = { class: "flex pointer-events-none" }, zd = { class: "inline-block w-full text-ellipsis overflow-hidden" }, Pd = {
  __name: "Breadcrumb",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, n = e.dragSelect, o = D(null), r = Co(0, 100);
    At(r, (O) => {
      const k = o.value.children;
      let L = 0, P = 0, I = 5, V = 1;
      e.fs.limitBreadcrumbItems(I), Dt(() => {
        for (let B = k.length - 1; B >= 0 && !(L + k[B].offsetWidth > r.value - 40); B--)
          L += parseInt(k[B].offsetWidth, 10), P++;
        P < V && (P = V), P > I && (P = I), e.fs.limitBreadcrumbItems(P);
      });
    });
    const c = () => {
      r.value = o.value.offsetWidth;
    };
    Me(() => {
      new ResizeObserver(c).observe(o.value);
    });
    const d = (O, k = null) => {
      O.preventDefault(), n.isDraggingRef.value = !1, m(O), k ?? (k = e.fs.hiddenBreadcrumbs.length - 1);
      let L = JSON.parse(O.dataTransfer.getData("items"));
      if (L.find((P) => P.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Fs, {
        items: {
          from: L,
          to: e.fs.hiddenBreadcrumbs[k] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, i = (O, k = null) => {
      O.preventDefault(), n.isDraggingRef.value = !1, m(O), k ?? (k = e.fs.breadcrumbs.length - 2);
      let L = JSON.parse(O.dataTransfer.getData("items"));
      if (L.find((P) => P.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Fs, {
        items: {
          from: L,
          to: e.fs.breadcrumbs[k] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, u = (O) => {
      O.preventDefault(), e.fs.isGoUpAvailable() ? (O.dataTransfer.dropEffect = "copy", O.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-600")) : (O.dataTransfer.dropEffect = "none", O.dataTransfer.effectAllowed = "none");
    }, m = (O) => {
      O.preventDefault(), O.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600"), e.fs.isGoUpAvailable() && O.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600");
    }, f = () => {
      S(), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    }, p = () => {
      S(), !e.fs.isGoUpAvailable() || e.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: e.fs.adapter,
          path: e.fs.parentFolderPath
        }
      });
    }, h = (O) => {
      e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: O.path } }), e.fs.toggleHiddenBreadcrumbs(!1);
    }, g = () => {
      e.fs.showHiddenBreadcrumbs && e.fs.toggleHiddenBreadcrumbs(!1);
    }, y = {
      mounted(O, k, L, P) {
        O.clickOutsideEvent = function(I) {
          O === I.target || O.contains(I.target) || k.value();
        }, document.body.addEventListener("click", O.clickOutsideEvent);
      },
      beforeUnmount(O, k, L, P) {
        document.body.removeEventListener("click", O.clickOutsideEvent);
      }
    }, w = D(null), C = () => {
      e.features.includes(be.SEARCH) && (e.fs.searchMode = !0, Dt(() => w.value.focus()));
    }, b = Co("", 400);
    At(b, (O) => {
      e.emitter.emit("vf-toast-clear"), e.emitter.emit("vf-search-query", { newQuery: O });
    });
    const S = () => {
      e.fs.searchMode = !1, b.value = "";
    };
    e.emitter.on("vf-search-exit", () => {
      S();
    });
    const N = () => {
      b.value === "" && S();
    };
    return (O, k) => (v(), _("div", Cd, [
      l("span", {
        "aria-label": a(s)("Go up a directory"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        re(a(Jc), {
          onDragover: k[0] || (k[0] = (L) => u(L)),
          onDragleave: k[1] || (k[1] = (L) => m(L)),
          onDrop: k[2] || (k[2] = (L) => i(L)),
          onClick: p,
          class: ye(a(e).fs.isGoUpAvailable() ? "text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer" : "text-gray-400 dark:text-neutral-500")
        }, null, 8, ["class"])
      ], 8, Ed),
      a(e).fs.loading ? (v(), _("span", {
        key: 1,
        "aria-label": a(s)("Cancel"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        re(a(td), {
          onClick: k[3] || (k[3] = (L) => a(e).emitter.emit("vf-fetch-abort"))
        })
      ], 8, Dd)) : (v(), _("span", {
        key: 0,
        "aria-label": a(s)("Refresh"),
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, [
        re(a(qc), { onClick: f })
      ], 8, Ad)),
      Se(l("div", {
        onClick: tt(C, ["self"]),
        class: "group flex bg-white dark:bg-gray-700 items-center rounded p-1 ml-2 w-full overflow-hidden"
      }, [
        l("div", null, [
          re(a(ad), {
            onDragover: k[4] || (k[4] = (L) => u(L)),
            onDragleave: k[5] || (k[5] = (L) => m(L)),
            onDrop: k[6] || (k[6] = (L) => i(L, -1)),
            onClick: k[7] || (k[7] = (L) => a(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(e).fs.adapter } }))
          })
        ]),
        l("div", Md, [
          a(e).fs.hiddenBreadcrumbs.length ? Se((v(), _("div", Ld, [
            Od,
            l("div", Td, [
              l("span", {
                onDragenter: k[8] || (k[8] = (L) => a(e).fs.toggleHiddenBreadcrumbs(!0)),
                onClick: k[9] || (k[9] = (L) => a(e).fs.toggleHiddenBreadcrumbs()),
                class: "text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded cursor-pointer"
              }, [
                re(a(Sd), { class: "px-1 pointer-events-none" })
              ], 32)
            ])
          ])), [
            [y, g]
          ]) : K("", !0)
        ]),
        l("div", {
          ref_key: "breadcrumbContainer",
          ref: o,
          class: "flex leading-6 w-full overflow-hidden",
          onClick: tt(C, ["self"])
        }, [
          (v(!0), _(ke, null, Re(a(e).fs.breadcrumbs, (L, P) => (v(), _("div", { key: P }, [
            Hd,
            l("span", {
              onDragover: (I) => P === a(e).fs.breadcrumbs.length - 1 || u(I),
              onDragleave: (I) => P === a(e).fs.breadcrumbs.length - 1 || m(I),
              onDrop: (I) => P === a(e).fs.breadcrumbs.length - 1 || i(I, P),
              class: "px-1.5 py-1 text-slate-700 dark:text-slate-200 hover:bg-neutral-100 dark:hover:bg-gray-800 rounded cursor-pointer whitespace-nowrap",
              title: L.basename,
              onClick: (I) => a(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: a(e).fs.adapter, path: L.path } })
            }, x(L.name), 41, Rd)
          ]))), 128))
        ], 512),
        a(e).fs.loading ? (v(), te(a(wn), { key: 0 })) : K("", !0)
      ], 512), [
        [at, !a(e).fs.searchMode]
      ]),
      Se(l("div", Bd, [
        l("div", null, [
          re(a(ud))
        ]),
        Se(l("input", {
          ref_key: "searchInput",
          ref: w,
          onKeydown: _t(S, ["esc"]),
          onBlur: N,
          "onUpdate:modelValue": k[10] || (k[10] = (L) => Hn(b) ? b.value = L : null),
          placeholder: a(s)("Search anything.."),
          class: "w-full pb-0 px-1 border-0 text-base ring-0 outline-0 text-gray-600 focus:ring-transparent focus:border-transparent dark:focus:ring-transparent dark:focus:border-transparent dark:text-gray-300 bg-transparent",
          type: "text"
        }, null, 40, Id), [
          [wt, a(b)]
        ]),
        re(a(hd), { onClick: S })
      ], 512), [
        [at, a(e).fs.searchMode]
      ]),
      Se(l("div", Fd, [
        (v(!0), _(ke, null, Re(a(e).fs.hiddenBreadcrumbs, (L, P) => (v(), _("div", {
          key: P,
          onDragover: k[11] || (k[11] = (I) => u(I)),
          onDragleave: k[12] || (k[12] = (I) => m(I)),
          onDrop: (I) => d(I, P),
          onClick: (I) => h(L),
          class: "px-2 py-0.5 hover:bg-gray-400/20 cursor-pointer items-center whitespace-nowrap"
        }, [
          l("div", Vd, [
            l("span", null, [
              re(a(xn), { class: "h-5 w-5" })
            ]),
            he(),
            l("span", zd, x(L.name), 1)
          ])
        ], 40, Nd))), 128))
      ], 512), [
        [at, a(e).fs.showHiddenBreadcrumbs]
      ])
    ]));
  }
}, kn = (t, e = null) => new Date(t * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), Ud = ["onClick"], jd = {
  __name: "Toast",
  setup(t) {
    const e = fe("ServiceContainer"), { getStore: s } = e.storage, n = D(s("full-screen", !1)), o = D([]), r = (i) => i === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", c = (i) => {
      o.value.splice(i, 1);
    }, d = (i) => {
      let u = o.value.findIndex((m) => m.id === i);
      u !== -1 && c(u);
    };
    return e.emitter.on("vf-toast-clear", () => {
      o.value = [];
    }), e.emitter.on("vf-toast-push", (i) => {
      let u = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      i.id = u, o.value.push(i), setTimeout(() => {
        d(u);
      }, 5e3);
    }), (i, u) => (v(), _("div", {
      class: ye([n.value.value ? "fixed" : "absolute", "max-w-fit flex flex-col bottom-0 left-1/2 -translate-x-1/2"])
    }, [
      re(Rn, {
        name: "vf-toast-item",
        "leave-active-class": "transition-all duration-1000",
        "leave-to-class": "opacity-0"
      }, {
        default: ne(() => [
          (v(!0), _(ke, null, Re(o.value, (m, f) => (v(), _("div", {
            onClick: (p) => c(f),
            key: m,
            class: ye([r(m.type), "inline-block mx-auto my-0.5 py-0.5 px-2 min-w-max bg-gray-50 dark:bg-gray-600 border text-xs sm:text-sm rounded cursor-pointer"])
          }, x(m.label), 11, Ud))), 128))
        ]),
        _: 1
      })
    ], 2));
  }
}, qd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
}, Gd = /* @__PURE__ */ l("path", {
  "fill-rule": "evenodd",
  d: "M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414",
  "clip-rule": "evenodd"
}, null, -1), Kd = [
  Gd
];
function Wd(t, e) {
  return v(), _("svg", qd, [...Kd]);
}
const Yd = { render: Wd }, Jd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
}, Xd = /* @__PURE__ */ l("path", {
  "fill-rule": "evenodd",
  d: "M14.707 12.707a1 1 0 0 1-1.414 0L10 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414",
  "clip-rule": "evenodd"
}, null, -1), Zd = [
  Xd
];
function Qd(t, e) {
  return v(), _("svg", Jd, [...Zd]);
}
const eu = { render: Qd }, Pt = {
  __name: "SortIcon",
  props: { direction: String },
  setup(t) {
    return (e, s) => (v(), _("div", null, [
      t.direction === "asc" ? (v(), te(a(Yd), { key: 0 })) : K("", !0),
      t.direction === "desc" ? (v(), te(a(eu), { key: 1 })) : K("", !0)
    ]));
  }
}, tu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500",
  viewBox: "0 0 24 24"
}, su = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
}, null, -1), ou = [
  su
];
function nu(t, e) {
  return v(), _("svg", tu, [...ou]);
}
const ru = { render: nu }, ws = {
  __name: "ItemIcon",
  props: {
    type: {
      type: String,
      required: !0
    },
    small: {
      type: Boolean,
      default: !1
    }
  },
  setup(t) {
    return (e, s) => (v(), _("span", null, [
      t.type === "dir" ? (v(), te(a(xn), {
        key: 0,
        class: ye({ "h-5 w-5": t.small, "h-10 w-10 md:h-12 md:w-12 m-auto": !t.small })
      }, null, 8, ["class"])) : (v(), te(a(ru), {
        key: 1,
        class: ye({ "h-5 w-5": t.small, "h-10 w-10 md:h-12 md:w-12 m-auto": !t.small })
      }, null, 8, ["class"]))
    ]));
  }
}, au = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "absolute h-6 w-6 md:h-12 md:w-12 m-auto stroke-neutral-500 fill-white dark:fill-gray-700 dark:stroke-gray-600 z-10",
  viewBox: "0 0 24 24"
}, lu = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
}, null, -1), iu = [
  lu
];
function cu(t, e) {
  return v(), _("svg", au, [...iu]);
}
const du = { render: cu }, uu = { class: "absolute -z-50 -top-96" }, mu = { class: "text-neutral-700 dark:text-neutral-300 p-1 absolute text-center top-4 right-[-2rem] md:top-5 md:right-[-2.4rem] z-20 text-xs" }, fu = {
  __name: "DragItem",
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  setup(t) {
    const e = t;
    return (s, n) => (v(), _("div", uu, [
      re(a(du)),
      l("div", mu, x(e.count), 1)
    ]));
  }
}, pu = { class: "flex" }, vu = ["aria-label"], hu = { class: "ml-auto mb-2" }, gu = {
  key: 0,
  class: "p-2 border font-normal whitespace-pre-wrap border-gray-200 dark:border-gray-700/50 dark:text-gray-200 rounded min-h-[200px] max-h-[60vh] text-xs overflow-auto"
}, bu = { key: 1 }, yu = {
  __name: "Text",
  emits: ["success"],
  setup(t, { emit: e }) {
    const s = e, n = D(""), o = D(""), r = D(null), c = D(!1), d = D(""), i = D(!1), u = fe("ServiceContainer"), { t: m } = u.i18n;
    Me(() => {
      u.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: u.modal.data.adapter, path: u.modal.data.item.path },
        responseType: "text"
      }).then((h) => {
        n.value = h, s("success");
      });
    });
    const f = () => {
      c.value = !c.value, o.value = n.value;
    }, p = () => {
      d.value = "", i.value = !1, u.requester.send({
        url: "",
        method: "post",
        params: {
          q: "save",
          adapter: u.modal.data.adapter,
          path: u.modal.data.item.path
        },
        body: {
          content: o.value
        },
        responseType: "text"
      }).then((h) => {
        d.value = m("Updated."), n.value = h, s("success"), c.value = !c.value;
      }).catch((h) => {
        d.value = m(h.message), i.value = !0;
      });
    };
    return (h, g) => (v(), _(ke, null, [
      l("div", pu, [
        l("div", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(u).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, x(a(u).modal.data.item.basename), 9, vu),
        l("div", hu, [
          c.value ? (v(), _("button", {
            key: 0,
            onClick: p,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, x(a(m)("Save")), 1)) : K("", !0),
          a(u).features.includes(a(be).EDIT) ? (v(), _("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: g[0] || (g[0] = (y) => f())
          }, x(c.value ? a(m)("Cancel") : a(m)("Edit")), 1)) : K("", !0)
        ])
      ]),
      l("div", null, [
        c.value ? (v(), _("div", bu, [
          Se(l("textarea", {
            ref_key: "editInput",
            ref: r,
            "onUpdate:modelValue": g[1] || (g[1] = (y) => o.value = y),
            class: "w-full p-2 rounded dark:bg-gray-700 dark:text-gray-200 dark:focus:ring-gray-600 dark:focus:border-gray-600 dark:selection:bg-gray-500 min-h-[200px] max-h-[60vh]",
            name: "text",
            id: "",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [wt, o.value]
          ])
        ])) : (v(), _("pre", gu, x(n.value), 1)),
        d.value.length ? (v(), te(Ke, {
          key: 2,
          onHidden: g[2] || (g[2] = (y) => d.value = ""),
          error: i.value
        }, {
          default: ne(() => [
            he(x(d.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : K("", !0)
      ])
    ], 64));
  }
}, _u = { class: "flex" }, wu = ["aria-label"], xu = { class: "ml-auto mb-2" }, ku = { class: "w-full flex justify-center" }, $u = ["src"], Su = {
  __name: "Image",
  emits: ["success"],
  setup(t, { emit: e }) {
    const s = e, n = fe("ServiceContainer"), { t: o } = n.i18n, r = D(null), c = D(null), d = D(!1), i = D(""), u = D(!1), m = () => {
      d.value = !d.value, d.value ? c.value = new qn(r.value, {
        crop(p) {
        }
      }) : c.value.destroy();
    }, f = () => {
      c.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (p) => {
          i.value = "", u.value = !1;
          const h = new FormData();
          h.set("file", p), n.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: n.modal.data.adapter,
              path: n.modal.data.item.path
            },
            body: h
          }).then((g) => {
            i.value = o("Updated."), r.value.src = n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item), m(), s("success");
          }).catch((g) => {
            i.value = o(g.message), u.value = !0;
          });
        }
      );
    };
    return Me(() => {
      s("success");
    }), (p, h) => (v(), _(ke, null, [
      l("div", _u, [
        l("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(n).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, x(a(n).modal.data.item.basename), 9, wu),
        l("div", xu, [
          d.value ? (v(), _("button", {
            key: 0,
            onClick: f,
            class: "ml-1 px-2 py-1 rounded border border-transparent shadow-sm bg-blue-700/75 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-700/50 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
          }, x(a(o)("Crop")), 1)) : K("", !0),
          a(n).features.includes(a(be).EDIT) ? (v(), _("button", {
            key: 1,
            class: "ml-1 px-2 py-1 text-blue-500",
            onClick: h[0] || (h[0] = (g) => m())
          }, x(d.value ? a(o)("Cancel") : a(o)("Edit")), 1)) : K("", !0)
        ])
      ]),
      l("div", ku, [
        l("img", {
          ref_key: "image",
          ref: r,
          class: "max-w-[50vh] max-h-[50vh]",
          src: a(n).requester.getPreviewUrl(a(n).modal.data.adapter, a(n).modal.data.item),
          alt: ""
        }, null, 8, $u)
      ]),
      i.value.length ? (v(), te(Ke, {
        key: 0,
        onHidden: h[1] || (h[1] = (g) => i.value = ""),
        error: u.value
      }, {
        default: ne(() => [
          he(x(i.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : K("", !0)
    ], 64));
  }
}, Cu = { class: "flex" }, Eu = ["aria-label"], Au = /* @__PURE__ */ l("div", null, null, -1), Du = {
  __name: "Default",
  emits: ["success"],
  setup(t, { emit: e }) {
    const s = fe("ServiceContainer"), n = e;
    return Me(() => {
      n("success");
    }), (o, r) => (v(), _(ke, null, [
      l("div", Cu, [
        l("h3", {
          class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
          id: "modal-title",
          "aria-label": a(s).modal.data.item.path,
          "data-microtip-position": "bottom-right",
          role: "tooltip"
        }, x(a(s).modal.data.item.basename), 9, Eu)
      ]),
      Au
    ], 64));
  }
}, Mu = ["aria-label"], Lu = {
  class: "w-full aspect-video",
  preload: "",
  controls: ""
}, Ou = ["src"], Tu = {
  __name: "Video",
  emits: ["success"],
  setup(t, { emit: e }) {
    const s = fe("ServiceContainer"), n = e, o = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return Me(() => {
      n("success");
    }), (r, c) => (v(), _("div", null, [
      l("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, x(a(s).modal.data.item.basename), 9, Mu),
      l("div", null, [
        l("video", Lu, [
          l("source", {
            src: o(),
            type: "video/mp4"
          }, null, 8, Ou),
          he(" Your browser does not support the video tag. ")
        ])
      ])
    ]));
  }
}, Hu = ["aria-label"], Ru = {
  class: "w-full",
  controls: ""
}, Bu = ["src"], Iu = {
  __name: "Audio",
  emits: ["success"],
  setup(t, { emit: e }) {
    const s = e, n = fe("ServiceContainer"), o = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return Me(() => {
      s("success");
    }), (r, c) => (v(), _(ke, null, [
      l("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(n).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, x(a(n).modal.data.item.basename), 9, Hu),
      l("div", null, [
        l("audio", Ru, [
          l("source", {
            src: o(),
            type: "audio/mpeg"
          }, null, 8, Bu),
          he(" Your browser does not support the audio element. ")
        ])
      ])
    ], 64));
  }
}, Fu = ["aria-label"], Nu = ["data"], Vu = ["src"], zu = /* @__PURE__ */ l("p", null, [
  /* @__PURE__ */ he(" Your browser does not support PDFs. "),
  /* @__PURE__ */ l("a", { href: "https://example.com/test.pdf" }, "Download the PDF"),
  /* @__PURE__ */ he(" . ")
], -1), Pu = [
  zu
], Uu = {
  __name: "Pdf",
  emits: ["success"],
  setup(t, { emit: e }) {
    const s = fe("ServiceContainer"), n = e, o = () => s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
    return Me(() => {
      n("success");
    }), (r, c) => (v(), _(ke, null, [
      l("h3", {
        class: "mb-2 text-lg leading-6 font-medium text-gray-900 dark:text-gray-400",
        id: "modal-title",
        "aria-label": a(s).modal.data.item.path,
        "data-microtip-position": "bottom-right",
        role: "tooltip"
      }, x(a(s).modal.data.item.basename), 9, Fu),
      l("div", null, [
        l("object", {
          class: "h-[60vh]",
          data: o(),
          type: "application/pdf",
          width: "100%",
          height: "100%"
        }, [
          l("iframe", {
            class: "border-0",
            src: o(),
            width: "100%",
            height: "100%"
          }, Pu, 8, Vu)
        ], 8, Nu)
      ])
    ], 64));
  }
}, ju = { class: "sm:flex sm:items-start" }, qu = { class: "mt-3 text-center sm:mt-0 sm:text-left w-full" }, Gu = { key: 0 }, Ku = { class: "text-gray-700 dark:text-gray-200 text-sm" }, Wu = {
  key: 0,
  class: "flex leading-5"
}, Yu = /* @__PURE__ */ l("svg", {
  class: "animate-spin -ml-1 mr-3 h-5 w-5 text-white",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24"
}, [
  /* @__PURE__ */ l("circle", {
    class: "opacity-25 stroke-blue-900 dark:stroke-blue-100",
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    "stroke-width": "4"
  }),
  /* @__PURE__ */ l("path", {
    class: "opacity-75",
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  })
], -1), Ju = { class: "py-2 flex font-normal break-all dark:text-gray-200 rounded text-xs" }, Xu = { class: "font-bold" }, Zu = { class: "font-bold pl-2" }, Qu = {
  key: 0,
  class: "text-xs text-gray-600 dark:text-gray-400"
}, $n = {
  __name: "ModalPreview",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, n = D(!1), o = (d) => (e.modal.data.item.mime_type ?? "").startsWith(d), r = () => {
      const d = e.requester.getDownloadUrl(e.modal.data.adapter, e.modal.data.item);
      e.emitter.emit("vf-download", d), e.emitter.emit("vf-modal-close");
    }, c = e.features.includes(be.PREVIEW);
    return c || (n.value = !0), (d, i) => (v(), te(Je, null, {
      buttons: ne(() => [
        l("button", {
          type: "button",
          onClick: i[6] || (i[6] = (u) => a(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, x(a(s)("Close")), 1),
        a(e).features.includes(a(be).DOWNLOAD) ? (v(), _("div", {
          key: 0,
          class: "vf-btn vf-btn-primary",
          onClick: i[7] || (i[7] = (u) => r())
        }, x(a(s)("Download")), 1)) : K("", !0)
      ]),
      default: ne(() => [
        l("div", ju, [
          l("div", qu, [
            a(c) ? (v(), _("div", Gu, [
              o("text") ? (v(), te(yu, {
                key: 0,
                onSuccess: i[0] || (i[0] = (u) => n.value = !0)
              })) : o("image") ? (v(), te(Su, {
                key: 1,
                onSuccess: i[1] || (i[1] = (u) => n.value = !0)
              })) : o("video") ? (v(), te(Tu, {
                key: 2,
                onSuccess: i[2] || (i[2] = (u) => n.value = !0)
              })) : o("audio") ? (v(), te(Iu, {
                key: 3,
                onSuccess: i[3] || (i[3] = (u) => n.value = !0)
              })) : o("application/pdf") ? (v(), te(Uu, {
                key: 4,
                onSuccess: i[4] || (i[4] = (u) => n.value = !0)
              })) : (v(), te(Du, {
                key: 5,
                onSuccess: i[5] || (i[5] = (u) => n.value = !0)
              }))
            ])) : K("", !0),
            l("div", Ku, [
              n.value === !1 ? (v(), _("div", Wu, [
                Yu,
                l("span", null, x(a(s)("Loading")), 1)
              ])) : K("", !0)
            ])
          ])
        ]),
        l("div", Ju, [
          l("div", null, [
            l("span", Xu, x(a(s)("File Size")) + ": ", 1),
            he(x(a(e).filesize(a(e).modal.data.item.file_size)), 1)
          ]),
          l("div", null, [
            l("span", Zu, x(a(s)("Last Modified")) + ": ", 1),
            he(" " + x(a(kn)(a(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        a(e).features.includes(a(be).DOWNLOAD) ? (v(), _("div", Qu)) : K("", !0)
      ]),
      _: 1
    }));
  }
}, e0 = ["data-type", "data-item", "data-index"], xs = {
  __name: "Item",
  props: {
    item: { type: Object },
    index: { type: Number },
    dragImage: { type: Object }
  },
  setup(t) {
    const e = fe("ServiceContainer"), s = e.dragSelect, n = t, o = (p) => {
      p.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: p.path } })) : e.modal.open($n, { adapter: e.fs.adapter, item: p });
    }, r = {
      mounted(p, h, g, y) {
        g.props.draggable && (p.addEventListener("dragstart", (w) => c(w, h.value)), p.addEventListener("dragover", (w) => i(w, h.value)), p.addEventListener("drop", (w) => d(w, h.value)));
      },
      beforeUnmount(p, h, g, y) {
        g.props.draggable && (p.removeEventListener("dragstart", c), p.removeEventListener("dragover", i), p.removeEventListener("drop", d));
      }
    }, c = (p, h) => {
      if (p.altKey || p.ctrlKey || p.metaKey)
        return p.preventDefault(), !1;
      s.isDraggingRef.value = !0, p.dataTransfer.setDragImage(n.dragImage.$el, 0, 15), p.dataTransfer.effectAllowed = "all", p.dataTransfer.dropEffect = "copy", p.dataTransfer.setData("items", JSON.stringify(s.getSelected()));
    }, d = (p, h) => {
      p.preventDefault(), s.isDraggingRef.value = !1;
      let g = JSON.parse(p.dataTransfer.getData("items"));
      if (g.find((y) => y.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Fs, { items: { from: g, to: h } });
    }, i = (p, h) => {
      p.preventDefault(), !h || h.type !== "dir" || s.getSelection().find((g) => g === p.currentTarget) ? (p.dataTransfer.dropEffect = "none", p.dataTransfer.effectAllowed = "none") : p.dataTransfer.dropEffect = "copy";
    };
    let u = null;
    const m = () => {
      u && clearTimeout(u);
    }, f = (p) => {
      u = setTimeout(() => {
        const h = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: p.target.getBoundingClientRect().x,
          clientY: p.target.getBoundingClientRect().y
        });
        p.target.dispatchEvent(h);
      }, 500);
    };
    return (p, h) => Se((v(), _("div", {
      style: Ns({ opacity: a(s).isDraggingRef.value && a(s).getSelection().find((g) => p.$el === g) ? "0.5 !important" : "" }),
      class: ye(["vf-item-" + a(s).explorerId]),
      "data-type": t.item.type,
      key: t.item.path,
      "data-item": JSON.stringify(t.item),
      "data-index": t.index,
      onDblclick: h[0] || (h[0] = (g) => o(t.item)),
      onTouchstart: h[1] || (h[1] = (g) => f(g)),
      onTouchend: h[2] || (h[2] = (g) => m()),
      onContextmenu: h[3] || (h[3] = tt((g) => a(e).emitter.emit("vf-contextmenu-show", { event: g, items: a(s).getSelected(), target: t.item }), ["prevent"]))
    }, [
      Gt(p.$slots, "default")
    ], 46, e0)), [
      [r, t.item]
    ]);
  }
}, t0 = {
  key: 0,
  class: "grid grid-cols-12 px-1 bg-neutral-50 dark:bg-gray-800 border-b border-neutral-300 dark:border-gray-700 text-xs select-none divide-x"
}, s0 = { class: "relative" }, o0 = { class: "grid grid-cols-12 items-center" }, n0 = { class: "flex col-span-7 items-center" }, r0 = { class: "overflow-ellipsis overflow-hidden whitespace-nowrap" }, a0 = { class: "col-span-5 overflow-ellipsis overflow-hidden whitespace-nowrap" }, l0 = { class: "grid grid-cols-12 items-center" }, i0 = { class: "flex col-span-7 items-center" }, c0 = { class: "overflow-ellipsis overflow-hidden whitespace-nowrap" }, d0 = { class: "col-span-2 text-center" }, u0 = { class: "col-span-3 overflow-ellipsis overflow-hidden whitespace-nowrap px-1 md:px-3" }, m0 = { class: "relative" }, f0 = ["data-src", "alt"], p0 = {
  key: 2,
  class: "absolute hidden md:block top-1/2 w-full text-center text-neutral-500"
}, v0 = { class: "break-all" }, h0 = {
  key: 1,
  class: "pointer-events-none select-none cursor-pointer w-full h-full bg-slate-100 text-slate-500 absolute flex items-center justify-center"
}, g0 = {
  __name: "Explorer",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, n = (h) => h == null ? void 0 : h.substring(0, 3), o = D(null), r = D(""), c = e.dragSelect;
    D(!1);
    const d = D(!1), i = D(null);
    let u;
    e.emitter.on("vf-fullscreen-toggle", () => {
      c.area.value.style.height = null;
    }), e.emitter.on("vf-search-query", ({ newQuery: h }) => {
      r.value = h, h ? e.emitter.emit("vf-fetch", {
        params: {
          q: "search",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname,
          filter: h
        },
        onSuccess: (g) => {
          g.files.length || e.emitter.emit("vf-toast-push", { label: s("No search result found.") });
        }
      }) : e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    });
    const m = Ot({ active: !1, column: "", order: "" }), f = (h = !0) => {
      let g = [...e.fs.data.files], y = m.column, w = m.order === "asc" ? 1 : -1;
      if (!h)
        return g;
      const C = (b, S) => typeof b == "string" && typeof S == "string" ? b.toLowerCase().localeCompare(S.toLowerCase()) : b < S ? -1 : b > S ? 1 : 0;
      return m.active && (g = g.slice().sort((b, S) => C(b[y], S[y]) * w)), g;
    }, p = (h) => {
      m.active && m.column === h ? (m.active = m.order === "asc", m.column = h, m.order = "desc") : (m.active = !0, m.column = h, m.order = "asc");
    };
    return Me(() => {
      u = new jn(c.area.value), i.value.addEventListener("dragover", (g) => {
        g.preventDefault(), d.value = !0;
      }), i.value.addEventListener("dragleave", (g) => {
        g.preventDefault(), d.value = !1;
      });
      function h(g, y) {
        return y.isFile ? new Promise((w, C) => {
          y.file((b) => {
            g(y, b), w();
          }, C);
        }) : y.isDirectory ? new Promise((w, C) => {
          y.createReader().readEntries(async (S) => {
            try {
              for (const N of S)
                await h(g, N);
              w();
            } catch (N) {
              C(N);
            }
          }, C);
        }) : Promise.resolve();
      }
      i.value.addEventListener("drop", async (g) => {
        g.preventDefault(), d.value = !1;
        const y = /^[/\\](.+)/, w = [], C = [...g.dataTransfer.items].map(async (b) => {
          b.kind === "file" && await h((S, N) => {
            const O = y.exec(S.fullPath);
            w.push({ file: N, path: O[1] });
          }, b.webkitGetAsEntry());
        });
        await Promise.all(C), window.tmpFileList = w, e.modal.open(bn, { items: c.getSelected() });
      });
    }), Ao(() => {
      u.update();
    }), Do(() => {
      u.destroy();
    }), (h, g) => (v(), _("div", {
      ref_key: "dropArea",
      ref: i,
      class: "relative flex-auto flex flex-col overflow-hidden"
    }, [
      a(e).view === "list" || r.value.length ? (v(), _("div", t0, [
        l("div", {
          onClick: g[0] || (g[0] = (y) => p("basename")),
          class: "col-span-7 vf-sort-button"
        }, [
          he(x(a(s)("Name")) + " ", 1),
          Se(re(Pt, {
            direction: m.order
          }, null, 8, ["direction"]), [
            [at, m.active && m.column === "basename"]
          ])
        ]),
        r.value.length ? K("", !0) : (v(), _("div", {
          key: 0,
          onClick: g[1] || (g[1] = (y) => p("file_size")),
          class: "justify-center col-span-2 vf-sort-button"
        }, [
          he(x(a(s)("Size")) + " ", 1),
          Se(re(Pt, {
            direction: m.order
          }, null, 8, ["direction"]), [
            [at, m.active && m.column === "file_size"]
          ])
        ])),
        r.value.length ? K("", !0) : (v(), _("div", {
          key: 1,
          onClick: g[2] || (g[2] = (y) => p("last_modified")),
          class: "justify-center col-span-3 vf-sort-button"
        }, [
          he(x(a(s)("Date")) + " ", 1),
          Se(re(Pt, {
            direction: m.order
          }, null, 8, ["direction"]), [
            [at, m.active && m.column === "last_modified"]
          ])
        ])),
        r.value.length ? (v(), _("div", {
          key: 2,
          onClick: g[3] || (g[3] = (y) => p("path")),
          class: "justify-center col-span-5 vf-sort-button"
        }, [
          he(x(a(s)("Filepath")) + " ", 1),
          Se(re(Pt, {
            direction: m.order
          }, null, 8, ["direction"]), [
            [at, m.active && m.column === "path"]
          ])
        ])) : K("", !0)
      ])) : K("", !0),
      l("div", s0, [
        re(fu, {
          ref_key: "dragImage",
          ref: o,
          count: a(c).getCount()
        }, null, 8, ["count"])
      ]),
      l("div", {
        ref: a(c).scrollBarContainer,
        class: ye(["vf-explorer-scrollbar-container", [{ "grid-view": a(e).view === "grid" }]])
      }, [
        l("div", {
          ref: a(c).scrollBar,
          class: "w-5 bg-transparent pointer-events-none"
        }, null, 512)
      ], 2),
      l("div", {
        ref: a(c).area,
        class: ye([{ "resize-y": !a(e).fullScreen }, "h-full w-full text-xs vf-explorer-scrollbar vf-selector-area min-h-[150px] z-0 overflow-y-auto"]),
        onContextmenu: g[4] || (g[4] = tt((y) => a(e).emitter.emit("vf-contextmenu-show", { event: y, items: a(c).getSelected() }), ["self", "prevent"]))
      }, [
        r.value.length ? (v(!0), _(ke, { key: 0 }, Re(f(), (y, w) => (v(), te(xs, {
          item: y,
          index: w,
          dragImage: o.value,
          class: "vf-item vf-item-list"
        }, {
          default: ne(() => [
            l("div", o0, [
              l("div", n0, [
                re(ws, {
                  type: y.type,
                  small: a(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", r0, x(y.basename), 1)
              ]),
              l("div", a0, x(y.path), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : K("", !0),
        a(e).view === "list" && !r.value.length ? (v(!0), _(ke, { key: 1 }, Re(f(), (y, w) => (v(), te(xs, {
          item: y,
          index: w,
          dragImage: o.value,
          class: "vf-item vf-item-list",
          draggable: "true"
        }, {
          default: ne(() => [
            l("div", l0, [
              l("div", i0, [
                re(ws, {
                  type: y.type,
                  small: a(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", c0, x(y.basename), 1)
              ]),
              l("div", d0, x(y.file_size ? a(e).filesize(y.file_size) : ""), 1),
              l("div", u0, x(a(kn)(y.last_modified)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : K("", !0),
        a(e).view === "grid" && !r.value.length ? (v(!0), _(ke, { key: 2 }, Re(f(!1), (y, w) => (v(), te(xs, {
          item: y,
          index: w,
          dragImage: o.value,
          class: "vf-item vf-item-grid",
          draggable: "true"
        }, {
          default: ne(() => [
            l("div", null, [
              l("div", m0, [
                (y.mime_type ?? "").startsWith("image") && a(e).showThumbnails ? (v(), _("img", {
                  src: "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                  class: "lazy h-10 md:h-12 m-auto",
                  "data-src": a(e).requester.getPreviewUrl(a(e).fs.adapter, y),
                  alt: y.basename,
                  key: y.path
                }, null, 8, f0)) : (v(), te(ws, {
                  key: 1,
                  type: y.type
                }, null, 8, ["type"])),
                !((y.mime_type ?? "").startsWith("image") && a(e).showThumbnails) && y.type !== "dir" ? (v(), _("div", p0, x(n(y.extension)), 1)) : K("", !0)
              ]),
              l("span", v0, x(a(Is)(y.basename)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : K("", !0)
      ], 34),
      re(jd),
      d.value ? (v(), _("div", h0, x(a(s)("Release to drop these files.")), 1)) : K("", !0)
    ], 512));
  }
}, b0 = ["onClick"], y0 = /* @__PURE__ */ l("span", { class: "px-1" }, null, -1), _0 = {
  __name: "ContextMenu",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, n = D(null), o = D([]), r = D(""), c = Ot({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    }), d = vt(() => c.items.filter((f) => f.key == null || e.features.includes(f.key)));
    e.emitter.on("vf-context-selected", (f) => {
      o.value = f;
    });
    const i = {
      newfolder: {
        key: be.NEW_FOLDER,
        title: () => s("New Folder"),
        action: () => e.modal.open(vn)
      },
      delete: {
        key: be.DELETE,
        title: () => s("Delete"),
        action: () => {
          e.modal.open(gn, { items: o });
        }
      },
      refresh: {
        title: () => s("Refresh"),
        action: () => {
          e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
        }
      },
      preview: {
        key: be.PREVIEW,
        title: () => s("Preview"),
        action: () => e.modal.open($n, { adapter: e.fs.adapter, item: o.value[0] })
      },
      open: {
        title: () => s("Open"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
            params: {
              q: "index",
              adapter: e.fs.adapter,
              path: o.value[0].path
            }
          });
        }
      },
      openDir: {
        title: () => s("Open containing folder"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
            params: {
              q: "index",
              adapter: e.fs.adapter,
              path: o.value[0].dir
            }
          });
        }
      },
      download: {
        key: be.DOWNLOAD,
        link: vt(() => e.requester.getDownloadUrl(e.fs.adapter, o.value[0])),
        title: () => s("Download"),
        action: () => {
        }
      },
      archive: {
        key: be.ARCHIVE,
        title: () => s("Archive"),
        action: () => e.modal.open(_n, { items: o })
      },
      unarchive: {
        key: be.UNARCHIVE,
        title: () => s("Unarchive"),
        action: () => e.modal.open(yn, { items: o })
      },
      rename: {
        key: be.RENAME,
        title: () => s("Rename"),
        action: () => e.modal.open(hn, { items: o })
      }
    }, u = (f) => {
      e.emitter.emit("vf-contextmenu-hide"), f.action();
    };
    e.emitter.on("vf-search-query", ({ newQuery: f }) => {
      r.value = f;
    }), e.emitter.on("vf-contextmenu-show", ({ event: f, items: p, target: h = null }) => {
      if (c.items = [], r.value)
        if (h)
          c.items.push(i.openDir), e.emitter.emit("vf-context-selected", [h]);
        else
          return;
      else
        !h && !r.value ? (c.items.push(i.refresh), c.items.push(i.newfolder), e.emitter.emit("vf-context-selected", [])) : p.length > 1 && p.some((g) => g.path === h.path) ? (c.items.push(i.refresh), c.items.push(i.archive), c.items.push(i.delete), e.emitter.emit("vf-context-selected", p)) : (h.type === "dir" ? c.items.push(i.open) : (c.items.push(i.preview), c.items.push(i.download)), c.items.push(i.rename), h.mime_type === "application/zip" ? c.items.push(i.unarchive) : c.items.push(i.archive), c.items.push(i.delete), e.emitter.emit("vf-context-selected", [h]));
      m(f);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      c.active = !1;
    });
    const m = (f) => {
      const p = e.dragSelect.area.value, h = e.root.getBoundingClientRect(), g = p.getBoundingClientRect();
      let y = f.clientX - h.left, w = f.clientY - h.top;
      c.active = !0, Dt(() => {
        var N;
        const C = (N = n.value) == null ? void 0 : N.getBoundingClientRect();
        let b = (C == null ? void 0 : C.height) ?? 0, S = (C == null ? void 0 : C.width) ?? 0;
        y = g.right - f.pageX + window.scrollX < S ? y - S : y, w = g.bottom - f.pageY + window.scrollY < b ? w - b : w, c.positions = {
          left: y + "px",
          top: w + "px"
        };
      });
    };
    return (f, p) => c.active ? (v(), _("ul", {
      key: 0,
      class: "z-30 absolute text-xs bg-neutral-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-neutral-300 dark:border-gray-600 shadow rounded select-none",
      ref_key: "contextmenu",
      ref: n,
      style: Ns(c.positions)
    }, [
      (v(!0), _(ke, null, Re(d.value, (h) => (v(), _("li", {
        class: "px-2 py-1.5 cursor-pointer hover:bg-neutral-200 dark:hover:bg-gray-700",
        key: h.title,
        onClick: (g) => u(h)
      }, [
        y0,
        l("span", null, x(h.title()), 1)
      ], 8, b0))), 128))
    ], 4)) : K("", !0);
  }
}, w0 = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
}, x0 = /* @__PURE__ */ l("path", {
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
}, null, -1), k0 = [
  x0
];
function $0(t, e) {
  return v(), _("svg", w0, [...k0]);
}
const S0 = { render: $0 }, C0 = { class: "p-1 text-xs border-t border-neutral-300 dark:border-gray-700/50 flex justify-between select-none" }, E0 = { class: "flex leading-5 items-center" }, A0 = ["aria-label"], D0 = ["value"], M0 = { class: "ml-3" }, L0 = { key: 0 }, O0 = { class: "ml-1" }, T0 = { class: "flex leading-5 items-center justify-end" }, H0 = ["disabled"], R0 = ["aria-label"], B0 = /* @__PURE__ */ l("svg", {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-5 w-5 stroke-slate-500 cursor-pointer",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "2"
}, [
  /* @__PURE__ */ l("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
  }),
  /* @__PURE__ */ l("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
  })
], -1), I0 = [
  B0
], F0 = {
  __name: "Statusbar",
  setup(t) {
    const e = fe("ServiceContainer"), { t: s } = e.i18n, { setStore: n } = e.storage, o = e.dragSelect, r = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter } }), n("adapter", e.fs.adapter);
    }, c = D("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      c.value = i;
    });
    const d = vt(() => {
      const i = e.selectButton.multiple ? o.getSelected().length > 0 : o.getSelected().length === 1;
      return e.selectButton.active && i;
    });
    return (i, u) => (v(), _("div", C0, [
      l("div", E0, [
        l("div", {
          class: "mx-2",
          "aria-label": a(s)("Storage"),
          "data-microtip-position": "top-right",
          role: "tooltip"
        }, [
          re(a(S0))
        ], 8, A0),
        Se(l("select", {
          "onUpdate:modelValue": u[0] || (u[0] = (m) => a(e).fs.adapter = m),
          onChange: r,
          class: "py-0.5 text-sm text-slate-500 border dark:border-gray-600 dark:text-neutral-50 dark:bg-gray-700 rounded pl-2 pr-8"
        }, [
          (v(!0), _(ke, null, Re(a(e).fs.data.storages, (m) => (v(), _("option", { value: m }, x(m), 9, D0))), 256))
        ], 544), [
          [Bn, a(e).fs.adapter]
        ]),
        l("div", M0, [
          c.value.length ? (v(), _("span", L0, x(a(e).fs.data.files.length) + " items found. ", 1)) : K("", !0),
          l("span", O0, x(a(e).dragSelect.getCount() > 0 ? a(s)("%s item(s) selected.", a(e).dragSelect.getCount()) : ""), 1)
        ])
      ]),
      l("div", T0, [
        a(e).selectButton.active ? (v(), _("button", {
          key: 0,
          class: ye(["vf-btn py-0 vf-btn-primary", { disabled: !d.value }]),
          disabled: !d.value,
          onClick: u[1] || (u[1] = (m) => a(e).selectButton.click(a(o).getSelected(), m))
        }, x(a(s)("Select")), 11, H0)) : K("", !0),
        l("span", {
          class: "mr-1",
          "aria-label": a(s)("Settings"),
          "data-microtip-position": "top-left",
          role: "tooltip",
          onClick: u[2] || (u[2] = (m) => a(e).emitter.emit("vf-modal-show", { type: "about" }))
        }, I0, 8, R0)
      ])
    ]));
  }
}, N0 = {
  __name: "VueFinder",
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
      default: ""
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
    showThumbnails: {
      type: Boolean,
      default: !0
    },
    selectButton: {
      type: Object,
      default(t) {
        return {
          active: !1,
          multiple: !1,
          click: (e) => {
          },
          ...t
        };
      }
    }
  },
  emits: ["select"],
  setup(t, { expose: e, emit: s }) {
    const n = s, r = ma(t, fe("VueFinderOptions"));
    In("ServiceContainer", r);
    const { setStore: c } = r.storage, d = D(null);
    r.root = d;
    const i = r.dragSelect, u = (f) => {
      Object.assign(r.fs.data, f), i.clearSelection(), i.refreshSelection();
    };
    let m;
    return r.emitter.on("vf-fetch-abort", () => {
      m.abort(), r.fs.loading = !1;
    }), r.emitter.on("vf-fetch", ({ params: f, body: p = null, onSuccess: h = null, onError: g = null, noCloseModal: y = !1 }) => {
      ["index", "search"].includes(f.q) && (m && m.abort(), r.fs.loading = !0), m = new AbortController();
      const w = m.signal;
      r.requester.send({
        url: "",
        method: f.m || "get",
        params: f,
        body: p,
        abortSignal: w
      }).then((C) => {
        r.fs.adapter = C.adapter, r.persist && (r.fs.path = C.dirname, c("path", r.fs.path)), ["index", "search"].includes(f.q) && (r.fs.loading = !1), y || r.modal.close(), f.q === "index" && C.sessionKey && (window.vueFinderSessionKey = C.sessionKey, window.vueFinderSessionKeyDate = /* @__PURE__ */ new Date()), u(C), h && h(C);
      }).catch((C) => {
        console.error(C), g && g(C);
      });
    }), r.emitter.on("vf-download", (f) => {
      console.log("download");
    }), Me(() => {
      let f = {};
      r.fs.path.includes("://") && (f = {
        adapter: r.fs.path.split("://")[0],
        path: r.fs.path
      }), r.emitter.emit("vf-fetch", { params: { q: "index", adapter: r.fs.adapter, ...f } }), i.onSelect((p) => {
        n("select", p);
      });
    }), e({
      app: r
    }), (f, p) => (v(), _("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: d
    }, [
      l("div", {
        class: ye(a(r).theme.actualValue)
      }, [
        l("div", {
          class: ye([a(r).fullscreen ? "fixed w-screen inset-0 z-20" : "relative rounded-md", "border flex flex-col bg-white dark:bg-gray-800 text-gray-700 dark:text-neutral-400 border-neutral-300 dark:border-gray-900 min-w-min select-none"]),
          style: Ns(a(r).fullscreen ? "" : "height: 100%; width: 100%;"),
          onMousedown: p[0] || (p[0] = (h) => a(r).emitter.emit("vf-contextmenu-hide")),
          onTouchstart: p[1] || (p[1] = (h) => a(r).emitter.emit("vf-contextmenu-hide"))
        }, [
          re(_c),
          re(Pd),
          re(g0),
          re(F0)
        ], 38),
        re(Fn, { name: "fade" }, {
          default: ne(() => [
            a(r).modal.visible ? (v(), te(Nn(a(r).modal.type), { key: 0 })) : K("", !0)
          ]),
          _: 1
        }),
        re(_0)
      ], 2)
    ], 512));
  }
}, J0 = {
  /**
   * @param {import('vue').App} app
   * @param options
   */
  install(t, e = {}) {
    e.i18n = e.i18n ?? {};
    let [s] = Object.keys(e.i18n);
    e.locale = e.locale ?? s ?? "en", t.provide("VueFinderOptions", e), t.component("VueFinder", N0);
  }
};
export {
  J0 as default
};
