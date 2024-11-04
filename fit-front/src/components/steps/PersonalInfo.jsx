import { useFormContext } from 'react-hook-form'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  MenuItem,
  FormHelperText,
} from '@mui/material'
import { useEffect, useRef } from 'react'
import InputMask from 'react-input-mask'

export default function PersonalInfo({
  setValidationTrigger,
  setClearErrorsTrigger,
}) {
  const {
    register,
    watch,
    formState: { errors },
    trigger,
    clearErrors,
  } = useFormContext()

  const gender = watch('gender') || ''

  const clearErrorsRef = useRef(clearErrors)

  useEffect(() => {
    // Set validation trigger for this step
    setValidationTrigger(
      () => () =>
        trigger(['gender', 'dateOfBirth', 'phoneNumber', 'fitnessLevel'])
    )

    // Set error clearing trigger for this step
    setClearErrorsTrigger(
      () => () =>
        clearErrorsRef.current([
          'gender',
          'dateOfBirth',
          'phoneNumber',
          'fitnessLevel',
        ])
    )

    return () => {
      clearErrorsRef.current = clearErrors
    }
  }, [setValidationTrigger, trigger, setClearErrorsTrigger])

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Heading and description */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-semibold mb-4 dark:text-gray-100 text-gray-800">
          Parlez-nous de vous
        </h2>
        <p className="text-lg text-gray-500 dark:text-gray-300">
          Nous avons besoin de valider vos informations personnelles.
        </p>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gender */}
        <FormControl fullWidth margin="normal" error={!!errors.gender}>
          <InputLabel id="gender-select-label" className="dark:text-gray-300">
            Genre
          </InputLabel>
          <Select
            {...register('gender', { required: 'Le genre est requis' })}
            labelId="gender-select-label"
            id="gender-select"
            label="Genre"
            value={gender}
            className="dark:text-gray-100 dark:bg-gray-800 dark:border-gray-600"
          >
            <MenuItem value="homme">Homme</MenuItem>
            <MenuItem value="femme">Femme</MenuItem>
          </Select>
          {errors.gender && (
            <FormHelperText error>{errors.gender.message}</FormHelperText>
          )}
        </FormControl>

        {/* Date of Birth */}
        <FormControl fullWidth margin="normal" error={!!errors.dateOfBirth}>
          <TextField
            type="date"
            {...register('dateOfBirth', {
              required: 'La date de naissance est requise',
            })}
            variant="outlined"
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth && errors.dateOfBirth.message}
            inputProps={{
              className: 'focus:ring-transparent',
              style: {
                height: '40px',
              },
            }}
          />
        </FormControl>

        {/* Phone Number */}
        <InputMask mask="9 99 99 99 99">
          {() => (
            <FormControl
              className="focus:ring-blue-200"
              fullWidth
              margin="normal"
              error={!!errors.phoneNumber}
            >
              <TextField
                label="Numéro de téléphone"
                variant="outlined"
                {...register('phoneNumber', {
                  required: 'Le numéro de téléphone est requis',
                  setValueAs: (value) => value.replace(/\s+/g, ''), 
                  pattern: {
                    value: /^[0-9]{9}$/, 
                    message: 'Le numéro doit contenir 9 chiffres',
                  },
                })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber && errors.phoneNumber.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      className="dark:text-gray-300"
                      position="start"
                    >
                      +33
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: { height: '40px' },
                  className: 'focus:ring-transparent',
                }}
              />
            </FormControl>
          )}
        </InputMask>

        {/* Fitness Level */}
        <FormControl fullWidth margin="normal" error={!!errors.fitnessLevel}>
          <InputLabel id="fitness-level-label" className="dark:text-gray-300">
            Niveau physique
          </InputLabel>
          <Select
            {...register('fitnessLevel', {
              required: 'Le niveau physique est requis',
            })}
            labelId="fitness-level-label"
            id="fitness-level-select"
            label="Niveau physique"
            className="dark:text-gray-100 dark:bg-gray-800 dark:border-gray-600"
            value={watch('fitnessLevel') || ''}
          >
            <MenuItem value="débutant">Débutant</MenuItem>
            <MenuItem value="intermédiaire">Intermédiaire</MenuItem>
            <MenuItem value="avancé">Avancé</MenuItem>
          </Select>
          {errors.fitnessLevel && (
            <FormHelperText error>{errors.fitnessLevel.message}</FormHelperText>
          )}
        </FormControl>
      </div>
    </div>
  )
}
