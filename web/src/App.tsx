import { useState } from 'react';
import { SourceUploadForm } from './components/SourceUploadForm';
import { ChatInterface } from './components/ChatInterface';

function App() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar for Settings/Upload */}
      <div className="w-full md:w-[400px] border-r bg-white p-6 shadow-sm z-10 flex flex-col space-y-6 shrink-0 h-screen overflow-y-auto">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">ElectionBot Admin</h1>
          <p className="text-sm text-slate-500">Manage sources and settings</p>
        </div>
        
        <SourceUploadForm 
          selectedDistrict={selectedDistrict} 
          onDistrictChange={setSelectedDistrict} 
        />
        
        <div className="mt-auto pt-6 border-t">
          <p className="text-xs text-slate-400">
            ElectionEducationBot System v1.0.0
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 p-6 h-screen overflow-hidden">
        <ChatInterface selectedDistrict={selectedDistrict} />
      </div>
    </div>
  );
}

export default App;
