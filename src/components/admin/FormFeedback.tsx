import { AlertCircle, CheckCircle2 } from "lucide-react";

export type FormFeedbackMessage = {
  status: "success" | "error";
  text: string;
} | null;

export function FormFeedback({ message, className = "" }: { message: FormFeedbackMessage; className?: string }) {
  if (!message) {
    return null;
  }

  const isSuccess = message.status === "success";
  const Icon = isSuccess ? CheckCircle2 : AlertCircle;

  return (
    <div
      role={isSuccess ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-md border p-3 text-sm font-semibold ${
        isSuccess ? "border-leaf/30 bg-mist text-leaf" : "border-berry/30 bg-berry/10 text-berry"
      } ${className}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message.text}</span>
    </div>
  );
}
