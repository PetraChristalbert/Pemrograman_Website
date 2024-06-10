<!DOCTYPE html>
<!-- This site was created in Webflow. https://webflow.com --><!-- Last Published: Mon Jun 10 2024 10:36:37 GMT+0000 (Coordinated Universal Time) -->
<html
    data-wf-domain="sampai.webflow.io"
    data-wf-page="6640cbbbaa746925b0543431"
    data-wf-site="6640cbbbaa746925b0543427"
>
    <head>
        <meta charset="utf-8" />
        <title>SAMPAI</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta content="Webflow" name="generator" />
        <link
            href="/css/TeamViewers/Marketplace/EditProduct.css"
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
                        "Droid Sans:400,700",
                        "Lato:100,100italic,300,300italic,400,400italic,700,700italic,900,900italic",
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
    <body class="body">
        <div id="UserID" data-id="<?php echo e($UserID); ?>"></div>
        <div id="ProductID" data-id="<?php echo e($ProductID); ?>"></div>
        <input type="file" id="myFile" accept="image/*" style="display: none;" onchange="handleFileSelection(event)" />
        <section class="section-2">
            <h1 class="heading-14">TeamViewers</h1>
            <div class="w-layout-blockcontainer container-10 w-container">
                <div class="form-block-3 w-form">
                    <form
                        id="email-form-2"
                        name="email-form-2"
                        data-name="Email Form 2"
                        method="get"
                        class="form-2"
                        data-wf-page-id="6640cbbbaa746925b0543431"
                        data-wf-element-id="af3010f8-d6e9-ae02-024b-afd95a09e845"
                    >
                        <input
                            class="text-field-3 w-input"
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
                            src="https://cdn.prod.website-files.com/6640cbbbaa746925b0543427/66647ffb470c35208faca242_search%20(3).png"
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
                                src="https://cdn.prod.website-files.com/6640cbbbaa746925b0543427/66647ffa470c35208faca1db_Screenshot%202024-04-29%20193033.png"
                                loading="lazy"
                                srcset="
                                    https://cdn.prod.website-files.com/6640cbbbaa746925b0543427/66647ffa470c35208faca1db_Screenshot%25202024-04-29%2520193033-p-500.png 500w,
                                    https://cdn.prod.website-files.com/6640cbbbaa746925b0543427/66647ffa470c35208faca1db_Screenshot%202024-04-29%20193033.png           743w
                                "
                                class="image-15"
                            />
                            <h1 class="heading-13">
                                Nama Produk Terkait Baru Muncul
                            </h1>
                            <h1 class="price">Rp 1.500.000</h1>
                            <h1 class="price">Processed</h1>
                        </div>
                    </article>
                </div>
                <img
                    width="35"
                    height="35"
                    alt=""
                    src="https://cdn.prod.website-files.com/6640cbbbaa746925b0543427/66647ffa470c35208faca1ff_more.png"
                    loading="lazy"
                    srcset="
                        https://cdn.prod.website-files.com/6640cbbbaa746925b0543427/66647ffa470c35208faca1ff_more-p-500.png 500w,
                        https://cdn.prod.website-files.com/6640cbbbaa746925b0543427/66647ffa470c35208faca1ff_more.png       512w
                    "
                    sizes="35px"
                    class="image-13"
                />
            </div>
        </section>
        <div class="div-block-5">
            <div class="area">
                <div
                    data-w-id="787dfa4e-2d85-9dc1-04cd-2972e1b58717"
                    class="w-layout-blockcontainer imagereview w-container"
                >
                    <img
                        loading="lazy"
                        width="260"
                        height="260"
                        alt=""
                        class="image-19"
                    />
                </div>
                <div class="div-block-11">
                    <div
                        class="w-layout-blockcontainer product-image-2 w-container"
                    >
                        <img
                            width="60"
                            height="60"
                            alt=""
                            loading="lazy"
                            sizes="60px"
                            class="picture1-1"
                            onclick="document.getElementById('myFile').click(); currentImageSelected(1);"
                        />
                    </div>
                    <div
                        class="w-layout-blockcontainer product-image-3 w-container"
                    >
                        <img
                            width="60"
                            height="60"
                            alt=""
                            loading="lazy"
                            sizes="60px"
                            class="picture1-2"
                            onclick="document.getElementById('myFile').click(); currentImageSelected(2);"
                        />
                    </div>
                    <div
                        class="w-layout-blockcontainer product-image-4 w-container"
                    >
                        <img
                            width="60"
                            height="60"
                            alt=""
                            loading="lazy"
                            sizes="60px"
                            class="picture1-3"
                            onclick="document.getElementById('myFile').click(); currentImageSelected(3);"
                        />
                    </div>
                    <div
                        class="w-layout-blockcontainer product-image-5 w-container"
                    >
                        <img
                            width="60"
                            height="60"
                            alt=""
                            loading="lazy"
                            sizes="60px"
                            class="picture1-4"
                            onclick="document.getElementById('myFile').click(); currentImageSelected(4);"
                        />
                    </div>
                </div>
            </div>
            <div class="div-block-8">
                <div class="form-block-3-new-2 w-form">
                    <form
                        id="email-form-3"
                        name="email-form-3"
                        data-name="Email Form 3"
                        method="get"
                        data-wf-page-id="6640cbbbaa746925b0543431"
                        data-wf-element-id="e2de159a-f7be-5d47-cb6e-390086e9f94f"
                    >
                        <textarea
                            id="CatatamPenjual-2"
                            name="CatatamPenjual-2"
                            maxlength="5000"
                            data-name="Catatam Penjual 2"
                            placeholder="Nama Product"
                            class="textarea-new-3 w-input Title"
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
                <div data-hover="false" data-delay="0" class="w-dropdown">
                    <div class="dropdown-toggle w-dropdown-toggle">
                        <div class="tipe-terpilih">Pilih Tipe</div>
                        <img
                            src="https://cdn.prod.website-files.com/6640cbbbaa746925b0543427/6666d6163e90bd561c0d2298_arrow-down-sign-to-navigate.png"
                            loading="lazy"
                            width="14"
                            height="14"
                            alt=""
                        />
                    </div>
                    <nav class="dropdown-list-3 w-dropdown-list">
                        <a href="#" class="dropdown-link w-dropdown-link" onclick="gantiTipe('Peralatan Pengontenan')"
                            >Peralatan Pengontenan</a
                        ><a href="#" class="dropdown-link w-dropdown-link" onclick="gantiTipe('Konten dan Editing')"
                            >Konten dan Editing</a
                        ><a href="#" class="dropdown-link w-dropdown-link" onclick="gantiTipe('Branding dan Design')"
                            >Branding dan Design</a
                        ><a href="#" class="dropdown-link w-dropdown-link" onclick="gantiTipe('Produksi Merchandise')"
                            >Produksi Merchandise</a
                        ><a href="#" class="dropdown-link w-dropdown-link" onclick="gantiTipe('Promosi dan Afiliasi')"
                            >Promosi dan Afiliasi</a
                        ><a href="#" class="dropdown-link w-dropdown-link" onclick="gantiTipe('Kolaborasi Eksklusif')"
                            >Kolaborasi Eksklusif</a
                        ><a href="#" class="dropdown-link w-dropdown-link" onclick="gantiTipe('Konfigurasi Komunitas')"
                            >Konfigurasi Komunitas</a
                        ><a href="#" class="dropdown-link w-dropdown-link" onclick="gantiTipe('Channel YouTube')"
                            >Channel YouTube</a
                        >
                    </nav>
                </div>
                <div class="form-block-3-new-2-copy w-form">
                    <form
                        id="email-form-3"
                        name="email-form-3"
                        data-name="Email Form 3"
                        method="get"
                        data-wf-page-id="6640cbbbaa746925b0543431"
                        data-wf-element-id="763f39fe-6af0-b937-532b-25b439a32128"
                    >
                        <textarea
                            id="CatatamPenjual-2"
                            name="CatatamPenjual-2"
                            maxlength="5000"
                            data-name="Catatam Penjual 2"
                            placeholder="Harga (ex : 25000)"
                            class="textarea-new-4 w-input Harga"
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
                <div class="form-block-3-new w-form">
                    <form
                        id="email-form-3"
                        name="email-form-3"
                        data-name="Email Form 3"
                        method="get"
                        data-wf-page-id="6640cbbbaa746925b0543431"
                        data-wf-element-id="683076c0-ce03-e3a8-8eec-b80dc5dd7d47"
                    >
                        <textarea
                            id="CatatamPenjual-2"
                            name="CatatamPenjual-2"
                            maxlength="5000"
                            data-name="Catatam Penjual 2"
                            placeholder="Deskripsi"
                            class="textarea-new w-input deksripsi-product"
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
                <div class="div-block-10">
                    <a href="#" class="button-2-copy w-button" onclick="cancelProduct()">Cancel</a
                    ><a class="button-3a w-button" onclick="confirmProduct()">Done</a>
                </div>
            </div>
        </div>
        <script
            src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=6640cbbbaa746925b0543427"
            type="text/javascript"
            integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
            crossorigin="anonymous"
        ></script>
        <script
            src="/js/TeamViewers/Marketplace/EditProduct.js"
            type="text/javascript"
        ></script>
    </body>
</html>
<?php /**PATH C:\Users\HP\Laravel\TeamViewers\resources\views//TeamViewers/Marketplace/EditProduct.blade.php ENDPATH**/ ?>