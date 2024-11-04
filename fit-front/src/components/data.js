import {
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";

const benefitOne = {
  title: "Transformez votre routine de remise en forme",
  desc: "Découvrez une manière plus intelligente d'atteindre vos objectifs de santé avec notre Goal Fit complet. Concevez des plans d'entraînement et de nutrition personnalisés qui s'adaptent à votre mode de vie et évoluent avec vos progrès.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Entraînements personnalisés",
      desc: "Accédez à une variété d'exercices adaptés à vos préférences et à votre niveau de forme physique.",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Conseils en nutrition",
      desc: "Créez des plans de repas équilibrés qui soutiennent vos objectifs et vos besoins alimentaires.",
      icon: <ChartBarSquareIcon />,
    },
    {
      title: "Suivi des progrès",
      desc: "Surveillez vos améliorations au fil du temps et restez motivé tout au long de votre parcours.",
      icon: <CursorArrowRaysIcon />,
    },
  ],
};

const benefitTwo = {
  title: "Pourquoi choisir Goal Fit ?",
  desc: "Donnez-vous les moyens de réussir grâce à des outils et des ressources conçus pour rendre votre parcours fitness agréable et durable. Goal Fit offre une flexibilité et un soutien inégalés pour vous aider à rester engagé et à obtenir des résultats durables.",
  image: benefitTwoImg,
  bullets: [
    {
      title: "Interface conviviale",
      desc: "Naviguez facilement dans votre plan de remise en forme grâce à notre plateforme intuitive.",
      icon: <DevicePhoneMobileIcon />,
    },
    {
      title: "Conseils d'experts",
      desc: "Bénéficiez des conseils et astuces élaborés par des professionnels certifiés du fitness.",
      icon: <AdjustmentsHorizontalIcon />,
    },
    {
      title: "Accessibilité 24/7",
      desc: "Accédez à vos plans et suivez vos progrès à tout moment, n'importe où, sur n'importe quel appareil.",
      icon: <SunIcon />,
    },
  ],
};

export { benefitOne, benefitTwo };
