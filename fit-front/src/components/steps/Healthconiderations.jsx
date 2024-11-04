import { useFormContext } from 'react-hook-form'
import { TextField, FormControl, FormHelperText, FormGroup, FormControlLabel, Checkbox } from '@mui/material'
import { useEffect } from 'react'

export default function HealthConsiderationsStep({ setValidationTrigger }) {
  const { register, setValue, watch, formState: { errors }, trigger } = useFormContext()

  useEffect(() => {
    setValidationTrigger(() => () => trigger(['healthConsiderations', 'customHealthConsiderations']))
  }, [setValidationTrigger, trigger])

  // Predefined health considerations
  const healthConsiderations = [
    'Inconfort au genou',
    'Douleurs lombaires',
    'Problèmes d’épaule',
    'Hypertension',
    'Problèmes de dos'
  ]

  const selectedConsiderations = watch('healthConsiderations') || []

  const handleCheckboxChange = (consideration) => {
    if (selectedConsiderations.includes(consideration)) {
      setValue('healthConsiderations', selectedConsiderations.filter(item => item !== consideration))
    } else {
      setValue('healthConsiderations', [...selectedConsiderations, consideration])
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
        Considérations de santé
      </h2>

      {/* Predefined health considerations */}
      <FormControl component="fieldset" margin="normal" error={!!errors.healthConsiderations}>
        <FormGroup>
          {healthConsiderations.map((consideration, index) => (
            <FormControlLabel
              key={index}
              control={
                <Checkbox
                  checked={selectedConsiderations.includes(consideration)}
                  onChange={() => handleCheckboxChange(consideration)}
                />
              }
              label={consideration}
            />
          ))}
        </FormGroup>
        {errors.healthConsiderations && (
          <FormHelperText>{errors.healthConsiderations.message}</FormHelperText>
        )}
      </FormControl>

      {/* Custom health consideration input */}
      <FormControl fullWidth margin="normal" error={!!errors.customHealthConsiderations}>
        <TextField
          label="Autres considérations"
          {...register('customHealthConsiderations')}
          error={!!errors.customHealthConsiderations}
          helperText={errors.customHealthConsiderations?.message || 'Ajoutez toute autre considération de santé'}
        />
      </FormControl>
    </div>
  )
}
