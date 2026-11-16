"""Tiny SVG helper for course schematics (ГОСТ-style logic elements, op-amps, resistors, timing diagrams)."""
import html, os

INK = "#1b1b1b"
ACC = "#e8590c"      # accent (highlighted path)
BLUE = "#1c6dd0"
GREEN = "#2b8a3e"
GREY = "#868e96"
FILL_ACC = "#fff1e6"
FILL_BLUE = "#e7f0fb"
FILL_GREY = "#f1f3f5"
FONT = "Arial, Helvetica, 'Liberation Sans', sans-serif"
OUT = os.path.join(os.path.dirname(__file__), "..", "..", "img", "svg")


class D:
    def __init__(self, w, h):
        self.w, self.h, self.e = w, h, []

    # ---------- primitives ----------
    def raw(self, s):
        self.e.append(s)

    def line(self, x1, y1, x2, y2, c=INK, w=1.6, dash=None, arrow=False, arrow2=False):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        m = ""
        if arrow:
            m += f' marker-end="url(#a{self._mk(c)})"'
        if arrow2:
            m += f' marker-start="url(#a{self._mk(c)})"'
        self.e.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="{w}"{d}{m}/>')

    def path(self, pts, c=INK, w=1.6, dash=None, arrow=False, fill="none", close=False, arrow2=False):
        p = " ".join(f"{x},{y}" for x, y in pts)
        d = f' stroke-dasharray="{dash}"' if dash else ""
        m = f' marker-end="url(#a{self._mk(c)})"' if arrow else ""
        if arrow2:
            m += f' marker-start="url(#a{self._mk(c)})"'
        tag = "polygon" if close else "polyline"
        self.e.append(f'<{tag} points="{p}" fill="{fill}" stroke="{c}" stroke-width="{w}" stroke-linejoin="round"{d}{m}/>')

    def d(self, dstr, c=INK, w=1.6, fill="none", dash=None, arrow=False):
        da = f' stroke-dasharray="{dash}"' if dash else ""
        m = f' marker-end="url(#a{self._mk(c)})"' if arrow else ""
        self.e.append(f'<path d="{dstr}" fill="{fill}" stroke="{c}" stroke-width="{w}"{da}{m}/>')

    def rect(self, x, y, w, h, c=INK, fill="#fff", sw=1.6, rx=0, dash=None):
        d = f' stroke-dasharray="{dash}"' if dash else ""
        self.e.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{c}" stroke-width="{sw}"{d}/>')

    def circle(self, cx, cy, r, c=INK, fill="#fff", sw=1.6):
        self.e.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{c}" stroke-width="{sw}"/>')

    def dot(self, x, y, c=INK, r=3.2):
        self.e.append(f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}"/>')

    def text(self, x, y, t, s=14, a="middle", wt=None, c=INK, it=False, over=False, sub=None, fam=None):
        st = f' font-weight="{wt}"' if wt else ""
        if it:
            st += ' font-style="italic"'
        if over:
            st += ' text-decoration="overline"'
        if fam:
            st += f' font-family="{fam}"'
        txt = html.escape(t)
        if sub is not None:
            txt += f'<tspan font-size="{int(s*0.72)}" dy="4">{html.escape(sub)}</tspan>'
        self.e.append(f'<text x="{x}" y="{y}" font-size="{s}" text-anchor="{a}" fill="{c}"{st}>{txt}</text>')

    def otext(self, x, y, t, s=14, a="middle", c=INK, wt=None):
        """text with an overline drawn as a line (works everywhere)"""
        self.text(x, y, t, s=s, a=a, c=c, wt=wt)
        w = len(t) * s * 0.58
        x0 = x - w / 2 if a == "middle" else (x if a == "start" else x - w)
        self.line(x0, y - s * 0.86, x0 + w, y - s * 0.86, c=c, w=1.1)

    _mks = {}

    def _mk(self, c):
        k = c.replace("#", "")
        self._mks[k] = c
        return k

    # ---------- composite ----------
    def arrow(self, x1, y1, x2, y2, c=INK, w=1.6, dash=None):
        self.line(x1, y1, x2, y2, c=c, w=w, dash=dash, arrow=True)

    def bubble(self, x, y, r=4, c=INK):
        self.circle(x + r, y, r, c=c, fill="#fff", sw=1.4)

    def box(self, x, y, w, h, title=None, lines=(), s=14, fill="#fff", c=INK, wt="bold", sw=1.6, rx=4, dash=None):
        self.rect(x, y, w, h, c=c, fill=fill, sw=sw, rx=rx, dash=dash)
        allines = ([title] if title else []) + list(lines)
        n = len(allines)
        lh = s * 1.22
        y0 = y + h / 2 - (n - 1) * lh / 2 + s * 0.35
        for i, t in enumerate(allines):
            self.text(x + w / 2, y0 + i * lh, t, s=s if (i or not title) else s, wt=wt if (i == 0 and title) else None, c=c if c != INK else INK)

    def gate(self, x, y, sym, n=2, w=42, h=None, inv=False, pitch=20, inv_in=(), labels_in=None, c=INK, fill="#fff"):
        """ГОСТ logic element. returns (inputs[(x,y)], output(x,y))"""
        if h is None:
            h = max(40, pitch * n)
        self.rect(x, y, w, h, c=c, fill=fill)
        self.text(x + w / 2, y + 17, sym, s=15, wt="bold", c=c)
        ins = []
        for i in range(n):
            yy = y + h / 2 + (i - (n - 1) / 2) * pitch
            if i in inv_in:
                self.circle(x - 4, yy, 4, c=c, sw=1.4)
                ins.append((x - 8, yy))
            else:
                ins.append((x, yy))
        oy = y + h / 2
        if inv:
            self.bubble(x + w, oy, c=c)
            out = (x + w + 8, oy)
        else:
            out = (x + w, oy)
        return ins, out

    def resistor(self, x1, y1, x2, y2, label=None, lpos="above", c=INK, s=13):
        """ГОСТ resistor between two points on a horizontal or vertical line"""
        L = 34; T = 12
        if y1 == y2:
            xm = (x1 + x2) / 2
            self.line(x1, y1, xm - L / 2, y1, c=c)
            self.line(xm + L / 2, y1, x2, y1, c=c)
            self.rect(xm - L / 2, y1 - T / 2, L, T, c=c, fill="#fff", sw=1.5)
            if label:
                if lpos == "above":
                    self.text(xm, y1 - T / 2 - 5, label, s=s, c=c)
                else:
                    self.text(xm, y1 + T / 2 + s + 2, label, s=s, c=c)
        else:
            ym = (y1 + y2) / 2
            self.line(x1, y1, x1, ym - L / 2, c=c)
            self.line(x1, ym + L / 2, x1, y2, c=c)
            self.rect(x1 - T / 2, ym - L / 2, T, L, c=c, fill="#fff", sw=1.5)
            if label:
                if lpos == "left":
                    self.text(x1 - T / 2 - 5, ym + 5, label, s=s, a="end", c=c)
                else:
                    self.text(x1 + T / 2 + 5, ym + 5, label, s=s, a="start", c=c)

    def capacitor(self, x1, y1, x2, y2, label=None, c=INK):
        if y1 == y2:
            xm = (x1 + x2) / 2
            self.line(x1, y1, xm - 4, y1, c=c); self.line(xm + 4, y1, x2, y1, c=c)
            self.line(xm - 4, y1 - 12, xm - 4, y1 + 12, c=c, w=2.2); self.line(xm + 4, y1 - 12, xm + 4, y1 + 12, c=c, w=2.2)
            if label:
                self.text(xm, y1 - 17, label, s=13, c=c)
        else:
            ym = (y1 + y2) / 2
            self.line(x1, y1, x1, ym - 4, c=c); self.line(x1, ym + 4, x1, y2, c=c)
            self.line(x1 - 12, ym - 4, x1 + 12, ym - 4, c=c, w=2.2); self.line(x1 - 12, ym + 4, x1 + 12, ym + 4, c=c, w=2.2)
            if label:
                self.text(x1 + 17, ym + 5, label, s=13, a="start", c=c)

    def ground(self, x, y, c=INK):
        self.line(x, y, x, y + 8, c=c)
        self.line(x - 10, y + 8, x + 10, y + 8, c=c, w=1.8)
        self.line(x - 6, y + 12, x + 6, y + 12, c=c, w=1.6)
        self.line(x - 2, y + 16, x + 2, y + 16, c=c, w=1.4)

    def opamp(self, x, y, size=70, minus_top=True, c=INK, fill="#fff", label=None):
        """triangle op-amp; (x,y) = left edge middle. returns (top_in, bottom_in, out)"""
        h = size
        self.path([(x, y - h / 2), (x, y + h / 2), (x + size, y)], close=True, c=c, fill=fill)
        ti, bi = (x, y - h / 4), (x, y + h / 4)
        self.text(x + 9, ti[1] + 5, "−" if minus_top else "+", s=16, wt="bold", c=c)
        self.text(x + 9, bi[1] + 5, "+" if minus_top else "−", s=16, wt="bold", c=c)
        if label:
            self.text(x + size * 0.42, y + 5, label, s=12, c=c)
        return ti, bi, (x + size, y)

    def switch(self, x, y, L=34, closed=False, c=INK, vertical=False):
        """single-throw switch from (x,y) along +x (or +y)"""
        if not vertical:
            self.dot(x, y, c=c, r=2.6); self.dot(x + L, y, c=c, r=2.6)
            if closed:
                self.line(x, y, x + L, y, c=c)
            else:
                self.line(x, y, x + L - 4, y - 13, c=c)
        else:
            self.dot(x, y, c=c, r=2.6); self.dot(x, y + L, c=c, r=2.6)
            if closed:
                self.line(x, y, x, y + L, c=c)
            else:
                self.line(x, y, x + 13, y + L - 4, c=c)

    def wave(self, x0, y, levels, dx, h=22, c=INK, w=1.8):
        """digital waveform: levels list of 0/1 per slot"""
        pts = []
        x = x0
        prev = None
        for lv in levels:
            yy = y - lv * h
            if prev is not None and prev != lv:
                pts.append((x, y - prev * h))
            pts.append((x, yy))
            x += dx
            pts.append((x, yy))
            prev = lv
        self.path(pts, c=c, w=w)

    def bus_label(self, x, y, n, c=INK):
        self.line(x - 5, y + 6, x + 5, y - 6, c=c, w=1.3)
        self.text(x + 2, y - 8, str(n), s=11, c=c)

    def save(self, name, bg="#ffffff"):
        os.makedirs(OUT, exist_ok=True)
        defs = "".join(
            f'<marker id="a{k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="{c}"/></marker>'
            for k, c in self._mks.items())
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {self.w} {self.h}" width="{self.w}" height="{self.h}" '
               f'font-family="{FONT}"><defs>{defs}</defs><rect width="100%" height="100%" fill="{bg}"/>' + "".join(self.e) + "</svg>")
        with open(os.path.join(OUT, name + ".svg"), "w", encoding="utf-8") as f:
            f.write(svg)
        D._mks = {}
        return name
