// src/lib/i18n/translations/common.ts

export const commonTranslations = {
	de: {
		next: 'Weiter',
		skip: 'Überspringen',
		back: 'Zurück',
		submit: 'Absenden',
		loading: 'Wird geladen...',
		error: 'Ein Fehler ist aufgetreten',
		success: 'Erfolgreich!',
		analyze: 'Analysieren',
		formErrorHeading: 'Bitte korrigiere die folgenden Fehler:',
		support: 'Support',
		backToHome: 'Zurück zur Startseite',
		tryAgainLater: 'Bitte versuche es später erneut oder kontaktiere unseren Support.',
		contactSupport: 'Support kontaktieren'
	},
	en: {
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
	hu: {
		next: 'Tovább',
		skip: 'Kihagyás',
		back: 'Vissza',
		submit: 'Küldés',
		loading: 'Betöltés...',
		error: 'Hiba történt',
		success: 'Siker!',
		analyze: 'Elemzés',
		formErrorHeading: 'Kérjük javítsd a következő hibákat:',
		support: 'Támogatás',
		backToHome: 'Vissza a Főoldalra',
		tryAgainLater: 'Kérjük próbáld újra később vagy lépj kapcsolatba támogatásunkkal.',
		contactSupport: 'Kapcsolat a Támogatással'
	},
	ar: {
		next: 'التالي',
		skip: 'تخطى',
		back: 'رجوع',
		submit: 'إرسال',
		loading: 'جاري التحميل...',
		error: 'حدث خطأ',
		success: 'نجح!',
		analyze: 'تحليل',
		formErrorHeading: 'يرجى تصحيح الأخطاء التالية:',
		support: 'الدعم',
		backToHome: 'العودة إلى الصفحة الرئيسية',
		tryAgainLater: 'يرجى المحاولة مرة أخرى لاحقاً أو الاتصال بدعمنا.',
		contactSupport: 'اتصل بالدعم'
	},
	tr: {
		next: 'İleri',
		skip: 'Atla',
		back: 'Geri',
		submit: 'Gönder',
		loading: 'Yükleniyor...',
		error: 'Hata oluştu',
		success: 'Başarılı!',
		analyze: 'Analiz Et',
		formErrorHeading: 'Lütfen hataları düzeltin:',
		support: 'Destek',
		backToHome: 'Ana Sayfaya Dön',
		tryAgainLater: 'Lütfen daha sonra tekrar deneyin veya destek ekibimizle iletişime geçin.',
		contactSupport: 'Destek İle İletişim'
	},
	ro: {
		next: 'Continuă',
		skip: 'Sari peste',
		back: 'Înapoi',
		submit: 'Trimite',
		loading: 'Se încarcă...',
		error: 'Eroare',
		success: 'Succes!',
		analyze: 'Analizează',
		formErrorHeading: 'Corectează următoarele erori:',
		support: 'Suport',
		backToHome: 'Înapoi la Pagina Principală',
		tryAgainLater: 'Te rugăm să încerci din nou mai târziu sau să contactezi suportul nostru.',
		contactSupport: 'Contactează Suportul'
	},
	ru: {
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
		tryAgainLater: 'Пожалуйста, попробуйте позже или обратитесь в нашу службу поддержки.',
		contactSupport: 'Связаться с поддержкой'
	}
};

export function getCommonTranslation(language: string) {
	return commonTranslations[language as keyof typeof commonTranslations] || commonTranslations.en;
}
