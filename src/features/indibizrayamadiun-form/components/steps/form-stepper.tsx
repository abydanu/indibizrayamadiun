import React from 'react';
import { FileText, User, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  icon: React.ComponentType<any>;
}

interface FormStepperProps {
  currentStep: number;
}

const FormStepper: React.FC<FormStepperProps> = ({ currentStep }) => {
  const steps: Step[] = [
    { number: 1, title: 'Informasi Usaha', icon: FileText },
    { number: 2, title: 'Data PIC', icon: User },
    { number: 3, title: 'Paket & Sales', icon: Package },
  ];

  return (
    <div className="mb-8 md:mb-12">
      <div className="relative">
        <div className="absolute top-4 md:top-6 left-0 w-full h-0.5 bg-muted rounded-full" />
        
        <div
          className="absolute top-4 md:top-6 left-0 h-0.5 bg-gradient-to-r from-red-500 to-red-600 transition-all duration-1000 ease-in-out rounded-full"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/20 to-transparent animate-pulse rounded-full" />
        </div>
        
        <div className="relative flex justify-between px-1 md:px-0">
          {steps.map((step) => {
            const IconComponent = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center relative z-10">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full border-2 transition-all duration-500 ease-in-out hover:scale-105',
                    isActive || isCompleted
                      ? 'border-red-600 bg-red-50 dark:bg-red-950/20 shadow-lg scale-110 ring-2 md:ring-4 ring-red-100 dark:ring-red-900/50'
                      : 'border-muted-foreground/30 bg-background hover:border-red-300'
                  )}
                >
                  <IconComponent
                    className={cn(
                      'w-4 h-4 md:w-6 md:h-6 transition-all duration-500',
                      isActive || isCompleted
                        ? 'text-red-600'
                        : 'text-muted-foreground'
                    )}
                  />
                </div>
                <span
                  className={cn(
                    'mt-2 md:mt-3 text-[10px] md:text-sm font-medium transition-all duration-500 text-center leading-tight',
                    isActive || isCompleted
                      ? 'text-red-600 font-semibold'
                      : 'text-muted-foreground'
                  )}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FormStepper;
