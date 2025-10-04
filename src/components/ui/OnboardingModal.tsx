"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Wifi, Lock, CheckCircle, X } from "lucide-react";
import { Button } from "./Button";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Cloud,
      title: "Tus datos en la nube",
      description:
        "Todo se guarda automáticamente en Firebase. Nunca perderás tus entrenamientos.",
      color: "primary",
    },
    {
      icon: Wifi,
      title: "Funciona offline",
      description:
        "Entrena sin internet. Cuando vuelvas online, todo se sincroniza automáticamente.",
      color: "secondary",
    },
    {
      icon: Lock,
      title: "Privado y seguro",
      description:
        "Solo tú puedes ver tus datos. No necesitas cuenta ni email. Tu privacidad está protegida.",
      color: "accent",
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 h-full md:h-auto flex flex-col border border-gray-200 dark:border-gray-700">
              {/* Close button */}
              <button
                onClick={handleSkip}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                {/* Icon */}
                <motion.div
                  key={step}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={`mb-6 p-6 rounded-full ${
                    currentStep.color === "primary"
                      ? "bg-primary-100 dark:bg-primary-900/20"
                      : currentStep.color === "secondary"
                      ? "bg-secondary-100 dark:bg-secondary-900/20"
                      : "bg-accent-100 dark:bg-accent-900/20"
                  }`}
                >
                  <Icon
                    className={`w-12 h-12 ${
                      currentStep.color === "primary"
                        ? "text-primary-600 dark:text-primary-400"
                        : currentStep.color === "secondary"
                        ? "text-secondary-600 dark:text-secondary-400"
                        : "text-accent-600 dark:text-accent-400"
                    }`}
                  />
                </motion.div>

                {/* Title */}
                <motion.h2
                  key={`title-${step}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white"
                >
                  {currentStep.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  key={`desc-${step}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-sm"
                >
                  {currentStep.description}
                </motion.p>

                {/* Steps indicator */}
                <div className="flex gap-2 mb-8">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 rounded-full transition-all ${
                        index === step
                          ? "w-8 bg-primary-500"
                          : "w-2 bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {step < steps.length - 1 ? (
                  <>
                    <Button variant="ghost" onClick={handleSkip} className="flex-1">
                      Saltar
                    </Button>
                    <Button onClick={handleNext} className="flex-1">
                      Siguiente
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleNext} className="w-full">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    ¡Empezar!
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

