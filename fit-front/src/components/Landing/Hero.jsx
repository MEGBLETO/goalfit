import Image from "next/image";
import { Container } from "../Container";
import heroImg from "../../../public/img/hero.png";

export const Hero = () => {
  return (
    <>
      <Container className="flex flex-wrap ">
        <div className="flex items-center w-full lg:w-1/2">
          <div className="max-w-2xl mb-8">
            <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
              Planifiez votre parcours fitness idéal
            </h1>
            <p className="py-5 text-lg leading-normal text-gray-500 lg:text-xl dark:text-gray-300">
              Obtenez des plans de repas et des routines d'exercice personnalisés conçus pour vous aider à atteindre vos objectifs de remise en forme. Que vous souhaitiez perdre du poids, prendre du muscle ou simplement rester en bonne santé, notre GoalFit est là pour vous.
            </p>

            <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
              <a
                href="/register"
                rel="noopener"
                className="px-8 py-4 text-lg font-medium text-center text-white bg-blue-600 rounded-md "
              >
                Commencer
              </a>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center w-full lg:w-1/2">
          <div className="">
            <Image
              src={heroImg}
              width="616"
              height="617"
              className={"object-cover"}
              alt="Illustration Héro"
              loading="eager"
              placeholder="blur"
            />
          </div>
        </div>
      </Container>
    </>
  );
};
