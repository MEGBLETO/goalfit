'use client';
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { Checkbox, FormControl, FormHelperText, FormGroup, FormControlLabel } from '@mui/material'

export default function EquipmentStep({ setValidationTrigger }) {
  const { register, formState: { errors }, trigger } = useFormContext()

  useEffect(() => {
    setValidationTrigger(() => () => trigger('equipment'))
  }, [setValidationTrigger, trigger])

  const equipmentOptions = ['barre', 'haltères', 'corde à sauter', 'tapis de course']

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
        Équipement disponible
      </h2>
      <FormControl component="fieldset" error={!!errors.equipment}>
        <FormGroup>
          {equipmentOptions.map((item, index) => (
            <FormControlLabel
              key={index}
              control={<Checkbox {...register('equipment')} value={item} />}
              label={item}
            />
          ))}
        </FormGroup>
        {errors.equipment && (
          <FormHelperText>{errors.equipment.message}</FormHelperText>
        )}
      </FormControl>
    </div>
  )
}
