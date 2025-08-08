import type { Translation } from '../types';

const hu: Translation = {
	start: {
		title: 'Marketing Ellenőrző Kvíz',
		text: 'Most <strong>számítsd ki online láthatóságod</strong>, <strong>növeld elérésed</strong>, <strong>spórolj erőforrásokat</strong> és <strong>növeld bevételed</strong>.',
		meta: {
			rating: {
				user: 'Felhasználó',
				from: ' közül',
				quiztime: 'perces kvíz'
			}
		}
	},
	common: {
		next: 'Tovább',
		skip: 'Kihagyás',
		back: 'Vissza',
		submit: 'Küldés',
		loading: 'Betöltés...',
		error: 'Hiba történt',
		success: 'Siker!',
		analyze: 'Elemzés',
		formErrorHeading: 'Kérjük javítsd a következő hibákat:',
		support: 'Támogatás'
	},
	forms: {
		labels: {
			company_name: 'Cégnév',
			company_url: 'Weboldal URL',
			salutation: 'Megszólítás',
			first_name: 'Keresztnév',
			last_name: 'Vezetéknév',
			email: 'E-mail',
			phone: 'Telefonszám',
			privacy_agreement: 'Adatvédelmi nyilatkozat',
			marketing_consent: 'Hírlevél'
		},
		salutation: {
			select: 'Válassz megszólítást',
			male: 'Úr',
			female: 'Hölgy',
			diverse: 'Egyéb'
		},
		imageOption: {
			continueIn: 'folytatás',
			second: 'másodperc',
			seconds: 'másodperc',
			selectUpTo: 'Legfeljebb {max} lehetőséget választhatsz',
			selectAllApplicable: 'Válassz minden releváns lehetőséget'
		},
		placeholders: {
			select: 'Válassz',
			salutation: 'Válaszd ki a megszólítást',
			first_name: 'Add meg a keresztneved',
			last_name: 'Add meg a vezetékneved',
			email: 'Add meg az e-mail címed',
			phone: 'Telefonszám (opcionális)',
			privacy_agreement: 'Adatvédelmi nyilatkozat elfogadása',
			privacy_policy: 'Adatvédelmi irányelvek',
			newsletter_terms: 'Hírlevél feltételek',
			company_url: 'https://www.weboldalam.hu'
		},
		errors: {
			required: 'Kötelező mező',
			url: 'Érvényes URL-t adj meg',
			email: 'Érvényes e-mail címet adj meg'
		},
		descriptions: {
			company_url:
				'Add meg weboldalad URL-jét és kattints az "Elemzés" gombra egy részletes jelentésért.',
			analyze: 'Kattints az "Elemzés" gombra a weboldalad ellenőrzéséhez',
			privacy_agreement: 'Elfogadom a',
			marketing_consent: 'Szeretnék hírlevelet kapni és elfogadom a'
		},
		checkpoints: {
			performance: 'Teljesítményellenőrzés',
			seo: 'SEO elemzés',
			accessibility: 'Akadálymentesség teszt',
			security: 'Biztonsági ellenőrzés'
		},
		seotips: {
			headline: 'Weboldalad elemzése',
			title: 'SEO tipp az elemzés közben:',
			default: [
				'Használj pontos oldalcímeket (Title Tag) jobb kattintási arányért.',
				'Egyedi meta leírások minden oldalhoz (150-160 karakter).',
				'Egy H1 cím oldalanként, amely egyértelműen kommunikálja a fő témát.',
				'Optimalizáld a képeket alt szövegekkel és tömörítéssel.',
				'Építs fel egy világos weboldal struktúrát logikus URL-ekkel.',
				'Reszponzív design mobil eszközökre.',
				'Javítsd a betöltési sebességet - minden másodperc számít!',
				'Belső linkelés segíti a látogatókat és a keresőket.',
				'Rendszeresen készíts magas minőségű tartalmat.',
				'Schema.org jelölőnyelv használata jobb megjelenésért.',
				'XML oldaltérkép létrehozása és beküldése.',
				'HTTPS kapcsolat használata.',
				'Rendszeres hibás linkek javítása.',
				'Open Graph tag-ek optimalizálása.'
			]
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'láthatóság',
				description: 'Hol található a vállalkozásod?'
			},
			company_url: {
				title: 'weboldal_url',
				description: 'Készen állsz a weboldal elemzésre?'
			},
			advertising_frequency: {
				title: 'reklámgyakoriság',
				description: 'Milyen gyakran hirdetsz?'
			},
			goals: {
				title: 'célok',
				description: 'Mit szeretnél elérni vállalkozásoddal?'
			},
			campaign_management: {
				title: 'kampánykezelés',
				description: 'Ki kezelje a hirdetéseidet?'
			},
			online_reviews: {
				title: 'online értékelések',
				description: 'Hogyan értékelnek az ügyfeleid?'
			},
			previous_campaigns: {
				title: 'korábbi kampányok',
				description: 'Online hirdetési tapasztalat'
			},
			business_phase: {
				title: 'vállalkozási szakasz',
				description: 'Milyen szakaszban van a vállalkozásod?'
			},
			implementation_time: {
				title: 'megvalósítási idő',
				description: 'Kívánt megvalósítási időkeret'
			},
			company_info: {
				title: 'cég információk',
				description: 'Céged adatai'
			},
			waitingscreen: {
				title: 'várakozás',
				description: 'Kérésed feldolgozás alatt'
			},
			result: {
				title: 'eredmény',
				description: 'Intézkedés szükséges: Weboldal elemzésed'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'Keresőmotorok',
					description: 'Jelenlét Google-ban'
				},
				social_media: {
					label: 'Közösségi média',
					description: 'Jelenlét Facebook-on'
				},
				print: {
					label: 'Nyomtatott',
					description: 'Hagyományos nyomtatott hirdetés'
				},
				store: {
					label: 'Üzlet',
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
					label: 'Új ügyfelek',
					description: 'Új ügyfelek szerzése'
				},
				new_employees: {
					label: 'Új munkatársak',
					description: 'Új munkatársak felvétele'
				},
				more_online: {
					label: 'Nagyobb online jelenlét',
					description: 'Nagyobb online láthatóság'
				},
				all: {
					label: 'Mindegyik',
					description: 'Komplex megoldás'
				}
			},
			campaign_management: {
				self: {
					label: 'Én magam',
					description: 'Önálló kezelés'
				},
				digitalpusher: {
					label: 'Digitalpusher',
					description: 'Szakmai kezelés'
				},
				employee: {
					label: 'Munkatárs',
					description: 'Belső kezelés'
				}
			},
			online_reviews: {
				positive: {
					label: 'Inkább pozitív',
					description: 'Jó értékelések'
				},
				negative: {
					label: 'Inkább negatív',
					description: 'Javítási lehetőség'
				},
				none: {
					label: 'Nincsenek',
					description: 'Nincs értékelés'
				}
			},
			previous_campaigns: {
				yes: {
					label: 'Igen',
					description: 'Van tapasztalat'
				},
				no: {
					label: 'Nem',
					description: 'Nincs tapasztalat'
				},
				would_like: {
					label: 'Szeretnék',
					description: 'Érdeklődöm'
				}
			},
			business_phase: {
				planning: {
					label: 'Tervezés alatt',
					description: 'Tervezési szakasz'
				},
				less_than_6_months: {
					label: 'Kevesebb mint 6 hónapos',
					description: 'Fiatal vállalkozás'
				},
				more_than_6_months: {
					label: 'Több mint 6 hónapos',
					description: 'Bejáratott vállalkozás'
				},
				family_business: {
					label: 'Családi vállalkozás',
					description: 'Családi cég'
				}
			},
			implementation_time: {
				immediate: {
					label: 'Azonnal',
					description: 'Villámgyors megvalósítás'
				},
				medium: {
					label: '2-6 hónap',
					description: 'Középtávú tervezés'
				},
				long_term: {
					label: 'Több mint 6 hónap',
					description: 'Hosszú távú stratégia'
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
				description: 'Betöltési sebesség'
			},
			accessibility: {
				label: 'Akadálymentesség',
				description: 'Weboldal hozzáférhetőség'
			},
			bestPractices: {
				label: 'Legjobb gyakorlatok',
				description: 'Webes szabványok'
			},
			content: {
				label: 'Tartalom',
				description: 'Tartalom minősége'
			},
			security: {
				label: 'Biztonság',
				description: 'Védelmi szint'
			},
			currentValue: 'Jelenlegi',
			improvedValue: 'Optimalizált',
			average: 'Átlag',
			optimal: 'Ideális'
		},
		validation: {
			required: 'Kötelező mező',
			visibility: {
				required: 'Válassz legalább egy lehetőséget',
				minSelection: 'Legalább egy választás szükséges'
			},
			advertising_frequency: {
				required: 'Válassz reklámgyakoriságot',
				minSelection: 'Legalább egy választás szükséges'
			},
			goals: {
				required: 'Válassz fő célkitűzést',
				minSelection: 'Legalább egy cél szükséges'
			},
			campaign_management: {
				required: 'Válassz kampánykezelőt',
				minSelection: 'Legalább egy választás szükséges'
			},
			online_reviews: {
				required: 'Add meg az értékeléseket',
				minSelection: 'Legalább egy választás szükséges'
			},
			previous_campaigns: {
				required: 'Add meg korábbi tapasztalatod',
				minSelection: 'Legalább egy választás szükséges'
			},
			business_phase: {
				required: 'Válassz vállalkozási szakaszt',
				minSelection: 'Legalább egy választás szükséges'
			},
			implementation_time: {
				required: 'Válassz időkeretet',
				minSelection: 'Legalább egy választás szükséges'
			},
			company_name: {
				required: 'Cégnév kötelező',
				minLength: 'Legalább 2 karakter'
			},
			company_url: {
				required: 'Weboldal URL kötelező',
				url: 'Érvényes URL szükséges'
			},
			first_name: {
				required: 'Keresztnév kötelező',
				minLength: 'Legalább 2 karakter'
			},
			last_name: {
				required: 'Vezetéknév kötelező',
				minLength: 'Legalább 2 karakter'
			},
			email: {
				required: 'E-mail kötelező',
				email: 'Érvényes e-mail szükséges'
			},
			phone: {
				required: 'Telefonszám kötelező',
				pattern: 'Érvénytelen formátum'
			},
			privacy_agreement: {
				required: 'Fogadd el az adatvédelmi nyilatkozatot'
			}
		}
	},
	results: {
		title: 'Intézkedés szükséges: Weboldal elemzésed',
		subtitle: 'Itt a személyre szabott elemzési jelentésed',
		score: {
			title: 'Marketing Pontszámod',
			low: {
				title: 'Kritikus! Céged alig látható.',
				suggestion: 'Megmutatjuk, hogyan érj el több ügyfelet.'
			},
			medium: {
				title: 'Láthatóságod fejleszthető.',
				suggestion: 'Növeld elérésed okos stratégiákkal.'
			},
			high: {
				title: 'Jó! De van potenciál.',
				suggestion: 'Célzott optimalizációval több láthatóság.'
			},
			excellent: {
				title: 'Kiváló! Digitális jelenléted tökéletes.',
				suggestion: 'Haladó stratégiákkal dominálj!'
			}
		},
		sections: {
			analysis: 'Elemzési eredmények',
			steps: {
				title: 'Mi történik a vásárlás után?',
				purchase: {
					title: 'Vásárlás',
					description: 'Megfelelő csomag kiválasztása',
					icon: 'cart'
				},
				scheduling: {
					title: 'Időpont egyeztetés',
					description: 'Személyes konzultáció',
					icon: 'calendar'
				},
				implementation: {
					title: 'Megvalósítás',
					description: 'Professzionális kivitelezés',
					icon: 'code'
				},
				handover: {
					title: 'Átadás',
					description: 'Optimalizált rendszer átadása',
					icon: 'check'
				}
			},
			plans: 'Válaszd ki a csomagod',
			testimonials: {
				title: 'Sikertörténetek',
				inspiration: 'INSPIRÁCIÓ',
				case1: {
					titleLow: '0-ról 100-ra: Napi 3 ügylet optimalizált láthatósággal',
					titleHigh: 'Áttörés: 43% több megkeresés stratégiai marketinggel',
					quote:
						'Kiváló tanácsokat kaptunk, és a közösségi média kampány eredményes lett. Elégedettek vagyunk a konverziókkal.',
					author: '- Dr. P. Ullrich, Ügyvezető'
				},
				case2: {
					title: 'Hatékony megvalósítás: SEO és célzott hirdetések',
					quote:
						'A landing page és SEO gyorsan készült, a kampány kiválóan működött célzott közönséggel. Ajánlom!',
					author: '- M. Keller, Márkamenedzser'
				}
			},
			improvement: {
				title: 'Hogyan javítjuk eredményeidet',
				steps: [
					{
						title: 'Weboldal optimalizálás',
						description: 'Gyorsabb betöltés, mobilbarát design.',
						icon: 'deviceDesktop',
						underScore: 40
					},
					{
						title: 'SEO és kulcsszavak',
						description: 'Iparág-specifikus keresőoptimalizálás.',
						icon: 'search',
						underScore: 40
					},
					{
						title: 'Alap online jelenlét',
						description: 'Szilárd online alapok kialakítása.',
						icon: 'home',
						underScore: 40
					},
					{
						title: 'Helyi SEO',
						description: 'Helyi keresések optimalizálása.',
						icon: 'mapPin',
						underScore: 40
					},
					{
						title: 'Tartalom stratégia',
						description: 'Célközönségre szabott tartalmak.',
						icon: 'fileText',
						underScore: 60
					},
					{
						title: 'Közösségi média integráció',
						description: 'Nagyobb elérés social médián.',
						icon: 'share2',
						underScore: 60
					},
					{
						title: 'Konverzió optimalizálás',
						description: 'Több látogató átalakítása ügyfélle.',
						icon: 'trendingUp',
						underScore: 80
					},
					{
						title: 'Tartalom marketing',
						description: 'Szakértelmet demonstráló tartalmak.',
						icon: 'edit',
						underScore: 80
					}
				]
			},
			cta: {
				title: 'Készen állsz a digitális átalakulásra?',
				subtitle: 'Válaszd ki csomagodat a nagyobb sikerért!',
				button: 'Válassz csomagot'
			}
		},
		strengths: {
			title: 'Erősségeid',
			goodBasics: 'Jó digitális alapok',
			regularContent: 'Rendszeres tartalomkészítés',
			understanding: 'Alapvető marketing ismeretek',
			quickImprovement: 'Gyors javítási lehetőség',
			growthPotential: 'Nagy növekedési potenciál',
			visibilityGain: 'Gyors láthatóságnövelés',
			socialPresence: 'Meglévő social média jelenlét',
			seoUnderstanding: 'SEO ismeretek',
			digitalTransformation: 'Digitális átállásra nyitott'
		},
		weaknesses: {
			title: 'Javítási pontok',
			poorVisibility: 'Alacsony online láthatóság',
			noStrategy: 'Nincs marketing stratégia',
			poorOptimization: 'Gyenge weboldal optimalizálás',
			limitedReach: 'Korlátozott keresőelérés',
			underdevelopedContent: 'Fejletlen tartalomstratégia',
			poorConversion: 'Konverzió optimalizálás hiánya',
			contentDistribution: 'Tartalomelosztási hiányosságok',
			competitorAnalysis: 'Versenyanalízis hiánya',
			conversionRate: 'Konverzióráta javítható'
		},
		benefits: {
			title: 'Előnyeid',
			visibility: 'Magasabb Google láthatóság',
			traffic: 'Több minőségi látogató',
			conversion: 'Jobb konverziós arányok',
			searchEngines: 'Javított keresőpozíciók',
			socialMedia: 'Erősebb social média jelenlét',
			newClients: 'Célzott ügyfélnyerés',
			newEmployees: 'Optimalizált karrieroldal'
		},
		recommendations: {
			title: 'Javaslataink',
			website: 'Weboldal felhasználói élmény javítása',
			content: 'Tartalomstratégia a láthatóságért',
			performance: 'Képoptimalizálás gyorsabb betöltésért',
			seo: 'Meta tag-ek és strukturált adatok fejlesztése',
			accessibility: 'Akadálymentesség javítása',
			contentQuality: 'Kulcsszavas tartalomoptimalizálás',
			basicSeo: 'Alap SEO beállítások',
			googleBusiness: 'Google Business profil létrehozása',
			advancedSeo: 'Haladó SEO technikák',
			localSeo: 'Helyi keresések optimalizálása',
			contentMarketing: 'Tartalommarketing stratégia',
			backlinks: 'Hivatkozásépítés',
			extendedContent: 'Kiterjesztett tartalomstratégia',
			competitorAnalysis: 'Versenyvizsgálat'
		},
		expertProfile: {
			name: 'Christopher Matt',
			role: 'Digitális Marketing Szakértő',
			bio: '10+ év digitális tapasztalattal segít vállalkozásoknak online jelenlétet optimalizálni. Google Partner és közösségi média szakértő.',
			imageUrl:
				'https://www.chooomedia.de/wp-content/uploads/2023/03/chooomedia-christopher-matt-ceo-freelancer-webdesigner-ui-designer-information-designer-500x500px__1_-removebg-preview.png',
			imageAlt: 'Christopher Matt - Digitális Marketing Szakértő',
			badges: {
				googlePartner: {
					label: 'Google Partner',
					value: '',
					icon: 'google'
				},
				customers: {
					label: 'Ügyfél',
					value: '220+',
					icon: 'users'
				},
				experience: {
					label: 'Tapasztalat',
					value: '10+ év',
					icon: 'experience'
				}
			}
		},
		buttons: {
			restart: 'Kvíz újraindítása',
			getReport: 'Jelentés e-mailben',
			emailError: 'Kérjük, add meg az e-mail címedet az űrlapon, hogy megkaphasd az eredményeket.'
		},
		screenshot: {
			alt: 'Weboldal képernyőkép',
			unsupported: 'Nem támogatott képformátum'
		}
	},
	meta: {
		title: 'Digitális Marketing Értékelés',
		description: 'Ingyenes marketing elemzés személyre szabott javaslatokkal.',
		breadcrumb: 'Marketing Értékelés'
	},
	pricing: {
		perDay: 'Naponta',
		features: {
			websiteOptimization: 'Weboldal optimalizálás',
			basicSeo: 'Alap SEO',
			monthlyContent: 'Havi tartalom',
			performanceReport: 'Havi jelentés',
			allBasicFeatures: '1 hónapos csomag minden funkciója',
			socialMedia: 'Közösségi média kezelés',
			weeklyContent: 'Heti tartalom',
			keywordOptimization: 'Kulcsszó optimalizálás',
			competitorAnalysis: 'Versenyanalízis',
			allPremiumFeatures: '3 hónapos csomag minden funkciója',
			marketingStrategy: 'Átfogó stratégia',
			dailyContent: 'Napi frissítések',
			sem: 'Keresőmarketing (SEM)',
			personalManager: 'Személyes menedzser',
			cro: 'Konverzió optimalizálás'
		},
		included: {
			longtermBusiness: 'Hosszú távú online üzlet',
			viralContent: 'Viral tartalomkoncepciók',
			expertFrameworks: 'Szakértői framework-ök',
			targetedStrategies: 'Adatalapú stratégiák'
		},
		excluded: {
			getRichQuick: 'Gyors gazdagodási schemák',
			noContracts: 'Nincs hosszú távú kötelezettség',
			noInvestment: 'Nincs felesleges befektetés',
			pyramidSchemes: 'Nincs MLM vagy dropshipping'
		},
		includedTitle: 'Tartalmazza',
		inAllPlans: 'minden csomagban',
		excludedTitle: 'Nem tartalmaz',
		notWorking: 'semmit',
		choosePlan: 'Válassz csomagot',
		header: {
			title: 'Válaszd ki tökéletes csomagodat',
			subtitle: '{score} pontod alapján ajánlott csomag:'
		},
		countdown: {
			title: 'Akció!',
			subtitle: 'Lejár:'
		},
		bonusBox: {
			tag: 'EXKLUZÍV BÓNUSZ',
			title: 'Ingyenes SEO blogbejegyzés',
			description: 'Azonnali láthatóságnövelés SEO-optimalizált tartalommal!',
			benefits: ['Személyre szabott tartalom', 'SEO-optimalizált', 'Azonnali hatás'],
			value: 'Érték: 99€',
			limited: 'Korlátozott ideig'
		},
		paymentOptions: {
			title: 'Fizetési mód:',
			monthly: 'Havonta',
			oneTime: 'Egyszeri (-8%)',
			longTime: 'Enterprise (-20%)', // Változtatva: 'Longtime'-ról
			hotLabel: 'AKCIÓS'
		},
		planLabels: {
			oneTime: 'EGYSZERI',
			oneMonth: '1 HÓNAPOS',
			threeMonth: '3 HÓNAPOS',
			sixMonth: '6 HÓNAPOS',
			popular: '★ LEGNÉPSZERŰBB',
			longTimeSuffix: {
				oneMonth: 'ENTERPRISE ALAP',
				threeMonth: 'ENTERPRISE PRÉMIUM',
				business: 'ENTERPRISE ÜZLETI'
			}
		},
		additionalBenefits: {
			oneTime: ['8% kedvezmény', 'Nincs havi díj'],
			longTime: ['1 év hozzáférés', '20% kedvezmény', 'Minden frissítés'], // Változtatva: '5 év hozzáférés'-ről
			savings: 'Megtakarítás',
			savingsOption: 'ezzel a lehetőséggel!'
		},
		ctaButton: {
			monthly: 'FELIRATKOZÁS',
			oneTime: 'VÁSÁRLÁS',
			longTime: 'ENTERPRISE HOZZÁFÉRÉS', // Változtatva: 'LONGTIME HOZZÁFÉRÉS'-ről
			selectPlan: 'Válassz'
		},
		savings: 'Megtakarított összeg',
		trustBadges: ['Biztonságos fizetés', '30 napos visszatérítés'],
		consultationText: 'Vagy biztonságosan játszol?',
		consultationLink: 'Ingyenes konzultáció foglalása',
		discountBanner: {
			title: 'Enterprise hozzáférés', // Változtatva: 'Longtime hozzáférés'-ről
			discount: ' 20% kedvezménnyel!',
			description:
				'1 évre szóló hozzáférés egy összegben! <span class="font-bold">Most azonnal!</span>', // Változtatva: '5 évre szóló'-ról
			buttonText: 'Igényeld!'
		},
		terms: {
			monthly: {
				main: 'A {selectedPlan} csomag automatikusan megújul {totalPrice.toFixed(2)}€/hó. Lemondás: abo@digitalpusher.de.',
				reminder: 'Értesítünk 5 nappal lejárat előtt.'
			},
			oneTime: 'Egyszeri összeg: {totalPrice.toFixed(2)}€. 1 év hozzáférés.',
			acceptance: 'A "Vásárlás" gombbal elfogadod a ÁSZF-et.'
		}
	},
	footer: {
		copyright: 'Minden jog fenntartva.'
	},
	modal: {
		common: {
			close: 'Bezárás',
			cancel: 'Mégse',
			confirm: 'Megerősítés',
			back: 'Vissza'
		},
		payment: {
			title: 'Fizetés befejezése',
			subtitle: 'Válassz fizetési módot',
			testButton: 'Teszt tranzakció',
			testDescription: 'Tesztelés sandbox fiókkal',
			summary: {
				title: 'Összegzés',
				monthly: 'Havi fizetés',
				oneTime: 'Egyszeri fizetés',
				longtime: 'Enterprise hozzáférés',
				discount: 'Kedvezmény',
				donation: 'támogatással',
				tax: 'ÁFA-val'
			},
			securityBadges: {
				secure: 'SSL védett',
				protection: 'Vásárlóvédelem',
				instant: 'Azonnali hozzáférés'
			},
			donationBox: {
				title: '+3% adomány',
				description: 'Támogasd környezetvédelmi projekteket! 93% közvetlen támogatás.'
			},
			errors: {
				general: 'Hiba történt. Próbáld újra később.',
				validation: 'Ellenőrizd a fizetési adatokat',
				server: 'PayPal szolgáltatás nem elérhető.',
				timeout: 'Időtúllépés. Ellenőrizd az interneted.'
			}
		},
		success: {
			title: 'Sikeres fizetés!',
			subtitle: 'Köszönjük vásárlásod!',
			modalInfo: 'Ne zárd be az ablakot a folyamat befejezéséig.',
			paymentDetails: {
				plan: 'Szolgáltatás',
				id: 'Tranzakció ID',
				date: 'Dátum',
				status: 'Státusz',
				paid: 'Fizetve'
			},
			shareContent: {
				title: 'Sikerem a Digital Pusherrel',
				text: 'Digitális átalakulásban vagyok a Digital Pusher segítségével! 🚀 #DigitalMarketing'
			},
			donation: {
				title: 'Köszönjük adományod!',
				description: '{amount}€ támogatás környezetvédelmi projektekre.',
				impact: {
					direct: 'Közvetlen segítség',
					projects: 'Projektek',
					transparency: 'Transzparencia'
				}
			},
			nextSteps: {
				title: 'Következő lépések:',
				steps: ['Erősítsd meg az e-mailt', 'Időpont egyeztetés', 'Hívd meg csapattagod']
			},
			upgradeOffer: {
				exclusive: 'EXKLUZÍV',
				title: 'Frissíts prémiumra -30%',
				subtitle: 'Új ügyfeleknek: Prémium funkciók azonnal!',
				countdown: 'Lejár:',
				button: 'Frissítés'
			},
			support: {
				confirmation: 'Megerősítést küldtünk e-mailben.',
				contact: 'Kérdésed van? Írj a támogatásnak!'
			},
			buttons: {
				dashboard: 'Vezérlőpult',
				share: 'Megosztás'
			}
		},
		error: {
			title: 'Fizetési hiba',
			defaultMessage: 'Ismeretlen hiba',
			details: 'Technikai részletek',
			support: 'Lépj kapcsolatba a támogatással.',
			retry: 'Újrapróbálkozás'
		},
		confirm: {
			cancelPurchase: 'Biztosan megszakítod?',
			confirmButton: 'Igen, megszakítom',
			cancelButton: 'Vissza a fizetéshez'
		},
		booking: {
			title: 'Ingyenes konzultáció foglalása',
			subtitle:
				'Válassz időpontot a 30 perces ingyenes konzultációhoz. Megbeszéljük egyéni igényeidet és megmutatjuk, hogyan optimalizálhatod online láthatóságodat.',
			selectDate: 'Dátum kiválasztása:',
			selectTime: 'Időpont kiválasztása:',
			contactInfo: 'Kapcsolati adataid:',
			confirm: 'Ingyenes időpont foglalása',
			booking: 'Időpont foglalása...',
			cancel: 'Mégse',
			success: {
				title: 'Időpont sikeresen foglalva!',
				message: 'Ingyenes konzultációd {date} {time} időpontra lett foglalva.',
				details:
					'Hamarosan megkapsz egy visszaigazoló e-mailt minden részlettel és a meeting linkkel.'
			}
		}
	},
	waitingScreen: {
		title: 'Elemzés folyamatban - Kérjük várj.',
		redirect: 'Eredmény {remainingTime} múlva'
	}
};

export default hu;
