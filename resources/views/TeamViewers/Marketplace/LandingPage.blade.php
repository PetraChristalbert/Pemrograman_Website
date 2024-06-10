<!DOCTYPE html>
<!-- This site was created in Webflow. https://webflow.com --><!-- Last Published: Mon Jun 10 2024 08:03:27 GMT+0000 (Coordinated Universal Time) -->
<html
    data-wf-domain="marketplace-f1aba9.webflow.io"
    data-wf-page="65ecb4b23af4c369d4ea3320"
    data-wf-site="65ecb4b23af4c369d4ea3319"
>
    <head>
        <meta charset="utf-8" />
        <title>Marketplace</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Webflow" name="generator" />
        <link
            href="/css/TeamViewers/Marketplace/LandingPage.css"
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
                google: { families: ["Inter:regular,500,600,700,800"] },
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
    <body class="body">
        <div class="popup">
            <div class="w-layout-blockcontainer container-9 w-container">
                <div class="form-block-3 w-form">
                    <form
                        id="email-form-3"
                        name="email-form-3"
                        data-name="Email Form 3"
                        method="get"
                        class="form-3"
                        data-wf-page-id="65ecb4b23af4c369d4ea3320"
                        data-wf-element-id="2da2e157-4476-387b-eee7-fa8bcc1ef1e9"
                    >
                        <input
                            class="text-field-3 w-input"
                            maxlength="256"
                            name="name-4"
                            data-name="Name 4"
                            placeholder="Username"
                            type="text"
                            id="name-4"
                            required=""
                        /><input
                            class="text-field-4 w-input"
                            maxlength="256"
                            name="email"
                            data-name="Email"
                            placeholder="Password"
                            type="text"
                            id="email"
                            required=""
                        /><input
                            type="submit"
                            data-wait="Login"
                            class="submit-button-2 w-button"
                            value="Login"
                            onclick="checkUser()"
                        />
                    </form>
                    {{-- <div class="w-form-done">
                        <div>Thank you! Your submission has been received!</div>
                    </div>
                    <div class="w-form-fail">
                        <div>
                            Oops! Something went wrong while submitting the
                            form.
                        </div>
                    </div> --}}
                </div>
            </div>
        </div>
        <section class="section-2">
            <h1 class="heading-9">TeamViewers</h1>
            <div class="form-block-2 w-form">
                <form
                    id="email-form-2"
                    name="email-form-2"
                    data-name="Email Form 2"
                    method="get"
                    class="form-2"
                    data-wf-page-id="65ecb4b23af4c369d4ea3320"
                    data-wf-element-id="7326f042-3f0a-01d0-4764-f7557234c318"
                >
                    <input
                        class="text-field-2 w-input"
                        maxlength="256"
                        name="name-3"
                        data-name="Name 3"
                        placeholder=""
                        type="text"
                        id="name-3"
                    />
                </form>
                <div class="w-form-done">
                    <div>Thank you! Your submission has been received!</div>
                </div>
                <div class="w-form-fail">
                    <div>
                        Oops! Something went wrong while submitting the form.
                    </div>
                </div>
            </div>
            <div class="div-block-3">
                <img
                    src="https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/66631b60142bfe6ade9faa3a_user.png"
                    loading="lazy"
                    width="35"
                    height="35"
                    alt=""
                    srcset="
                        https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/66631b60142bfe6ade9faa3a_user-p-500.png 500w,
                        https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/66631b60142bfe6ade9faa3a_user.png       512w
                    "
                    sizes="35px"
                /><img
                    src="https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/66631b60e9cd90b03b88af2d_more.png"
                    loading="lazy"
                    width="35"
                    height="35"
                    alt=""
                    srcset="
                        https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/66631b60e9cd90b03b88af2d_more-p-500.png 500w,
                        https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/66631b60e9cd90b03b88af2d_more.png       512w
                    "
                    sizes="35px"
                />
            </div>
        </section>
        <div class="w-layout-blockcontainer container w-container">
            <div class="w-layout-hflex flex-block-12">
                <div class="w-layout-vflex flex-block-13">
                    <h1 class="heading-7">
                        Cari, dapatkan dan bagikan karyamu
                    </h1>
                    <p class="paragraph-5">
                        Marketplace publik dengan sistem transaksi yang aman
                        serta bebas biaya perantara
                    </p>
                    <div class="w-layout-hflex flex-block-14">
                        <a class="button w-button" onclick="openMarketplace()">Shopping Now</a
                        ><a class="button-2 w-button" onclick="openCentre()">Seller Centre</a>
                    </div>
                </div>
                <img
                    src="https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/65f13cea2d57b8c9b962db1f_anime_girl_1.png"
                    loading="lazy"
                    width="488.5"
                    sizes="(max-width: 767px) 90vw, 488.5px"
                    alt=""
                    srcset="
                        https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/65f13cea2d57b8c9b962db1f_anime_girl_1-p-500.png 500w,
                        https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/65f13cea2d57b8c9b962db1f_anime_girl_1-p-800.png 800w,
                        https://cdn.prod.website-files.com/65ecb4b23af4c369d4ea3319/65f13cea2d57b8c9b962db1f_anime_girl_1.png       977w
                    "
                    class="image-3"
                />
            </div>
        </div>
        <script
            src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=65ecb4b23af4c369d4ea3319"
            type="text/javascript"
            integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
            crossorigin="anonymous"
        ></script>
        <script
            src="/js/TeamViewers/Marketplace/LandingPage.js"
            type="text/javascript"
        ></script>
    </body>
</html>
