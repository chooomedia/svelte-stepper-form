// src/lib/services/paypalWebhookService.ts
import { browser } from "$app/environment";
import { env } from "$lib/config/env";
import { i18n } from "$lib/i18n";

/**
 * PayPal Payment Status
 */
export enum PayPalPaymentStatus {
  LOADING = "loading",
  INITIALIZING = "initializing",
  CONNECTING = "connecting",
  PROCESSING = "processing",
  VALIDATING = "validating",
  SUCCESS = "success",
  ERROR = "error",
  CANCELLED = "cancelled",
}

/**
 * PayPal Webhook Payload Interface
 */
export interface PayPalWebhookPayload {
  paymentId: string;
  status: PayPalPaymentStatus;
  amount: number;
  currency: string;
  planType: string;
  paymentType: string;
  clientReference: string;
  timestamp: string;
  userAgent: string;
  ipAddress?: string;
  metadata: {
    language: string;
    userEmail?: string;
    companyName?: string;
    includeDonation?: boolean;
    donationAmount?: number;
  };
}

/**
 * PayPal Webhook Response Interface
 */
export interface PayPalWebhookResponse {
  success: boolean;
  message: string;
  data?: any;
  paymentId?: string;
}

/**
 * PayPal Loading State Interface
 */
export interface PayPalLoadingState {
  status: PayPalPaymentStatus;
  message: string;
  progress: number;
  showSpinner: boolean;
  showProgress: boolean;
  error?: string;
}

/**
 * Service to handle PayPal payment tracking and n8n webhook integration
 */
export class PayPalWebhookService {
  private static readonly BASE_URL = env.N8N_BASE_URL;
  private static readonly PAYPAL_WEBHOOK_URL = `${env.N8N_BASE_URL}/webhook/paypal-payment`;

