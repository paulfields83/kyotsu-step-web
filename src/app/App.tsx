import { Navigate, Route, Routes } from 'react-router-dom'
import { PlaceholderPage } from '../pages/PlaceholderPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { CatalogPreviewPage } from '../pages/CatalogPreviewPage'
import { LearningSessionPage } from '../pages/LearningSessionPage'
import { LearningResultPage } from '../pages/LearningResultPage'
import { TextbookUnitPage } from '../pages/TextbookUnitPage'
import { SimulationSetupPage } from '../pages/SimulationSetupPage'
import { SimulationSessionPage } from '../pages/SimulationSessionPage'
import { SimulationResultPage } from '../pages/SimulationResultPage'
import { AnalysisPage } from '../pages/AnalysisPage'
import { AnalysisDetailPage } from '../pages/AnalysisDetailPage'
import { MistakesPage } from '../pages/MistakesPage'
import { HistoryPage } from '../pages/HistoryPage'
import { RedesignShell } from '../redesign/layout/RedesignShell'
import { AppHomePage } from '../redesign/pages/AppHomePage'
import { CoursePage } from '../redesign/pages/CoursePage'
import { PracticePage } from '../redesign/pages/PracticePage'
import { ProgressHubPage } from '../redesign/pages/ProgressHubPage'
import { SettingsHubPage } from '../redesign/pages/SettingsHubPage'

export default function App() {
  return (
    <Routes>
      <Route element={<RedesignShell />}>
        <Route path="/" element={<AppHomePage />} />
        <Route path="/ui-preview" element={<Navigate to="/" replace />} />

        <Route path="/courses" element={<CoursePage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/progress" element={<ProgressHubPage />} />
        <Route path="/settings" element={<SettingsHubPage />} />

        <Route path="/learn" element={<Navigate to="/courses" replace />} />
        <Route path="/problems" element={<Navigate to="/practice" replace />} />
        <Route path="/profile" element={<Navigate to="/settings" replace />} />

        <Route path="/learning/setup" element={<Navigate to="/practice" replace />} />
        <Route path="/learning/session/:sessionId" element={<LearningSessionPage />} />
        <Route path="/learning/result/:sessionId" element={<LearningResultPage />} />
        <Route path="/learning/textbook/:unitId" element={<TextbookUnitPage />} />

        <Route path="/simulation/setup" element={<SimulationSetupPage />} />
        <Route path="/simulation/session/:sessionId" element={<SimulationSessionPage />} />
        <Route path="/simulation/result/:sessionId" element={<SimulationResultPage />} />

        <Route path="/analysis" element={<AnalysisPage />} />
        <Route path="/analysis/:dimension/:tagId" element={<AnalysisDetailPage />} />
        <Route path="/mistakes" element={<MistakesPage />} />
        <Route path="/history" element={<HistoryPage />} />

        <Route path="/admin" element={<CatalogPreviewPage />} />
        <Route path="/health" element={<PlaceholderPage eyebrow="SYSTEM" title="工程チェック" description="APP READY" testId="app-ready" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
