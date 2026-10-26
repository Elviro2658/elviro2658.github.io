/* سرویس‌نگار — نمایش سه‌بعدی ساده و سبک از خودرو (بدون کتابخانهٔ بیرونی) */
(function (root) {
  "use strict";
  /* ---------- فهرست خودروها: [کلید، نام فارسی، نام انگلیسی، نوع بدنه، طول، عرض، ارتفاع (متر)] ---------- */
  var CARS = [
    ["pride-111", "پراید ۱۱۱", "Saipa Pride 111", "hatch", 3.83, 1.58, 1.39],
    ["pride-131", "پراید ۱۳۱", "Saipa Pride 131", "sedan", 4.0, 1.58, 1.39],
    ["pride-141", "پراید ۱۴۱", "Saipa Pride 141", "sedan", 3.95, 1.58, 1.4],
    ["tiba", "تیبا", "Saipa Tiba", "sedan", 4.05, 1.6, 1.47],
    ["tiba2", "تیبا ۲", "Saipa Tiba 2", "hatch", 3.9, 1.6, 1.5],
    ["saina", "ساینا", "Saipa Saina", "sedan", 4.2, 1.64, 1.5],
    ["quick", "کوییک", "Saipa Quick", "hatch", 3.74, 1.65, 1.52],
    ["shahin", "شاهین", "Saipa Shahin", "sedan", 4.5, 1.77, 1.47],
    ["atlas", "اطلس", "Saipa Atlas", "hatch", 4.0, 1.7, 1.52],
    ["saipa-151", "سایپا ۱۵۱", "Saipa 151", "pickup", 4.3, 1.6, 1.5],
    ["paykan", "پیکان", "Iran Khodro Paykan", "sedan", 4.4, 1.64, 1.42],
    ["paykan-pickup", "پیکان وانت", "Paykan Pickup", "pickup", 4.4, 1.64, 1.45],
    ["peugeot-405", "پژو ۴۰۵", "Peugeot 405", "sedan", 4.43, 1.71, 1.42],
    ["peugeot-pars", "پژو پارس", "Peugeot Pars", "sedan", 4.5, 1.77, 1.47],
    ["peugeot-206", "پژو ۲۰۶", "Peugeot 206", "hatch", 3.95, 1.65, 1.43],
    ["peugeot-206sd", "پژو ۲۰۶ صندوقدار", "Peugeot 206 SD", "sedan", 4.28, 1.65, 1.43],
    ["peugeot-207", "پژو ۲۰۷", "Peugeot 207", "hatch", 4.15, 1.72, 1.52],
    ["peugeot-207sd", "پژو ۲۰۷ صندوقدار", "Peugeot 207 SD", "sedan", 4.45, 1.72, 1.5],
    ["peugeot-301", "پژو ۳۰۱", "Peugeot 301", "sedan", 4.44, 1.75, 1.47],
    ["peugeot-508", "پژو ۵۰۸", "Peugeot 508", "sedan", 4.79, 1.83, 1.4],
    ["peugeot-2008", "پژو ۲۰۰۸", "Peugeot 2008", "cross", 4.16, 1.74, 1.56],
    ["peugeot-3008", "پژو ۳۰۰۸", "Peugeot 3008", "cross", 4.45, 1.84, 1.62],
    ["samand", "سمند", "Iran Khodro Samand", "sedan", 4.5, 1.73, 1.47],
    ["soren", "سمند سورن", "Samand Soren", "sedan", 4.51, 1.73, 1.47],
    ["runna", "رانا", "Iran Khodro Runna", "sedan", 4.42, 1.71, 1.47],
    ["dena", "دنا", "Iran Khodro Dena", "sedan", 4.55, 1.76, 1.5],
    ["tara", "تارا", "Iran Khodro Tara", "sedan", 4.5, 1.78, 1.5],
    ["arisun", "آریسان", "Iran Khodro Arisun", "pickup", 4.6, 1.7, 1.7],
    ["haima-s7", "هایما S7", "Haima S7", "cross", 4.6, 1.85, 1.7],
    ["mvm-315", "ام‌وی‌ام ۳۱۵", "MVM 315", "hatch", 4.0, 1.7, 1.5],
    ["mvm-110", "ام‌وی‌ام ۱۱۰", "MVM 110", "sedan", 4.3, 1.7, 1.45],
    ["mvm-x22", "ام‌وی‌ام X22", "MVM X22", "cross", 4.1, 1.7, 1.57],
    ["mvm-x33", "ام‌وی‌ام X33", "MVM X33", "cross", 4.25, 1.77, 1.6],
    ["mvm-x55", "ام‌وی‌ام X55", "MVM X55", "cross", 4.4, 1.8, 1.62],
    ["mvm-550", "ام‌وی‌ام ۵۵۰", "MVM 550", "sedan", 4.65, 1.81, 1.46],
    ["arrizo-5", "ام‌وی‌ام آریزو ۵", "Chery Arrizo 5", "sedan", 4.57, 1.8, 1.48],
    ["tiggo-5", "چری تیگو ۵", "Chery Tiggo 5", "cross", 4.46, 1.84, 1.7],
    ["tiggo-7", "چری تیگو ۷", "Chery Tiggo 7", "cross", 4.5, 1.84, 1.7],
    ["tiggo-8", "چری تیگو ۸", "Chery Tiggo 8", "suv", 4.7, 1.86, 1.7],
    ["fownix-fx", "فونیکس FX", "Fownix FX", "cross", 4.3, 1.82, 1.65],
    ["jac-j4", "جک J4", "JAC J4", "sedan", 4.45, 1.7, 1.5],
    ["jac-j5", "جک J5", "JAC J5", "sedan", 4.6, 1.8, 1.5],
    ["jac-s3", "جک S3", "JAC S3", "cross", 4.2, 1.76, 1.62],
    ["jac-s5", "جک S5", "JAC S5", "cross", 4.5, 1.84, 1.68],
    ["lifan-820", "لیفان ۸۲۰", "Lifan 820", "sedan", 4.76, 1.79, 1.5],
    ["lifan-620", "لیفان ۶۲۰ (سولانو)", "Lifan 620", "sedan", 4.47, 1.7, 1.48],
    ["lifan-x60", "لیفان X60", "Lifan X60", "cross", 4.4, 1.79, 1.69],
    ["lifan-x50", "لیفان X50", "Lifan X50", "cross", 4.1, 1.72, 1.59],
    ["brilliance-h320", "برلیانس H320", "Brilliance H320", "sedan", 4.65, 1.8, 1.5],
    ["brilliance-h330", "برلیانس H330", "Brilliance H330", "sedan", 4.65, 1.8, 1.5],
    ["brilliance-h220", "برلیانس H220", "Brilliance H220", "sedan", 4.45, 1.7, 1.5],
    ["dongfeng-h30", "دانگ‌فنگ H30 کراس", "Dongfeng H30 Cross", "cross", 4.2, 1.75, 1.6],
    ["dongfeng-ax7", "دانگ‌فنگ AX7", "Dongfeng AX7", "cross", 4.6, 1.85, 1.7],
    ["geely-emgrand", "جیلی امگرند", "Geely Emgrand", "sedan", 4.63, 1.79, 1.5],
    ["geely-gc6", "جیلی GC6", "Geely GC6", "sedan", 4.6, 1.78, 1.5],
    ["byd-f3", "بی‌وای‌دی F3", "BYD F3", "sedan", 4.53, 1.7, 1.49],
    ["byd-s6", "بی‌وای‌دی S6", "BYD S6", "cross", 4.8, 1.86, 1.72],
    ["byd-atto3", "بی‌وای‌دی Atto 3", "BYD Atto 3", "cross", 4.46, 1.88, 1.62],
    ["mg-zs", "ام‌جی ZS", "MG ZS", "cross", 4.31, 1.81, 1.64],
    ["mg-5", "ام‌جی ۵", "MG 5", "sedan", 4.54, 1.81, 1.5],
    ["mg-6", "ام‌جی ۶", "MG 6", "hatch", 4.68, 1.85, 1.47],
    ["mg-hs", "ام‌جی HS", "MG HS", "cross", 4.57, 1.87, 1.67],
    ["haval-h2", "هاوال H2", "Haval H2", "cross", 4.34, 1.81, 1.69],
    ["haval-h6", "هاوال H6", "Haval H6", "suv", 4.65, 1.86, 1.69],
    ["haval-jolion", "هاوال جولیون", "Haval Jolion", "cross", 4.47, 1.84, 1.69],
    ["changan-cs35", "چانگان CS35", "Changan CS35", "cross", 4.2, 1.8, 1.65],
    ["changan-cs55", "چانگان CS55", "Changan CS55", "cross", 4.5, 1.85, 1.69],
    ["changan-hunter", "چانگان هانتر", "Changan Hunter", "pickup", 5.33, 1.92, 1.8],
    ["swm-g01", "اس‌دبلیو‌ام G01", "SWM G01", "suv", 4.65, 1.9, 1.74],
    ["hyundai-accent", "هیوندای اکسنت", "Hyundai Accent", "sedan", 4.37, 1.7, 1.47],
    ["hyundai-elantra", "هیوندای النترا", "Hyundai Elantra", "sedan", 4.62, 1.8, 1.45],
    ["hyundai-sonata", "هیوندای سوناتا", "Hyundai Sonata", "sedan", 4.9, 1.86, 1.45],
    ["hyundai-i20", "هیوندای i20", "Hyundai i20", "hatch", 3.98, 1.73, 1.49],
    ["hyundai-i30", "هیوندای i30", "Hyundai i30", "hatch", 4.34, 1.78, 1.47],
    ["hyundai-tucson", "هیوندای توسان", "Hyundai Tucson", "cross", 4.5, 1.86, 1.65],
    ["hyundai-santafe", "هیوندای سانتافه", "Hyundai Santa Fe", "suv", 4.78, 1.89, 1.68],
    ["hyundai-creta", "هیوندای کرتا", "Hyundai Creta", "cross", 4.3, 1.79, 1.63],
    ["kia-rio", "کیا ریو", "Kia Rio", "sedan", 4.37, 1.7, 1.47],
    ["kia-pegas", "کیا پگاس", "Kia Pegas", "sedan", 4.4, 1.7, 1.46],
    ["kia-cerato", "کیا سراتو", "Kia Cerato", "sedan", 4.6, 1.8, 1.44],
    ["kia-optima", "کیا اپتیما / K5", "Kia Optima", "sedan", 4.85, 1.86, 1.47],
    ["kia-picanto", "کیا پیکانتو", "Kia Picanto", "hatch", 3.6, 1.6, 1.49],
    ["kia-sportage", "کیا اسپورتیج", "Kia Sportage", "cross", 4.48, 1.85, 1.65],
    ["kia-sorento", "کیا سورنتو", "Kia Sorento", "suv", 4.8, 1.89, 1.69],
    ["kia-sonet", "کیا سونت", "Kia Sonet", "cross", 4.1, 1.79, 1.64],
    ["toyota-corolla", "تویوتا کرولا", "Toyota Corolla", "sedan", 4.63, 1.78, 1.45],
    ["toyota-camry", "تویوتا کمری", "Toyota Camry", "sedan", 4.88, 1.84, 1.44],
    ["toyota-yaris", "تویوتا یاریس", "Toyota Yaris", "hatch", 4.1, 1.7, 1.5],
    ["toyota-rav4", "تویوتا راو۴", "Toyota RAV4", "cross", 4.6, 1.85, 1.69],
    ["toyota-prado", "تویوتا پرادو", "Toyota Prado", "suv", 4.78, 1.89, 1.85],
    ["toyota-landcruiser", "تویوتا لندکروزر", "Toyota Land Cruiser", "suv", 4.95, 1.98, 1.89],
    ["toyota-hilux", "تویوتا هایلوکس", "Toyota Hilux", "pickup", 5.3, 1.86, 1.81],
    ["mazda-3", "مزدا ۳", "Mazda 3", "sedan", 4.6, 1.8, 1.45],
    ["mazda-6", "مزدا ۶", "Mazda 6", "sedan", 4.87, 1.84, 1.45],
    ["mazda-cx5", "مزدا CX-5", "Mazda CX-5", "cross", 4.55, 1.84, 1.68],
    ["mazda-cx9", "مزدا CX-9", "Mazda CX-9", "suv", 5.07, 1.97, 1.73],
    ["nissan-sunny", "نیسان صنی", "Nissan Sunny", "sedan", 4.5, 1.7, 1.5],
    ["nissan-tiida", "نیسان تیدا", "Nissan Tiida", "hatch", 4.2, 1.7, 1.54],
    ["nissan-juke", "نیسان جوک", "Nissan Juke", "cross", 4.14, 1.77, 1.57],
    ["nissan-qashqai", "نیسان قشقایی", "Nissan Qashqai", "cross", 4.4, 1.81, 1.6],
    ["nissan-xtrail", "نیسان ایکس‌تریل", "Nissan X-Trail", "suv", 4.65, 1.82, 1.7],
    ["nissan-patrol", "نیسان پاترول", "Nissan Patrol", "suv", 5.1, 1.98, 1.94],
    ["nissan-navara", "نیسان ناوارا", "Nissan Navara", "pickup", 5.3, 1.85, 1.78],
    ["honda-civic", "هوندا سیویک", "Honda Civic", "sedan", 4.65, 1.8, 1.42],
    ["honda-accord", "هوندا آکورد", "Honda Accord", "sedan", 4.9, 1.86, 1.45],
    ["honda-crv", "هوندا CR-V", "Honda CR-V", "cross", 4.6, 1.85, 1.68],
    ["mitsubishi-lancer", "میتسوبیشی لنسر", "Mitsubishi Lancer", "sedan", 4.57, 1.76, 1.49],
    ["mitsubishi-asx", "میتسوبیشی ASX", "Mitsubishi ASX", "cross", 4.3, 1.77, 1.63],
    ["mitsubishi-outlander", "میتسوبیشی اوتلندر", "Mitsubishi Outlander", "suv", 4.7, 1.8, 1.68],
    ["mitsubishi-pajero", "میتسوبیشی پاجرو", "Mitsubishi Pajero", "suv", 4.9, 1.87, 1.88],
    ["suzuki-vitara", "سوزوکی ویتارا", "Suzuki Vitara", "cross", 4.18, 1.78, 1.61],
    ["suzuki-swift", "سوزوکی سویفت", "Suzuki Swift", "hatch", 3.85, 1.73, 1.5],
    ["suzuki-jimny", "سوزوکی جیمنی", "Suzuki Jimny", "suv", 3.65, 1.65, 1.7],
    ["renault-logan", "رنو لوگان / تندر ۹۰", "Renault Logan", "sedan", 4.25, 1.74, 1.52],
    ["renault-sandero", "رنو ساندرو", "Renault Sandero", "hatch", 4.06, 1.74, 1.53],
    ["renault-duster", "رنو داستر", "Renault Duster", "cross", 4.31, 1.82, 1.69],
    ["renault-megane", "رنو مگان", "Renault Megane", "sedan", 4.5, 1.8, 1.47],
    ["renault-clio", "رنو کلیو", "Renault Clio", "hatch", 4.06, 1.73, 1.45],
    ["chevrolet-cruze", "شورولت کروز", "Chevrolet Cruze", "sedan", 4.6, 1.79, 1.48],
    ["chevrolet-optra", "شورولت اپترا", "Chevrolet Optra", "sedan", 4.5, 1.72, 1.45],
    ["chevrolet-captiva", "شورولت کپتیوا", "Chevrolet Captiva", "cross", 4.67, 1.85, 1.75],
    ["vw-golf", "فولکس گلف", "Volkswagen Golf", "hatch", 4.26, 1.8, 1.45],
    ["vw-passat", "فولکس پاسات", "Volkswagen Passat", "sedan", 4.77, 1.83, 1.46],
    ["vw-tiguan", "فولکس تیگوان", "Volkswagen Tiguan", "cross", 4.43, 1.84, 1.68],
    ["skoda-octavia", "اشکودا اکتاویا", "Skoda Octavia", "hatch", 4.69, 1.83, 1.47],
    ["citroen-c3", "سیتروئن C3", "Citroen C3", "hatch", 3.99, 1.75, 1.52],
    ["citroen-c4", "سیتروئن C4", "Citroen C4", "hatch", 4.33, 1.79, 1.49],
    ["ford-focus", "فورد فوکوس", "Ford Focus", "hatch", 4.36, 1.82, 1.48],
    ["ford-fusion", "فورد فیوژن", "Ford Fusion", "sedan", 4.87, 1.85, 1.48],
    ["ford-explorer", "فورد اکسپلورر", "Ford Explorer", "suv", 5.04, 2.0, 1.78],
    ["bmw-3", "بی‌ام‌و سری ۳", "BMW 3 Series", "sedan", 4.71, 1.83, 1.44],
    ["bmw-5", "بی‌ام‌و سری ۵", "BMW 5 Series", "sedan", 4.96, 1.87, 1.47],
    ["bmw-x3", "بی‌ام‌و X3", "BMW X3", "cross", 4.71, 1.89, 1.68],
    ["bmw-x5", "بی‌ام‌و X5", "BMW X5", "suv", 4.92, 2.0, 1.76],
    ["benz-c", "بنز کلاس C", "Mercedes-Benz C-Class", "sedan", 4.69, 1.81, 1.44],
    ["benz-e", "بنز کلاس E", "Mercedes-Benz E-Class", "sedan", 4.95, 1.85, 1.46],
    ["benz-glc", "بنز GLC", "Mercedes-Benz GLC", "cross", 4.66, 1.89, 1.64],
    ["audi-a4", "آئودی A4", "Audi A4", "sedan", 4.76, 1.84, 1.43],
    ["audi-a6", "آئودی A6", "Audi A6", "sedan", 4.94, 1.89, 1.46],
    ["audi-q5", "آئودی Q5", "Audi Q5", "cross", 4.68, 1.89, 1.66],
    ["lexus-rx", "لکسوس RX", "Lexus RX", "cross", 4.89, 1.92, 1.69],
    ["jeep-cherokee", "جیپ چروکی", "Jeep Cherokee", "suv", 4.62, 1.86, 1.69],
    ["tesla-3", "تسلا مدل ۳", "Tesla Model 3", "sedan", 4.69, 1.85, 1.44],
    ["volvo-xc60", "ولوو XC60", "Volvo XC60", "cross", 4.69, 1.9, 1.66]
  ];
  var DEFAULT_COLORS = ["#f2f2f2", "#c9ced4", "#2b2f36", "#c4262e", "#1f5fbf", "#6d7886", "#f0b323", "#2f8f5b", "#7a4a28", "#7c3aed"];

  function normalize(text) {
    return String(text == null ? "" : text).toLowerCase()
      .replace(/[يى]/g, "ی").replace(/[كک]/g, "ک").replace(/[ۀة]/g, "ه")
      .replace(/[۰-۹]/g, function (d) { return String(d.charCodeAt(0) - 1776); })
      .replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); })
      .replace(/[\u200c\u200f\u200e\s\-_./()ٔ‌]+/g, "");
  }
  var INDEX = CARS.map(function (c) {
    var brandFa = c[1].split(" ")[0], brandEn = c[2].split(" ")[0];
    return { key: c[0], fa: c[1], en: c[2], type: c[3], L: c[4], W: c[5], H: c[6],
      tokens: [normalize(c[1]), normalize(c[2]), normalize(c[1].split(" ").slice(1).join(" ")), normalize(c[2].split(" ").slice(1).join(" "))].filter(function (t) { return t.length >= 2; }),
      brand: normalize(brandFa), brandEn: normalize(brandEn) };
  });
  function byKey(key) { for (var i = 0; i < INDEX.length; i++) if (INDEX[i].key === key) return INDEX[i]; return null; }
  function find(text) {
    var q = normalize(text);
    if (q.length < 2) return null;
    var best = null, bestScore = 0;
    INDEX.forEach(function (c) {
      var score = 0;
      c.tokens.forEach(function (t) {
        var s = 0;
        if (t === q) s = 100 + t.length;
        else if (q.length >= 3 && t.indexOf(q) >= 0) s = 60 + q.length;
        else if (t.length >= 3 && q.indexOf(t) >= 0) s = 40 + t.length;
        if (s > score) score = s;
      });
      if (score > bestScore) { bestScore = score; best = c; }
    });
    if (best) return best;
    for (var i = 0; i < INDEX.length; i++) if (q === INDEX[i].brand || q === INDEX[i].brandEn) return INDEX[i];
    return null;
  }
  function generic(text) {
    var q = normalize(text);
    var type = /وانت|pickup/.test(q) ? "pickup" : /suv|شاسی|جیپ/.test(q) ? "suv" : /هاچ|hatch/.test(q) ? "hatch" : "sedan";
    return { key: "generic-" + type, fa: "خودرو", en: "Car", type: type, L: type === "pickup" ? 5.0 : type === "suv" ? 4.7 : type === "hatch" ? 4.0 : 4.5, W: 1.8, H: type === "suv" ? 1.75 : type === "pickup" ? 1.75 : 1.47 };
  }

  /* ---------- شکل کناری بدنه برای هر نوع ---------- */
  var T = {
    //   belt: ارتفاع کمربندی/ارتفاع کل، nose: ارتفاع دماغه، tail: ارتفاع عقب، house: [عقب‌پایه، عقب‌سقف، جلوسقف، جلوپایه]
    sedan: { belt: 0.585, nose: 0.5, hood: 0.555, tail: 0.58, house: [0.24, 0.355, 0.585, 0.71], gc: 0.17 },
    hatch: { belt: 0.58, nose: 0.5, hood: 0.545, tail: 0.6, house: [0.04, 0.2, 0.6, 0.72], gc: 0.17 },
    cross: { belt: 0.6, nose: 0.55, hood: 0.59, tail: 0.62, house: [0.05, 0.14, 0.6, 0.72], gc: 0.2 },
    suv: { belt: 0.62, nose: 0.57, hood: 0.61, tail: 0.64, house: [0.03, 0.06, 0.64, 0.74], gc: 0.22 },
    pickup: { belt: 0.58, nose: 0.52, hood: 0.57, tail: 0.5, house: [0.4, 0.43, 0.62, 0.74], gc: 0.22, bed: 0.38 },
    van: { belt: 0.55, nose: 0.5, hood: 0.52, tail: 0.6, house: [0.02, 0.03, 0.8, 0.9], gc: 0.2 }
  };
  function buildProfile(spec) {
    var t = T[spec.type] || T.sedan, L = spec.L, H = spec.H, belt = t.belt * H, gc = t.gc;
    var r = Math.min(0.42, Math.max(0.29, H * (spec.type === "suv" || spec.type === "pickup" ? 0.22 : 0.215)));
    var wb = spec.wb || L * 0.6;
    var xf = L - (L - wb) * 0.46, xr = xf - wb;
    var arch = r + 0.045;
    var top = [], bottom = [];
    var hx = t.house.map(function (f) { return f * L; });
    if (spec.type === "pickup") {
      bottom.push([0.02 * L, gc]);
    } else bottom.push([0.03 * L, gc]);
    var wheels = [xr, xf];
    var bx = [];
    wheels.forEach(function (wx) {
      var dy = r - gc, beta = Math.asin(Math.min(0.98, dy / arch)), hw = arch * Math.cos(beta);
      bottom.push([wx - hw, gc]);
      for (var i = 0; i <= 10; i++) {
        var a = Math.PI + beta - (Math.PI + 2 * beta) * (i / 10);
        bottom.push([wx + arch * Math.cos(a), r + arch * Math.sin(a)]);
      }
      bottom.push([wx + hw, gc]);
    });
    bottom.push([0.97 * L, gc]);
    var noseY = t.nose * H, hoodY = t.hood * H, tailY = t.tail * H;
    var front = [[L, gc + 0.16], [L, noseY - 0.05], [L - 0.06, noseY], [L - 0.28, hoodY - 0.01], [hx[3], belt]];
    var rear;
    if (spec.type === "pickup") {
      var bedTop = t.bed * H + 0.28;
      rear = [[hx[0], belt], [hx[0] - 0.02, bedTop], [0.04, bedTop], [0, bedTop - 0.05], [0, gc + 0.2]];
    } else if (spec.type === "sedan") {
      rear = [[hx[0], belt * 1.0], [0.1 * L, tailY], [0.02 * L, tailY - 0.03], [0, tailY - 0.1], [0, gc + 0.2]];
    } else {
      rear = [[hx[0], belt], [0.02 * L, tailY], [0, tailY - 0.08], [0, gc + 0.2]];
    }
    var poly = bottom.concat(front, rear);
    var house = [[hx[0], belt], [hx[1], H], [hx[2], H], [hx[3], belt]];
    return { tub: poly, house: house, wheels: wheels, r: r, belt: belt, noseY: noseY, tailY: tailY, gc: gc, hx: hx, bedTop: spec.type === "pickup" ? t.bed * H + 0.28 : 0 };
  }

  /* ---------- هندسهٔ ساده ---------- */
  function polyArea(p) { var s = 0; for (var i = 0; i < p.length; i++) { var a = p[i], b = p[(i + 1) % p.length]; s += a[0] * b[1] - b[0] * a[1]; } return s / 2; }
  function extrude(poly, z0, z1, color, opts) {
    if (polyArea(poly) < 0) poly = poly.slice().reverse();
    var faces = [], n = poly.length, i;
    for (i = 0; i < n; i++) {
      var p = poly[i], q = poly[(i + 1) % n], dx = q[0] - p[0], dy = q[1] - p[1], len = Math.hypot(dx, dy) || 1;
      var f = { v: [[p[0], p[1], z0], [q[0], q[1], z0], [q[0], q[1], z1], [p[0], p[1], z1]], n: [dy / len, -dx / len, 0] };
      if (opts && opts.dark) {
        var mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
        opts.dark.forEach(function (d) { if (Math.hypot(mx - d[0], my - d[1]) < d[2]) f.dark = true; });
      }
      faces.push(f);
    }
    faces.push({ v: poly.map(function (p) { return [p[0], p[1], z1]; }), n: [0, 0, 1] });
    faces.push({ v: poly.map(function (p) { return [p[0], p[1], z0]; }).reverse(), n: [0, 0, -1] });
    return solid(faces, color, opts);
  }
  function box(cx, cy, cz, sx, sy, sz, color, opts) {
    var x0 = cx - sx / 2, x1 = cx + sx / 2, y0 = cy - sy / 2, y1 = cy + sy / 2, z0 = cz - sz / 2, z1 = cz + sz / 2;
    return solid([
      { v: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]], n: [1, 0, 0] },
      { v: [[x0, y0, z1], [x0, y1, z1], [x0, y1, z0], [x0, y0, z0]], n: [-1, 0, 0] },
      { v: [[x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]], n: [0, 1, 0] },
      { v: [[x0, y0, z1], [x0, y0, z0], [x1, y0, z0], [x1, y0, z1]], n: [0, -1, 0] },
      { v: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], n: [0, 0, 1] },
      { v: [[x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]], n: [0, 0, -1] }
    ], color, opts);
  }
  function wheel(cx, cy, cz, r, w, rim) {
    var faces = [], seg = 14, i;
    var ring = [];
    for (i = 0; i < seg; i++) { var a = 2 * Math.PI * i / seg; ring.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    for (i = 0; i < seg; i++) {
      var p = ring[i], q = ring[(i + 1) % seg], am = 2 * Math.PI * (i + 0.5) / seg;
      faces.push({ v: [[p[0], p[1], cz - w / 2], [q[0], q[1], cz - w / 2], [q[0], q[1], cz + w / 2], [p[0], p[1], cz + w / 2]], n: [Math.cos(am), Math.sin(am), 0], tire: true });
    }
    var cap = function (z, nz) { return { v: ring.map(function (p) { return [p[0], p[1], z]; }), n: [0, 0, nz], rim: true }; };
    faces.push(cap(cz + w / 2 + 0.002, 1), cap(cz - w / 2 - 0.002, -1));
    var hubR = r * 0.58, hub = [];
    for (i = 0; i < seg; i++) { var b = 2 * Math.PI * i / seg; hub.push([cx + hubR * Math.cos(b), cy + hubR * Math.sin(b)]); }
    faces.push({ v: hub.map(function (p) { return [p[0], p[1], cz + w / 2 + 0.006]; }), n: [0, 0, 1], hub: true });
    faces.push({ v: hub.map(function (p) { return [p[0], p[1], cz - w / 2 - 0.006]; }).reverse(), n: [0, 0, -1], hub: true });
    var s = solid(faces, "#17191c", { tire: true, rim: rim });
    return s;
  }
  function solid(faces, color, opts) {
    var sx = 0, sy = 0, sz = 0, c = 0;
    faces.forEach(function (f) { f.v.forEach(function (p) { sx += p[0]; sy += p[1]; sz += p[2]; c++; }); });
    return { faces: faces, color: color, opts: opts || {}, c: [sx / c, sy / c, sz / c] };
  }
  function hexToRgb(h) { h = String(h || "#888888").replace("#", ""); if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]; var n = parseInt(h, 16) || 0x888888; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }

  /* ---------- ساخت مدل ---------- */
  function build(spec, color) {
    var L = spec.L, W = spec.W, H = spec.H, p = buildProfile(spec), cx = L / 2;
    var shift = function (poly) { return poly.map(function (q) { return [q[0] - cx, q[1]]; }); };
    var out = { solids: [], pre: [], post: [], L: L, W: W, H: H };
    var dark = p.wheels.map(function (wx) { return [wx - cx, p.r, p.r + 0.1]; });
    var tub = extrude(shift(p.tub), -W / 2, W / 2, color, { paint: true, dark: dark });
    var houseOuter = shift(p.house);
    var hc = [0, 0]; houseOuter.forEach(function (q) { hc[0] += q[0] / 4; hc[1] += q[1] / 4; });
    var inner = houseOuter.map(function (q) { return [hc[0] + (q[0] - hc[0]) * 0.86, hc[1] + (q[1] - hc[1]) * 0.8 - 0.01]; });
    if (spec.type === "pickup") {
      // اتاق جلو: شیشه‌ها کمی کوچک‌تر
      inner = houseOuter.map(function (q) { return [hc[0] + (q[0] - hc[0]) * 0.8, hc[1] + (q[1] - hc[1]) * 0.76 - 0.01]; });
    }
    var house = extrude(houseOuter, -W * 0.43, W * 0.43, color, { paint: true });
    var glass = extrude(inner, -W * 0.436, W * 0.436, "#16222d", { glass: true });
    out.tub = tub; out.house = house; out.glass = glass;
    // چرخ‌ها (پیش از بدنه کشیده می‌شوند و از قوس چرخ دیده می‌شوند)
    var ww = Math.min(0.26, W * 0.15);
    p.wheels.forEach(function (wx) {
      [-1, 1].forEach(function (s) { out.pre.push(wheel(wx - cx, p.r, s * (W / 2 - ww / 2 - 0.1), p.r, ww, "#c4ccd3")); });
    });
    // چراغ‌ها و جلوپنجره
    var noseY = p.noseY, hl = Math.max(0.1, W * 0.07);
    out.post.push(box(L / 2 - 0.01, noseY - 0.1, W * 0.31, 0.06, hl, W * 0.2, "#fff4c8", { emit: true, front: true }));
    out.post.push(box(L / 2 - 0.01, noseY - 0.1, -W * 0.31, 0.06, hl, W * 0.2, "#fff4c8", { emit: true, front: true }));
    out.post.push(box(L / 2 - 0.01, noseY - 0.17, 0, 0.05, 0.1, W * 0.22, "#0f1113", { front: true }));
    var tailY = spec.type === "pickup" ? p.bedTop - 0.12 : p.tailY - 0.12;
    out.post.push(box(-L / 2 + 0.01, tailY, W * 0.33, 0.05, 0.1, W * 0.2, "#d92b31", { emit: true }));
    out.post.push(box(-L / 2 + 0.01, tailY, -W * 0.33, 0.05, 0.1, W * 0.2, "#d92b31", { emit: true }));
    // آینه‌ها
    var mx = p.hx[3] - cx - 0.12;
    out.post.push(box(mx, p.belt + 0.1, W / 2 + 0.05, 0.14, 0.09, 0.12, color, { paint: true }));
    out.post.push(box(mx, p.belt + 0.1, -W / 2 - 0.05, 0.14, 0.09, 0.12, color, { paint: true }));
    if (spec.type === "pickup") {
      // کف و دیوارهٔ کابین بار
      var bx0 = -L / 2 + 0.04, bx1 = p.hx[0] - cx - 0.04, by = p.bedTop;
      out.post.push(box((bx0 + bx1) / 2, by + 0.01, 0, bx1 - bx0, 0.03, W * 0.84, "#1c1e21", {}));
    }
    return out;
  }

  /* ---------- رندر ---------- */
  function shade(rgb, k) { return "rgb(" + Math.max(0, Math.min(255, Math.round(rgb[0] * k))) + "," + Math.max(0, Math.min(255, Math.round(rgb[1] * k))) + "," + Math.max(0, Math.min(255, Math.round(rgb[2] * k))) + ")"; }
  var LIGHT = (function () { var v = [-0.42, 0.78, 0.46], l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; })();

  function project(model, W, H, yaw, pitch) {
    var cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    var D = Math.max(model.L, model.W * 1.8) * 2.3 + 2;
    var f = 0.8 * W * D / model.L;
    function tp(pt) {
      var x = pt[0] * cy + pt[2] * sy, z = -pt[0] * sy + pt[2] * cy, y = pt[1] - model.H * 0.5;
      var y2 = y * cp - z * sp, z2 = y * sp + z * cp, k = f / (D - z2);
      return { sx: W / 2 + x * k, sy: H * 0.56 - y2 * k, d: D - z2, x: x, y: y2, z: z2 };
    }
    function rn(n) { var x = n[0] * cy + n[2] * sy, z = -n[0] * sy + n[2] * cy, y2 = n[1] * cp - z * sp, z2 = n[1] * sp + z * cp; return [x, y2, z2]; }
    return { tp: tp, rn: rn, D: D, f: f };
  }
  function drawSolid(ctx, s, cam, rgb) {
    var list = [];
    s.faces.forEach(function (face) {
      var n = cam.rn(face.n), pts = face.v.map(cam.tp);
      var c = [0, 0, 0]; pts.forEach(function (p) { c[0] += p.x; c[1] += p.y; c[2] += p.z; });
      c = [c[0] / pts.length, c[1] / pts.length, c[2] / pts.length];
      var toCam = [-c[0], -c[1], cam.D - c[2]];
      if (n[0] * toCam[0] + n[1] * toCam[1] + n[2] * toCam[2] <= 0) return;
      var lit = Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
      list.push({ pts: pts, depth: Math.hypot(toCam[0], toCam[1], toCam[2]), lit: lit, face: face });
    });
    list.sort(function (a, b) { return b.depth - a.depth; });
    list.forEach(function (it) {
      var color, o = s.opts;
      if (o.emit) color = shade(rgb, 1);
      else if (o.glass) color = shade([40, 62, 82], 0.5 + 0.9 * it.lit);
      else if (it.face.dark) color = shade([26, 28, 33], 0.7 + 0.6 * it.lit);
      else if (it.face.hub) color = shade([70, 76, 84], 0.7 + 0.5 * it.lit);
      else if (it.face.rim) color = shade(hexToRgb(o.rim), 0.5 + 0.55 * it.lit);
      else color = shade(rgb, 0.5 + 0.62 * it.lit);
      ctx.beginPath();
      ctx.moveTo(it.pts[0].sx, it.pts[0].sy);
      for (var i = 1; i < it.pts.length; i++) ctx.lineTo(it.pts[i].sx, it.pts[i].sy);
      ctx.closePath();
      ctx.fillStyle = color; ctx.strokeStyle = color; ctx.lineWidth = 0.7;
      ctx.fill(); ctx.stroke();
    });
  }
  function depthOf(s, cam) { var p = cam.tp(s.c); return p.d; }
  function draw(ctx, model, W, H, yaw, pitch, opts) {
    opts = opts || {};
    var cam = project(model, W, H, yaw, pitch === undefined ? 0.26 : pitch);
    ctx.clearRect(0, 0, W, H);
    // کف نئونی و سایه
    var ground = cam.tp([0, 0, 0]);
    var rx = Math.max(model.L, model.W) * 0.62 * cam.f / ground.d, ry = rx * Math.sin(pitch === undefined ? 0.26 : pitch) * 1.15;
    var cxg = ground.sx, cyg = H * 0.56 + (model.H * 0.5) * cam.f / ground.d * Math.cos(pitch === undefined ? 0.26 : pitch);
    var neon = opts.neon || "#35e0ff";
    var grd = ctx.createRadialGradient(cxg, cyg, rx * 0.1, cxg, cyg, rx * 1.15);
    grd.addColorStop(0, "rgba(53,224,255,0.26)"); grd.addColorStop(0.55, "rgba(124,58,237,0.16)"); grd.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grd; ctx.beginPath(); ctx.ellipse(cxg, cyg, rx * 1.15, ry * 1.15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.strokeStyle = neon; ctx.lineWidth = 2; ctx.shadowColor = neon; ctx.shadowBlur = 14; ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.ellipse(cxg, cyg, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.ellipse(cxg, cyg, rx * 0.8, ry * 0.8, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    ctx.fillStyle = "rgba(0,0,0,0.38)"; ctx.beginPath(); ctx.ellipse(cxg, cyg, model.L * 0.4 * cam.f / ground.d, ry * 0.5, 0, 0, Math.PI * 2); ctx.fill();
    var rgb = hexToRgb(model.color);
    // پیش از بدنه: چرخ‌ها و چراغ‌های دور
    var tubD = depthOf(model.tub, cam);
    var pre = model.pre.slice(), farPost = [], nearPost = [];
    model.post.forEach(function (s) { (depthOf(s, cam) > tubD + 0.05 ? farPost : nearPost).push(s); });
    var byFar = function (a, b) { return depthOf(b, cam) - depthOf(a, cam); };
    pre.concat(farPost).sort(byFar).forEach(function (s) { drawSolid(ctx, s, cam, s.opts.emit ? hexToRgb(s.color) : (s.opts.tire ? [23, 25, 28] : s.opts.paint ? rgb : hexToRgb(s.color))); });
    drawSolid(ctx, model.tub, cam, rgb);
    drawSolid(ctx, model.house, cam, rgb);
    drawSolid(ctx, model.glass, cam, [40, 62, 82]);
    nearPost.sort(byFar).forEach(function (s) { drawSolid(ctx, s, cam, s.opts.emit ? hexToRgb(s.color) : s.opts.paint ? rgb : hexToRgb(s.color)); });
  }
  function make(entry, color) {
    var spec = { type: entry.type, L: entry.L, W: entry.W, H: entry.H };
    var m = build(spec, color || "#f2f2f2"); m.color = color || "#f2f2f2"; m.entry = entry;
    return m;
  }

  var api = { list: INDEX, colors: DEFAULT_COLORS, find: find, byKey: byKey, generic: generic, normalize: normalize, make: make, draw: draw };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.CarModels = api;
})(typeof window !== "undefined" ? window : this);
