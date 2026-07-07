import type { StartSessionResponse } from '@/types/session';
import axiosClient from './axios.client';

export const sessionApi = {
  async startSession(data: {
    classId: string;
    scheduleId: string;
    lat: number;
    lng: number;
    radius: number;
  }): Promise<StartSessionResponse> {
    const res = await axiosClient.post<StartSessionResponse>(
      '/sessions/start', data
    );

    return res.data;
  },

  async stopSession(sessionId: string) {
    const res = await axiosClient.put(`/sessions/${sessionId}/stop`);
    return res.data;
  },

  async getSessionsByClass(classId: string) {
    const res = await axiosClient.get(`/sessions?classId=${classId}`);
    return res.data;
  },
};