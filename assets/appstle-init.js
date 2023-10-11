(function (window, k) {
    if (!window.AppstleIncluded && (!urlIsProductPage() || 'V1' === 'V2')) {
      window.AppstleIncluded = true;
      appstleLoadScript = function (src, callback) {
        var script = document.createElement("script");
        script.charset = "utf-8";
            script.defer = true;
        script.src = src;
        script.onload = script.onreadystatechange = function () {
          if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            script.onload = script.onreadystatechange = null;
            script = k;
            callback && callback();
          }
        };
            document.getElementsByTagName("body")[0].appendChild(script)
      };


      appstleLoadScript("https://cdn.shopify.com/s/files/1/0318/7238/5161/t/36/assets/appstle-subscription.js?v=1689684553");


      window.RS = Window.RS || {};
      RS.Config = {
        "selectors": {
            "payment_button_selectors": "form[action$='/cart/add'] .shopify-payment-button",
            "subscriptionLinkSelector": "",
            "atcButtonPlacement": "BEFORE",
            "subscriptionLinkPlacement": "BEFORE",
            "cartRowSelector": "",
            "cartLineItemSelector": "",
            "cartLineItemPerQuantityPriceSelector": "",
            "cartLineItemTotalPriceSelector": "",
            "cartLineItemSellingPlanNameSelector": "",
            "cartSubTotalSelector" : "",
            "cartLineItemPriceSelector": "",
        },
        "enableCartWidgetFeature": "false",
        "useUrlWithCustomerId": "true",
        "atcButtonSelector": ".buy-buttons.buy-buttons--has-dynamic",
        "moneyFormat": "{% raw %}${{amount}}{% endraw %}",
        "oneTimePurchaseText": "One Time",
        "shop": "sunday-ii-sunday.myshopify.com",
        "deliveryText": "delivery",
        "purchaseOptionsText": "PURCHASE OPTIONS",
        "manageSubscriptionButtonText": "Manage Subscription",
        "subscriptionOptionText": "Subscribe & Save",
        "sellingPlanSelectTitle": "DELIVERY FREQUENCY",
        "subscriptionPriceDisplayText": "",
        "tooltipTitle": "How Does This Work?",
        "showTooltipOnClick": "false",
        "tooltipDesctiption": "<strong>Have complete control of your subscriptions<\/strong><br\/><br\/>Skip, reschedule, edit, or cancel deliveries anytime, based on your needs.",
        "tooltipDescriptionOnPrepaidPlan": "<b>Prepaid Plan Details<\/b><\/br> Total price: {{totalPrice}} ( Price for every delivery: {{pricePerDelivery}})",
        "tooltipDescriptionOnMultipleDiscount": "<b>Discount Details<\/b><\/br> Initial discount is {{discountOne}} and then {{discountTwo}}",
        "tooltipDescriptionCustomization": "{{{defaultTooltipDescription}}} <\/br>  {{{prepaidDetails}}} <\/br> {{{discountDetails}}}",
        "orderStatusManageSubscriptionTitle": "Subscription",
        "orderStatusManageSubscriptionDescription": "Continue to your account to view and manage your subscriptions. Please use the same email address that you used to buy the subscription.",
        "orderStatusManageSubscriptionButtonText": "Manage your subscription",
        "subscriptionOptionSelectedByDefault" : false,
        "totalPricePerDeliveryText" : "{{prepaidPerDeliveryPrice}}\/delivery",
        "memberOnlySellingPlansJson": {},
        "nonMemberOnlySellingPlansJson": {},
        "sellingPlansJson": [{"frequencyCount":1,"frequencyInterval":"MONTH","billingFrequencyCount":1,"billingFrequencyInterval":"MONTH","frequencyName":"Every Month","discountOffer":15.0,"afterCycle1":0,"discountType":"PERCENTAGE","discountEnabled":true,"discountEnabledMasked":true,"id":"gid://shopify/SellingPlan/4732190908","frequencyType":"ON_PURCHASE_DAY","specificDayEnabled":false,"cutOff":0,"prepaidFlag":"false","idNew":"gid://shopify/SellingPlan/4732190908","planType":"PAY_AS_YOU_GO","deliveryPolicyPreAnchorBehavior":"ASAP","freeTrialEnabled":false,"memberOnly":false,"nonMemberOnly":false,"formFieldJson":"[]","frequencySequence":0,"groupName":"Subscribe \u0026 Save","appstleCycles":[]},{"frequencyCount":2,"frequencyInterval":"MONTH","billingFrequencyCount":2,"billingFrequencyInterval":"MONTH","frequencyName":"Every 2 Months","discountOffer":10.0,"afterCycle1":0,"discountType":"PERCENTAGE","discountEnabled":true,"discountEnabledMasked":true,"id":"gid://shopify/SellingPlan/4732223676","frequencyType":"ON_PURCHASE_DAY","specificDayEnabled":false,"cutOff":0,"prepaidFlag":"false","idNew":"gid://shopify/SellingPlan/4732223676","planType":"PAY_AS_YOU_GO","deliveryPolicyPreAnchorBehavior":"ASAP","freeTrialEnabled":false,"memberOnly":false,"nonMemberOnly":false,"formFieldJson":"[]","frequencySequence":1,"groupName":"Subscribe \u0026 Save","appstleCycles":[]},{"frequencyCount":3,"frequencyInterval":"MONTH","billingFrequencyCount":3,"billingFrequencyInterval":"MONTH","frequencyName":"Every 3 Months","discountOffer":5.0,"afterCycle1":0,"discountType":"PERCENTAGE","discountEnabled":true,"discountEnabledMasked":true,"id":"gid://shopify/SellingPlan/4732256444","frequencyType":"ON_PURCHASE_DAY","specificDayEnabled":false,"cutOff":0,"prepaidFlag":"false","idNew":"gid://shopify/SellingPlan/4732256444","planType":"PAY_AS_YOU_GO","deliveryPolicyPreAnchorBehavior":"ASAP","freeTrialEnabled":false,"memberOnly":false,"nonMemberOnly":false,"formFieldJson":"[]","frequencySequence":2,"groupName":"Subscribe \u0026 Save","appstleCycles":[]}],
        "widgetEnabled": true,
        "showTooltip" : true,
        "sortByDefaultSequence": false,
        "showSubOptionBeforeOneTime": false,
        "showStaticTooltip": false,
        "showAppstleLink": false,
        "sellingPlanTitleText" : "{{sellingPlanName}} ({{sellingPlanPrice}}\/delivery)",
        "oneTimePriceText" : "{{price}}",
        "selectedPayAsYouGoSellingPlanPriceText" : "{{price}}",
        "selectedPrepaidSellingPlanPriceText" : " {{totalPrice}}",
        "selectedDiscountFormat" : "SAVE {{selectedDiscountPercentage}}",
        "manageSubscriptionBtnFormat" : "<a href='apps\/subscriptions' class='appstle_manageSubBtn' ><button class='btn' style='padding: 2px 20px'>Manage Subscription<\/button><a><br><br>",
        "manageSubscriptionUrl" : "apps\/subscriptions",
        "appstlePlanId": 163,
        "showCheckoutSubscriptionBtn": true,
        "disableLoadingJquery": false,
        "widgetEnabledOnSoldVariant": "false",
        "switchRadioButtonWidget": false,
        "appstlePlanName": "BUSINESS",
        "appstlePlanFeatures": {
	"accessAdvancedCustomerPortalSettings": false,
	"accessAdvanceSubscriptionPlanOptions": true,
	"accessAppstleMenu": true,
	"accessBuildABox": true,
	"accessBundling": true,
	"accessDiscountOnCancellationAttempt": true,
	"accessKlaviyoContactSync": true,
	"accessKlaviyoEmailIntegration": true,
	"accessGorgiasIntegration": true,
	"accessMechanicsIntegration": true,
	"accessZapierIntegration": true,
	"accessShopifyFlowIntegration": true,
	"accessManualSubscriptionCreation": true,
	"accessOneTimeProductUpsells": true,
	"accessQuickCheckout": true,
	"accessResendEmail": true,
	"accessSplitContract": true,
	"accessSubscriberLoyaltyFeatures": true,
	"accessSubscriptionActivityLogs": true,
	"accessWidgetDesignOptions": true,
	"analytics": true,
	"enableAdvancedSellingPlans": true,
	"enableAutomation": true,
	"enableAutoSync": false,
	"enableBundling": true,
	"enableCancellationManagement": true,
	"enableCartWidget": true,
	"enableCustomEmailDomain": true,
	"enableCustomEmailHtml": true,
	"enableCustomerPortalSettings": true,
	"enableDunningManagement": true,
	"enableExternalApi": false,
	"enableIntegrations": true,
	"enableProductSwapAutomation": false,
	"enableQuickActions": true,
	"enableShippingProfiles": true,
	"enableSmsAlert": true,
	"enableSubscriptionManagement": true,
	"enableSummaryReports": true,
	"enableWidgetPlacement": true,
	"subscriptionOrderAmount": 100000,
	"webhookAccess": false
},
        "formMappingAttributeName": "",
        "formMappingAttributeSelector": "",
        "quickViewModalPollingSelector": "",
        "scriptLoadDelay": "0",
        "formatMoneyOverride": "false",
        "appstle_app_proxy_path_prefix": "apps\/subscriptions",
        "updatePriceOnQuantityChange": "",
        "widgetParentSelector": "",
        "quantitySelector": "",
        "enableAddJSInterceptor": "true",
        "reBuyEnabled": "false",
        "loyaltyDetailsLabelText": "",
        "loyaltyPerkDescriptionText": "",
        "widgetTemplateHtml": `{% raw %}{% endraw %}`,
        "bundle": {},
        "labels": "{\"appstle.subscription.wg.noSubscriptionLabelTextV2\":\"No Subscription\",\"appstle.subscription.wg.cancelAnytimeLabelTextV2\":\"Cancel Anytime\",\"appstle.subscription.wg.weeksFrequencyTextV2\":\"weeks\",\"appstle.subscription.wg.weeklyLabelTextV2\":\"Weekly\",\"appstle.subscription.wg.deliveryEveryFrequencyTextV2\":\"Delivery Every\",\"appstle.subscription.wg.subscribeAndSaveInitalV2\":\"Subscribe & save\",\"appstle.subscription.wg.daysFrequencyTextV2\":\"days\",\"appstle.subscription.wg.monthlyLabelTextV2\":\"Monthly\",\"appstle.subscription.wg.subscribeAndSaveSuccessV2\":\"Subscribe success\",\"appstle.subscription.wg.monthFrequencyTextV2\":\"month\",\"appstle.subscription.wg.yearsFrequencyTextV2\":\"Years\",\"appstle.subscription.wg.onetimeDescriptionTextV2\":\"\",\"appstle.subscription.wg.weekFrequencyTextV2\":\"week\",\"appstle.subscription.wg.oneTimePurchaseTextV2\":\"One Time Purchase\",\"appstle.subscription.wg.loyaltyPerkDescriptionTextV2\":\"{{#isDiscountTypeFreeProduct}}<div style='display: flex;'><div style='height: 60px; width: 60px; flex-shrink: 0; margin-right: 10px;'><img style='width: 100%' src={{{featured_image}}}><\/img><\/div><div>After {{{billingCycleBlock}}} orders,<span style='color: #ffc000;font-weight: 700;';> get a FREE {{freeProductName}} <\/span><\/div><div>{{\/isDiscountTypeFreeProduct}}{{#isDiscountTypePercentage}}After <span class='appstle-loyalty-billing-cycle'><span class='appstle-loyalty-billing-cycle-count'>{{{billingCycleBlock}}}<\/span> order<\/span>, <span class='appstle-loyalty-discount'>get <span style='color: #ffc000;font-weight: 700;';>{{{discount}}}% OFF your entire order<\/span><\/span>.{{\/isDiscountTypePercentage}}{{#isDiscountTypeShipping}}After <span class='appstle-loyalty-billing-cycle'><span class='appstle-loyalty-billing-cycle-count'>{{{billingCycleBlock}}}<\/span> order<\/span>, <span class='appstle-loyalty-discount'>get <span style='color: #ffc000;font-weight: 700;';>shipping at {{{formatDiscountedPrice}}}<\/span><\/span>.{{\/isDiscountTypeShipping}}{{#isDiscountTypeFixed}}After <span class='appstle-loyalty-billing-cycle'><span class='appstle-loyalty-billing-cycle-count'>{{{billingCycleBlock}}}<\/span> order<\/span>, <span class='appstle-loyalty-discount'>get <span style='color: #ffc000;font-weight: 700;';>{{{formatDiscountedPrice}}} OFF your entire order<\/span><\/span>.{{\/isDiscountTypeFixed}}\",\"appstle.subscription.wg.unsubscribeFrequencyTextV2\":\"unsubscribe\",\"appstle.subscription.wg.widgetVariantChangeListenerSelectorV2\":\"\",\"appstle.subscription.wg.oneTimeFrequencyTextV2\":\"\",\"appstle.subscription.wg.dayFrequencyTextV2\":\"day\",\"appstle.subscription.wg.allowFulfilmentCountViaPropertiesV2\":\"false\",\"appstle.subscription.wg.monthsFrequencyTextV2\":\"Months\",\"appstle.subscription.wg.offFrequencyTextV2\":\"Off\",\"appstle.subscription.wg.yearFrequencyTextV2\":\"Year\",\"appstle.subscription.wg.prepayLabelTextV2\":\"Prepay\",\"appstle.subscription.wg.productPageUnitPriceSelectorV2\":\"\",\"appstle.subscription.wg.widgetPriceChangeListenerSelectorV2\":\"\",\"appstle.subscription.wg.selectDeliverOptionV2\":\"select deliver option\",\"appstle.subscription.wg.yearlyLabelTextV2\":\"Yearly\"}",
        "css": {
            "appstle_subscription_widget": {
                "margin-top": "" ,
                "margin-bottom": "",
            },

            "appstle_subscription_wrapper": {
                "border-width": "",
                "border-color": "",
            },

            "appstle_circle": {
                "border-color": "",
            },

            "appstle_dot": {
                "background-color": "",
            },

            "appstle_select": {
                "padding-top": "",
                "padding-bottom": "",
                "padding-left": "",
                "padding-right": "",
                "border-width": "",
                "border-style": "",
                "border-color": "",
                "border-radius": "",
            },

            "tooltip_subscription_svg": {
                "fill": "",
            },

            "appstle_tooltip": {
                "color": "",
                "background-color": "",
            },

            "appstle_tooltip_border_top_color": {
                "border-top-color": "",
            },

            "appstle_subscription_final_price": {
                "color": "",
            },
            "appstle_widget_text_color": {
                "color": "",
            },
            "appstle_selected_background": {
                "background": "transparent",
            },
            "customCSS": ".appstle_widget_title {font-size:.6875rem; color: rgb(var(--text-color) \/ .65);}\n.appstle_subscription_wrapper {font-size:.9rem; text-transform: uppercase;}\n.appstle_subscription_wrapper {border-radius: 0 !important; margin-top: 5px !important; border-color: rgb(var(--border-color)); border-width: 0; border: 1px solid rgb(var(--border-color)) !important}\n.appstle_tooltip_title {font-size:.6875rem; color: rgb(var(--text-color) \/ .65);  text-transform: uppercase;}\n.tooltip_subscription_svg {height: 15px !important; width: 15px !important; color: rgb(var(--border-color)); }\n.appstle_subscribe_option {margin-top: 10px;}\n.appstle_select_label {color: rgb(var(--text-color) \/ .65);}\n.appstle_subscribe_option appstle_hide_subsOption  {margin-top: 0px;}\n.appstle_select {\n    background-color: black;\n    color: white;\n    border: none;\n    font-size: 1em;\n    padding: 4px;\n    border-radius: 0px;\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none;\n    width: 100%;\n    background-image: url('data:image\/svg+xml;utf8,<svg xmlns=\"http:\/\/www.w3.org\/2000\/svg\" width=\"12\" height=\"8\" fill=\"white\"><path d=\"M1 1l4 4 4-4\"\/><\/svg>');\n    background-repeat: no-repeat;\n    background-position: right 8px center;\n    padding-right: 24px; \/* Make the padding right larger to not overlap the text with the arrow *\/\n}\n\n.appstle_select:focus {\n    outline: none; \/* Removes the default browser outline *\/\n    background-color: black; \/* Keeps the background color as black *\/\n    color: white; \/* Keeps the text color as white *\/\n}",
            "elementCSS": "[\"#appstle_subscription_widget0.appstle_subscription_wrapper.appstle_select {border-radius: 0px !important;}\",\".appstle_tooltip_content {background-color: #d6d1c4 !important;} #appstle_subscription_widget0 [data-appstle-icon]:after {border-top-color: #d6d1c4 !important;}\",\"#appstle_subscription_widget0 .appstle_tooltip {color: #2d2a26 !important;}\",\"#appstle_subscription_widget0 .tooltip_subscription_svg {fill: #2d2a26 !important;}\"]",
            "customerPortalCss": "",
            "priceSelector": "",
            "landingPagePriceSelector": "",
            "quickViewClickSelector": "",
            "badgeTop": "",
            "pricePlacement": "BEFORE"
        }
      };

    }

    function urlIsProductPage() {
    // return null != decodeURIComponent(window.location.pathname).match(/\/products\/(([a-zA-Z0-9]|[\-\.\_\~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[\ud83c\ud83d\ud83e][\ud000-\udfff]){1,})\/?/)
    return decodeURIComponent(window.location.pathname).includes('/products/');
    }
  }
)(window);

