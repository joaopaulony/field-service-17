
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BlogPost, BlogPostFormData } from '@/types/blog';
import { Form } from '@/components/ui/form';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import BlogPostEditor from './BlogPostEditor';
import BlogPostSidebar from './BlogPostSidebar';

// Schema do formulário
const blogPostSchema = z.object({
  titulo: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  slug: z.string().optional(),
  descricao: z.string().max(160, 'A descrição não pode exceder 160 caracteres').optional(),
  conteudo_html: z.string().min(10, 'O conteúdo do post não pode estar vazio'),
  imagem_capa_url: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  publicado: z.boolean().optional(),
});

type FormValues = z.infer<typeof blogPostSchema>;

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
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

  const onSubmit = async (values: FormValues) => {
    try {
      // Ensure titulo is provided as required by BlogPostFormData
      if (!values.titulo) {
        form.setError('titulo', {
          type: 'manual',
          message: 'O título é obrigatório',
        });
        return;
      }

      // Incluir a lista de tags no objeto de dados
      const formData: BlogPostFormData = {
        titulo: values.titulo,
        slug: values.slug,
        descricao: values.descricao,
        conteudo_html: values.conteudo_html,
        imagem_capa_url: values.imagem_capa_url,
        publicado: values.publicado,
        tags: tags,
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
            <BlogPostEditor 
              form={form}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <div>
            <BlogPostSidebar 
              form={form}
              isSubmitting={isSubmitting}
              submitButtonText={submitButtonText}
              tags={tags}
              onTagsChange={setTags}
            />
          </div>
        </div>
      </form>
    </Form>
  );
};

export default BlogPostForm;
