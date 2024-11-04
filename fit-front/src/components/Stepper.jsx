import { Stepper, Step, StepLabel, useTheme } from "@mui/material";

const steps = [
  "Votre objectif",
  "Informations personnelles",
  "Informations alimentaires",
  "Disponibilité",
  "Considérations de santé",
  "Équipements",
];

export default function StepperComponent({ activeStep }) {
  const theme = useTheme();

  return (
    <div className="pl-8">
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label} completed={index < activeStep}>
            <StepLabel
              sx={{
                color: index <= activeStep ? "primary.main" : "text.secondary",
                "& .MuiStepLabel-label": {
                  color:
                    theme.palette.mode === "dark"
                      ? index <= activeStep
                        ? "white"
                        : "gray"
                      : index <= activeStep
                      ? "text.primary"
                      : "text.secondary",
                  transition: "color 0.3s ease",
                  "&.Mui-completed": {
                    color: "primary.main",
                  },
                },
                "& .MuiStepIcon-root": {
                  color: index <= activeStep ? "primary.main" : "grey.500",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
}
