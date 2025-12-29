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

export interface WorkspaceActivity {
  id: string
  workspace_id: string
  user_id: string
  action: string
  details: Record<string, any>
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
