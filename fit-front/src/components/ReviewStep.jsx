import { useFormContext } from "react-hook-form";

export default function ReviewStep() {
  const { getValues } = useFormContext();
  const formData = getValues(); 

  return (
    <div className="text-center px-6 py-8 md:px-12 md:py-10 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Vérifiez vos informations
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
        Merci de vérifier les informations que vous avez fournies avant de soumettre.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left">
        {/* Genre */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
          <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300">Genre:</h3>
          <p className="text-lg text-gray-800 dark:text-gray-100 mt-1">{formData.gender || "N/A"}</p>
        </div>

        {/* Date de naissance */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
          <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300">Date de naissance:</h3>
          <p className="text-lg text-gray-800 dark:text-gray-100 mt-1">{formData.dateOfBirth || "N/A"}</p>
        </div>

        {/* Niveau de forme physique */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
          <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300">Niveau de forme physique:</h3>
          <p className="text-lg text-gray-800 dark:text-gray-100 mt-1">{formData.fitnessLevel || "N/A"}</p>
        </div>

        {/* Poids actuel */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
          <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300">Poids actuel:</h3>
          <p className="text-lg text-gray-800 dark:text-gray-100 mt-1">{formData.weight || "N/A"}</p>
        </div>

        {/* Poids souhaité */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
          <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300">Poids souhaité:</h3>
          <p className="text-lg text-gray-800 dark:text-gray-100 mt-1">{formData.objectiveWeight || "N/A"}</p>
        </div>

        {/* Restrictions alimentaires */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
          <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300">Restrictions alimentaires:</h3>
          <p className="text-lg text-gray-800 dark:text-gray-100 mt-1">
            {formData.restrictions.length > 0 ? formData.restrictions.join(", ") : "Aucune"}
          </p>
        </div>

        {/* Objectifs */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm md:col-span-2">
          <h3 className="text-md font-semibold text-gray-600 dark:text-gray-300">Objectifs:</h3>
          <p className="text-lg text-gray-800 dark:text-gray-100 mt-1">
            {formData.selectedObjective}
          </p>
        </div>
      </div>
    </div>
  );
}
