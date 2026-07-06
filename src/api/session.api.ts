import axiosClient from './axios.client';

export const sessionApi = {
  // Giảng viên bắt đầu phiên điểm danh
  startSession: (data: { classId: string; scheduleId: string; lat: number; lng: number; radius: number }) => {
    return axiosClient.post('/sessions/start', data);
  },

  // Giảng viên đóng phiên điểm danh
  stopSession: (sessionId: string) => {
    return axiosClient.put(`/sessions/${sessionId}/stop`);
  },

  // Lấy danh sách phiên điểm danh (tuỳ chọn thêm để load lịch sử)
  getSessionsByClass: (classId: string) => {
    return axiosClient.get(`/sessions?classId=${classId}`);
  }
};