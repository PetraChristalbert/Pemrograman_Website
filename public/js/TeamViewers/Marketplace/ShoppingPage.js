async function readDatabase(query) {
    try {
        const response = await fetch("/php/readDatabase.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "query=" + encodeURIComponent(query),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

let lastQuery = "";
let UserID = null;

document.addEventListener("DOMContentLoaded", async function () {
    // Obtain UserID
    let UserDiv = document.getElementById("UserID");
    UserID = UserDiv.dataset.id;


    // Generate List Product
    generateProduct(`SELECT * FROM marketplace LIMIT 40`);

    notification();

    document.getElementById('name-3').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          let Title_Produk = document.querySelector('.text-field-2.w-input').value;
          generateProduct(`SELECT * FROM marketplace WHERE Title LIKE '%${Title_Produk}%' LIMIT 40`);
        }
    });

});

async function notification() {
    // Generate List Order
    const Order_Data = await readDatabase(`SELECT * FROM transaction WHERE Buyer = '${UserID}' ORDER BY Date DESC`);
    $('.dropdown-list.w-dropdown-list').empty();
    for (let i = 0; i < Order_Data.length; i++) {
        $(document).ready(function () {
            $(".dropdown-list.w-dropdown-list").append(`
                <div class="notifobject" onclick="openProduct('${UserID}', '${Order_Data[i].ProductID}')">
                    <img
                        src="${Order_Data[i].Gambar}"
                        loading="lazy"
                        width="371.5"
                        sizes="100vw"
                        alt=""
                        class="image-15"
                    />
                    <h1 class="heading-13">${Order_Data[i].Amount} x ${Order_Data[i].Title}</h1>
                    <h1 class="price">${"Rp " + Number(Order_Data[i].Price).toLocaleString()}</h1>
                    <h1 class="price">${Order_Data[i].Status}</h1>
                </div>
            `);
        });
    }
}

async function regenerate(Based) {
    let sorter = "";
    if (Based == "Terbaru") {
        sorter = " ORDER BY Added DESC";
    } else if (Based == "Terlaris") {
        sorter = "";
    } else if (Based == "Termurah") {
        sorter = " ORDER BY Harga ASC";
    }
    generateProduct(lastQuery + sorter);
}

async function generateProduct(query) {
    $('.w-layout-vflex.flex-block-15').empty();
    lastQuery = query;
    const Product_Data = await readDatabase(query);
    for (let i = 0; i < Product_Data.length; i++) {
        $(document).ready(function () {
            $(".w-layout-vflex.flex-block-15").append(`
                <div class="w-layout-blockcontainer container-6 w-container" onclick="openProduct('${UserID}', '${Product_Data[i].Product}')">
                    <div class="w-layout-vflex flex-block-17">
                        <div class="div-block-9">
                            <img
                                src="${Product_Data[i].Gambar.split("‽")[0]}"
                                loading="lazy"
                                width="371.5"
                                sizes="(max-width: 479px) 58vw, 173.40000915527344px"
                                alt=""
                                class="image-6"
                            />
                        </div>
                        <div class="w-layout-vflex flex-block-19">
                            <div class="div-block">
                                <h1 class="heading-8">${Product_Data[i].Title}</h1>
                                <div class="text-block-2">Rp ${Number(Product_Data[i].Harga).toLocaleString()}</div>
                            </div>
                            <div class="div-block-2">
                                <div class="w-layout-hflex flex-block-20">
                                    <img
                                        src="https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/66634520e3a1125332b12d86_user%20(1).png"
                                        loading="lazy"
                                        width="70"
                                        sizes="(max-width: 767px) 16px, (max-width: 991px) 2vw, 16px"
                                        alt=""
                                        srcset="
                                            https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/66634520e3a1125332b12d86_user%20(1)-p-500.png 500w,
                                            https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/66634520e3a1125332b12d86_user%20(1).png       512w
                                        "
                                        class="image-7"
                                    />
                                    <div class="text-block-3">${Product_Data[i].Channel}</div>
                                </div>
                                <div class="w-layout-hflex flex-block-20">
                                    <img
                                        src="https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/65f493fd91716018cf94480e_star.png"
                                        loading="lazy"
                                        width="70"
                                        sizes="(max-width: 767px) 16px, (max-width: 991px) 2vw, 16px"
                                        alt=""
                                        srcset="
                                            https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/65f493fd91716018cf94480e_star-p-500.png 500w,
                                            https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/65f493fd91716018cf94480e_star.png       512w
                                        "
                                        class="image-7"
                                    />
                                    <div class="text-block-3">${Product_Data[i].Review == "" ? "0" : ratings(Product_Data[i].Review)}</div>
                                </div>
                                <div class="w-layout-hflex flex-block-20">
                                    <img
                                        src="https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/666344e790355a3bb57ecff4_shopping-cart.png"
                                        loading="lazy"
                                        width="70"
                                        alt=""
                                        class="image-7"
                                    />
                                    <div class="text-block-3">${Product_Data[i].Review == "" ? "0" : Product_Data[i].Review.split('‽').filter(item => item.trim() !== '').length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `);
        });
    }
}

function openProduct(UserID, ProductID) {
    window.location.href = `/TeamViewers/Marketplace/ProductDetail/${UserID}/${ProductID}`;
}

function ratings(review) {
    let rating = [];
    let rate = review.split('‽').filter(item => item.trim() !== '');
    for (let i = 0; i < rate.length; i++) {
        rating.push(Number(rate[i].split('§')[3]));
    }
    var sum = rating.reduce(function(a, b){
        return a + b;
    }, 0);

    var average = sum / rating.length;
    return average.toString();
}

(() => {
    var K_ = Object.create;
    var nn = Object.defineProperty;
    var Y_ = Object.getOwnPropertyDescriptor;
    var $_ = Object.getOwnPropertyNames;
    var Q_ = Object.getPrototypeOf,
        Z_ = Object.prototype.hasOwnProperty;
    var pe = (e, t) => () => (e && (t = e((e = 0))), t);
    var c = (e, t) => () => (
            t || e((t = { exports: {} }).exports, t), t.exports
        ),
        Pe = (e, t) => {
            for (var r in t) nn(e, r, { get: t[r], enumerable: !0 });
        },
        Ls = (e, t, r, n) => {
            if ((t && typeof t == "object") || typeof t == "function")
                for (let i of $_(t))
                    !Z_.call(e, i) &&
                        i !== r &&
                        nn(e, i, {
                            get: () => t[i],
                            enumerable: !(n = Y_(t, i)) || n.enumerable,
                        });
            return e;
        };
    var ae = (e, t, r) => (
            (r = e != null ? K_(Q_(e)) : {}),
            Ls(
                t || !e || !e.__esModule
                    ? nn(r, "default", { value: e, enumerable: !0 })
                    : r,
                e
            )
        ),
        et = (e) => Ls(nn({}, "__esModule", { value: !0 }), e);
    var Li = c(() => {
        "use strict";
        window.tram = (function (e) {
            function t(f, m) {
                var w = new E.Bare();
                return w.init(f, m);
            }
            function r(f) {
                return f.replace(/[A-Z]/g, function (m) {
                    return "-" + m.toLowerCase();
                });
            }
            function n(f) {
                var m = parseInt(f.slice(1), 16),
                    w = (m >> 16) & 255,
                    C = (m >> 8) & 255,
                    I = 255 & m;
                return [w, C, I];
            }
            function i(f, m, w) {
                return (
                    "#" +
                    ((1 << 24) | (f << 16) | (m << 8) | w).toString(16).slice(1)
                );
            }
            function o() {}
            function a(f, m) {
                d(
                    "Type warning: Expected: [" +
                        f +
                        "] Got: [" +
                        typeof m +
                        "] " +
                        m
                );
            }
            function s(f, m, w) {
                d("Units do not match [" + f + "]: " + m + ", " + w);
            }
            function u(f, m, w) {
                if ((m !== void 0 && (w = m), f === void 0)) return w;
                var C = w;
                return (
                    lt.test(f) || !kt.test(f)
                        ? (C = parseInt(f, 10))
                        : kt.test(f) && (C = 1e3 * parseFloat(f)),
                    0 > C && (C = 0),
                    C === C ? C : w
                );
            }
            function d(f) {
                ne.debug && window && window.console.warn(f);
            }
            function h(f) {
                for (var m = -1, w = f ? f.length : 0, C = []; ++m < w; ) {
                    var I = f[m];
                    I && C.push(I);
                }
                return C;
            }
            var v = (function (f, m, w) {
                    function C(ee) {
                        return typeof ee == "object";
                    }
                    function I(ee) {
                        return typeof ee == "function";
                    }
                    function L() {}
                    function K(ee, le) {
                        function V() {
                            var xe = new re();
                            return (
                                I(xe.init) && xe.init.apply(xe, arguments), xe
                            );
                        }
                        function re() {}
                        le === w && ((le = ee), (ee = Object)), (V.Bare = re);
                        var ie,
                            Ee = (L[f] = ee[f]),
                            Je = (re[f] = V[f] = new L());
                        return (
                            (Je.constructor = V),
                            (V.mixin = function (xe) {
                                return (re[f] = V[f] = K(V, xe)[f]), V;
                            }),
                            (V.open = function (xe) {
                                if (
                                    ((ie = {}),
                                    I(xe)
                                        ? (ie = xe.call(V, Je, Ee, V, ee))
                                        : C(xe) && (ie = xe),
                                    C(ie))
                                )
                                    for (var yr in ie)
                                        m.call(ie, yr) && (Je[yr] = ie[yr]);
                                return I(Je.init) || (Je.init = ee), V;
                            }),
                            V.open(le)
                        );
                    }
                    return K;
                })("prototype", {}.hasOwnProperty),
                g = {
                    ease: [
                        "ease",
                        function (f, m, w, C) {
                            var I = (f /= C) * f,
                                L = I * f;
                            return (
                                m +
                                w *
                                    (-2.75 * L * I +
                                        11 * I * I +
                                        -15.5 * L +
                                        8 * I +
                                        0.25 * f)
                            );
                        },
                    ],
                    "ease-in": [
                        "ease-in",
                        function (f, m, w, C) {
                            var I = (f /= C) * f,
                                L = I * f;
                            return (
                                m +
                                w * (-1 * L * I + 3 * I * I + -3 * L + 2 * I)
                            );
                        },
                    ],
                    "ease-out": [
                        "ease-out",
                        function (f, m, w, C) {
                            var I = (f /= C) * f,
                                L = I * f;
                            return (
                                m +
                                w *
                                    (0.3 * L * I +
                                        -1.6 * I * I +
                                        2.2 * L +
                                        -1.8 * I +
                                        1.9 * f)
                            );
                        },
                    ],
                    "ease-in-out": [
                        "ease-in-out",
                        function (f, m, w, C) {
                            var I = (f /= C) * f,
                                L = I * f;
                            return (
                                m + w * (2 * L * I + -5 * I * I + 2 * L + 2 * I)
                            );
                        },
                    ],
                    linear: [
                        "linear",
                        function (f, m, w, C) {
                            return (w * f) / C + m;
                        },
                    ],
                    "ease-in-quad": [
                        "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
                        function (f, m, w, C) {
                            return w * (f /= C) * f + m;
                        },
                    ],
                    "ease-out-quad": [
                        "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
                        function (f, m, w, C) {
                            return -w * (f /= C) * (f - 2) + m;
                        },
                    ],
                    "ease-in-out-quad": [
                        "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
                        function (f, m, w, C) {
                            return (f /= C / 2) < 1
                                ? (w / 2) * f * f + m
                                : (-w / 2) * (--f * (f - 2) - 1) + m;
                        },
                    ],
                    "ease-in-cubic": [
                        "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
                        function (f, m, w, C) {
                            return w * (f /= C) * f * f + m;
                        },
                    ],
                    "ease-out-cubic": [
                        "cubic-bezier(0.215, 0.610, 0.355, 1)",
                        function (f, m, w, C) {
                            return w * ((f = f / C - 1) * f * f + 1) + m;
                        },
                    ],
                    "ease-in-out-cubic": [
                        "cubic-bezier(0.645, 0.045, 0.355, 1)",
                        function (f, m, w, C) {
                            return (f /= C / 2) < 1
                                ? (w / 2) * f * f * f + m
                                : (w / 2) * ((f -= 2) * f * f + 2) + m;
                        },
                    ],
                    "ease-in-quart": [
                        "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
                        function (f, m, w, C) {
                            return w * (f /= C) * f * f * f + m;
                        },
                    ],
                    "ease-out-quart": [
                        "cubic-bezier(0.165, 0.840, 0.440, 1)",
                        function (f, m, w, C) {
                            return -w * ((f = f / C - 1) * f * f * f - 1) + m;
                        },
                    ],
                    "ease-in-out-quart": [
                        "cubic-bezier(0.770, 0, 0.175, 1)",
                        function (f, m, w, C) {
                            return (f /= C / 2) < 1
                                ? (w / 2) * f * f * f * f + m
                                : (-w / 2) * ((f -= 2) * f * f * f - 2) + m;
                        },
                    ],
                    "ease-in-quint": [
                        "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
                        function (f, m, w, C) {
                            return w * (f /= C) * f * f * f * f + m;
                        },
                    ],
                    "ease-out-quint": [
                        "cubic-bezier(0.230, 1, 0.320, 1)",
                        function (f, m, w, C) {
                            return (
                                w * ((f = f / C - 1) * f * f * f * f + 1) + m
                            );
                        },
                    ],
                    "ease-in-out-quint": [
                        "cubic-bezier(0.860, 0, 0.070, 1)",
                        function (f, m, w, C) {
                            return (f /= C / 2) < 1
                                ? (w / 2) * f * f * f * f * f + m
                                : (w / 2) * ((f -= 2) * f * f * f * f + 2) + m;
                        },
                    ],
                    "ease-in-sine": [
                        "cubic-bezier(0.470, 0, 0.745, 0.715)",
                        function (f, m, w, C) {
                            return (
                                -w * Math.cos((f / C) * (Math.PI / 2)) + w + m
                            );
                        },
                    ],
                    "ease-out-sine": [
                        "cubic-bezier(0.390, 0.575, 0.565, 1)",
                        function (f, m, w, C) {
                            return w * Math.sin((f / C) * (Math.PI / 2)) + m;
                        },
                    ],
                    "ease-in-out-sine": [
                        "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
                        function (f, m, w, C) {
                            return (
                                (-w / 2) * (Math.cos((Math.PI * f) / C) - 1) + m
                            );
                        },
                    ],
                    "ease-in-expo": [
                        "cubic-bezier(0.950, 0.050, 0.795, 0.035)",
                        function (f, m, w, C) {
                            return f === 0
                                ? m
                                : w * Math.pow(2, 10 * (f / C - 1)) + m;
                        },
                    ],
                    "ease-out-expo": [
                        "cubic-bezier(0.190, 1, 0.220, 1)",
                        function (f, m, w, C) {
                            return f === C
                                ? m + w
                                : w * (-Math.pow(2, (-10 * f) / C) + 1) + m;
                        },
                    ],
                    "ease-in-out-expo": [
                        "cubic-bezier(1, 0, 0, 1)",
                        function (f, m, w, C) {
                            return f === 0
                                ? m
                                : f === C
                                ? m + w
                                : (f /= C / 2) < 1
                                ? (w / 2) * Math.pow(2, 10 * (f - 1)) + m
                                : (w / 2) * (-Math.pow(2, -10 * --f) + 2) + m;
                        },
                    ],
                    "ease-in-circ": [
                        "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
                        function (f, m, w, C) {
                            return -w * (Math.sqrt(1 - (f /= C) * f) - 1) + m;
                        },
                    ],
                    "ease-out-circ": [
                        "cubic-bezier(0.075, 0.820, 0.165, 1)",
                        function (f, m, w, C) {
                            return w * Math.sqrt(1 - (f = f / C - 1) * f) + m;
                        },
                    ],
                    "ease-in-out-circ": [
                        "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
                        function (f, m, w, C) {
                            return (f /= C / 2) < 1
                                ? (-w / 2) * (Math.sqrt(1 - f * f) - 1) + m
                                : (w / 2) * (Math.sqrt(1 - (f -= 2) * f) + 1) +
                                      m;
                        },
                    ],
                    "ease-in-back": [
                        "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
                        function (f, m, w, C, I) {
                            return (
                                I === void 0 && (I = 1.70158),
                                w * (f /= C) * f * ((I + 1) * f - I) + m
                            );
                        },
                    ],
                    "ease-out-back": [
                        "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
                        function (f, m, w, C, I) {
                            return (
                                I === void 0 && (I = 1.70158),
                                w *
                                    ((f = f / C - 1) * f * ((I + 1) * f + I) +
                                        1) +
                                    m
                            );
                        },
                    ],
                    "ease-in-out-back": [
                        "cubic-bezier(0.680, -0.550, 0.265, 1.550)",
                        function (f, m, w, C, I) {
                            return (
                                I === void 0 && (I = 1.70158),
                                (f /= C / 2) < 1
                                    ? (w / 2) *
                                          f *
                                          f *
                                          (((I *= 1.525) + 1) * f - I) +
                                      m
                                    : (w / 2) *
                                          ((f -= 2) *
                                              f *
                                              (((I *= 1.525) + 1) * f + I) +
                                              2) +
                                      m
                            );
                        },
                    ],
                },
                b = {
                    "ease-in-back": "cubic-bezier(0.600, 0, 0.735, 0.045)",
                    "ease-out-back": "cubic-bezier(0.175, 0.885, 0.320, 1)",
                    "ease-in-out-back": "cubic-bezier(0.680, 0, 0.265, 1)",
                },
                O = document,
                T = window,
                S = "bkwld-tram",
                _ = /[\-\.0-9]/g,
                N = /[A-Z]/,
                R = "number",
                q = /^(rgb|#)/,
                F = /(em|cm|mm|in|pt|pc|px)$/,
                P = /(em|cm|mm|in|pt|pc|px|%)$/,
                W = /(deg|rad|turn)$/,
                X = "unitless",
                z = /(all|none) 0s ease 0s/,
                Y = /^(width|height)$/,
                $ = " ",
                G = O.createElement("a"),
                A = ["Webkit", "Moz", "O", "ms"],
                M = ["-webkit-", "-moz-", "-o-", "-ms-"],
                H = function (f) {
                    if (f in G.style) return { dom: f, css: f };
                    var m,
                        w,
                        C = "",
                        I = f.split("-");
                    for (m = 0; m < I.length; m++)
                        C += I[m].charAt(0).toUpperCase() + I[m].slice(1);
                    for (m = 0; m < A.length; m++)
                        if (((w = A[m] + C), w in G.style))
                            return { dom: w, css: M[m] + f };
                },
                B = (t.support = {
                    bind: Function.prototype.bind,
                    transform: H("transform"),
                    transition: H("transition"),
                    backface: H("backface-visibility"),
                    timing: H("transition-timing-function"),
                });
            if (B.transition) {
                var Z = B.timing.dom;
                if (((G.style[Z] = g["ease-in-back"][0]), !G.style[Z]))
                    for (var J in b) g[J][0] = b[J];
            }
            var k = (t.frame = (function () {
                    var f =
                        T.requestAnimationFrame ||
                        T.webkitRequestAnimationFrame ||
                        T.mozRequestAnimationFrame ||
                        T.oRequestAnimationFrame ||
                        T.msRequestAnimationFrame;
                    return f && B.bind
                        ? f.bind(T)
                        : function (m) {
                              T.setTimeout(m, 16);
                          };
                })()),
                j = (t.now = (function () {
                    var f = T.performance,
                        m = f && (f.now || f.webkitNow || f.msNow || f.mozNow);
                    return m && B.bind
                        ? m.bind(f)
                        : Date.now ||
                              function () {
                                  return +new Date();
                              };
                })()),
                p = v(function (f) {
                    function m(Q, oe) {
                        var ve = h(("" + Q).split($)),
                            ue = ve[0];
                        oe = oe || {};
                        var Se = Ze[ue];
                        if (!Se) return d("Unsupported property: " + ue);
                        if (!oe.weak || !this.props[ue]) {
                            var Be = Se[0],
                                Ne = this.props[ue];
                            return (
                                Ne || (Ne = this.props[ue] = new Be.Bare()),
                                Ne.init(this.$el, ve, Se, oe),
                                Ne
                            );
                        }
                    }
                    function w(Q, oe, ve) {
                        if (Q) {
                            var ue = typeof Q;
                            if (
                                (oe ||
                                    (this.timer && this.timer.destroy(),
                                    (this.queue = []),
                                    (this.active = !1)),
                                ue == "number" && oe)
                            )
                                return (
                                    (this.timer = new te({
                                        duration: Q,
                                        context: this,
                                        complete: L,
                                    })),
                                    void (this.active = !0)
                                );
                            if (ue == "string" && oe) {
                                switch (Q) {
                                    case "hide":
                                        V.call(this);
                                        break;
                                    case "stop":
                                        K.call(this);
                                        break;
                                    case "redraw":
                                        re.call(this);
                                        break;
                                    default:
                                        m.call(this, Q, ve && ve[1]);
                                }
                                return L.call(this);
                            }
                            if (ue == "function")
                                return void Q.call(this, this);
                            if (ue == "object") {
                                var Se = 0;
                                Je.call(
                                    this,
                                    Q,
                                    function (ye, z_) {
                                        ye.span > Se && (Se = ye.span),
                                            ye.stop(),
                                            ye.animate(z_);
                                    },
                                    function (ye) {
                                        "wait" in ye && (Se = u(ye.wait, 0));
                                    }
                                ),
                                    Ee.call(this),
                                    Se > 0 &&
                                        ((this.timer = new te({
                                            duration: Se,
                                            context: this,
                                        })),
                                        (this.active = !0),
                                        oe && (this.timer.complete = L));
                                var Be = this,
                                    Ne = !1,
                                    rn = {};
                                k(function () {
                                    Je.call(Be, Q, function (ye) {
                                        ye.active &&
                                            ((Ne = !0),
                                            (rn[ye.name] = ye.nextStyle));
                                    }),
                                        Ne && Be.$el.css(rn);
                                });
                            }
                        }
                    }
                    function C(Q) {
                        (Q = u(Q, 0)),
                            this.active
                                ? this.queue.push({ options: Q })
                                : ((this.timer = new te({
                                      duration: Q,
                                      context: this,
                                      complete: L,
                                  })),
                                  (this.active = !0));
                    }
                    function I(Q) {
                        return this.active
                            ? (this.queue.push({ options: Q, args: arguments }),
                              void (this.timer.complete = L))
                            : d(
                                  "No active transition timer. Use start() or wait() before then()."
                              );
                    }
                    function L() {
                        if (
                            (this.timer && this.timer.destroy(),
                            (this.active = !1),
                            this.queue.length)
                        ) {
                            var Q = this.queue.shift();
                            w.call(this, Q.options, !0, Q.args);
                        }
                    }
                    function K(Q) {
                        this.timer && this.timer.destroy(),
                            (this.queue = []),
                            (this.active = !1);
                        var oe;
                        typeof Q == "string"
                            ? ((oe = {}), (oe[Q] = 1))
                            : (oe =
                                  typeof Q == "object" && Q != null
                                      ? Q
                                      : this.props),
                            Je.call(this, oe, xe),
                            Ee.call(this);
                    }
                    function ee(Q) {
                        K.call(this, Q), Je.call(this, Q, yr, X_);
                    }
                    function le(Q) {
                        typeof Q != "string" && (Q = "block"),
                            (this.el.style.display = Q);
                    }
                    function V() {
                        K.call(this), (this.el.style.display = "none");
                    }
                    function re() {
                        this.el.offsetHeight;
                    }
                    function ie() {
                        K.call(this),
                            e.removeData(this.el, S),
                            (this.$el = this.el = null);
                    }
                    function Ee() {
                        var Q,
                            oe,
                            ve = [];
                        this.upstream && ve.push(this.upstream);
                        for (Q in this.props)
                            (oe = this.props[Q]),
                                oe.active && ve.push(oe.string);
                        (ve = ve.join(",")),
                            this.style !== ve &&
                                ((this.style = ve),
                                (this.el.style[B.transition.dom] = ve));
                    }
                    function Je(Q, oe, ve) {
                        var ue,
                            Se,
                            Be,
                            Ne,
                            rn = oe !== xe,
                            ye = {};
                        for (ue in Q)
                            (Be = Q[ue]),
                                ue in Ae
                                    ? (ye.transform || (ye.transform = {}),
                                      (ye.transform[ue] = Be))
                                    : (N.test(ue) && (ue = r(ue)),
                                      ue in Ze
                                          ? (ye[ue] = Be)
                                          : (Ne || (Ne = {}), (Ne[ue] = Be)));
                        for (ue in ye) {
                            if (((Be = ye[ue]), (Se = this.props[ue]), !Se)) {
                                if (!rn) continue;
                                Se = m.call(this, ue);
                            }
                            oe.call(this, Se, Be);
                        }
                        ve && Ne && ve.call(this, Ne);
                    }
                    function xe(Q) {
                        Q.stop();
                    }
                    function yr(Q, oe) {
                        Q.set(oe);
                    }
                    function X_(Q) {
                        this.$el.css(Q);
                    }
                    function Ve(Q, oe) {
                        f[Q] = function () {
                            return this.children
                                ? j_.call(this, oe, arguments)
                                : (this.el && oe.apply(this, arguments), this);
                        };
                    }
                    function j_(Q, oe) {
                        var ve,
                            ue = this.children.length;
                        for (ve = 0; ue > ve; ve++)
                            Q.apply(this.children[ve], oe);
                        return this;
                    }
                    (f.init = function (Q) {
                        if (
                            ((this.$el = e(Q)),
                            (this.el = this.$el[0]),
                            (this.props = {}),
                            (this.queue = []),
                            (this.style = ""),
                            (this.active = !1),
                            ne.keepInherited && !ne.fallback)
                        ) {
                            var oe = me(this.el, "transition");
                            oe && !z.test(oe) && (this.upstream = oe);
                        }
                        B.backface &&
                            ne.hideBackface &&
                            fe(this.el, B.backface.css, "hidden");
                    }),
                        Ve("add", m),
                        Ve("start", w),
                        Ve("wait", C),
                        Ve("then", I),
                        Ve("next", L),
                        Ve("stop", K),
                        Ve("set", ee),
                        Ve("show", le),
                        Ve("hide", V),
                        Ve("redraw", re),
                        Ve("destroy", ie);
                }),
                E = v(p, function (f) {
                    function m(w, C) {
                        var I = e.data(w, S) || e.data(w, S, new p.Bare());
                        return I.el || I.init(w), C ? I.start(C) : I;
                    }
                    f.init = function (w, C) {
                        var I = e(w);
                        if (!I.length) return this;
                        if (I.length === 1) return m(I[0], C);
                        var L = [];
                        return (
                            I.each(function (K, ee) {
                                L.push(m(ee, C));
                            }),
                            (this.children = L),
                            this
                        );
                    };
                }),
                y = v(function (f) {
                    function m() {
                        var L = this.get();
                        this.update("auto");
                        var K = this.get();
                        return this.update(L), K;
                    }
                    function w(L, K, ee) {
                        return K !== void 0 && (ee = K), L in g ? L : ee;
                    }
                    function C(L) {
                        var K = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(L);
                        return (K ? i(K[1], K[2], K[3]) : L).replace(
                            /#(\w)(\w)(\w)$/,
                            "#$1$1$2$2$3$3"
                        );
                    }
                    var I = { duration: 500, ease: "ease", delay: 0 };
                    (f.init = function (L, K, ee, le) {
                        (this.$el = L), (this.el = L[0]);
                        var V = K[0];
                        ee[2] && (V = ee[2]),
                            Ge[V] && (V = Ge[V]),
                            (this.name = V),
                            (this.type = ee[1]),
                            (this.duration = u(
                                K[1],
                                this.duration,
                                I.duration
                            )),
                            (this.ease = w(K[2], this.ease, I.ease)),
                            (this.delay = u(K[3], this.delay, I.delay)),
                            (this.span = this.duration + this.delay),
                            (this.active = !1),
                            (this.nextStyle = null),
                            (this.auto = Y.test(this.name)),
                            (this.unit =
                                le.unit || this.unit || ne.defaultUnit),
                            (this.angle =
                                le.angle || this.angle || ne.defaultAngle),
                            ne.fallback || le.fallback
                                ? (this.animate = this.fallback)
                                : ((this.animate = this.transition),
                                  (this.string =
                                      this.name +
                                      $ +
                                      this.duration +
                                      "ms" +
                                      (this.ease != "ease"
                                          ? $ + g[this.ease][0]
                                          : "") +
                                      (this.delay
                                          ? $ + this.delay + "ms"
                                          : "")));
                    }),
                        (f.set = function (L) {
                            (L = this.convert(L, this.type)),
                                this.update(L),
                                this.redraw();
                        }),
                        (f.transition = function (L) {
                            (this.active = !0),
                                (L = this.convert(L, this.type)),
                                this.auto &&
                                    (this.el.style[this.name] == "auto" &&
                                        (this.update(this.get()),
                                        this.redraw()),
                                    L == "auto" && (L = m.call(this))),
                                (this.nextStyle = L);
                        }),
                        (f.fallback = function (L) {
                            var K =
                                this.el.style[this.name] ||
                                this.convert(this.get(), this.type);
                            (L = this.convert(L, this.type)),
                                this.auto &&
                                    (K == "auto" &&
                                        (K = this.convert(
                                            this.get(),
                                            this.type
                                        )),
                                    L == "auto" && (L = m.call(this))),
                                (this.tween = new x({
                                    from: K,
                                    to: L,
                                    duration: this.duration,
                                    delay: this.delay,
                                    ease: this.ease,
                                    update: this.update,
                                    context: this,
                                }));
                        }),
                        (f.get = function () {
                            return me(this.el, this.name);
                        }),
                        (f.update = function (L) {
                            fe(this.el, this.name, L);
                        }),
                        (f.stop = function () {
                            (this.active || this.nextStyle) &&
                                ((this.active = !1),
                                (this.nextStyle = null),
                                fe(this.el, this.name, this.get()));
                            var L = this.tween;
                            L && L.context && L.destroy();
                        }),
                        (f.convert = function (L, K) {
                            if (L == "auto" && this.auto) return L;
                            var ee,
                                le = typeof L == "number",
                                V = typeof L == "string";
                            switch (K) {
                                case R:
                                    if (le) return L;
                                    if (V && L.replace(_, "") === "") return +L;
                                    ee = "number(unitless)";
                                    break;
                                case q:
                                    if (V) {
                                        if (L === "" && this.original)
                                            return this.original;
                                        if (K.test(L))
                                            return L.charAt(0) == "#" &&
                                                L.length == 7
                                                ? L
                                                : C(L);
                                    }
                                    ee = "hex or rgb string";
                                    break;
                                case F:
                                    if (le) return L + this.unit;
                                    if (V && K.test(L)) return L;
                                    ee = "number(px) or string(unit)";
                                    break;
                                case P:
                                    if (le) return L + this.unit;
                                    if (V && K.test(L)) return L;
                                    ee = "number(px) or string(unit or %)";
                                    break;
                                case W:
                                    if (le) return L + this.angle;
                                    if (V && K.test(L)) return L;
                                    ee = "number(deg) or string(angle)";
                                    break;
                                case X:
                                    if (le || (V && P.test(L))) return L;
                                    ee =
                                        "number(unitless) or string(unit or %)";
                            }
                            return a(ee, L), L;
                        }),
                        (f.redraw = function () {
                            this.el.offsetHeight;
                        });
                }),
                l = v(y, function (f, m) {
                    f.init = function () {
                        m.init.apply(this, arguments),
                            this.original ||
                                (this.original = this.convert(this.get(), q));
                    };
                }),
                D = v(y, function (f, m) {
                    (f.init = function () {
                        m.init.apply(this, arguments),
                            (this.animate = this.fallback);
                    }),
                        (f.get = function () {
                            return this.$el[this.name]();
                        }),
                        (f.update = function (w) {
                            this.$el[this.name](w);
                        });
                }),
                U = v(y, function (f, m) {
                    function w(C, I) {
                        var L, K, ee, le, V;
                        for (L in C)
                            (le = Ae[L]),
                                (ee = le[0]),
                                (K = le[1] || L),
                                (V = this.convert(C[L], ee)),
                                I.call(this, K, V, ee);
                    }
                    (f.init = function () {
                        m.init.apply(this, arguments),
                            this.current ||
                                ((this.current = {}),
                                Ae.perspective &&
                                    ne.perspective &&
                                    ((this.current.perspective =
                                        ne.perspective),
                                    fe(
                                        this.el,
                                        this.name,
                                        this.style(this.current)
                                    ),
                                    this.redraw()));
                    }),
                        (f.set = function (C) {
                            w.call(this, C, function (I, L) {
                                this.current[I] = L;
                            }),
                                fe(
                                    this.el,
                                    this.name,
                                    this.style(this.current)
                                ),
                                this.redraw();
                        }),
                        (f.transition = function (C) {
                            var I = this.values(C);
                            this.tween = new se({
                                current: this.current,
                                values: I,
                                duration: this.duration,
                                delay: this.delay,
                                ease: this.ease,
                            });
                            var L,
                                K = {};
                            for (L in this.current)
                                K[L] = L in I ? I[L] : this.current[L];
                            (this.active = !0),
                                (this.nextStyle = this.style(K));
                        }),
                        (f.fallback = function (C) {
                            var I = this.values(C);
                            this.tween = new se({
                                current: this.current,
                                values: I,
                                duration: this.duration,
                                delay: this.delay,
                                ease: this.ease,
                                update: this.update,
                                context: this,
                            });
                        }),
                        (f.update = function () {
                            fe(this.el, this.name, this.style(this.current));
                        }),
                        (f.style = function (C) {
                            var I,
                                L = "";
                            for (I in C) L += I + "(" + C[I] + ") ";
                            return L;
                        }),
                        (f.values = function (C) {
                            var I,
                                L = {};
                            return (
                                w.call(this, C, function (K, ee, le) {
                                    (L[K] = ee),
                                        this.current[K] === void 0 &&
                                            ((I = 0),
                                            ~K.indexOf("scale") && (I = 1),
                                            (this.current[K] = this.convert(
                                                I,
                                                le
                                            )));
                                }),
                                L
                            );
                        });
                }),
                x = v(function (f) {
                    function m(V) {
                        ee.push(V) === 1 && k(w);
                    }
                    function w() {
                        var V,
                            re,
                            ie,
                            Ee = ee.length;
                        if (Ee)
                            for (k(w), re = j(), V = Ee; V--; )
                                (ie = ee[V]), ie && ie.render(re);
                    }
                    function C(V) {
                        var re,
                            ie = e.inArray(V, ee);
                        ie >= 0 &&
                            ((re = ee.slice(ie + 1)),
                            (ee.length = ie),
                            re.length && (ee = ee.concat(re)));
                    }
                    function I(V) {
                        return Math.round(V * le) / le;
                    }
                    function L(V, re, ie) {
                        return i(
                            V[0] + ie * (re[0] - V[0]),
                            V[1] + ie * (re[1] - V[1]),
                            V[2] + ie * (re[2] - V[2])
                        );
                    }
                    var K = { ease: g.ease[1], from: 0, to: 1 };
                    (f.init = function (V) {
                        (this.duration = V.duration || 0),
                            (this.delay = V.delay || 0);
                        var re = V.ease || K.ease;
                        g[re] && (re = g[re][1]),
                            typeof re != "function" && (re = K.ease),
                            (this.ease = re),
                            (this.update = V.update || o),
                            (this.complete = V.complete || o),
                            (this.context = V.context || this),
                            (this.name = V.name);
                        var ie = V.from,
                            Ee = V.to;
                        ie === void 0 && (ie = K.from),
                            Ee === void 0 && (Ee = K.to),
                            (this.unit = V.unit || ""),
                            typeof ie == "number" && typeof Ee == "number"
                                ? ((this.begin = ie), (this.change = Ee - ie))
                                : this.format(Ee, ie),
                            (this.value = this.begin + this.unit),
                            (this.start = j()),
                            V.autoplay !== !1 && this.play();
                    }),
                        (f.play = function () {
                            this.active ||
                                (this.start || (this.start = j()),
                                (this.active = !0),
                                m(this));
                        }),
                        (f.stop = function () {
                            this.active && ((this.active = !1), C(this));
                        }),
                        (f.render = function (V) {
                            var re,
                                ie = V - this.start;
                            if (this.delay) {
                                if (ie <= this.delay) return;
                                ie -= this.delay;
                            }
                            if (ie < this.duration) {
                                var Ee = this.ease(ie, 0, 1, this.duration);
                                return (
                                    (re = this.startRGB
                                        ? L(this.startRGB, this.endRGB, Ee)
                                        : I(this.begin + Ee * this.change)),
                                    (this.value = re + this.unit),
                                    void this.update.call(
                                        this.context,
                                        this.value
                                    )
                                );
                            }
                            (re = this.endHex || this.begin + this.change),
                                (this.value = re + this.unit),
                                this.update.call(this.context, this.value),
                                this.complete.call(this.context),
                                this.destroy();
                        }),
                        (f.format = function (V, re) {
                            if (((re += ""), (V += ""), V.charAt(0) == "#"))
                                return (
                                    (this.startRGB = n(re)),
                                    (this.endRGB = n(V)),
                                    (this.endHex = V),
                                    (this.begin = 0),
                                    void (this.change = 1)
                                );
                            if (!this.unit) {
                                var ie = re.replace(_, ""),
                                    Ee = V.replace(_, "");
                                ie !== Ee && s("tween", re, V),
                                    (this.unit = ie);
                            }
                            (re = parseFloat(re)),
                                (V = parseFloat(V)),
                                (this.begin = this.value = re),
                                (this.change = V - re);
                        }),
                        (f.destroy = function () {
                            this.stop(),
                                (this.context = null),
                                (this.ease = this.update = this.complete = o);
                        });
                    var ee = [],
                        le = 1e3;
                }),
                te = v(x, function (f) {
                    (f.init = function (m) {
                        (this.duration = m.duration || 0),
                            (this.complete = m.complete || o),
                            (this.context = m.context),
                            this.play();
                    }),
                        (f.render = function (m) {
                            var w = m - this.start;
                            w < this.duration ||
                                (this.complete.call(this.context),
                                this.destroy());
                        });
                }),
                se = v(x, function (f, m) {
                    (f.init = function (w) {
                        (this.context = w.context),
                            (this.update = w.update),
                            (this.tweens = []),
                            (this.current = w.current);
                        var C, I;
                        for (C in w.values)
                            (I = w.values[C]),
                                this.current[C] !== I &&
                                    this.tweens.push(
                                        new x({
                                            name: C,
                                            from: this.current[C],
                                            to: I,
                                            duration: w.duration,
                                            delay: w.delay,
                                            ease: w.ease,
                                            autoplay: !1,
                                        })
                                    );
                        this.play();
                    }),
                        (f.render = function (w) {
                            var C,
                                I,
                                L = this.tweens.length,
                                K = !1;
                            for (C = L; C--; )
                                (I = this.tweens[C]),
                                    I.context &&
                                        (I.render(w),
                                        (this.current[I.name] = I.value),
                                        (K = !0));
                            return K
                                ? void (
                                      this.update &&
                                      this.update.call(this.context)
                                  )
                                : this.destroy();
                        }),
                        (f.destroy = function () {
                            if ((m.destroy.call(this), this.tweens)) {
                                var w,
                                    C = this.tweens.length;
                                for (w = C; w--; ) this.tweens[w].destroy();
                                (this.tweens = null), (this.current = null);
                            }
                        });
                }),
                ne = (t.config = {
                    debug: !1,
                    defaultUnit: "px",
                    defaultAngle: "deg",
                    keepInherited: !1,
                    hideBackface: !1,
                    perspective: "",
                    fallback: !B.transition,
                    agentTests: [],
                });
            (t.fallback = function (f) {
                if (!B.transition) return (ne.fallback = !0);
                ne.agentTests.push("(" + f + ")");
                var m = new RegExp(ne.agentTests.join("|"), "i");
                ne.fallback = m.test(navigator.userAgent);
            }),
                t.fallback("6.0.[2-5] Safari"),
                (t.tween = function (f) {
                    return new x(f);
                }),
                (t.delay = function (f, m, w) {
                    return new te({ complete: m, duration: f, context: w });
                }),
                (e.fn.tram = function (f) {
                    return t.call(null, this, f);
                });
            var fe = e.style,
                me = e.css,
                Ge = { transform: B.transform && B.transform.css },
                Ze = {
                    color: [l, q],
                    background: [l, q, "background-color"],
                    "outline-color": [l, q],
                    "border-color": [l, q],
                    "border-top-color": [l, q],
                    "border-right-color": [l, q],
                    "border-bottom-color": [l, q],
                    "border-left-color": [l, q],
                    "border-width": [y, F],
                    "border-top-width": [y, F],
                    "border-right-width": [y, F],
                    "border-bottom-width": [y, F],
                    "border-left-width": [y, F],
                    "border-spacing": [y, F],
                    "letter-spacing": [y, F],
                    margin: [y, F],
                    "margin-top": [y, F],
                    "margin-right": [y, F],
                    "margin-bottom": [y, F],
                    "margin-left": [y, F],
                    padding: [y, F],
                    "padding-top": [y, F],
                    "padding-right": [y, F],
                    "padding-bottom": [y, F],
                    "padding-left": [y, F],
                    "outline-width": [y, F],
                    opacity: [y, R],
                    top: [y, P],
                    right: [y, P],
                    bottom: [y, P],
                    left: [y, P],
                    "font-size": [y, P],
                    "text-indent": [y, P],
                    "word-spacing": [y, P],
                    width: [y, P],
                    "min-width": [y, P],
                    "max-width": [y, P],
                    height: [y, P],
                    "min-height": [y, P],
                    "max-height": [y, P],
                    "line-height": [y, X],
                    "scroll-top": [D, R, "scrollTop"],
                    "scroll-left": [D, R, "scrollLeft"],
                },
                Ae = {};
            B.transform &&
                ((Ze.transform = [U]),
                (Ae = {
                    x: [P, "translateX"],
                    y: [P, "translateY"],
                    rotate: [W],
                    rotateX: [W],
                    rotateY: [W],
                    scale: [R],
                    scaleX: [R],
                    scaleY: [R],
                    skew: [W],
                    skewX: [W],
                    skewY: [W],
                })),
                B.transform &&
                    B.backface &&
                    ((Ae.z = [P, "translateZ"]),
                    (Ae.rotateZ = [W]),
                    (Ae.scaleZ = [R]),
                    (Ae.perspective = [F]));
            var lt = /ms/,
                kt = /s|\./;
            return (e.tram = t);
        })(window.jQuery);
    });
    var Ps = c((UV, Ns) => {
        "use strict";
        var J_ = window.$,
            eb = Li() && J_.tram;
        Ns.exports = (function () {
            var e = {};
            e.VERSION = "1.6.0-Webflow";
            var t = {},
                r = Array.prototype,
                n = Object.prototype,
                i = Function.prototype,
                o = r.push,
                a = r.slice,
                s = r.concat,
                u = n.toString,
                d = n.hasOwnProperty,
                h = r.forEach,
                v = r.map,
                g = r.reduce,
                b = r.reduceRight,
                O = r.filter,
                T = r.every,
                S = r.some,
                _ = r.indexOf,
                N = r.lastIndexOf,
                R = Array.isArray,
                q = Object.keys,
                F = i.bind,
                P =
                    (e.each =
                    e.forEach =
                        function (A, M, H) {
                            if (A == null) return A;
                            if (h && A.forEach === h) A.forEach(M, H);
                            else if (A.length === +A.length) {
                                for (var B = 0, Z = A.length; B < Z; B++)
                                    if (M.call(H, A[B], B, A) === t) return;
                            } else
                                for (
                                    var J = e.keys(A), B = 0, Z = J.length;
                                    B < Z;
                                    B++
                                )
                                    if (M.call(H, A[J[B]], J[B], A) === t)
                                        return;
                            return A;
                        });
            (e.map = e.collect =
                function (A, M, H) {
                    var B = [];
                    return A == null
                        ? B
                        : v && A.map === v
                        ? A.map(M, H)
                        : (P(A, function (Z, J, k) {
                              B.push(M.call(H, Z, J, k));
                          }),
                          B);
                }),
                (e.find = e.detect =
                    function (A, M, H) {
                        var B;
                        return (
                            W(A, function (Z, J, k) {
                                if (M.call(H, Z, J, k)) return (B = Z), !0;
                            }),
                            B
                        );
                    }),
                (e.filter = e.select =
                    function (A, M, H) {
                        var B = [];
                        return A == null
                            ? B
                            : O && A.filter === O
                            ? A.filter(M, H)
                            : (P(A, function (Z, J, k) {
                                  M.call(H, Z, J, k) && B.push(Z);
                              }),
                              B);
                    });
            var W =
                (e.some =
                e.any =
                    function (A, M, H) {
                        M || (M = e.identity);
                        var B = !1;
                        return A == null
                            ? B
                            : S && A.some === S
                            ? A.some(M, H)
                            : (P(A, function (Z, J, k) {
                                  if (B || (B = M.call(H, Z, J, k))) return t;
                              }),
                              !!B);
                    });
            (e.contains = e.include =
                function (A, M) {
                    return A == null
                        ? !1
                        : _ && A.indexOf === _
                        ? A.indexOf(M) != -1
                        : W(A, function (H) {
                              return H === M;
                          });
                }),
                (e.delay = function (A, M) {
                    var H = a.call(arguments, 2);
                    return setTimeout(function () {
                        return A.apply(null, H);
                    }, M);
                }),
                (e.defer = function (A) {
                    return e.delay.apply(
                        e,
                        [A, 1].concat(a.call(arguments, 1))
                    );
                }),
                (e.throttle = function (A) {
                    var M, H, B;
                    return function () {
                        M ||
                            ((M = !0),
                            (H = arguments),
                            (B = this),
                            eb.frame(function () {
                                (M = !1), A.apply(B, H);
                            }));
                    };
                }),
                (e.debounce = function (A, M, H) {
                    var B,
                        Z,
                        J,
                        k,
                        j,
                        p = function () {
                            var E = e.now() - k;
                            E < M
                                ? (B = setTimeout(p, M - E))
                                : ((B = null),
                                  H || ((j = A.apply(J, Z)), (J = Z = null)));
                        };
                    return function () {
                        (J = this), (Z = arguments), (k = e.now());
                        var E = H && !B;
                        return (
                            B || (B = setTimeout(p, M)),
                            E && ((j = A.apply(J, Z)), (J = Z = null)),
                            j
                        );
                    };
                }),
                (e.defaults = function (A) {
                    if (!e.isObject(A)) return A;
                    for (var M = 1, H = arguments.length; M < H; M++) {
                        var B = arguments[M];
                        for (var Z in B) A[Z] === void 0 && (A[Z] = B[Z]);
                    }
                    return A;
                }),
                (e.keys = function (A) {
                    if (!e.isObject(A)) return [];
                    if (q) return q(A);
                    var M = [];
                    for (var H in A) e.has(A, H) && M.push(H);
                    return M;
                }),
                (e.has = function (A, M) {
                    return d.call(A, M);
                }),
                (e.isObject = function (A) {
                    return A === Object(A);
                }),
                (e.now =
                    Date.now ||
                    function () {
                        return new Date().getTime();
                    }),
                (e.templateSettings = {
                    evaluate: /<%([\s\S]+?)%>/g,
                    interpolate: /<%=([\s\S]+?)%>/g,
                    escape: /<%-([\s\S]+?)%>/g,
                });
            var X = /(.)^/,
                z = {
                    "'": "'",
                    "\\": "\\",
                    "\r": "r",
                    "\n": "n",
                    "\u2028": "u2028",
                    "\u2029": "u2029",
                },
                Y = /\\|'|\r|\n|\u2028|\u2029/g,
                $ = function (A) {
                    return "\\" + z[A];
                },
                G = /^\s*(\w|\$)+\s*$/;
            return (
                (e.template = function (A, M, H) {
                    !M && H && (M = H),
                        (M = e.defaults({}, M, e.templateSettings));
                    var B = RegExp(
                            [
                                (M.escape || X).source,
                                (M.interpolate || X).source,
                                (M.evaluate || X).source,
                            ].join("|") + "|$",
                            "g"
                        ),
                        Z = 0,
                        J = "__p+='";
                    A.replace(B, function (E, y, l, D, U) {
                        return (
                            (J += A.slice(Z, U).replace(Y, $)),
                            (Z = U + E.length),
                            y
                                ? (J +=
                                      `'+
    ((__t=(` +
                                      y +
                                      `))==null?'':_.escape(__t))+
    '`)
                                : l
                                ? (J +=
                                      `'+
    ((__t=(` +
                                      l +
                                      `))==null?'':__t)+
    '`)
                                : D &&
                                  (J +=
                                      `';
    ` +
                                      D +
                                      `
    __p+='`),
                            E
                        );
                    }),
                        (J += `';
    `);
                    var k = M.variable;
                    if (k) {
                        if (!G.test(k))
                            throw new Error(
                                "variable is not a bare identifier: " + k
                            );
                    } else
                        (J =
                            `with(obj||{}){
    ` +
                            J +
                            `}
    `),
                            (k = "obj");
                    J =
                        `var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};
    ` +
                        J +
                        `return __p;
    `;
                    var j;
                    try {
                        j = new Function(M.variable || "obj", "_", J);
                    } catch (E) {
                        throw ((E.source = J), E);
                    }
                    var p = function (E) {
                        return j.call(this, E, e);
                    };
                    return (
                        (p.source =
                            "function(" +
                            k +
                            `){
    ` +
                            J +
                            "}"),
                        p
                    );
                }),
                e
            );
        })();
    });
    var ke = c((VV, Vs) => {
        "use strict";
        var ce = {},
            Ut = {},
            Vt = [],
            Pi = window.Webflow || [],
            yt = window.jQuery,
            He = yt(window),
            tb = yt(document),
            tt = yt.isFunction,
            We = (ce._ = Ps()),
            Fs = (ce.tram = Li() && yt.tram),
            an = !1,
            qi = !1;
        Fs.config.hideBackface = !1;
        Fs.config.keepInherited = !0;
        ce.define = function (e, t, r) {
            Ut[e] && Ds(Ut[e]);
            var n = (Ut[e] = t(yt, We, r) || {});
            return Ms(n), n;
        };
        ce.require = function (e) {
            return Ut[e];
        };
        function Ms(e) {
            ce.env() &&
                (tt(e.design) && He.on("__wf_design", e.design),
                tt(e.preview) && He.on("__wf_preview", e.preview)),
                tt(e.destroy) && He.on("__wf_destroy", e.destroy),
                e.ready && tt(e.ready) && rb(e);
        }
        function rb(e) {
            if (an) {
                e.ready();
                return;
            }
            We.contains(Vt, e.ready) || Vt.push(e.ready);
        }
        function Ds(e) {
            tt(e.design) && He.off("__wf_design", e.design),
                tt(e.preview) && He.off("__wf_preview", e.preview),
                tt(e.destroy) && He.off("__wf_destroy", e.destroy),
                e.ready && tt(e.ready) && nb(e);
        }
        function nb(e) {
            Vt = We.filter(Vt, function (t) {
                return t !== e.ready;
            });
        }
        ce.push = function (e) {
            if (an) {
                tt(e) && e();
                return;
            }
            Pi.push(e);
        };
        ce.env = function (e) {
            var t = window.__wf_design,
                r = typeof t < "u";
            if (!e) return r;
            if (e === "design") return r && t;
            if (e === "preview") return r && !t;
            if (e === "slug") return r && window.__wf_slug;
            if (e === "editor") return window.WebflowEditor;
            if (e === "test") return window.__wf_test;
            if (e === "frame") return window !== window.top;
        };
        var on = navigator.userAgent.toLowerCase(),
            Gs = (ce.env.touch =
                "ontouchstart" in window ||
                (window.DocumentTouch &&
                    document instanceof window.DocumentTouch)),
            ib = (ce.env.chrome =
                /chrome/.test(on) &&
                /Google/.test(navigator.vendor) &&
                parseInt(on.match(/chrome\/(\d+)\./)[1], 10)),
            ob = (ce.env.ios = /(ipod|iphone|ipad)/.test(on));
        ce.env.safari = /safari/.test(on) && !ib && !ob;
        var Ni;
        Gs &&
            tb.on("touchstart mousedown", function (e) {
                Ni = e.target;
            });
        ce.validClick = Gs
            ? function (e) {
                  return e === Ni || yt.contains(e, Ni);
              }
            : function () {
                  return !0;
              };
        var ks = "resize.webflow orientationchange.webflow load.webflow",
            ab = "scroll.webflow " + ks;
        ce.resize = Fi(He, ks);
        ce.scroll = Fi(He, ab);
        ce.redraw = Fi();
        function Fi(e, t) {
            var r = [],
                n = {};
            return (
                (n.up = We.throttle(function (i) {
                    We.each(r, function (o) {
                        o(i);
                    });
                })),
                e && t && e.on(t, n.up),
                (n.on = function (i) {
                    typeof i == "function" && (We.contains(r, i) || r.push(i));
                }),
                (n.off = function (i) {
                    if (!arguments.length) {
                        r = [];
                        return;
                    }
                    r = We.filter(r, function (o) {
                        return o !== i;
                    });
                }),
                n
            );
        }
        ce.location = function (e) {
            window.location = e;
        };
        ce.env() && (ce.location = function () {});
        ce.ready = function () {
            (an = !0),
                qi ? sb() : We.each(Vt, qs),
                We.each(Pi, qs),
                ce.resize.up();
        };
        function qs(e) {
            tt(e) && e();
        }
        function sb() {
            (qi = !1), We.each(Ut, Ms);
        }
        var xt;
        ce.load = function (e) {
            xt.then(e);
        };
        function Us() {
            xt && (xt.reject(), He.off("load", xt.resolve)),
                (xt = new yt.Deferred()),
                He.on("load", xt.resolve);
        }
        ce.destroy = function (e) {
            (e = e || {}),
                (qi = !0),
                He.triggerHandler("__wf_destroy"),
                e.domready != null && (an = e.domready),
                We.each(Ut, Ds),
                ce.resize.off(),
                ce.scroll.off(),
                ce.redraw.off(),
                (Vt = []),
                (Pi = []),
                xt.state() === "pending" && Us();
        };
        yt(ce.ready);
        Us();
        Vs.exports = window.Webflow = ce;
    });
    var Hs = c((BV, Ws) => {
        "use strict";
        var Bs = ke();
        Bs.define(
            "brand",
            (Ws.exports = function (e) {
                var t = {},
                    r = document,
                    n = e("html"),
                    i = e("body"),
                    o = ".w-webflow-badge",
                    a = window.location,
                    s = /PhantomJS/i.test(navigator.userAgent),
                    u =
                        "fullscreenchange webkitfullscreenchange mozfullscreenchange msfullscreenchange",
                    d;
                t.ready = function () {
                    var b = n.attr("data-wf-status"),
                        O = n.attr("data-wf-domain") || "";
                    /\.webflow\.io$/i.test(O) && a.hostname !== O && (b = !0),
                        b &&
                            !s &&
                            ((d = d || v()),
                            g(),
                            setTimeout(g, 500),
                            e(r).off(u, h).on(u, h));
                };
                function h() {
                    var b =
                        r.fullScreen ||
                        r.mozFullScreen ||
                        r.webkitIsFullScreen ||
                        r.msFullscreenElement ||
                        !!r.webkitFullscreenElement;
                    e(d).attr("style", b ? "display: none !important;" : "");
                }
                function v() {
                    var b = e('<a class="w-webflow-badge"></a>').attr(
                            "href",
                            "https://webflow.com?utm_campaign=brandjs"
                        ),
                        O = e("<img>")
                            .attr(
                                "src",
                                "https://d3e54v103j8qbb.cloudfront.net/img/webflow-badge-icon-d2.89e12c322e.svg"
                            )
                            .attr("alt", "")
                            .css({ marginRight: "4px", width: "26px" }),
                        T = e("<img>")
                            .attr(
                                "src",
                                "https://d3e54v103j8qbb.cloudfront.net/img/webflow-badge-text-d2.c82cec3b78.svg"
                            )
                            .attr("alt", "Made in Webflow");
                    return b.append(O, T), b[0];
                }
                function g() {
                    var b = i.children(o),
                        O = b.length && b.get(0) === d,
                        T = Bs.env("editor");
                    if (O) {
                        T && b.remove();
                        return;
                    }
                    b.length && b.remove(), T || i.append(d);
                }
                return t;
            })
        );
    });
    var js = c((WV, Xs) => {
        "use strict";
        var Mi = ke();
        Mi.define(
            "edit",
            (Xs.exports = function (e, t, r) {
                if (
                    ((r = r || {}),
                    (Mi.env("test") || Mi.env("frame")) && !r.fixture && !ub())
                )
                    return { exit: 1 };
                var n = {},
                    i = e(window),
                    o = e(document.documentElement),
                    a = document.location,
                    s = "hashchange",
                    u,
                    d = r.load || g,
                    h = !1;
                try {
                    h =
                        localStorage &&
                        localStorage.getItem &&
                        localStorage.getItem("WebflowEditor");
                } catch {}
                h
                    ? d()
                    : a.search
                    ? (/[?&](edit)(?:[=&?]|$)/.test(a.search) ||
                          /\?edit$/.test(a.href)) &&
                      d()
                    : i.on(s, v).triggerHandler(s);
                function v() {
                    u || (/\?edit/.test(a.hash) && d());
                }
                function g() {
                    (u = !0),
                        (window.WebflowEditor = !0),
                        i.off(s, v),
                        N(function (q) {
                            e.ajax({
                                url: _(
                                    "https://editor-api.webflow.com/api/editor/view"
                                ),
                                data: { siteId: o.attr("data-wf-site") },
                                xhrFields: { withCredentials: !0 },
                                dataType: "json",
                                crossDomain: !0,
                                success: b(q),
                            });
                        });
                }
                function b(q) {
                    return function (F) {
                        if (!F) {
                            console.error("Could not load editor data");
                            return;
                        }
                        (F.thirdPartyCookiesSupported = q),
                            O(S(F.scriptPath), function () {
                                window.WebflowEditor(F);
                            });
                    };
                }
                function O(q, F) {
                    e.ajax({
                        type: "GET",
                        url: q,
                        dataType: "script",
                        cache: !0,
                    }).then(F, T);
                }
                function T(q, F, P) {
                    throw (
                        (console.error("Could not load editor script: " + F), P)
                    );
                }
                function S(q) {
                    return q.indexOf("//") >= 0
                        ? q
                        : _("https://editor-api.webflow.com" + q);
                }
                function _(q) {
                    return q.replace(/([^:])\/\//g, "$1/");
                }
                function N(q) {
                    var F = window.document.createElement("iframe");
                    (F.src =
                        "https://webflow.com/site/third-party-cookie-check.html"),
                        (F.style.display = "none"),
                        (F.sandbox = "allow-scripts allow-same-origin");
                    var P = function (W) {
                        W.data === "WF_third_party_cookies_unsupported"
                            ? (R(F, P), q(!1))
                            : W.data === "WF_third_party_cookies_supported" &&
                              (R(F, P), q(!0));
                    };
                    (F.onerror = function () {
                        R(F, P), q(!1);
                    }),
                        window.addEventListener("message", P, !1),
                        window.document.body.appendChild(F);
                }
                function R(q, F) {
                    window.removeEventListener("message", F, !1), q.remove();
                }
                return n;
            })
        );
        function ub() {
            try {
                return window.top.__Cypress__;
            } catch {
                return !1;
            }
        }
    });
    var Ks = c((HV, zs) => {
        "use strict";
        var cb = ke();
        cb.define(
            "focus-visible",
            (zs.exports = function () {
                function e(r) {
                    var n = !0,
                        i = !1,
                        o = null,
                        a = {
                            text: !0,
                            search: !0,
                            url: !0,
                            tel: !0,
                            email: !0,
                            password: !0,
                            number: !0,
                            date: !0,
                            month: !0,
                            week: !0,
                            time: !0,
                            datetime: !0,
                            "datetime-local": !0,
                        };
                    function s(R) {
                        return !!(
                            R &&
                            R !== document &&
                            R.nodeName !== "HTML" &&
                            R.nodeName !== "BODY" &&
                            "classList" in R &&
                            "contains" in R.classList
                        );
                    }
                    function u(R) {
                        var q = R.type,
                            F = R.tagName;
                        return !!(
                            (F === "INPUT" && a[q] && !R.readOnly) ||
                            (F === "TEXTAREA" && !R.readOnly) ||
                            R.isContentEditable
                        );
                    }
                    function d(R) {
                        R.getAttribute("data-wf-focus-visible") ||
                            R.setAttribute("data-wf-focus-visible", "true");
                    }
                    function h(R) {
                        R.getAttribute("data-wf-focus-visible") &&
                            R.removeAttribute("data-wf-focus-visible");
                    }
                    function v(R) {
                        R.metaKey ||
                            R.altKey ||
                            R.ctrlKey ||
                            (s(r.activeElement) && d(r.activeElement),
                            (n = !0));
                    }
                    function g() {
                        n = !1;
                    }
                    function b(R) {
                        s(R.target) && (n || u(R.target)) && d(R.target);
                    }
                    function O(R) {
                        s(R.target) &&
                            R.target.hasAttribute("data-wf-focus-visible") &&
                            ((i = !0),
                            window.clearTimeout(o),
                            (o = window.setTimeout(function () {
                                i = !1;
                            }, 100)),
                            h(R.target));
                    }
                    function T() {
                        document.visibilityState === "hidden" &&
                            (i && (n = !0), S());
                    }
                    function S() {
                        document.addEventListener("mousemove", N),
                            document.addEventListener("mousedown", N),
                            document.addEventListener("mouseup", N),
                            document.addEventListener("pointermove", N),
                            document.addEventListener("pointerdown", N),
                            document.addEventListener("pointerup", N),
                            document.addEventListener("touchmove", N),
                            document.addEventListener("touchstart", N),
                            document.addEventListener("touchend", N);
                    }
                    function _() {
                        document.removeEventListener("mousemove", N),
                            document.removeEventListener("mousedown", N),
                            document.removeEventListener("mouseup", N),
                            document.removeEventListener("pointermove", N),
                            document.removeEventListener("pointerdown", N),
                            document.removeEventListener("pointerup", N),
                            document.removeEventListener("touchmove", N),
                            document.removeEventListener("touchstart", N),
                            document.removeEventListener("touchend", N);
                    }
                    function N(R) {
                        (R.target.nodeName &&
                            R.target.nodeName.toLowerCase() === "html") ||
                            ((n = !1), _());
                    }
                    document.addEventListener("keydown", v, !0),
                        document.addEventListener("mousedown", g, !0),
                        document.addEventListener("pointerdown", g, !0),
                        document.addEventListener("touchstart", g, !0),
                        document.addEventListener("visibilitychange", T, !0),
                        S(),
                        r.addEventListener("focus", b, !0),
                        r.addEventListener("blur", O, !0);
                }
                function t() {
                    if (typeof document < "u")
                        try {
                            document.querySelector(":focus-visible");
                        } catch {
                            e(document);
                        }
                }
                return { ready: t };
            })
        );
    });
    var Qs = c((XV, $s) => {
        "use strict";
        var Ys = ke();
        Ys.define(
            "focus",
            ($s.exports = function () {
                var e = [],
                    t = !1;
                function r(a) {
                    t &&
                        (a.preventDefault(),
                        a.stopPropagation(),
                        a.stopImmediatePropagation(),
                        e.unshift(a));
                }
                function n(a) {
                    var s = a.target,
                        u = s.tagName;
                    return (
                        (/^a$/i.test(u) && s.href != null) ||
                        (/^(button|textarea)$/i.test(u) && s.disabled !== !0) ||
                        (/^input$/i.test(u) &&
                            /^(button|reset|submit|radio|checkbox)$/i.test(
                                s.type
                            ) &&
                            !s.disabled) ||
                        (!/^(button|input|textarea|select|a)$/i.test(u) &&
                            !Number.isNaN(Number.parseFloat(s.tabIndex))) ||
                        /^audio$/i.test(u) ||
                        (/^video$/i.test(u) && s.controls === !0)
                    );
                }
                function i(a) {
                    n(a) &&
                        ((t = !0),
                        setTimeout(() => {
                            for (t = !1, a.target.focus(); e.length > 0; ) {
                                var s = e.pop();
                                s.target.dispatchEvent(
                                    new MouseEvent(s.type, s)
                                );
                            }
                        }, 0));
                }
                function o() {
                    typeof document < "u" &&
                        document.body.hasAttribute("data-wf-focus-within") &&
                        Ys.env.safari &&
                        (document.addEventListener("mousedown", i, !0),
                        document.addEventListener("mouseup", r, !0),
                        document.addEventListener("click", r, !0));
                }
                return { ready: o };
            })
        );
    });
    var eu = c((jV, Js) => {
        "use strict";
        var Di = window.jQuery,
            rt = {},
            sn = [],
            Zs = ".w-ix",
            un = {
                reset: function (e, t) {
                    t.__wf_intro = null;
                },
                intro: function (e, t) {
                    t.__wf_intro ||
                        ((t.__wf_intro = !0),
                        Di(t).triggerHandler(rt.types.INTRO));
                },
                outro: function (e, t) {
                    t.__wf_intro &&
                        ((t.__wf_intro = null),
                        Di(t).triggerHandler(rt.types.OUTRO));
                },
            };
        rt.triggers = {};
        rt.types = { INTRO: "w-ix-intro" + Zs, OUTRO: "w-ix-outro" + Zs };
        rt.init = function () {
            for (var e = sn.length, t = 0; t < e; t++) {
                var r = sn[t];
                r[0](0, r[1]);
            }
            (sn = []), Di.extend(rt.triggers, un);
        };
        rt.async = function () {
            for (var e in un) {
                var t = un[e];
                un.hasOwnProperty(e) &&
                    (rt.triggers[e] = function (r, n) {
                        sn.push([t, n]);
                    });
            }
        };
        rt.async();
        Js.exports = rt;
    });
    var ln = c((zV, nu) => {
        "use strict";
        var Gi = eu();
        function tu(e, t) {
            var r = document.createEvent("CustomEvent");
            r.initCustomEvent(t, !0, !0, null), e.dispatchEvent(r);
        }
        var lb = window.jQuery,
            cn = {},
            ru = ".w-ix",
            fb = {
                reset: function (e, t) {
                    Gi.triggers.reset(e, t);
                },
                intro: function (e, t) {
                    Gi.triggers.intro(e, t), tu(t, "COMPONENT_ACTIVE");
                },
                outro: function (e, t) {
                    Gi.triggers.outro(e, t), tu(t, "COMPONENT_INACTIVE");
                },
            };
        cn.triggers = {};
        cn.types = { INTRO: "w-ix-intro" + ru, OUTRO: "w-ix-outro" + ru };
        lb.extend(cn.triggers, fb);
        nu.exports = cn;
    });
    var iu = c((KV, ft) => {
        function ki(e) {
            return (
                (ft.exports = ki =
                    typeof Symbol == "function" &&
                    typeof Symbol.iterator == "symbol"
                        ? function (t) {
                              return typeof t;
                          }
                        : function (t) {
                              return t &&
                                  typeof Symbol == "function" &&
                                  t.constructor === Symbol &&
                                  t !== Symbol.prototype
                                  ? "symbol"
                                  : typeof t;
                          }),
                (ft.exports.__esModule = !0),
                (ft.exports.default = ft.exports),
                ki(e)
            );
        }
        (ft.exports = ki),
            (ft.exports.__esModule = !0),
            (ft.exports.default = ft.exports);
    });
    var fn = c((YV, mr) => {
        var db = iu().default;
        function ou(e) {
            if (typeof WeakMap != "function") return null;
            var t = new WeakMap(),
                r = new WeakMap();
            return (ou = function (i) {
                return i ? r : t;
            })(e);
        }
        function pb(e, t) {
            if (!t && e && e.__esModule) return e;
            if (e === null || (db(e) != "object" && typeof e != "function"))
                return { default: e };
            var r = ou(t);
            if (r && r.has(e)) return r.get(e);
            var n = { __proto__: null },
                i = Object.defineProperty && Object.getOwnPropertyDescriptor;
            for (var o in e)
                if (o !== "default" && {}.hasOwnProperty.call(e, o)) {
                    var a = i ? Object.getOwnPropertyDescriptor(e, o) : null;
                    a && (a.get || a.set)
                        ? Object.defineProperty(n, o, a)
                        : (n[o] = e[o]);
                }
            return (n.default = e), r && r.set(e, n), n;
        }
        (mr.exports = pb),
            (mr.exports.__esModule = !0),
            (mr.exports.default = mr.exports);
    });
    var au = c(($V, _r) => {
        function gb(e) {
            return e && e.__esModule ? e : { default: e };
        }
        (_r.exports = gb),
            (_r.exports.__esModule = !0),
            (_r.exports.default = _r.exports);
    });
    var ge = c((QV, su) => {
        var dn = function (e) {
            return e && e.Math == Math && e;
        };
        su.exports =
            dn(typeof globalThis == "object" && globalThis) ||
            dn(typeof window == "object" && window) ||
            dn(typeof self == "object" && self) ||
            dn(typeof global == "object" && global) ||
            (function () {
                return this;
            })() ||
            Function("return this")();
    });
    var Bt = c((ZV, uu) => {
        uu.exports = function (e) {
            try {
                return !!e();
            } catch {
                return !0;
            }
        };
    });
    var St = c((JV, cu) => {
        var vb = Bt();
        cu.exports = !vb(function () {
            return (
                Object.defineProperty({}, 1, {
                    get: function () {
                        return 7;
                    },
                })[1] != 7
            );
        });
    });
    var pn = c((eB, lu) => {
        var br = Function.prototype.call;
        lu.exports = br.bind
            ? br.bind(br)
            : function () {
                  return br.apply(br, arguments);
              };
    });
    var gu = c((pu) => {
        "use strict";
        var fu = {}.propertyIsEnumerable,
            du = Object.getOwnPropertyDescriptor,
            hb = du && !fu.call({ 1: 2 }, 1);
        pu.f = hb
            ? function (t) {
                  var r = du(this, t);
                  return !!r && r.enumerable;
              }
            : fu;
    });
    var Ui = c((rB, vu) => {
        vu.exports = function (e, t) {
            return {
                enumerable: !(e & 1),
                configurable: !(e & 2),
                writable: !(e & 4),
                value: t,
            };
        };
    });
    var Xe = c((nB, Eu) => {
        var hu = Function.prototype,
            Vi = hu.bind,
            Bi = hu.call,
            Eb = Vi && Vi.bind(Bi);
        Eu.exports = Vi
            ? function (e) {
                  return e && Eb(Bi, e);
              }
            : function (e) {
                  return (
                      e &&
                      function () {
                          return Bi.apply(e, arguments);
                      }
                  );
              };
    });
    var _u = c((iB, mu) => {
        var yu = Xe(),
            yb = yu({}.toString),
            mb = yu("".slice);
        mu.exports = function (e) {
            return mb(yb(e), 8, -1);
        };
    });
    var Tu = c((oB, bu) => {
        var _b = ge(),
            bb = Xe(),
            Tb = Bt(),
            Ib = _u(),
            Wi = _b.Object,
            Ob = bb("".split);
        bu.exports = Tb(function () {
            return !Wi("z").propertyIsEnumerable(0);
        })
            ? function (e) {
                  return Ib(e) == "String" ? Ob(e, "") : Wi(e);
              }
            : Wi;
    });
    var Hi = c((aB, Iu) => {
        var wb = ge(),
            Ab = wb.TypeError;
        Iu.exports = function (e) {
            if (e == null) throw Ab("Can't call method on " + e);
            return e;
        };
    });
    var Tr = c((sB, Ou) => {
        var xb = Tu(),
            Sb = Hi();
        Ou.exports = function (e) {
            return xb(Sb(e));
        };
    });
    var nt = c((uB, wu) => {
        wu.exports = function (e) {
            return typeof e == "function";
        };
    });
    var Wt = c((cB, Au) => {
        var Cb = nt();
        Au.exports = function (e) {
            return typeof e == "object" ? e !== null : Cb(e);
        };
    });
    var Ir = c((lB, xu) => {
        var Xi = ge(),
            Rb = nt(),
            Lb = function (e) {
                return Rb(e) ? e : void 0;
            };
        xu.exports = function (e, t) {
            return arguments.length < 2 ? Lb(Xi[e]) : Xi[e] && Xi[e][t];
        };
    });
    var Cu = c((fB, Su) => {
        var Nb = Xe();
        Su.exports = Nb({}.isPrototypeOf);
    });
    var Lu = c((dB, Ru) => {
        var Pb = Ir();
        Ru.exports = Pb("navigator", "userAgent") || "";
    });
    var Gu = c((pB, Du) => {
        var Mu = ge(),
            ji = Lu(),
            Nu = Mu.process,
            Pu = Mu.Deno,
            qu = (Nu && Nu.versions) || (Pu && Pu.version),
            Fu = qu && qu.v8,
            je,
            gn;
        Fu &&
            ((je = Fu.split(".")),
            (gn = je[0] > 0 && je[0] < 4 ? 1 : +(je[0] + je[1])));
        !gn &&
            ji &&
            ((je = ji.match(/Edge\/(\d+)/)),
            (!je || je[1] >= 74) &&
                ((je = ji.match(/Chrome\/(\d+)/)), je && (gn = +je[1])));
        Du.exports = gn;
    });
    var zi = c((gB, Uu) => {
        var ku = Gu(),
            qb = Bt();
        Uu.exports =
            !!Object.getOwnPropertySymbols &&
            !qb(function () {
                var e = Symbol();
                return (
                    !String(e) ||
                    !(Object(e) instanceof Symbol) ||
                    (!Symbol.sham && ku && ku < 41)
                );
            });
    });
    var Ki = c((vB, Vu) => {
        var Fb = zi();
        Vu.exports = Fb && !Symbol.sham && typeof Symbol.iterator == "symbol";
    });
    var Yi = c((hB, Bu) => {
        var Mb = ge(),
            Db = Ir(),
            Gb = nt(),
            kb = Cu(),
            Ub = Ki(),
            Vb = Mb.Object;
        Bu.exports = Ub
            ? function (e) {
                  return typeof e == "symbol";
              }
            : function (e) {
                  var t = Db("Symbol");
                  return Gb(t) && kb(t.prototype, Vb(e));
              };
    });
    var Hu = c((EB, Wu) => {
        var Bb = ge(),
            Wb = Bb.String;
        Wu.exports = function (e) {
            try {
                return Wb(e);
            } catch {
                return "Object";
            }
        };
    });
    var ju = c((yB, Xu) => {
        var Hb = ge(),
            Xb = nt(),
            jb = Hu(),
            zb = Hb.TypeError;
        Xu.exports = function (e) {
            if (Xb(e)) return e;
            throw zb(jb(e) + " is not a function");
        };
    });
    var Ku = c((mB, zu) => {
        var Kb = ju();
        zu.exports = function (e, t) {
            var r = e[t];
            return r == null ? void 0 : Kb(r);
        };
    });
    var $u = c((_B, Yu) => {
        var Yb = ge(),
            $i = pn(),
            Qi = nt(),
            Zi = Wt(),
            $b = Yb.TypeError;
        Yu.exports = function (e, t) {
            var r, n;
            if (
                (t === "string" &&
                    Qi((r = e.toString)) &&
                    !Zi((n = $i(r, e)))) ||
                (Qi((r = e.valueOf)) && !Zi((n = $i(r, e)))) ||
                (t !== "string" && Qi((r = e.toString)) && !Zi((n = $i(r, e))))
            )
                return n;
            throw $b("Can't convert object to primitive value");
        };
    });
    var Zu = c((bB, Qu) => {
        Qu.exports = !1;
    });
    var vn = c((TB, ec) => {
        var Ju = ge(),
            Qb = Object.defineProperty;
        ec.exports = function (e, t) {
            try {
                Qb(Ju, e, { value: t, configurable: !0, writable: !0 });
            } catch {
                Ju[e] = t;
            }
            return t;
        };
    });
    var hn = c((IB, rc) => {
        var Zb = ge(),
            Jb = vn(),
            tc = "__core-js_shared__",
            eT = Zb[tc] || Jb(tc, {});
        rc.exports = eT;
    });
    var Ji = c((OB, ic) => {
        var tT = Zu(),
            nc = hn();
        (ic.exports = function (e, t) {
            return nc[e] || (nc[e] = t !== void 0 ? t : {});
        })("versions", []).push({
            version: "3.19.0",
            mode: tT ? "pure" : "global",
            copyright: "\xA9 2021 Denis Pushkarev (zloirock.ru)",
        });
    });
    var ac = c((wB, oc) => {
        var rT = ge(),
            nT = Hi(),
            iT = rT.Object;
        oc.exports = function (e) {
            return iT(nT(e));
        };
    });
    var mt = c((AB, sc) => {
        var oT = Xe(),
            aT = ac(),
            sT = oT({}.hasOwnProperty);
        sc.exports =
            Object.hasOwn ||
            function (t, r) {
                return sT(aT(t), r);
            };
    });
    var eo = c((xB, uc) => {
        var uT = Xe(),
            cT = 0,
            lT = Math.random(),
            fT = uT((1).toString);
        uc.exports = function (e) {
            return (
                "Symbol(" + (e === void 0 ? "" : e) + ")_" + fT(++cT + lT, 36)
            );
        };
    });
    var to = c((SB, pc) => {
        var dT = ge(),
            pT = Ji(),
            cc = mt(),
            gT = eo(),
            lc = zi(),
            dc = Ki(),
            Ht = pT("wks"),
            Ct = dT.Symbol,
            fc = Ct && Ct.for,
            vT = dc ? Ct : (Ct && Ct.withoutSetter) || gT;
        pc.exports = function (e) {
            if (!cc(Ht, e) || !(lc || typeof Ht[e] == "string")) {
                var t = "Symbol." + e;
                lc && cc(Ct, e)
                    ? (Ht[e] = Ct[e])
                    : dc && fc
                    ? (Ht[e] = fc(t))
                    : (Ht[e] = vT(t));
            }
            return Ht[e];
        };
    });
    var Ec = c((CB, hc) => {
        var hT = ge(),
            ET = pn(),
            gc = Wt(),
            vc = Yi(),
            yT = Ku(),
            mT = $u(),
            _T = to(),
            bT = hT.TypeError,
            TT = _T("toPrimitive");
        hc.exports = function (e, t) {
            if (!gc(e) || vc(e)) return e;
            var r = yT(e, TT),
                n;
            if (r) {
                if (
                    (t === void 0 && (t = "default"),
                    (n = ET(r, e, t)),
                    !gc(n) || vc(n))
                )
                    return n;
                throw bT("Can't convert object to primitive value");
            }
            return t === void 0 && (t = "number"), mT(e, t);
        };
    });
    var ro = c((RB, yc) => {
        var IT = Ec(),
            OT = Yi();
        yc.exports = function (e) {
            var t = IT(e, "string");
            return OT(t) ? t : t + "";
        };
    });
    var io = c((LB, _c) => {
        var wT = ge(),
            mc = Wt(),
            no = wT.document,
            AT = mc(no) && mc(no.createElement);
        _c.exports = function (e) {
            return AT ? no.createElement(e) : {};
        };
    });
    var oo = c((NB, bc) => {
        var xT = St(),
            ST = Bt(),
            CT = io();
        bc.exports =
            !xT &&
            !ST(function () {
                return (
                    Object.defineProperty(CT("div"), "a", {
                        get: function () {
                            return 7;
                        },
                    }).a != 7
                );
            });
    });
    var ao = c((Ic) => {
        var RT = St(),
            LT = pn(),
            NT = gu(),
            PT = Ui(),
            qT = Tr(),
            FT = ro(),
            MT = mt(),
            DT = oo(),
            Tc = Object.getOwnPropertyDescriptor;
        Ic.f = RT
            ? Tc
            : function (t, r) {
                  if (((t = qT(t)), (r = FT(r)), DT))
                      try {
                          return Tc(t, r);
                      } catch {}
                  if (MT(t, r)) return PT(!LT(NT.f, t, r), t[r]);
              };
    });
    var Or = c((qB, wc) => {
        var Oc = ge(),
            GT = Wt(),
            kT = Oc.String,
            UT = Oc.TypeError;
        wc.exports = function (e) {
            if (GT(e)) return e;
            throw UT(kT(e) + " is not an object");
        };
    });
    var wr = c((Sc) => {
        var VT = ge(),
            BT = St(),
            WT = oo(),
            Ac = Or(),
            HT = ro(),
            XT = VT.TypeError,
            xc = Object.defineProperty;
        Sc.f = BT
            ? xc
            : function (t, r, n) {
                  if ((Ac(t), (r = HT(r)), Ac(n), WT))
                      try {
                          return xc(t, r, n);
                      } catch {}
                  if ("get" in n || "set" in n)
                      throw XT("Accessors not supported");
                  return "value" in n && (t[r] = n.value), t;
              };
    });
    var En = c((MB, Cc) => {
        var jT = St(),
            zT = wr(),
            KT = Ui();
        Cc.exports = jT
            ? function (e, t, r) {
                  return zT.f(e, t, KT(1, r));
              }
            : function (e, t, r) {
                  return (e[t] = r), e;
              };
    });
    var uo = c((DB, Rc) => {
        var YT = Xe(),
            $T = nt(),
            so = hn(),
            QT = YT(Function.toString);
        $T(so.inspectSource) ||
            (so.inspectSource = function (e) {
                return QT(e);
            });
        Rc.exports = so.inspectSource;
    });
    var Pc = c((GB, Nc) => {
        var ZT = ge(),
            JT = nt(),
            eI = uo(),
            Lc = ZT.WeakMap;
        Nc.exports = JT(Lc) && /native code/.test(eI(Lc));
    });
    var co = c((kB, Fc) => {
        var tI = Ji(),
            rI = eo(),
            qc = tI("keys");
        Fc.exports = function (e) {
            return qc[e] || (qc[e] = rI(e));
        };
    });
    var yn = c((UB, Mc) => {
        Mc.exports = {};
    });
    var Bc = c((VB, Vc) => {
        var nI = Pc(),
            Uc = ge(),
            lo = Xe(),
            iI = Wt(),
            oI = En(),
            fo = mt(),
            po = hn(),
            aI = co(),
            sI = yn(),
            Dc = "Object already initialized",
            vo = Uc.TypeError,
            uI = Uc.WeakMap,
            mn,
            Ar,
            _n,
            cI = function (e) {
                return _n(e) ? Ar(e) : mn(e, {});
            },
            lI = function (e) {
                return function (t) {
                    var r;
                    if (!iI(t) || (r = Ar(t)).type !== e)
                        throw vo("Incompatible receiver, " + e + " required");
                    return r;
                };
            };
        nI || po.state
            ? ((_t = po.state || (po.state = new uI())),
              (Gc = lo(_t.get)),
              (go = lo(_t.has)),
              (kc = lo(_t.set)),
              (mn = function (e, t) {
                  if (go(_t, e)) throw new vo(Dc);
                  return (t.facade = e), kc(_t, e, t), t;
              }),
              (Ar = function (e) {
                  return Gc(_t, e) || {};
              }),
              (_n = function (e) {
                  return go(_t, e);
              }))
            : ((Rt = aI("state")),
              (sI[Rt] = !0),
              (mn = function (e, t) {
                  if (fo(e, Rt)) throw new vo(Dc);
                  return (t.facade = e), oI(e, Rt, t), t;
              }),
              (Ar = function (e) {
                  return fo(e, Rt) ? e[Rt] : {};
              }),
              (_n = function (e) {
                  return fo(e, Rt);
              }));
        var _t, Gc, go, kc, Rt;
        Vc.exports = { set: mn, get: Ar, has: _n, enforce: cI, getterFor: lI };
    });
    var Xc = c((BB, Hc) => {
        var ho = St(),
            fI = mt(),
            Wc = Function.prototype,
            dI = ho && Object.getOwnPropertyDescriptor,
            Eo = fI(Wc, "name"),
            pI = Eo && function () {}.name === "something",
            gI = Eo && (!ho || (ho && dI(Wc, "name").configurable));
        Hc.exports = { EXISTS: Eo, PROPER: pI, CONFIGURABLE: gI };
    });
    var $c = c((WB, Yc) => {
        var vI = ge(),
            jc = nt(),
            hI = mt(),
            zc = En(),
            EI = vn(),
            yI = uo(),
            Kc = Bc(),
            mI = Xc().CONFIGURABLE,
            _I = Kc.get,
            bI = Kc.enforce,
            TI = String(String).split("String");
        (Yc.exports = function (e, t, r, n) {
            var i = n ? !!n.unsafe : !1,
                o = n ? !!n.enumerable : !1,
                a = n ? !!n.noTargetGet : !1,
                s = n && n.name !== void 0 ? n.name : t,
                u;
            if (
                (jc(r) &&
                    (String(s).slice(0, 7) === "Symbol(" &&
                        (s =
                            "[" +
                            String(s).replace(/^Symbol\(([^)]*)\)/, "$1") +
                            "]"),
                    (!hI(r, "name") || (mI && r.name !== s)) &&
                        zc(r, "name", s),
                    (u = bI(r)),
                    u.source ||
                        (u.source = TI.join(typeof s == "string" ? s : ""))),
                e === vI)
            ) {
                o ? (e[t] = r) : EI(t, r);
                return;
            } else i ? !a && e[t] && (o = !0) : delete e[t];
            o ? (e[t] = r) : zc(e, t, r);
        })(Function.prototype, "toString", function () {
            return (jc(this) && _I(this).source) || yI(this);
        });
    });
    var yo = c((HB, Qc) => {
        var II = Math.ceil,
            OI = Math.floor;
        Qc.exports = function (e) {
            var t = +e;
            return t !== t || t === 0 ? 0 : (t > 0 ? OI : II)(t);
        };
    });
    var Jc = c((XB, Zc) => {
        var wI = yo(),
            AI = Math.max,
            xI = Math.min;
        Zc.exports = function (e, t) {
            var r = wI(e);
            return r < 0 ? AI(r + t, 0) : xI(r, t);
        };
    });
    var tl = c((jB, el) => {
        var SI = yo(),
            CI = Math.min;
        el.exports = function (e) {
            return e > 0 ? CI(SI(e), 9007199254740991) : 0;
        };
    });
    var nl = c((zB, rl) => {
        var RI = tl();
        rl.exports = function (e) {
            return RI(e.length);
        };
    });
    var mo = c((KB, ol) => {
        var LI = Tr(),
            NI = Jc(),
            PI = nl(),
            il = function (e) {
                return function (t, r, n) {
                    var i = LI(t),
                        o = PI(i),
                        a = NI(n, o),
                        s;
                    if (e && r != r) {
                        for (; o > a; ) if (((s = i[a++]), s != s)) return !0;
                    } else
                        for (; o > a; a++)
                            if ((e || a in i) && i[a] === r) return e || a || 0;
                    return !e && -1;
                };
            };
        ol.exports = { includes: il(!0), indexOf: il(!1) };
    });
    var bo = c((YB, sl) => {
        var qI = Xe(),
            _o = mt(),
            FI = Tr(),
            MI = mo().indexOf,
            DI = yn(),
            al = qI([].push);
        sl.exports = function (e, t) {
            var r = FI(e),
                n = 0,
                i = [],
                o;
            for (o in r) !_o(DI, o) && _o(r, o) && al(i, o);
            for (; t.length > n; )
                _o(r, (o = t[n++])) && (~MI(i, o) || al(i, o));
            return i;
        };
    });
    var bn = c(($B, ul) => {
        ul.exports = [
            "constructor",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "toLocaleString",
            "toString",
            "valueOf",
        ];
    });
    var ll = c((cl) => {
        var GI = bo(),
            kI = bn(),
            UI = kI.concat("length", "prototype");
        cl.f =
            Object.getOwnPropertyNames ||
            function (t) {
                return GI(t, UI);
            };
    });
    var dl = c((fl) => {
        fl.f = Object.getOwnPropertySymbols;
    });
    var gl = c((JB, pl) => {
        var VI = Ir(),
            BI = Xe(),
            WI = ll(),
            HI = dl(),
            XI = Or(),
            jI = BI([].concat);
        pl.exports =
            VI("Reflect", "ownKeys") ||
            function (t) {
                var r = WI.f(XI(t)),
                    n = HI.f;
                return n ? jI(r, n(t)) : r;
            };
    });
    var hl = c((e5, vl) => {
        var zI = mt(),
            KI = gl(),
            YI = ao(),
            $I = wr();
        vl.exports = function (e, t) {
            for (var r = KI(t), n = $I.f, i = YI.f, o = 0; o < r.length; o++) {
                var a = r[o];
                zI(e, a) || n(e, a, i(t, a));
            }
        };
    });
    var yl = c((t5, El) => {
        var QI = Bt(),
            ZI = nt(),
            JI = /#|\.prototype\./,
            xr = function (e, t) {
                var r = t0[e0(e)];
                return r == n0 ? !0 : r == r0 ? !1 : ZI(t) ? QI(t) : !!t;
            },
            e0 = (xr.normalize = function (e) {
                return String(e).replace(JI, ".").toLowerCase();
            }),
            t0 = (xr.data = {}),
            r0 = (xr.NATIVE = "N"),
            n0 = (xr.POLYFILL = "P");
        El.exports = xr;
    });
    var _l = c((r5, ml) => {
        var To = ge(),
            i0 = ao().f,
            o0 = En(),
            a0 = $c(),
            s0 = vn(),
            u0 = hl(),
            c0 = yl();
        ml.exports = function (e, t) {
            var r = e.target,
                n = e.global,
                i = e.stat,
                o,
                a,
                s,
                u,
                d,
                h;
            if (
                (n
                    ? (a = To)
                    : i
                    ? (a = To[r] || s0(r, {}))
                    : (a = (To[r] || {}).prototype),
                a)
            )
                for (s in t) {
                    if (
                        ((d = t[s]),
                        e.noTargetGet
                            ? ((h = i0(a, s)), (u = h && h.value))
                            : (u = a[s]),
                        (o = c0(n ? s : r + (i ? "." : "#") + s, e.forced)),
                        !o && u !== void 0)
                    ) {
                        if (typeof d == typeof u) continue;
                        u0(d, u);
                    }
                    (e.sham || (u && u.sham)) && o0(d, "sham", !0),
                        a0(a, s, d, e);
                }
        };
    });
    var Tl = c((n5, bl) => {
        var l0 = bo(),
            f0 = bn();
        bl.exports =
            Object.keys ||
            function (t) {
                return l0(t, f0);
            };
    });
    var Ol = c((i5, Il) => {
        var d0 = St(),
            p0 = wr(),
            g0 = Or(),
            v0 = Tr(),
            h0 = Tl();
        Il.exports = d0
            ? Object.defineProperties
            : function (t, r) {
                  g0(t);
                  for (
                      var n = v0(r), i = h0(r), o = i.length, a = 0, s;
                      o > a;

                  )
                      p0.f(t, (s = i[a++]), n[s]);
                  return t;
              };
    });
    var Al = c((o5, wl) => {
        var E0 = Ir();
        wl.exports = E0("document", "documentElement");
    });
    var ql = c((a5, Pl) => {
        var y0 = Or(),
            m0 = Ol(),
            xl = bn(),
            _0 = yn(),
            b0 = Al(),
            T0 = io(),
            I0 = co(),
            Sl = ">",
            Cl = "<",
            Oo = "prototype",
            wo = "script",
            Ll = I0("IE_PROTO"),
            Io = function () {},
            Nl = function (e) {
                return Cl + wo + Sl + e + Cl + "/" + wo + Sl;
            },
            Rl = function (e) {
                e.write(Nl("")), e.close();
                var t = e.parentWindow.Object;
                return (e = null), t;
            },
            O0 = function () {
                var e = T0("iframe"),
                    t = "java" + wo + ":",
                    r;
                return (
                    (e.style.display = "none"),
                    b0.appendChild(e),
                    (e.src = String(t)),
                    (r = e.contentWindow.document),
                    r.open(),
                    r.write(Nl("document.F=Object")),
                    r.close(),
                    r.F
                );
            },
            Tn,
            In = function () {
                try {
                    Tn = new ActiveXObject("htmlfile");
                } catch {}
                In =
                    typeof document < "u"
                        ? document.domain && Tn
                            ? Rl(Tn)
                            : O0()
                        : Rl(Tn);
                for (var e = xl.length; e--; ) delete In[Oo][xl[e]];
                return In();
            };
        _0[Ll] = !0;
        Pl.exports =
            Object.create ||
            function (t, r) {
                var n;
                return (
                    t !== null
                        ? ((Io[Oo] = y0(t)),
                          (n = new Io()),
                          (Io[Oo] = null),
                          (n[Ll] = t))
                        : (n = In()),
                    r === void 0 ? n : m0(n, r)
                );
            };
    });
    var Ml = c((s5, Fl) => {
        var w0 = to(),
            A0 = ql(),
            x0 = wr(),
            Ao = w0("unscopables"),
            xo = Array.prototype;
        xo[Ao] == null && x0.f(xo, Ao, { configurable: !0, value: A0(null) });
        Fl.exports = function (e) {
            xo[Ao][e] = !0;
        };
    });
    var Dl = c(() => {
        "use strict";
        var S0 = _l(),
            C0 = mo().includes,
            R0 = Ml();
        S0(
            { target: "Array", proto: !0 },
            {
                includes: function (t) {
                    return C0(
                        this,
                        t,
                        arguments.length > 1 ? arguments[1] : void 0
                    );
                },
            }
        );
        R0("includes");
    });
    var kl = c((l5, Gl) => {
        var L0 = ge(),
            N0 = Xe();
        Gl.exports = function (e, t) {
            return N0(L0[e].prototype[t]);
        };
    });
    var Vl = c((f5, Ul) => {
        Dl();
        var P0 = kl();
        Ul.exports = P0("Array", "includes");
    });
    var Wl = c((d5, Bl) => {
        var q0 = Vl();
        Bl.exports = q0;
    });
    var Xl = c((p5, Hl) => {
        var F0 = Wl();
        Hl.exports = F0;
    });
    var So = c((g5, jl) => {
        var M0 =
            typeof global == "object" &&
            global &&
            global.Object === Object &&
            global;
        jl.exports = M0;
    });
    var ze = c((v5, zl) => {
        var D0 = So(),
            G0 =
                typeof self == "object" &&
                self &&
                self.Object === Object &&
                self,
            k0 = D0 || G0 || Function("return this")();
        zl.exports = k0;
    });
    var Xt = c((h5, Kl) => {
        var U0 = ze(),
            V0 = U0.Symbol;
        Kl.exports = V0;
    });
    var Zl = c((E5, Ql) => {
        var Yl = Xt(),
            $l = Object.prototype,
            B0 = $l.hasOwnProperty,
            W0 = $l.toString,
            Sr = Yl ? Yl.toStringTag : void 0;
        function H0(e) {
            var t = B0.call(e, Sr),
                r = e[Sr];
            try {
                e[Sr] = void 0;
                var n = !0;
            } catch {}
            var i = W0.call(e);
            return n && (t ? (e[Sr] = r) : delete e[Sr]), i;
        }
        Ql.exports = H0;
    });
    var ef = c((y5, Jl) => {
        var X0 = Object.prototype,
            j0 = X0.toString;
        function z0(e) {
            return j0.call(e);
        }
        Jl.exports = z0;
    });
    var bt = c((m5, nf) => {
        var tf = Xt(),
            K0 = Zl(),
            Y0 = ef(),
            $0 = "[object Null]",
            Q0 = "[object Undefined]",
            rf = tf ? tf.toStringTag : void 0;
        function Z0(e) {
            return e == null
                ? e === void 0
                    ? Q0
                    : $0
                : rf && rf in Object(e)
                ? K0(e)
                : Y0(e);
        }
        nf.exports = Z0;
    });
    var Co = c((_5, of) => {
        function J0(e, t) {
            return function (r) {
                return e(t(r));
            };
        }
        of.exports = J0;
    });
    var Ro = c((b5, af) => {
        var eO = Co(),
            tO = eO(Object.getPrototypeOf, Object);
        af.exports = tO;
    });
    var dt = c((T5, sf) => {
        function rO(e) {
            return e != null && typeof e == "object";
        }
        sf.exports = rO;
    });
    var Lo = c((I5, cf) => {
        var nO = bt(),
            iO = Ro(),
            oO = dt(),
            aO = "[object Object]",
            sO = Function.prototype,
            uO = Object.prototype,
            uf = sO.toString,
            cO = uO.hasOwnProperty,
            lO = uf.call(Object);
        function fO(e) {
            if (!oO(e) || nO(e) != aO) return !1;
            var t = iO(e);
            if (t === null) return !0;
            var r = cO.call(t, "constructor") && t.constructor;
            return typeof r == "function" && r instanceof r && uf.call(r) == lO;
        }
        cf.exports = fO;
    });
    var lf = c((No) => {
        "use strict";
        Object.defineProperty(No, "__esModule", { value: !0 });
        No.default = dO;
        function dO(e) {
            var t,
                r = e.Symbol;
            return (
                typeof r == "function"
                    ? r.observable
                        ? (t = r.observable)
                        : ((t = r("observable")), (r.observable = t))
                    : (t = "@@observable"),
                t
            );
        }
    });
    var ff = c((qo, Po) => {
        "use strict";
        Object.defineProperty(qo, "__esModule", { value: !0 });
        var pO = lf(),
            gO = vO(pO);
        function vO(e) {
            return e && e.__esModule ? e : { default: e };
        }
        var jt;
        typeof self < "u"
            ? (jt = self)
            : typeof window < "u"
            ? (jt = window)
            : typeof global < "u"
            ? (jt = global)
            : typeof Po < "u"
            ? (jt = Po)
            : (jt = Function("return this")());
        var hO = (0, gO.default)(jt);
        qo.default = hO;
    });
    var Fo = c((Cr) => {
        "use strict";
        Cr.__esModule = !0;
        Cr.ActionTypes = void 0;
        Cr.default = vf;
        var EO = Lo(),
            yO = gf(EO),
            mO = ff(),
            df = gf(mO);
        function gf(e) {
            return e && e.__esModule ? e : { default: e };
        }
        var pf = (Cr.ActionTypes = { INIT: "@@redux/INIT" });
        function vf(e, t, r) {
            var n;
            if (
                (typeof t == "function" &&
                    typeof r > "u" &&
                    ((r = t), (t = void 0)),
                typeof r < "u")
            ) {
                if (typeof r != "function")
                    throw new Error("Expected the enhancer to be a function.");
                return r(vf)(e, t);
            }
            if (typeof e != "function")
                throw new Error("Expected the reducer to be a function.");
            var i = e,
                o = t,
                a = [],
                s = a,
                u = !1;
            function d() {
                s === a && (s = a.slice());
            }
            function h() {
                return o;
            }
            function v(T) {
                if (typeof T != "function")
                    throw new Error("Expected listener to be a function.");
                var S = !0;
                return (
                    d(),
                    s.push(T),
                    function () {
                        if (S) {
                            (S = !1), d();
                            var N = s.indexOf(T);
                            s.splice(N, 1);
                        }
                    }
                );
            }
            function g(T) {
                if (!(0, yO.default)(T))
                    throw new Error(
                        "Actions must be plain objects. Use custom middleware for async actions."
                    );
                if (typeof T.type > "u")
                    throw new Error(
                        'Actions may not have an undefined "type" property. Have you misspelled a constant?'
                    );
                if (u) throw new Error("Reducers may not dispatch actions.");
                try {
                    (u = !0), (o = i(o, T));
                } finally {
                    u = !1;
                }
                for (var S = (a = s), _ = 0; _ < S.length; _++) S[_]();
                return T;
            }
            function b(T) {
                if (typeof T != "function")
                    throw new Error(
                        "Expected the nextReducer to be a function."
                    );
                (i = T), g({ type: pf.INIT });
            }
            function O() {
                var T,
                    S = v;
                return (
                    (T = {
                        subscribe: function (N) {
                            if (typeof N != "object")
                                throw new TypeError(
                                    "Expected the observer to be an object."
                                );
                            function R() {
                                N.next && N.next(h());
                            }
                            R();
                            var q = S(R);
                            return { unsubscribe: q };
                        },
                    }),
                    (T[df.default] = function () {
                        return this;
                    }),
                    T
                );
            }
            return (
                g({ type: pf.INIT }),
                (n = {
                    dispatch: g,
                    subscribe: v,
                    getState: h,
                    replaceReducer: b,
                }),
                (n[df.default] = O),
                n
            );
        }
    });
    var Do = c((Mo) => {
        "use strict";
        Mo.__esModule = !0;
        Mo.default = _O;
        function _O(e) {
            typeof console < "u" &&
                typeof console.error == "function" &&
                console.error(e);
            try {
                throw new Error(e);
            } catch {}
        }
    });
    var yf = c((Go) => {
        "use strict";
        Go.__esModule = !0;
        Go.default = wO;
        var hf = Fo(),
            bO = Lo(),
            x5 = Ef(bO),
            TO = Do(),
            S5 = Ef(TO);
        function Ef(e) {
            return e && e.__esModule ? e : { default: e };
        }
        function IO(e, t) {
            var r = t && t.type,
                n = (r && '"' + r.toString() + '"') || "an action";
            return (
                "Given action " +
                n +
                ', reducer "' +
                e +
                '" returned undefined. To ignore an action, you must explicitly return the previous state.'
            );
        }
        function OO(e) {
            Object.keys(e).forEach(function (t) {
                var r = e[t],
                    n = r(void 0, { type: hf.ActionTypes.INIT });
                if (typeof n > "u")
                    throw new Error(
                        'Reducer "' +
                            t +
                            '" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined.'
                    );
                var i =
                    "@@redux/PROBE_UNKNOWN_ACTION_" +
                    Math.random().toString(36).substring(7).split("").join(".");
                if (typeof r(void 0, { type: i }) > "u")
                    throw new Error(
                        'Reducer "' +
                            t +
                            '" returned undefined when probed with a random type. ' +
                            ("Don't try to handle " +
                                hf.ActionTypes.INIT +
                                ' or other actions in "redux/*" ') +
                            "namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined."
                    );
            });
        }
        function wO(e) {
            for (var t = Object.keys(e), r = {}, n = 0; n < t.length; n++) {
                var i = t[n];
                typeof e[i] == "function" && (r[i] = e[i]);
            }
            var o = Object.keys(r);
            if (!1) var a;
            var s;
            try {
                OO(r);
            } catch (u) {
                s = u;
            }
            return function () {
                var d =
                        arguments.length <= 0 || arguments[0] === void 0
                            ? {}
                            : arguments[0],
                    h = arguments[1];
                if (s) throw s;
                if (!1) var v;
                for (var g = !1, b = {}, O = 0; O < o.length; O++) {
                    var T = o[O],
                        S = r[T],
                        _ = d[T],
                        N = S(_, h);
                    if (typeof N > "u") {
                        var R = IO(T, h);
                        throw new Error(R);
                    }
                    (b[T] = N), (g = g || N !== _);
                }
                return g ? b : d;
            };
        }
    });
    var _f = c((ko) => {
        "use strict";
        ko.__esModule = !0;
        ko.default = AO;
        function mf(e, t) {
            return function () {
                return t(e.apply(void 0, arguments));
            };
        }
        function AO(e, t) {
            if (typeof e == "function") return mf(e, t);
            if (typeof e != "object" || e === null)
                throw new Error(
                    "bindActionCreators expected an object or a function, instead received " +
                        (e === null ? "null" : typeof e) +
                        '. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?'
                );
            for (var r = Object.keys(e), n = {}, i = 0; i < r.length; i++) {
                var o = r[i],
                    a = e[o];
                typeof a == "function" && (n[o] = mf(a, t));
            }
            return n;
        }
    });
    var Vo = c((Uo) => {
        "use strict";
        Uo.__esModule = !0;
        Uo.default = xO;
        function xO() {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++)
                t[r] = arguments[r];
            if (t.length === 0)
                return function (o) {
                    return o;
                };
            if (t.length === 1) return t[0];
            var n = t[t.length - 1],
                i = t.slice(0, -1);
            return function () {
                return i.reduceRight(function (o, a) {
                    return a(o);
                }, n.apply(void 0, arguments));
            };
        }
    });
    var bf = c((Bo) => {
        "use strict";
        Bo.__esModule = !0;
        var SO =
            Object.assign ||
            function (e) {
                for (var t = 1; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var n in r)
                        Object.prototype.hasOwnProperty.call(r, n) &&
                            (e[n] = r[n]);
                }
                return e;
            };
        Bo.default = NO;
        var CO = Vo(),
            RO = LO(CO);
        function LO(e) {
            return e && e.__esModule ? e : { default: e };
        }
        function NO() {
            for (var e = arguments.length, t = Array(e), r = 0; r < e; r++)
                t[r] = arguments[r];
            return function (n) {
                return function (i, o, a) {
                    var s = n(i, o, a),
                        u = s.dispatch,
                        d = [],
                        h = {
                            getState: s.getState,
                            dispatch: function (g) {
                                return u(g);
                            },
                        };
                    return (
                        (d = t.map(function (v) {
                            return v(h);
                        })),
                        (u = RO.default.apply(void 0, d)(s.dispatch)),
                        SO({}, s, { dispatch: u })
                    );
                };
            };
        }
    });
    var Wo = c((Ue) => {
        "use strict";
        Ue.__esModule = !0;
        Ue.compose =
            Ue.applyMiddleware =
            Ue.bindActionCreators =
            Ue.combineReducers =
            Ue.createStore =
                void 0;
        var PO = Fo(),
            qO = zt(PO),
            FO = yf(),
            MO = zt(FO),
            DO = _f(),
            GO = zt(DO),
            kO = bf(),
            UO = zt(kO),
            VO = Vo(),
            BO = zt(VO),
            WO = Do(),
            P5 = zt(WO);
        function zt(e) {
            return e && e.__esModule ? e : { default: e };
        }
        Ue.createStore = qO.default;
        Ue.combineReducers = MO.default;
        Ue.bindActionCreators = GO.default;
        Ue.applyMiddleware = UO.default;
        Ue.compose = BO.default;
    });
    var Ke,
        Ho,
        it,
        HO,
        XO,
        On,
        jO,
        Xo = pe(() => {
            "use strict";
            (Ke = {
                NAVBAR_OPEN: "NAVBAR_OPEN",
                NAVBAR_CLOSE: "NAVBAR_CLOSE",
                TAB_ACTIVE: "TAB_ACTIVE",
                TAB_INACTIVE: "TAB_INACTIVE",
                SLIDER_ACTIVE: "SLIDER_ACTIVE",
                SLIDER_INACTIVE: "SLIDER_INACTIVE",
                DROPDOWN_OPEN: "DROPDOWN_OPEN",
                DROPDOWN_CLOSE: "DROPDOWN_CLOSE",
                MOUSE_CLICK: "MOUSE_CLICK",
                MOUSE_SECOND_CLICK: "MOUSE_SECOND_CLICK",
                MOUSE_DOWN: "MOUSE_DOWN",
                MOUSE_UP: "MOUSE_UP",
                MOUSE_OVER: "MOUSE_OVER",
                MOUSE_OUT: "MOUSE_OUT",
                MOUSE_MOVE: "MOUSE_MOVE",
                MOUSE_MOVE_IN_VIEWPORT: "MOUSE_MOVE_IN_VIEWPORT",
                SCROLL_INTO_VIEW: "SCROLL_INTO_VIEW",
                SCROLL_OUT_OF_VIEW: "SCROLL_OUT_OF_VIEW",
                SCROLLING_IN_VIEW: "SCROLLING_IN_VIEW",
                ECOMMERCE_CART_OPEN: "ECOMMERCE_CART_OPEN",
                ECOMMERCE_CART_CLOSE: "ECOMMERCE_CART_CLOSE",
                PAGE_START: "PAGE_START",
                PAGE_FINISH: "PAGE_FINISH",
                PAGE_SCROLL_UP: "PAGE_SCROLL_UP",
                PAGE_SCROLL_DOWN: "PAGE_SCROLL_DOWN",
                PAGE_SCROLL: "PAGE_SCROLL",
            }),
                (Ho = { ELEMENT: "ELEMENT", CLASS: "CLASS", PAGE: "PAGE" }),
                (it = { ELEMENT: "ELEMENT", VIEWPORT: "VIEWPORT" }),
                (HO = { X_AXIS: "X_AXIS", Y_AXIS: "Y_AXIS" }),
                (XO = {
                    CHILDREN: "CHILDREN",
                    SIBLINGS: "SIBLINGS",
                    IMMEDIATE_CHILDREN: "IMMEDIATE_CHILDREN",
                }),
                (On = {
                    FADE_EFFECT: "FADE_EFFECT",
                    SLIDE_EFFECT: "SLIDE_EFFECT",
                    GROW_EFFECT: "GROW_EFFECT",
                    SHRINK_EFFECT: "SHRINK_EFFECT",
                    SPIN_EFFECT: "SPIN_EFFECT",
                    FLY_EFFECT: "FLY_EFFECT",
                    POP_EFFECT: "POP_EFFECT",
                    FLIP_EFFECT: "FLIP_EFFECT",
                    JIGGLE_EFFECT: "JIGGLE_EFFECT",
                    PULSE_EFFECT: "PULSE_EFFECT",
                    DROP_EFFECT: "DROP_EFFECT",
                    BLINK_EFFECT: "BLINK_EFFECT",
                    BOUNCE_EFFECT: "BOUNCE_EFFECT",
                    FLIP_LEFT_TO_RIGHT_EFFECT: "FLIP_LEFT_TO_RIGHT_EFFECT",
                    FLIP_RIGHT_TO_LEFT_EFFECT: "FLIP_RIGHT_TO_LEFT_EFFECT",
                    RUBBER_BAND_EFFECT: "RUBBER_BAND_EFFECT",
                    JELLO_EFFECT: "JELLO_EFFECT",
                    GROW_BIG_EFFECT: "GROW_BIG_EFFECT",
                    SHRINK_BIG_EFFECT: "SHRINK_BIG_EFFECT",
                    PLUGIN_LOTTIE_EFFECT: "PLUGIN_LOTTIE_EFFECT",
                }),
                (jO = {
                    LEFT: "LEFT",
                    RIGHT: "RIGHT",
                    BOTTOM: "BOTTOM",
                    TOP: "TOP",
                    BOTTOM_LEFT: "BOTTOM_LEFT",
                    BOTTOM_RIGHT: "BOTTOM_RIGHT",
                    TOP_RIGHT: "TOP_RIGHT",
                    TOP_LEFT: "TOP_LEFT",
                    CLOCKWISE: "CLOCKWISE",
                    COUNTER_CLOCKWISE: "COUNTER_CLOCKWISE",
                });
        });
    var qe,
        zO,
        wn = pe(() => {
            "use strict";
            (qe = {
                TRANSFORM_MOVE: "TRANSFORM_MOVE",
                TRANSFORM_SCALE: "TRANSFORM_SCALE",
                TRANSFORM_ROTATE: "TRANSFORM_ROTATE",
                TRANSFORM_SKEW: "TRANSFORM_SKEW",
                STYLE_OPACITY: "STYLE_OPACITY",
                STYLE_SIZE: "STYLE_SIZE",
                STYLE_FILTER: "STYLE_FILTER",
                STYLE_FONT_VARIATION: "STYLE_FONT_VARIATION",
                STYLE_BACKGROUND_COLOR: "STYLE_BACKGROUND_COLOR",
                STYLE_BORDER: "STYLE_BORDER",
                STYLE_TEXT_COLOR: "STYLE_TEXT_COLOR",
                OBJECT_VALUE: "OBJECT_VALUE",
                PLUGIN_LOTTIE: "PLUGIN_LOTTIE",
                PLUGIN_SPLINE: "PLUGIN_SPLINE",
                PLUGIN_VARIABLE: "PLUGIN_VARIABLE",
                GENERAL_DISPLAY: "GENERAL_DISPLAY",
                GENERAL_START_ACTION: "GENERAL_START_ACTION",
                GENERAL_CONTINUOUS_ACTION: "GENERAL_CONTINUOUS_ACTION",
                GENERAL_COMBO_CLASS: "GENERAL_COMBO_CLASS",
                GENERAL_STOP_ACTION: "GENERAL_STOP_ACTION",
                GENERAL_LOOP: "GENERAL_LOOP",
                STYLE_BOX_SHADOW: "STYLE_BOX_SHADOW",
            }),
                (zO = {
                    ELEMENT: "ELEMENT",
                    ELEMENT_CLASS: "ELEMENT_CLASS",
                    TRIGGER_ELEMENT: "TRIGGER_ELEMENT",
                });
        });
    var KO,
        Tf = pe(() => {
            "use strict";
            KO = {
                MOUSE_CLICK_INTERACTION: "MOUSE_CLICK_INTERACTION",
                MOUSE_HOVER_INTERACTION: "MOUSE_HOVER_INTERACTION",
                MOUSE_MOVE_INTERACTION: "MOUSE_MOVE_INTERACTION",
                SCROLL_INTO_VIEW_INTERACTION: "SCROLL_INTO_VIEW_INTERACTION",
                SCROLLING_IN_VIEW_INTERACTION: "SCROLLING_IN_VIEW_INTERACTION",
                MOUSE_MOVE_IN_VIEWPORT_INTERACTION:
                    "MOUSE_MOVE_IN_VIEWPORT_INTERACTION",
                PAGE_IS_SCROLLING_INTERACTION: "PAGE_IS_SCROLLING_INTERACTION",
                PAGE_LOAD_INTERACTION: "PAGE_LOAD_INTERACTION",
                PAGE_SCROLLED_INTERACTION: "PAGE_SCROLLED_INTERACTION",
                NAVBAR_INTERACTION: "NAVBAR_INTERACTION",
                DROPDOWN_INTERACTION: "DROPDOWN_INTERACTION",
                ECOMMERCE_CART_INTERACTION: "ECOMMERCE_CART_INTERACTION",
                TAB_INTERACTION: "TAB_INTERACTION",
                SLIDER_INTERACTION: "SLIDER_INTERACTION",
            };
        });
    var YO,
        $O,
        QO,
        ZO,
        JO,
        ew,
        tw,
        jo,
        If = pe(() => {
            "use strict";
            wn();
            ({
                TRANSFORM_MOVE: YO,
                TRANSFORM_SCALE: $O,
                TRANSFORM_ROTATE: QO,
                TRANSFORM_SKEW: ZO,
                STYLE_SIZE: JO,
                STYLE_FILTER: ew,
                STYLE_FONT_VARIATION: tw,
            } = qe),
                (jo = {
                    [YO]: !0,
                    [$O]: !0,
                    [QO]: !0,
                    [ZO]: !0,
                    [JO]: !0,
                    [ew]: !0,
                    [tw]: !0,
                });
        });
    var _e = {};
    Pe(_e, {
        IX2_ACTION_LIST_PLAYBACK_CHANGED: () => yw,
        IX2_ANIMATION_FRAME_CHANGED: () => dw,
        IX2_CLEAR_REQUESTED: () => cw,
        IX2_ELEMENT_STATE_CHANGED: () => Ew,
        IX2_EVENT_LISTENER_ADDED: () => lw,
        IX2_EVENT_STATE_CHANGED: () => fw,
        IX2_INSTANCE_ADDED: () => gw,
        IX2_INSTANCE_REMOVED: () => hw,
        IX2_INSTANCE_STARTED: () => vw,
        IX2_MEDIA_QUERIES_DEFINED: () => _w,
        IX2_PARAMETER_CHANGED: () => pw,
        IX2_PLAYBACK_REQUESTED: () => sw,
        IX2_PREVIEW_REQUESTED: () => aw,
        IX2_RAW_DATA_IMPORTED: () => rw,
        IX2_SESSION_INITIALIZED: () => nw,
        IX2_SESSION_STARTED: () => iw,
        IX2_SESSION_STOPPED: () => ow,
        IX2_STOP_REQUESTED: () => uw,
        IX2_TEST_FRAME_RENDERED: () => bw,
        IX2_VIEWPORT_WIDTH_CHANGED: () => mw,
    });
    var rw,
        nw,
        iw,
        ow,
        aw,
        sw,
        uw,
        cw,
        lw,
        fw,
        dw,
        pw,
        gw,
        vw,
        hw,
        Ew,
        yw,
        mw,
        _w,
        bw,
        Of = pe(() => {
            "use strict";
            (rw = "IX2_RAW_DATA_IMPORTED"),
                (nw = "IX2_SESSION_INITIALIZED"),
                (iw = "IX2_SESSION_STARTED"),
                (ow = "IX2_SESSION_STOPPED"),
                (aw = "IX2_PREVIEW_REQUESTED"),
                (sw = "IX2_PLAYBACK_REQUESTED"),
                (uw = "IX2_STOP_REQUESTED"),
                (cw = "IX2_CLEAR_REQUESTED"),
                (lw = "IX2_EVENT_LISTENER_ADDED"),
                (fw = "IX2_EVENT_STATE_CHANGED"),
                (dw = "IX2_ANIMATION_FRAME_CHANGED"),
                (pw = "IX2_PARAMETER_CHANGED"),
                (gw = "IX2_INSTANCE_ADDED"),
                (vw = "IX2_INSTANCE_STARTED"),
                (hw = "IX2_INSTANCE_REMOVED"),
                (Ew = "IX2_ELEMENT_STATE_CHANGED"),
                (yw = "IX2_ACTION_LIST_PLAYBACK_CHANGED"),
                (mw = "IX2_VIEWPORT_WIDTH_CHANGED"),
                (_w = "IX2_MEDIA_QUERIES_DEFINED"),
                (bw = "IX2_TEST_FRAME_RENDERED");
        });
    var we = {};
    Pe(we, {
        ABSTRACT_NODE: () => mA,
        AUTO: () => uA,
        BACKGROUND: () => rA,
        BACKGROUND_COLOR: () => tA,
        BAR_DELIMITER: () => fA,
        BORDER_COLOR: () => nA,
        BOUNDARY_SELECTOR: () => Aw,
        CHILDREN: () => dA,
        COLON_DELIMITER: () => lA,
        COLOR: () => iA,
        COMMA_DELIMITER: () => cA,
        CONFIG_UNIT: () => qw,
        CONFIG_VALUE: () => Rw,
        CONFIG_X_UNIT: () => Lw,
        CONFIG_X_VALUE: () => xw,
        CONFIG_Y_UNIT: () => Nw,
        CONFIG_Y_VALUE: () => Sw,
        CONFIG_Z_UNIT: () => Pw,
        CONFIG_Z_VALUE: () => Cw,
        DISPLAY: () => oA,
        FILTER: () => Qw,
        FLEX: () => aA,
        FONT_VARIATION_SETTINGS: () => Zw,
        HEIGHT: () => eA,
        HTML_ELEMENT: () => EA,
        IMMEDIATE_CHILDREN: () => pA,
        IX2_ID_DELIMITER: () => Tw,
        OPACITY: () => $w,
        PARENT: () => vA,
        PLAIN_OBJECT: () => yA,
        PRESERVE_3D: () => hA,
        RENDER_GENERAL: () => bA,
        RENDER_PLUGIN: () => IA,
        RENDER_STYLE: () => TA,
        RENDER_TRANSFORM: () => _A,
        ROTATE_X: () => Hw,
        ROTATE_Y: () => Xw,
        ROTATE_Z: () => jw,
        SCALE_3D: () => Ww,
        SCALE_X: () => Uw,
        SCALE_Y: () => Vw,
        SCALE_Z: () => Bw,
        SIBLINGS: () => gA,
        SKEW: () => zw,
        SKEW_X: () => Kw,
        SKEW_Y: () => Yw,
        TRANSFORM: () => Fw,
        TRANSLATE_3D: () => kw,
        TRANSLATE_X: () => Mw,
        TRANSLATE_Y: () => Dw,
        TRANSLATE_Z: () => Gw,
        WF_PAGE: () => Iw,
        WIDTH: () => Jw,
        WILL_CHANGE: () => sA,
        W_MOD_IX: () => ww,
        W_MOD_JS: () => Ow,
    });
    var Tw,
        Iw,
        Ow,
        ww,
        Aw,
        xw,
        Sw,
        Cw,
        Rw,
        Lw,
        Nw,
        Pw,
        qw,
        Fw,
        Mw,
        Dw,
        Gw,
        kw,
        Uw,
        Vw,
        Bw,
        Ww,
        Hw,
        Xw,
        jw,
        zw,
        Kw,
        Yw,
        $w,
        Qw,
        Zw,
        Jw,
        eA,
        tA,
        rA,
        nA,
        iA,
        oA,
        aA,
        sA,
        uA,
        cA,
        lA,
        fA,
        dA,
        pA,
        gA,
        vA,
        hA,
        EA,
        yA,
        mA,
        _A,
        bA,
        TA,
        IA,
        wf = pe(() => {
            "use strict";
            (Tw = "|"),
                (Iw = "data-wf-page"),
                (Ow = "w-mod-js"),
                (ww = "w-mod-ix"),
                (Aw = ".w-dyn-item"),
                (xw = "xValue"),
                (Sw = "yValue"),
                (Cw = "zValue"),
                (Rw = "value"),
                (Lw = "xUnit"),
                (Nw = "yUnit"),
                (Pw = "zUnit"),
                (qw = "unit"),
                (Fw = "transform"),
                (Mw = "translateX"),
                (Dw = "translateY"),
                (Gw = "translateZ"),
                (kw = "translate3d"),
                (Uw = "scaleX"),
                (Vw = "scaleY"),
                (Bw = "scaleZ"),
                (Ww = "scale3d"),
                (Hw = "rotateX"),
                (Xw = "rotateY"),
                (jw = "rotateZ"),
                (zw = "skew"),
                (Kw = "skewX"),
                (Yw = "skewY"),
                ($w = "opacity"),
                (Qw = "filter"),
                (Zw = "font-variation-settings"),
                (Jw = "width"),
                (eA = "height"),
                (tA = "backgroundColor"),
                (rA = "background"),
                (nA = "borderColor"),
                (iA = "color"),
                (oA = "display"),
                (aA = "flex"),
                (sA = "willChange"),
                (uA = "AUTO"),
                (cA = ","),
                (lA = ":"),
                (fA = "|"),
                (dA = "CHILDREN"),
                (pA = "IMMEDIATE_CHILDREN"),
                (gA = "SIBLINGS"),
                (vA = "PARENT"),
                (hA = "preserve-3d"),
                (EA = "HTML_ELEMENT"),
                (yA = "PLAIN_OBJECT"),
                (mA = "ABSTRACT_NODE"),
                (_A = "RENDER_TRANSFORM"),
                (bA = "RENDER_GENERAL"),
                (TA = "RENDER_STYLE"),
                (IA = "RENDER_PLUGIN");
        });
    var Af = {};
    Pe(Af, {
        ActionAppliesTo: () => zO,
        ActionTypeConsts: () => qe,
        EventAppliesTo: () => Ho,
        EventBasedOn: () => it,
        EventContinuousMouseAxes: () => HO,
        EventLimitAffectedElements: () => XO,
        EventTypeConsts: () => Ke,
        IX2EngineActionTypes: () => _e,
        IX2EngineConstants: () => we,
        InteractionTypeConsts: () => KO,
        QuickEffectDirectionConsts: () => jO,
        QuickEffectIds: () => On,
        ReducedMotionTypes: () => jo,
    });
    var Fe = pe(() => {
        "use strict";
        Xo();
        wn();
        Tf();
        If();
        Of();
        wf();
        wn();
        Xo();
    });
    var OA,
        xf,
        Sf = pe(() => {
            "use strict";
            Fe();
            ({ IX2_RAW_DATA_IMPORTED: OA } = _e),
                (xf = (e = Object.freeze({}), t) => {
                    switch (t.type) {
                        case OA:
                            return t.payload.ixData || Object.freeze({});
                        default:
                            return e;
                    }
                });
        });
    var Kt = c((he) => {
        "use strict";
        Object.defineProperty(he, "__esModule", { value: !0 });
        var wA =
            typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
                ? function (e) {
                      return typeof e;
                  }
                : function (e) {
                      return e &&
                          typeof Symbol == "function" &&
                          e.constructor === Symbol &&
                          e !== Symbol.prototype
                          ? "symbol"
                          : typeof e;
                  };
        he.clone = xn;
        he.addLast = Lf;
        he.addFirst = Nf;
        he.removeLast = Pf;
        he.removeFirst = qf;
        he.insert = Ff;
        he.removeAt = Mf;
        he.replaceAt = Df;
        he.getIn = Sn;
        he.set = Cn;
        he.setIn = Rn;
        he.update = kf;
        he.updateIn = Uf;
        he.merge = Vf;
        he.mergeDeep = Bf;
        he.mergeIn = Wf;
        he.omit = Hf;
        he.addDefaults = Xf;
        var Cf = "INVALID_ARGS";
        function Rf(e) {
            throw new Error(e);
        }
        function zo(e) {
            var t = Object.keys(e);
            return Object.getOwnPropertySymbols
                ? t.concat(Object.getOwnPropertySymbols(e))
                : t;
        }
        var AA = {}.hasOwnProperty;
        function xn(e) {
            if (Array.isArray(e)) return e.slice();
            for (var t = zo(e), r = {}, n = 0; n < t.length; n++) {
                var i = t[n];
                r[i] = e[i];
            }
            return r;
        }
        function Me(e, t, r) {
            var n = r;
            n == null && Rf(Cf);
            for (
                var i = !1,
                    o = arguments.length,
                    a = Array(o > 3 ? o - 3 : 0),
                    s = 3;
                s < o;
                s++
            )
                a[s - 3] = arguments[s];
            for (var u = 0; u < a.length; u++) {
                var d = a[u];
                if (d != null) {
                    var h = zo(d);
                    if (h.length)
                        for (var v = 0; v <= h.length; v++) {
                            var g = h[v];
                            if (!(e && n[g] !== void 0)) {
                                var b = d[g];
                                t &&
                                    An(n[g]) &&
                                    An(b) &&
                                    (b = Me(e, t, n[g], b)),
                                    !(b === void 0 || b === n[g]) &&
                                        (i || ((i = !0), (n = xn(n))),
                                        (n[g] = b));
                            }
                        }
                }
            }
            return n;
        }
        function An(e) {
            var t = typeof e > "u" ? "undefined" : wA(e);
            return e != null && (t === "object" || t === "function");
        }
        function Lf(e, t) {
            return Array.isArray(t) ? e.concat(t) : e.concat([t]);
        }
        function Nf(e, t) {
            return Array.isArray(t) ? t.concat(e) : [t].concat(e);
        }
        function Pf(e) {
            return e.length ? e.slice(0, e.length - 1) : e;
        }
        function qf(e) {
            return e.length ? e.slice(1) : e;
        }
        function Ff(e, t, r) {
            return e
                .slice(0, t)
                .concat(Array.isArray(r) ? r : [r])
                .concat(e.slice(t));
        }
        function Mf(e, t) {
            return t >= e.length || t < 0
                ? e
                : e.slice(0, t).concat(e.slice(t + 1));
        }
        function Df(e, t, r) {
            if (e[t] === r) return e;
            for (var n = e.length, i = Array(n), o = 0; o < n; o++) i[o] = e[o];
            return (i[t] = r), i;
        }
        function Sn(e, t) {
            if ((!Array.isArray(t) && Rf(Cf), e != null)) {
                for (var r = e, n = 0; n < t.length; n++) {
                    var i = t[n];
                    if (((r = r?.[i]), r === void 0)) return r;
                }
                return r;
            }
        }
        function Cn(e, t, r) {
            var n = typeof t == "number" ? [] : {},
                i = e ?? n;
            if (i[t] === r) return i;
            var o = xn(i);
            return (o[t] = r), o;
        }
        function Gf(e, t, r, n) {
            var i = void 0,
                o = t[n];
            if (n === t.length - 1) i = r;
            else {
                var a =
                    An(e) && An(e[o])
                        ? e[o]
                        : typeof t[n + 1] == "number"
                        ? []
                        : {};
                i = Gf(a, t, r, n + 1);
            }
            return Cn(e, o, i);
        }
        function Rn(e, t, r) {
            return t.length ? Gf(e, t, r, 0) : r;
        }
        function kf(e, t, r) {
            var n = e?.[t],
                i = r(n);
            return Cn(e, t, i);
        }
        function Uf(e, t, r) {
            var n = Sn(e, t),
                i = r(n);
            return Rn(e, t, i);
        }
        function Vf(e, t, r, n, i, o) {
            for (
                var a = arguments.length, s = Array(a > 6 ? a - 6 : 0), u = 6;
                u < a;
                u++
            )
                s[u - 6] = arguments[u];
            return s.length
                ? Me.call.apply(Me, [null, !1, !1, e, t, r, n, i, o].concat(s))
                : Me(!1, !1, e, t, r, n, i, o);
        }
        function Bf(e, t, r, n, i, o) {
            for (
                var a = arguments.length, s = Array(a > 6 ? a - 6 : 0), u = 6;
                u < a;
                u++
            )
                s[u - 6] = arguments[u];
            return s.length
                ? Me.call.apply(Me, [null, !1, !0, e, t, r, n, i, o].concat(s))
                : Me(!1, !0, e, t, r, n, i, o);
        }
        function Wf(e, t, r, n, i, o, a) {
            var s = Sn(e, t);
            s == null && (s = {});
            for (
                var u = void 0,
                    d = arguments.length,
                    h = Array(d > 7 ? d - 7 : 0),
                    v = 7;
                v < d;
                v++
            )
                h[v - 7] = arguments[v];
            return (
                h.length
                    ? (u = Me.call.apply(
                          Me,
                          [null, !1, !1, s, r, n, i, o, a].concat(h)
                      ))
                    : (u = Me(!1, !1, s, r, n, i, o, a)),
                Rn(e, t, u)
            );
        }
        function Hf(e, t) {
            for (
                var r = Array.isArray(t) ? t : [t], n = !1, i = 0;
                i < r.length;
                i++
            )
                if (AA.call(e, r[i])) {
                    n = !0;
                    break;
                }
            if (!n) return e;
            for (var o = {}, a = zo(e), s = 0; s < a.length; s++) {
                var u = a[s];
                r.indexOf(u) >= 0 || (o[u] = e[u]);
            }
            return o;
        }
        function Xf(e, t, r, n, i, o) {
            for (
                var a = arguments.length, s = Array(a > 6 ? a - 6 : 0), u = 6;
                u < a;
                u++
            )
                s[u - 6] = arguments[u];
            return s.length
                ? Me.call.apply(Me, [null, !0, !1, e, t, r, n, i, o].concat(s))
                : Me(!0, !1, e, t, r, n, i, o);
        }
        var xA = {
            clone: xn,
            addLast: Lf,
            addFirst: Nf,
            removeLast: Pf,
            removeFirst: qf,
            insert: Ff,
            removeAt: Mf,
            replaceAt: Df,
            getIn: Sn,
            set: Cn,
            setIn: Rn,
            update: kf,
            updateIn: Uf,
            merge: Vf,
            mergeDeep: Bf,
            mergeIn: Wf,
            omit: Hf,
            addDefaults: Xf,
        };
        he.default = xA;
    });
    var zf,
        SA,
        CA,
        RA,
        LA,
        NA,
        jf,
        Kf,
        Yf = pe(() => {
            "use strict";
            Fe();
            (zf = ae(Kt())),
                ({
                    IX2_PREVIEW_REQUESTED: SA,
                    IX2_PLAYBACK_REQUESTED: CA,
                    IX2_STOP_REQUESTED: RA,
                    IX2_CLEAR_REQUESTED: LA,
                } = _e),
                (NA = { preview: {}, playback: {}, stop: {}, clear: {} }),
                (jf = Object.create(null, {
                    [SA]: { value: "preview" },
                    [CA]: { value: "playback" },
                    [RA]: { value: "stop" },
                    [LA]: { value: "clear" },
                })),
                (Kf = (e = NA, t) => {
                    if (t.type in jf) {
                        let r = [jf[t.type]];
                        return (0, zf.setIn)(e, [r], { ...t.payload });
                    }
                    return e;
                });
        });
    var Ce,
        PA,
        qA,
        FA,
        MA,
        DA,
        GA,
        kA,
        UA,
        VA,
        BA,
        $f,
        WA,
        Qf,
        Zf = pe(() => {
            "use strict";
            Fe();
            (Ce = ae(Kt())),
                ({
                    IX2_SESSION_INITIALIZED: PA,
                    IX2_SESSION_STARTED: qA,
                    IX2_TEST_FRAME_RENDERED: FA,
                    IX2_SESSION_STOPPED: MA,
                    IX2_EVENT_LISTENER_ADDED: DA,
                    IX2_EVENT_STATE_CHANGED: GA,
                    IX2_ANIMATION_FRAME_CHANGED: kA,
                    IX2_ACTION_LIST_PLAYBACK_CHANGED: UA,
                    IX2_VIEWPORT_WIDTH_CHANGED: VA,
                    IX2_MEDIA_QUERIES_DEFINED: BA,
                } = _e),
                ($f = {
                    active: !1,
                    tick: 0,
                    eventListeners: [],
                    eventState: {},
                    playbackState: {},
                    viewportWidth: 0,
                    mediaQueryKey: null,
                    hasBoundaryNodes: !1,
                    hasDefinedMediaQueries: !1,
                    reducedMotion: !1,
                }),
                (WA = 20),
                (Qf = (e = $f, t) => {
                    switch (t.type) {
                        case PA: {
                            let { hasBoundaryNodes: r, reducedMotion: n } =
                                t.payload;
                            return (0, Ce.merge)(e, {
                                hasBoundaryNodes: r,
                                reducedMotion: n,
                            });
                        }
                        case qA:
                            return (0, Ce.set)(e, "active", !0);
                        case FA: {
                            let {
                                payload: { step: r = WA },
                            } = t;
                            return (0, Ce.set)(e, "tick", e.tick + r);
                        }
                        case MA:
                            return $f;
                        case kA: {
                            let {
                                payload: { now: r },
                            } = t;
                            return (0, Ce.set)(e, "tick", r);
                        }
                        case DA: {
                            let r = (0, Ce.addLast)(
                                e.eventListeners,
                                t.payload
                            );
                            return (0, Ce.set)(e, "eventListeners", r);
                        }
                        case GA: {
                            let { stateKey: r, newState: n } = t.payload;
                            return (0, Ce.setIn)(e, ["eventState", r], n);
                        }
                        case UA: {
                            let { actionListId: r, isPlaying: n } = t.payload;
                            return (0, Ce.setIn)(e, ["playbackState", r], n);
                        }
                        case VA: {
                            let { width: r, mediaQueries: n } = t.payload,
                                i = n.length,
                                o = null;
                            for (let a = 0; a < i; a++) {
                                let { key: s, min: u, max: d } = n[a];
                                if (r >= u && r <= d) {
                                    o = s;
                                    break;
                                }
                            }
                            return (0, Ce.merge)(e, {
                                viewportWidth: r,
                                mediaQueryKey: o,
                            });
                        }
                        case BA:
                            return (0, Ce.set)(e, "hasDefinedMediaQueries", !0);
                        default:
                            return e;
                    }
                });
        });
    var ed = c((J5, Jf) => {
        function HA() {
            (this.__data__ = []), (this.size = 0);
        }
        Jf.exports = HA;
    });
    var Ln = c((eW, td) => {
        function XA(e, t) {
            return e === t || (e !== e && t !== t);
        }
        td.exports = XA;
    });
    var Rr = c((tW, rd) => {
        var jA = Ln();
        function zA(e, t) {
            for (var r = e.length; r--; ) if (jA(e[r][0], t)) return r;
            return -1;
        }
        rd.exports = zA;
    });
    var id = c((rW, nd) => {
        var KA = Rr(),
            YA = Array.prototype,
            $A = YA.splice;
        function QA(e) {
            var t = this.__data__,
                r = KA(t, e);
            if (r < 0) return !1;
            var n = t.length - 1;
            return r == n ? t.pop() : $A.call(t, r, 1), --this.size, !0;
        }
        nd.exports = QA;
    });
    var ad = c((nW, od) => {
        var ZA = Rr();
        function JA(e) {
            var t = this.__data__,
                r = ZA(t, e);
            return r < 0 ? void 0 : t[r][1];
        }
        od.exports = JA;
    });
    var ud = c((iW, sd) => {
        var ex = Rr();
        function tx(e) {
            return ex(this.__data__, e) > -1;
        }
        sd.exports = tx;
    });
    var ld = c((oW, cd) => {
        var rx = Rr();
        function nx(e, t) {
            var r = this.__data__,
                n = rx(r, e);
            return n < 0 ? (++this.size, r.push([e, t])) : (r[n][1] = t), this;
        }
        cd.exports = nx;
    });
    var Lr = c((aW, fd) => {
        var ix = ed(),
            ox = id(),
            ax = ad(),
            sx = ud(),
            ux = ld();
        function Yt(e) {
            var t = -1,
                r = e == null ? 0 : e.length;
            for (this.clear(); ++t < r; ) {
                var n = e[t];
                this.set(n[0], n[1]);
            }
        }
        Yt.prototype.clear = ix;
        Yt.prototype.delete = ox;
        Yt.prototype.get = ax;
        Yt.prototype.has = sx;
        Yt.prototype.set = ux;
        fd.exports = Yt;
    });
    var pd = c((sW, dd) => {
        var cx = Lr();
        function lx() {
            (this.__data__ = new cx()), (this.size = 0);
        }
        dd.exports = lx;
    });
    var vd = c((uW, gd) => {
        function fx(e) {
            var t = this.__data__,
                r = t.delete(e);
            return (this.size = t.size), r;
        }
        gd.exports = fx;
    });
    var Ed = c((cW, hd) => {
        function dx(e) {
            return this.__data__.get(e);
        }
        hd.exports = dx;
    });
    var md = c((lW, yd) => {
        function px(e) {
            return this.__data__.has(e);
        }
        yd.exports = px;
    });
    var ot = c((fW, _d) => {
        function gx(e) {
            var t = typeof e;
            return e != null && (t == "object" || t == "function");
        }
        _d.exports = gx;
    });
    var Ko = c((dW, bd) => {
        var vx = bt(),
            hx = ot(),
            Ex = "[object AsyncFunction]",
            yx = "[object Function]",
            mx = "[object GeneratorFunction]",
            _x = "[object Proxy]";
        function bx(e) {
            if (!hx(e)) return !1;
            var t = vx(e);
            return t == yx || t == mx || t == Ex || t == _x;
        }
        bd.exports = bx;
    });
    var Id = c((pW, Td) => {
        var Tx = ze(),
            Ix = Tx["__core-js_shared__"];
        Td.exports = Ix;
    });
    var Ad = c((gW, wd) => {
        var Yo = Id(),
            Od = (function () {
                var e = /[^.]+$/.exec(
                    (Yo && Yo.keys && Yo.keys.IE_PROTO) || ""
                );
                return e ? "Symbol(src)_1." + e : "";
            })();
        function Ox(e) {
            return !!Od && Od in e;
        }
        wd.exports = Ox;
    });
    var $o = c((vW, xd) => {
        var wx = Function.prototype,
            Ax = wx.toString;
        function xx(e) {
            if (e != null) {
                try {
                    return Ax.call(e);
                } catch {}
                try {
                    return e + "";
                } catch {}
            }
            return "";
        }
        xd.exports = xx;
    });
    var Cd = c((hW, Sd) => {
        var Sx = Ko(),
            Cx = Ad(),
            Rx = ot(),
            Lx = $o(),
            Nx = /[\\^$.*+?()[\]{}|]/g,
            Px = /^\[object .+?Constructor\]$/,
            qx = Function.prototype,
            Fx = Object.prototype,
            Mx = qx.toString,
            Dx = Fx.hasOwnProperty,
            Gx = RegExp(
                "^" +
                    Mx.call(Dx)
                        .replace(Nx, "\\$&")
                        .replace(
                            /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                            "$1.*?"
                        ) +
                    "$"
            );
        function kx(e) {
            if (!Rx(e) || Cx(e)) return !1;
            var t = Sx(e) ? Gx : Px;
            return t.test(Lx(e));
        }
        Sd.exports = kx;
    });
    var Ld = c((EW, Rd) => {
        function Ux(e, t) {
            return e?.[t];
        }
        Rd.exports = Ux;
    });
    var Tt = c((yW, Nd) => {
        var Vx = Cd(),
            Bx = Ld();
        function Wx(e, t) {
            var r = Bx(e, t);
            return Vx(r) ? r : void 0;
        }
        Nd.exports = Wx;
    });
    var Nn = c((mW, Pd) => {
        var Hx = Tt(),
            Xx = ze(),
            jx = Hx(Xx, "Map");
        Pd.exports = jx;
    });
    var Nr = c((_W, qd) => {
        var zx = Tt(),
            Kx = zx(Object, "create");
        qd.exports = Kx;
    });
    var Dd = c((bW, Md) => {
        var Fd = Nr();
        function Yx() {
            (this.__data__ = Fd ? Fd(null) : {}), (this.size = 0);
        }
        Md.exports = Yx;
    });
    var kd = c((TW, Gd) => {
        function $x(e) {
            var t = this.has(e) && delete this.__data__[e];
            return (this.size -= t ? 1 : 0), t;
        }
        Gd.exports = $x;
    });
    var Vd = c((IW, Ud) => {
        var Qx = Nr(),
            Zx = "__lodash_hash_undefined__",
            Jx = Object.prototype,
            eS = Jx.hasOwnProperty;
        function tS(e) {
            var t = this.__data__;
            if (Qx) {
                var r = t[e];
                return r === Zx ? void 0 : r;
            }
            return eS.call(t, e) ? t[e] : void 0;
        }
        Ud.exports = tS;
    });
    var Wd = c((OW, Bd) => {
        var rS = Nr(),
            nS = Object.prototype,
            iS = nS.hasOwnProperty;
        function oS(e) {
            var t = this.__data__;
            return rS ? t[e] !== void 0 : iS.call(t, e);
        }
        Bd.exports = oS;
    });
    var Xd = c((wW, Hd) => {
        var aS = Nr(),
            sS = "__lodash_hash_undefined__";
        function uS(e, t) {
            var r = this.__data__;
            return (
                (this.size += this.has(e) ? 0 : 1),
                (r[e] = aS && t === void 0 ? sS : t),
                this
            );
        }
        Hd.exports = uS;
    });
    var zd = c((AW, jd) => {
        var cS = Dd(),
            lS = kd(),
            fS = Vd(),
            dS = Wd(),
            pS = Xd();
        function $t(e) {
            var t = -1,
                r = e == null ? 0 : e.length;
            for (this.clear(); ++t < r; ) {
                var n = e[t];
                this.set(n[0], n[1]);
            }
        }
        $t.prototype.clear = cS;
        $t.prototype.delete = lS;
        $t.prototype.get = fS;
        $t.prototype.has = dS;
        $t.prototype.set = pS;
        jd.exports = $t;
    });
    var $d = c((xW, Yd) => {
        var Kd = zd(),
            gS = Lr(),
            vS = Nn();
        function hS() {
            (this.size = 0),
                (this.__data__ = {
                    hash: new Kd(),
                    map: new (vS || gS)(),
                    string: new Kd(),
                });
        }
        Yd.exports = hS;
    });
    var Zd = c((SW, Qd) => {
        function ES(e) {
            var t = typeof e;
            return t == "string" ||
                t == "number" ||
                t == "symbol" ||
                t == "boolean"
                ? e !== "__proto__"
                : e === null;
        }
        Qd.exports = ES;
    });
    var Pr = c((CW, Jd) => {
        var yS = Zd();
        function mS(e, t) {
            var r = e.__data__;
            return yS(t) ? r[typeof t == "string" ? "string" : "hash"] : r.map;
        }
        Jd.exports = mS;
    });
    var tp = c((RW, ep) => {
        var _S = Pr();
        function bS(e) {
            var t = _S(this, e).delete(e);
            return (this.size -= t ? 1 : 0), t;
        }
        ep.exports = bS;
    });
    var np = c((LW, rp) => {
        var TS = Pr();
        function IS(e) {
            return TS(this, e).get(e);
        }
        rp.exports = IS;
    });
    var op = c((NW, ip) => {
        var OS = Pr();
        function wS(e) {
            return OS(this, e).has(e);
        }
        ip.exports = wS;
    });
    var sp = c((PW, ap) => {
        var AS = Pr();
        function xS(e, t) {
            var r = AS(this, e),
                n = r.size;
            return r.set(e, t), (this.size += r.size == n ? 0 : 1), this;
        }
        ap.exports = xS;
    });
    var Pn = c((qW, up) => {
        var SS = $d(),
            CS = tp(),
            RS = np(),
            LS = op(),
            NS = sp();
        function Qt(e) {
            var t = -1,
                r = e == null ? 0 : e.length;
            for (this.clear(); ++t < r; ) {
                var n = e[t];
                this.set(n[0], n[1]);
            }
        }
        Qt.prototype.clear = SS;
        Qt.prototype.delete = CS;
        Qt.prototype.get = RS;
        Qt.prototype.has = LS;
        Qt.prototype.set = NS;
        up.exports = Qt;
    });
    var lp = c((FW, cp) => {
        var PS = Lr(),
            qS = Nn(),
            FS = Pn(),
            MS = 200;
        function DS(e, t) {
            var r = this.__data__;
            if (r instanceof PS) {
                var n = r.__data__;
                if (!qS || n.length < MS - 1)
                    return n.push([e, t]), (this.size = ++r.size), this;
                r = this.__data__ = new FS(n);
            }
            return r.set(e, t), (this.size = r.size), this;
        }
        cp.exports = DS;
    });
    var Qo = c((MW, fp) => {
        var GS = Lr(),
            kS = pd(),
            US = vd(),
            VS = Ed(),
            BS = md(),
            WS = lp();
        function Zt(e) {
            var t = (this.__data__ = new GS(e));
            this.size = t.size;
        }
        Zt.prototype.clear = kS;
        Zt.prototype.delete = US;
        Zt.prototype.get = VS;
        Zt.prototype.has = BS;
        Zt.prototype.set = WS;
        fp.exports = Zt;
    });
    var pp = c((DW, dp) => {
        var HS = "__lodash_hash_undefined__";
        function XS(e) {
            return this.__data__.set(e, HS), this;
        }
        dp.exports = XS;
    });
    var vp = c((GW, gp) => {
        function jS(e) {
            return this.__data__.has(e);
        }
        gp.exports = jS;
    });
    var Ep = c((kW, hp) => {
        var zS = Pn(),
            KS = pp(),
            YS = vp();
        function qn(e) {
            var t = -1,
                r = e == null ? 0 : e.length;
            for (this.__data__ = new zS(); ++t < r; ) this.add(e[t]);
        }
        qn.prototype.add = qn.prototype.push = KS;
        qn.prototype.has = YS;
        hp.exports = qn;
    });
    var mp = c((UW, yp) => {
        function $S(e, t) {
            for (var r = -1, n = e == null ? 0 : e.length; ++r < n; )
                if (t(e[r], r, e)) return !0;
            return !1;
        }
        yp.exports = $S;
    });
    var bp = c((VW, _p) => {
        function QS(e, t) {
            return e.has(t);
        }
        _p.exports = QS;
    });
    var Zo = c((BW, Tp) => {
        var ZS = Ep(),
            JS = mp(),
            eC = bp(),
            tC = 1,
            rC = 2;
        function nC(e, t, r, n, i, o) {
            var a = r & tC,
                s = e.length,
                u = t.length;
            if (s != u && !(a && u > s)) return !1;
            var d = o.get(e),
                h = o.get(t);
            if (d && h) return d == t && h == e;
            var v = -1,
                g = !0,
                b = r & rC ? new ZS() : void 0;
            for (o.set(e, t), o.set(t, e); ++v < s; ) {
                var O = e[v],
                    T = t[v];
                if (n) var S = a ? n(T, O, v, t, e, o) : n(O, T, v, e, t, o);
                if (S !== void 0) {
                    if (S) continue;
                    g = !1;
                    break;
                }
                if (b) {
                    if (
                        !JS(t, function (_, N) {
                            if (!eC(b, N) && (O === _ || i(O, _, r, n, o)))
                                return b.push(N);
                        })
                    ) {
                        g = !1;
                        break;
                    }
                } else if (!(O === T || i(O, T, r, n, o))) {
                    g = !1;
                    break;
                }
            }
            return o.delete(e), o.delete(t), g;
        }
        Tp.exports = nC;
    });
    var Op = c((WW, Ip) => {
        var iC = ze(),
            oC = iC.Uint8Array;
        Ip.exports = oC;
    });
    var Ap = c((HW, wp) => {
        function aC(e) {
            var t = -1,
                r = Array(e.size);
            return (
                e.forEach(function (n, i) {
                    r[++t] = [i, n];
                }),
                r
            );
        }
        wp.exports = aC;
    });
    var Sp = c((XW, xp) => {
        function sC(e) {
            var t = -1,
                r = Array(e.size);
            return (
                e.forEach(function (n) {
                    r[++t] = n;
                }),
                r
            );
        }
        xp.exports = sC;
    });
    var Pp = c((jW, Np) => {
        var Cp = Xt(),
            Rp = Op(),
            uC = Ln(),
            cC = Zo(),
            lC = Ap(),
            fC = Sp(),
            dC = 1,
            pC = 2,
            gC = "[object Boolean]",
            vC = "[object Date]",
            hC = "[object Error]",
            EC = "[object Map]",
            yC = "[object Number]",
            mC = "[object RegExp]",
            _C = "[object Set]",
            bC = "[object String]",
            TC = "[object Symbol]",
            IC = "[object ArrayBuffer]",
            OC = "[object DataView]",
            Lp = Cp ? Cp.prototype : void 0,
            Jo = Lp ? Lp.valueOf : void 0;
        function wC(e, t, r, n, i, o, a) {
            switch (r) {
                case OC:
                    if (
                        e.byteLength != t.byteLength ||
                        e.byteOffset != t.byteOffset
                    )
                        return !1;
                    (e = e.buffer), (t = t.buffer);
                case IC:
                    return !(
                        e.byteLength != t.byteLength || !o(new Rp(e), new Rp(t))
                    );
                case gC:
                case vC:
                case yC:
                    return uC(+e, +t);
                case hC:
                    return e.name == t.name && e.message == t.message;
                case mC:
                case bC:
                    return e == t + "";
                case EC:
                    var s = lC;
                case _C:
                    var u = n & dC;
                    if ((s || (s = fC), e.size != t.size && !u)) return !1;
                    var d = a.get(e);
                    if (d) return d == t;
                    (n |= pC), a.set(e, t);
                    var h = cC(s(e), s(t), n, i, o, a);
                    return a.delete(e), h;
                case TC:
                    if (Jo) return Jo.call(e) == Jo.call(t);
            }
            return !1;
        }
        Np.exports = wC;
    });
    var Fn = c((zW, qp) => {
        function AC(e, t) {
            for (var r = -1, n = t.length, i = e.length; ++r < n; )
                e[i + r] = t[r];
            return e;
        }
        qp.exports = AC;
    });
    var be = c((KW, Fp) => {
        var xC = Array.isArray;
        Fp.exports = xC;
    });
    var ea = c((YW, Mp) => {
        var SC = Fn(),
            CC = be();
        function RC(e, t, r) {
            var n = t(e);
            return CC(e) ? n : SC(n, r(e));
        }
        Mp.exports = RC;
    });
    var Gp = c(($W, Dp) => {
        function LC(e, t) {
            for (
                var r = -1, n = e == null ? 0 : e.length, i = 0, o = [];
                ++r < n;

            ) {
                var a = e[r];
                t(a, r, e) && (o[i++] = a);
            }
            return o;
        }
        Dp.exports = LC;
    });
    var ta = c((QW, kp) => {
        function NC() {
            return [];
        }
        kp.exports = NC;
    });
    var ra = c((ZW, Vp) => {
        var PC = Gp(),
            qC = ta(),
            FC = Object.prototype,
            MC = FC.propertyIsEnumerable,
            Up = Object.getOwnPropertySymbols,
            DC = Up
                ? function (e) {
                      return e == null
                          ? []
                          : ((e = Object(e)),
                            PC(Up(e), function (t) {
                                return MC.call(e, t);
                            }));
                  }
                : qC;
        Vp.exports = DC;
    });
    var Wp = c((JW, Bp) => {
        function GC(e, t) {
            for (var r = -1, n = Array(e); ++r < e; ) n[r] = t(r);
            return n;
        }
        Bp.exports = GC;
    });
    var Xp = c((eH, Hp) => {
        var kC = bt(),
            UC = dt(),
            VC = "[object Arguments]";
        function BC(e) {
            return UC(e) && kC(e) == VC;
        }
        Hp.exports = BC;
    });
    var qr = c((tH, Kp) => {
        var jp = Xp(),
            WC = dt(),
            zp = Object.prototype,
            HC = zp.hasOwnProperty,
            XC = zp.propertyIsEnumerable,
            jC = jp(
                (function () {
                    return arguments;
                })()
            )
                ? jp
                : function (e) {
                      return (
                          WC(e) && HC.call(e, "callee") && !XC.call(e, "callee")
                      );
                  };
        Kp.exports = jC;
    });
    var $p = c((rH, Yp) => {
        function zC() {
            return !1;
        }
        Yp.exports = zC;
    });
    var Mn = c((Fr, Jt) => {
        var KC = ze(),
            YC = $p(),
            Jp = typeof Fr == "object" && Fr && !Fr.nodeType && Fr,
            Qp = Jp && typeof Jt == "object" && Jt && !Jt.nodeType && Jt,
            $C = Qp && Qp.exports === Jp,
            Zp = $C ? KC.Buffer : void 0,
            QC = Zp ? Zp.isBuffer : void 0,
            ZC = QC || YC;
        Jt.exports = ZC;
    });
    var Dn = c((nH, eg) => {
        var JC = 9007199254740991,
            eR = /^(?:0|[1-9]\d*)$/;
        function tR(e, t) {
            var r = typeof e;
            return (
                (t = t ?? JC),
                !!t &&
                    (r == "number" || (r != "symbol" && eR.test(e))) &&
                    e > -1 &&
                    e % 1 == 0 &&
                    e < t
            );
        }
        eg.exports = tR;
    });
    var Gn = c((iH, tg) => {
        var rR = 9007199254740991;
        function nR(e) {
            return typeof e == "number" && e > -1 && e % 1 == 0 && e <= rR;
        }
        tg.exports = nR;
    });
    var ng = c((oH, rg) => {
        var iR = bt(),
            oR = Gn(),
            aR = dt(),
            sR = "[object Arguments]",
            uR = "[object Array]",
            cR = "[object Boolean]",
            lR = "[object Date]",
            fR = "[object Error]",
            dR = "[object Function]",
            pR = "[object Map]",
            gR = "[object Number]",
            vR = "[object Object]",
            hR = "[object RegExp]",
            ER = "[object Set]",
            yR = "[object String]",
            mR = "[object WeakMap]",
            _R = "[object ArrayBuffer]",
            bR = "[object DataView]",
            TR = "[object Float32Array]",
            IR = "[object Float64Array]",
            OR = "[object Int8Array]",
            wR = "[object Int16Array]",
            AR = "[object Int32Array]",
            xR = "[object Uint8Array]",
            SR = "[object Uint8ClampedArray]",
            CR = "[object Uint16Array]",
            RR = "[object Uint32Array]",
            de = {};
        de[TR] =
            de[IR] =
            de[OR] =
            de[wR] =
            de[AR] =
            de[xR] =
            de[SR] =
            de[CR] =
            de[RR] =
                !0;
        de[sR] =
            de[uR] =
            de[_R] =
            de[cR] =
            de[bR] =
            de[lR] =
            de[fR] =
            de[dR] =
            de[pR] =
            de[gR] =
            de[vR] =
            de[hR] =
            de[ER] =
            de[yR] =
            de[mR] =
                !1;
        function LR(e) {
            return aR(e) && oR(e.length) && !!de[iR(e)];
        }
        rg.exports = LR;
    });
    var og = c((aH, ig) => {
        function NR(e) {
            return function (t) {
                return e(t);
            };
        }
        ig.exports = NR;
    });
    var sg = c((Mr, er) => {
        var PR = So(),
            ag = typeof Mr == "object" && Mr && !Mr.nodeType && Mr,
            Dr = ag && typeof er == "object" && er && !er.nodeType && er,
            qR = Dr && Dr.exports === ag,
            na = qR && PR.process,
            FR = (function () {
                try {
                    var e = Dr && Dr.require && Dr.require("util").types;
                    return e || (na && na.binding && na.binding("util"));
                } catch {}
            })();
        er.exports = FR;
    });
    var kn = c((sH, lg) => {
        var MR = ng(),
            DR = og(),
            ug = sg(),
            cg = ug && ug.isTypedArray,
            GR = cg ? DR(cg) : MR;
        lg.exports = GR;
    });
    var ia = c((uH, fg) => {
        var kR = Wp(),
            UR = qr(),
            VR = be(),
            BR = Mn(),
            WR = Dn(),
            HR = kn(),
            XR = Object.prototype,
            jR = XR.hasOwnProperty;
        function zR(e, t) {
            var r = VR(e),
                n = !r && UR(e),
                i = !r && !n && BR(e),
                o = !r && !n && !i && HR(e),
                a = r || n || i || o,
                s = a ? kR(e.length, String) : [],
                u = s.length;
            for (var d in e)
                (t || jR.call(e, d)) &&
                    !(
                        a &&
                        (d == "length" ||
                            (i && (d == "offset" || d == "parent")) ||
                            (o &&
                                (d == "buffer" ||
                                    d == "byteLength" ||
                                    d == "byteOffset")) ||
                            WR(d, u))
                    ) &&
                    s.push(d);
            return s;
        }
        fg.exports = zR;
    });
    var Un = c((cH, dg) => {
        var KR = Object.prototype;
        function YR(e) {
            var t = e && e.constructor,
                r = (typeof t == "function" && t.prototype) || KR;
            return e === r;
        }
        dg.exports = YR;
    });
    var gg = c((lH, pg) => {
        var $R = Co(),
            QR = $R(Object.keys, Object);
        pg.exports = QR;
    });
    var Vn = c((fH, vg) => {
        var ZR = Un(),
            JR = gg(),
            eL = Object.prototype,
            tL = eL.hasOwnProperty;
        function rL(e) {
            if (!ZR(e)) return JR(e);
            var t = [];
            for (var r in Object(e))
                tL.call(e, r) && r != "constructor" && t.push(r);
            return t;
        }
        vg.exports = rL;
    });
    var Lt = c((dH, hg) => {
        var nL = Ko(),
            iL = Gn();
        function oL(e) {
            return e != null && iL(e.length) && !nL(e);
        }
        hg.exports = oL;
    });
    var Gr = c((pH, Eg) => {
        var aL = ia(),
            sL = Vn(),
            uL = Lt();
        function cL(e) {
            return uL(e) ? aL(e) : sL(e);
        }
        Eg.exports = cL;
    });
    var mg = c((gH, yg) => {
        var lL = ea(),
            fL = ra(),
            dL = Gr();
        function pL(e) {
            return lL(e, dL, fL);
        }
        yg.exports = pL;
    });
    var Tg = c((vH, bg) => {
        var _g = mg(),
            gL = 1,
            vL = Object.prototype,
            hL = vL.hasOwnProperty;
        function EL(e, t, r, n, i, o) {
            var a = r & gL,
                s = _g(e),
                u = s.length,
                d = _g(t),
                h = d.length;
            if (u != h && !a) return !1;
            for (var v = u; v--; ) {
                var g = s[v];
                if (!(a ? g in t : hL.call(t, g))) return !1;
            }
            var b = o.get(e),
                O = o.get(t);
            if (b && O) return b == t && O == e;
            var T = !0;
            o.set(e, t), o.set(t, e);
            for (var S = a; ++v < u; ) {
                g = s[v];
                var _ = e[g],
                    N = t[g];
                if (n) var R = a ? n(N, _, g, t, e, o) : n(_, N, g, e, t, o);
                if (!(R === void 0 ? _ === N || i(_, N, r, n, o) : R)) {
                    T = !1;
                    break;
                }
                S || (S = g == "constructor");
            }
            if (T && !S) {
                var q = e.constructor,
                    F = t.constructor;
                q != F &&
                    "constructor" in e &&
                    "constructor" in t &&
                    !(
                        typeof q == "function" &&
                        q instanceof q &&
                        typeof F == "function" &&
                        F instanceof F
                    ) &&
                    (T = !1);
            }
            return o.delete(e), o.delete(t), T;
        }
        bg.exports = EL;
    });
    var Og = c((hH, Ig) => {
        var yL = Tt(),
            mL = ze(),
            _L = yL(mL, "DataView");
        Ig.exports = _L;
    });
    var Ag = c((EH, wg) => {
        var bL = Tt(),
            TL = ze(),
            IL = bL(TL, "Promise");
        wg.exports = IL;
    });
    var Sg = c((yH, xg) => {
        var OL = Tt(),
            wL = ze(),
            AL = OL(wL, "Set");
        xg.exports = AL;
    });
    var oa = c((mH, Cg) => {
        var xL = Tt(),
            SL = ze(),
            CL = xL(SL, "WeakMap");
        Cg.exports = CL;
    });
    var Bn = c((_H, Mg) => {
        var aa = Og(),
            sa = Nn(),
            ua = Ag(),
            ca = Sg(),
            la = oa(),
            Fg = bt(),
            tr = $o(),
            Rg = "[object Map]",
            RL = "[object Object]",
            Lg = "[object Promise]",
            Ng = "[object Set]",
            Pg = "[object WeakMap]",
            qg = "[object DataView]",
            LL = tr(aa),
            NL = tr(sa),
            PL = tr(ua),
            qL = tr(ca),
            FL = tr(la),
            Nt = Fg;
        ((aa && Nt(new aa(new ArrayBuffer(1))) != qg) ||
            (sa && Nt(new sa()) != Rg) ||
            (ua && Nt(ua.resolve()) != Lg) ||
            (ca && Nt(new ca()) != Ng) ||
            (la && Nt(new la()) != Pg)) &&
            (Nt = function (e) {
                var t = Fg(e),
                    r = t == RL ? e.constructor : void 0,
                    n = r ? tr(r) : "";
                if (n)
                    switch (n) {
                        case LL:
                            return qg;
                        case NL:
                            return Rg;
                        case PL:
                            return Lg;
                        case qL:
                            return Ng;
                        case FL:
                            return Pg;
                    }
                return t;
            });
        Mg.exports = Nt;
    });
    var Hg = c((bH, Wg) => {
        var fa = Qo(),
            ML = Zo(),
            DL = Pp(),
            GL = Tg(),
            Dg = Bn(),
            Gg = be(),
            kg = Mn(),
            kL = kn(),
            UL = 1,
            Ug = "[object Arguments]",
            Vg = "[object Array]",
            Wn = "[object Object]",
            VL = Object.prototype,
            Bg = VL.hasOwnProperty;
        function BL(e, t, r, n, i, o) {
            var a = Gg(e),
                s = Gg(t),
                u = a ? Vg : Dg(e),
                d = s ? Vg : Dg(t);
            (u = u == Ug ? Wn : u), (d = d == Ug ? Wn : d);
            var h = u == Wn,
                v = d == Wn,
                g = u == d;
            if (g && kg(e)) {
                if (!kg(t)) return !1;
                (a = !0), (h = !1);
            }
            if (g && !h)
                return (
                    o || (o = new fa()),
                    a || kL(e) ? ML(e, t, r, n, i, o) : DL(e, t, u, r, n, i, o)
                );
            if (!(r & UL)) {
                var b = h && Bg.call(e, "__wrapped__"),
                    O = v && Bg.call(t, "__wrapped__");
                if (b || O) {
                    var T = b ? e.value() : e,
                        S = O ? t.value() : t;
                    return o || (o = new fa()), i(T, S, r, n, o);
                }
            }
            return g ? (o || (o = new fa()), GL(e, t, r, n, i, o)) : !1;
        }
        Wg.exports = BL;
    });
    var da = c((TH, zg) => {
        var WL = Hg(),
            Xg = dt();
        function jg(e, t, r, n, i) {
            return e === t
                ? !0
                : e == null || t == null || (!Xg(e) && !Xg(t))
                ? e !== e && t !== t
                : WL(e, t, r, n, jg, i);
        }
        zg.exports = jg;
    });
    var Yg = c((IH, Kg) => {
        var HL = Qo(),
            XL = da(),
            jL = 1,
            zL = 2;
        function KL(e, t, r, n) {
            var i = r.length,
                o = i,
                a = !n;
            if (e == null) return !o;
            for (e = Object(e); i--; ) {
                var s = r[i];
                if (a && s[2] ? s[1] !== e[s[0]] : !(s[0] in e)) return !1;
            }
            for (; ++i < o; ) {
                s = r[i];
                var u = s[0],
                    d = e[u],
                    h = s[1];
                if (a && s[2]) {
                    if (d === void 0 && !(u in e)) return !1;
                } else {
                    var v = new HL();
                    if (n) var g = n(d, h, u, e, t, v);
                    if (!(g === void 0 ? XL(h, d, jL | zL, n, v) : g))
                        return !1;
                }
            }
            return !0;
        }
        Kg.exports = KL;
    });
    var pa = c((OH, $g) => {
        var YL = ot();
        function $L(e) {
            return e === e && !YL(e);
        }
        $g.exports = $L;
    });
    var Zg = c((wH, Qg) => {
        var QL = pa(),
            ZL = Gr();
        function JL(e) {
            for (var t = ZL(e), r = t.length; r--; ) {
                var n = t[r],
                    i = e[n];
                t[r] = [n, i, QL(i)];
            }
            return t;
        }
        Qg.exports = JL;
    });
    var ga = c((AH, Jg) => {
        function eN(e, t) {
            return function (r) {
                return r == null
                    ? !1
                    : r[e] === t && (t !== void 0 || e in Object(r));
            };
        }
        Jg.exports = eN;
    });
    var tv = c((xH, ev) => {
        var tN = Yg(),
            rN = Zg(),
            nN = ga();
        function iN(e) {
            var t = rN(e);
            return t.length == 1 && t[0][2]
                ? nN(t[0][0], t[0][1])
                : function (r) {
                      return r === e || tN(r, e, t);
                  };
        }
        ev.exports = iN;
    });
    var kr = c((SH, rv) => {
        var oN = bt(),
            aN = dt(),
            sN = "[object Symbol]";
        function uN(e) {
            return typeof e == "symbol" || (aN(e) && oN(e) == sN);
        }
        rv.exports = uN;
    });
    var Hn = c((CH, nv) => {
        var cN = be(),
            lN = kr(),
            fN = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
            dN = /^\w*$/;
        function pN(e, t) {
            if (cN(e)) return !1;
            var r = typeof e;
            return r == "number" ||
                r == "symbol" ||
                r == "boolean" ||
                e == null ||
                lN(e)
                ? !0
                : dN.test(e) || !fN.test(e) || (t != null && e in Object(t));
        }
        nv.exports = pN;
    });
    var av = c((RH, ov) => {
        var iv = Pn(),
            gN = "Expected a function";
        function va(e, t) {
            if (typeof e != "function" || (t != null && typeof t != "function"))
                throw new TypeError(gN);
            var r = function () {
                var n = arguments,
                    i = t ? t.apply(this, n) : n[0],
                    o = r.cache;
                if (o.has(i)) return o.get(i);
                var a = e.apply(this, n);
                return (r.cache = o.set(i, a) || o), a;
            };
            return (r.cache = new (va.Cache || iv)()), r;
        }
        va.Cache = iv;
        ov.exports = va;
    });
    var uv = c((LH, sv) => {
        var vN = av(),
            hN = 500;
        function EN(e) {
            var t = vN(e, function (n) {
                    return r.size === hN && r.clear(), n;
                }),
                r = t.cache;
            return t;
        }
        sv.exports = EN;
    });
    var lv = c((NH, cv) => {
        var yN = uv(),
            mN =
                /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
            _N = /\\(\\)?/g,
            bN = yN(function (e) {
                var t = [];
                return (
                    e.charCodeAt(0) === 46 && t.push(""),
                    e.replace(mN, function (r, n, i, o) {
                        t.push(i ? o.replace(_N, "$1") : n || r);
                    }),
                    t
                );
            });
        cv.exports = bN;
    });
    var ha = c((PH, fv) => {
        function TN(e, t) {
            for (
                var r = -1, n = e == null ? 0 : e.length, i = Array(n);
                ++r < n;

            )
                i[r] = t(e[r], r, e);
            return i;
        }
        fv.exports = TN;
    });
    var Ev = c((qH, hv) => {
        var dv = Xt(),
            IN = ha(),
            ON = be(),
            wN = kr(),
            AN = 1 / 0,
            pv = dv ? dv.prototype : void 0,
            gv = pv ? pv.toString : void 0;
        function vv(e) {
            if (typeof e == "string") return e;
            if (ON(e)) return IN(e, vv) + "";
            if (wN(e)) return gv ? gv.call(e) : "";
            var t = e + "";
            return t == "0" && 1 / e == -AN ? "-0" : t;
        }
        hv.exports = vv;
    });
    var mv = c((FH, yv) => {
        var xN = Ev();
        function SN(e) {
            return e == null ? "" : xN(e);
        }
        yv.exports = SN;
    });
    var Ur = c((MH, _v) => {
        var CN = be(),
            RN = Hn(),
            LN = lv(),
            NN = mv();
        function PN(e, t) {
            return CN(e) ? e : RN(e, t) ? [e] : LN(NN(e));
        }
        _v.exports = PN;
    });
    var rr = c((DH, bv) => {
        var qN = kr(),
            FN = 1 / 0;
        function MN(e) {
            if (typeof e == "string" || qN(e)) return e;
            var t = e + "";
            return t == "0" && 1 / e == -FN ? "-0" : t;
        }
        bv.exports = MN;
    });
    var Xn = c((GH, Tv) => {
        var DN = Ur(),
            GN = rr();
        function kN(e, t) {
            t = DN(t, e);
            for (var r = 0, n = t.length; e != null && r < n; )
                e = e[GN(t[r++])];
            return r && r == n ? e : void 0;
        }
        Tv.exports = kN;
    });
    var jn = c((kH, Iv) => {
        var UN = Xn();
        function VN(e, t, r) {
            var n = e == null ? void 0 : UN(e, t);
            return n === void 0 ? r : n;
        }
        Iv.exports = VN;
    });
    var wv = c((UH, Ov) => {
        function BN(e, t) {
            return e != null && t in Object(e);
        }
        Ov.exports = BN;
    });
    var xv = c((VH, Av) => {
        var WN = Ur(),
            HN = qr(),
            XN = be(),
            jN = Dn(),
            zN = Gn(),
            KN = rr();
        function YN(e, t, r) {
            t = WN(t, e);
            for (var n = -1, i = t.length, o = !1; ++n < i; ) {
                var a = KN(t[n]);
                if (!(o = e != null && r(e, a))) break;
                e = e[a];
            }
            return o || ++n != i
                ? o
                : ((i = e == null ? 0 : e.length),
                  !!i && zN(i) && jN(a, i) && (XN(e) || HN(e)));
        }
        Av.exports = YN;
    });
    var Cv = c((BH, Sv) => {
        var $N = wv(),
            QN = xv();
        function ZN(e, t) {
            return e != null && QN(e, t, $N);
        }
        Sv.exports = ZN;
    });
    var Lv = c((WH, Rv) => {
        var JN = da(),
            eP = jn(),
            tP = Cv(),
            rP = Hn(),
            nP = pa(),
            iP = ga(),
            oP = rr(),
            aP = 1,
            sP = 2;
        function uP(e, t) {
            return rP(e) && nP(t)
                ? iP(oP(e), t)
                : function (r) {
                      var n = eP(r, e);
                      return n === void 0 && n === t
                          ? tP(r, e)
                          : JN(t, n, aP | sP);
                  };
        }
        Rv.exports = uP;
    });
    var zn = c((HH, Nv) => {
        function cP(e) {
            return e;
        }
        Nv.exports = cP;
    });
    var Ea = c((XH, Pv) => {
        function lP(e) {
            return function (t) {
                return t?.[e];
            };
        }
        Pv.exports = lP;
    });
    var Fv = c((jH, qv) => {
        var fP = Xn();
        function dP(e) {
            return function (t) {
                return fP(t, e);
            };
        }
        qv.exports = dP;
    });
    var Dv = c((zH, Mv) => {
        var pP = Ea(),
            gP = Fv(),
            vP = Hn(),
            hP = rr();
        function EP(e) {
            return vP(e) ? pP(hP(e)) : gP(e);
        }
        Mv.exports = EP;
    });
    var It = c((KH, Gv) => {
        var yP = tv(),
            mP = Lv(),
            _P = zn(),
            bP = be(),
            TP = Dv();
        function IP(e) {
            return typeof e == "function"
                ? e
                : e == null
                ? _P
                : typeof e == "object"
                ? bP(e)
                    ? mP(e[0], e[1])
                    : yP(e)
                : TP(e);
        }
        Gv.exports = IP;
    });
    var ya = c((YH, kv) => {
        var OP = It(),
            wP = Lt(),
            AP = Gr();
        function xP(e) {
            return function (t, r, n) {
                var i = Object(t);
                if (!wP(t)) {
                    var o = OP(r, 3);
                    (t = AP(t)),
                        (r = function (s) {
                            return o(i[s], s, i);
                        });
                }
                var a = e(t, r, n);
                return a > -1 ? i[o ? t[a] : a] : void 0;
            };
        }
        kv.exports = xP;
    });
    var ma = c(($H, Uv) => {
        function SP(e, t, r, n) {
            for (var i = e.length, o = r + (n ? 1 : -1); n ? o-- : ++o < i; )
                if (t(e[o], o, e)) return o;
            return -1;
        }
        Uv.exports = SP;
    });
    var Bv = c((QH, Vv) => {
        var CP = /\s/;
        function RP(e) {
            for (var t = e.length; t-- && CP.test(e.charAt(t)); );
            return t;
        }
        Vv.exports = RP;
    });
    var Hv = c((ZH, Wv) => {
        var LP = Bv(),
            NP = /^\s+/;
        function PP(e) {
            return e && e.slice(0, LP(e) + 1).replace(NP, "");
        }
        Wv.exports = PP;
    });
    var Kn = c((JH, zv) => {
        var qP = Hv(),
            Xv = ot(),
            FP = kr(),
            jv = 0 / 0,
            MP = /^[-+]0x[0-9a-f]+$/i,
            DP = /^0b[01]+$/i,
            GP = /^0o[0-7]+$/i,
            kP = parseInt;
        function UP(e) {
            if (typeof e == "number") return e;
            if (FP(e)) return jv;
            if (Xv(e)) {
                var t = typeof e.valueOf == "function" ? e.valueOf() : e;
                e = Xv(t) ? t + "" : t;
            }
            if (typeof e != "string") return e === 0 ? e : +e;
            e = qP(e);
            var r = DP.test(e);
            return r || GP.test(e)
                ? kP(e.slice(2), r ? 2 : 8)
                : MP.test(e)
                ? jv
                : +e;
        }
        zv.exports = UP;
    });
    var $v = c((eX, Yv) => {
        var VP = Kn(),
            Kv = 1 / 0,
            BP = 17976931348623157e292;
        function WP(e) {
            if (!e) return e === 0 ? e : 0;
            if (((e = VP(e)), e === Kv || e === -Kv)) {
                var t = e < 0 ? -1 : 1;
                return t * BP;
            }
            return e === e ? e : 0;
        }
        Yv.exports = WP;
    });
    var _a = c((tX, Qv) => {
        var HP = $v();
        function XP(e) {
            var t = HP(e),
                r = t % 1;
            return t === t ? (r ? t - r : t) : 0;
        }
        Qv.exports = XP;
    });
    var Jv = c((rX, Zv) => {
        var jP = ma(),
            zP = It(),
            KP = _a(),
            YP = Math.max;
        function $P(e, t, r) {
            var n = e == null ? 0 : e.length;
            if (!n) return -1;
            var i = r == null ? 0 : KP(r);
            return i < 0 && (i = YP(n + i, 0)), jP(e, zP(t, 3), i);
        }
        Zv.exports = $P;
    });
    var ba = c((nX, eh) => {
        var QP = ya(),
            ZP = Jv(),
            JP = QP(ZP);
        eh.exports = JP;
    });
    var nh = {};
    Pe(nh, {
        ELEMENT_MATCHES: () => eq,
        FLEX_PREFIXED: () => Ta,
        IS_BROWSER_ENV: () => Ye,
        TRANSFORM_PREFIXED: () => Ot,
        TRANSFORM_STYLE_PREFIXED: () => $n,
        withBrowser: () => Yn,
    });
    var rh,
        Ye,
        Yn,
        eq,
        Ta,
        Ot,
        th,
        $n,
        Qn = pe(() => {
            "use strict";
            (rh = ae(ba())),
                (Ye = typeof window < "u"),
                (Yn = (e, t) => (Ye ? e() : t)),
                (eq = Yn(() =>
                    (0, rh.default)(
                        [
                            "matches",
                            "matchesSelector",
                            "mozMatchesSelector",
                            "msMatchesSelector",
                            "oMatchesSelector",
                            "webkitMatchesSelector",
                        ],
                        (e) => e in Element.prototype
                    )
                )),
                (Ta = Yn(() => {
                    let e = document.createElement("i"),
                        t = [
                            "flex",
                            "-webkit-flex",
                            "-ms-flexbox",
                            "-moz-box",
                            "-webkit-box",
                        ],
                        r = "";
                    try {
                        let { length: n } = t;
                        for (let i = 0; i < n; i++) {
                            let o = t[i];
                            if (((e.style.display = o), e.style.display === o))
                                return o;
                        }
                        return r;
                    } catch {
                        return r;
                    }
                }, "flex")),
                (Ot = Yn(() => {
                    let e = document.createElement("i");
                    if (e.style.transform == null) {
                        let t = ["Webkit", "Moz", "ms"],
                            r = "Transform",
                            { length: n } = t;
                        for (let i = 0; i < n; i++) {
                            let o = t[i] + r;
                            if (e.style[o] !== void 0) return o;
                        }
                    }
                    return "transform";
                }, "transform")),
                (th = Ot.split("transform")[0]),
                ($n = th ? th + "TransformStyle" : "transformStyle");
        });
    var Ia = c((iX, uh) => {
        var tq = 4,
            rq = 0.001,
            nq = 1e-7,
            iq = 10,
            Vr = 11,
            Zn = 1 / (Vr - 1),
            oq = typeof Float32Array == "function";
        function ih(e, t) {
            return 1 - 3 * t + 3 * e;
        }
        function oh(e, t) {
            return 3 * t - 6 * e;
        }
        function ah(e) {
            return 3 * e;
        }
        function Jn(e, t, r) {
            return ((ih(t, r) * e + oh(t, r)) * e + ah(t)) * e;
        }
        function sh(e, t, r) {
            return 3 * ih(t, r) * e * e + 2 * oh(t, r) * e + ah(t);
        }
        function aq(e, t, r, n, i) {
            var o,
                a,
                s = 0;
            do
                (a = t + (r - t) / 2),
                    (o = Jn(a, n, i) - e),
                    o > 0 ? (r = a) : (t = a);
            while (Math.abs(o) > nq && ++s < iq);
            return a;
        }
        function sq(e, t, r, n) {
            for (var i = 0; i < tq; ++i) {
                var o = sh(t, r, n);
                if (o === 0) return t;
                var a = Jn(t, r, n) - e;
                t -= a / o;
            }
            return t;
        }
        uh.exports = function (t, r, n, i) {
            if (!(0 <= t && t <= 1 && 0 <= n && n <= 1))
                throw new Error("bezier x values must be in [0, 1] range");
            var o = oq ? new Float32Array(Vr) : new Array(Vr);
            if (t !== r || n !== i)
                for (var a = 0; a < Vr; ++a) o[a] = Jn(a * Zn, t, n);
            function s(u) {
                for (var d = 0, h = 1, v = Vr - 1; h !== v && o[h] <= u; ++h)
                    d += Zn;
                --h;
                var g = (u - o[h]) / (o[h + 1] - o[h]),
                    b = d + g * Zn,
                    O = sh(b, t, n);
                return O >= rq
                    ? sq(u, b, t, n)
                    : O === 0
                    ? b
                    : aq(u, d, d + Zn, t, n);
            }
            return function (d) {
                return t === r && n === i
                    ? d
                    : d === 0
                    ? 0
                    : d === 1
                    ? 1
                    : Jn(s(d), r, i);
            };
        };
    });
    var Wr = {};
    Pe(Wr, {
        bounce: () => Wq,
        bouncePast: () => Hq,
        ease: () => uq,
        easeIn: () => cq,
        easeInOut: () => fq,
        easeOut: () => lq,
        inBack: () => qq,
        inCirc: () => Rq,
        inCubic: () => vq,
        inElastic: () => Dq,
        inExpo: () => xq,
        inOutBack: () => Mq,
        inOutCirc: () => Nq,
        inOutCubic: () => Eq,
        inOutElastic: () => kq,
        inOutExpo: () => Cq,
        inOutQuad: () => gq,
        inOutQuart: () => _q,
        inOutQuint: () => Iq,
        inOutSine: () => Aq,
        inQuad: () => dq,
        inQuart: () => yq,
        inQuint: () => bq,
        inSine: () => Oq,
        outBack: () => Fq,
        outBounce: () => Pq,
        outCirc: () => Lq,
        outCubic: () => hq,
        outElastic: () => Gq,
        outExpo: () => Sq,
        outQuad: () => pq,
        outQuart: () => mq,
        outQuint: () => Tq,
        outSine: () => wq,
        swingFrom: () => Vq,
        swingFromTo: () => Uq,
        swingTo: () => Bq,
    });
    function dq(e) {
        return Math.pow(e, 2);
    }
    function pq(e) {
        return -(Math.pow(e - 1, 2) - 1);
    }
    function gq(e) {
        return (e /= 0.5) < 1
            ? 0.5 * Math.pow(e, 2)
            : -0.5 * ((e -= 2) * e - 2);
    }
    function vq(e) {
        return Math.pow(e, 3);
    }
    function hq(e) {
        return Math.pow(e - 1, 3) + 1;
    }
    function Eq(e) {
        return (e /= 0.5) < 1
            ? 0.5 * Math.pow(e, 3)
            : 0.5 * (Math.pow(e - 2, 3) + 2);
    }
    function yq(e) {
        return Math.pow(e, 4);
    }
    function mq(e) {
        return -(Math.pow(e - 1, 4) - 1);
    }
    function _q(e) {
        return (e /= 0.5) < 1
            ? 0.5 * Math.pow(e, 4)
            : -0.5 * ((e -= 2) * Math.pow(e, 3) - 2);
    }
    function bq(e) {
        return Math.pow(e, 5);
    }
    function Tq(e) {
        return Math.pow(e - 1, 5) + 1;
    }
    function Iq(e) {
        return (e /= 0.5) < 1
            ? 0.5 * Math.pow(e, 5)
            : 0.5 * (Math.pow(e - 2, 5) + 2);
    }
    function Oq(e) {
        return -Math.cos(e * (Math.PI / 2)) + 1;
    }
    function wq(e) {
        return Math.sin(e * (Math.PI / 2));
    }
    function Aq(e) {
        return -0.5 * (Math.cos(Math.PI * e) - 1);
    }
    function xq(e) {
        return e === 0 ? 0 : Math.pow(2, 10 * (e - 1));
    }
    function Sq(e) {
        return e === 1 ? 1 : -Math.pow(2, -10 * e) + 1;
    }
    function Cq(e) {
        return e === 0
            ? 0
            : e === 1
            ? 1
            : (e /= 0.5) < 1
            ? 0.5 * Math.pow(2, 10 * (e - 1))
            : 0.5 * (-Math.pow(2, -10 * --e) + 2);
    }
    function Rq(e) {
        return -(Math.sqrt(1 - e * e) - 1);
    }
    function Lq(e) {
        return Math.sqrt(1 - Math.pow(e - 1, 2));
    }
    function Nq(e) {
        return (e /= 0.5) < 1
            ? -0.5 * (Math.sqrt(1 - e * e) - 1)
            : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1);
    }
    function Pq(e) {
        return e < 1 / 2.75
            ? 7.5625 * e * e
            : e < 2 / 2.75
            ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75
            : e < 2.5 / 2.75
            ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375
            : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
    }
    function qq(e) {
        let t = pt;
        return e * e * ((t + 1) * e - t);
    }
    function Fq(e) {
        let t = pt;
        return (e -= 1) * e * ((t + 1) * e + t) + 1;
    }
    function Mq(e) {
        let t = pt;
        return (e /= 0.5) < 1
            ? 0.5 * (e * e * (((t *= 1.525) + 1) * e - t))
            : 0.5 * ((e -= 2) * e * (((t *= 1.525) + 1) * e + t) + 2);
    }
    function Dq(e) {
        let t = pt,
            r = 0,
            n = 1;
        return e === 0
            ? 0
            : e === 1
            ? 1
            : (r || (r = 0.3),
              n < 1
                  ? ((n = 1), (t = r / 4))
                  : (t = (r / (2 * Math.PI)) * Math.asin(1 / n)),
              -(
                  n *
                  Math.pow(2, 10 * (e -= 1)) *
                  Math.sin(((e - t) * (2 * Math.PI)) / r)
              ));
    }
    function Gq(e) {
        let t = pt,
            r = 0,
            n = 1;
        return e === 0
            ? 0
            : e === 1
            ? 1
            : (r || (r = 0.3),
              n < 1
                  ? ((n = 1), (t = r / 4))
                  : (t = (r / (2 * Math.PI)) * Math.asin(1 / n)),
              n *
                  Math.pow(2, -10 * e) *
                  Math.sin(((e - t) * (2 * Math.PI)) / r) +
                  1);
    }
    function kq(e) {
        let t = pt,
            r = 0,
            n = 1;
        return e === 0
            ? 0
            : (e /= 1 / 2) === 2
            ? 1
            : (r || (r = 0.3 * 1.5),
              n < 1
                  ? ((n = 1), (t = r / 4))
                  : (t = (r / (2 * Math.PI)) * Math.asin(1 / n)),
              e < 1
                  ? -0.5 *
                    (n *
                        Math.pow(2, 10 * (e -= 1)) *
                        Math.sin(((e - t) * (2 * Math.PI)) / r))
                  : n *
                        Math.pow(2, -10 * (e -= 1)) *
                        Math.sin(((e - t) * (2 * Math.PI)) / r) *
                        0.5 +
                    1);
    }
    function Uq(e) {
        let t = pt;
        return (e /= 0.5) < 1
            ? 0.5 * (e * e * (((t *= 1.525) + 1) * e - t))
            : 0.5 * ((e -= 2) * e * (((t *= 1.525) + 1) * e + t) + 2);
    }
    function Vq(e) {
        let t = pt;
        return e * e * ((t + 1) * e - t);
    }
    function Bq(e) {
        let t = pt;
        return (e -= 1) * e * ((t + 1) * e + t) + 1;
    }
    function Wq(e) {
        return e < 1 / 2.75
            ? 7.5625 * e * e
            : e < 2 / 2.75
            ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75
            : e < 2.5 / 2.75
            ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375
            : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
    }
    function Hq(e) {
        return e < 1 / 2.75
            ? 7.5625 * e * e
            : e < 2 / 2.75
            ? 2 - (7.5625 * (e -= 1.5 / 2.75) * e + 0.75)
            : e < 2.5 / 2.75
            ? 2 - (7.5625 * (e -= 2.25 / 2.75) * e + 0.9375)
            : 2 - (7.5625 * (e -= 2.625 / 2.75) * e + 0.984375);
    }
    var Br,
        pt,
        uq,
        cq,
        lq,
        fq,
        Oa = pe(() => {
            "use strict";
            (Br = ae(Ia())),
                (pt = 1.70158),
                (uq = (0, Br.default)(0.25, 0.1, 0.25, 1)),
                (cq = (0, Br.default)(0.42, 0, 1, 1)),
                (lq = (0, Br.default)(0, 0, 0.58, 1)),
                (fq = (0, Br.default)(0.42, 0, 0.58, 1));
        });
    var lh = {};
    Pe(lh, {
        applyEasing: () => jq,
        createBezierEasing: () => Xq,
        optimizeFloat: () => Hr,
    });
    function Hr(e, t = 5, r = 10) {
        let n = Math.pow(r, t),
            i = Number(Math.round(e * n) / n);
        return Math.abs(i) > 1e-4 ? i : 0;
    }
    function Xq(e) {
        return (0, ch.default)(...e);
    }
    function jq(e, t, r) {
        return t === 0
            ? 0
            : t === 1
            ? 1
            : Hr(r ? (t > 0 ? r(t) : t) : t > 0 && e && Wr[e] ? Wr[e](t) : t);
    }
    var ch,
        wa = pe(() => {
            "use strict";
            Oa();
            ch = ae(Ia());
        });
    var ph = {};
    Pe(ph, {
        createElementState: () => dh,
        ixElements: () => aF,
        mergeActionState: () => Aa,
    });
    function dh(e, t, r, n, i) {
        let o =
            r === zq
                ? (0, nr.getIn)(i, ["config", "target", "objectId"])
                : null;
        return (0, nr.mergeIn)(e, [n], { id: n, ref: t, refId: o, refType: r });
    }
    function Aa(e, t, r, n, i) {
        let o = uF(i);
        return (0, nr.mergeIn)(e, [t, oF, r], n, o);
    }
    function uF(e) {
        let { config: t } = e;
        return sF.reduce((r, n) => {
            let i = n[0],
                o = n[1],
                a = t[i],
                s = t[o];
            return a != null && s != null && (r[o] = s), r;
        }, {});
    }
    var nr,
        aX,
        zq,
        sX,
        Kq,
        Yq,
        $q,
        Qq,
        Zq,
        Jq,
        eF,
        tF,
        rF,
        nF,
        iF,
        fh,
        oF,
        aF,
        sF,
        gh = pe(() => {
            "use strict";
            nr = ae(Kt());
            Fe();
            ({
                HTML_ELEMENT: aX,
                PLAIN_OBJECT: zq,
                ABSTRACT_NODE: sX,
                CONFIG_X_VALUE: Kq,
                CONFIG_Y_VALUE: Yq,
                CONFIG_Z_VALUE: $q,
                CONFIG_VALUE: Qq,
                CONFIG_X_UNIT: Zq,
                CONFIG_Y_UNIT: Jq,
                CONFIG_Z_UNIT: eF,
                CONFIG_UNIT: tF,
            } = we),
                ({
                    IX2_SESSION_STOPPED: rF,
                    IX2_INSTANCE_ADDED: nF,
                    IX2_ELEMENT_STATE_CHANGED: iF,
                } = _e),
                (fh = {}),
                (oF = "refState"),
                (aF = (e = fh, t = {}) => {
                    switch (t.type) {
                        case rF:
                            return fh;
                        case nF: {
                            let {
                                    elementId: r,
                                    element: n,
                                    origin: i,
                                    actionItem: o,
                                    refType: a,
                                } = t.payload,
                                { actionTypeId: s } = o,
                                u = e;
                            return (
                                (0, nr.getIn)(u, [r, n]) !== n &&
                                    (u = dh(u, n, a, r, o)),
                                Aa(u, r, s, i, o)
                            );
                        }
                        case iF: {
                            let {
                                elementId: r,
                                actionTypeId: n,
                                current: i,
                                actionItem: o,
                            } = t.payload;
                            return Aa(e, r, n, i, o);
                        }
                        default:
                            return e;
                    }
                });
            sF = [
                [Kq, Zq],
                [Yq, Jq],
                [$q, eF],
                [Qq, tF],
            ];
        });
    var vh = c((Te) => {
        "use strict";
        Object.defineProperty(Te, "__esModule", { value: !0 });
        Te.renderPlugin =
            Te.getPluginOrigin =
            Te.getPluginDuration =
            Te.getPluginDestination =
            Te.getPluginConfig =
            Te.createPluginInstance =
            Te.clearPlugin =
                void 0;
        var cF = (e) => e.value;
        Te.getPluginConfig = cF;
        var lF = (e, t) => {
            if (t.config.duration !== "auto") return null;
            let r = parseFloat(e.getAttribute("data-duration"));
            return r > 0
                ? r * 1e3
                : parseFloat(e.getAttribute("data-default-duration")) * 1e3;
        };
        Te.getPluginDuration = lF;
        var fF = (e) => e || { value: 0 };
        Te.getPluginOrigin = fF;
        var dF = (e) => ({ value: e.value });
        Te.getPluginDestination = dF;
        var pF = (e) => {
            let t = window.Webflow.require("lottie").createInstance(e);
            return t.stop(), t.setSubframe(!0), t;
        };
        Te.createPluginInstance = pF;
        var gF = (e, t, r) => {
            if (!e) return;
            let n = t[r.actionTypeId].value / 100;
            e.goToFrame(e.frames * n);
        };
        Te.renderPlugin = gF;
        var vF = (e) => {
            window.Webflow.require("lottie").createInstance(e).stop();
        };
        Te.clearPlugin = vF;
    });
    var Eh = c((Ie) => {
        "use strict";
        Object.defineProperty(Ie, "__esModule", { value: !0 });
        Ie.renderPlugin =
            Ie.getPluginOrigin =
            Ie.getPluginDuration =
            Ie.getPluginDestination =
            Ie.getPluginConfig =
            Ie.createPluginInstance =
            Ie.clearPlugin =
                void 0;
        var hF = (e) => document.querySelector(`[data-w-id="${e}"]`),
            EF = () => window.Webflow.require("spline"),
            yF = (e, t) => e.filter((r) => !t.includes(r)),
            mF = (e, t) => e.value[t];
        Ie.getPluginConfig = mF;
        var _F = () => null;
        Ie.getPluginDuration = _F;
        var hh = Object.freeze({
                positionX: 0,
                positionY: 0,
                positionZ: 0,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                scaleX: 1,
                scaleY: 1,
                scaleZ: 1,
            }),
            bF = (e, t) => {
                let r = t.config.value,
                    n = Object.keys(r);
                if (e) {
                    let o = Object.keys(e),
                        a = yF(n, o);
                    return a.length
                        ? a.reduce((u, d) => ((u[d] = hh[d]), u), e)
                        : e;
                }
                return n.reduce((o, a) => ((o[a] = hh[a]), o), {});
            };
        Ie.getPluginOrigin = bF;
        var TF = (e) => e.value;
        Ie.getPluginDestination = TF;
        var IF = (e, t) => {
            var r;
            let n =
                t == null ||
                (r = t.config) === null ||
                r === void 0 ||
                (r = r.target) === null ||
                r === void 0
                    ? void 0
                    : r.pluginElement;
            return n ? hF(n) : null;
        };
        Ie.createPluginInstance = IF;
        var OF = (e, t, r) => {
            let n = EF(),
                i = n.getInstance(e),
                o = r.config.target.objectId,
                a = (s) => {
                    if (!s)
                        throw new Error(
                            "Invalid spline app passed to renderSpline"
                        );
                    let u = o && s.findObjectById(o);
                    if (!u) return;
                    let { PLUGIN_SPLINE: d } = t;
                    d.positionX != null && (u.position.x = d.positionX),
                        d.positionY != null && (u.position.y = d.positionY),
                        d.positionZ != null && (u.position.z = d.positionZ),
                        d.rotationX != null && (u.rotation.x = d.rotationX),
                        d.rotationY != null && (u.rotation.y = d.rotationY),
                        d.rotationZ != null && (u.rotation.z = d.rotationZ),
                        d.scaleX != null && (u.scale.x = d.scaleX),
                        d.scaleY != null && (u.scale.y = d.scaleY),
                        d.scaleZ != null && (u.scale.z = d.scaleZ);
                };
            i ? a(i.spline) : n.setLoadHandler(e, a);
        };
        Ie.renderPlugin = OF;
        var wF = () => null;
        Ie.clearPlugin = wF;
    });
    var Sa = c((xa) => {
        "use strict";
        Object.defineProperty(xa, "__esModule", { value: !0 });
        xa.normalizeColor = AF;
        var yh = {
            aliceblue: "#F0F8FF",
            antiquewhite: "#FAEBD7",
            aqua: "#00FFFF",
            aquamarine: "#7FFFD4",
            azure: "#F0FFFF",
            beige: "#F5F5DC",
            bisque: "#FFE4C4",
            black: "#000000",
            blanchedalmond: "#FFEBCD",
            blue: "#0000FF",
            blueviolet: "#8A2BE2",
            brown: "#A52A2A",
            burlywood: "#DEB887",
            cadetblue: "#5F9EA0",
            chartreuse: "#7FFF00",
            chocolate: "#D2691E",
            coral: "#FF7F50",
            cornflowerblue: "#6495ED",
            cornsilk: "#FFF8DC",
            crimson: "#DC143C",
            cyan: "#00FFFF",
            darkblue: "#00008B",
            darkcyan: "#008B8B",
            darkgoldenrod: "#B8860B",
            darkgray: "#A9A9A9",
            darkgreen: "#006400",
            darkgrey: "#A9A9A9",
            darkkhaki: "#BDB76B",
            darkmagenta: "#8B008B",
            darkolivegreen: "#556B2F",
            darkorange: "#FF8C00",
            darkorchid: "#9932CC",
            darkred: "#8B0000",
            darksalmon: "#E9967A",
            darkseagreen: "#8FBC8F",
            darkslateblue: "#483D8B",
            darkslategray: "#2F4F4F",
            darkslategrey: "#2F4F4F",
            darkturquoise: "#00CED1",
            darkviolet: "#9400D3",
            deeppink: "#FF1493",
            deepskyblue: "#00BFFF",
            dimgray: "#696969",
            dimgrey: "#696969",
            dodgerblue: "#1E90FF",
            firebrick: "#B22222",
            floralwhite: "#FFFAF0",
            forestgreen: "#228B22",
            fuchsia: "#FF00FF",
            gainsboro: "#DCDCDC",
            ghostwhite: "#F8F8FF",
            gold: "#FFD700",
            goldenrod: "#DAA520",
            gray: "#808080",
            green: "#008000",
            greenyellow: "#ADFF2F",
            grey: "#808080",
            honeydew: "#F0FFF0",
            hotpink: "#FF69B4",
            indianred: "#CD5C5C",
            indigo: "#4B0082",
            ivory: "#FFFFF0",
            khaki: "#F0E68C",
            lavender: "#E6E6FA",
            lavenderblush: "#FFF0F5",
            lawngreen: "#7CFC00",
            lemonchiffon: "#FFFACD",
            lightblue: "#ADD8E6",
            lightcoral: "#F08080",
            lightcyan: "#E0FFFF",
            lightgoldenrodyellow: "#FAFAD2",
            lightgray: "#D3D3D3",
            lightgreen: "#90EE90",
            lightgrey: "#D3D3D3",
            lightpink: "#FFB6C1",
            lightsalmon: "#FFA07A",
            lightseagreen: "#20B2AA",
            lightskyblue: "#87CEFA",
            lightslategray: "#778899",
            lightslategrey: "#778899",
            lightsteelblue: "#B0C4DE",
            lightyellow: "#FFFFE0",
            lime: "#00FF00",
            limegreen: "#32CD32",
            linen: "#FAF0E6",
            magenta: "#FF00FF",
            maroon: "#800000",
            mediumaquamarine: "#66CDAA",
            mediumblue: "#0000CD",
            mediumorchid: "#BA55D3",
            mediumpurple: "#9370DB",
            mediumseagreen: "#3CB371",
            mediumslateblue: "#7B68EE",
            mediumspringgreen: "#00FA9A",
            mediumturquoise: "#48D1CC",
            mediumvioletred: "#C71585",
            midnightblue: "#191970",
            mintcream: "#F5FFFA",
            mistyrose: "#FFE4E1",
            moccasin: "#FFE4B5",
            navajowhite: "#FFDEAD",
            navy: "#000080",
            oldlace: "#FDF5E6",
            olive: "#808000",
            olivedrab: "#6B8E23",
            orange: "#FFA500",
            orangered: "#FF4500",
            orchid: "#DA70D6",
            palegoldenrod: "#EEE8AA",
            palegreen: "#98FB98",
            paleturquoise: "#AFEEEE",
            palevioletred: "#DB7093",
            papayawhip: "#FFEFD5",
            peachpuff: "#FFDAB9",
            peru: "#CD853F",
            pink: "#FFC0CB",
            plum: "#DDA0DD",
            powderblue: "#B0E0E6",
            purple: "#800080",
            rebeccapurple: "#663399",
            red: "#FF0000",
            rosybrown: "#BC8F8F",
            royalblue: "#4169E1",
            saddlebrown: "#8B4513",
            salmon: "#FA8072",
            sandybrown: "#F4A460",
            seagreen: "#2E8B57",
            seashell: "#FFF5EE",
            sienna: "#A0522D",
            silver: "#C0C0C0",
            skyblue: "#87CEEB",
            slateblue: "#6A5ACD",
            slategray: "#708090",
            slategrey: "#708090",
            snow: "#FFFAFA",
            springgreen: "#00FF7F",
            steelblue: "#4682B4",
            tan: "#D2B48C",
            teal: "#008080",
            thistle: "#D8BFD8",
            tomato: "#FF6347",
            turquoise: "#40E0D0",
            violet: "#EE82EE",
            wheat: "#F5DEB3",
            white: "#FFFFFF",
            whitesmoke: "#F5F5F5",
            yellow: "#FFFF00",
            yellowgreen: "#9ACD32",
        };
        function AF(e) {
            let t,
                r,
                n,
                i = 1,
                o = e.replace(/\s/g, "").toLowerCase(),
                s =
                    (typeof yh[o] == "string" ? yh[o].toLowerCase() : null) ||
                    o;
            if (s.startsWith("#")) {
                let u = s.substring(1);
                u.length === 3
                    ? ((t = parseInt(u[0] + u[0], 16)),
                      (r = parseInt(u[1] + u[1], 16)),
                      (n = parseInt(u[2] + u[2], 16)))
                    : u.length === 6 &&
                      ((t = parseInt(u.substring(0, 2), 16)),
                      (r = parseInt(u.substring(2, 4), 16)),
                      (n = parseInt(u.substring(4, 6), 16)));
            } else if (s.startsWith("rgba")) {
                let u = s.match(/rgba\(([^)]+)\)/)[1].split(",");
                (t = parseInt(u[0], 10)),
                    (r = parseInt(u[1], 10)),
                    (n = parseInt(u[2], 10)),
                    (i = parseFloat(u[3]));
            } else if (s.startsWith("rgb")) {
                let u = s.match(/rgb\(([^)]+)\)/)[1].split(",");
                (t = parseInt(u[0], 10)),
                    (r = parseInt(u[1], 10)),
                    (n = parseInt(u[2], 10));
            } else if (s.startsWith("hsla")) {
                let u = s.match(/hsla\(([^)]+)\)/)[1].split(","),
                    d = parseFloat(u[0]),
                    h = parseFloat(u[1].replace("%", "")) / 100,
                    v = parseFloat(u[2].replace("%", "")) / 100;
                i = parseFloat(u[3]);
                let g = (1 - Math.abs(2 * v - 1)) * h,
                    b = g * (1 - Math.abs(((d / 60) % 2) - 1)),
                    O = v - g / 2,
                    T,
                    S,
                    _;
                d >= 0 && d < 60
                    ? ((T = g), (S = b), (_ = 0))
                    : d >= 60 && d < 120
                    ? ((T = b), (S = g), (_ = 0))
                    : d >= 120 && d < 180
                    ? ((T = 0), (S = g), (_ = b))
                    : d >= 180 && d < 240
                    ? ((T = 0), (S = b), (_ = g))
                    : d >= 240 && d < 300
                    ? ((T = b), (S = 0), (_ = g))
                    : ((T = g), (S = 0), (_ = b)),
                    (t = Math.round((T + O) * 255)),
                    (r = Math.round((S + O) * 255)),
                    (n = Math.round((_ + O) * 255));
            } else if (s.startsWith("hsl")) {
                let u = s.match(/hsl\(([^)]+)\)/)[1].split(","),
                    d = parseFloat(u[0]),
                    h = parseFloat(u[1].replace("%", "")) / 100,
                    v = parseFloat(u[2].replace("%", "")) / 100,
                    g = (1 - Math.abs(2 * v - 1)) * h,
                    b = g * (1 - Math.abs(((d / 60) % 2) - 1)),
                    O = v - g / 2,
                    T,
                    S,
                    _;
                d >= 0 && d < 60
                    ? ((T = g), (S = b), (_ = 0))
                    : d >= 60 && d < 120
                    ? ((T = b), (S = g), (_ = 0))
                    : d >= 120 && d < 180
                    ? ((T = 0), (S = g), (_ = b))
                    : d >= 180 && d < 240
                    ? ((T = 0), (S = b), (_ = g))
                    : d >= 240 && d < 300
                    ? ((T = b), (S = 0), (_ = g))
                    : ((T = g), (S = 0), (_ = b)),
                    (t = Math.round((T + O) * 255)),
                    (r = Math.round((S + O) * 255)),
                    (n = Math.round((_ + O) * 255));
            }
            if (Number.isNaN(t) || Number.isNaN(r) || Number.isNaN(n))
                throw new Error(
                    `Invalid color in [ix2/shared/utils/normalizeColor.js] '${e}'`
                );
            return { red: t, green: r, blue: n, alpha: i };
        }
    });
    var mh = c((Oe) => {
        "use strict";
        Object.defineProperty(Oe, "__esModule", { value: !0 });
        Oe.renderPlugin =
            Oe.getPluginOrigin =
            Oe.getPluginDuration =
            Oe.getPluginDestination =
            Oe.getPluginConfig =
            Oe.createPluginInstance =
            Oe.clearPlugin =
                void 0;
        var xF = Sa(),
            SF = (e, t) => e.value[t];
        Oe.getPluginConfig = SF;
        var CF = () => null;
        Oe.getPluginDuration = CF;
        var RF = (e, t) => {
            if (e) return e;
            let r = t.config.value,
                n = t.config.target.objectId,
                i = getComputedStyle(document.documentElement).getPropertyValue(
                    n
                );
            if (r.size != null) return { size: parseInt(i, 10) };
            if (r.red != null && r.green != null && r.blue != null)
                return (0, xF.normalizeColor)(i);
        };
        Oe.getPluginOrigin = RF;
        var LF = (e) => e.value;
        Oe.getPluginDestination = LF;
        var NF = () => null;
        Oe.createPluginInstance = NF;
        var PF = (e, t, r) => {
            let n = r.config.target.objectId,
                i = r.config.value.unit,
                { PLUGIN_VARIABLE: o } = t,
                { size: a, red: s, green: u, blue: d, alpha: h } = o,
                v;
            a != null && (v = a + i),
                s != null &&
                    d != null &&
                    u != null &&
                    h != null &&
                    (v = `rgba(${s}, ${u}, ${d}, ${h})`),
                v != null && document.documentElement.style.setProperty(n, v);
        };
        Oe.renderPlugin = PF;
        var qF = (e, t) => {
            let r = t.config.target.objectId;
            document.documentElement.style.removeProperty(r);
        };
        Oe.clearPlugin = qF;
    });
    var _h = c((ei) => {
        "use strict";
        var Ra = fn().default;
        Object.defineProperty(ei, "__esModule", { value: !0 });
        ei.pluginMethodMap = void 0;
        var Ca = (Fe(), et(Af)),
            FF = Ra(vh()),
            MF = Ra(Eh()),
            DF = Ra(mh()),
            dX = (ei.pluginMethodMap = new Map([
                [Ca.ActionTypeConsts.PLUGIN_LOTTIE, { ...FF }],
                [Ca.ActionTypeConsts.PLUGIN_SPLINE, { ...MF }],
                [Ca.ActionTypeConsts.PLUGIN_VARIABLE, { ...DF }],
            ]));
    });
    var bh = {};
    Pe(bh, {
        clearPlugin: () => Ma,
        createPluginInstance: () => kF,
        getPluginConfig: () => Na,
        getPluginDestination: () => qa,
        getPluginDuration: () => GF,
        getPluginOrigin: () => Pa,
        isPluginType: () => Pt,
        renderPlugin: () => Fa,
    });
    function Pt(e) {
        return La.pluginMethodMap.has(e);
    }
    var La,
        qt,
        Na,
        Pa,
        GF,
        qa,
        kF,
        Fa,
        Ma,
        Da = pe(() => {
            "use strict";
            Qn();
            La = ae(_h());
            (qt = (e) => (t) => {
                if (!Ye) return () => null;
                let r = La.pluginMethodMap.get(t);
                if (!r) throw new Error(`IX2 no plugin configured for: ${t}`);
                let n = r[e];
                if (!n) throw new Error(`IX2 invalid plugin method: ${e}`);
                return n;
            }),
                (Na = qt("getPluginConfig")),
                (Pa = qt("getPluginOrigin")),
                (GF = qt("getPluginDuration")),
                (qa = qt("getPluginDestination")),
                (kF = qt("createPluginInstance")),
                (Fa = qt("renderPlugin")),
                (Ma = qt("clearPlugin"));
        });
    var Ih = c((vX, Th) => {
        function UF(e, t) {
            return e == null || e !== e ? t : e;
        }
        Th.exports = UF;
    });
    var wh = c((hX, Oh) => {
        function VF(e, t, r, n) {
            var i = -1,
                o = e == null ? 0 : e.length;
            for (n && o && (r = e[++i]); ++i < o; ) r = t(r, e[i], i, e);
            return r;
        }
        Oh.exports = VF;
    });
    var xh = c((EX, Ah) => {
        function BF(e) {
            return function (t, r, n) {
                for (var i = -1, o = Object(t), a = n(t), s = a.length; s--; ) {
                    var u = a[e ? s : ++i];
                    if (r(o[u], u, o) === !1) break;
                }
                return t;
            };
        }
        Ah.exports = BF;
    });
    var Ch = c((yX, Sh) => {
        var WF = xh(),
            HF = WF();
        Sh.exports = HF;
    });
    var Ga = c((mX, Rh) => {
        var XF = Ch(),
            jF = Gr();
        function zF(e, t) {
            return e && XF(e, t, jF);
        }
        Rh.exports = zF;
    });
    var Nh = c((_X, Lh) => {
        var KF = Lt();
        function YF(e, t) {
            return function (r, n) {
                if (r == null) return r;
                if (!KF(r)) return e(r, n);
                for (
                    var i = r.length, o = t ? i : -1, a = Object(r);
                    (t ? o-- : ++o < i) && n(a[o], o, a) !== !1;

                );
                return r;
            };
        }
        Lh.exports = YF;
    });
    var ka = c((bX, Ph) => {
        var $F = Ga(),
            QF = Nh(),
            ZF = QF($F);
        Ph.exports = ZF;
    });
    var Fh = c((TX, qh) => {
        function JF(e, t, r, n, i) {
            return (
                i(e, function (o, a, s) {
                    r = n ? ((n = !1), o) : t(r, o, a, s);
                }),
                r
            );
        }
        qh.exports = JF;
    });
    var Dh = c((IX, Mh) => {
        var eM = wh(),
            tM = ka(),
            rM = It(),
            nM = Fh(),
            iM = be();
        function oM(e, t, r) {
            var n = iM(e) ? eM : nM,
                i = arguments.length < 3;
            return n(e, rM(t, 4), r, i, tM);
        }
        Mh.exports = oM;
    });
    var kh = c((OX, Gh) => {
        var aM = ma(),
            sM = It(),
            uM = _a(),
            cM = Math.max,
            lM = Math.min;
        function fM(e, t, r) {
            var n = e == null ? 0 : e.length;
            if (!n) return -1;
            var i = n - 1;
            return (
                r !== void 0 &&
                    ((i = uM(r)), (i = r < 0 ? cM(n + i, 0) : lM(i, n - 1))),
                aM(e, sM(t, 3), i, !0)
            );
        }
        Gh.exports = fM;
    });
    var Vh = c((wX, Uh) => {
        var dM = ya(),
            pM = kh(),
            gM = dM(pM);
        Uh.exports = gM;
    });
    function Bh(e, t) {
        return e === t
            ? e !== 0 || t !== 0 || 1 / e === 1 / t
            : e !== e && t !== t;
    }
    function vM(e, t) {
        if (Bh(e, t)) return !0;
        if (
            typeof e != "object" ||
            e === null ||
            typeof t != "object" ||
            t === null
        )
            return !1;
        let r = Object.keys(e),
            n = Object.keys(t);
        if (r.length !== n.length) return !1;
        for (let i = 0; i < r.length; i++)
            if (!Object.hasOwn(t, r[i]) || !Bh(e[r[i]], t[r[i]])) return !1;
        return !0;
    }
    var Ua,
        Wh = pe(() => {
            "use strict";
            Ua = vM;
        });
    var sE = {};
    Pe(sE, {
        cleanupHTMLElement: () => d1,
        clearAllStyles: () => f1,
        clearObjectCache: () => NM,
        getActionListProgress: () => g1,
        getAffectedElements: () => Xa,
        getComputedStyle: () => UM,
        getDestinationValues: () => zM,
        getElementId: () => MM,
        getInstanceId: () => qM,
        getInstanceOrigin: () => WM,
        getItemConfigByKey: () => jM,
        getMaxDurationItemIndex: () => aE,
        getNamespacedParameterId: () => E1,
        getRenderType: () => nE,
        getStyleProp: () => KM,
        mediaQueriesEqual: () => m1,
        observeStore: () => kM,
        reduceListToGroup: () => v1,
        reifyState: () => DM,
        renderHTMLElement: () => YM,
        shallowEqual: () => Ua,
        shouldAllowMediaQuery: () => y1,
        shouldNamespaceEventParameter: () => h1,
        stringifyTarget: () => _1,
    });
    function NM() {
        ti.clear();
    }
    function qM() {
        return "i" + PM++;
    }
    function MM(e, t) {
        for (let r in e) {
            let n = e[r];
            if (n && n.ref === t) return n.id;
        }
        return "e" + FM++;
    }
    function DM({ events: e, actionLists: t, site: r } = {}) {
        let n = (0, oi.default)(
                e,
                (a, s) => {
                    let { eventTypeId: u } = s;
                    return a[u] || (a[u] = {}), (a[u][s.id] = s), a;
                },
                {}
            ),
            i = r && r.mediaQueries,
            o = [];
        return (
            i
                ? (o = i.map((a) => a.key))
                : ((i = []),
                  console.warn("IX2 missing mediaQueries in site data")),
            {
                ixData: {
                    events: e,
                    actionLists: t,
                    eventTypeMap: n,
                    mediaQueries: i,
                    mediaQueryKeys: o,
                },
            }
        );
    }
    function kM({ store: e, select: t, onChange: r, comparator: n = GM }) {
        let { getState: i, subscribe: o } = e,
            a = o(u),
            s = t(i());
        function u() {
            let d = t(i());
            if (d == null) {
                a();
                return;
            }
            n(d, s) || ((s = d), r(s, e));
        }
        return a;
    }
    function jh(e) {
        let t = typeof e;
        if (t === "string") return { id: e };
        if (e != null && t === "object") {
            let {
                id: r,
                objectId: n,
                selector: i,
                selectorGuids: o,
                appliesTo: a,
                useEventTarget: s,
            } = e;
            return {
                id: r,
                objectId: n,
                selector: i,
                selectorGuids: o,
                appliesTo: a,
                useEventTarget: s,
            };
        }
        return {};
    }
    function Xa({
        config: e,
        event: t,
        eventTarget: r,
        elementRoot: n,
        elementApi: i,
    }) {
        if (!i) throw new Error("IX2 missing elementApi");
        let { targets: o } = e;
        if (Array.isArray(o) && o.length > 0)
            return o.reduce(
                (G, A) =>
                    G.concat(
                        Xa({
                            config: { target: A },
                            event: t,
                            eventTarget: r,
                            elementRoot: n,
                            elementApi: i,
                        })
                    ),
                []
            );
        let {
                getValidDocument: a,
                getQuerySelector: s,
                queryDocument: u,
                getChildElements: d,
                getSiblingElements: h,
                matchSelector: v,
                elementContains: g,
                isSiblingNode: b,
            } = i,
            { target: O } = e;
        if (!O) return [];
        let {
            id: T,
            objectId: S,
            selector: _,
            selectorGuids: N,
            appliesTo: R,
            useEventTarget: q,
        } = jh(O);
        if (S) return [ti.has(S) ? ti.get(S) : ti.set(S, {}).get(S)];
        if (R === Ho.PAGE) {
            let G = a(T);
            return G ? [G] : [];
        }
        let P = (t?.action?.config?.affectedElements ?? {})[T || _] || {},
            W = !!(P.id || P.selector),
            X,
            z,
            Y,
            $ = t && s(jh(t.target));
        if (
            (W
                ? ((X = P.limitAffectedElements), (z = $), (Y = s(P)))
                : (z = Y = s({ id: T, selector: _, selectorGuids: N })),
            t && q)
        ) {
            let G = r && (Y || q === !0) ? [r] : u($);
            if (Y) {
                if (q === CM) return u(Y).filter((A) => G.some((M) => g(A, M)));
                if (q === Hh) return u(Y).filter((A) => G.some((M) => g(M, A)));
                if (q === Xh) return u(Y).filter((A) => G.some((M) => b(M, A)));
            }
            return G;
        }
        return z == null || Y == null
            ? []
            : Ye && n
            ? u(Y).filter((G) => n.contains(G))
            : X === Hh
            ? u(z, Y)
            : X === SM
            ? d(u(z)).filter(v(Y))
            : X === Xh
            ? h(u(z)).filter(v(Y))
            : u(Y);
    }
    function UM({ element: e, actionItem: t }) {
        if (!Ye) return {};
        let { actionTypeId: r } = t;
        switch (r) {
            case ur:
            case cr:
            case lr:
            case fr:
            case si:
                return window.getComputedStyle(e);
            default:
                return {};
        }
    }
    function WM(e, t = {}, r = {}, n, i) {
        let { getStyle: o } = i,
            { actionTypeId: a } = n;
        if (Pt(a)) return Pa(a)(t[a], n);
        switch (n.actionTypeId) {
            case or:
            case ar:
            case sr:
            case Kr:
                return t[n.actionTypeId] || ja[n.actionTypeId];
            case Yr:
                return VM(t[n.actionTypeId], n.config.filters);
            case $r:
                return BM(t[n.actionTypeId], n.config.fontVariations);
            case eE:
                return { value: (0, gt.default)(parseFloat(o(e, ni)), 1) };
            case ur: {
                let s = o(e, at),
                    u = o(e, st),
                    d,
                    h;
                return (
                    n.config.widthUnit === wt
                        ? (d = zh.test(s) ? parseFloat(s) : parseFloat(r.width))
                        : (d = (0, gt.default)(
                              parseFloat(s),
                              parseFloat(r.width)
                          )),
                    n.config.heightUnit === wt
                        ? (h = zh.test(u)
                              ? parseFloat(u)
                              : parseFloat(r.height))
                        : (h = (0, gt.default)(
                              parseFloat(u),
                              parseFloat(r.height)
                          )),
                    { widthValue: d, heightValue: h }
                );
            }
            case cr:
            case lr:
            case fr:
                return u1({
                    element: e,
                    actionTypeId: n.actionTypeId,
                    computedStyle: r,
                    getStyle: o,
                });
            case si:
                return { value: (0, gt.default)(o(e, ii), r.display) };
            case LM:
                return t[n.actionTypeId] || { value: 0 };
            default:
                return;
        }
    }
    function zM({ element: e, actionItem: t, elementApi: r }) {
        if (Pt(t.actionTypeId)) return qa(t.actionTypeId)(t.config);
        switch (t.actionTypeId) {
            case or:
            case ar:
            case sr:
            case Kr: {
                let { xValue: n, yValue: i, zValue: o } = t.config;
                return { xValue: n, yValue: i, zValue: o };
            }
            case ur: {
                let { getStyle: n, setStyle: i, getProperty: o } = r,
                    { widthUnit: a, heightUnit: s } = t.config,
                    { widthValue: u, heightValue: d } = t.config;
                if (!Ye) return { widthValue: u, heightValue: d };
                if (a === wt) {
                    let h = n(e, at);
                    i(e, at, ""), (u = o(e, "offsetWidth")), i(e, at, h);
                }
                if (s === wt) {
                    let h = n(e, st);
                    i(e, st, ""), (d = o(e, "offsetHeight")), i(e, st, h);
                }
                return { widthValue: u, heightValue: d };
            }
            case cr:
            case lr:
            case fr: {
                let {
                    rValue: n,
                    gValue: i,
                    bValue: o,
                    aValue: a,
                    globalSwatchId: s,
                } = t.config;
                if (s && s.startsWith("--")) {
                    let { getStyle: u } = r,
                        d = u(e, s),
                        h = (0, $h.normalizeColor)(d);
                    return {
                        rValue: h.red,
                        gValue: h.green,
                        bValue: h.blue,
                        aValue: h.alpha,
                    };
                }
                return { rValue: n, gValue: i, bValue: o, aValue: a };
            }
            case Yr:
                return t.config.filters.reduce(HM, {});
            case $r:
                return t.config.fontVariations.reduce(XM, {});
            default: {
                let { value: n } = t.config;
                return { value: n };
            }
        }
    }
    function nE(e) {
        if (/^TRANSFORM_/.test(e)) return Zh;
        if (/^STYLE_/.test(e)) return Wa;
        if (/^GENERAL_/.test(e)) return Ba;
        if (/^PLUGIN_/.test(e)) return Jh;
    }
    function KM(e, t) {
        return e === Wa ? t.replace("STYLE_", "").toLowerCase() : null;
    }
    function YM(e, t, r, n, i, o, a, s, u) {
        switch (s) {
            case Zh:
                return e1(e, t, r, i, a);
            case Wa:
                return c1(e, t, r, i, o, a);
            case Ba:
                return l1(e, i, a);
            case Jh: {
                let { actionTypeId: d } = i;
                if (Pt(d)) return Fa(d)(u, t, i);
            }
        }
    }
    function e1(e, t, r, n, i) {
        let o = JM.map((s) => {
                let u = ja[s],
                    {
                        xValue: d = u.xValue,
                        yValue: h = u.yValue,
                        zValue: v = u.zValue,
                        xUnit: g = "",
                        yUnit: b = "",
                        zUnit: O = "",
                    } = t[s] || {};
                switch (s) {
                    case or:
                        return `${yM}(${d}${g}, ${h}${b}, ${v}${O})`;
                    case ar:
                        return `${mM}(${d}${g}, ${h}${b}, ${v}${O})`;
                    case sr:
                        return `${_M}(${d}${g}) ${bM}(${h}${b}) ${TM}(${v}${O})`;
                    case Kr:
                        return `${IM}(${d}${g}, ${h}${b})`;
                    default:
                        return "";
                }
            }).join(" "),
            { setStyle: a } = i;
        Ft(e, Ot, i), a(e, Ot, o), n1(n, r) && a(e, $n, OM);
    }
    function t1(e, t, r, n) {
        let i = (0, oi.default)(
                t,
                (a, s, u) => `${a} ${u}(${s}${ZM(u, r)})`,
                ""
            ),
            { setStyle: o } = n;
        Ft(e, Xr, n), o(e, Xr, i);
    }
    function r1(e, t, r, n) {
        let i = (0, oi.default)(
                t,
                (a, s, u) => (a.push(`"${u}" ${s}`), a),
                []
            ).join(", "),
            { setStyle: o } = n;
        Ft(e, jr, n), o(e, jr, i);
    }
    function n1({ actionTypeId: e }, { xValue: t, yValue: r, zValue: n }) {
        return (
            (e === or && n !== void 0) ||
            (e === ar && n !== void 0) ||
            (e === sr && (t !== void 0 || r !== void 0))
        );
    }
    function s1(e, t) {
        let r = e.exec(t);
        return r ? r[1] : "";
    }
    function u1({
        element: e,
        actionTypeId: t,
        computedStyle: r,
        getStyle: n,
    }) {
        let i = Ha[t],
            o = n(e, i),
            a = o1.test(o) ? o : r[i],
            s = s1(a1, a).split(zr);
        return {
            rValue: (0, gt.default)(parseInt(s[0], 10), 255),
            gValue: (0, gt.default)(parseInt(s[1], 10), 255),
            bValue: (0, gt.default)(parseInt(s[2], 10), 255),
            aValue: (0, gt.default)(parseFloat(s[3]), 1),
        };
    }
    function c1(e, t, r, n, i, o) {
        let { setStyle: a } = o;
        switch (n.actionTypeId) {
            case ur: {
                let { widthUnit: s = "", heightUnit: u = "" } = n.config,
                    { widthValue: d, heightValue: h } = r;
                d !== void 0 &&
                    (s === wt && (s = "px"), Ft(e, at, o), a(e, at, d + s)),
                    h !== void 0 &&
                        (u === wt && (u = "px"), Ft(e, st, o), a(e, st, h + u));
                break;
            }
            case Yr: {
                t1(e, r, n.config, o);
                break;
            }
            case $r: {
                r1(e, r, n.config, o);
                break;
            }
            case cr:
            case lr:
            case fr: {
                let s = Ha[n.actionTypeId],
                    u = Math.round(r.rValue),
                    d = Math.round(r.gValue),
                    h = Math.round(r.bValue),
                    v = r.aValue;
                Ft(e, s, o),
                    a(
                        e,
                        s,
                        v >= 1
                            ? `rgb(${u},${d},${h})`
                            : `rgba(${u},${d},${h},${v})`
                    );
                break;
            }
            default: {
                let { unit: s = "" } = n.config;
                Ft(e, i, o), a(e, i, r.value + s);
                break;
            }
        }
    }
    function l1(e, t, r) {
        let { setStyle: n } = r;
        switch (t.actionTypeId) {
            case si: {
                let { value: i } = t.config;
                i === wM && Ye ? n(e, ii, Ta) : n(e, ii, i);
                return;
            }
        }
    }
    function Ft(e, t, r) {
        if (!Ye) return;
        let n = rE[t];
        if (!n) return;
        let { getStyle: i, setStyle: o } = r,
            a = i(e, ir);
        if (!a) {
            o(e, ir, n);
            return;
        }
        let s = a.split(zr).map(tE);
        s.indexOf(n) === -1 && o(e, ir, s.concat(n).join(zr));
    }
    function iE(e, t, r) {
        if (!Ye) return;
        let n = rE[t];
        if (!n) return;
        let { getStyle: i, setStyle: o } = r,
            a = i(e, ir);
        !a ||
            a.indexOf(n) === -1 ||
            o(
                e,
                ir,
                a
                    .split(zr)
                    .map(tE)
                    .filter((s) => s !== n)
                    .join(zr)
            );
    }
    function f1({ store: e, elementApi: t }) {
        let { ixData: r } = e.getState(),
            { events: n = {}, actionLists: i = {} } = r;
        Object.keys(n).forEach((o) => {
            let a = n[o],
                { config: s } = a.action,
                { actionListId: u } = s,
                d = i[u];
            d && Kh({ actionList: d, event: a, elementApi: t });
        }),
            Object.keys(i).forEach((o) => {
                Kh({ actionList: i[o], elementApi: t });
            });
    }
    function Kh({ actionList: e = {}, event: t, elementApi: r }) {
        let { actionItemGroups: n, continuousParameterGroups: i } = e;
        n &&
            n.forEach((o) => {
                Yh({ actionGroup: o, event: t, elementApi: r });
            }),
            i &&
                i.forEach((o) => {
                    let { continuousActionGroups: a } = o;
                    a.forEach((s) => {
                        Yh({ actionGroup: s, event: t, elementApi: r });
                    });
                });
    }
    function Yh({ actionGroup: e, event: t, elementApi: r }) {
        let { actionItems: n } = e;
        n.forEach((i) => {
            let { actionTypeId: o, config: a } = i,
                s;
            Pt(o)
                ? (s = (u) => Ma(o)(u, i))
                : (s = oE({ effect: p1, actionTypeId: o, elementApi: r })),
                Xa({ config: a, event: t, elementApi: r }).forEach(s);
        });
    }
    function d1(e, t, r) {
        let { setStyle: n, getStyle: i } = r,
            { actionTypeId: o } = t;
        if (o === ur) {
            let { config: a } = t;
            a.widthUnit === wt && n(e, at, ""),
                a.heightUnit === wt && n(e, st, "");
        }
        i(e, ir) && oE({ effect: iE, actionTypeId: o, elementApi: r })(e);
    }
    function p1(e, t, r) {
        let { setStyle: n } = r;
        iE(e, t, r), n(e, t, ""), t === Ot && n(e, $n, "");
    }
    function aE(e) {
        let t = 0,
            r = 0;
        return (
            e.forEach((n, i) => {
                let { config: o } = n,
                    a = o.delay + o.duration;
                a >= t && ((t = a), (r = i));
            }),
            r
        );
    }
    function g1(e, t) {
        let { actionItemGroups: r, useFirstGroupAsInitialState: n } = e,
            { actionItem: i, verboseTimeElapsed: o = 0 } = t,
            a = 0,
            s = 0;
        return (
            r.forEach((u, d) => {
                if (n && d === 0) return;
                let { actionItems: h } = u,
                    v = h[aE(h)],
                    { config: g, actionTypeId: b } = v;
                i.id === v.id && (s = a + o);
                let O = nE(b) === Ba ? 0 : g.duration;
                a += g.delay + O;
            }),
            a > 0 ? Hr(s / a) : 0
        );
    }
    function v1({ actionList: e, actionItemId: t, rawData: r }) {
        let { actionItemGroups: n, continuousParameterGroups: i } = e,
            o = [],
            a = (s) => (
                o.push(
                    (0, ai.mergeIn)(s, ["config"], { delay: 0, duration: 0 })
                ),
                s.id === t
            );
        return (
            n && n.some(({ actionItems: s }) => s.some(a)),
            i &&
                i.some((s) => {
                    let { continuousActionGroups: u } = s;
                    return u.some(({ actionItems: d }) => d.some(a));
                }),
            (0, ai.setIn)(r, ["actionLists"], {
                [e.id]: { id: e.id, actionItemGroups: [{ actionItems: o }] },
            })
        );
    }
    function h1(e, { basedOn: t }) {
        return (
            (e === Ke.SCROLLING_IN_VIEW && (t === it.ELEMENT || t == null)) ||
            (e === Ke.MOUSE_MOVE && t === it.ELEMENT)
        );
    }
    function E1(e, t) {
        return e + RM + t;
    }
    function y1(e, t) {
        return t == null ? !0 : e.indexOf(t) !== -1;
    }
    function m1(e, t) {
        return Ua(e && e.sort(), t && t.sort());
    }
    function _1(e) {
        if (typeof e == "string") return e;
        if (e.pluginElement && e.objectId)
            return e.pluginElement + Va + e.objectId;
        if (e.objectId) return e.objectId;
        let { id: t = "", selector: r = "", useEventTarget: n = "" } = e;
        return t + Va + r + Va + n;
    }
    var gt,
        oi,
        ri,
        ai,
        $h,
        hM,
        EM,
        yM,
        mM,
        _M,
        bM,
        TM,
        IM,
        OM,
        wM,
        ni,
        Xr,
        jr,
        at,
        st,
        Qh,
        AM,
        xM,
        Hh,
        SM,
        Xh,
        CM,
        ii,
        ir,
        wt,
        zr,
        RM,
        Va,
        Zh,
        Ba,
        Wa,
        Jh,
        or,
        ar,
        sr,
        Kr,
        eE,
        Yr,
        $r,
        ur,
        cr,
        lr,
        fr,
        si,
        LM,
        tE,
        Ha,
        rE,
        ti,
        PM,
        FM,
        GM,
        zh,
        VM,
        BM,
        HM,
        XM,
        jM,
        ja,
        $M,
        QM,
        ZM,
        JM,
        i1,
        o1,
        a1,
        oE,
        uE = pe(() => {
            "use strict";
            (gt = ae(Ih())), (oi = ae(Dh())), (ri = ae(Vh())), (ai = ae(Kt()));
            Fe();
            Wh();
            wa();
            $h = ae(Sa());
            Da();
            Qn();
            ({
                BACKGROUND: hM,
                TRANSFORM: EM,
                TRANSLATE_3D: yM,
                SCALE_3D: mM,
                ROTATE_X: _M,
                ROTATE_Y: bM,
                ROTATE_Z: TM,
                SKEW: IM,
                PRESERVE_3D: OM,
                FLEX: wM,
                OPACITY: ni,
                FILTER: Xr,
                FONT_VARIATION_SETTINGS: jr,
                WIDTH: at,
                HEIGHT: st,
                BACKGROUND_COLOR: Qh,
                BORDER_COLOR: AM,
                COLOR: xM,
                CHILDREN: Hh,
                IMMEDIATE_CHILDREN: SM,
                SIBLINGS: Xh,
                PARENT: CM,
                DISPLAY: ii,
                WILL_CHANGE: ir,
                AUTO: wt,
                COMMA_DELIMITER: zr,
                COLON_DELIMITER: RM,
                BAR_DELIMITER: Va,
                RENDER_TRANSFORM: Zh,
                RENDER_GENERAL: Ba,
                RENDER_STYLE: Wa,
                RENDER_PLUGIN: Jh,
            } = we),
                ({
                    TRANSFORM_MOVE: or,
                    TRANSFORM_SCALE: ar,
                    TRANSFORM_ROTATE: sr,
                    TRANSFORM_SKEW: Kr,
                    STYLE_OPACITY: eE,
                    STYLE_FILTER: Yr,
                    STYLE_FONT_VARIATION: $r,
                    STYLE_SIZE: ur,
                    STYLE_BACKGROUND_COLOR: cr,
                    STYLE_BORDER: lr,
                    STYLE_TEXT_COLOR: fr,
                    GENERAL_DISPLAY: si,
                    OBJECT_VALUE: LM,
                } = qe),
                (tE = (e) => e.trim()),
                (Ha = Object.freeze({ [cr]: Qh, [lr]: AM, [fr]: xM })),
                (rE = Object.freeze({
                    [Ot]: EM,
                    [Qh]: hM,
                    [ni]: ni,
                    [Xr]: Xr,
                    [at]: at,
                    [st]: st,
                    [jr]: jr,
                })),
                (ti = new Map());
            PM = 1;
            FM = 1;
            GM = (e, t) => e === t;
            (zh = /px/),
                (VM = (e, t) =>
                    t.reduce(
                        (r, n) => (
                            r[n.type] == null && (r[n.type] = $M[n.type]), r
                        ),
                        e || {}
                    )),
                (BM = (e, t) =>
                    t.reduce(
                        (r, n) => (
                            r[n.type] == null &&
                                (r[n.type] = QM[n.type] || n.defaultValue || 0),
                            r
                        ),
                        e || {}
                    ));
            (HM = (e, t) => (t && (e[t.type] = t.value || 0), e)),
                (XM = (e, t) => (t && (e[t.type] = t.value || 0), e)),
                (jM = (e, t, r) => {
                    if (Pt(e)) return Na(e)(r, t);
                    switch (e) {
                        case Yr: {
                            let n = (0, ri.default)(
                                r.filters,
                                ({ type: i }) => i === t
                            );
                            return n ? n.value : 0;
                        }
                        case $r: {
                            let n = (0, ri.default)(
                                r.fontVariations,
                                ({ type: i }) => i === t
                            );
                            return n ? n.value : 0;
                        }
                        default:
                            return r[t];
                    }
                });
            (ja = {
                [or]: Object.freeze({ xValue: 0, yValue: 0, zValue: 0 }),
                [ar]: Object.freeze({ xValue: 1, yValue: 1, zValue: 1 }),
                [sr]: Object.freeze({ xValue: 0, yValue: 0, zValue: 0 }),
                [Kr]: Object.freeze({ xValue: 0, yValue: 0 }),
            }),
                ($M = Object.freeze({
                    blur: 0,
                    "hue-rotate": 0,
                    invert: 0,
                    grayscale: 0,
                    saturate: 100,
                    sepia: 0,
                    contrast: 100,
                    brightness: 100,
                })),
                (QM = Object.freeze({ wght: 0, opsz: 0, wdth: 0, slnt: 0 })),
                (ZM = (e, t) => {
                    let r = (0, ri.default)(
                        t.filters,
                        ({ type: n }) => n === e
                    );
                    if (r && r.unit) return r.unit;
                    switch (e) {
                        case "blur":
                            return "px";
                        case "hue-rotate":
                            return "deg";
                        default:
                            return "%";
                    }
                }),
                (JM = Object.keys(ja));
            (i1 = "\\(([^)]+)\\)"), (o1 = /^rgb/), (a1 = RegExp(`rgba?${i1}`));
            oE =
                ({ effect: e, actionTypeId: t, elementApi: r }) =>
                (n) => {
                    switch (t) {
                        case or:
                        case ar:
                        case sr:
                        case Kr:
                            e(n, Ot, r);
                            break;
                        case Yr:
                            e(n, Xr, r);
                            break;
                        case $r:
                            e(n, jr, r);
                            break;
                        case eE:
                            e(n, ni, r);
                            break;
                        case ur:
                            e(n, at, r), e(n, st, r);
                            break;
                        case cr:
                        case lr:
                        case fr:
                            e(n, Ha[t], r);
                            break;
                        case si:
                            e(n, ii, r);
                            break;
                    }
                };
        });
    var Mt = c((Re) => {
        "use strict";
        var dr = fn().default;
        Object.defineProperty(Re, "__esModule", { value: !0 });
        Re.IX2VanillaUtils =
            Re.IX2VanillaPlugins =
            Re.IX2ElementsReducer =
            Re.IX2Easings =
            Re.IX2EasingUtils =
            Re.IX2BrowserSupport =
                void 0;
        var b1 = dr((Qn(), et(nh)));
        Re.IX2BrowserSupport = b1;
        var T1 = dr((Oa(), et(Wr)));
        Re.IX2Easings = T1;
        var I1 = dr((wa(), et(lh)));
        Re.IX2EasingUtils = I1;
        var O1 = dr((gh(), et(ph)));
        Re.IX2ElementsReducer = O1;
        var w1 = dr((Da(), et(bh)));
        Re.IX2VanillaPlugins = w1;
        var A1 = dr((uE(), et(sE)));
        Re.IX2VanillaUtils = A1;
    });
    var ci,
        vt,
        x1,
        S1,
        C1,
        R1,
        L1,
        N1,
        ui,
        cE,
        P1,
        q1,
        za,
        F1,
        M1,
        D1,
        G1,
        lE,
        fE = pe(() => {
            "use strict";
            Fe();
            (ci = ae(Mt())),
                (vt = ae(Kt())),
                ({
                    IX2_RAW_DATA_IMPORTED: x1,
                    IX2_SESSION_STOPPED: S1,
                    IX2_INSTANCE_ADDED: C1,
                    IX2_INSTANCE_STARTED: R1,
                    IX2_INSTANCE_REMOVED: L1,
                    IX2_ANIMATION_FRAME_CHANGED: N1,
                } = _e),
                ({
                    optimizeFloat: ui,
                    applyEasing: cE,
                    createBezierEasing: P1,
                } = ci.IX2EasingUtils),
                ({ RENDER_GENERAL: q1 } = we),
                ({
                    getItemConfigByKey: za,
                    getRenderType: F1,
                    getStyleProp: M1,
                } = ci.IX2VanillaUtils),
                (D1 = (e, t) => {
                    let {
                            position: r,
                            parameterId: n,
                            actionGroups: i,
                            destinationKeys: o,
                            smoothing: a,
                            restingValue: s,
                            actionTypeId: u,
                            customEasingFn: d,
                            skipMotion: h,
                            skipToValue: v,
                        } = e,
                        { parameters: g } = t.payload,
                        b = Math.max(1 - a, 0.01),
                        O = g[n];
                    O == null && ((b = 1), (O = s));
                    let T = Math.max(O, 0) || 0,
                        S = ui(T - r),
                        _ = h ? v : ui(r + S * b),
                        N = _ * 100;
                    if (_ === r && e.current) return e;
                    let R, q, F, P;
                    for (let X = 0, { length: z } = i; X < z; X++) {
                        let { keyframe: Y, actionItems: $ } = i[X];
                        if ((X === 0 && (R = $[0]), N >= Y)) {
                            R = $[0];
                            let G = i[X + 1],
                                A = G && N !== Y;
                            (q = A ? G.actionItems[0] : null),
                                A &&
                                    ((F = Y / 100),
                                    (P = (G.keyframe - Y) / 100));
                        }
                    }
                    let W = {};
                    if (R && !q)
                        for (let X = 0, { length: z } = o; X < z; X++) {
                            let Y = o[X];
                            W[Y] = za(u, Y, R.config);
                        }
                    else if (R && q && F !== void 0 && P !== void 0) {
                        let X = (_ - F) / P,
                            z = R.config.easing,
                            Y = cE(z, X, d);
                        for (let $ = 0, { length: G } = o; $ < G; $++) {
                            let A = o[$],
                                M = za(u, A, R.config),
                                Z = (za(u, A, q.config) - M) * Y + M;
                            W[A] = Z;
                        }
                    }
                    return (0, vt.merge)(e, { position: _, current: W });
                }),
                (G1 = (e, t) => {
                    let {
                            active: r,
                            origin: n,
                            start: i,
                            immediate: o,
                            renderType: a,
                            verbose: s,
                            actionItem: u,
                            destination: d,
                            destinationKeys: h,
                            pluginDuration: v,
                            instanceDelay: g,
                            customEasingFn: b,
                            skipMotion: O,
                        } = e,
                        T = u.config.easing,
                        { duration: S, delay: _ } = u.config;
                    v != null && (S = v),
                        (_ = g ?? _),
                        a === q1 ? (S = 0) : (o || O) && (S = _ = 0);
                    let { now: N } = t.payload;
                    if (r && n) {
                        let R = N - (i + _);
                        if (s) {
                            let X = N - i,
                                z = S + _,
                                Y = ui(Math.min(Math.max(0, X / z), 1));
                            e = (0, vt.set)(e, "verboseTimeElapsed", z * Y);
                        }
                        if (R < 0) return e;
                        let q = ui(Math.min(Math.max(0, R / S), 1)),
                            F = cE(T, q, b),
                            P = {},
                            W = null;
                        return (
                            h.length &&
                                (W = h.reduce((X, z) => {
                                    let Y = d[z],
                                        $ = parseFloat(n[z]) || 0,
                                        A = (parseFloat(Y) - $) * F + $;
                                    return (X[z] = A), X;
                                }, {})),
                            (P.current = W),
                            (P.position = q),
                            q === 1 && ((P.active = !1), (P.complete = !0)),
                            (0, vt.merge)(e, P)
                        );
                    }
                    return e;
                }),
                (lE = (e = Object.freeze({}), t) => {
                    switch (t.type) {
                        case x1:
                            return t.payload.ixInstances || Object.freeze({});
                        case S1:
                            return Object.freeze({});
                        case C1: {
                            let {
                                    instanceId: r,
                                    elementId: n,
                                    actionItem: i,
                                    eventId: o,
                                    eventTarget: a,
                                    eventStateKey: s,
                                    actionListId: u,
                                    groupIndex: d,
                                    isCarrier: h,
                                    origin: v,
                                    destination: g,
                                    immediate: b,
                                    verbose: O,
                                    continuous: T,
                                    parameterId: S,
                                    actionGroups: _,
                                    smoothing: N,
                                    restingValue: R,
                                    pluginInstance: q,
                                    pluginDuration: F,
                                    instanceDelay: P,
                                    skipMotion: W,
                                    skipToValue: X,
                                } = t.payload,
                                { actionTypeId: z } = i,
                                Y = F1(z),
                                $ = M1(Y, z),
                                G = Object.keys(g).filter(
                                    (M) =>
                                        g[M] != null && typeof g[M] != "string"
                                ),
                                { easing: A } = i.config;
                            return (0, vt.set)(e, r, {
                                id: r,
                                elementId: n,
                                active: !1,
                                position: 0,
                                start: 0,
                                origin: v,
                                destination: g,
                                destinationKeys: G,
                                immediate: b,
                                verbose: O,
                                current: null,
                                actionItem: i,
                                actionTypeId: z,
                                eventId: o,
                                eventTarget: a,
                                eventStateKey: s,
                                actionListId: u,
                                groupIndex: d,
                                renderType: Y,
                                isCarrier: h,
                                styleProp: $,
                                continuous: T,
                                parameterId: S,
                                actionGroups: _,
                                smoothing: N,
                                restingValue: R,
                                pluginInstance: q,
                                pluginDuration: F,
                                instanceDelay: P,
                                skipMotion: W,
                                skipToValue: X,
                                customEasingFn:
                                    Array.isArray(A) && A.length === 4
                                        ? P1(A)
                                        : void 0,
                            });
                        }
                        case R1: {
                            let { instanceId: r, time: n } = t.payload;
                            return (0, vt.mergeIn)(e, [r], {
                                active: !0,
                                complete: !1,
                                start: n,
                            });
                        }
                        case L1: {
                            let { instanceId: r } = t.payload;
                            if (!e[r]) return e;
                            let n = {},
                                i = Object.keys(e),
                                { length: o } = i;
                            for (let a = 0; a < o; a++) {
                                let s = i[a];
                                s !== r && (n[s] = e[s]);
                            }
                            return n;
                        }
                        case N1: {
                            let r = e,
                                n = Object.keys(e),
                                { length: i } = n;
                            for (let o = 0; o < i; o++) {
                                let a = n[o],
                                    s = e[a],
                                    u = s.continuous ? D1 : G1;
                                r = (0, vt.set)(r, a, u(s, t));
                            }
                            return r;
                        }
                        default:
                            return e;
                    }
                });
        });
    var k1,
        U1,
        V1,
        dE,
        pE = pe(() => {
            "use strict";
            Fe();
            ({
                IX2_RAW_DATA_IMPORTED: k1,
                IX2_SESSION_STOPPED: U1,
                IX2_PARAMETER_CHANGED: V1,
            } = _e),
                (dE = (e = {}, t) => {
                    switch (t.type) {
                        case k1:
                            return t.payload.ixParameters || {};
                        case U1:
                            return {};
                        case V1: {
                            let { key: r, value: n } = t.payload;
                            return (e[r] = n), e;
                        }
                        default:
                            return e;
                    }
                });
        });
    var hE = {};
    Pe(hE, { default: () => W1 });
    var gE,
        vE,
        B1,
        W1,
        EE = pe(() => {
            "use strict";
            gE = ae(Wo());
            Sf();
            Yf();
            Zf();
            vE = ae(Mt());
            fE();
            pE();
            ({ ixElements: B1 } = vE.IX2ElementsReducer),
                (W1 = (0, gE.combineReducers)({
                    ixData: xf,
                    ixRequest: Kf,
                    ixSession: Qf,
                    ixElements: B1,
                    ixInstances: lE,
                    ixParameters: dE,
                }));
        });
    var mE = c((BX, yE) => {
        var H1 = bt(),
            X1 = be(),
            j1 = dt(),
            z1 = "[object String]";
        function K1(e) {
            return typeof e == "string" || (!X1(e) && j1(e) && H1(e) == z1);
        }
        yE.exports = K1;
    });
    var bE = c((WX, _E) => {
        var Y1 = Ea(),
            $1 = Y1("length");
        _E.exports = $1;
    });
    var IE = c((HX, TE) => {
        var Q1 = "\\ud800-\\udfff",
            Z1 = "\\u0300-\\u036f",
            J1 = "\\ufe20-\\ufe2f",
            eD = "\\u20d0-\\u20ff",
            tD = Z1 + J1 + eD,
            rD = "\\ufe0e\\ufe0f",
            nD = "\\u200d",
            iD = RegExp("[" + nD + Q1 + tD + rD + "]");
        function oD(e) {
            return iD.test(e);
        }
        TE.exports = oD;
    });
    var NE = c((XX, LE) => {
        var wE = "\\ud800-\\udfff",
            aD = "\\u0300-\\u036f",
            sD = "\\ufe20-\\ufe2f",
            uD = "\\u20d0-\\u20ff",
            cD = aD + sD + uD,
            lD = "\\ufe0e\\ufe0f",
            fD = "[" + wE + "]",
            Ka = "[" + cD + "]",
            Ya = "\\ud83c[\\udffb-\\udfff]",
            dD = "(?:" + Ka + "|" + Ya + ")",
            AE = "[^" + wE + "]",
            xE = "(?:\\ud83c[\\udde6-\\uddff]){2}",
            SE = "[\\ud800-\\udbff][\\udc00-\\udfff]",
            pD = "\\u200d",
            CE = dD + "?",
            RE = "[" + lD + "]?",
            gD =
                "(?:" +
                pD +
                "(?:" +
                [AE, xE, SE].join("|") +
                ")" +
                RE +
                CE +
                ")*",
            vD = RE + CE + gD,
            hD = "(?:" + [AE + Ka + "?", Ka, xE, SE, fD].join("|") + ")",
            OE = RegExp(Ya + "(?=" + Ya + ")|" + hD + vD, "g");
        function ED(e) {
            for (var t = (OE.lastIndex = 0); OE.test(e); ) ++t;
            return t;
        }
        LE.exports = ED;
    });
    var qE = c((jX, PE) => {
        var yD = bE(),
            mD = IE(),
            _D = NE();
        function bD(e) {
            return mD(e) ? _D(e) : yD(e);
        }
        PE.exports = bD;
    });
    var ME = c((zX, FE) => {
        var TD = Vn(),
            ID = Bn(),
            OD = Lt(),
            wD = mE(),
            AD = qE(),
            xD = "[object Map]",
            SD = "[object Set]";
        function CD(e) {
            if (e == null) return 0;
            if (OD(e)) return wD(e) ? AD(e) : e.length;
            var t = ID(e);
            return t == xD || t == SD ? e.size : TD(e).length;
        }
        FE.exports = CD;
    });
    var GE = c((KX, DE) => {
        var RD = "Expected a function";
        function LD(e) {
            if (typeof e != "function") throw new TypeError(RD);
            return function () {
                var t = arguments;
                switch (t.length) {
                    case 0:
                        return !e.call(this);
                    case 1:
                        return !e.call(this, t[0]);
                    case 2:
                        return !e.call(this, t[0], t[1]);
                    case 3:
                        return !e.call(this, t[0], t[1], t[2]);
                }
                return !e.apply(this, t);
            };
        }
        DE.exports = LD;
    });
    var $a = c((YX, kE) => {
        var ND = Tt(),
            PD = (function () {
                try {
                    var e = ND(Object, "defineProperty");
                    return e({}, "", {}), e;
                } catch {}
            })();
        kE.exports = PD;
    });
    var Qa = c(($X, VE) => {
        var UE = $a();
        function qD(e, t, r) {
            t == "__proto__" && UE
                ? UE(e, t, {
                      configurable: !0,
                      enumerable: !0,
                      value: r,
                      writable: !0,
                  })
                : (e[t] = r);
        }
        VE.exports = qD;
    });
    var WE = c((QX, BE) => {
        var FD = Qa(),
            MD = Ln(),
            DD = Object.prototype,
            GD = DD.hasOwnProperty;
        function kD(e, t, r) {
            var n = e[t];
            (!(GD.call(e, t) && MD(n, r)) || (r === void 0 && !(t in e))) &&
                FD(e, t, r);
        }
        BE.exports = kD;
    });
    var jE = c((ZX, XE) => {
        var UD = WE(),
            VD = Ur(),
            BD = Dn(),
            HE = ot(),
            WD = rr();
        function HD(e, t, r, n) {
            if (!HE(e)) return e;
            t = VD(t, e);
            for (
                var i = -1, o = t.length, a = o - 1, s = e;
                s != null && ++i < o;

            ) {
                var u = WD(t[i]),
                    d = r;
                if (
                    u === "__proto__" ||
                    u === "constructor" ||
                    u === "prototype"
                )
                    return e;
                if (i != a) {
                    var h = s[u];
                    (d = n ? n(h, u, s) : void 0),
                        d === void 0 &&
                            (d = HE(h) ? h : BD(t[i + 1]) ? [] : {});
                }
                UD(s, u, d), (s = s[u]);
            }
            return e;
        }
        XE.exports = HD;
    });
    var KE = c((JX, zE) => {
        var XD = Xn(),
            jD = jE(),
            zD = Ur();
        function KD(e, t, r) {
            for (var n = -1, i = t.length, o = {}; ++n < i; ) {
                var a = t[n],
                    s = XD(e, a);
                r(s, a) && jD(o, zD(a, e), s);
            }
            return o;
        }
        zE.exports = KD;
    });
    var $E = c((ej, YE) => {
        var YD = Fn(),
            $D = Ro(),
            QD = ra(),
            ZD = ta(),
            JD = Object.getOwnPropertySymbols,
            e2 = JD
                ? function (e) {
                      for (var t = []; e; ) YD(t, QD(e)), (e = $D(e));
                      return t;
                  }
                : ZD;
        YE.exports = e2;
    });
    var ZE = c((tj, QE) => {
        function t2(e) {
            var t = [];
            if (e != null) for (var r in Object(e)) t.push(r);
            return t;
        }
        QE.exports = t2;
    });
    var ey = c((rj, JE) => {
        var r2 = ot(),
            n2 = Un(),
            i2 = ZE(),
            o2 = Object.prototype,
            a2 = o2.hasOwnProperty;
        function s2(e) {
            if (!r2(e)) return i2(e);
            var t = n2(e),
                r = [];
            for (var n in e)
                (n == "constructor" && (t || !a2.call(e, n))) || r.push(n);
            return r;
        }
        JE.exports = s2;
    });
    var ry = c((nj, ty) => {
        var u2 = ia(),
            c2 = ey(),
            l2 = Lt();
        function f2(e) {
            return l2(e) ? u2(e, !0) : c2(e);
        }
        ty.exports = f2;
    });
    var iy = c((ij, ny) => {
        var d2 = ea(),
            p2 = $E(),
            g2 = ry();
        function v2(e) {
            return d2(e, g2, p2);
        }
        ny.exports = v2;
    });
    var ay = c((oj, oy) => {
        var h2 = ha(),
            E2 = It(),
            y2 = KE(),
            m2 = iy();
        function _2(e, t) {
            if (e == null) return {};
            var r = h2(m2(e), function (n) {
                return [n];
            });
            return (
                (t = E2(t)),
                y2(e, r, function (n, i) {
                    return t(n, i[0]);
                })
            );
        }
        oy.exports = _2;
    });
    var uy = c((aj, sy) => {
        var b2 = It(),
            T2 = GE(),
            I2 = ay();
        function O2(e, t) {
            return I2(e, T2(b2(t)));
        }
        sy.exports = O2;
    });
    var ly = c((sj, cy) => {
        var w2 = Vn(),
            A2 = Bn(),
            x2 = qr(),
            S2 = be(),
            C2 = Lt(),
            R2 = Mn(),
            L2 = Un(),
            N2 = kn(),
            P2 = "[object Map]",
            q2 = "[object Set]",
            F2 = Object.prototype,
            M2 = F2.hasOwnProperty;
        function D2(e) {
            if (e == null) return !0;
            if (
                C2(e) &&
                (S2(e) ||
                    typeof e == "string" ||
                    typeof e.splice == "function" ||
                    R2(e) ||
                    N2(e) ||
                    x2(e))
            )
                return !e.length;
            var t = A2(e);
            if (t == P2 || t == q2) return !e.size;
            if (L2(e)) return !w2(e).length;
            for (var r in e) if (M2.call(e, r)) return !1;
            return !0;
        }
        cy.exports = D2;
    });
    var dy = c((uj, fy) => {
        var G2 = Qa(),
            k2 = Ga(),
            U2 = It();
        function V2(e, t) {
            var r = {};
            return (
                (t = U2(t, 3)),
                k2(e, function (n, i, o) {
                    G2(r, i, t(n, i, o));
                }),
                r
            );
        }
        fy.exports = V2;
    });
    var gy = c((cj, py) => {
        function B2(e, t) {
            for (
                var r = -1, n = e == null ? 0 : e.length;
                ++r < n && t(e[r], r, e) !== !1;

            );
            return e;
        }
        py.exports = B2;
    });
    var hy = c((lj, vy) => {
        var W2 = zn();
        function H2(e) {
            return typeof e == "function" ? e : W2;
        }
        vy.exports = H2;
    });
    var yy = c((fj, Ey) => {
        var X2 = gy(),
            j2 = ka(),
            z2 = hy(),
            K2 = be();
        function Y2(e, t) {
            var r = K2(e) ? X2 : j2;
            return r(e, z2(t));
        }
        Ey.exports = Y2;
    });
    var _y = c((dj, my) => {
        var $2 = ze(),
            Q2 = function () {
                return $2.Date.now();
            };
        my.exports = Q2;
    });
    var Iy = c((pj, Ty) => {
        var Z2 = ot(),
            Za = _y(),
            by = Kn(),
            J2 = "Expected a function",
            eG = Math.max,
            tG = Math.min;
        function rG(e, t, r) {
            var n,
                i,
                o,
                a,
                s,
                u,
                d = 0,
                h = !1,
                v = !1,
                g = !0;
            if (typeof e != "function") throw new TypeError(J2);
            (t = by(t) || 0),
                Z2(r) &&
                    ((h = !!r.leading),
                    (v = "maxWait" in r),
                    (o = v ? eG(by(r.maxWait) || 0, t) : o),
                    (g = "trailing" in r ? !!r.trailing : g));
            function b(P) {
                var W = n,
                    X = i;
                return (n = i = void 0), (d = P), (a = e.apply(X, W)), a;
            }
            function O(P) {
                return (d = P), (s = setTimeout(_, t)), h ? b(P) : a;
            }
            function T(P) {
                var W = P - u,
                    X = P - d,
                    z = t - W;
                return v ? tG(z, o - X) : z;
            }
            function S(P) {
                var W = P - u,
                    X = P - d;
                return u === void 0 || W >= t || W < 0 || (v && X >= o);
            }
            function _() {
                var P = Za();
                if (S(P)) return N(P);
                s = setTimeout(_, T(P));
            }
            function N(P) {
                return (s = void 0), g && n ? b(P) : ((n = i = void 0), a);
            }
            function R() {
                s !== void 0 && clearTimeout(s),
                    (d = 0),
                    (n = u = i = s = void 0);
            }
            function q() {
                return s === void 0 ? a : N(Za());
            }
            function F() {
                var P = Za(),
                    W = S(P);
                if (((n = arguments), (i = this), (u = P), W)) {
                    if (s === void 0) return O(u);
                    if (v) return clearTimeout(s), (s = setTimeout(_, t)), b(u);
                }
                return s === void 0 && (s = setTimeout(_, t)), a;
            }
            return (F.cancel = R), (F.flush = q), F;
        }
        Ty.exports = rG;
    });
    var wy = c((gj, Oy) => {
        var nG = Iy(),
            iG = ot(),
            oG = "Expected a function";
        function aG(e, t, r) {
            var n = !0,
                i = !0;
            if (typeof e != "function") throw new TypeError(oG);
            return (
                iG(r) &&
                    ((n = "leading" in r ? !!r.leading : n),
                    (i = "trailing" in r ? !!r.trailing : i)),
                nG(e, t, { leading: n, maxWait: t, trailing: i })
            );
        }
        Oy.exports = aG;
    });
    var xy = {};
    Pe(xy, {
        actionListPlaybackChanged: () => gr,
        animationFrameChanged: () => fi,
        clearRequested: () => LG,
        elementStateChanged: () => as,
        eventListenerAdded: () => li,
        eventStateChanged: () => ns,
        instanceAdded: () => is,
        instanceRemoved: () => os,
        instanceStarted: () => di,
        mediaQueriesDefined: () => us,
        parameterChanged: () => pr,
        playbackRequested: () => CG,
        previewRequested: () => SG,
        rawDataImported: () => Ja,
        sessionInitialized: () => es,
        sessionStarted: () => ts,
        sessionStopped: () => rs,
        stopRequested: () => RG,
        testFrameRendered: () => NG,
        viewportWidthChanged: () => ss,
    });
    var Ay,
        sG,
        uG,
        cG,
        lG,
        fG,
        dG,
        pG,
        gG,
        vG,
        hG,
        EG,
        yG,
        mG,
        _G,
        bG,
        TG,
        IG,
        OG,
        wG,
        AG,
        xG,
        Ja,
        es,
        ts,
        rs,
        SG,
        CG,
        RG,
        LG,
        li,
        NG,
        ns,
        fi,
        pr,
        is,
        di,
        os,
        as,
        gr,
        ss,
        us,
        pi = pe(() => {
            "use strict";
            Fe();
            (Ay = ae(Mt())),
                ({
                    IX2_RAW_DATA_IMPORTED: sG,
                    IX2_SESSION_INITIALIZED: uG,
                    IX2_SESSION_STARTED: cG,
                    IX2_SESSION_STOPPED: lG,
                    IX2_PREVIEW_REQUESTED: fG,
                    IX2_PLAYBACK_REQUESTED: dG,
                    IX2_STOP_REQUESTED: pG,
                    IX2_CLEAR_REQUESTED: gG,
                    IX2_EVENT_LISTENER_ADDED: vG,
                    IX2_TEST_FRAME_RENDERED: hG,
                    IX2_EVENT_STATE_CHANGED: EG,
                    IX2_ANIMATION_FRAME_CHANGED: yG,
                    IX2_PARAMETER_CHANGED: mG,
                    IX2_INSTANCE_ADDED: _G,
                    IX2_INSTANCE_STARTED: bG,
                    IX2_INSTANCE_REMOVED: TG,
                    IX2_ELEMENT_STATE_CHANGED: IG,
                    IX2_ACTION_LIST_PLAYBACK_CHANGED: OG,
                    IX2_VIEWPORT_WIDTH_CHANGED: wG,
                    IX2_MEDIA_QUERIES_DEFINED: AG,
                } = _e),
                ({ reifyState: xG } = Ay.IX2VanillaUtils),
                (Ja = (e) => ({ type: sG, payload: { ...xG(e) } })),
                (es = ({ hasBoundaryNodes: e, reducedMotion: t }) => ({
                    type: uG,
                    payload: { hasBoundaryNodes: e, reducedMotion: t },
                })),
                (ts = () => ({ type: cG })),
                (rs = () => ({ type: lG })),
                (SG = ({ rawData: e, defer: t }) => ({
                    type: fG,
                    payload: { defer: t, rawData: e },
                })),
                (CG = ({
                    actionTypeId: e = qe.GENERAL_START_ACTION,
                    actionListId: t,
                    actionItemId: r,
                    eventId: n,
                    allowEvents: i,
                    immediate: o,
                    testManual: a,
                    verbose: s,
                    rawData: u,
                }) => ({
                    type: dG,
                    payload: {
                        actionTypeId: e,
                        actionListId: t,
                        actionItemId: r,
                        testManual: a,
                        eventId: n,
                        allowEvents: i,
                        immediate: o,
                        verbose: s,
                        rawData: u,
                    },
                })),
                (RG = (e) => ({ type: pG, payload: { actionListId: e } })),
                (LG = () => ({ type: gG })),
                (li = (e, t) => ({
                    type: vG,
                    payload: { target: e, listenerParams: t },
                })),
                (NG = (e = 1) => ({ type: hG, payload: { step: e } })),
                (ns = (e, t) => ({
                    type: EG,
                    payload: { stateKey: e, newState: t },
                })),
                (fi = (e, t) => ({
                    type: yG,
                    payload: { now: e, parameters: t },
                })),
                (pr = (e, t) => ({ type: mG, payload: { key: e, value: t } })),
                (is = (e) => ({ type: _G, payload: { ...e } })),
                (di = (e, t) => ({
                    type: bG,
                    payload: { instanceId: e, time: t },
                })),
                (os = (e) => ({ type: TG, payload: { instanceId: e } })),
                (as = (e, t, r, n) => ({
                    type: IG,
                    payload: {
                        elementId: e,
                        actionTypeId: t,
                        current: r,
                        actionItem: n,
                    },
                })),
                (gr = ({ actionListId: e, isPlaying: t }) => ({
                    type: OG,
                    payload: { actionListId: e, isPlaying: t },
                })),
                (ss = ({ width: e, mediaQueries: t }) => ({
                    type: wG,
                    payload: { width: e, mediaQueries: t },
                })),
                (us = () => ({ type: AG }));
        });
    var Le = {};
    Pe(Le, {
        elementContains: () => fs,
        getChildElements: () => BG,
        getClosestElement: () => Qr,
        getProperty: () => DG,
        getQuerySelector: () => ls,
        getRefType: () => ds,
        getSiblingElements: () => WG,
        getStyle: () => MG,
        getValidDocument: () => kG,
        isSiblingNode: () => VG,
        matchSelector: () => GG,
        queryDocument: () => UG,
        setStyle: () => FG,
    });
    function FG(e, t, r) {
        e.style[t] = r;
    }
    function MG(e, t) {
        return t.startsWith("--")
            ? window
                  .getComputedStyle(document.documentElement)
                  .getPropertyValue(t)
            : e.style[t];
    }
    function DG(e, t) {
        return e[t];
    }
    function GG(e) {
        return (t) => t[cs](e);
    }
    function ls({ id: e, selector: t }) {
        if (e) {
            let r = e;
            if (e.indexOf(Sy) !== -1) {
                let n = e.split(Sy),
                    i = n[0];
                if (
                    ((r = n[1]),
                    i !== document.documentElement.getAttribute(Ry))
                )
                    return null;
            }
            return `[data-w-id="${r}"], [data-w-id^="${r}_instance"]`;
        }
        return t;
    }
    function kG(e) {
        return e == null || e === document.documentElement.getAttribute(Ry)
            ? document
            : null;
    }
    function UG(e, t) {
        return Array.prototype.slice.call(
            document.querySelectorAll(t ? e + " " + t : e)
        );
    }
    function fs(e, t) {
        return e.contains(t);
    }
    function VG(e, t) {
        return e !== t && e.parentNode === t.parentNode;
    }
    function BG(e) {
        let t = [];
        for (let r = 0, { length: n } = e || []; r < n; r++) {
            let { children: i } = e[r],
                { length: o } = i;
            if (o) for (let a = 0; a < o; a++) t.push(i[a]);
        }
        return t;
    }
    function WG(e = []) {
        let t = [],
            r = [];
        for (let n = 0, { length: i } = e; n < i; n++) {
            let { parentNode: o } = e[n];
            if (!o || !o.children || !o.children.length || r.indexOf(o) !== -1)
                continue;
            r.push(o);
            let a = o.firstElementChild;
            for (; a != null; )
                e.indexOf(a) === -1 && t.push(a), (a = a.nextElementSibling);
        }
        return t;
    }
    function ds(e) {
        return e != null && typeof e == "object"
            ? e instanceof Element
                ? PG
                : qG
            : null;
    }
    var Cy,
        cs,
        Sy,
        PG,
        qG,
        Ry,
        Qr,
        Ly = pe(() => {
            "use strict";
            Cy = ae(Mt());
            Fe();
            ({ ELEMENT_MATCHES: cs } = Cy.IX2BrowserSupport),
                ({
                    IX2_ID_DELIMITER: Sy,
                    HTML_ELEMENT: PG,
                    PLAIN_OBJECT: qG,
                    WF_PAGE: Ry,
                } = we);
            Qr = Element.prototype.closest
                ? (e, t) =>
                      document.documentElement.contains(e) ? e.closest(t) : null
                : (e, t) => {
                      if (!document.documentElement.contains(e)) return null;
                      let r = e;
                      do {
                          if (r[cs] && r[cs](t)) return r;
                          r = r.parentNode;
                      } while (r != null);
                      return null;
                  };
        });
    var ps = c((Ej, Py) => {
        var HG = ot(),
            Ny = Object.create,
            XG = (function () {
                function e() {}
                return function (t) {
                    if (!HG(t)) return {};
                    if (Ny) return Ny(t);
                    e.prototype = t;
                    var r = new e();
                    return (e.prototype = void 0), r;
                };
            })();
        Py.exports = XG;
    });
    var gi = c((yj, qy) => {
        function jG() {}
        qy.exports = jG;
    });
    var hi = c((mj, Fy) => {
        var zG = ps(),
            KG = gi();
        function vi(e, t) {
            (this.__wrapped__ = e),
                (this.__actions__ = []),
                (this.__chain__ = !!t),
                (this.__index__ = 0),
                (this.__values__ = void 0);
        }
        vi.prototype = zG(KG.prototype);
        vi.prototype.constructor = vi;
        Fy.exports = vi;
    });
    var ky = c((_j, Gy) => {
        var My = Xt(),
            YG = qr(),
            $G = be(),
            Dy = My ? My.isConcatSpreadable : void 0;
        function QG(e) {
            return $G(e) || YG(e) || !!(Dy && e && e[Dy]);
        }
        Gy.exports = QG;
    });
    var By = c((bj, Vy) => {
        var ZG = Fn(),
            JG = ky();
        function Uy(e, t, r, n, i) {
            var o = -1,
                a = e.length;
            for (r || (r = JG), i || (i = []); ++o < a; ) {
                var s = e[o];
                t > 0 && r(s)
                    ? t > 1
                        ? Uy(s, t - 1, r, n, i)
                        : ZG(i, s)
                    : n || (i[i.length] = s);
            }
            return i;
        }
        Vy.exports = Uy;
    });
    var Hy = c((Tj, Wy) => {
        var ek = By();
        function tk(e) {
            var t = e == null ? 0 : e.length;
            return t ? ek(e, 1) : [];
        }
        Wy.exports = tk;
    });
    var jy = c((Ij, Xy) => {
        function rk(e, t, r) {
            switch (r.length) {
                case 0:
                    return e.call(t);
                case 1:
                    return e.call(t, r[0]);
                case 2:
                    return e.call(t, r[0], r[1]);
                case 3:
                    return e.call(t, r[0], r[1], r[2]);
            }
            return e.apply(t, r);
        }
        Xy.exports = rk;
    });
    var Yy = c((Oj, Ky) => {
        var nk = jy(),
            zy = Math.max;
        function ik(e, t, r) {
            return (
                (t = zy(t === void 0 ? e.length - 1 : t, 0)),
                function () {
                    for (
                        var n = arguments,
                            i = -1,
                            o = zy(n.length - t, 0),
                            a = Array(o);
                        ++i < o;

                    )
                        a[i] = n[t + i];
                    i = -1;
                    for (var s = Array(t + 1); ++i < t; ) s[i] = n[i];
                    return (s[t] = r(a)), nk(e, this, s);
                }
            );
        }
        Ky.exports = ik;
    });
    var Qy = c((wj, $y) => {
        function ok(e) {
            return function () {
                return e;
            };
        }
        $y.exports = ok;
    });
    var em = c((Aj, Jy) => {
        var ak = Qy(),
            Zy = $a(),
            sk = zn(),
            uk = Zy
                ? function (e, t) {
                      return Zy(e, "toString", {
                          configurable: !0,
                          enumerable: !1,
                          value: ak(t),
                          writable: !0,
                      });
                  }
                : sk;
        Jy.exports = uk;
    });
    var rm = c((xj, tm) => {
        var ck = 800,
            lk = 16,
            fk = Date.now;
        function dk(e) {
            var t = 0,
                r = 0;
            return function () {
                var n = fk(),
                    i = lk - (n - r);
                if (((r = n), i > 0)) {
                    if (++t >= ck) return arguments[0];
                } else t = 0;
                return e.apply(void 0, arguments);
            };
        }
        tm.exports = dk;
    });
    var im = c((Sj, nm) => {
        var pk = em(),
            gk = rm(),
            vk = gk(pk);
        nm.exports = vk;
    });
    var am = c((Cj, om) => {
        var hk = Hy(),
            Ek = Yy(),
            yk = im();
        function mk(e) {
            return yk(Ek(e, void 0, hk), e + "");
        }
        om.exports = mk;
    });
    var cm = c((Rj, um) => {
        var sm = oa(),
            _k = sm && new sm();
        um.exports = _k;
    });
    var fm = c((Lj, lm) => {
        function bk() {}
        lm.exports = bk;
    });
    var gs = c((Nj, pm) => {
        var dm = cm(),
            Tk = fm(),
            Ik = dm
                ? function (e) {
                      return dm.get(e);
                  }
                : Tk;
        pm.exports = Ik;
    });
    var vm = c((Pj, gm) => {
        var Ok = {};
        gm.exports = Ok;
    });
    var vs = c((qj, Em) => {
        var hm = vm(),
            wk = Object.prototype,
            Ak = wk.hasOwnProperty;
        function xk(e) {
            for (
                var t = e.name + "",
                    r = hm[t],
                    n = Ak.call(hm, t) ? r.length : 0;
                n--;

            ) {
                var i = r[n],
                    o = i.func;
                if (o == null || o == e) return i.name;
            }
            return t;
        }
        Em.exports = xk;
    });
    var yi = c((Fj, ym) => {
        var Sk = ps(),
            Ck = gi(),
            Rk = 4294967295;
        function Ei(e) {
            (this.__wrapped__ = e),
                (this.__actions__ = []),
                (this.__dir__ = 1),
                (this.__filtered__ = !1),
                (this.__iteratees__ = []),
                (this.__takeCount__ = Rk),
                (this.__views__ = []);
        }
        Ei.prototype = Sk(Ck.prototype);
        Ei.prototype.constructor = Ei;
        ym.exports = Ei;
    });
    var _m = c((Mj, mm) => {
        function Lk(e, t) {
            var r = -1,
                n = e.length;
            for (t || (t = Array(n)); ++r < n; ) t[r] = e[r];
            return t;
        }
        mm.exports = Lk;
    });
    var Tm = c((Dj, bm) => {
        var Nk = yi(),
            Pk = hi(),
            qk = _m();
        function Fk(e) {
            if (e instanceof Nk) return e.clone();
            var t = new Pk(e.__wrapped__, e.__chain__);
            return (
                (t.__actions__ = qk(e.__actions__)),
                (t.__index__ = e.__index__),
                (t.__values__ = e.__values__),
                t
            );
        }
        bm.exports = Fk;
    });
    var wm = c((Gj, Om) => {
        var Mk = yi(),
            Im = hi(),
            Dk = gi(),
            Gk = be(),
            kk = dt(),
            Uk = Tm(),
            Vk = Object.prototype,
            Bk = Vk.hasOwnProperty;
        function mi(e) {
            if (kk(e) && !Gk(e) && !(e instanceof Mk)) {
                if (e instanceof Im) return e;
                if (Bk.call(e, "__wrapped__")) return Uk(e);
            }
            return new Im(e);
        }
        mi.prototype = Dk.prototype;
        mi.prototype.constructor = mi;
        Om.exports = mi;
    });
    var xm = c((kj, Am) => {
        var Wk = yi(),
            Hk = gs(),
            Xk = vs(),
            jk = wm();
        function zk(e) {
            var t = Xk(e),
                r = jk[t];
            if (typeof r != "function" || !(t in Wk.prototype)) return !1;
            if (e === r) return !0;
            var n = Hk(r);
            return !!n && e === n[0];
        }
        Am.exports = zk;
    });
    var Lm = c((Uj, Rm) => {
        var Sm = hi(),
            Kk = am(),
            Yk = gs(),
            hs = vs(),
            $k = be(),
            Cm = xm(),
            Qk = "Expected a function",
            Zk = 8,
            Jk = 32,
            eU = 128,
            tU = 256;
        function rU(e) {
            return Kk(function (t) {
                var r = t.length,
                    n = r,
                    i = Sm.prototype.thru;
                for (e && t.reverse(); n--; ) {
                    var o = t[n];
                    if (typeof o != "function") throw new TypeError(Qk);
                    if (i && !a && hs(o) == "wrapper") var a = new Sm([], !0);
                }
                for (n = a ? n : r; ++n < r; ) {
                    o = t[n];
                    var s = hs(o),
                        u = s == "wrapper" ? Yk(o) : void 0;
                    u &&
                    Cm(u[0]) &&
                    u[1] == (eU | Zk | Jk | tU) &&
                    !u[4].length &&
                    u[9] == 1
                        ? (a = a[hs(u[0])].apply(a, u[3]))
                        : (a = o.length == 1 && Cm(o) ? a[s]() : a.thru(o));
                }
                return function () {
                    var d = arguments,
                        h = d[0];
                    if (a && d.length == 1 && $k(h)) return a.plant(h).value();
                    for (var v = 0, g = r ? t[v].apply(this, d) : h; ++v < r; )
                        g = t[v].call(this, g);
                    return g;
                };
            });
        }
        Rm.exports = rU;
    });
    var Pm = c((Vj, Nm) => {
        var nU = Lm(),
            iU = nU();
        Nm.exports = iU;
    });
    var Fm = c((Bj, qm) => {
        function oU(e, t, r) {
            return (
                e === e &&
                    (r !== void 0 && (e = e <= r ? e : r),
                    t !== void 0 && (e = e >= t ? e : t)),
                e
            );
        }
        qm.exports = oU;
    });
    var Dm = c((Wj, Mm) => {
        var aU = Fm(),
            Es = Kn();
        function sU(e, t, r) {
            return (
                r === void 0 && ((r = t), (t = void 0)),
                r !== void 0 && ((r = Es(r)), (r = r === r ? r : 0)),
                t !== void 0 && ((t = Es(t)), (t = t === t ? t : 0)),
                aU(Es(e), t, r)
            );
        }
        Mm.exports = sU;
    });
    var jm,
        zm,
        Km,
        Ym,
        uU,
        cU,
        lU,
        fU,
        dU,
        pU,
        gU,
        vU,
        hU,
        EU,
        yU,
        mU,
        _U,
        bU,
        TU,
        $m,
        Qm,
        IU,
        OU,
        wU,
        Zm,
        AU,
        xU,
        Jm,
        SU,
        ys,
        e_,
        Gm,
        km,
        t_,
        Jr,
        CU,
        ut,
        r_,
        RU,
        De,
        $e,
        en,
        n_,
        ms,
        Um,
        _s,
        LU,
        Zr,
        NU,
        PU,
        qU,
        i_,
        Vm,
        FU,
        Bm,
        MU,
        DU,
        GU,
        Wm,
        _i,
        bi,
        Hm,
        Xm,
        o_,
        a_ = pe(() => {
            "use strict";
            (jm = ae(Pm())), (zm = ae(jn())), (Km = ae(Dm()));
            Fe();
            bs();
            pi();
            (Ym = ae(Mt())),
                ({
                    MOUSE_CLICK: uU,
                    MOUSE_SECOND_CLICK: cU,
                    MOUSE_DOWN: lU,
                    MOUSE_UP: fU,
                    MOUSE_OVER: dU,
                    MOUSE_OUT: pU,
                    DROPDOWN_CLOSE: gU,
                    DROPDOWN_OPEN: vU,
                    SLIDER_ACTIVE: hU,
                    SLIDER_INACTIVE: EU,
                    TAB_ACTIVE: yU,
                    TAB_INACTIVE: mU,
                    NAVBAR_CLOSE: _U,
                    NAVBAR_OPEN: bU,
                    MOUSE_MOVE: TU,
                    PAGE_SCROLL_DOWN: $m,
                    SCROLL_INTO_VIEW: Qm,
                    SCROLL_OUT_OF_VIEW: IU,
                    PAGE_SCROLL_UP: OU,
                    SCROLLING_IN_VIEW: wU,
                    PAGE_FINISH: Zm,
                    ECOMMERCE_CART_CLOSE: AU,
                    ECOMMERCE_CART_OPEN: xU,
                    PAGE_START: Jm,
                    PAGE_SCROLL: SU,
                } = Ke),
                (ys = "COMPONENT_ACTIVE"),
                (e_ = "COMPONENT_INACTIVE"),
                ({ COLON_DELIMITER: Gm } = we),
                ({ getNamespacedParameterId: km } = Ym.IX2VanillaUtils),
                (t_ = (e) => (t) => typeof t == "object" && e(t) ? !0 : t),
                (Jr = t_(({ element: e, nativeEvent: t }) => e === t.target)),
                (CU = t_(({ element: e, nativeEvent: t }) =>
                    e.contains(t.target)
                )),
                (ut = (0, jm.default)([Jr, CU])),
                (r_ = (e, t) => {
                    if (t) {
                        let { ixData: r } = e.getState(),
                            { events: n } = r,
                            i = n[t];
                        if (i && !LU[i.eventTypeId]) return i;
                    }
                    return null;
                }),
                (RU = ({ store: e, event: t }) => {
                    let { action: r } = t,
                        { autoStopEventId: n } = r.config;
                    return !!r_(e, n);
                }),
                (De = (
                    { store: e, event: t, element: r, eventStateKey: n },
                    i
                ) => {
                    let { action: o, id: a } = t,
                        { actionListId: s, autoStopEventId: u } = o.config,
                        d = r_(e, u);
                    return (
                        d &&
                            vr({
                                store: e,
                                eventId: u,
                                eventTarget: r,
                                eventStateKey: u + Gm + n.split(Gm)[1],
                                actionListId: (0, zm.default)(
                                    d,
                                    "action.config.actionListId"
                                ),
                            }),
                        vr({
                            store: e,
                            eventId: a,
                            eventTarget: r,
                            eventStateKey: n,
                            actionListId: s,
                        }),
                        tn({
                            store: e,
                            eventId: a,
                            eventTarget: r,
                            eventStateKey: n,
                            actionListId: s,
                        }),
                        i
                    );
                }),
                ($e = (e, t) => (r, n) => e(r, n) === !0 ? t(r, n) : n),
                (en = { handler: $e(ut, De) }),
                (n_ = { ...en, types: [ys, e_].join(" ") }),
                (ms = [
                    {
                        target: window,
                        types: "resize orientationchange",
                        throttle: !0,
                    },
                    {
                        target: document,
                        types: "scroll wheel readystatechange IX2_PAGE_UPDATE",
                        throttle: !0,
                    },
                ]),
                (Um = "mouseover mouseout"),
                (_s = { types: ms }),
                (LU = { PAGE_START: Jm, PAGE_FINISH: Zm }),
                (Zr = (() => {
                    let e = window.pageXOffset !== void 0,
                        r =
                            document.compatMode === "CSS1Compat"
                                ? document.documentElement
                                : document.body;
                    return () => ({
                        scrollLeft: e ? window.pageXOffset : r.scrollLeft,
                        scrollTop: e ? window.pageYOffset : r.scrollTop,
                        stiffScrollTop: (0, Km.default)(
                            e ? window.pageYOffset : r.scrollTop,
                            0,
                            r.scrollHeight - window.innerHeight
                        ),
                        scrollWidth: r.scrollWidth,
                        scrollHeight: r.scrollHeight,
                        clientWidth: r.clientWidth,
                        clientHeight: r.clientHeight,
                        innerWidth: window.innerWidth,
                        innerHeight: window.innerHeight,
                    });
                })()),
                (NU = (e, t) =>
                    !(
                        e.left > t.right ||
                        e.right < t.left ||
                        e.top > t.bottom ||
                        e.bottom < t.top
                    )),
                (PU = ({ element: e, nativeEvent: t }) => {
                    let { type: r, target: n, relatedTarget: i } = t,
                        o = e.contains(n);
                    if (r === "mouseover" && o) return !0;
                    let a = e.contains(i);
                    return !!(r === "mouseout" && o && a);
                }),
                (qU = (e) => {
                    let {
                            element: t,
                            event: { config: r },
                        } = e,
                        { clientWidth: n, clientHeight: i } = Zr(),
                        o = r.scrollOffsetValue,
                        u =
                            r.scrollOffsetUnit === "PX"
                                ? o
                                : (i * (o || 0)) / 100;
                    return NU(t.getBoundingClientRect(), {
                        left: 0,
                        top: u,
                        right: n,
                        bottom: i - u,
                    });
                }),
                (i_ = (e) => (t, r) => {
                    let { type: n } = t.nativeEvent,
                        i = [ys, e_].indexOf(n) !== -1 ? n === ys : r.isActive,
                        o = { ...r, isActive: i };
                    return ((!r || o.isActive !== r.isActive) && e(t, o)) || o;
                }),
                (Vm = (e) => (t, r) => {
                    let n = { elementHovered: PU(t) };
                    return (
                        ((r
                            ? n.elementHovered !== r.elementHovered
                            : n.elementHovered) &&
                            e(t, n)) ||
                        n
                    );
                }),
                (FU = (e) => (t, r) => {
                    let n = { ...r, elementVisible: qU(t) };
                    return (
                        ((r
                            ? n.elementVisible !== r.elementVisible
                            : n.elementVisible) &&
                            e(t, n)) ||
                        n
                    );
                }),
                (Bm =
                    (e) =>
                    (t, r = {}) => {
                        let {
                                stiffScrollTop: n,
                                scrollHeight: i,
                                innerHeight: o,
                            } = Zr(),
                            {
                                event: { config: a, eventTypeId: s },
                            } = t,
                            { scrollOffsetValue: u, scrollOffsetUnit: d } = a,
                            h = d === "PX",
                            v = i - o,
                            g = Number((n / v).toFixed(2));
                        if (r && r.percentTop === g) return r;
                        let b = (h ? u : (o * (u || 0)) / 100) / v,
                            O,
                            T,
                            S = 0;
                        r &&
                            ((O = g > r.percentTop),
                            (T = r.scrollingDown !== O),
                            (S = T ? g : r.anchorTop));
                        let _ = s === $m ? g >= S + b : g <= S - b,
                            N = {
                                ...r,
                                percentTop: g,
                                inBounds: _,
                                anchorTop: S,
                                scrollingDown: O,
                            };
                        return (
                            (r &&
                                _ &&
                                (T || N.inBounds !== r.inBounds) &&
                                e(t, N)) ||
                            N
                        );
                    }),
                (MU = (e, t) =>
                    e.left > t.left &&
                    e.left < t.right &&
                    e.top > t.top &&
                    e.top < t.bottom),
                (DU = (e) => (t, r) => {
                    let n = { finished: document.readyState === "complete" };
                    return n.finished && !(r && r.finshed) && e(t), n;
                }),
                (GU = (e) => (t, r) => {
                    let n = { started: !0 };
                    return r || e(t), n;
                }),
                (Wm =
                    (e) =>
                    (t, r = { clickCount: 0 }) => {
                        let n = { clickCount: (r.clickCount % 2) + 1 };
                        return (n.clickCount !== r.clickCount && e(t, n)) || n;
                    }),
                (_i = (e = !0) => ({
                    ...n_,
                    handler: $e(
                        e ? ut : Jr,
                        i_((t, r) => (r.isActive ? en.handler(t, r) : r))
                    ),
                })),
                (bi = (e = !0) => ({
                    ...n_,
                    handler: $e(
                        e ? ut : Jr,
                        i_((t, r) => (r.isActive ? r : en.handler(t, r)))
                    ),
                })),
                (Hm = {
                    ..._s,
                    handler: FU((e, t) => {
                        let { elementVisible: r } = t,
                            { event: n, store: i } = e,
                            { ixData: o } = i.getState(),
                            { events: a } = o;
                        return !a[n.action.config.autoStopEventId] &&
                            t.triggered
                            ? t
                            : (n.eventTypeId === Qm) === r
                            ? (De(e), { ...t, triggered: !0 })
                            : t;
                    }),
                }),
                (Xm = 0.05),
                (o_ = {
                    [hU]: _i(),
                    [EU]: bi(),
                    [vU]: _i(),
                    [gU]: bi(),
                    [bU]: _i(!1),
                    [_U]: bi(!1),
                    [yU]: _i(),
                    [mU]: bi(),
                    [xU]: { types: "ecommerce-cart-open", handler: $e(ut, De) },
                    [AU]: {
                        types: "ecommerce-cart-close",
                        handler: $e(ut, De),
                    },
                    [uU]: {
                        types: "click",
                        handler: $e(
                            ut,
                            Wm((e, { clickCount: t }) => {
                                RU(e) ? t === 1 && De(e) : De(e);
                            })
                        ),
                    },
                    [cU]: {
                        types: "click",
                        handler: $e(
                            ut,
                            Wm((e, { clickCount: t }) => {
                                t === 2 && De(e);
                            })
                        ),
                    },
                    [lU]: { ...en, types: "mousedown" },
                    [fU]: { ...en, types: "mouseup" },
                    [dU]: {
                        types: Um,
                        handler: $e(
                            ut,
                            Vm((e, t) => {
                                t.elementHovered && De(e);
                            })
                        ),
                    },
                    [pU]: {
                        types: Um,
                        handler: $e(
                            ut,
                            Vm((e, t) => {
                                t.elementHovered || De(e);
                            })
                        ),
                    },
                    [TU]: {
                        types: "mousemove mouseout scroll",
                        handler: (
                            {
                                store: e,
                                element: t,
                                eventConfig: r,
                                nativeEvent: n,
                                eventStateKey: i,
                            },
                            o = { clientX: 0, clientY: 0, pageX: 0, pageY: 0 }
                        ) => {
                            let {
                                    basedOn: a,
                                    selectedAxis: s,
                                    continuousParameterGroupId: u,
                                    reverse: d,
                                    restingState: h = 0,
                                } = r,
                                {
                                    clientX: v = o.clientX,
                                    clientY: g = o.clientY,
                                    pageX: b = o.pageX,
                                    pageY: O = o.pageY,
                                } = n,
                                T = s === "X_AXIS",
                                S = n.type === "mouseout",
                                _ = h / 100,
                                N = u,
                                R = !1;
                            switch (a) {
                                case it.VIEWPORT: {
                                    _ = T
                                        ? Math.min(v, window.innerWidth) /
                                          window.innerWidth
                                        : Math.min(g, window.innerHeight) /
                                          window.innerHeight;
                                    break;
                                }
                                case it.PAGE: {
                                    let {
                                        scrollLeft: q,
                                        scrollTop: F,
                                        scrollWidth: P,
                                        scrollHeight: W,
                                    } = Zr();
                                    _ = T
                                        ? Math.min(q + b, P) / P
                                        : Math.min(F + O, W) / W;
                                    break;
                                }
                                case it.ELEMENT:
                                default: {
                                    N = km(i, u);
                                    let q = n.type.indexOf("mouse") === 0;
                                    if (
                                        q &&
                                        ut({ element: t, nativeEvent: n }) !==
                                            !0
                                    )
                                        break;
                                    let F = t.getBoundingClientRect(),
                                        {
                                            left: P,
                                            top: W,
                                            width: X,
                                            height: z,
                                        } = F;
                                    if (!q && !MU({ left: v, top: g }, F))
                                        break;
                                    (R = !0),
                                        (_ = T ? (v - P) / X : (g - W) / z);
                                    break;
                                }
                            }
                            return (
                                S &&
                                    (_ > 1 - Xm || _ < Xm) &&
                                    (_ = Math.round(_)),
                                (a !== it.ELEMENT ||
                                    R ||
                                    R !== o.elementHovered) &&
                                    ((_ = d ? 1 - _ : _), e.dispatch(pr(N, _))),
                                {
                                    elementHovered: R,
                                    clientX: v,
                                    clientY: g,
                                    pageX: b,
                                    pageY: O,
                                }
                            );
                        },
                    },
                    [SU]: {
                        types: ms,
                        handler: ({ store: e, eventConfig: t }) => {
                            let { continuousParameterGroupId: r, reverse: n } =
                                    t,
                                {
                                    scrollTop: i,
                                    scrollHeight: o,
                                    clientHeight: a,
                                } = Zr(),
                                s = i / (o - a);
                            (s = n ? 1 - s : s), e.dispatch(pr(r, s));
                        },
                    },
                    [wU]: {
                        types: ms,
                        handler: (
                            {
                                element: e,
                                store: t,
                                eventConfig: r,
                                eventStateKey: n,
                            },
                            i = { scrollPercent: 0 }
                        ) => {
                            let {
                                    scrollLeft: o,
                                    scrollTop: a,
                                    scrollWidth: s,
                                    scrollHeight: u,
                                    clientHeight: d,
                                } = Zr(),
                                {
                                    basedOn: h,
                                    selectedAxis: v,
                                    continuousParameterGroupId: g,
                                    startsEntering: b,
                                    startsExiting: O,
                                    addEndOffset: T,
                                    addStartOffset: S,
                                    addOffsetValue: _ = 0,
                                    endOffsetValue: N = 0,
                                } = r,
                                R = v === "X_AXIS";
                            if (h === it.VIEWPORT) {
                                let q = R ? o / s : a / u;
                                return (
                                    q !== i.scrollPercent &&
                                        t.dispatch(pr(g, q)),
                                    { scrollPercent: q }
                                );
                            } else {
                                let q = km(n, g),
                                    F = e.getBoundingClientRect(),
                                    P = (S ? _ : 0) / 100,
                                    W = (T ? N : 0) / 100;
                                (P = b ? P : 1 - P), (W = O ? W : 1 - W);
                                let X = F.top + Math.min(F.height * P, d),
                                    Y = F.top + F.height * W - X,
                                    $ = Math.min(d + Y, u),
                                    A = Math.min(Math.max(0, d - X), $) / $;
                                return (
                                    A !== i.scrollPercent &&
                                        t.dispatch(pr(q, A)),
                                    { scrollPercent: A }
                                );
                            }
                        },
                    },
                    [Qm]: Hm,
                    [IU]: Hm,
                    [$m]: {
                        ..._s,
                        handler: Bm((e, t) => {
                            t.scrollingDown && De(e);
                        }),
                    },
                    [OU]: {
                        ..._s,
                        handler: Bm((e, t) => {
                            t.scrollingDown || De(e);
                        }),
                    },
                    [Zm]: {
                        types: "readystatechange IX2_PAGE_UPDATE",
                        handler: $e(Jr, DU(De)),
                    },
                    [Jm]: {
                        types: "readystatechange IX2_PAGE_UPDATE",
                        handler: $e(Jr, GU(De)),
                    },
                });
        });
    var I_ = {};
    Pe(I_, {
        observeRequests: () => iV,
        startActionGroup: () => tn,
        startEngine: () => xi,
        stopActionGroup: () => vr,
        stopAllActionGroups: () => __,
        stopEngine: () => Si,
    });
    function iV(e) {
        Dt({ store: e, select: ({ ixRequest: t }) => t.preview, onChange: sV }),
            Dt({
                store: e,
                select: ({ ixRequest: t }) => t.playback,
                onChange: uV,
            }),
            Dt({
                store: e,
                select: ({ ixRequest: t }) => t.stop,
                onChange: cV,
            }),
            Dt({
                store: e,
                select: ({ ixRequest: t }) => t.clear,
                onChange: lV,
            });
    }
    function oV(e) {
        Dt({
            store: e,
            select: ({ ixSession: t }) => t.mediaQueryKey,
            onChange: () => {
                Si(e),
                    h_({ store: e, elementApi: Le }),
                    xi({ store: e, allowEvents: !0 }),
                    E_();
            },
        });
    }
    function aV(e, t) {
        let r = Dt({
            store: e,
            select: ({ ixSession: n }) => n.tick,
            onChange: (n) => {
                t(n), r();
            },
        });
    }
    function sV({ rawData: e, defer: t }, r) {
        let n = () => {
            xi({ store: r, rawData: e, allowEvents: !0 }), E_();
        };
        t ? setTimeout(n, 0) : n();
    }
    function E_() {
        document.dispatchEvent(new CustomEvent("IX2_PAGE_UPDATE"));
    }
    function uV(e, t) {
        let {
                actionTypeId: r,
                actionListId: n,
                actionItemId: i,
                eventId: o,
                allowEvents: a,
                immediate: s,
                testManual: u,
                verbose: d = !0,
            } = e,
            { rawData: h } = e;
        if (n && i && h && s) {
            let v = h.actionLists[n];
            v && (h = zU({ actionList: v, actionItemId: i, rawData: h }));
        }
        if (
            (xi({ store: t, rawData: h, allowEvents: a, testManual: u }),
            (n && r === qe.GENERAL_START_ACTION) || Ts(r))
        ) {
            vr({ store: t, actionListId: n }),
                m_({ store: t, actionListId: n, eventId: o });
            let v = tn({
                store: t,
                eventId: o,
                actionListId: n,
                immediate: s,
                verbose: d,
            });
            d && v && t.dispatch(gr({ actionListId: n, isPlaying: !s }));
        }
    }
    function cV({ actionListId: e }, t) {
        e ? vr({ store: t, actionListId: e }) : __({ store: t }), Si(t);
    }
    function lV(e, t) {
        Si(t), h_({ store: t, elementApi: Le });
    }
    function xi({ store: e, rawData: t, allowEvents: r, testManual: n }) {
        let { ixSession: i } = e.getState();
        t && e.dispatch(Ja(t)),
            i.active ||
                (e.dispatch(
                    es({
                        hasBoundaryNodes: !!document.querySelector(Ii),
                        reducedMotion:
                            document.body.hasAttribute("data-wf-ix-vacation") &&
                            window.matchMedia("(prefers-reduced-motion)")
                                .matches,
                    })
                ),
                r &&
                    (hV(e),
                    fV(),
                    e.getState().ixSession.hasDefinedMediaQueries && oV(e)),
                e.dispatch(ts()),
                dV(e, n));
    }
    function fV() {
        let { documentElement: e } = document;
        e.className.indexOf(s_) === -1 && (e.className += ` ${s_}`);
    }
    function dV(e, t) {
        let r = (n) => {
            let { ixSession: i, ixParameters: o } = e.getState();
            i.active &&
                (e.dispatch(fi(n, o)), t ? aV(e, r) : requestAnimationFrame(r));
        };
        r(window.performance.now());
    }
    function Si(e) {
        let { ixSession: t } = e.getState();
        if (t.active) {
            let { eventListeners: r } = t;
            r.forEach(pV), QU(), e.dispatch(rs());
        }
    }
    function pV({ target: e, listenerParams: t }) {
        e.removeEventListener.apply(e, t);
    }
    function gV({
        store: e,
        eventStateKey: t,
        eventTarget: r,
        eventId: n,
        eventConfig: i,
        actionListId: o,
        parameterGroup: a,
        smoothing: s,
        restingValue: u,
    }) {
        let { ixData: d, ixSession: h } = e.getState(),
            { events: v } = d,
            g = v[n],
            { eventTypeId: b } = g,
            O = {},
            T = {},
            S = [],
            { continuousActionGroups: _ } = a,
            { id: N } = a;
        KU(b, i) && (N = YU(t, N));
        let R = h.hasBoundaryNodes && r ? Qr(r, Ii) : null;
        _.forEach((q) => {
            let { keyframe: F, actionItems: P } = q;
            P.forEach((W) => {
                let { actionTypeId: X } = W,
                    { target: z } = W.config;
                if (!z) return;
                let Y = z.boundaryMode ? R : null,
                    $ = ZU(z) + Is + X;
                if (((T[$] = vV(T[$], F, W)), !O[$])) {
                    O[$] = !0;
                    let { config: G } = W;
                    Oi({
                        config: G,
                        event: g,
                        eventTarget: r,
                        elementRoot: Y,
                        elementApi: Le,
                    }).forEach((A) => {
                        S.push({ element: A, key: $ });
                    });
                }
            });
        }),
            S.forEach(({ element: q, key: F }) => {
                let P = T[F],
                    W = (0, ht.default)(P, "[0].actionItems[0]", {}),
                    { actionTypeId: X } = W,
                    z = Ai(X) ? ws(X)(q, W) : null,
                    Y = Os({ element: q, actionItem: W, elementApi: Le }, z);
                As({
                    store: e,
                    element: q,
                    eventId: n,
                    actionListId: o,
                    actionItem: W,
                    destination: Y,
                    continuous: !0,
                    parameterId: N,
                    actionGroups: P,
                    smoothing: s,
                    restingValue: u,
                    pluginInstance: z,
                });
            });
    }
    function vV(e = [], t, r) {
        let n = [...e],
            i;
        return (
            n.some((o, a) => (o.keyframe === t ? ((i = a), !0) : !1)),
            i == null &&
                ((i = n.length), n.push({ keyframe: t, actionItems: [] })),
            n[i].actionItems.push(r),
            n
        );
    }
    function hV(e) {
        let { ixData: t } = e.getState(),
            { eventTypeMap: r } = t;
        y_(e),
            (0, hr.default)(r, (i, o) => {
                let a = o_[o];
                if (!a) {
                    console.warn(`IX2 event type not configured: ${o}`);
                    return;
                }
                TV({ logic: a, store: e, events: i });
            });
        let { ixSession: n } = e.getState();
        n.eventListeners.length && yV(e);
    }
    function yV(e) {
        let t = () => {
            y_(e);
        };
        EV.forEach((r) => {
            window.addEventListener(r, t), e.dispatch(li(window, [r, t]));
        }),
            t();
    }
    function y_(e) {
        let { ixSession: t, ixData: r } = e.getState(),
            n = window.innerWidth;
        if (n !== t.viewportWidth) {
            let { mediaQueries: i } = r;
            e.dispatch(ss({ width: n, mediaQueries: i }));
        }
    }
    function TV({ logic: e, store: t, events: r }) {
        IV(r);
        let { types: n, handler: i } = e,
            { ixData: o } = t.getState(),
            { actionLists: a } = o,
            s = mV(r, bV);
        if (!(0, l_.default)(s)) return;
        (0, hr.default)(s, (v, g) => {
            let b = r[g],
                { action: O, id: T, mediaQueries: S = o.mediaQueryKeys } = b,
                { actionListId: _ } = O.config;
            JU(S, o.mediaQueryKeys) || t.dispatch(us()),
                O.actionTypeId === qe.GENERAL_CONTINUOUS_ACTION &&
                    (Array.isArray(b.config) ? b.config : [b.config]).forEach(
                        (R) => {
                            let { continuousParameterGroupId: q } = R,
                                F = (0, ht.default)(
                                    a,
                                    `${_}.continuousParameterGroups`,
                                    []
                                ),
                                P = (0, c_.default)(F, ({ id: z }) => z === q),
                                W = (R.smoothing || 0) / 100,
                                X = (R.restingState || 0) / 100;
                            P &&
                                v.forEach((z, Y) => {
                                    let $ = T + Is + Y;
                                    gV({
                                        store: t,
                                        eventStateKey: $,
                                        eventTarget: z,
                                        eventId: T,
                                        eventConfig: R,
                                        actionListId: _,
                                        parameterGroup: P,
                                        smoothing: W,
                                        restingValue: X,
                                    });
                                });
                        }
                    ),
                (O.actionTypeId === qe.GENERAL_START_ACTION ||
                    Ts(O.actionTypeId)) &&
                    m_({ store: t, actionListId: _, eventId: T });
        });
        let u = (v) => {
                let { ixSession: g } = t.getState();
                _V(s, (b, O, T) => {
                    let S = r[O],
                        _ = g.eventState[T],
                        { action: N, mediaQueries: R = o.mediaQueryKeys } = S;
                    if (!wi(R, g.mediaQueryKey)) return;
                    let q = (F = {}) => {
                        let P = i(
                            {
                                store: t,
                                element: b,
                                event: S,
                                eventConfig: F,
                                nativeEvent: v,
                                eventStateKey: T,
                            },
                            _
                        );
                        eV(P, _) || t.dispatch(ns(T, P));
                    };
                    N.actionTypeId === qe.GENERAL_CONTINUOUS_ACTION
                        ? (Array.isArray(S.config)
                              ? S.config
                              : [S.config]
                          ).forEach(q)
                        : q();
                });
            },
            d = (0, g_.default)(u, nV),
            h = ({ target: v = document, types: g, throttle: b }) => {
                g.split(" ")
                    .filter(Boolean)
                    .forEach((O) => {
                        let T = b ? d : u;
                        v.addEventListener(O, T), t.dispatch(li(v, [O, T]));
                    });
            };
        Array.isArray(n) ? n.forEach(h) : typeof n == "string" && h(e);
    }
    function IV(e) {
        if (!rV) return;
        let t = {},
            r = "";
        for (let n in e) {
            let { eventTypeId: i, target: o } = e[n],
                a = ls(o);
            t[a] ||
                ((i === Ke.MOUSE_CLICK || i === Ke.MOUSE_SECOND_CLICK) &&
                    ((t[a] = !0),
                    (r +=
                        a + "{cursor: pointer;touch-action: manipulation;}")));
        }
        if (r) {
            let n = document.createElement("style");
            (n.textContent = r), document.body.appendChild(n);
        }
    }
    function m_({ store: e, actionListId: t, eventId: r }) {
        let { ixData: n, ixSession: i } = e.getState(),
            { actionLists: o, events: a } = n,
            s = a[r],
            u = o[t];
        if (u && u.useFirstGroupAsInitialState) {
            let d = (0, ht.default)(u, "actionItemGroups[0].actionItems", []),
                h = (0, ht.default)(s, "mediaQueries", n.mediaQueryKeys);
            if (!wi(h, i.mediaQueryKey)) return;
            d.forEach((v) => {
                let { config: g, actionTypeId: b } = v,
                    O =
                        g?.target?.useEventTarget === !0 &&
                        g?.target?.objectId == null
                            ? { target: s.target, targets: s.targets }
                            : g,
                    T = Oi({ config: O, event: s, elementApi: Le }),
                    S = Ai(b);
                T.forEach((_) => {
                    let N = S ? ws(b)(_, v) : null;
                    As({
                        destination: Os(
                            { element: _, actionItem: v, elementApi: Le },
                            N
                        ),
                        immediate: !0,
                        store: e,
                        element: _,
                        eventId: r,
                        actionItem: v,
                        actionListId: t,
                        pluginInstance: N,
                    });
                });
            });
        }
    }
    function __({ store: e }) {
        let { ixInstances: t } = e.getState();
        (0, hr.default)(t, (r) => {
            if (!r.continuous) {
                let { actionListId: n, verbose: i } = r;
                xs(r, e),
                    i && e.dispatch(gr({ actionListId: n, isPlaying: !1 }));
            }
        });
    }
    function vr({
        store: e,
        eventId: t,
        eventTarget: r,
        eventStateKey: n,
        actionListId: i,
    }) {
        let { ixInstances: o, ixSession: a } = e.getState(),
            s = a.hasBoundaryNodes && r ? Qr(r, Ii) : null;
        (0, hr.default)(o, (u) => {
            let d = (0, ht.default)(u, "actionItem.config.target.boundaryMode"),
                h = n ? u.eventStateKey === n : !0;
            if (u.actionListId === i && u.eventId === t && h) {
                if (s && d && !fs(s, u.element)) return;
                xs(u, e),
                    u.verbose &&
                        e.dispatch(gr({ actionListId: i, isPlaying: !1 }));
            }
        });
    }
    function tn({
        store: e,
        eventId: t,
        eventTarget: r,
        eventStateKey: n,
        actionListId: i,
        groupIndex: o = 0,
        immediate: a,
        verbose: s,
    }) {
        let { ixData: u, ixSession: d } = e.getState(),
            { events: h } = u,
            v = h[t] || {},
            { mediaQueries: g = u.mediaQueryKeys } = v,
            b = (0, ht.default)(u, `actionLists.${i}`, {}),
            { actionItemGroups: O, useFirstGroupAsInitialState: T } = b;
        if (!O || !O.length) return !1;
        o >= O.length && (0, ht.default)(v, "config.loop") && (o = 0),
            o === 0 && T && o++;
        let _ =
                (o === 0 || (o === 1 && T)) && Ts(v.action?.actionTypeId)
                    ? v.config.delay
                    : void 0,
            N = (0, ht.default)(O, [o, "actionItems"], []);
        if (!N.length || !wi(g, d.mediaQueryKey)) return !1;
        let R = d.hasBoundaryNodes && r ? Qr(r, Ii) : null,
            q = HU(N),
            F = !1;
        return (
            N.forEach((P, W) => {
                let { config: X, actionTypeId: z } = P,
                    Y = Ai(z),
                    { target: $ } = X;
                if (!$) return;
                let G = $.boundaryMode ? R : null;
                Oi({
                    config: X,
                    event: v,
                    eventTarget: r,
                    elementRoot: G,
                    elementApi: Le,
                }).forEach((M, H) => {
                    let B = Y ? ws(z)(M, P) : null,
                        Z = Y ? tV(z)(M, P) : null;
                    F = !0;
                    let J = q === W && H === 0,
                        k = XU({ element: M, actionItem: P }),
                        j = Os(
                            { element: M, actionItem: P, elementApi: Le },
                            B
                        );
                    As({
                        store: e,
                        element: M,
                        actionItem: P,
                        eventId: t,
                        eventTarget: r,
                        eventStateKey: n,
                        actionListId: i,
                        groupIndex: o,
                        isCarrier: J,
                        computedStyle: k,
                        destination: j,
                        immediate: a,
                        verbose: s,
                        pluginInstance: B,
                        pluginDuration: Z,
                        instanceDelay: _,
                    });
                });
            }),
            F
        );
    }
    function As(e) {
        let { store: t, computedStyle: r, ...n } = e,
            {
                element: i,
                actionItem: o,
                immediate: a,
                pluginInstance: s,
                continuous: u,
                restingValue: d,
                eventId: h,
            } = n,
            v = !u,
            g = BU(),
            { ixElements: b, ixSession: O, ixData: T } = t.getState(),
            S = VU(b, i),
            { refState: _ } = b[S] || {},
            N = ds(i),
            R = O.reducedMotion && jo[o.actionTypeId],
            q;
        if (R && u)
            switch (T.events[h]?.eventTypeId) {
                case Ke.MOUSE_MOVE:
                case Ke.MOUSE_MOVE_IN_VIEWPORT:
                    q = d;
                    break;
                default:
                    q = 0.5;
                    break;
            }
        let F = jU(i, _, r, o, Le, s);
        if (
            (t.dispatch(
                is({
                    instanceId: g,
                    elementId: S,
                    origin: F,
                    refType: N,
                    skipMotion: R,
                    skipToValue: q,
                    ...n,
                })
            ),
            b_(document.body, "ix2-animation-started", g),
            a)
        ) {
            OV(t, g);
            return;
        }
        Dt({ store: t, select: ({ ixInstances: P }) => P[g], onChange: T_ }),
            v && t.dispatch(di(g, O.tick));
    }
    function xs(e, t) {
        b_(document.body, "ix2-animation-stopping", {
            instanceId: e.id,
            state: t.getState(),
        });
        let { elementId: r, actionItem: n } = e,
            { ixElements: i } = t.getState(),
            { ref: o, refType: a } = i[r] || {};
        a === v_ && $U(o, n, Le), t.dispatch(os(e.id));
    }
    function b_(e, t, r) {
        let n = document.createEvent("CustomEvent");
        n.initCustomEvent(t, !0, !0, r), e.dispatchEvent(n);
    }
    function OV(e, t) {
        let { ixParameters: r } = e.getState();
        e.dispatch(di(t, 0)), e.dispatch(fi(performance.now(), r));
        let { ixInstances: n } = e.getState();
        T_(n[t], e);
    }
    function T_(e, t) {
        let {
                active: r,
                continuous: n,
                complete: i,
                elementId: o,
                actionItem: a,
                actionTypeId: s,
                renderType: u,
                current: d,
                groupIndex: h,
                eventId: v,
                eventTarget: g,
                eventStateKey: b,
                actionListId: O,
                isCarrier: T,
                styleProp: S,
                verbose: _,
                pluginInstance: N,
            } = e,
            { ixData: R, ixSession: q } = t.getState(),
            { events: F } = R,
            P = F[v] || {},
            { mediaQueries: W = R.mediaQueryKeys } = P;
        if (wi(W, q.mediaQueryKey) && (n || r || i)) {
            if (d || (u === UU && i)) {
                t.dispatch(as(o, s, d, a));
                let { ixElements: X } = t.getState(),
                    { ref: z, refType: Y, refState: $ } = X[o] || {},
                    G = $ && $[s];
                (Y === v_ || Ai(s)) && WU(z, $, G, v, a, S, Le, u, N);
            }
            if (i) {
                if (T) {
                    let X = tn({
                        store: t,
                        eventId: v,
                        eventTarget: g,
                        eventStateKey: b,
                        actionListId: O,
                        groupIndex: h + 1,
                        verbose: _,
                    });
                    _ &&
                        !X &&
                        t.dispatch(gr({ actionListId: O, isPlaying: !1 }));
                }
                xs(e, t);
            }
        }
    }
    var c_,
        ht,
        l_,
        f_,
        d_,
        p_,
        hr,
        g_,
        Ti,
        kU,
        Ts,
        Is,
        Ii,
        v_,
        UU,
        s_,
        Oi,
        VU,
        Os,
        Dt,
        BU,
        WU,
        h_,
        HU,
        XU,
        jU,
        zU,
        KU,
        YU,
        wi,
        $U,
        QU,
        ZU,
        JU,
        eV,
        Ai,
        ws,
        tV,
        u_,
        rV,
        nV,
        EV,
        mV,
        _V,
        bV,
        bs = pe(() => {
            "use strict";
            (c_ = ae(ba())),
                (ht = ae(jn())),
                (l_ = ae(ME())),
                (f_ = ae(uy())),
                (d_ = ae(ly())),
                (p_ = ae(dy())),
                (hr = ae(yy())),
                (g_ = ae(wy()));
            Fe();
            Ti = ae(Mt());
            pi();
            Ly();
            a_();
            (kU = Object.keys(On)),
                (Ts = (e) => kU.includes(e)),
                ({
                    COLON_DELIMITER: Is,
                    BOUNDARY_SELECTOR: Ii,
                    HTML_ELEMENT: v_,
                    RENDER_GENERAL: UU,
                    W_MOD_IX: s_,
                } = we),
                ({
                    getAffectedElements: Oi,
                    getElementId: VU,
                    getDestinationValues: Os,
                    observeStore: Dt,
                    getInstanceId: BU,
                    renderHTMLElement: WU,
                    clearAllStyles: h_,
                    getMaxDurationItemIndex: HU,
                    getComputedStyle: XU,
                    getInstanceOrigin: jU,
                    reduceListToGroup: zU,
                    shouldNamespaceEventParameter: KU,
                    getNamespacedParameterId: YU,
                    shouldAllowMediaQuery: wi,
                    cleanupHTMLElement: $U,
                    clearObjectCache: QU,
                    stringifyTarget: ZU,
                    mediaQueriesEqual: JU,
                    shallowEqual: eV,
                } = Ti.IX2VanillaUtils),
                ({
                    isPluginType: Ai,
                    createPluginInstance: ws,
                    getPluginDuration: tV,
                } = Ti.IX2VanillaPlugins),
                (u_ = navigator.userAgent),
                (rV = u_.match(/iPad/i) || u_.match(/iPhone/)),
                (nV = 12);
            EV = ["resize", "orientationchange"];
            (mV = (e, t) => (0, f_.default)((0, p_.default)(e, t), d_.default)),
                (_V = (e, t) => {
                    (0, hr.default)(e, (r, n) => {
                        r.forEach((i, o) => {
                            let a = n + Is + o;
                            t(i, n, a);
                        });
                    });
                }),
                (bV = (e) => {
                    let t = { target: e.target, targets: e.targets };
                    return Oi({ config: t, elementApi: Le });
                });
        });
    var w_ = c((Et) => {
        "use strict";
        var wV = fn().default,
            AV = au().default;
        Object.defineProperty(Et, "__esModule", { value: !0 });
        Et.actions = void 0;
        Et.destroy = O_;
        Et.init = LV;
        Et.setEnv = RV;
        Et.store = void 0;
        Xl();
        var xV = Wo(),
            SV = AV((EE(), et(hE))),
            Ss = (bs(), et(I_)),
            CV = wV((pi(), et(xy)));
        Et.actions = CV;
        var Cs = (Et.store = (0, xV.createStore)(SV.default));
        function RV(e) {
            e() && (0, Ss.observeRequests)(Cs);
        }
        function LV(e) {
            O_(),
                (0, Ss.startEngine)({ store: Cs, rawData: e, allowEvents: !0 });
        }
        function O_() {
            (0, Ss.stopEngine)(Cs);
        }
    });
    var C_ = c((Zj, S_) => {
        "use strict";
        var A_ = ke(),
            x_ = w_();
        x_.setEnv(A_.env);
        A_.define(
            "ix2",
            (S_.exports = function () {
                return x_;
            })
        );
    });
    var L_ = c((Jj, R_) => {
        "use strict";
        var Er = ke();
        Er.define(
            "links",
            (R_.exports = function (e, t) {
                var r = {},
                    n = e(window),
                    i,
                    o = Er.env(),
                    a = window.location,
                    s = document.createElement("a"),
                    u = "w--current",
                    d = /index\.(html|php)$/,
                    h = /\/$/,
                    v,
                    g;
                r.ready = r.design = r.preview = b;
                function b() {
                    (i = o && Er.env("design")),
                        (g = Er.env("slug") || a.pathname || ""),
                        Er.scroll.off(T),
                        (v = []);
                    for (var _ = document.links, N = 0; N < _.length; ++N)
                        O(_[N]);
                    v.length && (Er.scroll.on(T), T());
                }
                function O(_) {
                    if (!_.getAttribute("hreflang")) {
                        var N =
                            (i && _.getAttribute("href-disabled")) ||
                            _.getAttribute("href");
                        if (((s.href = N), !(N.indexOf(":") >= 0))) {
                            var R = e(_);
                            if (
                                s.hash.length > 1 &&
                                s.host + s.pathname === a.host + a.pathname
                            ) {
                                if (!/^#[a-zA-Z0-9\-\_]+$/.test(s.hash)) return;
                                var q = e(s.hash);
                                q.length &&
                                    v.push({ link: R, sec: q, active: !1 });
                                return;
                            }
                            if (!(N === "#" || N === "")) {
                                var F =
                                    s.href === a.href ||
                                    N === g ||
                                    (d.test(N) && h.test(g));
                                S(R, u, F);
                            }
                        }
                    }
                }
                function T() {
                    var _ = n.scrollTop(),
                        N = n.height();
                    t.each(v, function (R) {
                        if (!R.link.attr("hreflang")) {
                            var q = R.link,
                                F = R.sec,
                                P = F.offset().top,
                                W = F.outerHeight(),
                                X = N * 0.5,
                                z =
                                    F.is(":visible") &&
                                    P + W - X >= _ &&
                                    P + X <= _ + N;
                            R.active !== z && ((R.active = z), S(q, u, z));
                        }
                    });
                }
                function S(_, N, R) {
                    var q = _.hasClass(N);
                    (R && q) ||
                        (!R && !q) ||
                        (R ? _.addClass(N) : _.removeClass(N));
                }
                return r;
            })
        );
    });
    var P_ = c((ez, N_) => {
        "use strict";
        var Ci = ke();
        Ci.define(
            "scroll",
            (N_.exports = function (e) {
                var t = {
                        WF_CLICK_EMPTY: "click.wf-empty-link",
                        WF_CLICK_SCROLL: "click.wf-scroll",
                    },
                    r = window.location,
                    n = O() ? null : window.history,
                    i = e(window),
                    o = e(document),
                    a = e(document.body),
                    s =
                        window.requestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        function (G) {
                            window.setTimeout(G, 15);
                        },
                    u = Ci.env("editor") ? ".w-editor-body" : "body",
                    d =
                        "header, " +
                        u +
                        " > .header, " +
                        u +
                        " > .w-nav:not([data-no-scroll])",
                    h = 'a[href="#"]',
                    v = 'a[href*="#"]:not(.w-tab-link):not(' + h + ")",
                    g =
                        '.wf-force-outline-none[tabindex="-1"]:focus{outline:none;}',
                    b = document.createElement("style");
                b.appendChild(document.createTextNode(g));
                function O() {
                    try {
                        return !!window.frameElement;
                    } catch {
                        return !0;
                    }
                }
                var T = /^#[a-zA-Z0-9][\w:.-]*$/;
                function S(G) {
                    return (
                        T.test(G.hash) &&
                        G.host + G.pathname === r.host + r.pathname
                    );
                }
                let _ =
                    typeof window.matchMedia == "function" &&
                    window.matchMedia("(prefers-reduced-motion: reduce)");
                function N() {
                    return (
                        document.body.getAttribute("data-wf-scroll-motion") ===
                            "none" || _.matches
                    );
                }
                function R(G, A) {
                    var M;
                    switch (A) {
                        case "add":
                            (M = G.attr("tabindex")),
                                M
                                    ? G.attr("data-wf-tabindex-swap", M)
                                    : G.attr("tabindex", "-1");
                            break;
                        case "remove":
                            (M = G.attr("data-wf-tabindex-swap")),
                                M
                                    ? (G.attr("tabindex", M),
                                      G.removeAttr("data-wf-tabindex-swap"))
                                    : G.removeAttr("tabindex");
                            break;
                    }
                    G.toggleClass("wf-force-outline-none", A === "add");
                }
                function q(G) {
                    var A = G.currentTarget;
                    if (
                        !(
                            Ci.env("design") ||
                            (window.$.mobile &&
                                /(?:^|\s)ui-link(?:$|\s)/.test(A.className))
                        )
                    ) {
                        var M = S(A) ? A.hash : "";
                        if (M !== "") {
                            var H = e(M);
                            H.length &&
                                (G && (G.preventDefault(), G.stopPropagation()),
                                F(M, G),
                                window.setTimeout(
                                    function () {
                                        P(H, function () {
                                            R(H, "add"),
                                                H.get(0).focus({
                                                    preventScroll: !0,
                                                }),
                                                R(H, "remove");
                                        });
                                    },
                                    G ? 0 : 300
                                ));
                        }
                    }
                }
                function F(G) {
                    if (
                        r.hash !== G &&
                        n &&
                        n.pushState &&
                        !(Ci.env.chrome && r.protocol === "file:")
                    ) {
                        var A = n.state && n.state.hash;
                        A !== G && n.pushState({ hash: G }, "", G);
                    }
                }
                function P(G, A) {
                    var M = i.scrollTop(),
                        H = W(G);
                    if (M !== H) {
                        var B = X(G, M, H),
                            Z = Date.now(),
                            J = function () {
                                var k = Date.now() - Z;
                                window.scroll(0, z(M, H, k, B)),
                                    k <= B
                                        ? s(J)
                                        : typeof A == "function" && A();
                            };
                        s(J);
                    }
                }
                function W(G) {
                    var A = e(d),
                        M = A.css("position") === "fixed" ? A.outerHeight() : 0,
                        H = G.offset().top - M;
                    if (G.data("scroll") === "mid") {
                        var B = i.height() - M,
                            Z = G.outerHeight();
                        Z < B && (H -= Math.round((B - Z) / 2));
                    }
                    return H;
                }
                function X(G, A, M) {
                    if (N()) return 0;
                    var H = 1;
                    return (
                        a.add(G).each(function (B, Z) {
                            var J = parseFloat(
                                Z.getAttribute("data-scroll-time")
                            );
                            !isNaN(J) && J >= 0 && (H = J);
                        }),
                        (472.143 * Math.log(Math.abs(A - M) + 125) - 2e3) * H
                    );
                }
                function z(G, A, M, H) {
                    return M > H ? A : G + (A - G) * Y(M / H);
                }
                function Y(G) {
                    return G < 0.5
                        ? 4 * G * G * G
                        : (G - 1) * (2 * G - 2) * (2 * G - 2) + 1;
                }
                function $() {
                    var { WF_CLICK_EMPTY: G, WF_CLICK_SCROLL: A } = t;
                    o.on(A, v, q),
                        o.on(G, h, function (M) {
                            M.preventDefault();
                        }),
                        document.head.insertBefore(b, document.head.firstChild);
                }
                return { ready: $ };
            })
        );
    });
    var F_ = c((tz, q_) => {
        "use strict";
        var NV = ke();
        NV.define(
            "touch",
            (q_.exports = function (e) {
                var t = {},
                    r = window.getSelection;
                (e.event.special.tap = {
                    bindType: "click",
                    delegateType: "click",
                }),
                    (t.init = function (o) {
                        return (
                            (o = typeof o == "string" ? e(o).get(0) : o),
                            o ? new n(o) : null
                        );
                    });
                function n(o) {
                    var a = !1,
                        s = !1,
                        u = Math.min(Math.round(window.innerWidth * 0.04), 40),
                        d,
                        h;
                    o.addEventListener("touchstart", v, !1),
                        o.addEventListener("touchmove", g, !1),
                        o.addEventListener("touchend", b, !1),
                        o.addEventListener("touchcancel", O, !1),
                        o.addEventListener("mousedown", v, !1),
                        o.addEventListener("mousemove", g, !1),
                        o.addEventListener("mouseup", b, !1),
                        o.addEventListener("mouseout", O, !1);
                    function v(S) {
                        var _ = S.touches;
                        (_ && _.length > 1) ||
                            ((a = !0),
                            _
                                ? ((s = !0), (d = _[0].clientX))
                                : (d = S.clientX),
                            (h = d));
                    }
                    function g(S) {
                        if (a) {
                            if (s && S.type === "mousemove") {
                                S.preventDefault(), S.stopPropagation();
                                return;
                            }
                            var _ = S.touches,
                                N = _ ? _[0].clientX : S.clientX,
                                R = N - h;
                            (h = N),
                                Math.abs(R) > u &&
                                    r &&
                                    String(r()) === "" &&
                                    (i("swipe", S, {
                                        direction: R > 0 ? "right" : "left",
                                    }),
                                    O());
                        }
                    }
                    function b(S) {
                        if (a && ((a = !1), s && S.type === "mouseup")) {
                            S.preventDefault(), S.stopPropagation(), (s = !1);
                            return;
                        }
                    }
                    function O() {
                        a = !1;
                    }
                    function T() {
                        o.removeEventListener("touchstart", v, !1),
                            o.removeEventListener("touchmove", g, !1),
                            o.removeEventListener("touchend", b, !1),
                            o.removeEventListener("touchcancel", O, !1),
                            o.removeEventListener("mousedown", v, !1),
                            o.removeEventListener("mousemove", g, !1),
                            o.removeEventListener("mouseup", b, !1),
                            o.removeEventListener("mouseout", O, !1),
                            (o = null);
                    }
                    this.destroy = T;
                }
                function i(o, a, s) {
                    var u = e.Event(o, { originalEvent: a });
                    e(a.target).trigger(u, s);
                }
                return (t.instance = t.init(document)), t;
            })
        );
    });
    var G_ = c((rz, D_) => {
        "use strict";
        var Gt = ke(),
            PV = ln(),
            Qe = {
                ARROW_LEFT: 37,
                ARROW_UP: 38,
                ARROW_RIGHT: 39,
                ARROW_DOWN: 40,
                ESCAPE: 27,
                SPACE: 32,
                ENTER: 13,
                HOME: 36,
                END: 35,
            },
            M_ = !0,
            qV = /^#[a-zA-Z0-9\-_]+$/;
        Gt.define(
            "dropdown",
            (D_.exports = function (e, t) {
                var r = t.debounce,
                    n = {},
                    i = Gt.env(),
                    o = !1,
                    a,
                    s = Gt.env.touch,
                    u = ".w-dropdown",
                    d = "w--open",
                    h = PV.triggers,
                    v = 900,
                    g = "focusout" + u,
                    b = "keydown" + u,
                    O = "mouseenter" + u,
                    T = "mousemove" + u,
                    S = "mouseleave" + u,
                    _ = (s ? "click" : "mouseup") + u,
                    N = "w-close" + u,
                    R = "setting" + u,
                    q = e(document),
                    F;
                (n.ready = P),
                    (n.design = function () {
                        o && A(), (o = !1), P();
                    }),
                    (n.preview = function () {
                        (o = !0), P();
                    });
                function P() {
                    (a = i && Gt.env("design")), (F = q.find(u)), F.each(W);
                }
                function W(l, D) {
                    var U = e(D),
                        x = e.data(D, u);
                    x ||
                        (x = e.data(D, u, {
                            open: !1,
                            el: U,
                            config: {},
                            selectedIdx: -1,
                        })),
                        (x.toggle = x.el.children(".w-dropdown-toggle")),
                        (x.list = x.el.children(".w-dropdown-list")),
                        (x.links = x.list.find(
                            "a:not(.w-dropdown .w-dropdown a)"
                        )),
                        (x.complete = B(x)),
                        (x.mouseLeave = J(x)),
                        (x.mouseUpOutside = H(x)),
                        (x.mouseMoveOutside = k(x)),
                        X(x);
                    var te = x.toggle.attr("id"),
                        se = x.list.attr("id");
                    te || (te = "w-dropdown-toggle-" + l),
                        se || (se = "w-dropdown-list-" + l),
                        x.toggle.attr("id", te),
                        x.toggle.attr("aria-controls", se),
                        x.toggle.attr("aria-haspopup", "menu"),
                        x.toggle.attr("aria-expanded", "false"),
                        x.toggle
                            .find(".w-icon-dropdown-toggle")
                            .attr("aria-hidden", "true"),
                        x.toggle.prop("tagName") !== "BUTTON" &&
                            (x.toggle.attr("role", "button"),
                            x.toggle.attr("tabindex") ||
                                x.toggle.attr("tabindex", "0")),
                        x.list.attr("id", se),
                        x.list.attr("aria-labelledby", te),
                        x.links.each(function (fe, me) {
                            me.hasAttribute("tabindex") ||
                                me.setAttribute("tabindex", "0"),
                                qV.test(me.hash) &&
                                    me.addEventListener(
                                        "click",
                                        G.bind(null, x)
                                    );
                        }),
                        x.el.off(u),
                        x.toggle.off(u),
                        x.nav && x.nav.off(u);
                    var ne = Y(x, M_);
                    a && x.el.on(R, z(x)),
                        a ||
                            (i && ((x.hovering = !1), G(x)),
                            x.config.hover && x.toggle.on(O, Z(x)),
                            x.el.on(N, ne),
                            x.el.on(b, j(x)),
                            x.el.on(g, y(x)),
                            x.toggle.on(_, ne),
                            x.toggle.on(b, E(x)),
                            (x.nav = x.el.closest(".w-nav")),
                            x.nav.on(N, ne));
                }
                function X(l) {
                    var D = Number(l.el.css("z-index"));
                    (l.manageZ = D === v || D === v + 1),
                        (l.config = {
                            hover: l.el.attr("data-hover") === "true" && !s,
                            delay: l.el.attr("data-delay"),
                        });
                }
                function z(l) {
                    return function (D, U) {
                        (U = U || {}),
                            X(l),
                            U.open === !0 && $(l, !0),
                            U.open === !1 && G(l, { immediate: !0 });
                    };
                }
                function Y(l, D) {
                    return r(function (U) {
                        if (l.open || (U && U.type === "w-close"))
                            return G(l, { forceClose: D });
                        $(l);
                    });
                }
                function $(l) {
                    if (!l.open) {
                        M(l),
                            (l.open = !0),
                            l.list.addClass(d),
                            l.toggle.addClass(d),
                            l.toggle.attr("aria-expanded", "true"),
                            h.intro(0, l.el[0]),
                            Gt.redraw.up(),
                            l.manageZ && l.el.css("z-index", v + 1);
                        var D = Gt.env("editor");
                        a || q.on(_, l.mouseUpOutside),
                            l.hovering && !D && l.el.on(S, l.mouseLeave),
                            l.hovering && D && q.on(T, l.mouseMoveOutside),
                            window.clearTimeout(l.delayId);
                    }
                }
                function G(l, { immediate: D, forceClose: U } = {}) {
                    if (l.open && !(l.config.hover && l.hovering && !U)) {
                        l.toggle.attr("aria-expanded", "false"), (l.open = !1);
                        var x = l.config;
                        if (
                            (h.outro(0, l.el[0]),
                            q.off(_, l.mouseUpOutside),
                            q.off(T, l.mouseMoveOutside),
                            l.el.off(S, l.mouseLeave),
                            window.clearTimeout(l.delayId),
                            !x.delay || D)
                        )
                            return l.complete();
                        l.delayId = window.setTimeout(l.complete, x.delay);
                    }
                }
                function A() {
                    q.find(u).each(function (l, D) {
                        e(D).triggerHandler(N);
                    });
                }
                function M(l) {
                    var D = l.el[0];
                    F.each(function (U, x) {
                        var te = e(x);
                        te.is(D) || te.has(D).length || te.triggerHandler(N);
                    });
                }
                function H(l) {
                    return (
                        l.mouseUpOutside && q.off(_, l.mouseUpOutside),
                        r(function (D) {
                            if (l.open) {
                                var U = e(D.target);
                                if (!U.closest(".w-dropdown-toggle").length) {
                                    var x =
                                            e.inArray(l.el[0], U.parents(u)) ===
                                            -1,
                                        te = Gt.env("editor");
                                    if (x) {
                                        if (te) {
                                            var se =
                                                    U.parents().length === 1 &&
                                                    U.parents("svg").length ===
                                                        1,
                                                ne = U.parents(
                                                    ".w-editor-bem-EditorHoverControls"
                                                ).length;
                                            if (se || ne) return;
                                        }
                                        G(l);
                                    }
                                }
                            }
                        })
                    );
                }
                function B(l) {
                    return function () {
                        l.list.removeClass(d),
                            l.toggle.removeClass(d),
                            l.manageZ && l.el.css("z-index", "");
                    };
                }
                function Z(l) {
                    return function () {
                        (l.hovering = !0), $(l);
                    };
                }
                function J(l) {
                    return function () {
                        (l.hovering = !1), l.links.is(":focus") || G(l);
                    };
                }
                function k(l) {
                    return r(function (D) {
                        if (l.open) {
                            var U = e(D.target),
                                x = e.inArray(l.el[0], U.parents(u)) === -1;
                            if (x) {
                                var te = U.parents(
                                        ".w-editor-bem-EditorHoverControls"
                                    ).length,
                                    se = U.parents(
                                        ".w-editor-bem-RTToolbar"
                                    ).length,
                                    ne = e(".w-editor-bem-EditorOverlay"),
                                    fe =
                                        ne.find(".w-editor-edit-outline")
                                            .length ||
                                        ne.find(".w-editor-bem-RTToolbar")
                                            .length;
                                if (te || se || fe) return;
                                (l.hovering = !1), G(l);
                            }
                        }
                    });
                }
                function j(l) {
                    return function (D) {
                        if (!(a || !l.open))
                            switch (
                                ((l.selectedIdx = l.links.index(
                                    document.activeElement
                                )),
                                D.keyCode)
                            ) {
                                case Qe.HOME:
                                    return l.open
                                        ? ((l.selectedIdx = 0),
                                          p(l),
                                          D.preventDefault())
                                        : void 0;
                                case Qe.END:
                                    return l.open
                                        ? ((l.selectedIdx = l.links.length - 1),
                                          p(l),
                                          D.preventDefault())
                                        : void 0;
                                case Qe.ESCAPE:
                                    return (
                                        G(l),
                                        l.toggle.focus(),
                                        D.stopPropagation()
                                    );
                                case Qe.ARROW_RIGHT:
                                case Qe.ARROW_DOWN:
                                    return (
                                        (l.selectedIdx = Math.min(
                                            l.links.length - 1,
                                            l.selectedIdx + 1
                                        )),
                                        p(l),
                                        D.preventDefault()
                                    );
                                case Qe.ARROW_LEFT:
                                case Qe.ARROW_UP:
                                    return (
                                        (l.selectedIdx = Math.max(
                                            -1,
                                            l.selectedIdx - 1
                                        )),
                                        p(l),
                                        D.preventDefault()
                                    );
                            }
                    };
                }
                function p(l) {
                    l.links[l.selectedIdx] && l.links[l.selectedIdx].focus();
                }
                function E(l) {
                    var D = Y(l, M_);
                    return function (U) {
                        if (!a) {
                            if (!l.open)
                                switch (U.keyCode) {
                                    case Qe.ARROW_UP:
                                    case Qe.ARROW_DOWN:
                                        return U.stopPropagation();
                                }
                            switch (U.keyCode) {
                                case Qe.SPACE:
                                case Qe.ENTER:
                                    return (
                                        D(),
                                        U.stopPropagation(),
                                        U.preventDefault()
                                    );
                            }
                        }
                    };
                }
                function y(l) {
                    return r(function (D) {
                        var { relatedTarget: U, target: x } = D,
                            te = l.el[0],
                            se = te.contains(U) || te.contains(x);
                        return se || G(l), D.stopPropagation();
                    });
                }
                return n;
            })
        );
    });
    var k_ = c((Rs) => {
        "use strict";
        Object.defineProperty(Rs, "__esModule", { value: !0 });
        Rs.default = FV;
        function FV(e, t, r, n, i, o, a, s, u, d, h, v, g) {
            return function (b) {
                e(b);
                var O = b.form,
                    T = {
                        name:
                            O.attr("data-name") ||
                            O.attr("name") ||
                            "Untitled Form",
                        pageId: O.attr("data-wf-page-id") || "",
                        elementId: O.attr("data-wf-element-id") || "",
                        source: t.href,
                        test: r.env(),
                        fields: {},
                        fileUploads: {},
                        dolphin:
                            /pass[\s-_]?(word|code)|secret|login|credentials/i.test(
                                O.html()
                            ),
                        trackingCookies: n(),
                    };
                let S = O.attr("data-wf-flow");
                S && (T.wfFlow = S), i(b);
                var _ = o(O, T.fields);
                if (_) return a(_);
                if (((T.fileUploads = s(O)), u(b), !d)) {
                    h(b);
                    return;
                }
                v.ajax({
                    url: g,
                    type: "POST",
                    data: T,
                    dataType: "json",
                    crossDomain: !0,
                })
                    .done(function (N) {
                        N && N.code === 200 && (b.success = !0), h(b);
                    })
                    .fail(function () {
                        h(b);
                    });
            };
        }
    });
    var V_ = c((iz, U_) => {
        "use strict";
        var Ri = ke();
        Ri.define(
            "forms",
            (U_.exports = function (e, t) {
                var r = {},
                    n = e(document),
                    i,
                    o = window.location,
                    a = window.XDomainRequest && !window.atob,
                    s = ".w-form",
                    u,
                    d = /e(-)?mail/i,
                    h = /^\S+@\S+$/,
                    v = window.alert,
                    g = Ri.env(),
                    b,
                    O,
                    T,
                    S = /list-manage[1-9]?.com/i,
                    _ = t.debounce(function () {
                        v(
                            "Oops! This page has improperly configured forms. Please contact your website administrator to fix this issue."
                        );
                    }, 100);
                r.ready =
                    r.design =
                    r.preview =
                        function () {
                            N(), !g && !b && q();
                        };
                function N() {
                    (u = e("html").attr("data-wf-site")),
                        (O = "https://webflow.com/api/v1/form/" + u),
                        a &&
                            O.indexOf("https://webflow.com") >= 0 &&
                            (O = O.replace(
                                "https://webflow.com",
                                "https://formdata.webflow.com"
                            )),
                        (T = `${O}/signFile`),
                        (i = e(s + " form")),
                        i.length && i.each(R);
                }
                function R(k, j) {
                    var p = e(j),
                        E = e.data(j, s);
                    E || (E = e.data(j, s, { form: p })), F(E);
                    var y = p.closest("div.w-form");
                    (E.done = y.find("> .w-form-done")),
                        (E.fail = y.find("> .w-form-fail")),
                        (E.fileUploads = y.find(".w-file-upload")),
                        E.fileUploads.each(function (U) {
                            B(U, E);
                        });
                    var l =
                        E.form.attr("aria-label") ||
                        E.form.attr("data-name") ||
                        "Form";
                    E.done.attr("aria-label") || E.form.attr("aria-label", l),
                        E.done.attr("tabindex", "-1"),
                        E.done.attr("role", "region"),
                        E.done.attr("aria-label") ||
                            E.done.attr("aria-label", l + " success"),
                        E.fail.attr("tabindex", "-1"),
                        E.fail.attr("role", "region"),
                        E.fail.attr("aria-label") ||
                            E.fail.attr("aria-label", l + " failure");
                    var D = (E.action = p.attr("action"));
                    if (
                        ((E.handler = null),
                        (E.redirect = p.attr("data-redirect")),
                        S.test(D))
                    ) {
                        E.handler = A;
                        return;
                    }
                    if (!D) {
                        if (u) {
                            E.handler = (() => {
                                let U = k_().default;
                                return U(
                                    F,
                                    o,
                                    Ri,
                                    Y,
                                    H,
                                    W,
                                    v,
                                    X,
                                    P,
                                    u,
                                    M,
                                    e,
                                    O
                                );
                            })();
                            return;
                        }
                        _();
                    }
                }
                function q() {
                    (b = !0),
                        n.on("submit", s + " form", function (U) {
                            var x = e.data(this, s);
                            x.handler && ((x.evt = U), x.handler(x));
                        });
                    let k = ".w-checkbox-input",
                        j = ".w-radio-input",
                        p = "w--redirected-checked",
                        E = "w--redirected-focus",
                        y = "w--redirected-focus-visible",
                        l = ":focus-visible, [data-wf-focus-visible]",
                        D = [
                            ["checkbox", k],
                            ["radio", j],
                        ];
                    n.on(
                        "change",
                        s + ' form input[type="checkbox"]:not(' + k + ")",
                        (U) => {
                            e(U.target).siblings(k).toggleClass(p);
                        }
                    ),
                        n.on("change", s + ' form input[type="radio"]', (U) => {
                            e(`input[name="${U.target.name}"]:not(${k})`).map(
                                (te, se) => e(se).siblings(j).removeClass(p)
                            );
                            let x = e(U.target);
                            x.hasClass("w-radio-input") ||
                                x.siblings(j).addClass(p);
                        }),
                        D.forEach(([U, x]) => {
                            n.on(
                                "focus",
                                s + ` form input[type="${U}"]:not(` + x + ")",
                                (te) => {
                                    e(te.target).siblings(x).addClass(E),
                                        e(te.target)
                                            .filter(l)
                                            .siblings(x)
                                            .addClass(y);
                                }
                            ),
                                n.on(
                                    "blur",
                                    s +
                                        ` form input[type="${U}"]:not(` +
                                        x +
                                        ")",
                                    (te) => {
                                        e(te.target)
                                            .siblings(x)
                                            .removeClass(`${E} ${y}`);
                                    }
                                );
                        });
                }
                function F(k) {
                    var j = (k.btn = k.form.find(':input[type="submit"]'));
                    (k.wait = k.btn.attr("data-wait") || null),
                        (k.success = !1),
                        j.prop("disabled", !1),
                        k.label && j.val(k.label);
                }
                function P(k) {
                    var j = k.btn,
                        p = k.wait;
                    j.prop("disabled", !0),
                        p && ((k.label = j.val()), j.val(p));
                }
                function W(k, j) {
                    var p = null;
                    return (
                        (j = j || {}),
                        k
                            .find(
                                ':input:not([type="submit"]):not([type="file"])'
                            )
                            .each(function (E, y) {
                                var l = e(y),
                                    D = l.attr("type"),
                                    U =
                                        l.attr("data-name") ||
                                        l.attr("name") ||
                                        "Field " + (E + 1);
                                U = encodeURIComponent(U);
                                var x = l.val();
                                if (D === "checkbox") x = l.is(":checked");
                                else if (D === "radio") {
                                    if (
                                        j[U] === null ||
                                        typeof j[U] == "string"
                                    )
                                        return;
                                    x =
                                        k
                                            .find(
                                                'input[name="' +
                                                    l.attr("name") +
                                                    '"]:checked'
                                            )
                                            .val() || null;
                                }
                                typeof x == "string" && (x = e.trim(x)),
                                    (j[U] = x),
                                    (p = p || $(l, D, U, x));
                            }),
                        p
                    );
                }
                function X(k) {
                    var j = {};
                    return (
                        k.find(':input[type="file"]').each(function (p, E) {
                            var y = e(E),
                                l =
                                    y.attr("data-name") ||
                                    y.attr("name") ||
                                    "File " + (p + 1),
                                D = y.attr("data-value");
                            typeof D == "string" && (D = e.trim(D)), (j[l] = D);
                        }),
                        j
                    );
                }
                let z = { _mkto_trk: "marketo" };
                function Y() {
                    return document.cookie.split("; ").reduce(function (j, p) {
                        let E = p.split("="),
                            y = E[0];
                        if (y in z) {
                            let l = z[y],
                                D = E.slice(1).join("=");
                            j[l] = D;
                        }
                        return j;
                    }, {});
                }
                function $(k, j, p, E) {
                    var y = null;
                    return (
                        j === "password"
                            ? (y = "Passwords cannot be submitted.")
                            : k.attr("required")
                            ? E
                                ? d.test(k.attr("type")) &&
                                  (h.test(E) ||
                                      (y =
                                          "Please enter a valid email address for: " +
                                          p))
                                : (y =
                                      "Please fill out the required field: " +
                                      p)
                            : p === "g-recaptcha-response" &&
                              !E &&
                              (y = "Please confirm you\u2019re not a robot."),
                        y
                    );
                }
                function G(k) {
                    H(k), M(k);
                }
                function A(k) {
                    F(k);
                    var j = k.form,
                        p = {};
                    if (/^https/.test(o.href) && !/^https/.test(k.action)) {
                        j.attr("method", "post");
                        return;
                    }
                    H(k);
                    var E = W(j, p);
                    if (E) return v(E);
                    P(k);
                    var y;
                    t.each(p, function (x, te) {
                        d.test(te) && (p.EMAIL = x),
                            /^((full[ _-]?)?name)$/i.test(te) && (y = x),
                            /^(first[ _-]?name)$/i.test(te) && (p.FNAME = x),
                            /^(last[ _-]?name)$/i.test(te) && (p.LNAME = x);
                    }),
                        y &&
                            !p.FNAME &&
                            ((y = y.split(" ")),
                            (p.FNAME = y[0]),
                            (p.LNAME = p.LNAME || y[1]));
                    var l = k.action.replace("/post?", "/post-json?") + "&c=?",
                        D = l.indexOf("u=") + 2;
                    D = l.substring(D, l.indexOf("&", D));
                    var U = l.indexOf("id=") + 3;
                    (U = l.substring(U, l.indexOf("&", U))),
                        (p["b_" + D + "_" + U] = ""),
                        e
                            .ajax({ url: l, data: p, dataType: "jsonp" })
                            .done(function (x) {
                                (k.success =
                                    x.result === "success" ||
                                    /already/.test(x.msg)),
                                    k.success ||
                                        console.info(
                                            "MailChimp error: " + x.msg
                                        ),
                                    M(k);
                            })
                            .fail(function () {
                                M(k);
                            });
                }
                function M(k) {
                    var j = k.form,
                        p = k.redirect,
                        E = k.success;
                    if (E && p) {
                        Ri.location(p);
                        return;
                    }
                    k.done.toggle(E),
                        k.fail.toggle(!E),
                        E ? k.done.focus() : k.fail.focus(),
                        j.toggle(!E),
                        F(k);
                }
                function H(k) {
                    k.evt && k.evt.preventDefault(), (k.evt = null);
                }
                function B(k, j) {
                    if (!j.fileUploads || !j.fileUploads[k]) return;
                    var p,
                        E = e(j.fileUploads[k]),
                        y = E.find("> .w-file-upload-default"),
                        l = E.find("> .w-file-upload-uploading"),
                        D = E.find("> .w-file-upload-success"),
                        U = E.find("> .w-file-upload-error"),
                        x = y.find(".w-file-upload-input"),
                        te = y.find(".w-file-upload-label"),
                        se = te.children(),
                        ne = U.find(".w-file-upload-error-msg"),
                        fe = D.find(".w-file-upload-file"),
                        me = D.find(".w-file-remove-link"),
                        Ge = fe.find(".w-file-upload-file-name"),
                        Ze = ne.attr("data-w-size-error"),
                        Ae = ne.attr("data-w-type-error"),
                        lt = ne.attr("data-w-generic-error");
                    if (
                        (g ||
                            te.on("click keydown", function (I) {
                                (I.type === "keydown" &&
                                    I.which !== 13 &&
                                    I.which !== 32) ||
                                    (I.preventDefault(), x.click());
                            }),
                        te
                            .find(".w-icon-file-upload-icon")
                            .attr("aria-hidden", "true"),
                        me
                            .find(".w-icon-file-upload-remove")
                            .attr("aria-hidden", "true"),
                        g)
                    )
                        x.on("click", function (I) {
                            I.preventDefault();
                        }),
                            te.on("click", function (I) {
                                I.preventDefault();
                            }),
                            se.on("click", function (I) {
                                I.preventDefault();
                            });
                    else {
                        me.on("click keydown", function (I) {
                            if (I.type === "keydown") {
                                if (I.which !== 13 && I.which !== 32) return;
                                I.preventDefault();
                            }
                            x.removeAttr("data-value"),
                                x.val(""),
                                Ge.html(""),
                                y.toggle(!0),
                                D.toggle(!1),
                                te.focus();
                        }),
                            x.on("change", function (I) {
                                (p =
                                    I.target &&
                                    I.target.files &&
                                    I.target.files[0]),
                                    p &&
                                        (y.toggle(!1),
                                        U.toggle(!1),
                                        l.toggle(!0),
                                        l.focus(),
                                        Ge.text(p.name),
                                        C() || P(j),
                                        (j.fileUploads[k].uploading = !0),
                                        Z(p, m));
                            });
                        var kt = te.outerHeight();
                        x.height(kt), x.width(1);
                    }
                    function f(I) {
                        var L = I.responseJSON && I.responseJSON.msg,
                            K = lt;
                        typeof L == "string" &&
                        L.indexOf("InvalidFileTypeError") === 0
                            ? (K = Ae)
                            : typeof L == "string" &&
                              L.indexOf("MaxFileSizeError") === 0 &&
                              (K = Ze),
                            ne.text(K),
                            x.removeAttr("data-value"),
                            x.val(""),
                            l.toggle(!1),
                            y.toggle(!0),
                            U.toggle(!0),
                            U.focus(),
                            (j.fileUploads[k].uploading = !1),
                            C() || F(j);
                    }
                    function m(I, L) {
                        if (I) return f(I);
                        var K = L.fileName,
                            ee = L.postData,
                            le = L.fileId,
                            V = L.s3Url;
                        x.attr("data-value", le), J(V, ee, p, K, w);
                    }
                    function w(I) {
                        if (I) return f(I);
                        l.toggle(!1),
                            D.css("display", "inline-block"),
                            D.focus(),
                            (j.fileUploads[k].uploading = !1),
                            C() || F(j);
                    }
                    function C() {
                        var I =
                            (j.fileUploads && j.fileUploads.toArray()) || [];
                        return I.some(function (L) {
                            return L.uploading;
                        });
                    }
                }
                function Z(k, j) {
                    var p = new URLSearchParams({ name: k.name, size: k.size });
                    e.ajax({ type: "GET", url: `${T}?${p}`, crossDomain: !0 })
                        .done(function (E) {
                            j(null, E);
                        })
                        .fail(function (E) {
                            j(E);
                        });
                }
                function J(k, j, p, E, y) {
                    var l = new FormData();
                    for (var D in j) l.append(D, j[D]);
                    l.append("file", p, E),
                        e
                            .ajax({
                                type: "POST",
                                url: k,
                                data: l,
                                processData: !1,
                                contentType: !1,
                            })
                            .done(function () {
                                y(null);
                            })
                            .fail(function (U) {
                                y(U);
                            });
                }
                return r;
            })
        );
    });
    var H_ = c((oz, W_) => {
        "use strict";
        var At = ke(),
            MV = ln(),
            ct = {
                ARROW_LEFT: 37,
                ARROW_UP: 38,
                ARROW_RIGHT: 39,
                ARROW_DOWN: 40,
                SPACE: 32,
                ENTER: 13,
                HOME: 36,
                END: 35,
            },
            B_ =
                'a[href], area[href], [role="button"], input, select, textarea, button, iframe, object, embed, *[tabindex], *[contenteditable]';
        At.define(
            "slider",
            (W_.exports = function (e, t) {
                var r = {},
                    n = e.tram,
                    i = e(document),
                    o,
                    a,
                    s = At.env(),
                    u = ".w-slider",
                    d = '<div class="w-slider-dot" data-wf-ignore />',
                    h =
                        '<div aria-live="off" aria-atomic="true" class="w-slider-aria-label" data-wf-ignore />',
                    v = "w-slider-force-show",
                    g = MV.triggers,
                    b,
                    O = !1;
                (r.ready = function () {
                    (a = At.env("design")), T();
                }),
                    (r.design = function () {
                        (a = !0), setTimeout(T, 1e3);
                    }),
                    (r.preview = function () {
                        (a = !1), T();
                    }),
                    (r.redraw = function () {
                        (O = !0), T(), (O = !1);
                    }),
                    (r.destroy = S);
                function T() {
                    (o = i.find(u)), o.length && (o.each(R), !b && (S(), _()));
                }
                function S() {
                    At.resize.off(N), At.redraw.off(r.redraw);
                }
                function _() {
                    At.resize.on(N), At.redraw.on(r.redraw);
                }
                function N() {
                    o.filter(":visible").each(B);
                }
                function R(p, E) {
                    var y = e(E),
                        l = e.data(E, u);
                    l ||
                        (l = e.data(E, u, {
                            index: 0,
                            depth: 1,
                            hasFocus: { keyboard: !1, mouse: !1 },
                            el: y,
                            config: {},
                        })),
                        (l.mask = y.children(".w-slider-mask")),
                        (l.left = y.children(".w-slider-arrow-left")),
                        (l.right = y.children(".w-slider-arrow-right")),
                        (l.nav = y.children(".w-slider-nav")),
                        (l.slides = l.mask.children(".w-slide")),
                        l.slides.each(g.reset),
                        O && (l.maskWidth = 0),
                        y.attr("role") === void 0 && y.attr("role", "region"),
                        y.attr("aria-label") === void 0 &&
                            y.attr("aria-label", "carousel");
                    var D = l.mask.attr("id");
                    if (
                        (D ||
                            ((D = "w-slider-mask-" + p), l.mask.attr("id", D)),
                        !a &&
                            !l.ariaLiveLabel &&
                            (l.ariaLiveLabel = e(h).appendTo(l.mask)),
                        l.left.attr("role", "button"),
                        l.left.attr("tabindex", "0"),
                        l.left.attr("aria-controls", D),
                        l.left.attr("aria-label") === void 0 &&
                            l.left.attr("aria-label", "previous slide"),
                        l.right.attr("role", "button"),
                        l.right.attr("tabindex", "0"),
                        l.right.attr("aria-controls", D),
                        l.right.attr("aria-label") === void 0 &&
                            l.right.attr("aria-label", "next slide"),
                        !n.support.transform)
                    ) {
                        l.left.hide(), l.right.hide(), l.nav.hide(), (b = !0);
                        return;
                    }
                    l.el.off(u),
                        l.left.off(u),
                        l.right.off(u),
                        l.nav.off(u),
                        q(l),
                        a
                            ? (l.el.on("setting" + u, A(l)),
                              G(l),
                              (l.hasTimer = !1))
                            : (l.el.on("swipe" + u, A(l)),
                              l.left.on("click" + u, X(l)),
                              l.right.on("click" + u, z(l)),
                              l.left.on("keydown" + u, W(l, X)),
                              l.right.on("keydown" + u, W(l, z)),
                              l.nav.on("keydown" + u, "> div", A(l)),
                              l.config.autoplay &&
                                  !l.hasTimer &&
                                  ((l.hasTimer = !0), (l.timerCount = 1), $(l)),
                              l.el.on("mouseenter" + u, P(l, !0, "mouse")),
                              l.el.on("focusin" + u, P(l, !0, "keyboard")),
                              l.el.on("mouseleave" + u, P(l, !1, "mouse")),
                              l.el.on("focusout" + u, P(l, !1, "keyboard"))),
                        l.nav.on("click" + u, "> div", A(l)),
                        s ||
                            l.mask
                                .contents()
                                .filter(function () {
                                    return this.nodeType === 3;
                                })
                                .remove();
                    var U = y.filter(":hidden");
                    U.addClass(v);
                    var x = y.parents(":hidden");
                    x.addClass(v),
                        O || B(p, E),
                        U.removeClass(v),
                        x.removeClass(v);
                }
                function q(p) {
                    var E = {};
                    (E.crossOver = 0),
                        (E.animation = p.el.attr("data-animation") || "slide"),
                        E.animation === "outin" &&
                            ((E.animation = "cross"), (E.crossOver = 0.5)),
                        (E.easing = p.el.attr("data-easing") || "ease");
                    var y = p.el.attr("data-duration");
                    if (
                        ((E.duration = y != null ? parseInt(y, 10) : 500),
                        F(p.el.attr("data-infinite")) && (E.infinite = !0),
                        F(p.el.attr("data-disable-swipe")) &&
                            (E.disableSwipe = !0),
                        F(p.el.attr("data-hide-arrows"))
                            ? (E.hideArrows = !0)
                            : p.config.hideArrows &&
                              (p.left.show(), p.right.show()),
                        F(p.el.attr("data-autoplay")))
                    ) {
                        (E.autoplay = !0),
                            (E.delay =
                                parseInt(p.el.attr("data-delay"), 10) || 2e3),
                            (E.timerMax = parseInt(
                                p.el.attr("data-autoplay-limit"),
                                10
                            ));
                        var l = "mousedown" + u + " touchstart" + u;
                        a ||
                            p.el.off(l).one(l, function () {
                                G(p);
                            });
                    }
                    var D = p.right.width();
                    (E.edge = D ? D + 40 : 100), (p.config = E);
                }
                function F(p) {
                    return p === "1" || p === "true";
                }
                function P(p, E, y) {
                    return function (l) {
                        if (E) p.hasFocus[y] = E;
                        else if (
                            e.contains(p.el.get(0), l.relatedTarget) ||
                            ((p.hasFocus[y] = E),
                            (p.hasFocus.mouse && y === "keyboard") ||
                                (p.hasFocus.keyboard && y === "mouse"))
                        )
                            return;
                        E
                            ? (p.ariaLiveLabel.attr("aria-live", "polite"),
                              p.hasTimer && G(p))
                            : (p.ariaLiveLabel.attr("aria-live", "off"),
                              p.hasTimer && $(p));
                    };
                }
                function W(p, E) {
                    return function (y) {
                        switch (y.keyCode) {
                            case ct.SPACE:
                            case ct.ENTER:
                                return (
                                    E(p)(),
                                    y.preventDefault(),
                                    y.stopPropagation()
                                );
                        }
                    };
                }
                function X(p) {
                    return function () {
                        H(p, { index: p.index - 1, vector: -1 });
                    };
                }
                function z(p) {
                    return function () {
                        H(p, { index: p.index + 1, vector: 1 });
                    };
                }
                function Y(p, E) {
                    var y = null;
                    E === p.slides.length && (T(), Z(p)),
                        t.each(p.anchors, function (l, D) {
                            e(l.els).each(function (U, x) {
                                e(x).index() === E && (y = D);
                            });
                        }),
                        y != null && H(p, { index: y, immediate: !0 });
                }
                function $(p) {
                    G(p);
                    var E = p.config,
                        y = E.timerMax;
                    (y && p.timerCount++ > y) ||
                        (p.timerId = window.setTimeout(function () {
                            p.timerId == null || a || (z(p)(), $(p));
                        }, E.delay));
                }
                function G(p) {
                    window.clearTimeout(p.timerId), (p.timerId = null);
                }
                function A(p) {
                    return function (E, y) {
                        y = y || {};
                        var l = p.config;
                        if (a && E.type === "setting") {
                            if (y.select === "prev") return X(p)();
                            if (y.select === "next") return z(p)();
                            if ((q(p), Z(p), y.select == null)) return;
                            Y(p, y.select);
                            return;
                        }
                        if (E.type === "swipe")
                            return l.disableSwipe || At.env("editor")
                                ? void 0
                                : y.direction === "left"
                                ? z(p)()
                                : y.direction === "right"
                                ? X(p)()
                                : void 0;
                        if (p.nav.has(E.target).length) {
                            var D = e(E.target).index();
                            if (
                                (E.type === "click" && H(p, { index: D }),
                                E.type === "keydown")
                            )
                                switch (E.keyCode) {
                                    case ct.ENTER:
                                    case ct.SPACE: {
                                        H(p, { index: D }), E.preventDefault();
                                        break;
                                    }
                                    case ct.ARROW_LEFT:
                                    case ct.ARROW_UP: {
                                        M(p.nav, Math.max(D - 1, 0)),
                                            E.preventDefault();
                                        break;
                                    }
                                    case ct.ARROW_RIGHT:
                                    case ct.ARROW_DOWN: {
                                        M(p.nav, Math.min(D + 1, p.pages)),
                                            E.preventDefault();
                                        break;
                                    }
                                    case ct.HOME: {
                                        M(p.nav, 0), E.preventDefault();
                                        break;
                                    }
                                    case ct.END: {
                                        M(p.nav, p.pages), E.preventDefault();
                                        break;
                                    }
                                    default:
                                        return;
                                }
                        }
                    };
                }
                function M(p, E) {
                    var y = p.children().eq(E).focus();
                    p.children().not(y);
                }
                function H(p, E) {
                    E = E || {};
                    var y = p.config,
                        l = p.anchors;
                    p.previous = p.index;
                    var D = E.index,
                        U = {};
                    D < 0
                        ? ((D = l.length - 1),
                          y.infinite &&
                              ((U.x = -p.endX),
                              (U.from = 0),
                              (U.to = l[0].width)))
                        : D >= l.length &&
                          ((D = 0),
                          y.infinite &&
                              ((U.x = l[l.length - 1].width),
                              (U.from = -l[l.length - 1].x),
                              (U.to = U.from - U.x))),
                        (p.index = D);
                    var x = p.nav
                        .children()
                        .eq(D)
                        .addClass("w-active")
                        .attr("aria-pressed", "true")
                        .attr("tabindex", "0");
                    p.nav
                        .children()
                        .not(x)
                        .removeClass("w-active")
                        .attr("aria-pressed", "false")
                        .attr("tabindex", "-1"),
                        y.hideArrows &&
                            (p.index === l.length - 1
                                ? p.right.hide()
                                : p.right.show(),
                            p.index === 0 ? p.left.hide() : p.left.show());
                    var te = p.offsetX || 0,
                        se = (p.offsetX = -l[p.index].x),
                        ne = { x: se, opacity: 1, visibility: "" },
                        fe = e(l[p.index].els),
                        me = e(l[p.previous] && l[p.previous].els),
                        Ge = p.slides.not(fe),
                        Ze = y.animation,
                        Ae = y.easing,
                        lt = Math.round(y.duration),
                        kt = E.vector || (p.index > p.previous ? 1 : -1),
                        f = "opacity " + lt + "ms " + Ae,
                        m = "transform " + lt + "ms " + Ae;
                    if (
                        (fe.find(B_).removeAttr("tabindex"),
                        fe.removeAttr("aria-hidden"),
                        fe.find("*").removeAttr("aria-hidden"),
                        Ge.find(B_).attr("tabindex", "-1"),
                        Ge.attr("aria-hidden", "true"),
                        Ge.find("*").attr("aria-hidden", "true"),
                        a || (fe.each(g.intro), Ge.each(g.outro)),
                        E.immediate && !O)
                    ) {
                        n(fe).set(ne), I();
                        return;
                    }
                    if (p.index === p.previous) return;
                    if (
                        (a ||
                            p.ariaLiveLabel.text(
                                `Slide ${D + 1} of ${l.length}.`
                            ),
                        Ze === "cross")
                    ) {
                        var w = Math.round(lt - lt * y.crossOver),
                            C = Math.round(lt - w);
                        (f = "opacity " + w + "ms " + Ae),
                            n(me)
                                .set({ visibility: "" })
                                .add(f)
                                .start({ opacity: 0 }),
                            n(fe)
                                .set({
                                    visibility: "",
                                    x: se,
                                    opacity: 0,
                                    zIndex: p.depth++,
                                })
                                .add(f)
                                .wait(C)
                                .then({ opacity: 1 })
                                .then(I);
                        return;
                    }
                    if (Ze === "fade") {
                        n(me).set({ visibility: "" }).stop(),
                            n(fe)
                                .set({
                                    visibility: "",
                                    x: se,
                                    opacity: 0,
                                    zIndex: p.depth++,
                                })
                                .add(f)
                                .start({ opacity: 1 })
                                .then(I);
                        return;
                    }
                    if (Ze === "over") {
                        (ne = { x: p.endX }),
                            n(me).set({ visibility: "" }).stop(),
                            n(fe)
                                .set({
                                    visibility: "",
                                    zIndex: p.depth++,
                                    x: se + l[p.index].width * kt,
                                })
                                .add(m)
                                .start({ x: se })
                                .then(I);
                        return;
                    }
                    y.infinite && U.x
                        ? (n(p.slides.not(me))
                              .set({ visibility: "", x: U.x })
                              .add(m)
                              .start({ x: se }),
                          n(me)
                              .set({ visibility: "", x: U.from })
                              .add(m)
                              .start({ x: U.to }),
                          (p.shifted = me))
                        : (y.infinite &&
                              p.shifted &&
                              (n(p.shifted).set({ visibility: "", x: te }),
                              (p.shifted = null)),
                          n(p.slides)
                              .set({ visibility: "" })
                              .add(m)
                              .start({ x: se }));
                    function I() {
                        (fe = e(l[p.index].els)),
                            (Ge = p.slides.not(fe)),
                            Ze !== "slide" && (ne.visibility = "hidden"),
                            n(Ge).set(ne);
                    }
                }
                function B(p, E) {
                    var y = e.data(E, u);
                    if (y) {
                        if (k(y)) return Z(y);
                        a && j(y) && Z(y);
                    }
                }
                function Z(p) {
                    var E = 1,
                        y = 0,
                        l = 0,
                        D = 0,
                        U = p.maskWidth,
                        x = U - p.config.edge;
                    x < 0 && (x = 0),
                        (p.anchors = [{ els: [], x: 0, width: 0 }]),
                        p.slides.each(function (se, ne) {
                            l - y > x &&
                                (E++,
                                (y += U),
                                (p.anchors[E - 1] = {
                                    els: [],
                                    x: l,
                                    width: 0,
                                })),
                                (D = e(ne).outerWidth(!0)),
                                (l += D),
                                (p.anchors[E - 1].width += D),
                                p.anchors[E - 1].els.push(ne);
                            var fe = se + 1 + " of " + p.slides.length;
                            e(ne).attr("aria-label", fe),
                                e(ne).attr("role", "group");
                        }),
                        (p.endX = l),
                        a && (p.pages = null),
                        p.nav.length && p.pages !== E && ((p.pages = E), J(p));
                    var te = p.index;
                    te >= E && (te = E - 1), H(p, { immediate: !0, index: te });
                }
                function J(p) {
                    var E = [],
                        y,
                        l = p.el.attr("data-nav-spacing");
                    l && (l = parseFloat(l) + "px");
                    for (var D = 0, U = p.pages; D < U; D++)
                        (y = e(d)),
                            y
                                .attr(
                                    "aria-label",
                                    "Show slide " + (D + 1) + " of " + U
                                )
                                .attr("aria-pressed", "false")
                                .attr("role", "button")
                                .attr("tabindex", "-1"),
                            p.nav.hasClass("w-num") && y.text(D + 1),
                            l != null &&
                                y.css({ "margin-left": l, "margin-right": l }),
                            E.push(y);
                    p.nav.empty().append(E);
                }
                function k(p) {
                    var E = p.mask.width();
                    return p.maskWidth !== E ? ((p.maskWidth = E), !0) : !1;
                }
                function j(p) {
                    var E = 0;
                    return (
                        p.slides.each(function (y, l) {
                            E += e(l).outerWidth(!0);
                        }),
                        p.slidesWidth !== E ? ((p.slidesWidth = E), !0) : !1
                    );
                }
                return r;
            })
        );
    });
    Hs();
    js();
    Ks();
    Qs();
    ln();
    C_();
    L_();
    P_();
    F_();
    G_();
    V_();
    H_();
})();
/*!
 * tram.js v0.8.2-global
 * Cross-browser CSS3 transitions in JavaScript
 * https://github.com/bkwld/tram
 * MIT License
 */
/*!
 * Webflow._ (aka) Underscore.js 1.6.0 (custom build)
 *
 * http://underscorejs.org
 * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Underscore may be freely distributed under the MIT license.
 * @license MIT
 */
/*! Bundled license information:

    timm/lib/timm.js:
      (*!
       * Timm
       *
       * Immutability helpers with fast reads and acceptable writes.
       *
       * @copyright Guillermo Grau Panea 2016
       * @license MIT
       *)
    */
/**
 * ----------------------------------------------------------------------
 * Webflow: Interactions 2.0: Init
 */
Webflow.require("ix2").init({
    events: {
        "e-27": {
            id: "e-27",
            name: "",
            animationType: "custom",
            eventTypeId: "MOUSE_CLICK",
            action: {
                id: "",
                actionTypeId: "GENERAL_START_ACTION",
                config: {
                    delay: 0,
                    easing: "",
                    duration: 0,
                    actionListId: "a-2",
                    affectedElements: {},
                    playInReverse: false,
                    autoStopEventId: "e-28",
                },
            },
            mediaQueries: ["main", "medium", "small", "tiny"],
            target: {
                id: "65ecb4b23af4c369d4ea3320|2da2e157-4476-387b-eee7-fa8bcc1ef1f0",
                appliesTo: "ELEMENT",
                styleBlockIds: [],
            },
            targets: [
                {
                    id: "65ecb4b23af4c369d4ea3320|2da2e157-4476-387b-eee7-fa8bcc1ef1f0",
                    appliesTo: "ELEMENT",
                    styleBlockIds: [],
                },
            ],
            config: {
                loop: false,
                playInReverse: false,
                scrollOffsetValue: null,
                scrollOffsetUnit: null,
                delay: null,
                direction: null,
                effectIn: null,
            },
            createdOn: 1717775531953,
        },
        "e-29": {
            id: "e-29",
            name: "",
            animationType: "custom",
            eventTypeId: "PAGE_START",
            action: {
                id: "",
                actionTypeId: "GENERAL_START_ACTION",
                config: {
                    delay: 0,
                    easing: "",
                    duration: 0,
                    actionListId: "a-3",
                    affectedElements: {},
                    playInReverse: false,
                    autoStopEventId: "e-30",
                },
            },
            mediaQueries: ["main", "medium", "small", "tiny"],
            target: {
                id: "66631fc07039894ee0eef5bb",
                appliesTo: "PAGE",
                styleBlockIds: [],
            },
            targets: [
                {
                    id: "66631fc07039894ee0eef5bb",
                    appliesTo: "PAGE",
                    styleBlockIds: [],
                },
            ],
            config: {
                loop: false,
                playInReverse: false,
                scrollOffsetValue: null,
                scrollOffsetUnit: null,
                delay: null,
                direction: null,
                effectIn: null,
            },
            createdOn: 1717776135978,
        },
    },
    actionLists: {
        "a-2": {
            id: "a-2",
            title: "Login",
            actionItemGroups: [
                {
                    actionItems: [
                        {
                            id: "a-2-n",
                            actionTypeId: "GENERAL_DISPLAY",
                            config: {
                                delay: 0,
                                easing: "",
                                duration: 0,
                                target: {
                                    useEventTarget: "PARENT",
                                    id: "65ecb4b23af4c369d4ea3320|f6d05d40-0ed1-c8b7-e7b6-cb12a3aa9298",
                                },
                                value: "none",
                            },
                        },
                    ],
                },
            ],
            useFirstGroupAsInitialState: false,
            createdOn: 1717775544879,
        },
        "a-3": {
            id: "a-3",
            title: "AdsAnimation",
            actionItemGroups: [],
            useFirstGroupAsInitialState: false,
            createdOn: 1717776142344,
        },
    },
    site: {
        mediaQueries: [
            { key: "main", min: 992, max: 10000 },
            { key: "medium", min: 768, max: 991 },
            { key: "small", min: 480, max: 767 },
            { key: "tiny", min: 0, max: 479 },
        ],
    },
});
