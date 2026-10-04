import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import GlobalBackground from './components/GlobalBackground';

import ProtectedRoute from './components/ProtectedRoute';

// Lazy-loaded auxiliary widgets
const ChatWidget = React.lazy(() => import('./components/ChatWidget'));
const ScrollToTop = React.lazy(() => import('./components/ScrollToTop'));
const SocialFloatingButton = React.lazy(() => import('./components/SocialFloatingButton'));

// Lazy-loaded below-fold public sections
const Skills = React.lazy(() => import('./components/Skills'));
const Projects = React.lazy(() => import('./components/Projects'));
const Education = React.lazy(() => import('./components/Education'));
const Contact = React.lazy(() => import('./components/Contact'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));

// Aura CMS Admin pages
const AdminLogin = React.lazy(() => import('./pages/admin/Login'));
const DashboardLayout = React.lazy(() => import('./pages/admin/DashboardLayout'));
const ManageProjects = React.lazy(() => import('./pages/admin/ManageProjects'));
const ManageSkills = React.lazy(() => import('./pages/admin/ManageSkills'));
const ManageCertificates = React.lazy(() => import('./pages/admin/ManageCertificates'));
const ManageSettings = React.lazy(() => import('./pages/admin/ManageSettings'));
const ManageEducation = React.lazy(() => import('./pages/admin/ManageEducation'));

import LazySection from './components/LazySection';

// Shared loading fallback
const SectionLoader = () => (
  <div className="min-h-[40vh] w-full flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
  </div>
);

function Portfolio() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <GlobalBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <LazySection minHeight="600px">
          <Suspense fallback={<SectionLoader />}>
            <Skills />
          </Suspense>
        </LazySection>
        <LazySection minHeight="600px">
          <Suspense fallback={<SectionLoader />}>
            <Projects />
          </Suspense>
        </LazySection>
        <LazySection minHeight="500px">
          <Suspense fallback={<SectionLoader />}>
            <Education />
          </Suspense>
        </LazySection>
        <LazySection minHeight="500px">
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        </LazySection>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <ScrollToTop />
        <SocialFloatingButton />
        <ChatWidget />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<SectionLoader />}>
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<Portfolio />} />

        {/* Project Details Page */}
        <Route path="/projects/:id" element={<ProjectDetails />} />

        {/* Aura CMS Admin Authentication */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Redirect /admin to /admin/dashboard/projects */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard/projects" replace />} />

        {/* Aura CMS Protected Dashboard Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard/projects" replace />} />
          <Route path="projects" element={<ManageProjects />} />
          <Route path="skills" element={<ManageSkills />} />
          <Route path="certificates" element={<ManageCertificates />} />
          <Route path="education" element={<ManageEducation />} />
          <Route path="settings" element={<ManageSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;