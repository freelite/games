(function () {
  'use strict';

  var DICT = {
    'Рынок': 'Market',
    'Гараж': 'Garage',
    'Сервис и Бизнес': 'Service & Business',
    'Профиль': 'Profile',
    'Бизнес': 'Business',
    'Капитал': 'Capital',
    'Репутация': 'Reputation',
    'Сделок закрыто': 'Deals closed',
    'Общая прибыль': 'Total profit',
    'Лучшая сделка': 'Best deal',
    'Пиковый капитал': 'Peak capital',
    'Следующая лига': 'Next league',
    'Все лиги': 'All leagues',
    'Все открыты': 'All open',
    'Все лиги открыты': 'All leagues are open',
    'Лига': 'League',
    'ЛИГА': 'LEAGUE',
    'Ур.': 'Lv.',
    'Бюджет': 'Budget',
    'Комфорт': 'Comfort',
    'Бизнес-класс': 'Business class',
    'Премиум': 'Premium',
    'Люкс': 'Luxury',
    'Седан': 'Sedan',
    'СЕДАН': 'SEDAN',
    'Хэтчбек': 'Hatchback',
    'ХЭТЧБЕК': 'HATCHBACK',
    'Внедорожник': 'SUV',
    'КРОССОВЕР': 'CROSSOVER',
    'Спорткар': 'Sportscar',
    'СПОРТКАР': 'SPORTSCAR',
    'ЛЮКС': 'LUXURY',
    'Передний': 'FWD',
    'Задний': 'RWD',
    'Двигатель': 'Engine',
    'Привод': 'Drivetrain',
    'Пробег': 'Mileage',
    'Владельцев по ПТС': 'Owners (title)',
    'Ликвидность': 'Liquidity',
    'ПТС и залоги': 'Title & liens',
    'Юр. чистота': 'Legal check',
    'Внешний вид': 'Exterior',
    'Кузов': 'Body',
    'Мотор': 'Engine',
    'Мойка': 'Wash',
    'Техпаспорт': 'Tech data',
    'Диагностика узлов': 'Unit diagnostics',
    'Оценка рынка': 'Market value',
    'Ваша цена': 'Your price',
    'Цена продавца': 'Seller price',
    'Цена со скидкой выкупа': 'Buyout price',
    'Текущая ставка': 'Current bid',
    'Лидер': 'Leader',
    'Ставок нет': 'No bids',
    'Старт': 'Start',
    'Аукцион': 'Auction',
    'Горячий лот · аукцион': 'Hot lot · auction',
    'Новые лоты через': 'New lots in',
    'Следующий горячий лот через': 'Next hot lot in',
    'Следующий покупатель через': 'Next buyer in',
    'Динамика цены': 'Price trend',
    'Сегодня': 'Today',
    '−3 мес': '−3 mo',
    '−6 мес': '−6 mo',
    'Максимум': 'High',
    'Рынок ≈': 'Market ≈',
    'Рынок:': 'Market:',
    'Ниже рынка': 'Below market',
    'Ниже рынка на': 'Below market by',
    'Переплата': 'Overpriced by',
    'По рынку': 'At market',
    'ниже рынка': 'below market',
    'выше на': 'higher by',
    'Выгодно': 'Good deal',
    'В гараже': 'In garage',
    'На продажу': 'For sale',
    'Куплено за': 'Bought for',
    'Продано за': 'Sold for',
    'Вложено · потенциал': 'Invested · potential',
    'Очередь': 'Queue',
    'очередь': 'queue',
    'предложений': 'offers',
    'мест': 'slots',
    'из 10': 'of 10',
    'из 5': 'of 5',
    'владельца': 'owners',
    '1 владелец': '1 owner',
    'км': 'km',
    'л.с.': 'hp',
    'п.п.': 'p.p.',
    'Нет предложений': 'No offers',
    'Гараж пуст': 'Garage is empty',
    'В выбранной лиге пока пусто. Смените фильтр или обновите ленту.':
      'Nothing in this league yet. Change the filter or refresh the feed.',
    'Найдите автомобиль на рынке, проверьте состояние и перепродайте после подготовки.':
      'Find a car on the market, check its condition and resell it after prep.',
    'Перейти на рынок': 'Go to market',
    'Обновить ленту': 'Refresh feed',
    'Обновить сейчас': 'Refresh now',
    'Реклама': 'Ad',
    'Диагностика узлов': 'Unit diagnostics',
    'Найдено:': 'Found:',
    'Скрытых проблем не найдено.': 'No hidden problems found.',
    'Продавец показывает не всё. Бесплатный осмотр или диагностика за':
      'Some data is revealed only after diagnostics. Free inspection or diagnostics for',
    'Базовый осмотр бесплатен, глубокая диагностика': 'Basic inspection is free, deep diagnostics',
    'Торг снижает цену на 5–15%.': 'Haggling reduces the price by 5–15%.',
    'Базовый осмотр: только внешний вид и документы': 'Basic inspection: exterior and documents only',
    'Базовый осмотр завершён. Скрытые узлы не проверялись.':
      'Basic inspection done. Hidden units were not checked.',
    'Осмотр полностью раскрывает мотор, кузов, документы и пробег':
      'Inspection fully reveals engine, body, documents and mileage',
    'Осмотр проведён': 'Inspected',
    'Осмотр': 'Inspect',
    'Купить': 'Buy',
    'Торг': 'Haggle',
    'Продать': 'Sell',
    'Снять': 'Unlist',
    'Выставить': 'List car',
    'Выставить на продажу': 'List for sale',
    'Полный': 'AWD',
    'Осмотр · бесплатно': 'Inspect · free',
    'Осмотр завершён': 'Inspection complete',
    'Диагностика проведена': 'Diagnostics done',
    'Диагностика · VIP бесплатно': 'Diagnostics · VIP free',
    'Диагностика выявила всё скрытое': 'Diagnostics revealed everything hidden',
    'Диагностика проведена': 'Diagnostics complete',
    'Бесплатная полная диагностика · VIP': 'Free full diagnostics · VIP',
    'Бесплатная полная диагностика [Реклама]': 'Free full diagnostics [Ad]',
    'Бесплатная полная проверка любого автомобиля перед покупкой':
      'Free full check of any car before purchase',
    'Глубокая диагностика: мотор, кузов, документы и пробег проверены.':
      'Deep diagnostics: engine, body, documents and mileage verified.',
    'Экспертная диагностика: мотор, кузов, документы и пробег проверены.':
      'Expert diagnostics: engine, body, documents and mileage verified.',
    'Осмотр с толщиномером и эндоскопом завершён.': 'Inspection with gauge and borescope complete.',
    'Полная диагностика получена': 'Full diagnostics received',
    'Полная диагностика': 'Full diagnostics',
    'Торг с продавцом': 'Haggle with the seller',
    'Техпаспорт': 'Tech data',
    'Продавец больше не торгуется.': 'The seller no longer negotiates.',
    'Цена согласована — можно забирать.': 'Price agreed — you can take it.',
    'Покупатель отказался торговаться': 'The buyer refused to haggle',
    'Продавец не уступил': 'The seller did not budge',
    'Торг успешен: −': 'Haggle success: −',
    'Покупатель поднял до': 'Buyer raised to',
    'Покупатель поднял': 'Buyer raised',
    'Покупка по цене продавца': 'Purchase at seller price',
    'Скидка на покупку': 'Purchase discount',
    'Скручен пробег': 'Service history unverified',
    'Скручен · реальный': 'History unverified · real',
    'Есть сомнения ·': 'Doubts ·',
    'не проверено': 'not checked',
    'нужна проверка': 'check needed',
    'Требует проверки': 'Needs check',
    'Чисто': 'Clean',
    'норма': 'ok',
    'износ': 'wear',
    'критично': 'critical',
    'кузов битый': 'body damage',
    'мотор требует ремонта': 'engine needs repair',
    'проблемы с документами': 'document issues',
    'Дубликат ПТС': 'Duplicate title',
    'Залог у банка': 'Bank lien',
    'Ограничение регистрации': 'Registration restriction',
    'Расхождение VIN': 'VIN mismatch',
    'дефекты не проверены': 'defects not checked',
    'Ориентир на ремонт:': 'Repair estimate:',
    'Свободно мест:': 'Free slots:',
    'Мест в гараже:': 'Garage slots:',
    'Занято': 'Occupied',
    'Занято ': 'Occupied ',
    'подготовка повышает цену продажи': 'prep increases the sale price',
    'Сначала выставьте авто на продажу': 'List the car for sale first',
    'Покупатели изучают объявление.': 'Buyers are studying the listing.',
    'Покупатели присылают офферы каждые несколько секунд. Слишком высокая цена снижает шансы сделки.':
      'Buyers send offers every few seconds. Too high a price lowers the chance of a deal.',
    'Ускорить продажу · VIP-покупатель [Реклама]': 'Speed up sale · VIP buyer [Ad]',
    'VIP-покупатель': 'VIP buyer',
    'VIP-покупатель найден:': 'VIP buyer found:',
    'Объявление опубликовано': 'Listing published',
    'Объявление снято': 'Listing removed',
    'Лента обновлена': 'Feed refreshed',
    'На рынок поступили новые авто': 'New cars arrived on the market',
    'Новости рынка:': 'Market news:',
    'Новости рынка: цены вернулись к норме': 'Market news: prices are back to normal',
    'Сезонный спад:': 'Seasonal decline:',
    'Дефицит': 'Shortage',
    'Горячий лот:': 'Hot lot:',
    'Аукцион выигран:': 'Auction won:',
    'Аукцион завершён без ставок': 'Auction ended with no bids',
    'Лот забрал перекупщик': 'A reseller took the lot',
    '— аукцион начался': '— auction started',
    '— в гараже': '— in garage',
    'Ваша ставка:': 'Your bid:',
    'Недостаточно средств для ставки': 'Not enough money for a bid',
    'Недостаточно средств': 'Not enough money',
    'Недостаточно средств: лот не выкуплен': 'Not enough money: lot not purchased',
    'Гараж заполнен: лот не выкуплен': 'Garage is full: lot not purchased',
    'Гараж заполнен — расширьте вместимость': 'Garage is full — expand capacity',
    'Нет свободного места в гараже': 'No free space in the garage',
    'Минимальная цена — 10 000 ₽': 'Minimum price — $10,000',
    'Не хватает': 'Missing',
    'Нужно': 'Need',
    'Готово:': 'Done:',
    'Просмотр засчитан:': 'View counted:',
    'Реклама недоступна': 'Ad unavailable',
    'Реклама не была просмотрена': 'Ad was not watched',
    'Достижения': 'Achievements',
    'Настройки': 'Settings',
    'Звук интерфейса и уведомлений': 'Interface and notification sounds',
    'Звук включён': 'Sound on',
    'Звук выкл': 'Sound off',
    'Звук вкл': 'Sound on',
    'Сброс прогресса игры': 'Reset game progress',
    'Звук выключен': 'Sound off',
    'Прогресс сохраняется автоматически в localStorage.':
      'Progress is saved automatically to localStorage.',
    'Репутация и капитал открывают новые лиги.': 'Reputation and capital unlock new leagues.',
    'Инвестиции в бизнес не сгорают: скидки, диагностика и VIP-клиенты работают на каждой сделке. Новый уровень лиги открывается по пиковому капиталу и репутации.':
      'Business investments never expire: discounts, diagnostics, and VIP clients work on every deal. New league tier unlocks by peak capital and reputation.',
    'Первая покупка': 'First purchase',
    'Первая продажа': 'First sale',
    'Прибыль 100 000 ₽': '$100,000 profit',
    'Репутация 50': 'Reputation 50',
    '10 сделок': '10 deals',
    'Официальный салон': 'Official dealership',
    'АВТОБАРОН · этап 2': 'AUTOBARON · stage 2',
    'от гаража до империи': 'From garage to empire',
    'История не подтверждена': 'Service history unverified',
    'История не подтверждена ·': 'Service history unverified ·',
    'нет истории обслуживания': 'no service history',
    'Первый миллион капитала': 'First million capital',
    'Собственный автосалон': 'Own dealership',
    'Ограничения': 'Restrictions',
    'есть ограничения': 'restrictions',
    '10 успешных сделок': '10 successful deals',
    '50 успешных сделок': '50 successful deals',
    'шанс': 'chance',
    'на диагностику': 'for diagnostics',
    'Язык / Language': 'Language',
    'за': 'for',
    'из': 'of',
    'с': 's',
    'дешевле на': 'cheaper by',
    'поднял ставку:': 'raised the bid:',
    '· прибыль': '· profit',
    '· рынок': '· market',
    ', репутация': ', reputation',
    ', статус автосалона': ', dealership status',
    ': капитал': ': capital',
    ': уровень': ': level',
    ': цены на': ': prices for',
    '/ реп.': '/ rep.',
    '% на 3 минуты': '% for 3 minutes',
    '. Ориентир на ремонт:': '. Repair estimate:',
    '. Торг снижает цену на 5–15%.': '. Haggle lowers the price by 5–15%.',
    'Базовый осмотр бесплатен, глубокая диагностика —': 'Basic inspection is free, deep diagnostics —',
    'Диагностика ·': 'Diagnostics ·',
    'Осмотр: диапазон ±': 'Inspection: range ±',
    '₽ — забирайте.': '$ — take it.',
    '· подготовка повышает цену продажи': '· prep increases the sale price',
    'Алексей': 'Alexey',
    'Анна': 'Anna',
    'Артём': 'Artem',
    'Виктор': 'Victor',
    'Денис': 'Denis',
    'Дмитрий': 'Dmitry',
    'Елена': 'Elena',
    'Ирина': 'Irina',
    'Кристина': 'Kristina',
    'Максим': 'Maxim',
    'Марат': 'Marat',
    'Марина': 'Marina',
    'Олег': 'Oleg',
    'Ольга': 'Olga',
    'Павел': 'Pavel',
    'Роман': 'Roman',
    'Сергей': 'Sergey',
    'Тимур': 'Timur',
    'АВТОБАРОН': 'AUTOBARON',
    'Автобарон': 'Autobaron',
    'Частный автобизнес · этап 2': 'Private car business · stage 2',
    'Новичок': 'Rookie',
    'Опытный перекупщик': 'Experienced reseller',
    'Владелец салона': 'Dealership owner',
    'Магнат авторынка': 'Car market magnate',
    'Начать заново': 'Start over',
    'Начать заново? Весь прогресс будет удалён.': 'Start over? All progress will be deleted.',
    'Отмена': 'Cancel',
    'Закрыть': 'Close',
    'Отлично!': 'Great!',
    'Продолжить карьеру': 'Continue career',
    'Начать карьеру': 'Start career',
    'Новая история началась': 'A new story begins',
    'Добро пожаловать в АВТОБАРОН!': 'Welcome to AUTOBARON!',
    'Покупай авто на рынке, проверяй скрытые дефекты диагностикой, сбивай цену в торге, готовь машины в своём сервисе и продавай с прибылью, чтобы пройти путь от одного гаража до собственной автоимперии.':
      'Buy cars on the market, reveal hidden defects with diagnostics, haggle the price down, prep cars in your own shop and sell at a profit on your way from a single garage to a car empire.',
    'Ищи лоты на рынке и проверяй скрытые дефекты': 'Find lots on the market and reveal hidden defects',
    'Торгуйся, ремонтируй и готовь авто к продаже': 'Haggle, repair and prep cars for sale',
    'Развивай бизнес и открывай новые лиги': 'Grow your business and unlock new leagues',
    'Закрытый клуб автобаронов': 'Private club of car barons',
    'Закрытый клуб': 'Private club',
    'VIP на 24 часа': 'VIP for 24 hours',
    'VIP-статус на 24 часа': 'VIP status for 24 hours',
    'Автобарон · клубная карта': 'Autobaron · club card',
    '5 роликов · доступ ровно на 24 часа': '5 videos · exactly 24 hours of access',
    'Без рекламы ещё': 'No ads for another',
    'Просмотров рекламы:': 'Ad views:',
    'VIP активен': 'VIP active',
    'VIP активен · осталось': 'VIP active · left',
    'VIP активен: осталось': 'VIP active: left',
    'Закрытый клуб активирован на 24 часа': 'Private club activated for 24 hours',
    'Никакой рекламы — мгновенный доступ ко всем действиям без ожидания':
      'No ads — instant access to every action without waiting',
    'Двойной поток состоятельных покупателей в вашем гараже':
      'Double flow of wealthy buyers in your garage',
    'Приоритетный доступ к закрытым торгам': 'Priority access to private auctions',
    'Посмотри 5 коротких рекламных роликов — и получи сутки привилегий без рекламы. Прогресс сохраняется.':
      'Watch 5 short ad clips and get a day of ad-free privileges. Progress is kept.',
    'Активировать VIP на 24ч': 'Activate VIP for 24h',
    'Максимальный уровень достигнут': 'Maximum level reached',
    'Максимум': 'Max',
    'Стоимость уровня:': 'Level cost:',
    'Максимальная наценка на закрытых лотах': 'Maximum markup on private lots',
    'Максимальный приоритет у продавцов': 'Maximum priority with sellers',
    'Доступ к закрытым лотам дилеров': 'Access to private dealer lots',
    'Доступ к лотам дороже миллиона': 'Access to lots above one million',
    'Персональные условия выкупа': 'Personal buyout terms',
    'Приоритет в очереди офферов': 'Priority in the offer queue',
    'Продавцы уступают охотнее': 'Sellers give in more readily',
    'Лиги 4–5 и закрытые лоты': 'Leagues 4–5 and private lots',
    'VIP-офферы с наценкой': 'VIP offers with markup',
    'Лиги 4–5 закрыты, VIP-покупатели недоступны': 'Leagues 4–5 locked, VIP buyers unavailable',
    'Лиги 4–5 открыты · VIP-наценка +': 'Leagues 4–5 open · VIP markup +',
    'Лига 2 открыта': 'League 2 unlocked',
    'Лига 3 открыта': 'League 3 unlocked',
    'Лига 4 открыта': 'League 4 unlocked',
    'Лига 5 открыта': 'League 5 unlocked',
    'Новый рынок': 'New market',
    'Элитный рынок': 'Elite market',
    'Бизнес-этап': 'Business stage',
    'Капитал и репутация вывели вас на комфорт-класс. На рынке появились свежие лоты.':
      'Capital and reputation brought you to the comfort class. Fresh lots appeared on the market.',
    'Бизнес-класс и кроссоверы теперь доступны для выкупа и перепродажи.':
      'Business class cars and crossovers are now available for buyout and resale.',
    'Премиальные автомобили и спорткары вышли на ваш рынок.':
      'Premium cars and sportscars entered your market.',
    'Люкс и гиперкары. Вы играете в высшей лиге авторынка.':
      'Luxury and hypercars. You are playing in the top league of the car market.',
    'Пиковый капитал достиг 1 000 000 ₽. Банк начинает разговаривать с вами иначе.':
      'Peak capital reached $1,000,000. The bank talks to you differently now.',
    'Десять закрытых сделок. Вы перестали быть новичком и стали перекупщиком.':
      'Ten closed deals. You are no longer a rookie — you are a reseller.',
    'Пятьдесят сделок. Ваше имя знают на всем рынке.':
      'Fifty deals. Your name is known across the whole market.',
    'Статус официального автосалона открывает элитные лиги и VIP-клиентов.':
      'Official dealership status unlocks elite leagues and VIP clients.',
    'Статус «Магнат авторынка»': '“Car market magnate” status',
    'Статус открывает элитные лиги и доступ к VIP-клиентам.':
      'The status unlocks elite leagues and access to VIP clients.',
    'Лимит торга повышен на 5%': 'Haggle limit increased by 5%',
    'Лимит торга повышен на 10%': 'Haggle limit increased by 10%',
    'Лимит торга повышен на 15%': 'Haggle limit increased by 15%',
    'Больше предложений в каждой ленте': 'More offers in every feed',
    'Эксклюзивные предложения каждый час': 'Exclusive offers every hour',
    'VIP-покупатели с наценкой': 'VIP buyers with markup',
    'Репутация +3': 'Reputation +3',
    'Репутация +5': 'Reputation +5',
    'Репутация +10': 'Reputation +10',
    'Электро 544 л.с.': 'Electric 544 hp',
    'Дополнительные машиноместа для оборота.': 'Extra parking slots for turnover.',
    'Инструмент для проверки кузова, мотора и пробега.': 'Tool for checking body, engine and mileage.',
    'Собственная мойка, полировка и предпродажная подготовка.':
      'In-house wash, polishing and pre-sale prep.',
    'Свой цех: дешевле и качественнее ремонт двигателя и кузова.':
      'Own shop: cheaper and better engine and body repair.',
    'Репутация усиливает давление на цену в обе стороны.': 'Reputation puts pressure on price both ways.',
    'Рекламные кампании ускоряют поток покупателей в гараже.':
      'Ad campaigns speed up the flow of buyers to your garage.',
    'Проверка ПТС, залогов и ограничений до сделки.': 'Check of title, liens and restrictions before a deal.',
    'Быстрый выкуп и эвакуация дают скидку у продавцов.':
      'Fast buyout and towing give you a discount from sellers.',
    'Покупатели берут авто в кредит дороже рынка.': 'Buyers take cars on credit above market price.',
    'Покупатели присылают офферы каждые несколько секунд.':
      'Buyers send offers every few seconds.',
    'Документы проверяются только платной диагностикой':
      'Documents are checked only by paid diagnostics',
    'Автопроверка ПТС · штраф проблемных документов −': 'Auto title check · document penalty −',
    'Покупка по цене продавца': 'Purchase at the seller price',
    'Инвестиции в бизнес не сгорают: скидки, диагностика и VIP-клиенты работают на каждой сделке.':
      'Business investments never burn: discounts, diagnostics and VIP clients work on every deal.',
    'Новый уровень лиги открывается по пиковому капиталу и репутации.':
      'A new league level opens by peak capital and reputation.',
    'Десять направлений и 8–10 уровней · эффект применяется сразу':
      'Ten directions and 8–10 levels · effect applies instantly',
    'Расширение гаража': 'Garage expansion',
    'Толщиномер и эндоскоп': 'Paint gauge & borescope',
    'Детейлинг-студия': 'Detailing studio',
    'Автосервис и подъёмник': 'Service shop & lift',
    'Переговоры и личный бренд': 'Negotiation & personal brand',
    'Официальный автосалон': 'Official dealership',
    'Маркетинг и PR': 'Marketing & PR',
    'Юридический отдел': 'Legal department',
    'Служба выкупа и эвакуации': 'Buyout & towing service',
    'VIP-лаунж и кредитный брокер': 'VIP lounge & credit broker',
    'Мойка и полировка': 'Wash & polish',
    'Ремонт кузова': 'Body repair',
    'Капиталка двигателя': 'Engine overhaul',
    'Мойка −': 'Wash −',
    'Ремонт −': 'Repair −',
    'наценка при продаже +': 'sale markup +',
    'наценка +': 'markup +',
    'восстановление +': 'restoration +',
    'VIP-шанс +': 'VIP chance +',
    'Цена продажи +': 'Sale price +',
    'Офферы быстрее на': 'Offers faster by',
    'Шанс успешного торга +': 'Successful haggle chance +',
    'Следующий уровень:': 'Next level:',
    'Следующий уровень:': 'Next level:',
    'Следующий уровень: VIP-наценка +': 'Next level: VIP markup +',
    'Следующий уровень: лиги 4–5 и VIP-офферы +12%': 'Next level: leagues 4–5 and VIP offers +12%',
    'Следующий уровень: автопроверка ПТС и залогов': 'Next level: auto title and lien check',
    'Следующий уровень: полное раскрытие скрытых дефектов': 'Next level: full reveal of hidden defects',
    'Следующий уровень: мойка −': 'Next level: wash −',
    'Следующий уровень: ремонт −': 'Next level: repair −',
    'Следующий уровень: скидка на покупку': 'Next level: purchase discount',
    'Следующий уровень: цена продажи +': 'Next level: sale price +',
    'Следующий уровень: шанс торга +': 'Next level: haggle chance +',
    'Следующий уровень: штраф документов −': 'Next level: document penalty −',
    'Следующий уровень: офферы быстрее на': 'Next level: offers faster by',
    'Готов забрать сегодня — уступите?': 'I can take it today — can you move on price?',
    'Вот что я нашёл в машине': 'Here is what I found in the car',
    'Больше этой цены авто не стоит': 'The car is not worth more than this',
    'Больше этой суммы машина не стоит. Забираю сейчас или ищу дальше.':
      'The car is not worth more than that. I take it now or keep looking.',
    'Я посмотрел машину внимательно: есть вопросы по состоянию. Давайте адекватную цену.':
      'I looked at the car closely: there are condition issues. Let us agree on a fair price.',
    'Готов забрать сегодня, если немного уступите по цене.':
      'I can take it today if you move a little on price.',
    'Готов забрать сегодня, если договоримся.': 'I can take it today if we agree.',
    'Торг возможен? Возьму сразу.': 'Is there room to haggle? I will take it right away.',
    'Куда приезжать на осмотр?': 'Where do I come for the inspection?',
    'Машина не битая? Тогда беру.': 'The car is not damaged? Then I will take it.',
    'Предоплату внесу сразу, обсудим цену.': 'I will pay a deposit right away, let us discuss the price.',
    'Долго искал именно такую, готов брать.': 'I have been looking for this one, ready to buy.',
    'Машина обслужена, вложений не требует. Торг возможен при быстром выкупе.':
      'The car is serviced, no extra investment needed. Haggle possible for a fast buyout.',
    'Авто не битое, все работы по регламенту. Смотрите, торопитесь.':
      'The car is undamaged, all work done by the book. Take a look, hurry.',
    'Продаю срочно, поэтому готов обсудить цену.': 'Selling urgently, so I am open to discussing the price.',
    'Состояние хорошее, всё работает. Серьёзным покупателям уступлю.':
      'Good condition, everything works. I will move for serious buyers.',
    'Нет, за такую цену не отдам.': 'No, I will not sell at that price.',
    'Это слишком низко.': 'That is too low.',
    'Не готов так сильно уступать.': 'I am not ready to give up that much.',
    'Подожду другого покупателя.': 'I will wait for another buyer.',
    'Добавлю, но это максимум.': 'I can add, but that is the maximum.',
    'Договорились. Уступаю': 'Deal. I drop by',
    'Готов забрать сегодня': 'I can take it today',
    'VIP-клиент: беру в кредит сегодня.': 'VIP client: taking it on credit today.',
    'Владелец салона': 'Dealership owner',
    'Перекупщик': 'Reseller',
    'Перекупщик ': 'Reseller ',
    'Вы': 'You',
    'продано за': 'sold for',
    'предлагает': 'offers',
    'рынок': 'market',
    'прибыль': 'profit',
    'реп.': 'rep.',
    ' капитал': 'capital',
    ' уровень': 'level',
    'цены на': 'prices for',
    'бизнес-седанов': 'business sedans',
    'внедорожники': 'SUVs',
    'кроссоверов': 'crossovers',
    'люкс-авто': 'luxury cars',
    'премиальных авто': 'premium cars',
    'седаны': 'sedans',
    'спорткары': 'sportscars',
    'спорткаров': 'sportscars',
    'хэтчбеки': 'hatchbacks',
    'хэтчбеков': 'hatchbacks',
    'Сезонный спрос на авторынке': 'Seasonal demand on the car market'
  };

  var PATTERNS = [
    [/^(\d+)\s+предложений$/, '$1 offers'],
    [/^(\d+)\s+из\s+(\d+)$/, '$1 of $2'],
    [/^(\d+)\s+мест$/, '$1 slots'],
    [/^(\d+)\s+владельца$/, '$1 owners'],
    [/^(\d+)\s+сделок$/, '$1 deals'],
    [/^Лига\s+(\d+)$/, 'League $1'],
    [/^Скручен · реальный\s+(.+)$/, 'History unverified · real $1'],
    [/^Изменено на\s*(.+)$/, 'Changed to $1'],
    [/^Ур\.\s*(\d+)\/(\d+)$/, 'Lv. $1/$2'],
    [/^\+5% · (.+)$/, '+5% · $1'],
    [/^\+10% · (.+)$/, '+10% · $1'],
    [/^Старт (.+) · рынок (.+)$/, 'Start $1 · market $2'],
    [/^Скручен · реальный (.+)$/, 'History unverified · real $1'],
    [/^Есть сомнения · (.+)$/, 'Doubts · $1'],
    [/^Найдено: (.+)\. Ориентир на ремонт: (.+)\.$/, 'Found: $1. Repair estimate: $2.'],
    [/^VIP активен · осталось (.+)$/, 'VIP active · left $1'],
    [/^VIP активен: осталось (.+)$/, 'VIP active: left $1'],
    [/^Без рекламы ещё (.+)$/, 'No ads for another $1'],
    [/^Просмотров рекламы: (\d+)\/(\d+)$/, 'Ad views: $1/$2'],
    [/^Активировать VIP на 24ч \((.+)\)$/, function (core, m) {
      return 'Activate VIP for 24h (' + m[1].replace('рекламы', 'ads') + ')';
    }],
    [/^ЛИГА (\d+)$/, 'LEAGUE $1'],
    [/^шанс (\d+)%$/, 'chance $1%'],
    [/^Диагностика · (.+)$/, 'Diagnostics · $1'],
    [/^Рынок ≈ (.+)$/, 'Market ≈ $1'],
    [/^Рынок: (.+)$/, 'Market: $1'],
    [/^Купить за (.+)$/, 'Buy for $1'],
    [/^Договорились\. Уступаю (.+?) ₽ — забирайте\.$/, function (core, m) {
      return 'Deal. I drop by $' + m[1] + ' — take it.';
    }],
    [/^Торг успешен: −(.+?) ₽$/, function (core, m) {
      return 'Haggle success: −$' + m[1];
    }],
    [/^Лента обновлена · бонус за рекламу \+5 000 ₽$/, 'Feed refreshed · ad bonus +$5,000'],
    [/^Базовый осмотр бесплатен, глубокая диагностика — (.+?)\. Торг снижает цену на (.+?)\.$/,
      'Basic inspection is free, deep diagnostics — $1. Haggle lowers price by $2.'],
    [/^Часть данных раскрывается после диагностики\. Бесплатный осмотр или диагностика за (.+?)\.$/,
      'Some specs are hidden until inspected. Basic inspection is free or deep diagnostics for $1.'],
    [/^Просмотр засчитан: (.+)$/, 'View counted: $1'],
    [/^Продано за (.+)$/, 'Sold for $1'],
    [/^Куплено за (.+)$/, 'Bought for $1'],
    [/^Новые лоты через (.+)$/, 'New lots in $1'],
    [/^Следующий покупатель через (.+)$/, 'Next buyer in $1'],
    [/^Следующий горячий лот через (.+)$/, 'Next hot lot in $1'],
    [/^Ускорить продажу · VIP-покупатель \[Реклама\]$/, 'Speed up sale · VIP buyer [Ad]'],
    [/^(.+)\s+·\s+VIP$/, '$1 · VIP'],
    [/^(.+)\s+предлагает\s+(.+)$/, '$1 offers $2'],
    [/^(.+)\s+поднял до\s+(.+)$/, '$1 raised to $2'],
    [/^Стоимость уровня:\s*(.+)$/, 'Level cost: $1'],
    [/^Свободно мест:\s*(\d+)\s+из\s+(\d+)$/, 'Free slots: $1 of $2'],
    [/^Занято\s+(\d+)\s+из\s+(\d+)$/, 'Occupied $1 of $2'],
    [/^(\d+)\s+предложений$/, '$1 offers'],
    [/^(\d+)\s+мес$/, '$1 mo'],
    [/^(\d+)\s+минут[ыа]?$/, '$1 min'],
    [/^(\d+)\s+секунд[ыа]?$/, '$1 sec'],
    [/^(\d+)\s*ч\s*(\d+)\s*м$/, function (core, m) { return m[1] + 'h ' + m[2] + 'm'; }],
    [/^(\d+)\s*м$/, '$1m'],
    [/^(\d+)\s*с$/, '$1s'],
    [/^([\d\s.,]+)\s*тыс\s*₽$/, '$1k ₽'],
    [/^([\d\s.,]+)\s*млн\s*₽$/, '$1M ₽'],
    [/^([\d\s.,]+)\s*млрд\s*₽$/, '$1B ₽'],
    [/^(\d+)\s*п\.\s*п\.$/, '$1 p.p.'],
    [/^Следующий уровень:\s*(.+)$/, function (core, m) {
      return 'Next level: ' + (translate(m[1]) || units(m[1]));
    }],
    [/^Дефицит\s+(.+):\s*цены на\s+(.+?)\s*\+\s*(\d+)%\s*на 3 минуты$/, function (core, m) {
      return 'Shortage of ' + (DICT[normalize(m[1])] || m[1]) + ': prices for ' +
        (DICT[normalize(m[2])] || m[2]) + ' +' + m[3] + '% for 3 minutes';
    }],
    [/^Сезонный спад:\s*(.+?)\s*дешевле на\s*(\d+)%$/, function (core, m) {
      return 'Seasonal decline: ' + (DICT[normalize(m[1])] || m[1]) + ' cheaper by ' + m[2] + '%';
    }],
    [/^Новости рынка:\s*(.+)$/, function (core, m) {
      return 'Market news: ' + (translate(m[1]) || m[1]);
    }],
    [/^Осмотр: диапазон ±(\d+)% · история обслуживания подтверждается с шансом (\d+)%$/,
      'Inspection: range ±$1% · service history confirmed with $2% chance'],
    [/^Следующий уровень: ±(\d+)% · шанс подтвердить историю (\d+)%$/,
      'Next level: ±$1% · history confirmation chance $2%'],
    [/^Лига\s+(\d+)\s*·\s*(.+)$/, function (core, m) {
      var rest = m[2];
      var parts = rest.split(':');
      var head = DICT[normalize(parts[0])] || parts[0];
      var tail = parts.length > 1 ? parts.slice(1).join(':').trim() : '';
      if (tail) {
        var tm = tail.match(/^капитал\s+(.+?),\s*репутация\s+(\d+)(.*)$/);
        if (tm) {
          var extra = tm[3] ? translate(tm[3].replace(/^[,\s]+/, '')) || '' : '';
          return 'League ' + m[1] + ' · ' + head + ': capital ' + units(tm[1]) +
            ', reputation ' + tm[2] + (extra ? ', ' + extra : '');
        }
      }
      return 'League ' + m[1] + ' · ' + head + (tail ? ': ' + (translate(tail) || tail) : '');
    }]
  ];

  function units(value) {    var core = String(value == null ? '' : value);
    var out = core
      .replace(/(\d[\d\s.,]*\d|\d)\s*млрд\s*₽/g, '$1B ₽')
      .replace(/(\d[\d\s.,]*\d|\d)\s*млн\s*₽/g, '$1M ₽')
      .replace(/(\d[\d\s.,]*\d|\d)\s*тыс\s*₽/g, '$1k ₽')
      .replace(/(\d[\d\s.,]*\d|\d)\s*км/g, '$1 km')
      .replace(/(\d+)\s*ч\s*(\d+)\s*м/g, '$1h $2m')
      .replace(/(\d+)\s*п\.\s*п\./g, '$1 p.p.');
    return out;
  }

  var lang = 'ru';
  var manualKey = 'autobaron_lang';
  var originals = new WeakMap();
  var observer = null;
  var applying = false;
  var pending = false;

  function normalize(value) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  }

  function translate(value) {
    var core = normalize(value);
    if (!core) return null;
    var result = null;
    if (Object.prototype.hasOwnProperty.call(DICT, core)) {
      result = DICT[core];
    } else {
      for (var i = 0; i < PATTERNS.length; i++) {
        var rule = PATTERNS[i];
        var match = core.match(rule[0]);
        if (!match) continue;
        result = typeof rule[1] === 'function'
          ? rule[1](core, match)
          : core.replace(rule[0], rule[1]);
        break;
      }
    }
    if (result == null) {
      var converted = phrases(units(core));
      return converted !== core ? converted : null;
    }
    return phrases(units(result));
  }

  var PHRASES = [
    ['история обслуживания подтверждается с шансом', 'service history confirmed with chance of'],
    ['шанс подтвердить историю', 'history confirmation chance'],
    ['Следующий уровень', 'Next level'],
    ['Лиги 4–5 открыты', 'Leagues 4–5 open'],
    ['Лиги 4–5 закрыты', 'Leagues 4–5 locked'],
    ['Мест в гараже', 'Garage slots'],
    ['из 10', 'of 10'],
    ['из 5', 'of 5'],
    ['VIP-покупатель', 'VIP buyer'],
    ['VIP-покупатели', 'VIP buyers'],
    ['Документы проверяются только платной диагностикой', 'Documents are checked only by paid diagnostics'],
    ['Автопроверка ПТС', 'Auto title check'],
    ['штраф проблемных документов', 'problem document penalty'],
    ['Офферы быстрее на', 'Offers faster by'],
    ['Шанс успешного торга', 'Successful haggle chance'],
    ['VIP-наценка', 'VIP markup'],
    ['VIP-шанс', 'VIP chance'],
    ['наценка при продаже', 'sale markup'],
    ['Скидка на покупку', 'Purchase discount'],
    ['скидка на покупку', 'purchase discount'],
    ['Цена продажи', 'Sale price'],
    ['цена продажи', 'sale price'],
    ['Мойка', 'Wash'],
    ['Ремонт', 'Repair'],
    ['восстановление', 'restoration'],
    ['наценка', 'markup'],
    ['шанс торга', 'haggle chance'],
    ['Лиги 4–5', 'Leagues 4–5'],
    ['закрытые лоты', 'private lots'],
    ['закрытых лотах', 'private lots'],
    ['пункта', 'points'],
    ['мест', 'slots']
  ];

  function phrases(value) {
    var out = String(value);
    for (var i = 0; i < PHRASES.length; i++) {
      if (out.indexOf(PHRASES[i][0]) !== -1) out = out.split(PHRASES[i][0]).join(PHRASES[i][1]);
    }
    return out;
  }

  function units(value) {
    var core = String(value == null ? '' : value);
    return core
      .replace(/(\d[\d\s.,]*\d|\d)\s*млрд\s*₽/g, '$1B ₽')
      .replace(/(\d[\d\s.,]*\d|\d)\s*млн\s*₽/g, '$1M ₽')
      .replace(/(\d[\d\s.,]*\d|\d)\s*тыс\s*₽/g, '$1k ₽')
      .replace(/(\d[\d\s.,]*\d|\d)\s*км/g, '$1 km')
      .replace(/(\d+)\s*ч\s*(\d+)\s*м/g, '$1h $2m')
      .replace(/(\d+)\s*п\.\s*п\./g, '$1 p.p.');
  }

  function applyTextNode(node) {
    var raw = node.nodeValue;
    if (!raw || !/\S/.test(raw)) return;
    if (lang === 'en') {
      var mapped = translate(raw);
      if (!mapped || mapped === raw.trim()) return;
      if (!originals.has(node)) originals.set(node, raw);
      var lead = raw.match(/^\s*/)[0];
      var tail = raw.match(/\s*$/)[0];
      node.nodeValue = lead + mapped + tail;
    } else if (originals.has(node)) {
      node.nodeValue = originals.get(node);
      originals.delete(node);
    }
  }

  function applyAttributes(el) {
    var attrs = ['aria-label', 'placeholder', 'title'];
    for (var i = 0; i < attrs.length; i++) {
      var name = attrs[i];
      if (!el.hasAttribute(name)) continue;
      var raw = el.getAttribute(name);
      if (lang === 'en') {
        var mapped = translate(raw);
        if (!mapped || mapped === raw) continue;
        var store = originals.get(el) || {};
        if (!store['@' + name]) store['@' + name] = raw;
        originals.set(el, store);
        el.setAttribute(name, mapped);
      } else {
        var saved = originals.get(el);
        if (saved && saved['@' + name]) el.setAttribute(name, saved['@' + name]);
      }
    }
  }

  function walk(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      applyTextNode(root);
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    var tag = root.nodeType === 1 ? root.tagName : '';
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'SVG' || tag === 'TEXTAREA') return;
    if (root.nodeType === 1) applyAttributes(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
    var node = walker.nextNode();
    while (node) {
      if (node.nodeType === 3) applyTextNode(node);
      else if (node.nodeType === 1) {
        if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'SVG') {
          node = walker.nextSibling();
          continue;
        }
        applyAttributes(node);
      }
      node = walker.nextNode();
    }
  }

  function run(root) {
    if (applying) { pending = true; return; }
    applying = true;
    try { walk(root || document.body); } finally { applying = false; }
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      pending = false;
      run(document.body);
    });
  }

  function watch() {
    if (observer || typeof MutationObserver !== 'function' || !document.body) return;
    observer = new MutationObserver(function () {
      if (applying || pending) return;
      schedule();
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function syncSwitches() {
    var buttons = document.querySelectorAll('.lang-btn');
    for (var i = 0; i < buttons.length; i++) {
      var active = buttons[i].getAttribute('data-lang') === lang;
      buttons[i].classList.toggle('is-active', active);
      buttons[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  function setLang(next, persist) {
    if (!setLang.baseTitle) setLang.baseTitle = document.title;
    document.title = next === 'en'
      ? 'AUTOBARON — from garage to empire'
      : (setLang.baseTitle || document.title);
    next = next === 'en' ? 'en' : 'ru';
    lang = next;
    document.documentElement.lang = next;
    document.body.classList.toggle('lang-en', next === 'en');
    if (persist) {
      try { localStorage.setItem(manualKey, next); } catch (err) { /* noop */ }
    }
    run(document.body);
    syncSwitches();
    document.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: next } }));
  }

  function storedLang() {
    try { return localStorage.getItem(manualKey); } catch (err) { return null; }
  }

  function auto(platformLanguage) {
    var saved = storedLang();
    var next = saved === 'ru' || saved === 'en'
      ? saved
      : (String(platformLanguage || 'ru').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en');
    setLang(next, false);
  }

  function t(value) {
    if (lang !== 'en') return value;
    var mapped = translate(value);
    return mapped == null ? value : mapped;
  }

  function bind() {
    document.addEventListener('click', function (event) {
      var btn = event.target && event.target.closest ? event.target.closest('[data-lang]') : null;
      if (!btn) return;
      event.preventDefault();
      setLang(btn.getAttribute('data-lang'), true);
    }, true);
    syncSwitches();
  }

  window.I18N = {
    get lang() { return lang; },
    setLang: setLang,
    auto: auto,
    t: t,
    run: function () { run(document.body); },
    refresh: syncSwitches
  };

  function ready() {
    watch();
    bind();
    var saved = storedLang();
    if (saved === 'ru' || saved === 'en') setLang(saved, false);
    else syncSwitches();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
  }
})();
