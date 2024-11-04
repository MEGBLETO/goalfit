import React from "react";
import { Container } from "../Container";

export const Cta = () => {
  return (
    <Container>
      <div className="flex flex-wrap items-center justify-between w-full max-w-4xl gap-5 mx-auto text-white bg-blue-600 px-7 py-7 lg:px-12 lg:py-12 lg:flex-nowrap rounded-xl">
        <div className="flex-grow text-center lg:text-left">
          <h2 className="text-2xl font-medium lg:text-3xl">
            Prêt à transformer votre parcours de remise en forme ?
          </h2>
          <p className="mt-2 font-medium text-white text-opacity-90 lg:text-xl">
            Faites le premier pas vers une version plus saine et plus en forme de vous-même. Commencez votre essai gratuit dès aujourd'hui !
          </p>
        </div>
        <div className="flex-shrink-0 w-full text-center lg:w-auto">
          <a
            href="/register"  
            className="inline-block py-3 mx-auto text-lg font-medium text-center text-blue-600 bg-white rounded-md px-7 lg:px-10 lg:py-5 "
          >
            Commencer l'essai gratuit
          </a>
        </div>
      </div>
    </Container>
  );
};
