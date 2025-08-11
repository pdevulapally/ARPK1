'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ArrowRight, ArrowLeft, Star, ShoppingCart, BookOpen, Building, Zap, Globe, Calendar, CreditCard, Palette, FileText, Info, Lightbulb, Clock, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import AuthGuard from '@/components/auth-guard';
import { createRequest } from '@/lib/firebase';

// Define the form schema for each step
const websiteTypeSchema = z.object({
  websiteType: z.string().min(1, 'Please select a website type'),
  otherWebsiteType: z.string().optional(),
});

const featuresSchema = z.object({
  features: z.array(z.string()).min(1, 'Please select at least one feature'),
});

const timelineBudgetSchema = z.object({
  deadline: z.string().min(1, 'Please select a deadline'),
  budgetRange: z.string().min(1, 'Please select a budget range'),
});

const detailsSchema = z.object({
  designPreferences: z.string().optional(),
  additionalNotes: z.string().optional(),
});

// Combine all schemas for the final form data
const formSchema = z.object({
  ...websiteTypeSchema.shape,
  ...featuresSchema.shape,
  ...timelineBudgetSchema.shape,
  ...detailsSchema.shape,
});

type FormData = z.infer<typeof formSchema>;

const websiteTypes = [
  { 
    value: "portfolio", 
    label: "Portfolio", 
    icon: <Star className="h-6 w-6" />,
    description: "Showcase your work, projects, or creative portfolio",
    examples: "Photographer portfolios, designer showcases, artist galleries"
  },
  { 
    value: "ecommerce", 
    label: "Online Store", 
    icon: <ShoppingCart className="h-6 w-6" />,
    description: "Sell products or services online with payment processing",
    examples: "Online shops, digital marketplaces, subscription services"
  },
  { 
    value: "blog", 
    label: "Blog", 
    icon: <BookOpen className="h-6 w-6" />,
    description: "Share content, articles, or personal thoughts",
    examples: "Personal blogs, company blogs, news websites"
  },
  { 
    value: "business", 
    label: "Business", 
    icon: <Building className="h-6 w-6" />,
    description: "Professional business website with company information",
    examples: "Company websites, service providers, professional services"
  },
  { 
    value: "landing", 
    label: "Landing Page", 
    icon: <Zap className="h-6 w-6" />,
    description: "Single page focused on conversions and leads",
    examples: "Product launches, event pages, lead generation"
  },
  { 
    value: "web-app", 
    label: "Web App", 
    icon: <Globe className="h-6 w-6" />,
    description: "Interactive web application with user functionality",
    examples: "SaaS platforms, dashboards, online tools"
  },
  { 
    value: "other", 
    label: "Other", 
    icon: <Globe className="h-6 w-6" />,
    description: "Custom website that doesn't fit other categories",
    examples: "Custom solutions, unique projects, special requirements"
  },
];

const features = [
  { 
    id: "responsive", 
    label: "Mobile-friendly", 
    description: "Works perfectly on phones, tablets, and desktops",
    essential: true
  },
  { 
    id: "seo", 
    label: "SEO optimized", 
    description: "Help your website rank higher in search engines",
    essential: true
  },
  { 
    id: "admin", 
    label: "Admin panel", 
    description: "Easy-to-use dashboard to manage your content",
    essential: false
  },
  { 
    id: "blog", 
    label: "Blog system", 
    description: "Add and manage blog posts or articles",
    essential: false
  },
  { 
    id: "payments", 
    label: "Payment processing", 
    description: "Accept online payments and subscriptions",
    essential: false
  },
  { 
    id: "login", 
    label: "User accounts", 
    description: "Allow users to create accounts and login",
    essential: false
  },
  { 
    id: "analytics", 
    label: "Analytics", 
    description: "Track website visitors and performance",
    essential: false
  },
  { 
    id: "animations", 
    label: "Animations", 
    description: "Smooth animations and interactive elements",
    essential: false
  },
];

const budgetRanges = [
  { 
    value: "500-1000", 
    label: "£500 - £1,000", 
    description: "Basic website with essential features",
    timeline: "2-3 weeks",
    includes: "Design, development, basic SEO, mobile-friendly"
  },
  { 
    value: "1000-2500", 
    label: "£1,000 - £2,500", 
    description: "Professional website with advanced features",
    timeline: "3-4 weeks",
    includes: "Custom design, admin panel, blog, analytics"
  },
  { 
    value: "2500-5000", 
    label: "£2,500 - £5,000", 
    description: "Premium website with complex functionality",
    timeline: "4-6 weeks",
    includes: "E-commerce, user accounts, custom features"
  },
  { 
    value: "5000+", 
    label: "£5,000+", 
    description: "Enterprise-level website with full customization",
    timeline: "6+ weeks",
    includes: "Full custom development, advanced integrations"
  },
];

