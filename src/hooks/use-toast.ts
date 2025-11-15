import { toast } from 'sonner';

export const useToast = () => {
  return {
    toast: ({ 
      title, 
      description, 
      duration = 3000 
    }: { 
      title: string; 
      description?: string; 
      duration?: number;
    }) => {
      toast(title, {
        description,
        duration,
      });
    },
  };
};