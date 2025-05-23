export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          city: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          plan: string
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id: string
          logo_url?: string | null
          name: string
          phone?: string | null
          plan?: string
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          plan?: string
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      inventory_categories: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_categories_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category_id: string | null
          company_id: string
          cost_price: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          min_quantity: number
          name: string
          quantity: number
          sku: string | null
          status: Database["public"]["Enums"]["inventory_status"]
          unit_price: number
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          company_id: string
          cost_price?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          min_quantity?: number
          name: string
          quantity?: number
          sku?: string | null
          status?: Database["public"]["Enums"]["inventory_status"]
          unit_price?: number
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          company_id?: string
          cost_price?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          min_quantity?: number
          name?: string
          quantity?: number
          sku?: string | null
          status?: Database["public"]["Enums"]["inventory_status"]
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "inventory_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          company_id: string
          created_at: string
          created_by_id: string | null
          id: string
          item_id: string
          movement_type: string
          notes: string | null
          quantity: number
          reference_id: string | null
          reference_type: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by_id?: string | null
          id?: string
          item_id: string
          movement_type: string
          notes?: string | null
          quantity: number
          reference_id?: string | null
          reference_type?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by_id?: string | null
          id?: string
          item_id?: string
          movement_type?: string
          notes?: string | null
          quantity?: number
          reference_id?: string | null
          reference_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      posts_blog: {
        Row: {
          author_id: string | null
          conteudo_html: string | null
          created_at: string
          data_publicacao: string | null
          descricao: string | null
          id: string
          imagem_capa_url: string | null
          publicado: boolean | null
          slug: string
          tags: string[] | null
          titulo: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          conteudo_html?: string | null
          created_at?: string
          data_publicacao?: string | null
          descricao?: string | null
          id?: string
          imagem_capa_url?: string | null
          publicado?: boolean | null
          slug: string
          tags?: string[] | null
          titulo: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          conteudo_html?: string | null
          created_at?: string
          data_publicacao?: string | null
          descricao?: string | null
          id?: string
          imagem_capa_url?: string | null
          publicado?: boolean | null
          slug?: string
          tags?: string[] | null
          titulo?: string
          updated_at?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          created_at: string
          description: string
          discount_percentage: number | null
          id: string
          inventory_item_id: string | null
          quantity: number
          quote_id: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          discount_percentage?: number | null
          id?: string
          inventory_item_id?: string | null
          quantity?: number
          quote_id: string
          unit_price?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          discount_percentage?: number | null
          id?: string
          inventory_item_id?: string | null
          quantity?: number
          quote_id?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          address: string | null
          client_email: string | null
          client_name: string
          client_phone: string | null
          company_id: string
          created_at: string
          email_sent: boolean | null
          email_sent_at: string | null
          id: string
          notes: string | null
          status: string
          technician_id: string | null
          total_amount: number
          updated_at: string
          valid_until: string | null
          work_order_id: string | null
        }
        Insert: {
          address?: string | null
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          company_id: string
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          technician_id?: string | null
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
          work_order_id?: string | null
        }
        Update: {
          address?: string | null
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          company_id?: string
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          id?: string
          notes?: string | null
          status?: string
          technician_id?: string | null
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          start_time: string
          technician_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          start_time: string
          technician_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          start_time?: string
          technician_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_availability_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_performance: {
        Row: {
          average_completion_time_minutes: number
          completed_work_orders: number
          created_at: string
          customer_satisfaction_rating: number
          id: string
          period_end: string
          period_start: string
          revenue_generated: number
          technician_id: string
          updated_at: string
        }
        Insert: {
          average_completion_time_minutes?: number
          completed_work_orders?: number
          created_at?: string
          customer_satisfaction_rating?: number
          id?: string
          period_end: string
          period_start: string
          revenue_generated?: number
          technician_id: string
          updated_at?: string
        }
        Update: {
          average_completion_time_minutes?: number
          completed_work_orders?: number
          created_at?: string
          customer_satisfaction_rating?: number
          id?: string
          period_end?: string
          period_start?: string
          revenue_generated?: number
          technician_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_performance_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_skill_mappings: {
        Row: {
          created_at: string
          id: string
          proficiency_level: number
          skill_id: string
          technician_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          proficiency_level?: number
          skill_id: string
          technician_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          proficiency_level?: number
          skill_id?: string
          technician_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_skill_mappings_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "technician_skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_skill_mappings_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_skills: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_skills_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          active: boolean
          bio: string | null
          company_id: string
          created_at: string
          email: string
          hourly_rate: number | null
          id: string
          max_daily_work_orders: number | null
          name: string
          phone: string | null
          profile_image_url: string | null
          specialization: string | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          active?: boolean
          bio?: string | null
          company_id: string
          created_at?: string
          email: string
          hourly_rate?: number | null
          id?: string
          max_daily_work_orders?: number | null
          name: string
          phone?: string | null
          profile_image_url?: string | null
          specialization?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          active?: boolean
          bio?: string | null
          company_id?: string
          created_at?: string
          email?: string
          hourly_rate?: number | null
          id?: string
          max_daily_work_orders?: number | null
          name?: string
          phone?: string | null
          profile_image_url?: string | null
          specialization?: string | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "technicians_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_order_photos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          photo_url: string
          work_order_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          photo_url: string
          work_order_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          photo_url?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_photos_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          client_name: string | null
          company_id: string
          completion_date: string | null
          completion_latitude: number | null
          completion_longitude: number | null
          created_at: string
          description: string | null
          id: string
          location: string | null
          notes: string | null
          scheduled_date: string | null
          signature_url: string | null
          start_latitude: number | null
          start_longitude: number | null
          status: Database["public"]["Enums"]["work_order_status"]
          technician_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          company_id: string
          completion_date?: string | null
          completion_latitude?: number | null
          completion_longitude?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_date?: string | null
          signature_url?: string | null
          start_latitude?: number | null
          start_longitude?: number | null
          status?: Database["public"]["Enums"]["work_order_status"]
          technician_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          company_id?: string
          completion_date?: string | null
          completion_latitude?: number | null
          completion_longitude?: number | null
          created_at?: string
          description?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          scheduled_date?: string | null
          signature_url?: string | null
          start_latitude?: number | null
          start_longitude?: number | null
          status?: Database["public"]["Enums"]["work_order_status"]
          technician_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      inventory_status: "active" | "discontinued" | "low_stock"
      work_order_status: "pending" | "in_progress" | "completed" | "canceled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      inventory_status: ["active", "discontinued", "low_stock"],
      work_order_status: ["pending", "in_progress", "completed", "canceled"],
    },
  },
} as const
