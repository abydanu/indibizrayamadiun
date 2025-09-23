import React from 'react';
import { Button } from '@/shared/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onPrevStep: (e?: React.MouseEvent) => void;
  onNextStep: (e?: React.MouseEvent) => void;
  onSubmit?: () => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  isSubmitting,
  onPrevStep,
  onNextStep,
  onSubmit,
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={currentStep === 1}
        className="flex items-center gap-2 bg-transparent"
      >
        <ArrowLeft className="w-4 h-4" />
        Sebelumnya
      </Button>

      {currentStep < totalSteps ? (
        <Button
          type="button"
          onClick={onNextStep}
          className="flex items-center gap-2"
        >
          Selanjutnya
          <ArrowRight className="w-4 h-4" />
        </Button>
      ) : (
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Mengirim...
            </>
          ) : (
            'Kirim'
          )}
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;
