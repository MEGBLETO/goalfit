import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { FormControl, FormHelperText } from '@mui/material'
import SelectableCard from '../RadioGroup'

export default function FitnessObjectives({ setValidationTrigger }) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    trigger,
    clearErrors, 
  } = useFormContext()
  const selectedObjective = watch('selectedObjective')

  const objectives = [
    {
      id: 'health',
      title: "Maintien d'une bonne santé",
      description:
        'Concentrez-vous sur le maintien de votre corps en bonne condition.',
      icon: (
        <img
          width="48"
          height="48"
          src="https://img.icons8.com/?size=100&id=52788&format=png&color=000000"
          alt="heart-with-pulse"
        />
      ),
    },
    {
      id: 'weight_loss',
      title: 'Perte de poids',
      description:
        "Objectif de perdre quelques kilos avec une alimentation saine et de l'exercice.",
      icon: (
        <img
          width="48"
          height="48"
          src="https://img.icons8.com/?size=100&id=44737&format=png&color=000000"
          alt="external-loss-aids-filled-outline-lima-studio"
        />
      ),
    },
    {
      id: 'muscle_gain',
      title: 'Prise de muscle',
      description:
        "Chercher à augmenter votre masse musculaire grâce à l'entraînement de force.",
      icon: (
        <img
          width="48"
          height="48"
          src="https://img.icons8.com/?size=100&id=52301&format=png&color=000000"
          alt="external-muscle-quit-smoking-vitaliy-gorbachev-lineal-color-vitaly-gorbachev"
        />
      ),
    },
    {
      id: 'weight_gain',
      title: 'Gain de poids',
      description:
        'Chercher à augmenter votre poids grâce à des recettes riches en protéines.',
      icon: (
        <img
          width="58"
          height="58"
          src="https://img.icons8.com/?size=100&id=44938&format=png&color=000000"
          alt="external-physical-activity-fitness-at-home-flaticons-lineal-color-flat-icons-3"
        />
      ),
    },
  ]
  useEffect(() => {
    register('selectedObjective', {
      required: 'Please select a fitness objective.',
    })

    // Set the validationTrigger function for this step
    setValidationTrigger(() => () => trigger('selectedObjective'))
  }, [register, setValidationTrigger, trigger])

  const handleObjectiveSelect = (objectiveId) => {
    setValue('selectedObjective', objectiveId)

    // Clear the error when a valid selection is made
    clearErrors('selectedObjective')
  }

  return (
    <FormControl
      error={!!errors.selectedObjective}
      component="fieldset"
      className="space-y-4"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100">
          Choisissez votre objectif de fitness
        </h2>
        <p className="text-gray-500 mb-6 dark:text-gray-300">
          Sélectionnez votre objectif de fitness pour personnaliser votre plan
          d'entraînement.
        </p>
      </div>
      {objectives.map((objective) => (
        <SelectableCard
          key={objective.id}
          icon={objective.icon}
          title={objective.title}
          description={objective.description}
          selected={selectedObjective === objective.id}
          onClick={() => handleObjectiveSelect(objective.id)}
        />
      ))}

      {/* Display validation error */}
      {errors.selectedObjective && (
        <FormHelperText>{errors.selectedObjective.message}</FormHelperText>
      )}
    </FormControl>
  )
}
