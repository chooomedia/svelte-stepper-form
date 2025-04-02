// Russisch (ru)
const ru: Translation = {
	start: {
		title: 'Маркетинговый проверочный тест',
		text: 'Рассчитайте свою <strong>онлайн-видимость</strong>, <strong>увеличьте охват</strong>, <strong>сэкономьте ресурсы</strong> и <strong>увеличьте доход</strong> прямо сейчас.',
		meta: {
			rating: {
				user: 'Пользователь',
				from: 'от',
				quiztime: '-минутный тест'
			}
		}
	},
	common: {
		next: 'Далее',
		back: 'Назад',
		submit: 'Отправить',
		loading: 'Загрузка...',
		error: 'Произошла ошибка',
		success: 'Успешно!'
	},
	forms: {
		labels: {
			company_name: 'Название компании',
			company_url: 'URL веб-сайта',
			salutation: 'Обращение',
			first_name: 'Имя',
			last_name: 'Фамилия',
			email: 'Эл. почта',
			phone: 'Телефон',
			privacy_agreement: 'Политика конфиденциальности',
			marketing_consent: 'Рассылка'
		},
		placeholders: {
			company_url: 'https://www.example.ru',
			email: 'ivan.ivanov@example.ru'
		},
		errors: {
			required: 'Обязательное поле',
			url: 'Пожалуйста, введите корректный URL',
			email: 'Пожалуйста, введите корректный адрес эл. почты'
		},
		descriptions: {
			company_url:
				'Введите URL вашего сайта и нажмите "Анализировать", чтобы получить подробный отчет.'
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'visibility',
				description: 'Где можно найти вашу компанию?'
			},
			company_url: {
				title: 'company_url',
				description: 'Готовы к анализу вашего сайта?'
			},
			advertising_frequency: {
				title: 'advertising_frequency',
				description: 'Как часто вы запускаете рекламу?'
			},
			goals: {
				title: 'goals',
				description: 'Каких целей вы хотите достичь?'
			},
			campaign_management: {
				title: 'campaign_management',
				description: 'Кто должен управлять вашей рекламой?'
			},
			online_reviews: {
				title: 'online_reviews',
				description: 'Как вас оценивают клиенты?'
			},
			previous_campaigns: {
				title: 'previous_campaigns',
				description: 'Ваш опыт онлайн-рекламы'
			},
			business_phase: {
				title: 'business_phase',
				description: 'На каком этапе развития находится ваша компания?'
			},
			implementation_time: {
				title: 'implementation_time',
				description: 'Желаемые сроки реализации'
			},
			company_info: {
				title: 'company_info',
				description: 'Информация о вашей компании'
			},
			waitingscreen: {
				title: 'waitingscreen',
				description: 'Ваш запрос обрабатывается'
			},
			result: {
				title: 'result',
				description: 'Требуются действия: Анализ вашего сайта'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'Поисковые системы',
					description: 'Присутствие в Google и других'
				},
				social_media: {
					label: 'Соцсети',
					description: 'Присутствие в Facebook и других'
				},
				print: {
					label: 'Печать',
					description: 'Традиционная печатная реклама'
				},
				store: {
					label: 'Магазин',
					description: 'Физическое присутствие'
				}
			},
			advertising_frequency: {
				weekly: {
					label: 'Еженедельно',
					description: 'Еженедельные обновления'
				},
				monthly: {
					label: 'Ежемесячно',
					description: 'Ежемесячные кампании'
				},
				yearly: {
					label: 'Ежегодно',
					description: 'Крупные годовые кампании'
				}
			},
			goals: {
				new_clients: {
					label: 'Привлечение клиентов',
					description: 'Привлечение новых клиентов'
				},
				new_employees: {
					label: 'Поиск сотрудников',
					description: 'Найм новых сотрудников'
				},
				more_online: {
					label: 'Онлайн-присутствие',
					description: 'Увеличение онлайн-видимости'
				},
				all: {
					label: 'Все вместе',
					description: 'Комплексное решение'
				}
			}
		},
		metrics: {
			seo: {
				label: 'SEO',
				description: 'Поисковая оптимизация'
			},
			performance: {
				label: 'Производительность',
				description: 'Скорость загрузки и отзывчивость'
			},
			accessibility: {
				label: 'Доступность',
				description: 'Доступность сайта'
			},
			bestPractices: {
				label: 'Стандарты',
				description: 'Соблюдение веб-стандартов'
			},
			content: {
				label: 'Контент',
				description: 'Качество и актуальность контента'
			},
			security: {
				label: 'Безопасность',
				description: 'Защита от угроз'
			},
			currentValue: 'Текущее значение',
			improvedValue: 'После оптимизации',
			average: 'Среднее',
			optimal: 'Оптимальное значение',
			showImprovement: 'Показать улучшения',
			hideImprovement: 'Скрыть улучшения'
		}
	},
	results: {
		title: 'Требуются действия: Анализ вашего сайта',
		subtitle: 'Ваш персональный аналитический отчет',
		score: {
			title: 'Ваш маркетинговый балл',
			low: 'Критично! Ваш бизнес практически не виден.',
			medium: 'Видимость можно улучшить.',
			high: 'Хорошо! Но есть потенциал для роста.',
			excellent: 'Отлично! Ваше цифровое присутствие на высоте.'
		},
		sections: {
			analysis: 'Результаты анализа',
			steps: {
				title: 'Что будет после покупки?',
				purchase: 'Выбор подходящего тарифа и оформление',
				scheduling: 'Персональная консультация с экспертом',
				implementation: 'Профессиональная реализация мер',
				handover: 'Передача оптимизированной системы'
			},
			plans: 'Выберите тариф',
			testimonials: {
				title: 'Истории успеха для вашей мотивации',
				inspiration: 'ИСТОРИИ УСПЕХА',
				case1: {
					titleLow: 'С 0 до 100: Минимум 3 сделки в день благодаря онлайн-присутствию',
					titleHigh: 'Прорыв: +43% запросов благодаря стратегическому маркетингу',
					quote:
						'Мы получили полную консультацию и решили реализовать долгосрочную кампанию в соцсетях вместе с веб-приложением и новым сайтом. Через два года мы довольны конверсиями.',
					author: '- Д-р П. Ульрих, Генеральный директор'
				},
				case2: {
					title: 'Эффективная реализация: Лендинг, SEO и рекламная кампания',
					quote:
						'Лендинг и SEO были быстро реализованы на основе данных для нашей сети Shopware. Кампания превзошла ожидания благодаря точному таргетингу.',
					author: '- М. Келлер, Старший бренд-менеджер'
				}
			},
			improvement: 'Как мы улучшим ваши результаты',
			cta: {
				title: 'Готовы к цифровой трансформации?',
				subtitle: 'Выберите тариф и начните путь к успеху.',
				button: 'Выбрать тариф'
			}
		},
		strengths: {
			title: 'Ваши сильные стороны',
			goodBasics: 'Хорошая цифровая база',
			regularContent: 'Регулярное создание контента',
			understanding: 'Базовое понимание цифрового маркетинга',
			quickImprovement: 'Потенциал быстрых улучшений',
			growthPotential: 'Высокий потенциал роста',
			visibilityGain: 'Возможность быстрого роста видимости',
			socialPresence: 'Присутствие в соцсетях',
			seoUnderstanding: 'Понимание SEO',
			digitalTransformation: 'Готовность к трансформации'
		},
		weaknesses: {
			title: 'Зоны роста',
			poorVisibility: 'Низкая онлайн-видимость',
			noStrategy: 'Отсутствие стратегии',
			poorOptimization: 'Недостаточная оптимизация сайта',
			limitedReach: 'Ограниченный охват',
			underdevelopedContent: 'Слабая контент-стратегия',
			poorConversion: 'Плохая конверсия',
			contentDistribution: 'Проблемы с распределением контента',
			competitorAnalysis: 'Недостаток анализа конкурентов',
			conversionRate: 'Потенциал улучшения конверсии'
		},
		benefits: {
			title: 'Ваши выгоды',
			visibility: 'Улучшенная видимость в поисковиках',
			traffic: 'Больше целевых посетителей',
			conversion: 'Улучшенная конверсия',
			searchEngines: 'Лучшие позиции в поиске',
			socialMedia: 'Улучшенное присутствие в соцсетях',
			newClients: 'Стратегии привлечения клиентов',
			newEmployees: 'Оптимизированная страница карьеры'
		},
		recommendations: {
			title: 'Наши рекомендации',
			website: 'Оптимизация пользовательского опыта',
			content: 'Стратегия контента',
			performance: 'Ускорение загрузки сайта',
			seo: 'SEO оптимизация',
			accessibility: 'Улучшение доступности',
			contentQuality: 'Повышение качества контента',
			basicSeo: 'Базовая SEO оптимизация',
			googleBusiness: 'Создание Google Business профиля',
			advancedSeo: 'Продвинутое SEO',
			localSeo: 'Локальное SEO',
			contentMarketing: 'Контент-маркетинг',
			backlinks: 'Построение ссылок',
			extendedContent: 'Расширенная контент-стратегия',
			competitorAnalysis: 'Анализ конкурентов'
		},
		buttons: {
			restart: 'Начать заново',
			getReport: 'Получить отчет по почте'
		},
		screenshot: {
			alt: 'Скриншот сайта',
			unsupported: 'Формат скриншота не поддерживается'
		}
	},
	meta: {
		title: 'Цифровой маркетинговый анализ',
		description:
			'Проанализируйте свое онлайн-присутствие. Получите персонализированные рекомендации.',
		breadcrumb: 'Маркетинговый анализ'
	},
	pricing: {
		perDay: 'в день',
		features: {
			websiteOptimization: 'Оптимизация сайта',
			basicSeo: 'Базовое SEO',
			monthlyContent: 'Создание контента (1× в месяц)',
			performanceReport: 'Ежемесячный отчет',
			allBasicFeatures: 'Все функции 1-месячного плана',
			socialMedia: 'Управление соцсетями',
			weeklyContent: 'Еженедельный контент',
			keywordOptimization: 'Оптимизация ключевых слов',
			competitorAnalysis: 'Анализ конкурентов',
			allPremiumFeatures: 'Все функции 3-месячного плана',
			marketingStrategy: 'Комплексная стратегия',
			dailyContent: 'Ежедневные обновления',
			sem: 'Контекстная реклама',
			personalManager: 'Персональный менеджер',
			cro: 'Оптимизация конверсии'
		},
		included: {
			longtermBusiness: 'Методы создания устойчивого бизнеса',
			viralContent: 'Концепты вирусного контента',
			expertFrameworks: 'Проверенные стратегии роста',
			targetedStrategies: 'Стратегии на основе данных'
		},
		excluded: {
			getRichQuick: 'Схемы быстрого обогащения',
			noContracts: 'Без долгосрочных обязательств',
			noInvestment: 'Без инвестиционных схем',
			pyramidSchemes: 'МЛМ и пирамиды'
		},
		includedTitle: 'Включено',
		inAllPlans: 'во всех планах',
		excludedTitle: 'Мы не работаем с',
		notWorking: 'следующим',
		choosePlan: 'Выбрать план'
	},
	footer: {
		copyright: 'Все права защищены.'
	}
};

