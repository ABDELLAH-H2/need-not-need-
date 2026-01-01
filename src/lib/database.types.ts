export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            mission_statements: {
                Row: {
                    id: string
                    user_id: string
                    statement: string
                    values: Json
                    principles: Json
                    legacy: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    statement: string
                    values?: Json
                    principles?: Json
                    legacy?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    statement?: string
                    values?: Json
                    principles?: Json
                    legacy?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            roles: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    icon: string
                    color: string
                    sort_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    icon?: string
                    color?: string
                    sort_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    icon?: string
                    color?: string
                    sort_order?: number
                    created_at?: string
                }
            }
            weekly_plans: {
                Row: {
                    id: string
                    user_id: string
                    week_start: string
                    reflection: Json | null
                    is_complete: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    week_start: string
                    reflection?: Json | null
                    is_complete?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    week_start?: string
                    reflection?: Json | null
                    is_complete?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            big_rocks: {
                Row: {
                    id: string
                    weekly_plan_id: string
                    role_id: string | null
                    title: string
                    description: string | null
                    priority: number
                    is_complete: boolean
                    scheduled_day: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    weekly_plan_id: string
                    role_id?: string | null
                    title: string
                    description?: string | null
                    priority?: number
                    is_complete?: boolean
                    scheduled_day?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    weekly_plan_id?: string
                    role_id?: string | null
                    title?: string
                    description?: string | null
                    priority?: number
                    is_complete?: boolean
                    scheduled_day?: number | null
                    created_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    big_rock_id: string | null
                    user_id: string
                    title: string
                    quadrant: 'q1' | 'q2' | 'q3' | 'q4'
                    scheduled_date: string | null
                    is_complete: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    big_rock_id?: string | null
                    user_id: string
                    title: string
                    quadrant?: 'q1' | 'q2' | 'q3' | 'q4'
                    scheduled_date?: string | null
                    is_complete?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    big_rock_id?: string | null
                    user_id?: string
                    title?: string
                    quadrant?: 'q1' | 'q2' | 'q3' | 'q4'
                    scheduled_date?: string | null
                    is_complete?: boolean
                    created_at?: string
                }
            }
            renewal_logs: {
                Row: {
                    id: string
                    user_id: string
                    log_date: string
                    physical: number
                    mental: number
                    spiritual: number
                    social: number
                    physical_notes: string | null
                    mental_notes: string | null
                    spiritual_notes: string | null
                    social_notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    log_date: string
                    physical?: number
                    mental?: number
                    spiritual?: number
                    social?: number
                    physical_notes?: string | null
                    mental_notes?: string | null
                    spiritual_notes?: string | null
                    social_notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    log_date?: string
                    physical?: number
                    mental?: number
                    spiritual?: number
                    social?: number
                    physical_notes?: string | null
                    mental_notes?: string | null
                    spiritual_notes?: string | null
                    social_notes?: string | null
                    created_at?: string
                }
            }
            circle_items: {
                Row: {
                    id: string
                    user_id: string
                    item: string
                    category: 'control' | 'no_control'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    item: string
                    category: 'control' | 'no_control'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    item?: string
                    category?: 'control' | 'no_control'
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type MissionStatement = Database['public']['Tables']['mission_statements']['Row'];
export type Role = Database['public']['Tables']['roles']['Row'];
export type WeeklyPlan = Database['public']['Tables']['weekly_plans']['Row'];
export type BigRock = Database['public']['Tables']['big_rocks']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type RenewalLog = Database['public']['Tables']['renewal_logs']['Row'];
export type CircleItem = Database['public']['Tables']['circle_items']['Row'];
