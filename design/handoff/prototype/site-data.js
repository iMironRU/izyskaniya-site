// Общие данные прототипа сайта (демо-значения) и навигация между страницами.
(function () {
  const ROUTES = {
    home: { file: 'Страница - Главная.dc.html', t: 'Главная' },
    uslugi: { file: 'Страница - Услуги.dc.html', t: 'Услуги' },
    geologiya: { file: 'Страница - Направление.dc.html', t: 'Направление: геология' },
    'topo-gaz': { file: 'Страница - Услуга.dc.html', t: 'Услуга: топосъёмка для газа' },
    ceny: { file: 'Страница - Цены.dc.html', t: 'Цены' },
    raschet: { file: 'Прототип - Частный дом.dc.html', t: 'Калькулятор', external: true },
  };
  const PLANNED = {};
  const MORE = { chastnym: 'Частным', proektirovshchikam: 'Проектировщикам', obrazcy: 'Образцы', obekty: 'Объекты', keys: 'Кейс', 'o-kompanii': 'О компании', komanda: 'Команда', laboratoriya: 'Лаборатория', tehnika: 'Техника', dokumenty: 'Документы', 'kak-rabotaem': 'Как работаем', proverka: 'Проверка подрядчика', voprosy: 'Вопросы', stati: 'Статьи', statya: 'Статья', kontakty: 'Контакты', spasibo: 'Спасибо', '404': '404', privacy: 'Политика' };
  Object.keys(MORE).forEach(k => { ROUTES[k] = { file: 'Страница.dc.html?p=' + k, t: MORE[k] }; });
  const DIRECTIONS = [
    { id: 'geologiya', t: 'Инженерная геология', short: 'Геология', h: 'Бурение, лаборатория, отчёт для проекта и экспертизы', from: 'от 38 000 ₽', days: 'от 7 дней', tasks: ['dom', 'proekt'],
      services: [['Геология под частный дом', 'geologiya'], ['Изыскания под проект и экспертизу', 'geologiya'], ['Статическое зондирование', 'geologiya'], ['Лабораторные испытания грунтов', 'geologiya']] },
    { id: 'geodeziya', t: 'Геодезия и топосъёмка', short: 'Геодезия', h: 'Топопланы, вынос осей, исполнительные съёмки', from: 'от 12 000 ₽', days: 'от 3 дней', tasks: ['dom', 'proekt', 'seti'],
      services: [['Топосъёмка для газа и воды', 'topo-gaz'], ['Топосъёмка для проекта', 'topo-gaz'], ['Вынос осей здания', 'topo-gaz'], ['Исполнительная съёмка', 'topo-gaz']] },
    { id: 'ekologiya', t: 'Инженерная экология', short: 'Экология', h: 'Радиация, почвы, воздух, шум - для экспертизы', from: 'от 45 000 ₽', days: 'от 14 дней', tasks: ['proekt'],
      services: [['Экологические изыскания под проект', 'uslugi'], ['Радиационное обследование', 'uslugi'], ['Анализ почвы', 'uslugi']] },
    { id: 'gidromet', t: 'Гидрометеорология', short: 'Гидромет', h: 'Подтопление, паводки, климат площадки', from: 'от 60 000 ₽', days: 'от 20 дней', tasks: ['proekt'],
      services: [['Гидрометеорологические изыскания', 'uslugi'], ['Оценка подтопления участка', 'uslugi']] },
    { id: 'geofizika', t: 'Геофизика', short: 'Геофизика', h: 'Электроразведка, коррозия, блуждающие токи', from: 'от 25 000 ₽', days: 'от 7 дней', tasks: ['proekt'],
      services: [['Электроразведка', 'uslugi'], ['Коррозионная агрессивность грунтов', 'uslugi']] },
    { id: 'obsledovanie', t: 'Обследование конструкций', short: 'Обследование', h: 'Фундаменты, стены, техническое заключение', from: 'от 30 000 ₽', days: 'от 10 дней', tasks: ['dom', 'proekt'],
      services: [['Обследование фундамента', 'uslugi'], ['Техническое заключение о состоянии', 'uslugi']] },
    { id: 'kadastr', t: 'Кадастровые работы', short: 'Кадастр', h: 'Межевание, вынос границ, технический план', from: 'от 9 000 ₽', days: 'от 5 дней', tasks: ['granicy'],
      services: [['Межевание участка', 'uslugi'], ['Вынос границ в натуру', 'uslugi'], ['Технический план дома', 'uslugi']] },
  ];
  const TRUST = [
    { k: 'СРО', v: 'СРО-И-000-01122009' }, { k: 'Лаборатория', v: 'Аттестат № 00-000' },
    { k: 'Работаем', v: 'с 2009 года' }, { k: 'Объектов', v: '1 240' }, { k: 'Яндекс Карты', v: '4,9 · 212 отзывов' },
  ];
  const COMPANY = { name: 'ГЕОПЛАН', phone: '+7 343 000-00-00', hours: 'пн–пт 8:00–19:00, сб 9:00–15:00', email: 'info@geoplan.example', inn: '6600000000', ogrn: '1096600000000', address: 'Екатеринбург, ул. Примерная, 1, офис 101' };

  function nav(route, e) {
    if (e && e.preventDefault) e.preventDefault();
    if (window.parent !== window) { window.parent.postMessage({ type: 'site-nav', route }, '*'); return; }
    const r = ROUTES[route];
    if (r) location.href = encodeURI(r.file);
  }
  function useMobile(cmp) {
    const upd = () => { const m = window.innerWidth < 768; if (m !== cmp._mob) { cmp._mob = m; cmp.forceUpdate(); } };
    cmp._mob = window.innerWidth < 768;
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }
  window.SITE = { ROUTES, PLANNED, DIRECTIONS, TRUST, COMPANY, nav, useMobile };
})();