// Arabisch (ar)
const ar: Translation = {
	start: {
		title: 'اختبار فحص التسويق',
		text: 'احسب <strong>رؤيتك على الإنترنت</strong> الآن، <strong>زِد من وصولك</strong>، <strong>وفّر الموارد</strong>، و<strong>زد من إيراداتك</strong>.',
		meta: {
			rating: {
				user: 'مستخدم',
				from: 'من',
				quiztime: '-دقيقة اختبار'
			}
		}
	},
	common: {
		next: 'التالي',
		back: 'عودة',
		submit: 'إرسال',
		loading: 'جاري التحميل...',
		error: 'حدث خطأ',
		success: 'نجاح!'
	},
	forms: {
		labels: {
			company_name: 'اسم الشركة',
			company_url: 'رابط الموقع الإلكتروني',
			salutation: 'التحية',
			first_name: 'الاسم الأول',
			last_name: 'الاسم الأخير',
			email: 'البريد الإلكتروني',
			phone: 'الهاتف',
			privacy_agreement: 'سياسة الخصوصية',
			marketing_consent: 'النشرة الإخبارية'
		},
		placeholders: {
			company_url: 'https://www.example.ae',
			email: 'ahmed.ali@example.ae'
		},
		errors: {
			required: 'هذا الحقل مطلوب',
			url: 'الرجاء إدخال رابط صحيح',
			email: 'الرجاء إدخال بريد إلكتروني صحيح'
		},
		descriptions: {
			company_url: 'أدخل رابط موقعك الإلكتروني وانقر على "تحليل" للحصول على تقرير شامل.'
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'visibility',
				description: 'أين يمكن العثور على شركتك؟'
			},
			company_url: {
				title: 'company_url',
				description: 'هل أنت مستعد لتحليل موقعك؟'
			},
			advertising_frequency: {
				title: 'advertising_frequency',
				description: 'كم مرة تعلن؟'
			},
			goals: {
				title: 'goals',
				description: 'ما الذي تريد تحقيقه لشركتك؟'
			},
			campaign_management: {
				title: 'campaign_management',
				description: 'من يجب أن يدير إعلاناتك؟'
			},
			online_reviews: {
				title: 'online_reviews',
				description: 'كيف يقيمك عملاؤك؟'
			},
			previous_campaigns: {
				title: 'previous_campaigns',
				description: 'خبرتك مع الإعلانات الرقمية'
			},
			business_phase: {
				title: 'business_phase',
				description: 'في أي مرحلة توجد شركتك؟'
			},
			implementation_time: {
				title: 'implementation_time',
				description: 'الإطار الزمني المطلوب للتنفيذ'
			},
			company_info: {
				title: 'company_info',
				description: 'معلومات عن شركتك'
			},
			waitingscreen: {
				title: 'waitingscreen',
				description: 'جاري معالجة طلبك'
			},
			result: {
				title: 'result',
				description: 'تحليل موقعك الإلكتروني'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'محركات البحث',
					description: 'الوجود على Google وغيرها'
				},
				social_media: {
					label: 'وسائل التواصل',
					description: 'الوجود على Facebook وغيرها'
				},
				print: {
					label: 'الطباعة',
					description: 'الإعلانات المطبوعة التقليدية'
				},
				store: {
					label: 'المتجر',
					description: 'الوجود المادي'
				}
			},
			advertising_frequency: {
				weekly: {
					label: 'أسبوعيًا',
					description: 'تحديثات أسبوعية'
				},
				monthly: {
					label: 'شهريًا',
					description: 'حملات شهرية'
				},
				yearly: {
					label: 'سنويًا',
					description: 'حملات سنوية كبرى'
				}
			},
			goals: {
				new_clients: {
					label: 'جذب عملاء جدد',
					description: 'اكتساب عملاء جدد'
				},
				new_employees: {
					label: 'توظيف موظفين',
					description: 'إيجاد موظفين جدد'
				},
				more_online: {
					label: 'زيادة التواجد',
					description: 'زيادة الظهور الرقمي'
				},
				all: {
					label: 'الكل معًا',
					description: 'حل متكامل'
				}
			}
		},
		metrics: {
			seo: {
				label: 'SEO',
				description: 'تحسين محركات البحث'
			},
			performance: {
				label: 'الأداء',
				description: 'سرعة التحميل والاستجابة'
			},
			accessibility: {
				label: 'إمكانية الوصول',
				description: 'سهولة استخدام الموقع'
			},
			bestPractices: {
				label: 'أفضل الممارسات',
				description: 'الالتزام بمعايير الويب'
			},
			content: {
				label: 'المحتوى',
				description: 'جودة وملاءمة المحتوى'
			},
			security: {
				label: 'الأمان',
				description: 'الحماية من التهديدات'
			},
			currentValue: 'القيمة الحالية',
			improvedValue: 'بعد التحسين',
			average: 'المتوسط',
			optimal: 'القيمة المثلى',
			showImprovement: 'عرض التحسينات',
			hideImprovement: 'إخفاء التحسينات'
		}
	},
	results: {
		title: 'تحليل موقعك الإلكتروني',
		subtitle: 'تقرير التحليل الشخصي الخاص بك',
		score: {
			title: 'درجة التسويق الخاصة بك',
			low: 'حرج! شركتك بالكاد مرئية.',
			medium: 'يمكن تحسين ظهورك.',
			high: 'جيد! لا يزال هناك إمكانات.',
			excellent: 'ممتاز! تواجدك الرقمي رائع.'
		},
		sections: {
			analysis: 'نتائج التحليل',
			steps: {
				title: 'الخطوات التالية',
				purchase: 'اختيار الخطة المناسبة',
				scheduling: 'تحديد موعد مع خبير',
				implementation: 'التنفيذ الاحترافي',
				handover: 'تسليم النظام المحسن'
			},
			plans: 'اختر خطتك',
			testimonials: {
				title: 'قصص نجاح ملهمة',
				inspiration: 'إلهام',
				case1: {
					titleLow: 'من 0 إلى 100: 3 صفقات يوميًا بفضل التواجد الرقمي',
					titleHigh: 'قفزة: +43% استفسارات بفضل استراتيجية تسويقية',
					quote:
						'تلقينا استشارة شاملة وقمنا بتنفيذ حملة طويلة المدى على وسائل التواصل مع تطبيق ويب جديد. نحن راضون عن النتائج بعد عامين.',
					author: '- د. بي. أولريش، المدير العام'
				},
				case2: {
					title: 'تنفيذ فعال: صفحة هبوط، SEO وحملة إعلانية',
					quote: 'تم تنفيذ الحملة بسرعة بناءً على البيانات وكانت ناجحة بفضل استهداف دقيق.',
					author: '- م. كيلر، مدير العلامة التجارية'
				}
			},
			improvement: 'كيف سنحسن نتائجك',
			cta: {
				title: 'جاهز للتحول الرقمي؟',
				subtitle: 'اختر خطتك وابدأ رحلة النجاح.',
				button: 'اختر الخطة الآن'
			}
		},
		strengths: {
			title: 'نقاط قوتك',
			goodBasics: 'أساسيات رقمية جيدة',
			regularContent: 'إنشاء محتوى منتظم',
			understanding: 'فهم أساسي للتسويق الرقمي',
			quickImprovement: 'إمكانية تحسين سريع',
			growthPotential: 'إمكانات نمو كبيرة',
			visibilityGain: 'فرصة لزيادة الظهور',
			socialPresence: 'تواجد على وسائل التواصل',
			seoUnderstanding: 'فهم SEO',
			digitalTransformation: 'استعداد للتحول الرقمي'
		},
		weaknesses: {
			title: 'نقاط تحسين',
			poorVisibility: 'ظهور رقمي ضعيف',
			noStrategy: 'غياب استراتيجية تسويقية',
			poorOptimization: 'تحسين موقع ضعيف',
			limitedReach: 'وصول محدود',
			underdevelopedContent: 'استراتيجية محتوى ضعيفة',
			poorConversion: 'تحسين تحويلات ضعيف',
			contentDistribution: 'توزيع محتوى غير كافي',
			competitorAnalysis: 'تحليل منافسين محدود',
			conversionRate: 'إمكانية تحسين معدل التحويل'
		},
		benefits: {
			title: 'فوائدك',
			visibility: 'ظهور أفضل على محركات البحث',
			traffic: 'زيادة الزوار المؤهلين',
			conversion: 'معدلات تحويل أفضل',
			searchEngines: 'تحسين الترتيب في البحث',
			socialMedia: 'تحسين التواجد على وسائل التواصل',
			newClients: 'استراتيجيات جذب عملاء',
			newEmployees: 'صفحة وظائف محسنة'
		},
		recommendations: {
			title: 'توصياتنا',
			website: 'تحسين تجربة المستخدم',
			content: 'استراتيجية محتوى',
			performance: 'تحسين سرعة الموقع',
			seo: 'تحسين SEO',
			accessibility: 'تحسين إمكانية الوصول',
			contentQuality: 'تحسين جودة المحتوى',
			basicSeo: 'تحسين SEO أساسي',
			googleBusiness: 'إنشاء ملف Google Business',
			advancedSeo: 'تحسين SEO متقدم',
			localSeo: 'تحسين SEO محلي',
			contentMarketing: 'استراتيجية تسويق بالمحتوى',
			backlinks: 'بناء الروابط الخلفية',
			extendedContent: 'استراتيجية محتوى موسعة',
			competitorAnalysis: 'تحليل المنافسين'
		},
		buttons: {
			restart: 'إعادة الاختبار',
			getReport: 'الحصول على التقرير بالبريد'
		},
		screenshot: {
			alt: 'لقطة شاشة الموقع',
			unsupported: 'تنسيق غير مدعوم'
		}
	},
	meta: {
		title: 'تقييم التسويق الرقمي',
		description: 'حلل تواجدك الرقمي مع تقييمنا المجاني. احصل على توصيات مخصصة للنجاح.',
		breadcrumb: 'التقييم التسويقي'
	},
	pricing: {
		perDay: 'يوميًا',
		features: {
			websiteOptimization: 'تحسين الموقع',
			basicSeo: 'تحسين SEO أساسي',
			monthlyContent: 'إنشاء محتوى (1× شهريًا)',
			performanceReport: 'تقرير أداء شهري',
			allBasicFeatures: 'كل ميزات خطة الشهر',
			socialMedia: 'إدارة وسائل التواصل',
			weeklyContent: 'إنشاء محتوى أسبوعي',
			keywordOptimization: 'تحسين الكلمات المفتاحية',
			competitorAnalysis: 'تحليل المنافسين',
			allPremiumFeatures: 'كل ميزات خطة 3 أشهر',
			marketingStrategy: 'استراتيجية تسويقية شاملة',
			dailyContent: 'تحديثات يومية',
			sem: 'تسويق محركات البحث',
			personalManager: 'مدير تسويق شخصي',
			cro: 'تحسين معدل التحويل'
		},
		included: {
			longtermBusiness: 'منهجية لبناء أعمال رقمية مستدامة',
			viralContent: 'مفاهيم محتوى فيروسي',
			expertFrameworks: 'إستراتيجيات خبراء مثبتة',
			targetedStrategies: 'استراتيجيات قائمة على البيانات'
		},
		excluded: {
			getRichQuick: 'خطط الثراء السريع',
			noContracts: 'لا التزامات طويلة المدى',
			noInvestment: 'لا استثمارات وهمية',
			pyramidSchemes: 'مخططات هرمية'
		},
		includedTitle: 'المشمول',
		inAllPlans: 'في جميع الخطط',
		excludedTitle: 'نحن لا نتعامل مع',
		notWorking: 'التالي',
		choosePlan: 'اختر الخطة'
	},
	footer: {
		copyright: 'جميع الحقوق محفوظة.'
	}
};

