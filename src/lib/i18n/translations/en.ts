import type { Translation } from '../types';

const en: Translation = {
	start: {
		title: 'Marketing Check Quiz',
		text: 'Calculate your <strong>online visibility</strong>, <strong>increase reach</strong>, <strong>save resources</strong>, and <strong>boost revenue</strong> now.',
		meta: {
			rating: {
				user: 'User',
				from: 'of',
				quiztime: 'minute quiz'
			}
		}
	},
	common: {
		next: 'Next',
		skip: 'Skip',
		back: 'Back',
		submit: 'Submit',
		loading: 'Loading...',
		error: 'An error occurred',
		success: 'Success!',
		analyze: 'Analyze',
		formErrorHeading: 'Please correct the following errors:',
		support: 'Support',
		backToHome: 'Back to Homepage',
		tryAgainLater: 'Please try again later or contact our support.',
		contactSupport: 'Contact Support'
	},
	forms: {
		labels: {
			company_name: 'Company Name',
			company_url: 'Website URL',
			salutation: 'Salutation',
			first_name: 'First Name',
			last_name: 'Last Name',
			email: 'Email',
			phone: 'Phone',
			privacy_agreement: 'Privacy Policy',
			marketing_consent: 'Newsletter'
		},
		salutation: {
			select: 'Please select a salutation',
			male: 'Mr.',
			female: 'Ms.',
			diverse: 'Diverse'
		},
		imageOption: {
			continueIn: 'continue in',
			second: 'second',
			seconds: 'seconds',
			selectUpTo: 'You can select up to {max} options',
			selectAllApplicable: 'Select all applicable options'
		},
		placeholders: {
			select: 'Please select',
			salutation: 'Please select your salutation',
			first_name: 'Please enter your first name',
			last_name: 'Please enter your last name',
			email: 'Please enter your email address',
			phone: 'Phone number (optional)',
			privacy_agreement: 'Accept privacy policy',
			privacy_policy: 'Privacy policy',
			newsletter_terms: 'Newsletter terms',
			company_url: 'https://www.mywebsite.com'
		},
		errors: {
			required: 'This field is required',
			url: 'Please enter a valid URL',
			email: 'Please enter a valid email address'
		},
		descriptions: {
			company_url: 'Enter your website URL and click "Analyze" to receive a comprehensive report.',
			analyze: 'Click on "Analyze" to check your website',
			privacy_agreement: 'I agree to the',
			marketing_consent: 'I would like to receive the newsletter and accept the'
		},
		checkpoints: {
			performance: 'Performance check',
			seo: 'SEO analysis',
			accessibility: 'Accessibility test',
			security: 'Security check'
		},
		seotips: {
			headline: 'Analysis of Your Website',
			title: 'SEO tip during analysis:',
			default: [
				'Use precise page titles (title tags) for better click-through rates in search results.',
				'Create unique meta descriptions for each page (150-160 characters).',
				'Use one H1 heading per page that clearly communicates the main topic.',
				'Optimize images with alt texts and compress them for faster loading times.',
				'Create a clear website structure with logical URLs.',
				'Optimize your website for mobile devices with responsive design.',
				'Improve loading speed – every second counts for SEO and conversion.',
				'Use internal linking to help visitors and search engines find your content.',
				'Regularly create high-quality, relevant content for your target audience.',
				'Implement Schema.org markup for better search result presentation.',
				'Create an XML sitemap and submit it to Google Search Console.',
				'Use a secure HTTPS connection for your entire website.',
				'Regularly check and fix broken links.',
				'Optimize Open Graph tags for better social media display.'
			]
		}
	},
	schema: {
		steps: {
			visibility: {
				title: 'visibility',
				description: 'Where can your business be found?'
			},
			company_url: {
				title: 'company_url',
				description: 'Ready for your website analysis?'
			},
			advertising_frequency: {
				title: 'advertising_frequency',
				description: 'How often do you run ads?'
			},
			goals: {
				title: 'goals',
				description: 'What do you want to achieve for your business?'
			},
			campaign_management: {
				title: 'campaign_management',
				description: 'Who should manage your advertising?'
			},
			online_reviews: {
				title: 'online_reviews',
				description: 'How do your customers rate you?'
			},
			previous_campaigns: {
				title: 'previous_campaigns',
				description: 'Your experience with online advertising'
			},
			business_phase: {
				title: 'business_phase',
				description: 'In which phase is your company?'
			},
			implementation_time: {
				title: 'implementation_time',
				description: 'Your desired implementation timeframe'
			},
			company_info: {
				title: 'company_info',
				description: 'Information about your company'
			},
			waitingscreen: {
				title: 'waitingscreen',
				description: 'Your request is being processed'
			},
			result: {
				title: 'result',
				description: 'Action Required: Your Website Analysis'
			}
		},
		options: {
			visibility: {
				search_engines: {
					label: 'Search Engines',
					description: 'Presence on Google & Co.'
				},
				social_media: {
					label: 'Social Media',
					description: 'Presence on Facebook & Co.'
				},
				print: {
					label: 'Print',
					description: 'Classic print advertising'
				},
				store: {
					label: 'Store',
					description: 'Physical presence'
				}
			},
			advertising_frequency: {
				weekly: {
					label: 'Weekly',
					description: 'Weekly updates'
				},
				monthly: {
					label: 'Monthly',
					description: 'Monthly campaigns'
				},
				yearly: {
					label: 'Yearly',
					description: 'Annual major campaigns'
				}
			},
			goals: {
				new_clients: {
					label: 'New Customer Acquisition',
					description: 'Acquire new customers'
				},
				new_employees: {
					label: 'Employee Recruitment',
					description: 'Find new employees'
				},
				more_online: {
					label: 'More Online Presence',
					description: 'Become more visible online'
				},
				all: {
					label: 'Everything Together',
					description: 'All-in-one solution'
				}
			},
			campaign_management: {
				self: {
					label: 'By myself',
					description: 'Self-managed'
				},
				digitalpusher: {
					label: 'Digitalpusher',
					description: 'Professional management'
				},
				employee: {
					label: 'Employee',
					description: 'Internal management'
				}
			},
			online_reviews: {
				positive: {
					label: 'Mostly positive',
					description: 'Good reviews'
				},
				negative: {
					label: 'Mostly negative',
					description: 'Room for improvement'
				},
				none: {
					label: 'None available',
					description: 'No reviews'
				}
			},
			previous_campaigns: {
				yes: {
					label: 'Yes',
					description: 'Existing experience'
				},
				no: {
					label: 'No',
					description: 'No experience'
				},
				would_like: {
					label: 'Would like to',
					description: 'Interest exists'
				}
			},
			business_phase: {
				planning: {
					label: 'Planning phase',
					description: 'In planning phase'
				},
				less_than_6_months: {
					label: 'Younger than 6 months',
					description: 'Young company'
				},
				more_than_6_months: {
					label: 'Older than 6 months',
					description: 'Established company'
				},
				family_business: {
					label: 'Family business',
					description: 'Family company'
				}
			},
			implementation_time: {
				immediate: {
					label: 'Record time',
					description: 'Lightning-fast implementation'
				},
				medium: {
					label: 'In 2-6 months',
					description: 'Medium-term planning'
				},
				long_term: {
					label: 'More than 6 months',
					description: 'Long-term strategy'
				}
			}
		},
		metrics: {
			seo: {
				label: 'SEO',
				description: 'Search Engine Optimization'
			},
			performance: {
				label: 'Performance',
				description: 'Loading speed and responsiveness'
			},
			accessibility: {
				label: 'Accessibility',
				description: 'Website accessibility'
			},
			bestPractices: {
				label: 'Best Practices',
				description: 'Compliance with web standards'
			},
			content: {
				label: 'Content',
				description: 'Quality and relevance of content'
			},
			security: {
				label: 'Security',
				description: 'Protection against threats'
			},
			currentValue: 'Current',
			improvedValue: 'After Optimization',
			average: 'Average',
			optimal: 'Optimal'
		},
		validation: {
			required: 'This field is required',
			visibility: {
				required: 'Please select where your business can be found',
				minSelection: 'Please select at least one option'
			},
			advertising_frequency: {
				required: 'Please select your advertising frequency',
				minSelection: 'Please select at least one advertising frequency'
			},
			goals: {
				required: 'Please select your main goal',
				minSelection: 'Please select at least one goal'
			},
			campaign_management: {
				required: 'Please select who should manage your advertising',
				minSelection: 'Please select at least one option'
			},
			online_reviews: {
				required: 'Please indicate how your online reviews are on average',
				minSelection: 'Please select at least one option'
			},
			previous_campaigns: {
				required: 'Please indicate if you have already run online advertising',
				minSelection: 'Please select at least one option'
			},
			business_phase: {
				required: 'Please select your business phase',
				minSelection: 'Please select at least one phase'
			},
			implementation_time: {
				required: 'Please select the desired implementation period',
				minSelection: 'Please select at least one period'
			},
			company_name: {
				required: 'Company name is required',
				minLength: 'Name must be at least 2 characters long'
			},
			company_url: {
				required: 'Website URL is required',
				url: 'Please provide a valid URL'
			},
			first_name: {
				required: 'First name is required',
				minLength: 'First name must be at least 2 characters long'
			},
			last_name: {
				required: 'Last name is required',
				minLength: 'Last name must be at least 2 characters long'
			},
			email: {
				required: 'Email address is required',
				email: 'Please provide a valid email address'
			},
			phone: {
				required: 'Phone number is required',
				pattern: 'Invalid phone format'
			},
			privacy_agreement: {
				required: 'Please accept the privacy policy'
			}
		}
	},
	results: {
		title: 'Action Required: Your Website Analysis',
		description: 'Here is your individual analysis report',
		subtitle: 'Here is your individual analysis report',
		score: {
			title: 'Your Marketing Score',
			low: {
				title: 'Critical! Your business is barely visible.',
				suggestion: 'We show you how to reach more customers immediately.'
			},
			medium: {
				title: 'Your visibility can be improved.',
				suggestion: 'Increase your reach through smart online marketing strategies.'
			},
			high: {
				title: 'Good! But there is still potential.',
				suggestion: 'With targeted optimization you can gain even more visibility.'
			},
			excellent: {
				title: 'Excellent! Your digital presence is outstanding.',
				suggestion: 'Use advanced strategies to further expand your dominance!'
			}
		},
		sections: {
			analysis: 'Your Analysis Results',
			steps: {
				title: 'What happens after purchase?',
				purchase: {
					title: 'Purchase completion',
					description: 'Selection of the suitable plan and straightforward purchase process',
					icon: 'cart'
				},
				scheduling: {
					title: 'Appointment scheduling',
					description: 'Personal appointment scheduling with our digital expert',
					icon: 'calendar'
				},
				implementation: {
					title: 'Implementation',
					description: 'Professional implementation of all agreed measures',
					icon: 'code'
				},
				handover: {
					title: 'Handover',
					description: 'Handover and introduction to your optimized digital system',
					icon: 'check'
				}
			},
			plans: 'Choose Your Plan',
			testimonials: {
				title: 'Success stories that will motivate you',
				inspiration: 'INSPIRATIONS',
				case1: {
					titleLow: 'From 0 to 100: At least 3 deals daily through maximized online presence',
					titleHigh:
						'Breakthrough: more than 43% more inquiries thanks to thoughtful marketing strategy',
					quote:
						'We were comprehensively advised and decided to have a targeted and long-term campaign on social media planned and implemented by the service provider, in addition to the webapp and the new website. We are very satisfied with the conversions after two years.',
					author: '- Dr. P. Ullrich, Managing Director'
				},
				case2: {
					title: 'Efficient implementation: Landing page, SEO and full channel ads campaign',
					quote:
						'The landing page and SEO were quickly implemented based on the analyzed data for our e-commerce network based on Shopware, and the campaign was a complete success thanks to targeted audience selection and conversion tracking. Definitely recommended.',
					author: '- M. Keller, Senior Brand Manager'
				}
			},
			improvement: {
				title: 'How we improve your results',
				steps: [
					{
						title: 'Website Optimization',
						description:
							'Improvement of loading times, mobile compatibility and user-friendliness.',
						icon: 'deviceDesktop',
						underScore: 40
					},
					{
						title: 'SEO & Keywords',
						description:
							'Search engine optimization tailored to your industry for better rankings.',
						icon: 'search',
						underScore: 40
					},
					{
						title: 'Basic Web Presence',
						description: 'Building a solid online presence with all necessary basics.',
						icon: 'home',
						underScore: 40
					},
					{
						title: 'Local SEO',
						description: 'Optimization for local searches so customers near you can find you.',
						icon: 'mapPin',
						underScore: 40
					},
					{
						title: 'Content Strategy',
						description:
							'Development of a content strategy that addresses and convinces your audience.',
						icon: 'fileText',
						underScore: 60
					},
					{
						title: 'Social Media Integration',
						description: 'Connection of your website with social media for greater reach.',
						icon: 'share2',
						underScore: 60
					},
					{
						title: 'Conversion Optimization',
						description: 'Targeted improvements to convert more visitors into customers.',
						icon: 'trendingUp',
						underScore: 80
					},
					{
						title: 'Content Marketing',
						description:
							'High-quality content that showcases your expertise and convinces customers.',
						icon: 'edit',
						underScore: 80
					}
				]
			},
			cta: {
				title: 'Ready to revolutionize your digital presence?',
				subtitle: 'Choose your plan now and start your journey to more visibility and success.',
				button: 'Select Plan Now'
			}
		},
		strengths: {
			title: 'Your Strengths',
			goodBasics: 'Good basics in digital presence',
			regularContent: 'Regular content creation',
			understanding: 'Basic understanding of digital marketing',
			quickImprovement: 'Potential for quick improvements',
			growthPotential: 'Great growth potential',
			visibilityGain: 'Opportunity for quick visibility increase',
			socialPresence: 'Existing social media presence',
			seoUnderstanding: 'Understanding of search engine optimization',
			digitalTransformation: 'Willingness for digital transformation'
		},
		weaknesses: {
			title: 'Improvement Potential',
			poorVisibility: 'Low digital visibility',
			noStrategy: 'Missing online marketing strategy',
			poorOptimization: 'Insufficient website optimization',
			limitedReach: 'Limited reach in search engines',
			underdevelopedContent: 'Underdeveloped content strategy',
			poorConversion: 'Lacking conversion optimization',
			contentDistribution: 'Gaps in content distribution',
			competitorAnalysis: 'Limited competitor analysis',
			conversionRate: 'Optimization potential in conversion rate'
		},
		benefits: {
			title: 'Your Advantages',
			visibility: 'Higher visibility in Google & Co.',
			traffic: 'More qualified visitors to your website',
			conversion: 'Better conversion rates through optimized content',
			searchEngines: 'Optimized search engine placements for relevant keywords',
			socialMedia: 'Improved social media presence and engagement',
			newClients: 'Targeted strategies for new customer acquisition',
			newEmployees: 'Optimized career page for employee recruitment'
		},
		recommendations: {
			title: 'Our Recommendations',
			website: 'Website optimization for better user experience',
			content: 'Content strategy to increase visibility',
			performance: 'Improve website loading speed through optimization of images and scripts',
			seo: 'SEO optimization through improved meta tags and structured data',
			accessibility: 'Improve accessibility for better access',
			contentQuality: 'Optimize content quality through better structuring and keywords',
			basicSeo: 'Basic SEO optimization of your website',
			googleBusiness: 'Create a Google Business Profile',
			advancedSeo: 'Advanced SEO measures for more organic traffic',
			localSeo: 'Local SEO optimization for regional visibility',
			contentMarketing: 'Content marketing strategy to strengthen your market position',
			backlinks: 'Backlink building to increase domain authority',
			extendedContent: 'Extended content strategy for maximum visibility',
			competitorAnalysis: 'Competitor analysis to identify growth opportunities'
		},
		expertProfile: {
			name: 'Christopher Matt',
			role: 'Digital Marketing Expert',
			bio: 'With over 10 years of experience in the digital world, Christopher helps companies optimize their online presence and achieve measurable results. As a certified Google Partner and social media specialist, he knows all relevant strategies for sustainable visibility.',
			imageUrl:
				'https://www.chooomedia.de/wp-content/uploads/2023/03/chooomedia-christopher-matt-ceo-freelancer-webdesigner-ui-designer-information-designer-500x500px__1_-removebg-preview.png',
			imageAlt: 'Christopher Matt - Digital Marketing Expert',
			badges: {
				googlePartner: {
					label: 'Google Partner',
					value: '',
					icon: 'google'
				},
				customers: {
					label: 'Customers',
					value: '220+',
					icon: 'users'
				},
				experience: {
					label: 'Years of experience',
					value: '10+',
					icon: 'experience'
				}
			}
		},
		buttons: {
			restart: 'Restart quiz and analysis',
			getReport: 'Receive analysis report by email',
			emailError: 'Please provide an email address in the form to receive the results.'
		},
		screenshot: {
			alt: 'Website Screenshot',
			unsupported: 'Screenshot data available but format not supported'
		}
	},
	meta: {
		title: 'Digital Marketing Assessment',
		description:
			'Analyze your digital presence with our free marketing assessment. Get personalized recommendations for more online success.',
		breadcrumb: 'Marketing Assessment',
		language: 'en'
	},
	pricing: {
		perDay: 'Daily',
		features: {
			websiteOptimization: 'Website Optimization',
			basicSeo: 'Basic SEO measures',
			monthlyContent: '1 × content creation per month',
			performanceReport: 'Monthly performance report',
			allBasicFeatures: 'All features of the 1-month plan',
			socialMedia: 'Social Media Management',
			weeklyContent: 'Weekly content creation',
			keywordOptimization: 'Keyword optimization',
			competitorAnalysis: 'Detailed competitor analysis',
			allPremiumFeatures: 'All features of the 3-month plan',
			marketingStrategy: 'Comprehensive marketing strategy',
			dailyContent: 'Daily content updates',
			sem: 'Search Engine Marketing (SEM)',
			personalManager: 'Personal marketing manager',
			cro: 'Conversion Rate Optimization'
		},
		included: {
			longtermBusiness: 'Method for creating a real, long-term online business',
			viralContent: 'Exclusive concepts for creating viral content',
			expertFrameworks: 'Proven expert frameworks for quick and efficient scaling',
			targetedStrategies: 'Fact-based strategies based on your target group needs'
		},
		excluded: {
			getRichQuick: 'Get-rich-quick schemes: getting rich overnight',
			noContracts: 'No long-term commitments or contracts',
			noInvestment: 'An investment-free possibility that never delivers what it promises',
			pyramidSchemes: 'MLM, dropshipping or reselling of pyramid schemes'
		},
		includedTitle: 'Including',
		inAllPlans: 'in all our packages',
		excludedTitle: 'We do not work',
		notWorking: 'with',
		choosePlan: 'Select suitable plan',
		header: {
			title: 'Choose the perfect plan for your digital transformation',
			subtitle: 'Based on your score of {score} we recommend a tailored approach'
		},
		countdown: {
			title: 'Special offer!',
			subtitle: 'Discount expires in:'
		},
		bonusBox: {
			tag: 'EXCLUSIVE BONUS',
			title: 'High-quality blog article FREE',
			description:
				'When booking during the promotion period, you receive a tailored, SEO-optimized blog article for your company – perfectly adapted to increase your reach long-term!',
			benefits: [
				'Individually tailored to your company',
				'SEO-optimized for more visibility',
				'Immediate boost to your online presence'
			],
			value: 'Value: €99',
			limited: 'For a limited time only'
		},
		paymentOptions: {
			title: 'Choose your payment option:',
			monthly: 'Monthly',
			oneTime: 'One-time (-8%)',
			longTime: 'Enterprise (-20%)',
			hotLabel: 'HOT'
		},
		planLabels: {
			oneTime: 'ONE-TIME',
			oneMonth: '1-MONTH PLAN',
			threeMonth: '3-MONTH PLAN',
			sixMonth: '6-MONTH PLAN',
			popular: '★ MOST POPULAR',
			longTimeSuffix: {
				oneMonth: 'ENTERPRISE BASIC',
				threeMonth: 'ENTERPRISE PREMIUM',
				business: 'ENTERPRISE BUSINESS'
			}
		},
		additionalBenefits: {
			oneTime: ['8% discount on total price', 'No monthly fees'],
			longTime: ['1 year access', 'Massive 20% discount', 'All future updates'],
			savings: 'Save',
			savingsOption: 'with this option!'
		},
		ctaButton: {
			monthly: 'SUBSCRIBE TO PLAN',
			oneTime: 'BUY NOW',
			longTime: 'SECURE ENTERPRISE ACCESS',
			selectPlan: 'Select plan'
		},
		savings: 'You save',
		trustBadges: ['Secure & protected payment', '30-day money-back guarantee'],
		consultationText: 'Or do you want to play it safe?',
		consultationLink: 'Book free consultation',
		discountBanner: {
			title: 'Enterprise access with',
			discount: ' with 20% discount!',
			description:
				'Secure your <span class="font-bold">NOW</span> your 1-year access to all features and updates! Instead of monthly payments - invest once and benefit permanently.',
			buttonText: 'Secure now!'
		},
		terms: {
			monthly: {
				main: 'To avoid interruptions, you agree that your selected plan {selectedPlan} will automatically renew at the full price for subsequent renewal periods and you will be billed {totalPrice.toFixed(2)} monthly. You can cancel your subscription at any time by contacting our service team by email at abo@digitalpusher.de if you have selected more than one subscription month.',
				reminder:
					'Otherwise, you will receive an email 5 working days before the subscription expires with the option to cancel the subscription.'
			},
			oneTime:
				'The total amount of {totalPrice.toFixed(2)}€ will be charged once. There are no further costs or automatic renewals. Your Enterprise access is valid for 1 year.',
			acceptance:
				'By clicking "{paymentType === $i18n.pricing.paymentOptions.monthly ? $i18n.pricing.ctaButton.monthly : $i18n.pricing.ctaButton.oneTime}", you accept the Terms and Conditions and the Privacy Policy.'
		}
	},
	footer: {
		copyright: 'All rights reserved.'
	},
	modal: {
		common: {
			close: 'Close',
			cancel: 'Cancel',
			confirm: 'Confirm',
			back: 'Back'
		},
		payment: {
			title: 'Complete payment',
			subtitle: 'Choose your payment method',
			testButton: 'Test payment',
			testDescription: 'Test payment with sandbox account',
			summary: {
				title: 'Summary',
				monthly: 'Monthly payment',
				oneTime: 'One-time payment',
				longtime: 'Enterprise access',
				discount: 'Discount',
				donation: 'incl. donation',
				tax: 'incl. VAT'
			},
			securityBadges: {
				secure: 'SSL Secured',
				protection: 'Buyer protection',
				instant: 'Instant access'
			},
			donationBox: {
				title: 'Add 3% donation',
				description:
					'With your donation you directly support environmental protection projects. 93% of your donation goes directly into sustainable projects - verifiably and transparently!'
			},
			errors: {
				general: 'An error occurred. Please try again later.',
				validation: 'Please check your payment details',
				server: 'The PayPal service is temporarily unavailable. Please try again later.',
				timeout: 'The request took too long. Please check your internet connection and try again.'
			}
		},
		success: {
			title: 'Payment successful!',
			subtitle: 'Thank you for your purchase',
			modalInfo: 'Please do not close this window to complete the process.',
			paymentDetails: {
				plan: 'Service',
				id: 'Payment ID',
				date: 'Date',
				status: 'Status',
				paid: 'Paid'
			},
			shareContent: {
				title: 'My success with Digital Pusher',
				text: 'I just activated my online marketing plan at Digital Pusher and am on my way to more visibility and success! 🚀 #DigitalMarketing'
			},
			donation: {
				title: 'Impact ready!',
				description:
					'Your generous donation of {amount}€ supports important environmental projects. Together we make a big impact!',
				impact: {
					direct: 'Direct help',
					projects: 'Projects',
					transparency: 'Transparency'
				}
			},
			nextSteps: {
				title: 'Your next steps:',
				steps: [
					'Check your email for payment confirmation',
					'Schedule an appointment for personal consultation',
					'Invite a team member for better results'
				]
			},
			upgradeOffer: {
				exclusive: 'Exclusive',
				title: 'Upgrade your package and save 30%',
				subtitle:
					'For new customers only: Add premium features now and elevate your results to the next level!',
				countdown: 'Offer ends in',
				button: 'Secure upgrade'
			},
			support: {
				confirmation: 'A confirmation with all details has been sent to your email address.',
				contact: 'Questions? Contact our customer support'
			},
			buttons: {
				dashboard: 'To dashboard',
				share: 'Share'
			}
		},
		error: {
			title: 'Payment error',
			defaultMessage: 'An error occurred',
			details: 'Show technical details',
			support: 'For further problems, please contact our customer support.',
			retry: 'Try again'
		},
		confirm: {
			cancelPurchase: 'Do you really want to cancel the purchase process?',
			confirmButton: 'Yes, cancel',
			cancelButton: 'Back to purchase process'
		},
		booking: {
			title: 'Book free consultation',
			subtitle:
				'Choose an appointment for your 30-minute free consultation. We will discuss your individual needs and show you how to optimize your online visibility.',
			selectDate: 'Select date:',
			selectTime: 'Select time:',
			contactInfo: 'Your contact details:',
			confirm: 'Book appointment for free',
			booking: 'Booking appointment...',
			cancel: 'Cancel',
			success: {
				title: 'Appointment successfully booked!',
				message: 'Your free consultation has been reserved for {date} at {time}.',
				details:
					'You will shortly receive a confirmation email with all details and the meeting link.'
			}
		}
	},
	waitingScreen: {
		title: 'Your details are being analyzed - Please have a moment of patience.',
		redirect: 'Your result in {remainingTime}'
	},
	email: {
		subject: 'Your Website Analysis Results for {company_url}',
		greeting: 'Hello {firstName} {lastName}',
		results: {
			title: 'Website Analysis Results',
			description:
				'Here are your <strong>website analysis results</strong> for <strong>{company_url}</strong> from {currentDate}.',
			visibilityScore: 'Your Visibility Score: {score}/100',
			scoreDescription: 'Based on your current online presence and marketing strategy'
		},
		situation: {
			title: '📊 Your Current Situation',
			visibility: 'Visibility:',
			advertisingFrequency: 'Advertising Frequency:',
			goals: 'Goals:',
			campaignManagement: 'Campaign Management:',
			businessPhase: 'Business Phase:',
			implementationTime: 'Implementation Time:'
		},
		cta: {
			title: '🎯 Exclusive Offer for You',
			description:
				'Secure <span class="secrets-highlight">5 free insider tips</span> for more online visibility in a personal consultation.',
			highlight: '5 free insider tips',
			urgency: '⚡ Limited time only!',
			button: '🎁 Get 5 Free Insider Tips'
		},
		footer: {
			copyright: '© 2025 Digitalpusher - All rights reserved',
			unsubscribe: 'Unsubscribe from newsletter',
			privacy: 'Privacy Policy',
			imprint: 'Imprint',
			disclaimer:
				'You are receiving this email because you completed a website analysis on our platform.'
		}
	}
};

export default en;
