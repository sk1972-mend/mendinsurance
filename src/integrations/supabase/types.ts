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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      claims: {
        Row: {
          assigned_shop_id: string | null
          completed_at: string | null
          created_at: string
          customer_photos: string[] | null
          filed_at: string
          id: string
          issue_description: string
          policy_id: string
          post_repair_photos: string[] | null
          repair_cost_agreed: number | null
          repair_notes: string | null
          repair_type: Database["public"]["Enums"]["repair_type"] | null
          serial_match: boolean | null
          shop_verification_photo: string | null
          shop_verification_serial: string | null
          status: Database["public"]["Enums"]["claim_status"]
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          assigned_shop_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_photos?: string[] | null
          filed_at?: string
          id?: string
          issue_description: string
          policy_id: string
          post_repair_photos?: string[] | null
          repair_cost_agreed?: number | null
          repair_notes?: string | null
          repair_type?: Database["public"]["Enums"]["repair_type"] | null
          serial_match?: boolean | null
          shop_verification_photo?: string | null
          shop_verification_serial?: string | null
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          assigned_shop_id?: string | null
          completed_at?: string | null
          created_at?: string
          customer_photos?: string[] | null
          filed_at?: string
          id?: string
          issue_description?: string
          policy_id?: string
          post_repair_photos?: string[] | null
          repair_cost_agreed?: number | null
          repair_notes?: string | null
          repair_type?: Database["public"]["Enums"]["repair_type"] | null
          serial_match?: boolean | null
          shop_verification_photo?: string | null
          shop_verification_serial?: string | null
          status?: Database["public"]["Enums"]["claim_status"]
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_assigned_shop_id_fkey"
            columns: ["assigned_shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
        ]
      }
      claims_payout: {
        Row: {
          amount: number
          claim_id: string
          id: string
          paid_at: string
          shop_id: string
          stripe_transfer_id: string | null
        }
        Insert: {
          amount: number
          claim_id: string
          id?: string
          paid_at?: string
          shop_id: string
          stripe_transfer_id?: string | null
        }
        Update: {
          amount?: number
          claim_id?: string
          id?: string
          paid_at?: string
          shop_id?: string
          stripe_transfer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "claims_payout_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "claims_payout_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      device_health_history: {
        Row: {
          device_id: string
          diagnostic_data: Json | null
          diagnostic_type: string
          id: string
          performed_at: string
          performed_by: string | null
        }
        Insert: {
          device_id: string
          diagnostic_data?: Json | null
          diagnostic_type: string
          id?: string
          performed_at?: string
          performed_by?: string | null
        }
        Update: {
          device_id?: string
          diagnostic_data?: Json | null
          diagnostic_type?: string
          id?: string
          performed_at?: string
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "device_health_history_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          brand: string
          created_at: string
          device_type: Database["public"]["Enums"]["device_type"]
          health_status: string | null
          id: string
          model: string
          photo_url: string | null
          serial_number: string
          tier: number
          updated_at: string
          user_id: string
        }
        Insert: {
          brand: string
          created_at?: string
          device_type: Database["public"]["Enums"]["device_type"]
          health_status?: string | null
          id?: string
          model: string
          photo_url?: string | null
          serial_number: string
          tier: number
          updated_at?: string
          user_id: string
        }
        Update: {
          brand?: string
          created_at?: string
          device_type?: Database["public"]["Enums"]["device_type"]
          health_status?: string | null
          id?: string
          model?: string
          photo_url?: string | null
          serial_number?: string
          tier?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      policies: {
        Row: {
          created_at: string
          deductible: number
          device_id: string
          end_date: string | null
          id: string
          monthly_premium: number
          referring_shop_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["policy_status"]
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deductible: number
          device_id: string
          end_date?: string | null
          id?: string
          monthly_premium: number
          referring_shop_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["policy_status"]
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deductible?: number
          device_id?: string
          end_date?: string | null
          id?: string
          monthly_premium?: number
          referring_shop_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["policy_status"]
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "policies_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "policies_referring_shop_id_fkey"
            columns: ["referring_shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shops: {
        Row: {
          business_address: string | null
          business_email: string | null
          business_name: string
          business_phone: string | null
          certifications: string[] | null
          created_at: string
          equipment_list: string[] | null
          id: string
          specializations: string[] | null
          status: Database["public"]["Enums"]["shop_status"]
          stripe_connect_id: string | null
          tier: Database["public"]["Enums"]["shop_tier"]
          updated_at: string
          user_id: string
          wallet_balance: number
        }
        Insert: {
          business_address?: string | null
          business_email?: string | null
          business_name: string
          business_phone?: string | null
          certifications?: string[] | null
          created_at?: string
          equipment_list?: string[] | null
          id?: string
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["shop_status"]
          stripe_connect_id?: string | null
          tier?: Database["public"]["Enums"]["shop_tier"]
          updated_at?: string
          user_id: string
          wallet_balance?: number
        }
        Update: {
          business_address?: string | null
          business_email?: string | null
          business_name?: string
          business_phone?: string | null
          certifications?: string[] | null
          created_at?: string
          equipment_list?: string[] | null
          id?: string
          specializations?: string[] | null
          status?: Database["public"]["Enums"]["shop_status"]
          stripe_connect_id?: string | null
          tier?: Database["public"]["Enums"]["shop_tier"]
          updated_at?: string
          user_id?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      subscriptions_ledger: {
        Row: {
          amount: number
          credited_at: string
          id: string
          policy_id: string
          shop_id: string
          stripe_invoice_id: string | null
        }
        Insert: {
          amount: number
          credited_at?: string
          id?: string
          policy_id: string
          shop_id: string
          stripe_invoice_id?: string | null
        }
        Update: {
          amount?: number
          credited_at?: string
          id?: string
          policy_id?: string
          shop_id?: string
          stripe_invoice_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_ledger_policy_id_fkey"
            columns: ["policy_id"]
            isOneToOne: false
            referencedRelation: "policies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_ledger_shop_id_fkey"
            columns: ["shop_id"]
            isOneToOne: false
            referencedRelation: "shops"
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "customer" | "shop" | "admin"
      claim_status:
        | "filed"
        | "assigned"
        | "in_progress"
        | "verified_complete"
        | "flagged"
        | "closed"
      device_type:
        | "smartphone"
        | "tablet"
        | "laptop"
        | "console"
        | "wearable"
        | "drone"
        | "audio"
      policy_status: "active" | "cancelled" | "expired" | "pending"
      repair_type: "local" | "mail_in"
      shop_status: "pending" | "approved" | "rejected" | "suspended"
      shop_tier: "basic" | "advanced" | "expert"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["customer", "shop", "admin"],
      claim_status: [
        "filed",
        "assigned",
        "in_progress",
        "verified_complete",
        "flagged",
        "closed",
      ],
      device_type: [
        "smartphone",
        "tablet",
        "laptop",
        "console",
        "wearable",
        "drone",
        "audio",
      ],
      policy_status: ["active", "cancelled", "expired", "pending"],
      repair_type: ["local", "mail_in"],
      shop_status: ["pending", "approved", "rejected", "suspended"],
      shop_tier: ["basic", "advanced", "expert"],
    },
  },
} as const
