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

type ConfirmationVariant = 'destructive' | 'warning' | 'info';

interface ConfirmationState {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant: ConfirmationVariant;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

const createDefaultState = (): ConfirmationState => ({
  isOpen: false,
  title: '',
  description: '',
  confirmText: 'Bestätigen',
  cancelText: 'Abbrechen',
  variant: 'warning',
  isLoading: false,
  onConfirm: () => {},
  onCancel: () => {},
});

// Hook for managing confirmation states
export const useConfirmation = () => {
  const [state, setState] = React.useState<ConfirmationState>(createDefaultState());
  const confirmHandlerRef = React.useRef<(() => void | Promise<void>) | null>(null);
  const cancelHandlerRef = React.useRef<(() => void) | null>(null);

  const closeDialog = React.useCallback(() => {
    setState(createDefaultState());
    confirmHandlerRef.current = null;
    cancelHandlerRef.current = null;
  }, []);

  const showConfirmation = React.useCallback(
    (options: ConfirmationOptions) => {
      confirmHandlerRef.current = options.onConfirm ?? null;
      cancelHandlerRef.current = options.onCancel ?? null;

      const handleConfirm = async () => {
        const handler = confirmHandlerRef.current;
        if (!handler) {
          closeDialog();
          return;
        }

        const result = handler();
        if (result && typeof (result as Promise<unknown>).then === 'function') {
          setState((prev) => ({ ...prev, isLoading: true }));
          try {
            await result;
          } catch (error) {
            console.error('Confirmation action failed:', error);
          } finally {
            closeDialog();
          }
        } else {
          closeDialog();
        }
      };

      const handleCancel = () => {
        cancelHandlerRef.current?.();
        closeDialog();
      };

      setState({
        isOpen: true,
        title: options.title,
        description: options.description,
        confirmText: options.confirmText ?? 'Bestätigen',
        cancelText: options.cancelText ?? 'Abbrechen',
        variant: options.variant ?? 'warning',
        isLoading: false,
        onConfirm: handleConfirm,
        onCancel: handleCancel,
      });
    },
    [closeDialog],
  );

  const confirmAction = React.useCallback(
    (
      title: string,
      description: string,
      onConfirm: () => void | Promise<void>,
      config?: Omit<ConfirmationOptions, 'title' | 'description' | 'onConfirm'>,
    ) => {
      showConfirmation({
        title,
        description,
        onConfirm,
        confirmText: config?.confirmText,
        cancelText: config?.cancelText,
        variant: config?.variant,
        onCancel: config?.onCancel,
      });
    },
    [showConfirmation],
  );

  const cancelAction = React.useCallback(() => {
    state.onCancel();
  }, [state]);

  return {
    confirmation: state,
    showConfirmation,
    confirmAction,
    cancelAction,
  };
};
