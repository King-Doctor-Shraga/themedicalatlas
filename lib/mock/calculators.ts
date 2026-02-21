import { Calculator } from './types';

const calculators: Calculator[] = [
  {
    slug: 'bmi',
    title: {
      en: 'BMI Calculator',
      ar: 'حاسبة مؤشر كتلة الجسم',
    },
    description: {
      en: 'Calculate your Body Mass Index (BMI) to check if your weight is in a healthy range for your height.',
      ar: 'احسب مؤشر كتلة الجسم (BMI) للتحقق مما إذا كان وزنك في النطاق الصحي بالنسبة لطولك.',
    },
    category: 'General Health',
    seoTitle: {
      en: 'BMI Calculator – Check Your Body Mass Index | Medical Atlas',
      ar: 'حاسبة مؤشر كتلة الجسم – تحقق من وزنك المثالي | أطلس الطبي',
    },
    seoDescription: {
      en: 'Use our free BMI calculator to determine your Body Mass Index. Find out if you are underweight, normal weight, overweight, or obese based on your height and weight.',
      ar: 'استخدم حاسبة مؤشر كتلة الجسم المجانية لتحديد مؤشر كتلة جسمك. اكتشف ما إذا كنت تعاني من نقص الوزن أو الوزن الطبيعي أو زيادة الوزن أو السمنة.',
    },
  },
  {
    slug: 'blood-sugar-converter',
    title: {
      en: 'Blood Sugar Converter',
      ar: 'محوّل سكر الدم',
    },
    description: {
      en: 'Convert blood sugar levels between mg/dL and mmol/L units quickly and accurately.',
      ar: 'حوّل مستويات سكر الدم بين وحدات mg/dL و mmol/L بسرعة ودقة.',
    },
    category: 'Diabetes',
    seoTitle: {
      en: 'Blood Sugar Converter – mg/dL to mmol/L | Medical Atlas',
      ar: 'محوّل سكر الدم – mg/dL إلى mmol/L | أطلس الطبي',
    },
    seoDescription: {
      en: 'Easily convert blood glucose values between mg/dL and mmol/L. Essential tool for diabetes management across different measurement systems.',
      ar: 'حوّل قيم جلوكوز الدم بسهولة بين mg/dL و mmol/L. أداة أساسية لإدارة مرض السكري عبر أنظمة القياس المختلفة.',
    },
  },
];

export function getAllCalculators(): Calculator[] {
  return calculators;
}

export function getCalculatorBySlug(slug: string): Calculator | undefined {
  return calculators.find((c) => c.slug === slug);
}
