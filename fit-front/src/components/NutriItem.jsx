import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Paper, Typography } from "@mui/material";

function NutritionInfo({ title, value, unit, color }) {
  return (
    <Card className={`${color} rounded-3xl shadow-strong h-36`}>
      <CardContent className="p-2 flex flex-col content-between items-center justify-center h-full">
        <span
          variant="body2"
          className="text-white uppercase tracking-wider font-medium"
        >
          {title}
        </span>
        <span variant="h5" className="text-white mt-1 font-semibold">
          {value}
        </span>
      </CardContent>
    </Card>
  );
}

export default NutritionInfo;
