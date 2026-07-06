import axiosClient from './axios.client';

export const attendanceApi = {
  // Sinh viên gửi tọa độ và mã QR để điểm danh
  checkIn: (data: { sessionId: string; qrCodeToken: string; studentLat: number; studentLng: number }) => {
    return axiosClient.post('/attendance/check-in', data);
  },
};