import type { Translation } from '../types';

const ru: Translation = {
	start: {
		title: 'Маркетинговая проверка',
		text: 'Рассчитайте <strong>онлайн-видимость</strong>, увеличьте <strong>охват аудитории</strong>, сэкономьте <strong>ресурсы</strong> и повысьте <strong>продажи</strong>.',
		meta: {
			rating: {
				user: 'Пользователь',
				from: 'из',
				quiztime: 'минутный тест'
			}
		}
	},
	common: {
		next: 'Далее',
		skip: 'Пропустить',
		back: 'Назад',
		submit: 'Отправить',
		loading: 'Загрузка...',
		error: 'Произошла ошибка',
		success: 'Успешно!',
		analyze: 'Анализировать',
		formErrorHeading: 'Пожалуйста, исправьте следующие ошибки:',
		support: 'Поддержка',
		backToHome: 'Вернуться на главную',
		tryAgainLater: 'Пожалуйста, попробуйте позже или свяжитесь с нашей поддержкой.',
		contactSupport: 'Связаться с поддержкой'
	},
	forms: {
		labels: {
			company_name: 'Название компании',
			company_url: 'URL сайта',
			salutation: 'Обращение',
			first_name: 'Имя',
			last_name: 'Фамилия',
			email: 'E-mail',
			phone: 'Телефон',
			privacy_agreement: 'Соглашение о конфиденциальности',
			marketing_consent: 'Рассылка'
		},
		salutation: {
			select: 'Выберите обращение',
			male: 'Г-н',
			female: 'Г-жа',
			diverse: 'Др.'
		},
		imageOption: {
			continueIn: 'продолжить через',
			second: 'секунда',
			seconds: 'секунд',
			selectUpTo: 'Можно выбрать до {max} вариантов',
			selectAllApplicable: 'Выберите все подходящие варианты'
		},
		placeholders: {
			select: 'Выберите',
			salutation: 'Выберите обращение',
			first_name: 'Введите ваше имя',
			last_name: 'Введите вашу фамилию',
			email: 'Введите ваш e-mail',
			phone: 'Телефон (необязательно)',
			privacy_agreement: 'Принять условия конфиденциальности',
			privacy_policy: 'Политика конфиденциальности',
			newsletter_terms: 'Условия рассылки',
			company_url: 'https://www.вашсайт.ru'
		},
		errors: {
			required: 'Обязательное поле',
			url: 'Введите корректный URL',
			email: 'Введите корректный e-mail'
		},
		descriptions: {
			company_url: 'Введите URL сайта для получения детального отчета.',
			analyze: 'Нажмите "Анализировать" для проверки сайта',
			privacy_agreement: 'Я согласен с',
			marketing_consent: 'Хочу получать рассылку и принимаю'
		},
		checkpoints: {
			performance: 'Проверка производительности',
			seo: 'SEO-анализ',
			accessibility: 'Тест доступности',
			security: 'Проверка безопасности'
		},
		seotips: {
			headline: 'Анализ вашего сайта',
			title: 'SEO-совет во время анализа:',
			default: [
				'Используйте точные заголовки страниц (Title Tag)',
				'Уникальные мета-описания для каждой страницы',
				'Один H1-заголовок на страницу',
				'Оптимизируйте изображения с Alt-текстами',
				'Создайте четкую структуру сайта',
				'Адаптируйте сайт для мобильных устройств',
				'Улучшите скорость загрузки',
				'Используйте внутренние ссылки',
				'Создавайте качественный контент',
				'Используйте Schema.org разметку',
				'Создайте XML-карту сайта',
				'Используйте HTTPS-шифрование',
				'Регулярно проверяйте битые ссылки',
				'Оптимизируйте Open Graph теги'
			]
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'Видимость',
				description: 'Где можно найти вашу компанию?'
			},
			company_url: {
				title: 'URL компании',
				description: 'Готовы к анализу сайта?'
			},
			advertising_frequency: {
				title: 'Частота рекламы',
				description: 'Как часто вы рекламируетесь?'
			},
			goals: {
				title: 'Цели',
				description: 'Чего вы хотите достичь?'
			},
			campaign_management: {
				title: 'Управление рекламой',
				description: 'Кто будет управлять рекламой?'
			},
			online_reviews: {
				title: 'Отзывы',
				description: 'Как клиенты оценивают вас?'
			},
			previous_campaigns: {
				title: 'Предыдущий опыт',
				description: 'Опыт онлайн-рекламы'
			},
			business_phase: {
				title: 'Стадия бизнеса',
				description: 'На какой стадии развития ваш бизнес?'
			},
			implementation_time: {
				title: 'Срок реализации',
				description: 'Желаемые сроки внедрения'
			},
			company_info: {
				title: 'Информация о компании',
				description: 'Данные вашей компании'
			},
			waitingscreen: {
				title: 'Ожидание',
				description: 'Идет обработка запроса'
			},
			result: {
				title: 'Результат',
				description: 'Анализ вашего сайта'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'Поисковые системы',
					description: 'Присутствие в Google'
				},
				social_media: {
					label: 'Соцсети',
					description: 'Присутствие в Facebook'
				},
				print: {
					label: 'Печать',
					description: 'Печатная реклама'
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
					description: 'Годовые кампании'
				}
			},
			goals: {
				new_clients: {
					label: 'Новые клиенты',
					description: 'Привлечение клиентов'
				},
				new_employees: {
					label: 'Сотрудники',
					description: 'Поиск сотрудников'
				},
				more_online: {
					label: 'Онлайн-присутствие',
					description: 'Увеличение видимости'
				},
				all: {
					label: 'Все вместе',
					description: 'Комплексное решение'
				}
			},
			campaign_management: {
				self: {
					label: 'Самостоятельно',
					description: 'Самоуправление'
				},
				digitalpusher: {
					label: 'Digitalpusher',
					description: 'Профессиональное управление'
				},
				employee: {
					label: 'Сотрудник',
					description: 'Внутреннее управление'
				}
			},
			online_reviews: {
				positive: {
					label: 'Положительные',
					description: 'Хорошие отзывы'
				},
				negative: {
					label: 'Отрицательные',
					description: 'Потребуются улучшения'
				},
				none: {
					label: 'Нет отзывов',
					description: 'Отсутствуют отзывы'
				}
			},
			previous_campaigns: {
				yes: {
					label: 'Да',
					description: 'Есть опыт'
				},
				no: {
					label: 'Нет',
					description: 'Нет опыта'
				},
				would_like: {
					label: 'Хотел бы',
					description: 'Есть интерес'
				}
			},
			business_phase: {
				planning: {
					label: 'Планирование',
					description: 'Стадия планирования'
				},
				less_than_6_months: {
					label: 'Менее 6 месяцев',
					description: 'Новый бизнес'
				},
				more_than_6_months: {
					label: 'Более 6 месяцев',
					description: 'Устоявшийся бизнес'
				},
				family_business: {
					label: 'Семейный бизнес',
					description: 'Семейное предприятие'
				}
			},
			implementation_time: {
				immediate: {
					label: 'Немедленно',
					description: 'Быстрая реализация'
				},
				medium: {
					label: '2-6 месяцев',
					description: 'Среднесрочный план'
				},
				long_term: {
					label: 'Более 6 месяцев',
					description: 'Долгосрочная стратегия'
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
				description: 'Скорость загрузки'
			},
			accessibility: {
				label: 'Доступность',
				description: 'Удобство использования'
			},
			bestPractices: {
				label: 'Стандарты',
				description: 'Соблюдение стандартов'
			},
			content: {
				label: 'Контент',
				description: 'Качество контента'
			},
			security: {
				label: 'Безопасность',
				description: 'Уровень защиты'
			},
			currentValue: 'Текущее',
			improvedValue: 'После оптимизации',
			average: 'Среднее',
			optimal: 'Оптимальное'
		},
		validation: {
			required: 'Обязательное поле',
			visibility: {
				required: 'Выберите варианты присутствия',
				minSelection: 'Выберите минимум 1 вариант'
			},
			advertising_frequency: {
				required: 'Выберите частоту рекламы',
				minSelection: 'Выберите минимум 1 вариант'
			},
			goals: {
				required: 'Выберите цели',
				minSelection: 'Выберите минимум 1 цель'
			},
			campaign_management: {
				required: 'Выберите вариант управления',
				minSelection: 'Выберите минимум 1 вариант'
			},
			online_reviews: {
				required: 'Укажите оценку отзывов',
				minSelection: 'Выберите минимум 1 вариант'
			},
			previous_campaigns: {
				required: 'Укажите предыдущий опыт',
				minSelection: 'Выберите минимум 1 вариант'
			},
			business_phase: {
				required: 'Выберите стадию бизнеса',
				minSelection: 'Выберите минимум 1 вариант'
			},
			implementation_time: {
				required: 'Выберите срок реализации',
				minSelection: 'Выберите минимум 1 вариант'
			},
			company_name: {
				required: 'Введите название компании',
				minLength: 'Минимум 2 символа'
			},
			company_url: {
				required: 'Введите URL сайта',
				url: 'Некорректный URL'
			},
			first_name: {
				required: 'Введите имя',
				minLength: 'Минимум 2 символа'
			},
			last_name: {
				required: 'Введите фамилию',
				minLength: 'Минимум 2 символа'
			},
			email: {
				required: 'Введите e-mail',
				email: 'Некорректный e-mail'
			},
			phone: {
				required: 'Введите телефон',
				pattern: 'Некорректный формат'
			},
			privacy_agreement: {
				required: 'Примите условия'
			}
		}
	},
	results: {
		title: 'Анализ вашего сайта',
		subtitle: 'Персонализированный отчет',
		score: {
			title: 'Маркетинговый индекс',
			low: {
				title: 'Критично! Низкая видимость.',
				suggestion: 'Повысьте видимость компании'
			},
			medium: {
				title: 'Средняя видимость',
				suggestion: 'Оптимизируйте маркетинг'
			},
			high: {
				title: 'Хорошо! Есть потенциал',
				suggestion: 'Дополнительная оптимизация'
			},
			excellent: {
				title: 'Отлично! Высокая видимость',
				suggestion: 'Продолжайте улучшения!'
			}
		},
		sections: {
			analysis: 'Результаты анализа',
			steps: {
				title: 'Следующие шаги',
				purchase: {
					title: 'Оплата',
					description: 'Выбор и оплата тарифа',
					icon: 'cart'
				},
				scheduling: {
					title: 'Консультация',
					description: 'Согласование сроков',
					icon: 'calendar'
				},
				implementation: {
					title: 'Реализация',
					description: 'Внедрение улучшений',
					icon: 'code'
				},
				handover: {
					title: 'Завершение',
					description: 'Передача результатов',
					icon: 'check'
				}
			},
			plans: 'Выберите тариф',
			testimonials: {
				title: 'Истории успеха',
				inspiration: 'Вдохновение',
				case1: {
					titleLow: 'С 0 до 100% видимости',
					titleHigh: '+43% заявок с новой стратегией',
					quote: 'Профессиональная реализация кампании в соцсетях дала отличные результаты.',
					author: '- Др. П. Ульрих, CEO'
				},
				case2: {
					title: 'Эффективный SEO и таргетинг',
					quote: 'Быстрая оптимизация и отличные показатели конверсии.',
					author: '- М. Келлер, Маркетолог'
				}
			},
			improvement: {
				title: 'Наши методы улучшений',
				steps: [
					{
						title: 'Оптимизация сайта',
						description: 'Ускорение загрузки и адаптация',
						icon: 'deviceDesktop',
						underScore: 40
					},
					{
						title: 'SEO и ключевые слова',
						description: 'Отраслевая поисковая оптимизация',
						icon: 'search',
						underScore: 40
					},
					{
						title: 'Базовое присутствие',
						description: 'Фундаментальные улучшения',
						icon: 'home',
						underScore: 40
					},
					{
						title: 'Локальное SEO',
						description: 'Оптимизация для региона',
						icon: 'mapPin',
						underScore: 40
					},
					{
						title: 'Стратегия контента',
						description: 'Привлечение целевой аудитории',
						icon: 'fileText',
						underScore: 60
					},
					{
						title: 'Интеграция с соцсетями',
						description: 'Расширение охвата',
						icon: 'share2',
						underScore: 60
					},
					{
						title: 'Конверсия',
						description: 'Увеличение коэффициента',
						icon: 'trendingUp',
						underScore: 80
					},
					{
						title: 'Контент-маркетинг',
						description: 'Демонстрация экспертизы',
						icon: 'edit',
						underScore: 80
					}
				]
			},
			cta: {
				title: 'Готовы к изменениям?',
				subtitle: 'Выберите тариф и начните рост!',
				button: 'Выбрать тариф'
			}
		},
		strengths: {
			title: 'Сильные стороны',
			goodBasics: 'Хорошая база',
			regularContent: 'Регулярный контент',
			understanding: 'Базовые знания',
			quickImprovement: 'Быстрые улучшения',
			growthPotential: 'Потенциал роста',
			visibilityGain: 'Быстрое увеличение видимости',
			socialPresence: 'Присутствие в соцсетях',
			seoUnderstanding: 'Понимание SEO',
			digitalTransformation: 'Готовность к изменениям'
		},
		weaknesses: {
			title: 'Слабые стороны',
			poorVisibility: 'Низкая видимость',
			noStrategy: 'Отсутствие стратегии',
			poorOptimization: 'Слабая оптимизация',
			limitedReach: 'Ограниченный охват',
			underdevelopedContent: 'Слабый контент',
			poorConversion: 'Низкая конверсия',
			contentDistribution: 'Плохое распространение',
			competitorAnalysis: 'Нет анализа конкурентов',
			conversionRate: 'Низкий коэффициент'
		},
		benefits: {
			title: 'Преимущества',
			visibility: 'Рост в поиске',
			traffic: 'Больше посетителей',
			conversion: 'Улучшение конверсии',
			searchEngines: 'Лучшие позиции',
			socialMedia: 'Усиление соцсетей',
			newClients: 'Новые клиенты',
			newEmployees: 'Упрощение найма'
		},
		recommendations: {
			title: 'Рекомендации',
			website: 'Оптимизация UX',
			content: 'Стратегия контента',
			performance: 'Скорость загрузки',
			seo: 'Мета-теги и структура',
			accessibility: 'Доступность сайта',
			contentQuality: 'Качество контента',
			basicSeo: 'Базовое SEO',
			googleBusiness: 'Google Мой бизнес',
			advancedSeo: 'Продвинутое SEO',
			localSeo: 'Локальное SEO',
			contentMarketing: 'Контент-маркетинг',
			backlinks: 'Ссылочная масса',
			extendedContent: 'Расширенный контент',
			competitorAnalysis: 'Анализ конкурентов'
		},
		expertProfile: {
			name: 'Кристофер Матт',
			role: 'Экерт по маркетингу',
			bio: '10+ лет опыта в цифровом маркетинге. Сертифицированный Google партнер.',
			imageUrl:
				'https://www.chooomedia.de/wp-content/uploads/2023/03/chooomedia-christopher-matt-ceo-freelancer-webdesigner-ui-designer-information-designer-500x500px__1_-removebg-preview.png',
			imageAlt: 'Кристофер Матт - Эксперт',
			badges: {
				googlePartner: {
					label: 'Google Партнер',
					value: '',
					icon: 'google'
				},
				customers: {
					label: 'Клиенты',
					value: '220+',
					icon: 'users'
				},
				experience: {
					label: 'Опыт',
					value: '10+ лет',
					icon: 'experience'
				}
			}
		},
		buttons: {
			restart: 'Начать заново',
			getReport: 'Получить отчет',
			emailError: 'Пожалуйста, укажи адрес электронной почты в форме, чтобы получить результаты.'
		},
		screenshot: {
			alt: 'Скриншот сайта',
			unsupported: 'Неподдерживаемый формат'
		}
	},
	meta: {
		title: 'Маркетинговый аудит',
		description: 'Бесплатный анализ и персонализированные рекомендации',
		breadcrumb: 'Аудит'
	},
	pricing: {
		perDay: 'В день',
		features: {
			websiteOptimization: 'Оптимизация сайта',
			basicSeo: 'Базовое SEO',
			monthlyContent: 'Контент ежемесячно',
			performanceReport: 'Отчетность',
			allBasicFeatures: 'Все базовые функции',
			socialMedia: 'Управление соцсетями',
			weeklyContent: 'Еженедельный контент',
			keywordOptimization: 'Оптимизация ключевых слов',
			competitorAnalysis: 'Анализ конкурентов',
			allPremiumFeatures: 'Все премиум функции',
			marketingStrategy: 'Стратегия маркетинга',
			dailyContent: 'Ежедневный контент',
			sem: 'Контекстная реклама',
			personalManager: 'Персональный менеджер',
			cro: 'Оптимизация конверсии'
		},
		included: {
			longtermBusiness: 'Долгосрочная стратегия',
			viralContent: 'Вирусный контент',
			expertFrameworks: 'Экспертные методики',
			targetedStrategies: 'Адаптированные решения'
		},
		excluded: {
			getRichQuick: 'Схемы быстрого обогащения',
			noContracts: 'Без долгосрочных контрактов',
			noInvestment: 'Без скрытых инвестиций',
			pyramidSchemes: 'Без сетевого маркетинга'
		},
		includedTitle: 'Включено',
		inAllPlans: 'во всех тарифах',
		excludedTitle: 'Исключено',
		notWorking: 'не используем',
		choosePlan: 'Выбрать тариф',
		header: {
			title: 'Выберите подходящий тариф',
			subtitle: 'Рекомендуем на основе вашего балла {score}'
		},
		countdown: {
			title: 'Спецпредложение!',
			subtitle: 'До конца акции:'
		},
		bonusBox: {
			tag: 'БОНУС',
			title: 'Бесплатный SEO-контент',
			description: 'При заказе сейчас - SEO-оптимизированная статья в подарок!',
			benefits: ['Персонализация', 'SEO-оптимизация', 'Мгновенный результат'],
			value: 'Стоимость: 99€',
			limited: 'Ограниченное время'
		},
		paymentOptions: {
			title: 'Способы оплаты:',
			monthly: 'Ежемесячно',
			oneTime: 'Единоразово (-8%)',
			longTime: 'Энтерпрайз (-20%)', // Изменено с 'Longtime'
			hotLabel: 'ХИТ'
		},
		planLabels: {
			oneTime: 'РАЗОВЫЙ',
			oneMonth: '1 МЕСЯЦ',
			threeMonth: '3 МЕСЯЦА',
			sixMonth: '6 МЕСЯЦЕВ',
			popular: '★ ПОПУЛЯРНЫЙ',
			longTimeSuffix: {
				oneMonth: 'ЭНТЕРПРАЙЗ БАЗОВЫЙ',
				threeMonth: 'ЭНТЕРПРАЙЗ ПРЕМИУМ',
				business: 'ЭНТЕРПРАЙЗ БИЗНЕС'
			}
		},
		additionalBenefits: {
			oneTime: ['Скидка 8%', 'Без подписки'],
			longTime: ['Доступ 1 год', 'Скидка 20%', 'Все обновления'], // Изменено с 'Доступ 5 лет'
			savings: 'Экономия',
			savingsOption: 'с этим вариантом!'
		},
		ctaButton: {
			monthly: 'ОФОРМИТЬ',
			oneTime: 'КУПИТЬ',
			longTime: 'ЭНТЕРПРАЙЗ', // Изменено с 'LONGTIME'
			selectPlan: 'Выбрать'
		},
		savings: 'Сэкономлено',
		trustBadges: ['Безопасная оплата', '30 дней гарантии'],
		consultationText: 'Или хотите сыграть наверняка?',
		consultationLink: 'Забронировать бесплатную консультацию',
		discountBanner: {
			title: 'Энтерпрайз доступ', // Изменено с 'Longtime доступ'
			discount: ' со скидкой 20%!',
			description: '1 год доступа за одну оплату! <span class="font-bold">Только сейчас!</span>', // Изменено с '5 лет'
			buttonText: 'Получить!'
		},
		terms: {
			monthly: {
				main: 'Автопродление тарифа {selectedPlan} за {totalPrice.toFixed(2)}€/мес. Отмена: abo@digitalpusher.de.',
				reminder: 'Уведомление за 5 дней до продления.'
			},
			oneTime: 'Однократный платеж {totalPrice.toFixed(2)}€. Доступ 1 год.',
			acceptance: 'Нажимая "Купить", вы принимаете условия.'
		}
	},
	footer: {
		copyright: 'Все права защищены.'
	},
	modal: {
		common: {
			close: 'Закрыть',
			cancel: 'Отмена',
			confirm: 'Подтвердить',
			back: 'Назад'
		},
		payment: {
			title: 'Оплата',
			subtitle: 'Выберите способ',
			testButton: 'Тест оплаты',
			testDescription: 'Тестовая транзакция',
			summary: {
				title: 'Итого',
				monthly: 'Ежемесячно',
				oneTime: 'Единоразово',
				longtime: 'Энтерпрайз доступ',
				discount: 'Скидка',
				donation: 'С донатом',
				tax: 'С НДС'
			},
			securityBadges: {
				secure: 'SSL защита',
				protection: 'Защита покупателей',
				instant: 'Мгновенный доступ'
			},
			donationBox: {
				title: '+3% на экологию',
				description: '93% средств идет на проекты'
			},
			errors: {
				general: 'Ошибка. Повторите позже.',
				validation: 'Проверьте данные',
				server: 'Ошибка PayPal',
				timeout: 'Проверьте соединение'
			}
		},
		success: {
			title: 'Оплачено!',
			subtitle: 'Спасибо за покупку!',
			modalInfo: 'Не закрывайте окно до завершения.',
			paymentDetails: {
				plan: 'Услуга',
				id: 'ID транзакции',
				date: 'Дата',
				status: 'Статус',
				paid: 'Оплачено'
			},
			shareContent: {
				title: 'Мой успех с Digital Pusher',
				text: 'Заказал маркетинговую стратегию в Digital Pusher! 🚀 #маркетинг'
			},
			donation: {
				title: 'Спасибо!',
				description: 'Ваш донат {amount}€ поможет природе.',
				impact: {
					direct: 'Прямая помощь',
					projects: 'Проекты',
					transparency: 'Отчетность'
				}
			},
			nextSteps: {
				title: 'Далее:',
				steps: ['Проверьте почту', 'Запланируйте консультацию', 'Пригласите команду']
			},
			upgradeOffer: {
				exclusive: 'ЭКСКЛЮЗИВ',
				title: 'Апгрейд тарифа -30%',
				subtitle: 'Новые клиенты: премиум функции!',
				countdown: 'Осталось:',
				button: 'Апгрейд'
			},
			support: {
				confirmation: 'Письмо отправлено.',
				contact: 'Поддержка: support@digitalpusher.ru'
			},
			buttons: {
				dashboard: 'Кабинет',
				share: 'Поделиться'
			}
		},
		error: {
			title: 'Ошибка оплаты',
			defaultMessage: 'Неизвестная ошибка',
			details: 'Технические детали',
			support: 'Свяжитесь с поддержкой.',
			retry: 'Повторить'
		},
		confirm: {
			cancelPurchase: 'Отменить покупку?',
			confirmButton: 'Да, отменить',
			cancelButton: 'Продолжить'
		},
		booking: {
			title: 'Забронировать бесплатную консультацию',
			subtitle:
				'Выберите время для 30-минутной бесплатной консультации. Мы обсудим ваши индивидуальные потребности и покажем, как оптимизировать вашу онлайн-видимость.',
			selectDate: 'Выберите дату:',
			selectTime: 'Выберите время:',
			contactInfo: 'Ваши контактные данные:',
			confirm: 'Забронировать бесплатную встречу',
			booking: 'Бронирование встречи...',
			cancel: 'Отмена',
			success: {
				title: 'Встреча успешно забронирована!',
				message: 'Ваша бесплатная консультация забронирована на {date} в {time}.',
				details:
					'Вскоре вы получите подтверждение по электронной почте со всеми деталями и ссылкой на встречу.'
			}
		}
	},
	waitingScreen: {
		title: 'Идет анализ - пожалуйста подождите.',
		redirect: 'Результат через {remainingTime}'
	},
	email: {
		subject: 'Результаты анализа вашего сайта для {company_url}',
		greeting: 'Здравствуйте, {firstName} {lastName}',
		results: {
			title: 'Результаты анализа сайта',
			description:
				'Вот <strong>результаты анализа вашего сайта</strong> для <strong>{company_url}</strong> от {currentDate}.',
			visibilityScore: 'Ваш показатель видимости: {score}/100',
			scoreDescription: 'На основе вашего текущего онлайн-присутствия и маркетинговой стратегии'
		},
		situation: {
			title: '📊 Ваша текущая ситуация',
			visibility: 'Видимость:',
			advertisingFrequency: 'Частота рекламы:',
			goals: 'Цели:',
			campaignManagement: 'Управление кампаниями:',
			businessPhase: 'Стадия компании:',
			implementationTime: 'Срок реализации:'
		},
		cta: {
			title: '🎯 Эксклюзивное предложение для вас',
			description:
				'Получите <span class="secrets-highlight">5 бесплатных секретных советов</span> для повышения онлайн-видимости durante личной консультации.',
			highlight: '5 бесплатных секретных советов',
			urgency: '⚡ Доступно ограниченное время!',
			button: '🎁 Получить 5 секретных советов бесплатно'
		},
		footer: {
			copyright: '© 2025 Digitalpusher - Все права защищены',
			unsubscribe: 'Отписаться от рассылки',
			privacy: 'Конфиденциальность',
			imprint: 'Правовая информация',
			disclaimer: 'Вы получили это письмо, потому что провели анализ веб-сайта на нашей платформе.'
		}
	}
};

export default ru;
