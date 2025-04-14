export interface Translation {
	start: {
		title: string;
		text: string;
		meta: {
			rating: {
				user: string;
				from: string;
				quiztime: string;
			};
		};
	};
	common: {
		next: string;
		skip: string;
		back: string;
		submit: string;
		loading: string;
		error: string;
		success: string;
		analyze: string;
	};
	forms: {
		labels: Record<string, string>;
		salutation: {
			select: string;
			male: string;
			female: string;
			diverse: string;
		};
		imageOption: {
			continueIn: string;
			second: string;
			seconds: string;
			selectUpTo: string;
			selectAllApplicable: string;
		};
		placeholders: Record<string, string>;
		errors: Record<string, string>;
		descriptions: Record<string, string> & { analyze: string };
		checkpoints: {
			performance: string;
			seo: string;
			accessibility: string;
			security: string;
		};
		seotips: {
			headline: string;
			title: string;
			default: string[];
		};
	};
	schema: {
		steps: Record<
			string,
			{
				title: string;
				description: string;
			}
		>;
		options: Record<
			string,
			Record<
				string,
				{
					label: string;
					description: string;
				}
			>
		>;
		metrics: {
			seo: {
				label: string;
				description: string;
			};
			performance: {
				label: string;
				description: string;
			};
			accessibility: {
				label: string;
				description: string;
			};
			bestPractices: {
				label: string;
				description: string;
			};
			content: {
				label: string;
				description: string;
			};
			security: {
				label: string;
				description: string;
			};
			currentValue: string;
			improvedValue: string;
			average: string;
			optimal: string;
			showImprovement: string;
			hideImprovement: string;
		};
		validation: {
			required: string;
			visibility: {
				required: string;
				minSelection: string;
			};
			advertising_frequency: {
				required: string;
				minSelection: string;
			};
			goals: {
				required: string;
				minSelection: string;
			};
			campaign_management: {
				required: string;
				minSelection: string;
			};
			online_reviews: {
				required: string;
				minSelection: string;
			};
			previous_campaigns: {
				required: string;
				minSelection: string;
			};
			business_phase: {
				required: string;
				minSelection: string;
			};
			implementation_time: {
				required: string;
				minSelection: string;
			};
			company_name: {
				required: string;
				minLength: string;
			};
			company_url: {
				required: string;
				url: string;
			};
			first_name: {
				required: string;
				minLength: string;
			};
			last_name: {
				required: string;
				minLength: string;
			};
			email: {
				required: string;
				email: string;
			};
			phone: {
				required: string;
				pattern: string;
			};
			privacy_agreement: {
				required: string;
			};
		};
	};
	results: {
		title: string;
		subtitle: string;
		score: {
			title: string;
			low: {
				title: string;
				suggestion: string;
			};
			medium: {
				title: string;
				suggestion: string;
			};
			high: {
				title: string;
				suggestion: string;
			};
			excellent: {
				title: string;
				suggestion: string;
			};
		};
		sections: {
			analysis: string;
			steps: {
				title: string;
				purchase: {
					title: string;
					description: string;
					icon: string;
				};
				scheduling: {
					title: string;
					description: string;
					icon: string;
				};
				implementation: {
					title: string;
					description: string;
					icon: string;
				};
				handover: {
					title: string;
					description: string;
					icon: string;
				};
			};
			plans: string;
			testimonials: {
				title: string;
				inspiration: string;
				case1: {
					titleLow: string;
					titleHigh: string;
					quote: string;
					author: string;
				};
				case2: {
					title: string;
					quote: string;
					author: string;
				};
			};
			improvement: {
				title: string;
				steps: Array<{
					title: string;
					description: string;
					icon: string;
					underScore: number;
				}>;
			};
			cta: {
				title: string;
				subtitle: string;
				button: string;
			};
		};
		strengths: {
			title: string;
			goodBasics: string;
			regularContent: string;
			understanding: string;
			quickImprovement: string;
			growthPotential: string;
			visibilityGain: string;
			socialPresence: string;
			seoUnderstanding: string;
			digitalTransformation: string;
		};
		weaknesses: {
			title: string;
			poorVisibility: string;
			noStrategy: string;
			poorOptimization: string;
			limitedReach: string;
			underdevelopedContent: string;
			poorConversion: string;
			contentDistribution: string;
			competitorAnalysis: string;
			conversionRate: string;
		};
		benefits: {
			title: string;
			visibility: string;
			traffic: string;
			conversion: string;
			searchEngines: string;
			socialMedia: string;
			newClients: string;
			newEmployees: string;
		};
		recommendations: {
			title: string;
			website: string;
			content: string;
			performance: string;
			seo: string;
			accessibility: string;
			contentQuality: string;
			basicSeo: string;
			googleBusiness: string;
			advancedSeo: string;
			localSeo: string;
			contentMarketing: string;
			backlinks: string;
			extendedContent: string;
			competitorAnalysis: string;
		};
		expertProfile: {
			name: string;
			role: string;
			bio: string;
			imageUrl: string;
			imageAlt: string;
			badges: {
				googlePartner: {
					label: string;
					value: string;
					icon: string;
				};
				customers: {
					label: string;
					value: string;
					icon: string;
				};
				experience: {
					label: string;
					value: string;
					icon: string;
				};
			};
		};
		buttons: {
			restart: string;
			getReport: string;
		};
		screenshot: {
			alt: string;
			unsupported: string;
		};
	};
	meta: {
		title: string;
		description: string;
		breadcrumb: string;
	};
	pricing: {
		perDay: string;
		features: {
			websiteOptimization: string;
			basicSeo: string;
			monthlyContent: string;
			performanceReport: string;
			allBasicFeatures: string;
			socialMedia: string;
			weeklyContent: string;
			keywordOptimization: string;
			competitorAnalysis: string;
			allPremiumFeatures: string;
			marketingStrategy: string;
			dailyContent: string;
			sem: string;
			personalManager: string;
			cro: string;
		};
		included: {
			longtermBusiness: string;
			viralContent: string;
			expertFrameworks: string;
			targetedStrategies: string;
		};
		excluded: {
			getRichQuick: string;
			noContracts: string;
			noInvestment: string;
			pyramidSchemes: string;
		};
		includedTitle: string;
		inAllPlans: string;
		excludedTitle: string;
		notWorking: string;
		choosePlan: string;

		header: {
			title: string;
			subtitle: string;
		};
		countdown: {
			title: string;
			subtitle: string;
		};
		bonusBox: {
			tag: string;
			title: string;
			description: string;
			benefits: string[];
			value: string;
			limited: string;
		};
		paymentOptions: {
			title: string;
			monthly: string;
			oneTime: string;
			longTime: string;
			hotLabel: string;
		};
		planLabels: {
			oneTime: string;
			oneMonth: string;
			threeMonth: string;
			sixMonth: string;
			popular: string;
			longTimeSuffix: {
				'1-MONATS PLAN': string;
				'3-MONATS PLAN': string;
				BUSINESS: string;
			};
		};
		additionalBenefits: {
			oneTime: string[];
			longTime: string[];
			savings: string;
			savingsOption: string;
		};
		ctaButton: {
			monthly: string;
			oneTime: string;
			longTime: string;
			selectPlan: string;
		};
		savings: string;
		trustBadges: string[];
		discountBanner: {
			title: string;
			discount: string;
			description: string;
			buttonText: string;
		};
		terms: {
			monthly: {
				main: string;
				reminder: string;
			};
			oneTime: string;
			acceptance: string;
		};
	};
	footer: {
		copyright: string;
	};
	modal: {
		common: {
			close: string;
			cancel: string;
			confirm: string;
			back: string;
		};
		payment: {
			title: string;
			subtitle: string;
			testButton: string;
			testDescription: string;
			summary: {
				title: string;
				monthly: string;
				oneTime: string;
				longtime: string;
				discount: string;
				donation: string;
				tax: string;
			};
			securityBadges: {
				secure: string;
				protection: string;
				instant: string;
			};
			donationBox: {
				title: string;
				description: string;
			};
			errors: {
				general: string;
				validation: string;
				server: string;
				timeout: string;
			};
		};
		success: {
			title: string;
			subtitle: string;
			modalInfo: string;
			paymentDetails: {
				plan: string;
				id: string;
				date: string;
				status: string;
				paid: string;
			};
			shareContent: {
				title: string;
				text: string;
			};
			donation: {
				title: string;
				description: string;
				impact: {
					direct: string;
					projects: string;
					transparency: string;
				};
			};
			nextSteps: {
				title: string;
				steps: string[];
			};
			upgradeOffer: {
				exclusive: string;
				title: string;
				subtitle: string;
				countdown: string;
				button: string;
			};
			support: {
				confirmation: string;
				contact: string;
			};
			buttons: {
				dashboard: string;
				share: string;
			};
		};
		error: {
			title: string;
			defaultMessage: string;
			details: string;
			support: string;
			retry: string;
		};
		confirm: {
			cancelPurchase: string;
			confirmButton: string;
			cancelButton: string;
		};
	};
	waitingScreen: {
		title: string;
		redirect: string;
	};
}
