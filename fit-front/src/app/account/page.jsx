'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Logo from '../../components/logo'
import { ArrowBackIos } from '@mui/icons-material'
import StepperComponent from '../../components/Stepper'
import FormStep from '../../components/FormStep'
import { Avatar } from '@mui/material'
import { useForm, FormProvider } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie' // Import cookies to retrieve token
import axios from 'axios' // Import axios for HTTP requests

export default function MultiStepForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Initialize form methods
  const methods = useForm({
    defaultValues: {
      gender: '',
      dateOfBirth: '',
      fitnessLevel: '',
      weight: '',
      objectiveWeight: '',
      restrictions: [],
      goals: [],
      equipment: [],
      healthConsiderations: [],
    },
  })

  const { clearErrors } = methods

  // State to store the validation function from the child step
  const [validationTrigger, setValidationTrigger] = useState(
    () => async () => true
  )

  const [clearErrorsTrigger, setClearErrorsTrigger] = useState(() => () => {})

  const { handleSubmit } = methods

  // Automatically clear errors when step changes
  useEffect(() => {
    clearErrors()
  }, [step, clearErrors])

  const handleNext = async () => {
    // Ensure the validationTrigger function is available and then call it
    if (typeof validationTrigger === 'function') {
      const isValid = await validationTrigger()

      if (isValid) {
        clearErrors()
        setStep((prev) => prev + 1) // Move to the next step
      }
    }
  }

  const handlePrev = () => {
    setStep((prev) => prev - 1)
  }

  // Format the collected form data before submission
  const formatSubmissionData = (formData) => {
    return {
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      fitnessLevel: formData.fitnessLevel,
      weight: parseInt(formData.weight), // Ensure weight is a float
      objectiveWeight: parseInt(formData.objectiveWeight), // Ensure objective weight is a float
      age: parseInt(formData.age, 10), // Ensure age is an integer
      height: parseInt(formData.height, 10), // Ensure height is an integer
      goals: formData.goals.map((goal) => ({
        name: goal, // Each goal is a string in the array of goals
      })),
      dietaryPreferences: formData.restrictions || [], // An array of restrictions
      equipment: formData.equipment || [], // An array of available equipment
      availability: {
        daysPerWeek: parseInt(formData.daysPerWeek, 10), // Ensure daysPerWeek is an integer
        minutesPerDay: parseInt(formData.minutesPerDay, 10), // Ensure minutesPerDay is an integer
      },
      healthConsiderations: formData.healthConsiderations || [], // An array of health issues
    }
  }

  const onSubmit = async (data) => {
    try {
      // Format the data before submitting
      const formattedData = formatSubmissionData(data)

      console.log('Formatted Form Data Submitted:', formattedData)

      // Retrieve the token from cookies
      const token = Cookies.get('token')
      if (!token) {
        throw new Error('No token found')
      }

      // Decode the token to get userId
      const decodedToken = JSON.parse(atob(token.split('.')[1])) // Decode payload
      const userId = decodedToken.userId

      // Use the env variable for base URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

      // Send a PATCH request to update user data
      const response = await axios.patch(
        `${baseUrl}/bdd/user/${userId}`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.status === 200) {
        console.log('User updated successfully:', response.data)
        // Redirect to another page (e.g., subscription or dashboard)
        router.push('/subscription')
      } else {
        console.error('Failed to update user:', response.data.message)
      }
    } catch (error) {
      console.error('Error during submission:', error)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row w-screen bg-white dark:bg-gray-900 dark:text-gray-100">
      {/* Left Panel */}
      <div className="w-1/3 flex-col md:flex hidden bg-slate-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 px-8">
        <div className="flex justify-start items-center py-2">
          <Link href="/login" passHref>
            <div className="flex items-center">
              <Logo color="#2563eb" />
              <h1 className="text-xl font-bold ms-2 font-mono dark:text-gray-100">
                GoalFit
              </h1>
            </div>
          </Link>
        </div>
        <div className="max-w-md text-center md:text-left my-auto">
          <StepperComponent activeStep={step - 1} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="md:w-2/3 flex flex-col items-center justify-center dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 z-50 md:hidden flex justify-start items-center py-2 w-full md:px-8 px-4 border-b border-slate-200 dark:border-gray-700 sticky top-0">
          <Link href="/login" passHref>
            <div className="flex items-center">
              <Logo color="#2563eb" />
              <h1 className="text-xl font-bold ms-2 font-mono text-blue-600 dark:text-blue-400">
                GoalFit
              </h1>
            </div>
          </Link>
        </div>

        <div className="flex items-center justify-between w-full p-4 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700">
          <button
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
            onClick={handlePrev}
            disabled={step === 1}
          >
            <ArrowBackIos fontSize="small" />
            <span className="ml-1">Retour</span>
          </button>
          <div className="flex items-center">
            <span className="text-gray-500 dark:text-gray-300 text-xs mr-2">
              <a href="#" className="underline dark:text-blue-400">
                Besoin d'aide ?
              </a>
            </span>
            <Avatar
              alt="Cindy Baker"
              src="https://avatar.iran.liara.run/public/87"
              className="w-8 h-8"
            />
          </div>
        </div>

        <div className="w-full max-w-lg my-auto md:px-0 px-4 dark:bg-gray-900">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Pass setValidationTrigger and setClearErrorsTrigger to FormStep */}
              <FormStep
                step={step}
                setValidationTrigger={setValidationTrigger} // Passing the function to the child
                setClearErrorsTrigger={setClearErrorsTrigger} // Ensure errors are cleared when moving to this step
              />

              {step === 6 ? (
                <button
                  type="submit" // Only submits if on the final step
                  className="mt-4 mx-6 md:mx-auto p-3 w-full bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-400 rounded-md mb-6"
                >
                  Soumettre
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext} // Only handle next step, no form submission
                  className="mt-4 mx-6 md:mx-auto p-3 w-full bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-400 rounded-md mb-6"
                >
                  Suivant
                </button>
              )}
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  )
}
