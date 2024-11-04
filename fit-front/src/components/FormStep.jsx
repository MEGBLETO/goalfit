import FitObjectif from './steps/FitObjectif'
import PersonalInfo from './steps/PersonalInfo'
import DietaryInfo from './steps/DietaryInfo'
import Availability from './steps/Availability'
import HealthConsiderations from './steps/Healthconiderations'
import Equipements from './steps/Equipement'
import { useEffect } from 'react'

const Components = [
  FitObjectif,
  PersonalInfo,
  DietaryInfo,
  Availability,
  HealthConsiderations,
  Equipements
]

export default function FormStep({
  step,
  setValidationTrigger,
  setClearErrorsTrigger,
}) {
  const StepComponent = Components[step - 1]

  if (!StepComponent) {
    return <div></div>
  }

  useEffect(() => {
    if (typeof setValidationTrigger === 'function') {
      setValidationTrigger(() => async () => {
        const isValid = await StepComponent.setValidationTrigger?.() || true
        return isValid
      })
    }

    if (typeof setClearErrorsTrigger === 'function') {
      setClearErrorsTrigger(() => () => {})
    }
  }, [step, setValidationTrigger, setClearErrorsTrigger])

  return (
    <div className="p-8 mx-auto">
      <StepComponent
        setValidationTrigger={setValidationTrigger}
        setClearErrorsTrigger={setClearErrorsTrigger}
      />
    </div>
  )
}
