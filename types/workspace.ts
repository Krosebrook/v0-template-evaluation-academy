// Workspace related types

export interface WorkspaceMember {
  role: string
  user_id: string
  joined_at: string
  profiles?: {
    username?: string
    avatar_url?: string
    display_name?: string
  }
}

export interface WorkspaceTemplate {
  id: string
  template_id: string
  workspace_id: string
  added_at: string
  templates?: {
    id: string
    title: string
    description: string
    author_id: string
    created_at: string
    status: string
  }
}

// Discriminated union for different activity types
export type WorkspaceActivityDetails =
  | { type: 'workspace_created'; name: string }
  | { type: 'member_invited'; email: string; role: string }
  | { type: 'member_removed'; removed_user_id: string }
  | { type: 'template_added'; template_id: string }
  | { type: 'template_removed'; template_id: string }

export interface WorkspaceActivity {
  id: string
  workspace_id: string
  user_id: string
  action: string
  details: WorkspaceActivityDetails | Record<string, unknown>
  created_at: string
  profiles?: {
    username?: string
    avatar_url?: string
  }
}

export interface Workspace {
  id: string
  name: string
  description?: string
  owner_id: string
  created_at: string
  updated_at: string
  is_private?: boolean
}
