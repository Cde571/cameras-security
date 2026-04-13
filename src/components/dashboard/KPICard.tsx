// src/components/dashboard/KPICard.tsx
import React from 'react';
import { 
  DollarSign, 
  FileText, 
  Wrench, 
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowRight
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  type: 'currency' | 'number';
  icon: 'dollar-sign' | 'file-text' | 'wrench' | 'alert-circle';
  color: 'blue' | 'orange' | 'green' | 'red';
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  link?: string;
}

const iconMap = {
  'dollar-sign': DollarSign,
  'file-text': FileText,
  'wrench': Wrench,
  'alert-circle': AlertCircle
};

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-600',
    border: 'border-blue-200'
  },
  orange: {
    bg: 'bg-orange-50',
    icon: 'bg-orange-500',
    text: 'text-orange-600',
    border: 'border-orange-200'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'bg-green-500',
    text: 'text-green-600',
    border: 'border-green-200'
  },
  red: {
    bg: 'bg-red-50',
    icon: 'bg-red-500',
    text: 'text-red-600',
    border: 'border-red-200'
  }
};

export default function KPICard({ 
  title, 
  value, 
  type, 
  icon, 
  color,
  trend,
  link 
}: KPICardProps) {
  const Icon = iconMap[icon];
  const colors = colorMap[color];
  
  const formatValue = () => {
    if (type === 'currency') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value.toLocaleString('es-CO');
  };

  const CardContent = () => (
    <>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mb-2">
            {formatValue()}
          </p>
          
          {trend && (
            <div className="flex items-center gap-1">
              {trend.direction === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-semibold ${
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">vs mes anterior</span>
            </div>
          )}
        </div>

        <div className={`${colors.icon} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {link && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className={`flex items-center gap-1 text-sm font-medium ${colors.text} group-hover:gap-2 transition-all`}>
            <span>Ver detalles</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      )}
    </>
  );

  if (link) {
    return (
      <a
        href={link}
        className={`block bg-white rounded-xl shadow-md border ${colors.border} p-6 hover:shadow-lg transition-all group`}
      >
        <CardContent />
      </a>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-md border ${colors.border} p-6`}>
      <CardContent />
    </div>
  );
}