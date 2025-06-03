import { apiClient } from './client';
import {
  Group,
  GroupMember,
  CreateGroupRequest,
  CreateGroupResponse,
  GroupsResponse,
  AddMemberRequest,
  JoinGroupResponse,
} from '../types/groups';

export const groupApi = {
  createGroup: async (
    groupData: { name: string; invitees?: string[] },
    userId: string,
  ): Promise<Group> => {
    try {
      console.log('Creating group:', groupData);
      console.log('User ID:', userId);
      const createRequest: CreateGroupRequest = {
        name: groupData.name,
        description: '',
        created_by: userId,
      };

      const response = await apiClient.post<CreateGroupResponse>('/api/groups', createRequest);

      if (!response.success) {
        throw new Error(response.message || 'Failed to create group');
      }

      console.log('Group created successfully:', response.data);

      if (groupData.invitees && groupData.invitees.length > 0) {
        console.log('Processing invitations for:', groupData.invitees);

        for (const email of groupData.invitees) {
          try {
            console.log(`invite user with email: ${email}`);
          } catch (inviteError) {
            console.warn(`Failed to invite ${email}:`, inviteError);
          }
        }
      }

      return response.data;
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error;
    }
  },

  getUserGroups: async (): Promise<Group[]> => {
    try {
      const response = await apiClient.get<GroupsResponse>(`/api/groups/user/my-groups`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user groups:', error);
      throw error;
    }
  },

  getGroupWithMembers: async (groupId: number, userId: string): Promise<Group> => {
    try {
      const response = await apiClient.get<CreateGroupResponse>(
        `/api/groups/${groupId}/members?userId=${userId}`,
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch group with members:', error);
      throw error;
    }
  },

  joinGroup: async (groupId: number, userId: string): Promise<GroupMember> => {
    try {
      const response = await apiClient.post<JoinGroupResponse>(`/api/groups/${groupId}/join`, {
        userId,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to join group:', error);
      throw error;
    }
  },

  leaveGroup: async (groupId: number, userId: string): Promise<void> => {
    try {
      await apiClient.post<{ success: boolean }>(`/api/groups/${groupId}/leave`, { userId });
    } catch (error) {
      console.error('Failed to leave group:', error);
      throw error;
    }
  },

  addMember: async (
    groupId: number,
    memberData: AddMemberRequest,
    requesterId: string,
  ): Promise<GroupMember> => {
    try {
      const response = await apiClient.post<JoinGroupResponse>(`/api/groups/${groupId}/members`, {
        ...memberData,
        requesterId,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to add member:', error);
      throw error;
    }
  },

  removeMember: async (groupId: number, userId: string, requesterId: string): Promise<void> => {
    try {
      await apiClient.delete<{ success: boolean }>(
        `/api/groups/${groupId}/members/${userId}?requesterId=${requesterId}`,
      );
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw error;
    }
  },
};
