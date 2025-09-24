'use client'

import { cn } from '@/lib/utils'

interface Step {
  id: string
  title: string
  description?: string
  completed?: boolean
  current?: boolean
  disabled?: boolean
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (stepIndex: number) => void
  className?: string
  orientation?: 'horizontal' | 'vertical'
}

export default function Stepper({
  steps,
  currentStep,
  onStepClick,
  className,
  orientation = 'horizontal'
}: StepperProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={cn(
        'flex',
        isHorizontal ? 'flex-row items-center' : 'flex-col',
        className
      )}
    >
      {steps.map((step, index) => {
        const isCompleted = step.completed || index < currentStep
        const isCurrent = step.current || index === currentStep
        const isDisabled = step.disabled || (onStepClick && !isCompleted && !isCurrent)

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center',
              isHorizontal ? 'flex-1' : 'w-full mb-4'
            )}
          >
            {/* Step Circle */}
            <div
              className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                isCompleted
                  ? 'bg-green-600 border-green-600 text-white'
                  : isCurrent
                  ? 'bg-green-100 border-green-600 text-green-600'
                  : 'bg-white border-gray-300 text-gray-400',
                isDisabled && 'opacity-50 cursor-not-allowed',
                !isDisabled && onStepClick && 'cursor-pointer hover:border-green-500'
              )}
              onClick={() => !isDisabled && onStepClick?.(index)}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            {/* Step Content */}
            <div className={cn('ml-3', isHorizontal && 'flex-1')}>
              <h3
                className={cn(
                  'text-sm font-medium',
                  isCompleted || isCurrent
                    ? 'text-gray-900'
                    : 'text-gray-500'
                )}
              >
                {step.title}
              </h3>
              {step.description && (
                <p className="text-sm text-gray-500">{step.description}</p>
              )}
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 bg-gray-300',
                  isHorizontal ? 'ml-3' : 'mt-2 mb-2 w-0.5 h-8 ml-4'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
