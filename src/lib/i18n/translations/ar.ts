import type { Translation } from '../types';
import { getCommonTranslation } from './common';

const ar: Translation = {
	start: {
		title: 'اختبار تحقق من التسويق',
		text: 'الآن احسب <strong>مدى الرؤية عبر الإنترنت</strong>، وزد <strong>الوصول</strong>، ووفر <strong>الموارد</strong>، وارفع <strong>المبيعات</strong>.',
		meta: {
			rating: {
				user: 'مستخدم',
				from: 'من',
				quiztime: 'اختبار مدته دقائق'
			}
		}
	},
	common: getCommonTranslation('ar'),
	forms: {
		labels: {
			company_name: 'اسم الشركة',
			company_url: 'رابط الموقع الإلكتروني',
			salutation: 'اللقب',
			first_name: 'الاسم الأول',
			last_name: 'الاسم الأخير',
			email: 'البريد الإلكتروني',
			phone: 'الهاتف',
			privacy_agreement: 'اتفاقية الخصوصية',
			marketing_consent: 'الموافقة على التسويق'
		},
		salutation: {
			select: 'يرجى اختيار اللقب',
			male: 'السيد',
			female: 'السيدة',
			diverse: 'متنوع'
		},
		imageOption: {
			continueIn: 'متابعة خلال',
			second: 'ثانية',
			seconds: 'ثواني',
			selectUpTo: 'يمكنك اختيار حتى {max} خيارات',
			selectAllApplicable: 'اختر جميع الخيارات المناسبة'
		},
		placeholders: {
			select: 'يرجى الاختيار',
			salutation: 'يرجى اختيار اللقب',
			first_name: 'يرجى إدخال الاسم الأول',
			last_name: 'يرجى إدخال الاسم الأخير',
			email: 'يرجى إدخال البريد الإلكتروني',
			phone: 'رقم الهاتف (اختياري)',
			privacy_agreement: 'الموافقة على سياسة الخصوصية',
			privacy_policy: 'سياسة الخصوصية',
			newsletter_terms: 'شروط النشرة الإخبارية',
			company_url: 'https://www.mywebsite.com'
		},
		errors: {
			required: 'هذا الحقل مطلوب',
			url: 'يرجى إدخال رابط صحيح',
			email: 'يرجى إدخال بريد إلكتروني صحيح'
		},
		descriptions: {
			company_url: 'أدخل رابط موقعك وانقر على "تحليل" للحصول على تقرير مفصل.',
			analyze: 'انقر على "تحليل" لفحص موقعك',
			privacy_agreement: 'أوافق على',
			marketing_consent: 'أرغب في استلام النشرة الإخبارية وأوافق على'
		},
		checkpoints: {
			performance: 'فحص الأداء',
			seo: 'تحليل SEO',
			accessibility: 'اختبار إمكانية الوصول',
			security: 'فحص الأمان'
		},
		seotips: {
			headline: 'تحليل موقعك الإلكتروني',
			title: 'نصيحة SEO أثناء التحليل:',
			default: [
				'استخدم عناوين صفحات دقيقة لتحسين النقرات في نتائج البحث.',
				'أنشئ أوصاف ميتا فريدة لكل صفحة (150-160 حرفًا).',
				'استخدم عنوان H1 واحد لكل صفحة يعبر عن الموضوع الرئيسي.',
				'حسن الصور مع نصوص بدلية وضغطها لسرعة التحميل.',
				'أنشئ هيكل موقع واضح مع روابط منطقية.',
				'حسن موقعك للأجهزة المحمولة بتصميم متجاوب.',
				'حسن سرعة التحميل - كل ثانية مهمة لـ SEO والمبيعات.',
				'استخدم الروابط الداخلية لمساعدة الزوار ومحركات البحث.',
				'أنشئ محتوى عالي الجودة باستمرار لجمهورك.',
				'طبق ترميز Schema.org لتحسين الظهور في النتائج.',
				'أنشئ خريطة موقع XML وأرسلها لـ Google Search Console.',
				'استخدم اتصال HTTPS آمن لموقعك بالكامل.',
				'افحص وأصلح الروابط المعطلة بانتظام.',
				'حسن علامات Open Graph لظهور أفضل في وسائل التواصل.'
			]
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'الرؤية',
				description: 'أين يمكن العثور على شركتك؟'
			},
			company_url: {
				title: 'رابط الشركة',
				description: 'مستعد لتحليل موقعك؟'
			},
			advertising_frequency: {
				title: 'تكرار الإعلان',
				description: 'كم مرة تعلن؟'
			},
			goals: {
				title: 'الأهداف',
				description: 'ماذا تريد تحقيقك في عملك؟'
			},
			campaign_management: {
				title: 'إدارة الحملات',
				description: 'من سيدير إعلاناتك؟'
			},
			online_reviews: {
				title: 'التقييمات عبر الإنترنت',
				description: 'كيف يقيمك عملاؤك؟'
			},
			previous_campaigns: {
				title: 'الحملات السابقة',
				description: 'خبرتك في الإعلانات عبر الإنترنت'
			},
			business_phase: {
				title: 'مرحلة العمل',
				description: 'في أي مرحلة توجد شركتك؟'
			},
			implementation_time: {
				title: 'وقت التنفيذ',
				description: 'الفترة الزمنية المطلوبة للتنفيذ'
			},
			company_info: {
				title: 'معلومات الشركة',
				description: 'معلومات عن شركتك'
			},
			waitingscreen: {
				title: 'شاشة الانتظار',
				description: 'جاري معالجة طلبك'
			},
			result: {
				title: 'النتيجة',
				description: 'الإجراءات المطلوبة: تحليل موقعك'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'محركات البحث',
					description: 'الوجود في Google وما شابه'
				},
				social_media: {
					label: 'وسائل التواصل',
					description: 'الوجود في Facebook وما شابه'
				},
				print: {
					label: 'الطباعة',
					description: 'إعلانات مطبوعة تقليدية'
				},
				store: {
					label: 'متجر فعلي',
					description: 'وجود مادي'
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
					description: 'حملات سنوية كبيرة'
				}
			},
			goals: {
				new_clients: {
					label: 'اكتساب عملاء جدد',
					description: 'اكتساب عملاء جدد'
				},
				new_employees: {
					label: 'اكتساب موظفين',
					description: 'إيجاد موظفين جدد'
				},
				more_online: {
					label: 'مزيد من التواجد',
					description: 'زيادة الظهور عبر الإنترنت'
				},
				all: {
					label: 'كل ذلك معًا',
					description: 'حل متكامل'
				}
			},
			campaign_management: {
				self: {
					label: 'أنا بنفسي',
					description: 'إدارة ذاتية'
				},
				digitalpusher: {
					label: 'Digitalpusher',
					description: 'إدارة احترافية'
				},
				employee: {
					label: 'موظف',
					description: 'إدارة داخلية'
				}
			},
			online_reviews: {
				positive: {
					label: 'إيجابية غالبًا',
					description: 'تقييمات جيدة'
				},
				negative: {
					label: 'سلبية غالبًا',
					description: 'إمكانية التحسين'
				},
				none: {
					label: 'لا يوجد',
					description: 'لا توجد تقييمات'
				}
			},
			previous_campaigns: {
				yes: {
					label: 'نعم',
					description: 'خبرة موجودة'
				},
				no: {
					label: 'لا',
					description: 'لا توجد خبرة'
				},
				would_like: {
					label: 'أرغب في ذلك',
					description: 'اهتمام موجود'
				}
			},
			business_phase: {
				planning: {
					label: 'التأسيس مخطط له',
					description: 'مرحلة التخطيط'
				},
				less_than_6_months: {
					label: 'أقل من 6 أشهر',
					description: 'شركة ناشئة'
				},
				more_than_6_months: {
					label: 'أكثر من 6 أشهر',
					description: 'شركة مستقرة'
				},
				family_business: {
					label: 'عمل عائلي',
					description: 'شركة عائلية'
				}
			},
			implementation_time: {
				immediate: {
					label: 'فورًا',
					description: 'تنفيذ سريع'
				},
				medium: {
					label: 'خلال 2-6 أشهر',
					description: 'تخطيط متوسط المدى'
				},
				long_term: {
					label: 'أكثر من 6 أشهر',
					description: 'استراتيجية طويلة المدى'
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
			currentValue: 'الحالي',
			improvedValue: 'بعد التحسين',
			average: 'المتوسط',
			optimal: 'مثالي'
		},
		validation: {
			required: 'هذا الحقل مطلوب',
			visibility: {
				required: 'يرجى اختيار أماكن وجود شركتك',
				minSelection: 'يرجى اختيار خيار واحد على الأقل'
			},
			advertising_frequency: {
				required: 'يرجى اختيار تكرار الإعلان',
				minSelection: 'يرجى اختيار تكرار واحد على الأقل'
			},
			goals: {
				required: 'يرجى اختيار هدفك الرئيسي',
				minSelection: 'يرجى اختيار هدف واحد على الأقل'
			},
			campaign_management: {
				required: 'يرجى اختيار من سيدير الإعلانات',
				minSelection: 'يرجى اختيار خيار واحد على الأقل'
			},
			online_reviews: {
				required: 'يرجى تحديد متوسط تقييماتك',
				minSelection: 'يرجى اختيار خيار واحد على الأقل'
			},
			previous_campaigns: {
				required: 'يرجى تحديد ما إذا كنت قد أعلنت سابقًا',
				minSelection: 'يرجى اختيار خيار واحد على الأقل'
			},
			business_phase: {
				required: 'يرجى اختيار مرحلة شركتك',
				minSelection: 'يرجى اختيار مرحلة واحدة على الأقل'
			},
			implementation_time: {
				required: 'يرجى اختيار فترة التنفيذ',
				minSelection: 'يرجى اختيار فترة واحدة على الأقل'
			},
			company_name: {
				required: 'اسم الشركة مطلوب',
				minLength: 'يجب أن يكون الاسم على الأقل حرفين'
			},
			company_url: {
				required: 'رابط الموقع مطلوب',
				url: 'يرجى إدخال رابط صحيح'
			},
			first_name: {
				required: 'الاسم الأول مطلوب',
				minLength: 'يجب أن يكون الاسم الأول على الأقل حرفين'
			},
			last_name: {
				required: 'الاسم الأخير مطلوب',
				minLength: 'يجب أن يكون الاسم الأخير على الأقل حرفين'
			},
			email: {
				required: 'البريد الإلكتروني مطلوب',
				email: 'يرجى إدخال بريد إلكتروني صحيح'
			},
			phone: {
				required: 'رقم الهاتف مطلوب',
				pattern: 'تنسيق هاتف غير صحيح'
			},
			privacy_agreement: {
				required: 'يرجى الموافقة على سياسة الخصوصية'
			}
		}
	},
	results: {
		title: 'الإجراءات المطلوبة: تحليل موقعك',
		subtitle: 'هذا هو تقرير التحليل الخاص بك',
		score: {
			title: 'درجة التسويق الخاصة بك',
			low: {
				title: 'حرج! شركتك غير مرئية تقريبًا.',
				suggestion: 'نوضح لك كيفية الوصول إلى المزيد من العملاء فورًا.'
			},
			medium: {
				title: 'رؤيتك قابلة للتحسين.',
				suggestion: 'زد وصولك عبر استراتيجيات تسويق ذكية.'
			},
			high: {
				title: 'جيد! لكن هناك إمكانات.',
				suggestion: 'مع تحسينات مستهدفة يمكنك زيادة الرؤية.'
			},
			excellent: {
				title: 'ممتاز! تواجدك الرقمي رائع.',
				suggestion: 'استخدم استراتيجيات متقدمة لتعزيز هيمنتك!'
			}
		},
		sections: {
			analysis: 'نتائج التحليل',
			steps: {
				title: 'كيف تستمر بعد الشراء؟',
				purchase: {
					title: 'إتمام الشراء',
					description: 'اختيار الخطة المناسبة وإتمام الشراء',
					icon: 'cart'
				},
				scheduling: {
					title: 'تحديد موعد',
					description: 'ترتيب موعد مع خبيرنا الرقمي',
					icon: 'calendar'
				},
				implementation: {
					title: 'التنفيذ',
					description: 'تنفيذ احترافي للتدابير المتفق عليها',
					icon: 'code'
				},
				handover: {
					title: 'التسليم',
					description: 'تسليم النظام الرقمي المحسن',
					icon: 'check'
				}
			},
			plans: 'اختر خطتك',
			testimonials: {
				title: 'قصص نجاح ستحفزك',
				inspiration: 'إلهامات',
				case1: {
					titleLow: 'من 0 إلى 100: 3 صفقات يوميًا بزيادة الرؤية',
					titleHigh: 'اختراق: +43% طلبات بفضل استراتيجية تسويق مدروسة',
					quote:
						'تمت استشارتنا بشكل كامل وقررنا تنفيذ حملة على وسائل التواصل. نحن راضون عن النتائج بعد عامين.',
					author: '- د. بي. أولريش، المدير'
				},
				case2: {
					title: 'تنفيذ فعال: صفحة هبوط، SEO وحملة إعلانات',
					quote:
						'تم تنفيذ SEO وصفحة الهبوط بسرعة بناء على البيانات. الحملة كانت ناجحة بفضل استهداف الجمهور.',
					author: '- م. كيلر، مدير علامة'
				}
			},
			improvement: {
				title: 'كيف نحسن نتائجك',
				steps: [
					{
						title: 'تحسين الموقع',
						description: 'تحسين سرعة التحميل والتوافق مع المحمول وسهولة الاستخدام.',
						icon: 'deviceDesktop',
						underScore: 40
					},
					{
						title: 'SEO والكلمات المفتاحية',
						description: 'تحسين محركات البحث مخصص لقطاعك.',
						icon: 'search',
						underScore: 40
					},
					{
						title: 'الوجود الأساسي على الويب',
						description: 'بناء وجود قوي على الإنترنت.',
						icon: 'home',
						underScore: 40
					},
					{
						title: 'SEO محلي',
						description: 'تحسين للبحث المحلي.',
						icon: 'mapPin',
						underScore: 40
					},
					{
						title: 'استراتيجية المحتوى',
						description: 'استراتيجية محتوى تجذب جمهورك.',
						icon: 'fileText',
						underScore: 60
					},
					{
						title: 'التكامل مع وسائل التواصل',
						description: 'ربط موقعك بوسائل التواصل لزيادة الوصول.',
						icon: 'share2',
						underScore: 60
					},
					{
						title: 'تحسين التحويل',
						description: 'تحسينات لتحويل الزوار إلى عملاء.',
						icon: 'trendingUp',
						underScore: 80
					},
					{
						title: 'تسويق المحتوى',
						description: 'محتوى عالي الجودة يعرض خبرتك.',
						icon: 'edit',
						underScore: 80
					}
				]
			},
			cta: {
				title: 'مستعد لثورة رقمية؟',
				subtitle: 'اختر خطتك الآن وابدأ رحلتك نحو المزيد من الرؤية والنجاح.',
				button: 'اختر خطة الآن'
			}
		},
		strengths: {
			title: 'نقاط قوتك',
			goodBasics: 'أساسيات جيدة في التواجد الرقمي',
			regularContent: 'إنشاء محتوى منتظم',
			understanding: 'فهم أساسي للتسويق الرقمي',
			quickImprovement: 'إمكانية تحسين سريع',
			growthPotential: 'إمكانات نمو كبيرة',
			visibilityGain: 'فرصة لزيادة الرؤية بسرعة',
			socialPresence: 'وجود على وسائل التواصل',
			seoUnderstanding: 'فهم لتحسين محركات البحث',
			digitalTransformation: 'استعداد للتحول الرقمي'
		},
		weaknesses: {
			title: 'إمكانات التحسين',
			poorVisibility: 'رؤية رقمية ضعيفة',
			noStrategy: 'غياب استراتيجية تسويق',
			poorOptimization: 'تحسين غير كاف للموقع',
			limitedReach: 'وصول محدود في محركات البحث',
			underdevelopedContent: 'استراتيجية محتوى غير مطورة',
			poorConversion: 'نقص في تحسين التحويل',
			contentDistribution: 'ثغرات في توزيع المحتوى',
			competitorAnalysis: 'تحليل محدود للمنافسين',
			conversionRate: 'إمكانية تحسين معدل التحويل'
		},
		benefits: {
			title: 'مزاياك',
			visibility: 'زيادة الرؤية في Google',
			traffic: 'المزيد من الزوار المؤهلين',
			conversion: 'معدلات تحويل أفضل',
			searchEngines: 'تحسين المراكز في محركات البحث',
			socialMedia: 'تحسين التواجد على وسائل التواصل',
			newClients: 'استراتيجيات لاكتساب عملاء جدد',
			newEmployees: 'صفحة وظائف محسنة'
		},
		recommendations: {
			title: 'توصياتنا',
			website: 'تحسين الموقع لتجربة مستخدم أفضل',
			content: 'استراتيجية محتوى لزيادة الرؤية',
			performance: 'تحسين سرعة الموقع بتحسين الصور',
			seo: 'تحسين SEO عبر علامات ميتا وبيانات منظمة',
			accessibility: 'تحسين إمكانية الوصول',
			contentQuality: 'تحسين جودة المحتوى بالكلمات المفتاحية',
			basicSeo: 'تحسين SEO أساسي',
			googleBusiness: 'إنشاء ملف Google Business',
			advancedSeo: 'إجراءات SEO متقدمة',
			localSeo: 'تحسين SEO محلي',
			contentMarketing: 'استراتيجية تسويق محتوى',
			backlinks: 'بناء روابط خلفية',
			extendedContent: 'استراتيجية محتوى موسعة',
			competitorAnalysis: 'تحليل المنافسين'
		},
		expertProfile: {
			name: 'كريستوفر مات',
			role: 'خبير تسويق رقمي',
			bio: 'بخبرة أكثر من 10 سنوات، يساعد كريستوفر الشركات على تحسين تواجدها الرقمي وتحقيق النتائج. كشريك معتمد في Google وخبير وسائل التواصل، يعرف جميع الاستراتيجيات اللازمة للرؤية المستدامة.',
			imageUrl:
				'https://www.chooomedia.de/wp-content/uploads/2023/03/chooomedia-christopher-matt-ceo-freelancer-webdesigner-ui-designer-information-designer-500x500px__1_-removebg-preview.png',
			imageAlt: 'كريستوفر مات - خبير تسويق رقمي',
			badges: {
				googlePartner: {
					label: 'شريك Google',
					value: '',
					icon: 'google'
				},
				customers: {
					label: 'عملاء',
					value: '220+',
					icon: 'users'
				},
				experience: {
					label: 'سنوات الخبرة',
					value: '10+',
					icon: 'experience'
				}
			}
		},
		buttons: {
			restart: 'إعادة الاختبار والتحليل',
			getReport: 'الحصول على التقرير عبر البريد',
			emailError: 'يرجى إدخال عنوان بريد إلكتروني في النموذج لاستلام النتائج.'
		},
		screenshot: {
			alt: 'لقطة الشاشة',
			unsupported: 'بيانات لقطة موجودة لكن التنسيق غير مدعوم'
		}
	},
	meta: {
		title: 'تقييم التسويق الرقمي',
		description: 'حلل تواجدك الرقمي مع تقييمنا المجاني. احصل على توصيات مخصصة لمزيد من النجاح.',
		breadcrumb: 'تقييم التسويق'
	},
	pricing: {
		perDay: 'يوميًا',
		features: {
			websiteOptimization: 'تحسين الموقع',
			basicSeo: 'إجراءات SEO أساسية',
			monthlyContent: 'إنشاء محتوى شهري',
			performanceReport: 'تقرير أداء شهري',
			allBasicFeatures: 'جميع ميزات خطة الشهر',
			socialMedia: 'إدارة وسائل التواصل',
			weeklyContent: 'إنشاء محتوى أسبوعي',
			keywordOptimization: 'تحسين الكلمات المفتاحية',
			competitorAnalysis: 'تحليل المنافسين',
			allPremiumFeatures: 'جميع ميزات خطة 3 أشهر',
			marketingStrategy: 'استراتيجية تسويق شاملة',
			dailyContent: 'تحديثات يومية',
			sem: 'تسويق محركات البحث (SEM)',
			personalManager: 'مدير تسويق شخصي',
			cro: 'تحسين معدل التحويل'
		},
		included: {
			longtermBusiness: 'طريقة لبناء عمل رقمي طويل الأمد',
			viralContent: 'مفاهيم لإنشاء محتوى viral',
			expertFrameworks: 'أطر عمل خبراء للتوسع السريع',
			targetedStrategies: 'استراتيجيات تستند إلى بيانات الجمهور'
		},
		excluded: {
			getRichQuick: 'خطط الثراء السريع غير الواقعية',
			noContracts: 'لا التزامات طويلة المدى',
			noInvestment: 'لا استثمارات وهمية',
			pyramidSchemes: 'لا أنظمة هرمية'
		},
		includedTitle: 'متضمن',
		inAllPlans: 'في جميع الخطط',
		excludedTitle: 'لا نتعامل',
		notWorking: 'مع',
		choosePlan: 'اختر الخطة المناسبة',
		header: {
			title: 'اختر الخطة المثالية للتحول الرقمي',
			subtitle: 'بناءً على نتيجتك {score}، نوصي بخطة مخصصة'
		},
		countdown: {
			title: 'عرض خاص!',
			subtitle: 'ينتهي الخصم خلال:'
		},
		bonusBox: {
			tag: 'مكافأة حصرية',
			title: 'مقالة مدونة مجانية',
			description: 'احصل على مقالة SEO مخصصة لموقعك عند الحجز خلال العرض.',
			benefits: ['مخصص لشركتك', 'مُحسن لـ SEO', 'زيادة فورية في الرؤية'],
			value: 'قيمتها: 99€',
			limited: 'لمدة محدودة'
		},
		paymentOptions: {
			title: 'اختر طريقة الدفع:',
			monthly: 'شهريًا',
			oneTime: 'مرة واحدة (-8%)',
			longTime: 'انتربرايز (-20%)',
			hotLabel: 'مميز'
		},
		planLabels: {
			oneTime: 'مرة واحدة',
			oneMonth: 'خطة شهر',
			threeMonth: 'خطة 3 أشهر',
			sixMonth: 'خطة 6 أشهر',
			popular: '★ الأكثر شيوعًا',
			longTimeSuffix: {
				oneMonth: 'إنتربرايز أساسي',
				threeMonth: 'إنتربرايز متميز',
				business: 'إنتربرايز الأعمال'
			}
		},
		additionalBenefits: {
			oneTime: ['خصم 8%', 'لا رسوم شهرية'],
			longTime: ['وصول لسنة', 'خصم 20%', 'جميع التحديثات'],
			savings: 'وفر',
			savingsOption: 'مع هذا الخيار!'
		},
		ctaButton: {
			monthly: 'اشترك',
			oneTime: 'اشتري الآن',
			longTime: 'احصل على انتربرايز',
			selectPlan: 'اختر خطة'
		},
		savings: 'وفرت',
		trustBadges: ['دفع آمن', 'ضمان استرداد 30 يومًا'],
		consultationText: 'أم تريد اللعب بأمان؟',
		consultationLink: 'احجز استشارة مجانية',
		discountBanner: {
			title: 'وصول انتربرايز بخصم',
			discount: ' 20%!',
			description:
				'احصل الآن على وصول لمدة سنة واحدة بخصم 20%! استثمر مرة واحدة واستمتع بجميع الميزات.', // تم التغيير من '5 سنوات'
			buttonText: 'احصل الآن!'
		},
		terms: {
			monthly: {
				main: 'يوافق اختيارك على التجديد التلقائي للخطة {selectedPlan} بالسعر الكامل. يتم الفحص الشهري بـ {totalPrice.toFixed(2)}. يمكنك الإلغاء عبر البريد على abo@digitalpusher.de.',
				reminder: 'ستصلك إشعار قبل 5 أيام من التجديد.'
			},
			oneTime: 'سيتم خصم {totalPrice.toFixed(2)}€ مرة واحدة. لا تجديدات. الوصول لمدة سنة واحدة.',
			acceptance: 'بالنقر على "اشتراك"، أنت توافق على الشروط وسياسة الخصوصية.'
		}
	},
	footer: {
		copyright: 'جميع الحقوق محفوظة.'
	},
	modal: {
		common: {
			close: 'إغلاق',
			cancel: 'إلغاء',
			confirm: 'تأكيد',
			back: 'رجوع'
		},
		payment: {
			title: 'إتمام الدفع',
			subtitle: 'اختر طريقة الدفع',
			testButton: 'دفع تجريبي',
			testDescription: 'دفع تجريبي بحساب تجريبي',
			summary: {
				title: 'ملخص',
				monthly: 'دفع شهري',
				oneTime: 'دفع مرة واحدة',
				longtime: 'وصول انتربرايز',
				discount: 'خصم',
				donation: 'بما فيها التبرع',
				tax: 'بما فيها الضريبة'
			},
			securityBadges: {
				secure: 'آمن SSL',
				protection: 'حماية المشتري',
				instant: 'وصول فوري'
			},
			donationBox: {
				title: 'أضف تبرع 3%',
				description: '93% من تبرعك يدعم مشاريع بيئية. تأثير واضح!'
			},
			errors: {
				general: 'حدث خطأ. حاول لاحقًا.',
				validation: 'يرجى مراجعة بيانات الدفع',
				server: 'خدمة PayPal غير متاحة حاليًا.',
				timeout: 'انتهت المهلة. تحقق من الاتصال.'
			}
		},
		success: {
			title: 'تم الدفع بنجاح!',
			subtitle: 'شكرًا لشرائك',
			modalInfo: 'لا تغلق النافذة لإتمام العملية.',
			paymentDetails: {
				plan: 'الخدمة',
				id: 'معرف الدفع',
				date: 'التاريخ',
				status: 'الحالة',
				paid: 'مدفوع'
			},
			shareContent: {
				title: 'نجاحي مع Digital Pusher',
				text: 'لقد قمت بتنشيط خطة التسويق الخاصة بي مع Digital Pusher وأنا في طريقي إلى مزيد من الرؤية والنجاح! 🚀 #تسويق_رقمي'
			},
			donation: {
				title: 'تأثيرك!',
				description: 'تبرعك بـ {amount}€ يدعم البيئة. معًا نصنع الفرق!',
				impact: {
					direct: 'مساعدة مباشرة',
					projects: 'مشاريع',
					transparency: 'شفافية'
				}
			},
			nextSteps: {
				title: 'خطواتك التالية:',
				steps: ['تحقق من بريدك للتأكيد', 'حدد موعدًا للاستشارة', 'ادعُ عضو فريق لنتائج أفضل']
			},
			upgradeOffer: {
				exclusive: 'حصري',
				title: 'ارفع خطتك ووفر 30%',
				subtitle: 'للعملاء الجدد: أضف ميزات متميزة الآن!',
				countdown: 'ينتهي العرض خلال',
				button: 'رفع الخطة'
			},
			support: {
				confirmation: 'تم إرسال التأكيد إلى بريدك.',
				contact: 'للاستفسارات، تواصل مع الدعم'
			},
			buttons: {
				dashboard: 'لوحة التحكم',
				share: 'مشاركة'
			}
		},
		error: {
			title: 'خطأ في الدفع',
			defaultMessage: 'حدث خطأ',
			details: 'عرض التفاصيل التقنية',
			support: 'تواصل مع الدعم للمساعدة.',
			retry: 'حاول مجددًا'
		},
		confirm: {
			cancelPurchase: 'هل تريد إلغاء الشراء؟',
			confirmButton: 'نعم، ألغِ',
			cancelButton: 'عودة للشراء'
		},
		booking: {
			title: 'احجز استشارة مجانية',
			subtitle:
				'اختر موعداً لاستشارتك المجانية لمدة 30 دقيقة. نناقش احتياجاتك الفردية ونوضح لك كيفية تحسين ظهورك عبر الإنترنت.',
			selectDate: 'اختر التاريخ:',
			selectTime: 'اختر الوقت:',
			contactInfo: 'معلومات الاتصال الخاصة بك:',
			confirm: 'احجز موعداً مجاناً',
			booking: 'جاري حجز الموعد...',
			cancel: 'إلغاء',
			success: {
				title: 'تم حجز الموعد بنجاح!',
				message: 'تم حجز استشارتك المجانية في {date} الساعة {time}.',
				details: 'ستتلقى رسالة تأكيد بالبريد الإلكتروني قريباً مع جميع التفاصيل ورابط الاجتماع.'
			}
		}
	},
	waitingScreen: {
		title: 'جارٍ تحليل بياناتك - الرجاء الانتظار.',
		redirect: 'ستظهر نتيجتك خلال {remainingTime}'
	},
	email: {
		subject: 'نتائج تحليل موقع الويب الخاص بك لـ {company_url}',
		greeting: 'مرحبًا {firstName} {lastName}',
		results: {
			title: 'نتائج تحليل موقع الويب',
			description:
				'ها هي <strong>نتائج تحليل موقع الويب</strong> الخاصة بك لـ <strong>{company_url}</strong> بتاريخ {currentDate}.',
			visibilityScore: 'نتيجة ظهورك: {score}/100',
			scoreDescription: 'بناءً على وجودك الحالي على الإنترنت واستراتيجية التسويق'
		},
		situation: {
			title: '📊 وضعك الحالي',
			visibility: 'الظهور:',
			advertisingFrequency: 'تكرار الإعلان:',
			goals: 'الأهداف:',
			campaignManagement: 'إدارة الحملة:',
			businessPhase: 'مرحلة الشركة:',
			implementationTime: 'الإطار الزمني للتنفيذ:'
		},
		cta: {
			title: '🎯 عرض حصري لك',
			description:
				'احصل على <span class="secrets-highlight">5 نصائح سرية مجانية</span> لزيادة الظهور على الإنترنت خلال استشارة شخصية.',
			highlight: '5 نصائح سرية مجانية',
			urgency: '⚡ متاح لفترة محدودة فقط!',
			button: '🎁 احصل على 5 نصائح سرية مجانية'
		},
		footer: {
			copyright: '© 2025 Digitalpusher - جميع الحقوق محفوظة',
			unsubscribe: 'إلغاء الاشتراك من النشرة الإخبارية',
			privacy: 'الخصوصية',
			imprint: 'بيانات العلامة التجارية',
			disclaimer: 'لقد تلقيت هذا البريد الإلكتروني because لأنك أجرت تحليل موقع ويب على منصتنا.'
		}
	}
};

export default ar;
