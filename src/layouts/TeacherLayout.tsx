import { Outlet } from 'react-router-dom';
import { MonitorPlay, Users, LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function TeacherLayout() {
  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* Sidebar giả lập */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 flex items-center gap-3 text-white">
          <MonitorPlay className="h-6 w-6 text-indigo-400" />
          <span className="font-bold text-lg tracking-wide">EduCheck</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <div className="flex items-center gap-3 bg-indigo-600/20 text-indigo-300 px-4 py-3 rounded-lg border border-indigo-500/30 font-medium">
            <Users className="h-5 w-5" />
            <span>Phiên Điểm Danh</span>
          </div>
          {/* Thêm các menu khác ở đây */}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800">
            <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Vùng nội dung chính */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 shrink-0">
          <h1 className="font-semibold text-slate-800 text-lg">Bảng điều khiển Giảng viên</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}