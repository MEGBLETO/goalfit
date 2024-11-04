import { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form' 
import { useTheme } from '@mui/material/styles'
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  OutlinedInput,
  MenuItem,
  Box,
  Chip,
  FormHelperText,
} from '@mui/material'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const dietaryOptions = [
  'Vegan',
  'Végétarien',
  'Pescétarien',
  'Sans gluten',
  'Sans produits laitiers',
]

function getStyles(name, selectedOptions, theme) {
  return {
    fontWeight:
      selectedOptions.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  }
}

export default function DietaryInfo({
  setValidationTrigger,
  setClearErrorsTrigger,
}) {
  const theme = useTheme()
  const {
    register,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
    trigger,
  } = useFormContext() 
  const [selectedOptions, setSelectedOptions] = useState([])

  // Watch for the changes in the restrictions field
  const selectedRestrictions = watch('restrictions')

  useEffect(() => {
    if (selectedRestrictions) {
      setSelectedOptions(selectedRestrictions)
    }
    clearErrors()

    // Set validation trigger to validate form when required
    setValidationTrigger(() => async () => {
      const isValid = await trigger([
        'weight',
        'objectiveWeight',
        'height',
        'restrictions',
      ])
      return isValid
    })
    setClearErrorsTrigger(
      () => () =>
        clearErrors(['weight', 'objectiveWeight', 'height', 'restrictions'])
    )
  }, [
    setValidationTrigger,
    clearErrors,
    setClearErrorsTrigger,
    selectedRestrictions,
    trigger,
  ])

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedOptions(typeof value === 'string' ? value.split(',') : value)
    setValue('restrictions', value, { shouldValidate: true }) 
  }

  const inputStyle = {
    height: '56px', 
    fontSize: '16px', 
  }

  return (
    <div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 dark:text-gray-100 text-gray-800">
          Vos préférences alimentaires
        </h2>
        <p className="text-gray-500 dark:text-gray-300 mb-6">
          Partagez vos préférences alimentaires afin que nous puissions
          personnaliser nos recommandations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {/* Current Weight Input */}
        <TextField
          className="col-span-1"
          label="Poids actuel"
          variant="outlined"
          margin="normal"
          error={!!errors.weight} 
          helperText={errors.weight ? errors.weight.message : ''}
          {...register('weight', { required: 'Ce champ est requis' })} 
          InputLabelProps={{
            className: 'dark:text-gray-300',
          }}
          inputProps={{
            style: { height: '40px' },
            className: 'focus:ring-transparent',
          }}
        />

        {/* Objective Weight Input */}
        <TextField
          className="col-span-1"
          label="Poids souhaité"
          variant="outlined"
          margin="normal"
          error={!!errors.objectiveWeight} 
          helperText={
            errors.objectiveWeight ? errors.objectiveWeight.message : ''
          }
          {...register('objectiveWeight', { required: 'Ce champ est requis' })}
          InputLabelProps={{
            className: 'dark:text-gray-300',
          }}
          inputProps={{
            style: { height: '40px' },
            className: 'focus:ring-transparent',
          }}
        />

        {/* Height Input */}
        <FormControl
          variant="outlined"
          margin="normal"
          className="col-span-2"
          error={!!errors.height}
        >
          <InputLabel htmlFor="height" className="dark:text-gray-300">
            Taille
          </InputLabel>
          <OutlinedInput
            id="height"
            label="Taille"
            endAdornment={<InputAdornment position="end">cm</InputAdornment>}
            className="dark:text-gray-100 dark:bg-gray-800 dark:border-gray-600"
            {...register('height', { required: 'Ce champ est requis' })} 
            inputProps={{
              style: { height: '40px' },
              className: 'focus:ring-transparent',
            }} 
          />
          {errors.height && (
            <FormHelperText error>{errors.height.message}</FormHelperText>
          )}
        </FormControl>

        {/* Dietary Restrictions Select */}
        <FormControl
          className="col-span-2"
          margin="normal"
          error={!!errors.restrictions}
        >
          <InputLabel
            htmlFor="demo-multiple-chip"
            className="dark:text-gray-300"
          >
            Restrictions alimentaires
          </InputLabel>
          <Select
            id="demo-multiple-chip"
            multiple
            label="Restrictions alimentaires"
            value={selectedOptions}
            onChange={handleChange}
            input={
              <OutlinedInput
                id="select-multiple-chip"
                label="Restrictions alimentaires"
                className="dark:text-gray-100 dark:bg-gray-800 dark:border-gray-600"
                style={inputStyle} 
              />
            }
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    className="dark:bg-gray-700 dark:text-gray-100"
                  />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
            className="dark:text-gray-100 dark:bg-gray-800 dark:border-gray-600"
          >
            {dietaryOptions.map((option) => (
              <MenuItem
                key={option}
                value={option}
                style={getStyles(option, selectedOptions, theme)}
                className="dark:bg-gray-800 dark:text-gray-100"
              >
                {option}
              </MenuItem>
            ))}
          </Select>
          {errors.restrictions && (
            <FormHelperText error>{errors.restrictions.message}</FormHelperText>
          )}
        </FormControl>
      </div>
    </div>
  )
}
