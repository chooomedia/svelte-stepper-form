// src/lib/components/index.js
// Barrel exports for Atomic Design Pattern

// ATOMS - Basic building blocks
export { default as Button } from './atoms/Button.svelte';
export { default as Icon } from './atoms/Icon.svelte';
export { default as ImageOption } from './atoms/ImageOption.svelte';
export { default as Countdown } from './atoms/Countdown.svelte';
export { default as ErrorDisplay } from './atoms/ErrorDisplay.svelte';
export { default as SecurityBadge } from './atoms/SecurityBadge.svelte';
export { default as ShareButton } from './atoms/ShareButton.svelte';
export { default as VisibilityScore } from './atoms/VisibilityScore.svelte';
export { default as PageMeta } from './atoms/PageMeta.svelte';

// MOLECULES - Combinations of atoms
export { default as ContactForm } from './molecules/ContactForm.svelte';
export { default as WebsiteUrlForm } from './molecules/WebsiteUrlForm.svelte';
export { default as EmailReportButton } from './molecules/EmailReportButton.svelte';
export { default as SeoTips } from './molecules/SeoTips.svelte';
export { default as ProcessSteps } from './molecules/ProcessSteps.svelte';

// ORGANISMS - Complex components
export { default as Stepper } from './organisms/Stepper.svelte';
export { default as ResultsPage } from './organisms/ResultsPage.svelte';
export { default as PerformanceChart } from './organisms/PerformanceChart.svelte';
export { default as PricingOptions } from './organisms/PricingOptions.svelte';
export { default as WaitingScreen } from './organisms/WaitingScreen.svelte';
export { default as Footer } from './organisms/Footer.svelte';

// TEMPLATES - Page-level layouts
export { default as BenefitsSection } from './templates/BenefitsSection.svelte';
export { default as ExpertSection } from './templates/ExpertSection.svelte';
export { default as ImprovementSection } from './templates/ImprovementSection.svelte';

// MODAL - Specialized organism
export { default as Modal } from './organisms/modal/Modal.svelte';
export { default as ModalController } from './organisms/modal/ModalController.svelte';
export { modalStore } from './organisms/modal/modalStore';

// PRICING - Specialized components
export { default as CountdownTimer } from './pricing/CountdownTimer.svelte';
export { default as PaymentTypeSelector } from './pricing/PaymentTypeSelector.svelte';
export { default as BonusBox } from './pricing/BonusBox.svelte';
export { default as DiscountBanner } from './pricing/DiscountBanner.svelte';
export { default as TermsConditions } from './pricing/TermsConditions.svelte';
export { default as PaymentMethods } from './pricing/PaymentMethods.svelte';
export { default as TrustBadges } from './pricing/TrustBadges.svelte';
export { default as PricingHeader } from './pricing/PricingHeader.svelte';

// CHART - Specialized utilities
export { getChartLabels, getScoreColor } from './chart/ChartLabels';
export { type Metric } from './chart/ChartMetrics';
export { createAnimationState } from './chart/ChartAnimations';
export { createChartEventHandlers, createChartLifecycle } from './chart/ChartEvents';
export { createChartLifecycleState, createChartLifecycle as createChartLifecycleManager } from './chart/ChartLifecycle';
export { calculateChartMetrics, type CalculationContext } from './chart/ChartCalculation';
export { createChartEffects } from './chart/ChartHelpers';
