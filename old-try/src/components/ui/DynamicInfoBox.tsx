import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  TrendingDown,
  Calculator,
  Lightbulb,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface InfoContent {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'tip' | 'calculation';
  title: string;
  content: string;
  details?: string;
  actionText?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  contextValues?: Record<string, number>;
  lastUpdated: string;
}

interface DynamicInfoBoxProps {
  contentType: string;
  contextData?: Record<string, any>;
  className?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onAction?: (actionUrl: string) => void;
}

const DynamicInfoBox: React.FC<DynamicInfoBoxProps> = ({
  contentType,
  contextData = {},
  className = '',
  autoRefresh = true,
  refreshInterval = 30000, // 30 seconds
  onAction
}) => {
  const [content, setContent] = useState<InfoContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch content from backend
  const fetchContent = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        ...contextData,
        timestamp: Date.now().toString()
      });
      
      const response = await fetch(`/api/info-content/${contentType}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setContent(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load content');
      console.error('Error fetching info content:', err);
    } finally {
      setIsLoading(false);
    }
  }, [contentType, contextData]);

  // Initial load and auto-refresh
  useEffect(() => {
    fetchContent();
    
    if (autoRefresh) {
      const interval = setInterval(fetchContent, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchContent, autoRefresh, refreshInterval]);

  // Refresh when context data changes
  useEffect(() => {
    if (Object.keys(contextData).length > 0) {
      fetchContent();
    }
  }, [fetchContent, contextData]);

  const getIcon = (type: InfoContent['type']) => {
    const iconClass = 'w-5 h-5';
    switch (type) {
      case 'warning':
        return <AlertTriangle className={cn(iconClass, 'text-yellow-500')} />;
      case 'success':
        return <CheckCircle className={cn(iconClass, 'text-green-500')} />;
      case 'error':
        return <XCircle className={cn(iconClass, 'text-red-500')} />;
      case 'tip':
        return <Lightbulb className={cn(iconClass, 'text-blue-500')} />;
      case 'calculation':
        return <Calculator className={cn(iconClass, 'text-purple-500')} />;
      default:
        return <Info className={cn(iconClass, 'text-blue-500')} />;
    }
  };

  const getVariant = (type: InfoContent['type']) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'tip':
        return 'border-blue-200 bg-blue-50';
      case 'calculation':
        return 'border-purple-200 bg-purple-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: InfoContent['priority']) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[priority]} className="text-xs">
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const handleAction = () => {
    if (content?.actionUrl && onAction) {
      onAction(content.actionUrl);
    }
  };

  const formatContentWithValues = (text: string, values: Record<string, number> = {}) => {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      const value = values[key];
      if (typeof value === 'number') {
        // Try to format as currency if it looks like a monetary value
        if (key.toLowerCase().includes('amount') || key.toLowerCase().includes('value') || value > 1000) {
          return formatCurrency(value);
        }
        return value.toLocaleString();
      }
      return match;
    });
  };

  if (isLoading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Lade Informationen...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn('border-red-200 bg-red-50', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">Fehler beim Laden: {error}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchContent}
              className="h-6 px-2"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <Card className={cn(
      'transition-all duration-200 hover:shadow-md',
      getVariant(content.type),
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-sm font-medium">
            {getIcon(content.type)}
            <span>{content.title}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            {getPriorityBadge(content.priority)}
            <Button
              size="sm"
              variant="ghost"
              onClick={fetchContent}
              className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
            >
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-sm text-foreground">
            {formatContentWithValues(content.content, content.contextValues)}
          </p>
          
          {content.details && (
            <p className="text-xs text-muted-foreground">
              {formatContentWithValues(content.details, content.contextValues)}
            </p>
          )}
          
          {content.actionText && content.actionUrl && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleAction}
              className="mt-2 h-7 text-xs"
            >
              {content.actionText}
            </Button>
          )}
          
          <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
            <span>Aktualisiert: {new Date(content.lastUpdated).toLocaleTimeString()}</span>
            {autoRefresh && (
              <span>Nächste Aktualisierung: {Math.ceil(refreshInterval / 1000)}s</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicInfoBox;