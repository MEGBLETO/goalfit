import { Radio } from "@mui/material";

export default function SelectableCard({
  icon,
  title,
  description,
  selected,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer border rounded-lg p-4 flex items-center justify-between transition-colors 
      ${
        selected
          ? "border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400"
          : "border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600"
      } hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-800`}
    >
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-xs">{description}</p>
        </div>
      </div>
      <Radio
        checked={selected}
        className="absolute top-0 right-0 text-blue-500 dark:text-blue-400"
      />
    </div>
  );
}
