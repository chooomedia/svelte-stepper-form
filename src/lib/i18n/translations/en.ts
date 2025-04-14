import type { Translation } from '../types';

const en: Translation = {
	start: {
		title: 'Marketing Check Quiz',
		text: 'Calculate your <strong>online visibility</strong>, <strong>increase reach</strong>, <strong>save resources</strong>, and <strong>boost revenue</strong> now.',
		meta: {
			rating: {
				user: 'Customers',
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
		support: 'Support'
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
			company_url: 'https://www.mywebsite.com',
			aria: 'Enter your Website Url'
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
					description: 'Managed company owner'
				},
				digitalpusher: {
					label: 'Digitalpusher',
					description: 'Managed Professional'
				},
				employee: {
					label: 'Employee',
					description: 'Managed internal'
				}
			},
			online_reviews: {
				positive: {
					label: 'Positive Reviews',
					description: 'Mostly positive feedback from customers'
				},
				negative: {
					label: 'Negative Reviews',
					description: 'Mostly negative feedback from customers'
				},
				none: {
					label: 'No Reviews',
					description: 'I didnt received reviews yet'
				}
			},
			previous_campaigns: {
				yes: {
					label: 'Successful',
					description: 'Previous campaigns were successful'
				},
				no: {
					label: 'No Ads',
					description: 'No online advertising to date'
				},
				would_like: {
					label: 'I would like to',
					description: 'I like to advertise in the future'
				}
			},
			business_phase: {
				planning: {
					label: 'In Planning',
					description: 'I am planning to start a business'
				},
				less_than_6_months: {
					label: 'Start-Up',
					description: 'The company is still unknown'
				},
				more_than_6_months: {
					label: 'Stable Business',
					description: 'Business is established'
				},
				family_business: {
					label: 'Family Business',
					description: 'Established company'
				}
			},
			implementation_time: {
				immediate: {
					label: 'In record time',
					description: 'Implement within a few days'
				},
				medium: {
					label: 'Vital Growth',
					description: 'Implement within a few months'
				},
				long_term: {
					label: 'Long Term',
					description: 'Implement over a longer period of time'
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
			// Felder-spezifische Validierungsfehler
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
		subtitle: 'Here is your personalized analysis report',
		score: {
			title: 'Your Marketing Score',
			low: {
				title: 'Critical! Your business is barely visible.',
				suggestion: 'We´ll show you how to reach more customers immediately.'
			},
			medium: {
				title: 'Your visibility could be improved.',
				suggestion: 'Increase your reach with smart online marketing strategies.'
			},
			high: {
				title: 'Good! But there is still potential.',
				suggestion: 'With targeted optimization, you can gain even more visibility.'
			},
			excellent: {
				title: 'Outstanding! Your digital presence is excellent.',
				suggestion: 'Use advanced strategies to further expand your dominance!'
			}
		},
		sections: {
			analysis: 'Your Analysis Results',
			steps: {
				title: 'What happens after purchase?',
				purchase: {
					title: 'Purchase',
					description: 'Selection of the appropriate plan and seamless purchase completion',
					icon: 'cart'
				},
				scheduling: {
					title: 'Appointment',
					description: 'Personal appointment scheduling with our digital expert',
					icon: 'calendar'
				},
				implementation: {
					title: 'Implementation',
					description: 'Professional implementation of all agreed-upon measures',
					icon: 'code'
				},
				handover: {
					title: 'Handover',
					description: 'Handover and training on your optimized digital system',
					icon: 'check'
				}
			},
			plans: 'Choose Your Plan',
			testimonials: {
				title: 'Success stories that will motivate you',
				inspiration: 'INSPIRATIONS',
				case1: {
					titleLow: 'From 0 to 100: At least 3 deals daily through maximized online presence',
					titleHigh: 'Breakthrough: Over 43% more inquiries thanks to strategic marketing',
					quote:
						'We received comprehensive advice and decided to have a targeted long-term social media campaign planned and implemented in addition to the web app and new website. We are very satisfied with the conversions after two years.',
					author: '- Dr. P. Ullrich, CEO'
				},
				case2: {
					title: 'Efficient Implementation: Landing page, SEO and full channel ads campaign',
					quote:
						'The landing page and SEO were quickly implemented based on analyzed data for our e-commerce network using Shopware, and the campaign was a complete success thanks to targeted audience selection and conversion tracking. Highly recommended.',
					author: '- M. Keller, Senior Brand Manager'
				}
			},
			improvement: {
				title: 'How We Improve Your Results',
				steps: [
					{
						title: 'Website Optimization',
						description: 'Improving loading times, mobile compatibility, and user experience.',
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
						description: 'Building a solid online presence with all essential foundations.',
						icon: 'home',
						underScore: 40
					},
					{
						title: 'Local SEO',
						description: 'Optimizing for local searches so customers in your area can find you.',
						icon: 'mapPin',
						underScore: 40
					},
					{
						title: 'Content Strategy',
						description: 'Developing a content strategy that engages and convinces your audience.',
						icon: 'fileText',
						underScore: 60
					},
					{
						title: 'Social Media Integration',
						description: 'Connecting your website with social media for greater reach.',
						icon: 'share2',
						underScore: 60
					},
					{
						title: 'Conversion Optimization',
						description: 'Targeted improvements to turn more visitors into customers.',
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
			growthPotential: 'High growth potential',
			visibilityGain: 'Opportunity for rapid visibility increase',
			socialPresence: 'Existing social media presence',
			seoUnderstanding: 'Understanding of search engine optimization',
			digitalTransformation: 'Willingness for digital transformation'
		},
		weaknesses: {
			title: 'Improvement Potential',
			poorVisibility: 'Low digital visibility',
			noStrategy: 'Lacking online marketing strategy',
			poorOptimization: 'Insufficient website optimization',
			limitedReach: 'Limited search engine reach',
			underdevelopedContent: 'Underdeveloped content strategy',
			poorConversion: 'Insufficient conversion optimization',
			contentDistribution: 'Gaps in content distribution',
			competitorAnalysis: 'Limited competitor analysis',
			conversionRate: 'Optimization potential in conversion rate'
		},
		benefits: {
			title: 'Your Benefits',
			visibility: 'Higher visibility on Google & Co.',
			traffic: 'More qualified visitors to your website',
			conversion: 'Better conversion rates through optimized content',
			searchEngines: 'Optimized search engine rankings for relevant keywords',
			socialMedia: 'Improved social media presence and engagement',
			newClients: 'Targeted strategies for new customer acquisition',
			newEmployees: 'Optimized career page for employee recruitment'
		},
		recommendations: {
			title: 'Our Recommendations',
			website: 'Website optimization for better user experience',
			content: 'Content strategy to increase visibility',
			performance: 'Improve website loading speed by optimizing images and scripts',
			seo: 'SEO optimization through improved meta tags and structured data',
			accessibility: 'Improve accessibility for better reach',
			contentQuality: 'Optimize content quality through better structuring and keywords',
			basicSeo: 'Basic SEO optimization of your website',
			googleBusiness: 'Create a Google Business Profile',
			advancedSeo: 'Advanced SEO measures for more organic traffic',
			localSeo: 'Local SEO optimization for regional visibility',
			contentMarketing: 'Content marketing strategy to strengthen market position',
			backlinks: 'Backlink building to increase domain authority',
			extendedContent: 'Extended content strategy for maximum visibility',
			competitorAnalysis: 'Competitor analysis to identify growth opportunities'
		},
		expertProfile: {
			name: 'Christopher Matt',
			role: 'Digital Marketing Expert',
			bio: 'With over 10 years of experience in the digital world, Christopher helps companies optimize their online presence and achieve measurable success. As a certified Google Partner and social media specialist, he knows all the relevant strategies for sustainable visibility.',
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
					label: 'Years of Experience',
					value: '10+',
					icon: 'experience'
				}
			}
		},
		buttons: {
			restart: 'Restart Quiz and Analysis',
			getReport: 'Receive Analysis Report by Email'
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
		breadcrumb: 'Marketing Assessment'
	},
	pricing: {
		perDay: 'Daily',
		features: {
			websiteOptimization: 'Website Optimization',
			basicSeo: 'Essential SEO Strategies',
			monthlyContent: '1 × Content Creation per month',
			performanceReport: 'Monthly Performance Report',
			allBasicFeatures: 'All Features from 1-Month Plan',
			socialMedia: 'Social Media Management',
			weeklyContent: 'Weekly Content Creation',
			keywordOptimization: 'Advanced Keyword Optimization',
			competitorAnalysis: 'Comprehensive Competitor Analysis',
			allPremiumFeatures: 'All Features from 3-Month Plan',
			marketingStrategy: 'Holistic Marketing Strategy',
			dailyContent: 'Daily Content Updates',
			sem: 'Search Engine Marketing (SEM)',
			personalManager: 'Dedicated Marketing Manager',
			cro: 'Conversion Rate Optimization'
		},
		included: {
			longtermBusiness: 'Proven Method for Building a Sustainable Online Business',
			viralContent: 'Exclusive Strategies for Creating Viral Content',
			expertFrameworks: 'Proven Expert Frameworks for Rapid and Efficient Scaling',
			targetedStrategies: 'Data-Driven Strategies Tailored to Your Target Audience'
		},
		excluded: {
			getRichQuick: 'No Get-Rich-Quick Schemes or Overnight Success Fantasies',
			noContracts: 'No Long-Term Commitments or Binding Contracts',
			noInvestment: 'No Empty Promises or Unrealistic Investment Claims',
			pyramidSchemes: 'Avoiding MLM, Dropshipping, or Pyramid Scheme Traps'
		},
		includedTitle: 'Included',
		inAllPlans: 'in all our packages',
		excludedTitle: 'We Do Not',
		notWorking: 'work with',
		choosePlan: 'Select Your Perfect Plan',

		// Detailed pricing options
		header: {
			title: 'Unlock Your Digital Transformation Potential',
			subtitle:
				"Based on your score of {score}, we've crafted a precision-targeted strategy just for you"
		},
		countdown: {
			title: 'Limited Time Offer!',
			subtitle: 'Discount Ends In:'
		},
		bonusBox: {
			tag: 'EXCLUSIVE BONUS',
			title: 'FREE High-Impact Blog Article',
			description:
				'Book within our promotional window and receive a custom, SEO-optimized blog post designed to dramatically boost your online visibility and reach for longer time!',
			benefits: [
				'Tailored exclusively to your business DNA',
				'SEO-engineered for maximum visibility',
				'Instant rocket fuel for your online presence'
			],
			value: 'Value: €99',
			limited: 'Strictly Limited Time Offer'
		},
		paymentOptions: {
			title: 'Choose Your Power Plan:',
			monthly: 'Monthly',
			oneTime: 'One-Time (-8%)',
			longTime: 'Longtime (-20%)',
			hotLabel: 'HOT'
		},
		planLabels: {
			oneTime: 'ONE-TIME',
			oneMonth: '1-MONTH PLAN',
			threeMonth: '3-MONTHS PLAN',
			sixMonth: '6-MONTHS PLAN',
			popular: '★ MOST POPULAR',
			longTimeSuffix: {
				'1-MONATS PLAN': 'BASIS LONGTIME',
				'3-MONATS PLAN': 'PREMIUM LONGTIME',
				BUSINESS: 'BUSINESS LONGTIME'
			}
		},
		additionalBenefits: {
			oneTime: ['8% Discount on Total Price', 'Zero Monthly Recurring Fees'],
			longTime: [
				'Years of Unlimited Access',
				'Massive 20% Lifetime Discount',
				'All Future Updates Included'
			],
			savings: 'Save',
			savingsOption: 'with this option!'
		},
		ctaButton: {
			monthly: 'SUBSCRIBE NOW',
			oneTime: 'SECURE MY PLAN',
			longTime: 'LOCK IN LONGTIME ACCESS',
			selectPlan: 'Choose Plan'
		},
		savings: 'You save',
		trustBadges: ['Secure & Protected Payment', '30-Day Money-Back Guarantee'],
		discountBanner: {
			title: 'Longtime Access with 20% Mega Discount!',
			discount: ' 20% Discount!',
			description:
				'Secure your 5-year growth accelerator NOW! One strategic investment, endless business potential. Skip monthly payments and future-proof your success!',
			buttonText: 'Claim My Advantage!'
		},
		terms: {
			monthly: {
				main: "To ensure uninterrupted service, your selected plan {selectedPlan} will automatically renew at the full price for consecutive periods, billing you {monthlyPrice} monthly. You can cancel anytime by contacting our service team via email at abo@digitalpusher.de if you've selected more than one subscription month.",
				reminder:
					"We'll send a friendly reminder email 5 working days before your subscription expires, giving you the option to continue or pause."
			},
			oneTime:
				'A one-time charge of {totalPrice}€ grants you complete access. No hidden fees, no automatic renewals. Your longtime access is locked in for 5 full years of digital empowerment.',
			acceptance:
				'By clicking "{ctaText}", you confirm acceptance of our Terms of Service and Privacy Policy.'
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
			title: 'Complete Payment',
			subtitle: 'Choose your payment method',
			testButton: 'Test Payment',
			testDescription: 'Test payment with Sandbox account',
			summary: {
				title: 'Summary',
				monthly: 'Monthly Payment',
				oneTime: 'One-time Payment',
				longtime: 'Longtime Access',
				discount: 'Discount',
				donation: 'incl. Donation',
				tax: 'incl. VAT'
			},
			securityBadges: {
				secure: 'SSL Secured',
				protection: 'Buyer Protection',
				instant: 'Instant Access'
			},
			donationBox: {
				title: 'Add 3% Donation',
				description:
					'With your donation, you directly support environmental projects. 93% of your donation goes directly to sustainable projects - verifiable and transparent!'
			},
			errors: {
				general: 'An error occurred. Please try again later.',
				validation: 'Please check your payment information',
				server: 'The PayPal service is temporarily unavailable. Please try again later.',
				timeout: 'The request took too long. Please check your internet connection and try again.'
			}
		},
		success: {
			title: 'Payment Successful!',
			subtitle: 'Thank you for your purchase',
			modalInfo: 'Please do not close this window, it will show you the next steps.',
			paymentDetails: {
				plan: 'Service',
				id: 'Payment ID',
				date: 'Date',
				status: 'Status',
				paid: 'Paid'
			},
			shareContent: {
				title: 'My success with Digital Pusher',
				text: 'I just activated my onlinemarketing-plan at Digital Pusher and Im on my way to more visibility and success! 🚀 #DigitalMarketing'
			},
			donation: {
				title: 'Impact Ready!',
				description:
					'Your generous donation of {amount}€ supports important environmental projects. Together we make a big difference!',
				impact: {
					direct: 'Direct Help',
					projects: 'Projects',
					transparency: 'Transparency'
				}
			},
			nextSteps: {
				title: 'Your next steps:',
				steps: [
					'Check your email for payment confirmation',
					'Schedule a personal consultation appointment',
					'Explore useful resources in your dashboard'
				]
			},
			upgradeOffer: {
				exclusive: 'Exclusive',
				title: 'Expand your package and save 30%',
				subtitle:
					'For new customers only: Add premium features now and take your results to the next level!',
				countdown: 'Offer ends in',
				button: 'Secure Upgrade'
			},
			support: {
				confirmation: 'A confirmation with all details has been sent to your email address.',
				contact: 'Questions? Contact our customer support'
			},
			buttons: {
				dashboard: 'To Dashboard',
				share: 'Share'
			}
		},
		error: {
			title: 'Payment Error',
			defaultMessage: 'An error occurred',
			details: 'Show technical details',
			support: 'If you continue to have problems, please contact our customer support.',
			retry: 'Try again'
		},
		confirm: {
			cancelPurchase: 'Do you really want to cancel the purchase process?',
			confirmButton: 'Yes, cancel',
			cancelButton: 'Back to checkout'
		}
	},
	waitingScreen: {
		title: 'Your details are being analysed - please be patient for a moment.',
		redirect: 'Your result in {remainingTime}'
	}
};

export default en;
