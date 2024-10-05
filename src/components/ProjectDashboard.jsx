import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const projectProgress = [
  { name: 'Planejamento', value: 100 },
  { name: 'Desenvolvimento', value: 75 },
  { name: 'Testes', value: 50 },
  { name: 'Otimização', value: 25 },
];

const timelineData = [
  { month: 'Jan', progresso: 20 },
  { month: 'Fev', progresso: 40 },
  { month: 'Mar', progresso: 60 },
  { month: 'Abr', progresso: 80 },
  { month: 'Mai', progresso: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ProjectDashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Progresso do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <PieChart width={300} height={300}>
            <Pie
              data={projectProgress}
              cx={150}
              cy={150}
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {projectProgress.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart width={300} height={300} data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="progresso" stroke="#8884d8" />
          </LineChart>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          <BarChart width={300} height={300} data={projectProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDashboard;