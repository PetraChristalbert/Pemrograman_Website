<!DOCTYPE html>
<!-- This site was created in Webflow. https://webflow.com --><!-- Last Published: Sun Jun 09 2024 06:17:17 GMT+0000 (Coordinated Universal Time) -->
<html
    data-wf-domain="description-product.webflow.io"
    data-wf-page="666423c230a62eac90cd44a4"
    data-wf-site="65fc592e25023f3e5548c715"
>
    <head>
        <meta charset="utf-8" />
        <title>ProductDetail</title>
        <meta content="ProductDetail" property="og:title" />
        <meta content="ProductDetail" property="twitter:title" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Webflow" name="generator" />
        <link
            href="/css/TeamViewers/Marketplace/ProductDetail.css"
            rel="stylesheet"
            type="text/css"
        />
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
            href="https://fonts.gstatic.com"
            rel="preconnect"
            crossorigin="anonymous"
        />
        <script
            src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
            type="text/javascript"
        ></script>
        <script type="text/javascript">
            WebFont.load({
                google: {
                    families: [
                        "Lato:100,100italic,300,300italic,400,400italic,700,700italic,900,900italic",
                        "Open Sans:300,300italic,400,400italic,600,600italic,700,700italic,800,800italic",
                        "Inter:200,300,regular,500,600,700,800,900",
                    ],
                },
            });
        </script>
        <script type="text/javascript">
            !(function (o, c) {
                var n = c.documentElement,
                    t = " w-mod-";
                (n.className += t + "js"),
                    ("ontouchstart" in o ||
                        (o.DocumentTouch && c instanceof DocumentTouch)) &&
                        (n.className += t + "touch");
            })(window, document);
        </script>
        <link
            href="https://cdn.prod.website-files.com/img/favicon.ico"
            rel="shortcut icon"
            type="image/x-icon"
        />
        <link
            href="https://cdn.prod.website-files.com/img/webclip.png"
            rel="apple-touch-icon"
        />
    </head>
    <body class="body-2">
        <div id="UserID" data-id="{{ $UserID }}"></div>
        <div id="ProductID" data-id="{{ $ProductID }}"></div>
        <div class="popup">
            <div class="ratingbox">
                <div class="w-layout-hflex flex-block-30">
                    <img
                        src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6665465ef8f6a2dd61cbb2df_star%20(1).png"
                        loading="lazy"
                        width="30"
                        alt=""
                        class="star1"
                        onclick="SelectRating(1)"
                    /><img
                        src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6665465ef8f6a2dd61cbb2df_star%20(1).png"
                        loading="lazy"
                        width="30"
                        alt=""
                        class="star2"
                        onclick="SelectRating(2)"
                    /><img
                        loading="lazy"
                        width="30"
                        alt=""
                        class="star3"
                        onclick="SelectRating(3)"
                    /><img
                        src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6665465ef8f6a2dd61cbb2df_star%20(1).png"
                        loading="lazy"
                        width="30"
                        alt=""
                        class="star4"
                        onclick="SelectRating(4)"
                    /><img
                        src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6665465ef8f6a2dd61cbb2df_star%20(1).png"
                        loading="lazy"
                        width="30"
                        alt=""
                        class="star5"
                        onclick="SelectRating(5)"
                    />
                </div>
                <div class="reviewtext w-form">
                    <form
                        id="email-form-3"
                        name="email-form-3"
                        data-name="Email Form 3"
                        method="get"
                        data-wf-page-id="666423c230a62eac90cd44a4"
                        data-wf-element-id="18dc1f70-70ff-9e7e-0e47-1c8354927f79"
                    >
                        <textarea
                            id="CatatamPenjual-2"
                            name="CatatamPenjual-2"
                            maxlength="5000"
                            data-name="Catatam Penjual 2"
                            placeholder="Catatan Penjual"
                            class="textarea-new w-input reviewersnya"
                        ></textarea>
                    </form>
                    <div class="w-form-done">
                        <div>Thank you! Your submission has been received!</div>
                    </div>
                    <div class="w-form-fail">
                        <div>
                            Oops! Something went wrong while submitting the
                            form.
                        </div>
                    </div>
                </div>
                <div class="donereview">
                    <a class="button-3a w-button" onclick="FinishOrder()">Done</a>
                </div>
            </div>
        </div>
        <section class="section-2">
            <h1 class="heading-14">TeamViewers</h1>
            <div class="w-layout-blockcontainer container-10 w-container">
                <div class="form-block-2 w-form">
                    <form
                        id="email-form-2"
                        name="email-form-2"
                        data-name="Email Form 2"
                        method="get"
                        class="form-2"
                        data-wf-page-id="666423c230a62eac90cd44a4"
                        data-wf-element-id="2cb9829f-c925-607c-18f6-b96fb97e8367"
                    >
                        <input
                            class="text-field-2 w-input"
                            maxlength="256"
                            name="name-3"
                            data-name="Name 3"
                            placeholder=""
                            type="text"
                            id="name-3"
                        /><img
                            width="18"
                            height="18"
                            alt=""
                            src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/666423d210723ff5fdb134ff_search%20(3).png"
                            loading="lazy"
                            class="image-16"
                        />
                    </form>
                    <div class="w-form-done">
                        <div>Thank you! Your submission has been received!</div>
                    </div>
                    <div class="w-form-fail">
                        <div>
                            Oops! Something went wrong while submitting the
                            form.
                        </div>
                    </div>
                </div>
            </div>
            <div class="div-block-4">
                <div
                    data-delay="0"
                    data-hover="false"
                    class="dropdown-2 w-dropdown"
                >
                    <div class="w-dropdown-toggle"></div>
                    <article class="dropdown-list-2 w-dropdown-list">
                        <div class="notifobject">
                            <img
                                width="371.5"
                                sizes="100vw"
                                alt=""
                                src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/666423d210723ff5fdb1349f_Screenshot%202024-04-29%20193033.png"
                                loading="lazy"
                                class="image-15"
                            />
                            <h1 class="heading-13"></h1>
                            <h1 class="price"></h1>
                            <h1 class="price"></h1>
                        </div>
                    </article>
                </div>
                <img
                    width="35"
                    height="35"
                    alt=""
                    src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/666423d210723ff5fdb134b5_more.png"
                    loading="lazy"
                    srcset="
                        https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/666423d210723ff5fdb134b5_more-p-500.png 500w,
                        https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/666423d210723ff5fdb134b5_more.png       512w
                    "
                    sizes="35px"
                    class="image-13"
                />
            </div>
        </section>
        <div class="div-block-5">
            <div class="area">
                <div
                    data-w-id="c8385a6b-eeff-dba8-4206-f5c7d5c7e40b"
                    class="w-layout-blockcontainer imagereview w-container"
                >
                    <div
                        data-w-id="c8385a6b-eeff-dba8-4206-f5c7d5c7e40c"
                        class="w-layout-hflex flex-block-14"
                    >
                        <img
                            src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/660191b44fb5141ce0f65452_arrow_previous.png"
                            loading="lazy"
                            width="30"
                            height="30"
                            alt=""
                            class="image-4"
                            onclick="changeImage('Left')"
                        /><img
                            src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/660191afc4a7f701ff5818d1_arrow_next.png"
                            loading="lazy"
                            width="30"
                            height="30"
                            alt=""
                            class="image-4"
                            onclick="changeImage('Right')"
                        />
                    </div>
                </div>
                <div class="div-block-7 list-image">

                </div>
            </div>
            <div class="area">
                <div class="w-layout-vflex flex-block-16">
                    <h1 class="productname"></h1>
                    <div class="div-block-2">
                        <div class="w-layout-hflex flex-block-20">
                            <img
                                src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/66642867dd15b8778463ae11_user%20(1).png"
                                loading="lazy"
                                width="70"
                                sizes="(max-width: 767px) 18px, (max-width: 991px) 2vw, 18px"
                                alt=""
                                srcset="
                                    https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/66642867dd15b8778463ae11_user%20(1)-p-500.png 500w,
                                    https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/66642867dd15b8778463ae11_user%20(1).png       512w
                                "
                                class="image-7"
                            />
                            <div class="sellername"></div>
                        </div>
                        <div class="w-layout-hflex flex-block-20">
                            <img
                                src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6601a1754007075bd039b498_star.png"
                                loading="lazy"
                                width="70"
                                sizes="(max-width: 767px) 18px, (max-width: 991px) 2vw, 18px"
                                alt=""
                                srcset="
                                    https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6601a1754007075bd039b498_star-p-500.png 500w,
                                    https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6601a1754007075bd039b498_star.png       512w
                                "
                                class="image-7"
                            />
                            <div class="ratingcount"></div>
                        </div>
                        <div class="w-layout-hflex flex-block-20">
                            <img
                                src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6601a1754007075bd039b49b_sold-out.png"
                                loading="lazy"
                                width="70"
                                sizes="(max-width: 767px) 18px, (max-width: 991px) 2vw, 18px"
                                alt=""
                                srcset="
                                    https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6601a1754007075bd039b49b_sold-out-p-500.png 500w,
                                    https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6601a1754007075bd039b49b_sold-out.png       512w
                                "
                                class="image-7"
                            />
                            <div class="soldcount"></div>
                        </div>
                    </div>
                    <h1 class="priceamount"></h1>
                    <div class="w-layout-vflex flex-block-22">
                        <div
                            data-w-id="d2f586cb-6f23-63b8-143d-776132dbb0ff"
                            class="w-layout-hflex flex-block-21"
                        >
                            <div class="text-block-4">Deskripsi</div>
                            <img
                                src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6664291b0d454fb3899fcda9_arrow-down-sign-to-navigate%20(1).png"
                                loading="lazy"
                                width="Auto"
                                data-w-id="d2f586cb-6f23-63b8-143d-776132dbb102"
                                alt=""
                                class="image-8e"
                            /><img
                                src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6664291b0d454fb3899fcda6_arrow-down-sign-to-navigate.png"
                                loading="lazy"
                                width="Auto"
                                data-w-id="cae9c960-6757-1e2b-350e-9d64736ff92f"
                                alt=""
                                class="image-8b"
                            />
                        </div>
                        <p
                            data-w-id="d2f586cb-6f23-63b8-143d-776132dbb103"
                            class="descriptiontext"
                        ></p>
                    </div>
                    <div class="w-layout-vflex flex-block-22">
                        <div
                            data-w-id="d2f586cb-6f23-63b8-143d-776132dbb10c"
                            class="w-layout-hflex flex-block-21"
                        >
                            <div class="text-block-4">Review</div>
                            <img
                                src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6664291b0d454fb3899fcda9_arrow-down-sign-to-navigate%20(1).png"
                                loading="lazy"
                                width="Auto"
                                data-w-id="d2f586cb-6f23-63b8-143d-776132dbb10f"
                                alt=""
                                class="image-8c"
                            /><img
                                src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/6664291b0d454fb3899fcda6_arrow-down-sign-to-navigate.png"
                                loading="lazy"
                                width="Auto"
                                data-w-id="b8139038-f99a-53dc-12dd-e03992401b4c"
                                alt=""
                                class="image-8a"
                            />
                        </div>
                        <div
                            data-w-id="d2f586cb-6f23-63b8-143d-776132dbb110"
                            class="w-layout-vflex reviewarea">
                            {{-- Here The Review Generated --}}
                        </div>
                    </div>
                </div>
            </div>
            <div class="area 3">
                <div class="div-block-12">
                    <div class="judulbuatpesanan">Buat Pesanan</div>
                    <div class="w-layout-hflex flex-block-27">
                        <a href="#" class="button w-button lessamount" onclick="ModifyAmount('-')">-</a>
                        <div class="text-block-5 amountbuy">0</div>
                        <a href="#" class="button w-button moreamount" onclick="ModifyAmount('+')">+</a>
                    </div>
                    <div class="form-block-3 w-form">
                        <form
                            id="email-form-3"
                            name="email-form-3"
                            data-name="Email Form 3"
                            method="get"
                            data-wf-page-id="666423c230a62eac90cd44a4"
                            data-wf-element-id="b9d339da-5dc7-405a-6ffd-fc4c8bb558ad"
                        >
                            <textarea
                                id="CatatamPenjual"
                                name="CatatamPenjual"
                                maxlength="5000"
                                data-name="CatatamPenjual"
                                placeholder="Catatan Penjual"
                                class="textarea-old w-input"
                            ></textarea>
                        </form>
                        <div class="w-form-done">
                            <div>
                                Thank you! Your submission has been received!
                            </div>
                        </div>
                        <div class="w-form-fail">
                            <div>
                                Oops! Something went wrong while submitting the
                                form.
                            </div>
                        </div>
                    </div>
                    <div class="div-block-9">
                        <h1 class="totalharga1">Subtotal</h1>
                        <h1 class="totalharga1 nilai">Rp 0</h1>
                    </div>
                    <div class="buy-whislist">
                        <a class="button-2-copy w-button" onclick="buyProduct()">Buy</a
                        ><a href="#" class="button-3a w-button">+ Whistlist</a>
                    </div>
                    <div class="div-block-11">
                        <div class="w-layout-hflex flex-block-20x" onclick="chat_seller()">
                            <img
                                src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/66643c1076533b27ce850091_chat%20(1).png"
                                loading="lazy"
                                width="70"
                                sizes="(max-width: 767px) 18px, (max-width: 991px) 2vw, 18px"
                                alt=""
                                srcset="
                                    https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/66643c1076533b27ce850091_chat%20(1)-p-500.png 500w,
                                    https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/66643c1076533b27ce850091_chat%20(1).png       512w
                                "
                                class="image-7"
                            />
                            <div class="text-block-3x">Chat</div>
                        </div>
                        <div class="text-block-3x">|</div>
                        <div class="w-layout-hflex flex-block-20">
                            <img
                                src="https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/66643c0fefa1013c29b644c9_share.png"
                                loading="lazy"
                                width="70"
                                sizes="(max-width: 767px) 18px, (max-width: 991px) 2vw, 18px"
                                alt=""
                                srcset="
                                    https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/66643c0fefa1013c29b644c9_share-p-500.png 500w,
                                    https://cdn.prod.website-files.com/65fc592e25023f3e5548c715/66643c0fefa1013c29b644c9_share.png       512w
                                "
                                class="image-7"
                            />
                            <div class="text-block-3y">Share</div>
                        </div>
                    </div>
                </div>
                {{-- Here Placed the items --}}
            </div>
        </div>
        <script
            src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=65fc592e25023f3e5548c715"
            type="text/javascript"
            integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
            crossorigin="anonymous"
        ></script>
        <script
            src="/js/TeamViewers/Marketplace/ProductDetail.js"
            type="text/javascript"
        ></script>
    </body>
</html>
