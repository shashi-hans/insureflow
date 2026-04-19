import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home/Home'
import QuoteFlow from './pages/Motor/QuoteFlow'
import Results from './pages/Motor/Results'
import Dashboard from './pages/Dashboard/Dashboard'
import Claims from './pages/Claims/Claims'
import Proposal from './pages/Motor/Proposal'
import Success from './pages/Motor/Success'
import BikeQuoteFlow from './pages/Bike/QuoteFlow'
import HealthQuoteFlow from './pages/Health/QuoteFlow'
import HealthResults from './pages/Health/Results'
import HealthProposal from './pages/Health/Proposal'
import TermQuoteFlow from './pages/Term/QuoteFlow'
import TermResults from './pages/Term/Results'
import TermProposal from './pages/Term/Proposal'
import FlowChart from './pages/Docs/FlowChart'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/motor/quote" element={<Layout><QuoteFlow /></Layout>} />
          <Route path="/motor/results" element={<Layout><Results /></Layout>} />
          <Route path="/motor/proposal" element={<Layout><Proposal /></Layout>} />
          <Route path="/motor/success" element={<Layout><Success /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/claims" element={<Layout><Claims /></Layout>} />
          <Route path="/claims/new" element={<Layout><Claims /></Layout>} />
          {/* Bike routes */}
          <Route path="/bike/quote" element={<Layout><BikeQuoteFlow /></Layout>} />
          <Route path="/bike/results" element={<Layout><Results /></Layout>} />
          <Route path="/bike/proposal" element={<Layout><Proposal /></Layout>} />
          <Route path="/bike/success" element={<Layout><Success /></Layout>} />
          {/* Health routes */}
          <Route path="/health/quote" element={<Layout><HealthQuoteFlow /></Layout>} />
          <Route path="/health/results" element={<Layout><HealthResults /></Layout>} />
          <Route path="/health/proposal" element={<Layout><HealthProposal /></Layout>} />
          <Route path="/health/success" element={<Layout><Success /></Layout>} />
          {/* Term routes */}
          <Route path="/term/quote" element={<Layout><TermQuoteFlow /></Layout>} />
          <Route path="/term/results" element={<Layout><TermResults /></Layout>} />
          <Route path="/term/proposal" element={<Layout><TermProposal /></Layout>} />
          <Route path="/term/success" element={<Layout><Success /></Layout>} />
          {/* Legacy / redirect */}
          <Route path="/health" element={<Navigate to="/health/quote" replace />} />
          <Route path="/life" element={<Navigate to="/term/quote" replace />} />
          <Route path="/travel" element={<Layout><ComingSoon title="Travel Insurance" /></Layout>} />
          <Route path="/docs" element={<Layout><FlowChart /></Layout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-6">
      <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl mb-2">🚧</div>
      <h1 className="text-2xl font-display font-bold text-navy-900">{title}</h1>
      <p className="text-slate-500 max-w-sm">This product is coming soon. We're building something great for you!</p>
      <a href="/" className="btn-primary mt-2">Back to Home</a>
    </div>
  )
}
