import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";

export type AlertType = "error" | "warning" | "success" | "info";

interface AlertProps {
  type: AlertType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const alertConfig = {
  error: {
    icon: AlertCircle,
    bgClass: "bg-red-500/20 border-red-500/30",
    textClass: "text-red-200",
    titleClass: "text-red-100",
    iconClass: "text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-yellow-500/20 border-yellow-500/30",
    textClass: "text-yellow-200",
    titleClass: "text-yellow-100",
    iconClass: "text-yellow-400",
  },
  success: {
    icon: CheckCircle,
    bgClass: "bg-green-500/20 border-green-500/30",
    textClass: "text-green-200",
    titleClass: "text-green-100",
    iconClass: "text-green-400",
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-500/20 border-blue-500/30",
    textClass: "text-blue-200",
    titleClass: "text-blue-100",
    iconClass: "text-blue-400",
  },
};

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  children,
  className = "",
}) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={`${config.bgClass} border rounded-lg p-4 ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3">
        <Icon
          size={20}
          className={`${config.iconClass} mt-0.5 flex-shrink-0`}
        />
        <div className="flex-1">
          {title && (
            <h4 className={`font-semibold mb-1 ${config.titleClass}`}>
              {title}
            </h4>
          )}
          <div className={config.textClass}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
