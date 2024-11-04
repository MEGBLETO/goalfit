"use client";
import React from "react";
import { Container } from "../Container";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export const Faq = () => {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item, index) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 dark:text-gray-100 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring focus-visible:ring-indigo-100 focus-visible:ring-opacity-75">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-blue-600`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-4 pt-4 pb-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
                    {item.answer}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
};

const faqdata = [
  {
    question: "Y a-t-il un essai gratuit disponible ?",
    answer:
      "Oui, nous offrons un essai gratuit de 7 jours à tous les nouveaux utilisateurs pour explorer les fonctionnalités.",
  },
  {
    question: "Puis-je annuler mon abonnement à tout moment ?",
    answer:
      "Absolument ! Vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires.",
  },
  {
    question: "Que se passe-t-il après la fin de l'essai gratuit ?",
    answer:
      "Une fois votre essai gratuit terminé, vous ne serez facturé que si vous choisissez de vous abonner.",
  },
  {
    question: "Proposez-vous un support personnalisé ?",
    answer:
      "Oui, nous offrons un support personnalisé via nos plans premium. Notre équipe est là pour vous aider avec toutes les questions ou défis que vous pourriez avoir.",
  },
];
