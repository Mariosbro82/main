import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Trash2, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConfirmationDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'destructive' | 'warning' | 'info';
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  trigger,
  title,
  description,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  onConfirm,
  onCancel,
  variant = 'warning',
  icon,
  isLoading = false,
  disabled = false
}) => {
  const [open, setOpen] = React.useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'destructive':
        return {
          iconColor: 'text-red-600',
          confirmVariant: 'destructive' as const
        };
      case 'warning':
        return {
          iconColor: 'text-amber-600',
          confirmVariant: 'default' as const
        };
      case 'info':
        return {
          iconColor: 'text-blue-600',
          confirmVariant: 'default' as const
        };
      default:
        return {
          iconColor: 'text-gray-600',
          confirmVariant: 'default' as const
        };
    }
  };

  const { iconColor, confirmVariant } = getVariantStyles();

  const defaultIcon = () => {
    switch (variant) {
      case 'destructive':
        return <Trash2 className={cn('h-6 w-6', iconColor)} />;
      case 'warning':
        return <AlertTriangle className={cn('h-6 w-6', iconColor)} />;
      default:
        return <AlertTriangle className={cn('h-6 w-6', iconColor)} />;
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild disabled={disabled}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {icon || defaultIcon()}
            <AlertDialogTitle className="text-lg font-semibold">
              {title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600 leading-relaxed">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 sm:gap-2">
          <AlertDialogCancel 
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            variant={confirmVariant}
            className="flex-1"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Wird ausgeführt...
              </div>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Specialized confirmation dialogs for common actions
export interface ResetConfirmationProps {
  trigger: React.ReactNode;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const ResetConfirmation: React.FC<ResetConfirmationProps> = ({
  trigger,
  onConfirm,
  title = 'Daten zurücksetzen',
  description = 'Möchten Sie wirklich alle eingegebenen Daten zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.',
  isLoading = false
}) => {
  return (
    <ConfirmationDialog
      trigger={trigger}
      title={title}
      description={description}
      confirmText="Zurücksetzen"
      cancelText="Abbrechen"
      onConfirm={onConfirm}
      variant="warning"
      icon={<RotateCcw className="h-6 w-6 text-amber-600" />}
      isLoading={isLoading}
    />
  );
};

export interface DeleteConfirmationProps {
  trigger: React.ReactNode;
  onConfirm: () => void;
  itemName?: string;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  trigger,
  onConfirm,
  itemName = 'dieses Element',
  title = 'Element löschen',
  description,
  isLoading = false
}) => {
  const defaultDescription = `Möchten Sie ${itemName} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`;

  return (
    <ConfirmationDialog
      trigger={trigger}
      title={title}
      description={description || defaultDescription}
      confirmText="Löschen"
      cancelText="Abbrechen"
      onConfirm={onConfirm}
      variant="destructive"
      icon={<Trash2 className="h-6 w-6 text-red-600" />}
      isLoading={isLoading}
    />
  );
};

// Hook for managing confirmation states
export const useConfirmation = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<(() => void) | null>(null);

  const confirm = React.useCallback(async (action: () => void | Promise<void>) => {
    try {
      setIsLoading(true);
      await action();
    } catch (error) {
      console.error('Confirmation action failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  }, []);

  const cancel = React.useCallback(() => {
    setIsLoading(false);
    setPendingAction(null);
  }, []);

  return {
    isLoading,
    confirm,
    cancel,
    pendingAction
  };
};