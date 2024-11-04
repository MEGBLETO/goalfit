'use client';
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { TextField, FormControl, FormHelperText } from '@mui/material'

export default function AvailabilityStep({ setValidationTrigger }) {
  const { register, formState: { errors }, trigger } = useFormContext()

  useEffect(() => {
    setValidationTrigger(() => () => trigger(['daysPerWeek', 'minutesPerDay']))
  }, [setValidationTrigger, trigger])

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
        Disponibilité hebdomadaire
      </h2>
      
      {/* Days Per Week */}
      <FormControl fullWidth margin="normal" error={!!errors.daysPerWeek}>
        <TextField
          type="number"
          label="Jours par semaine"
          {...register('daysPerWeek', { 
            required: 'Ce champ est requis', 
            min: { value: 1, message: 'Au moins 1 jour est requis' },
            max: { value: 7, message: 'Le maximum est de 7 jours par semaine' } 
          })}
          error={!!errors.daysPerWeek}
          helperText={errors.daysPerWeek?.message}
        />
      </FormControl>

      {/* Minutes Per Day */}
      <FormControl fullWidth margin="normal" error={!!errors.minutesPerDay}>
        <TextField
          type="number"
          label="Minutes par jour"
          {...register('minutesPerDay', { 
            required: 'Ce champ est requis', 
            min: { value: 1, message: 'Au moins 1 minute est requise' },
            max: { value: 1440, message: 'Le maximum est de 1440 minutes par jour (24 heures)' }
          })}
          error={!!errors.minutesPerDay}
          helperText={errors.minutesPerDay?.message}
        />
      </FormControl>
    </div>
  )
}
