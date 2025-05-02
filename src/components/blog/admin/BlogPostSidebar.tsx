
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import TagManager from './TagManager';

interface BlogPostSidebarProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
  submitButtonText: string;
  tags: string[];
  onTagsChange: (newTags: string[]) => void;
}

const BlogPostSidebar: React.FC<BlogPostSidebarProps> = ({ 
  form, 
  isSubmitting, 
  submitButtonText,
  tags,
  onTagsChange
}) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      {/* Imagem de capa */}
      <FormField
        control={form.control}
        name="imagem_capa_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL da Imagem de Capa</FormLabel>
            <FormControl>
              <Input placeholder="https://exemplo.com/imagem.jpg" {...field} value={field.value || ''} />
            </FormControl>
            <FormDescription>
              URL para a imagem principal do post
            </FormDescription>
            <FormMessage />
            {field.value && (
              <div className="mt-2 rounded-md overflow-hidden border">
                <img
                  src={field.value}
                  alt="Preview da imagem de capa"
                  className="w-full h-auto object-cover aspect-[16/9]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                    toast({
                      title: 'Erro ao carregar imagem',
                      description: 'A URL fornecida não carregou corretamente.',
                      variant: 'destructive',
                    });
                  }}
                />
              </div>
            )}
          </FormItem>
        )}
      />

      {/* Tags */}
      <TagManager tags={tags} onChange={onTagsChange} />

      {/* Status de publicação */}
      <FormField
        control={form.control}
        name="publicado"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Publicado</FormLabel>
              <FormDescription>
                {field.value ? 'O post está publicado e visível' : 'O post está salvo como rascunho'}
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Botões de ação */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </div>
  );
};

// Adding FormMessage component since it's used above but not directly imported
const FormMessage = ({ children }: { children?: React.ReactNode }) => {
  const { useFormField } = require('@/components/ui/form');
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      id={formMessageId}
      className="text-sm font-medium text-destructive"
    >
      {body}
    </p>
  );
};

export default BlogPostSidebar;
