export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      application_events: {
        Row: {
          application_id: string
          created_at: string
          id: string
          note: string | null
          status: Database["public"]["Enums"]["application_status"]
        }
        Insert: {
          application_id: string
          created_at?: string
          id?: string
          note?: string | null
          status: Database["public"]["Enums"]["application_status"]
        }
        Update: {
          application_id?: string
          created_at?: string
          id?: string
          note?: string | null
          status?: Database["public"]["Enums"]["application_status"]
        }
        Relationships: [
          {
            foreignKeyName: "application_events_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "document_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      document_applications: {
        Row: {
          admin_note: string | null
          created_at: string
          destination_country: string | null
          email: string
          full_name: string
          id: string
          kind: string
          nationality: string | null
          notes: string | null
          origin_country: string | null
          passport_number: string | null
          passport_service_id: string | null
          phone: string | null
          price: number
          reference: string
          service_name: string
          status: Database["public"]["Enums"]["application_status"]
          travel_date: string | null
          travelers: number
          updated_at: string
          user_id: string
          visa_rule_id: string | null
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          destination_country?: string | null
          email: string
          full_name: string
          id?: string
          kind: string
          nationality?: string | null
          notes?: string | null
          origin_country?: string | null
          passport_number?: string | null
          passport_service_id?: string | null
          phone?: string | null
          price?: number
          reference: string
          service_name: string
          status?: Database["public"]["Enums"]["application_status"]
          travel_date?: string | null
          travelers?: number
          updated_at?: string
          user_id: string
          visa_rule_id?: string | null
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          destination_country?: string | null
          email?: string
          full_name?: string
          id?: string
          kind?: string
          nationality?: string | null
          notes?: string | null
          origin_country?: string | null
          passport_number?: string | null
          passport_service_id?: string | null
          phone?: string | null
          price?: number
          reference?: string
          service_name?: string
          status?: Database["public"]["Enums"]["application_status"]
          travel_date?: string | null
          travelers?: number
          updated_at?: string
          user_id?: string
          visa_rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_applications_passport_service_id_fkey"
            columns: ["passport_service_id"]
            isOneToOne: false
            referencedRelation: "passport_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_applications_visa_rule_id_fkey"
            columns: ["visa_rule_id"]
            isOneToOne: false
            referencedRelation: "visa_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_activities: {
        Row: {
          booking_link: string | null
          created_at: string
          day_id: string
          description: string | null
          estimated_cost: number | null
          id: string
          location: string | null
          start_time: string | null
          title: string
          type: string
        }
        Insert: {
          booking_link?: string | null
          created_at?: string
          day_id: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          start_time?: string | null
          title: string
          type?: string
        }
        Update: {
          booking_link?: string | null
          created_at?: string
          day_id?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          location?: string | null
          start_time?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_activities_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_days: {
        Row: {
          created_at: string
          date: string
          day_number: number
          id: string
          notes: string | null
          title: string
          trip_id: string
        }
        Insert: {
          created_at?: string
          date: string
          day_number: number
          id?: string
          notes?: string | null
          title: string
          trip_id: string
        }
        Update: {
          created_at?: string
          date?: string
          day_number?: number
          id?: string
          notes?: string | null
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_days_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      passport_services: {
        Row: {
          accent: string
          active: boolean
          blurb: string
          created_at: string
          documents: string[]
          id: string
          name: string
          price: number
          processing: string
          slug: string
          sort_order: number
          updated_at: string
          validity: string
        }
        Insert: {
          accent?: string
          active?: boolean
          blurb?: string
          created_at?: string
          documents?: string[]
          id?: string
          name: string
          price?: number
          processing?: string
          slug: string
          sort_order?: number
          updated_at?: string
          validity?: string
        }
        Update: {
          accent?: string
          active?: boolean
          blurb?: string
          created_at?: string
          documents?: string[]
          id?: string
          name?: string
          price?: number
          processing?: string
          slug?: string
          sort_order?: number
          updated_at?: string
          validity?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          budget_level: string
          created_at: string
          destination: string
          end_date: string
          id: string
          interests: string[]
          start_date: string
          status: Database["public"]["Enums"]["trip_status"]
          travel_style: string
          travelers: number
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_level?: string
          created_at?: string
          destination: string
          end_date: string
          id?: string
          interests?: string[]
          start_date: string
          status?: Database["public"]["Enums"]["trip_status"]
          travel_style?: string
          travelers?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_level?: string
          created_at?: string
          destination?: string
          end_date?: string
          id?: string
          interests?: string[]
          start_date?: string
          status?: Database["public"]["Enums"]["trip_status"]
          travel_style?: string
          travelers?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          role: Database["public"]["Enums"]["app_role"]
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
      visa_rules: {
        Row: {
          active: boolean
          created_at: string
          destination_country: string
          destination_id: string | null
          documents: string[]
          entries: string
          fee: number
          id: string
          note: string
          origin_country: string
          processing: string
          purpose: string
          purpose_label: string
          requirement: string
          stay: string
          type_label: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          destination_country: string
          destination_id?: string | null
          documents?: string[]
          entries?: string
          fee?: number
          id?: string
          note?: string
          origin_country?: string
          processing?: string
          purpose?: string
          purpose_label?: string
          requirement?: string
          stay?: string
          type_label?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          destination_country?: string
          destination_id?: string | null
          documents?: string[]
          entries?: string
          fee?: number
          id?: string
          note?: string
          origin_country?: string
          processing?: string
          purpose?: string
          purpose_label?: string
          requirement?: string
          stay?: string
          type_label?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      application_status:
        | "submitted"
        | "in_review"
        | "at_embassy"
        | "decision"
        | "ready"
        | "delivered"
        | "rejected"
      trip_status: "draft" | "planned" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      application_status: [
        "submitted",
        "in_review",
        "at_embassy",
        "decision",
        "ready",
        "delivered",
        "rejected",
      ],
      trip_status: ["draft", "planned", "archived"],
    },
  },
} as const