  /**
   * Send PayPal payment status to n8n webhook
   */
  public static async sendPaymentStatus(
    payload: PayPalWebhookPayload
  ): Promise<PayPalWebhookResponse> {
    if (!browser) {
      return {
        success: false,
        message: "Can only be called in browser environment",
      };
    }

    try {
      console.log("🔄 Sending PayPal payment status to webhook:", payload);

      const response = await fetch(this.PAYPAL_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Source": "paypal-payment",
          "X-Client-Version": "1.0.0",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ PayPal payment status sent successfully:", result);

      return {
        success: true,
        message: "Payment status sent successfully",
        data: result,
        paymentId: payload.paymentId,
      };
    } catch (error) {
      console.error("❌ Error sending PayPal payment status:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        paymentId: payload.paymentId,
      };
    }
  }

  /**
   * Create PayPal loading state based on status
   */
  public static createLoadingState(
    status: PayPalPaymentStatus
  ): PayPalLoadingState {
    const currentLanguage = $i18n.locale;

    const loadingMessages = {
      de: {
        loading: "PayPal wird geladen...",
        initializing: "PayPal wird initialisiert...",
        connecting: "Verbindung zu PayPal wird hergestellt...",
        processing: "Zahlung wird verarbeitet...",
        validating: "Zahlung wird validiert...",
        success: "Zahlung erfolgreich!",
        error: "Fehler bei der Zahlung",
        cancelled: "Zahlung abgebrochen",
      },
      en: {
        loading: "Loading PayPal...",
        initializing: "Initializing PayPal...",
        connecting: "Connecting to PayPal...",
        processing: "Processing payment...",
        validating: "Validating payment...",
        success: "Payment successful!",
        error: "Payment error",
        cancelled: "Payment cancelled",
      },
      hu: {
        loading: "PayPal betöltése...",
        initializing: "PayPal inicializálása...",
        connecting: "Kapcsolódás a PayPal-hoz...",
        processing: "Fizetés feldolgozása...",
        validating: "Fizetés ellenőrzése...",
        success: "Fizetés sikeres!",
        error: "Fizetési hiba",
        cancelled: "Fizetés megszakítva",
      },
      ar: {
        loading: "جاري تحميل PayPal...",
        initializing: "جاري تهيئة PayPal...",
        connecting: "جاري الاتصال بـ PayPal...",
        processing: "جاري معالجة الدفع...",
        validating: "جاري التحقق من الدفع...",
        success: "تم الدفع بنجاح!",
        error: "خطأ في الدفع",
        cancelled: "تم إلغاء الدفع",
      },
      tr: {
        loading: "PayPal yükleniyor...",
        initializing: "PayPal başlatılıyor...",
        connecting: "PayPal'a bağlanılıyor...",
        processing: "Ödeme işleniyor...",
        validating: "Ödeme doğrulanıyor...",
        success: "Ödeme başarılı!",
        error: "Ödeme hatası",
        cancelled: "Ödeme iptal edildi",
      },
      ro: {
        loading: "Se încarcă PayPal...",
        initializing: "Se inițializează PayPal...",
        connecting: "Se conectează la PayPal...",
        processing: "Se procesează plata...",
        validating: "Se validează plata...",
        success: "Plata a reușit!",
        error: "Eroare la plată",
        cancelled: "Plata a fost anulată",
      },
      ru: {
        loading: "Загрузка PayPal...",
        initializing: "Инициализация PayPal...",
        connecting: "Подключение к PayPal...",
        processing: "Обработка платежа...",
        validating: "Проверка платежа...",
        success: "Платеж успешен!",
        error: "Ошибка платежа",
        cancelled: "Платеж отменен",
      },
    };

    const messages = loadingMessages[currentLanguage] || loadingMessages.en;

    // Progress mapping based on status
    const progressMap = {
      [PayPalPaymentStatus.LOADING]: 10,
      [PayPalPaymentStatus.INITIALIZING]: 25,
      [PayPalPaymentStatus.CONNECTING]: 40,
      [PayPalPaymentStatus.PROCESSING]: 70,
      [PayPalPaymentStatus.VALIDATING]: 90,
      [PayPalPaymentStatus.SUCCESS]: 100,
      [PayPalPaymentStatus.ERROR]: 0,
      [PayPalPaymentStatus.CANCELLED]: 0,
    };

    return {
      status,
      message: messages[status] || messages.loading,
      progress: progressMap[status] || 0,
      showSpinner:
        status !== PayPalPaymentStatus.SUCCESS &&
        status !== PayPalPaymentStatus.ERROR,
      showProgress:
        status !== PayPalPaymentStatus.SUCCESS &&
        status !== PayPalPaymentStatus.ERROR &&
        status !== PayPalPaymentStatus.CANCELLED,
    };
  }

  /**
   * Generate unique client reference for PayPal payments
   */
  public static generateClientReference(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `DP_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Create PayPal webhook payload
   */
  public static createWebhookPayload(
    paymentId: string,
    status: PayPalPaymentStatus,
    amount: number,
    currency: string,
    planType: string,
    paymentType: string,
    metadata: Partial<PayPalWebhookPayload["metadata"]> = {}
  ): PayPalWebhookPayload {
    return {
      paymentId,
      status,
      amount,
      currency,
      planType,
      paymentType,
      clientReference: this.generateClientReference(),
      timestamp: new Date().toISOString(),
      userAgent: browser ? navigator.userAgent : "server",
      metadata: {
        language: $i18n.locale,
        ...metadata,
      },
    };
  }

  /**
   * Track PayPal SDK loading progress
   */
  public static async trackSDKLoading(): Promise<void> {
    const payload = this.createWebhookPayload(
      "sdk-loading",
      PayPalPaymentStatus.LOADING,
      0,
      "EUR",
      "unknown",
      "unknown"
    );

    await this.sendPaymentStatus(payload);
  }

  /**
   * Track PayPal payment initialization
   */
  public static async trackPaymentInitialization(
    amount: number,
    currency: string,
    planType: string,
    paymentType: string,
    userEmail?: string
  ): Promise<void> {
    const payload = this.createWebhookPayload(
      "payment-init",
      PayPalPaymentStatus.INITIALIZING,
      amount,
      currency,
      planType,
      paymentType,
      { userEmail }
    );

    await this.sendPaymentStatus(payload);
  }

  /**
   * Track PayPal payment processing
   */
  public static async trackPaymentProcessing(
    paymentId: string,
    amount: number,
    currency: string,
    planType: string,
    paymentType: string
  ): Promise<void> {
    const payload = this.createWebhookPayload(
      paymentId,
      PayPalPaymentStatus.PROCESSING,
      amount,
      currency,
      planType,
      paymentType
    );

    await this.sendPaymentStatus(payload);
  }

  /**
   * Track PayPal payment success
   */
  public static async trackPaymentSuccess(
    paymentId: string,
    amount: number,
    currency: string,
    planType: string,
    paymentType: string,
    userEmail?: string
  ): Promise<void> {
    const payload = this.createWebhookPayload(
      paymentId,
      PayPalPaymentStatus.SUCCESS,
      amount,
      currency,
      planType,
      paymentType,
      { userEmail }
    );

    await this.sendPaymentStatus(payload);
  }

  /**
   * Track PayPal payment error
   */
  public static async trackPaymentError(
    paymentId: string,
    error: string,
    amount: number,
    currency: string,
    planType: string,
    paymentType: string
  ): Promise<void> {
    const payload = this.createWebhookPayload(
      paymentId,
      PayPalPaymentStatus.ERROR,
      amount,
      currency,
      planType,
      paymentType,
      { error }
    );

    await this.sendPaymentStatus(payload);
  }
}
