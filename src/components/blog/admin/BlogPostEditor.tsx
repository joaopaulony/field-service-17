
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BlogPostEditorProps {
  form: UseFormReturn<any>;
  activeTab: string;
  onTabChange: (value: string) => void;
}

const BlogPostEditor: React.FC<BlogPostEditorProps> = ({ form, activeTab, onTabChange }) => {
  const conteudoHtml = form.watch('conteudo_html');

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="edit">Editar</TabsTrigger>
        <TabsTrigger value="preview">Visualizar</TabsTrigger>
      </TabsList>

      <TabsContent value="edit" className="space-y-4">
        {/* Título */}
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do post" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug */}
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="url-amigavel" {...field} />
              </FormControl>
              <FormDescription>
                O slug é usado para criar a URL do post: /blog/seu-slug-aqui
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Descrição */}
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (meta description)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Uma breve descrição do post (até 160 caracteres)"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                {(field.value?.length || 0)}/160 caracteres
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conteúdo HTML */}
        <FormField
          control={form.control}
          name="conteudo_html"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo HTML</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="<h2>Título</h2><p>Conteúdo do post...</p>"
                  className="min-h-[300px] font-mono text-sm"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Insira o HTML do conteúdo do post
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </TabsContent>

      <TabsContent value="preview" className="space-y-4">
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="prose prose-slate max-w-none">
              <h1 className="text-2xl font-bold mb-4">{form.getValues('titulo') || 'Título do Post'}</h1>
              {form.getValues('descricao') && (
                <p className="text-muted-foreground italic mb-6">
                  {form.getValues('descricao')}
                </p>
              )}
              <div
                dangerouslySetInnerHTML={{ __html: conteudoHtml || '<p>O conteúdo do post aparecerá aqui...</p>' }}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default BlogPostEditor;
