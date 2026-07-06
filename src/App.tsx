import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import TeacherLayout from './layouts/TeacherLayout';
import StudentLayout from './layouts/StudentLayout';
import SessionHost from './pages/teacher/SessionHost';
import CheckIn from './pages/student/CheckIn';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      
      <Routes>
        {/* Nhóm Route Giảng viên */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="session" replace />} />
          <Route path="session" element={<SessionHost />} />
        </Route>

        {/* Nhóm Route Sinh viên */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="check-in" replace />} />
          <Route path="check-in" element={<CheckIn />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}