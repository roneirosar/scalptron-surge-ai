import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Timer, AlertCircle } from "lucide-react";

const ProjectStatus = ({ systemStatus }) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Status do Projeto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(systemStatus).map(([key, status]) => (
          <div key={key} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
              {getStatusIcon(status)}
            </div>
            <Progress value={getStatusProgress(status)} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ProjectStatus;