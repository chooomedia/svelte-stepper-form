import type { Translation } from '../types';
import { getCommonTranslation } from './common';

const ro: Translation = {
	start: {
		title: 'Test de Marketing',
		text: 'Calculează-ți <strong>vizibilitatea online</strong>, crește-ți <strong>acoperirea</strong>, economisește <strong>resurse</strong> și mărește-ți <strong>vânzările</strong>.',
		meta: {
			rating: {
				user: 'Utilizator',
				from: 'din',
				quiztime: 'minute test'
			}
		}
	},
	common: getCommonTranslation('ro'),
	forms: {
		labels: {
			company_name: 'Nume companie',
			company_url: 'URL website',
			salutation: 'Formulă de adresare',
			first_name: 'Prenume',
			last_name: 'Nume',
			email: 'E-mail',
			phone: 'Telefon',
			privacy_agreement: 'Politica de confidențialitate',
			marketing_consent: 'Newsletter'
		},
		salutation: {
			select: 'Selectează formula',
			male: 'Domnul',
			female: 'Doamna',
			diverse: 'Diverse'
		},
		imageOption: {
			continueIn: 'continuă în',
			second: 'secundă',
			seconds: 'secunde',
			selectUpTo: 'Poți selecta până la {max} opțiuni',
			selectAllApplicable: 'Selectează toate opțiunile relevante'
		},
		placeholders: {
			select: 'Selectează',
			salutation: 'Alege formula de adresare',
			first_name: 'Introdu prenumele',
			last_name: 'Introdu numele',
			email: 'Introdu e-mail',
			phone: 'Telefon (opțional)',
			privacy_agreement: 'Acceptă politica de confidențialitate',
			privacy_policy: 'Politica de confidențialitate',
			newsletter_terms: 'Termenii newsletter-ului',
			company_url: 'https://www.siteultau.ro'
		},
		errors: {
			required: 'Câmp obligatoriu',
			url: 'Introdu un URL valid',
			email: 'Introdu o adresă validă'
		},
		descriptions: {
			company_url: 'Introdu URL-ul site-ului și apasă "Analizează" pentru raport detaliat.',
			analyze: 'Apasă "Analizează" pentru verificarea site-ului',
			privacy_agreement: 'Accept',
			marketing_consent: 'Doresc newsletter și accept'
		},
		checkpoints: {
			performance: 'Test performanță',
			seo: 'Analiză SEO',
			accessibility: 'Test accesibilitate',
			security: 'Verificare securitate'
		},
		seotips: {
			headline: 'Analiza site-ului tău',
			title: 'Sfat SEO în timpul analizei:',
			default: [
				'Folosește titluri precise (Title Tag)',
				'Descrieri meta unice pentru fiecare pagină',
				'Un singur titlu H1 pe pagină',
				'Optimizează imaginile cu text alternativ',
				'Structură clară a site-ului',
				'Design responsive pentru mobile',
				'Îmbunătățește viteza de încărcare',
				'Folosește link-uri interne',
				'Creează conținut de calitate',
				'Implementează markup Schema.org',
				'Generează sitemap XML',
				'Folosește conexiune HTTPS',
				'Verifică link-uri defectuoase',
				'Optimizează tag-uri Open Graph'
			]
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'vizibilitate',
				description: 'Unde este afișată compania ta?'
			},
			company_url: {
				title: 'url_companie',
				description: 'Ești gata pentru analiză?'
			},
			advertising_frequency: {
				title: 'frecventa_reclame',
				description: 'Cât de des faci reclame?'
			},
			goals: {
				title: 'obiective',
				description: 'Ce vrei să obții?'
			},
			campaign_management: {
				title: 'management_campanii',
				description: 'Cine gestionează reclamele?'
			},
			online_reviews: {
				title: 'recenzii_online',
				description: 'Cum te evaluează clienții?'
			},
			previous_campaigns: {
				title: 'campanii_anterioare',
				description: 'Experiență cu reclame online'
			},
			business_phase: {
				title: 'faza_afacerii',
				description: 'În ce fază este afacerea ta?'
			},
			implementation_time: {
				title: 'perioada_implementare',
				description: 'Intervalul preferat'
			},
			company_info: {
				title: 'informatii_companie',
				description: 'Detalii companie'
			},
			waitingscreen: {
				title: 'asteptare',
				description: 'Se procesează cererea'
			},
			result: {
				title: 'rezultat',
				description: 'Analiza site-ului tău'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'Motoare de căutare',
					description: 'Prezență pe Google'
				},
				social_media: {
					label: 'Rețele sociale',
					description: 'Prezență pe Facebook'
				},
				print: {
					label: 'Tipărit',
					description: 'Reclame tradiționale'
				},
				store: {
					label: 'Magazin fizic',
					description: 'Prezență fizică'
				}
			},
			advertising_frequency: {
				weekly: {
					label: 'Săptămânal',
					description: 'Actualizări săptămânale'
				},
				monthly: {
					label: 'Lunar',
					description: 'Campanii lunare'
				},
				yearly: {
					label: 'Anual',
					description: 'Campanii anuale'
				}
			},
			goals: {
				new_clients: {
					label: 'Clienți noi',
					description: 'Atragere clienți'
				},
				new_employees: {
					label: 'Angajați noi',
					description: 'Recrutare personal'
				},
				more_online: {
					label: 'Prezență online',
					description: 'Creștere vizibilitate'
				},
				all: {
					label: 'Toate',
					description: 'Soluție completă'
				}
			},
			campaign_management: {
				self: {
					label: 'Eu însumi',
					description: 'Autogestiune'
				},
				digitalpusher: {
					label: 'Digitalpusher',
					description: 'Gestionare profesională'
				},
				employee: {
					label: 'Angajat',
					description: 'Gestionare internă'
				}
			},
			online_reviews: {
				positive: {
					label: 'Pozitive',
					description: 'Recenzii bune'
				},
				negative: {
					label: 'Negative',
					description: 'Necesită îmbunătățiri'
				},
				none: {
					label: 'Fără recenzii',
					description: 'Nu există recenzii'
				}
			},
			previous_campaigns: {
				yes: {
					label: 'Da',
					description: 'Am experiență'
				},
				no: {
					label: 'Nu',
					description: 'Fără experiență'
				},
				would_like: {
					label: 'Aș dori',
					description: 'Interesat'
				}
			},
			business_phase: {
				planning: {
					label: 'În planificare',
					description: 'Fază de planificare'
				},
				less_than_6_months: {
					label: 'Sub 6 luni',
					description: 'Companie nouă'
				},
				more_than_6_months: {
					label: 'Peste 6 luni',
					description: 'Companie stabilă'
				},
				family_business: {
					label: 'Afacere familială',
					description: 'Companie familială'
				}
			},
			implementation_time: {
				immediate: {
					label: 'Imediat',
					description: 'Implementare rapidă'
				},
				medium: {
					label: '2-6 luni',
					description: 'Planificare medie'
				},
				long_term: {
					label: 'Peste 6 luni',
					description: 'Strategie pe termen lung'
				}
			}
		},
		metrics: {
			seo: {
				label: 'SEO',
				description: 'Optimizare motoare căutare'
			},
			performance: {
				label: 'Performanță',
				description: 'Viteză încărcare'
			},
			accessibility: {
				label: 'Accesibilitate',
				description: 'Accesibilitate site'
			},
			bestPractices: {
				label: 'Bune practici',
				description: 'Conformitate standarde'
			},
			content: {
				label: 'Conținut',
				description: 'Calitate conținut'
			},
			security: {
				label: 'Securitate',
				description: 'Nivel securitate'
			},
			currentValue: 'Curent',
			improvedValue: 'După optimizare',
			average: 'Medie',
			optimal: 'Optim'
		},
		validation: {
			required: 'Câmp obligatoriu',
			visibility: {
				required: 'Selectează cel puțin o opțiune',
				minSelection: 'Minim 1 selecție necesară'
			},
			advertising_frequency: {
				required: 'Selectează frecvența',
				minSelection: 'Minim 1 selecție necesară'
			},
			goals: {
				required: 'Selectează obiective',
				minSelection: 'Minim 1 obiectiv necesar'
			},
			campaign_management: {
				required: 'Selectează gestionarea',
				minSelection: 'Minim 1 selecție necesară'
			},
			online_reviews: {
				required: 'Selectează evaluarea',
				minSelection: 'Minim 1 selecție necesară'
			},
			previous_campaigns: {
				required: 'Selectează experiența',
				minSelection: 'Minim 1 selecție necesară'
			},
			business_phase: {
				required: 'Selectează faza',
				minSelection: 'Minim 1 selecție necesară'
			},
			implementation_time: {
				required: 'Selectează perioada',
				minSelection: 'Minim 1 selecție necesară'
			},
			company_name: {
				required: 'Numele companiei este necesar',
				minLength: 'Minim 2 caractere'
			},
			company_url: {
				required: 'URL site necesar',
				url: 'URL invalid'
			},
			first_name: {
				required: 'Prenume necesar',
				minLength: 'Minim 2 caractere'
			},
			last_name: {
				required: 'Nume necesar',
				minLength: 'Minim 2 caractere'
			},
			email: {
				required: 'E-mail necesar',
				email: 'E-mail invalid'
			},
			phone: {
				required: 'Telefon necesar',
				pattern: 'Format invalid'
			},
			privacy_agreement: {
				required: 'Acceptă politica de confidențialitate'
			}
		}
	},
	results: {
		title: 'Analiza site-ului tău',
		subtitle: 'Raport personalizat',
		score: {
			title: 'Scorul tău de marketing',
			low: {
				title: 'Critic! Vizibilitate scăzută.',
				suggestion: 'Îmbunătățește-ți prezența online'
			},
			medium: {
				title: 'Vizibilitate medie',
				suggestion: 'Optimizează strategia'
			},
			high: {
				title: 'Bun! Potențial de creștere',
				suggestion: 'Optimizări țintite'
			},
			excellent: {
				title: 'Excelent! Prezență digitală puternică',
				suggestion: 'Strategii avansate'
			}
		},
		sections: {
			analysis: 'Rezultate analiză',
			steps: {
				title: 'Următorii pași',
				purchase: {
					title: 'Cumpărare',
					description: 'Alege și plasează comanda',
					icon: 'cart'
				},
				scheduling: {
					title: 'Programare',
					description: 'Consultanță cu expertul',
					icon: 'calendar'
				},
				implementation: {
					title: 'Implementare',
					description: 'Integrare profesională',
					icon: 'code'
				},
				handover: {
					title: 'Predare',
					description: 'Primești sistemul optimizat – configurat complet, gata să convertească',
					icon: 'check'
				}
			},
			plans: 'Alege planul',
			testimonials: {
				title: 'Cazuri de succes',
				inspiration: 'INSPIRAȚIE',
				case1: {
					titleLow: 'De la 0 la 100% vizibilitate',
					titleHigh: '+43% cereri cu strategie nouă',
					quote: 'Campania pe social media a dat rezultate excelente. Mulțumim!',
					author: '- Dr. P. Ullrich, CEO'
				},
				case2: {
					title: 'SEO și reclame țintite',
					quote: 'Optimizare rapidă și conversii mari. Recomand!',
					author: '- M. Keller, Manager'
				}
			},
			improvement: {
				title: 'Cum îmbunătățim rezultatele',
				steps: [
					{
						title: 'Optimizare site',
						description: 'Viteză și adaptare mobil',
						icon: 'deviceDesktop',
						underScore: 40
					},
					{
						title: 'SEO și cuvinte cheie',
						description: 'Optimizare pe domeniu',
						icon: 'search',
						underScore: 40
					},
					{
						title: 'Prezență online de bază',
						description: 'Fundație solidă',
						icon: 'home',
						underScore: 40
					},
					{
						title: 'SEO local',
						description: 'Optimizare pentru regiune',
						icon: 'mapPin',
						underScore: 40
					},
					{
						title: 'Strategie conținut',
						description: 'Conținut pentru publicul țintă',
						icon: 'fileText',
						underScore: 60
					},
					{
						title: 'Integrare social media',
						description: 'Extindere acoperire',
						icon: 'share2',
						underScore: 60
					},
					{
						title: 'Optimizare conversie',
						description: 'Transformă vizitatori în clienți',
						icon: 'trendingUp',
						underScore: 80
					},
					{
						title: 'Marketing de conținut',
						description: 'Demonstrează expertiza',
						icon: 'edit',
						underScore: 80
					}
				]
			},
			cta: {
				title: 'Gata pentru transformare?',
				subtitle: 'Alege planul și începe acum!',
				button: 'Alege planul'
			}
		},
		strengths: {
			title: 'Puncte forte',
			goodBasics: 'Baze solide',
			regularContent: 'Conținut regulat',
			understanding: 'Cunoștințe de bază',
			quickImprovement: 'Îmbunătățiri rapide',
			growthPotential: 'Potențial de creștere',
			visibilityGain: 'Creștere rapidă în vizibilitate',
			socialPresence: 'Prezență pe social media',
			seoUnderstanding: 'Înțelegere SEO',
			digitalTransformation: 'Deschidere la inovație'
		},
		weaknesses: {
			title: 'Puncte slabe',
			poorVisibility: 'Vizibilitate redusă',
			noStrategy: 'Lipsă strategie',
			poorOptimization: 'Optimizare slabă',
			limitedReach: 'Acoperire limitată',
			underdevelopedContent: 'Conținut neoptimizat',
			poorConversion: 'Rata scăzută de conversie',
			contentDistribution: 'Distribuire neeficientă',
			competitorAnalysis: 'Lipsă analiză competiție',
			conversionRate: 'Rata conversie îmbunătățită'
		},
		benefits: {
			title: 'Beneficii',
			visibility: 'Pozitionare mai bună în Google',
			traffic: 'Trafic calitativ crescut',
			conversion: 'Rata de conversie mai bună',
			searchEngines: 'Cuvinte cheie relevante',
			socialMedia: 'Prezență social media îmbunătățită',
			newClients: 'Strategii de atragere clienți',
			newEmployees: 'Portal cariere optimizat'
		},
		recommendations: {
			title: 'Recomandări',
			website: 'Optimizare experiență utilizator',
			content: 'Strategie conținut pentru vizibilitate',
			performance: 'Îmbunătățire viteză încărcare',
			seo: 'Meta tag-uri și date structurate',
			accessibility: 'Îmbunătățire accesibilitate',
			contentQuality: 'Optimizare conținut cu cuvinte cheie',
			basicSeo: 'Setări SEO de bază',
			googleBusiness: 'Profil Google Business',
			advancedSeo: 'Tehnici SEO avansate',
			localSeo: 'Optimizare căutări locale',
			contentMarketing: 'Strategie marketing de conținut',
			backlinks: 'Construire backlink-uri',
			extendedContent: 'Strategie extinsă de conținut',
			competitorAnalysis: 'Analiză competitie'
		},
		expertProfile: {
			name: 'Christopher Matt',
			role: 'Expert Marketing Digital',
			bio: '10+ ani experiență în optimizare online. Partener Google certificat.',
			imageUrl:
				'https://www.chooomedia.de/wp-content/uploads/2023/03/chooomedia-christopher-matt-ceo-freelancer-webdesigner-ui-designer-information-designer-500x500px__1_-removebg-preview.png',
			imageAlt: 'Christopher Matt - Expert',
			badges: {
				googlePartner: {
					label: 'Partener Google',
					value: '',
					icon: 'google'
				},
				customers: {
					label: 'Clienți',
					value: '220+',
					icon: 'users'
				},
				experience: {
					label: 'Experiență',
					value: '10+ ani',
					icon: 'experience'
				}
			}
		},
		buttons: {
			restart: 'Reîncepe testul',
			getReport: 'Primește raportul',
			emailError: 'Te rugăm să introduci o adresă de e-mail în formular pentru a primi rezultatele.'
		},
		screenshot: {
			alt: 'Captură website',
			unsupported: 'Format neacceptat'
		}
	},
	meta: {
		title: 'Audit de Marketing',
		description: 'Analiză gratuită cu recomandări personalizate',
		breadcrumb: 'Analiză Marketing'
	},
	pricing: {
		perDay: 'Pe zi',
		features: {
			websiteOptimization: 'Optimizare website',
			basicSeo: 'SEO de bază',
			monthlyContent: 'Conținut lunar',
			performanceReport: 'Raport lunar',
			allBasicFeatures: 'Toate funcțiile de bază',
			socialMedia: 'Management social media',
			weeklyContent: 'Conținut săptămânal',
			keywordOptimization: 'Optimizare cuvinte cheie',
			competitorAnalysis: 'Analiză competiție',
			allPremiumFeatures: 'Toate funcțiile premium',
			marketingStrategy: 'Strategie marketing',
			dailyContent: 'Conținut zilnic',
			sem: 'Reclame pe motoare de căutare',
			personalManager: 'Manager personal',
			cro: 'Optimizare conversie'
		},
		included: {
			longtermBusiness: 'Strategie pe termen lung',
			viralContent: 'Conținut viral',
			expertFrameworks: 'Metodologii experți',
			targetedStrategies: 'Strategii bazate pe date'
		},
		excluded: {
			getRichQuick: 'Scheme de îmbogățire rapidă',
			noContracts: 'Fără contracte lungi',
			noInvestment: 'Fără investiții inutile',
			pyramidSchemes: 'Fără MLM sau dropshipping'
		},
		includedTitle: 'Inclus',
		inAllPlans: 'în toate planurile',
		excludedTitle: 'Exclus',
		notWorking: 'metode',
		choosePlan: 'Alege planul',
		header: {
			title: 'Planul perfect pentru tine',
			subtitle: 'Recomandat pentru scorul {score}'
		},
		countdown: {
			title: 'Oferta specială!',
			subtitle: 'Expiră în:'
		},
		bonusBox: {
			tag: 'BONUS',
			title: 'Articol SEO gratuit',
			description: 'Primește conținut optimizat pentru SEO!',
			benefits: ['Personalizat pentru afacerea ta', 'Optimizat SEO', 'Rezultate imediate'],
			value: 'Valoare: 99€',
			limited: 'Timp limitat'
		},
		paymentOptions: {
			title: 'Metode de plată:',
			monthly: 'Lunar',
			oneTime: 'Plată unică (-8%)',
			longTime: 'Enterprise (-20%)', // Schimbat din 'Longtime'
			hotLabel: 'POPULAR'
		},
		planLabels: {
			oneTime: 'PLATĂ UNICĂ',
			oneMonth: '1 LUNA',
			threeMonth: '3 LUNI',
			sixMonth: '6 LUNI',
			popular: '★ RECOMANDAT',
			longTimeSuffix: {
				oneMonth: 'ENTERPRISE DE BAZĂ',
				threeMonth: 'ENTERPRISE PREMIUM',
				business: 'ENTERPRISE BUSINESS'
			}
		},
		additionalBenefits: {
			oneTime: ['Reducere 8%', 'Fără abonament'],
			longTime: ['Acces 1 an', 'Reducere 20%', 'Toate actualizările'], // Schimbat din 'Acces 5 ani'
			savings: 'Economisești',
			savingsOption: 'cu această opțiune!'
		},
		ctaButton: {
			monthly: 'ABONEAZĂ-TE',
			oneTime: 'CUMPĂRĂ',
			longTime: 'ENTERPRISE', // Schimbat din 'LONGTIME'
			selectPlan: 'Alege'
		},
		savings: 'Economisit',
		trustBadges: ['Plată securizată', 'Garantie 30 zile'],
		consultationText: 'Sau vrei să joci la sigur?',
		consultationLink: 'Rezervă consultație gratuită',
		discountBanner: {
			title: 'Acces Enterprise', // Schimbat din 'Acces Longtime'
			discount: ' cu 20% reducere!',
			description: 'Acces 1 an cu o singură plată! <span class="font-bold">Acum!</span>', // Schimbat din 'Acces 5 ani'
			buttonText: 'Alege!'
		},
		terms: {
			monthly: {
				main: 'Planul {selectedPlan} se reînnoiește automat la {totalPrice.toFixed(2)}€/lună. Anulează: abo@digitalpusher.de.',
				reminder: 'Notificare cu 5 zile înainte'
			},
			oneTime: 'Plată unică {totalPrice.toFixed(2)}€. Acces 1 an.',
			acceptance: 'Apăsând "Cumpără" accepti termenii.'
		}
	},
	footer: {
		copyright: 'Toate drepturile rezervate.'
	},
	modal: {
		common: {
			close: 'Închide',
			cancel: 'Anulează',
			confirm: 'Confirmă',
			back: 'Înapoi'
		},
		payment: {
			title: 'Finalizează plata',
			subtitle: 'Alege metoda de plată',
			testButton: 'Testare plată',
			testDescription: 'Tranzacție test cu cont sandbox',
			summary: {
				title: 'Sumar',
				monthly: 'Abonament lunar',
				oneTime: 'Plată unică',
				longtime: 'Acces Enterprise',
				discount: 'Reducere',
				donation: 'Cu donație',
				tax: 'Inclus TVA'
			},
			securityBadges: {
				secure: 'Securizat SSL',
				protection: 'Protecție cumpărători',
				instant: 'Acces instant'
			},
			donationBox: {
				title: '+3% pentru mediu',
				description: '93% merge direct la proiecte'
			},
			errors: {
				general: 'Eroare. Încearcă mai târziu.',
				validation: 'Verifică datele',
				server: 'Eroare PayPal',
				timeout: 'Verifică conexiunea'
			}
		},
		success: {
			title: 'Plată reușită!',
			subtitle: 'Mulțumim pentru cumpărare!',
			modalInfo: 'Nu închide fereastra până la finalizare.',
			paymentDetails: {
				plan: 'Serviciu',
				id: 'ID tranzacție',
				date: 'Dată',
				status: 'Status',
				paid: 'Plătit'
			},
			shareContent: {
				title: 'Succesul meu cu Digital Pusher',
				text: 'Am început transformarea digitală cu Digital Pusher! 🚀 #marketingdigital'
			},
			donation: {
				title: 'Mulțumim pentru donație!',
				description: '{amount}€ ajută proiecte ecologice.',
				impact: {
					direct: 'Ajutor direct',
					projects: 'Proiecte',
					transparency: 'Transparență'
				}
			},
			nextSteps: {
				title: 'Următorii pași:',
				steps: ['Verifică e-mailul', 'Programează consultanța', 'Invită echipa']
			},
			upgradeOffer: {
				exclusive: 'EXCLUSIV',
				title: 'Upgrade Premium -30%',
				subtitle: 'Oferta nouă clienți!',
				countdown: 'Expiră în:',
				button: 'Upgrade'
			},
			support: {
				confirmation: 'Confirmare trimisă pe e-mail.',
				contact: 'Suport: support@digitalpusher.ro'
			},
			buttons: {
				dashboard: 'Panou control',
				share: 'Distribuie'
			}
		},
		error: {
			title: 'Eroare plată',
			defaultMessage: 'Eroare necunoscută',
			details: 'Detalii tehnice',
			support: 'Contactează suportul.',
			retry: 'Reîncearcă'
		},
		confirm: {
			cancelPurchase: 'Anulezi comanda?',
			confirmButton: 'Da, anulează',
			cancelButton: 'Continuă plata'
		},
		booking: {
			title: 'Rezervă consultație gratuită',
			subtitle:
				'Alege o programare pentru consultația ta gratuită de 30 de minute. Discutăm nevoile tale individuale și îți arătăm cum să îți optimizezi vizibilitatea online.',
			selectDate: 'Selectează data:',
			selectTime: 'Selectează ora:',
			contactInfo: 'Informațiile tale de contact:',
			confirm: 'Rezervă programare gratuită',
			booking: 'Se rezervă programarea...',
			cancel: 'Anulează',
			success: {
				title: 'Programarea rezervată cu succes!',
				message: 'Consultația ta gratuită a fost rezervată pentru {date} la {time}.',
				details:
					'Vei primi în curând un e-mail de confirmare cu toate detaliile și link-ul pentru întâlnire.'
			}
		}
	},
	waitingScreen: {
		title: 'Analiză în curs - Te rugăm așteaptă.',
		redirect: 'Rezultat în {remainingTime}'
	},
	email: {
		subject: 'Rezultatele analizei site-ului dvs. pentru {company_url}',
		greeting: 'Bună {firstName} {lastName}',
		results: {
			title: 'Rezultate analiză site web',
			description:
				'Iată <strong>rezultatele analizei site-ului</strong> pentru <strong>{company_url}</strong> din {currentDate}.',
			visibilityScore: 'Scorul dvs. de vizibilitate: {score}/100',
			scoreDescription: 'Bazat pe prezența online actuală și strategia de marketing'
		},
		situation: {
			title: '📊 Situația dvs. actuală',
			visibility: 'Vizibilitate:',
			advertisingFrequency: 'Frecvența publicității:',
			goals: 'Obiective:',
			campaignManagement: 'Gestionarea campaniei:',
			businessPhase: 'Faza companiei:',
			implementationTime: 'Termenul de implementare:'
		},
		cta: {
			title: '🎯 Oferta exclusivă pentru dvs.',
			description:
				'Asigurați-vă <span class="secrets-highlight">5 sfaturi secrete gratuite</span> pentru o vizibilitate online sporită într-o consultație personală.',
			highlight: '5 sfaturi secrete gratuite',
			urgency: '⚡ Disponibil doar pentru timp limitat!',
			button: '🎁 Obțineți 5 sfaturi secrete gratuit'
		},
		secrets: {
			title: '🔒 Sfaturi secrete pentru succesul online',
			subtitle:
				'Descoperă strategiile pe care le folosesc clienții noștri pentru a-și dubla vizibilitatea în doar 30 de zile'
		},
		sharing: {
			positive:
				'🎉 Clienții raportează lead-uri mai bune după optimizările noastre. Împărtășește rezultatul cu un coleg — de obicei asta creează cel mai bun impuls de creștere.',
			negative:
				'💡 Folosește aceste sfaturi ca punct de plecare — suntem bucuroși să ajutăm la implementare. Împărtășește rezultatele tale și inspiră alți antreprenori!'
		},
		links: {
			shareEmail: 'Împărtășește prin Email',
			shareWhatsApp: 'Share',
			bookCalendar: 'Rezervă & Calendar'
		},
		footer: {
			copyright: '© 2025 Digitalpusher - Toate drepturile rezervate',
			unsubscribe: 'Dezabonare de la newsletter',
			privacy: 'Confidențialitate',
			imprint: 'Informații juridice',
			disclaimer:
				'Acest e-mail a fost trimis la {email}. Vă rugăm să nu răspundeți direct la acest mesaj.'
		}
	}
};

export default ro;