// Ungarisch (hu)
const hu: Translation = {
	start: {
		title: 'Marketing Ellenőrző Kvíz',
		text: 'Számolja ki most <strong>online láthatóságát</strong>, <strong>növelje elérését</strong>, <strong>spóroljon erőforrásokkal</strong>, és <strong>növelje bevételeit</strong>.',
		meta: {
			rating: {
				user: 'Felhasználó',
				from: 'tól',
				quiztime: '-perces kvíz'
			}
		}
	},
	common: {
		next: 'Tovább',
		back: 'Vissza',
		submit: 'Beküldés',
		loading: 'Betöltés...',
		error: 'Hiba történt',
		success: 'Sikeres!'
	},
	forms: {
		labels: {
			company_name: 'Cégnév',
			company_url: 'Weboldal URL',
			salutation: 'Megszólítás',
			first_name: 'Keresztnév',
			last_name: 'Vezetéknév',
			email: 'E-mail',
			phone: 'Telefon',
			privacy_agreement: 'Adatvédelmi nyilatkozat',
			marketing_consent: 'Hírlevél'
		},
		placeholders: {
			company_url: 'https://www.sajatweboldal.hu',
			email: 'max.minta@pelda.hu'
		},
		errors: {
			required: 'Ez a mező kötelező',
			url: 'Kérjük, adjon meg egy érvényes URL-t',
			email: 'Kérjük, adjon meg egy érvényes e-mail címet'
		},
		descriptions: {
			company_url:
				"Adja meg a weboldalának URL-jét, és kattintson az 'Elemzés' gombra, hogy részletes jelentést kapjon."
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'láthatóság',
				description: 'Hol található a cége?'
			},
			company_url: {
				title: 'weboldal_url',
				description: 'Készen áll a weboldal elemzésére?'
			},
			advertising_frequency: {
				title: 'hirdetés_gyakoriság',
				description: 'Milyen gyakran hirdet?'
			},
			goals: {
				title: 'célok',
				description: 'Mit szeretne elérni üzleti szempontból?'
			},
			campaign_management: {
				title: 'kampány_menedzsment',
				description: 'Ki kezelje a hirdetéseit?'
			},
			online_reviews: {
				title: 'online_értékelések',
				description: 'Hogyan értékelik Önt a vásárlói?'
			},
			previous_campaigns: {
				title: 'korábbi_kampányok',
				description: 'Tapasztalata az online hirdetésekkel kapcsolatban'
			},
			business_phase: {
				title: 'üzleti_fázis',
				description: 'Melyik fázisban van a cége?'
			},
			implementation_time: {
				title: 'megvalósítás_ideje',
				description: 'Mikor szeretné, hogy elkezdjük a megvalósítást?'
			},
			company_info: {
				title: 'céges_információ',
				description: 'Információk a cégről'
			},
			waitingscreen: {
				title: 'várakozási_képernyő',
				description: 'A kérelme feldolgozása folyamatban'
			},
			result: {
				title: 'eredmény',
				description: 'Teendő: Weboldal elemzése'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'Keresőmotorok',
					description: 'Jelenlét a Google és más keresőmotorokban'
				},
				social_media: {
					label: 'Közösségi média',
					description: 'Jelenlét a Facebook és más közösségi médiákban'
				},
				print: {
					label: 'Nyomtatott hirdetés',
					description: 'Hagyományos nyomtatott reklámok'
				},
				store: {
					label: 'Bolt',
					description: 'Fizikai jelenlét'
				}
			},
			advertising_frequency: {
				weekly: {
					label: 'Hetente',
					description: 'Heti frissítések'
				},
				monthly: {
					label: 'Havonta',
					description: 'Havi kampányok'
				},
				yearly: {
					label: 'Évente',
					description: 'Éves nagykampányok'
				}
			},
			goals: {
				new_clients: {
					label: 'Új ügyfelek szerzése',
					description: 'Új ügyfelek vonzása'
				},
				new_employees: {
					label: 'Új munkatársak felvétele',
					description: 'Új munkavállalók keresése'
				},
				more_online: {
					label: 'Nagyobb online jelenlét',
					description: 'Több online láthatóság'
				},
				all: {
					label: 'Minden egyben',
					description: 'Teljes körű megoldás'
				}
			}
		},
		metrics: {
			seo: {
				label: 'SEO',
				description: 'Keresőoptimalizálás'
			},
			performance: {
				label: 'Teljesítmény',
				description: 'Oldal betöltési sebesség és reakcióidő'
			},
			accessibility: {
				label: 'Hozzáférhetőség',
				description: 'Weboldal akadálymentessége'
			},
			bestPractices: {
				label: 'Legjobb gyakorlatok',
				description: 'Webes szabványok betartása'
			},
			content: {
				label: 'Tartalom',
				description: 'A tartalom minősége és relevanciája'
			},
			security: {
				label: 'Biztonság',
				description: 'Védelem a fenyegetésekkel szemben'
			},
			currentValue: 'Aktuális érték',
			improvedValue: 'Optimalizált érték',
			average: 'Átlag',
			optimal: 'Optimális érték',
			showImprovement: 'Fejlesztések mutatása',
			hideImprovement: 'Fejlesztések elrejtése'
		}
	},
	results: {
		title: 'Teendő: Weboldal elemzés',
		subtitle: 'Itt találja az egyedi elemzési jelentést',
		score: {
			title: 'Marketing pontszámod',
			low: 'Kritikus! A céged alig van jelen.',
			medium: 'A láthatóságod javítható.',
			high: 'Jó! De van még potenciál.',
			excellent: 'Kiváló! A digitális jelenléted kiváló.'
		},
		sections: {
			analysis: 'Elemzési eredmények',
			steps: {
				title: 'Mi történik a vásárlás után?',
				purchase: 'A megfelelő csomag kiválasztása és egyszerű vásárlás',
				scheduling: 'Személyes találkozó időpontjának egyeztetése digitális szakértőnkkel',
				implementation: 'Az összes megállapodott intézkedés professzionális végrehajtása',
				handover: 'A javított digitális rendszer átadása és oktatás'
			},
			plans: 'Válaszd ki a csomagodat',
			testimonials: {
				title: 'Sikertörténetek, amelyek inspirálnak',
				inspiration: 'INSPIRÁCIÓK',
				case1: {
					titleLow: 'Nulláról 100-ra: napi legalább 3 lead a maximalizált online jelenlét révén',
					titleHigh:
						'Sikertörténet: 43%-kal több érdeklődő a jól átgondolt marketing stratégiának köszönhetően',
					quote:
						'Teljes körű tanácsadásban részesültünk, és úgy döntöttünk, hogy a webapp mellett új weboldalt készíttetünk, és a szolgáltatótól célzott, hosszú távú kampányt kérünk a közösségi médiában. Két év után nagyon elégedettek vagyunk a konverziókkal.',
					author: '- Dr. P. Ullrich, Ügyvezető'
				},
				case2: {
					title: 'Hatékony végrehajtás: Landing page, SEO és teljes csatornás hirdetési kampány',
					quote:
						'A landing page és SEO gyorsan elkészült az elemzett adatok alapján, és a kampány sikeres volt a célzott közönségválasztás és a konverziók figyelése révén. Mindenképpen ajánlott.',
					author: '- M. Keller, Senior Brand Manager'
				}
			},
			improvement: 'Így javítjuk az eredményeidet',
			cta: {
				title: 'Készen állsz a digitális jelenléted forradalmasítására?',
				subtitle: 'Válaszd ki a csomagod, és kezd el az utadat a nagyobb láthatóság és siker felé.',
				button: 'Most válaszd a csomagot'
			}
		},
		strengths: {
			title: 'Erősségeid',
			goodBasics: 'Jó alapok a digitális jelenlétben',
			regularContent: 'Rendszeres tartalomkészítés',
			understandingSEO: 'SEO ismeretek alkalmazása',
			socialMediaPresence: 'Szociális média hatékony használata',
			strongTrust: 'Erős vevői bizalom és referencia'
		}
	}
};
