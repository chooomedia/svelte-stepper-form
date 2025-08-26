import type { Translation } from '../types';
import { getCommonTranslation } from './common';

const tr: Translation = {
	start: {
		title: 'Pazarlama Kontrol Testi',
		text: 'Şimdi <strong>çevrimiçi görünürlüğünü hesapla</strong>, <strong>erişimini artır</strong>, <strong>kaynakları koru</strong> ve <strong>satışlarını yükselt</strong>.',
		meta: {
			rating: {
				user: 'Kullanıcı',
				from: '/',
				quiztime: 'dakikalık test'
			}
		}
	},
	common: getCommonTranslation('tr'),
	forms: {
		labels: {
			company_name: 'Şirket Adı',
			company_url: 'Web Sitesi URL',
			salutation: 'Hitap Şekli',
			first_name: 'Ad',
			last_name: 'Soyad',
			email: 'E-posta',
			phone: 'Telefon',
			privacy_agreement: 'Gizlilik Sözleşmesi',
			marketing_consent: 'Bülten'
		},
		salutation: {
			select: 'Hitap seçin',
			male: 'Bay',
			female: 'Bayan',
			diverse: 'Diğer'
		},
		imageOption: {
			continueIn: 'içinde devam',
			second: 'saniye',
			seconds: 'saniye',
			selectUpTo: 'En fazla {max} seçenek seçebilirsin',
			selectAllApplicable: 'Uygun tüm seçenekleri işaretle'
		},
		placeholders: {
			select: 'Seçin',
			salutation: 'Hitap şeklini seç',
			first_name: 'Adını gir',
			last_name: 'Soyadını gir',
			email: 'E-posta adresini gir',
			phone: 'Telefon (isteğe bağlı)',
			privacy_agreement: 'Gizlilik politikasını kabul et',
			privacy_policy: 'Gizlilik Politikası',
			newsletter_terms: 'Bülten Şartları',
			company_url: 'https://www.sirketiniz.com.tr'
		},
		errors: {
			required: 'Bu alan zorunlu',
			url: 'Geçerli bir URL girin',
			email: 'Geçerli e-posta girin'
		},
		descriptions: {
			company_url: 'Web siteni analiz etmek için URL gir ve "Analiz Et"e tıkla',
			analyze: 'Web siteni kontrol etmek için "Analiz Et"',
			privacy_agreement: 'Kabul ediyorum',
			marketing_consent: 'Bülten almak istiyorum ve kabul ediyorum'
		},
		checkpoints: {
			performance: 'Performans Kontrolü',
			seo: 'SEO Analizi',
			accessibility: 'Erişilebilirlik Testi',
			security: 'Güvenlik Kontrolü'
		},
		seotips: {
			headline: 'Web Siten Analizi',
			title: 'SEO İpucu:',
			default: [
				'Doğru sayfa başlıkları (Title Tag) kullan',
				'Her sayfa için benzersiz meta açıklamalar (150-160 karakter)',
				'Sayfa başına bir H1 başlığı',
				'Görselleri alt metinlerle optimize et',
				'Mantıklı URL yapısı oluştur',
				'Mobil uyumlu tasarım',
				'Yükleme hızını optimize et',
				'İç linklemeyi kullan',
				'Kaliteli içerik üret',
				'Schema.org işaretleme kullan',
				'XML site haritası oluştur',
				'HTTPS bağlantısı kullan',
				'Bozuk linkleri düzenli kontrol et',
				'Open Graph etiketlerini optimize et'
			]
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'görünürlük',
				description: 'Şirketin nerede bulunuyor?'
			},
			company_url: {
				title: 'web_sitesi',
				description: 'Analize hazır mısın?'
			},
			advertising_frequency: {
				title: 'reklam_sıklığı',
				description: 'Ne sıklıkla reklam veriyorsun?'
			},
			goals: {
				title: 'hedefler',
				description: 'İş hedeflerin nedir?'
			},
			campaign_management: {
				title: 'kampanya_yönetimi',
				description: 'Reklamları kim yönetecek?'
			},
			online_reviews: {
				title: 'online_yorumlar',
				description: 'Müşterilerin seni nasıl değerlendiriyor?'
			},
			previous_campaigns: {
				title: 'önceki_kampanyalar',
				description: 'Online reklam deneyimin'
			},
			business_phase: {
				title: 'iş_aşaması',
				description: 'Şirketin hangi aşamada?'
			},
			implementation_time: {
				title: 'uygulama_süresi',
				description: 'Tercih ettiğin zaman çerçevesi'
			},
			company_info: {
				title: 'şirket_bilgileri',
				description: 'Şirket bilgilerin'
			},
			waitingscreen: {
				title: 'bekleme',
				description: 'İsteğin işleniyor'
			},
			result: {
				title: 'sonuç',
				description: 'Web Siten Analiz Sonucu'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'Arama Motorları',
					description: 'Google görünürlüğü'
				},
				social_media: {
					label: 'Sosyal Medya',
					description: 'Facebook varlığı'
				},
				print: {
					label: 'Baskı',
					description: 'Geleneksel reklam'
				},
				store: {
					label: 'Mağaza',
					description: 'Fiziksel varlık'
				}
			},
			advertising_frequency: {
				weekly: {
					label: 'Haftalık',
					description: 'Haftalık güncelleme'
				},
				monthly: {
					label: 'Aylık',
					description: 'Aylık kampanya'
				},
				yearly: {
					label: 'Yıllık',
					description: 'Yıllık büyük kampanya'
				}
			},
			goals: {
				new_clients: {
					label: 'Yeni Müşteri',
					description: 'Müşteri kazanımı'
				},
				new_employees: {
					label: 'Yeni Çalışan',
					description: 'İşe alım'
				},
				more_online: {
					label: 'Online Varlık',
					description: 'Görünürlük artışı'
				},
				all: {
					label: 'Hepsi',
					description: 'Tümü bir arada'
				}
			},
			campaign_management: {
				self: {
					label: 'Kendim',
					description: 'Kendi yönetimim'
				},
				digitalpusher: {
					label: 'Digitalpusher',
					description: 'Profesyonel yönetim'
				},
				employee: {
					label: 'Çalışan',
					description: 'İç yönetim'
				}
			},
			online_reviews: {
				positive: {
					label: 'Olumlu',
					description: 'İyi yorumlar'
				},
				negative: {
					label: 'Olumsuz',
					description: 'İyileştirme gerekiyor'
				},
				none: {
					label: 'Yok',
					description: 'Yorum bulunmuyor'
				}
			},
			previous_campaigns: {
				yes: {
					label: 'Evet',
					description: 'Deneyim var'
				},
				no: {
					label: 'Hayır',
					description: 'Deneyim yok'
				},
				would_like: {
					label: 'İsterim',
					description: 'İlgi var'
				}
			},
			business_phase: {
				planning: {
					label: 'Planlama Aşaması',
					description: 'Kurulum öncesi'
				},
				less_than_6_months: {
					label: '6 Aydan Yeni',
					description: 'Yeni şirket'
				},
				more_than_6_months: {
					label: '6 Aydan Eski',
					description: 'Yerleşik şirket'
				},
				family_business: {
					label: 'Aile Şirketi',
					description: 'Aile işletmesi'
				}
			},
			implementation_time: {
				immediate: {
					label: 'Hemen',
					description: 'Hızlı uygulama'
				},
				medium: {
					label: '2-6 Ay',
					description: 'Orta vadeli plan'
				},
				long_term: {
					label: '6 Aydan Fazla',
					description: 'Uzun vadeli strateji'
				}
			}
		},
		metrics: {
			seo: {
				label: 'SEO',
				description: 'Arama motoru optimizasyonu'
			},
			performance: {
				label: 'Performans',
				description: 'Yükleme hızı'
			},
			accessibility: {
				label: 'Erişilebilirlik',
				description: 'Kullanılabilirlik'
			},
			bestPractices: {
				label: 'En İyi Uygulamalar',
				description: 'Web standartları'
			},
			content: {
				label: 'İçerik',
				description: 'İçerik kalitesi'
			},
			security: {
				label: 'Güvenlik',
				description: 'Güvenlik seviyesi'
			},
			currentValue: 'Mevcut',
			improvedValue: 'İyileştirilmiş',
			average: 'Ortalama',
			optimal: 'Optimal'
		},
		validation: {
			required: 'Zorunlu alan',
			visibility: {
				required: 'En az 1 seçenek seç',
				minSelection: 'En az 1 seçim gerekli'
			},
			advertising_frequency: {
				required: 'Reklam sıklığını seç',
				minSelection: 'En az 1 seçim gerekli'
			},
			goals: {
				required: 'Hedef seç',
				minSelection: 'En az 1 hedef seç'
			},
			campaign_management: {
				required: 'Yönetici seç',
				minSelection: 'En az 1 seçim gerekli'
			},
			online_reviews: {
				required: 'Değerlendirme seç',
				minSelection: 'En az 1 seçim gerekli'
			},
			previous_campaigns: {
				required: 'Deneyim belirt',
				minSelection: 'En az 1 seçim gerekli'
			},
			business_phase: {
				required: 'Aşama seç',
				minSelection: 'En az 1 seçim gerekli'
			},
			implementation_time: {
				required: 'Zaman çerçevesi seç',
				minSelection: 'En az 1 seçim gerekli'
			},
			company_name: {
				required: 'Şirket adı gerekli',
				minLength: 'En az 2 karakter'
			},
			company_url: {
				required: 'Web sitesi URL gerekli',
				url: 'Geçersiz URL'
			},
			first_name: {
				required: 'Ad gerekli',
				minLength: 'En az 2 karakter'
			},
			last_name: {
				required: 'Soyad gerekli',
				minLength: 'En az 2 karakter'
			},
			email: {
				required: 'E-posta gerekli',
				email: 'Geçersiz e-posta'
			},
			phone: {
				required: 'Telefon gerekli',
				pattern: 'Geçersiz format'
			},
			privacy_agreement: {
				required: 'Gizlilik sözleşmesini kabul et'
			}
		}
	},
	results: {
		title: 'Web Siten Analiz Sonucu',
		subtitle: 'Kişiselleştirilmiş Raporun',
		score: {
			title: 'Pazarlama Puanın',
			low: {
				title: 'Kritik! Görünürlüğün çok düşük.',
				suggestion: 'Hemen iyileştirmeye başla'
			},
			medium: {
				title: 'Orta Seviye Görünürlük',
				suggestion: 'Stratejini optimize et'
			},
			high: {
				title: 'İyi! Gelişime açık',
				suggestion: 'Hedefli optimizasyon yap'
			},
			excellent: {
				title: 'Mükemmel! Dijital varlığın harika',
				suggestion: 'İleri seviye teknikler kullan'
			}
		},
		sections: {
			analysis: 'Analiz Sonuçları',
			steps: {
				title: 'Sonraki Adımlar',
				purchase: {
					title: 'Satın Alma',
					description: 'Paket seçimi ve ödeme',
					icon: 'cart'
				},
				scheduling: {
					title: 'Planlama',
					description: 'Uzmanla görüş',
					icon: 'calendar'
				},
				implementation: {
					title: 'Uygulama',
					description: 'Profesyonel entegrasyon',
					icon: 'code'
				},
				handover: {
					title: 'Teslim',
					description: 'Optimize sistem teslimi',
					icon: 'check'
				}
			},
			plans: 'Paketini Seç',
			testimonials: {
				title: 'Başarı Hikayeleri',
				inspiration: 'İLHAM',
				case1: {
					titleLow: "0'dan 100'e: Günlük 3 satış",
					titleHigh: '%43 daha fazla talep artışı',
					quote: 'Sosyal medya kampanyası mükemmel sonuç verdi. Conversion oranlarından memnunuz.',
					author: '- Dr. P. Ullrich, CEO'
				},
				case2: {
					title: 'Etkili SEO ve Reklam Entegrasyonu',
					quote: 'Hızlı landing page ve SEO optimizasyonu. Hedef kitleyle mükemmel etkileşim.',
					author: '- M. Keller, Marka Müdürü'
				}
			},
			improvement: {
				title: 'İyileştirme Yöntemlerimiz',
				steps: [
					{
						title: 'Site Optimizasyonu',
						description: 'Hız ve mobil uyumluluk',
						icon: 'deviceDesktop',
						underScore: 40
					},
					{
						title: 'SEO ve Anahtar Kelimeler',
						description: 'Sektörel optimizasyon',
						icon: 'search',
						underScore: 40
					},
					{
						title: 'Temel Online Varlık',
						description: 'Sağlam temel oluşturma',
						icon: 'home',
						underScore: 40
					},
					{
						title: 'Lokal SEO',
						description: 'Yerel aramalarda görünürlük',
						icon: 'mapPin',
						underScore: 40
					},
					{
						title: 'İçerik Stratejisi',
						description: 'Hedef kitleye özel içerik',
						icon: 'fileText',
						underScore: 60
					},
					{
						title: 'Sosyal Medya Entegrasyonu',
						description: 'Geniş erişim için bağlantı',
						icon: 'share2',
						underScore: 60
					},
					{
						title: 'Conversion Optimizasyonu',
						description: 'Ziyaretçiden müşteriye dönüşüm',
						icon: 'trendingUp',
						underScore: 80
					},
					{
						title: 'İçerik Pazarlama',
						description: 'Uzmanlık gösteren içerik',
						icon: 'edit',
						underScore: 80
					}
				]
			},
			cta: {
				title: 'Dijital dönüşüme hazır mısın?',
				subtitle: 'Paketini seç ve başarıya adım at!',
				button: 'Paket Seç'
			}
		},
		strengths: {
			title: 'Güçlü Yönlerin',
			goodBasics: 'İyi dijital temeller',
			regularContent: 'Düzenli içerik üretimi',
			understanding: 'Temel dijital pazarlama bilgisi',
			quickImprovement: 'Hızlı iyileştirme potansiyeli',
			growthPotential: 'Yüksek büyüme potansiyeli',
			visibilityGain: 'Hızlı görünürlük artışı',
			socialPresence: 'Sosyal medya varlığı',
			seoUnderstanding: 'SEO bilgisi',
			digitalTransformation: 'Dijital dönüşüme açık'
		},
		weaknesses: {
			title: 'Gelişim Alanları',
			poorVisibility: 'Düşük online görünürlük',
			noStrategy: 'Pazarlama stratejisi eksik',
			poorOptimization: 'Zayıf site optimizasyonu',
			limitedReach: 'Sınırlı arama erişimi',
			underdevelopedContent: 'Gelişmemiş içerik stratejisi',
			poorConversion: 'Conversion optimizasyon eksik',
			contentDistribution: 'İçerik dağıtım zayıflığı',
			competitorAnalysis: 'Rekabet analizi eksik',
			conversionRate: 'Conversion oranı düşük'
		},
		benefits: {
			title: 'Avantajların',
			visibility: "Google'da daha üst sıralar",
			traffic: 'Kaliteli ziyaretçi artışı',
			conversion: 'Daha yüksek conversion oranı',
			searchEngines: 'Anahtar kelimelerde iyileşme',
			socialMedia: 'Sosyal medyada güçlenme',
			newClients: 'Hedefli müşteri kazanımı',
			newEmployees: 'İşe alım kolaylığı'
		},
		recommendations: {
			title: 'Önerilerimiz',
			website: 'Kullanıcı deneyimi iyileştirme',
			content: 'Görünürlük için içerik stratejisi',
			performance: 'Görsel optimizasyon ve hız',
			seo: 'Meta etiket ve yapısal iyileştirme',
			accessibility: 'Erişilebilirlik artırımı',
			contentQuality: 'Anahtar kelime optimizasyonu',
			basicSeo: 'Temel SEO ayarları',
			googleBusiness: 'Google İşletme Profili',
			advancedSeo: 'İleri SEO teknikleri',
			localSeo: 'Lokal arama optimizasyonu',
			contentMarketing: 'İçerik pazarlama planı',
			backlinks: 'Backlink stratejisi',
			extendedContent: 'Genişletilmiş içerik planı',
			competitorAnalysis: 'Rekabet analizi'
		},
		expertProfile: {
			name: 'Christopher Matt',
			role: 'Dijital Pazarlama Uzmanı',
			bio: '10+ yıllık deneyimle şirketlerin online varlığını güçlendiriyor. Google Partner ve sosyal medya uzmanı.',
			imageUrl:
				'https://www.chooomedia.de/wp-content/uploads/2023/03/chooomedia-christopher-matt-ceo-freelancer-webdesigner-ui-designer-information-designer-500x500px__1_-removebg-preview.png',
			imageAlt: 'Christopher Matt - Uzman',
			badges: {
				googlePartner: {
					label: 'Google Partner',
					value: '',
					icon: 'google'
				},
				customers: {
					label: 'Müşteri',
					value: '220+',
					icon: 'users'
				},
				experience: {
					label: 'Deneyim',
					value: '10+ Yıl',
					icon: 'experience'
				}
			}
		},
		buttons: {
			restart: 'Testi Yeniden Başlat',
			getReport: 'Raporu E-postayla Al',
			emailError: 'Sonuçları almak için lütfen forma bir e-posta adresi gir.'
		},
		screenshot: {
			alt: 'Website Ekran Görüntüsü',
			unsupported: 'Desteklenmeyen format'
		}
	},
	meta: {
		title: 'Dijital Pazarlama Analizi',
		description: 'Ücretsiz pazarlama değerlendirmesi ile öneriler alın',
		breadcrumb: 'Pazarlama Analizi'
	},
	pricing: {
		perDay: 'Günlük',
		features: {
			websiteOptimization: 'Site Optimizasyonu',
			basicSeo: 'Temel SEO',
			monthlyContent: 'Aylık İçerik',
			performanceReport: 'Performans Raporu',
			allBasicFeatures: 'Tüm temel özellikler',
			socialMedia: 'Sosyal Medya Yönetimi',
			weeklyContent: 'Haftalık İçerik',
			keywordOptimization: 'Anahtar Kelime Optimizasyonu',
			competitorAnalysis: 'Rekabet Analizi',
			allPremiumFeatures: 'Tüm premium özellikler',
			marketingStrategy: 'Kapsamlı Strateji',
			dailyContent: 'Günlük İçerik',
			sem: 'Arama Motoru Reklamcılığı',
			personalManager: 'Kişisel Danışman',
			cro: 'Conversion Optimizasyonu'
		},
		included: {
			longtermBusiness: 'Uzun vadeli online iş modeli',
			viralContent: 'Viral içerik konseptleri',
			expertFrameworks: "Uzman framework'leri",
			targetedStrategies: 'Veriye dayalı stratejiler'
		},
		excluded: {
			getRichQuick: 'Hızlı zengin olma planları',
			noContracts: 'Uzun sözleşme yok',
			noInvestment: 'Gereksiz yatırım yok',
			pyramidSchemes: 'MLM veya dropshipping yok'
		},
		includedTitle: 'Dahil',
		inAllPlans: 'tüm paketlerde',
		excludedTitle: 'Dahil Değil',
		notWorking: 'yöntemler',
		choosePlan: 'Paket Seç',
		header: {
			title: 'İhtiyacına Uygun Paketi Seç',
			subtitle: '{score} puanına göre önerilen paket:'
		},
		countdown: {
			title: 'Özel Teklif!',
			subtitle: 'Bitiş:'
		},
		bonusBox: {
			tag: 'ÖZEL HEDİYE',
			title: 'Ücretsiz SEO Makalesi',
			description: 'Hemen görünürlüğünü artır!',
			benefits: ['Kişiye özel içerik', 'SEO optimize', 'Anında etki'],
			value: 'Değer: 99€',
			limited: 'Sınırlı süre'
		},
		paymentOptions: {
			title: 'Ödeme Seçenekleri:',
			monthly: 'Aylık',
			oneTime: 'Tek Ödeme (-%8)',
			longTime: 'Enterprise (-%20)', // Değişiklik: 'Longtime' yerine
			hotLabel: 'POPÜLER'
		},
		planLabels: {
			oneTime: 'TEK SEFER',
			oneMonth: '1 AYLIK',
			threeMonth: '3 AYLIK',
			sixMonth: '6 AYLIK',
			popular: '★ TAVSİYE EDİLEN',
			longTimeSuffix: {
				oneMonth: 'ENTERPRISE TEMEL',
				threeMonth: 'ENTERPRISE PREMIUM',
				business: 'ENTERPRISE İŞ'
			}
		},
		additionalBenefits: {
			oneTime: ['%8 indirim', 'Abonelik yok'],
			longTime: ['1 yıl erişim', '%20 indirim', 'Tüm güncellemeler'], // Değişiklik: '5 yıl erişim' yerine
			savings: 'Tasarruf',
			savingsOption: 'bu seçenekle!'
		},
		ctaButton: {
			monthly: 'ABONE OL',
			oneTime: 'SATIN AL',
			longTime: 'ENTERPRISE PAKET', // Değişiklik: 'UZUN PAKET' yerine
			selectPlan: 'Seç'
		},
		savings: 'Tasarruf Edilen',
		trustBadges: ['Güvenli ödeme', '30 gün garantisi'],
		consultationText: 'Yoksa güvenli oynamak mı istiyorsun?',
		consultationLink: 'Ücretsiz danışmanlık randevusu al',
		discountBanner: {
			title: 'Enterprise Paketi', // Değişiklik: 'Uzun Süre Paketi' yerine
			discount: ' %20 indirimle!',
			description: '1 yıllık erişim tek ödemeyle! <span class="font-bold">Hemen al!</span>', // Değişiklik: '5 yıllık' yerine
			buttonText: 'Hemen Al'
		},
		terms: {
			monthly: {
				main: '{selectedPlan} paketi {totalPrice.toFixed(2)}€/ay ile otomatik yenilenir. İptal: abo@digitalpusher.de',
				reminder: 'Yenileme öncesi 5 gün bildirim'
			},
			oneTime: 'Tek seferlik {totalPrice.toFixed(2)}€ ödeme. 1 yıl erişim.',
			acceptance: '"Satın Al"a tıklayarak şartları kabul edersiniz.'
		}
	},
	footer: {
		copyright: 'Tüm hakları saklıdır.'
	},
	modal: {
		common: {
			close: 'Kapat',
			cancel: 'İptal',
			confirm: 'Onayla',
			back: 'Geri'
		},
		payment: {
			title: 'Ödemeyi Tamamla',
			subtitle: 'Ödeme yöntemi seç',
			testButton: 'Test Ödemesi',
			testDescription: 'Test hesabıyla deneme',
			summary: {
				title: 'Özet',
				monthly: 'Aylık ödeme',
				oneTime: 'Tek ödeme',
				longtime: 'Enterprise paketi', // Değişiklik: 'Uzun paket' yerine
				discount: 'İndirim',
				donation: 'Bağış içerir',
				tax: 'KDV dahil'
			},
			securityBadges: {
				secure: 'SSL Güvenli',
				protection: 'Güvenli ödeme',
				instant: 'Anında erişim'
			},
			donationBox: {
				title: '+%3 bağış',
				description: 'Çevre projelerine destek'
			},
			errors: {
				general: 'Hata oluştu. Tekrar deneyin.',
				validation: 'Ödeme bilgilerini kontrol et',
				server: 'PayPal hizmeti kapalı',
				timeout: 'İnternet bağlantını kontrol et'
			}
		},
		success: {
			title: 'Ödeme Başarılı!',
			subtitle: 'Teşekkür ederiz!',
			modalInfo: 'İşlem tamamlanana kadar kapatmayın.',
			paymentDetails: {
				plan: 'Hizmet',
				id: 'İşlem ID',
				date: 'Tarih',
				status: 'Durum',
				paid: 'Ödendi'
			},
			shareContent: {
				title: 'Digital Pusher ile Başarım',
				text: 'Dijital dönüşüme Digital Pusher ile başladım! 🚀 #dijitalpazarlama'
			},
			donation: {
				title: 'Katkın İçin Teşekkürler!',
				description: '{amount}€ bağışın çevreye katkı sağlayacak.',
				impact: {
					direct: 'Doğrudan destek',
					projects: 'Projeler',
					transparency: 'Şeffaflık'
				}
			},
			nextSteps: {
				title: 'Sonraki Adımlar:',
				steps: ['E-postanı kontrol et', 'Danışmanlık randevusu al', 'Ekibini davet et']
			},
			upgradeOffer: {
				exclusive: 'ÖZEL',
				title: "Premium'a Geç -%30",
				subtitle: 'Yeni müşterilere özel!',
				countdown: 'Süre:',
				button: 'Yükselt'
			},
			support: {
				confirmation: 'Onay e-postası gönderildi.',
				contact: 'Destek: destek@digitalpusher.com.tr'
			},
			buttons: {
				dashboard: 'Panele Git',
				share: 'Paylaş'
			}
		},
		error: {
			title: 'Ödeme Hatası',
			defaultMessage: 'Bilinmeyen hata',
			details: 'Teknik detaylar',
			support: 'Destekle iletişime geç.',
			retry: 'Tekrar Dene'
		},
		confirm: {
			cancelPurchase: 'İptal etmek istiyor musun?',
			confirmButton: 'Evet, iptal et',
			cancelButton: 'Ödemeye Dön'
		},
		booking: {
			title: 'Ücretsiz danışmanlık randevusu al',
			subtitle:
				'30 dakikalık ücretsiz danışmanlığınız için bir randevu seçin. Bireysel ihtiyaçlarınızı tartışır ve çevrimiçi görünürlüğünüzü nasıl optimize edeceğinizi gösteririz.',
			selectDate: 'Tarih seçin:',
			selectTime: 'Saat seçin:',
			contactInfo: 'İletişim bilgileriniz:',
			confirm: 'Ücretsiz randevu al',
			booking: 'Randevu alınıyor...',
			cancel: 'İptal',
			success: {
				title: 'Randevu başarıyla alındı!',
				message: 'Ücretsiz danışmanlığınız {date} tarihinde {time} saatinde rezerve edildi.',
				details:
					'Yakında tüm detaylar ve toplantı linki ile birlikte bir onay e-postası alacaksınız.'
			}
		}
	},
	waitingScreen: {
		title: 'Analiz Devam Ediyor - Lütfen Bekleyin.',
		redirect: 'Sonuç {remainingTime} içinde'
	},
	email: {
		subject: '{company_url} Şirketiniz için Web Sitesi Analiz Sonuçları',
		greeting: 'Sayın {firstName} {lastName}',
		results: {
			title: 'Web Sitesi Analiz Sonuçları',
			description:
				'{currentDate} tarihli <strong>{company_url}</strong> için <strong>Web Sitesi Analiz Sonuçlarınız</strong> aşağıdadır.',
			visibilityScore: 'Görünürlük Puanınız: {score}/100',
			scoreDescription: 'Mevcut çevrimiçi varlığınız ve pazarlama stratejinize dayanarak'
		},
		situation: {
			title: '📊 Mevcut Durumunuz',
			visibility: 'Görünürlük:',
			advertisingFrequency: 'Reklam Sıklığı:',
			goals: 'Hedefler:',
			campaignManagement: 'Kampanya Yönetimi:',
			businessPhase: 'Şirket Aşaması:',
			implementationTime: 'Uygulama Zaman Çerçevesi:'
		},
		cta: {
			title: '🎯 Size Özel Teklif',
			description:
				'Kişisel danışmanlık görüşmesinde daha fazla çevrimiçi görünürlük için <span class="secrets-highlight">5 ücretsiz gizli ipucu</span> edinin.',
			highlight: '5 ücretsiz gizli ipucu',
			urgency: '⚡ Sadece sınırlı süre için geçerlidir!',
			button: '🎁 5 Gizli İpucunu Ücretsiz Alın'
		},
		footer: {
			copyright: '© 2025 Digitalpusher - Tüm hakları saklıdır',
			unsubscribe: 'Bülten aboneliğinden çıkın',
			privacy: 'Gizlilik',
			imprint: 'İletişim Bilgileri',
			disclaimer:
				'Bu e-postayı, platformumuzda bir web sitesi analizi gerçekleştirdiğiniz için aldınız.'
		}
	}
};

export default tr;
