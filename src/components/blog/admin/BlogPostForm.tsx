
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlogPost, BlogPostFormData } from '@/types/blog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

// Schema do formulário
const blogPostSchema = z.object({
  titulo: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  slug: z.string().optional(),
  descricao: z.string().max(160, 'A descrição não pode exceder 160 caracteres').optional(),
  conteudo_html: z.string().min(10, 'O conteúdo do post não pode estar vazio'),
  imagem_capa_url: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  publicado: z.boolean().optional(),
});

interface BlogPostFormProps {
  post?: BlogPost;
  onSave: (data: BlogPostFormData) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({
  post,
  onSave,
  isSubmitting,
  submitButtonText = 'Salvar',
}) => {
  const [activeTab, setActiveTab] = useState('edit');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof blogPostSchema>>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      titulo: post?.titulo || '',
      slug: post?.slug || '',
      descricao: post?.descricao || '',
      conteudo_html: post?.conteudo_html || '',
      imagem_capa_url: post?.imagem_capa_url || '',
      publicado: post?.publicado || false,
    },
  });

  const conteudoHtml = form.watch('conteudo_html');

  // Monitora mudanças no título para sugerir slug
  const titulo = form.watch('titulo');
  useEffect(() => {
    if (!post && titulo && !form.getValues('slug')) {
      const suggestedSlug = titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '-');
      form.setValue('slug', suggestedSlug);
    }
  }, [titulo, form, post]);

  const handleTagAdd = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const onSubmit = async (values: z.infer<typeof blogPostSchema>) => {
    try {
      // Incluir a lista de tags no objeto de dados
      const formData = {
        ...values,
        tags,
      };

      await onSave(formData);
      toast({
        title: 'Sucesso!',
        description: post ? 'Post atualizado com sucesso.' : 'Post criado com sucesso.',
      });
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o post.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Editor e Preview Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          </div>

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
            <div className="space-y-2">
              <FormLabel>Tags</FormLabel>
              <div className="flex items-center mb-2">
                <Input
                  placeholder="Adicionar tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={handleTagAdd}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge key={index} className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="rounded-full hover:bg-muted ml-1"
                      aria-label={`Remover tag ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

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
        </div>
      </form>
    </Form>
  );
};

export default BlogPostForm;
