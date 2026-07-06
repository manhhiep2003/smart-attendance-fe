import { Outlet } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export default function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 py-3 shadow-sm flex items-center gap-2">
        <div className="bg-indigo-100 p-1.5 rounded-md text-indigo-600">
          <GraduationCap className="h-5 w-5" />
        </div>
        <h1 className="text-base font-bold text-slate-800">Cổng Sinh Viên</h1>
      </header>
      
      <main className="flex-1 w-full max-w-md mx-auto p-4 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}