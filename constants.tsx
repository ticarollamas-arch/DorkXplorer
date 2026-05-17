
import React from 'react';
import { DorkItem } from './types';

export const PRESET_DORKS: DorkItem[] = [
  {
    type: 'google',
    query: 'site:example.com intitle:"Prometheus Time Series Collection and Processing Server"',
    description: 'Localizar servidores Prometheus expostos para o alvo.',
  },
  {
    type: 'google',
    query: 'site:target.com inurl:/metrics',
    description: 'Encontrar endpoints de métricas expostos.',
  },
  {
    type: 'google',
    query: 'site:corp.com inurl:/dashboard status:200',
    description: 'Localizar dashboards potencialmente expostos.',
  },
  {
    type: 'shodan',
    query: 'intitle:"Grafana" "TargetName"',
    description: 'Buscar instâncias do Grafana expostas no Shodan.',
  },
];
