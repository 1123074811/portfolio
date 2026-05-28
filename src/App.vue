<script setup>
import Navbar from './components/Navbar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectSection from './components/ProjectSection.vue'
import SkillsSection from './components/SkillsSection.vue'
import BlogSection from './components/BlogSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import ContactSection from './components/ContactSection.vue'
import Footer from './components/Footer.vue'
import ProjectDetailsPage from './components/ProjectDetailsPage.vue'
import { currentProject } from './data/locale'
</script>

<template>
  <div class="min-h-screen relative flex flex-col justify-between overflow-x-hidden bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
    
    <!-- Top Fixed Navigation -->
    <Navbar />

    <!-- Main Content Sections -->
    <main class="flex-1 w-full relative">
      
      <!-- Standalone Project Details Page View -->
      <ProjectDetailsPage v-if="currentProject" :project="currentProject" />

      <!-- Landing Page Multi-Section View -->
      <div v-else>
        <!-- Anchor references for global jump navigation -->
        <HeroSection id="hero" />
        
        <AboutSection id="about" />
        
        <ProjectSection id="projects" />
        
        <SkillsSection id="skills" />
        
        <BlogSection id="blog" />
        
        <ExperienceSection id="experience" />
        
        <ContactSection id="contact" />
      </div>
      
    </main>

    <!-- Bottom Page Footer -->
    <Footer />
    
  </div>
</template>

<style>
/* Global Custom Styles/Variables if needed */
body {
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
}
</style>
