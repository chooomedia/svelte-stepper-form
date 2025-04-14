// src/lib/i18n/translations/ar.ts
import type { Translation } from '../types';
import en from './en'; // Import English as fallback

// Create Arabic translations with English fallbacks for now
const ar: Partial<Translation> = {
	// This is a starter template for Arabic translations
	// Initially, we're providing a few key translations and using English as a fallback
	start: {
		title: 'اختبار تسويق رقمي',
		text: '<strong>احسب ظهورك عبر الإنترنت</strong>، <strong>زد من نطاق وصولك</strong>، <strong>وفر الموارد</strong> و <strong>عزز الإيرادات</strong> الآن.',
		meta: {
			rating: {
				user: 'عملاء',
				from: 'من',
				quiztime: 'دقيقة اختبار'
			}
		}
	},
	common: {
		next: 'التالي',
		skip: 'تخطي',
		back: 'رجوع',
		submit: 'إرسال',
		loading: 'جاري التحميل...',
		error: 'حدث خطأ',
		success: 'تم بنجاح!',
		analyze: 'تحليل',
		formErrorHeading: 'يرجى تصحيح الأخطاء التالية:',
		support: 'الدعم'
	},
	footer: {
		copyright: 'جميع الحقوق محفوظة.'
	}
	// Add more translations as needed
};

// Create a complete translation object by merging Arabic translations
// with English fallbacks for missing entries
const completeArabicTranslations = {
	...en, // Use English as the base
	...ar // Override with available Arabic translations
} as Translation;

export default completeArabicTranslations;
