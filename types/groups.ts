export interface Group {
  id: number;
  name: string;
  description?: string;
  created_by: string;
  createdAt: string;
  updatedAt: string;
  members?: GroupMember[];
}

export interface GroupMember {
  user_id: string;
  role: 'admin' | 'moderator' | 'member';
  email: string;
  full_name: string;
  avatar_url?: string;
  joined_at: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  created_by: string;
  invitees?: string[];
}

export interface CreateGroupResponse {
  success: boolean;
  data: Group;
  message?: string;
}

export interface GroupsResponse {
  success: boolean;
  data: Group[];
}

export interface AddMemberRequest {
  user_id: string;
  role?: 'admin' | 'moderator' | 'member';
}

export interface JoinGroupResponse {
  success: boolean;
  data: GroupMember;
  message?: string;
}

export interface GroupInvitation {
  id: number;
  group_id: number;
  group_name: string;
  invitee_id: string;
  invitee_email: string;
  inviter_id: string;
  inviter_email: string;
  inviter_name: string;
  status: 'pending' | 'accepted' | 'declined';
  token: string;
  created_at: string;
  updated_at: string;
  expires_at: string;
}

export interface GroupInvitationResponse {
  success: boolean;
  data: GroupInvitation[];
  message?: string;
}
