import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const SystemStatusCard = ({ isLoading, error, marketData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Sistema</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              {error.message || 'Falha ao carregar dados do mercado. Tentando reconectar...'}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Conexão com MT5:</span>
              <span className="text-green-500">Ativo</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Última Atualização:</span>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Trades Hoje:</span>
              <span>{marketData?.trades?.length || 0}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemStatusCard;