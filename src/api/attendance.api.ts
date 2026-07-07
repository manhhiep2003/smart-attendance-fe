import type { CheckInResponse } from '@/types/attendance';
import axiosClient from './axios.client';

export const attendanceApi = {
  async checkIn(data: {
    sessionId: string;
    qrCodeToken: string;
    studentLat: number;
    studentLng: number;
  }): Promise<CheckInResponse> {
    const response = await axiosClient.post<CheckInResponse>(
      '/attendance/check-in',
      data
    );

    return response.data;
  },
};