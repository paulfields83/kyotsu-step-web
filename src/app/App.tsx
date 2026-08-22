import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { CatalogPreviewPage } from '../pages/CatalogPreviewPage'
import { ProblemsPage } from '../pages/ProblemsPage'
import { LearningSetupPage } from '../pages/LearningSetupPage'
import { LearningSessionPage } from '../pages/LearningSessionPage'
import { LearningResultPage } from '../pages/LearningResultPage'
import { SimulationSetupPage } from '../pages/SimulationSetupPage'
import { SimulationSessionPage } from '../pages/SimulationSessionPage'
import { SimulationResultPage } from '../pages/SimulationResultPage'
import { AnalysisPage } from '../pages/AnalysisPage'
import { AnalysisDetailPage } from '../pages/AnalysisDetailPage'
import { MistakesPage } from '../pages/MistakesPage'
import { HistoryPage } from '../pages/HistoryPage'
import { RankingPage } from '../pages/RankingPage'
import { ProfilePage } from '../pages/ProfilePage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/problems" replace />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/learning/setup" element={<LearningSetupPage />} />
        <Route path="/learning/session/:sessionId" element={<LearningSessionPage />} />
        <Route path="/learning/result/:sessionId" element={<LearningResultPage />} />
        <Route path="/simulation/setup" element={<SimulationSetupPage />} />
        <Route path="/simulation/session/:sessionId" element={<SimulationSessionPage />} />
        <Route path="/simulation/result/:sessionId" element={<SimulationResultPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/analysis/:dimension/:tagId" element={<AnalysisDetailPage />} />
        <Route path="/mistakes" element={<MistakesPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/ranking" element={<RankingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<CatalogPreviewPage />} />
        <Route path="/health" element={<PlaceholderPage eyebrow="SYSTEM" title="工程チェック" description="APP READY" testId="app-ready" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
