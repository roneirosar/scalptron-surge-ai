import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Timer, AlertCircle } from "lucide-react";

const StatusDisplay = ({ status, title }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Timer className="h-5 w-5 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case 'completed':
        return 100;
      case 'in-progress':
        return 50;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="capitalize">{title.replace(/([A-Z])/g, ' $1')}</span>
        {getStatusIcon(status)}
      </div>
      <Progress value={getStatusProgress(status)} className="h-2" />
    </div>
  );
};

export default StatusDisplay;