import { Container } from "../components/Container";
import { Hero } from "../components/Landing/Hero";
import { Benefits } from "../components/Landing/Benefits";
import { Pricing } from "../components/Landing/Pricing";
import { Faq } from "../components/Landing/Faq";
import { Cta } from "../components/Landing/Cta";
import { Navbar } from "../components/Landing/Navbar";
import { SectionTitle } from "../components/Landing/SectionTitle";
import { Footer } from "../components/Landing/Footer";

import { benefitOne, benefitTwo } from "../components/data";

export default function LandingPage() {
  return (
    <div>
      <Container>
      <Navbar />
      <Hero />
      <SectionTitle
        preTitle="Les avantages de GoalFit"
        title="Pourquoi vous devriez utiliser GoalFit"
      >
        GoalFit est votre solution tout-en-un pour créer des plans de repas personnalisés et des routines d'entraînement adaptés à vos objectifs. Que vous souhaitiez perdre du poids, prendre du muscle ou maintenir un mode de vie sain, notre planificateur est conçu pour vous aider à atteindre vos objectifs efficacement et de manière personnalisée.
      </SectionTitle>
      <Benefits data={benefitOne} />
      <Benefits imgPos="right" data={benefitTwo} />
      <SectionTitle preTitle="Tarification" title="Investissez dans votre santé">
        Votre parcours de remise en forme est un investissement dans votre bien-être. Nous proposons des plans tarifaires flexibles qui vous donnent accès à nos outils et ressources complets. Trouvez le plan qui correspond à vos objectifs et à votre budget, et commencez à transformer votre vie dès aujourd'hui.
      </SectionTitle>
      <Pricing />
      <SectionTitle preTitle="FAQ" title="Questions fréquemment posées">
        Vous avez des questions ? Nous avons des réponses ! Trouvez toutes les informations nécessaires pour bien commencer avec GoalFit. Cette section est conçue pour répondre aux questions courantes et vous permettre de tirer le meilleur parti de notre service.
      </SectionTitle>
      <Faq />
      <Cta />
      </Container>
      <Footer />
    </div>

  );
}
