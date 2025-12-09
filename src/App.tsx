import { Routes, Route, Navigate } from 'react-router-dom';
import { DrawProvider } from './context/DrawContext';
import StageView from './pages/StageView';
import ControlView from './pages/ControlView';
import './index.css';

function App() {
    return (
        <DrawProvider>
            <Routes>
                <Route path="/" element={<Navigate to="/stage" replace />} />
                <Route path="/stage" element={<StageView />} />
                <Route path="/control" element={<ControlView />} />
                {/* Keep legacy routes for now */}
                <Route path="/admin" element={<Navigate to="/control" replace />} />
            </Routes>
        </DrawProvider>
    );
}

export default App;
