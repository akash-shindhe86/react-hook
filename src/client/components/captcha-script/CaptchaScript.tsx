'use client';

import parse from 'html-react-parser';

export default function CaptchaScript() {

    const hydrationErrorScript = `<script type='text/javascript'>
             try {
                document.__defineGetter__("referrer", function() {
                    return "";
                });
            } catch (exception) {
                try {
                    Object.defineProperties(document, {
                     referrer: {
                         get: function() {
                                return "";
                               }
                          }
                    });
                     } catch (exception) {}
            }
    </script>`

    const hydrationRefreshErrorScript = `<script type='text/javascript'>
             !function() {
                    try {
                        if ("undefined" != typeof sessionStorage) {
                            var e = sessionStorage.getItem("distil_referrer");
                            (e || e === "") && (Object.defineProperty(document, "referrer", {
                                get: function() {
                                    return e
                                }
                            }),
                            sessionStorage.removeItem("distil_referrer"))
                        }
                    } catch (e) {}
                }();
   </script>`

    return (
        <>
            {typeof window !== 'undefined' && window.location.href.includes('/shop/product-details') && document.head.innerText.indexOf('document.__defineGetter__("referrer",function()') > -1 && parse(hydrationErrorScript)}
            {typeof window !== 'undefined' && window.location.href.includes('/shop/product-details') && document.head.innerText.indexOf('sessionStorage.getItem("distil_referrer")') > -1 && parse(hydrationRefreshErrorScript)}
        </>
    )
}
