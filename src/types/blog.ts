
export interface BlogPost {
  id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  conteudo_html: string | null;
  imagem_capa_url: string | null;
  tags: string[] | null;
  publicado: boolean | null;
  data_publicacao: string | null;
  created_at: string;
  updated_at: string;
  author_id: string | null;
}

export type BlogPostFormData = {
  titulo: string;
  slug?: string;
  descricao?: string;
  conteudo_html?: string;
  imagem_capa_url?: string;
  tags?: string[];
  publicado?: boolean;
  author_id?: string;
};

export type BlogPostMinimal = Pick<BlogPost, 'id' | 'titulo' | 'slug' | 'descricao' | 'imagem_capa_url' | 'data_publicacao'>;

export interface BlogPostListingParams {
  page?: number;
  per_page?: number;
  tag?: string;
}