export default function RequestPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<FormData>>({
    features: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit a request",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [user, router, toast]);

  // Define the steps
  const steps = [
    {
      id: 'websiteType',
      title: 'Website Type',
      description: 'What type of website do you need?',
      schema: websiteTypeSchema,
      info: 'Choose the category that best describes your project. This helps us understand your needs and provide the right solution.',
    },
    {
      id: 'features',
      title: 'Features',
      description: 'What features do you need?',
      schema: featuresSchema,
      info: 'Select the features that will make your website work for your business. Essential features are recommended for all websites.',
    },
    {
      id: 'timelineBudget',
      title: 'Timeline & Budget',
      description: 'When do you need it and what\'s your budget?',
      schema: timelineBudgetSchema,
      info: 'Your timeline and budget help us plan the project and suggest the best approach for your needs.',
    },
    {
      id: 'details',
      title: 'Design & Details',
      description: 'Share your vision with us',
      schema: detailsSchema,
      info: 'Tell us about your design preferences and any specific requirements. The more details you provide, the better we can match your vision.',
    },
  ];

  // Get the current step schema
  const currentStepSchema = steps[step].schema as z.ZodType<any, any, any>;

  // Setup form with the current step schema
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<any>({
    resolver: zodResolver(currentStepSchema),
    defaultValues: formData,
  });

  const watchedFeatures = watch('features') || [];

  // Calculate progress percentage
  const progress = ((step + 1) / steps.length) * 100;

  // Handle next step
  const handleNextStep = (data: any) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    if (step < steps.length - 1) {
      setStep(step + 1);
      // Reset form with the updated data for the next step
      reset(updatedData);
    } else {
      // Final step submission
      handleFinalSubmit(updatedData);
    }
  };

  const handleFinalSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to submit a request",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      // Map budget range to budget value
      const budgetMap: { [key: string]: string } = {
        "500-1000": "£500 - £1,000",
        "1000-2500": "£1,000 - £2,500",
        "2500-5000": "£2,500 - £5,000",
        "5000+": "£5,000+"
      };

             const requestData: any = {
         userId: user.uid,
         userEmail: user.email || "",
         status: "pending",
         budget: budgetMap[data.budgetRange] || data.budgetRange,
         websiteType: data.websiteType,
         features: data.features,
         deadline: data.deadline,
       };

       // Only add optional fields if they have values
       if (data.designPreferences && data.designPreferences.trim()) {
         requestData.designPreferences = data.designPreferences;
       }
       
       if (data.additionalNotes && data.additionalNotes.trim()) {
         requestData.additionalNotes = data.additionalNotes;
       }
       
       if (data.otherWebsiteType && data.otherWebsiteType.trim()) {
         requestData.otherWebsiteType = data.otherWebsiteType;
       }

      await createRequest(requestData);

      toast({
        title: "Request submitted!",
        description: "We'll review your request and get back to you within 24 hours.",
      });

      setIsComplete(true);
      setIsSubmitting(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Handle feature selection
  const handleFeatureChange = (featureId: string, checked: boolean) => {
    const currentFeatures = watchedFeatures;
    const updatedFeatures = checked 
      ? [...currentFeatures, featureId]
      : currentFeatures.filter((id: string) => id !== featureId);
    
    setValue('features', updatedFeatures);
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
  };

  // Animation variants
  const variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-8">
            {/* Information Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">How to choose your website type</h3>
                  <p className="text-blue-200 text-sm">
                    Select the category that best matches your project. Each type has different features and requirements. 
                    If you're unsure, choose the closest match or select "Other" and describe your needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {websiteTypes.map((type) => (
                <div
                  key={type.value}
                  className={cn(
                    "p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105",
                    formData.websiteType === type.value
                      ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                      : "border-gray-700 hover:border-purple-500/50 bg-gray-800/50"
                  )}
                  onClick={() => {
                    setValue('websiteType', type.value);
                    setFormData(prev => ({ ...prev, websiteType: type.value }));
                  }}
                >
                  <div className="text-center space-y-4">
                    <div className="text-purple-500 flex justify-center">{type.icon}</div>
                    <div className="text-lg font-semibold">{type.label}</div>
                    <div className="text-sm text-gray-400">{type.description}</div>
                    <div className="text-xs text-gray-500 bg-gray-800/50 p-2 rounded">
                      <strong>Examples:</strong> {type.examples}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.websiteType === "other" && (
              <div className="mt-6">
                <Label htmlFor="otherWebsiteType" className="text-lg font-medium mb-3 block">
                  Tell us about your project
                </Label>
                <Textarea
                  id="otherWebsiteType"
                  placeholder="Describe your website idea, what you want to achieve, and any specific requirements..."
                  className="min-h-[100px] text-lg"
                  {...register('otherWebsiteType')}
                />
                <p className="text-sm text-gray-400 mt-2">
                  Be as detailed as possible so we can understand your unique needs.
                </p>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-8">
            {/* Information Box */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-300 mb-2">Essential vs Optional Features</h3>
                  <p className="text-green-200 text-sm">
                    <strong>Essential features</strong> are recommended for all websites to ensure good performance and user experience. 
                    <strong> Optional features</strong> add extra functionality based on your specific needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={cn(
                    "p-4 md:p-6 rounded-xl border-2 transition-all duration-200",
                    watchedFeatures.includes(feature.id)
                      ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                      : "border-gray-700 hover:border-purple-500/50 bg-gray-800/50"
                  )}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={watchedFeatures.includes(feature.id)}
                          onCheckedChange={(checked) => handleFeatureChange(feature.id, checked as boolean)}
                          className="h-5 w-5"
                        />
                        <span className="text-base font-medium">{feature.label}</span>
                      </div>
                      {feature.essential && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Essential</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-300 mb-2">Our Recommendation</h3>
                  <p className="text-yellow-200 text-sm">
                    We recommend selecting <strong>Mobile-friendly</strong> and <strong>SEO optimized</strong> for all websites 
                    as these are crucial for modern web standards and user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            {/* Information Box */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-purple-300 mb-2">Timeline & Budget Guide</h3>
                  <p className="text-purple-200 text-sm">
                    Your budget and timeline help us determine the scope and complexity of your project. 
                    Higher budgets allow for more features and faster delivery.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <Label htmlFor="deadline" className="flex items-center gap-3 mb-4 text-lg font-medium">
                  <Calendar className="h-5 w-5" />
                  When do you need it?
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  className="h-12 text-lg"
                  {...register('deadline')}
                />
                <p className="text-sm text-gray-400 mt-2">
                  Choose a realistic deadline. Rushed projects may require additional costs.
                </p>
              </div>

              <div>
                <Label className="flex items-center gap-3 mb-4 text-lg font-medium">
                  <CreditCard className="h-5 w-5" />
                  What's your budget?
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {budgetRanges.map((range) => (
                    <div
                      key={range.value}
                      className={cn(
                        "p-4 md:p-6 rounded-xl border-2 cursor-pointer transition-all duration-200",
                        formData.budgetRange === range.value
                          ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                          : "border-gray-700 hover:border-purple-500/50 bg-gray-800/50"
                      )}
                      onClick={() => {
                        setValue('budgetRange', range.value);
                        setFormData(prev => ({ ...prev, budgetRange: range.value }));
                      }}
                    >
                      <div className="space-y-3">
                        <div className="text-lg font-semibold text-center">{range.label}</div>
                        <div className="text-sm text-gray-400 text-center">{range.description}</div>
                        <div className="text-xs text-gray-500 bg-gray-800/50 p-2 rounded">
                          <div><strong>Timeline:</strong> {range.timeline}</div>
                          <div><strong>Includes:</strong> {range.includes}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            {/* Information Box */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Palette className="h-5 w-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-orange-300 mb-2">Design & Details Tips</h3>
                  <p className="text-orange-200 text-sm">
                    Share websites you like, describe your brand colors, mention specific features you want, 
                    or tell us about your target audience. The more details you provide, the better we can match your vision.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="designPreferences" className="flex items-center gap-3 mb-4 text-lg font-medium">
                  <Palette className="h-5 w-5" />
                  Design preferences
                </Label>
                <Textarea
                  id="designPreferences"
                  placeholder="• What websites do you like? (share URLs if possible)&#10;• What colors represent your brand?&#10;• Modern and clean, or bold and creative?&#10;• Any specific design elements you want?&#10;• Who is your target audience?"
                  className="min-h-[150px] text-lg p-4"
                  {...register('designPreferences')}
                />
                <p className="text-sm text-gray-400 mt-2">
                  Examples: "I like the clean design of Apple's website", "My brand colors are blue and white", 
                  "Target audience is small business owners aged 30-50"
                </p>
              </div>

              <div>
                <Label htmlFor="additionalNotes" className="flex items-center gap-3 mb-4 text-lg font-medium">
                  <FileText className="h-5 w-5" />
                  Additional notes (optional)
                </Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="• Any special requirements or features?&#10;• Integration with other tools or services?&#10;• Content management needs?&#10;• Future expansion plans?&#10;• Any questions or concerns?"
                  className="min-h-[150px] text-lg p-4"
                  {...register('additionalNotes')}
                />
                <p className="text-sm text-gray-400 mt-2">
                  This is your chance to tell us anything else that might be important for your project.
                </p>
              </div>
            </div>

            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-300 mb-2">What happens next?</h3>
                  <p className="text-green-200 text-sm">
                    After you submit this form, we'll review your requirements and get back to you within 24 hours 
                    with a detailed proposal, timeline, and quote tailored to your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black">
        <div className="container max-w-4xl mx-auto px-4 py-20 md:py-24 lg:py-32">
          {!isComplete ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 md:p-6 lg:p-8 shadow-lg">
              {/* Progress bar */}
              <div className="mb-6 md:mb-8">
                <div className="mb-2 flex justify-between">
                  <span className="text-base md:text-lg font-medium text-gray-300">
                    Step {step + 1} of {steps.length}
                  </span>
                  <span className="text-base md:text-lg font-medium text-purple-400">
                    {Math.round(progress)}%
                  </span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-700" />
              </div>

              {/* Step indicators */}
              <div className="mb-6 md:mb-8 flex justify-between">
                {steps.map((s, i) => (
                  <div key={s.id} className="flex flex-col items-center">
                    <div
                      className={cn(
                        'flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full text-xs md:text-sm font-bold transition-all duration-300',
                        i < step
                          ? 'bg-purple-500 text-white'
                          : i === step
                            ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                            : 'bg-gray-700 text-gray-400',
                      )}
                    >
                      {i < step ? <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" /> : i + 1}
                    </div>
                    <span className="mt-1 md:mt-2 text-xs text-gray-400 text-center max-w-[60px] md:max-w-[80px] leading-tight">
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3">{steps[step].title}</h2>
                    <p className="text-gray-400 text-base md:text-lg mb-3 md:mb-4">
                      {steps[step].description}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {steps[step].info}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(handleNextStep)} className="space-y-4 md:space-y-6">
                    {renderStepContent()}

                    <div className="flex justify-between pt-4 md:pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevStep}
                        disabled={step === 0}
                        className={cn(
                          "border-gray-700 text-gray-300 hover:bg-gray-800 h-10 md:h-12 px-4 md:px-6 text-sm md:text-lg",
                          step === 0 && 'invisible'
                        )}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-purple-600 hover:bg-purple-700 h-10 md:h-12 px-4 md:px-6 text-sm md:text-lg"
                      >
                        {step === steps.length - 1 ? (
                          isSubmitting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2" />
                              <span className="hidden md:inline">Submitting...</span>
                              <span className="md:hidden">Submitting</span>
                            </>
                          ) : (
                            <>
                              <span className="hidden md:inline">Submit Request</span>
                              <span className="md:hidden">Submit</span>
                            </>
                          )
                        ) : (
                          <>
                            <span className="hidden md:inline">Next</span>
                            <span className="md:hidden">Next</span>
                            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 md:p-8 lg:p-12 text-center"
            >
              <div className="bg-purple-500/10 mb-4 md:mb-6 inline-flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full">
                <CheckCircle2 className="text-purple-500 h-8 w-8 md:h-10 md:w-10" />
              </div>
              <h2 className="mb-3 md:mb-4 text-2xl md:text-3xl font-bold text-white">Request Submitted!</h2>
              <p className="text-gray-400 mb-6 md:mb-8 text-base md:text-lg">
                Thank you for your detailed request. We'll review all the information and get back to you within 24 hours 
                with a comprehensive proposal tailored to your needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-purple-600 hover:bg-purple-700 h-10 md:h-12 px-4 md:px-6 text-sm md:text-lg"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(0);
                    setFormData({ features: [] });
                    setIsComplete(false);
                    reset({});
                  }}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 h-10 md:h-12 px-4 md:px-6 text-sm md:text-lg"
                >
                  Submit Another Request
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
